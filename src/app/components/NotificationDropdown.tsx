import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaBell, FaCalendarAlt, FaCheckCircle, FaCoins, FaTimes } from 'react-icons/fa';
import { Notfications } from '../pages/client/types';
import { getNotifications } from '../pages/client/service/api';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notfications[]>([]);

  useEffect(() => {
      async function fetchNotifications() {
        try {
          const data = await getNotifications(1);
          setNotifications(data);
          console.log("notification data is working");
        } catch (err) {
          console.error(err);
        }
      }
      fetchNotifications();
    }, []);

  const claimPoints = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, claimed: true, unread: false } : notif
    ));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Menu as="div" className="relative ml-3 ">
      <div className="flex items-center ml-7">
        <Menu.Button className="flex items-center text-sm rounded-2xl focus:outline-none group relative">
          <div className=" bg-gray-800/30 backdrop-blur-lg  p-1 pl-3 pr-3 rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] shadow-2xl ">
            <div className="rounded-2xl p-2 flex items-center justify-center w-10 h-10">
              <FaBell className="text-gray-200 group-hover:text-white text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute -right-45 z-20 mt-2 w-96  origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 backdrop-blur-lg">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white font-special">Notifications</h3>
            <div className="flex space-x-2">
              <button 
                onClick={markAllAsRead}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Mark all as read
              </button>
              
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <div 
                      className={`px-4 py-3 border-b border-gray-700 ${
                        notification.unread ? 'bg-gray-800/50' : ''
                      } ${active ? 'bg-gray-700' : ''} transition-colors`}
                    >
                      <div className="flex items-start">
                        {/* Notification Icon */}
                        <div className="flex-shrink-0">
                          {notification.type === 'points' && (
                            <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-2 rounded-full">
                              <FaCoins className="text-yellow-300 text-xl" />
                            </div>
                          )}
                          {notification.type === 'booking' && (
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-full">
                              <FaCalendarAlt className="text-blue-300 text-xl" />
                            </div>
                          )}
                          {notification.type === 'payment' && (
                            <div className="bg-gradient-to-r from-green-600 to-green-800 p-2 rounded-full">
                              <FaCheckCircle className="text-green-300 text-xl" />
                            </div>
                          )}
                        </div>
                        
                        {/* Notification Content */}
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <h4 className={`font-bold ${notification.unread ? 'text-white' : 'text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-500 hover:text-gray-300"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-400 mt-1">
                            {notification.description}
                          </p>
                          
                          {/* Additional Info */}
                          {notification.type === 'booking' && notification.date && (
                            <div className="mt-2 flex items-center text-xs text-blue-400">
                              <FaCalendarAlt className="mr-1" />
                              <span>{new Date(notification.date).toLocaleDateString("en-CA")}</span>
                            </div>
                          )}
                          
                          {notification.type === 'payment' && notification.amount && (
                            <div className="mt-2 text-xs font-bold text-green-400">
                              {notification.amount}
                            </div>
                          )}
                          
                          {/* Time */}
                          <div className="mt-2 text-xs text-gray-500">
                            {notification.time.toLocaleString()}
                          </div>
                          
                          {/* Claim Button */}
                          {notification.type === 'points' && !notification.claimed && (
                            <button
                              onClick={() => claimPoints(notification.id)}
                              className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white text-xs rounded-full transition-all flex items-center"
                            >
                              <FaCoins className="mr-1" />
                              Claim Points
                            </button>
                          )}
                          
                          {notification.type === 'points' && notification.claimed && (
                            <div className="mt-2 text-xs text-green-400 flex items-center">
                              <FaCheckCircle className="mr-1" />
                              Points claimed!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))
            )}
          </div>

        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationDropdown;