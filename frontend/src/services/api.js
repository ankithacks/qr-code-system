import axios from "axios"
import { getApiConfig } from "../config/api"

const config = getApiConfig()

const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT,
})

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token")
      window.location.href = "/auth/1" // Redirect to auth
    }
    return Promise.reject(error)
  },
)

// Authentication APIs
export const sendOTP = async (email, phone) => {
  const payload = {}
  if (email) payload.email = email
  if (phone) payload.phone = phone

  const response = await api.post("/auth/send_otp", payload)
  return response
}

export const verifyOTP = async (email, phone, otp) => {
  const payload = { otp }
  if (email) payload.email = email
  if (phone) payload.phone = phone

  const response = await api.post("/auth/verify_otp", payload)

  // Store JWT token
  if (response.data.token) {
    localStorage.setItem("jwt_token", response.data.token)
  }

  return response
}

// Store and Catalog APIs
export const getStoreInfo = async (storeId) => {
  const response = await api.get(`/stores/${storeId}`)
  return response
}

export const getCatalog = async (storeId) => {
  const response = await api.get(`/stores/${storeId}/catalogs`)
  return response
}

// Product Interaction APIs
export const trackProductView = async (productId) => {
  const response = await api.post(`/products/${productId}/view`)
  return response
}

export const trackProductPurchase = async (productId) => {
  const response = await api.post(`/products/${productId}/purchase`)
  return response
}

// Review APIs
export const getReviewQuestions = async (storeId) => {
  const response = await api.get(`/stores/${storeId}/review_questions`)
  return response
}

export const submitReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData)
  return response
}

// User Profile APIs
export const updateUserProfile = async (profileData) => {
  const response = await api.put("/user/profile", profileData)
  return response
}

export const getUserPurchases = async () => {
  const response = await api.get("/user/purchases")
  return response
}

// Admin APIs (if needed)
export const getCustomerInteractions = async () => {
  const response = await api.get("/admin/interactions")
  return response
}

export const createProduct = async (productData) => {
  const response = await api.post("/admin/products", productData)
  return response
}

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/admin/products/${productId}`, productData)
  return response
}

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`)
  return response
}

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("jwt_token")
}

// Utility function to get stored token
export const getToken = () => {
  return localStorage.getItem("jwt_token")
}

// Utility function to logout
export const logout = () => {
  localStorage.removeItem("jwt_token")
}

export default api
