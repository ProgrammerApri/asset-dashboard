import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge, Button, Card, Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SA_INV, SET_SA_INV } from "src/redux/actions";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ProgressBar } from "primereact/progressbar";

const data = {
  id: null,
  loc_id: null,
  prod_id: null,
  qty: null,
  nilai: null,
  total: null,
};

const SaldoAwalInv = () => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [produk, setProduk] = useState(null);
  const [perLocation, setPerLocation] = useState(null);
  const [comp, setComp] = useState(null);
  const [grup, setGrup] = useState(null);
  const [account, setAccount] = useState(null);
  const [saAcc, setSaAcc] = useState(null);
  const [salGl, setSalGl] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sa.sa_inv);
  const sa = useSelector((state) => state.sa.curr_sa_inv);
  const printPage = useRef(null);
  const [displayLoad, setDisplayLoad] = useState(false);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSaldo();
    getLoc();
    getComp();
    getGrup();
    // getAccount();
    // getSalGl();
    getProduct();
    initFilters1();
  }, []);

  const getSaldo = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.saldo_sa_inv,
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
        dispatch({ type: SET_SA_INV, payload: data });
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

  // const getSalGl = async () => {
  //   const config = {
  //     ...endpoints.saldo,
  //     base_url: connectUrl,
  //     data: {},
  //   };
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       const { data } = response;
  //       setSalGl(data);
  //     }
  //   } catch (error) {}
  // };

  // const getAccount = async () => {
  //   const config = {
  //     ...endpoints.account,
  //     data: {},
  //   };
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       const { data } = response;
  //       let filt = [];
  //       data.forEach((element) => {
  //         if (
  //           element.klasifikasi.id === 1 ||
  //           element.klasifikasi.id === 2 ||
  //           element.klasifikasi.id === 3
  //         ) {
  //           if (element.account.dou_type === "D") {
  //             filt.push({
  //               acc_year: null,
  //               acc_month: null,
  //               acc_code: element.account.acc_code,
  //               acc_awal: 0,
  //             });
  //           }
  //         }
  //       });
  //       setSaAcc(filt);
  //       setAccount(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getGrup = async () => {
    const config = {
      ...endpoints.groupPro,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setGrup(data);
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
        setComp(data);
      }
    } catch (error) {}
  };

  const getLoc = async () => {
    const config = {
      ...endpoints.lokasi,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setLokasi(data);
        // getProduct();
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
      console.log(response);
      if (response.status) {
        const { data } = response;

        setProduk(data);
      }
    } catch (error) {}
  };

  const addSaldo = async () => {
    const config = {
      ...endpoints.add_sa_inv,
      data: sa,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setDisplayData(false);
          setUpdate(false);
          getSaldo(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
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
    }
  };

  const checkAcc = (value) => {
    let selected = {};
    console.log(value);
    account?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const check = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account.acc_code) {
        selected = element;
        // console.log(selected);
      }
    });

    return selected;
  };

  // const transferSal = async (isNew = false) => {
  //   setDisplayLoad(true);
  //   let acc = [];
  //   let tot = 0;
  //   let ac_sto = [];
  //   let grouped = grup?.filter(
  //     (el, i) => i === grup.findIndex((ek) => el?.acc_sto === ek?.acc_sto)
  //   );

  //   grouped.forEach((el) => {
  //     grup?.forEach((elem) => {
  //       show?.forEach((element) => {
  //         if (!comp.gl_detail) {
  //           if (
  //             element.prod_id.group === elem.groupPro.id &&
  //             el.acc_sto === elem.acc_sto
  //           ) {
  //             ac_sto = checkAcc(elem.groupPro.acc_sto)?.account?.acc_code;
  //           }
  //         } else {
  //           ac_sto = checkAcc(element.prod_id.acc_sto)?.account?.acc_code;
  //         }
  //         tot += element.total;
  //       });
  //     });

  //     if (isNew) {
  //       acc = [];
  //       saAcc.forEach((el) => {
  //         if (el.acc_code === ac_sto) {
  //           acc.push({
  //             acc_year: new Date().getFullYear(),
  //             acc_month: comp?.cutoff,
  //             acc_code: ac_sto,
  //             acc_awal: tot,
  //           });
  //         } else {
  //           acc.push({
  //             ...el,
  //             acc_year: new Date().getFullYear(),
  //             acc_month: comp?.cutoff,
  //           });
  //         }
  //       });
  //     } else {
  //       acc.push({
  //         acc_year: new Date().getFullYear(),
  //         acc_month: comp?.cutoff,
  //         acc_code: ac_sto,
  //         acc_awal: tot,
  //       });
  //     }
  //   });

  //   const config = {
  //     ...endpoints.addSal,
  //     base_url: connectUrl,
  //     data: {
  //       acc: acc,
  //     },
  //   };
  //   console.log(config.data);
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       setTimeout(() => {
  //         setDisplayLoad(false);
  //         getSaldo(true, false);
  //         getSalGl();
  //         toast?.current?.show({
  //           severity: "info",
  //           summary: "Berhasil",
  //           detail: "Data berhasil ditransfer",
  //           life: 3000,
  //         });
  //       }, 500);
  //     }
  //   } catch (error) {
  //     setTimeout(() => {
  //       setDisplayLoad(false);
  //       setUpdate(false);
  //       toast?.current?.show({
  //         severity: "error",
  //         summary: "Gagal",
  //         detail: "Gagal mentransfer data",
  //         // sticky: true,
  //         life: 3000,
  //       });
  //     }, 500);
  //   }
  // };

  // const transferSalEdit = async () => {
  //   setDisplayLoad(true);
  //   let acc = [];
  //   let tot = 0;
  //   let ac_sto = [];
  //   let grouped = grup?.filter(
  //     (el, i) => i === grup.findIndex((ek) => el?.acc_sto === ek?.acc_sto)
  //   );

  //   grouped.forEach((el) => {
  //     if (!comp.gl_detail) {
  //       grup?.forEach((elem) => {
  //         show?.forEach((element) => {
  //           if (
  //             element.prod_id.group === elem.groupPro.id &&
  //             el.acc_sto === elem.acc_sto
  //           ) {
  //             ac_sto = checkAcc(elem.groupPro.acc_sto)?.account?.acc_code;
  //             tot += element.total;
  //           }
  //         });
  //       });
  //     } else {
  //       show?.forEach((element) => {
  //         if (el.acc_sto === element.acc_sto) {
  //           ac_sto = checkAcc(element.prod_id.acc_sto)?.account?.acc_code;
  //           tot += element.total;
  //         }
  //       });
  //     }

  //     salGl.forEach((ek) => {
  //       if (ek.acc_code === ac_sto) {
  //         acc.push({
  //           id: ek.id,
  //           acc_year: new Date().getFullYear(),
  //           acc_month: comp?.cutoff,
  //           acc_code: ac_sto,
  //           acc_awal: tot,
  //         });
  //       }
  //     });
  //   });
  //   const config = {
  //     ...endpoints.editSal,
  //     base_url: connectUrl,
  //     data: {
  //       acc: acc,
  //     },
  //   };
  //   console.log(config.data);
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       setTimeout(() => {
  //         setDisplayLoad(false);
  //         setUpdate(false);
  //         getSaldo(true, false);
  //         getSalGl();
  //         toast?.current?.show({
  //           severity: "info",
  //           summary: "Berhasil",
  //           detail: "Data berhasil ditransfer",
  //           life: 3000,
  //         });
  //       }, 500);
  //     }
  //   } catch (error) {
  //     setTimeout(() => {
  //       setUpdate(false);
  //       setDisplayLoad(false);
  //       toast?.current?.show({
  //         severity: "error",
  //         summary: "Gagal",
  //         detail: "Gagal mentransfer data",
  //         // sticky: true,
  //         life: 3000,
  //       });
  //     }, 500);
  //   }
  // };

  // const confirmImport = (event) => {
  //   // console.log(event);
  //   confirmPopup({
  //     target: event?.currentTarget,
  //     message: "Anda yakin ingin melakukan transfer ?",
  //     icon: "pi pi-exclamation-triangle",
  //     accept: () => {
  //       let ac_sto = null;
  //       let sal = false;
  //       let grouped = grup?.filter(
  //         (el, i) => i === grup.findIndex((ek) => el?.acc_sto === ek?.acc_sto)
  //       );
  //       grouped.forEach((ek) => {
  //         grup?.forEach((elem) => {
  //           show?.forEach((element) => {
  //             if (!comp.gl_detail) {
  //               if (
  //                 element.prod_id.group === elem.groupPro.id &&
  //                 ek.acc_sto === elem.acc_sto
  //               ) {
  //                 ac_sto = checkAcc(elem.groupPro?.acc_sto)?.account?.acc_code;
  //               }
  //             } else {
  //               ac_sto = checkAcc(element.prod_id?.acc_sto)?.account?.acc_code;
  //             }
  //             console.log("=================");
  //             console.log(element);
  //           });
  //         });
  //       });
  //       salGl.forEach((ek) => {
  //         sal = ek?.acc_code === ac_sto;
  //       });

  //       if (salGl.some((v) => v?.acc_code === ac_sto)) {
  //         transferSalEdit();
  //       } else {
  //         transferSal(salGl.length === 0);
  //       }
  //     },
  //   });
  // };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            // onEdit(data);
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
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            // delODR();
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

        <Row className="mr-1">
          <PrimeSingleButton
            className="mr-3"
            label="Tambah"
            icon={<i class="bx bx-plus px-2"></i>}
            onClick={() => {
              setDisplayData(true);
              dispatch({
                type: SET_CURRENT_SA_INV,
                payload: data,
              });
            }}
          />
          {/* <PrimeSingleButton
            label="Transfer To GL"
            icon={<i class="bx bx-transfer-alt px-2"></i>}
            onClick={(e) => {
              confirmImport(e);
            }}
            hidden={localStorage.getItem("product") !== "inv+gl"}
          /> */}
        </Row>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label="Batal"
            onClick={() => setDisplayData(false)}
            className="p-button-text btn-primary"
          />
          <PButton
            label="Simpan"
            icon="pi pi-check"
            onClick={() => onSubmit()}
            autoFocus
            loading={update}
          />
        </div>
      </div>
    );
  };

  const onSubmit = () => {
    setUpdate(true);
    addSaldo();
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

  const formatTh = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const updateSA = (e) => {
    dispatch({
      type: SET_CURRENT_SA_INV,
      payload: e,
    });
  };

  const checkLoc = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
      if (value === element?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkProd = (value) => {
    let selected = {};
    produk?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name} - ${option.code}` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const prdTemplate = (option) => {
    return (
      <div>{option !== null ? `${option.name} - ${option.code}` : ""}</div>
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
                value={loading ? dummy : show}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["loc_id.name", "prod_id.code"]}
                emptyMessage="Tidak ada data"
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header="Lokasi"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.loc_id?.name}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Produk"
                  field={(e) => `${e.prod_id?.code} - (${e.prod_id?.name})`}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Qty"
                  field={(e) => formatTh(e.qty) ?? "-"}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nilai"
                  field={(e) => `Rp. ${formatIdr(e?.nilai)}`}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Total"
                  field={(e) => `Rp. ${formatIdr(e?.total)}`}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                {/* <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                /> */}
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={"Saldo Awal"}
        visible={displayData}
        style={{ width: "50vw" }}
        footer={renderFooter()}
        onHide={() => {
          setDisplayData(false);
        }}
      >
        <div className="row ml-0 mb-3">
          <div className="col-12">
            <PrimeDropdown
              label={"Lokasi Persediaan"}
              options={lokasi}
              value={sa?.loc_id && checkLoc(sa?.loc_id)}
              onChange={(e) => {
                setPerLocation(
                  produk?.filter(
                    (el) =>
                      !show
                        ?.filter((ek) => ek.loc_id?.id === e.value?.id)
                        .some((v) => el?.id === v.prod_id?.id)
                  )
                );

                updateSA({
                  ...sa,
                  loc_id: e?.value?.id ?? null,
                });
                console.log(sa?.loc_id);
              }}
              filter
              filterBy="name"
              optionLabel="name"
              placeholder="Pilih Lokasi"
            />
          </div>

          <div className="col-6">
            <PrimeDropdown
              label={"Kode Produk"}
              options={perLocation}
              value={checkProd(sa?.prod_id)}
              onChange={(e) => {
                updateSA({
                  ...sa,
                  prod_id: e.value?.id ?? null,
                });
              }}
              filter
              filterBy="name"
              optionLabel="name"
              itemTemplate={prdTemplate}
              valueTemplate={valTemp}
              placeholder="Pilih Kode Produk"
            />
          </div>

          <div className="col-6">
            <PrimeNumber
              prc
              label={"Qty"}
              value={sa?.qty}
              onChange={(e) => {
                let total = e.value * sa?.nilai;
                updateSA({
                  ...sa,
                  qty: e.value,
                  total: total,
                });
              }}
              placeholder="0"
              type="number"
              min={0}
            />
          </div>

          <div className="col-6">
            <PrimeNumber
              label={"Nilai"}
              price
              value={sa?.nilai}
              onChange={(e) => {
                let total = e.value * sa?.qty;
                updateSA({
                  ...sa,
                  nilai: e.value,
                  total: total,
                });
              }}
              placeholder="0"
              min={0}
            />
          </div>

          <div className="col-6">
            <PrimeNumber
              label={"Total"}
              price
              value={sa?.total ?? 0}
              onChange={(e) => {
                // let temp = sa;
                // temp[e.index].nilai = e.value;
                // temp[e.index].total = temp[e.index].nilai * temp[e.index].qty;
                // updateSA(temp);
              }}
              placeholder="0"
              disabled
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={displayLoad}
        style={{ width: "25vw" }}
        footer
        closable={false}
      >
        <div>
          <ProgressBar mode="indeterminate"></ProgressBar>
        </div>
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
    </>
  );
};

export default SaldoAwalInv;
