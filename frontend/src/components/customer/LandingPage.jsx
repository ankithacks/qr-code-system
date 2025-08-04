"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useStore } from "../../contexts/StoreContext"
import { getStoreInfo } from "../../services/api"
import { ShoppingBag, Star, QrCode } from "lucide-react"

const LandingPage = () => {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const { setCurrentStore } = useStore()
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStore = async () => {
      try {
        if (storeId) {
          const response = await getStoreInfo(storeId)
          setStore(response.data)
          setCurrentStore(response.data)
        } else {
          // Default store for demo
          const defaultStore = { id: "1", name: "Electronics Store", logo: "/placeholder.svg?height=50&width=50" }
          setStore(defaultStore)
          setCurrentStore(defaultStore)
        }
      } catch (error) {
        console.error("Error loading store:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStore()
  }, [storeId, setCurrentStore])

  const handleCatalogClick = () => {
    navigate(`/catalog/${store?.id || "1"}`)
  }

  const handleReviewClick = () => {
    navigate(`/review/${store?.id || "1"}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center mb-4">
            <QrCode className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to</h1>
          <div className="flex items-center justify-center gap-3">
            {store?.logo && (
              <img src={store.logo || "/placeholder.svg"} alt={store.name} className="h-12 w-12 rounded-full" />
            )}
            <h2 className="text-xl font-semibold text-blue-600">{store?.name}</h2>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div
            onClick={handleCatalogClick}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Browse Catalog</h3>
                <p className="text-gray-600 text-sm">Explore our products and exclusive offers</p>
              </div>
              <div className="text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div
            onClick={handleReviewClick}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Rate & Review</h3>
                <p className="text-gray-600 text-sm">Share your experience with our products</p>
              </div>
              <div className="text-green-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Scan QR code to access this page</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
