import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "../../CustomeWrapper/CustomeWrapper";
import { Dropdown } from "primereact/dropdown";

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
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportGRA = () => {
  const [gra, setGra] = useState(null);
  const [produk, setProduk] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
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
        setGra(gra);
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

  const getProduk = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setProduk(data);
      }
    } catch (error) {}
  };

  const exportExcel = () => {
    let data = [];
    gra.forEach((el) => {
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

  const jsonForExcel = (gra) => {
    let data = [];

    gra?.forEach((el) => {
      let dt = new Date(`${el?.tgl_gra}Z`);
      if (dt >= filtersDate[0] && dt <= filtersDate[1]) {
        let val = [
          {
            ref: el.kd_gra,
            type: "header",
            value: {
              date: "Tanggal Pembelian",
              po: "Nomor Pesanan",
              sup: "Supplier",
              prod: "Produk",
              ord: "Jumlah",
              unit: "Satuan",
              prc: "Harga Satuan",
              tot: "Total",
            },
          },
        ];
        val.push({
          ref: el.kd_gra,
          type: "item",
          value: {
            date: formatDate(el.tgl_gra),
            po: el.no_po,
            sup: `${el.nm_sup} (${el.kd_sup})`,
            prod: `${el.prod_nm} (${el.prod_kd})`,
            ord: el.ord,
            unit: el.sat,
            prc: `Rp. ${formatIdr(el.prc)}`,
            tot: `Rp. ${formatIdr(el.total)}`,
          },
        });
        val.push({
          ref: el.kd_gra,
          type: "footer",
          value: {
            date: "Total",
            po: "",
            sup: "",
            prod: "",
            ord: "",
            unit: "",
            prc: "",
            tot: `Rp. ${formatIdr(el.total)}`,
          },
        });
        data.push(val);
      }
      // el.gra.forEach((element) => {
      // });
    });

    return data;
  };

  const initFilters1 = () => {
    setFiltersDate({
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
              value={filtersDate}
              onChange={(e) => {
                console.log(e.value);
                setFiltersDate(e.value);
              }}
              selectionMode="range"
              placeholder="Pilih Tanggal"
              dateFormat="dd-mm-yy"
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
                    jsonForExcel();
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
                dataSet={gra ? jsonForExcel(gra) : null}
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

    return [day, month, year].join("-");
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
              {renderHeader()}
              {jsonForExcel(gra, false)?.map((v) => {
                return (
                  <DataTable
                    responsiveLayout="scroll"
                    value={v}
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage="Data Tidak Ditemukan"
                    className="mt-4"
                  >
                    <Column
                      className="header-center"
                      header={(e) =>
                        e.props.value ? e.props?.value[0]?.ref : null
                      }
                      style={{ width: "15rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header" || e.type === "footer"
                              ? "font-weight-bold"
                              : ""
                          }
                        >
                          {e.value.date}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={e.type === "header" && "font-weight-bold"}
                        >
                          {e.value.po}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={e.type === "header" && "font-weight-bold"}
                        >
                          {e.value.sup}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={e.type === "header" && "font-weight-bold"}
                        >
                          {e.value.prod}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={e.type === "header" && "font-weight-bold"}
                        >
                          {e.value.ord}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={e.type === "header" && "font-weight-bold"}
                        >
                          {e.value.unit}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header"
                              ? "font-weight-bold text-right"
                              : e.type === "footer"
                              ? "font-weight-bold text-right"
                              : "text-right"
                          }
                        >
                          {e.value.prc}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header"
                              ? "font-weight-bold text-right"
                              : e.type === "footer"
                              ? "font-weight-bold text-right"
                              : "text-right"
                          }
                        >
                          {e.value.tot}
                        </div>
                      )}
                    />
                  </DataTable>
                );
              })}
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
                subTittle={`Laporan Pembelian Per ${formatDate(filtersDate[0])} - ${formatDate(filtersDate[1])}`}
                body={
                  <>
                    {jsonForExcel(gra, false)?.map((v) => {
                      return (
                        <DataTable
                          responsiveLayout="scroll"
                          value={v}
                          showGridlines
                          dataKey="id"
                          rowHover
                          emptyMessage="Data Tidak Ditemukan"
                          className="mt-4"
                        >
                          <Column
                            className="header-center"
                            header={(e) =>
                              e.props.value ? e.props?.value[0]?.ref : null
                            }
                            style={{ width: "15rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header" || e.type === "footer"
                                    ? "font-weight-bold"
                                    : ""
                                }
                              >
                                {e.value.date}
                              </div>
                            )}
                          />
                          <Column
                            className="header-center"
                            header=""
                            style={{ minWidht: "10rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header" && "font-weight-bold"
                                }
                              >
                                {e.value.po}
                              </div>
                            )}
                          />
                          <Column
                            className="header-center"
                            header=""
                            style={{ minWidht: "10rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header" && "font-weight-bold"
                                }
                              >
                                {e.value.sup}
                              </div>
                            )}
                          />
                          <Column
                            className="header-center"
                            header=""
                            style={{ minWidht: "10rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header" && "font-weight-bold"
                                }
                              >
                                {e.value.prod}
                              </div>
                            )}
                          />
                          <Column
                            className="header-center"
                            header=""
                            style={{ minWidht: "10rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header" && "font-weight-bold"
                                }
                              >
                                {e.value.ord}
                              </div>
                            )}
                          />
                          <Column
                            className="header-center"
                            header=""
                            style={{ minWidht: "10rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header" && "font-weight-bold"
                                }
                              >
                                {e.value.unit}
                              </div>
                            )}
                          />
                          <Column
                            className="header-center"
                            header=""
                            style={{ minWidht: "10rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header"
                                    ? "font-weight-bold text-right"
                                    : e.type === "footer"
                                    ? "font-weight-bold text-right"
                                    : "text-right"
                                }
                              >
                                {e.value.prc}
                              </div>
                            )}
                          />
                          <Column
                            className="header-center"
                            header=""
                            style={{ minWidht: "10rem" }}
                            body={(e) => (
                              <div
                                className={
                                  e.type === "header"
                                    ? "font-weight-bold text-right"
                                    : e.type === "footer"
                                    ? "font-weight-bold text-right"
                                    : "text-right"
                                }
                              >
                                {e.value.tot}
                              </div>
                            )}
                          />
                        </DataTable>
                      );
                    })}
                  </>
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
