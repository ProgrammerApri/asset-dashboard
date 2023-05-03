import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Badge, Button, Card, Row, Col } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PBB, SET_EDIT_PBB, SET_PBB } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { SET_PERIOD } from "../../../../redux/actions";

const data = {
  id: null,
  pbb_code: null,
  pbb_name: null,
  pbb_date: null,
  type_pb: 1,
  prod_id: null,
  batch_id: null,
  proj_id: null,
  acc_cred: null,
  period: null,
  panen_prod: null,
  panen_loc: null,
  desc: null,
  upah: [],
  overhead: [],
  product: [],
  panen: [],
};

const DataPembebanan = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [dept, setDept] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const pbb = useSelector((state) => state.pbb.pbb);
  const show = useSelector((state) => state.pbb.current);
  const [acc, setAcc] = useState(null);
  const [product, setProduct] = useState(null);
  const [accDdb, setAccDdb] = useState(null);
  const [transGl, setTransGl] = useState(null);
  const [trans, setTrans] = useState(null);
  const [stcard, setSt] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    // getPBN();
    getPBB();
    getDept();
    getAcc();
    getProduct();
    getAccDdb();
    getTransGl();
    getTrans();
    getSt();
    initFilters1();
  }, []);

  const getPBB = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.pbb,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((element) => {
          if (!element.closing) {
            filt.push(element);
          }
        });
        dispatch({ type: SET_PBB, payload: filt });
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

  const getDept = async () => {
    const config = {
      ...endpoints.pusatBiaya,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setDept(data);
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

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setProduct(data);
      }
    } catch (error) {}
  };

  const getTransGl = async () => {
    const config = {
      ...endpoints.trans,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          if (!element.tf_inv) {
            filt.push(element);
          }
        });
        setTransGl(filt);
      }
    } catch (error) {}
  };

  const getAccDdb = async () => {
    const config = {
      ...endpoints.acc_ddb,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setAccDdb(data);
      }
    } catch (error) {}
  };

  const getTrans = async () => {
    const config = {
      ...endpoints.trans,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          if (element.tf_inv) {
            filt.push(element);
          }
        });
        setTrans(data);
      }
    } catch (error) {}
  };

  const getSt = async () => {
    const config = {
      ...endpoints.stcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setSt(data);
      }
    } catch (error) {}
  };

  const checkDept = (value) => {
    let selected = {};
    dept?.forEach((element) => {
      if (value === element.id) {
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

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSt = (value) => {
    let selected = {};
    stcard?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const delPBB = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delPBB,
      endpoint: endpoints.delPBB.endpoint + currentItem.id,
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
          getPBB(true);
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

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onDetail();
            let product = data.product;
            let material = data.material;
            let reject = data.reject;
            let wages = data.wages;
            dispatch({
              type: SET_CURRENT_PBB,
              payload: {
                ...data,
                dep_id: data?.dep_id?.id ?? null,
                msn_id: data?.msn_id?.id ?? null,
                prdc_rm: true,
                product: product?.length > 0 ? product : null,
                material: material?.length > 0 ? material : null,
                reject: reject?.length > 0 ? reject : null,
                wages: wages?.length > 0 ? wages : null,
              },
            });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            onEdit(data);
            dispatch({
              type: SET_EDIT_PBB,
              payload: true,
            });
            let upah = data.upah;
            let nom_sa = 0;
            let nom_gl = 0;
            let nom_d = 0;
            let dt_btc = new Date(`${data?.pbb_date}Z`);

            accDdb?.forEach((el) => {
              if (el?.acc_code?.id === el?.acc_id) {
                nom_sa += el.acc_akhir;
              }
            });

            transGl?.forEach((elem) => {
              if (
                elem?.acc_id === elem?.acc_id
                // &&
                // dt.getMonth() + 1 > setup?.cutoff &&
                // dt.getFullYear() >= setup?.year_co
              ) {
                if (elem.trx_dbcr === "D") {
                  nom_gl += elem.trx_amnt;
                } else {
                  nom_gl -= elem.trx_amnt;
                }
              }
            });

            trans?.forEach((element) => {
              let dt = new Date(`${element?.trx_date}Z`);
              upah?.forEach((el) => {
                if (
                  element.acc_id === el.acc_id
                  // &&
                  // dt.getMonth() + 1 === dt_btc?.getMonth() + 1 &&
                  // dt.getFullYear() === dt_btc?.getFullYear()
                ) {
                  if (element.trx_dbcr === "D") {
                    nom_d += element.trx_amnt;
                  } else {
                    nom_d -= element.trx_amnt;
                  }
                }
              });
            });

            upah.forEach((el) => {
              el.acc_id = el.acc_id;
              el.value = nom_sa + nom_gl + nom_d + el.nom_uph;
            });
            let overhead = data.overhead;
            overhead.forEach((el) => {
              el.acc_id = el.acc_id;
            });
            let product = data.product;
            product.forEach((el) => {
              el.trn_id = el.trn_id ?? null;
              el.prd_id = el.prd_id ?? null;
            });
            let panen = data.panen;
            panen.forEach((el) => {
              el.trn_id = el.trn_id ?? null;
              el.prd_id = el.prd_id ?? null;
            });

            // dispatch({
            //   type: SET_PERIOD,
            //   payload: data,
            // });

            dispatch({
              type: SET_CURRENT_PBB,
              payload: {
                ...data,
                batch_id: data?.batch_id?.id ? data?.batch_id : null,
                prod_id: data?.prod_id ?? null,
                proj_id: data?.proj_id ?? null,
                acc_cred: data?.acc_cred,
                // panen_prod: data?.panen_prod?.id ?? null,
                // panen_loc: data?.panen_loc?.id ?? null,
                // acc_cred: data?.acc_cred,
                upah:
                  upah?.length > 0
                    ? upah
                    : [
                        {
                          id: 0,
                          pbb_id: null,
                          acc_id: null,
                          nom_uph: null,
                          desc: null,
                        },
                      ],
                overhead:
                  overhead?.length > 0
                    ? overhead
                    : [
                        {
                          id: 0,
                          pbb_id: null,
                          acc_id: null,
                          nom_ovr: null,
                          desc: null,
                        },
                      ],
                product:
                  product?.length > 0
                    ? product
                    : [
                        {
                          id: 0,
                          pbb_id: null,
                          trn_id: null,
                          prd_id: null,
                          qty: null,
                          aloc: null,
                          aloc_qty: null,
                        },
                      ],
                panen:
                  panen?.length > 0
                    ? panen
                    : [
                        {
                          id: 0,
                          pbb_id: null,
                          trn_id: null,
                          prd_id: null,
                          qty: null,
                          aloc: null,
                        },
                      ],
              },
            });
          }}
          className={`btn btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            // setEdit(true);
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
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            delPBB();
          }}
          autoFocus
          loading={loading}
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
              type: SET_EDIT_PBB,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_PBB,
              payload: {
                ...data,
                type_pb: 1,
                upah: [
                  {
                    id: 0,
                    pbb_id: 0,
                    acc_id: null,
                    nom_uph: null,
                    desc: null,
                  },
                ],
                overhead: [
                  {
                    id: 0,
                    pbb_id: 0,
                    acc_id: null,
                    nom_ovr: null,
                    desc: null,
                  },
                ],
                product: [
                  {
                    id: 0,
                    pbb_id: 0,
                    trn_id: null,
                    prd_id: null,
                    qty: null,
                    aloc: null,
                    aloc_qty: null,
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
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const formatth = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <DataTable value={data?.upah} responsiveLayout="scroll">
          <Column
            header={"Akun Biaya"}
            style={{ width: "20rem" }}
            field={(e) =>
              `${checkAcc(e.acc_id)?.account?.acc_name} - ${
                checkAcc(e.acc_id)?.account?.acc_code
              }`
            }
          />
          <Column header="" style={{ width: "20rem" }} field={(e) => {}} />
          <Column
            header="Nominal Biaya"
            style={{ width: "20rem" }}
            field={(e) => `Rp. ${formatIdr(e.nom_uph)}`}
          />
          <Column
            header={"Keterangan"}
            style={{ width: "20rem" }}
            field={(e) => e.desc ?? "-"}
          />
        </DataTable>

        <div className="col-12 mt-1 fs-12 text-left">
          {data?.type_pb !== 3 ? (
            <label className="text-label">
              <b>Detail Finish Product</b>
            </label>
          ) : (
            <label className="text-label">
              <b>Detail Product</b>
            </label>
          )}
        </div>
        <DataTable
          value={data.type_pb !== 3 ? data?.product : data?.panen}
          responsiveLayout="scroll"
        >
          <Column
            header={"Kode Bukti"}
            style={{ width: "20rem" }}
            field={(e) => checkSt(e.trn_id)?.trx_code || data?.batch_id?.bcode}
          />
          <Column
            header={
              data.type_pb !== 3 ? "Tanggal Produksi" : "Tanggal Transaksi"
            }
            style={{ width: "20rem" }}
            field={(e) =>
              formatDate(
                checkSt(e.trn_id)?.trx_date || data.batch_id?.batch_date
              )
            }
          />
          <Column
            header="Produk"
            style={{ width: "20rem" }}
            field={(e) =>
              `${checkProd(e.prd_id)?.name} (${checkProd(e.prd_id)?.code})`
            }
          />
          <Column
            header="Kuantitas"
            style={{ width: "20rem" }}
            field={(e) => formatth(e.qty)}
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
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : pbb}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["fcode", "fname", "date_created"]}
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
                  header="Tgl Pembebanan"
                  field={(e) => formatDate(e?.pbb_date ? e.pbb_date : "-")}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Pembebanan"
                  field={(e) => e.pbb_code}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Pembebanan"
                  field={(e) => e.pbb_name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Batch"
                  field={(e) => e?.batch_id?.bcode ?? "-"}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />

                <Column
                  header="Departement"
                  field={(e) =>
                    e.type_pb === 1
                      ? checkDept(e?.batch_id?.dep_id)?.ccost_name
                      : "-"
                  }
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                {/* <Column
          header="Akun Kredit"
          field={(e) => e?.acc_cred.acc_name}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        /> */}
                <Column
                  header="Action"
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
    </>
  );
};

export default DataPembebanan;
