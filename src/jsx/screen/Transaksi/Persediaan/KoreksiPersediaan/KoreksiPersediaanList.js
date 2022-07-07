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
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_IC, SET_EDIT_IC } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
// import data from "src/jsx/data";

const data = {
  data: [
    {
      //   id: 1,
      date: "2022-06-28",
      ref: "KP-00001",
      acc: "Inventory (1.50001)",
      dep: "Human Resourced (HRD)",
      proj: "Projek Juni (PRY-0001)",
    },
    {
      //   id: 1,
      date: "2022-06-29",
      ref: "KP-00002",
      acc: "Inventory (1.50001)",
      dep: "Human Resourced (HRD)",
      proj: "Projek Juni (PRY-0001)",
    },
    {
      //   id: 1,
      date: "2022-06-30",
      ref: "KP-00003",
      acc: "Inventory (1.50001)",
      dep: "Human Resourced (HRD)",
      proj: "Projek Juni (PRY-0001)",
    },
  ],
};

const KoreksiPersediaanList = ({ onAdd }) => {
  const dispatch = useDispatch();
  const [koreksi, setKoreksi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const toast = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    console.log(data);
    setKoreksi(data.data);
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
            dispatch({
              type: SET_EDIT_IC,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_IC,
              payload: {
                ...data,
                product: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    type: null,
                    location: null,
                    order: null,
                  },
                ],
              },
            });
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
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={koreksi}
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
              header="Nomor Koreksi Persediaan"
              field="ref"
              style={{ minWidth: "8rem" }}
              //  body={loading && <Skeleton />}
            />
            <Column
              header="Kode Akun"
              field="acc"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header="Departemen"
              field="dep"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header="Project"
              field="proj"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
            {/* <Column
              header="Action"
              dataType="boolean"
              bodyClassName="text-center"
              style={{ minWidth: "2rem" }}
              // body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
            /> */}
          </DataTable>
        </Col>
      </Row>
    </>
  );
};

export default KoreksiPersediaanList;
