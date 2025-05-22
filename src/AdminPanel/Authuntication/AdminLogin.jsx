import React from "react";
import { account } from "./Appwrite";
const AdminLogin = () => {
  const handleGitHubLogin = () => {
    account.createOAuth2Session(
      "github",
      "https://codetech-tau.vercel.app/Ssucess",
      "https://codetech-tau.vercel.app/Ssucess"
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
