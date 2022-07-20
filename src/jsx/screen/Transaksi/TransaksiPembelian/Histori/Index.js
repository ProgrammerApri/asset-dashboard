import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Row, Col, Card } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

const data = {
  id: null,
  order: null,
  supplier: null,
  product: null,
  price: null,
};

const Histori = ({
  data,
  popUp = false,
  show = false,
  onHide = () => {},
  onRowSelect,
}) => {
  const [histori, setHistori] = useState(null);
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    initFilters1();
    // getHistori();
    getPO();
  }, []);

  const getHistori = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.price_history,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log("cekk");
        console.log(data);
        setHistori(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const getPO = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.po,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setPo(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Cari disini"
          />
        </span>
      </div>
    );
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const checkpo = (value) => {
    let selected = {};
    po?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const renderBody = () => {
    return (
      <>
        <Row>
          <Col>
            <DataTable
              responsiveLayout="scroll"
              value={loading ? dummy : data}
              className="display w-150 datatable-wrapper"
              showGridlines
              dataKey="id"
              rowHover
              header={renderHeader}
              filters={filters1}
              globalFilterFields={["code", "name", "address", "desc"]}
              emptyMessage="Tidak ada data"
              paginator
              paginatorTemplate={template2}
              first={first2}
              rows={rows2}
              onPage={onCustomPage2}
              paginatorClassName="justify-content-end mt-3"
              selectionMode="single"
              onRowSelect={onRowSelect}
            >
              <Column
                header="Tanggal"
                style={{
                  minWidth: "8rem",
                }}
                field={(e) => formatDate(e.order?.ord_date)}
                body={loading && <Skeleton />}
              />
              <Column
                header="Produk"
                field={(e) => e.product?.name}
                style={{ minWidth: "8rem" }}
                body={loading && <Skeleton />}
              />
              <Column
                header="Supplier"
                field={(e) => e.supplier?.sup_name}
                style={{ minWidth: "8rem" }}
                body={loading && <Skeleton />}
              />
              <Column
                header="Harga"
                field={(e) => formatIdr(e?.price)}
                style={{ minWidth: "8rem" }}
                body={loading && <Skeleton />}
              />
              {/* <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
                /> */}
            </DataTable>
          </Col>
        </Row>
      </>
    );
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Histori Harga"}
          visible={show}
          footer={() => <div></div>}
          style={{ width: "60vw" }}
          onHide={onHide}
        >
          <Row className="ml-0 mr-0">
            <Col>{renderBody()}</Col>
          </Row>
        </Dialog>
      </>
    );
  } else {
    return <>{renderBody()}</>;
  }
};

export default Histori;
