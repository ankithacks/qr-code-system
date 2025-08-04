"use client"
import { useNavigate } from "react-router-dom"
import { ShoppingBag, Users, Star, Store, BarChart3 } from "lucide-react"

const AdminPanel = () => {
  const navigate = useNavigate()

  const menuItems = [
    {
      title: "Catalog Management",
      description: "Manage products and offers",
      icon: ShoppingBag,
      path: "/admin/catalog",
      color: "bg-blue-500",
    },
    {
      title: "Customer Tracking",
      description: "View customer interactions",
      icon: Users,
      path: "/admin/customers",
      color: "bg-green-500",
    },
    {
      title: "Review Management",
      description: "Configure review questions",
      icon: Star,
      path: "/admin/reviews",
      color: "bg-yellow-500",
    },
    {
      title: "Store Management",
      description: "Manage multiple stores",
      icon: Store,
      path: "/admin/stores",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your QR customer interaction system</p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stores</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Interactions</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`${item.color} p-3 rounded-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
