import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";

const Analytics = () => {
  const { store_id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("customers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyticsData, setAnalyticsData] = useState({
    customers: null,
    interactions: null,
    reviews: null,
  });

  // Fetch analytics data based on active tab
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        // Only fetch if we don't already have the data
        if (!analyticsData[activeTab]) {
          const response = await api.get(
            `/admin/stores/${store_id}/analytics/${activeTab}`
          );
          setAnalyticsData((prev) => ({
            ...prev,
            [activeTab]: response.data,
          }));
        }
      } catch (err) {
        setError(
          err.response?.data?.error || `Failed to fetch ${activeTab} data`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [activeTab, store_id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Store Analytics
            </h1>
            <button
              onClick={() => navigate(`/admin/stores`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Store
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("customers")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "customers"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Customers
              </button>
              <button
                onClick={() => setActiveTab("interactions")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "interactions"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Interactions
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading analytics data...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {/* Customers Tab */}
              {activeTab === "customers" && analyticsData.customers && (
                <div>
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Customer Analytics
                    </h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800">
                          Total Customers
                        </h4>
                        <p className="mt-1 text-2xl font-semibold text-blue-600">
                          {analyticsData.customers.total_customers}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800">
                          Verified Customers
                        </h4>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                          {analyticsData.customers.verified_customers}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-purple-800">
                          Avg. Purchases/Customer
                        </h4>
                        <p className="mt-1 text-2xl font-semibold text-purple-600"></p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-md font-medium mb-3">
                      Recent Customers
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Interactions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Purchases
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.customers.customers.map((customer) => (
                            <tr key={customer.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {customer.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {customer.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    customer.verified
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {customer.verified
                                    ? "Verified"
                                    : "Unverified"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {customer.interactions_count}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {customer.purchases_count}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(customer.joined_at)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactions Tab */}
              {activeTab === "interactions" && analyticsData.interactions && (
                <div>
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Customer Interactions
                    </h3>
                    <div className="mt-2">
                      <div className="bg-indigo-50 p-4 rounded-lg inline-block">
                        <h4 className="text-sm font-medium text-indigo-800">
                          Total Interactions
                        </h4>
                        <p className="mt-1 text-2xl font-semibold text-indigo-600">
                          {analyticsData.interactions.total_interactions}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-md font-medium mb-3">
                      Recent Interactions
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Timestamp
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.interactions.recent_interactions.map(
                            (interaction) => (
                              <tr key={interaction.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {interaction.customer_name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 capitalize">
                                    {interaction.interaction_type}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {interaction.catalog_item || "N/A"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {formatDate(interaction.timestamp)}
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && analyticsData.reviews && (
                <div>
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Product Reviews
                    </h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800">
                          Total Reviews
                        </h4>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                          {analyticsData.reviews.total_reviews}
                        </p>
                      </div>
                      
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <h4 className="text-md font-medium mb-3">Recent Reviews</h4>
                    <div className="space-y-4">
                      {analyticsData.reviews.recent_reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {review.customer_name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                Reviewed {review.catalog_item}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {renderRatingStars(review.overall_rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                {formatDate(review.created_at)}
                              </span>
                            </div>
                          </div>
                          {review.comment && (
                            <div className="mt-2 p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-700">
                                {review.comment}
                              </p>
                            </div>
                          )}
                          {review.answers.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {review.answers.map((answer, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium text-gray-700">
                                    {answer.question}:
                                  </span>{" "}
                                  <span className="text-gray-600">
                                    {answer.answer}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
