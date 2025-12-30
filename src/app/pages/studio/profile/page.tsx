'use client';
import React, { useState } from 'react';
import { 
  FaUser, 
  FaCog, 
  FaDrum, 
  FaCalendarAlt,
  FaImage, 
  FaLock, 
  FaEye,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaArrowLeft,
  FaMusic
} from 'react-icons/fa';
import { specialGothic } from '@/app/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import { useRef, useEffect } from 'react';
import { Studio, Service } from '../types';
import { getStudioManageProfile, updateStudioProfile } from '../services/api';
import { useRouter } from 'next/navigation';

// Define options for each dropdown
const equipmentOptions = [
  "Microphones", "Mixers", "Audio Interfaces", "Monitors", "Headphones", 
  "MIDI Keyboards", "Synthesizers", "Drum Kits", "Guitars", "Bass", 
  "Amplifiers", "Effects Pedals", "Cables", "Stands", "Acoustic Treatment"
];

const studioTypeOptions = [
  "Recording Studio", "Mixing Studio", "Mastering Studio", "Live Room", 
  "Drum Booth", "Vocal Booth", "Podcast Studio", "Rehearsal Space"
];

const languageOptions = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", 
  "Japanese", "Korean", "Mandarin", "Russian", "Arabic", "Hindi"
];

const genreOptions = [
  "Rock", "Pop", "Hip Hop", "Rap", "Jazz", "Blues", "Classical", 
  "Electronic", "EDM", "R&B", "Country", "Metal", "Folk", "Reggae", 
  "Punk", "Soul", "Funk", "World Music", "Gospel"
];

const amenityOptions = [
  "WiFi", "Coffee", "Tea", "Water", "Parking", "Lounge", "Kitchen", 
  "Shower", "Restroom", "Wheelchair Access", "Air Conditioning", 
  "Heating", "Snacks", "Street Parking", "Garage Parking", 
  "Public Transport Access"
];

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const emptyStudioProfile: Studio = {
  studioName: "",
  description: "",
  avatarImage: "",
  galleryImages: [],
  location: "",
  contact: {
    email: "",
    phone: "",
    website: "",
    instagram: "",
    soundcloud: "",
    youtube: ""
  },
  schedule: {},
  services: [],
  additionalInfo: {
    amenities: [],
    rules: "",
    cancellationPolicy: ""
  },
  equipment: [],
  studioTypes: [],
  languages: [],
  preferredGenres: []
};

type ProfileField = 'studioName' | 'location' | 'description';
type ContactField = keyof Studio['contact'];
type ScheduleField = 'open' | 'start' | 'end';
type SimpleListName = 'equipment' | 'studioTypes' | 'languages' | 'preferredGenres';
type ListName = SimpleListName | 'additionalInfo';
type StudioService = Service;

