import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "../../CustomeWrapper/CustomeWrapper";
import { Divider } from "@material-ui/core";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";

const data = {
  id: 0,
  ord_code: null,
  ord_date: null,
  faktur: null,
  po_id: null,
  dep_id: null,
  sup_id: null,
  top: null,
  due_date: null,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  dprod: [],
  djasa: [],
};

const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportGRA = () => {
  const [reportGra, setReportGra] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    initFilters1();
    getOrd();
  }, []);

  const getOrd = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.order,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let gra = [];
        data.forEach((element) => {
          element.dprod.forEach((el) => {
            gra.push({
              kd_gra: element.ord_code,
              tgl_gra: element.ord_date,
              no_po: element.po_id.po_code,
              kd_sup: element.sup_id.sup_code,
              nm_sup: element.sup_id.sup_name,
              prod_kd: el.prod_id.code,
              prod_nm: el.prod_id.name,
              sat: el.unit_id.code,
              ord: el.order,
              prc: el.price,
              total: el.total,
            });
          });
        });
        setReportGra(gra);
        // setSupplier(sup);
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

  const exportExcel = () => {
    let data = [];
    reportGra.forEach((el) => {
      data.push({
        Nomor_GRA: el.ord_code,
        Tanggal: formatDate(el.ord_date),
        Nomor_PO: el.po_id.po_code,
        Kode_Supplier: el.sup_id.sup_code,
        Nama_Supplier: el.sup_id.sup_name,
        Kode_Barang: el.dprod.prod_id,
        Nama_Barang: el.dprod.prod_id,
        Satuan: el.dprod.unit_id,
        Jumlah: el.dprod.order,
        Harga: el.dprod.price,
      });
    });

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "reportGRA");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-3 ml-0 mr-0 pl-0">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-calendar" />
            </span>
            <Calendar
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              selectionMode="range"
              placeholder="Pilih Tanggal"
              dateFormat="yy-mm-dd"
            />
          </div>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`report_export_${new Date().getTime()}`}
              element={
                <Button
                  variant="primary"
                  onClick={() => {
                    exportExcel();
                  }}
                >
                  EXCEL
                  <span className="btn-icon-right">
                    <i class="bx bx-table"></i>
                  </span>
                </Button>
              }
            >
              {/* <ExcelSheet
                dataSet={reportGra ? exportExcel(reportGra) : null}
                name="Report"
              /> */}
            </ExcelFile>
          </div>
          <ReactToPrint
            trigger={() => {
              return (
                <Button variant="primary" onClick={() => {}}>
                  PDF{" "}
                  <span className="btn-icon-right">
                    <i class="bx bxs-file-pdf"></i>
                  </span>
                </Button>
              );
            }}
            content={() => printPage.current}
          />
        </Row>
      </div>
    );
  };

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <>
      {/* <Toast ref={toast} /> */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : reportGra}
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["tgl_gra"]}
                showGridlines
                dataKey="id"
                rowHover
                emptyMessage="Data Tidak Ditemukan"
              >
                <Column
                  className="header-center body-center"
                  header="Kode Pembelian"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.kd_gra}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Tanggal"
                  style={{ minWidht: "10rem" }}
                  field={(e) => formatDate(e.tgl_gra)}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Nomor PO"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.no_po}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Kode Supplier"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.kd_sup}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Nama Supplier"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.nm_sup}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Kode Barang"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.prod_kd}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Nama Barang"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.prod_nm}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Satuan"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.sat}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Jumlah"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.ord}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Harga"
                  style={{ minWidht: "10rem" }}
                  field={(e) => formatIdr(e.prc)}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Total"
                  style={{ minWidht: "10rem" }}
                  field={(e) => formatIdr(e.total)}
                  body={loading && <Skeleton />}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="d-none">
        <Col>
          <Card ref={printPage}>
            <Card.Body>
              <CustomeWrapper
                tittle={"Laporan Pembelian"}
                subTittle={"Laporan Pembelian Periode yyyy-mm-dd - yyyy-mm-dd"}
                body={
                  <DataTable
                    responsiveLayout="scroll"
                    value={loading ? dummy : reportGra}
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage="Data Tidak Ditemukan"
                  >
                    <Column
                      className="header-center body-center"
                      header="Kode Pembelian"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.kd_gra}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Tanggal"
                      style={{ minWidht: "10rem" }}
                      field={(e) => formatDate(e.tgl_gra)}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Nomor PO"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.no_po}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Kode Supplier"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.kd_sup}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Nama Supplier"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.nm_sup}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Kode Barang"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.prod_kd}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Nama Barang"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.prod_nm}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Satuan"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.sat}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Jumlah"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e.ord}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Harga"
                      style={{ minWidht: "10rem" }}
                      field={(e) => formatIdr(e.prc)}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      className="header-center body-center"
                      header="Total"
                      style={{ minWidht: "10rem" }}
                      field={(e) => formatIdr(e.total)}
                      body={loading && <Skeleton />}
                    />
                  </DataTable>
                }
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportGRA;
