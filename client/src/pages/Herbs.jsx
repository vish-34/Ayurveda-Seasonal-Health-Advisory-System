import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Leaf, Search, BookOpen, X, Info, HelpCircle } from 'lucide-react';

const Herbs = () => {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDosha, setFilterDosha] = useState('');
  const [filterSeason, setFilterSeason] = useState('');
  const [selectedHerb, setSelectedHerb] = useState(null);

  const fetchHerbs = async () => {
    setLoading(true);
    try {
      const url = `/herbs?search=${search}&dosha=${filterDosha}&season=${filterSeason}`;
      const { data } = await API.get(url);
      setHerbs(data);
    } catch (error) {
      console.error('Error fetching herbs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHerbs();
  }, [search, filterDosha, filterSeason]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-extrabold text-emerald-950">AyurVeda Herbology Gallery</h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-1">
          Explore Traditional Ayurvedic Herbs & Remedies
        </p>
      </div>

      {/* Filter controls */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search herbs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-sm transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Dosha:</span>
            <select
              value={filterDosha}
              onChange={(e) => setFilterDosha(e.target.value)}
              className="py-2 px-3 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="">All Doshas</option>
              <option value="Vata">Vata</option>
              <option value="Pitta">Pitta</option>
              <option value="Kapha">Kapha</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Season:</span>
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="py-2 px-3 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="">All Seasons</option>
              <option value="Shishira">Shishira</option>
              <option value="Vasanta">Vasanta</option>
              <option value="Grishma">Grishma</option>
              <option value="Varsha">Varsha</option>
              <option value="Sharad">Sharad</option>
              <option value="Hemanta">Hemanta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Herbs Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      ) : herbs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-100 rounded-3xl">
          <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
          <p className="text-neutral-500 text-sm font-semibold">No herbs match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {herbs.map((herb) => (
            <div
              key={herb._id}
              onClick={() => setSelectedHerb(herb)}
              className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all cursor-pointer flex flex-col justify-between group h-full"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-display font-extrabold text-emerald-950 text-xl group-hover:text-emerald-700 transition-colors">
                    {herb.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {herb.doshaAffinity.map((dosha, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          dosha === 'Vata'
                            ? 'bg-sky-50 border-sky-100 text-sky-700'
                            : dosha === 'Pitta'
                            ? 'bg-amber-50 border-amber-100 text-amber-700'
                            : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        }`}
                      >
                        {dosha}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3 mb-6">
                  {herb.description}
                </p>
              </div>

              <div>
                {/* Benefits sneak peek */}
                <div className="bg-neutral-50/50 border border-neutral-100 rounded-xl p-3 mb-4">
                  <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Key Action</span>
                  <p className="text-xs text-neutral-700 font-semibold truncate">
                    {herb.benefits[0]}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedHerb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-neutral-100 w-full max-w-lg rounded-3xl p-6 shadow-xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedHerb(null)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 pr-8">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Herb Encyclopedia</span>
              <h2 className="text-2xl font-display font-extrabold text-emerald-950 mt-1">{selectedHerb.name}</h2>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedHerb.doshaAffinity.map((d, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    {d} Affinity
                  </span>
                ))}
                {selectedHerb.seasons.map((s, i) => (
                  <span key={i} className="bg-neutral-50 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-200">
                    {s} Ritu
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Description */}
              <div>
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Description</span>
                <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50/50 p-3.5 rounded-2xl border border-neutral-100">
                  {selectedHerb.description}
                </p>
              </div>

              {/* Benefits list */}
              <div>
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Health Benefits</span>
                <ul className="space-y-2">
                  {selectedHerb.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-600 leading-relaxed">
                      <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Leaf className="h-2.5 w-2.5 fill-emerald-600" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to use */}
              <div>
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-emerald-600" />
                  How to Consume
                </span>
                <p className="text-sm text-emerald-950 bg-emerald-50/30 p-3.5 rounded-2xl border border-emerald-100 font-medium leading-relaxed">
                  {selectedHerb.howToUse}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-100 pt-4 text-right">
              <button
                onClick={() => setSelectedHerb(null)}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Close Gallery Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Herbs;
