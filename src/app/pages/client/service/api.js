const API_BASE_URL = "/api/proxy";
const api_base_url = `${API_BASE_URL}/artist`;

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}


export async function getAllStudios() {

  const res = await fetch(`${api_base_url}/studios`);
  if (!res.ok) {
    throw new Error("Failed to fetch studios");
  }

  const backendStudios = await res.json();

  const studiosUI = backendStudios.map((s) => ({
    id: s.id,
    name: s.name,
    avatar: s.avatar || "/studio/avatar.png",
    coverPhoto: s.coverPhoto || "/studio/cover.jpg",
    rating: s.rating,
    level: s.level,
    location: s.location,
    types: s.types,
    genres: s.genres,
    price: s.price,
    amenities: s.amenities?.length ? s.amenities : ["WiFi", "Coffee", "Parking"],
    equipment: s.equipment,
    languages: s.languages,
    availability: s.availability?.length
      ? s.availability
      : ["Mon", "Wed", "Fri"],
  }));

  return studiosUI;
}

export async function getBookingsByArtist(artistId) {
  const res = await fetch(`${api_base_url}/${artistId}/bookings`);
  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const raw = await res.json();
  const backendBookings = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.bookings)
      ? raw.bookings
      : Array.isArray(raw?.data)
        ? raw.data
        : [];

  const bookingsUI = backendBookings.map((b) => ({
    bookingId: b.booking_id,
    bookingDate: b.booking_date,
    bookingTime: b.booking_time,
    nbrGuests: b.nbr_guests,
    status: b.status ?? true,
    studio: {
      id: b.studio_id,
      name: b.studio_name,
      location: b.location,
      description: b.description,
      avatar: b.avatar_link || "/studio/avatar.png",
      email: b.email,
      phone: b.phone,
      website: b.website,
      instagram: b.instagram,
      soundCloud: b.soundCloud,
      youtube: b.youtube,
      studioRules: b.studio_rules,
      cancellationPolicy: b.cancellation_policy,
    },
    service: {
      name: b.service_name,
      price: b.price,
      duration: b.duration,
    },
  }));

  console.log("Bookings API method worked successfully");
  console.log(bookingsUI);

  return bookingsUI;
}

export async function getReviews(id) {
  const res = await fetch(`${api_base_url}/${id}/reviews`);
  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const reviews = await res.json();

  const reviewsUi = reviews.map((item) => ({
    id: item.id,
    artist_id: item.artist_id,
    studioId: item.studio_id,
    rating: item.rating,
    comment: item.comment,
    date: item.review_date,
    user_id: item.user_id,
    studioName: item.name,
    location: item.location,
    description: item.description,
    }))

    return reviewsUi ;
}

export async function getPoints(id) {
  const res = await fetch(`${api_base_url}/${id}/points`);
  if (!res.ok) {
    throw new Error("Failed to fetch points");
  }
  return res.json(); // Fixed: was res.json (missing parentheses)
}

export async function getNotifications(id) {
  const res = await fetch(`${api_base_url}/${id}/notifications`);
  if (!res.ok) {
    throw new Error("Failed to fetch notification");
  }
  const notifbackend = await res.json();
  
  function calculateTime(time) {
    const createdAt = new Date(time);
    const now = new Date();
    const diffMs = now - createdAt; // milliseconds difference
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    let relativeTime;
    if (diffSeconds < 60) {
        relativeTime = `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
        relativeTime = `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
        relativeTime = `${diffHours} hours ago`;
    } else {
        relativeTime = `${diffDays} days ago`;
    }

    return relativeTime ;
  };

  const notifUi = notifbackend.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    amount: item.amount,
    claimed: item.claimed,
    description: item.content,
    time: item.created_at,
    unread: item.unread,
    date: calculateTime(item.created_at),
  }))

  return notifUi;

}

export async function getFavoriteStudio(id) {
  const res = await fetch(`${api_base_url}/${id}/favorites`);
  if (!res.ok) {
    throw new Error("Failed to fetch favorite");
  }

  const backendStudios = await res.json();

  const studiosUI = backendStudios.map((s) => ({
    id: s.id,
    name: s.name,
    avatar: s.avatar || "/studio/avatar.png",
    coverPhoto: s.coverPhoto || "/studio/cover.jpg",
    rating: s.rating,
    level: s.level,
    location: s.location,
    types: s.types,
    genres: s.genres,
    price: s.price,
    amenities: s.amenities?.length ? s.amenities : ["WiFi", "Coffee", "Parking"],
    equipment: s.equipment,
    languages: s.languages,
    availability: s.availability?.length
      ? s.availability
      : ["Mon", "Wed", "Fri"],
  }));

  return studiosUI;
}

