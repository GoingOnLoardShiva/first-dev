import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-datetime/css/react-datetime.css";
import List from "./List";
import "./hero.scss";
import "bootstrap/dist/css/bootstrap.css";
import Ol from "./Olist";
import Ai from "../features/Aichat";
import "primeicons/primeicons.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Useralldatapostrecived from "../../AdminPanel/Adminprofile/Useralldatapostrecived";

const Hero = () => {
  return (
    <div className="pd">
      <hr className="line" />
      <div className="dropdowna d-flex gap-50">
        <div class="dropdown">
          <SpeedInsights />
          <a
            class="btn btn-secondary "
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Trending
          </a>

          <ul class="dropdown-menu">
            <div>
              <li>
                <a class="dropdown-item bg-white" href="#">
                  Top Trending
                </a>
              </li>
              <li>
                <a class="dropdown-item bg-white" href="#">
                  Inidan Tech Trending
                </a>
              </li>
              <li>
                <a class="dropdown-item bg-white" href="#">
                  Us Tech Trending
                </a>
              </li>
              <div>
                <li>
                  <a class="dropdown-item bg-white" href="#">
                    Trending Coding
                  </a>
                </li>
                <li>
                  <a class="dropdown-item bg-white" href="#">
                    Trending language
                  </a>
                </li>
                <li>
                  <a class="dropdown-item bg-white" href="#">
                    Trending Prototype Articel
                  </a>
                </li>
              </div>
            </div>
          </ul>
        </div>
        <div class="dropdown">
          <a
            class="btn btn-secondary"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Feature
          </a>

          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item bg-white" href="#">
                Action
              </a>
            </li>
            <li>
              <a class="dropdown-item bg-white" href="#">
                Another action
              </a>
            </li>
            <li>
              <a class="dropdown-item bg-white" href="#">
                Something else here
              </a>
            </li>
          </ul>
        </div>
        <div class="dropdownab ">
          <a
            class="btn btn-secondary"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <a href="" className="pi-eraser">
              Background Remover
            </a>
          </a>
        </div>
        <div class="dropdownac ">
          <a
            class="btn btn-secondary"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <a href="" className="pi-comments">
              1 to 1 Chat
            </a>
          </a>
        </div>
        <div class="dropdown">
          <a
            class="btn btn-secondary "
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Software tech
          </a>

          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item bg-white" href="#">
                Action
              </a>
            </li>
            <li>
              <a class="dropdown-item bg-white" href="#">
                Another action
              </a>
            </li>
            <li>
              <a class="dropdown-item bg-white" href="#">
                Something else here
              </a>
            </li>
          </ul>
        </div>
        <div class="dropdown">
          <a
            class="btn btn-secondary "
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Ios tech
          </a>

          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item bg-white" href="#">
                Action
              </a>
            </li>
            <li>
              <a class="dropdown-item bg-white" href="#">
                Another action
              </a>
            </li>
            <li>
              <a class="dropdown-item bg-white" href="#">
                Something else here
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="line" />
      <div className="trending">
        <List />
      </div>
      <div className="abb">
        <Ol />
      </div>
      <div className="abb">
        <Useralldatapostrecived />
      </div>
      {/* <div className="ai">
        <Ai/>
        
      </div> */}
      {/* <div className="f">
        <BackgroundRemover/>
      </div> */}
    </div>
  );
};

export default Hero;
