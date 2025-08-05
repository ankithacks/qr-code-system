// import { useState } from 'react';

// const AdminRegister = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     password_confirmation: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (formData.password !== formData.password_confirmation) {
//       setError("Passwords don't match");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       console.log('Registration successful:', formData);
//       // In real app: login(admin, token); navigate('/admin/dashboard');
//     } catch (err) {
//       setError('Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        
        
//         {/* Floating Orbs */}
//         <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
//         <div className="absolute -bottom-32 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
//         <div className="w-full max-w-md">
//           {/* Glassmorphism Card */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300">
            
//             {/* Header */}
//             <div className="text-center mb-8">
//               <div className="relative mb-6">
//                 <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
//                   <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                 </div>
//               </div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
//                 Create Admin Account
//               </h1>
//               <p className="text-white/70 text-lg">Join the administrative excellence</p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl backdrop-blur-sm">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span className="text-red-300 text-sm">{error}</span>
//                 </div>
//               </div>
//             )}

//             {/* Form */}
//             <div className="space-y-6">
//               {/* Name Field */}
//               <div className="relative">
//                 <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('name')}
//                     onBlur={() => setFocusedField('')}
//                     className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
//                     placeholder="Enter your full name"
//                   />
//                   <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 -z-10 transition-opacity duration-300 ${focusedField === 'name' ? 'opacity-100' : 'opacity-0'}`}></div>
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div className="relative">
//                 <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('email')}
//                     onBlur={() => setFocusedField('')}
//                     className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
//                     placeholder="admin@company.com"
//                   />
//                   <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 -z-10 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-100' : 'opacity-0'}`}></div>
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="relative">
//                 <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('password')}
//                     onBlur={() => setFocusedField('')}
//                     className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
//                     placeholder="Create a strong password"
//                   />
//                   <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 -z-10 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-100' : 'opacity-0'}`}></div>
//                 </div>
//               </div>

//               {/* Confirm Password Field */}
//               <div className="relative">
//                 <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password_confirmation"
//                     name="password_confirmation"
//                     type="password"
//                     required
//                     value={formData.password_confirmation}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('password_confirmation')}
//                     onBlur={() => setFocusedField('')}
//                     className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
//                     placeholder="Confirm your password"
//                   />
//                   <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 -z-10 transition-opacity duration-300 ${focusedField === 'password_confirmation' ? 'opacity-100' : 'opacity-0'}`}></div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 onClick={handleSubmit}
//                 className="w-full relative group"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <div className="relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
//                   {loading ? (
//                     <div className="flex items-center justify-center">
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Creating Account...
//                     </div>
//                   ) : (
//                     <span className="flex items-center justify-center">
//                       Create Admin Account
//                       <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                       </svg>
//                     </span>
//                   )}
//                 </div>
//               </button>
//             </div>

//             {/* Login Link */}
//             <div className="mt-8 text-center">
//               <p className="text-white/70">
//                 Already have an account?{' '}
//                 <a 
//                   href="/admin/login" 
//                   className="text-purple-300 hover:text-white font-medium hover:underline transition-colors duration-200"
//                 >
//                   Sign in here
//                 </a>
//               </p>
//             </div>
//           </div>

//           {/* Additional Visual Elements */}
//           <div className="mt-8 flex justify-center space-x-4">
//             <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
//             <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
//             <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminRegister;



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import api from '../../services/api';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/admin/auth/register', {
        admin: formData
      });

      const { token, admin } = response.data;
      login(admin, token);
      navigate('/admin/login');
    } catch (err) {
      const errors = err.response?.data?.errors || ['Registration failed. Please try again.'];
      setError(errors.join(', '));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin Account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;