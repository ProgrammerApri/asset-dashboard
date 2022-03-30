import axios from "axios";
// import { ApiConfig, shouldLogApi } from "src/data/config";


export default function request(param, config, header = {} ) {
    const { endpoint, method, data } = config;

    const url = `${config.baseUrl}${endpoint}`;
    const params = {
      ...param,
      ...data,
    };
  
    let token = localStorage.getItem("token");
  
    const headers = {
      ...header,
      Authorization: `Bearer ${token}`,
    };
  
    const axiosConfig = {
      method,
      url,
      headers,
    };
  
    if (method.toUpperCase() === "GET") {
      axiosConfig.params = params;
    } else {
      axiosConfig.data = params;
    }
  
    // if (shouldLogApi) {
    //   console.log(
    //     "[request start]\n\n-url: ",
    //     url,
    //     "\n\n-method: ",
    //     method,
    //     "\n\n-params: ",
    //     params,
    //     "\n\n-config: ",
    //     axiosConfig
    //   );
    // }
  
    // return new Promise((resolve, reject) => {
    //   axios(axiosConfig)
    //     .then((response) => {
    //       if (shouldLogApi) {
    //         console.log(
    //           "[response received]\n\n-url: ",
    //           url,
    //           "\n\n-method: ",
    //           method,
    //           "\n\n-params: ",
    //           params,
    //           "\n\n-response: ",
    //           response
    //         );
    //       }
  
    //       const body = response.data;
    //       resolve(body);
    //     })
    //     .catch((err) => {
    //       if (shouldLogApi) {
    //         console.log(
    //           "[response error]\n\n-url: ",
    //           url,
    //           "\n\n-method: ",
    //           method,
    //           "\n\n-params: ",
    //           params,
    //           "\n\n-response: ",
    //           err
    //         );
    //       }
    //       if (err?.response?.status === 403) {
    //         if (err?.response?.data?.code === "other_user_login") {
    //           alert(err.response.data.message);
    //           localStorage.removeItem("token");
    //           window.location.reload();
    //           return;
    //         }
    //       }

  
    //       reject({
    //         status:
    //           err.response && err.response.status ? err.response.status : 999,
    //         code: "x999",
    //         message: err.message,
    //         error: err,
    //       });
    //     });
    // });
  }
  