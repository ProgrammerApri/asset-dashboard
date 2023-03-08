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
import { SET_CURRENT_EXP, SET_EDIT_EXP, SET_EXP } from "src/redux/actions";
import { Skeleton } from "primereact/skeleton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  id: null,
  exp_code: null,
  exp_date: null,
  type_trx: null,
  acq_sup: null,
  acq_pay: null,
  acq_kas: null,
  bank_ref: null,
  bank_acc: null,
  giro_num: null,
  giro_date: null,
  bank_id: null,
  exp_type: null,
  kas_acc: null,
  exp_bnk: null,
  type_acc: null,
  exp_dep: null,
  exp_prj: null,
  dp_type: null,
  dp_sup: null,
  dp_kas: null,
  dp_bnk: null,
  acq: [],
  exp: [],
  det_dp: [],
};

const KasBankOutList = ({ onAdd, onEdit }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [dep, setDep] = useState(null);
  const [proj, setProj] = useState(null);
  const [supp, setSup] = useState(null);
  const [acc, setAcc] = useState(null);
  const [bank, setBank] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [displayData, setDisplayDat] = useState(false);
  const dispatch = useDispatch();
  const exp = useSelector((state) => state.exp.exp);
  const show = useSelector((state) => state.exp.current);
  const [expandedRows, setExpandedRows] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getEXP();
    initFilters1();
    getDep();
    getProj();
    getSupp();
    getBank();
    getAcc();
  }, []);

  const getEXP = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.expense,
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
        dispatch({ type: SET_EXP, payload: data });
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

  const getProj = async () => {
    const config = {
      ...endpoints.project,
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
        setProj(data);
      }
    } catch (error) {}
  };

  const getDep = async () => {
    const config = {
      ...endpoints.pusatBiaya,
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
        setDep(data);
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
        setSup(data);
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
        console.log(data);
        setBank(data);
      }
    } catch (error) {}
  };

  const delEXP = async (id) => {
    const config = {
      ...endpoints.delEXP,
      endpoint: endpoints.delEXP.endpoint + currentItem.id,
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
          getEXP(true);
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

  const checkdep = (value) => {
    let selected = {};
    dep?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });
    return selected;
  };

  const checkproj = (value) => {
    let selected = {};
    proj?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSup = (value) => {
    let selected = {};
    supp?.forEach((element) => {
      if (value === element.supplier.id) {
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

  const checkBank = (value) => {
    let selected = {};
    bank?.forEach((element) => {
      if (value === element.bank.id) {
        selected = element;
      }
    });
    return selected;
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            // onDetail();
            setDisplayDat(data);
            dispatch({ type: SET_CURRENT_EXP, payload: data });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            onEdit(data);
            let acq = data.acq;
            let det_dp = data.det_dp;
            dispatch({
              type: SET_EDIT_EXP,
              payload: true,
            });
            acq.forEach((el) => {
              el.fk_id = el.fk_id?.id ?? null;
            });
            det_dp.forEach((el) => {
              el.po_id = el.po_id?.id ?? null;
            });
            dispatch({
              type: SET_CURRENT_EXP,
              payload: {
                ...data,
                // bank_acc: data?.bank_acc?.id ?? null,
                bank_id: data?.bank_id?.id ?? null,
                acq_sup: data?.acq_sup?.id ? data?.acq_sup : null,
                exp_prod: data?.exp_prod,
                acq:
                  acq.length > 0
                    ? acq
                    : [
                        {
                          id: null,
                          fk_id: null,
                          value: null,
                          payment: null,
                          sisa: null,
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
          onClick={() => {
            setUpdate(false);
            setDisplayDel(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            setUpdate(true);
            delEXP();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayDat(false)}
          className="p-button-text btn-primary"
        />
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
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_EXP,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_EXP,
              payload: {
                ...data,
                type_trx: 1,
                type_acc: null,
                exp_type: 1,
                acq_pay: 1,
                acq: [],
                exp: [
                  {
                    id: null,
                    acc_code: null,
                    acc_bnk: null,
                    bnk_code: null,
                    value: null,
                    fc: null,
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

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <DataTable
          value={
            data?.type_trx === 1
              ? data?.acq
              : data?.type_trx === 2
              ? data?.exp
              : data?.det_dp
          }
          responsiveLayout="scroll"
        >
          <Column
            header={
              data?.type_trx === 1
                ? "Kode Pembelian"
                : data?.type_trx === 2
                ? data.exp_type !== 1
                  ? "Kode Bank"
                  : "Kode Akun"
                : "Kode Pesanan Pembelian"
            }
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? e?.fk_id?.ord_code
                : data?.type_trx === 2
                ? data.exp_type === 2 && data.type_acc === 1
                  ? `${checkAcc(e.acc_bnk)?.account?.acc_name} - ${
                      checkAcc(e.acc_bnk)?.account?.acc_code
                    }`
                  : data.exp_type === 2
                  ? `${checkBank(e.bnk_code)?.bank?.BANK_NAME} - ${
                      checkBank(e.bnk_code)?.bank?.BANK_CODE
                    }`
                  : `${checkAcc(e.acc_code)?.account?.acc_name} - ${
                      checkAcc(e.acc_code)?.account?.acc_code
                    }`
                : e.po_id?.po_code
            }
          />
          <Column
            hidden={data?.type_trx == 2}
            header="Pemasok"
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? `${data.acq_sup?.sup_name} (${data.acq_sup?.sup_code})`
                : `${checkSup(data.dp_sup)?.supplier?.sup_name} (${
                    checkSup(data.dp_sup)?.supplier?.sup_code
                  })`
            }
          />
          <Column
            hidden={data.exp_type === 2 && data.type_acc === 2}
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
                ? formatDate(e.fk_id?.due_date)
                : data?.type_trx === 2
                ? data.exp_type === 2 && data.type_acc === 1
                  ? checkAcc(e.acc_bnk)?.account?.sld_type
                  : checkAcc(e.acc_code)?.account?.sld_type
                : data?.dp_type === 1
                ? `${checkAcc(data.dp_kas)?.account?.acc_name} - ${
                    checkAcc(data.dp_kas)?.account?.acc_code
                  }`
                : `${checkBank(data.dp_bnk)?.bank?.BANK_NAME} - ${
                    checkBank(data.dp_bnk)?.bank?.BANK_CODE
                  }`
            }
          />
          <Column
            hidden={data?.type_trx === 3}
            header={data?.type_trx !== 2 ? "Nilai Hutang" : "Nominal"}
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx !== 2
                ? data.acq_sup?.sup_curren !== null
                  ? e.value
                  : `Rp. ${formatIdr(e.value)}`
                : data?.type_acc == 2
                ? `Rp. ${formatIdr(e.fc)}`
                : `Rp. ${formatIdr(e.value)}`
            }
          />
          <Column
            header={data?.type_trx !== 2 ? "Uang Muka" : ""}
            style={{ width: "20rem" }}
            field={(e) =>
              data?.type_trx === 1
                ? data.acq_sup?.sup_curren !== null
                  ? e.dp
                  : `Rp. ${formatIdr(e.dp)}`
                : data?.type_trx === 3
                ? checkSup(data.dp_sup)?.supplier?.sup_curren !== null
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
                ? data.acq_sup?.sup_curren !== null
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
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <Toast ref={toast} />
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : exp}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={null}
                globalFilterFields={["exp.exp_code"]}
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
                  field={(e) => formatDate(e.exp_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nomor Referensi"
                  field={(e) => e.exp_code}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Tipe Transaksi"
                  field={(e) => e?.exp_type ?? ""}
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
                        ) : e.type_trx == 2 ? (
                          <Badge variant="warning light">
                            <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                            Pengeluaran
                          </Badge>
                        ) : (
                          <Badge variant="success light">
                            <i className="bx bxs-circle text-success mr-1"></i>{" "}
                            Uang Muka
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
                          <Badge variant="info light">
                            <i className="bx bxs-circle text-info mr-1"></i> Kas
                          </Badge>
                        ) : e.acq_pay === 2 ? (
                          <Badge variant="warning light">
                            <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                            Bank
                          </Badge>
                        ) : e.acq_pay === 3 ? (
                          <Badge variant="success light">
                            <i className="bx bxs-circle text-success mr-1"></i>{" "}
                            Giro
                          </Badge>
                        ) : (
                          <span className="center"> - </span>
                        )}
                      </div>
                    )
                  }
                />
                <Column
                  header="Status"
                  field={(e) => e?.approve ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.approve === true ? (
                          <Badge variant="info light">
                            <i className="bx bx-check text-info mr-1"></i>{" "}
                            Disetujui
                          </Badge>
                        ) : (
                          <Badge variant="danger light">
                            <i className="bx bx-x text-danger mr-1"></i> Belum
                            Disetujui
                          </Badge>
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
                header={"Detail Kas/Bank"}
                visible={displayData}
                style={{ width: "60vw" }}
                footer={renderFooter("displayData")}
                onHide={() => {
                  setDisplayDat(false);
                }}
              >
                <Row className="ml-0 pt-0 fs-12">
                  <div className="col-9"></div>
                  <div className="col-3">
                    <label className="text-label">Tanggal Pengeluaran :</label>
                    <span className="ml-1">
                      <b>{formatDate(show?.exp_date)}</b>
                    </span>
                  </div>

                  <Card className="col-12 ml-0 mr-3">
                    <div className="col-12">
                      {/* </div> */}

                      {show.exp_type === 1 && (
                        <>
                          <label className="text-label">
                            <b>Informasi Pelunasan</b>
                          </label>

                          <br></br>
                          <br></br>
                          <span className="ml-0 fs-14">
                            <b>{show?.exp_code}</b>
                          </span>
                          <br></br>
                          <br></br>
                          <br></br>
                          <span className="ml-0">
                            Tipe Pengeluaran : {""}
                            <b>
                              {show?.exp_type === 1
                                ? "Pelunasan"
                                : show?.exp_type === 2
                                ? "Pengeluaran Kas/Bank"
                                : "Biaya Batch"}
                            </b>
                          </span>

                          <br></br>

                          <span className="ml-0">
                            Supplier :{" "}
                            <b>{`${show?.acq_sup?.sup_code}-${show?.acq_sup?.sup_name}`}</b>
                          </span>

                          <br></br>
                          <span className="ml-0">
                            Akun Pengeluaran :{" "}
                            <b>{`${show?.exp_acc?.acc_code}-${show?.exp_acc?.acc_name}`}</b>
                          </span>

                          <br></br>
                          <span className="ml-0">
                            Jenis Pelunasan : {""}
                            <b>
                              {show?.acq_pay === 1
                                ? "Kas"
                                : show?.acq_pay === 2
                                ? "Bank"
                                : "Giro"}
                            </b>
                          </span>
                          <br></br>
                          {show.acq_pay === 1 ? (
                            <>
                              <span className="ml-0">
                                Akun Pengeluaran :{" "}
                                <b>{`${show?.kas_acc?.acc_code}-${show?.kas_acc?.acc_name}`}</b>
                              </span>
                            </>
                          ) : show.acq_pay === 2 ? (
                            <>
                              <span className="ml-0">
                                Kode Referensi : <b>{show?.bank_ref}</b>
                              </span>

                              <br></br>
                              <span className="ml-0">
                                Kode Bank :{" "}
                                <b>{`${show?.bank_acc?.BANK_CODE}-${show?.bank_acc?.BANK_NAME}`}</b>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="ml-0">
                                Nomor Giro : <b>{show?.giro_num}</b>
                              </span>

                              <br></br>
                              <span className="ml-0">
                                Tanggal Cair :{" "}
                                <b>{`${formatDate(show?.giro_date)}`}</b>
                              </span>
                              <br></br>

                              <span className="ml-0">
                                Kode Bank :{" "}
                                <b>{`${show?.bank_id?.BANK_CODE}-${show?.bank_id?.BANK_NAME}`}</b>
                              </span>
                            </>
                          )}
                        </>
                      )}

                      {show.exp_type === 2 && (
                        <>
                          <label className="text-label">
                            <b>Informasi Pengeluaran</b>
                          </label>

                          <br></br>
                          <br></br>
                          <span className="ml-0 fs-14">
                            <b>{show?.exp_code}</b>
                          </span>
                          <br></br>
                          <br></br>
                          <br></br>
                          <span className="ml-0">
                            Tipe Pengeluaran : {""}
                            <b>
                              {show?.exp_type === 1
                                ? "Pelunasan"
                                : show?.exp_type === 2
                                ? "Pengeluaran Kas/Bank"
                                : "Biaya Batch"}
                            </b>
                          </span>

                          <br></br>

                          <span className="ml-0">
                            Akun Pengeluaran :{" "}
                            {/* <b>{`${show?.exp_acc.acc_code}-${show?.exp_acc.acc_name}`}</b> */}
                          </span>

                          <br></br>
                          <span className="ml-0">
                            Departement :{" "}
                            <b>{`${checkdep(show?.exp_dep)?.ccost_name} (${
                              checkdep(show?.exp_dep)?.ccost_code
                            })`}</b>
                          </span>

                          <br></br>
                          <span className="ml-0">
                            Project :{" "}
                            <b>{`${checkproj(show?.exp_prj)?.proj_code} (${
                              checkproj(show?.exp_prj)?.proj_name
                            })`}</b>
                          </span>
                        </>
                      )}
                    </div>
                  </Card>

                  <Row className="ml-2 mt-0">
                    {show.exp_type === 2 && (
                      <Row className="ml-1 mt-0">
                        <DataTable
                          value={show.exp}
                          responsiveLayout="scroll"
                          className="display w-150 datatable-wrapper fs-12"
                          showGridlines
                          dataKey="id"
                          rowHover
                        >
                          <Column
                            header="Akun"
                            field={(e) =>
                              `${e.acc_code?.acc_code}-${e.acc_code?.acc_name}`
                            }
                            style={{ minWidth: "20rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Tipe Pengeluaran"
                            field={(e) => "Debit"}
                            style={{ minWidth: "11rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Nilai"
                            field={(e) => e.value}
                            style={{ minWidth: "10rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Keterangan"
                            field={(e) => e.desc}
                            style={{ minWidth: "18rem" }}
                            // body={loading && <Skeleton />}
                          />
                        </DataTable>
                      </Row>
                    )}
                  </Row>
                </Row>
              </Dialog>

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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default KasBankOutList;
