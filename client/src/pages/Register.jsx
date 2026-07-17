import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Mail, Lock, Sparkles, MapPin, Activity, Calendar, ShieldAlert, ArrowRight, ArrowLeft, Loader } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    country: 'India',
    state: '',
    city: '',
    occupation: '',
    lifestyle: 'Moderately Active',
    dietType: 'Vegetarian',
    sleepTime: '22:00',
    wakeTime: '06:00',
    disclaimerAccepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all credential fields');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    } else if (step === 2) {
      if (!formData.age || !formData.state || !formData.city || !formData.occupation) {
        setError('Please fill in all demographic and location fields');
        return false;
      }
    } else if (step === 3) {
      if (!formData.disclaimerAccepted) {
        setError('You must accept the medical disclaimer to proceed');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/assessment'); // Prompt Dosha assessment on register success!
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-brand-light/20 to-white">
      <div className="w-full max-w-xl bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
        
        {/* Step Indicator Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
            <Leaf className="h-6 w-6" />
          </div>
          <h2 className="font-display font-bold text-neutral-900 text-2xl">Create Your Account</h2>
          
          {/* Visual Step Tracker */}
          <div className="flex items-center justify-center mt-6 gap-3">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === num
                      ? 'bg-emerald-600 text-white'
                      : step > num
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-12 h-1 rounded-full ml-3 ${
                      step > num ? 'bg-emerald-200' : 'bg-neutral-100'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 text-red-600 text-sm mb-6 animate-fade-in">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Account Credentials */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="block w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="block w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="block w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Demographics & Location */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Occupation</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <Activity className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="occupation"
                    required
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="e.g. Student, Software Developer"
                    className="block w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 mt-2">
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Location Details</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                      className="block w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-xs bg-neutral-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="block w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-xs bg-neutral-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Pune"
                      className="block w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-xs bg-neutral-50/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Habits & Daily Cycle */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Lifestyle Type</label>
                  <select
                    name="lifestyle"
                    value={formData.lifestyle}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  >
                    <option value="Sedentary">Sedentary (Mostly sitting)</option>
                    <option value="Moderately Active">Moderately Active (Walks, light exercise)</option>
                    <option value="Highly Active">Highly Active (Daily workout/heavy labor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Dietary Habits</label>
                  <select
                    name="dietType"
                    value={formData.dietType}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Avg Sleep Time</label>
                  <input
                    type="time"
                    name="sleepTime"
                    required
                    value={formData.sleepTime}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Avg Wake Time</label>
                  <input
                    type="time"
                    name="wakeTime"
                    required
                    value={formData.wakeTime}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 mt-6">
                <span className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-emerald-600" />
                  Medical Disclaimer
                </span>
                <p className="text-[11px] leading-relaxed text-emerald-950/80 mb-3.5">
                  This system determines your Ayurvedic constitution and offers guidelines based on traditional principles (IKS). These recommendations are educational, not medical, and do not replace professional advice, diagnosis, or treatment.
                </p>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="disclaimerAccepted"
                    checked={formData.disclaimerAccepted}
                    onChange={handleChange}
                    className="mt-0.5 rounded border-neutral-300 focus:ring-emerald-500 h-4 w-4 text-emerald-600"
                  />
                  <span className="text-xs font-semibold text-neutral-600">
                    I accept that the recommendations are strictly for educational and wellness purposes.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex gap-4 border-t border-neutral-100 pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 py-3 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-600 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-100 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Register & Start Test</span>
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <div className="text-center mt-6 text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
