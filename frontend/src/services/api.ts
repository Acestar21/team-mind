import axios from "axios";

const BASE_URL = "http://localhost:5000/api/messages";

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchMessages = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:5000/api/messages", {
       headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.messages || response.data || [];  
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// Create a new message
export const createMessage = async (text: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/api/messages",
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating message:", error);
    return null;
  }
};


// Update a message
export const updateMessage = async (id: string, text: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, { text }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error("Error updating message:", error);
    return null;
  }
};

// Delete a message
export const deleteMessage = async (id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    return null;
  }
};

const AUTH_URL = "http://localhost:5000/api/auth";

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, { email, password });
    return response.data; // { token, user }
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};

// Register user (optional)
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};