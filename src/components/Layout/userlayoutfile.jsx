// src/components/Layout/UserLayoutFile.jsx

import React from "react";
import UserHeader from "../../AdminPanel/usercomponet/UserHeader";
import UserFooter from "../../AdminPanel/usercomponet/UserFooter";
import { Outlet, useLocation, matchPath } from "react-router-dom"; // <--- Import matchPath

const UserLayoutFile = () => {
  const location = useLocation();

  // Define the dynamic path pattern for your Messenger page
  const messengerPagePattern = "/user/:uid/Massege"; // <--- This is the pattern

  // Use matchPath to check if the current location.pathname matches the pattern
  const isMessengerPage = matchPath(
    { path: messengerPagePattern, end: true }, // 'end: true' ensures it's an exact match for the whole path
    location.pathname
  );

  return (
    <div>
      {/* Conditionally render the header */}
      {!isMessengerPage && ( // <--- The header will only show if it's NOT the messenger page
        <header>
          <UserHeader/>
        </header>
      )}
      <main>
        <Outlet />
      </main>
      <footer>
        {/* <UserFooter/> */}
      </footer>
    </div>
  );
};

export default UserLayoutFile;
