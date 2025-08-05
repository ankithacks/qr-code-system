import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ReviewManagement = () => {
  const { store_id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    question_type: 'rating',
    order_index: 0,
    active: true,
    options: []
  });

  // Question types for dropdown
  const questionTypes = [
    { value: 'rating', label: 'Rating (1-5)' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'text', label: 'Text Response' },
    { value: 'multiple_choice', label: 'Multiple Choice' }
  ];

  // Fetch review questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/admin/stores/${store_id}/review_questions`);
        setQuestions(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch review questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [store_id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOptionsChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post(`/admin/stores/${store_id}/review_questions`, {
        review_question: formData
      });
      setQuestions([...questions, response.data.question]);
      resetForm();
      setIsCreating(false);
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to create question');
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.put(`/admin/stores/${store_id}/review_questions/${currentQuestion.id}`, {
        review_question: formData
      });
      setQuestions(questions.map(q => 
        q.id === currentQuestion.id ? response.data.question : q
      ));
      resetForm();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/admin/stores/${store_id}/review_questions/${id}`);
        setQuestions(questions.filter(q => q.id !== id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete question');
      }
    }
  };

  const handleEditClick = (question) => {
    setCurrentQuestion(question);
    setFormData({
      question: question.question,
      question_type: question.question_type,
      order_index: question.order_index,
      active: question.active,
      options: question.options || []
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      question: '',
      question_type: 'rating',
      order_index: 0,
      active: true,
      options: []
    });
    setCurrentQuestion(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Review Questions</h1>
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

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Review Questions</h2>
            <button
              onClick={() => {
                setIsCreating(true);
                setIsEditing(false);
                resetForm();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add New Question
            </button>
          </div>

          {(isCreating || isEditing) && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-medium mb-4">
                {isEditing ? 'Edit Question' : 'Add New Question'}
              </h3>
              <form onSubmit={isEditing ? handleUpdateQuestion : handleCreateQuestion}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                      Question Text *
                    </label>
                    <input
                      type="text"
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="question_type" className="block text-sm font-medium text-gray-700">
                      Question Type *
                    </label>
                    <select
                      id="question_type"
                      name="question_type"
                      value={formData.question_type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {formData.question_type === 'multiple_choice' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options *
                      </label>
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionsChange(index, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Add Option
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="order_index" className="block text-sm font-medium text-gray-700">
                        Order Index
                      </label>
                      <input
                        type="number"
                        id="order_index"
                        name="order_index"
                        min="0"
                        value={formData.order_index}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={formData.active}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
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
                    {isEditing ? 'Update Question' : 'Create Question'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {questions.length === 0 && !isCreating ? (
                <div className="p-6 text-center text-gray-500">
                  No review questions found. Create your first question.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Question
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questions
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((question) => (
                        <tr key={question.id}>
                          <td className="px-6 py-4 whitespace-normal">
                            <div className="text-sm font-medium text-gray-900">{question.question}</div>
                            {question.options?.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Options: {question.options.join(', ')}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {questionTypes.find(t => t.value === question.question_type)?.label || question.question_type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{question.order_index}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              question.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {question.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditClick(question)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReviewManagement;