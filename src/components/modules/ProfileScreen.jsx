import React from 'react';
import { useStore } from '../../store/useStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { User, Shield, CreditCard, LogOut, CheckCircle, Lock, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileScreen = () => {
    const { user, userScores, completedModules, isPremium, setPremium, logout, setStep } = useStore();

    const data = [
        { subject: 'Realistisch', A: userScores.R, fullMark: 20 },
        { subject: 'Intellectueel', A: userScores.I, fullMark: 20 },
        { subject: 'Artistiek', A: userScores.A, fullMark: 20 },
        { subject: 'Sociaal', A: userScores.S, fullMark: 20 },
        { subject: 'Ondernemend', A: userScores.E, fullMark: 20 },
        { subject: 'Conventioneel', A: userScores.C, fullMark: 20 },
    ];

    const getTraits = () => {
        // Simple logic to get top traits
        const scores = Object.entries(userScores).sort((a, b) => b[1] - a[1]);
        const topTraits = scores.slice(0, 3).map(([key]) => {
            const map = {
                R: 'Doener',
                I: 'Denker',
                A: 'Creatieveling',
                S: 'Helper',
                E: 'Ondernemer',
                C: 'Organisator'
            };
            return map[key];
        });
        return topTraits;
    };

    const modules = [
        { id: 'onboarding', label: 'Onboarding' },
        { id: 'swipes', label: 'Interesse Test (Swipes)' },
        { id: 'dilemmas', label: 'Dilemma Slider' },
        { id: 'values', label: 'Waarden Test (Premium)' },
        { id: 'bigfive', label: 'Persoonlijkheid (Big 5)' }
    ];

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Mijn Blauwdruk</h1>

            {/* Radar Chart Section */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm uppercase tracking-wider">Jouw DNA</h3>
                <div className="h-64 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                            <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Traits Tags */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {getTraits().map(trait => (
                        <span key={trait} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                            {trait}
                        </span>
                    ))}
                </div>
            </div>

            {/* Test History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Jouw Route</h3>
                <div className="space-y-3">
                    {modules.map(mod => {
                        // Very rough approximation of completion tracking as we don't strictly track all IDs yet
                        const isCompleted = completedModules.includes(mod.id) || (mod.id === 'onboarding') || (mod.id === 'swipes' && userScores.R > 0);
                        // Assuming completion if score exists for swipes, etc. 
                        // Real implementation would track IDs more strictly.

                        return (
                            <div key={mod.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{mod.label}</span>
                                {isCompleted ? (
                                    <CheckCircle size={18} className="text-green-500" />
                                ) : (
                                    <div className="bg-gray-100 p-1 rounded-full">
                                        <Lock size={14} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Settings / Account */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <User className="text-gray-500" size={20} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Gastgebruiker'}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {!isPremium && (
                    <button
                        onClick={() => setPremium(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left group"
                    >
                        <div className="flex items-center space-x-3">
                            <CreditCard className="text-blue-500 w-5 h-5" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">Upgrade naar Premium</span>
                                <span className="text-xs text-gray-500">Ontgrendel alle resultaten</span>
                            </div>
                        </div>
                        <span className="text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform">€2,99</span>
                    </button>
                )}

                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <Shield className="text-gray-400 w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700">Debug Premium</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isPremium} onChange={(e) => setPremium(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>


                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 transition-colors text-red-500 text-left"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Uitloggen</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;