export async function getStudioById(id) {
  const res = await fetch(`${api_base_url}/studio/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch studio");
  }
  return res.json(); // Fixed: was res.json (missing parentheses)
}

export async function getProfile(id) {
  const res = await fetch(`${api_base_url}/${id}/profile`);
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const backendprofile = await res.json();

  const profileUI =  {
    fullName: backendprofile.fullName,
    artistName: backendprofile.artistName,
    avatarImage: backendprofile.avatarImage,
    bio: backendprofile.bio,
    location: backendprofile.location,
    contact: {
      email: backendprofile.contact.email,
      phone: backendprofile.contact.phone,
      instagram: backendprofile.contact.instagram,
      soundcloud: backendprofile.contact.soundcloud,
      youtube: backendprofile.contact.youtube,
    },
    genres: backendprofile.genres,
    instruments: backendprofile.instruments,
    demo: backendprofile.demo,
    collaborators: backendprofile.collaborators,
    languages: backendprofile.languages,
    experienceLevel: backendprofile.experienceLevel,
    yearsOfExperience: backendprofile.yearsOfExperience,
    availability: backendprofile.availability,
    portfolio: backendprofile.portfolio,
  };
      


  return profileUI;
}

export async function updateProfile(artistId, profileData) {
  const res = await fetch(`${api_base_url}/${artistId}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const err = await readJsonSafe(res);
    throw new Error((err && (err.error || err.message)) || "Failed to update profile");
  }

  const updatedProfile = await getProfile(artistId);
  console.log("profile updated", updatedProfile);

  return res.json(); // assuming your backend returns { success: true } or similar
}

export async function getSettings(id){
  const res = await fetch(`${api_base_url}/settings/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  const backendSet = await res.json();

  const profileUI =  {
    activeTab: backendSet.activeTab,
    showPassword: backendSet.showPassword,
    paymentMethods: backendSet.paymentMethods,
    invoices: backendSet.invoices,
    connectedAccounts: backendSet.connectedAccounts,
    notifications: backendSet.notifications,
    privacySettings: backendSet.privacySettings,
    securitySettings: backendSet.securitySettings,
    regionalSettings: backendSet.regionalSettings
  };
      


  return profileUI;
}


export async function getStudioDetailsById(id){

  const res = await fetch(`${api_base_url}/studio/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch studio");
  }

  const backend = await res.json();

  const ui = {
    id: backend.id,
    name: backend.name,
    avatar: backend.avatar,
    coverPhoto: backend.coverPhoto,
    rating: backend.rating,
    location: backend.location,
    types: backend.types,
    genres: backend.genres,
    price: backend.price,
    amenities: backend.amenities,
    equipment: backend.equipment,
    languages: backend.languages,
    availability: backend.availability,
    description: backend.description,
    contact: {
      email: backend.contact.email,
      phone: backend.contact.phone,
      website: backend.contact.website,
      instagram: backend.contact.instagram,
      soundcloud: backend.contact.soundCloud,
      youtube: backend.contact.youtube
    },
    services: backend.services,
    rules: backend.rules,
    cancellationPolicy: backend.cancellationPolicy
  }


  return ui;
}


export async function updateSettings(id, settingsData) {
  const res = await fetch(`${api_base_url}/settings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settingsData),
  });

  if (!res.ok) {
    throw new Error("Failed to update settings");
  }

  return await res.json();
}


export async function updateArtistProfile(id, Data) {
  const res = await fetch(`${api_base_url}/${id}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Data),
  });

  if (!res.ok) {
    const err = await readJsonSafe(res);
    throw new Error((err && (err.error || err.message)) || "Failed to update profile");
  }

  return await res.json();
}


