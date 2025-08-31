'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { AuroraBackground } from '@/app/components/aurora-background';
import { FaCheck, FaPlus, FaTrash, FaChevronLeft, FaTimes, FaUser, FaGlobe, FaEnvelope, FaPhone, FaLink, FaMusic, FaBuilding, FaLanguage, FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { createAccountStudio } from '../service/api';
import { useRouter } from 'next/navigation';


export default function CreateStudioAccountPage() {
  type FormData = {
    studioName: string;
    description: string;
    avatarImage: string | null;
    galleryImages: (string | ArrayBuffer | null)[];
    location: string;
    contact: {
      email: string;
      phone: string;
      website: string;
      instagram: string;
      soundcloud: string;
      youtube: string;
    };
    schedule: {
      [key: string]: {
        open: boolean;
        start: string;
        end: string;
      };
    };
    services: {
      name: string;
      description: string;
      price: string;
      priceType: string;
      duration: string;
      maxCapacity: string;
      availableTimes: string;
      tags: string;
    }[];
    additionalInfo: {
      amenities: string[];
      rules: string;
      cancellationPolicy: string;
    };
    equipment: string[];
    studioTypes: string[];
    languages: string[];
    preferredGenres: string[];
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    studioName: '',
    description: '',
    avatarImage: null,
    galleryImages: [],
    location: '',
    contact: {
      email: '',
      phone: '',
      website: '',
      instagram: '',
      soundcloud: '',
      youtube: ''
    },
    schedule: {
      monday: { open: false, start: '', end: '' },
      tuesday: { open: false, start: '', end: '' },
      wednesday: { open: false, start: '', end: '' },
      thursday: { open: false, start: '', end: '' },
      friday: { open: false, start: '', end: '' },
      saturday: { open: false, start: '', end: '' },
      sunday: { open: false, start: '', end: '' }
    },
    services: [],
    additionalInfo: {
      amenities: [],
      rules: '',
      cancellationPolicy: ''
    },
    equipment: [],
    studioTypes: [],
    languages: [],
    preferredGenres: [],
  });

  const Router = useRouter();
  
  
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    priceType: 'hour',
    duration: '',
    maxCapacity: '',
    availableTimes: '',
    tags: ''
  });

  const [newEquipment, setNewEquipment] = useState('');
  const [newStudioType, setNewStudioType] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newGenre, setNewGenre] = useState('');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Predefined options
  const equipmentOptions = [
    "Microphones", "Mixers", "Monitors", "Headphones", "MIDI Controllers", 
    "Audio Interfaces", "Acoustic Treatment", "DAW Stations", "Amplifiers",
    "Synthesizers", "Drum Kits", "Guitars", "Bass Guitars", "Pianos/Keyboards"
  ];
  
  const studioTypeOptions = [
    "Recording Studio", "Mixing Studio", "Mastering Studio", "Rehearsal Space",
    "Live Room", "Vocal Booth", "Podcast Studio", "Film Scoring", "Post-Production",
    "Home Studio", "Professional Studio"
  ];
  
  const languageOptions = [
    "English", "French", "Spanish", "German", "Italian", "Portuguese", 
    "Arabic", "Mandarin", "Japanese", "Korean", "Russian", "Hindi"
  ];
  
  const genreOptions = [
    "Rock", "Pop", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
    "Country", "Reggae", "Metal", "Folk", "Blues", "World", "Experimental"
  ];

  // Handle image uploads
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: string) => {
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
      } else {
        setFormData(prev => {
          if (prev.galleryImages.length < 5) {
            return {
              ...prev,
              galleryImages: [...prev.galleryImages, reader.result]
            };
          } else {
            alert('Maximum of 5 gallery images reached');
            return prev;
          }
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle contact info changes
  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  // Handle schedule changes
  const handleScheduleChange = (day: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value
        }
      }
    }));
  };

  // Toggle day open/closed
  const toggleDayOpen = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          open: !prev.schedule[day].open
        }
      }
    }));
  };

  // Handle new service changes
  const handleNewServiceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  // Add new service
  const addService = () => {
    if (newService.name && newService.price) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setNewService({
        name: '',
        description: '',
        price: '',
        priceType: 'hour',
        duration: '',
        maxCapacity: '',
        availableTimes: '',
        tags: ''
      });
    }
  };

  // Remove service
  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // Add item to category
  const addItem = (category: keyof FormData, value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => {
      const currentItems = [...prev[category]] as string[];
      if (!currentItems.includes(value)) {
        return {
          ...prev,
          [category]: [...currentItems, value]
        };
      }
      return prev;
    });
    
    switch(category) {
      case 'equipment': setNewEquipment(''); break;
      case 'studioTypes': setNewStudioType(''); break;
      case 'languages': setNewLanguage(''); break;
      case 'preferredGenres': setNewGenre(''); break;
    }
  };

  // Remove item from category
  const removeItem = (category: keyof FormData, index: number) => {
    setFormData(prev => {
      const items = [...prev[category]] as string[];
      return {
        ...prev,
        [category]: items.filter((_, i) => i !== index)
      };
    });
    
  };

  const router = useRouter(); // Initialize router


  // Handle form submission
  const handleSubmit = async () => {
    //console.log('Studio Account Created:', formData);
      const res = await createAccountStudio(10, formData);
      console.log(res);
    
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
    else handleSubmit();
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // Step indicator component
  const StepIndicator = ({ number, title, active }: { number: number; title: string; active: boolean }) => (
    <div className={`flex flex-col items-center transition-all duration-300 ${
      active ? 'text-purple-300 drop-shadow-[0_0_6px_#c084fc]' : 'text-gray-400'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-[0_0_12px_2px_#a855f7]' 
          : 'bg-gray-700/50 border border-gray-600'
      }`}>
        {active ? <FaCheck size={16} /> : number}
      </div>
      <span className="text-sm font-medium font-special-regular">{title}</span>
    </div>
  );

  return (
    <AuroraBackground>
      <div className="h-fit w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col font-special-regular">
        {/* Navbar */}
        <nav className="w-full h-20 mt-4 py-4">
          <div className="mr-8 ml-8 pt-4 mt-12 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="/home/logo.png" alt="Logo" className="h-12" />
            </div>
          </div>
        </nav>

        {/* Centered Form */}
        <div className="flex-1 flex items-center justify-center p-4">
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
              <div className="h-0.5 bg-gray-600 flex-1 mx-4 my-auto"></div>
              <StepIndicator number={2} title="Services" active={currentStep === 2} />
              <div className="h-0.5 bg-gray-600 flex-1 mx-4 my-auto"></div>
              <StepIndicator number={3} title="Details" active={currentStep === 3} />
            </div>

            {/* Form Content */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto p-2">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Avatar Upload */}
                    <div>
                      <label className="block text-white mb-3 font-special">Studio Logo</label>
                      <div className="relative">
                        {formData.avatarImage ? (
                          <img
                            src={formData.avatarImage}
                            alt="Studio avatar"
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

                    {/* Studio Name & Description */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white mb-2 font-special">Studio Name*</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.studioName}
                            onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                            <FaBuilding className="text-sm" />
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
                    <label className="block text-white mb-2 font-special">Description*</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                      rows="3"
                      placeholder="Describe your studio and services..."
                      required
                    ></textarea>
                  </div>
                  
                  {/* Gallery Images */}
                  <div>
                    <label className="block text-white mb-2 font-special">Gallery Images (max 5)</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {formData.galleryImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={img as string} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              galleryImages: prev.galleryImages.filter((_, i) => i !== index)
                            }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                      {formData.galleryImages.length < 5 && (
                        <div 
                          className="w-24 h-24 bg-gray-700/50 border-2 border-dashed border-purple-400/30 rounded-lg flex items-center justify-center cursor-pointer"
                          onClick={() => galleryInputRef.current?.click()}
                        >
                          <FaPlus className="text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        ref={galleryInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'gallery')}
                      />
                    </div>
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
                        <label className="block text-white mb-2 font-special">Phone Number*</label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.contact.phone}
                            onChange={handleContactChange}
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                            <FaPhone className="text-sm" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Website</label>
                        <div className="relative">
                          <input
                            type="url"
                            name="website"
                            value={formData.contact.website}
                            onChange={handleContactChange}
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                            placeholder="https://"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                            <FaLink className="text-sm" />
                          </div>
                        </div>
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
                    </div>
                  </div>
                  
                  {/* Equipment List */}
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Equipment & Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white mb-2 font-special">Equipment List</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newEquipment}
                            onChange={(e) => setNewEquipment(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                            placeholder="Add equipment..."
                            list="equipmentOptions"
                          />
                          <datalist id="equipmentOptions">
                            {equipmentOptions.map((option, idx) => (
                              <option key={idx} value={option} />
                            ))}
                          </datalist>
                          <button
                            onClick={() => addItem('equipment', newEquipment)}
                            className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.equipment.map((item, index) => (
                            <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                              {item}
                              <button
                                onClick={() => removeItem('equipment', index)}
                                className="ml-2 text-purple-200 hover:text-white"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Studio Types</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newStudioType}
                            onChange={(e) => setNewStudioType(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                            placeholder="Add studio type..."
                            list="studioTypeOptions"
                          />
                          <datalist id="studioTypeOptions">
                            {studioTypeOptions.map((option, idx) => (
                              <option key={idx} value={option} />
                            ))}
                          </datalist>
                          <button
                            onClick={() => addItem('studioTypes', newStudioType)}
                            className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.studioTypes.map((type, index) => (
                            <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                              {type}
                              <button
                                onClick={() => removeItem('studioTypes', index)}
                                className="ml-2 text-purple-200 hover:text-white"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Languages Spoken</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                            placeholder="Add language..."
                            list="languageOptions"
                          />
                          <datalist id="languageOptions">
                            {languageOptions.map((option, idx) => (
                              <option key={idx} value={option} />
                            ))}
                          </datalist>
                          <button
                            onClick={() => addItem('languages', newLanguage)}
                            className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.languages.map((lang, index) => (
                            <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                              {lang}
                              <button
                                onClick={() => removeItem('languages', index)}
                                className="ml-2 text-purple-200 hover:text-white"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Preferred Genres</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm text-white font-special-regular"
                            placeholder="Add genre..."
                            list="genreOptions"
                          />
                          <datalist id="genreOptions">
                            {genreOptions.map((option, idx) => (
                              <option key={idx} value={option} />
                            ))}
                          </datalist>
                          <button
                            onClick={() => addItem('preferredGenres', newGenre)}
                            className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.preferredGenres.map((genre, index) => (
                            <div key={index} className="bg-gray-700/50 text-purple-200 px-3 py-1 rounded-full flex items-center text-sm">
                              {genre}
                              <button
                                onClick={() => removeItem('preferredGenres', index)}
                                className="ml-2 text-purple-200 hover:text-white"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Services */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Schedule */}
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Weekly Schedule</h3>
                    <div className="space-y-4">
                      {Object.entries(formData.schedule).map(([day, data]) => (
                        <div key={day} className="flex items-center justify-between p-3 bg-gray-700/40 rounded-lg">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleDayOpen(day)}
                              className={`w-10 h-5 rounded-full p-0.5 mr-3 transition-colors ${
                                data.open ? 'bg-purple-500' : 'bg-gray-600'
                              }`}
                            >
                              <div
                                className={`bg-white w-3 h-3 rounded-full transform transition-transform ${
                                  data.open ? 'translate-x-5' : ''
                                }`}
                              ></div>
                            </button>
                            <span className="capitalize text-purple-300">{day}</span>
                          </div>
                          
                          {data.open ? (
                            <div className="flex space-x-2">
                              <div>
                                <input
                                  type="time"
                                  value={data.start}
                                  onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                  className="px-2 py-1 bg-gray-700/50 border border-purple-400/30 rounded text-sm text-white"
                                />
                              </div>
                              <span className="text-purple-300">to</span>
                              <div>
                                <input
                                  type="time"
                                  value={data.end}
                                  onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                  className="px-2 py-1 bg-gray-700/50 border border-purple-400/30 rounded text-sm text-white"
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Services */}
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Services</h3>
                    <div className="space-y-6">
                      {/* Add New Service Form */}
                      <div className="bg-gray-700/40 p-4 rounded-lg border border-purple-400/30">
                        <h4 className="font-medium text-purple-300 mb-3 font-special">Add New Service</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white mb-1 text-sm font-special">Service Name*</label>
                            <input
                              type="text"
                              name="name"
                              value={newService.name}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                              placeholder="Recording Session"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1 text-sm font-special">Price Type*</label>
                            <select
                              name="priceType"
                              value={newService.priceType}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                            >
                              <option value="hour">Per Hour</option>
                              <option value="session">Per Session</option>
                              <option value="day">Per Day</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-white mb-1 text-sm font-special">Price*</label>
                            <input
                              type="number"
                              name="price"
                              value={newService.price}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1 text-sm font-special">Duration (minutes)</label>
                            <input
                              type="number"
                              name="duration"
                              value={newService.duration}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                              placeholder="60"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1 text-sm font-special">Max Capacity</label>
                            <input
                              type="number"
                              name="maxCapacity"
                              value={newService.maxCapacity}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                              placeholder="5"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1 text-sm font-special">Available Times</label>
                            <input
                              type="text"
                              name="availableTimes"
                              value={newService.availableTimes}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                              placeholder="9AM-5PM"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-white mb-1 text-sm font-special">Description</label>
                            <textarea
                              name="description"
                              value={newService.description}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                              rows="2"
                              placeholder="Describe your service..."
                            ></textarea>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-white mb-1 text-sm font-special">Tags</label>
                            <input
                              type="text"
                              name="tags"
                              value={newService.tags}
                              onChange={handleNewServiceChange}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-400/30 rounded-lg text-sm text-white font-special-regular"
                              placeholder="recording, mixing, mastering"
                            />
                          </div>
                        </div>
                        <button
                          onClick={addService}
                          className="mt-4 flex items-center text-sm bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-500 transition-colors font-special"
                        >
                          <FaPlus className="mr-2" /> Add Service
                        </button>
                      </div>
                      
                      {/* Services List */}
                      <div>
                        <h4 className="font-medium text-purple-300 mb-3 font-special">Your Services</h4>
                        {formData.services.length > 0 ? (
                          <div className="space-y-3">
                            {formData.services.map((service, index) => (
                              <div key={index} className="bg-gray-700/40 p-3 rounded-lg border border-purple-400/30 flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-purple-200 font-special">{service.name}</h5>
                                  <p className="text-gray-300 text-sm mt-1">{service.description}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded text-xs">
                                      ${service.price}/{service.priceType}
                                    </span>
                                    {service.duration && (
                                      <span className="bg-gray-700/60 text-gray-300 px-2 py-1 rounded text-xs">
                                        {service.duration} mins
                                      </span>
                                    )}
                                    {service.maxCapacity && (
                                      <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">
                                        Max {service.maxCapacity} people
                                      </span>
                                    )}
                                    {service.tags && (
                                      <span className="bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded text-xs">
                                        {service.tags}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeService(index)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-300 text-sm text-center py-4">No services added yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 font-special">Additional Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white mb-2 font-special">Studio Rules</label>
                        <textarea
                          value={formData.additionalInfo.rules}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            additionalInfo: {
                              ...prev.additionalInfo,
                              rules: e.target.value
                            }
                          }))}
                          className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                          rows="4"
                          placeholder="List any specific rules for your studio..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Cancellation Policy</label>
                        <textarea
                          value={formData.additionalInfo.cancellationPolicy}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            additionalInfo: {
                              ...prev.additionalInfo,
                              cancellationPolicy: e.target.value
                            }
                          }))}
                          className="w-full px-4 py-2.5 bg-gray-700/40 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white font-special-regular"
                          rows="3"
                          placeholder="Describe your cancellation policy..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2 font-special">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'Wi-Fi', 'Parking', 'Air Conditioning', 'Kitchen', 
                            'Restroom', 'Wheelchair Access', 'Instruments', 
                            'Mixing Console', 'Monitor Speakers'
                          ].map(amenity => (
                            <button
                              key={amenity}
                              type="button"
                              onClick={() => setFormData(prev => {
                                const amenities = [...prev.additionalInfo.amenities];
                                const index = amenities.indexOf(amenity);
                                
                                if (index > -1) {
                                  amenities.splice(index, 1);
                                } else {
                                  amenities.push(amenity);
                                }
                                
                                return {
                                  ...prev,
                                  additionalInfo: {
                                    ...prev.additionalInfo,
                                    amenities
                                  }
                                };
                              })}
                              className={`px-3 py-1 rounded-full text-sm font-special ${
                                formData.additionalInfo.amenities.includes(amenity)
                                  ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white'
                                  : 'bg-gray-700/60 text-gray-300'
                              }`}
                            >
                              {amenity}
                            </button>
                          ))}
                        </div>
                      </div>
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