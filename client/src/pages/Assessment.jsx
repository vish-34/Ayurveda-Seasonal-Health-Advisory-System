import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Sparkles, Loader, ChevronRight, Check } from 'lucide-react';

const Assessment = () => {
  const navigate = useNavigate();
  const { user, updateDoshaProfile } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await API.get('/dosha/questions');
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please check server.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectOption = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);

    // Auto-advance with minor delay for visual feedback
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 250);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.length !== questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data } = await API.post('/dosha/assess', { answers });
      // Update the user profile locally
      updateDoshaProfile(data.doshaProfile);
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-white">
        <Loader className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-neutral-500 font-medium">Loading Assessment Questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <p className="text-red-500 font-semibold">{error || 'No questions available.'}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-brand-light/20 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header progress info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Dosha Prakriti Test</span>
            <h2 className="text-sm font-bold text-neutral-800">Question {currentIndex + 1} of {questions.length}</h2>
          </div>
          <span className="text-xs font-semibold text-neutral-500">{progressPercent}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-600 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all animate-fade-in min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-emerald-950 text-lg sm:text-xl leading-snug mb-8">
              {currentQuestion.text}
            </h3>

            {/* Options list */}
            <div className="space-y-4">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentIndex] === opt.value;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full text-left p-4.5 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm'
                        : 'border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/10 text-neutral-700'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <div
                      className={`h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 ml-4 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 border-t border-neutral-100 pt-6 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-3 border border-neutral-200 hover:border-neutral-300 disabled:opacity-40 disabled:hover:bg-transparent rounded-2xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={answers.length !== questions.length || submitting}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-100 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Submit and View Results</span>
                    <Sparkles className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={!answers[currentIndex]}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-45 text-neutral-700 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                <span>Next Question</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
