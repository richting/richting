import React from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Map, CheckCircle, Lock, Monitor, Shield, Zap } from 'lucide-react';

const ScreenFlowMap = () => {
    const { currentStep, setStep, reliabilityScore, completedModules, user } = useStore();

    // Define the flow of the application
    const flow = [
        {
            title: "Onboarding Flow",
            screens: [
                { id: 0, name: "Onboarding Intro", icon: <Monitor size={18} />, description: "Initial welcome screens" },
                { id: 1, name: "Vibe Swipe", icon: <Zap size={18} />, description: "Swipe for interests (RIASEC)" },
                { id: 2, name: "Dilemma Slider", icon: <Map size={18} />, description: "Work values trade-offs" },
                { id: 3, name: "Auth / Login", icon: <Shield size={18} />, description: "Account creation/login" },
            ]
        },
        {
            title: "Core App",
            screens: [
                { id: 4, name: "Home (Dashboard)", icon: <Monitor size={18} />, description: "Main hub" },
                { id: 6, name: "Matches", icon: <Zap size={18} />, description: "Career matches list" },
                { id: 7, name: "Deep Dive", icon: <Map size={18} />, description: "Job details & exploration" },
                { id: 8, name: "Test Hub", icon: <Lock size={18} />, description: "Premium tests landing" },
                { id: 5, name: "Profile", icon: <Shield size={18} />, description: "User stats & settings" },
            ]
        },
        {
            title: "Mission Modules",
            screens: [
                { id: 10, name: "Work Values Deep", icon: <Shield size={18} />, description: "Advanced values" },
                { id: 11, name: "Practice Validation", icon: <CheckCircle size={18} />, description: "Sector scenarios" },
                { id: 12, name: "Career Practice", icon: <Map size={18} />, description: "Real-world tasks" },
                { id: 15, name: "Validation Results", icon: <CheckCircle size={18} />, description: "Score adjustments" },
            ]
        },
        {
            title: "Premium Tests (via Test Hub)",
            screens: [
                { id: 13, name: "Personality Quiz", icon: <Map size={18} />, description: "Big Five assessment" },
                { id: 14, name: "Capabilities Quiz", icon: <Zap size={18} />, description: "Skills self-assessment" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStep(4)}
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

            <div className="space-y-12 max-w-4xl mx-auto">
                {flow.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 font-mono border-b border-gray-800 pb-2">
                            {section.title}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {section.screens.map((screen) => (
                                <button
                                    key={screen.id}
                                    onClick={() => setStep(screen.id)}
                                    className={`
                                        relative group flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200
                                        ${currentStep === screen.id
                                            ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                                        }
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg mb-3
                                        ${currentStep === screen.id ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/50 text-gray-400'}
                                    `}>
                                        {screen.icon}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-gray-500">ID: {screen.id}</span>
                                            {currentStep === screen.id && (
                                                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`font-bold text-sm ${currentStep === screen.id ? 'text-blue-200' : 'text-gray-200'}`}>
                                            {screen.name}
                                        </span>
                                        <span className="text-xs text-gray-500 line-clamp-2">
                                            {screen.description}
                                        </span>
                                    </div>

                                    {/* Connection Line (Visual Only) */}
                                    <div className="absolute top-1/2 -right-4 w-4 h-[2px] bg-gray-800 hidden md:block last:hidden group-last:hidden" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Debug State Panel */}
            <div className="fixed bottom-0 right-0 p-4 w-full md:w-80 bg-gray-800/90 backdrop-blur border-t border-gray-700 text-xs font-mono">
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

export default ScreenFlowMap;
