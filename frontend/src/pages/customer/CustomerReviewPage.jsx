import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CustomerReviewPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewData, setReviewData] = useState({
    overall_rating: 0,
    comment: '',
    answers: {}
  });
  const [customer, setCustomer] = useState(() => {
    // Check localStorage for existing customer data
    const storedCustomer = localStorage.getItem('customer');
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  });

  // Fetch review questions and purchased items
  useEffect(() => {
    const fetchData = async () => {
      if (!customer) {
        setLoading(false);
        return;
      }

      try {
        const [questionsRes, itemsRes] = await Promise.all([
          api.get(`/customer/customers/${customer.id}/review_questions`),
          api.get(`/customer/customers/${customer.id}/purchased_items`)
        ]);
        setQuestions(questionsRes.data);
        setPurchasedItems(itemsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load review data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customer, storeId]);

  const handleRatingChange = (rating) => {
    setReviewData(prev => ({
      ...prev,
      overall_rating: rating
    }));
  };

  const handleAnswerChange = (questionId, answer) => {
    setReviewData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  const handleCommentChange = (e) => {
    setReviewData(prev => ({
      ...prev,
      comment: e.target.value
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Check if customer exists
    if (!customer) {
      alert('Please register before submitting a review');
      navigate(`/scan/${storeId}`);
      return;
    }

    // Validate required fields
    if (!selectedItem) {
      setError('Please select an item to review');
      return;
    }

    if (reviewData.overall_rating === 0) {
      setError('Please provide an overall rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format answers for API
      const formattedAnswers = Object.entries(reviewData.answers).map(([questionId, answer]) => ({
        question_id: questionId,
        answer: answer
      }));

      const response = await api.post(`/customer/customers/${customer.id}/reviews`, {
        catalog_item_id: selectedItem.id,
        overall_rating: reviewData.overall_rating,
        comment: reviewData.comment,
        answers: formattedAnswers
      });

      alert('Review submitted successfully!');
      navigate(`/catalog/${storeId}`); // Redirect back to catalog
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-6">
            You need to register before submitting a review.
          </p>
          <button
            onClick={() => navigate(`/scan/${storeId}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review form...</p>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Submit Your Review</h1>
          <p className="mt-2 text-gray-600">Share your experience with this product</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {/* Product Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Product to Review</h2>
            <div className="grid grid-cols-1 gap-4">
              {purchasedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`border rounded-lg p-4 cursor-pointer ${selectedItem?.id === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-sm text-gray-500">
                      Purchased on {new Date(item.purchased_at).toLocaleDateString()}
                    </div>
                  </div>
                  {item.already_reviewed && (
                    <div className="mt-2 text-sm text-yellow-600">
                      You've already reviewed this product
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedItem && (
            <form onSubmit={handleSubmitReview}>
              {/* Overall Rating */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Rating</h2>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`h-10 w-10 ${star <= reviewData.overall_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Questions */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Review Questions</h2>
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {question.question}
                      </label>
                      {question.question_type === 'rating' ? (
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleAnswerChange(question.id, star.toString())}
                              className="focus:outline-none"
                            >
                              <svg
                                className={`h-6 w-6 ${star <= parseInt(reviewData.answers[question.id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      ) : question.question_type === 'text' ? (
                        <textarea
                          value={reviewData.answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          rows={3}
                        />
                      ) : question.question_type === 'boolean' ? (
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`question_${question.id}`}
                              checked={reviewData.answers[question.id] === 'true'}
                              onChange={() => handleAnswerChange(question.id, 'true')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="ml-2">Yes</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`question_${question.id}`}
                              checked={reviewData.answers[question.id] === 'false'}
                              onChange={() => handleAnswerChange(question.id, 'false')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="ml-2">No</span>
                          </label>
                        </div>
                      ) : (
                        <select
                          value={reviewData.answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select an option</option>
                          {question.options?.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Comments</h2>
                <textarea
                  value={reviewData.comment}
                  onChange={handleCommentChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="Share more details about your experience..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviewPage;