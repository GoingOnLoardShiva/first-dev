import React from "react";
import AdminFooter from "../../AdminPanel/Admincomponent/AdminFooter";
import AdminHeader from "../../AdminPanel/Admincomponent/AdminHeader"
import { Outlet } from "react-router";



const userlayoutfile = () => {
  return (
    <div>
      <header>
        <AdminHeader/>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <AdminFooter />
      </footer>
    </div>
  );
};

export default userlayoutfile;
