const API_BASE_URL = "/api/proxy";
const api_base_url = `${API_BASE_URL}/auth`;

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}


export async function login(email, password) {
  let res;
  try {
    res = await fetch(`${api_base_url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    throw new Error(
      "Network error while logging in. Make sure the backend API is running and reachable.",
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore (non-JSON error response)
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) || "Login failed. Please try again.";
    throw new Error(message);
  }

  return data;

}

export async function logout() {
  // Best-effort: clear the backend session cookie (if the backend supports it).
  // The UI should still clear localStorage + redirect even if this fails.
  try {
    const res = await fetch(`${api_base_url}/logout`, {
      method: "POST",
      credentials: "include",
      keepalive: true,
    });

    if (res.ok) return true;
  } catch {
    // ignore
  }

  try {
    const res = await fetch(`${api_base_url}/logout`, {
      method: "GET",
      credentials: "include",
      keepalive: true,
    });

    return res.ok;
  } catch {
    return false;
  }
}

export const createAccount = async (firstName, lastName, email, password) => {
  try {
    console.log(JSON.stringify({ firstName, lastName, email, password }))
    const res = await fetch(`${api_base_url}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!res.ok) {
      const err = await readJsonSafe(res);
      throw new Error((err && err.error) || "Failed to create account");
    }

    return await res.json(); // { message, userId }
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};


export const createAccountArtist = async (userId, formData) => {
  try {
    // Get the user ID from your auth system
    // This is just a placeholder - you'll need to get the actual user ID
    
    const response = await fetch( `${api_base_url}/artist/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...formData
      })
    });
    
    const result = await readJsonSafe(response);
    
    if (!response.ok) {
      const message =
        (result && (result.error || result.message)) ||
        `Failed to create artist (HTTP ${response.status})`;
      throw new Error(message);
    }

    if (result && result.success) {
      console.log('Artist created with ID:', result.artistId);
      //Router.push("/pages/client/studios");
      return result;
    } else {
      const message =
        (result && (result.error || result.message)) || "Failed to create artist";
      throw new Error(message);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

export const createAccountStudio = async (userId, formData) => {
  try {
    
    const response = await fetch(`${api_base_url}/studio/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...formData
      })
    });
    
    const result = await readJsonSafe(response);
    
    if (!response.ok) {
      const message =
        (result && (result.error || result.message)) ||
        `Failed to create studio (HTTP ${response.status})`;
      throw new Error(message);
    }

    if (result && result.success) {
      console.log('Studio created zlfkjsdmlfj with ID:', result.studioId);
      // Redirect or show success message
      return result;
    } else {
      const message =
        (result && (result.error || result.message)) || "Failed to create studio";
      throw new Error(message);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};
