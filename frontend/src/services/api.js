import config from "../config/api.config";

const API_URL = config.API_URL;

const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
};

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include", // Important: send cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);
  // Store user info (not token) in localStorage for UI purposes
  if (data.id) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }),
    );
  }
  return data;
};

const logout = async () => {
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include", // Important: send cookies
      headers: getHeaders(),
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("user");
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getPrompts = async () => {
  const response = await fetch(`${API_URL}/prompts`, {
    method: "GET",
    credentials: "include", // Important: send cookies
    headers: getHeaders(),
  });
  return handleResponse(response);
};

const savePrompts = async (prompts) => {
  const response = await fetch(`${API_URL}/prompts`, {
    method: "POST",
    credentials: "include", // Important: send cookies
    headers: getHeaders(),
    body: JSON.stringify(prompts),
  });
  return handleResponse(response);
};

const resetPrompts = async () => {
  const response = await fetch(`${API_URL}/prompts`, {
    method: "DELETE",
    credentials: "include", // Important: send cookies
    headers: getHeaders(),
  });
  return handleResponse(response);
};

const resetMainPrompt = async () => {
  const response = await fetch(`${API_URL}/prompts/main`, {
    method: "DELETE",
    credentials: "include", // Important: send cookies
    headers: getHeaders(),
  });
  return handleResponse(response);
};

const resetStaticPrompt = async () => {
  const response = await fetch(`${API_URL}/prompts/static`, {
    method: "DELETE",
    credentials: "include", // Important: send cookies
    headers: getHeaders(),
  });
  return handleResponse(response);
};

const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    credentials: "include", // Important: send cookies
    headers: getHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(response);
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getPrompts,
  savePrompts,
  resetPrompts,
  resetMainPrompt,
  resetStaticPrompt,
  changePassword,
};

export default authService;
