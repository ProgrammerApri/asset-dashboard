import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import data from "../../../constants/data";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Margin } from "@syncfusion/ej2-react-charts";

const KlasifikasiAkun = () => {
   const [klasifikasi, setKlasifikasi] = useState(null);
   const [filter, setFilter] = useState(null);
   const [load, setLoad] = useState(false);
   const [globalFilterValue1, setGlobalFilterValue1] = useState("");
   

   useEffect(() => {
    console.log(data.data);
    setKlasifikasi(getKlasifikasi(data.data));
    initFilters1();
  }, []);

  const getKlasifikasi = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

   const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={clearFilter1}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const clearFilter1 = () => {
    initFilters1();
  };

  const initFilters1 = () => {
    setFilter({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "unit": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue1("");
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filter };
    _filters1["global"].value = value;

    setFilter(_filters1);
    setGlobalFilterValue1(value);
  };


   const namaBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="image-text">{rowData.nama}</span>
      </React.Fragment>
    );
  };

  const actionBodyTemplate = () => {
    return (
      <div className="d-flex">
        <Link to="#" className="btn btn-primary shadow btn-xs sharp mr-1">
          <i className="fa fa-pencil"></i>
        </Link>
      </div>
    );
  };

  const header1 = renderHeader1();
    return (
        <>
          <Row>
            <Col>
            <Card>
            <Card.Header>
              <Card.Title>Klasifikasi Akun</Card.Title>
            </Card.Header>
            <Card.Body>
              <DataTable
                value={klasifikasi}
                paginator
                className="p-datatable-customers"
                showGridlines
                rows={10}
                dataKey="kode"
                filters={filter}
                filterDisplay="menu"
                loading={load}
                responsiveLayout="scroll"
                globalFilterFields={[
                  "kode",
                  "nama",
                ]}
                header={header1}
                emptyMessage="Kode no found."
              >
                <Column
                  field="kode"
                  header="Kode"
                  filter
                  filterPlaceholder="Search by id"
                  style={{ minWidth: "12rem" }}
                />
                <Column
                  header="Nama Klasifikasi Akun"
                  filterField="nama"
                  style={{ minWidth: "12rem" }}
                  body={namaBodyTemplate}
                  filter
                  filterPlaceholder="Search by Nama"
                />
                <Column
                header="Action"
                dataType="boolean"
                bodyClassName="text-center"
                style={{ minWidth: "4rem" }}
                body={actionBodyTemplate}
              />
              </DataTable>
            </Card.Body>
          </Card>
            </Col>
          </Row>
        </>
      );
};

export default KlasifikasiAkun;