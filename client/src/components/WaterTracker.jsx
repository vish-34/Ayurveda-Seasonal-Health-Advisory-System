import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Droplet, Plus, Minus, CheckCircle } from 'lucide-react';

const WaterTracker = () => {
  const { user, updateWaterLog } = useAuth();
  const [currentWater, setCurrentWater] = useState(0);
  const [loading, setLoading] = useState(false);
  const targetWater = 2500; // ml standard

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (user && user.waterLog) {
      const todayDateStr = getTodayDateString();
      const todayLog = user.waterLog.find((log) => log.date === todayDateStr);
      setCurrentWater(todayLog ? todayLog.amount : 0);
    }
  }, [user]);

  const handleUpdateWater = async (amount) => {
    if (loading) return;
    setLoading(true);
    const todayDateStr = getTodayDateString();

    try {
      const { data } = await API.post('/auth/water', {
        amount,
        date: todayDateStr
      });
      // Update global user context state
      updateWaterLog(data);
      
      // Update local state
      const todayLog = data.find((log) => log.date === todayDateStr);
      setCurrentWater(todayLog ? todayLog.amount : 0);
    } catch (error) {
      console.error('Error logging water:', error);
    } finally {
      setLoading(false);
    }
  };

  const percentage = Math.min(100, Math.round((currentWater / targetWater) * 100));

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full">
      {/* Background soft droplet */}
      <div className="absolute right-[-10px] top-[-10px] opacity-5 pointer-events-none">
        <Droplet className="h-40 w-40 text-emerald-600 fill-emerald-600" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-neutral-800 text-sm">Hydration Tracker</h3>
              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Stay Hydrated</p>
            </div>
          </div>
          {percentage >= 100 && (
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
              <CheckCircle className="h-3 w-3" />
              <span>Target Achieved</span>
            </div>
          )}
        </div>

        {/* Big Water Stats */}
        <div className="my-6 text-center">
          <span className="text-3xl font-display font-extrabold text-neutral-800">{currentWater}</span>
          <span className="text-sm font-medium text-neutral-400"> / {targetWater} ml</span>
          
          {/* Progress bar container */}
          <div className="w-full bg-neutral-100 h-2.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs font-medium text-neutral-500 mt-2">{percentage}% of daily goal met</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={() => handleUpdateWater(-250)}
          disabled={currentWater <= 0 || loading}
          className="flex-1 py-2 px-3 rounded-xl border border-neutral-200 hover:border-neutral-300 disabled:opacity-40 flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer disabled:cursor-not-allowed transition-all"
        >
          <Minus className="h-3.5 w-3.5" />
          <span>250 ml</span>
        </button>
        
        <button
          onClick={() => handleUpdateWater(250)}
          disabled={loading}
          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-1.5 text-xs font-semibold text-white cursor-pointer transition-all"
        >
          <Plus className="h-3.5 w-3.5 animate-pulse" />
          <span>250 ml</span>
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
