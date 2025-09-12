'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaFlag,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { Studio, User } from '../types';
import {getStudios, getArtists, apiUpdateArtistStatus, apiupdateStudioStatus, apiupdateArtistVerification, getStats} from '../service/api.js'

// Define types for the API response
type GamificationData = {
  userType: string;
  avgPoints: number;
  maxLevel: number;
  totalUsers: number;
};

type DeviceUsageData = {
  device: string;
  count: number;
  percentage: string;
};

type CountryData = {
  country: string;
  users: number;
  percentage: string;
};

// Add missing state interfaces
interface UserStats {
  total: number;
  artists: number;
  studios: number;
  admins: number;
}

interface RevenueStats {
  currentMonth: number;
  currentYear: number;
  total: number;
}

interface UserGrowthData {
  month: string;
  artists: number;
  studios: number;
  expected: number;
}

interface BookingStats {
  priceRange: string;
  count: number;
}

interface TimeSlot {
  hour: string;
  bookings: number;
}

interface TopStudio {
  name: string;
  bookings: number;
  revenue: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [artistCommission, setArtistCommission] = useState(1.5);
  const [studioCommission, setStudioCommission] = useState(1.0);
  const [artists, setArtists] = useState<User[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Add missing state variables
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    artists: 0,
    studios: 0,
    admins: 0
  });
  
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    currentMonth: 0,
    currentYear: 0,
    total: 0
  });
  const [bookingStatsData, setBookingStatsData] = useState<BookingStats[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [topStudiosData, setTopStudiosData] = useState<TopStudio[]>([]);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Fetch all data including stats
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [studioData, clientData, statsData] = await Promise.all([
          getStudios(),
          getArtists(),
          getStats()
        ]);

        setStudios(studioData);
        setArtists(clientData);
        
        // Now statsData contains all the comprehensive information
        setStats(statsData);
        console.log("Comprehensive Stats:", statsData);
        
        // Set individual state variables
        if (statsData) {
          setUserStats(statsData.userStats || {
            total: 0,
            artists: 0,
            studios: 0,
            admins: 0
          });
          
          // Process user growth data
          if (statsData.userGrowth) {
            const growthData = statsData.userGrowth.artists.map((artistData: any, index: number) => {
              const studioData = statsData.userGrowth.studios.find((s: any) => s.month === artistData.month) || { count: 0 };
              return {
                month: artistData.month,
                artists: artistData.count,
                studios: studioData.count,
                expected: Math.round((artistData.count + studioData.count) * 1.1) // 10% growth expectation
              };
            });
            setUserGrowthData(growthData);
          }
          
          setRevenueStats(statsData.revenueStats || {
            currentMonth: 0,
            currentYear: 0,
            total: 0
          });
          
          setBookingStatsData(statsData.bookingStats?.priceRanges || []);
          setTimeSlots(statsData.bookingStats?.timeSlots || []);
          setTopStudiosData(statsData.topStudios || []);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Process revenue history from API data
  const revenueHistory = {
    monthly: stats?.revenueStats?.monthly?.map((item: any) => ({
      month: item.month,
      revenue: item.revenue,
      expected: item.revenue * 1.08 // 8% expected growth
    })) || [],
    yearly: stats?.revenueStats?.yearly?.map((item: any) => ({
      year: item.year,
      revenue: item.revenue,
      expected: item.revenue * 1.12 // 12% expected growth
    })) || []
  };

  // Navigation tabs
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

  // Process device usage data
  const processedDeviceUsage = stats?.deviceUsage || [];

  // Process geographic distribution data
  const processedGeoDistribution = stats?.artistCountries || [];

  // Calculate gamification stats from API data
// Replace the problematic gamificationStats calculation with this:
const apiGamificationStats = stats?.gamification 
  ? Array.isArray(stats.gamification) 
    ? {
        badgesIssued: stats.gamification.reduce((sum: number, item: any) => sum + item.maxLevel, 0),
        pointsGiven: Math.round(stats.gamification.reduce((sum: number, item: any) => sum + (item.avgPoints * item.totalUsers), 0)),
        topUsers: stats.gamification.topUsers ? stats.gamification.topUsers.map((user: any) => ({
          user: user.name,
          points: user.points,
          badges: user.level
        })) : []
      }
    : stats.gamification.summary 
      ? {
          badgesIssued: stats.gamification.summary.totalBadges || 0,
          pointsGiven: stats.gamification.summary.totalPoints || 0,
          topUsers: stats.gamification.topUsers ? stats.gamification.topUsers.map((user: any) => ({
            user: user.name,
            points: user.points,
            badges: user.level
          })) : []
        }
      : {
          badgesIssued: 0,
          pointsGiven: 0,
          topUsers: []
        }
  : {
      badgesIssued: 0,
      pointsGiven: 0,
      topUsers: []
    };

  // Render artists tab
  const renderArtistsTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white font-special">Manage Artists</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search artists..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 w-full font-special-regular"
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
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Artist</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden sm:table-cell">Genre</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden md:table-cell">Instagram</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Status</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden sm:table-cell">Verified</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredArtists.map(artist => (
              <tr key={artist.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-2 py-4 md:px-4 whitespace-nowrap">
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
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-gray-300 font-special-regular hidden sm:table-cell">
                  {artist.genre != null ? artist.genre: "Null"}
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-purple-400 font-bold font-special-regular hidden md:table-cell">
                  {artist.instagram?.toLocaleString()}
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-special-regular ${
                    artist.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                    artist.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                  </span>
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap hidden sm:table-cell">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-special-regular ${
                    artist.verified ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {artist.verified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm font-special-regular">
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                    {artist.status !== 'active' ? (
                      <button 
                        onClick={() => {updateArtistStatus(artist.id)}}
                        className="text-red-500 hover:text-red-400 px-2 py-1 bg-red-500/10 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        Suspended
                      </button>
                    ) : (
                      <button 
                        onClick={() => {updateArtistStatus(artist.id)}}
                        className="text-green-500 hover:text-green-400 px-2 py-1 bg-green-500/10 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        Activated
                      </button>
                    )}
                    <button 
                      onClick={() => {updateArtistVerif(artist.id)}}
                      className="text-blue-500 hover:text-blue-400 px-2 py-1 bg-blue-500/10 rounded-lg transition-colors text-xs sm:text-sm"
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
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white font-special">Manage Studios</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search studios..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 w-full font-special-regular"
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
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Studio</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden sm:table-cell">Location</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Status</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden md:table-cell">Revenue</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden lg:table-cell">Bookings</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden md:table-cell">Rating</th>
              <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredStudios.map(studio => (
              <tr key={studio.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-2 py-4 md:px-4 whitespace-nowrap">
                    <a href={`studio-details/${studio.id}`}>
                      <div className="text-sm font-medium text-white font-special-regular">{studio.name}</div>
                    </a>
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-gray-300 font-special-regular hidden sm:table-cell">{studio.location}</td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-special-regular ${
                    studio.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    studio.status === 'suspend' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {studio.status.charAt(0).toUpperCase() + studio.status.slice(1)}
                  </span>
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-purple-400 font-bold font-special-regular hidden md:table-cell">
                  ${studio.revenue?.toLocaleString() || '0'}
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-white font-special-regular hidden lg:table-cell">
                  {studio.bookings || '0'}
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-yellow-400 font-special-regular hidden md:table-cell">
                  {studio.rating > 0 ? studio.rating : 'N/A'}
                </td>
                <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm font-special-regular">
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                    {studio.status === 'active' && (
                      <button 
                        onClick={() => updateStudioStatus(studio.id, 'suspend')}
                        className="text-red-500 hover:text-red-400 px-2 py-1 bg-red-500/10 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        Suspend
                      </button>
                    )}
                    {studio.status === 'suspend' && (
                      <button 
                        onClick={() => updateStudioStatus(studio.id, 'active')}
                        className="text-green-500 hover:text-green-400 px-2 py-1 bg-green-500/10 rounded-lg transition-colors text-xs sm:text-sm"
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
  const renderStatisticsTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading statistics...</div>
        </div>
      );
    }

    // Calculate expected new users based on growth trends
    const expectedNewUsers = stats?.summary?.growthRate?.artists || 0;

    return (
      <div className="space-y-6">
        {/* User Statistics - Now using real data */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">User Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-purple-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Total Users</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">{userStats.total}</div>
              <div className="text-green-400 text-xs md:text-sm mt-2 font-special-regular">
                +{expectedNewUsers}% growth rate
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-blue-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Artists</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">{userStats.artists}</div>
              <div className="text-xs md:text-sm text-gray-400 mt-2 font-special-regular">
                {userStats.total > 0 ? Math.round((userStats.artists / userStats.total) * 100) : 0}% of total
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-900/30 to-gray-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-green-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Studios</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">{userStats.studios}</div>
              <div className="text-xs md:text-sm text-gray-400 mt-2 font-special-regular">
                {userStats.total > 0 ? Math.round((userStats.studios / userStats.total) * 100) : 0}% of total
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900/30 to-gray-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-yellow-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Admins</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">{userStats.admins}</div>
            </div>
          </div>
        </div>

        {/* User Growth Chart - Now using real data */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">User Growth</h2>
          <div className="flex items-end justify-between h-48 md:h-64 flex-1 overflow-x-auto">
            {userGrowthData.map((data, index) => {
              const maxValue = Math.max(...userGrowthData.map(d => Math.max(d.artists, d.studios, d.expected)));
              return (
                <div key={index} className="flex flex-col items-center w-full h-full relative min-w-[60px]">
                  <div className="text-gray-400 text-xs md:text-sm mb-2 font-special-regular">{data.month}</div>
                  <div className="flex justify-center items-end w-full gap-1 h-full">
                    <div className="flex flex-col items-center w-1/3">
                      <div 
                        className="w-full bg-purple-600 rounded-t hover:bg-purple-500 transition-all"
                        style={{ 
                          height: maxValue > 0 ? `${(data.artists / maxValue) * 180}px` : '2px',
                          minHeight: "2px"
                        }}
                      ></div>
                      <div className="text-xs text-gray-400 mt-1 font-special-regular hidden md:block">Artists</div>
                    </div>
                    
                    <div className="flex flex-col items-center w-1/3">
                      <div 
                        className="w-full bg-blue-600 rounded-t hover:bg-blue-500 transition-all"
                        style={{ 
                          height: maxValue > 0 ? `${(data.studios / maxValue) * 180}px` : '2px',
                          minHeight: "2px"
                        }}
                      ></div>
                      <div className="text-xs text-gray-400 mt-1 font-special-regular hidden md:block">Studios</div>
                    </div>
                    
                    <div className="flex flex-col items-center w-1/3">
                      <div 
                        className="w-full bg-green-600 rounded-t hover:bg-green-500 transition-all"
                        style={{ 
                          height: maxValue > 0 ? `${(data.expected / maxValue) * 180}px` : '2px',
                          minHeight: "2px"
                        }}
                      ></div>
                      <div className="text-xs text-gray-400 mt-1 font-special-regular hidden md:block">Expected</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-600 rounded-sm mr-2"></div>
                <span className="text-gray-300 text-xs md:text-sm font-special-regular">Artists</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></div>
                <span className="text-gray-300 text-xs md:text-sm font-special-regular">Studios</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 rounded-sm mr-2"></div>
                <span className="text-gray-300 text-xs md:text-sm font-special-regular">Expected Growth</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Revenue Statistics */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Revenue Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-purple-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Monthly Revenue</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">
                ${(revenueStats.currentMonth / 1000).toFixed(1)}K
              </div>
              <div className="text-green-400 text-xs md:text-sm mt-2 font-special-regular">
                Current month
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-blue-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Yearly Revenue</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">
                ${(revenueStats.currentYear / 1000).toFixed(1)}K
              </div>
              <div className="text-green-400 text-xs md:text-sm mt-2 font-special-regular">
                Year to date
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-900/30 to-gray-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-green-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Total Revenue</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">
                ${(revenueStats.total / 1000000).toFixed(2)}M
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900/30 to-gray-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-yellow-500/30">
              <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Avg. per Booking</div>
              <div className="text-2xl md:text-3xl font-bold text-white font-special">
                ${stats?.summary?.averageBookingValue?.toFixed(0) || 0}
              </div>
            </div>
          </div>

          {/* Revenue History Charts - Now using real data */}
          <hr className="my-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Monthly Revenue History</h2>
              <div className="relative h-48 md:h-64">
                <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-between">
                  {/* Y-axis labels based on max revenue */}
                  {(() => {
                    const maxRevenue = revenueHistory.monthly.length > 0 ? 
                      Math.max(...revenueHistory.monthly.map(m => Math.max(m.revenue, m.expected))) : 1000;
                    const step = maxRevenue / 5;
                    return Array.from({length: 6}, (_, i) => maxRevenue - (i * step)).map((value, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-12 text-right text-gray-500 text-xs pr-2 font-special-regular">
                          ${(value/1000).toFixed(0)}k
                        </div>
                        <div className="flex-1 border-t border-gray-700"></div>
                      </div>
                    ));
                  })()}
                </div>
                
                <div className="absolute bottom-0 left-12 right-0 top-0 flex justify-between items-end">
                  {revenueHistory.monthly.map((data, index) => {
                    const maxRevenue = revenueHistory.monthly.length > 0 ? 
                      Math.max(...revenueHistory.monthly.map(m => Math.max(m.revenue, m.expected))) : 1000;
                    return (
                      <div key={index} className="flex flex-col items-center w-full relative">
                        <div 
                          className="w-3/4 bg-purple-600 rounded-t hover:bg-purple-500 transition-all"
                          style={{ height: maxRevenue > 0 ? `${(data.revenue / maxRevenue) * 100}px` : '0px' }}
                        ></div>
                        <div 
                          className="w-3/4 bg-purple-300/30 rounded-t hover:bg-purple-200/50 transition-all"
                          style={{ height: maxRevenue > 0 ? `${(data.expected / maxRevenue) * 100}px` : '0px' }}
                        ></div>
                        <div className="text-gray-400 text-xs mt-2 font-special-regular">{data.month}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Continue with yearly revenue chart */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Yearly Revenue History</h2>
              <div className="relative h-48 md:h-64">
                <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-between">
                  {(() => {
                    const maxRevenue = revenueHistory.yearly.length > 0 ? 
                      Math.max(...revenueHistory.yearly.map(y => Math.max(y.revenue, y.expected))) : 1000;
                    const step = maxRevenue / 4;
                    return Array.from({length: 5}, (_, i) => maxRevenue - (i * step)).map((value, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-16 text-right text-gray-500 text-xs pr-2 font-special-regular">
                          ${(value/1000).toFixed(0)}k
                        </div>
                        <div className="flex-1 border-t border-gray-700"></div>
                      </div>
                    ));
                  })()}
                </div>
                
                <div className="absolute bottom-0 left-16 right-0 top-0 flex justify-between items-end">
                  {revenueHistory.yearly.map((data, index) => {
                    const maxRevenue = revenueHistory.yearly.length > 0 ? 
                      Math.max(...revenueHistory.yearly.map(y => Math.max(y.revenue, y.expected))) : 1000;
                    return (
                      <div key={index} className="flex flex-col items-center w-full">
                        <div 
                          className="w-3/4 bg-blue-600 rounded-t hover:bg-blue-500 transition-all"
                          style={{ height: maxRevenue > 0 ? `${(data.revenue / maxRevenue) * 100}px` : '0px' }}
                        ></div>
                        <div 
                          className="w-3/4 bg-blue-300/30 rounded-t hover:bg-blue-200/50 transition-all"
                          style={{ height: maxRevenue > 0 ? `${(data.expected / maxRevenue) * 100}px` : '0px' }}
                        ></div>
                        <div className="text-gray-400 text-xs mt-2 font-special-regular">{data.year}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bookings Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Bookings by Price Range</h2>
            <div className="space-y-4">
              {bookingStatsData.map((stat, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 md:w-32 text-gray-300 text-xs md:text-sm font-special-regular">{stat.priceRange}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 md:h-6">
                    <div 
                      className="bg-purple-600 h-4 md:h-6 rounded-full"
                      style={{ width: `${(stat.count / 1185) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-10 md:w-16 text-right text-white text-xs md:text-sm font-special-regular">{stat.count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Most Booked Time Slots</h2>
            <div className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 md:w-24 text-gray-300 text-xs md:text-sm font-special-regular">{slot.hour}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 md:h-6">
                    <div 
                      className="bg-blue-600 h-4 md:h-6 rounded-full"
                      style={{ width: `${(slot.bookings / 210) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-10 md:w-16 text-right text-white text-xs md:text-sm font-special-regular">{slot.bookings}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Top Performing Studios */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Top Performing Studios</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Studio</th>
                  <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">Bookings</th>
                  <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden md:table-cell">Revenue</th>
                  <th className="px-2 py-3 md:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular hidden sm:table-cell">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topStudiosData.map((studio, index) => (
                  <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-2 py-4 md:px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white font-special-regular">
                        {index === 0 && <FaTrophy className="inline-block text-yellow-400 mr-2" />}
                        {studio.name}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-white font-special-regular">
                      {studio.bookings}
                    </td>
                    <td className="px-2 py-4 md:px-4 whitespace-nowrap text-sm text-purple-400 font-bold font-special-regular hidden md:table-cell">
                      ${studio.revenue.toLocaleString()}
                    </td>
                    <td className="px-2 py-4 md:px-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        <div className="w-20 md:w-32 bg-gray-700 rounded-full h-2.5">
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
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Gamification Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-purple-500/30">
                <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Badges Issued</div>
                <div className="text-2xl md:text-3xl font-bold text-white font-special">{apiGamificationStats.badgesIssued}</div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 backdrop-blur p-4 md:p-6 rounded-xl border border-blue-500/30">
                <div className="text-gray-400 mb-1 text-sm md:text-base font-special-regular">Points Given</div>
                <div className="text-2xl md:text-3xl font-bold text-white font-special">{apiGamificationStats.pointsGiven.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 font-special">Top Engaged Users</h3>
              <div className="space-y-4">
                {apiGamificationStats.topUsers.map((user: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 md:w-8 text-gray-300 text-xs md:text-sm font-special-regular">{index + 1}</div>
                    <div className="w-32 md:w-48 text-white truncate text-xs md:text-sm font-special-regular">{user.user}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-4 md:h-6">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 md:h-6 rounded-full"
                        style={{ width: `${(user.points / 1250) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 md:w-16 text-right text-yellow-400 text-xs md:text-sm font-special-regular">{user.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Platform Usage by Device - Using API Data */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Platform Usage by Device</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 md:mb-0 mx-auto">
                {/* Full Circle Pie Chart */}
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  {/* Calculate segments based on device usage data */}
                  {processedDeviceUsage.map((device, index) => {
                    const circumference = 2 * Math.PI * 45;
                    // Calculate the offset for each segment based on previous segments
                    const offset = processedDeviceUsage
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.percentage / 100) * circumference, 0);
                    
                    const strokeDasharray = `${(device.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -offset;
                    
                    const colors = ['#8B5CF6', '#3B82F6', '#10B981'];
                    
                    return (
                      <circle 
                        key={index}
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none"
                        stroke={colors[index]}
                        strokeWidth="10"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 50 50)"
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="35" fill="#1E293B" />
                  <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" 
                        fill="white" fontSize="12" fontFamily="inherit" fontWeight="bold">
                    Devices
                  </text>
                </svg>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="space-y-4">
                  {processedDeviceUsage.map((device, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-20 md:w-24 text-gray-300 text-xs md:text-sm font-special-regular flex items-center">
                        {device.device === 'Mobile' && <FaMobileAlt className="mr-2" />}
                        {device.device === 'Desktop' && <FaDesktop className="mr-2" />}
                        {device.device === 'Tablet' && <FaTabletAlt className="mr-2" />}
                        {device.device}
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-4 md:h-6">
                        <div 
                          className={`h-4 md:h-6 rounded-full ${
                            device.device === 'Mobile' ? 'bg-purple-600' : 
                            device.device === 'Desktop' ? 'bg-blue-600' : 
                            'bg-green-600'
                          }`}
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 md:w-16 text-right text-white text-xs md:text-sm font-special-regular">
                        {device.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution - Using API Data */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Artist Geographic Distribution</h2>
          <div className="space-y-4">
            {processedGeoDistribution.map((geo, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 md:w-40 text-gray-300 text-xs md:text-sm font-special-regular">{geo.country}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-4 md:h-6">
                  <div 
                    className="bg-purple-600 h-4 md:h-6 rounded-full"
                    style={{ width: `${geo.percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 md:w-20 text-right text-white text-xs md:text-sm font-special-regular">
                  {geo.users} ({geo.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render settings tab
  const renderSettingsTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-special">Admin Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commission Settings */}
        <div className="bg-gray-900/50 backdrop-blur p-4 md:p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 font-special">Commission Rates</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 text-sm md:text-base font-special-regular">
                Studio Booking Commission: <span className="text-blue-400 font-bold">{studioCommission}%</span>
              </label>
              <br />
              <div className="flex items-center space-x-2 md:space-x-4">
                <span className="text-gray-400 text-sm md:text-base font-special-regular">0%</span>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={studioCommission}
                  onChange={(e) => setStudioCommission(parseFloat(e.target.value))}
                  className="border-2 border-blue-800 w-full h-6 bg-gray-700 rounded-4xl appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-gray-400 text-sm md:text-base font-special-regular">4%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reports and Support */}
        <div className="bg-gray-900/50 backdrop-blur p-4 md:p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 font-special">Reports & Support</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-900/20 p-3 md:p-4 rounded-lg border border-red-700/50">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-400 mr-2 text-sm md:text-base" />
                  <span className="text-gray-400 text-xs md:text-sm font-special-regular">Open Reports</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-red-400 mt-2 font-special">18</div>
              </div>
              <div className="bg-green-900/20 p-3 md:p-4 rounded-lg border border-green-700/50">
                <div className="flex items-center">
                  <FaFlag className="text-green-400 mr-2 text-sm md:text-base" />
                  <span className="text-gray-400 text-xs md:text-sm font-special-regular">Resolved</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-green-400 mt-2 font-special">42</div>
              </div>
            </div>
            
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 md:py-3 px-4 rounded-lg flex items-center justify-center text-sm md:text-base font-special-regular transition-colors">
              <span>Manage Support Tickets</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Security Logs */}
        <div className="bg-gray-900/50 backdrop-blur p-4 md:p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 font-special">Security & Logs</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm md:text-base font-special-regular">Login History</label>
              <div className="bg-gray-800 rounded-lg p-3 md:p-4 max-h-40 overflow-y-auto">
                <div className="text-xs md:text-sm text-gray-300 mb-2 font-special-regular">Today, 09:32 AM - Successful login</div>
                <div className="text-xs md:text-sm text-gray-300 mb-2 font-special-regular">Yesterday, 18:45 PM - Successful login</div>
                <div className="text-xs md:text-sm text-gray-300 mb-2 font-special-regular">Aug 5, 10:15 AM - Failed login attempt</div>
                <div className="text-xs md:text-sm text-gray-300 font-special-regular">Aug 4, 14:20 PM - Successful login</div>
              </div>
            </div>
            
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm md:text-base font-special-regular">
              View Full Audit Log
            </button>
          </div>
        </div>
        
        {/* GDPR Compliance */}
        <div className="bg-gray-900/50 backdrop-blur p-4 md:p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 font-special">GDPR Compliance</h3>
          <div className="space-y-4">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-between text-sm md:text-base font-special-regular">
              <span>Export User Data</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-between text-sm md:text-base font-special-regular">
              <span>Delete User Data</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="data-retention"
                className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="data-retention" className="ml-2 text-gray-300 text-xs md:text-sm font-special-regular">
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
      
      {/* Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-30 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-white"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Top Navigation Bar */}
      <div className="relative ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex justify-start">
            <img 
              src="/home/logo.png" 
              className='w-14 h-10 md:h-15 md:w-20 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] rounded-sm' 
              alt="Logo"  
            />
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden md:flex justify-center">
            <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-full p-1 border border-gray-500 border-t-white/30 border-l-white/30 shadow-2xl">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`font-special relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 z-10 flex items-center ${
                      activeTab === tab.id
                        ? ' text-white z-10 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]'
                        : ' text-white opacity-50 hover:text-gray-400'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-600/30 backdrop-blur-3xl -z-10"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-20 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`text-2xl font-medium flex items-center ${
                        activeTab === tab.id
                          ? 'text-purple-400'
                          : 'text-white'
                      }`}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Admin Profile */}
          <div className="flex justify-end items-center">
            {/*<AdminProfileDropdown />*/}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-16 md:pt-8">
        {/* Admin Header */}
        <motion.div 
          className="flex flex-col items-center text-center mb-8 p-4 md:p-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-2xl md:text-4xl font-bold text-white mb-4 font-special"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl text-sm md:text-base font-special-regular"
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