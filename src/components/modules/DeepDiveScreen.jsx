import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { calculateSectorMatchesEnhanced } from '../../utils/matchingEngine';
import { ArrowLeft, Lock, Briefcase, TrendingUp, Users, CheckCircle2 } from 'lucide-react';


const DeepDiveScreen = () => {
    const {
        selectedSectorId,
        setStep,
        userScores,
        userValues,
        personalityVector,
        reliabilityScore,
        isPremium,
        setPremium,
        setSelectedCareerDirection,
        selfEfficacy
    } = useStore();

    const [sector, setSector] = useState(null);
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchSectorDetails = async () => {
            setLoading(true);
            try {
                // Fetch all sectors to calculate match score
                const { data: sectorsData, error: sectorsError } = await supabase.from('sectors').select('*');
                if (sectorsError) throw sectorsError;

                // Fetch ESCO occupations (replacing 'careers')
                // We only want mapped occupations (where riasec_vector is not null)
                const { data: escoData, error: escoError } = await supabase
                    .from('esco_occupations')
                    .select('*')
                    .not('riasec_vector', 'is', null)
                    .limit(1000);

                if (escoError) throw escoError;

                const mappedCareers = (escoData || []).map(job => ({
                    ...job,
                    title: job.title_nl,
                    description: job.description_nl,
                }));

                const results = await calculateSectorMatchesEnhanced(
                    userScores,
                    userValues,
                    sectorsData || [],
                    mappedCareers,
                    personalityVector,
                    reliabilityScore,
                    selfEfficacy
                );

                let targetSector = null;
                if (selectedSectorId) {
                    targetSector = results.find(s => s.id === selectedSectorId);
                }

                // Fallback to #1 match if no specific sector selected
                if (!targetSector && results.length > 0) {
                    targetSector = results[0];
                }

                setSector(targetSector);

                // Fetch careers within this sector
                if (targetSector) {
                    const { data: careersData, error: careersError } = await supabase
                        .from('esco_occupations')
                        .select('*')
                        .eq('sector_id', targetSector.id)
                        .limit(20);

                    if (careersError) throw careersError;

                    // Map for display
                    const displayCareers = (careersData || []).map(job => ({
                        ...job,
                        title: job.title_nl,
                        education_level: 'MBO/HBO/WO' // Placeholder as ESCO doesn't provided this directly yet
                    }));

                    setCareers(displayCareers);
                }

            } catch (error) {
                console.error('Error fetching sector details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSectorDetails();
        fetchSectorDetails();
    }, [selectedSectorId, userScores, userValues, personalityVector, reliabilityScore, selfEfficacy]);



    if (loading) {
        return <div className="p-8 text-center text-gray-500">Laden...</div>;
    }

    if (!sector) {
        return (
            <div className="p-8 text-center text-gray-500">
                Geen sector gevonden.
                <button onClick={() => setStep(8)} className="block mx-auto mt-4 text-blue-600 font-bold">Terug naar Matches</button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24 relative">
            {/* Sticky Back Button */}
            <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm py-2 mb-4 flex items-center justify-between">
                <button
                    onClick={() => setStep(8)}
                    className="flex items-center text-gray-600 hover:text-blue-600 font-medium"
                >
                    <ArrowLeft size={20} className="mr-1" />
                    Terug
                </button>

            </div>

            {/* Header Image/Icon */}
            <div className={`h-40 rounded-2xl bg-gradient-to-br ${sector.color_gradient} flex items-center justify-center mb-6 shadow-sm`}>
                <div className="text-7xl filter drop-shadow-md">
                    {sector.icon_emoji}
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{sector.name_nl}</h1>
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(sector.matchScore * 100)}% Match
                </div>
                <span className="text-gray-500 text-sm">{sector.name_en}</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {sector.description}
            </p>

            {/* Why this sector fits you */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-200 p-2 rounded-lg">
                        <TrendingUp className="text-blue-700" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Waarom deze sector bij jou past</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">RIASEC match: {Math.round(sector.riasecMatch * 100)}%</span> - Jouw interesses passen goed bij deze sector
                        </p>
                    </div>
                    {sector.personalityMatch > 0 && (
                        <div className="flex items-start gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Persoonlijkheid match: {Math.round(sector.personalityMatch * 100)}%</span> - Je persoonlijkheid past bij dit werk
                            </p>
                        </div>
                    )}
                    {sector.valueMatch > 0 && (
                        <div className="flex items-start gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Waarden match: {Math.round(sector.valueMatch * 100)}%</span> - Je werkwaarden komen overeen
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Practice Validation Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-100 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-200 p-2 rounded-lg">
                        <CheckCircle2 className="text-green-700" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Test je fit met praktijkscenario's</h3>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                    Ontdek hoe je zou reageren in echte situaties binnen {sector.name_nl} door praktijkscenario's te doorlopen.
                </p>

                <button
                    onClick={() => {
                        setSelectedCareerDirection({
                            direction: sector.name_nl,
                            name: sector.name_nl,
                            returnStep: 7 // Return to Deep Dive
                        });
                        setStep(12); // Go to CareerPracticeValidation
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    <CheckCircle2 size={20} />
                    Start Praktijk-validatie
                </button>
            </div>

            {/* Careers in this sector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <Briefcase className="text-purple-600" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Beroepen in deze sector</h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Ontdek {careers.length} verschillende beroepen binnen {sector.name_nl}
                </p>

                {/* Careers List */}
                <div className="space-y-3 relative">
                    {careers.map((career, idx) => (
                        <div
                            key={idx}
                            // onClick={handleCareerClick} // Removed handler
                            className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100 hover:border-purple-300 transition-all cursor-pointer"
                        >
                            <span className="font-bold text-purple-800 text-sm bg-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm flex-shrink-0">
                                {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <span className="text-purple-900 font-medium text-sm block truncate">{career.title}</span>
                                <span className="text-xs text-purple-600">{career.education_level || 'MBO/HBO/WO'}</span>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>


        </div>
    );
};

export default DeepDiveScreen;
