"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Eye, Star, Calendar } from "lucide-react"
import { getCustomerInteractions } from "../../services/api"

const CustomerTracking = () => {
  const navigate = useNavigate()
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  useEffect(() => {
    loadInteractions()
  }, [])

  const loadInteractions = async () => {
    try {
      const response = await getCustomerInteractions()
      setInteractions(response.data)
    } catch (error) {
      console.error("Error loading interactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case "viewed catalog":
        return <Eye className="h-4 w-4 text-blue-600" />
      case "submitted review":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "viewed product":
        return <Eye className="h-4 w-4 text-green-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case "viewed catalog":
        return "bg-blue-100 text-blue-800"
      case "submitted review":
        return "bg-yellow-100 text-yellow-800"
      case "viewed product":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredInteractions = interactions.filter((interaction) => {
    if (filter === "all") return true
    return interaction.action.toLowerCase().includes(filter.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <h1 className="text-xl font-semibold">Customer Tracking</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Actions</option>
                <option value="viewed">Viewed</option>
                <option value="review">Reviews</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                <p className="text-2xl font-bold text-gray-900">{interactions.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Catalog Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interactions.filter((i) => i.action.includes("Catalog")).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviews Submitted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interactions.filter((i) => i.action.includes("Review")).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(interactions.map((i) => i.customerName)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Interactions Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Interactions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInteractions.map((interaction) => (
                  <tr key={interaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{interaction.customerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getActionIcon(interaction.action)}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(interaction.action)}`}
                        >
                          {interaction.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Store {interaction.storeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(interaction.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInteractions.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No interactions found</h3>
              <p className="text-gray-500">Customer interactions will appear here once they start using the system</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerTracking
