import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import Profile from "./Profile";
import Alllist from "./Alllist";
import Post from "./Post";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";

const Adminprofile = () => {
  const url = process.env.REACT_APP_HOST_URL;
  const [userdata, setData] = useState("");
  const key = process.env.REACT_APP_APIKEY;
  const formatDate = (rowData) => {
    return moment(rowData.do_b).format("DD-MM-YYYY");
  };
  useEffect(() => {
    const useralldatas = async () => {
      const res = await axios.get(url + "/userlist", {
        headers: {
          "access-key": key,
        },
      });
      if (res.status === 200) {
        setData(res.data.useradata);
      }
    };
    console.log(setData);
    useralldatas();
  }, []);
  return (
    <div>
      <TabView>
        <TabPanel header="Trending" leftIcon="pi pi-hashtag mr-2">
          <Profile />
        </TabPanel>
        <TabPanel header="All Post " leftIcon="pi pi-align-justify ml-2">
          <Alllist />
        </TabPanel>
        <TabPanel
          header="My Users"
          leftIcon="pi pi-users mr-2"

        >
          <DataTable  value={userdata} tableStyle={{ minWidth: "50rem" }}>
            <Column field="email_id" header="Email"></Column>
            <Column field="role" header="Role"></Column>
            <Column field="do_b" header="Date of birth" body={formatDate}></Column>
            <Column field="createAt" header="Login Date" body={(rowData) => moment(rowData.createAt).format("DD-MM-YYYY HH:mm A")}></Column>
          </DataTable>
          {/* {userdata.map((usedata) => (
            <div key={usedata._id}>
              <DataTable tableStyle={{ minWidth: "50rem" }}>
                <Column field="email_id" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column>
              </DataTable>
              <p>Email: {usedata.email_id}</p>
              <p>Password: {usedata.pass_word}</p> <p>Role: {usedata.role}</p>
              <p>DOB: {usedata.do_b}</p>
              <p>
                Created At: {new Date(usedata.createAt).toLocaleString()}
              </p>{" "}
            </div>
          ))} */}

          <Post />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Adminprofile;
