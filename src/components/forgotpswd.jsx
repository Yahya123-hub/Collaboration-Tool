import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Forgotpswd = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const navigate = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/forgot-password", { email })
      .then((res) => {
        if (res.data.status === "Success") {
          setSuccessMessage("Check mail, redirecting to login");
          setSuccessMessageVisible(true);
          setEmail(""); // Clear email field
          setTimeout(() => {
            setSuccessMessageVisible(false);
            navigate.push("/signin");
          }, 5000);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data.status === "User not existed") {
          setError("User not found. Please check your email address.");
        } else {
          //console.log(err.response)
          setError(err.response.data.status);
        }
        setErrorMessageVisible(true);
        setTimeout(() => {
          setErrorMessageVisible(false);
        }, 5000);
      });
  };

  useEffect(() => {
    if (successMessageVisible) {
      const timeoutId = setTimeout(() => {
        setSuccessMessageVisible(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [successMessageVisible]);

  useEffect(() => {
    if (errorMessageVisible) {
      const timeoutId = setTimeout(() => {
        setErrorMessageVisible(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [errorMessageVisible]);

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-md backdrop-filter backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {errorMessageVisible && (
            <div className="w-92 px-4 py-2 my-1 text-sm bg-red-600 text-white rounded text-center">
              {error}
            </div>
          )}
          {successMessageVisible && (
            <div className="w-92 px-4 py-2 my-1 text-sm bg-green-600 text-white rounded text-center">
              {successMessage}
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

export default Forgotpswd;
