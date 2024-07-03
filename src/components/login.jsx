import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setUser } from '../actions';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useUserContext } from './dashboard/usercontext'; 


const Login = () => {
  const { setEmail } = useUserContext(); 
  const dispatch = useDispatch();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verified, setVerified] = useState(false);
  const nav=useHistory();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3001/api/login";
      const { data: res } = await axios.post(url, { ...data, recaptchaToken: verified });
      if (rememberMe) {
        localStorage.setItem("token", res.data);
        localStorage.setItem("email", data.email);
      } else {
        sessionStorage.setItem("token", res.data);
        sessionStorage.setItem("email", data.email); 
      }
      setIsAuthenticated(true);
      window.alert(res.message);
      const user = { email: data.email };
      console.log(user)
      dispatch(setUser(user));  
      setEmail(data.email)    
      localStorage.setItem("email", data.email); 
      nav.push("/dashboard")
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setErrorMessageVisible(true); 
      }
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    if (errorMessageVisible) {
      const timeoutId = setTimeout(() => {
        setErrorMessageVisible(false);
      }, 5000); 
      return () => clearTimeout(timeoutId);
    }
  }, [errorMessageVisible]);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      // Assume the token is valid and set the user as authenticated
      setIsAuthenticated(true);
      // Optionally, you could verify the token with the server here
    }
  }, []);

  if (isAuthenticated) {
    // window.alert("Already logged in") --working
  }

  return (
      <div className="min-h-screen flex items-start justify-center">
        <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-md backdrop-filter backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-white">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
              />
            </div>
            <div className="mb-6 relative">
              <label className="block mb-2 text-sm font-medium text-white">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-1 pr-3 pt-7 flex items-center text-white hover:text-gray-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-4 flex items-center text-right">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-400 rounded mr-2" 
                onChange={handleRememberMeChange} 
                checked={rememberMe} 
              />
              <label className="text-sm font-medium text-white">Remember me</label>
              <span className="flex-grow"></span>
              <a href="/forgot-password" className="text-sm font-medium text-blue-400 hover:text-blue-700">Forgot password?</a>
            </div>
            {errorMessageVisible && (
              <div className="w-92 px-4 py-2 my-1 text-sm bg-red-600 text-white rounded text-center">
                {error}
              </div>
            )}
            <div className="mb-5 w-full rounded-lg overflow-hidden ">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={(token) => setVerified(token)}
                className="w-full"
                theme="dark"
              />
            </div>

            <button 
              type="submit"
              className="bg-gradient-to-r from-blue-400 to-blue-600 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              disabled={!verified}
              title={!verified ? "Please verify reCAPTCHA" : ""}
            >
              Login
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;
