import React from 'react';
import { useStore } from '../../store/useStore';
import { LayoutDashboard, User, Search, Compass, Brain, Lock } from 'lucide-react';

const BottomNav = () => {
    const { currentStep, setStep, isPremium } = useStore();

    // Only show on Dashboard (4) and Account (5)
    if (currentStep < 4) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 pb-safe">
            <button
                onClick={() => setStep(4)}
                className={`flex flex-col items-center space-y-1 transition-colors ${currentStep === 4 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <LayoutDashboard size={24} />
                <span className="text-[10px] font-medium uppercase tracking-wide">Home</span>
            </button>

            <button
                onClick={() => setStep(6)}
                className={`flex flex-col items-center space-y-1 transition-colors ${currentStep === 6 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Search size={24} />
                <span className="text-[10px] font-medium uppercase tracking-wide">Matches</span>
            </button>

            <button
                onClick={() => setStep(8)}
                className={`flex flex-col items-center space-y-1 transition-colors relative ${currentStep === 8 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <div className="relative">
                    <Brain size={24} />
                    {!isPremium && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                            <Lock size={10} className="text-white" />
                        </div>
                    )}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wide">Test</span>
            </button>

            <button
                onClick={() => setStep(5)}
                className={`flex flex-col items-center space-y-1 transition-colors ${currentStep === 5 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <User size={24} />
                <span className="text-[10px] font-medium uppercase tracking-wide">Profiel</span>
            </button>
        </div>
    );
};

export default BottomNav;
