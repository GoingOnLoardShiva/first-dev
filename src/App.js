import "./App.css";
import Layout from "./components/Layout/Layout";
import Hero from "./components/Front-end/Hero";
import Li from "./components/Front-end/List";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hero />} />
          <Route path="List" element={<Li />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
