'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCheck, FaPlus, FaTrash, FaChevronLeft, FaPlay, FaPause, FaArrowRight, FaEnvelope, FaLock, FaUser, FaIdCard, FaMusic, FaMicrophone, FaGlobe, FaStar, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { createAccountArtist } from '../service/api';
import { AuroraBackground } from '@/app/components/aurora-background';

export default function CreateArtistAccountPage() {
  // Predefined suggestions
  const genreSuggestions = ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Rap', 'Country', 'Blues', 'Electronic', 'Metal', 'Punk', 'Reggae', 'Soul', 'Funk', 'R&B', 'Folk', 'Indie', 'Alternative', 'Latin', 'World'];
  const instrumentSuggestions = ['Guitar', 'Piano', 'Bass', 'Drums', 'Violin', 'Cello', 'Flute', 'Saxophone', 'Trumpet', 'Clarinet', 'Harp', 'Vocals', 'Synthesizer', 'DJ Turntables', 'Harmonica', 'Accordion', 'Banjo', 'Mandolin', 'Ukulele', 'Organ'];
  const languageSuggestions = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Urdu', 'Turkish', 'Dutch', 'Swedish', 'Polish', 'Vietnamese', 'Thai'];

  type Demo = {
    file: string | ArrayBuffer | null;
    title: string;
    playing: boolean;
  };

  type FormData = {
    fullName: string;
    artistName: string;
    avatarImage: string | null;
    bio: string;
    location: string;
    contact: {
      email: string;
      phone: string;
      instagram: string;
      soundcloud: string;
      youtube: string;
      spotify: string;
    };
    genres: string[];
    instruments: string[];
    demos: Demo[];
    collaborators: string[];
    languages: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'pro';
    yearsOfExperience: number | null;
    availability: string;
    portfolio: { url: string; title: string; type: 'image' | 'video' | 'audio' }[];
  };

  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    artistName: '',
    avatarImage: null,
    bio: '',
    location: '',
    contact: {
      email: '',
      phone: '',
      instagram: '',
      soundcloud: '',
      youtube: '',
      spotify: ''
    },
    genres: [],
    instruments: [],
    demos: [],
    collaborators: [],
    languages: [],
    experienceLevel: 'beginner',
    yearsOfExperience: null,
    availability: '',
    portfolio: []
  });
  
  const [newGenre, setNewGenre] = useState('');
  const [newInstrument, setNewInstrument] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newPortfolioItem, setNewPortfolioItem] = useState({ url: '', title: '', type: 'image' as 'image' | 'video' | 'audio' });
  const [filteredGenres, setFilteredGenres] = useState<string[]>([]);
  const [filteredInstruments, setFilteredInstruments] = useState<string[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<string[]>([]);
  const [showGenreSuggestions, setShowGenreSuggestions] = useState(false);
  const [showInstrumentSuggestions, setShowInstrumentSuggestions] = useState(false);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const demoInputRef = useRef<HTMLInputElement>(null);
  const Router = useRouter();
  
  // Filter suggestions based on input
  useEffect(() => {
    if (newGenre) {
      setFilteredGenres(
        genreSuggestions.filter(genre => 
          genre.toLowerCase().includes(newGenre.toLowerCase())
        )
      );
    } else {
      setFilteredGenres([]);
    }
  }, [newGenre]);

  useEffect(() => {
    if (newInstrument) {
      setFilteredInstruments(
        instrumentSuggestions.filter(instrument => 
          instrument.toLowerCase().includes(newInstrument.toLowerCase())
        )
      );
    } else {
      setFilteredInstruments([]);
    }
  }, [newInstrument]);

  useEffect(() => {
    if (newLanguage) {
      setFilteredLanguages(
        languageSuggestions.filter(language => 
          language.toLowerCase().includes(newLanguage.toLowerCase())
        )
      );
    } else {
      setFilteredLanguages([]);
    }
  }, [newLanguage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setFormData(prev => ({ ...prev, avatarImage: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDemoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('audio.*') && !file.type.match('video.*')) {
      alert('Please select an audio or video file (MP3, MP4, etc.)');
      return;
    }

    if (formData.demos.length >= 4) {
      alert('You can only add up to 4 demo tracks');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        demos: [
          ...prev.demos,
          {
            file: reader.result,
            title: file.name,
            playing: false
          }
        ]
      }));
    };
    reader.readAsDataURL(file);
  };

  const toggleDemoPlay = (index: number) => {
    setFormData(prev => {
      const newDemos = [...prev.demos];
      newDemos[index].playing = !newDemos[index].playing;
      return { ...prev, demos: newDemos };
    });
  };

  const removeDemo = (index: number) => {
    setFormData(prev => {
      const newDemos = [...prev.demos];
      newDemos.splice(index, 1);
      return { ...prev, demos: newDemos };
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  const addGenre = (genre?: string) => {
    const genreToAdd = genre || newGenre;
    if (genreToAdd && !formData.genres.includes(genreToAdd)) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, genreToAdd]
      }));
      setNewGenre('');
      setShowGenreSuggestions(false);
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }));
  };

  const addInstrument = (instrument?: string) => {
    const instrumentToAdd = instrument || newInstrument;
    if (instrumentToAdd && !formData.instruments.includes(instrumentToAdd)) {
      setFormData(prev => ({
        ...prev,
        instruments: [...prev.instruments, instrumentToAdd]
      }));
      setNewInstrument('');
      setShowInstrumentSuggestions(false);
    }
  };

  const removeInstrument = (instrument: string) => {
    setFormData(prev => ({
      ...prev,
      instruments: prev.instruments.filter(i => i !== instrument)
    }));
  };

  const addCollaborator = () => {
    if (newCollaborator && !formData.collaborators.includes(newCollaborator)) {
      setFormData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, newCollaborator]
      }));
      setNewCollaborator('');
    }
  };

  const removeCollaborator = (collaborator: string) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c !== collaborator)
    }));
  };

  const addLanguage = (language?: string) => {
    const languageToAdd = language || newLanguage;
    if (languageToAdd && !formData.languages.includes(languageToAdd)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageToAdd]
      }));
      setNewLanguage('');
      setShowLanguageSuggestions(false);
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addPortfolioItem = () => {
    if (newPortfolioItem.url && newPortfolioItem.title) {
      setFormData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, newPortfolioItem]
      }));
      setNewPortfolioItem({ url: '', title: '', type: 'image' });
    }
  };

  const removePortfolioItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    const id = localStorage.getItem("user_id");
    console.log(id)
    const res = await createAccountArtist(id, formData);
    console.log(res);
    Router.push("/pages/client/studios")
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
    else handleSubmit();
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const StepIndicator = ({ number, title, active }: { number: number; title: string; active: boolean }) => (
    <div
      className={`flex flex-col items-center transition-all duration-300 ${
        active ? 'text-purple-300 drop-shadow-[0_0_6px_#c084fc]' : 'text-gray-400'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
          active
            ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-[0_0_12px_2px_#a855f7] '
            : 'bg-gray-700/50 border border-gray-600'
        }`}
      >
        {active ? <FaCheck size={16} /> : number}
      </div>
      <span className="text-sm font-medium font-special-regular">{title}</span>
    </div>
  );

  return (
    <AuroraBackground>
      <div className="md:h-svw md:w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col font-special-regular">
        {/* Navbar */}
        <nav className="w-full h-20 mt-4 py-4">
          <div className="mr-8 ml-8 mt-12 pt-4 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="/home/logo.png" alt="Logo" className="h-12" />
            </div>
          </div>
        </nav>

        {/* Centered Form */}
        <div className="flex-1 flex h-full items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-gray-800/30 backdrop-blur-2xl rounded-3xl 
                          border border-gray-600 border-t-white/20 border-l-white/20 p-6 md:p-8 shadow-2xl
                          relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-600/10 before:to-white/5 before:rounded-3xl before:-z-10">
            
            {/* Back Button */}
            <button 
              onClick={() => router.back()} 
              className="flex items-center text-gray-300 hover:text-white mb-12 pt-1 ml-1 z-50 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button> 
            
            {/* Step Indicator - Top */}
            <div className="flex justify-between mb-8 px-4">
              <StepIndicator number={1} title="Basic Info" active={currentStep === 1} />
              <div className="h-0.5 bg-gray-600 flex-1 mx-4 my-auto "></div>
              <StepIndicator number={2} title="Music Identity" active={currentStep === 2} />
              <div className="h-0.5 bg-gray-600 flex-1 mx-4 my-auto"></div>
              <StepIndicator number={3} title="Experience" active={currentStep === 3} />
            </div>

            {/* Form Content */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto p-2">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Avatar Upload */}
                    <div>
                      <label className="block text-white mb-3 font-special">Profile Photo</label>
                      <div className="relative">
                        {formData.avatarImage ? (
                          <img
                            src={formData.avatarImage}
                            alt="Artist avatar"
                            className="w-32 h-32 object-cover rounded-full border-2 border-purple-400/30 mx-auto"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-700/50 border-2 border-dashed border-purple-400/30 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute bottom-0 right-0 md:right-10 bg-gradient-to-r from-purple-600 to-purple-400 text-white p-2 rounded-full shadow-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                        >
                          <FaPlus size={14} />
                        </button>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'avatar')}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-2">
                        JPG, PNG format
                      </p>
                    </div>

                    {/* Name & Bio */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white mb-2 font-special">Full Name*</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                            <FaUser className="text-sm" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Artist Name*</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.artistName}
                            onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                            <FaStar className="text-sm" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Location*</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            placeholder="City, Country"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                            <FaGlobe className="text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2 font-special">Bio*</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                      rows={3}
                      placeholder="Tell us about yourself and your music..."
                      required
                    ></textarea>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2 font-special">Email*</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.contact.email}
                            onChange={handleContactChange}
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                            <FaEnvelope className="text-sm" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.contact.phone}
                          onChange={handleContactChange}
                          className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Instagram</label>
                        <input
                          type="text"
                          name="instagram"
                          value={formData.contact.instagram}
                          onChange={handleContactChange}
                          className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                          placeholder="@username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">SoundCloud</label>
                        <input
                          type="url"
                          name="soundcloud"
                          value={formData.contact.soundcloud}
                          onChange={handleContactChange}
                          className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                          placeholder="https://soundcloud.com/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">YouTube</label>
                        <input
                          type="url"
                          name="youtube"
                          value={formData.contact.youtube}
                          onChange={handleContactChange}
                          className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                          placeholder="https://youtube.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2 font-special">Spotify</label>
                        <input
                          type="url"
                          name="spotify"
                          value={formData.contact.spotify}
                          onChange={handleContactChange}
                          className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                          placeholder="https://open.spotify.com/artist/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Musical Identity */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Genres */}
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Musical Genres</h3>
                      <div className="flex items-center gap-2 mb-3 relative">
                        <input
                          type="text"
                          value={newGenre}
                          onChange={(e) => setNewGenre(e.target.value)}
                          onFocus={() => setShowGenreSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowGenreSuggestions(false), 200)}
                          className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                          placeholder="Add a genre..."
                        />
                        <button
                          onClick={() => addGenre()}
                          className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                        >
                          <FaPlus size={14} />
                        </button>
                        
                        {/* Genre Suggestions */}
                        {showGenreSuggestions && filteredGenres.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                            {filteredGenres.map((genre, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white"
                                onMouseDown={() => addGenre(genre)}
                              >
                                {genre}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.genres.map((genre, index) => (
                          <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                            {genre}
                            <button
                              onClick={() => removeGenre(genre)}
                              className="ml-2 text-purple-200 hover:text-white"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Instruments */}
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Instruments Played</h3>
                      <div className="flex items-center gap-2 mb-3 relative">
                        <input
                          type="text"
                          value={newInstrument}
                          onChange={(e) => setNewInstrument(e.target.value)}
                          onFocus={() => setShowInstrumentSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowInstrumentSuggestions(false), 200)}
                          className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                          placeholder="Add an instrument..."
                        />
                        <button
                          onClick={() => addInstrument()}
                          className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                        >
                          <FaPlus size={14} />
                        </button>
                        
                        {/* Instrument Suggestions */}
                        {showInstrumentSuggestions && filteredInstruments.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                            {filteredInstruments.map((instrument, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white"
                                onMouseDown={() => addInstrument(instrument)}
                              >
                                {instrument}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.instruments.map((instrument, index) => (
                          <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                            {instrument}
                            <button
                              onClick={() => removeInstrument(instrument)}
                              className="ml-2 text-purple-200 hover:text-white"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {/* Demo Tracks */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-purple-300 font-special">Demo Tracks (4 max)</h3>
                        <span className="text-gray-300 text-sm">
                          {formData.demos.length}/4 added
                        </span>
                      </div>
                      
                      <div className="bg-gray-700/40 p-4 rounded-lg border border-gray-600/50">
                        {formData.demos.length > 0 ? (
                          <div className="space-y-4">
                            {formData.demos.map((demo, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-700/60 p-3 rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-purple-200 truncate font-special">{demo.title}</p>
                                  <p className="text-xs text-gray-300 mt-1">
                                    {demo.file?.toString().split('/')[0] === 'data:audio' ? 'Audio' : 'Video'} file
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleDemoPlay(index)}
                                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center text-white hover:from-purple-700 hover:to-purple-500"
                                  >
                                    {demo.playing ? <FaPause size={12} /> : <FaPlay size={12} />}
                                  </button>
                                  <button
                                    onClick={() => removeDemo(index)}
                                    className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-300 hover:bg-red-500/30"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-300 text-sm mb-3">No demo tracks uploaded</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => demoInputRef.current?.click()}
                            disabled={formData.demos.length >= 4}
                            className={`px-4 py-2 flex items-center text-sm rounded-lg font-special ${
                              formData.demos.length >= 4 
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:from-purple-700 hover:to-purple-500'
                            }`}
                          >
                            <FaPlus className="mr-2" /> Add Demo Track
                          </button>
                          <input
                            type="file"
                            ref={demoInputRef}
                            className="hidden"
                            accept="audio/*,video/*"
                            onChange={handleDemoUpload}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Collaborators */}
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Collaborators</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          value={newCollaborator}
                          onChange={(e) => setNewCollaborator(e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                          placeholder="Add a collaborator..."
                        />
                        <button
                          onClick={addCollaborator}
                          className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.collaborators.map((collaborator, index) => (
                          <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                            {collaborator}
                            <button
                              onClick={() => removeCollaborator(collaborator)}
                              className="ml-2 text-purple-200 hover:text-white"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Languages */}
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Languages Spoken</h3>
                      <div className="flex items-center gap-2 mb-3 relative">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onFocus={() => setShowLanguageSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowLanguageSuggestions(false), 200)}
                          className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                          placeholder="Add a language..."
                        />
                        <button
                          onClick={() => addLanguage()}
                          className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                        >
                          <FaPlus size={14} />
                        </button>
                        
                        {/* Language Suggestions */}
                        {showLanguageSuggestions && filteredLanguages.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                            {filteredLanguages.map((language, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white"
                                onMouseDown={() => addLanguage(language)}
                              >
                                {language}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map((language, index) => (
                          <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                            {language}
                            <button
                              onClick={() => removeLanguage(language)}
                              className="ml-2 text-purple-200 hover:text-white"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Experience */}
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Experience</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white mb-2 font-special">Experience Level</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['beginner', 'intermediate', 'pro'] as const).map(level => (
                              <button
                                key={level}
                                onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level }))}
                                className={`py-2 rounded-lg text-center transition-colors text-sm font-special ${
                                  formData.experienceLevel === level
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow'
                                    : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60'
                                }`}
                              >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white mb-2 font-special">Years of Experience</label>
                          <input
                            type="number"
                            value={formData.yearsOfExperience || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              yearsOfExperience: parseInt(e.target.value) || null 
                            }))}
                            className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            min="0"
                            max="50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Availability</h3>
                    <textarea
                      value={formData.availability}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                      rows={3}
                      placeholder="Describe your typical availability..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Portfolio</h3>
                    <div className="bg-gray-700/40 p-4 rounded-lg border border-gray-600/50 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-white mb-1 text-sm font-special">URL*</label>
                          <input
                            type="url"
                            value={newPortfolioItem.url}
                            onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, url: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700/60 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                            placeholder="https://"
                          />
                        </div>
                        <div>
                          <label className="block text-white mb-1 text-sm font-special">Type</label>
                          <select
                            value={newPortfolioItem.type}
                            onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full px-3 py-2 bg-gray-700/60 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                          </select>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-white mb-1 text-sm font-special">Title*</label>
                          <input
                            type="text"
                            value={newPortfolioItem.title}
                            onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700/60 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                            placeholder="Project Title"
                          />
                        </div>
                      </div>
                      <button
                        onClick={addPortfolioItem}
                        className="mt-4 flex items-center text-sm bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors font-special"
                      >
                        <FaPlus className="mr-2" /> Add to Portfolio
                      </button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-purple-300 mb-3 font-special">Your Portfolio</h4>
                      {formData.portfolio.length > 0 ? (
                        <div className="space-y-3">
                          {formData.portfolio.map((item, index) => (
                            <div key={index} className="bg-gray-700/40 border border-gray-600/50 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-purple-200 font-special">{item.title}</h5>
                                <p className="text-gray-300 text-xs truncate w-64">{item.url}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-700/60 text-purple-200 px-2 py-1 rounded text-xs capitalize font-special-regular">
                                  {item.type}
                                </span>
                                <button
                                  onClick={() => removePortfolioItem(index)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-300 text-sm text-center py-4">No portfolio items added yet</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-5 py-2.5 rounded-lg font-special ${
                  currentStep === 1 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <FaChevronLeft className="mr-2" /> Back
              </button>
              
              <button
                onClick={nextStep}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-200 shadow-lg text-sm md:text-base font-special"
              >
                {currentStep === 3 ? 'Complete Registration' : 'Next Step'} <FaArrowRight className="ml-2 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
