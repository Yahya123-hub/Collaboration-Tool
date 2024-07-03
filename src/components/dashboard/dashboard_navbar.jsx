import { useState, useEffect } from "react";
import Logo from "../../assets/output-onlinegiftools.gif";
import dashboardicon from "../../assets/output-onlinegiftools (1).gif";
import tasksicon from "../../assets/output-onlinegiftools (2).gif";
import reviewicon from "../../assets/output-onlinegiftools (3).gif";
import presicon from "../../assets/output-onlinegiftools (4).gif";
import boardicon from "../../assets/output-onlinegiftools (99).gif";
import reporticon from "../../assets/output-onlinegiftools (n).gif";
import logouticon from "../../assets/output-onlinegiftools (ll).gif";
import collabicon from "../../assets/output-onlinegiftools (col).gif";
import groupicon from "../../assets/output-onlinegiftools (gr).gif";
import assignicon from "../../assets/output-onlinegiftools (assign).gif";
import assignedicon from "../../assets/output-onlinegiftools (al).gif";
import monitoricon from "../../assets/output-onlinegiftools (monitor).gif";
import chaticon from "../../assets/output-onlinegiftools (chat).gif";
import { motion } from "framer-motion";
import "../../styles.css";
import { Link } from "react-router-dom";

const variants = {
  expanded: { width: "220px" },
  nonexpanded: { width: "60px" },
};

const navLinks = [
  {
    link: "Overview",
    path: "/dashboard",
    icon: dashboardicon,
  },
  {
    link: "Tasks",
    path: "/tasks",
    icon: tasksicon,
  },
  {
    link: "Review",
    path: "/review",
    icon: reviewicon,
  },
  {
    link: "Visualize",
    path: "/visualize",
    icon: presicon,
  },
  {
    link: "Kanban",
    path: "/kanban",
    icon: boardicon,
  },
  {
    link: "Kanban Alerts",
    path: "/notifications",
    icon: reporticon,
  },
  {
    link: "Collab",
    path: "/collab",
    icon: collabicon,
  },
  {
    link: "Groups",
    path: "/group",
    icon: groupicon,
  },
  {
    link: "Assign Tasks",
    path: "/assign",
    icon: assignicon,
  },
  {
    link: "Allocated Work",
    path: "/assigned",
    icon: assignedicon,
  },
  {
    link: "Monitor",
    path: "/monitor",
    icon: monitoricon,
  },
  {
    link: "Chat",
    path: "/chat",
    icon: chaticon,
  },
  {
    link: "Logout",
    path: "/logout",
    icon: logouticon,
  },
];

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth < 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonexpanded"}
      variants={variants}
      className={
        "py-10 h-screen flex flex-col border border-black bg-gradient-to-r from-blue-500 to-blue-600 relative " +
        (isExpanded ? "px-10" : "px-2 duration-500")
      }
      style={{ overflowY: "auto", paddingRight: "0px" }} // Adjusted paddingRight
    >


      <div className="logo-div flex space-x-4 items-center">
        <img src={Logo} className="md:w-12 w-10 ml-2" alt="Logo" />
        <span className={!isExpanded ? "hidden" : "block"}>Pro Manage</span>
      </div>

      <div className="flex flex-col space-y-8 mt-12 overflow-y-auto">
        {navLinks.map((item, index) => (
          <div className="nav-links w-full" key={index}>
            <Link to={item.path}>
              <div
                onClick={() => setActiveIndex(index)}
                className={
                  "flex space-x-3 w-full p-2 rounded " +
                  (activeIndex === index
                    ? "bg-[#FFFFFF] text-black"
                    : "text-white") +
                  (!isExpanded ? " pl-3" : "")
                }
              >
                <img
                  src={item.icon}
                  className="md:w-11 w-11"
                  alt={item.link}
                  style={{ objectFit: "contain" }}
                />
                <span className={!isExpanded ? "hidden" : "block"}>
                  {item.link}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Navbar;
