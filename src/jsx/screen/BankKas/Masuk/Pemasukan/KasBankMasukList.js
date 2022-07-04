import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_EXP, SET_EDIT_EXP, SET_EXP } from "src/redux/actions";
import { Skeleton } from "primereact/skeleton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  data: [
    {
      //   id: 1,
      date: "2022-06-28",
      ref: "KH-00001",
      sup: "(CS01)	Customer 01",
      type: "pemasukan"
    },
    {
      //   id: 1,
      date: "2022-06-29",
      ref: "KH-00002",
      sup: "(CS01)	Customer 01",
      type: "pemasukan"
    },
    {
      //   id: 1,
      date: "2022-06-30",
      ref: "KH-00003",
      sup: "(CS01)	Customer 01",
      type: "pemasukan"
    },
  ],
};

const KasBankInList = ({ onAdd }) => {
  const [masuk, setMasuk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    console.log(data);
    setMasuk(data.data);
  }, []);

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
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
          }}
        />
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

  const statusBodyTemplate = (rowData) => {
    return rowData.type === "pemasukan" ? (
      <Badge variant="success light">
        <i className="fa fa-circle text-success mr-1"></i>
        Pemasukan
      </Badge>
    ) : rowData.type === "unqualified" ? (
      <Badge variant="danger light">
        <i className="fa fa-circle text-danger mr-1"></i>
        Unqualified
      </Badge>
    ) : rowData.type === "proposal" ? (
      <Badge variant="warning light">
        <i className="fa fa-circle text-warning mr-1"></i>
        Proposal
      </Badge>
    ) : (
        <Badge variant="warning light">
        <i className="fa fa-circle text-warning mr-1"></i>
        {rowData.type}
      </Badge>
    );
  };

  return (
    <>
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={masuk}
            className="display w-150 datatable-wrapper"
            showGridlines
            dataKey="id"
            rowHover
            header={renderHeader}
            filters={null}
            globalFilterFields={["ref"]}
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
              field="date"
              // body={loading && <Skeleton />}
            />
            <Column
              header="Nomor Referensi"
              field="ref"
              style={{ minWidth: "8rem" }}
              //  body={loading && <Skeleton />}
            />
            <Column
              header="Pelanggan"
              field="sup"
              style={{ minWidth: "8rem" }}
              //  body={loading && <Skeleton />}
            />
            <Column
              header="Type"
              field="type"
              style={{ minWidth: "8rem" }}
               body={statusBodyTemplate}
            />
          </DataTable>
        </Col>
      </Row>
    </>
  );
};

export default KasBankInList;
