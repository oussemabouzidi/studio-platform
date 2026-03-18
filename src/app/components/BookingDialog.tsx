// components/BookingDialog.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaClock, FaUserFriends, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { createBooking } from '../pages/client/service/api';
import { useI18n } from '@/app/i18n/I18nProvider';
import { useT } from '@/app/i18n/useT';

type BookingStudio = { id: number | string; name: string } & Record<string, unknown>;
type BookingService = {
  id?: number;
  name: string;
  price: string | number;
  priceType: string;
  maxCapacity?: number | string | null;
} & Record<string, unknown>;

// Utility function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Utility function to get first day of month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// Calendar component
const Calendar = ({ selectedDate, onSelect, locale }: { 
  selectedDate: Date | null; 
  onSelect: (date: Date) => void;
  locale: string;
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
  
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long' });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const weekdayBase = new Date(Date.UTC(2023, 0, 1)); // Sunday
  const weekdayLabels = Array.from({ length: 7 }, (_, i) =>
    weekdayFormatter.format(new Date(weekdayBase.getTime() + i * 24 * 60 * 60 * 1000)),
  );

  return (
    <div className="lux-card lux-rect p-4 max-h-[280px] sm:max-h-[340px] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="lux-btn-ghost p-2"
        >
          <FaChevronLeft className="text-gray-300" />
        </button>
        <h3 className="text-white font-semibold font-special">
          {monthFormatter.format(new Date(currentYear, currentMonth, 1))} {currentYear}
        </h3>
        <button 
          onClick={nextMonth}
          className="lux-btn-ghost p-2"
        >
          <FaChevronRight className="text-gray-300" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdayLabels.map((day) => (
          <div key={day} className="text-center text-gray-500 text-sm py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="h-9 sm:h-10" />
        ))}
        
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const isPast =
            day < today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
          return (
            <button
              key={day}
              onClick={() => onSelect(new Date(currentYear, currentMonth, day))}
              className={[
                'h-9 sm:h-10 rounded-lg flex items-center justify-center text-sm font-medium',
                'border border-white/10 bg-black/20 text-white/80 transition-colors duration-200',
                'hover:bg-white/5 hover:border-white/16',
                isSelected(day)
                  ? 'bg-gradient-to-r from-purple-600/70 to-blue-600/60 text-white shadow-[0_0_0_1px_rgba(126,34,206,0.25),0_18px_70px_rgba(0,0,0,0.45)]'
                  : isCurrentDay(day)
                    ? 'bg-white/5 text-white border-purple-400/40'
                    : '',
                isPast ? 'opacity-40 cursor-not-allowed hover:bg-black/20 hover:border-white/10' : '',
              ].join(' ')}
              disabled={isPast}
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
  studio: BookingStudio,
  services: BookingService[],
  onClose: () => void 
}) => {
  const { locale } = useI18n();
  const t = useT();

  const [selectedService, setSelectedService] = useState<BookingService | null>(services[0] ?? null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const timeLabel = (value: string) => {
    if (!value) return '';
    // value is "HH:mm"
    const [h, m] = value.split(':').map((n) => Number(n));
    if (!Number.isFinite(h) || !Number.isFinite(m)) return value;
    const date = new Date(2000, 0, 1, h, m, 0);
    return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();  
      setSubmitError(null);

      const userIdRaw =
        typeof window !== "undefined"
          ? localStorage.getItem("user_id")
          : null;
      const userId = userIdRaw ? Number(userIdRaw) : NaN;

      if (!Number.isFinite(userId)) {
        setSubmitError(t("booking.errors.missingSession"));
        return;
      }

      if (!selectedService) {
        setSubmitError(t("booking.errors.noService"));
        return;
      }

      if (typeof selectedService.id !== 'number') {
        setSubmitError(t("booking.errors.missingServiceId"));
        return;
      }

      // Create booking object with the requested attributes
      const booking = {
        user_id: userId,
        studio_id: typeof studio.id === 'string' ? Number(studio.id) : studio.id,
        booking_date: date ? date.toISOString().split('T')[0] : null,
        booking_time: time,
        nbr_guests: guests,
        service_id: selectedService.id,
        status: "Pending"
      };

      const res = await createBooking(booking);

      if(res?.ok){
        console.log('Booking Object:', booking);
        setBookingStep(3);
        setBookingConfirmed(true);
      }

  };

  const currentStep = bookingConfirmed ? 3 : bookingStep;
  const progressWidth = currentStep <= 1 ? '0%' : currentStep === 2 ? '50%' : '100%';

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

  // Lock background scroll + support Escape
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    // Focus the dialog for accessibility
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const displayDate = date
    ? new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    : t("booking.selectDate");

  const maxGuests = selectedService?.maxCapacity != null ? Number(selectedService.maxCapacity) : 10;
  const priceNumber = selectedService ? Number.parseFloat(String(selectedService.price)) : 0;
  const totalPrice = Number.isFinite(priceNumber) ? priceNumber * guests : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={t("booking.title", { studio: studio.name })}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="h-[100dvh] w-full overflow-y-auto px-4 py-4 sm:px-6 sm:py-10 flex items-start sm:items-center justify-center">
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          className="lux-card lux-rect w-full max-w-2xl max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="shrink-0 border-b border-white/10 bg-black/40 backdrop-blur-xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white font-special truncate">
                {t("booking.title", { studio: studio.name })}
              </h2>
              <button
                onClick={onClose}
                className="lux-btn-ghost p-2"
                aria-label={t("booking.closeDialog")}
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3 text-[11px] text-white/70 font-special-regular">
                <span className={currentStep >= 1 ? 'text-white' : ''}>
                  <span className="sm:hidden">01</span><span className="hidden sm:inline">01 {t("booking.stepService")}</span>
                </span>
                <span className={currentStep >= 2 ? 'text-white' : ''}>
                  <span className="sm:hidden">02</span><span className="hidden sm:inline">02 {t("booking.stepDateTime")}</span>
                </span>
                <span className={currentStep >= 3 ? 'text-white' : ''}>
                  <span className="sm:hidden">03</span><span className="hidden sm:inline">03 {t("booking.stepConfirm")}</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[color:var(--lux-metal-platinum)] via-[color:var(--lux-metal-gold)] to-[color:var(--lux-metal-silver)] shadow-[0_0_22px_rgba(214,178,106,0.18)] transition-[width] duration-500 ease-out"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">
          
          {bookingConfirmed ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-green-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t("booking.confirmedTitle")}</h3>
              <p className="text-gray-400 mb-6">
                {t("booking.confirmedBody", { studio: studio.name })}
              </p>
              <button
                onClick={onClose}
                className="lux-btn-metal px-6 py-2.5 text-sm font-medium"
              >
                {t("common.close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {submitError ? (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-200">
                  {submitError}
                </div>
              ) : null}
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">{t("booking.selectService")}</label>
                    <select
                      value={selectedService?.name ?? ''}
                      onChange={(e) => 
                        setSelectedService(
                          services.find(s => s.name === e.target.value) || services[0] || null
                        )
                      }
                      className="lux-input"
                    >
                      {services.map((service) => (
                        <option key={`${service.id ?? service.name}`} value={service.name}>
                          {service.name} (${service.price}/{service.priceType})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setBookingStep(2)}
                      className="lux-btn-metal px-6 py-2.5 text-sm font-medium"
                    >
                      {t("common.next")}
                    </button>
                  </div>
                </div>
              )}
              
              {bookingStep === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 md:items-start">
                    <div className="relative space-y-3" ref={calendarRef}>
                    <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="lux-icon-metal" /> {t("booking.date")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="lux-btn-ghost w-full flex items-center justify-between px-4 py-3"
                    >
                      <span className={date ? 'text-white' : 'text-gray-500'}>
                        {displayDate}
                      </span>
                      <FaCalendarAlt className="text-gray-400" />
                    </button>
                    
                     {showCalendar && (
                       <div className="mt-3">
                         <Calendar 
                           selectedDate={date} 
                           locale={locale}
                           onSelect={(selected) => {
                             setDate(selected);
                             setShowCalendar(false);
                           }} 
                         />
                       </div>
                     )}
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <FaClock className="lux-icon-metal" /> {t("booking.time")}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'].map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={time === slot ? 'lux-btn py-2 text-sm' : 'lux-btn-ghost py-2 text-sm'}
                        >
                          {timeLabel(slot)}
                        </button>
                      ))}
                    </div>
                  </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <FaUserFriends className="lux-icon-metal" /> {t("booking.numberOfGuests")}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                        className="lux-btn-ghost px-3 py-2 rounded-full text-white/85"
                      >
                        -
                      </button>
                      <span className="text-white w-8 text-center">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.min(Number.isFinite(maxGuests) ? maxGuests : 10, prev + 1))}
                        className="lux-btn-ghost px-3 py-2 rounded-full text-white/85"
                      >
                        +
                      </button>
                      <span className="text-gray-500 text-sm ml-2">
                        {t("booking.max")}: {Number.isFinite(maxGuests) ? maxGuests : 10}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-gray-400 text-sm mb-2">{t("booking.bookingSummary")}</h3>
                    <div className="lux-card p-4">
                      <div className="flex justify-between text-gray-300">
                        <span>{t("booking.service")}:</span>
                        <span className="text-white">{selectedService?.name ?? '--'}</span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>{t("booking.date")}:</span>
                        <span className="text-white">{displayDate}</span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>{t("booking.time")}:</span>
                        <span className="text-white">{time ? timeLabel(time) : '--:--'}</span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>{t("booking.price")}:</span>
                        <span className="text-white">
                          ${selectedService?.price ?? '--'}/{selectedService?.priceType ?? '--'}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300 mt-2">
                        <span>{t("booking.guests")}:</span>
                        <span className="text-white">{guests}</span>
                      </div>
                      <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-semibold">
                        <span className="text-gray-300">{t("booking.total")}:</span>
                        <span className="text-white">${totalPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="lux-btn-ghost px-6 py-2.5 text-sm font-medium"
                    >
                      {t("common.back")}
                    </button>
                    <button
                      type="submit"
                      disabled={!date || !time}
                      className={`lux-btn-metal px-6 py-2.5 text-sm font-medium ${!date || !time ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {t("booking.confirmBooking")}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingDialog;
