import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import SimpleReactLightbox from "simple-react-lightbox";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
   <Provider store={store}>
      <React.StrictMode>
      <SimpleReactLightbox>
         <App />
      </SimpleReactLightbox>
   </React.StrictMode>
   </Provider>,
   document.getElementById("root")
);