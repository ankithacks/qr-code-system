// CustomerCatalogPage.js
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import CustomerRegistrationModal from "./CustomerRegistrationModal";

const CustomerCatalogPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(() => {
    const storedCustomer = localStorage.getItem("customer");
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  });
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const catalogRef = useRef(null);

  // Fetch catalog items
  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const response = await api.get(`/customer/stores/${storeId}/catalog`);
        setCatalogItems(response.data.items);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load catalog");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogItems();
  }, [storeId]);

  // Scroll handler for registration modal - trigger when 2nd product comes into view
  useEffect(() => {
    const handleScroll = () => {
      if (customer || !catalogRef.current || catalogItems.length < 2) return;
      
      const { scrollTop, clientHeight } = catalogRef.current;
      
      // Get all product cards
      const productCards = catalogRef.current.querySelectorAll('[data-product-index]');
      
      if (productCards.length < 2) return;
      
      // Get the second product card (index 1)
      const secondProduct = productCards[1];
      const secondProductRect = secondProduct.getBoundingClientRect();
      const containerRect = catalogRef.current.getBoundingClientRect();
      
      // Check if the second product is visible in the viewport
      // We want to trigger when the second product is at least 50% visible
      const secondProductTop = secondProductRect.top - containerRect.top;
      const secondProductVisible = secondProductTop <= clientHeight * 0.5;
      
      if (secondProductVisible) {
        setShowRegistrationModal(true);
      }
    };

    const catalogElement = catalogRef.current;
    if (catalogElement && catalogItems.length > 0) {
      catalogElement.addEventListener('scroll', handleScroll);
      return () => catalogElement.removeEventListener('scroll', handleScroll);
    }
  }, [customer, catalogItems]);

  const handleViewDetails = (item) => {
    navigate(`/catalog/${storeId}/${item.id}`);
  };

  const handleRegisterSuccess = (customerData) => {
    localStorage.setItem("customer", JSON.stringify(customerData));
    setCustomer(customerData);
    setShowRegistrationModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Go Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Products
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Browse our catalog
            </p>
            {customer && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Welcome back, {customer.name}
              </div>
            )}
          </div>
        </div>

        {/* Catalog Grid */}
        <div 
          ref={catalogRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 max-h-screen overflow-y-auto"
          style={{ maxHeight: '70vh' }}
        >
          {catalogItems.map((item, index) => (
            <div 
              key={item.id} 
              data-product-index={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <svg 
                  className="h-20 w-20 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {item.category || "General"}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{item.description}</p>
                
                <div className="mt-4">
                  {item.has_offer ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-red-600">
                        {formatCurrency(item.offer_price)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="ml-2 px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">
                        SALE
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(item.price)}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {catalogItems.length === 0 && (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products available</h3>
            <p className="mt-1 text-sm text-gray-500">
              This store hasn't added any products yet.
            </p>
          </div>
        )}

        {/* Registration Modal */}
        {showRegistrationModal && (
          <CustomerRegistrationModal
            storeId={storeId}
            onSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    </div>
  );
};

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

export default CustomerCatalogPage;