export async function getMiniProfile(id) {
  const res = await fetch(`${api_base_url}/${id}/mini-profile`);
  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new Error(body?.error || body?.message || "Failed to fetch mini profile");
  }

  const backendprofile = await readJsonSafe(res);
  if (!backendprofile) throw new Error("Failed to parse mini profile");

  const profileUI =  {
    name: backendprofile.fullName,
    artistName: backendprofile.artistName,
    avatar: backendprofile.avatarImage,
    preferences: {
      genres: backendprofile.genres ?? [],
      location: backendprofile.location,
      priceRange: [50, 120],
    equipment: backendprofile.instruments ?? [],
    }
  };
      


  return profileUI;
}


export async function createBooking(booking) {
try {
    // Call your API to create the booking
    const response = await fetch(`${api_base_url}/booking/create`
      , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Booking created successfully:', result);
    } else {
      const errorData = await response.json();
      console.error('Failed to create booking:', errorData.error);
    }

    return response ;
  } catch (error) {
    console.error('Error creating booking:', error);
    // Handle error (show message to user, etc.)
  }
}


export async function createReview(review) {
  try {
    // Call your API to create the booking
    const response = await fetch(`${api_base_url}/review/create`
      , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('review created successfully:', result);
    } else {
      const errorData = await response.json();
      console.error('Failed to create review:', errorData.error);
    }

    return response ;
  } catch (error) {
    console.error('Error creating review:', error);
  }
}

export async function updateReview(artistId, reviewId, data) {
  const res = await fetch(`${api_base_url}/${artistId}/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await readJsonSafe(res);
    throw new Error((err && (err.error || err.message)) || "Failed to update review");
  }

  return res.json();
}

export async function deleteReview(artistId, reviewId) {
  const res = await fetch(`${api_base_url}/${artistId}/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await readJsonSafe(res);
    throw new Error((err && (err.error || err.message)) || "Failed to delete review");
  }

  return res.json();
}

export async function updatePortfolioItem(artistId, portfolioId, data) {
  const res = await fetch(`${api_base_url}/${artistId}/portfolio/${portfolioId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await readJsonSafe(res);
    throw new Error((err && (err.error || err.message)) || "Failed to update portfolio item");
  }

  return res.json();
}


export async function addFavorite(data) {
  try {
    const response = await fetch(`${api_base_url}/favorite/add`
      , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('favorite added successfully:', result);
    } else {
      const errorData = await response.json();
      console.error('Failed to add favorite:', errorData.error);
    }

    return response ;
  } catch (error) {
    console.error('Error creating favorite:', error);
  }
}


function transformGamification(backendData) {
  const perks =
    Array.isArray(backendData.perks)
      ? backendData.perks
      : backendData.perks
        ? String(backendData.perks).split(",")
        : [];

  const rewards =
    Array.isArray(backendData.rewards)
      ? backendData.rewards
      : backendData.rewards
        ? String(backendData.rewards).split(",")
        : [];

  return {
    gamification_id: backendData.gamification_id,
    user_id: backendData.user_id,
    user_type: backendData.user_type,
    points: Number(backendData.points) || 0,
    normal_level: Number(backendData.normal_level) || 1,
    xp_level: Number(backendData.xp_level) || 1,
    last_level_up: backendData.last_level_up,
    created_at: backendData.created_at,
    updated_at: backendData.updated_at,
    bookings_last6: Number(backendData.bookings_last6) || 0,
    bookings_all: Number(backendData.bookings_all) || 0,
    reviews_last6: Number(backendData.reviews_last6) || 0,
    reviews_all: Number(backendData.reviews_all) || 0,
    perks: perks.map((p) => String(p).trim()).filter(Boolean),
    rewards: rewards.map((r) => String(r).trim()).filter(Boolean),
  };
}

async function fetchGamification(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await readJsonSafe(res);
    throw new Error((err && (err.error || err.message)) || "Failed to fetch gamification data");
  }
  const backendData = await res.json();
  return transformGamification(backendData);
}

export async function getArtistGamificationData(artistId) {
  return fetchGamification(`${API_BASE_URL}/artist/${artistId}/gamification`);
}

export async function getStudioGamificationData(studioId) {
  return fetchGamification(`${API_BASE_URL}/studio/${studioId}/gamification`);
}

// Backward compatible alias (studio default).
export async function getGamificationData(userId) {
  return getStudioGamificationData(userId);
}
