import ReactDOM from 'react-dom/client'
//import App from './App.jsx'
import App from './App-test.jsx'
import './index.css'
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
)
