"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useStore } from "../../contexts/StoreContext"
import { ArrowLeft, Plus, Edit, Trash2, Store, QrCode, Copy, ExternalLink } from "lucide-react"

const StoreManagement = () => {
  const navigate = useNavigate()
  const { stores } = useStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStore, setEditingStore] = useState(null)
  const [storeList, setStoreList] = useState(stores)
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  })

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingStore) {
      setStoreList((prev) => prev.map((s) => (s.id === editingStore.id ? { ...formData, id: editingStore.id } : s)))
    } else {
      const newStore = {
        ...formData,
        id: Date.now().toString(),
      }
      setStoreList((prev) => [...prev, newStore])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
    })
    setShowAddForm(false)
    setEditingStore(null)
  }

  const handleEdit = (store) => {
    setFormData(store)
    setEditingStore(store)
    setShowAddForm(true)
  }

  const handleDelete = (storeId) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      setStoreList((prev) => prev.filter((s) => s.id !== storeId))
    }
  }

  const generateQRUrl = (storeId) => {
    return `${window.location.origin}/store/${storeId}`
  }

  const copyQRUrl = (storeId) => {
    const url = generateQRUrl(storeId)
    navigator.clipboard.writeText(url)
    alert("QR URL copied to clipboard!")
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
              <h1 className="text-xl font-semibold">Store Management</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">{editingStore ? "Edit Store" : "Add New Store"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="/placeholder.svg?height=50&width=50"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {editingStore ? "Update" : "Add"} Store
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

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeList.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={store.logo || "/placeholder.svg"}
                  alt={store.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{store.name}</h3>
                  <p className="text-gray-500 text-sm">Store ID: {store.id}</p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">QR Code URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generateQRUrl(store.id)}
                    readOnly
                    className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() => copyQRUrl(store.id)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => window.open(generateQRUrl(store.id), "_blank")}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(store)}
                  className="flex-1 bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {storeList.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No stores yet</h3>
            <p className="text-gray-500 mb-4">Create your first store to start managing customer interactions</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add First Store
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreManagement
