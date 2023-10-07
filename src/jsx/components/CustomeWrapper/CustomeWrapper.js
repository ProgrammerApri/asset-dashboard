import { Divider } from "@material-ui/core";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_COMPANY } from "src/redux/actions";
import { endpoints, request } from "src/utils";

const CustomeWrapper = ({
  body,
  subTittle,
  tittle,
  page,
  horizontal = false,
  viewOnly = false,
  onComplete = () => {},
}) => {
  const [comp, setComp] = useState(null);
  const company = useSelector((state) => state.cp.company);

  useEffect(() => {
    onComplete(company?.cp_name);
  }, []);

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
      {horizontal && (
        <style type="text/css" media="print">
          {" @page { size: 48.3cm 32.9cm; } "}
        </style>
      )}
      <div
        className={`page ${horizontal ? "horizontal a3" : ""} ${
          viewOnly ? "view" : ""
        }`}
      >
        <div className="subpage">
          <h3 className="center">
            <b>
              {tittle} <br /> {company?.cp_name}
            </b>
          </h3>
          <h5 className="mt-2">{subTittle}</h5>
          <div className="mt-5">{body}</div>
        </div>
        <Divider className="ml-3 mr-3"></Divider>
        <div className="row m-0">
          <span className="fs-12 col-6">
            Page : <b>{page ? page : 1}</b>
          </span>
          <span className="fs-12 col-6 text-right">
            <i>Print Date: {formatDate("")}</i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomeWrapper;
