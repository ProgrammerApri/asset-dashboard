import { Divider } from "@material-ui/core";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const CustomeWrapper = () => {
  return (
    <div className="book">
      <div className="page">
        <div className="subpage">
          <h3 className="center">
          <b>Laporan</b>
        </h3>
        <h5 className="mt-2">Transaksi Pembelian</h5>
        <div className="mt-5">
        <DataTable
          responsiveLayout="scroll"
          value={null}
          showGridlines
          dataKey="id"
          rowHover
          emptyMessage="Data Tidak Ditemukan"
        >
          <Column
            className="center-header"
            header="Referensi"
            style={{ minWidht: "10rem" }}
            field={() => null}
            body={() => null}
          />
          <Column
            className="header-center"
            header="Tanggal"
            style={{ minWidht: "10rem" }}
            field={() => null}
            body={() => null}
          />
          <Column
            className="header-center"
            header="Departemen"
            style={{ minWidht: "10rem" }}
            field={() => null}
            body={() => null}
          />
          <Column
            className="header-center"
            header="Nomor"
            style={{ minWidht: "10rem" }}
            field={() => null}
            body={() => null}
          />
        </DataTable>
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
