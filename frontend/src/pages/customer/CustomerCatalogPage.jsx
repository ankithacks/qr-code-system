import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CustomerCatalogPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch catalog items
  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const response = await api.get(`/customer/stores/${storeId}/catalog`);
        setCatalogItems(response.data.items);
        setRequiresAuth(response.data.requires_auth);
        setTotalItems(response.data.total_items);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load catalog');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogItems();
  }, [storeId]);

  const handleViewItem = async (itemId) => {
    try {
      const response = await api.get(`/customer/stores/${storeId}/catalog/${itemId}`);
      setSelectedItem(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load product details');
    }
  };

  const handleLoadMore = async () => {
    setShowAuthModal(true);
  };

  const handleAuthSubmit = async (customerData) => {
    try {
      // Implement your authentication flow here
      // After successful auth, fetch full catalog
      const response = await api.get(`/customer/stores/${storeId}/catalog`);
      setCatalogItems(response.data.items);
      setRequiresAuth(false);
      setShowAuthModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Store Catalog</h1>
          <p className="mt-1 text-sm text-gray-500">{totalItems} products available</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {catalogItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewItem(item.id)}
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                {/* Placeholder for product image */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                <div className="mt-2">
                  {item.has_offer ? (
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-red-600">
                        {formatCurrency(item.offer_price)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(item.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
       </main>
        {/* Load More / Auth Prompt */}
        {requiresAuth && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All {totalItems} Products (Requires Sign In)
            </button>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Description</h3>
                      <p className="mt-1 text-sm text-gray-500">{selectedItem.description}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Details</h3>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">Category: {selectedItem.category}</p>
                        {selectedItem.has_offer ? (
                          <div className="mt-1">
                            <p className="text-lg font-semibold text-red-600">
                              Sale Price: {formatCurrency(selectedItem.offer_price)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              Regular Price: {formatCurrency(selectedItem.price)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-semibold text-gray-900">
                            Price: {formatCurrency(selectedItem.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">Reviews</h3>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-5 w-5 ${rating < Math.round(selectedItem.average_rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {selectedItem.average_rating.toFixed(1)} ({selectedItem.reviews_count} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">Sign In Required</h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mt-4 text-gray-600">
                Please sign in to view all {totalItems} products in our catalog.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleAuthSubmit({ /* customer data */ })}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CustomerCatalogPage;