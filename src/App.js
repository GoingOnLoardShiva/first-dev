import "./App.css";
import Layout from "./components/Layout/Layout";
import ULayout from "./components/Layout/userlayoutfile";
import Hero from "./components/Front-end/Hero";
import Li from "./components/Front-end/List";
import Profile from "./AdminPanel/Adminprofile/Profile";
import Post from "./AdminPanel/Adminprofile/Post";
import Update from "./AdminPanel/Adminprofile/Update";
import Login from "./AdminPanel/Authuntication/Loginverify";
import All from "./AdminPanel/Adminprofile/Alllist";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Adminprofile from "./AdminPanel/Adminprofile/Adminprofile";
import ProtectedRoute from "./AdminPanel/Authuntication/ProtectedRoute";
import Userhome from "./userPanel/Userhome";
import UserProfile from "./userPanel/UserProfile";
import UserSign from "./AdminPanel/Authuntication/userSign";
import UserPostPage from "./userPanel/UserPostPage";
import UserProfileAcces from "./userPanel/UserProfileAcces";
import Useracount from "./userPanel/Useacount"

function App() {
  const HomeLayout = () => <Layout />;
  const UserLayout = () => <ULayout />;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { path: "/", element: <Hero /> },
        { path: "/Login", element: <Login /> },
        { path: "/sign", element: <UserSign /> },
        { path: "/user/blogpage/:_id", element: <UserPostPage /> },

        { path: "/user/userid/:user_fName", element: <UserProfileAcces /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute role="admin">
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/admin/:uid", element: <Adminprofile /> },
        { path: "/admin/:uid/Profile", element: <Profile /> },
        { path: "/admin/:uid/Alllist", element: <All /> },
        { path: "/admin/:uid/Update", element: <Update /> },
        { path: "/admin/:uid/Post", element: <Post /> },
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
        { path: "/user/:uid", element: <Userhome /> },
        { path: "/user/:uid/myprofile", element: <UserProfile /> },
        // { path: "/user/:uid/myprofile", element: <Useracount /> },
        { path: "/user/blogpage/:_id", element: <UserPostPage /> },
        { path: "/user/userid/:user_fName", element: <UserProfileAcces /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
