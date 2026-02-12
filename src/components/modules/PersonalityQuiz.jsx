import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { assessmentService } from '../../services/assessmentService';
import Scout from '../ui/Scout';
import { useScout } from '../../hooks/useScout';
import { scoutMessages } from '../../utils/scoutMessages';
import LikertScale from '../assessments/LikertScale';
import ProgressBar from '../assessments/ProgressBar';

const PersonalityQuiz = ({ isStandalone = false }) => {
    const { setStep, user } = useStore();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: value }
    const { say, celebrate } = useScout();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await assessmentService.getQuestions('big5');
                // Transform to match expected format if needed, but data from DB should be fine
                // DB has: id, question_text, metadata: { reverse: bool, category: string }
                // We map category to dimension
                const formatted = data.map(q => ({
                    id: q.id,
                    text: q.question_text,
                    dimension: q.category?.toLowerCase() || 'unknown',
                    isReverse: q.metadata?.reverse || false
                }));
                setQuestions(formatted);

                // Welcome message
                say(scoutMessages.bigFive.start, 'happy');
            } catch (error) {
                console.error("Failed to load Big5 questions", error);
                say("Oeps, ik kan de vragen niet laden! 🙈", 'neutral');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [say]);

    const currentQuestion = questions[currentQuestionIndex];

    // Handle Answer Selection
    const handleAnswer = (value) => {
        // Save answer locally
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

        // Scout Feedback intervals
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex === 5) {
            say(scoutMessages.bigFive.question_5, 'thinking');
        } else if (nextIndex === 10) {
            say(scoutMessages.bigFive.question_10, 'encouraging');
        } else if (nextIndex === 15) {
            say(scoutMessages.bigFive.question_15, 'happy');
        } else if (nextIndex === 20) {
            say(scoutMessages.bigFive.question_20, 'thinking');
        }

        // Next Question or Finish
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 300); // Short delay for visual feedback
        } else {
            finishQuiz({ ...answers, [currentQuestion.id]: value });
        }
    };

    const finishQuiz = async (finalAnswers) => {
        // Calculate Scores
        const scores = {
            openness: 0,
            conscientiousness: 0,
            extraversion: 0,
            agreeableness: 0,
            stability: 0
        };

        questions.forEach(q => {
            const val = finalAnswers[q.id];
            const score = q.isReverse ? (6 - val) : val;
            if (scores[q.dimension] !== undefined) {
                scores[q.dimension] += score;
            }
        });

        // Normalize to -10 to +10 range
        // Raw range per dimension (5 questions): 5 to 25. Midpoint 15.
        // Result = Raw - 15.
        const normalizedScores = {};
        Object.keys(scores).forEach(key => {
            normalizedScores[key] = scores[key] - 15;
            // Bound check
            if (normalizedScores[key] > 10) normalizedScores[key] = 10;
            if (normalizedScores[key] < -10) normalizedScores[key] = -10;
        });

        // Save to DB via service
        if (user?.id) {
            try {
                await assessmentService.completeBigFive(user.id, normalizedScores);
            } catch (err) {
                console.error("Failed to save Big Five results", err);
            }
        }

        celebrate(scoutMessages.bigFive.complete);

        setTimeout(() => {
            setStep(isStandalone ? 9 : 3); // Next Step: Work Values OR Hub
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
                <p className="text-gray-500">Vragen laden...</p>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="flex flex-col h-[85vh] w-full max-w-md mx-auto px-4 py-6 relative">

            {/* Scout Mascot */}
            <Scout />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-xl">
                        <Brain className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Persoonlijkheid</h1>
                        <p className="text-sm text-gray-500">Vraag {currentQuestionIndex + 1} van {questions.length}</p>
                    </div>
                </div>

                <ProgressBar
                    progress={currentQuestionIndex}
                    total={questions.length}
                    current={currentQuestionIndex + 1}
                    label="Voortgang"
                />
            </div>

            {/* Question Card */}
            <div className="flex-1 flex flex-col justify-center mb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 min-h-[200px] flex items-center justify-center text-center"
                    >
                        <h2 className="text-xl font-medium text-gray-800 leading-relaxed">
                            "{currentQuestion.text}"
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Interactive Scale */}
            <div className="mt-auto mb-12">
                <LikertScale
                    value={answers[currentQuestion.id]}
                    onChange={handleAnswer}
                    labels={['Helemaal Oneens', 'Helemaal Eens']}
                />
                <div className="text-center text-xs text-gray-400 mt-2">
                    Kies wat het beste bij jou past
                </div>
            </div>

            {/* Scout Avatar */}

        </div>
    );
};

export default PersonalityQuiz;
