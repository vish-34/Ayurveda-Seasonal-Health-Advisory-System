import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Shield, 
  Users, 
  BookOpen, 
  Leaf, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Check, 
  Loader, 
  X,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState('advisories');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // -------------------------------------------------------------
  // Panel 1: Advisory Management States & Logic
  // -------------------------------------------------------------
  const [selectedDosha, setSelectedDosha] = useState('Vata');
  const [selectedSeason, setSelectedSeason] = useState('Vasanta');
  const [advisoryMap, setAdvisoryMap] = useState({
    Diet: { title: '', content: '' },
    Herbs: { title: '', content: '' },
    Yoga: { title: '', content: '' },
    'Daily Routine': { title: '', content: '' },
    Precautions: { title: '', content: '' }
  });

  const fetchAdvisoriesMatrix = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all advisories
      const { data } = await API.get('/advisory');
      // Filter for active select
      const matches = data.filter(
        (adv) => adv.dosha === selectedDosha && adv.season === selectedSeason
      );
      
      const newMap = {
        Diet: { title: '', content: '' },
        Herbs: { title: '', content: '' },
        Yoga: { title: '', content: '' },
        'Daily Routine': { title: '', content: '' },
        Precautions: { title: '', content: '' }
      };

      matches.forEach((adv) => {
        newMap[adv.category] = {
          _id: adv._id,
          title: adv.title,
          content: adv.content.join('\n') // newline separated for easy editing in textarea
        };
      });

      setAdvisoryMap(newMap);
    } catch (err) {
      console.error(err);
      setError('Failed to load advisories database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === 'advisories') {
      fetchAdvisoriesMatrix();
    }
  }, [selectedDosha, selectedSeason, activePanel]);

  const handleSaveAdvisoryCategory = async (category) => {
    const categoryData = advisoryMap[category];
    if (!categoryData.title || !categoryData.content) {
      setError(`Please provide title and content for ${category}`);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        dosha: selectedDosha,
        season: selectedSeason,
        category,
        title: categoryData.title,
        content: categoryData.content.split('\n').filter(line => line.trim() !== '')
      };

      await API.post('/advisory', payload);
      setSuccess(`Advisory for ${category} updated successfully!`);
      // Refetch to sync state
      await fetchAdvisoriesMatrix();
    } catch (err) {
      console.error(err);
      setError(`Failed to save advisory for ${category}`);
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // Panel 2: Herbs Management States & Logic
  // -------------------------------------------------------------
  const [herbs, setHerbs] = useState([]);
  const [showHerbModal, setShowHerbModal] = useState(false);
  const [editingHerb, setEditingHerb] = useState(null);
  const [herbForm, setHerbForm] = useState({
    name: '',
    description: '',
    benefits: '',
    howToUse: '',
    doshaAffinity: [],
    seasons: []
  });

  const fetchHerbsAdmin = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/herbs');
      setHerbs(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch herbs database.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenHerbModal = (herb = null) => {
    setError('');
    setSuccess('');
    if (herb) {
      setEditingHerb(herb);
      setHerbForm({
        name: herb.name,
        description: herb.description,
        benefits: herb.benefits.join('\n'),
        howToUse: herb.howToUse,
        doshaAffinity: herb.doshaAffinity,
        seasons: herb.seasons
      });
    } else {
      setEditingHerb(null);
      setHerbForm({
        name: '',
        description: '',
        benefits: '',
        howToUse: '',
        doshaAffinity: [],
        seasons: []
      });
    }
    setShowHerbModal(true);
  };

  const handleHerbFormSubmit = async (e) => {
    e.preventDefault();
    if (!herbForm.name || !herbForm.description || !herbForm.benefits || !herbForm.howToUse) {
      setError('Please fill in all required herb fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    const payload = {
      ...herbForm,
      benefits: herbForm.benefits.split('\n').filter(b => b.trim() !== '')
    };

    try {
      if (editingHerb) {
        await API.put(`/herbs/${editingHerb._id}`, payload);
        setSuccess('Herb updated successfully.');
      } else {
        await API.post('/herbs', payload);
        setSuccess('New herb registered successfully.');
      }
      setShowHerbModal(false);
      fetchHerbsAdmin();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save herb.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHerb = async (id) => {
    if (!window.confirm('Are you sure you want to remove this herb?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/herbs/${id}`);
      setSuccess('Herb deleted successfully.');
      fetchHerbsAdmin();
    } catch (err) {
      console.error(err);
      setError('Failed to delete herb.');
    }
  };

  const handleHerbCheckbox = (type, value) => {
    const list = [...herbForm[type]];
    const index = list.indexOf(value);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    setHerbForm(prev => ({ ...prev, [type]: list }));
  };

  // -------------------------------------------------------------
  // Panel 3: Articles Management States & Logic
  // -------------------------------------------------------------
  const [articles, setArticles] = useState([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    coverImage: '',
    readTime: ''
  });

  const fetchArticlesAdmin = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/articles');
      setArticles(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenArticleModal = (article = null) => {
    setError('');
    setSuccess('');
    if (article) {
      setEditingArticle(article);
      setArticleForm({
        title: article.title,
        content: article.content,
        author: article.author,
        tags: article.tags.join(', '),
        coverImage: article.coverImage || '',
        readTime: article.readTime || '5 mins'
      });
    } else {
      setEditingArticle(null);
      setArticleForm({
        title: '',
        content: '',
        author: 'Ayurveda Advisory Board',
        tags: 'Seasonal Health, Rituals',
        coverImage: '',
        readTime: '5 mins'
      });
    }
    setShowArticleModal(true);
  };

  const handleArticleFormSubmit = async (e) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) {
      setError('Please fill in title and content fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      ...articleForm,
      tags: articleForm.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    try {
      if (editingArticle) {
        await API.put(`/articles/${editingArticle._id}`, payload);
        setSuccess('Article updated successfully.');
      } else {
        await API.post('/articles', payload);
        setSuccess('New article published successfully.');
      }
      setShowArticleModal(false);
      fetchArticlesAdmin();
    } catch (err) {
      console.error(err);
      setError('Failed to save article.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/articles/${id}`);
      setSuccess('Article removed successfully.');
      fetchArticlesAdmin();
    } catch (err) {
      console.error(err);
      setError('Failed to remove article.');
    }
  };

  // -------------------------------------------------------------
  // Panel 4: Users Directory Logic
  // -------------------------------------------------------------
  const [users, setUsers] = useState([]);

  const fetchUsersAdmin = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  // Initial trigger
  useEffect(() => {
    setError('');
    setSuccess('');
    if (activePanel === 'herbs') fetchHerbsAdmin();
    else if (activePanel === 'articles') fetchArticlesAdmin();
    else if (activePanel === 'users') fetchUsersAdmin();
  }, [activePanel]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-100">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-emerald-950">Administrative Control Panel</h1>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Configure seasonal databases & registries</p>
        </div>
      </div>

      {/* Grid Layout: Left sidebar tabs, Right workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActivePanel('advisories')}
            className={`w-full text-left py-3 px-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activePanel === 'advisories'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-50'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-100'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Advisory Matrix</span>
          </button>

          <button
            onClick={() => setActivePanel('herbs')}
            className={`w-full text-left py-3 px-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activePanel === 'herbs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-50'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-100'
            }`}
          >
            <Leaf className="h-4 w-4" />
            <span>Ayurvedic Herbs</span>
          </button>

          <button
            onClick={() => setActivePanel('articles')}
            className={`w-full text-left py-3 px-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activePanel === 'articles'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-50'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-100'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Insights Articles</span>
          </button>

          <button
            onClick={() => setActivePanel('users')}
            className={`w-full text-left py-3 px-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activePanel === 'users'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-50'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-100'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Registered Users</span>
          </button>
        </div>

        {/* Right Panel Workspace */}
        <div className="lg:col-span-3">
          
          {/* Notification banners */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-4 rounded-2xl mb-6 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold p-4 rounded-2xl mb-6 flex items-start gap-2.5 animate-fade-in">
              <Check className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* PANEL 1: ADVISORY MATRIX MANAGER */}
          {/* ============================================================== */}
          {activePanel === 'advisories' && (
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-display font-bold text-neutral-800 border-b border-neutral-50 pb-3">
                18 Dosha-Season Advisory Grid
              </h2>

              {/* matrix controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Dominant Dosha</label>
                  <select
                    value={selectedDosha}
                    onChange={(e) => setSelectedDosha(e.target.value)}
                    className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Vata">Vata</option>
                    <option value="Pitta">Pitta</option>
                    <option value="Kapha">Kapha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Ayurvedic Season (Ritu)</label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Shishira">Shishira (Late Winter)</option>
                    <option value="Vasanta">Vasanta (Spring)</option>
                    <option value="Grishma">Grishma (Summer)</option>
                    <option value="Varsha">Varsha (Monsoon)</option>
                    <option value="Sharad">Sharad (Autumn)</option>
                    <option value="Hemanta">Hemanta (Early Winter)</option>
                  </select>
                </div>
              </div>

              {/* Editable categories */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6 pt-4 border-t border-neutral-50">
                  {Object.keys(advisoryMap).map((cat) => (
                    <div key={cat} className="border border-neutral-100 rounded-2xl p-4 space-y-3 relative bg-neutral-50/20">
                      <div className="flex items-center justify-between border-b border-neutral-100/60 pb-2">
                        <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">{cat} Advisory</span>
                        <button
                          onClick={() => handleSaveAdvisoryCategory(cat)}
                          disabled={submitting}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Save className="h-3 w-3" />
                          <span>Save {cat}</span>
                        </button>
                      </div>

                      {/* Input fields */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={advisoryMap[cat].title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAdvisoryMap(prev => ({
                              ...prev,
                              [cat]: { ...prev[cat], title: val }
                            }));
                          }}
                          placeholder={`Title (e.g. Diet routine for ${selectedDosha} in ${selectedSeason})`}
                          className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                        />
                        <textarea
                          rows={3}
                          value={advisoryMap[cat].content}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAdvisoryMap(prev => ({
                              ...prev,
                              [cat]: { ...prev[cat], content: val }
                            }));
                          }}
                          placeholder="Guidelines (Write one point per line)..."
                          className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* PANEL 2: AYURVEDIC HERBS MANAGER */}
          {/* ============================================================== */}
          {activePanel === 'herbs' && (
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                <h2 className="text-lg font-display font-bold text-neutral-800">
                  Ayurvedic Herbology Registry
                </h2>
                <button
                  onClick={() => handleOpenHerbModal(null)}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Herb</span>
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
                </div>
              ) : herbs.length === 0 ? (
                <p className="text-xs text-neutral-400 italic text-center py-8">No herbs registered.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Name</th>
                        <th className="pb-3 pr-4">Dosha Affinity</th>
                        <th className="pb-3 pr-4">Ritu (Season)</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {herbs.map((h) => (
                        <tr key={h._id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3.5 pr-4 font-bold text-emerald-950">{h.name}</td>
                          <td className="py-3.5 pr-4">
                            <div className="flex flex-wrap gap-1">
                              {h.doshaAffinity.map((d, idx) => (
                                <span key={idx} className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[9px]">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 pr-4">
                            <div className="flex flex-wrap gap-1">
                              {h.seasons.map((s, idx) => (
                                <span key={idx} className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded text-[9px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleOpenHerbModal(h)}
                                className="p-1 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded transition-colors cursor-pointer"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteHerb(h._id)}
                                className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* PANEL 3: EDUCATIONAL ARTICLES MANAGER */}
          {/* ============================================================== */}
          {activePanel === 'articles' && (
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                <h2 className="text-lg font-display font-bold text-neutral-800">
                  Insights Articles List
                </h2>
                <button
                  onClick={() => handleOpenArticleModal(null)}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Article</span>
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
                </div>
              ) : articles.length === 0 ? (
                <p className="text-xs text-neutral-400 italic text-center py-8">No articles found.</p>
              ) : (
                <div className="space-y-4">
                  {articles.map((art) => (
                    <div key={art._id} className="border border-neutral-100 rounded-2xl p-4 flex justify-between items-center bg-neutral-50/20">
                      <div>
                        <h3 className="font-bold text-neutral-800 text-sm leading-snug">{art.title}</h3>
                        <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">
                          By {art.author} • {art.readTime} read • tags: {art.tags.join(', ')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenArticleModal(art)}
                          className="p-1.5 border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50 text-neutral-500 hover:text-emerald-700 rounded-xl transition-all cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art._id)}
                          className="p-1.5 border border-neutral-200 hover:border-red-500 hover:bg-red-50 text-neutral-500 hover:text-red-700 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* PANEL 4: USERS DIRECTORY */}
          {/* ============================================================== */}
          {activePanel === 'users' && (
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-display font-bold text-neutral-800 border-b border-neutral-50 pb-3">
                Registered Users Registry
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Name</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Age / Gender</th>
                        <th className="pb-3 pr-4">Role</th>
                        <th className="pb-3 pr-4">Dominant Dosha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3.5 pr-4 font-bold text-neutral-800">{u.name}</td>
                          <td className="py-3.5 pr-4 text-neutral-500">{u.email}</td>
                          <td className="py-3.5 pr-4">{u.age} yrs / {u.gender}</td>
                          <td className="py-3.5 pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'admin' 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-neutral-100 text-neutral-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className={`font-semibold ${
                              u.doshaProfile?.dominantDosha 
                                ? 'text-emerald-700' 
                                : 'text-neutral-400 italic'
                            }`}>
                              {u.doshaProfile?.dominantDosha || 'Not Assessed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD/EDIT HERB */}
      {/* ============================================================== */}
      {showHerbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-neutral-100 w-full max-w-lg rounded-3xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowHerbModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-display font-bold text-neutral-800 mb-6">
              {editingHerb ? `Modify Herb: ${editingHerb.name}` : 'Register New Herb'}
            </h3>

            <form onSubmit={handleHerbFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Herb Name</label>
                <input
                  type="text"
                  required
                  value={herbForm.name}
                  onChange={(e) => setHerbForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ashwagandha"
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={herbForm.description}
                  onChange={(e) => setHerbForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="General summary of the herb's actions..."
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Health Benefits (One per line)</label>
                <textarea
                  rows={3}
                  required
                  value={herbForm.benefits}
                  onChange={(e) => setHerbForm(prev => ({ ...prev, benefits: e.target.value }))}
                  placeholder="Reduces cortisol..."
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Usage Instruction</label>
                <input
                  type="text"
                  required
                  value={herbForm.howToUse}
                  onChange={(e) => setHerbForm(prev => ({ ...prev, howToUse: e.target.value }))}
                  placeholder="e.g. 1/2 tsp before bed in warm water"
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                />
              </div>

              {/* dosha checklist */}
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Dosha Affinity</span>
                <div className="flex gap-4">
                  {['Vata', 'Pitta', 'Kapha'].map((d) => (
                    <label key={d} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={herbForm.doshaAffinity.includes(d)}
                        onChange={() => handleHerbCheckbox('doshaAffinity', d)}
                        className="rounded border-neutral-300 h-4 w-4 text-emerald-600"
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* seasons checklist */}
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Seasonal Affinities (Ritus)</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Shishira', 'Vasanta', 'Grishma', 'Varsha', 'Sharad', 'Hemanta'].map((s) => (
                    <label key={s} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={herbForm.seasons.includes(s)}
                        onChange={() => handleHerbCheckbox('seasons', s)}
                        className="rounded border-neutral-300 h-4 w-4 text-emerald-600"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-neutral-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowHerbModal(false)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  {submitting ? 'Saving...' : 'Save Herb'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD/EDIT ARTICLE */}
      {/* ============================================================== */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-neutral-100 w-full max-w-lg rounded-3xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowArticleModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-display font-bold text-neutral-800 mb-6">
              {editingArticle ? `Modify Article: ${editingArticle.title}` : 'Publish New Article'}
            </h3>

            <form onSubmit={handleArticleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Rituals for Autumn Equinox"
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Article Content</label>
                <textarea
                  rows={8}
                  required
                  value={articleForm.content}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter detailed content of the article..."
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={articleForm.author}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Read Time (e.g. 5 mins)</label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, readTime: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={articleForm.tags}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g. Seasonal Health, Ritus, Diet"
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Cover Image URL (Optional)</label>
                <input
                  type="text"
                  value={articleForm.coverImage}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-neutral-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  {submitting ? 'Publishing...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
