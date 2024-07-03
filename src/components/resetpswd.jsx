import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const Resetpswd = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const navigate = useHistory();
  const { id, token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3001/api/reset-password/${id}/${token}`, { password });
      if (res.data.Status === "Success") {
        setSuccessMessageVisible(true);
        setErrorMessageVisible(false);
        setTimeout(() => navigate.push('/signin'), 3000);
      } else {
        setError(res.data.message || "Failed to reset password");
        setErrorMessageVisible(true);
        setSuccessMessageVisible(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      setErrorMessageVisible(true);
      setSuccessMessageVisible(false);
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
    if (successMessageVisible) {
      const timeoutId = setTimeout(() => {
        setSuccessMessageVisible(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [errorMessageVisible, successMessageVisible]);

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-md backdrop-filter backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your new password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <div className="mt-4 mb-4 flex items-center text-right">
            <input type="checkbox" className="h-4 w-4 text-blue-400 rounded mr-2" onChange={togglePasswordVisibility} />
            <label className="text-sm font-medium text-white">Show Password</label>
            <span className="flex-grow"></span>
          </div>

          {errorMessageVisible && (
            <div className="w-92 px-4 py-2 my-1 text-sm bg-red-600 text-white rounded text-center">
              {error}
            </div>
          )}

          {successMessageVisible && (
            <div className="w-92 px-4 py-2 my-1 text-sm bg-green-600 text-white rounded text-center">
              Password changed, redirecting to login
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-blue-600 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resetpswd;
