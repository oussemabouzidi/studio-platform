'use client';
import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaMusic, 
  FaMicrophone, 
  FaGlobe, 
  FaHeadphones, 
  FaUserFriends,
  FaPlay,
  FaPause,
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaSoundcloud,
  FaYoutube
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { specialGothic } from '@/app/fonts';

type Demo = {
  file: string | ArrayBuffer | null;
  title: string;
  playing: boolean;
};

type ArtistFormData = {
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

export default function ArtistProfilePage() {
  const [artistData, setArtistData] = useState<ArtistFormData>({
    fullName: 'John Artist',
    artistName: 'J-Art',
    avatarImage: '/artist/avatar.jpg',
    bio: 'Professional musician with 10+ years experience specializing in rock and jazz. I bring creativity and technical precision to every session.',
    location: 'Los Angeles, CA',
    contact: {
      email: 'john@artist.com',
      phone: '(555) 123-4567',
      instagram: '@johnartist',
      soundcloud: 'johnartist',
      youtube: 'JohnArtistOfficial'
    },
    genres: ['Rock', 'Jazz', 'Blues'],
    instruments: ['Guitar', 'Piano', 'Vocals'],
    demos: [
      {
        file: '/demo1.mp3',
        title: 'Summer Breeze - Original Track',
        playing: false
      },
      {
        file: '/demo2.mp3',
        title: 'Urban Jazz Fusion',
        playing: false
      },
      {
        file: '/demo3.mp3',
        title: 'Acoustic Sessions Vol.1',
        playing: false
      }
    ],
    collaborators: ['Sarah Drummer', 'Mike Bassist', 'Lisa Keyboardist'],
    languages: ['English', 'Spanish', 'French'],
    experienceLevel: 'pro',
    yearsOfExperience: 12,
    availability: 'Weekends and evenings, flexible for studio sessions',
    portfolio: [
      { url: '/portfolio1.jpg', title: 'Live Concert 2023', type: 'image' },
      { url: '/portfolio2.mp4', title: 'Studio Session Vlog', type: 'video' },
      { url: '/portfolio3.mp3', title: 'Jazz Improv Session', type: 'audio' },
      { url: '/portfolio4.jpg', title: 'Album Cover Art', type: 'image' }
    ]
  });

  const toggleDemoPlay = (index: number) => {
    setArtistData(prev => {
      const newDemos = [...prev.demos];
      
      // Pause all other demos
      newDemos.forEach((demo, i) => {
        if (i !== index) demo.playing = false;
      });
      
      // Toggle current demo
      newDemos[index].playing = !newDemos[index].playing;
      
      return { ...prev, demos: newDemos };
    });
  };

  const renderExperienceLevel = (level: string) => {
    switch(level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'pro': return 'Professional';
      default: return level;
    }
  };

  const renderPortfolioItem = (item: any, index: number) => {
    return (
      <motion.div 
        key={index}
        className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-all"
        whileHover={{ y: -5 }}
      >
        <div className="relative group">
          {item.type === 'image' && (
            <div className="bg-gray-700 rounded-lg w-full h-40 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-gray-600 rounded-full p-3 inline-block mb-2">
                  <FaMusic className="text-xl" />
                </div>
                <p className="text-sm">Image</p>
              </div>
            </div>
          )}
          {item.type === 'video' && (
            <div className="relative">
              <div className="bg-gray-700 rounded-lg w-full h-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-lg" />
                <FaPlay className="text-3xl text-white opacity-70" />
              </div>
            </div>
          )}
          {item.type === 'audio' && (
            <div className="bg-gray-700 rounded-lg w-full h-40 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-gray-600 rounded-full p-3 inline-block mb-2">
                  <FaHeadphones className="text-xl" />
                </div>
                <p className="text-sm">Audio Track</p>
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <h4 className="font-semibold text-white">{item.title}</h4>
            <div className="text-xs text-gray-400 uppercase mt-1">{item.type}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Artist Header */}
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-8 mb-12 p-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-full">
              <div className="bg-gray-800 rounded-full p-1">
                <img 
                  src={artistData.avatarImage || '/artist/avatar.jpg'} 
                  alt={artistData.artistName} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <motion.h1 
              className={`text-3xl md:text-4xl font-bold mb-2 ${specialGothic.className}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {artistData.artistName}
              <span className="text-purple-400 text-xl font-normal ml-3">
                ({artistData.fullName})
              </span>
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-purple-400 mr-2" />
                <span>{artistData.location}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <span className="text-green-400">Available</span>
              </div>
              
              <div className="bg-purple-900/30 px-3 py-1 rounded-full text-sm">
                {renderExperienceLevel(artistData.experienceLevel)}
              </div>
              
              {artistData.yearsOfExperience && (
                <div className="bg-blue-900/30 px-3 py-1 rounded-full text-sm">
                  {artistData.yearsOfExperience} years experience
                </div>
              )}
            </motion.div>
            
            <motion.p 
              className="text-gray-400 max-w-2xl"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {artistData.bio}
            </motion.p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Genres & Instruments */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaMusic className="mr-3 text-purple-400" /> Musical Expertise
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaMusic className="mr-2 text-yellow-400" /> Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artistData.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 px-3 py-1.5 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaMicrophone className="mr-2 text-green-400" /> Instruments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artistData.instruments.map((instrument, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-green-900/30 to-blue-900/30 px-3 py-1.5 rounded-full text-sm"
                      >
                        {instrument}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Demo Tracks */}
            {artistData.demos.length > 0 && (
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                  <FaHeadphones className="mr-3 text-blue-400" /> Demo Tracks
                </h2>
                
                <div className="space-y-4">
                  {artistData.demos.map((demo, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-900/50 backdrop-blur rounded-xl p-5 border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{demo.title}</h3>
                          <p className="text-gray-400 text-sm">Track {index + 1} of {artistData.demos.length}</p>
                        </div>
                        
                        <button 
                          onClick={() => toggleDemoPlay(index)}
                          className={`rounded-full w-12 h-12 flex items-center justify-center ${
                            demo.playing 
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {demo.playing ? <FaPause /> : <FaPlay className="ml-1" />}
                        </button>
                      </div>
                      
                      {demo.playing && (
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '65%' }}
                            transition={{ duration: 30 }}
                          />
                        </div>
                      )}
                      
                      {demo.playing && (
                        <div className="flex justify-between text-gray-400 text-sm mt-2">
                          <span>1:25</span>
                          <span>3:45</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Portfolio */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaMusic className="mr-3 text-yellow-400" /> Portfolio
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artistData.portfolio.map((item, index) => (
                  <AnimatePresence key={index}>
                    {renderPortfolioItem(item, index)}
                  </AnimatePresence>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaUserFriends className="mr-3 text-green-400" /> Contact Artist
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="bg-purple-900/30 p-2 rounded-lg mr-3">
                    <FaEnvelope className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{artistData.contact.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                    <FaPhone className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium">{artistData.contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="bg-pink-900/30 p-2 rounded-lg mr-3">
                    <FaInstagram className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Instagram</p>
                    <p className="font-medium">{artistData.contact.instagram}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="bg-orange-900/30 p-2 rounded-lg mr-3">
                    <FaSoundcloud className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">SoundCloud</p>
                    <p className="font-medium">{artistData.contact.soundcloud}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                  <div className="bg-red-900/30 p-2 rounded-lg mr-3">
                    <FaYoutube className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">YouTube</p>
                    <p className="font-medium">{artistData.contact.youtube}</p>
                  </div>
                </div>
              </div>
              
              <button className={`w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold ${specialGothic.className}`}>
                Send Booking Request
              </button>
            </motion.div>
            
            {/* Languages & Availability */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaGlobe className="mr-3 text-blue-400" /> Languages & Availability
              </h2>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {artistData.languages.map((lang, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-3 py-1 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Availability</h3>
                <div className="bg-gray-900/50 backdrop-blur rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-300">{artistData.availability}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Collaborators */}
            {artistData.collaborators.length > 0 && (
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h2 className={`text-2xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                  <FaUserFriends className="mr-3 text-green-400" /> Frequent Collaborators
                </h2>
                
                <div className="space-y-3">
                  {artistData.collaborators.map((collab, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                      <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <span className="text-xs">C{index + 1}</span>
                      </div>
                      <p className="font-medium">{collab}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}