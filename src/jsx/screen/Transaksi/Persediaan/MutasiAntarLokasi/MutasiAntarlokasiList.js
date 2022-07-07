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
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { useDispatch } from "react-redux";
import { SET_CURRENT_LM, SET_EDIT_LM } from "src/redux/actions";

const data = {
  data: [
    {
      //   id: 1,
      date: "2022-06-26",
      ref: "MT-00001",
      asal: "(JKT01)	Jakarta 01",
      tjn: "(SMG01)	Semarang 01",
      ket: "-"
    },
    {
      //   id: 1,
      date: "2022-06-29",
      ref: "MT-00002",
      asal: "(SMG01)	Semarang 01",
      tjn: "(SMG02)	Semarang 02",
      ket: "-"
    },
    {
      //   id: 1,
      date: "2022-06-30",
      ref: "MT-00003",
      asal: "(JKT02)	Jakarta 02",
      tjn: "(SMG01)	Semarang 01",
      ket: "-"
    },
  ],
};

const MutasiAntarList = ({ onAdd }) => {
  const [mutasi, setMutasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const toast = useRef(null);

  useEffect(() => {
    console.log(data);
    setMutasi(data.data);
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
              type: SET_EDIT_LM,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_LM,
              payload: {
                ...data,
                product: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
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
            value={mutasi}
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
              header="Nomor Mutasi Persediaan"
              field="ref"
              style={{ minWidth: "8rem" }}
              //  body={loading && <Skeleton />}
            />
            <Column
              header="Mutasi Asal"
              field="asal"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header="Mutasi Tujuan"
              field="tjn"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header="Keterangan"
              field="ket"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
          </DataTable>
        </Col>
      </Row>
    </>
  );
};

export default MutasiAntarList;
