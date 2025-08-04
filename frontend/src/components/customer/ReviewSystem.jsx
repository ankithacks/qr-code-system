"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { getReviewQuestions, getUserPurchases, submitReview } from "../../services/api"
import { ArrowLeft, Star } from "lucide-react"

const ReviewSystem = () => {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const { incrementInteraction, needsAuth, isAuthenticated, user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [purchasedProducts, setPurchasedProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [answers, setAnswers] = useState({})
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!isAuthenticated) {
          navigate(`/auth/${storeId}?redirect=review`)
          return
        }

        const [questionsResponse, purchasesResponse] = await Promise.all([
          getReviewQuestions(storeId),
          getUserPurchases(),
        ])

        setQuestions(questionsResponse.data)
        setPurchasedProducts(purchasesResponse.data)
        incrementInteraction()
      } catch (error) {
        console.error("Error loading review data:", error)
        setError("Failed to load review data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [storeId, incrementInteraction, isAuthenticated, navigate])

  const handleRatingChange = (questionId, rating) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: rating.toString(),
    }))
  }

  const handleTextChange = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate(`/auth/${storeId}?redirect=review`)
      return
    }

    if (!selectedProduct) {
      alert("Please select a product to review")
      return
    }

    if (rating === 0) {
      alert("Please provide a rating")
      return
    }

    setSubmitting(true)
    try {
      // Format answers for API
      const formattedAnswers = questions.map((question) => ({
        question_id: question.id,
        answer: answers[question.id] || "",
      }))

      await submitReview({
        product_id: Number.parseInt(selectedProduct),
        rating: rating,
        comment: comment,
        answers: formattedAnswers,
      })

      alert("Review submitted successfully!")
      navigate(`/store/${storeId}`)
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Error submitting review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate(`/store/${storeId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (needsAuth()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please authenticate to submit your review</p>
          <button
            onClick={() => navigate(`/auth/${storeId}?redirect=review`)}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Authenticate Now
          </button>
        </div>
      </div>
    )
  }

  if (purchasedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Rate & Review</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 flex items-center justify-center min-h-96">
          <div className="text-center">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Purchased Products</h3>
            <p className="text-gray-500 mb-4">You can only review products you have purchased</p>
            <button
              onClick={() => navigate(`/catalog/${storeId}`)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Catalog
            </button>
          </div>
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
            <h1 className="text-lg font-semibold">Rate & Review</h1>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Product to Review</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Choose a purchased product...</option>
              {purchasedProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          {/* Overall Rating */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-full transition-colors ${
                    rating >= star ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
              placeholder="Share your experience with this product..."
            />
          </div>

          {/* Review Questions */}
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">{question.question}</label>

              {question.type === "rating" ? (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(question.id, rating)}
                      className={`p-2 rounded-full transition-colors ${
                        answers[question.id] >= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter your answer..."
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !selectedProduct || rating === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReviewSystem
