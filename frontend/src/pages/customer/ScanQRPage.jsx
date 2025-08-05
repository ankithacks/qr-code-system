import { useParams, useNavigate } from 'react-router-dom';

const ScanQRPage = () => {
  const { storeId } = useParams(); // Changed from qr_code to storeId
  const navigate = useNavigate();

  const handleBrowseCatalog = () => {
    navigate(`/catalog/${storeId}`);
  };

  const handleSubmitReview = () => {
    navigate(`/review/${storeId}`);
  };
  console.log(storeId)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome to our Store
          </h2>
          <p className="mt-2 text-gray-600">Scan ID: {storeId}</p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleBrowseCatalog}
            className="w-full flex justify-center items-center px-4 py-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse Catalog
          </button>

          <button
            onClick={handleSubmitReview}
            className="w-full flex justify-center items-center px-4 py-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage;