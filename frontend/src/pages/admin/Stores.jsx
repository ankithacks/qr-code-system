import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const StoresManagement = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });

  // Fetch all stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/admin/stores');
        setStores(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleViewCatalog = (storeId) => {
    navigate(`/admin/catalog/${storeId}`);
  };

  const handleViewReviews = (storeId) => {
    navigate(`/admin/reviews/${storeId}`);
  };

  const handleViewAnalytics = (storeId) => {
    navigate(`/admin/analytics/${storeId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/admin/stores', {
        store: formData
      });
      setStores([...stores, response.data.store]);
      resetForm();
      setIsCreating(false);
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to create store');
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.put(`/admin/stores/${currentStore.id}`, {
        store: formData
      });
      setStores(stores.map(store => 
        store.id === currentStore.id ? { ...store, ...response.data.store } : store
      ));
      resetForm();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to update store');
    }
  };

  const handleDeleteStore = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await api.delete(`/admin/stores/${id}`);
        setStores(stores.filter(store => store.id !== id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete store');
      }
    }
  };

  const handleEditClick = (store) => {
    setCurrentStore(store);
    setFormData({
      name: store.name,
      description: store.description,
      address: store.address,
      phone: store.phone,
      email: store.email
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: ''
    });
    setCurrentStore(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsCreating(false);
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Stores</h2>
            <button
              onClick={() => {
                setIsCreating(true);
                setIsEditing(false);
                resetForm();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create New Store
            </button>
          </div>

          {(isCreating || isEditing) && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-medium mb-4">
                {isEditing ? 'Edit Store' : 'Create New Store'}
              </h3>
              <form onSubmit={isEditing ? handleUpdateStore : handleCreateStore}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isEditing ? 'Update Store' : 'Create Store'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading stores...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <tr key={store.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{store.name}</div>
                              <div className="text-sm text-gray-500">{store.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{store.catalog_items_count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{store.customers_count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {store.qr_code ? (
                            <a 
                              href={store.qr_code.scan_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              View QR Code
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">No QR Code</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(store)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStore(store.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewCatalog(store.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Catalog
                          </button>
                          <button
                            onClick={() => handleViewReviews(store.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Reviews
                          </button>
                          <button
                            onClick={() => handleViewAnalytics(store.id)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Analytics
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No stores found. Create your first store.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StoresManagement;