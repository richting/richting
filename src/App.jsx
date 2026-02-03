import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { loadUserData } from './utils/syncUserData';
import { useBrowserNavigation } from './hooks/useBrowserNavigation'; // Import hook
import Onboarding from './components/modules/Onboarding';
import VibeSwipe from './components/modules/VibeSwipe';
import DilemmaSlider from './components/modules/DilemmaSlider';
import AuthScreen from './components/modules/AuthScreen';

import HomeScreen from './components/modules/HomeScreen';
import MatchesScreen from './components/modules/MatchesScreen';
import ProfileScreen from './components/modules/ProfileScreen';
import DeepDiveScreen from './components/modules/DeepDiveScreen';
import TestHub from './components/modules/TestHub';
import PersonalityQuiz from './components/modules/PersonalityQuiz';
import CapabilitiesModule from './components/modules/CapabilitiesModule';
import WorkValuesDeepModule from './components/modules/WorkValuesDeepModule';
import PracticeValidationModule from './components/modules/PracticeValidationModule';
import CareerPracticeValidation from './components/modules/CareerPracticeValidation';
import PracticeValidationResults from './components/modules/PracticeValidationResults';
import ScreenFlowMap from './components/debug/ScreenFlowMap'; // DEV ONLY
// import ResultsDashboard from './components/modules/ResultsDashboard';
// import AccountScreen from './components/modules/AccountScreen';
import BottomNav from './components/modules/BottomNav';
import { Map } from 'lucide-react';
import './App.css';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { currentStep, user, login, setStep } = useStore();

  // Enable browser back/forward buttons
  useBrowserNavigation();

  // Check for existing auth session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // User is logged in, load their data
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const { data: userData, error: loadError } = await loadUserData(session.user.id);

          if (loadError) {
            console.error('CRITICAL: Failed to load user data', loadError);
            // TODO: Better UI for this, maybe a toast
            alert('Er is een fout opgetreden bij het laden van je gegevens. Controleer je internetverbinding en ververs de pagina. (Code: DB_LOAD_FAIL)');
            // Do NOT login with empty data to avoid overwriting
            return;
          }

          login({
            id: session.user.id,
            name: profile.name,
            email: profile.email,
            isPremium: profile.is_premium
          }, userData);

          // If user has progress, navigate to HomeScreen instead of staying on Onboarding
          // This happens when the page is refreshed or user returns to the app
          if (userData?.progress?.reliabilityScore > 0) {
            // Note: login() will set currentStep from userData.progress.currentStep
            // But if that's 0, we should go to 4 (HomeScreen)
            // The login action already handles this via loadedData.progress.currentStep
          }
        }
      } else {
        // No session - user is not logged in
        // Redirect to onboarding (step 0)
        setStep(0);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        // User signed out, handled by logout action
      }
    });

    return () => subscription.unsubscribe();
  }, [login, setStep]);

  // Prevent authenticated users from accessing onboarding screens (steps 0-2)
  useEffect(() => {
    if (user && currentStep >= 0 && currentStep <= 2) {
      // User is logged in but trying to access onboarding - redirect to home
      setStep(4);
    }
  }, [user, currentStep, setStep]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
        {currentStep === 0 && <Onboarding />}
        {currentStep === 1 && <VibeSwipe />}
        {currentStep === 2 && <DilemmaSlider />}
        {currentStep === 3 && <AuthScreen />}

        {currentStep === 4 && <HomeScreen />}
        {currentStep === 5 && <ProfileScreen />}
        {currentStep === 6 && <MatchesScreen />}
        {currentStep === 7 && <DeepDiveScreen />}
        {currentStep === 8 && <TestHub />}

        {/* Mission Modules */}
        {currentStep === 10 && <WorkValuesDeepModule />}
        {currentStep === 11 && <PracticeValidationModule />}
        {currentStep === 12 && <CareerPracticeValidation />}

        {/* Test Modules (Premium) */}
        {currentStep === 13 && <PersonalityQuiz />}
        {currentStep === 14 && <CapabilitiesModule />}
        {currentStep === 15 && <PracticeValidationResults />}



        {/* DEV ONLY: Screen Flow Map */}
        {currentStep === 99 && <ScreenFlowMap />}

        {/* DEV ONLY: Global Sitemap Access */}
        {import.meta.env.DEV && currentStep !== 99 && (
          <button
            onClick={() => setStep(99)}
            className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50 opacity-50 hover:opacity-100"
            title="Open Sitemap (Dev Only)"
          >
            <Map size={20} />
          </button>
        )}

        <BottomNav />
      </div>
    </ErrorBoundary>
  );
}

export default App;
