import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Image
import profile from "../../../images/profile/17.jpg";
import avatar from "../../../images/avatar/1.jpg";

const Header = ({
  onNote,
  toggle,
  onProfile,
  onNotification,
  onBox,
  onDark,
}) => {
  const origin = window.location.origin;
  const patern = origin+"/#/"
  var path = window.location.href;
  var name = path.replace(patern, "");
  const [isDark, setDark] = useState(false);
  // var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
  // var finalName = filterName.includes("app")
  //   ? filterName.filter((f) => f !== "app")
  //   : filterName.includes("ui")
  //   ? filterName.filter((f) => f !== "ui")
  //   : filterName.includes("uc")
  //   ? filterName.filter((f) => f !== "uc")
  //   : filterName.includes("basic")
  //   ? filterName.filter((f) => f !== "basic")
  //   : filterName.includes("form")
  //   ? filterName.filter((f) => f !== "form")
  //   : filterName.includes("table")
  //   ? filterName.filter((f) => f !== "table")
  //   : filterName.includes("page")
  //   ? filterName.filter((f) => f !== "page")
  //   : filterName.includes("email")
  //   ? filterName.filter((f) => f !== "email")
  //   : filterName.includes("ecom")
  //   ? filterName.filter((f) => f !== "ecom")
  //   : filterName.includes("chart")
  //   ? filterName.filter((f) => f !== "chart")
  //   : filterName.includes("editor")
  //   ? filterName.filter((f) => f !== "editor")
  //   : filterName;
  const body = document.querySelector("body");

  const switchTheme = () => {
    // if (isDark) {
    //    body.classList.toggle("dark");
    // } else {
    //    body.classList.add("dark");
    // }
    body.classList.toggle("dark");
    setDark(!isDark);
    console.log(isDark);
    onDark(isDark);
  };

  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize" }}
              >
                {name.length === 0
                  ? "Dashboard"
                  : name}
              </div>
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item dropdown notification_dropdown">
                <Link
                  className="nav-link  ai-icon"
                  to="#"
                  role="button"
                  data-toggle="dropdown"
                  onClick={() => onNotification()}
                >
                  <i class="bx bx-bell"></i>
                  <span className="badge light text-white bg-primary">12</span>
                </Link>
                <div
                  className={`dropdown-menu dropdown-menu-right ${
                    toggle === "notification" ? "show" : ""
                  }`}
                >
                  <PerfectScrollbar
                    id="DZ_W_Notification1"
                    className={` widget-media dz-scroll p-3 height380 ${
                      toggle === "notification" ? "ps ps--active-y" : ""
                    }`}
                  >
                    <ul className="timeline">
                      <li>
                        <div className="timeline-panel">
                          <div className="media mr-2">
                            <img alt="image" width={50} src={avatar} />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Dr sultads Send you Photo</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media mr-2 media-info">KG</div>
                          <div className="media-body">
                            <h6 className="mb-1">
                              Resport created successfully
                            </h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media mr-2 media-success">
                            <i className="fa fa-home" />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Reminder : Treatment Time!</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media mr-2">
                            <img alt="image" width={50} src={avatar} />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Dr sultads Send you Photo</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media mr-2 media-danger">KG</div>
                          <div className="media-body">
                            <h6 className="mb-1">
                              Resport created successfully
                            </h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="timeline-panel">
                          <div className="media mr-2 media-primary">
                            <i className="fa fa-home" />
                          </div>
                          <div className="media-body">
                            <h6 className="mb-1">Reminder : Treatment Time!</h6>
                            <small className="d-block">
                              29 July 2020 - 02:26 PM
                            </small>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </PerfectScrollbar>
                  <Link className="all-notification" to="#">
                    See all notifications <i className="ti-arrow-right" />
                  </Link>
                </div>
              </li>
              <li className="nav-item dropdown notification_dropdown">
                <Link
                  className="nav-link  ai-icon"
                  to="#"
                  role="button"
                  data-toggle="dropdown"
                  onClick={() => switchTheme()}
                >
                  {isDark ? (
                    <i class="bx bx-sun"></i>
                  ) : (
                    <i class="bx bx-moon"></i>
                  )}
                </Link>
              </li>
              <li className="nav-item dropdown header-profile">
                <Link
                  to="#"
                  role="button"
                  data-toggle="dropdown"
                  className={`nav-item dropdown header-profile ${
                    toggle === "profile" ? "show" : ""
                  }`}
                  onClick={() => onProfile()}
                >
                  <img
                    src={"http://103.179.56.92/static/upload/andy.jpg"}
                    width={20}
                    alt
                  />
                </Link>
                <div
                  className={`dropdown-menu dropdown-menu-right ${
                    toggle === "profile" ? "show" : ""
                  }`}
                >
                  <Link to="/app-profile" className="dropdown-item ai-icon">
                    <svg
                      id="icon-user1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                    <span className="ml-2">Profile </span>
                  </Link>
                  <Link to="/email-inbox" className="dropdown-item ai-icon">
                    <svg
                      id="icon-inbox"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="ml-2">Inbox </span>
                  </Link>
                  <Link to="/page-login" className="dropdown-item ai-icon">
                    <svg
                      id="icon-logout"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-danger"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1={21} y1={12} x2={9} y2={12} />
                    </svg>
                    <span className="ml-2">Logout </span>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
