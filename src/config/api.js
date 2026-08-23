// Centralized API configuration

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://campus2career-api-tbsz.onrender.com/api'

export const STORAGE_KEYS = {
  TOKEN: 'c2c_token',
  USER: 'c2c_user',
  ADMIN_TOKEN: 'c2c_admin_token',
  ADMIN_USER: 'c2c_admin_user',
}
