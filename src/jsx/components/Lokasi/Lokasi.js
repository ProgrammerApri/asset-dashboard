import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import DaftarLokasi from "./DaftarLokasi";

const Lokasi = () => {
   return (
      <Fragment>
         <div className="row">
            <DaftarLokasi></DaftarLokasi>
         </div>
      </Fragment>
   );
};

export default Lokasi;
