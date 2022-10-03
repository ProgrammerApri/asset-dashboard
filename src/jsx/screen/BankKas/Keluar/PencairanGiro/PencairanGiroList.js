import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_GIRO, SET_EDIT_GIRO, SET_GIRO } from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { Link } from "react-router-dom";

const data = {
  id: null,
  giro_date: null,
  giro_num: null,
  bank_id: null,
  pay_code: null,
  pay_date: null,
  sup_id: null,
  value: null,
  status: null,
};

const PencairanGiroMundurList = ({ onSuccess, onCancel }) => {
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doubleClick, setDoubleClick] = useState(false);
  const toast = useRef(null);
  const show = useSelector((state) => state.giro.current);
  const giro = useSelector((state) => state.giro.giro);
  const isEdit = useSelector((state) => state.giro.editGiro);
  const dispatch = useDispatch();
  const [bank, setBank] = useState(null);
  const [comp, setComp] = useState(null);
  const [supplier, setSupp] = useState(null);
  const [exp, setExp] = useState(null);
  const [city, setCity] = useState(null);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getGiro();
    getBank();
    getComp();
    getSupp();
    getExp();
    getCity();
    initFilters1();
  }, []);

  const getGiro = async (isUpdate = false) => {
    const config = {
      ...endpoints.giro,
      data: giro,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        dispatch({ type: SET_GIRO, payload: data });
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

  const getBank = async () => {
    const config = {
      ...endpoints.bank,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setBank(data);
      }
    } catch (error) {}
  };

  const getSupp = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSupp(data);
      }
    } catch (error) {}
  };

  const getExp = async () => {
    const config = {
      ...endpoints.expense,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setExp(data);
      }
    } catch (error) {}
  };

  const getCity = async () => {
    const config = {
      ...endpoints.city,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCity(data);
      }
    } catch (error) {}
  };

  const getComp = async () => {
    const config = {
      ...endpoints.getCompany,
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
        setComp(data);
      }
    } catch (error) {}
  };

  const editGiro = async () => {
    const config = {
      ...endpoints.editGiro,
      endpoint: endpoints.editGiro.endpoint + giro.id,
      data: giro,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const checkBank = (value) => {
    let selected = {};
    bank?.forEach((element) => {
      if (value === element.bank.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSup = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkExp = (value) => {
    let selected = {};
    exp?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const kota = (value) => {
    let selected = {};
    city?.forEach((element) => {
      if (element.city_id === `${value}`) {
        selected = element;
      }
    });
    return selected;
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editGiro();
    }
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

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            setDisplayData(data);
            dispatch({
              type: SET_EDIT_GIRO,
              payload: true,
            });
            dispatch({
              type: SET_CURRENT_GIRO,
              payload: {
                ...data,
                bank_id: data?.bank_id?.id ?? null,
                pay_code: data?.pay_code?.id ?? null,
                sup_id: data?.sup_id?.id ?? null,
              },
            });
          }}
          className={`btn ${
            data.status === 0 ? "" : "disabled"
          } btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="bx bx-check mt-1"></i>
        </Link>

        {/* <Link
          onClick={() => {
            isEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link> */}
      </div>
      // </React.Fragment>
    );
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

  const updateGR = (e) => {
    dispatch({
      type: SET_CURRENT_GIRO,
      payload: e,
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

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : giro}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["giro_code"]}
                emptyMessage="Tidak ada data"
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                // onRowSelect={(e) => {
                //   if (doubleClick) {
                //     setDisplayData(false);
                //   }

                //   setDoubleClick(true);

                //   setTimeout(() => {
                //     setDoubleClick(false);
                //   }, 2000);
                // }}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header="Tanggal Pencairan"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => formatDate(e.giro_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nomer Giro"
                  field={(e) => e.giro_num}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Bank"
                  field={(e) => e.bank_id.BANK_NAME}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Pembayaran"
                  field={(e) => e.pay_code?.exp_code ?? "-"}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Tanggal Pembayaran"
                  field={(e) => formatDate(e.pay_date)}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                {/* <Column
                  header="Pemasok"
                  field={(e) => e.sup_id?.sup_name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                /> */}
                <Column
                  header="Nilai"
                  field={(e) => formatIdr(e.value)}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Status Giro"
                  field={(e) => e.status}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.status === 0 ? (
                          <Badge variant="warning light">
                            <i className="bx bxs-check-circle text-warning mr-1 mt-1"></i>{" "}
                            Belum Dicairkan
                          </Badge>
                        ) : (
                          <Badge variant="info light">
                            <i className="bx bxs-x-circle text-info mr-1 mt-1"></i>{" "}
                            Sudah Dicairkan
                          </Badge>
                        )}
                      </div>
                    )
                  }
                />
                <Column
                  header="Accept"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={"Pencairan Giro"}
        visible={displayData}
        style={{ width: "45vw" }}
        footer
        onHide={() => {
          setDisplayData(false);
        }}
      >
        <Row>
          <Col>
            <Card className="px-4 py-3">
              <div className="flex justify-content-between align-items-center">
                <div className="">
                  <img
                    className="ml-2"
                    style={{
                      height: "40px",
                      width: "40px",
                    }}
                    src={comp?.cp_logo}
                    alt=""
                  />
                  <br></br>
                  <span className="ml-0 fs-10">
                    <b>{comp?.cp_name}</b>
                  </span>
                </div>

                <div className="">
                  <label className="text-label ml-2">Nomor Giro</label>
                  <br></br>
                  <Badge variant="primary light" className="ml-1 fs-12">
                    {show?.giro_num}
                  </Badge>
                </div>

                <div className="">
                  <label className="text-label ml-1">Kode Bank</label>
                  <br></br>
                  <Badge variant="warning light" className="ml-0 fs-12">
                    {`${checkBank(show?.bank_id)?.bank?.BANK_NAME} (${
                      checkBank(show?.bank_id)?.bank?.BANK_CODE
                    })`}
                  </Badge>
                </div>

                <div className="">
                  <span className="p-buttonset">
                    {/* <ReactToPrint
                    trigger={() => {
                      return (
                        <Button
                          className="p-button-info"
                          label="Cetak"
                          onClick={() => {}}
                          icon="bx bxs-printer"
                          // disabled={show?.apprv === false}
                        />
                      );
                    }}
                    content={() => printPage.current}
                  /> */}
                    <Button
                      className="p-button-info"
                      style={{ width: "6rem", height: "3rem" }}
                      label="Cairkan"
                      icon="bx bx-money-withdraw"
                      onClick={() => onSubmit()}
                      autoFocus
                      loading={update}
                      // disabled={show?.apprv === false}
                    />
                    <Button
                      style={{ width: "6rem", height: "3rem" }}
                      label="Batal"
                      onClick={() => setDisplayData(false)}
                      className="p-button-info"
                      icon="bx bx-x"
                    />
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row className="ml-0 mr-0 mb-0 mt-0 justify-content-between fs-12">
          <div className="row justify-content-left col-6 mb-0"></div>
          <div className="row justify-content-right col-6 mb-0">
            {/* <div className="col-12 mt-0 fs-12 text-right"> */}
            {/* <label className="text-label">Tanggal Pencairan : </label> */}
            {/* <div className="p-inputgroup">
              <Calendar
                style={{ width: "10rem", height: "2rem" }}
                className="ml-5 fs-12"
                value={new Date(`${giro.giro_date}Z`)}
                onChange={(e) => {
                  updateGIn({ ...giro, giro_date: e.value });
                }}
                placeholder="Tanggal Pencairan"
                showIcon
                dateFormat="dd-mm-yy"
              />
            </div> */}
            {/* </div> */}
          </div>

          <Card className="col-12 mt-2">
            <div className="row col-12">
              <div className="col-7 fs-13 ml-0">
                <Badge variant="info light" className="ml-0 fs-12">
                  <b>Informasi Pembayaran</b>
                </Badge>
              </div>

              <div className="col-5 fs-13 text-right">
                <Badge variant="info light" className="ml-0 fs-12">
                  <b>Informasi Supplier</b>
                </Badge>
              </div>

              <div className="col-7 fs-12 ml-0">
                <br></br>
                <label className="text-label">Kode Pelunasan</label>
                <br></br>
                <span className="">
                  <b>{checkExp(show?.pay_code)?.exp_code ?? "-"}</b>
                </span>
                <br />
                <br />
                <label className="text-label">Tanggal Pelunasan</label>
                <br></br>
                <span className="ml-0">
                  <b>{formatDate(show?.pay_date)}</b>
                </span>
                <br />
                <br />
                <label className="text-label">Tanggal Pencairan</label>
                <br></br>
                <span className="ml-0">
                  <b>{formatDate(show?.giro_date)}</b>
                </span>
                <br />
              </div>

              <div className="col-5 ml-0 text-right">
                {/* <label className="text-label">Pelanggan</label> */}
                <br></br>
                <span className="fs-13">
                  <b>{`${checkSup(show?.sup_id)?.supplier?.sup_name} (${
                    checkSup(show?.sup_id)?.supplier?.sup_code
                  })`}</b>
                </span>
                <br />
                <br />
                <label className="text-label">Alamat Pelanggan</label>
                <br></br>
                <span className="ml-0">
                  <b>
                    {checkSup(show?.sup_id)?.supplier?.sup_address},{" "}
                    {
                      checkSup(kota(show?.sup_id)?.supplier?.sup_kota)
                        ?.city_name
                    }
                    , {checkSup(show?.sup_id)?.supplier?.sup_kpos}
                  </b>
                </span>
                <br />
                <br />
                <label className="text-label">No. Telepon</label>
                <br></br>
                <span className="ml-0">
                  <b>(+62) {checkSup(show?.sup_id)?.supplier?.sup_telp1}</b>
                </span>
                <br></br>
                <br></br>
                <label className="text-label">Contact Person</label>
                <br></br>
                <span className="ml-0">
                  <b>{checkSup(show?.sup_id)?.supplier?.sup_cp}</b>
                </span>
              </div>
            </div>

            <div className="col-6"></div>
            <div className="col-6 fs-14 mt-8">
              <span>
                <b>Nilai Giro :</b> Rp. {formatIdr(show?.value)}
              </span>
            </div>
          </Card>
        </Row>
      </Dialog>
    </>
  );
};

export default PencairanGiroMundurList;
