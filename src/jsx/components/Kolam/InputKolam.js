import React, { Fragment } from "react";

import Multistep from "react-multistep";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

const InputKolam = () => {
   const steps = [
      { name: "Informasi Lokasi", component: <StepOne /> },
      { name: "Informasi Ukuran", component: <StepTwo /> },
      { name: "Informasi Pengelola", component: <StepThree /> },
   ];
   const prevStyle = {
      background: "#0000FF",
      borderWidth: "0px",
      color: "#fff",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "600",
      padding: "0.55em 2em",
      marginRight: "1rem",
   };
   const nextStyle = {
      background: "#52B141",
      borderWidth: "0px",
      color: "#fff",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "600",
      padding: "0.55em 2em",
   };
   return (
      <Fragment>
         <div className="row">
            <div className="col-xl-12 col-xxl-12">
               <div className="card">
                  <div className="card-header">
                     <h4 className="card-title">Tambah Kolam</h4>
                  </div>
                  <div className="card-body">
                     <form
                        onSubmit={(e) => e.preventDefault()}
                        id="step-form-horizontal"
                        className="step-form-horizontal"
                     >
                        <Multistep
                           showNavigation={true}
                           steps={steps}
                           prevStyle={prevStyle}
                           nextStyle={nextStyle}
                        />
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </Fragment>
   );
};

export default InputKolam;
