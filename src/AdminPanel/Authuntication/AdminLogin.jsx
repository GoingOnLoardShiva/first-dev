import React from "react";
import { account } from "./Appwrite";
const AdminLogin = () => {
  const handleGitHubLogin = () => {
    account.createOAuth2Session(
      "github",
      "https://codetech-tau.vercel.app/Ssucess", // where to go after success
      "https://localhost:3000/Ssucess" // where to go after failure
    );
  };
  return (
    <div>
      <div className="admin-login">
        <button onClick={handleGitHubLogin}>Sign in with GitHub</button>
      </div>
    </div>
  );
};

export default AdminLogin;
