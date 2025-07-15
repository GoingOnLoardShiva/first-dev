import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-datetime/css/react-datetime.css";
import List from "./List";
import "./hero.scss";
import "bootstrap/dist/css/bootstrap.css";
import Ol from "./Olist";
import "primeicons/primeicons.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
// import { Analytics } from "@vercel/analytics/react"
import Useralldatapostrecived from "../../AdminPanel/Adminprofile/Useralldatapostrecived";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import StoryPage from "../../userPanel/Story/StoryPage"


const Hero = () => {
  return (
    <div className="pd">
      <div className="abb">
        <StoryPage/>
        <Useralldatapostrecived />
      </div>

    </div>
  );
};

export default Hero;
