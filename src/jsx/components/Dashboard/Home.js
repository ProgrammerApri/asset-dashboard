import React from "react";
import { Link } from "react-router-dom";

import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import menu03 from "../../../images/menus/3.png";
import menu02 from "../../../images/menus/2.png";
import menu01 from "../../../images/menus/1.png";

import testimonial from "../../../images/testimonial/1.jpg";
import testimonial2 from "../../../images/testimonial/2.jpg";
import testimonial3 from "../../../images/testimonial/3.jpg";

import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import CircleProgress from "../CircleProgress/circleProgress";

import ApexRadialBar from "../charts/apexcharts/RadialBar";
import ProductionStat from "../charts/apexcharts/Line4";

// import Ext from "../../layouts/Ext";

const ApexLine4 = loadable(() =>
  pMinDelay(import("../charts/apexcharts/Line4"), 500)
);
const ApexNagetivePosative = loadable(() =>
  pMinDelay(import("../charts/apexcharts/NagetivePositive2"), 500)
);

const Home = () => {
  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <div className="owl-next" onClick={onClick} style={{ zIndex: 99 }}>
        <i className="fa fa-caret-right" />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="owl-prev disabled"
        onClick={onClick}
        style={{ zIndex: 99 }}
      >
        <i className="fa fa-caret-left" />
      </div>
    );
  }

  const settings = {
    focusOnSelect: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="tittle-row">
        <h4 className="text-black fs-18 mb-3">Inventory</h4>
        <Button variant="primary btn-xxs mb-3">Lihat Semua</Button>
      </div>
      <div className="row">
        <div className="col-xl col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <CircleProgress
                percent={37}
                icon={
                  <svg
                    width="40"
                    height="40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 77.62 90.11"
                  >
                    <g>
                      <g>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                }
              />
              <h2 className="fs-24 text-black font-w600 mb-0">42 Kg</h2>
              <span className="fs-14">IRAWAN 681 V</span>
            </div>
          </div>
        </div>
        <div className="col-xl col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <CircleProgress
                percent={75}
                icon={
                  <svg
                    width="40"
                    height="40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 77.62 90.11"
                  >
                    <g>
                      <g>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                }
              />
              <h2 className="fs-24 text-black font-w600 mb-0">91 Kg</h2>
              <span className="fs-14">IRAWAN 683 SP</span>
            </div>
          </div>
        </div>
        <div className="col-xl col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <CircleProgress
                percent={65}
                icon={
                  <svg
                    width="40"
                    height="40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 110.35 157.25"
                  >
                    <g>
                      <g>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M50.59,20.69c-3.72-.14-5.72-2.27-6.05-5.86a6,6,0,0,1,6.28-6.21c3.72.26,5.87,2.55,5.82,6.13S54.43,20.49,50.59,20.69Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M72.36,4.42c-3.27,2.29-5.2,4.68-6.82,4.48s-4.42-2.84-4.42-4.42S63.77.25,65.51,0,69.07,2.17,72.36,4.42Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M55.24,157.22c-12.5,0-25-.08-37.51,0-6.84.05-12.59-1.92-15.88-8.3s-2-12.1,1.92-17.82c8.05-11.66,15.85-23.49,23.71-35.28,6.92-10.39,11.12-21.55,10-34.36a82.84,82.84,0,0,1,0-13c.39-5.81-.38-11.13-3.58-16.21-2.36-3.76-1.17-5.62,3.2-5.66q18-.15,36,0c4.49,0,5.84,1.87,3.49,5.48-3.4,5.24-3.91,10.8-3.64,16.71a70.76,70.76,0,0,1,0,10.5c-1.57,15,3.7,27.78,12,39.78C92.35,109.94,99.54,121,107,131.82c3.74,5.46,4.51,11.11,1.55,17s-8.26,8.44-14.79,8.44ZM41.89,32.58C42.3,37.9,42.81,42.92,43,48c.18,4-.32,8,.05,12,1.44,15.44-3.81,28.8-12.3,41.26-7.6,11.15-15,22.41-22.65,33.55-2.57,3.76-3.52,7.56-1.25,11.68,2.16,3.92,5.71,5.18,10.07,5.17q38-.11,76,0c4.5,0,8.3-1.07,10.52-5.28s1.2-7.94-1.36-11.69C94.67,123.79,87.85,112.48,79.93,102,63.85,80.7,66.45,56.81,68.5,32.58Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M54.85,147.56c-12.49,0-25,.15-37.48-.13-2.34-.05-5.87-1.21-6.64-2.88-.92-2-.18-5.51,1.09-7.61,4.31-7.12,9.14-13.92,13.84-20.8,2.5-3.66,4.73-3.82,8.16-.76,7.71,6.89,12.53,7.38,21.26,1.83,3.65-2.32,7-5.17,10.61-7.48,7-4.39,12.25-3.21,16.86,3.56,5.35,7.84,10.85,15.6,15.86,23.65,1.29,2.09,2,5.64,1.08,7.64-.77,1.67-4.32,2.81-6.66,2.86C80.18,147.71,67.51,147.56,54.85,147.56Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M48.66,106.32c-1.47-2.17-3.85-4.2-4.21-6.55-.58-3.68,2.19-5.82,5.81-5.7,3.42.13,5.86,2.55,5.21,5.84-.47,2.35-2.91,4.3-4.47,6.43Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M58.87,78.74C60,80.57,62.26,82.58,62,84.19s-2.91,3.08-4.51,4.6c-1.51-1.61-4.05-3.11-4.23-4.85s2.18-3.5,3.43-5.26Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M57,59.85c-1.85,1.19-3,2.54-4,2.41s-2.55-1.77-2.49-2.66a3.69,3.69,0,0,1,2.66-2.55C54.13,57,55.2,58.49,57,59.85Z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                }
              />
              <h2 className="fs-24 text-black font-w600 mb-0">10 Jrigen</h2>
              <span className="fs-14">Super NB 5 ltr</span>
            </div>
          </div>
        </div>
        <div className="col-xl col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <CircleProgress
                percent={42}
                icon={
                  <svg
                    width="40"
                    height="40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 110.35 157.25"
                  >
                    <g>
                      <g>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M50.59,20.69c-3.72-.14-5.72-2.27-6.05-5.86a6,6,0,0,1,6.28-6.21c3.72.26,5.87,2.55,5.82,6.13S54.43,20.49,50.59,20.69Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M72.36,4.42c-3.27,2.29-5.2,4.68-6.82,4.48s-4.42-2.84-4.42-4.42S63.77.25,65.51,0,69.07,2.17,72.36,4.42Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M55.24,157.22c-12.5,0-25-.08-37.51,0-6.84.05-12.59-1.92-15.88-8.3s-2-12.1,1.92-17.82c8.05-11.66,15.85-23.49,23.71-35.28,6.92-10.39,11.12-21.55,10-34.36a82.84,82.84,0,0,1,0-13c.39-5.81-.38-11.13-3.58-16.21-2.36-3.76-1.17-5.62,3.2-5.66q18-.15,36,0c4.49,0,5.84,1.87,3.49,5.48-3.4,5.24-3.91,10.8-3.64,16.71a70.76,70.76,0,0,1,0,10.5c-1.57,15,3.7,27.78,12,39.78C92.35,109.94,99.54,121,107,131.82c3.74,5.46,4.51,11.11,1.55,17s-8.26,8.44-14.79,8.44ZM41.89,32.58C42.3,37.9,42.81,42.92,43,48c.18,4-.32,8,.05,12,1.44,15.44-3.81,28.8-12.3,41.26-7.6,11.15-15,22.41-22.65,33.55-2.57,3.76-3.52,7.56-1.25,11.68,2.16,3.92,5.71,5.18,10.07,5.17q38-.11,76,0c4.5,0,8.3-1.07,10.52-5.28s1.2-7.94-1.36-11.69C94.67,123.79,87.85,112.48,79.93,102,63.85,80.7,66.45,56.81,68.5,32.58Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M54.85,147.56c-12.49,0-25,.15-37.48-.13-2.34-.05-5.87-1.21-6.64-2.88-.92-2-.18-5.51,1.09-7.61,4.31-7.12,9.14-13.92,13.84-20.8,2.5-3.66,4.73-3.82,8.16-.76,7.71,6.89,12.53,7.38,21.26,1.83,3.65-2.32,7-5.17,10.61-7.48,7-4.39,12.25-3.21,16.86,3.56,5.35,7.84,10.85,15.6,15.86,23.65,1.29,2.09,2,5.64,1.08,7.64-.77,1.67-4.32,2.81-6.66,2.86C80.18,147.71,67.51,147.56,54.85,147.56Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M48.66,106.32c-1.47-2.17-3.85-4.2-4.21-6.55-.58-3.68,2.19-5.82,5.81-5.7,3.42.13,5.86,2.55,5.21,5.84-.47,2.35-2.91,4.3-4.47,6.43Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M58.87,78.74C60,80.57,62.26,82.58,62,84.19s-2.91,3.08-4.51,4.6c-1.51-1.61-4.05-3.11-4.23-4.85s2.18-3.5,3.43-5.26Z"
                        ></path>
                        <path
                        fill="white"
                          class="cls-1"
                          d="M57,59.85c-1.85,1.19-3,2.54-4,2.41s-2.55-1.77-2.49-2.66a3.69,3.69,0,0,1,2.66-2.55C54.13,57,55.2,58.49,57,59.85Z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                }
              />
              <h2 className="fs-24 text-black font-w600 mb-0">141 Sak</h2>
              <span className="fs-14">Samponen 25 kg</span>
            </div>
          </div>
        </div>
        <div className="col-xl col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <CircleProgress
                percent={15}
                icon={
                  <svg
                    width="40"
                    height="40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 383.78 460"
                  >
                    <g>
                      <g>
                        <path
                          fill="white"
                          class="cls-1"
                          d="M382.24,132.92,303.36,32a7.26,7.26,0,0,0-11.45,8.94l7.55,9.66L276.05,68.84,229.51,9.11A23.49,23.49,0,0,0,210.87,0H36.59A36.63,36.63,0,0,0,0,36.59V423.41A36.63,36.63,0,0,0,36.59,460H323.18a36.63,36.63,0,0,0,36.59-36.59v-239a23.74,23.74,0,0,0-5-14.53l-15-19.29,23.5-18.37,7.54,9.66a7.27,7.27,0,1,0,11.45-9ZM343.32,178.8a9.15,9.15,0,0,1,1.92,5.6v239a22.08,22.08,0,0,1-22.06,22.06H36.59a22.08,22.08,0,0,1-22.06-22.06V36.59A22.08,22.08,0,0,1,36.59,14.53H210.87A9.06,9.06,0,0,1,218.05,18Zm11-58-23.49,18.35L285,80.3,308.4,62Z"
                        ></path>
                        <path
                          fill="white"
                          class="cls-1"
                          d="M236.5,99.61a7.27,7.27,0,0,0-.69-7.61L202.4,47.45a7.25,7.25,0,0,0-5.81-2.9H51.81a7.26,7.26,0,0,0-7.26,7.26V96.36a7.26,7.26,0,0,0,7.26,7.26H230A7.28,7.28,0,0,0,236.5,99.61ZM59.07,89.1v-30H193l22.51,30Z"
                        ></path>
                        <path
                          fill="white"
                          class="cls-1"
                          d="M234,251.52a7.29,7.29,0,0,0-6.44.59l-18.72,11.54c-3-23.11-13.56-73.37-49.21-96a7.28,7.28,0,0,0-9.28,1.26c-3,3.28-72.76,81.2-66.32,154.54,3,33.64,19.12,58.92,45.5,71.18A79.68,79.68,0,0,0,163.14,402a87.51,87.51,0,0,0,50.2-16.14c19.29-13.58,48.2-48.46,25-129.52A7.26,7.26,0,0,0,234,251.52Zm-59.89,80.31a7.26,7.26,0,0,0,8.16-1.05l19.15-17.15c8,38.54-5.5,55-14.85,61.61-13.06,9.2-30.24,11.08-43.75,4.8s-21.78-19.59-23.36-37.51C116.4,307.29,144.92,268,156.16,254c15.73,16.57,15.64,55.65,14.07,70.57A7.26,7.26,0,0,0,174.14,331.83Zm36.49,37.55c7.73-14.23,11.83-36.61,2-71.2a7.25,7.25,0,0,0-11.82-3.42L185.4,308.51c-.16-21.51-4.05-56.65-26.3-70.77a7.26,7.26,0,0,0-9.27,1.26c-2,2.22-49.19,54.89-44.81,104.8.24,2.65.6,5.21,1.07,7.7a86.45,86.45,0,0,1-7.55-29.32C93.51,265,142.2,201.41,157,183.56c34.94,27.71,38.5,92.05,38.54,92.73a7.26,7.26,0,0,0,11.06,5.83l20.31-12.52C241.12,327.6,225.18,356,210.63,369.38Z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                }
              />
              <h2 className="fs-24 text-black font-w600 mb-0">10 L</h2>
              <span className="fs-14">Solar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tittle-row">
        <h4 className="text-black fs-18 mb-3">Produksi</h4>
      </div>
      <div className="row">
        <div className="col-xl-9 col-xxl-8">
          <div className="card">
            <div className="card-header flex-wrap pb-0 border-0">
              <div className="mr-auto pr-3 mb-2">
                <h4 className="text-black fs-20">Statistik Produksi</h4>
                <p className="fs-13 mb-2 mb-sm-0 text-black">
                  Statistik produksi kolam A1 periode ke 6
                </p>
              </div>
              <div className="d-flex mr-3 mr-sm-2 mb-2">
                <svg
                  className="mr-0 mt-1"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" fill="#FF9432" />
                </svg>
                <div>
                  <span className="fs-12 text-black">DOC</span>
                </div>
              </div>
              <div className="d-flex mr-3 mr-sm-2 mb-2">
                <svg
                  className="mr-0 mt-1"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" fill="#1EA7C5" />
                </svg>
                <div>
                  <span className="fs-12 text-black">ABW</span>
                </div>
              </div>
              <div className="d-flex mr-3 mr-sm-2 mb-2">
                <svg
                  className="mr-0 mt-1"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" fill="#C046D3" />
                </svg>
                <div>
                  <span className="fs-12 text-black">FCR</span>
                </div>
              </div>
              <div className="d-flex mr-3 mr-sm-5 mb-2">
                <svg
                  className="mr-0 mt-1"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" fill="#6D6F53" />
                </svg>
                <div>
                  <span className="fs-12 text-black">SR</span>
                </div>
              </div>
              <Dropdown className="dropdown mt-sm-0 mt-3 mb-0">
                <Dropdown.Toggle
                  variant=""
                  as="button"
                  className="btn rounded border border-light dropdown-toggle"
                >
                  Kolam A1-6
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-right">
                  <Dropdown.Item>Kolam A2-6</Dropdown.Item>
                  <Dropdown.Item>Kolam A3-6</Dropdown.Item>
                  <Dropdown.Item>Kolam A4-6</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-3">
              <ProductionStat
                series={[
                  {
                    name: "DOC",
                    data: [
                      65, 65, 65, 120, 120, 80, 120, 100, 100, 120, 120, 120,
                    ],
                  },
                  {
                    name: "ABW",
                    data: [50, 100, 35, 35, 0, 0, 80, 20, 40, 40, 40, 40],
                  },
                  {
                    name: "FCR",
                    data: [20, 40, 20, 80, 40, 40, 20, 60, 60, 20, 110, 60],
                  },
                  {
                    name: "SR",
                    data: [15, 25, 50, 65, 32, 51, 43, 20, 20, 85, 96, 80],
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-md-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="text-black fs-20 mb-0">Status Panen</h4>
            </div>
            <div className="card-body text-center">
              <ApexRadialBar series={80} />
              <p className="fs-14">
                Status panen kolam A1-6 adalah Parsial ke 4
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-md-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="text-black fs-20 mb-0">Duration Worked</h4>
            </div>
            <div className="card-body">
              <div className="media align-items-center border border-warning rounded p-3 mb-md-4 mb-3">
                <div className="d-inline-block mr-3 position-relative donut-chart-sale2">
                  <svg className="peity" height={70} width={70}>
                    <path
                      d="M 35 0 A 35 35 0 1 1 0 35.00000000000001 L 8 35 A 27 27 0 1 0 35 8"
                      data-value={6}
                      fill="rgb(255, 148, 50)"
                    />
                    <path
                      d="M 0 35.00000000000001 A 35 35 0 0 1 34.99999999999999 0 L 34.99999999999999 8 A 27 27 0 0 0 8 35"
                      data-value={2}
                      fill="rgba(255, 255, 255, 1)"
                    />
                  </svg>

                  <small className="text-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip6)">
                        <path
                          d="M0.988926 17.074C0.328245 17.2006 -0.104616 17.8385 0.0219518 18.4992C0.133331 19.0814 0.644663 19.4864 1.21675 19.4864C1.29269 19.4864 1.37116 19.4788 1.4471 19.4636L6.45917 18.5017C6.74521 18.446 7.00087 18.2916 7.18313 18.0638L9.33478 15.3502L8.6159 14.9832C8.08432 14.7148 7.71471 14.2288 7.58815 13.639L5.55801 16.1982L0.988926 17.074Z"
                          fill="#FF9432"
                        />
                        <path
                          d="M18.84 6.493C20.3135 6.493 21.508 5.29848 21.508 3.82496C21.508 2.35144 20.3135 1.15692 18.84 1.15692C17.3664 1.15692 16.1719 2.35144 16.1719 3.82496C16.1719 5.29848 17.3664 6.493 18.84 6.493Z"
                          fill="#FF9432"
                        />
                        <path
                          d="M13.0179 3.15671C12.7369 2.86813 12.4762 2.75422 12.1902 2.75422C12.0863 2.75422 11.9826 2.76941 11.8712 2.79472L7.292 3.88067C6.65917 4.03002 6.26934 4.66539 6.41869 5.29569C6.54779 5.8374 7.02874 6.20192 7.56286 6.20192C7.65401 6.20192 7.74511 6.19179 7.83627 6.16901L11.7371 5.24507C11.9902 5.52605 13.2584 6.90057 13.4888 7.14358C11.8763 8.86996 10.2638 10.5938 8.65134 12.3202C8.62602 12.3481 8.60326 12.3759 8.58046 12.4037C8.10963 13.0036 8.25394 13.9453 8.96272 14.3022L13.9064 16.826L11.3396 20.985C10.9878 21.5571 11.165 22.3063 11.737 22.6607C11.937 22.7848 12.1572 22.843 12.3749 22.843C12.7825 22.843 13.1824 22.638 13.4128 22.2658L16.6732 16.9829C16.8529 16.6918 16.901 16.34 16.8073 16.0134C16.7137 15.6843 16.4884 15.411 16.1821 15.2565L12.8331 13.5529L16.3542 9.7863L19.0122 12.0392C19.2324 12.2265 19.5032 12.3176 19.7716 12.3176C20.0601 12.3176 20.3487 12.2113 20.574 12.0038L23.6242 9.16106C24.1002 8.71808 24.128 7.97386 23.685 7.49797C23.4521 7.24989 23.1382 7.12333 22.8243 7.12333C22.5383 7.12333 22.2497 7.22711 22.0244 7.43721L19.7412 9.56101C19.7386 9.56354 14.0178 4.1819 13.0179 3.15671Z"
                          fill="#FF9432"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip6">
                          <rect width={24} height={24} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </small>
                </div>
                <div>
                  <h4 className="fs-18 text-black mb-0">Running</h4>
                  <span className="fs-14 text-warning">52 hours, 2min</span>
                </div>
              </div>
              <div className="media align-items-center border border-info rounded p-3 mb-md-4 mb-3">
                <div className="d-inline-block mr-3 position-relative donut-chart-sale2">
                  <svg className="peity" height="70" width="70">
                    <path
                      d="M 35 0 A 35 35 0 0 1 70 35 L 62 35 A 27 27 0 0 0 35 8"
                      data-value="2"
                      fill="rgb(30, 167, 197)"
                    ></path>
                    <path
                      d="M 70 35 A 35 35 0 1 1 34.99999999999999 0 L 34.99999999999999 8 A 27 27 0 1 0 62 35"
                      data-value="6"
                      fill="rgba(255, 255, 255, 1)"
                    ></path>
                  </svg>
                  <small className="text-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.8586 5.22596L5.87121 10.5542C5.50758 11.0845 5.64394 11.8068 6.17172 12.1679L11.1945 15.6098V18.9558C11.1945 19.5921 11.6995 20.125 12.3359 20.1376C12.9874 20.1477 13.5177 19.6249 13.5177 18.976V15.0012C13.5177 14.6174 13.3283 14.2588 13.0126 14.0442L9.79041 11.8346L12.5025 8.95833L13.8914 12.1225C14.0758 12.5442 14.4949 12.8169 14.9546 12.8169H19.1844C19.8207 12.8169 20.3536 12.3119 20.3662 11.6755C20.3763 11.024 19.8536 10.4937 19.2046 10.4937H15.7172C15.2576 9.44821 14.7677 8.41285 14.3409 7.35225C14.1237 6.81689 14.0025 6.58457 13.6036 6.21588C13.5227 6.14013 12.9596 5.62498 12.4571 5.16538C11.995 4.74616 11.2828 4.77394 10.8586 5.22596Z"
                        fill="#1EA7C5"
                      />
                      <path
                        d="M15.6162 5.80678C17.0861 5.80678 18.2778 4.61514 18.2778 3.14517C18.2778 1.6752 17.0861 0.483551 15.6162 0.483551C14.1462 0.483551 12.9545 1.6752 12.9545 3.14517C12.9545 4.61514 14.1462 5.80678 15.6162 5.80678Z"
                        fill="#1EA7C5"
                      />
                      <path
                        d="M4.89899 23.5164C7.60463 23.5164 9.79798 21.323 9.79798 18.6174C9.79798 15.9117 7.60463 13.7184 4.89899 13.7184C2.19335 13.7184 0 15.9117 0 18.6174C0 21.323 2.19335 23.5164 4.89899 23.5164Z"
                        fill="#1EA7C5"
                      />
                      <path
                        d="M19.101 23.5164C21.8066 23.5164 24 21.323 24 18.6174C24 15.9117 21.8066 13.7184 19.101 13.7184C16.3954 13.7184 14.202 15.9117 14.202 18.6174C14.202 21.323 16.3954 23.5164 19.101 23.5164Z"
                        fill="#1EA7C5"
                      />
                    </svg>
                  </small>
                </div>
                <div>
                  <h4 className="fs-18 text-black mb-0">Cycling</h4>
                  <span className="fs-14 text-info">23 hours, 45min</span>
                </div>
              </div>
              <div className="media align-items-center border border-secondary rounded p-3">
                <div className="d-inline-block mr-3 position-relative donut-chart-sale2">
                  <svg className="peity" height={70} width={70}>
                    <path
                      d="M 35 0 A 35 35 0 0 1 69.46827135542728 28.922313781657436 L 61.58980933132962 30.31149920299288 A 27 27 0 0 0 35 8"
                      data-value={2}
                      fill="rgb(192, 70, 211)"
                    />
                    <path
                      d="M 69.46827135542728 28.922313781657436 A 35 35 0 1 1 34.99999999999999 0 L 34.99999999999999 8 A 27 27 0 1 0 61.58980933132962 30.31149920299288"
                      data-value={7}
                      fill="rgba(255, 255, 255, 1)"
                    />
                  </svg>

                  <small className="text-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip7)">
                        <path
                          d="M11.9997 5.9999C13.6566 5.9999 14.9997 4.65677 14.9997 2.99995C14.9997 1.34312 13.6566 0 11.9997 0C10.3429 0 8.9998 1.34312 8.9998 2.99995C8.9998 4.65677 10.3429 5.9999 11.9997 5.9999Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M17.8305 21.8297L14.1361 23.2153L15.9733 23.9042C16.764 24.1978 17.6171 23.791 17.9046 23.0261C18.0577 22.618 18.0124 22.1905 17.8305 21.8297Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M5.02677 16.5949C4.25263 16.3078 3.3869 16.6974 3.09543 17.473C2.80467 18.2486 3.19799 19.1128 3.97354 19.4043L5.5918 20.0111L9.86412 18.4088L5.02677 16.5949Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M20.9045 17.473C20.613 16.6974 19.7473 16.3078 18.9732 16.5949L6.97345 21.0948C6.19781 21.3863 5.80453 22.2505 6.0953 23.0262C6.38278 23.7908 7.23572 24.198 8.02664 23.9043L20.0264 19.4044C20.8021 19.1129 21.1953 18.2487 20.9045 17.473Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M22.4998 11.9998H18.9271L16.3417 6.82899C16.073 6.29213 15.5265 5.98627 14.9632 5.99991L11.9997 5.9999L9.03663 5.99991C8.47343 5.98627 7.92757 6.29217 7.65828 6.82899L5.07289 11.9998H1.50022C0.671898 11.9998 0.000274658 12.6714 0.000274658 13.4997C0.000274658 14.328 0.671898 14.9997 1.50022 14.9997H6.00012C6.56848 14.9997 7.08776 14.6789 7.34187 14.1706L9.00002 10.8543V16.483L11.9999 17.6079L14.9999 16.4827V10.8543L16.6581 14.1706C16.9122 14.6789 17.4315 14.9997 17.9998 14.9997H22.4997C23.328 14.9997 23.9997 14.328 23.9997 13.4997C23.9997 12.6714 23.3281 11.9998 22.4998 11.9998Z"
                          fill="#C046D3"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip7">
                          <rect width={24} height={24} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </small>
                </div>
                <div>
                  <h4 className="fs-18 text-black mb-0">Yoga</h4>
                  <span className="fs-14 text-secondary">16 hours, 2min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-xxl-8">
          <div className="card">
            <div className="card-header d-sm-flex d-block pb-0 border-0">
              <div className="mr-auto pr-3">
                <h4 className="text-black fs-20">Calories Chart</h4>
                <p className="fs-13 mb-0 text-black">
                  Lorem ipsum dolor sit amet, consectetur
                </p>
              </div>
              <Dropdown className="dropdown mt-sm-0 mt-3">
                <Dropdown.Toggle
                  as="button"
                  variant=""
                  className="btn rounded border border-light dropdown-toggle"
                >
                  Kolam A
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                  <Dropdown.Item>Kolam B</Dropdown.Item>
                  <Dropdown.Item>Kolam C</Dropdown.Item>
                  <Dropdown.Item>Kolam D</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body">
              <ApexNagetivePosative />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
