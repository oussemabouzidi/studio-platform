'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPlay, FaPause, FaPlus, FaMusic, FaUser, FaStar, FaGlobe, FaCalendarAlt, FaUsers, FaInstagram, FaSoundcloud, FaYoutube, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { specialGothic } from '@/app/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import { Profile, DemoType } from '../../types';
import { getProfile, updateArtistProfile, updateProfile } from '../../service/api';
import { useRouter } from 'next/navigation';

// Suggestion data
const genreSuggestions = ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'Metal', 'Folk', 'R&B', 'Reggae'];
const instrumentSuggestions = ['Guitar', 'Piano', 'Drums', 'Bass', 'Violin', 'Saxophone', 'Flute', 'Trumpet', 'Cello', 'Clarinet'];
const languageSuggestions = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'];

export default function ManageProfilePage() {
  const router = useRouter();
  
  // Form state and handlers
  const [formData, setFormData] = useState<Profile>({
    fullName: '',
    artistName: '',
    avatarImage: '',
    bio: '',
    location: '',
    contact: { email: '', phone: '', instagram: '', soundcloud: '', youtube: '', spotify: '' },
    genres: [],
    instruments: [],
    experienceLevel: 'beginner',
    yearsOfExperience: 0,
    availability: '',
    languages: [],
    collaborators: [],
    portfolio: [],
    demo: []
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [newGenre, setNewGenre] = useState('');
  const [newInstrument, setNewInstrument] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newPortfolioItem, setNewPortfolioItem] = useState({ url: '', title: '', type: 'image' as 'image' | 'video' | 'audio' });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const demoInputRef = useRef<HTMLInputElement>(null);
  const genreInputRef = useRef<HTMLInputElement>(null);
  const instrumentInputRef = useRef<HTMLInputElement>(null);
  const languageInputRef = useRef<HTMLInputElement>(null);

  // Dropdown visibility states
  const [showGenreSuggestions, setShowGenreSuggestions] = useState(false);
  const [showInstrumentSuggestions, setShowInstrumentSuggestions] = useState(false);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile(1);
        setFormData(data);
        console.log("profile data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreInputRef.current && !genreInputRef.current.contains(event.target as Node)) {
        setShowGenreSuggestions(false);
      }
      if (instrumentInputRef.current && !instrumentInputRef.current.contains(event.target as Node)) {
        setShowInstrumentSuggestions(false);
      }
      if (languageInputRef.current && !languageInputRef.current.contains(event.target as Node)) {
        setShowLanguageSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //update profile
  const handleSubmit = async () => {
    async function update() {
      await updateArtistProfile(1, formData);
      console.log('Profile Updated:', formData);
      setShowSuccess(true);
      // auto-hide after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
    update();
    router.push('/pages/client/studios');
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      formData.fullName,
      formData.artistName,
      formData.avatarImage,
      formData.bio,
      formData.location,
      formData.contact.email,
      formData.genres.length > 0,
      formData.instruments.length > 0,
      formData.experienceLevel,
      formData.yearsOfExperience,
      formData.availability
    ];

    const filledCount = fields.filter(Boolean).length;
    return Math.round((filledCount / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Handler functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({
            ...formData,
            avatarImage: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const title = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        const newTrack: DemoType = {
          file: reader.result,
          title: title || 'New Track',
          playing: false
        };
        
        setFormData(prev => ({
          ...prev,
          demo: [...prev.demo, newTrack]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleDemoPlay = (index: number) => {
    setFormData(prev => {
      const updatedDemos = prev.demo.map((track, idx) => {
        if (idx === index) {
          return { ...track, playing: !track.playing };
        } else {
          // Stop other tracks when one plays
          return { ...track, playing: false };
        }
      });
      return { ...prev, demo: updatedDemos };
    });
  };

  const removeDemoTrack = (index: number) => {
    setFormData(prev => ({
      ...prev,
      demo: prev.demo.filter((_, idx) => idx !== index)
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        [name]: value
      }
    });
  };

  const removeGenre = (genre: string) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter(g => g !== genre)
    });
  };

  const addPortfolioItem = () => {
    if (newPortfolioItem.title && newPortfolioItem.url) {
      setFormData({
        ...formData,
        portfolio: [...formData.portfolio, newPortfolioItem]
      });
      setNewPortfolioItem({ url: '', title: '', type: 'image' });
    }
  };

  function removeLanguage(language: string): void {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== language)
    });
  }

  // Update the add functions to accept optional parameters
  const addGenre = (genreToAdd?: string) => {
    const genre = genreToAdd || newGenre;
    if (genre.trim() !== '') {
      setFormData({
        ...formData,
        genres: [...formData.genres, genre.trim()]
      });
      setNewGenre('');
      setShowGenreSuggestions(false);
    }
  };

  const addInstrument = (instrumentToAdd?: string) => {
    const instrument = instrumentToAdd || newInstrument;
    if (instrument.trim() !== '') {
      setFormData({
        ...formData,
        instruments: [...formData.instruments, instrument.trim()]
      });
      setNewInstrument('');
      setShowInstrumentSuggestions(false);
    }
  };

  const addLanguage = (languageToAdd?: string) => {
    const language = languageToAdd || newLanguage;
    if (language.trim() !== '') {
      setFormData({
        ...formData,
        languages: [...formData.languages, language.trim()]
      });
      setNewLanguage('');
      setShowLanguageSuggestions(false);
    }
  };

  function removeInstrument(instrument: string): void {
    setFormData({
      ...formData,
      instruments: formData.instruments.filter(i => i !== instrument)
    });
  }

  function addCollaborator() {
    if (newCollaborator.trim() !== '') {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, newCollaborator.trim()]
      });
      setNewCollaborator('');
    }
  }

  function removeCollaborator(collaborator: string) {
    setFormData({
      ...formData,
      collaborators: formData.collaborators.filter(c => c !== collaborator)
    });
  }

  function removePortfolioItem(index: number) {
    setFormData({
      ...formData,
      portfolio: formData.portfolio.filter((_, i) => i !== index)
    });
  }

  // Filtered suggestions based on input
  const filteredGenreSuggestions = genreSuggestions.filter(genre => 
    genre.toLowerCase().includes(newGenre.toLowerCase()) && !formData.genres.includes(genre)
  );
  
  const filteredInstrumentSuggestions = instrumentSuggestions.filter(instrument => 
    instrument.toLowerCase().includes(newInstrument.toLowerCase()) && !formData.instruments.includes(instrument)
  );
  
  const filteredLanguageSuggestions = languageSuggestions.filter(language => 
    language.toLowerCase().includes(newLanguage.toLowerCase()) && !formData.languages.includes(language)
  );
  
  // Define tabs
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser className="mr-2" /> },
    { id: 'contact', label: 'Contact', icon: <FaGlobe className="mr-2" /> },
    { id: 'skills', label: 'Skills', icon: <FaMusic className="mr-2" /> },
    { id: 'experience', label: 'Experience', icon: <FaStar className="mr-2" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <FaCalendarAlt className="mr-2" /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto ">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>      
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold ${specialGothic.className}`}>
            Manage Your Profile
          </h1>
          
          {/* Modern Tab Navigation */}
          <div className="m-auto mt-4 md:mt-0">
            <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-full p-1 border border-gray-500 border-t-white/30 border-l-white/30 shadow-2xl">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-4 py-2 rounded-full text-sm font-special transition-colors duration-300 ${
                      activeTab === tab.id
                        ? 'text-white opacity-100 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]'
                        : 'text-white hover:text-blue opacity-50'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {/* Background highlight */}
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-600/40 backdrop-blur-3xl z-0"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Foreground content */}
                    <div className="flex items-center relative z-10">
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div>
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        {/* Profile Completion Indicator */}
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <circle
                                cx="18"
                                cy="18"
                                r="15.9155"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="2"
                              />
                              <circle
                                cx="18"
                                cy="18"
                                r="15.9155"
                                fill="none"
                                stroke="#8B5CF6"
                                strokeWidth="2"
                                strokeDasharray={`${profileCompletion} ${100 - profileCompletion}`}
                                strokeDashoffset="25"
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-300">
                                {profileCompletion}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <img 
                          src={formData.avatarImage || '/placeholder-avatar.jpg'} 
                          className="w-32 h-32 rounded-full object-cover border-4 border-purple-600/50"
                          alt="Profile"
                        />
                        <button 
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <input 
                          type="file" 
                          ref={avatarInputRef} 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, 'avatar')}
                          accept="image/*"
                        />
                      </div>
                      
                      <h2 className={`text-2xl font-bold ${specialGothic.className}`}>
                        {formData.fullName}
                      </h2>
                      <p className="text-purple-400 font-medium">
                        {formData.artistName}
                      </p>
                      
                      {/* Completion Status Bar */}
                      <div className="w-full mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Profile Completion</span>
                          <span>{profileCompletion}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                            style={{ width: `${profileCompletion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">EXPERIENCE</h3>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="capitalize">{formData.experienceLevel}</span>
                          <span className="mx-2">•</span>
                          <span>{formData.yearsOfExperience} years</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">LOCATION</h3>
                        <p>{formData.location}</p>
                      </div>
                    </div>
                    
                    
                  </div>
                  
                  {/* Right Column */}
                  <div className="lg:col-span-2">
                    <h2 className={`text-xl font-bold mb-6 pb-2 border-b border-gray-700 ${specialGothic.className}`}>
                      Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Artist Name</label>
                        <input
                          type="text"
                          value={formData.artistName}
                          onChange={(e) => setFormData({...formData, artistName: e.target.value})}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          rows={3}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div>
                  <h2 className={`text-xl font-bold mb-6 pb-2 border-b border-gray-700 ${specialGothic.className}`}>
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.contact.email}
                        onChange={handleContactChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.contact.phone}
                        onChange={handleContactChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.contact.instagram}
                        onChange={handleContactChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">SoundCloud</label>
                      <input
                        type="text"
                        name="soundcloud"
                        value={formData.contact.soundcloud}
                        onChange={handleContactChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div >
                      <label className="block text-gray-400 text-sm mb-2">YouTube</label>
                      <input
                        type="text"
                        name="youtube"
                        value={formData.contact.youtube}
                        onChange={handleContactChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      </div>
<div>
  <label className="block text-gray-400 text-sm mb-2">Spotify</label>
  <input
    type="text"
    name="spotify"
    value={formData.contact.spotify || ''}
    onChange={handleContactChange}
    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>                  
                    <div className="pt-4 border-t border-gray-700 md:col-span-2">
                      <h3 className="text-gray-400 text-sm mb-2">SOCIAL LINKS</h3>
                      <div className="flex space-x-4">
                        {formData.contact.instagram && (
                          <a href={`https://instagram.com/${formData.contact.instagram}`} 
                             className="text-purple-400 hover:text-white transition-colors">
                            <FaInstagram className="text-xl" />
                          </a>
                        )}
                        {formData.contact.soundcloud && (
                          <a href={`https://soundcloud.com/${formData.contact.soundcloud}`} 
                             className="text-purple-400 hover:text-white transition-colors">
                            <FaSoundcloud className="text-xl" />
                          </a>
                        )}
                        {formData.contact.youtube && (
                          <a href={`https://youtube.com/${formData.contact.youtube}`} 
                             className="text-purple-400 hover:text-white transition-colors">
                            <FaYoutube className="text-xl" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'skills' && (
  <div className="flex flex-col gap-6 overflow-visible">
    <div className="flex flex-col md:flex-row gap-6 overflow-x-visible">
      {/* Genre Section */}
      <div className="flex-1 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 relative overflow-visible">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${specialGothic.className}`}>
            <FaMusic className="inline mr-2" /> Genres
          </h2>
        </div>
        
        <div className="flex mb-4 relative" ref={genreInputRef}>
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            onFocus={() => setShowGenreSuggestions(true)}
            placeholder="Add genre"
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={() => addGenre()}
            className="bg-purple-600 hover:bg-purple-700 px-4 rounded-r-lg"
          >
            <FaPlus />
          </button>
          
          {/* Genre Suggestions */}
          {showGenreSuggestions && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredGenreSuggestions.length > 0 ? (
                filteredGenreSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-purple-600"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addGenre(suggestion);
                    }}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400">No matching genres</div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.genres.map((genre, index) => (
            <div key={index} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full flex items-center">
              {genre}
              <button 
                onClick={() => removeGenre(genre)}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instrument Section */}
      <div className="flex-1 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 relative overflow-visible">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${specialGothic.className}`}>
            <FaUser className="inline mr-2" /> Instruments
          </h2>
        </div>
        
        <div className="flex mb-4 relative" ref={instrumentInputRef}>
          <input
            type="text"
            value={newInstrument}
            onChange={(e) => setNewInstrument(e.target.value)}
            onFocus={() => setShowInstrumentSuggestions(true)}
            placeholder="Add instrument"
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={() => addInstrument()}
            className="bg-purple-600 hover:bg-purple-700 px-4 rounded-r-lg"
          >
            <FaPlus />
          </button>
          
          {/* Instrument Suggestions */}
          {showInstrumentSuggestions && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredInstrumentSuggestions.length > 0 ? (
                filteredInstrumentSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-600"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addInstrument(suggestion);
                    }}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400">No matching instruments</div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.instruments.map((instrument, index) => (
            <div key={index} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full flex items-center">
              {instrument}
              <button 
                onClick={() => removeInstrument(instrument)}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    {/* Language Section */}
    <div className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 relative overflow-visible ${
    showGenreSuggestions || showInstrumentSuggestions ? "-z-10" : ""
  }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${specialGothic.className}`}>
          <FaGlobe className="inline mr-2" /> Languages
        </h2>
      </div>
      
      <div className="flex mb-4 relative" ref={languageInputRef}>
        <input
          type="text"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          onFocus={() => setShowLanguageSuggestions(true)}
          placeholder="Add language"
          className="flex-1 bg-gray-700/50 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          onClick={() => addLanguage()}
          className="bg-purple-600 hover:bg-purple-700 px-4 rounded-r-lg"
        >
          <FaPlus />
        </button>
        
        {/* Language Suggestions */}
        {showLanguageSuggestions && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredLanguageSuggestions.length > 0 ? (
              filteredLanguageSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-green-600"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addLanguage(suggestion);
                  }}
                >
                  {suggestion}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400">No matching languages</div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {formData.languages.map((language, index) => (
          <div key={index} className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full flex items-center">
            {language}
            <button 
              onClick={() => removeLanguage(language)}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
              
              {activeTab === 'experience' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                    <h2 className={`text-xl font-bold mb-4 ${specialGothic.className}`}>
                      Experience
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Experience Level</label>
                        <select
                          value={formData.experienceLevel}
                          onChange={(e) => setFormData({...formData, experienceLevel: e.target.value as any})}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="pro">Professional</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Years of Experience</label>
                        <input
                          type="number"
                          value={formData.yearsOfExperience || ''}
                          onChange={(e) => setFormData({...formData, yearsOfExperience: parseInt(e.target.value) || 0})}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                    <h2 className={`text-xl font-bold mb-4 ${specialGothic.className}`}>
                      <FaCalendarAlt className="inline mr-2" /> Availability
                    </h2>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Availability</label>
                      <textarea
                        value={formData.availability}
                        onChange={(e) => setFormData({...formData, availability: e.target.value})}
                        rows={3}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe your availability..."
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-xl font-bold ${specialGothic.className}`}>
                        <FaUsers className="inline mr-2" /> Collaborators
                      </h2>
                    </div>
                    
                    <div className="flex mb-4">
                      <input
                        type="text"
                        value={newCollaborator}
                        onChange={(e) => setNewCollaborator(e.target.value)}
                        placeholder="Add collaborator"
                        className="flex-1 bg-gray-700/50 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button 
                        onClick={addCollaborator}
                        className="bg-purple-600 hover:bg-purple-700 px-4 rounded-r-lg"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-700/30 p-3 rounded-lg">
                          <span>{collaborator}</span>
                          <button 
                            onClick={() => removeCollaborator(collaborator)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Demo Tracks Section */}
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                    <h2 className={`text-xl font-bold mb-4 ${specialGothic.className}`}>
                      Demo Tracks
                    </h2>
                    
                    <div className="space-y-4">
                      {formData.demo.map((track, index) => (
                        <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">{track.title}</span>
                            <button 
                              onClick={() => removeDemoTrack(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="flex items-center">
                            <button 
                              onClick={() => toggleDemoPlay(index)}
                              className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4"
                            >
                              {track.playing ? <FaPause /> : <FaPlay className="ml-1" />}
                            </button>
                            <div className="flex-1 bg-gray-600 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full w-1/3"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div 
                      className="mt-4 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700/30 transition-colors"
                      onClick={() => demoInputRef.current?.click()}
                    >
                      <FaPlus className="mx-auto mb-2" />
                      <p className="text-gray-400">Add demo track</p>
                      <p className="text-sm text-gray-500 mt-1">MP3, WAV, or MP4 files</p>
                      <input 
                        type="file" 
                        ref={demoInputRef} 
                        className="hidden" 
                        onChange={handleDemoUpload}
                        accept="audio/*,video/*"
                        multiple
                      />
                    </div>
                  </div>
                  
                  {/* Portfolio Items Section */}
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                    <h2 className={`text-xl font-bold mb-4 ${specialGothic.className}`}>
                      Portfolio
                    </h2>
                    
                    <div className="space-y-4">
                      {formData.portfolio.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-700/30 p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-gray-600 w-10 h-10 rounded flex items-center justify-center mr-3">
                              {item.type === 'image' && <FaImage />}
                              {item.type === 'video' && <FaVideo />}
                              {item.type === 'audio' && <FaMusic />}
                            </div>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-gray-400">{item.url}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => removePortfolioItem(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <h3 className="text-gray-400 text-sm mb-2">Add Portfolio Item</h3>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            value={newPortfolioItem.title}
                            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})}
                            placeholder="Title"
                            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <select
                            value={newPortfolioItem.type}
                            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, type: e.target.value as any})}
                            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={newPortfolioItem.url}
                          onChange={(e) => setNewPortfolioItem({...newPortfolioItem, url: e.target.value})}
                          placeholder="URL"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button 
                          onClick={addPortfolioItem}
                          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg flex items-center justify-center"
                        >
                          <FaPlus className="mr-2" /> Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center">
            <button 
                      onClick={handleSubmit}
                      className={` mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-9 py-5 rounded-full font-bold transition-all duration-300 ${specialGothic.className}`}
                    >
                      Save Profile
            </button>
        </div>
      
      
      </div>
    <AnimatePresence>
                        {showSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-8 right-15 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 backdrop-blur-sm"
                          >
                            <FaCheckCircle className="text-xl" />
                            <span className="font-semibold">Profile saved successfully!</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
    
    </div>
  );
}

// Icon components
const FaImage = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
  </svg>
);

const FaVideo = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm6.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
  </svg>
);