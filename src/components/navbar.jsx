import { Menu, X } from "lucide-react";
import { useState,  useEffect } from "react";
import { Link, useHistory } from "react-router-dom"; 
import logo from "../assets/output-onlinegiftools.gif";
import { navItems } from "../constants";
import { useUserContext } from './dashboard/usercontext';

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { email } = useUserContext();
  const history = useHistory(); // Initialize useHistory hook


  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    if (email) {
      history.push("/dashboard");
    }
  }, [email, history]);

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-white-700/80 bg-dark text-white">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">ProManage</span>
          </div>
          <div className="hidden lg:flex ml-14 space-x-12 flex-grow justify-center">
            {email ? (
              <div className="flex items-center space-x-2 text-xl tracking-tight ml-auto">
              <span>Logged in as: {email}</span>
            </div>
            ) : (
              <ul className="flex space-x-12">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link to={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!email && (
            <div className="hidden lg:flex justify-center space-x-4 items-center">
              <Link to="/signin" className="py-2 px-3 border border-blue-300 rounded-md">
                Log In
              </Link>
              <Link to="/create-account" className="bg-gradient-to-r from-blue-400 to-blue-600 py-2 px-3 rounded-md">
                Create an account
              </Link>
            </div>
          )}
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4 border-b border-neutral-700 last:border-b-0">
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            {!email && (
              <div className="flex space-x-6">
                <Link to="/signin" className="py-2 px-3 border border-blue-300 rounded-md">
                  Sign In
                </Link>
                <Link to="/create-account" className="py-2 px-3 rounded-md bg-gradient-to-r from-blue-400 to-blue-600">
                  Create an account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
