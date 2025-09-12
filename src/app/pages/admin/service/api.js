const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const api_base_url = `${API_BASE_URL}/admin`;


export async function getStudios(){
  const res = await fetch(`${api_base_url}/studios`); 

  if (!res.ok) {
    throw new Error("Failed to fetch studios");
  }

  const backStudios = await res.json();

  const uiStudios = backStudios.map((s) => ({
    id: s.id,
    user_id: s.user_id,
    name: s.name,
    location: s.location,
    status: s.status,
    revenue: s.total_revenue,
    bookings: s.number_of_bookings,
    rating: s.average_rating
  }));

  return uiStudios;
}


export async function getArtists(){
  const res = await fetch(`${api_base_url}/artists`); 

  if (!res.ok) {
    throw new Error("Failed to fetch artists");
  }

  const backArtist = await res.json();

  const uiArtist = backArtist.map((s) => ({
    id: s.id,
    user_id: s.user_id,
    full_name: s.full_name,
    email: s.email,
    status: s.status,
    instagram: s.instagram,
    genre: s.genre_name,
    verified: s.verified
  }));

  return uiArtist;
}

export async function apiUpdateArtistStatus(id, status) {
  const res = await fetch(`${api_base_url}/artist/${id}/status`, {   // ✅ fixed
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),   // ✅ correct body
  });

  if (!res.ok) throw new Error("Failed to update artist status");
  return await res.json();
}

export async function apiupdateArtistVerification(id, verified) {
  const res = await fetch(`${api_base_url}/artist/${id}/verification`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verified }),   // ✅ correct body
  });

  if (!res.ok) throw new Error("Failed to update artist verification");
  return await res.json();
}

export async function apiupdateStudioActivation(id, activated) {
  const res = await fetch(`${api_base_url}/studio/${id}/activation`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activated }),   // ✅ correct body
  });

  if (!res.ok) throw new Error("Failed to update studio activation");
  return await res.json();
}

export async function apiupdateStudioStatus(id, status) {
  const res = await fetch(`${api_base_url}/studio/${id}/status`, {   // ✅ fixed endpoint
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),   // ✅ correct body
  });

  if (!res.ok) throw new Error("Failed to update studio status");
  return await res.json();
}


export async function getStats() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/stats/show`);

  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }

  const stats = await res.json();
  
  // The API now returns a fully processed object, no need for extensive mapping
  // Just ensure all data types are correct and add any frontend-specific formatting
  
  return {
    // User Statistics - ready to use
    userStats: {
      total: stats.userStats.total,
      artists: stats.userStats.artists,
      studios: stats.userStats.studios,
      admins: stats.userStats.admins,
      breakdown: stats.userStats.breakdown
    },

    // User Growth - formatted for charts
    userGrowth: {
      artists: stats.userGrowth.artists.map(item => ({
        month: formatMonthName(item.month), // Convert 2024-08 to "Aug"
        count: item.count
      })),
      studios: stats.userGrowth.studios.map(item => ({
        month: formatMonthName(item.month),
        count: item.count
      }))
    },

    // Revenue Statistics - ready to use
    revenueStats: {
      monthly: stats.revenueStats.monthly.map(item => ({
        month: formatMonthName(item.month),
        revenue: item.revenue
      })),
      yearly: stats.revenueStats.yearly,
      currentMonth: stats.revenueStats.currentMonth,
      currentYear: stats.revenueStats.currentYear,
      total: stats.revenueStats.total
    },

    // Booking Statistics - ready to use
    bookingStats: {
      priceRanges: stats.bookingStats.priceRanges,
      timeSlots: stats.bookingStats.timeSlots,
      total: stats.bookingStats.total
    },

    // Top Studios - ready to use
    topStudios: stats.topStudios,

    // Enhanced Gamification - ready to use
    gamification: {
      stats: stats.gamification.stats,
      topUsers: stats.gamification.topUsers,
      summary: stats.gamification.summary
    },

    // Device Usage - ready to use
    deviceUsage: stats.deviceUsage.map(item => ({
      device: item.device.charAt(0).toUpperCase() + item.device.slice(1),
      count: item.count,
      uniqueUsers: item.uniqueUsers,
      percentage: parseFloat(item.percentage)
    })),

    // Geographic Distribution - ready to use
    artistCountries: stats.artistCountries.map(item => ({
      country: item.country,
      users: item.users,
      percentage: parseFloat(item.percentage)
    })),

    studioCountries: stats.studioCountries.map(item => ({
      country: item.country,
      users: item.users,
      percentage: parseFloat(item.percentage)
    })),

    // Summary metrics for dashboard overview
    summary: stats.summary
  };
}

// Helper function to format month names
function formatMonthName(monthString) {
  // Convert "2024-08" to "Aug"
  const [year, month] = monthString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[parseInt(month) - 1];
}