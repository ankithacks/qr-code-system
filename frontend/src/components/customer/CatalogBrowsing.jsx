"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { getCatalog, trackProductView, trackProductPurchase } from "../../services/api"
import { ArrowLeft, Tag, Eye, ShoppingCart } from "lucide-react"

const CatalogBrowsing = () => {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const { incrementInteraction, needsAuth, isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewedProducts, setViewedProducts] = useState([])
  const [purchasedProducts, setPurchasedProducts] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await getCatalog(storeId)
        setProducts(response.data)
        incrementInteraction()
      } catch (error) {
        console.error("Error loading catalog:", error)
        setError("Failed to load catalog. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadCatalog()
  }, [storeId, incrementInteraction])

  const handleProductView = async (product) => {
    if (!viewedProducts.includes(product.id)) {
      setViewedProducts([...viewedProducts, product.id])
      incrementInteraction()

      // Track product view via API
      try {
        await trackProductView(product.id)
      } catch (error) {
        console.error("Error tracking product view:", error)
      }
    }

    if (needsAuth()) {
      navigate(`/auth/${storeId}?redirect=catalog`)
    }
  }

  const handleProductPurchase = async (product) => {
    if (!isAuthenticated) {
      navigate(`/auth/${storeId}?redirect=catalog`)
      return
    }

    try {
      await trackProductPurchase(product.id)
      setPurchasedProducts([...purchasedProducts, product.id])
      alert(`${product.name} purchased successfully!`)
    } catch (error) {
      console.error("Error tracking purchase:", error)
      alert("Failed to process purchase. Please try again.")
    }
  }

  const handleBack = () => {
    navigate(`/store/${storeId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
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
            <h1 className="text-lg font-semibold">Product Catalog</h1>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => handleProductView(product)}
                />
                {product.offer && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {product.offer}
                  </div>
                )}
                {viewedProducts.includes(product.id) && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                    <Eye className="h-4 w-4" />
                  </div>
                )}
                {purchasedProducts.includes(product.id) && (
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProductView(product)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleProductPurchase(product)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {needsAuth() && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm text-center">
              Please authenticate to continue browsing and make purchases
            </p>
            <button
              onClick={() => navigate(`/auth/${storeId}?redirect=catalog`)}
              className="w-full mt-2 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Authenticate Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogBrowsing
