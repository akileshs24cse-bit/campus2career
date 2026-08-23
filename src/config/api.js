// Centralized API configuration

const rawUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : 'https://campus2career-api-tbsz.onrender.com/api'

const cleanUrl = rawUrl.replace(/\/+$/, '')

// Always guarantee the API base URL has /api at the end
export const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`

export const STORAGE_KEYS = {
  TOKEN: 'c2c_token',
  USER: 'c2c_user',
  ADMIN_TOKEN: 'c2c_admin_token',
  ADMIN_USER: 'c2c_admin_user',
}
