// Authentication utilities
export const auth = {
  // Get token from localStorage
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  // Get token type from localStorage
  getTokenType: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token_type') || 'bearer';
    }
    return 'bearer';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!auth.getToken();
  },

  // Get authorization header
  getAuthHeader: () => {
    const token = auth.getToken();
    const tokenType = auth.getTokenType();
    return token ? `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}` : null;
  },

  // Logout user
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      window.location.href = '/login';
    }
  },

  // Get current user info from token
  getCurrentUser: () => {
    const token = auth.getToken();
    if (!token) return null;

    try {
      // Decode JWT token (basic decode, not verified)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        role: payload.role,
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: () => {
    const user = auth.getCurrentUser();
    if (!user) return true;
    
    const now = Date.now() / 1000;
    return user.exp < now;
  }
};

// API wrapper with authentication
export const authenticatedFetch = async (url, options = {}) => {
  const authHeader = auth.getAuthHeader();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(authHeader && { Authorization: authHeader })
    }
  };

  const response = await fetch(url, config);
  
  // If unauthorized, logout and redirect
  if (response.status === 401) {
    auth.logout();
    return response;
  }

  return response;
};