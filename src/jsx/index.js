import React, { Suspense, useEffect, useState } from "react";
// import Login from "./screen/Login";

/// React router dom
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  HashRouter,
} from "react-router-dom";
import { withResizeDetector } from "react-resize-detector";
import { endpoints, request } from "src/utils";
import { useDispatch } from "react-redux";
import { SET_CURRENT_PROFILE } from "src/redux/actions";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";

/// Css
import "./index.css";
import "./chart.css";

/// Layout
import Nav from "./layouts/nav";

/// Deshboard
const Home = React.lazy(() => import("./screen/Dashboard/Home"));
const Login = React.lazy(() => import("./Login"));
const Setup = React.lazy(() => import("./screen/Setup"));

const Markup = ({ width }) => {
  const routes = [
    /// Deshborad
    { url: "", component: Home },

    // Login
    { url: "login", component: Login },

    // Setup
    { url: "setup", component: Setup },
  ];

  const body = document.querySelector("body");

  width >= 1300
    ? body.setAttribute("data-sidebar-style", "full")
    : width <= 1299 && width >= 767
    ? body.setAttribute("data-sidebar-style", "mini")
    : body.setAttribute("data-sidebar-style", "overlay");

  
  const interfaceType = "normal"

  body.setAttribute("data-interface-type", interfaceType)


  useEffect(() => {
    getAccess();
  }, []);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const getAccess = async () => {
    const config = {
      ...endpoints.getAccess,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        dispatch({ type: SET_CURRENT_PROFILE, payload: data });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return loading ? (
    <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
  ) : (
    <Router>
      <div id="main-wrapper" className="show">
        {interfaceType !== 'frame' ? <Nav /> :<></>}

        <div className="content-body">
          <div className="container-fluid">
            <Suspense
              fallback={
                <div
                  className="flex align-items-center"
                  style={{ height: "50rem" }}
                >
                  <ProgressSpinner
                    style={{ width: "50px", height: "50px" }}
                    strokeWidth="8"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                  />
                </div>
              }
            >
              <HashRouter basename="/">
                <Switch>
                  {routes.map((data, i) => (
                    <Route
                      key={i}
                      exact
                      path={`/${data.url}`}
                      component={data.component}
                    />
                  ))}
                </Switch>
              </HashRouter>
            </Suspense>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default withResizeDetector(Markup);
