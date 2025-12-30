'use client';
import React, { useEffect, useState } from 'react';
import { 
  FaCreditCard, 
  FaReceipt, 
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
  FaHistory,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa';
import { specialGothic } from '@/app/fonts';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsData } from '../../studio/types';
import { getSettings, updateSettings } from '../service/api';
import { useRouter } from 'next/navigation';

type PaymentMethod = {
  id: number;
  type: string;
  last4: string;
  expiry: string;
  primary: boolean;
};

type Invoice = {
  id: number;
  date: string;
  studio: string;
  amount: number;
  fee: number;
};

type ExtendedSettingsData = SettingsData & {
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
};

const defaultSettings: ExtendedSettingsData = {
  paymentMethods: [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', primary: true },
    { id: 2, type: 'MasterCard', last4: '1881', expiry: '08/24', primary: false }
  ],
  invoices: [
    { id: 1, date: '2025-07-15', studio: 'Echo Sound Studios', amount: 250.0, fee: 7.5 },
    { id: 2, date: '2025-06-22', studio: 'Harmony Records', amount: 180.0, fee: 5.4 },
    { id: 3, date: '2025-05-10', studio: 'Urban Beats Lab', amount: 320.0, fee: 9.6 }
  ],
  payoutMethods: [
    { id: 1, type: 'Bank Transfer', primary: true }
  ],
  payoutHistory: [],
  connectedAccounts: [
    { id: 1, provider: 'Google', connected: true },
    { id: 2, provider: 'Facebook', connected: false }
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
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('billing');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const [settingsData, setSettingsData] = useState<ExtendedSettingsData>(defaultSettings);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const id = localStorage.getItem("user_id");
        const data = await getSettings(id);
        const incoming = (data ?? {}) as Partial<ExtendedSettingsData>;

        setSettingsData((prev) => ({
          ...prev,
          ...incoming,
          paymentMethods: incoming.paymentMethods ?? prev.paymentMethods,
          invoices: incoming.invoices ?? prev.invoices,
          payoutMethods: incoming.payoutMethods ?? prev.payoutMethods,
          payoutHistory: incoming.payoutHistory ?? prev.payoutHistory,
          connectedAccounts: incoming.connectedAccounts ?? prev.connectedAccounts,
          notifications: {
            ...prev.notifications,
            ...(incoming.notifications ?? {})
          },
          privacySettings: { ...prev.privacySettings, ...(incoming.privacySettings ?? {}) },
          securitySettings: { ...prev.securitySettings, ...(incoming.securitySettings ?? {}) },
          regionalSettings: { ...prev.regionalSettings, ...(incoming.regionalSettings ?? {}) }
        }));
        console.log(data);
        console.log("settings data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  const save = async () => {
    const id = localStorage.getItem("user_id");
    const json_success = await updateSettings(id, settingsData);
    if (json_success?.success) {
        console.log("settings data updated")
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }
    router.push('/pages/client/studios');
  };

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

  const makePrimaryPaymentMethod = (id: number) => {
    setSettingsData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(method => ({
        ...method,
        primary: method.id === id
      }))
    }));
  };

  const deletePaymentMethod = (id: number) => {
    setSettingsData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(method => method.id !== id)
    }));
  };

  const tabs = [
    { id: 'billing', label: 'Billing', icon: <FaCreditCard className="mr-2" /> },
    { id: 'account', label: 'Account', icon: <FaUser className="mr-2" /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell className="mr-2" /> },
    { id: 'privacy', label: 'Privacy', icon: <FaEye className="mr-2" /> },
    { id: 'security', label: 'Security', icon: <FaLock className="mr-2" /> },
    { id: 'regional', label: 'Language & Region', icon: <FaGlobe className="mr-2" /> },
    { id: 'help', label: 'Help', icon: <FaQuestionCircle className="mr-2" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'billing':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-lg sm:text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaCreditCard className="mr-3 text-purple-400" /> Payment Methods
              </h3>
              
              <div className="mb-6">
                {settingsData.paymentMethods.map(method => (
                  <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 mb-3 bg-gray-700/50 rounded-xl border border-gray-600">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="bg-gray-600 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                        <FaCreditCard className="text-xl sm:text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base">{method.type} ****{method.last4}</h4>
                        <p className="text-gray-400 text-xs sm:text-sm">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 sm:space-x-3 self-end sm:self-auto">
                      {method.primary ? (
                        <span className="px-2 sm:px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs sm:text-sm">Primary</span>
                      ) : (
                        <button 
                          onClick={() => makePrimaryPaymentMethod(method.id)}
                          className="px-2 sm:px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs sm:text-sm transition-colors"
                        >
                          Make Primary
                        </button>
                      )}
                      <button 
                        onClick={() => deletePaymentMethod(method.id)}
                        className="p-1 sm:p-2 bg-gray-700 hover:bg-red-500/20 rounded-full text-red-400 transition-colors"
                      >
                        <FaTrash className="text-sm sm:text-base" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className={`w-full py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all duration-300 font-bold ${specialGothic.className} flex items-center justify-center text-sm sm:text-base`}>
                <span className="mr-2">+</span> Add Payment Method
              </button>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-lg sm:text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaHistory className="mr-3 text-green-400" /> Payment History
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">Date</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">Studio</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">Amount</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settingsData.invoices.map(invoice => (
                      <tr key={invoice.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{invoice.date}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{invoice.studio}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">${invoice.amount.toFixed(2)}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                          <button className="text-blue-400 hover:text-blue-300 flex items-center text-xs sm:text-sm">
                            <FaReceipt className="mr-1" /> Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'account':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-lg sm:text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaLink className="mr-3 text-purple-400" /> Connected Accounts
              </h3>
              
              <div className="space-y-4">
                {settingsData.connectedAccounts.map(account => (
                  <div key={account.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="bg-gray-600 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                        {account.provider === 'Google' ? (
                          <span className="text-white font-bold text-sm sm:text-base">G</span>
                        ) : (
                          <span className="text-blue-400 font-bold text-sm sm:text-base">f</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base">{account.provider}</h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {account.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleAccountConnection(account.id)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center text-xs sm:text-sm ${
                        account.connected 
                          ? 'bg-gray-700 hover:bg-gray-600 text-red-400' 
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      } transition-colors self-end sm:self-auto`}
                    >
                      {account.connected ? <><FaUnlink className="mr-1 sm:mr-2" /> Disconnect</> : <><FaLink className="mr-1 sm:mr-2" /> Connect</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-lg sm:text-xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaLock className="mr-3 text-yellow-400" /> Change Password
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs sm:text-sm mb-2">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
                    />
                    <button 
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs sm:text-sm mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs sm:text-sm mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="flex items-end sm:col-span-2 md:col-span-1">
                  <button className={`w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold text-sm sm:text-base ${specialGothic.className}`}>
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
              <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${specialGothic.className}`}>
                <FaBell className="mr-3 text-yellow-400" /> Notification Preferences
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Booking Confirmations</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <NotificationToggle 
                      label="Email"
                      checked={settingsData.notifications.bookingConfirmation.email}
                      onChange={() => toggleNotification('bookingConfirmation', 'email')}
                    />
                    <NotificationToggle 
                      label="SMS"
                      checked={settingsData.notifications.bookingConfirmation.sms}
                      onChange={() => toggleNotification('bookingConfirmation', 'sms')}
                    />
                    <NotificationToggle 
                      label="Push Notification"
                      checked={settingsData.notifications.bookingConfirmation.push}
                      onChange={() => toggleNotification('bookingConfirmation', 'push')}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Booking Reminders</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
              </div>
            </div>
          </div>
        );
      
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${specialGothic.className}`}>
                <FaEye className="mr-3 text-purple-400" /> Privacy Settings
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Profile Visibility</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <PrivacyOption 
                      value="public"
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
                      value="studios"
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
                      value="private"
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
                
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Content Visibility</h4>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 mb-3 bg-gray-800 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-sm sm:text-base">Show Reviews Publicly</h5>
                      <p className="text-gray-400 text-xs sm:text-sm">Allow others to see your studio reviews</p>
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
                      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
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
              <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${specialGothic.className}`}>
                <FaLock className="mr-3 text-yellow-400" /> Security Settings
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base sm:text-lg mb-1">Two-Factor Authentication (2FA)</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settingsData.securitySettings.twoFactorAuth}
                        onChange={toggleTwoFactorAuth}
                      />
                      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Active Sessions</h4>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-800 rounded-lg">
                      <div className="mb-2 sm:mb-0">
                        <h5 className="font-semibold text-sm sm:text-base">Chrome on Windows</h5>
                        <p className="text-gray-400 text-xs sm:text-sm">New York, USA • Last active: Today at 10:30 AM</p>
                      </div>
                      <div className="flex items-center self-end sm:self-auto">
                        <span className="text-green-400 text-xs sm:text-sm mr-2 sm:mr-3">Current session</span>
                        <button className="text-red-400 hover:text-red-300">
                          <FaSignOutAlt className="text-sm sm:text-base" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-800 rounded-lg">
                      <div className="mb-2 sm:mb-0">
                        <h5 className="font-semibold text-sm sm:text-base">Safari on iPhone</h5>
                        <p className="text-gray-400 text-xs sm:text-sm">Los Angeles, USA • Last active: Yesterday at 4:15 PM</p>
                      </div>
                      <button className="text-red-400 hover:text-red-300 self-end sm:self-auto">
                        <FaSignOutAlt className="text-sm sm:text-base" />
                      </button>
                    </div>
                  </div>
                  
                  <button className={`mt-4 w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold text-sm sm:text-base ${specialGothic.className} flex items-center justify-center`}>
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
              <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${specialGothic.className}`}>
                <FaGlobe className="mr-3 text-blue-400" /> Language & Regional Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Language</h4>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
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
                
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Timezone</h4>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
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
                
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Currency</h4>
                  <select 
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
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
                
                <div className="bg-gray-700/50 p-3 sm:p-5 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Time Format</h4>
                  <div className="flex space-x-3 sm:space-x-4">
                    <button 
                      className={`flex-1 py-2 rounded-lg text-xs sm:text-sm ${settingsData.regionalSettings.timeFormat === '12h' ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
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
                      className={`flex-1 py-2 rounded-lg text-xs sm:text-sm ${settingsData.regionalSettings.timeFormat === '24h' ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
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
              <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${specialGothic.className}`}>
                <FaQuestionCircle className="mr-3 text-yellow-400" /> Help & Support
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 sm:p-6 rounded-xl border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all">
                  <div className="bg-gray-700/50 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                    <FaQuestionCircle className="text-lg sm:text-xl" />
                  </div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">Knowledge Base</h4>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Find answers to common questions in our extensive help center.</p>
                  <button className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold text-xs sm:text-sm ${specialGothic.className}`}>
                    Browse FAQs
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 sm:p-6 rounded-xl border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all">
                  <div className="bg-gray-700/50 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                    <FaCalendarAlt className="text-lg sm:text-xl" />
                  </div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">Contact Support</h4>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Reach out to our support team for personalized assistance.</p>
                  <button className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold text-xs sm:text-sm ${specialGothic.className}`}>
                    Get Help
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 sm:p-6 rounded-xl border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all">
                  <div className="bg-gray-700/50 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                    <FaReceipt className="text-lg sm:text-xl" />
                  </div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">Report an Issue</h4>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Report bugs, studio issues, or platform concerns.</p>
                  <button className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-bold text-xs sm:text-sm ${specialGothic.className}`}>
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
          className="flex items-center text-gray-300 hover:text-white mb-4 sm:mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${specialGothic.className} mb-4 md:mb-0`}>
            Account Settings
          </h1>
          
          {/* Modern Tab Navigation */}
          <div className="w-full md:w-auto">
            <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-full p-1 border border-gray-500 border-t-white/30 border-l-white/30 shadow-2xl overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-special transition-colors duration-300 z-10 ${
                      activeTab === tab.id
                        ? 'text-white drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]'
                        : 'text-white hover:text-blue'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="flex items-center">
                      {React.cloneElement(tab.icon, { className: "mr-1 sm:mr-2" })}
                      <span>{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-600/40 backdrop-blur-3xl"
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

        <div className='flex justify-center mt-6'>
          <button className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 sm:px-16 py-3 sm:py-4 rounded-full font-bold transition-all duration-300 text-sm sm:text-base ${specialGothic.className}`}
            onClick={save}
          >
            Save
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
            className="fixed top-4 sm:top-8 right-4 sm:right-8 transform bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center space-x-2 backdrop-blur-sm z-50"
          >
            <FaCheckCircle className="text-lg sm:text-xl" />
            <span className="font-semibold text-sm sm:text-base">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type NotificationToggleProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

// Helper component for notification toggles
const NotificationToggle = ({ label, checked, onChange }: NotificationToggleProps) => (
  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg">
    <span className="text-sm sm:text-base">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={onChange}
      />
      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-purple-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>
  </div>
);

type PrivacyOptionProps = {
  value: string;
  label: string;
  description: string;
  selected: boolean;
  onChange: () => void;
};

// Helper component for privacy options
const PrivacyOption = ({ value, label, description, selected, onChange }: PrivacyOptionProps) => (
  <div 
    className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
      selected 
        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]' 
        : 'bg-gray-800 hover:bg-gray-700'
    }`}
    onClick={onChange}
  >
    <div className="flex items-start mb-2">
      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mr-2 sm:mr-3 mt-0.5 ${
        selected ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
      }`}>
        {selected && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>}
      </div>
      <div>
        <h5 className="font-semibold text-sm sm:text-base">{label}</h5>
        <p className="text-gray-400 text-xs sm:text-sm">{description}</p>
      </div>
    </div>
  </div>
);
