'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, number } from 'framer-motion';
import { 
  FaUsers, 
  FaBuilding, 
  FaChartBar, 
  FaCog, 
  FaMobileAlt,
  FaTabletAlt,
  FaDesktop,
  FaTrophy,
  FaExclamationTriangle,
  FaFlag
} from 'react-icons/fa';
import { Studio, User } from '../types';
import {getStudios, getArtists, apiUpdateArtistStatus, apiupdateStudioStatus, apiupdateArtistVerification} from '../service/api.js'



const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [artistCommission, setArtistCommission] = useState(1.5);
  const [studioCommission, setStudioCommission] = useState(1.0);
  const [artists, setArtists] = useState<User[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);


  //fetch user & studio data
  useEffect(() => {
    async function fetchData() {
      try {
        const studioData = await getStudios();
        const clientData = await getArtists();
        setStudios(studioData);
        setArtists(clientData)
        console.log("studio data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  

  type BookingStat = {
    priceRange: string;
    count: number;
  };

  type TimeSlot = {
    hour: string;
    bookings: number;
  };

  type TopStudio = {
    name: string;
    bookings: number;
    revenue: number;
  };

  type GamificationStat = {
    user: string;
    points: number;
    badges: number;
  };

  type DeviceUsage = {
    device: string;
    percentage: number;
  };

  type GeoDistribution = {
    country: string;
    users: number;
    percentage: number;
  };

  const userGrowthData = [
    { month: 'Jan', artists: 80, studios: 15, expected: 25 },
    { month: 'Feb', artists: 95, studios: 18, expected: 30 },
    { month: 'Mar', artists: 110, studios: 22, expected: 35 },
    { month: 'Apr', artists: 130, studios: 28, expected: 40 },
    { month: 'May', artists: 150, studios: 35, expected: 45 },
    { month: 'Jun', artists: 180, studios: 42, expected: 50 },
    { month: 'Jul', artists: 210, studios: 50, expected: 55 },
    { month: 'Aug', artists: 240, studios: 60, expected: 60 },
  ];

  const revenueHistory = {
    monthly: [
      { month: 'Jan', revenue: 32000, expected: 35000 },
      { month: 'Feb', revenue: 38000, expected: 40000 },
      { month: 'Mar', revenue: 42000, expected: 45000 },
      { month: 'Apr', revenue: 39000, expected: 42000 },
      { month: 'May', revenue: 45000, expected: 48000 },
      { month: 'Jun', revenue: 48000, expected: 50000 },
      { month: 'Jul', revenue: 51000, expected: 53000 },
      { month: 'Aug', revenue: 42800, expected: 46200 },
    ],
    yearly: [
      { year: 2021, revenue: 320000, expected: 350000 },
      { year: 2022, revenue: 450000, expected: 480000 },
      { year: 2023, revenue: 580000, expected: 620000 },
      { year: 2024, revenue: 720000, expected: 780000 },
      { year: 2025, revenue: 512400, expected: 578000 },
    ]
  };

  // Statistics data
  const userStats = {
    total: 1250,
    artists: 980,
    studios: 120,
    admins: 5,
    expectedNew: 180
  };

  const revenueStats = {
    monthly: 42800,
    yearly: 512400,
    total: 1856400,
    expectedNextMonth: 46200,
    expectedNextYear: 578000
  };

  const bookingStats: BookingStat[] = [
    { priceRange: '$0-50', count: 120 },
    { priceRange: '$50-100', count: 320 },
    { priceRange: '$100-200', count: 450 },
    { priceRange: '$200-500', count: 210 },
    { priceRange: '$500+', count: 85 }
  ];

  const timeSlots: TimeSlot[] = [
    { hour: '9-11 AM', bookings: 85 },
    { hour: '11-1 PM', bookings: 120 },
    { hour: '1-3 PM', bookings: 145 },
    { hour: '3-5 PM', bookings: 210 },
    { hour: '5-7 PM', bookings: 180 },
    { hour: '7-9 PM', bookings: 150 }
  ];

  const topStudios: TopStudio[] = [
    { name: 'Harmony Studios', bookings: 42, revenue: 5280 },
    { name: 'Sound Cave', bookings: 28, revenue: 3120 },
    { name: 'Pro Audio Lab', bookings: 25, revenue: 2950 },
    { name: 'Urban Beats', bookings: 22, revenue: 2750 },
    { name: 'Vocal Booth', bookings: 18, revenue: 2150 }
  ];

  const gamificationStats = {
    badgesIssued: 1280,
    pointsGiven: 58400,
    topUsers: [
      { user: 'Alex Johnson', points: 1250, badges: 8 },
      { user: 'Taylor Rivers', points: 980, badges: 6 },
      { user: 'Jamie Lee', points: 870, badges: 5 },
      { user: 'Sam Smith', points: 750, badges: 5 },
      { user: 'Riley Cooper', points: 680, badges: 4 }
    ]
  };

  const deviceUsage: DeviceUsage[] = [
    { device: 'Mobile', percentage: 65 },
    { device: 'Desktop', percentage: 30 },
    { device: 'Tablet', percentage: 5 }
  ];

  const geoDistribution: GeoDistribution[] = [
    { country: 'United States', users: 520, percentage: 41.6 },
    { country: 'United Kingdom', users: 180, percentage: 14.4 },
    { country: 'Canada', users: 95, percentage: 7.6 },
    { country: 'Australia', users: 78, percentage: 6.2 },
    { country: 'Germany', users: 65, percentage: 5.2 },
    { country: 'Others', users: 312, percentage: 25 }
  ];
  // Navigation tabs - Changed "Users" to "Artists"
  const tabs = [
    { id: 'artists', label: 'Artists', icon: <FaUsers /> },
    { id: 'studios', label: 'Studios', icon: <FaBuilding /> },
    { id: 'stats', label: 'Statistics', icon: <FaChartBar /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

  // Filter artists based on search
  const filteredArtists = artists.filter(artist => 
    artist.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    artist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (artist.genre && artist.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStudios = studios.filter(studio => 
    studio.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    studio.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle studio status change
  const updateStudioStatus = (id: number, status: string) => {
    setStudios(studios.map(studio => 
      studio.id === id ? { ...studio, status } : studio
    ));
    apiupdateStudioStatus(id, status);
  };

  const updateArtistStatus = (id: number) => {
    const updated = artists.map(artist => {
        if (artist.id === id) {
            const newStatus: 'active' | 'suspended' = artist.status === 'active' ? 'suspended' : 'active';
            apiUpdateArtistStatus(id, newStatus);
            return { ...artist, status: newStatus };
        }
            return artist;
    });

    setArtists(updated);
  };

  const updateArtistVerif = (id: number) => {
    const updated = artists.map(artist => {
            if (artist.id === id) {
            const newStatus: boolean =
                artist.verified === true ? false : true;
            apiupdateArtistVerification(id, newStatus);
            return { ...artist, verified: newStatus };
            }
            return artist;
        });

    setArtists(updated);
  }





  // Render artists tab
  const renderArtistsTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-special">Manage Artists</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search artists..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 w-64 font-special-regular"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Artist</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Genre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Instagram</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Verified</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredArtists.map(artist => (
              <tr key={artist.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <a href={`artist/${artist.id}`}>
                        <div className="text-sm font-medium text-white font-special-regular">{artist.full_name}</div>
                    </a>
                    {artist.verified && (
                      <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-special-regular">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-special-regular">{artist.email}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 font-special-regular">
                  {artist.genre != null ? artist.genre: "Null"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-400 font-bold font-special-regular">
                  {artist.instagram?.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-special-regular ${
                    artist.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                    artist.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-special-regular ${
                    artist.verified ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {artist.verified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-special-regular">
                  <div className="flex space-x-2">
                    {artist.status !== 'active' ? (
                      <button 
                        onClick={() => {updateArtistStatus(artist.id)}}
                        className="text-red-500 hover:text-red-400 px-3 py-1 bg-red-500/10 rounded-lg transition-colors"
                      >
                        Suspended
                      </button>
                    ) : (
                      <button 
                        onClick={() => {updateArtistStatus(artist.id)}}
                        className="text-green-500 hover:text-green-400 px-3 py-1 bg-green-500/10 rounded-lg transition-colors"
                      >
                        Activated
                      </button>
                    )}
                    <button 
                      onClick={() => {updateArtistVerif(artist.id)}}
                      className="text-blue-500 hover:text-blue-400 px-3 py-1 bg-blue-500/10 rounded-lg transition-colors"
                    >
                      {artist.verified ? 'Unverify' : 'Verify'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render studios tab
  const renderStudiosTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-special">Manage Studios</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search studios..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 w-64 font-special-regular"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Studio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Revenue</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Bookings</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredStudios.map(studio => (
              <tr key={studio.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                    <a href={`studio-details/${studio.id}`}></a>
                  <div className="text-sm font-medium text-white font-special-regular">{studio.name}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 font-special-regular">{studio.location}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-special-regular ${
                    studio.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    studio.status === 'suspend' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {studio.status.charAt(0).toUpperCase() + studio.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-400 font-bold font-special-regular">
                  ${studio.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-special-regular">
                  {studio.bookings}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-400 font-special-regular">
                  {studio.rating > 0 ? studio.rating : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-special-regular">
                  <div className="flex space-x-2">
                    {studio.status === 'active' && (
                      <button 
                        onClick={() => updateStudioStatus(studio.id, 'suspend')}
                        className="text-red-500 hover:text-red-400"
                      >
                        Suspend
                      </button>
                    )}
                    {studio.status === 'suspend' && (
                      <button 
                        onClick={() => updateStudioStatus(studio.id, 'active')}
                        className="text-green-500 hover:text-green-400"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render statistics tab
  const renderStatisticsTab = () => (
    <div className="space-y-6">
        
      {/* User Statistics */}
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 font-special">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur p-6 rounded-xl border border-purple-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Total Users</div>
            <div className="text-3xl font-bold text-white font-special">{userStats.total}</div>
            <div className="text-green-400 text-sm mt-2 font-special-regular">+{userStats.expectedNew} expected</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-blue-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Artists</div>
            <div className="text-3xl font-bold text-white font-special">{userStats.artists}</div>
            <div className="text-sm text-gray-400 mt-2 font-special-regular">{Math.round((userStats.artists / userStats.total) * 100)}% of total</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-green-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Studios</div>
            <div className="text-3xl font-bold text-white font-special">{userStats.studios}</div>
            <div className="text-sm text-gray-400 mt-2 font-special-regular">{Math.round((userStats.studios / userStats.total) * 100)}% of total</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-yellow-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Admins</div>
            <div className="text-3xl font-bold text-white font-special">{userStats.admins}</div>
          </div>
        </div>
        <hr /><br />
        {/* User Growth */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 font-special">User Growth</h2>
            <div className="flex items-end justify-between h-64 flex-1">
            {userGrowthData.map((data, index) => (
                <div key={index} className="flex flex-col items-center w-full h-full relative">
                    <div className="text-gray-400 text-sm mb-2 font-special-regular ">{data.month}</div>
                    <div className="flex justify-center items-end w-full  gap-1 h-full">
                    {/* Artists Bar */}
                    <div className="flex flex-col items-center w-1/3">
                        <div 
                        className="w-full bg-purple-600 rounded-t hover:bg-purple-500 transition-all"
                        style={{ 
                            height: `${(data.artists / 250) * 200}px`,
                            minHeight: "2px" // Ensure visibility
                        }}
                        ></div>
                        <div className="text-xs text-gray-400 mt-1 font-special-regular">Artists</div>
                    </div>
                    
                    {/* Studios Bar */}
                    <div className="flex flex-col items-center w-1/3">
                        <div 
                        className="w-full bg-blue-600 rounded-t hover:bg-blue-500 transition-all"
                        style={{ 
                            height: `${(data.studios / 60) * 200}px`,
                            minHeight: "2px"
                        }}
                        ></div>
                        <div className="text-xs text-gray-400 mt-1 font-special-regular">Studios</div>
                    </div>
                    
                    {/* Expected Bar */}
                    <div className="flex flex-col items-center w-1/3">
                        <div 
                        className="w-full bg-green-600 rounded-t hover:bg-green-500 transition-all"
                        style={{ 
                            height: `${(data.expected / 60) * 200}px`,
                            minHeight: "2px"
                        }}
                        ></div>
                        <div className="text-xs text-gray-400 mt-1 font-special-regular">Expected</div>
                    </div>
                    </div>
                </div>
            ))}
        </div>
            <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-600 rounded-sm mr-2"></div>
                <span className="text-gray-300 text-sm font-special-regular">Artists</span>
                </div>
                <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></div>
                <span className="text-gray-300 text-sm font-special-regular">Studios</span>
                </div>
                <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 rounded-sm mr-2"></div>
                <span className="text-gray-300 text-sm font-special-regular">Expected New</span>
                </div>
            </div>
            </div>
        </div>
      </div>
      
      {/* Revenue Statistics */}
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 font-special">Revenue Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur p-6 rounded-xl border border-purple-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Monthly Revenue</div>
            <div className="text-3xl font-bold text-white font-special">${(revenueStats.monthly / 1000).toFixed(1)}K</div>
            <div className="text-green-400 text-sm mt-2 font-special-regular">${(revenueStats.expectedNextMonth / 1000).toFixed(1)}K expected</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-blue-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Yearly Revenue</div>
            <div className="text-3xl font-bold text-white font-special">${(revenueStats.yearly / 1000).toFixed(1)}K</div>
            <div className="text-green-400 text-sm mt-2 font-special-regular">${(revenueStats.expectedNextYear / 1000).toFixed(1)}K expected</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-green-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Total Revenue</div>
            <div className="text-3xl font-bold text-white font-special">${(revenueStats.total / 1000000).toFixed(2)}M</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-yellow-500/30">
            <div className="text-gray-400 mb-1 font-special-regular">Avg. Revenue per Studio</div>
            <div className="text-3xl font-bold text-white font-special">${Math.round(revenueStats.total / userStats.studios).toLocaleString()}</div>
          </div>
        </div>
        <hr /><br />
        {/* Revenue History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 font-special">Monthly Revenue History</h2>
            <div className="relative h-64">
                <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-between">
                {[50000, 40000, 30000, 20000, 10000, 0].map((value, idx) => (
                    <div key={idx} className="flex items-center">
                    <div className="w-12 text-right text-gray-500 text-xs pr-2 font-special-regular">
                        ${value/1000}k
                    </div>
                    <div className="flex-1 border-t border-gray-700"></div>
                    </div>
                ))}
                </div>
                
                <div className="absolute bottom-[-25] left-12 right-0 top-0 flex justify-between items-end">
                {revenueHistory.monthly.map((data, index) => (
                    <div key={index} className="flex flex-col items-center w-full relative">
                    <div 
                        className="w-3/4 bg-purple-600 rounded-t hover:bg-purple-500 transition-all"
                        style={{ height: `${(data.revenue / 55000) * 100}px` }}
                    ></div>
                    <div 
                        className="w-3/4 bg-purple-300/30 rounded-t hover:bg-purple-200/50 transition-all"
                        style={{ height: `${(data.expected / 55000) * 100}px` }}
                    ></div>
                    <div className="text-gray-400 text-xs mt-2 font-special-regular">{data.month}</div>
                    </div>
                ))}
                </div>
            </div><br />
            <div className="mt-4 flex justify-center">
                <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 rounded-sm mr-2"></div>
                    <span className="text-gray-300 text-sm font-special-regular">Actual Revenue</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-300/50 rounded-sm mr-2"></div>
                    <span className="text-gray-300 text-sm font-special-regular">Expected Revenue</span>
                </div>
                </div>
            </div>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 font-special">Yearly Revenue History</h2>
            <div className="relative h-64">
                <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-between">
                {[800, 600, 400, 200, 0].map((value, idx) => (
                    <div key={idx} className="flex items-center">
                    <div className="w-16 text-right text-gray-500 text-xs pr-2 font-special-regular">
                        ${value}k
                    </div>
                    <div className="flex-1 border-t border-gray-700"></div>
                    </div>
                ))}
                </div>
                
                <div className="absolute bottom-[-25] left-16 right-0 top-0 flex justify-between items-end">
                {revenueHistory.yearly.map((data, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                    <div 
                        className="w-3/4 bg-blue-600 rounded-t hover:bg-blue-500 transition-all"
                        style={{ height: `${(data.revenue / 800000) * 100}px` }}
                    ></div>
                    <div 
                        className="w-3/4 bg-blue-300/30 rounded-t hover:bg-blue-200/50 transition-all"
                        style={{ height: `${(data.expected / 800000) * 100}px` }}
                    ></div>
                    <div className="text-gray-400 text-xs mt-2 font-special-regular">{data.year}</div>
                    </div>
                ))}
                </div>
            </div>
            <br />
            <div className="mt-4 flex justify-center">
                <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></div>
                    <span className="text-gray-300 text-sm font-special-regular">Actual Revenue</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-300/50 rounded-sm mr-2"></div>
                    <span className="text-gray-300 text-sm font-special-regular">Expected Revenue</span>
                </div>
                </div>
            </div>
            </div>
        </div>
      </div>
      
      {/* Bookings Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 font-special">Bookings by Price Range</h2>
          <div className="space-y-4">
            {bookingStats.map((stat, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-gray-300 font-special-regular">{stat.priceRange}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-6">
                  <div 
                    className="bg-purple-600 h-6 rounded-full"
                    style={{ width: `${(stat.count / 1185) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-white font-special-regular">{stat.count}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 font-special">Most Booked Time Slots</h2>
          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-gray-300 font-special-regular">{slot.hour}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-6">
                  <div 
                    className="bg-blue-600 h-6 rounded-full"
                    style={{ width: `${(slot.bookings / 210) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-white font-special-regular">{slot.bookings}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top Performing Studios */}
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 font-special">Top Performing Studios</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Studio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Bookings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-relative">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {topStudios.map((studio, index) => (
                <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white font-special-regular">
                      {index === 0 && <FaTrophy className="inline-block text-yellow-400 mr-2" />}
                      {studio.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-special-regular">
                    {studio.bookings}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-400 font-bold font-special-regular">
                    ${studio.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(studio.bookings / 42) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-xs text-gray-400 font-special-regular">
                        {Math.round((studio.bookings / 42) * 100)}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 font-special">Gamification Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur p-6 rounded-xl border border-purple-500/30">
              <div className="text-gray-400 mb-1 font-special-regular">Badges Issued</div>
              <div className="text-3xl font-bold text-white font-special">{gamificationStats.badgesIssued}</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-blue-500/30">
              <div className="text-gray-400 mb-1 font-special-regular">Points Given</div>
              <div className="text-3xl font-bold text-white font-special">{gamificationStats.pointsGiven.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4 font-special">Top Engaged Users</h3>
            <div className="space-y-4">
              {gamificationStats.topUsers.map((user, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 text-gray-300 font-special-regular">{index + 1}</div>
                  <div className="w-48 text-white truncate font-special-regular">{user.user}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-6 rounded-full"
                      style={{ width: `${(user.points / 1250) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-yellow-400 font-special-regular">{user.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Platform Usage by Device */}
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 font-special">Platform Usage by Device</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="relative w-64 h-64 mb-6 md:mb-0">
            {/* Full Circle Pie Chart */}
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              {/* Mobile */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="10"
                strokeDasharray={`${65 * 2.82} ${100 * 2.82}`}
                transform="rotate(-90 50 50)"
              />
              
              {/* Desktop */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none"
                stroke="#3B82F6"
                strokeWidth="10"
                strokeDasharray={`${30 * 2.82} ${100 * 2.82}`}
                strokeDashoffset={`-${65 * 2.82}`}
                transform="rotate(-90 50 50)"
              />
              
              {/* Tablet */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray={`${5 * 2.82} ${100 * 2.82}`}
                strokeDashoffset={`-${95 * 2.82}`}
                transform="rotate(-90 50 50)"
              />
              
              <circle cx="50" cy="50" r="35" fill="#1E293B" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" 
                    fill="white" fontSize="12" fontFamily="inherit" fontWeight="bold">
                Devices
              </text>
            </svg>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="space-y-4">
              {deviceUsage.map((device, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-gray-300 font-special-regular flex items-center">
                    {device.device === 'Mobile' && <FaMobileAlt className="mr-2" />}
                    {device.device === 'Desktop' && <FaDesktop className="mr-2" />}
                    {device.device === 'Tablet' && <FaTabletAlt className="mr-2" />}
                    {device.device}
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${
                        device.device === 'Mobile' ? 'bg-purple-600' : 
                        device.device === 'Desktop' ? 'bg-blue-600' : 
                        'bg-green-600'
                      }`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-white font-special-regular">
                    {device.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  // Render settings tab with updated commission sliders and reports section
  const renderSettingsTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 font-special">Admin Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commission Settings */}
        <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 font-special">Commission Rates</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 font-special-regular">
                Studio Booking Commission: <span className="text-blue-400 font-bold">{studioCommission}%</span>
              </label>
              <br />
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-xl font-special-regular">0%</span>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={studioCommission}
                  onChange={(e) => setStudioCommission(parseFloat(e.target.value))}
                  className="border-2 border-blue-800 w-full h-6 bg-gray-700 rounded-4xl appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-gray-400 text-xl font-special-regular">4%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reports and Support */}
        <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 font-special">Reports & Support</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/50">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-400 mr-2" />
                  <span className="text-gray-400 font-special-regular">Open Reports</span>
                </div>
                <div className="text-2xl font-bold text-red-400 mt-2 font-special">18</div>
              </div>
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/50">
                <div className="flex items-center">
                  <FaFlag className="text-green-400 mr-2" />
                  <span className="text-gray-400 font-special-regular">Resolved</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mt-2 font-special">42</div>
              </div>
            </div>
            
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center font-special-regular transition-colors">
              <span>Manage Support Tickets</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Security Logs */}
        <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 font-special">Security & Logs</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 font-special-regular">Login History</label>
              <div className="bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="text-sm text-gray-300 mb-2 font-special-regular">Today, 09:32 AM - Successful login</div>
                <div className="text-sm text-gray-300 mb-2 font-special-regular">Yesterday, 18:45 PM - Successful login</div>
                <div className="text-sm text-gray-300 mb-2 font-special-regular">Aug 5, 10:15 AM - Failed login attempt</div>
                <div className="text-sm text-gray-300 font-special-regular">Aug 4, 14:20 PM - Successful login</div>
              </div>
            </div>
            
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-special-regular">
              View Full Audit Log
            </button>
          </div>
        </div>
        
        {/* GDPR Compliance */}
        <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 font-special">GDPR Compliance</h3>
          <div className="space-y-4">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-between font-special-regular">
              <span>Export User Data</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-between font-special-regular">
              <span>Delete User Data</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="data-retention"
                className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="data-retention" className="ml-2 text-gray-300 font-special-regular">
                Enable automatic data retention (90 days)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#132257] to-[#777777] animate-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(126,34,206,0.15)_0%,_transparent_70%)] animate-pulse-slow"></div>
      </div>
      
      {/* Top Navigation Bar */}
      <div className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex justify-start">
            <img 
              src="/home/logo.png" 
              className='w-14 h-10 md:h-15 md:w-20 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] rounded-sm' 
              alt="Logo"  
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-full p-1 border border-gray-500 border-t-white/30 border-l-white/30 shadow-2xl">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`font-special relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 z-10 flex items-center ${
                      activeTab === tab.id
                        ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]'
                        : 'text-white hover:text-gray-400'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-600/30 backdrop-blur-3xl"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="flex justify-end items-center">
            {/*<AdminProfileDropdown />*/}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Admin Header */}
        <motion.div 
          className="flex flex-col items-center text-center mb-8 p-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-4 font-special"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl font-special-regular"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Manage artists, studios, platform statistics, and system settings
          </motion.p>
        </motion.div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'artists' && renderArtistsTab()}
            {activeTab === 'studios' && renderStudiosTab()}
            {activeTab === 'stats' && renderStatisticsTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Global Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 20s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 15, 15, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(126, 34, 206, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(126, 34, 206, 0.8);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;