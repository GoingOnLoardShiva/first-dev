import "./App.css";
import Layout from "./components/Layout/Layout";
import Hero from "./components/Front-end/Hero";
import Li from "./components/Front-end/List";
import AdminDashboard from "./AdminPanel/AdminPage/Admin";
import Profile from "./AdminPanel/Adminprofile/Profile";
import Post from "./AdminPanel/Adminprofile/Post";
import Update from "./AdminPanel/Adminprofile/Update";
import Login from './AdminPanel/AdminPage/Login'
import All from './AdminPanel/Adminprofile/Alllist'
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";


function App() {
  const HomeLayout = () => {
    return (
      <div>
        <Layout />
      </div>
    );
  };
  const UserLayout = () => {
    return (
      <div>
        <Layout />
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { path: "/", element: <Hero /> },
        { path: "/Login", element: <Login /> },
      ],
    },
    {
      path: "/admin",
      element: <UserLayout />,
      children: [
        { path: "/admin/", element: <Profile /> },
        { path: "/admin/Alllist", element: <All /> },
        { path: "/admin/Update", element: <Update /> },
        { path: "/admin/Post", element: <Post /> },
        { path: "/admin/List", element: <Li /> },

      ],
    },
  ])
  return <RouterProvider router={router} />;;
}

export default App;
