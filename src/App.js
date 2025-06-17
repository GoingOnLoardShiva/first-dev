import "./App.css";
import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import ULayout from "./components/Layout/userlayoutfile";
import Hero from "./components/Front-end/Hero";
import Li from "./components/Front-end/List";
import Login from "./AdminPanel/Authuntication/Loginverify";
import All from "./AdminPanel/Adminprofile/Alllist";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./AdminPanel/Authuntication/ProtectedRoute";
import Userhome from "./userPanel/Userhome";
import UserProfile from "./userPanel/UserProfile";
import UserSign from "./AdminPanel/Authuntication/userSign";
import UserProfileAcces from "./userPanel/UserProfileAcces";
// import Useracount from "./userPanel/Useacount"
import AdminLogin from "./AdminPanel/Authuntication/AdminLogin";
import Ssucess from "./AdminPanel/Authuntication/Ssucess";
import Userimgup from "./userPanel/usercomponents/Useimgupload"

function App() {
  const HomeLayout = () => <Layout />;
  const AdminLayout = () => <AdminLayout />;
  const UserLayout = () => <ULayout />;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { path: "/", element: <Hero /> },
        { path: "/Login", element: <Login /> },
        { path: "/sign", element: <UserSign /> },
        { path: "/AdminLogin", element: <AdminLogin /> },
        { path: "/Ssucess", element: <Ssucess /> },
        { path: "/Userimgup", element: <Userimgup /> },
        { path: "/user/userid/:user_fName", element: <UserProfileAcces /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/admin/:uid/", element: <UserProfile /> },
        { path: "/admin/:uid/Alllist", element: <All /> },
        { path: "/admin/:uid/List", element: <Li /> },
      ],
    },
    {
      path: "/user",
      element: (
        <ProtectedRoute role="user">
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/user/:uid", element: <UserProfile /> },
        { path: "/user/:uid/:user_fName", element: <UserProfileAcces /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
