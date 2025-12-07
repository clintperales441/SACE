/**
 * RouteGuard.js
 * Reusable utility function for checking authentication and role-based access
 */

import { jwtDecode } from 'jwt-decode';

/**
 * Checks if user is authenticated and has the required role
 * @param {string} token - JWT token from localStorage
 * @param {string} requiredRole - Required role for access (optional)
 * @returns {object} { isAuthenticated, hasRole, role, userId }
 */
export const checkAccess = (token, requiredRole = null) => {
  if (!token) {
    return {
      isAuthenticated: false,
      hasRole: false,
      role: null,
      userId: null,
    };
  }

  try {
    const decodedToken = jwtDecode(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      return {
        isAuthenticated: false,
        hasRole: false,
        role: null,
        userId: null,
      };
    }

    const userRole = decodedToken.role;
    const userId = decodedToken.sub;

    // If no specific role is required, just check authentication
    if (!requiredRole) {
      return {
        isAuthenticated: true,
        hasRole: true,
        role: userRole,
        userId: userId,
      };
    }

    // Check if user has the required role
    const hasRole = userRole === requiredRole;

    return {
      isAuthenticated: true,
      hasRole,
      role: userRole,
      userId: userId,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return {
      isAuthenticated: false,
      hasRole: false,
      role: null,
      userId: null,
    };
  }
};

/**
 * Check if user has specific role
 * @param {string} token - JWT token
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (token, role) => {
  const { hasRole: hasRequiredRole } = checkAccess(token, role);
  return hasRequiredRole;
};

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null}
 */
export const getRole = (token) => {
  const { role } = checkAccess(token);
  return role;
};

/**
 * Get user ID from token
 * @param {string} token - JWT token
 * @returns {string|null}
 */
export const getUserId = (token) => {
  const { userId } = checkAccess(token);
  return userId;
};
