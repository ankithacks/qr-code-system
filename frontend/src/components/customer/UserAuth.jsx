"use client"

import { useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { sendOTP, verifyOTP, updateUserProfile } from "../../services/api"
import { ArrowLeft, Phone, Mail, User, MapPin } from "lucide-react"

const UserAuth = () => {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const [step, setStep] = useState("details") // 'details', 'otp', 'success'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Send OTP to email or phone (prefer email if both provided)
      await sendOTP(formData.email, formData.phone)
      setStep("otp")
    } catch (error) {
      console.error("Error sending OTP:", error)
      setError(error.response?.data?.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Verify OTP and get JWT token
      const response = await verifyOTP(formData.email, formData.phone, otp)

      // Update user profile with additional details
      try {
        await updateUserProfile({
          name: formData.name,
          address: formData.address,
        })
      } catch (profileError) {
        console.warn("Profile update failed:", profileError)
        // Continue even if profile update fails
      }

      const userData = {
        ...formData,
        id: Date.now().toString(),
      }

      login(userData, response.data.token)
      setStep("success")

      // Redirect after success
      setTimeout(() => {
        const redirect = searchParams.get("redirect")
        if (redirect === "catalog") {
          navigate(`/catalog/${storeId}`)
        } else if (redirect === "review") {
          navigate(`/review/${storeId}`)
        } else {
          navigate(`/store/${storeId}`)
        }
      }, 2000)
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setError(error.response?.data?.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === "otp") {
      setStep("details")
    } else {
      navigate(`/store/${storeId}`)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError("")

    try {
      await sendOTP(formData.email, formData.phone)
      alert("OTP sent successfully!")
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Authentication</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {step === "details" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Enter Your Details</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </div>
        )}

        {step === "otp" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Verify OTP</h2>

            <div className="text-center mb-6">
              <p className="text-gray-600">We've sent a verification code to</p>
              <p className="font-semibold text-blue-600">{formData.email || formData.phone}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
              >
                Resend OTP
              </button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Authentication Successful!</h2>
            <p className="text-gray-600 mb-4">Welcome, {formData.name}!</p>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAuth
