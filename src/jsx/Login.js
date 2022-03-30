import React, { useState } from "react";
import { request, endpoints } from "src/utils";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

   const handleSubmit = async () => {
      if (username && password) {
        const config = {
          ...endpoints.login,
          data: { username, password },
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

   return (
      <div className="authincation">
         <div className="container p-0">
            <div className="row justify-content-center align-items-center authincation-page-area">
               <div className="col-lg-6 col-md-9">
                  <div className="authincation-content">
                     <div className="row no-gutters">
                        <div className="col-xl-12">
                           <div className="auth-form">
                              <h4 className="text-center mb-4">
                                 Sign in your account
                              </h4>
                              <form
                              action=""
                              onSubmit={(e) =>
                                 e.preventDefault()
                              }
                              >
                                 <div className="form-group">
                                    <label className="mb-1">
                                       <strong>Username</strong>
                                    </label>
                                    <input
                                       type="text"
                                       className="form-control"
                                       name="username"
                                       value={username}
                                       onChange={(e) => setUsername(e.target.value)}
                                    />
                                 </div>
                                 <div className="form-group">
                                    <label className="mb-1">
                                       <strong>Password</strong>
                                    </label>
                                    <input
                                       type="password"
                                       className="form-control"
                                       name="password"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                    />
                                 </div>
                                 <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                    <div className="form-group">
                                       <div className="custom-control custom-checkbox ml-1">
                                          <input
                                             type="checkbox"
                                             className="custom-control-input"
                                             id="basic_checkbox_1"
                                          />
                                          <label
                                             className="custom-control-label"
                                             htmlFor="basic_checkbox_1"
                                          >
                                             Remember me
                                          </label>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="text-center">
                                    <button
                                       type="submit"
                                       className="btn btn-primary btn-block"
                                       onClick={() => handleSubmit()}
                                    >
                                       Sign Me In
                                    </button>
                                 </div>
                              </form>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;