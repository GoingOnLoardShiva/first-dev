import React ,{useState,useEffect}from "react";
import { account } from "./Appwrite";
const Ssucess = () => {
  const [gituser, setgitUser] = useState(null);
  useEffect(() => {
    account.get().then(setgitUser).catch(console.error);
  }, []);

  return (
    <div>
      <div className="gituser">
        {gituser ? (
          <h1>Welcome, {gituser.name || gituser.email}!</h1>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
};

export default Ssucess;
