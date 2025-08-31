// components/PointsSection.jsx
import { useState } from 'react';

const PointsSection = () => {
  const [points] = useState(320);
  const [level] = useState(3);
  const [nextLevelPoints] = useState(400);
  
  const rewards = [
    { id: 1, name: "1 Free Hour", points: 100, claimed: true },
    { id: 2, name: "10% Discount", points: 200, claimed: true },
    { id: 3, name: "2 Free Hours", points: 300, claimed: false },
    { id: 4, name: "20% Discount", points: 500, claimed: false },
  ];
  
  const pointHistory = [
    { id: 1, description: "Booking at Harmony Studios", points: 30, date: "2025-07-15" },
    { id: 2, description: "Booking at Urban Beats Lab", points: 50, date: "2025-07-10" },
    { id: 3, description: "Completed Profile", points: 20, date: "2025-07-01" },
    { id: 4, description: "First Booking", points: 100, date: "2025-06-25" },
  ];

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl ">
      <h2 className="text-2xl font-bold text-white mb-2 font-special-regular">My Points</h2>
      <p className="text-gray-400 mb-8 font-special-regular">Earn points for every booking and unlock rewards</p>
      
      {/* Points Summary */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-400 font-special-regular">{points}</div>
            <div className="text-gray-400 mt-2 font-special-regular">Total Points</div>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="flex justify-between text-sm text-gray-500 mb-2 font-special-regular">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full" 
                style={{ width: `${(points / nextLevelPoints) * 100}%` }}
              ></div>
            </div>
            <div className="text-right text-sm text-gray-400 mt-2 font-special-regular">
              {nextLevelPoints - points} points to next level
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-special-regular">{level}</div>
            <div className="text-gray-400 font-special-regular">Level</div>
          </div>
        </div>
      </div>
      
      {/* Rewards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 font-special-regular">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map(reward => (
            <div 
              key={reward.id} 
              className={`border rounded-xl p-4 ${
                reward.claimed 
                  ? 'border-yellow-500 bg-yellow-900/20' 
                  : 'border-gray-700 bg-gray-900'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white font-special-regular">{reward.name}</h4>
                  <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-yellow-400 ml-1 text-sm font-special-regular">{reward.points} pts</span>
                  </div>
                </div>
                {reward.claimed ? (
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-900 text-yellow-300 font-special-regular">Claimed</span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-400 font-special-regular">Locked</span>
                )}
              </div>
              {!reward.claimed && points >= reward.points && (
                <button className="font-special-regular mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium">
                  Claim Reward
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Point History */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 font-special-regular">Point History</h3>
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium font-special-regular">Description</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium font-special-regular">Points</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium font-special-regular">Date</th>
              </tr>
            </thead>
            <tbody>
              {pointHistory.map(item => (
                <tr key={item.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-850">
                  <td className="py-3 px-4 text-white font-special-regular">{item.description}</td>
                  <td className="py-3 px-4 text-right text-yellow-400 font-special-regular">+{item.points}</td>
                  <td className="py-3 px-4 text-right text-gray-400 font-special-regular">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PointsSection;