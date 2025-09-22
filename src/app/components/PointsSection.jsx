// components/PointsSection.jsx
import { useState, useEffect } from 'react';
import { getGamificationData } from '../pages/client/service/api';

const PointsSection = () => {
  const [gamificationData, setGamificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Normal levels data
  const normalLevels = [
    { level: 1, name: "Rising Star", description: "Signed up & verified", perks: "Listed in search, can receive bookings", minBookings: 0, minRating: 0 },
    { level: 2, name: "Crowd Pleaser", description: "3+ bookings, 75%+ reviews", perks: "Highlighted profile", minBookings: 3, minRating: 75 },
    { level: 3, name: "Stage Ready", description: "7+ bookings, 80%+ reviews", perks: "Small ranking boost", minBookings: 7, minRating: 80 },
    { level: 4, name: "Spotlight Act", description: "12+ bookings, 85%+ reviews", perks: "Featured placement in local searches", minBookings: 12, minRating: 85 },
    { level: 5, name: "Chart Climber", description: "18+ bookings, 88%+ reviews", perks: "Priority in category listings", minBookings: 18, minRating: 88 },
    { level: 6, name: "Main Stage", description: "25+ bookings, 90%+ reviews", perks: "Premium analytics & insights", minBookings: 25, minRating: 90 },
    { level: 7, name: "Headliner", description: "35+ bookings, 92%+ reviews", perks: "Top search placement", minBookings: 35, minRating: 92 },
    { level: 8, name: "Superstar", description: "45+ bookings, 94%+ reviews", perks: "Exclusive promo campaigns", minBookings: 45, minRating: 94 },
    { level: 9, name: "Legend", description: "60+ bookings, 95%+ reviews", perks: "Lower commission (-1%)", minBookings: 60, minRating: 95 },
    { level: 10, name: "Icon", description: "80+ bookings, 97%+ reviews", perks: "Top banner placement, special media features", minBookings: 80, minRating: 97 }
  ];
  
  // XP levels data
  const xpLevels = [
    { level: 1, name: "Listener", minPoints: 0, maxPoints: 50, reward: "Welcome badge" },
    { level: 2, name: "Explorer", minPoints: 51, maxPoints: 100, reward: "Exclusive updates on new listings" },
    { level: 3, name: "Backstage Pass", minPoints: 101, maxPoints: 200, reward: "Early access to booking slots" },
    { level: 4, name: "Fan Club", minPoints: 201, maxPoints: 300, reward: "Special recognition badge" },
    { level: 5, name: "Talent Scout", minPoints: 301, maxPoints: 400, reward: "5% discount on next booking" },
    { level: 6, name: "VIP", minPoints: 401, maxPoints: 500, reward: "Priority booking options" },
    { level: 7, name: "Insider", minPoints: 501, maxPoints: 650, reward: "Exclusive member-only offers" },
    { level: 8, name: "Patron", minPoints: 651, maxPoints: 800, reward: "10% discount on 1 booking/month" },
    { level: 9, name: "Ambassador", minPoints: 801, maxPoints: 1000, reward: "Featured as a top supporter in community page" },
    { level: 10, name: "Legend", minPoints: 1001, maxPoints: Infinity, reward: "Permanent VIP perks & premium support" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getGamificationData(101);
        setGamificationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-8"></div>
          <div className="h-40 bg-gray-700 rounded mb-8"></div>
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-60 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl">
        <div className="text-red-400 text-center py-8">Error: {error}</div>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl">
        <div className="text-white text-center py-8">No gamification data found</div>
      </div>
    );
  }

  const { points, normal_level, xp_level, perks, rewards } = gamificationData;
  
  // Find current normal level
  const currentNormalLevel = normalLevels.find(level => level.level === normal_level) || normalLevels[0];
  const nextNormalLevel = normalLevels.find(level => level.level === normal_level + 1);
  
  // Find current XP level
  const currentXpLevel = xpLevels.find(level => level.level === xp_level) || xpLevels[0];
  const nextXpLevel = xpLevels.find(level => level.level === xp_level + 1);
  
  // Calculate progress to next levels
  const normalProgress = nextNormalLevel 
    ? ((points - currentNormalLevel.minBookings) / (nextNormalLevel.minBookings - currentNormalLevel.minBookings)) * 100
    : 100;
    
  const xpProgress = nextXpLevel
    ? ((points - currentXpLevel.minPoints) / (nextXpLevel.minPoints - currentXpLevel.minPoints)) * 100
    : 100;

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2 font-special-regular">My Gamification Progress</h2>
      <p className="text-gray-400 mb-8 font-special-regular">Earn points for every booking and unlock rewards</p>
      
      {/* Points Summary */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-400 font-special-regular">{points}</div>
            <div className="text-gray-400 mt-2 font-special-regular">Total Points</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-special-regular">{normal_level}</div>
            <div className="text-gray-400 font-special-regular">Normal Level</div>
            <div className="text-sm text-white mt-1 font-special-regular">{currentNormalLevel.name}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-special-regular">{xp_level}</div>
            <div className="text-gray-400 font-special-regular">XP Level</div>
            <div className="text-sm text-white mt-1 font-special-regular">{currentXpLevel.name}</div>
          </div>
        </div>
      </div>
      
      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Normal Level Progress */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-special-regular">Normal Level Progress</h3>
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-400 font-special-regular">Level {normal_level}: {currentNormalLevel.name}</span>
            {nextNormalLevel && (
              <span className="text-sm text-gray-400 font-special-regular">Level {normal_level + 1}: {nextNormalLevel.name}</span>
            )}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full" 
              style={{ width: `${Math.min(100, Math.max(0, normalProgress))}%` }}
            ></div>
          </div>
          {nextNormalLevel ? (
            <div className="text-right text-sm text-gray-400 font-special-regular">
              {nextNormalLevel.minBookings - points} points to next level
            </div>
          ) : (
            <div className="text-right text-sm text-yellow-400 font-special-regular">
              Maximum level reached!
            </div>
          )}
        </div>
        
        {/* XP Level Progress */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-special-regular">XP Level Progress</h3>
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-400 font-special-regular">Level {xp_level}: {currentXpLevel.name}</span>
            {nextXpLevel && (
              <span className="text-sm text-gray-400 font-special-regular">Level {xp_level + 1}: {nextXpLevel.name}</span>
            )}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full" 
              style={{ width: `${Math.min(100, Math.max(0, xpProgress))}%` }}
            ></div>
          </div>
          {nextXpLevel ? (
            <div className="text-right text-sm text-gray-400 font-special-regular">
              {nextXpLevel.minPoints - points} points to next level
            </div>
          ) : (
            <div className="text-right text-sm text-yellow-400 font-special-regular">
              Maximum level reached!
            </div>
          )}
        </div>
      </div>
      
      {/* Current Perks & Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Perks */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-special-regular">Your Perks</h3>
          {perks && perks.length > 0 ? (
            <ul className="space-y-2">
              {perks.map((perk, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-special-regular">{perk.trim()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 font-special-regular">No perks yet. Reach higher levels to unlock perks!</p>
          )}
        </div>
        
        {/* Rewards */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-special-regular">Your Rewards</h3>
          {rewards && rewards.length > 0 ? (
            <ul className="space-y-2">
              {rewards.map((reward, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-special-regular">{reward.trim()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 font-special-regular">No rewards yet. Earn more points to unlock rewards!</p>
          )}
        </div>
      </div>
      
      {/* Level Information */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 font-special-regular">Level Information</h3>
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Normal Levels */}
            <div className="p-4 border-r border-gray-800">
              <h4 className="text-lg font-semibold text-blue-400 mb-4 font-special-regular">Normal Levels</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {normalLevels.map(level => (
                  <div 
                    key={level.level} 
                    className={`p-4 rounded-lg ${
                      level.level === normal_level 
                        ? 'bg-blue-900/30 border border-blue-500' 
                        : 'bg-gray-800/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-white font-special-regular">
                          Level {level.level} - {level.name}
                        </h5>
                        <p className="text-sm text-gray-400 mt-1 font-special-regular">{level.description}</p>
                        <p className="text-sm text-yellow-400 mt-2 font-special-regular">Perk: {level.perks}</p>
                      </div>
                      {level.level === normal_level && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300 font-special-regular">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* XP Levels */}
            <div className="p-4">
              <h4 className="text-lg font-semibold text-green-400 mb-4 font-special-regular">XP Levels</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {xpLevels.map(level => (
                  <div 
                    key={level.level} 
                    className={`p-4 rounded-lg ${
                      level.level === xp_level 
                        ? 'bg-green-900/30 border border-green-500' 
                        : 'bg-gray-800/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-white font-special-regular">
                          Level {level.level} - {level.name}
                        </h5>
                        <p className="text-sm text-gray-400 mt-1 font-special-regular">
                          {level.minPoints} - {level.maxPoints === Infinity ? '∞' : level.maxPoints} points
                        </p>
                        <p className="text-sm text-yellow-400 mt-2 font-special-regular">Reward: {level.reward}</p>
                      </div>
                      {level.level === xp_level && (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-300 font-special-regular">
                          Current
                        </span>
                      )}
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
};

export default PointsSection;