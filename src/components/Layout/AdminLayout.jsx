import React from "react";
import AdminFooter from "../../AdminPanel/Admincomponent/AdminFooter";
import AdminHeader from "../../AdminPanel/Admincomponent/AdminHeader"
import { Outlet, useLocation } from "react-router-dom";



const Userlayoutfile = () => {
    const location = useLocation();
  
    const messengerPagePath = "/user/:uid/Massege"; // Make sure this matches your route path
  
    const isMessengerPage = location.pathname === messengerPagePath;


  return (
    <div>
      {!isMessengerPage && (
        <header>
          <AdminHeader />
        </header>
      )}
      <main>
        <Outlet />
      </main>
      <footer>
        {/* <AdminFooter /> */}
      </footer>
    </div>
  );
};

export default Userlayoutfile;
