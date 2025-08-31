const api_base_url = `http://localhost:8800/api/admin`;


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
