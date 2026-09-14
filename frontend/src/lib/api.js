const API_URL = "http://localhost:5000/api";

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || data.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const handleSessionError = (error) => {
  if (error.status === 401 || error.status === 403) {
    sessionStorage.removeItem("crm-authenticated");
    window.location.assign("/login");
  }
};