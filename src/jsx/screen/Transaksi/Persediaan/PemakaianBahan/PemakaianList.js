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
import { SET_CURRENT_PB, SET_EDIT_PB, SET_PB } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  data: [
    {
      //   id: 1,
      date: "2022-06-26",
      ref: "PB-00001",
      acc: "(1.70001)	Work In Process",
      proj: "Projek Juni (PRY-0001)",
    },
    {
      //   id: 1,
      date: "2022-06-27",
      ref: "PB-00002",
      acc: "(1.70001)	Work In Process",
      proj: "Projek Juni (PRY-0001)",
    },
    {
      //   id: 1,
      date: "2022-06-29",
      ref: "PB-00003",
      acc: "(1.70001)	Work In Process",
      proj: "Projek Juni (PRY-0001)",
    },
  ],
};

const PemakaianList = ({ onAdd }) => {
  const dispatch = useDispatch();
  const [pb, setPb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    console.log(data);
    setPb(data.data);
  }, []);

  const getCoderp = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getcode_pbb,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const kode = response.data;
        console.log("pbbbbb",kode);
        onAdd();
        dispatch({
          type: SET_CURRENT_PB,
          payload: {
            ...data,
            pb_code: kode,
            product: [
              {
                id: 0,
                prod_id: null,
                unit_id: null,
                end: null,
                location: null,
                order: null,
              },
            ],
          },
        });
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            getCoderp();
            dispatch({
              type: SET_EDIT_PB,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_PB,
              payload: {
                ...data,
                product: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    end: null,
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
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={pb}
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
              header="Kode Pemakaian"
              field="ref"
              style={{ minWidth: "8rem" }}
              //  body={loading && <Skeleton />}
            />
            <Column
              header="Akun WIP"
              field="acc"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header="Project"
              field="proj"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            />
          </DataTable>
        </Col>
      </Row>
    </>
  );
};

export default PemakaianList;
