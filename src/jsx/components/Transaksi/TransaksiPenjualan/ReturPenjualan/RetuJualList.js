import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SR, SET_EDIT_SR } from "src/redux/actions";

const data = {
  id: null,
  do_code: null,
  do_date: null,
  dep_id: null,
  sup_id: null,
  top: null,
  due_date: false,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  dprod: [],
  djasa: [],
};

const ReturJualList = ({ onAdd }) => {
  const [loading, setLoading] = useState(true);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const sr = useSelector((state) => state.sr.sr);

  const dummy = Array.from({ length: 10 });

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            // value={globalFilterValue1}
            // onChange={onGlobalFilterChange1}
            placeholder="Cari disini"
          />
        </span>
        <Button
          variant="primary"
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_SR,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_SR,
              payload: {
                ...data,
                dprod: [
                  {
                    id: 0,
                    do_id: null,
                    prod_id: null,
                    unit_id: null,
                    retur: null,
                    price: null,
                    disc: null,
                    nett_price: null,
                    total: null,
                  },
                ],
              },
            });
          }}
        >
          Tambah{" "}
          <span className="btn-icon-right">
            <i class="bx bx-plus"></i>
          </span>
        </Button>
      </div>
    );
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: "Semua", value: options.totalRecords },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Data per halaman:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} dari {options.totalRecords}
        </span>
      );
    },
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  return (
    <>
      <DataTable
        responsiveLayout="scroll"
        // value={loading ? dummy : sr}
        className="display w-150 datatable-wrapper"
        showGridlines
        dataKey="id"
        rowHover
        header={renderHeader}
        filters={null}
        globalFilterFields={["customer.cus_code"]}
        emptyMessage="Tidak ada data"
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        paginatorClassName="justify-content-end mt-3"
      >
        <Column
          header="Tanggal"
          style={{
            minWidth: "8rem",
          }}
          // field={(e) => e.customer.cus_code}
          // body={loading && <Skeleton />}
        />
        <Column
          header="Nomor Retur Penjualan"
          // field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
          //  body={loading && <Skeleton />}
        />
        <Column
          header="Nomor Faktur"
          // field={(e) => e.customer.cus_address}
          style={{ minWidth: "8rem" }}
          // body={loading && <Skeleton />}
        />
        <Column
          header="Nama Pelanggan"
          // field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
          // body={loading && <Skeleton />}
        />
      </DataTable>
    </>
  );
};

export default ReturJualList;
