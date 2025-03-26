import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Weather from "./Weather";
import PageLoading from "./PageLoading";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageLoading />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="*" element={<h1 className="text-center text-red-500">Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
