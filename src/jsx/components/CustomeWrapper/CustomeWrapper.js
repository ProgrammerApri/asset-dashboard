import { Divider } from "@material-ui/core";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const CustomeWrapper = ({body, tittle, page}) => {
  return (
    <div className="book">
      <div className="page">
        <div className="subpage">
          <h3 className="center">
          <b>Laporan</b>
        </h3>
        <h5 className="mt-2">Transaksi Pembelian</h5>
        <div className="mt-5">
        {body}
        </div>
        </div>
        <Divider></Divider>
      <div className="ml-2">
      <span className="fs-12">Halaman : 1</span>
      </div>
      </div>
    </div>
  );
};

export default CustomeWrapper;
