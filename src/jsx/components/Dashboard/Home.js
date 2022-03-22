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
                percent={30}
                icon={
                  <svg
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.9353 18.3544C39.8731 18.1666 38.3337 13.75 32.5 13.75C25.9703 13.75 22.8666 17.9659 21.795 19.8719C20.6306 19.1822 19.1838 18.75 17.5 18.75C15.7922 18.75 14.35 19.1375 13.1275 19.7072C13.5697 16.695 13.6987 13.1119 13.7353 11.25H17.5C17.9175 11.25 18.3081 11.0413 18.54 10.6934L21.04 6.94344C21.4075 6.39156 21.2806 5.64813 20.7494 5.25031C18.3166 3.42531 15.1269 1.25 13.75 1.25C11.6137 1.25 6.95688 6.24344 5.16469 9.38C0.0584378 18.3153 0 31.925 0 32.5C0 32.8797 0.172188 33.2391 0.46875 33.4759C7.56469 39.1522 15.7519 40 20 40C23.3716 40 29.9756 39.4391 36.3306 35.6834C38.5938 34.3456 40 31.8706 40 29.2244V18.75C40 18.6156 39.9781 18.4822 39.9353 18.3544ZM37.5 29.2244C37.5 30.9912 36.565 32.6419 35.0584 33.5316C29.2162 36.9844 23.1166 37.5 20 37.5C16.9178 37.5 9.15156 36.9453 2.51094 31.8981C2.58406 29.19 3.14094 17.96 7.33531 10.62C9.09187 7.54813 12.7112 4.16312 13.7722 3.76562C14.4606 3.96406 16.4566 5.23219 18.2972 6.55125L16.8309 8.75H12.5C11.8091 8.75 11.25 9.30969 11.25 10C11.25 10.0822 11.2344 17.9659 10.185 21.6878C9.46375 22.3391 8.88656 22.9872 8.43125 23.4994C8.2175 23.7403 8.02969 23.9522 7.86594 24.1166C7.3775 24.605 7.3775 25.3959 7.86594 25.8841C8.35437 26.3722 9.14531 26.3725 9.63344 25.8841C9.82625 25.6913 10.0472 25.4441 10.3 25.1603C11.6003 23.6975 13.7756 21.25 17.5 21.25C20.5884 21.25 22.5 23.1966 22.5 25C22.5 25.6903 23.0591 26.25 23.75 26.25C24.4409 26.25 25 25.6903 25 25C25 23.8181 24.5506 22.6022 23.7313 21.5581C24.1503 20.66 26.5119 16.25 32.5 16.25C35.99 16.25 37.2228 18.39 37.5 18.9922V29.2244Z"
                      fill="white"
                    />
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
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip1)">
                      <path
                        d="M32.5972 16.2892C32.396 15.8517 32.0044 15.5314 31.5358 15.4211C31.067 15.3107 30.5737 15.4225 30.1984 15.7243C29.5264 16.2647 28.6792 16.5622 27.8126 16.5623C26.7941 16.5624 25.8366 16.1663 25.1165 15.447C24.397 14.7282 24.0006 13.7706 24.0006 12.7504C24.0006 12.346 24.063 11.9035 24.1862 11.4348C24.6802 9.55445 24.6864 7.57584 24.204 5.71301C23.7158 3.82808 22.7376 2.10392 21.3752 0.727114C21.1908 0.54055 21.09 0.442581 21.09 0.442581C20.4892 -0.141565 19.5339 -0.14844 18.9257 0.427737C18.7859 0.560082 15.4647 3.72151 12.1 8.3035C7.49236 14.5779 5.15617 20.248 5.15617 25.1562C5.15617 29.1273 6.70048 32.8566 9.50457 35.6575C12.3083 38.458 16.0359 40.0002 20.0005 40.0001C23.9651 39.9999 27.6923 38.4576 30.4955 35.6575C33.2995 32.8567 34.8438 29.1551 34.8438 25.2343C34.8438 22.5407 34.0879 19.5312 32.5972 16.2892ZM22.6961 35.4472C21.9761 36.1664 21.0186 36.5624 20.0001 36.5625C18.9816 36.5626 18.0242 36.1665 17.304 35.4472C16.5845 34.7284 16.1881 33.7707 16.1881 32.7506C16.1881 30.3061 18.3931 27.2754 19.9878 25.4753C21.589 27.3136 23.8119 30.3943 23.8119 32.7821C23.8119 33.782 23.4156 34.7285 22.6961 35.4472ZM28.2871 33.4464C27.7708 33.9621 27.2144 34.423 26.6256 34.8278C26.8301 34.1729 26.9369 33.4853 26.9369 32.7821C26.9369 30.6427 25.9326 28.1741 23.9518 25.4447C22.5457 23.5071 21.1487 22.1406 21.09 22.0835C20.4893 21.4988 19.5343 21.4922 18.9256 22.0685C18.8666 22.1245 17.4638 23.4596 16.0534 25.3804C14.0691 28.0825 13.063 30.5621 13.063 32.7506C13.063 33.4673 13.1719 34.1668 13.3795 34.8313C12.7889 34.4257 12.2308 33.9636 11.7129 33.4464C9.49988 31.236 8.28112 28.2918 8.28112 25.1562C8.28112 16.7851 16.7974 7.12224 19.9336 3.84831C21.3135 5.76778 21.7861 8.27217 21.1637 10.6406C20.9725 11.3684 20.8755 12.0782 20.8755 12.7505C20.8755 14.6061 21.5973 16.349 22.908 17.658C24.2182 18.9668 25.9601 19.6876 27.8127 19.6874C28.7132 19.6874 29.6026 19.5103 30.4282 19.1748C31.2853 21.3866 31.7186 23.419 31.7186 25.2343C31.7187 28.3195 30.5 31.2359 28.2871 33.4464Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip1">
                        <rect width={40} height={40} fill="white" />
                      </clipPath>
                    </defs>
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
                percent={75}
                icon={
                  <svg
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip2)">
                      <path
                        d="M33.82 11.4053C34.0805 11.1923 34.332 10.9653 34.5731 10.7242C36.4537 8.84367 37.4895 6.34328 37.4895 3.68359V3.68234C37.4895 3.03516 36.9636 2.51047 36.3164 2.51047C33.6567 2.51047 31.1563 3.54625 29.2757 5.42687C29.0346 5.66797 28.8076 5.91945 28.5946 6.18C27.991 2.67508 24.9298 0 21.2551 0C20.6079 0 20.0832 0.524687 20.0832 1.17188V2.81305C20.0832 4.95719 20.8022 6.99062 22.125 8.63914C19.0591 8.29398 15.869 9.29383 13.5229 11.6401C7.47433 17.6886 0.36706 37.5919 0.067451 38.4362C-0.0837209 38.8622 0.0236228 39.3371 0.343232 39.6567C0.662842 39.9763 1.13776 40.0837 1.56378 39.9325C2.40808 39.6329 22.3114 32.5255 28.3599 26.477C30.706 24.1309 31.706 20.9409 31.3608 17.8749C33.0094 19.1977 35.0428 19.9167 37.1869 19.9167H38.8281C39.4753 19.9167 40 19.392 40 18.7448C40 15.0702 37.3249 12.009 33.82 11.4053ZM30.933 7.08414C32.0653 5.9518 33.4917 5.22 35.0398 4.96008C34.78 6.50812 34.0482 7.93453 32.9157 9.06688C31.7835 10.1991 30.3575 10.9309 28.8089 11.1909C29.0689 9.64273 29.8007 8.21649 30.933 7.08414ZM22.427 2.47945C24.6784 3.01047 26.3593 5.03656 26.3593 7.44789V9.63961L24.4736 7.75398C23.1538 6.43414 22.427 4.67945 22.427 2.81305V2.47945ZM19.828 29.4677L18.3182 27.9579C17.8606 27.5002 17.1185 27.5003 16.6609 27.9579C16.2032 28.4155 16.2032 29.1575 16.6609 29.6152L17.6477 30.6019C13.2707 32.7998 7.9937 35.0181 3.15104 36.8489C4.21644 34.0308 5.54269 30.7277 6.98815 27.4736L7.87448 28.3599C8.33206 28.8175 9.07409 28.8175 9.53175 28.3599C9.9894 27.9023 9.9894 27.1603 9.53175 26.7027L8.0244 25.1953C9.59073 21.8356 10.9352 19.342 12.0686 17.4916L15.4057 20.8287C15.8633 21.2862 16.6053 21.2862 17.063 20.8287C17.5207 20.3711 17.5207 19.6291 17.063 19.1714L13.3816 15.49C14.0934 14.4868 14.6916 13.786 15.1803 13.2973C18.3578 10.1198 23.5244 10.119 26.7027 13.2973C30.1591 16.7537 29.0887 21.0277 28.1953 22.7725L24.5942 19.1713C24.1366 18.7138 23.3946 18.7138 22.9369 19.1713C22.4792 19.6289 22.4792 20.3709 22.9369 20.8286L26.8139 24.7055C25.9139 25.6407 23.9935 27.2169 19.828 29.4677ZM37.1869 17.573C35.3205 17.573 33.5657 16.8461 32.246 15.5263L30.3603 13.6406H32.5521C34.9633 13.6406 36.9895 15.3216 37.5205 17.573H37.1869Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip2">
                        <rect width={40} height={40} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                }
              />
              <h2 className="fs-24 text-black font-w600 mb-0">23 Pack</h2>
              <span className="fs-14">Ragi Tape</span>
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
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip3)">
                      <path
                        d="M20 32.9688C17.4153 32.9688 15.3125 30.8659 15.3125 28.2812C15.3125 25.6966 17.4153 23.5938 20 23.5938C22.5847 23.5938 24.6875 25.6966 24.6875 28.2812C24.6875 30.8659 22.5847 32.9688 20 32.9688ZM20 26.7188C19.1384 26.7188 18.4375 27.4197 18.4375 28.2812C18.4375 29.1428 19.1384 29.8438 20 29.8438C20.8616 29.8438 21.5625 29.1428 21.5625 28.2812C21.5625 27.4197 20.8616 26.7188 20 26.7188ZM12.6373 20.7029C14.4202 20.687 16.1845 19.9548 17.8812 18.5266L15.8687 16.1359C13.593 18.0516 11.5632 18.0515 9.28742 16.1359L7.275 18.5267C8.99117 19.9711 10.775 20.7031 12.5782 20.7031C12.5979 20.7031 12.6177 20.703 12.6373 20.7029ZM32.5941 18.5994L30.6873 16.1236C28.3111 17.9535 26.259 17.9616 24.0334 16.1498L22.0605 18.5732C23.7464 19.9458 25.5029 20.632 27.2809 20.632C29.0471 20.6319 30.8346 19.9544 32.5941 18.5994ZM40 9.375H33.6466L40 2.92391V0H29.0625V3.125H35.4159L29.0625 9.57609V12.5H40V9.375ZM36.2987 15.625C36.6737 17.0209 36.875 18.4873 36.875 20C36.875 29.3049 29.3049 36.875 20 36.875C10.6951 36.875 3.125 29.3049 3.125 20C3.125 10.6951 10.6951 3.125 20 3.125C22.1183 3.125 24.146 3.51844 26.0156 4.23422V0.917344C24.0943 0.314141 22.0714 0 20 0C14.6578 0 9.63539 2.08039 5.85781 5.85781C2.08039 9.63539 0 14.6578 0 20C0 25.3422 2.08039 30.3646 5.85781 34.1422C9.63539 37.9196 14.6578 40 20 40C25.3422 40 30.3646 37.9196 34.1422 34.1422C37.9196 30.3646 40 25.3422 40 20C40 18.5101 39.8377 17.0452 39.5224 15.625H36.2987Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip3">
                        <rect width={40} height={40} fill="white" />
                      </clipPath>
                    </defs>
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
                percent={75}
                icon={
                  <svg
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.1666 19.5283C27.8064 18.2461 29.0052 16.484 29.5958 14.4879C30.1863 12.4919 30.1393 10.3612 29.4611 8.39317C28.783 6.4251 27.5076 4.71772 25.8128 3.5091C24.118 2.30048 22.0883 1.65088 20.0066 1.65088C17.925 1.65088 15.8953 2.30048 14.2005 3.5091C12.5057 4.71772 11.2303 6.4251 10.5522 8.39317C9.87403 10.3612 9.82697 12.4919 10.4175 14.4879C11.0081 16.484 12.2069 18.2461 13.8466 19.5283C10.7486 20.761 8.09109 22.8939 6.21709 25.6517C4.34309 28.4096 3.33862 31.6657 3.33331 35V36.6667C3.33331 37.1087 3.50891 37.5326 3.82147 37.8452C4.13403 38.1577 4.55795 38.3333 4.99998 38.3333H35C35.442 38.3333 35.8659 38.1577 36.1785 37.8452C36.4911 37.5326 36.6666 37.1087 36.6666 36.6667V35C36.6624 31.6673 35.6599 28.4122 33.7884 25.6546C31.9169 22.8969 29.2622 20.7631 26.1666 19.5283ZM13.3333 11.6667C13.3333 10.3481 13.7243 9.0592 14.4569 7.96287C15.1894 6.86654 16.2306 6.01206 17.4488 5.50748C18.6669 5.00289 20.0074 4.87087 21.3006 5.12811C22.5938 5.38534 23.7817 6.02028 24.714 6.95263C25.6464 7.88498 26.2813 9.07286 26.5385 10.3661C26.7958 11.6593 26.6638 12.9997 26.1592 14.2179C25.6546 15.4361 24.8001 16.4773 23.7038 17.2098C22.6075 17.9423 21.3185 18.3333 20 18.3333C18.2319 18.3333 16.5362 17.631 15.2859 16.3807C14.0357 15.1305 13.3333 13.4348 13.3333 11.6667ZM6.66665 35C6.66665 31.4638 8.0714 28.0724 10.5719 25.5719C13.0724 23.0714 16.4638 21.6667 20 21.6667C23.5362 21.6667 26.9276 23.0714 29.4281 25.5719C31.9286 28.0724 33.3333 31.4638 33.3333 35H6.66665Z"
                      fill="white"
                    />
                  </svg>
                }
              />
              <h2 className="fs-24 text-black font-w600 mb-0">141 Sak</h2>
              <span className="fs-14">Samponen 25 kg</span>
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