export default function ManageStudioProfile() {
  // Initial studio profile data
  const [studioProfile, setStudioProfile] = useState<Studio>(emptyStudioProfile);

  // fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try{
        const data = await getStudioManageProfile(1);
        const incoming = (data ?? {}) as Partial<Studio>;

        setStudioProfile((prev) => ({
          ...emptyStudioProfile,
          ...prev,
          ...incoming,
          contact: {
            ...emptyStudioProfile.contact,
            ...(prev.contact ?? {}),
            ...(incoming.contact ?? {})
          },
          additionalInfo: {
            ...emptyStudioProfile.additionalInfo,
            ...(prev.additionalInfo ?? {}),
            ...(incoming.additionalInfo ?? {})
          },
          services: incoming.services ?? prev.services ?? [],
          equipment: incoming.equipment ?? prev.equipment ?? [],
          studioTypes: incoming.studioTypes ?? prev.studioTypes ?? [],
          languages: incoming.languages ?? prev.languages ?? [],
          preferredGenres: incoming.preferredGenres ?? prev.preferredGenres ?? [],
          galleryImages: incoming.galleryImages ?? prev.galleryImages ?? [],
          schedule: incoming.schedule ?? prev.schedule ?? {}
        }));
        console.log("profile data is working");
      }catch(error){
        console.log(error);
      }
    }
    fetchProfile();
  }, [])

  const [newService, setNewService] = useState<StudioService>({
    id: 0,
    name: '',
    description: '',
    price: '',
    priceType: 'hour',
    duration: '',
    maxCapacity: '',
    availableTimes: '',
    tags: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [newEquipment, setNewEquipment] = useState('');
  const [newStudioType, setNewStudioType] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
  const [showStudioTypeDropdown, setShowStudioTypeDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showAmenityDropdown, setShowAmenityDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<StudioService | null>(null);

  // Define tabs for studio profile management
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser className="md:mr-2" /> },
    { id: 'services', label: 'Services', icon: <FaCog className="md:mr-2" /> },
    { id: 'equipment', label: 'Equipment', icon: <FaDrum className="md:mr-2" /> },
    { id: 'schedule', label: 'Schedule', icon: <FaCalendarAlt className="md:mr-2" /> },
    { id: 'gallery', label: 'Gallery', icon: <FaImage className="md:mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <FaLock className="md:mr-2" /> },
  ];

  type DropdownSelectProps = {
    options: string[];
    selectedItems: string[];
    onAdd: (value: string) => void;
    onRemove: (value: string) => void;
    placeholder: string;
    allowCustom?: boolean;
  };

  // Create a reusable DropdownSelect component
  const DropdownSelect = ({ 
    options, 
    selectedItems, 
    onAdd, 
    onRemove, 
    placeholder,
    allowCustom = true
  }: DropdownSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customInput, setCustomInput] = useState('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node | null;

        if (dropdownRef.current && target && !dropdownRef.current.contains(target)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Filter options based on search term
    const filteredOptions = options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add custom item
    const handleAddCustom = () => {
      if (customInput.trim() && !selectedItems.includes(customInput.trim())) {
        onAdd(customInput.trim());
        setCustomInput('');
      }
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchTerm.trim() && !filteredOptions.length) {
        if (allowCustom && !selectedItems.includes(searchTerm.trim())) {
          onAdd(searchTerm.trim());
          setSearchTerm('');
        }
      }
    };

    return (
      <div className="relative w-full" ref={dropdownRef}>
        <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}>
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-500"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Selected items below the input */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedItems.map((item, index) => (
            <div key={index} className="bg-purple-900/30 px-3 py-1 rounded-lg flex items-center">
              <span className="text-purple-300 text-sm">{item}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item);
                }}
                className="text-red-400 hover:text-red-300 ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {/* Custom input field */}
            {allowCustom && (
              <div className="p-2 border-b border-gray-700">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-l-lg px-3 py-2 text-white focus:outline-none"
                    placeholder="Add custom..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddCustom();
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-r-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            
            {/* Options list */}
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center ${
                  selectedItems.includes(option) 
                    ? 'bg-purple-900/30 text-purple-300' 
                    : 'text-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedItems.includes(option)) {
                    onAdd(option);
                  }
                  setSearchTerm('');
                }}
              >
                <span>{option}</span>
                {selectedItems.includes(option) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-center">
                No options found
                {allowCustom && " - type to add custom"}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Handle form field changes
  const handleProfileChange = (field: ProfileField, value: string) => {
    setStudioProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: ContactField, value: string) => {
    setStudioProfile(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleScheduleChange = (day: string, field: ScheduleField, value: string | boolean) => {
    setStudioProfile(prev => ({
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

  // Add a new service
  const addService = () => {
    if (editingService) {
      // Update existing service
      setStudioProfile(prev => ({
        ...prev,
        services: prev.services.map(service => 
          service.id === editingService.id 
            ? { ...newService, id: editingService.id } 
            : service
        )
      }));
    } else {
      // Add new service
      setStudioProfile(prev => ({
        ...prev,
        services: [
          ...prev.services,
          { ...newService, id: prev.services.length + 1 }
        ]
      }));
    }
    
    // Reset form
    setNewService({
      id: 0,
      name: '',
      description: '',
      price: '',
      priceType: 'hour',
      duration: '',
      maxCapacity: '',
      availableTimes: '',
      tags: ''
    });
    
    setShowServiceForm(false);
    setEditingService(null);
  };

  // Edit a service
  const editService = (service: StudioService) => {
    setEditingService(service);
    setNewService({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      priceType: service.priceType,
      duration: service.duration,
      maxCapacity: service.maxCapacity,
      availableTimes: service.availableTimes,
      tags: service.tags
    });
    setShowServiceForm(true);
  };

  // Delete a service
  const deleteService = (id: number) => {
    setStudioProfile(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };

  // Add new item to list
  const addToList = (listName: ListName, value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    if (listName === 'additionalInfo') {
      setStudioProfile(prev => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          amenities: [...prev.additionalInfo.amenities, trimmedValue]
        }
      }));
      setNewAmenity('');
      return;
    }

    setStudioProfile(prev => ({
      ...prev,
      [listName]: [...(prev[listName] as string[]), trimmedValue]
    }));

    switch (listName) {
      case 'equipment':
        setNewEquipment('');
        break;
      case 'studioTypes':
        setNewStudioType('');
        break;
      case 'languages':
        setNewLanguage('');
        break;
      case 'preferredGenres':
        setNewGenre('');
        break;
    }
  };

  // Remove item from list
  const removeFromList = (listName: ListName, value: string) => {
    if (listName === 'additionalInfo') {
      setStudioProfile(prev => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          amenities: prev.additionalInfo.amenities.filter((amenity) => amenity !== value)
        }
      }));
      return;
    }

    setStudioProfile(prev => ({
      ...prev,
      [listName]: (prev[listName] as string[]).filter((item) => item !== value)
    }));
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaUser className="mr-3 text-purple-400" /> Studio Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm mb-2">Studio Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.studioName}
                    onChange={(e) => handleProfileChange('studioName', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Description</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={4}
                    value={studioProfile.description}
                    onChange={(e) => handleProfileChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaUser className="mr-3 text-blue-400" /> Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Website</label>
                  <input
                    type="url"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.contact.website}
                    onChange={(e) => handleContactChange('website', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Instagram</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.contact.instagram}
                    onChange={(e) => handleContactChange('instagram', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">SoundCloud</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.contact.soundcloud}
                    onChange={(e) => handleContactChange('soundcloud', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">YouTube</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={studioProfile.contact.youtube}
                    onChange={(e) => handleContactChange('youtube', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'services':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className={`text-xl font-bold flex items-center ${specialGothic.className}`}>
                  <FaCog className="mr-3 text-yellow-400" /> Studio Services
                </h3>
                <button 
                  onClick={() => {
                    setEditingService(null);
                    setShowServiceForm(true);
                    setNewService({
                      id: 0,
                      name: '',
                      description: '',
                      price: '',
                      priceType: 'hour',
                      duration: '',
                      maxCapacity: '',
                      availableTimes: '',
                      tags: ''
                    });
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center"
                >
                  <FaPlus className="mr-2" /> Add Service
                </button>
              </div>
              
              {showServiceForm && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 backdrop-blur p-4 sm:p-6 rounded-xl mb-6 border border-gray-700"
                >
                  <h3 className="text-xl font-bold text-white mb-4">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-1">Service Name</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Price</label>
                      <div className="flex">
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                          value={newService.price}
                          onChange={(e) => setNewService({...newService, price: e.target.value})}
                        />
                        <select
                          className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-lg px-2 text-white focus:outline-none"
                          value={newService.priceType}
                          onChange={(e) => setNewService({...newService, priceType: e.target.value})}
                        >
                          <option value="hour">per hour</option>
                          <option value="session">per session</option>
                          <option value="project">per project</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Duration</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={newService.duration}
                        onChange={(e) => setNewService({...newService, duration: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Max Capacity</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={newService.maxCapacity}
                        onChange={(e) => setNewService({...newService, maxCapacity: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Description</label>
                      <textarea
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        rows={3}
                        value={newService.description}
                        onChange={(e) => setNewService({...newService, description: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Available Times</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={newService.availableTimes}
                        onChange={(e) => setNewService({...newService, availableTimes: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Tags</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={newService.tags}
                        onChange={(e) => setNewService({...newService, tags: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => setShowServiceForm(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg order-2 sm:order-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addService}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg order-1 sm:order-2"
                    >
                      {editingService ? "Update Service" : "Add Service"}
                    </button>
                  </div>
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {studioProfile.services.map(service => (
                  <div 
                    key={service.id} 
                    className="bg-gray-900/50 backdrop-blur rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start mb-4 gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <p className="text-purple-400 font-bold text-xl mt-1">
                          ${service.price} <span className="text-sm font-normal text-gray-400">/{service.priceType}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2 self-end sm:self-auto">
                        <button 
                          onClick={() => editService(service)}
                          className="text-gray-400 hover:text-yellow-400 p-1"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteService(service.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-white ml-2">{service.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Capacity:</span>
                        <span className="text-white ml-2">{service.maxCapacity} people</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-500">Available Times:</span>
                        <span className="text-white ml-2">{service.availableTimes}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-500">Tags:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {service.tags.split(',').map((tag, index) => (
                            <span 
                              key={index} 
                              className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'equipment':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700 overflow-visible">
              <h3 className={`text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaDrum className="mr-3 text-green-400" /> Studio Equipment
              </h3>
              
              <DropdownSelect
                options={equipmentOptions}
                selectedItems={studioProfile.equipment}
                onAdd={(item) => addToList('equipment', item)}
                onRemove={(item) => removeFromList('equipment', item)}
                placeholder="Search or add equipment..."
              />
              
              <h3 className={`text-xl font-bold mt-8 mb-4 flex items-center ${specialGothic.className}`}>
                <FaImage className="mr-3 text-blue-400" /> Studio Type
              </h3>
              
              <DropdownSelect
                options={studioTypeOptions}
                selectedItems={studioProfile.studioTypes}
                onAdd={(item) => addToList('studioTypes', item)}
                onRemove={(item) => removeFromList('studioTypes', item)}
                placeholder="Search or add studio types..."
              />
              
              <h3 className={`text-xl font-bold mt-8 mb-4 flex items-center ${specialGothic.className}`}>
                <FaUser className="mr-3 text-yellow-400" /> Languages Spoken
              </h3>
              
              <DropdownSelect
                options={languageOptions}
                selectedItems={studioProfile.languages}
                onAdd={(item) => addToList('languages', item)}
                onRemove={(item) => removeFromList('languages', item)}
                placeholder="Search or add languages..."
              />
              
              <h3 className={`text-xl font-bold mt-8 mb-4 flex items-center ${specialGothic.className}`}>
                <FaMusic className="mr-3 text-red-400" /> Preferred Genres
              </h3>
              
              <DropdownSelect
                options={genreOptions}
                selectedItems={studioProfile.preferredGenres}
                onAdd={(item) => addToList('preferredGenres', item)}
                onRemove={(item) => removeFromList('preferredGenres', item)}
                placeholder="Search or add genres..."
              />
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaCalendarAlt className="mr-3 text-purple-400" /> Studio Schedule
              </h3>
              
              <div className="space-y-4">
                {daysOfWeek.map(day => {
                  const daySchedule = studioProfile.schedule[day] || { open: false, start: "", end: "" };
                  const dayName = day.charAt(0).toUpperCase() + day.slice(1);

                  return (
                    <div key={day} className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                        <h4 className="font-bold text-lg">{dayName}</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={daySchedule.open}
                            onChange={(e) => handleScheduleChange(day, 'open', e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          <span className="ml-3 text-sm">
                            {daySchedule.open ? 'Open' : 'Closed'}
                          </span>
                        </label>
                      </div>
                      
                      {daySchedule.open && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-2">Opening Time</label>
                            <input
                              type="time"
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                              value={daySchedule.start}
                              onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-2">Closing Time</label>
                            <input
                              type="time"
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                              value={daySchedule.end}
                              onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      
      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaImage className="mr-3 text-purple-400" /> Studio Gallery
              </h3>
              
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-4">Studio Avatar</h4>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-0.5 rounded-full">
                    <div className="bg-gray-800 rounded-full p-1">
                      <img 
                        src={studioProfile.avatarImage || "/studio/avatar.png"} 
                        alt="Studio Avatar" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto">
                    Change Avatar
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">Gallery Images</h4>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
                  {studioProfile.galleryImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Studio ${index + 1}`} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                        <button className="text-red-500 bg-white p-2 rounded-full">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center h-48 cursor-pointer hover:bg-gray-700/30 transition-colors">
                    <div className="text-center">
                      <FaPlus className="text-gray-400 text-2xl mx-auto mb-2" />
                      <span className="text-gray-400">Add Image</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaEye className="mr-3 text-purple-400" /> Studio Settings
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Amenities</h4>
                  
                  <DropdownSelect
                    options={amenityOptions}
                    selectedItems={studioProfile.additionalInfo.amenities}
                    onAdd={(item) => addToList('additionalInfo', item)}
                    onRemove={(item) => removeFromList('additionalInfo', item)}
                    placeholder="Search or add amenities..."
                  />
                </div>
                
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Studio Rules</h4>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={4}
                    value={studioProfile.additionalInfo.rules}
                    onChange={(e) => setStudioProfile(prev => ({
                      ...prev,
                      additionalInfo: {
                        ...prev.additionalInfo,
                        rules: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Cancellation Policy</h4>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={3}
                    value={studioProfile.additionalInfo.cancellationPolicy}
                    onChange={(e) => setStudioProfile(prev => ({
                      ...prev,
                      additionalInfo: {
                        ...prev.additionalInfo,
                        cancellationPolicy: e.target.value
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const router = useRouter(); // Initialize router

  const save = async () => {
    console.log(studioProfile);
    const json_success = await updateStudioProfile(1, studioProfile);
    if (json_success?.success) {
      console.log("settings data updated")
      setShowSuccess(true);
      // auto-hide after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
    router.push('/pages/studio/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8 overflow-visible">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${specialGothic.className}`}>
            Manage Studio Profile
          </h1>
          
          {/* Modern Tab Navigation */}
          <div className="w-full lg:w-auto">
            <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-full p-1 border border-gray-500 border-t-white/30 border-l-white/30 shadow-2xl">
              <div className="flex flex-wrap justify-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center ${
                      activeTab === tab.id
                        ? 'text-white opacity-100 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]'
                        : 'text-white opacity-50 hover:text-white'
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
                      <span className="ml-1 hidden sm:inline">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    
      <div className='flex items-center justify-center mt-8'>
        <button className={`w-full sm:w-45 h-12 py-3 bg-gradient-to-r from-purple-600 to-blue-800 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all duration-300 font-bold ${specialGothic.className} flex items-center justify-center`}
          onClick={save}
        >
          <span className="mr-2"></span> Save
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 backdrop-blur-sm z-50 max-w-[90vw]"
          >
            <FaCheckCircle className="text-xl" />
            <span className="font-semibold text-sm sm:text-base">Profile saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
