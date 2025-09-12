const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const api_base_url = `${API_BASE_URL}/studio`;


export async function getBookings(id){
  const res = await fetch(`${api_base_url}/${id}/bookings`); 

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const backendBookings = await res.json();

  const bookingUi = backendBookings.map((s) => ({
    id: s.id,
    artistId: s.user_id,
    artistName: s.artist_name,
    artistAvatar: s.artist_avatar,
    date: s.booking_date,
    time: s.booking_time,
    status: s.status,
    serviceName: s.service_name,
    price: s.service_price
  }));

  return bookingUi;
}

export async function getServices(id){
    const res = await fetch(`${api_base_url}/${id}/services`);
    if(!res.ok){throw new Error('failed to fetch services')}

    const servicesbackend = await res.json();

    function tagsToString(tags){
        let str_tag = '';
        for(let i = 0 ; i< tags.length ; i++){
            str_tag += tags[i];
            str_tag += ',';
        }
        return str_tag;
    }

    const serviceUi = servicesbackend.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        priceType: s.price_type,
        duration: s.duration,
        maxCapacity: s.max_capacity,
        availableTimes: s.available_timing,
        tags: tagsToString(s.tags)
    }))

    console.log(serviceUi);

    return serviceUi;
}

export async function getStudioProfile(id){
      const res = await fetch(`${api_base_url}/${id}/profile`);
      if(!res.ok){throw new Error('failed to fetch services')}

      const profilebackend = await res.json();

      const profileUi = {
          studioName: profilebackend.name,
          description: profilebackend.description,
          avatarImage: profilebackend.avatar_link,
          contact: {
              email: profilebackend.email,
              phone: profilebackend.phone,
          },
          services: [],
          additionalInfo: {
              amenities: profilebackend.amenities,
          },
          equipment: profilebackend.equipment
      }

      return profileUi;
}

export async function getStudioReview(id){
    const res = await fetch(`${api_base_url}/${id}/reviews`);
    if(!res.ok){throw new Error('Failed to fetch reviews')};

    const apiReviews = await res.json();

    const uiReviews = apiReviews.map((v) => ({
        id: v.id,
        artistId: v.artistId,
        artistName: v.artistName,
        artistAvatar: v.artistAvatar,
        rating: v.rating,
        comment: v.comment,
        date: v.date
    }))

    return uiReviews ;
}


export async function getEarningData(id){
    const res = await fetch(`${api_base_url}/${id}/earnings`);
    if(!res.ok){throw new Error('Failed to fetch earnings')};

    const apiEarnings = await res.json();

    
    const uiEarnings = {
        total: apiEarnings.total_earnings,
        pending: apiEarnings.pending_payments,
        completed: apiEarnings.completed_earnings,
        thisMonth: apiEarnings.earnings_this_month,
        lastMonth: apiEarnings.earnings_last_month
    }

    console.log(uiEarnings);

    return uiEarnings ;
}


export async function getProfile(id) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/artist/${id}/profile`);
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
    demos: Array.isArray(backendprofile.demo)
    ? backendprofile.demo.map(d => ({
        file: d.file,
        name: d.name,
        playing: false
      }))
    : [],
    collaborators: backendprofile.collaborators,
    languages: backendprofile.languages,
    experienceLevel: backendprofile.experienceLevel,
    yearsOfExperience: backendprofile.yearsOfExperience,
    availability: backendprofile.availability,
    portfolio: backendprofile.portfolio,
  };
      


  return profileUI;
}

export async function getStudioManageProfile(id) {
    const res = await fetch(`${api_base_url}/${id}/manage_profile`);
    if(!res.ok){throw new Error('failed to fetch manage profile')}

    const profilebackend = await res.json();

    const profileUi = {
      studioName: profilebackend.studioName,
      description: profilebackend.description,
      avatarImage: profilebackend.avatarImage,
      galleryImages: profilebackend.galleryImages,
      location: profilebackend.location,
      contact: {
        email: profilebackend.contact.email,
        phone: profilebackend.contact.phone,
        website: profilebackend.contact.website,
        instagram: profilebackend.contact.instagram,
        soundcloud: profilebackend.contact.soundcloud,
        youtube: profilebackend.contact.youtube
      },
      schedule: profilebackend.schedule,
      services: profilebackend.services,
      additionalInfo: {
        amenities: profilebackend.additionalInfo.amenities,
        rules: profilebackend.additionalInfo.rules,
        cancellationPolicy: profilebackend.additionalInfo.cancellationPolicy
      },
      equipment: profilebackend.equipment,
      studioTypes: profilebackend.studioTypes,
      languages: profilebackend.languages,
      preferredGenres: profilebackend.preferredGenres
    }

    

    return profileUi;
}


export async function getSettings(id){
  const res = await fetch(`${api_base_url}/settings/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const backendSet = await res.json();

  const profileUI =  {
    payoutMethods: backendSet.payoutMethods,
    payoutHistory: backendSet.payoutHistory,
    connectedAccounts: backendSet.connectedAccounts,
    notifications: backendSet.notifications,
    privacySettings: backendSet.privacySettings,
    securitySettings: backendSet.securitySettings,
    regionalSettings: backendSet.regionalSettings
  };
      


  return profileUI;
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


export async function updateStudioProfile(id, Data) {
  const res = await fetch(`${api_base_url}/${id}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Data),
  });

  console.log(Data);

  if (!res.ok) {
    throw new Error("Failed to update studio profile");
  }

  return await res.json();
}


export async function updateBookingStatus(id, status) {
  const res = await fetch(`${api_base_url}/${id}/booking`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
  });

  if (!res.ok) {
    throw new Error("Failed to update booking");
  }

  return await res.json();
}


export async function addServiceBackend(data) {
  const res = await fetch(`${api_base_url}/service/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add service");
  }

  return await res.json();
}

export async function ApideleteService(id) {
  const res = await fetch(`${api_base_url}/service/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Failed to delete service");
  }

  // Check if response has body
  try {
    return await res.json();
  } catch {
    return { success: true };
  }
}

export async function updateServiceBackend(id, data) {
  const res = await fetch(`${api_base_url}/service/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  console.log("Backend response:", json);
  if (!res.ok) throw new Error(json.error || "Failed to update service");
  return json;
}
