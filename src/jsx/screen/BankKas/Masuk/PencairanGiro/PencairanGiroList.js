import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_GIRO, SET_GIRO } from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  data: [
    {
      //   id: 1,
      date: "2022-06-21",
      no: "GR-00002",
      bank: "(MAN)	Bank Mandiri",
      code: "PEM-0001",
      tgl: "2022-06-30",
      pel: "(CS01)	Customer 01",
      val: "Rp. 2.500.000",
    },
    {
      //   id: 1,
      date: "2022-06-23",
      no: "GR-00003",
      bank: "(NIA01)	Bank Niaga - IDR",
      code: "PEM-0002",
      tgl: "2022-06-30",
      pel: "(CS01)	Customer 01",
      val: "Rp. 10.000.000",
    },
    {
      //   id: 1,
      date: "2022-06-25",
      no: "GR-00001",
      bank: "(MAN)	Bank Mandiri",
      code: "PEM-0003",
      tgl: "2022-06-30",
      pel: "(CS02)	Customer 02",
      val: "Rp. 20.000.000",
    },
  ],
};

const PencairanGiroInList = ({ onAdd }) => {
  const [GRmasuk, setGR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    console.log(data);
    setGR(data.data);
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

  return (
    <>
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={GRmasuk}
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
              header="Nomor Giro"
              field="no"
              style={{ minWidth: "8rem" }}
              //  body={loading && <Skeleton />}
            />
            <Column
              header="Bank"
              field="bank"
              style={{ minWidth: "8rem" }}
              //  body={loading && <Skeleton />}
            />
            <Column
              header="Kode Pembayaran"
              field="code"
              style={{ minWidth: "8rem" }}
              //  body={statusBodyTemplate}
            />
            <Column
              header="Tanggal Pembayaran"
              field="tgl"
              style={{ minWidth: "8rem" }}
              //  body={statusBodyTemplate}
            />
            <Column
              header="Pelanggan"
              field="pel"
              style={{ minWidth: "8rem" }}
              //  body={statusBodyTemplate}
            />
            <Column
              header="Nilai"
              field="val"
              style={{ minWidth: "8rem" }}
              //  body={statusBodyTemplate}
            />
          </DataTable>
        </Col>
      </Row>
    </>
  );
};

export default PencairanGiroInList;
