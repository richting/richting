import React from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Map, CheckCircle, Lock, Monitor, Shield, Zap, Briefcase, Settings, AlertTriangle, Ghost } from 'lucide-react';

const ScreenFlowMap = () => {
    const { currentStep, setStep, reliabilityScore, completedModules, user } = useStore();

    // Define the granular flow of the application based on App.jsx
    const flow = [
        {
            title: "Onboarding Flow (Linear)",
            screens: [
                { id: 0, name: "Onboarding", icon: <Monitor size={18} />, description: "Intro & Roadmap", reachable: true },
                { id: 1, name: "Vibe Swipe", icon: <Zap size={18} />, description: "Interest Assessment (RIASEC)", reachable: true },
                { id: 2, name: "Personality Quiz", icon: <BrainIcon size={18} />, description: "Big Five Traits", reachable: true },
                { id: 3, name: "Work Values Deep", icon: <Briefcase size={18} />, description: "Advanced Values", reachable: true },
                { id: 4, name: "SCCT Scanner", icon: <ScanIcon size={18} />, description: "Self-Efficacy", reachable: true },
                { id: 5, name: "Auth / Login", icon: <Shield size={18} />, description: "Account Creation", reachable: true },
            ]
        },
        {
            title: "Core App (Authenticated)",
            screens: [
                { id: 6, name: "Home Dashboard", icon: <Monitor size={18} />, description: "Main Hub", reachable: true },
                { id: 7, name: "Profile Screen", icon: <Shield size={18} />, description: "User Stats & Progress", reachable: true },
                { id: 8, name: "Matches Screen", icon: <Zap size={18} />, description: "Job/Sector Matches", reachable: true },
                { id: 9, name: "Deep Dive", icon: <Map size={18} />, description: "Detailed View", reachable: true },
                { id: 10, name: "Test Hub", icon: <Lock size={18} />, description: "Premium Tests Overview", reachable: true },
            ]
        },
        {
            title: "Test Hub Modules (Standalone)",
            screens: [
                { id: 13, name: "Work Values (Standalone)", icon: <Briefcase size={18} />, description: "Re-take Values", reachable: true },
                { id: 14, name: "Personality (Standalone)", icon: <BrainIcon size={18} />, description: "Re-take Personality", reachable: true },
                { id: 15, name: "Capabilities Module", icon: <Zap size={18} />, description: "Skills Assessment", reachable: true },
                { id: 16, name: "Practice Results", icon: <CheckCircle size={18} />, description: "Validation Outcomes", reachable: true },
                { id: 18, name: "SCCT (Standalone)", icon: <ScanIcon size={18} />, description: "Re-take SCCT", reachable: true },
            ]
        },
        {
            title: "Hidden / Unreachable / WIP",
            screens: [
                { id: 11, name: "Practice Validation", icon: <Ghost size={18} />, description: "Sector Scenarios (Unreachable)", reachable: false },
                { id: 12, name: "Career Practice", icon: <Ghost size={18} />, description: "Real-world Tasks (Unreachable)", reachable: false },
                { id: 17, name: "Daily Booster", icon: <Ghost size={18} />, description: "Daily Tasks (Unreachable)", reachable: false },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStep(6)}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold font-mono text-green-400">DEV_MODE :: SITEMAP</h1>
                        <p className="text-xs text-gray-500 font-mono">Current Step: {currentStep}</p>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono text-gray-400">Reliability: {reliabilityScore}%</div>
                    <div className="text-xs font-mono text-gray-400">Modules: {completedModules.length}</div>
                </div>
            </header>

            <div className="space-y-12 max-w-6xl mx-auto">
                {flow.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 font-mono border-b border-gray-800 pb-2">
                            {section.title}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {section.screens.map((screen, sIdx) => (
                                <button
                                    key={`${screen.id}-${sIdx}`}
                                    onClick={() => setStep(screen.id)}
                                    className={`
                                        relative group flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200
                                        ${currentStep === screen.id
                                            ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                            : !screen.reachable
                                                ? 'bg-red-900/10 border-red-900/30 opacity-75 hover:opacity-100 hover:bg-red-900/20'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                                        }
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg mb-3 flex items-center justify-between w-full
                                        ${currentStep === screen.id
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : !screen.reachable
                                                ? 'bg-red-500/10 text-red-500'
                                                : 'bg-gray-700/50 text-gray-400'
                                        }
                                    `}>
                                        {screen.icon}
                                        {!screen.reachable && <AlertTriangle size={14} className="text-red-500" />}
                                    </div>

                                    <div className="space-y-1 w-full">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-xs text-gray-500">ID: {screen.id}</span>
                                            {currentStep === screen.id && (
                                                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`font-bold text-sm block truncate ${currentStep === screen.id ? 'text-blue-200' : !screen.reachable ? 'text-red-300' : 'text-gray-200'}`}>
                                            {screen.name}
                                        </span>
                                        <span className="text-xs text-gray-500 line-clamp-2 min-h-[2.5em]">
                                            {screen.description}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Debug State Panel */}
            <div className="fixed bottom-0 right-0 p-4 w-full md:w-80 bg-gray-800/90 backdrop-blur border-t border-gray-700 text-xs font-mono z-50">
                <h3 className="text-gray-400 mb-2 uppercase">Current State</h3>
                <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <div>User: <span className="text-white">{user ? 'Logged In' : 'Guest'}</span></div>
                    <div>Premium: <span className={user?.isPremium ? 'text-green-400' : 'text-red-400'}>{String(!!user?.isPremium)}</span></div>
                    <div className="col-span-2 truncate">Score: {reliabilityScore}%</div>
                </div>
            </div>
        </div>
    );
};

// Simple icon placeholders if strict Lucide import is an issue, but we imported them.
// Need to ensure all icons used are actually imported.
// BrainIcon and ScanIcon were used but not imported in previous internal thought, fixing imports now.

const BrainIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
)

const ScanIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
)

export default ScreenFlowMap;
