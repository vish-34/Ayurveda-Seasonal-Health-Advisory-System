import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSeason } from '../context/SeasonContext';
import API from '../services/api';
import WaterTracker from '../components/WaterTracker';
import { Leaf, Calendar, Award, Sparkles, RefreshCw, BookOpen, ChevronRight, Loader, Compass } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentSeason, 
    seasonInfo, 
    overrideSeason, 
    resetSeason, 
    allSeasons, 
    isOverridden, 
    seasonDetails 
  } = useSeason();

  const [advisories, setAdvisories] = useState(null);
  const [activeTab, setActiveTab] = useState('Diet');
  const [spotlightHerb, setSpotlightHerb] = useState(null);
  const [loadingAdvisories, setLoadingAdvisories] = useState(false);
  const [error, setError] = useState('');

  // Fetch current seasonal advisories
  useEffect(() => {
    const fetchAdvisories = async () => {
      if (!user || !user.doshaProfile?.dominantDosha) return;
      setLoadingAdvisories(true);
      setError('');
      try {
        const { data } = await API.get(`/advisory/current?season=${currentSeason}`);
        setAdvisories(data.advisories);
      } catch (err) {
        console.error('Error fetching advisories:', err);
        setError('Failed to fetch seasonal recommendations.');
      } finally {
        setLoadingAdvisories(false);
      }
    };

    fetchAdvisories();
  }, [user, currentSeason]);

  // Fetch seasonal herb spotlight
  useEffect(() => {
    const fetchSpotlightHerb = async () => {
      try {
        const { data } = await API.get(`/herbs?season=${currentSeason}`);
        if (data.length > 0) {
          // Select first matching or a random one
          setSpotlightHerb(data[0]);
        } else {
          // Fallback to fetch all herbs if none matched
          const res = await API.get('/herbs');
          if (res.data.length > 0) {
            setSpotlightHerb(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Error spotlighting herb:', err);
      }
    };
    fetchSpotlightHerb();
  }, [currentSeason]);

  // If user is not assessed yet, display assessment callout
  const needsAssessment = !user?.doshaProfile?.dominantDosha;

  const tabs = ['Diet', 'Herbs', 'Yoga', 'Daily Routine', 'Precautions'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. GREETING & SEASON BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Welcome greeting */}
        <div className="lg:col-span-2 bg-emerald-950 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
            <Leaf className="h-44 w-44 fill-white" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-800/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ayurvedic Wellness Platform</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-white">
              Namaste, {user?.name || 'User'}
            </h1>
            <p className="text-sm text-emerald-200/90 mt-2 leading-relaxed max-w-lg">
              Welcome back to your personalized dinacharya advisor. The elements in nature are shifting; let's keep your biological clock in absolute harmony.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 border-t border-emerald-800/50 pt-4 mt-6">
            <Calendar className="h-4 w-4" />
            <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Current Season Info Card */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between shadow-sm relative ${seasonInfo.colorClass}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/60 px-2 py-0.5 rounded-full border border-current">
                Active Season (Ritu)
              </span>
              <span className="font-serif italic text-lg">{seasonInfo.sanskrit}</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold tracking-tight mb-1">{currentSeason}</h2>
            <p className="text-xs font-semibold mb-3">{seasonInfo.english} ({seasonInfo.months})</p>
            <p className="text-xs leading-relaxed opacity-90">{seasonInfo.description}</p>
          </div>

          {/* Season Switcher Override (Extremely friendly for college reviews!) */}
          <div className="border-t border-neutral-200/40 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Demo Season Override:</span>
              {isOverridden && (
                <button 
                  onClick={resetSeason} 
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {allSeasons.map((season) => (
                <button
                  key={season}
                  onClick={() => overrideSeason(season)}
                  className={`text-[9px] font-bold py-1 px-1 rounded-md text-center border transition-all cursor-pointer ${
                    currentSeason === season
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-white/80 border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. ASSESSMENT CALLOUT / CONSTITUTION ANALYSIS */}
      {needsAssessment ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center mb-8 shadow-sm">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-display font-bold text-emerald-950">Discover Your Ayurvedic Constitution</h2>
          <p className="text-sm text-neutral-600 max-w-xl mx-auto mt-2 leading-relaxed">
            You haven't completed the Dosha Prakriti assessment yet. Take a short 10-question quiz to identify your biological composition and unlock personalized wellness advisories.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-50 hover:translate-y-[-1px] cursor-pointer"
          >
            <span>Start Dosha Assessment</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Dosha Breakdown Card */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-neutral-800 text-sm">Your Prakriti</h3>
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Dosha Constitution</p>
                  </div>
                </div>
                <Link
                  to="/assessment"
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  <span>Retake</span>
                </Link>
              </div>

              <div className="my-6">
                <p className="text-xs text-neutral-500 font-semibold mb-1">Dominant Constitution:</p>
                <span className="text-2xl font-display font-extrabold text-emerald-950">
                  {user.doshaProfile.dominantDosha}-Dominant
                </span>
                <p className="text-[10px] text-neutral-400 font-semibold uppercase mt-1">
                  Last assessed: {new Date(user.doshaProfile.assessedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Custom CSS Bar Chart for Dosha Composition */}
              <div className="space-y-4">
                {/* Vata Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1">
                    <span>Vata (Air & Ether)</span>
                    <span>{user.doshaProfile.vataScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${user.doshaProfile.vataScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pitta Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1">
                    <span>Pitta (Fire & Water)</span>
                    <span>{user.doshaProfile.pittaScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${user.doshaProfile.pittaScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Kapha Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1">
                    <span>Kapha (Water & Earth)</span>
                    <span>{user.doshaProfile.kaphaScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${user.doshaProfile.kaphaScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-4 mt-6">
              <p className="text-[11px] text-neutral-400 italic">
                Your constitution describes your body's physical and mental tendencies. Eat warm foods for Vata, cooling for Pitta, and dry-light for Kapha.
              </p>
            </div>
          </div>

          {/* 3. DYNAMIC ADVISORY CONDUIT (Diet, Herbs, Yoga, Daily Routine, Precautions) */}
          <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Category tabs */}
              <div className="flex border-b border-neutral-100 overflow-x-auto pb-px gap-4 select-none scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-semibold pb-3 px-1 border-b-2 transition-all cursor-pointer shrink-0 ${
                      activeTab === tab
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab advisory contents */}
              <div className="py-6 min-h-[220px]">
                {loadingAdvisories ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader className="h-8 w-8 text-emerald-600 animate-spin mb-2" />
                    <p className="text-xs text-neutral-400">Loading seasonal advice...</p>
                  </div>
                ) : error ? (
                  <p className="text-red-500 text-sm font-semibold">{error}</p>
                ) : advisories && advisories[activeTab] ? (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-bold text-neutral-800 text-base">
                        {advisories[activeTab].title}
                      </h4>
                      <div className="flex gap-1.5">
                        {advisories[activeTab].tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {advisories[activeTab].content.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-600 leading-relaxed">
                          <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Leaf className="h-3 w-3 fill-emerald-600" />
                          </div>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-400">
                    <p className="text-sm font-medium">No advice published for {activeTab} in this season.</p>
                    <p className="text-xs mt-1">Please configure this advisory in the Admin Panel.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-xs text-neutral-400">
              <span>Advice is matched for <strong>{user.doshaProfile.dominantDosha}</strong> in <strong>{currentSeason}</strong></span>
              <Link to="/articles" className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 cursor-pointer">
                <span>Read Articles</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. LOWER CONTAINER: WATER LOG & HERB SPOTLIGHT & ARTICLES */}
      {!needsAssessment && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Water widget */}
          <div>
            <WaterTracker />
          </div>

          {/* Herb Spotlight Card */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-neutral-800 text-sm">Herb Spotlight</h3>
                  <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Seasonal Remedy</p>
                </div>
              </div>

              {spotlightHerb ? (
                <div className="animate-fade-in">
                  <h4 className="font-display font-extrabold text-emerald-950 text-lg mb-1">{spotlightHerb.name}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-4">
                    {spotlightHerb.description}
                  </p>
                  
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3">
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Key Benefit</span>
                    <p className="text-xs text-emerald-900/90 font-medium line-clamp-2">
                      {spotlightHerb.benefits[0]}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-neutral-400 py-6">No spotlight herb loaded.</p>
              )}
            </div>

            {spotlightHerb && (
              <Link
                to={`/herbs`}
                className="w-full mt-6 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Herb details</span>
                <BookOpen className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {/* Quick Articles list */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-neutral-800 text-sm">Ayurvedic Insights</h3>
                  <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Curated Articles</p>
                </div>
              </div>

              {/* Sample list items */}
              <div className="space-y-3.5">
                <div className="group cursor-pointer">
                  <Link to="/articles" className="block">
                    <h4 className="text-xs font-bold text-neutral-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      Understanding Ritucharya: The Ayurvedic Science of Seasonal Living
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Read time: 6 mins • by Dr. Vasant Lad</p>
                  </Link>
                </div>

                <div className="group cursor-pointer">
                  <Link to="/articles" className="block">
                    <h4 className="text-xs font-bold text-neutral-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      Demystifying the Three Doshas: Vata, Pitta, and Kapha
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Read time: 5 mins • by Board</p>
                  </Link>
                </div>

                <div className="group cursor-pointer">
                  <Link to="/articles" className="block">
                    <h4 className="text-xs font-bold text-neutral-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      The Ayurvedic Routine (Dinacharya) for Daily Vitality
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Read time: 7 mins • by Dr. Harish Johari</p>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/articles"
              className="w-full mt-6 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore All Articles</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
