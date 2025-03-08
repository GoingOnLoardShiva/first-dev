import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {

    const userData = Cookies.get("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);

      if (parsedUser.role !== "admin") {
        alert(" Access Denied! Admins Only.");
        navigate("/login");
      } else {
        setUser(parsedUser); 
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name} (Admin)</h2>
          <p>Email: {user.email}</p>
          <button onClick={() => {
            Cookies.remove("user"); 
            navigate("/login");
          }}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
