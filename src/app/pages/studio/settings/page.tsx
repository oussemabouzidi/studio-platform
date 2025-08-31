'use client';
import React, { useEffect, useState } from 'react';
import { 
  FaMoneyBillWave, 
  FaUser, 
  FaBell, 
  FaLock, 
  FaGlobe, 
  FaQuestionCircle,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSignOutAlt,
  FaLink,
  FaUnlink,
  FaCalendarAlt,
  FaStar,
  FaHistory,
  FaCreditCard,
  FaReceipt,
  FaArrowLeft
} from 'react-icons/fa';
import { specialGothic } from '@/app/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsData } from '../types';
import { getSettings, updateSettings } from '../services/api';
import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  // UI states
  const [activeTab, setActiveTab] = useState('payouts');
  const [showPassword, setShowPassword] = useState(false);

  // Consolidated data state
  const [settingsData, setSettingsData] = useState<SettingsData>({
    payoutMethods: [
      { id: 1, type: 'Bank Account', last4: '1234', primary: true },
      { id: 2, type: 'PayPal', email: 'artist@example.com', primary: false }
    ],
    payoutHistory: [
      { id: 1, date: '2025-07-15', amount: 1200.00, method: 'Bank Transfer', status: 'Completed' },
      { id: 2, date: '2025-06-22', amount: 850.50, method: 'PayPal', status: 'Processing' },
      { id: 3, date: '2025-05-10', amount: 1500.00, method: 'Bank Transfer', status: 'Completed' }
    ],
    connectedAccounts: [
      { id: 1, provider: 'Google', connected: true },
      { id: 2, provider: 'PayPal', connected: true }
    ],
    notifications: {
      bookingConfirmation: { email: true, sms: false, push: true },
      bookingReminder: { email: true, sms: false, push: true },
      bookingAttendance: { email: true, sms: false, push: true },
      artistReview: { email: true, sms: false, push: true },
      platformNews: { email: false, sms: false, push: false },
      payoutUpdates: { email: true, sms: false, push: true }
    },
    privacySettings: {
      profileVisibility: 'public',
      showReviews: true,
      analyticsTracking: true
    },
    securitySettings: {
      twoFactorAuth: false
    },
    regionalSettings: {
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD',
      timeFormat: '12h'
    }
  });

  // get settings data
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings(1);
        setSettingsData(data);
        console.log(data);
        console.log("settings data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const save = async () => {
    const json_success = await updateSettings(1, settingsData);
    if (json_success?.success) {
      console.log("settings data updated")
      setShowSuccess(true);
      // auto-hide after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
    router.push('/pages/studio/dashboard');
  };

  // Data handlers
  const toggleNotification = (type: keyof SettingsData['notifications'], method: string) => {
    setSettingsData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: {
          ...prev.notifications[type],
          [method]: !prev.notifications[type][method as keyof typeof prev.notifications[typeof type]]
        }
      }
    }));
  };

  const toggleAccountConnection = (id: number) => {
    setSettingsData(prev => ({
      ...prev,
      connectedAccounts: prev.connectedAccounts.map(account => 
        account.id === id 
          ? { ...account, connected: !account.connected } 
          : account
      )
    }));
  };

  const toggleTwoFactorAuth = () => {
    setSettingsData(prev => ({
      ...prev,
      securitySettings: {
        ...prev.securitySettings,
        twoFactorAuth: !prev.securitySettings.twoFactorAuth
      }
    }));
  };

  const makePrimaryPayoutMethod = (id: number) => {
    setSettingsData(prev => ({
      ...prev,
      payoutMethods: prev.payoutMethods.map(method => ({
        ...method,
        primary: method.id === id
      }))
    }));
  };

  const deletePayoutMethod = (id: number) => {
    setSettingsData(prev => ({
      ...prev,
      payoutMethods: prev.payoutMethods.filter(method => method.id !== id)
    }));
  };

  // Define tabs for settings
  const tabs = [
    { id: 'payouts', label: 'Payouts', icon: <FaMoneyBillWave className="md:mr-2" /> },
    { id: 'account', label: 'Account', icon: <FaUser className="md:mr-2" /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell className="md:mr-2" /> },
    { id: 'privacy', label: 'Privacy', icon: <FaEye className="md:mr-2" /> },
    { id: 'security', label: 'Security', icon: <FaLock className="md:mr-2" /> },
    { id: 'regional', label: 'Language & Region', icon: <FaGlobe className="md:mr-2" /> },
    { id: 'help', label: 'Help', icon: <FaQuestionCircle className="md:mr-2" /> },
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'payouts':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaCreditCard className="mr-3 text-purple-400" /> Payout Methods
              </h3>
              
              <div className="mb-6">
                {settingsData.payoutMethods.map(method => (
                  <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-3 bg-gray-700/50 rounded-xl border border-gray-600 gap-3">
                    <div className="flex items-center">
                      <div className="bg-gray-600 p-3 rounded-lg mr-4">
                        {method.type === 'Bank Account' ? (
                          <FaMoneyBillWave className="text-2xl text-green-400" />
                        ) : (
                          <FaCreditCard className="text-2xl text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{method.type}</h4>
                        <p className="text-gray-400 text-sm">
                          {method.type === 'Bank Account' 
                            ? `•••• ${method.last4}` 
                            : method.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3 self-end sm:self-auto">
                      {method.primary ? (
                        <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-sm">Primary</span>
                      ) : (
                        <button 
                          onClick={() => makePrimaryPayoutMethod(method.id)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
                        >
                          Make Primary
                        </button>
                      )}
                      <button 
                        onClick={() => deletePayoutMethod(method.id)}
                        className="p-2 bg-gray-700 hover:bg-red-500/20 rounded-full text-red-400 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className={`w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all duration-300 font-bold ${specialGothic.className} flex items-center justify-center`}>
                <span className="mr-2">+</span> Add Payout Method
              </button>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaHistory className="mr-3 text-green-400" /> Payout History
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-2 sm:px-4 text-left">Date</th>
                      <th className="py-3 px-2 sm:px-4 text-left">Amount</th>
                      <th className="py-3 px-2 sm:px-4 text-left">Method</th>
                      <th className="py-3 px-2 sm:px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settingsData.payoutHistory.map(payout => (
                      <tr key={payout.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="py-3 px-2 sm:px-4">{payout.date}</td>
                        <td className="py-3 px-2 sm:px-4">${payout.amount.toFixed(2)}</td>
                        <td className="py-3 px-2 sm:px-4">{payout.method}</td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payout.status === 'Completed' ? 'bg-green-900/30 text-green-400' :
                            'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {payout.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                <h4 className="font-bold mb-2">Payout Threshold</h4>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full" 
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">$350.50 until next payout</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="font-bold">$1200.00</p>
                    <p className="text-gray-400 text-sm">Total earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'account':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaLink className="mr-3 text-purple-400" /> Connected Accounts
              </h3>
              
              <div className="space-y-4">
                {settingsData.connectedAccounts.map(account => (
                  <div key={account.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600 gap-3">
                    <div className="flex items-center">
                      <div className="bg-gray-600 p-3 rounded-lg mr-4">
                        {account.provider === 'Google' ? (
                          <span className="text-white font-bold">G</span>
                        ) : (
                          <span className="text-blue-400 font-bold">P</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{account.provider}</h4>
                        <p className="text-gray-400 text-sm">
                          {account.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleAccountConnection(account.id)}
                      className={`px-4 py-2 rounded-full flex items-center justify-center w-full sm:w-auto ${
                        account.connected 
                          ? 'bg-gray-700 hover:bg-gray-600 text-red-400' 
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      } transition-colors`}
                    >
                      {account.connected ? <><FaUnlink className="mr-2" /> Disconnect</> : <><FaLink className="mr-2" /> Connect</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaLock className="mr-3 text-yellow-400" /> Change Password
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm mb-2">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button 
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                
                <div className="flex items-end md:col-span-2">
                  <button className={`w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold ${specialGothic.className}`}>
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaBell className="mr-3 text-yellow-400" /> Notification Preferences
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Booking Reminders</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NotificationToggle 
                      label="Email"
                      checked={settingsData.notifications.bookingReminder.email}
                      onChange={() => toggleNotification('bookingReminder', 'email')}
                    />
                    <NotificationToggle 
                      label="SMS"
                      checked={settingsData.notifications.bookingReminder.sms}
                      onChange={() => toggleNotification('bookingReminder', 'sms')}
                    />
                    <NotificationToggle 
                      label="Push Notification"
                      checked={settingsData.notifications.bookingReminder.push}
                      onChange={() => toggleNotification('bookingReminder', 'push')}
                    />
                  </div>
                </div>
                
                {/* Artist Reviews */}
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <FaStar className="mr-2 text-yellow-400" /> Artist Reviews
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">Notify me when artists leave reviews after sessions</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NotificationToggle 
                      label="Email"
                      checked={settingsData.notifications.artistReview.email}
                      onChange={() => toggleNotification('artistReview', 'email')}
                    />
                    <NotificationToggle 
                      label="SMS"
                      checked={settingsData.notifications.artistReview.sms}
                      onChange={() => toggleNotification('artistReview', 'sms')}
                    />
                    <NotificationToggle 
                      label="Push Notification"
                      checked={settingsData.notifications.artistReview.push}
                      onChange={() => toggleNotification('artistReview', 'push')}
                    />
                  </div>
                </div>
                
                {/* Payout Notifications */}
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-green-400" /> Payout Updates
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">Get notified about payment processing and transfers</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NotificationToggle 
                      label="Email"
                      checked={settingsData.notifications.payoutUpdates.email}
                      onChange={() => toggleNotification('payoutUpdates', 'email')}
                    />
                    <NotificationToggle 
                      label="SMS"
                      checked={settingsData.notifications.payoutUpdates.sms}
                      onChange={() => toggleNotification('payoutUpdates', 'sms')}
                    />
                    <NotificationToggle 
                      label="Push Notification"
                      checked={settingsData.notifications.payoutUpdates.push}
                      onChange={() => toggleNotification('payoutUpdates', 'push')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaEye className="mr-3 text-purple-400" /> Privacy Settings
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Profile Visibility</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PrivacyOption 
                      label="Public"
                      description="Visible to everyone"
                      selected={settingsData.privacySettings.profileVisibility === 'public'}
                      onChange={() => setSettingsData(prev => ({
                        ...prev,
                        privacySettings: {
                          ...prev.privacySettings,
                          profileVisibility: 'public'
                        }
                      }))}
                    />
                    <PrivacyOption 
                      label="Studios Only"
                      description="Visible only to studios"
                      selected={settingsData.privacySettings.profileVisibility === 'studios'}
                      onChange={() => setSettingsData(prev => ({
                        ...prev,
                        privacySettings: {
                          ...prev.privacySettings,
                          profileVisibility: 'studios'
                        }
                      }))}
                    />
                    <PrivacyOption 
                      label="Private"
                      description="Only visible to you"
                      selected={settingsData.privacySettings.profileVisibility === 'private'}
                      onChange={() => setSettingsData(prev => ({
                        ...prev,
                        privacySettings: {
                          ...prev.privacySettings,
                          profileVisibility: 'private'
                        }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Content Visibility</h4>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-3 bg-gray-800 rounded-lg gap-3">
                    <div className="flex-1">
                      <h5 className="font-semibold">Show Reviews Publicly</h5>
                      <p className="text-gray-400 text-sm">Allow others to see your studio reviews</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settingsData.privacySettings.showReviews}
                        onChange={() => setSettingsData(prev => ({
                          ...prev,
                          privacySettings: {
                            ...prev.privacySettings,
                            showReviews: !prev.privacySettings.showReviews
                          }
                        }))}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800 rounded-lg gap-3">
                    <div className="flex-1">
                      <h5 className="font-semibold">Show Earnings</h5>
                      <p className="text-gray-400 text-sm">Display your earnings on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settingsData.privacySettings.analyticsTracking}
                        onChange={() => setSettingsData(prev => ({
                          ...prev,
                          privacySettings: {
                            ...prev.privacySettings,
                            analyticsTracking: !prev.privacySettings.analyticsTracking
                          }
                        }))}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaLock className="mr-3 text-yellow-400" /> Security Settings
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">Two-Factor Authentication (2FA)</h4>
                      <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settingsData.securitySettings.twoFactorAuth}
                        onChange={toggleTwoFactorAuth}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Active Sessions</h4>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-800 rounded-lg gap-3">
                      <div className="flex-1">
                        <h5 className="font-semibold">Chrome on Windows</h5>
                        <p className="text-gray-400 text-sm">New York, USA • Last active: Today at 10:30 AM</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 text-sm mr-3">Current session</span>
                        <button className="text-red-400 hover:text-red-300">
                          <FaSignOutAlt />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-800 rounded-lg gap-3">
                      <div className="flex-1">
                        <h5 className="font-semibold">Safari on iPhone</h5>
                        <p className="text-gray-400 text-sm">Los Angeles, USA • Last active: Yesterday at 4:15 PM</p>
                      </div>
                      <button className="text-red-400 hover:text-red-300">
                        <FaSignOutAlt />
                      </button>
                    </div>
                  </div>
                  
                  <button className={`mt-4 w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold ${specialGothic.className} flex items-center justify-center`}>
                    <FaSignOutAlt className="mr-2" /> Log Out From All Devices
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
            
      case 'regional':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaGlobe className="mr-3 text-blue-400" /> Language & Regional Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Language</h4>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={settingsData.regionalSettings.language}
                    onChange={(e) => setSettingsData(prev => ({
                      ...prev,
                      regionalSettings: {
                        ...prev.regionalSettings,
                        language: e.target.value
                      }
                    }))}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Timezone</h4>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={settingsData.regionalSettings.timezone}
                    onChange={(e) => setSettingsData(prev => ({
                      ...prev,
                      regionalSettings: {
                        ...prev.regionalSettings,
                        timezone: e.target.value
                      }
                    }))}
                  >
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Currency</h4>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={settingsData.regionalSettings.currency}
                    onChange={(e) => setSettingsData(prev => ({
                      ...prev,
                      regionalSettings: {
                        ...prev.regionalSettings,
                        currency: e.target.value
                      }
                    }))}
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                  </select>
                </div>
                
                <div className="bg-gray-700/50 p-4 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4">Time Format</h4>
                  <div className="flex space-x-4">
                    <button 
                      className={`flex-1 py-2 rounded-lg ${settingsData.regionalSettings.timeFormat === '12h' ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                      onClick={() => setSettingsData(prev => ({
                        ...prev,
                        regionalSettings: {
                          ...prev.regionalSettings,
                          timeFormat: '12h'
                        }
                      }))}
                    >
                      12-hour
                    </button>
                    <button 
                      className={`flex-1 py-2 rounded-lg ${settingsData.regionalSettings.timeFormat === '24h' ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                      onClick={() => setSettingsData(prev => ({
                        ...prev,
                        regionalSettings: {
                          ...prev.regionalSettings,
                          timeFormat: '24h'
                        }
                      }))}
                    >
                      24-hour
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
            
      case 'help':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaQuestionCircle className="mr-3 text-yellow-400" /> Help & Support
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 sm:p-6 rounded-xl border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all">
                  <div className="bg-gray-700/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <FaQuestionCircle className="text-xl" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Knowledge Base</h4>
                  <p className="text-gray-400 text-sm mb-4">Find answers to common questions in our extensive help center.</p>
                  <button className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold ${specialGothic.className}`}>
                    Browse FAQs
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 sm:p-6 rounded-xl border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all">
                  <div className="bg-gray-700/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <FaCalendarAlt className="text-xl" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Contact Support</h4>
                  <p className="text-gray-400 text-sm mb-4">Reach out to our support team for personalized assistance.</p>
                  <button className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold ${specialGothic.className}`}>
                    Get Help
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 sm:p-6 rounded-xl border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all">
                  <div className="bg-gray-700/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <FaReceipt className="text-xl" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Report an Issue</h4>
                  <p className="text-gray-400 text-sm mb-4">Report bugs, studio issues, or platform concerns.</p>
                  <button className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold ${specialGothic.className}`}>
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
            
      default:
        return null;
    }
  };

  return ( 
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8">
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
            Studio Settings
          </h1>
                  
          {/* Modern Tab Navigation */}
          <div className="m-auto">
            <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-full p-1 border border-gray-500 border-t-white/30 border-l-white/30 shadow-2xl overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-special transition-colors duration-300 ${
                      activeTab === tab.id
                        ? 'text-white opacity-100 z-20'
                        : 'text-white/50 hover:text-white opacity-50 z-10'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="flex items-center relative z-20">
                      {tab.icon}
                      <span className="ml-1 hidden sm:inline">{tab.label}</span>
                    </div>

                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-600/40 backdrop-blur-3xl z-10"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
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
        
        <div className='flex items-center justify-center mt-8'>
          <button className={`w-full sm:w-45 h-12 py-3 bg-gradient-to-r from-purple-600 to-blue-800 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all duration-300 font-bold ${specialGothic.className} flex items-center justify-center`}
            onClick={save}
          >
            <span className="mr-2"></span> Save
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
            className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 backdrop-blur-sm z-50 max-w-[90vw]"
          >
            <FaCheckCircle className="text-xl" />
            <span className="font-semibold text-sm sm:text-base">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper component for notification toggles
const NotificationToggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
    <span>{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>
  </div>
);

// Helper component for privacy options
const PrivacyOption = ({ label, description, selected, onChange }) => (
  <div 
    className={`p-4 rounded-lg cursor-pointer transition-all ${
      selected 
        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]' 
        : 'bg-gray-800 hover:bg-gray-700'
    }`}
    onClick={onChange}
  >
    <div className="flex items-start mb-2">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
        selected ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
      }`}>
        {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
      </div>
      <div>
        <h5 className="font-semibold">{label}</h5>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  </div>
);