import { Divider } from "@material-ui/core";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { endpoints, request } from "src/utils";

const CustomeWrapper = ({ body, subTittle, tittle, page }) => {
  const [comp, setComp] = useState(null);

  useEffect(() => {
    getComp();
  }, []);

  const getComp = async () => {
    const config = {
      ...endpoints.getCompany,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setComp(data);
      }
    } catch (error) {}
  };

  const formatDate = (date) => {
    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    today = dd + "/" + mm + "/" + yyyy;
    return today;
  };

  return (
    <div className="book">
      <div className="page">
        <div className="subpage">
          <h3 className="center">
            <b>{tittle} <br/> {comp?.cp_name}</b>
          </h3>
          <h5 className="mt-2">{subTittle}</h5>
          <div className="mt-5">{body}</div>
        </div>
        <Divider className="ml-3 mr-3"></Divider>
        <div className="row m-0">
          <span className="fs-12 col-6">Halaman : <b>{page ? page : 1}</b></span>
          <span className="fs-12 col-6 text-right">
            <i>Tanggal Cetak: {formatDate("")}</i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomeWrapper;
