// components/BookingDialog.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaClock, FaUserFriends, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { createBooking } from '../pages/client/service/api';

// Utility function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Utility function to get first day of month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// Calendar component
const Calendar = ({ selectedDate, onSelect }: { 
  selectedDate: Date | null; 
  onSelect: (date: Date) => void 
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  const isCurrentDay = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };
  
  const isSelected = (day: number) => {
    return selectedDate ? 
      day === selectedDate.getDate() && 
      currentMonth === selectedDate.getMonth() && 
      currentYear === selectedDate.getFullYear() : false;
  };
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <FaChevronLeft className="text-gray-300" />
        </button>
        <h3 className="text-white font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <FaChevronRight className="text-gray-300" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-gray-500 text-sm py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}
        
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              onClick={() => onSelect(new Date(currentYear, currentMonth, day))}
              className={`
                h-10 rounded-lg flex items-center justify-center
                transition-colors
                ${
                  isSelected(day) 
                    ? 'bg-purple-600 text-white' 
                    : isCurrentDay(day)
                      ? 'bg-gray-700 text-white border border-purple-500'
                      : 'text-gray-300 hover:bg-gray-700'
                }
                ${day > today.getDate() || currentMonth > today.getMonth() || currentYear > today.getFullYear()
                  ? '' 
                  : 'opacity-50 cursor-not-allowed'}
              `}
              disabled={
                day < today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear()
              }
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BookingDialog = ({ studio, services, onClose }: { 
  studio: any, 
  services: any[], 
  onClose: () => void 
}) => {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();  
      console.log(selectedService);    
      // Create booking object with the requested attributes
      const booking = {
        user_id: 1, // You would replace this with actual user ID
        studio_id: studio.id,
        booking_date: date ? date.toISOString().split('T')[0] : null,
        booking_time: time,
        nbr_guests: guests,
        service_id: selectedService.id, // Make sure your service objects have an id property
        status: "Pending"
      };

      const res = await createBooking(booking);

      if(res?.ok){
        console.log('Booking Object:', booking);
        setBookingStep(3);
        setBookingConfirmed(true);
      }

  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Book {studio.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
          
          {bookingConfirmed ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-green-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400 mb-6">
                Your booking at {studio.name} has been confirmed. Details have been sent to your email.
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Select Service</label>
                    <select
                      value={selectedService.name}
                      onChange={(e) => 
                        setSelectedService(
                          services.find(s => s.name === e.target.value) || services[0]
                        )
                      }
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      {services.map((service, index) => (
                        <option key={index} value={service.name}>
                          {service.name} (${service.price}/{service.priceType})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setBookingStep(2)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {bookingStep === 2 && (
                <div className="space-y-4">
                  <div className="relative" ref={calendarRef}>
                    <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <FaCalendarAlt /> Date
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <span className={date ? 'text-white' : 'text-gray-500'}>
                        {formatDate(date)}
                      </span>
                      <FaCalendarAlt className="text-gray-400" />
                    </button>
                    
                    {showCalendar && (
                      <div className="absolute z-10 mt-2 w-full">
                        <Calendar 
                          selectedDate={date} 
                          onSelect={(selected) => {
                            setDate(selected);
                            setShowCalendar(false);
                          }} 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <FaClock /> Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'].map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`
                            py-2 rounded-lg border transition-colors
                            ${time === slot 
                              ? 'bg-purple-600 border-purple-600 text-white' 
                              : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-700'}
                          `}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <FaUserFriends /> Number of Guests
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                        className="p-2 rounded-full bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-700"
                      >
                        -
                      </button>
                      <span className="text-white w-8 text-center">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.min(selectedService.maxCapacity || 10, prev + 1))}
                        className="p-2 rounded-full bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-700"
                      >
                        +
                      </button>
                      <span className="text-gray-500 text-sm ml-2">
                        Max: {selectedService.maxCapacity || 10}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-gray-400 text-sm mb-2">Booking Summary</h3>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex justify-between text-gray-300">
                        <span>Service:</span>
                        <span className="text-white">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>Date:</span>
                        <span className="text-white">{formatDate(date)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>Time:</span>
                        <span className="text-white">{time || '--:--'}</span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>Price:</span>
                        <span className="text-white">${selectedService.price}/{selectedService.priceType}</span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>Guests:</span>
                        <span className="text-white">{guests}</span>
                      </div>
                      <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between font-semibold">
                        <span className="text-gray-300">Total:</span>
                        <span className="text-white">${parseFloat(selectedService.price) * guests}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!date || !time}
                      className={`
                        bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg 
                        hover:from-purple-700 hover:to-blue-700 transition-all
                        ${!date || !time ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingDialog;