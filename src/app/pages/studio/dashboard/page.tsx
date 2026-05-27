"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCog,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaStar,
  FaEdit,
  FaTrash,
  FaComments,
  FaSyncAlt,
} from "react-icons/fa";
import { useT } from "@/app/i18n/useT";
import NotificationDropdown from "@/app/components/NotificationDropdown";
import StudioProfileDropdown from "@/app/components/StudioProfileDropdown";
import { Booking, Service, Review, Studio, Earning } from "../types";
import { formatHumanDateSmart } from "@/app/lib/datetime";
import {
  addServiceBackend,
  ApideleteService,
  getBookings,
  getEarningData,
  getServices,
  getStudioProfile,
  getStudioReview,
  updateBookingStatus,
  updateServiceBackend,
} from "../services/api.js";
import StudioGamification from "@/app/components/StudioGamification";

const emptyStudioData: Studio = {
  studioName: "",
  description: "",
  avatarImage: "",
  location: "",
  studioTypes: [],
  languages: [],
  preferredGenres: [],
  galleryImages: [],
  schedule: {},
  contact: {
    email: "",
    phone: "",
    website: "",
    instagram: "",
    soundcloud: "",
    youtube: "",
  },
  services: [],
  additionalInfo: {
    amenities: [],
    rules: "",
    cancellationPolicy: "",
  },
  equipment: [],
};

const StudioDashboard = () => {
  const t = useT();
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  // Sample studio data
  const [studioData, setStudioData] = useState<Studio>(emptyStudioData);

  //bookings, service, reviews and earnings data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [earnings, setEarnings] = useState<Earning>({
    total: 0,
    pending: 0,
    completed: 0,
    thisMonth: 0,
    lastMonth: 0,
  });

  const studioIdFromStorage = () => {
    const studioId = localStorage.getItem("studio_id");
    const n = studioId != null ? Number(studioId) : NaN;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
  };

  const [studioId, setStudioId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setStudioId(studioIdFromStorage());
  }, []);

  // fetch bookings
  useEffect(() => {
    if (studioId == null) return;
    async function fetchBookings() {
      try {
        const data = await getBookings(studioId);
        setBookings(data);
      } catch (err) {
        console.error(err);
        setLoadError(err instanceof Error ? err.message : "Failed to load bookings");
      }
    }
    fetchBookings();
  }, [studioId]);

  // fetch studio & services
  useEffect(() => {
    if (studioId == null) return;
    async function fetchStudio() {
      try {
        const data = await getStudioProfile(studioId);
        const incoming = (data ?? {}) as unknown as Partial<Studio>;

        setStudioData((prev) => ({
          ...emptyStudioData,
          ...prev,
          ...incoming,
          contact: {
            ...emptyStudioData.contact,
            ...(prev.contact ?? {}),
            ...(incoming.contact ?? {}),
          },
          additionalInfo: {
            ...emptyStudioData.additionalInfo,
            ...(prev.additionalInfo ?? {}),
            ...(incoming.additionalInfo ?? {}),
          },
          services: incoming.services ?? prev.services ?? [],
          equipment: incoming.equipment ?? prev.equipment ?? [],
          galleryImages: incoming.galleryImages ?? prev.galleryImages ?? [],
          schedule: incoming.schedule ?? prev.schedule ?? {},
          studioTypes: incoming.studioTypes ?? prev.studioTypes ?? [],
          languages: incoming.languages ?? prev.languages ?? [],
          preferredGenres:
            incoming.preferredGenres ?? prev.preferredGenres ?? [],
        }));
      } catch (error) {
        console.log(error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load studio profile",
        );
      }
    }
    async function fetchServices() {
      try {
        const data = await getServices(studioId);
        setServices(data); // now services separate from bookings
        setStudioData((prev) => ({
          ...prev,
          services: data,
        }));
      } catch (err) {
        console.error(err);
        setLoadError(err instanceof Error ? err.message : "Failed to load services");
      }
    }
    fetchStudio();
    fetchServices();
  }, [studioId]);

  // fetch reviews
  useEffect(() => {
    if (studioId == null) return;
    async function fetchReviews() {
      try {
        const data = await getStudioReview(studioId);
        setReviews(data);
      } catch (error) {
        console.log(error);
        setLoadError(error instanceof Error ? error.message : "Failed to load reviews");
      }
    }
    fetchReviews();
  }, [studioId]);

  // fetch earnings
  useEffect(() => {
    if (studioId == null) return;
    async function fetchEarnings() {
      try {
        const data = await getEarningData(studioId);
        setEarnings(data);
      } catch (error) {
        console.log(error);
        setLoadError(error instanceof Error ? error.message : "Failed to load earnings");
      }
    }
    fetchEarnings();
  }, [studioId]);

  const refreshAll = async () => {
    if (studioId == null || refreshing) return;
    setRefreshing(true);
    setLoadError(null);

    try {
      const settled = await Promise.allSettled([
        getBookings(studioId),
        getStudioProfile(studioId),
        getServices(studioId),
        getStudioReview(studioId),
        getEarningData(studioId),
      ]);

      const [bookingsRes, profileRes, servicesRes, reviewsRes, earningsRes] =
        settled;

      if (bookingsRes.status === "fulfilled") setBookings(bookingsRes.value);
      if (profileRes.status === "fulfilled") {
        const incoming = (profileRes.value ?? {}) as unknown as Partial<Studio>;
        setStudioData((prev) => ({
          ...emptyStudioData,
          ...prev,
          ...incoming,
          contact: {
            ...emptyStudioData.contact,
            ...(prev.contact ?? {}),
            ...(incoming.contact ?? {}),
          },
          additionalInfo: {
            ...emptyStudioData.additionalInfo,
            ...(prev.additionalInfo ?? {}),
            ...(incoming.additionalInfo ?? {}),
          },
          services: incoming.services ?? prev.services ?? [],
          equipment: incoming.equipment ?? prev.equipment ?? [],
          galleryImages: incoming.galleryImages ?? prev.galleryImages ?? [],
          schedule: incoming.schedule ?? prev.schedule ?? {},
          studioTypes: incoming.studioTypes ?? prev.studioTypes ?? [],
          languages: incoming.languages ?? prev.languages ?? [],
          preferredGenres:
            incoming.preferredGenres ?? prev.preferredGenres ?? [],
        }));
      }
      if (servicesRes.status === "fulfilled") {
        setServices(servicesRes.value);
        setStudioData((prev) => ({ ...prev, services: servicesRes.value }));
      }
      if (reviewsRes.status === "fulfilled") setReviews(reviewsRes.value);
      if (earningsRes.status === "fulfilled") setEarnings(earningsRes.value);

      const firstErr = settled.find((r) => r.status === "rejected") as
        | PromiseRejectedResult
        | undefined;
      if (firstErr) {
        const reason = firstErr.reason;
        setLoadError(reason instanceof Error ? reason.message : String(reason));
      }
    } finally {
      setRefreshing(false);
    }
  };

  // State management
  const [activeTab, setActiveTab] = useState("bookings");
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    priceType: "hour",
    duration: "",
    maxCapacity: "",
    availableTimes: "",
    tags: "",
  });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);

  // Ref for equipment dropdown
  const equipmentRef = useRef<HTMLDivElement>(null);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        equipmentRef.current &&
        !equipmentRef.current.contains(event.target as Node)
      ) {
        setShowEquipmentDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tab navigation items
  const tabs = [
    { id: "bookings", label: "Bookings", icon: <FaCalendarCheck /> },
    { id: "services", label: "Services", icon: <FaCog /> },
    { id: "earnings", label: "Earnings", icon: <FaMoneyBillWave /> },
    { id: "reviews", label: "Reviews", icon: <FaStar /> },
    { id: "gamification", label: "Levels", icon: <FaStar /> },
  ];

  // Handle booking status change
  const handleBookingAction = (id: number, action: "accept" | "reject") => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: action === "accept" ? "Confirmed" : "Cancelled",
            }
          : booking,
      ),
    );

    const status = action === "accept" ? "Confirmed" : "Cancelled";

    updateBookingStatus(id, { status: status });
  };

  // Add new service
  const addService = () => {
    if (editingService) {
      // Find the service to update
      const serviceToUpdate = studioData.services.find(
        (service) => service.id === editingService.id,
      );

      if (!serviceToUpdate) {
        console.error("Service not found");
        return;
      }

      const service_id = serviceToUpdate.id;

      // Update the state
      setStudioData({
        ...studioData,
        services: studioData.services.map((service) =>
          service.id === editingService.id
            ? { ...newService, id: editingService.id }
            : service,
        ),
      });

      // Prepare API payload
      const apiService = {
        name: newService.name,
        priceType: newService.priceType,
        price: parseInt(newService.price),
        duration: newService.duration,
        maxCapacity: parseInt(newService.maxCapacity),
        availableTimes: newService.availableTimes,
        description: newService.description,
        studio_id: studioId ?? 1,
      };

      // Call backend
      updateServiceBackend(service_id, apiService);

      setEditingService(null);
    } else {
      const apiService = {
        name: newService.name,
        priceType: newService.priceType, // ✅ camelCase
        price: parseInt(newService.price),
        duration: newService.duration,
        maxCapacity: parseInt(newService.maxCapacity),
        availableTimes: newService.availableTimes,
        description: newService.description,
        studio_id: studioId ?? 1,
      };

      addServiceBackend(apiService);
      // Add new service
      setStudioData({
        ...studioData,
        services: [
          ...studioData.services,
          { ...newService, id: studioData.services.length + 1 },
        ],
      });
    }

    setNewService({
      name: "",
      description: "",
      price: "",
      priceType: "hour",
      duration: "",
      maxCapacity: "",
      availableTimes: "",
      tags: "",
    });

    setShowServiceForm(false);
  };

  // Edit service
  const editService = (id: number, service: Service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
      priceType: service.priceType,
      duration: service.duration,
      maxCapacity: service.maxCapacity,
      availableTimes: service.availableTimes,
      tags: service.tags,
    });

    setShowServiceForm(true);
  };

  // Delete service
  const deleteService = (id: number) => {
    setStudioData({
      ...studioData,
      services: studioData.services.filter((service) => service.id !== id),
    });
    ApideleteService(id);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Render bookings tab
  const renderBookingsTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-special">
          Manage Bookings
        </h2>
        <div className="flex space-x-2">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-special-regular">
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">
                Artist
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-special-regular">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <a href={`artist/${booking.artistId}`}>
                    <div className="flex items-center">
                      <img
                        src={booking.artistAvatar}
                        alt={booking.artistName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-white font-special-regular">
                          {booking.artistName}
                        </div>
                      </div>
                    </div>
                  </a>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300 font-special-regular">
                    {booking.serviceName}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-white font-special-regular">
                    {formatHumanDateSmart(booking.date)}
                  </div>
                  <div className="text-sm text-gray-400 font-special-regular">
                    {formatHumanDateSmart(booking.time)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-400 font-bold font-special">
                  {formatCurrency(booking.price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-special-regular ${
                      booking.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : booking.status === "Confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : booking.status === "Completed"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {booking.status === "Pending" && (
                    <div className="flex space-x-2 font-special-regular">
                      <button
                        onClick={() =>
                          handleBookingAction(booking.id, "accept")
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleBookingAction(booking.id, "reject")
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render services tab
  const renderServicesTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-special">
          Manage Services
        </h2>
        <button
          onClick={() => {
            setEditingService(null);
            setShowServiceForm(true);
            setNewService({
              name: "",
              description: "",
              price: "",
              priceType: "hour",
              duration: "",
              maxCapacity: "",
              availableTimes: "",
              tags: "",
            });
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center font-special-regular"
        >
          Add New Service
        </button>
      </div>

      {showServiceForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur p-6 rounded-xl mb-6 border border-gray-700 font-special-regular relative z-50"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {editingService ? "Edit Service" : "Add New Service"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 font-special-regular">
                Service Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 font-special-regular">
                Price
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                />
                <select
                  className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-lg px-2 text-white focus:outline-none font-special-regular"
                  value={newService.priceType}
                  onChange={(e) =>
                    setNewService({ ...newService, priceType: e.target.value })
                  }
                >
                  <option value="hour">per hour</option>
                  <option value="session">per session</option>
                  <option value="project">per project</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 font-special-regular">
                Maximum Duration
              </label>
              <input
                type="time"
                step="1" // allows seconds
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={newService.duration}
                onChange={(e) =>
                  setNewService({ ...newService, duration: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 font-special-regular">
                Max Capacity
              </label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={newService.maxCapacity}
                onChange={(e) =>
                  setNewService({ ...newService, maxCapacity: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1 font-special-regular">
                Description
              </label>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows={3}
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1 font-special-regular">
                Available Days
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 mt-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label
                    key={day}
                    className="flex items-center text-sm text-gray-300 bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={newService.availableTimes.includes(day)}
                      onChange={(e) => {
                        let updatedDays;
                        if (e.target.checked) {
                          updatedDays = newService.availableTimes
                            ? `${newService.availableTimes}, ${day}`
                            : day;
                        } else {
                          updatedDays = newService.availableTimes
                            .split(", ")
                            .filter((d) => d !== day)
                            .join(", ");
                        }
                        setNewService({
                          ...newService,
                          availableTimes: updatedDays,
                        });
                      }}
                      className="peer hidden"
                    />
                    <span className="relative w-5 h-5 mr-2 flex items-center justify-center rounded-md border border-gray-500 bg-gray-700/50 peer-checked:bg-purple-600 peer-checked:border-purple-400 transition-colors duration-300">
                      {/* Checkmark */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-xs">{day.substring(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 relative z-50">
              <label className="block text-sm font-medium text-gray-400 mb-1 font-special-regular">
                Tags
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={newService.tags}
                  onChange={(e) =>
                    setNewService({ ...newService, tags: e.target.value })
                  }
                  placeholder="Type to add tags or select from suggestions"
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowTagSuggestions(false), 200)
                  }
                />

                {/* Tag suggestions dropdown */}
                {showTagSuggestions && (
                  <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                      Suggested Tags - Click to select
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-3">
                      {[
                        "Recording",
                        "Mixing",
                        "Mastering",
                        "Rehearsal",
                        "Live Sound",
                        "Pro Tools",
                        "Analog",
                        "Digital",
                        "Vocal Booth",
                        "Drum Room",
                        "Isolation Booth",
                        "SSL Console",
                        "Neumann Mics",
                        "Tube Preamps",
                        "Sound Treatment",
                        "Acoustic Panels",
                        "MIDI",
                      ].map((tag) => (
                        <div
                          key={tag}
                          className="text-sm text-white p-2 rounded bg-gray-700 hover:bg-purple-700 cursor-pointer transition-colors"
                          onClick={() => {
                            const currentTags = newService.tags
                              ? newService.tags.split(",")
                              : [];
                            if (!currentTags.includes(tag)) {
                              const updatedTags =
                                currentTags.length > 0
                                  ? [...currentTags, tag].join(",")
                                  : tag;
                              setNewService({
                                ...newService,
                                tags: updatedTags,
                              });
                            }
                            setShowTagSuggestions(false);
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected tags display */}
              <div className="flex flex-wrap gap-2 mt-2">
                {newService.tags &&
                  newService.tags.split(",").map(
                    (tag, index) =>
                      tag.trim() && (
                        <span
                          key={index}
                          className="bg-purple-900/30 text-purple-300 text-xs px-3 py-1 rounded-full flex items-center"
                        >
                          {tag.trim()}
                          <button
                            type="button"
                            onClick={() => {
                              const currentTags = newService.tags
                                .split(",")
                                .filter((t) => t.trim() !== tag.trim());
                              setNewService({
                                ...newService,
                                tags: currentTags.join(","),
                              });
                            }}
                            className="ml-1 text-purple-500 hover:text-purple-300"
                          >
                            ×
                          </button>
                        </span>
                      ),
                  )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas, or select from suggestions above
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowServiceForm(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-special-regular"
            >
              Cancel
            </button>
            <button
              onClick={addService}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-special-regular"
            >
              {editingService ? "Update Service" : "Add Service"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Services Grid - Added lower z-index to prevent overlapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {studioData.services.map((service) => (
          <div
            key={service.id}
            className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-special-regular">
                  {service.name}
                </h3>
                <p className="text-purple-400 font-bold text-xl mt-1 font-special-regular">
                  ${service.price}{" "}
                  <span className="text-sm font-normal text-gray-400">
                    /{service.priceType}
                  </span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editService(service.id, service)}
                  className="text-gray-400 hover:text-yellow-400 p-1"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <p className="text-gray-400 mb-4 font-special-regular">
              {service.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 font-special-regular">
                  Duration:
                </span>
                <span className="text-white ml-2 font-special-regular">
                  {service.duration}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-special-regular">
                  Max Capacity:
                </span>
                <span className="text-white ml-2 font-special-regular">
                  {service.maxCapacity} people
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 font-special-regular">
                  Available Times:
                </span>
                <span className="text-white ml-2 font-special-regular">
                  {service.availableTimes}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 font-special-regular">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {service.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full font-special-regular"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render earnings tab
  const renderEarningsTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-special-regular">
          Earnings Overview
        </h2>
        <div className="flex space-x-2">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-special-regular">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r  from-green-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-purple-500/30">
          <div className="text-gray-400 mb-1 font-special-regular">
            Total Earnings
          </div>
          <div className="text-3xl font-bold text-white font-special-regular">
            {formatCurrency(earnings.total)}
          </div>
          <div className="text-green-400 text-sm mt-2 font-special-regular">
            All time
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-blue-500/30 font-special-regular">
          <div className="text-gray-400 mb-1">Pending Payments</div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(earnings.pending)}
          </div>
          <div className="text-yellow-400 text-sm mt-2">Awaiting clearance</div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur p-6 rounded-xl border border-green-500/30 font-special-regular">
          <div className="text-gray-400 mb-1">Completed Earnings</div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(earnings.completed)}
          </div>
          <div className="text-green-400 text-sm mt-2">Cleared payments</div>
        </div>

        <div className="bg-gradient-to-r from-yellow-900/30 to-gray-900/30 backdrop-blur p-6 rounded-xl border border-yellow-500/30 font-special-regular">
          <div className="text-gray-400 mb-1">This Month</div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(earnings.thisMonth)}
          </div>
          <div
            className={`text-sm mt-2 ${
              earnings.thisMonth > earnings.lastMonth
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {earnings.thisMonth > earnings.lastMonth ? "↑" : "↓"}
            {Math.abs(
              Math.round(
                ((earnings.thisMonth - earnings.lastMonth) /
                  earnings.lastMonth) *
                  100,
              ),
            )}
            % from last month
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-700 font-special-regular">
        <h3 className="text-xl font-bold text-white mb-4">
          Recent Transactions
        </h3>

        <div className="overflow-x-auto font-special-regular">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {bookings.filter(
                (b) => b.status === "Completed" || b.status === "Confirmed",
              ).length > 0 ? (
                bookings
                  .filter(
                    (b) => b.status === "Completed" || b.status === "Confirmed",
                  )
                  .map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        #{booking.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <a href={`artist/${booking.artistId}`}>
                          <div className="flex items-center">
                            <img
                              src={booking.artistAvatar}
                              alt={booking.artistName}
                              className="w-8 h-8 rounded-full object-cover mr-2"
                            />
                            <div className="text-sm text-white">
                              {booking.artistName}
                            </div>
                          </div>
                        </a>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.serviceName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.date}{" "}
                        <span className="text-gray-500">{booking.time}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-400 font-bold">
                        {formatCurrency(booking.price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === "Confirmed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {booking.status === "Confirmed"
                            ? "Processing"
                            : "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render reviews tab
  const renderReviewsTab = () => (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 font-special-regular">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Studio Reviews</h2>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-gray-400 ml-2">4.8 (128 reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-700 hover:border-yellow-500/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <a href={`artist/${review.artistId}`}>
                <div className="flex items-center">
                  <img
                    src={review.artistAvatar}
                    alt={review.artistName}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {review.artistName}
                    </h3>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-gray-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </a>

              <div className="text-gray-500 text-sm">{formatHumanDateSmart(review.date)}</div>
            </div>

            <p className="text-gray-300 mb-4">{review.comment}</p>

            <div className="flex space-x-3">
              <button className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded">
                Reply
              </button>
              <button className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded">
                Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Add this render method for the gamification tab
  const renderGamificationTab = () => <StudioGamification studioId={studioId ?? undefined} />;

  if (studioId == null) {
    return (
      <div className="min-h-screen text-white px-4 py-10 max-w-3xl mx-auto">
        <p className="text-gray-400">
          Studio dashboard needs a valid `studio_id` in localStorage. Please sign
          in with a studio account (or create a studio profile) and try again.
        </p>
        <Link
          href="/pages/auth/login"
          className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {loadError ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {loadError}
          </div>
        </div>
      ) : null}

      {/* Top Navigation Bar */}
      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo - Left */}
          <div className="flex justify-start">
            <img
              src="/home/Logo.png"
              className="w-14 h-10 md:h-15 md:w-20 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] rounded-sm"
              alt="Logo"
            />
          </div>

          {/* Tab Navigation - Center */}
          <div className="flex justify-center w-full md:w-auto">
            <div className="lux-card lux-rect p-1 shadow-2xl bg-black/35 border-white/10 rounded-full backdrop-blur-lg">
              <div className="flex flex-wrap md:flex-nowrap md:space-x-1 space-x-0.5 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`font-special relative px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center ${
                      activeTab === tab.id
                        ? "text-white opacity-100 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]"
                        : "text-white opacity-50 hover:text-gray-400"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {/* Background highlight */}
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-600/30 backdrop-blur-3xl z-0"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Foreground content */}
                    <div className="flex items-center relative z-10">
                      <span className="mr-2">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex justify-end items-center space-x-3">
            {/* Notification & Settings */}
            <div className="flex items-center space-x-2">
              <Link
                href="/pages/studio/messages"
                className="lux-btn-ghost inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-sm text-gray-200 hover:text-white hover:border-purple-500/40"
              >
                <FaComments className="text-purple-400" />
                <span className="hidden sm:inline font-special-regular">
                  {t("common.clientMessages")}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => void refreshAll()}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm text-gray-200 hover:bg-white/5 disabled:opacity-50"
                aria-label="Refresh dashboard"
              >
                <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline font-special-regular">
                  Refresh
                </span>
              </button>
              <NotificationDropdown />
            </div>

            {/* Studio Profile */}
            <StudioProfileDropdown
              studioProfile={{
                name: studioData.studioName,
                avatar: studioData.avatarImage || "/studio/avatar.png",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Studio Header */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-shrink-0">
            <img
              src={studioData.avatarImage || "/studio/avatar.png"}
              alt={studioData.studioName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-2 border-purple-500/50"
            />
          </div>

          <div className="text-center md:text-left">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white mb-2 font-special"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {studioData.studioName}
            </motion.h1>
            <motion.p
              className="text-gray-400 max-w-2xl mb-4 font-special-regular"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {studioData.description}
            </motion.p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-gray-900/50 px-4 py-2 rounded-lg flex items-center">
                <span className="text-gray-400 mr-2 font-special-regular">
                  Contact:
                </span>
                <span className="text-white font-special-regular">
                  {studioData.contact.email}
                </span>
              </div>

              <div className="relative z-50" ref={equipmentRef}>
                <button
                  className="bg-purple-700 px-4 py-2 rounded-lg flex items-center hover:bg-purple-800 transition-colors"
                  onClick={() =>
                    setShowEquipmentDropdown(!showEquipmentDropdown)
                  }
                >
                  <span className="text-gray-900 mr-2 font-special-regular">
                    Equipment:
                  </span>
                  <span className="text-white mr-1 font-special-regular">
                    {studioData.equipment.slice(0, 2).join(", ")}
                    {studioData.equipment.length > 2 &&
                      ` +${studioData.equipment.length - 2}`}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transform transition-transform ${showEquipmentDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                {showEquipmentDropdown && (
                  <div className="absolute z-[100] mt-1 w-100 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700 font-special-regular">
                      Equipment List
                    </div>
                    {studioData.equipment.map((item, index) => (
                      <div
                        key={index}
                        className="w-50 px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer flex items-center"
                      >
                        <span className="mr-2 text-purple-400 font-special-regular">
                          •
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
            {activeTab === "bookings" && renderBookingsTab()}
            {activeTab === "services" && renderServicesTab()}
            {activeTab === "earnings" && renderEarningsTab()}
            {activeTab === "reviews" && renderReviewsTab()}
            {activeTab === "gamification" && renderGamificationTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.15;
          }
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

export default StudioDashboard;
