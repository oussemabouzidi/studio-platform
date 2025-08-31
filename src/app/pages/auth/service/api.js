const api_base_url = `http://localhost:8800/api/auth`;


export async function login(email, password) {
    const res = await fetch(`${api_base_url}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    return data;

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
      const err = await res.json();
      throw new Error(err.error || "Failed to create account");
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
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Artist created with ID:', result.artistId);
      //Router.push("/pages/client/studios");
    } else {
      console.error('Failed to create artist:', result.error);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
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
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Studio created zlfkjsdmlfj with ID:', result.studioId);
      // Redirect or show success message
    } else {
      console.error('Failed to create studio:', result.error);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};