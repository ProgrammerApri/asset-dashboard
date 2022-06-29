import React, { useRef, useState } from "react";
import { request, endpoints } from "src/utils";
import { Checkbox } from "primereact/checkbox";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Button, Image, Row } from "react-bootstrap";
import logo from "../images/logo-large.png";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(true);
  const passRef = useRef(null);

  const handleSubmit = async () => {
    if (username && password) {
      const config = {
        ...endpoints.login,
        data: { username, password, remember },
      };
      console.log(config.data);
      let response = null;
      try {
        response = await request(null, config);
        console.log(response);
        if (response.status) {
          const { data } = response;
          console.log(data.token);
          localStorage.setItem("token", data.token);
          window.location.reload();
        }
      } catch (error) {
        if (error.status === 403) {
          alert("Password yang anda inputkan salah");
        } else {
          alert("Gangguan Server");
        }
      }
    }
  };

  const moveToNext = (nextRef) => {
    if (nextRef) {
      console.log(document.querySelectorAll(`#${nextRef.current.props.id} input`));
      document.querySelector(`#${nextRef.current.props.id} input`).focus()
    }
  }

  return (
    <>
      <Row>
        <div className="login-left col-lg-4 col-md-6 vh-100">
          <div className="login-header col-12 ml-3 mt-4">
            <img className="login-logo" src={logo} alt="" />
          </div>
          <div className="d-flex align-items-center mt-5">
            <div className="mr-3 ml-3 mt-5" style={{ width: "40rem" }}>
              <div className="col-12 mt-6">
                <h2 className="fw-bold">Sign In</h2>
              </div>
              <div className="col-12 mb-2 mt-6">
                <span className="p-float-label w-100">
                  <InputText
                    className="w-100"
                    id="username"
                    value={username}
                    onKeyDown={(event) => {
                      console.log(event);
                      if (event.key.toLowerCase() === "enter") {
                        console.log(passRef.element);
                        moveToNext(passRef)
                      }
                    }}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="username">Username</label>
                </span>
              </div>
              <div className="col-12 mb-2 mt-3">
                <span className="p-float-label w-100">
                  <Password
                    className="w-100"
                    id="password"
                    ref={passRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    toggleMask
                    feedback={false}
                    onKeyDown={(event) => {
                      console.log(event);
                      if (event.key.toLowerCase() === "enter") {
                        handleSubmit();
                      }
                    }}
                  />
                  <label htmlFor="password">Password</label>
                </span>
              </div>
              <div className="col-12 mb-2">
                <Checkbox
                  className="mb-2"
                  inputId="binary"
                  checked={remember}
                  onChange={(e) => setRemember(e.checked)}
                />
                <label className="ml-3" htmlFor="binary">
                  {"Ingat Saya"}
                </label>
              </div>
              <div className="col-12 mb-2 mt-5">
                <div className="text-center">
                  <Button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={() => handleSubmit()}
                    style={{ height: "56px" }}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-100 vh-100 login-right col-lg-8 col-md-6"></div>
      </Row>
    </>
  );
};

export default Login;
