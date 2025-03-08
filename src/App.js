import "./App.css";
import Layout from "./components/Layout/Layout";
import Hero from "./components/Front-end/Hero";
import Li from "./components/Front-end/List";
import AdminDashboard from "./AdminPanel/AdminPage/Admin";
import Profile from "./AdminPanel/Adminprofile/Profile";
import Post from "./AdminPanel/Adminprofile/Post";
import Update from "./AdminPanel/Adminprofile/Update";
import Login from './AdminPanel/AdminPage/Login'
import Pr from './AdminPanel/AdminPage/Pr'
import All from './AdminPanel/Adminprofile/Alllist'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hero />} />
          <Route path="List" element={<Li />} />
          <Route path="Admin" element={<AdminDashboard />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Post" element={<Post />} />
          <Route path="Update" element={<Update />} />
          <Route path="Login" element={<Login />} />
          <Route path="Pr" element={<Pr />} />
          <Route path="Alllist" element={<All />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
