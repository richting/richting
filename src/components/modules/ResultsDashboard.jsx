import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { calculateSectorMatchesEnhanced, getVisibleMatches } from '../../utils/matchingEngine';
import { supabase } from '../../lib/supabase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import ProgressCircle from './ProgressCircle';
import DailyBooster from './DailyBooster';
import UnlockModal from './UnlockModal';

const ResultsDashboard = () => {
    const { userScores, userValues, personalityVector, reset, isPremium, setPremium, user, reliabilityScore, setStep, setSelectedCareerDirection } = useStore();
    const [matches, setMatches] = useState([]);
    const [visibleMatches, setVisibleMatches] = useState([]);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [sectorsData, setSectorsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSectorsAndCareers = async () => {
            try {
                const { data: sectorsData, error: sectorsError } = await supabase.from('sectors').select('*');
                if (sectorsError) throw sectorsError;

                const { data: careersData, error: careersError } = await supabase.from('careers').select('*');
                if (careersError) throw careersError;

                setSectorsData(sectorsData || []);

                // Use enhanced matching
                const results = await calculateSectorMatchesEnhanced(
                    userScores,
                    userValues,
                    sectorsData || [],
                    careersData || [],
                    personalityVector,
                    reliabilityScore
                );
                setMatches(results);

                const visible = getVisibleMatches(results, reliabilityScore, isPremium);
                setVisibleMatches(visible);
            } catch (error) {
                console.error('Error fetching sectors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSectorsAndCareers();
    }, [userScores, userValues, personalityVector, reliabilityScore, isPremium]);

    const data = [
        { subject: 'Realistisch', A: userScores.R, fullMark: 20 },
        { subject: 'Intellectueel', A: userScores.I, fullMark: 20 },
        { subject: 'Artistiek', A: userScores.A, fullMark: 20 },
        { subject: 'Sociaal', A: userScores.S, fullMark: 20 },
        { subject: 'Ondernemend', A: userScores.E, fullMark: 20 },
        { subject: 'Conventioneel', A: userScores.C, fullMark: 20 },
    ];

    const handleUpgrade = () => {
        setPremium(true);
        setShowUnlockModal(false);
    };

    const handleLockedClick = () => {
        setShowUnlockModal(true);
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Hi {user?.name?.split(' ')[0] || 'User'},<br />
                        <span className="text-xl font-normal text-gray-600">Dit is jouw richting</span>
                    </h2>

                    {/* Progress Circle */}
                    <div className="mb-8">
                        <ProgressCircle score={reliabilityScore} size={220} strokeWidth={14} />
                    </div>

                    {/* Daily Booster */}
                    {reliabilityScore >= 30 && reliabilityScore < 100 && (
                        <div className="mb-8">
                            <DailyBooster />
                        </div>
                    )}

                    {/* RIASEC Chart */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg mb-8">
                        <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm uppercase tracking-wider">Jouw DNA</h3>
                        <div className="h-64 -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                    <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Matches */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-xl">Jouw Top Matches</h3>
                            {!isPremium && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Gratis Versie</span>
                            )}
                        </div>

                        {/* Show visible matches */}
                        {visibleMatches.map((match, index) => (
                            <div key={match.name_nl} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                                {/* Gradient Header with Icon */}
                                <div className={`h-24 w-full bg-gradient-to-br ${match.color_gradient} flex items-center justify-center text-5xl`}>
                                    {match.icon_emoji}
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{match.name_nl}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {match.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end ml-4">
                                            <span className="text-lg font-bold text-blue-600">
                                                {Math.round(match.matchScore * 100)}%
                                            </span>
                                            <span className="text-xs text-gray-400">match</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        <p className="text-sm text-gray-600 font-medium mb-2">Werkwaarden:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {match.work_values && match.work_values.map(value => (
                                                <span key={value} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Practice Validation Button */}
                                    <button
                                        onClick={() => {
                                            setSelectedCareerDirection({
                                                direction: match.name_nl, // Using sector name as direction
                                                name: match.name_nl,
                                                returnStep: 5 // Return to Results/Profile screen
                                            });
                                            setStep(12); // Go to CareerPracticeValidation
                                        }}
                                        className="mt-4 w-full bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} />
                                        Praktijk-validatie
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Locked matches (show blurred preview) */}
                        {!isPremium && matches.slice(visibleMatches.length, 3).map((match, index) => (
                            <div
                                key={match.title}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative cursor-pointer"
                                onClick={handleLockedClick}
                            >
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
                                    <div className="bg-gray-900 text-white p-3 rounded-full mb-3 shadow-lg">
                                        <Lock size={20} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">Ontgrendel je volledige profiel</h4>
                                    <p className="text-xs text-gray-600 mb-4 px-4">Zie al je matches, studies en de verdiepende analyse.</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLockedClick();
                                        }}
                                        className="bg-blue-600 text-white text-sm font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition"
                                    >
                                        Bekijk alles (€2,99)
                                    </button>
                                </div>

                                {/* Blurred content */}
                                <div className="blur-sm pointer-events-none">
                                    <div className={`h-24 w-full bg-gradient-to-br ${match.color_gradient} flex items-center justify-center text-5xl`}>
                                        {match.icon_emoji}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">{match.name_nl}</h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {match.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end ml-4">
                                                <span className="text-lg font-bold text-blue-600">
                                                    {Math.round(match.matchScore * 100)}%
                                                </span>
                                                <span className="text-xs text-gray-400">match</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={reset}
                            className="text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
                        >
                            Opnieuw beginnen
                        </button>
                    </div>

                    {/* Unlock Modal */}
                    <UnlockModal
                        isOpen={showUnlockModal}
                        onClose={() => setShowUnlockModal(false)}
                        onUpgrade={handleUpgrade}
                    />
                </>
            )}
        </div>
    );
};

export default ResultsDashboard;

