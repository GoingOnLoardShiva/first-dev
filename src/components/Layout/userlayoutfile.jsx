import React from "react";
import UserHeader from "../../AdminPanel/usercomponet/UserHeader";
import UserFooter from "../../AdminPanel/usercomponet/UserFooter";

import { Outlet } from "react-router";



const userlayoutfile = () => {
  return (
    <div>
      <header>
        <UserHeader/>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* <UserFooter/> */}
      </footer>
    </div>
  );
};

export default userlayoutfile;
