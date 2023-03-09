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
import { SET_CURRENT_INC, SET_EDIT_INC, SET_INC } from "src/redux/actions";
import { Skeleton } from "primereact/skeleton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  id: null,
  inc_code: null,
  inc_date: null,
  type_trx: 1,
  acq_cus: null,
  acq_pay: null,
  acq_kas: null,
  bank_ref: null,
  bank_acc: null,
  giro_num: null,
  giro_date: null,
  giro_bnk: null,
  inc_type: null,
  inc_kas: null,
  inc_bnk: null,
  inc_dep: null,
  inc_acc: null,
  inc_prj: null,
  acc_type: null,
  dp_type: null,
  dp_cus: null,
  dp_kas: null,
  dp_bnk: null,
  acq: [],
  inc: [],
  det_dp: [],
};

const KasBankInList = ({ onAdd, onEdit }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [acc, setAcc] = useState(null);
  const [bank, setBank] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [displayData, setDisplayDat] = useState(false);
  const dispatch = useDispatch();
  const inc = useSelector((state) => state.inc.inc);
  const [expandedRows, setExpandedRows] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    initFilters1();
    getINC();
    getCustomer();
    getAcc();
    getBank();
  }, []);

  const getINC = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.income,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        dispatch({ type: SET_INC, payload: data });
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

  const getCustomer = async () => {
    setLoading(true);
    const config = {
      ...endpoints.customer,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCustomer(data);
      }
    } catch (error) {}
  };

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAcc(data);
      }
    } catch (error) {}
  };

  const getBank = async () => {
    const config = {
      ...endpoints.bank,
      data: {},
    };
    console.log(config.data);
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

  const delINC = async (id) => {
    const config = {
      ...endpoints.delINC,
      endpoint: endpoints.delINC.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayDel(false);
          getINC(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Dihapus",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setDisplayDel(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Data`,
          life: 3000,
        });
      }, 500);
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
            dispatch({
              type: SET_EDIT_INC,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_INC,
              payload: {
                ...data,
                inc_type: 1,
                acq_pay: 1,
                acq: [
                  // {
                  //   id: null,
                  //   exp_id: null,
                  //   fk_id: null,
                  //   value: null,
                  //   payment: null,
                  // },
                ],
                inc: [
                  {
                    id: null,
                    acc_code: null,
                    dbcr: null,
                    value: null,
                    desc: null,
                  },
                ],

                det_dp: [],
              },
            });
          }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onEdit(data);
            let acq = data.acq;
            let det_dp = data.det_dp;
            dispatch({
              type: SET_EDIT_INC,
              payload: true,
            });
            acq.forEach((el) => {
              el.sale_id = el.sale_id?.id;
            });
            det_dp?.forEach((el) => {
              el.so_id = el.so_id?.id;
            });
            dispatch({
              type: SET_CURRENT_INC,
              payload: {
                ...data,
                bank_id: data?.bank_id?.id ?? null,
                acq_cus: data?.acq_cus?.id ? data?.acq_cus : null,
                acq:
                  acq.length > 0
                    ? acq
                    : [
                        {
                          id: null,
                          sale_id: null,
                          value: null,
                          payment: null,
                        },
                      ],
              },
            });
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
          // className={`btn ${
          //   data.inc_type === 2 || data.acq_pay === 1 || getStatus() === 0
          //     ? ""
          //     : "disabled"
          // } btn-danger shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            setUpdate(true);
            delINC();
          }}
          autoFocus
          loading={update}
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

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkBnk = (value) => {
    let selected = {};
    bank?.forEach((element) => {
      if (value === element.bank.id) {
        selected = element;
      }
    });

    return selected;
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

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <DataTable
          value={
            data?.type_trx === 1
              ? data?.acq
              : data?.type_trx === 2
              ? data?.inc
              : data?.det_dp
          }
          responsiveLayout="scroll"
        >
          <Column
            header={
              data?.type_trx !== 2
                ? "Kode Transaksi"
                : data.inc_type !== 1
                ? "Kode Bank"
                : "Kode Akun"
            }
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? e?.sale_id?.ord_code
                : data?.type_trx === 2
                ? data.inc_type === 2 && data.acc_type === 1
                  ? `${checkAcc(e.acc_bnk)?.account?.acc_name} - ${
                      checkAcc(e.acc_bnk)?.account?.acc_code
                    }`
                  : data.inc_type === 2
                  ? `${checkBnk(e.bnk_code)?.bank?.BANK_NAME} - ${
                      checkBnk(e.bnk_code)?.bank?.BANK_CODE
                    }`
                  : `${checkAcc(e.acc_code)?.account?.acc_name} - ${
                      checkAcc(e.acc_code)?.account?.acc_code
                    }`
                : e?.so_id?.so_code
            }
          />
          <Column
            hidden={data?.type_trx === 2}
            header="Pelanggan"
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? `${checkCus(e?.sale_id?.pel_id)?.customer?.cus_name} (${
                    checkCus(e?.sale_id?.pel_id)?.customer?.cus_code
                  })`
                : `${checkCus(e?.so_id?.pel_id)?.customer?.cus_name} (${
                    checkCus(e?.so_id?.pel_id)?.customer?.cus_code
                  })`
            }
          />
          <Column
            hidden={data.inc_type === 2 && data.acc_type === 2}
            header={
              data?.type_trx === 1
                ? "Jatuh Tempo"
                : data?.type_trx === 2
                ? "Tipe Saldo"
                : "DP Melalui"
            }
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? formatDate(e.sale_id?.due_date)
                : data?.type_trx === 2
                ? data.inc_type === 2 && data.acc_type === 1
                  ? checkAcc(e.acc_bnk)?.account?.sld_type
                  : checkAcc(e.acc_code)?.account?.sld_type
                : data?.dp_type === 1
                ? `${checkAcc(data.dp_kas)?.account?.acc_name} - ${
                    checkAcc(data.dp_kas)?.account?.acc_code
                  }`
                : `${checkBnk(data.dp_bnk)?.bank?.BANK_NAME} - ${
                    checkBnk(data.dp_bnk)?.bank?.BANK_CODE
                  }`
            }
          />
          <Column
            hidden={data?.type_trx === 3}
            header={data?.type_trx !== 2 ? "Nilai" : "Nominal"}
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx !== 2
                ? checkCus(e?.sale_id?.pel_id)?.customer?.cus_curren !== null
                  ? e.value
                  : `Rp. ${formatIdr(e.value)}`
                : data?.acc_type == 2
                ? `Rp. ${formatIdr(e.fc)}`
                : `Rp. ${formatIdr(e.value)}`
            }
          />
          <Column
            header={data?.type_trx !== 2 ? "Uang Muka" : ""}
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? data.acq_cus?.cus_curren !== null
                  ? e.dp
                  : `Rp. ${formatIdr(e.dp)}`
                : data?.type_trx === 3
                ? checkCus(data.dp_cus)?.customer?.cus_curren !== null
                  ? e.value
                  : `Rp. ${formatIdr(e.value)}`
                : ""
            }
          />
          <Column
            header={data?.type_trx === 1 ? "Pembayaran" : "Keterangan"}
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? checkCus(e?.sale_id?.pel_id)?.customer?.cus_curren !== null
                  ? e.payment
                  : `Rp. ${formatIdr(e.payment)}`
                : data?.type_trx === 2
                ? e.desc ?? "-"
                : e.desc ?? "-"
            }
          />
        </DataTable>
      </div>
    );
  };

  return (
    <>
    <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={loading ? dummy : inc}
            className="display w-150 datatable-wrapper"
            showGridlines
            dataKey="id"
            rowHover
            header={renderHeader}
            filters={filters1}
            globalFilterFields={["inc.inc_code"]}
            emptyMessage="Tidak ada data"
            paginator
            paginatorTemplate={template2}
            first={first2}
            rows={rows2}
            onPage={onCustomPage2}
            paginatorClassName="justify-content-end mt-3"
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
          >
            <Column expander style={{ width: "3em" }} />

            <Column
              header="Tanggal"
              style={{
                minWidth: "8rem",
              }}
              field={(e) => formatDate(e.inc_date)}
              body={loading && <Skeleton />}
            />
            <Column
              header="Nomor Referensi"
              field={(e) => e.inc_code}
              style={{ minWidth: "8rem" }}
              body={loading && <Skeleton />}
            />
            <Column
              header="Tipe Transaksi"
              field={(e) => e?.type_trx ?? ""}
              style={{ minWidth: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <div>
                    {e.type_trx === 1 ? (
                      <Badge variant="info light">
                        <i className="bx bxs-circle text-info mr-1"></i>{" "}
                        Pelunasan
                      </Badge>
                    ) : e.type_trx === 2 ? (
                      <Badge variant="warning light">
                        <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                        Pemasukan Kas/Bank
                      </Badge>
                    ) : (
                      <Badge variant="success light">
                        <i className="bx bxs-circle text-success mr-1"></i> Uang
                        Muka
                      </Badge>
                    )}
                  </div>
                )
              }
            />
            <Column
              header="Pelunasan Melalui"
              className="align-text-center"
              field={(e) => e?.acq_pay ?? ""}
              style={{ minWidth: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <div>
                    {e.acq_pay === 1 ? (
                      <Badge variant="primary light">
                        <i className="bx bxs-circle text-primary mr-1"></i> Kas
                      </Badge>
                    ) : e.acq_pay === 2 ? (
                      <Badge variant="warning light">
                        <i className="bx bxs-circle text-warning mr-1"></i> Bank
                      </Badge>
                    ) : e.acq_pay === 3 ? (
                      <Badge variant="info light">
                        <i className="bx bxs-circle text-info mr-1"></i> Giro
                      </Badge>
                    ) : (
                      <span className="center"> - </span>
                    )}
                  </div>
                )
              }
            />
            <Column
              header="Action"
              dataType="boolean"
              bodyClassName="text-center"
              style={{ minWidth: "2rem" }}
              body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
            />
          </DataTable>
    
          <Dialog
            header={"Hapus Data"}
            visible={displayDel}
            style={{ width: "30vw" }}
            footer={renderFooterDel("displayDel")}
            onHide={() => {
              setDisplayDel(false);
            }}
          >
            <div className="ml-3 mr-3">
              <i
                className="pi pi-exclamation-triangle mr-3 align-middle"
                style={{ fontSize: "2rem" }}
              />
              <span>Apakah anda yakin ingin menghapus data ?</span>
            </div>
          </Dialog>
        </Col>
      </Row>
    </>
  );
};

export default KasBankInList;
