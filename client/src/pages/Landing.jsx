import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Award, Calendar, BarChart2, Heart, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-b from-brand-light/50 via-white to-white min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ayurvedic Seasonal living (Ritucharya)</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-emerald-950 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Align Your Health With <span className="text-emerald-600 underline decoration-wavy decoration-emerald-200">Nature's Rhythms</span>
        </h1>
        
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover your mind-body constitution (Dosha), track the Ayurvedic seasons (Ritu), and receive personalized guidelines for diet, herbs, daily routine, and yoga.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-100 hover:shadow-xl hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-100 hover:shadow-xl hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                <span>Discover Your Dosha</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white border border-neutral-200 hover:border-emerald-600 text-neutral-700 hover:text-emerald-700 font-semibold px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:bg-emerald-50/20"
              >
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-100/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-950">How it Works</h2>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-1">Simple & Scientifically Rooted</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-neutral-800 text-lg mb-2">1. Dosha Assessment</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Answer 10 intuitive questions detailing your physical traits, sleep patterns, digestion, and behavior. Our engine calculates your Vata, Pitta, and Kapha constitution percentages.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-neutral-800 text-lg mb-2">2. Ritu Detection</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              The system automatically tracks the active Ayurvedic season (Ritu) from the Vedic calendar. Learn which elements fluctuate and how they impact your body.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-neutral-800 text-lg mb-2">3. Seasonal Advisory</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Get targeted daily recommendations. Customize your diet, try seasonal yoga, incorporate balancing herbs, adjust your daily routine, and review vital health precautions.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="bg-emerald-950 text-emerald-100 py-12 px-4 text-center mt-12 relative overflow-hidden">
        {/* Subtle decorative leaf vectors */}
        <div className="absolute left-[-20px] bottom-[-20px] opacity-10">
          <Leaf className="h-40 w-40 fill-white" />
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-emerald-100/90 leading-relaxed mb-4">
            "Swasthasya Syasthya Rakshanam, Aturasya Vikara Prashamanam Cha."
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            - Charaka Samhita (The foundation of Ayurvedic medicine: "Protect the health of the healthy, and soothe the illness of the sick")
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
