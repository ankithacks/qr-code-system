"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Edit, Trash2, Star, MessageSquare } from "lucide-react"
import { getReviewQuestions } from "../../services/api"

const ReviewManagement = () => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    question: "",
    type: "rating",
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const response = await getReviewQuestions("1")
      setQuestions(response.data)
    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? { ...formData, id: editingQuestion.id } : q)),
      )
    } else {
      const newQuestion = {
        ...formData,
        id: Date.now().toString(),
      }
      setQuestions((prev) => [...prev, newQuestion])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      question: "",
      type: "rating",
    })
    setShowAddForm(false)
    setEditingQuestion(null)
  }

  const handleEdit = (question) => {
    setFormData(question)
    setEditingQuestion(question)
    setShowAddForm(true)
  }

  const handleDelete = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin")} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">Review Management</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">{editingQuestion ? "Edit Question" : "Add New Question"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="rating">Rating (1-5 stars)</option>
                    <option value="text">Text Response</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    {editingQuestion ? "Update" : "Add"} Question
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded-full">
                      Question {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      {question.type === "rating" ? (
                        <>
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-gray-600">Rating</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Text</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-900 text-lg">{question.question}</p>
                  {question.type === "rating" && (
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">1-5 star rating</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(question)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No review questions yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first review question to start collecting customer feedback
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Add First Question
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewManagement
