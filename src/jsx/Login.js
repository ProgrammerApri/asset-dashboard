// import React, { useState } from "react";
// import { endpoints, request } from "./Utils";
// import { useHistory } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { SET_USER } from "../../../redux/actions";
// import axios from "axios";

// const Login = () => {
//    const [loginData, setLoginData] = useState({});
//    const handleBlur = (e) => {
//       // const newLoginData = { ...loginData };
//    };
//    const handleChange = (e) => {
//        this.useState({ name: e.target.value });
//    }

//    const handleSubmit = (e) => {
//        e.preventDefault();

//        const user = {
//            name: this.state.name
//        };
//    };

//    axios.post()
   
  
// //   const history = useHistory();
// //   const dispatch = useDispatch();
// //   const [password, setPassword] = useState("");
// //   const [username, setUsername] = useState("");
// //   const [isSubmitted, setIsSubmitted] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);

// //    const handleSubmit = async () => {
// //       setIsSubmitted(true);
// //       if (username && password) {
// //         setIsLoading(true);
// //         const config = {
// //           ...endpoints.login,
// //           data: { username, password },
// //         };
// //         let response = null;
// //         try {
// //           response = await request(null, config);
// //           if (response.status) {
// //             const { token, myprofile } = response;
// //             localStorage.setItem("token", token);
// //             localStorage.setItem("profile", JSON.stringify(myprofile));
// //             if (myprofile.type !== 4) {
// //               dispatch({
// //                 type: SET_USER,
// //                 payload: {
// //                   token,
// //                   myprofile,
// //                 },
// //               });
// //               setIsLoading(false);
// //               setIsSubmitted(false);
// //               history.push("/Dashboard");
// //             } else {
// //               const user = await request(null, {
// //                 ...endpoints.getUsers,
// //                 endpoint: endpoints.getUsers.endpoint + `/${myprofile.id}`,
// //               });
// //               const userData = {
// //                 ...myprofile,
// //                 data: user.data,
// //               };
// //               localStorage.setItem("token", token);
// //               localStorage.setItem("myprofile", JSON.stringify(userData));
// //               dispatch({
// //                 type: SET_USER,
// //                 payload: {
// //                   token,
// //                   myprofile: userData,
// //                 },
// //               });
// //               setIsLoading(false);
// //               setIsSubmitted(false);
// //               history.push("/Dashboard");
// //             }
// //           }
// //         } catch (error) {
// //           setIsLoading(false);
// //           if (error.status === 409 || error.status === 401) {
// //             alert(error.error.response.data.messages);
// //           } else {
// //             alert("Gangguan Server");
// //           }
// //         }
// //       } else {
// //         setIsSubmitted(true);
// //       }
// //     };

//    return (
//       <div className="authincation">
//          <div className="container p-0">
//             <div className="row justify-content-center align-items-center authincation-page-area">
//                <div className="col-lg-6 col-md-9">
//                   <div className="authincation-content">
//                      <div className="row no-gutters">
//                         <div className="col-xl-12">
//                            <div className="auth-form">
//                               <h4 className="text-center mb-4">
//                                  Sign in your account
//                               </h4>
//                               <form
//                                  action=""
//                                  onSubmit={(e) =>
//                                     e.preventDefault(handleSubmit)
//                                  }
//                               >
//                                  <div className="form-group">
//                                     <label className="mb-1">
//                                        <strong>Username</strong>
//                                     </label>
//                                     <input
//                                        type="text"
//                                        className="form-control"
//                                        name="username"
//                                        onChange={handleBlur}
//                                     />
//                                  </div>
//                                  <div className="form-group">
//                                     <label className="mb-1">
//                                        <strong>Password</strong>
//                                     </label>
//                                     <input
//                                        type="password"
//                                        className="form-control"
//                                        defaultValue="Password"
//                                        name="password"
//                                        onChange={handleBlur}
//                                     />
//                                  </div>
//                                  <div className="form-row d-flex justify-content-between mt-4 mb-2">
//                                     <div className="form-group">
//                                        <div className="custom-control custom-checkbox ml-1">
//                                           <input
//                                              type="checkbox"
//                                              className="custom-control-input"
//                                              id="basic_checkbox_1"
//                                           />
//                                           <label
//                                              className="custom-control-label"
//                                              htmlFor="basic_checkbox_1"
//                                           >
//                                              Remember my preference
//                                           </label>
//                                        </div>
//                                     </div>
//                                     {/* <div className="form-group">
//                                        <Link to="/page-forgot-password">
//                                           Forgot Password?
//                                        </Link>
//                                     </div> */}
//                                  </div>
//                                  <div className="text-center">
//                                     <button
//                                        type="submit"
//                                        className="btn btn-primary btn-block"
//                                        onClick={() => handleSubmit}
//                                     >
//                                        Sign Me In
//                                     </button>
//                                  </div>
//                               </form>
//                               {/* <div className="new-account mt-3">
//                                  <p>
//                                     Don't have an account?{" "}
//                                     <Link
//                                        className="text-primary"
//                                        to="/page-register"
//                                     >
//                                        Sign up
//                                     </Link>
//                                  </p>
//                               </div> */}
//                            </div>
//                         </div>
//                      </div>
//                   </div>
//                </div>
//             </div>
//          </div>
//       </div>
//    );
// };

// export default Login;