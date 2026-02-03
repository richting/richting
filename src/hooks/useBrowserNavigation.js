import { useEffect } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook to sync the global 'currentStep' store state with the browser's URL query parameter.
 * This enables the browser's Back/Forward buttons to navigate through the app's flow.
 */
export function useBrowserNavigation() {
    const { currentStep, setStep } = useStore();

    // 1. On mount: Check URL for ?step=X and set the store
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stepParam = params.get('step');

        if (stepParam !== null) {
            const stepNumber = parseInt(stepParam, 10);
            if (!isNaN(stepNumber) && stepNumber !== currentStep) {
                setStep(stepNumber);
            }
        } else {
            // If no step in URL, replace current URL with default step (0) or current step
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('step', currentStep.toString());
            window.history.replaceState({ step: currentStep }, '', newUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    // 2. Sync Store -> URL: When currentStep changes, push to history
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stepParam = params.get('step');
        const currentUrlStep = stepParam ? parseInt(stepParam, 10) : null;

        if (currentUrlStep !== currentStep) {
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('step', currentStep.toString());

            // Push new state to history so back button works
            window.history.pushState({ step: currentStep }, '', newUrl);
        }
    }, [currentStep]);

    // 3. Listen for PopState (Back/Forward button)
    useEffect(() => {
        const handlePopState = (event) => {
            // Create a URLSearchParams object from the window's current location
            const params = new URLSearchParams(window.location.search);
            const stepParam = params.get('step');

            if (stepParam !== null) {
                const stepNumber = parseInt(stepParam, 10);
                if (!isNaN(stepNumber)) {
                    // Update store WITHOUT pushing to history (since we're already there)
                    // We can't use setStep directly if it has side effects that might conflict, 
                    // but our setStep is safe.
                    // Note: we need a way to set store without triggering the "Sync Store -> URL" effect to push again
                    // However, our "Sync Store -> URL" check (currentUrlStep !== currentStep) helps.
                    // But when popstate happens, URL is ALREADY updated. 
                    // So we invoke setStep(stepNumber). 
                    // The "Sync Store -> URL" effect will run, check URL vs Store.
                    // Store will match URL (because we just set it), so it WON'T push.
                    setStep(stepNumber);
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [setStep]);
}
