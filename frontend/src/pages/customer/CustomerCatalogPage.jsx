import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import CustomerRegistrationModal from "./CustomerRegistrationModal";

const CustomerCatalogPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [customer, setCustomer] = useState(() => {
    // Check localStorage for existing customer data
    const storedCustomer = localStorage.getItem("customer");
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  });

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

  const handlePurchase = (item) => {
    setSelectedItem(item);
    if (customer) {
      // Customer exists, proceed to purchase
      initiatePurchase(item.id);
    } else {
      // No customer, show registration modal
      setShowPurchaseModal(true);
    }
  };

  const initiatePurchase = async (itemId) => {
    try {
      const response = await api.post(
        `/customer/customers/${customer.id}/purchases`,
        {
          catalog_item_id: itemId,
          store_id: storeId,
        }
      );
      alert("Purchase successful!");
      // You might want to navigate to a purchase confirmation page
    } catch (err) {
      setError(err.response?.data?.error || "Purchase failed");
    }
  };

  const handleRegisterSuccess = (customerData) => {
    localStorage.setItem("customer", JSON.stringify(customerData));
    setCustomer(customerData);
    setShowPurchaseModal(false);

    // Remove this line that was automatically initiating purchase
    // initiatePurchase(selectedItem.id);

    // Instead, show success message
    alert("Registration successful! You can now make purchases.");
  };

  if (loading) {
    return <div className="text-center py-8">Loading catalog...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Store Catalog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <div className="mt-4">
              {item.has_offer ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-red-600">
                    ${item.offer_price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${item.price}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold">${item.price}</span>
              )}
            </div>
            <button
              onClick={() => handlePurchase(item)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showPurchaseModal && selectedItem && (
        <CustomerRegistrationModal
          storeId={storeId}
          item={selectedItem}
          onSuccess={handleRegisterSuccess}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </div>
  );
};

export default CustomerCatalogPage;
