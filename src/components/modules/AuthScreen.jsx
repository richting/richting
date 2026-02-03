import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { initializeUserData, loadUserData, saveUserScores, saveUserValues, saveUserProgress, savePersonalityVector } from '../../utils/syncUserData';

const AuthScreen = () => {
    const { login, nextStep, isLoginMode, setLoginMode } = useStore();
    const [isLogin, setIsLogin] = useState(isLoginMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // LOGIN FLOW
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password
                });

                if (authError) throw authError;

                // Load user profile
                let { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', authData.user.id)
                    .single();

                // If profile is missing (e.g. from previous RLS error), try to create it
                if (profileError && profileError.code === 'PGRST116') {
                    console.log('Profile missing, creating fallback profile...');

                    const { error: createError } = await supabase
                        .from('user_profiles')
                        .insert({
                            id: authData.user.id,
                            email: formData.email,
                            name: formData.name || authData.user.user_metadata?.name || 'Gebruiker',
                            is_premium: false
                        });

                    if (createError) throw createError;

                    // Fetch again
                    const { data: newProfile, error: newProfileError } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (newProfileError) throw newProfileError;
                    profile = newProfile;
                } else if (profileError) {
                    throw profileError;
                }

                // Load user data from database
                const { data: userData, error: loadError } = await loadUserData(authData.user.id);

                if (loadError) {
                    throw new Error('Kon gebruikersgegevens niet laden: ' + loadError.message);
                }

                // Update Zustand store with loaded data
                login({
                    id: authData.user.id,
                    name: profile.name,
                    email: profile.email,
                    isPremium: profile.is_premium
                }, userData);

                // If user has existing progress, go directly to HomeScreen
                // Otherwise, continue with the normal flow (nextStep)
                if (userData?.progress && (userData.progress.reliabilityScore > 0 || userData.progress.currentStep >= 4)) {
                    // User has completed onboarding before, go to their saved step or HomeScreen
                    // The login() already set currentStep from userData, so we're done
                } else {
                    nextStep();
                }
            } else {
                // SIGNUP FLOW
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            name: formData.name
                        }
                    }
                });

                if (authError) throw authError;

                if (!authData.user) {
                    throw new Error('Signup failed - no user returned');
                }

                // Wait a moment for the trigger to create the profile
                await new Promise(resolve => setTimeout(resolve, 500));

                // Fetch the auto-created profile
                const { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) {
                    console.error('Profile fetch error:', profileError);
                    // Profile might not exist yet, use form data as fallback
                }

                // Check if we have local guest data to persist
                const currentStore = useStore.getState();
                const hasGuestData = currentStore.userScores.R > 0 || currentStore.userScores.I > 0 || // Has scores
                    currentStore.reliabilityScore > 0 || // Has progress
                    currentStore.currentStep > 0;

                if (hasGuestData) {
                    console.log('Persisting guest data to new account...');
                    await Promise.all([
                        saveUserScores(authData.user.id, currentStore.userScores),
                        saveUserValues(authData.user.id, currentStore.userValues),
                        saveUserProgress(authData.user.id, {
                            reliabilityScore: currentStore.reliabilityScore,
                            completedModules: currentStore.completedModules,
                            currentStep: currentStore.currentStep,
                            dailySwipes: currentStore.dailySwipes,
                            lastSwipeDate: currentStore.lastSwipeDate
                        }),
                        savePersonalityVector(authData.user.id, currentStore.personalityVector)
                    ]);
                } else {
                    // No guest data, initialize with defaults
                    await initializeUserData(authData.user.id);
                }

                // Log the user in - allow the store to load what we just saved (or defaults)
                // We re-fetch to ensure the store strictly matches the DB state
                const { data: userData, error: loadError } = await loadUserData(authData.user.id);

                if (loadError) {
                    // Start fresh if load fails, but warn
                    console.error('Error loading new profile:', loadError);
                }

                login({
                    id: authData.user.id,
                    name: profile?.name || formData.name,
                    email: formData.email,
                    isPremium: profile?.is_premium || false
                }, userData); // userData will contain the guest data we just saved!

                nextStep();
            }
        } catch (err) {
            console.error('Auth error:', err);

            // Check for duplicate user error
            if (err.message && (err.message.includes('User already registered') || err.message.includes('already registered'))) {
                setError('Dit account bestaat al. Je wordt doorgestuurd naar inloggen...');

                // Switch to login mode after 2 seconds
                setTimeout(() => {
                    setIsLogin(true);
                    setError(null);
                    setFormData(prev => ({ ...prev, password: '' })); // Clear password for security
                }, 2000);
            } else if (err.message && (err.message.includes('security purposes') || err.message.includes('seconds'))) {
                setError('Je probeert het te vaak. Wacht even een minuutje voordat je het opnieuw probeert.');
            } else if (err.message && err.message.includes('email rate limit exceeded')) {
                setError('Te veel pogingen vanaf dit adres. Wacht even een uur voordat je het opnieuw probeert.');
            } else {
                setError(err.message || 'Er ging iets mis. Probeer het opnieuw.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Welkom terug!' : 'Bijna daar!'}
                    </h2>
                    <p className="text-gray-500">
                        {isLogin
                            ? 'Log in om je resultaten te bekijken.'
                            : 'Maak een account aan om je profiel te zien.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Jouw naam"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Email adres"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Wachtwoord"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center group"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                                {isLogin ? 'Inloggen...' : 'Account aanmaken...'}
                            </>
                        ) : (
                            <>
                                {isLogin ? 'Inloggen' : 'Account aanmaken'}
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        {isLogin
                            ? 'Nog geen account? Registreer hier'
                            : 'Al een account? Log in'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthScreen;
