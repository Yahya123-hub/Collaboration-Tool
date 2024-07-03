import Navbar from "./components/dashboard/dashboard_navbar";
import Dashboard from "./components/dashboard/dashboard";
import "./index.css";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex">
        {/* Side Navigation Bar */}
        <Navbar />
        {/* Main component on basis of selected navigation from nav bar */}
        <main className="grow">
          <Dashboard />
        </main>
      </div>
    </>
  );
}

export default App;