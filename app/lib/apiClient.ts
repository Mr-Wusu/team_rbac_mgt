const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    const response = await fetch(url, config);

    if (response.status === 401) return null;

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  },

  // Auth Methods
  async register(userData: unknown) {
    return apiClient.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async login(email: string, password: string) {
    return apiClient.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return apiClient.request("/api/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser() {
    return apiClient.request("/api/auth/me");
  },

  // User Methods
  async getUsers() {
    return apiClient.request("/api/users");
  },

  // Admin Methods
  async updateUserRole(userId: string, role: string) {
    return apiClient.request(`/api/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  async assignUserToTeam(userId: string, teamId: string) {
    return apiClient.request(`/api/users/${userId}/team`, {
      method: "PATCH",
      body: JSON.stringify({ teamId }),
    });
  },
};

export default apiClient;
