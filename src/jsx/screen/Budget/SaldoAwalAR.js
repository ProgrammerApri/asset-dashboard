import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
import {
  SET_CURRENT_SA_AR,
  SET_EDIT_SA_AR,
  SET_SA_AR,
} from "src/redux/actions";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import endpoints from "../../../utils/endpoints";
import PrimeCalendar from "../../components/PrimeCalendar/PrimeCalendar";
import { ProgressBar } from "primereact/progressbar";

const data = {
  id: null,
  cus_id: null,
  code: null,
  date: null,
  type: null,
  nilai: null,
};

const defError = {
  code: false,
  date: false,
  cus: false,
  tipe: false,
  nil: false,
};

const tipe = [{ code: "JL" }, { code: "ND" }, { code: "NK" }];

const SaldoAwalAR = () => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [perLocation, setPerLocation] = useState(null);
  const [comp, setComp] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [currency, setCur] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sa.sa_ar);
  const sar = useSelector((state) => state.sa.curr_sa_ar);
  const isEdit = useSelector((state) => state.sa.edit_sa_ar);
  const [error, setError] = useState(defError);
  const printPage = useRef(null);
  const [salGl, setSalGl] = useState(null);
  const [account, setAccount] = useState(null);
  const [displayLoad, setDisplayLoad] = useState(false);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSaldo();
    getComp();
    getCus();
    // getSalGl();
    // getAccount();
    initFilters1();
  }, []);

  // const getSalGl = async () => {
  //   const config = {
  //     ...endpoints.saldo,
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

  const getSaldo = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.saldo_sa_ar,
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
        dispatch({ type: SET_SA_AR, payload: data });
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
  //       setAccount(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getCus = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCustomer(data);
        getCurrency();
      }
    } catch (error) {}
  };

  const getCurrency = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCur(data);
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

  const addSaldo = async () => {
    const config = {
      ...endpoints.addSA_ar,
      data: sar,
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

  const editSaldo = async () => {
    const config = {
      ...endpoints.editSA_ar,
      endpoint: endpoints.editSA_ar.endpoint + sar.id,
      data: sar,
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

  const delSaldo = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delSA_ar,
      endpoint: endpoints.delSA_ar.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        dispatch({ type: SET_SA_AR, payload: [] });
        getSaldo(true);
        setTimeout(() => {
          setUpdate(false);
          setDisplayDel(false);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Dihapus",
            life: 3000,
          });
        }, 100);
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

  // const transferSal = async (isNew = false) => {
  //   setDisplayLoad(true);
  //   let acc = [];
  //   let tot = 0;
  //   let acc_ar = null;
  //   let grouped = show?.filter(
  //     (el, i) =>
  //       i === show.findIndex((ek) => el?.cus_id.cus_gl === ek?.cus_id.cus_gl)
  //   );

  //   grouped.forEach((el) => {
  //     show.forEach((ek) => {
  //       if (el.cus_id.cus_gl == ek.cus_id.cus_gl) {
  //         acc_ar = checkAcc(ek.cus_id.cus_gl)?.account?.acc_code;
  //         if (ek.type === "NK") {
  //           tot -= ek.nilai;
  //         } else {
  //           tot += ek.nilai;
  //         }
  //       }
  //     });

  //     salGl.forEach((ek) => {
  //       if (ek.acc_code === acc_ar) {
  //         acc.push({
  //           id: ek.id,
  //           acc_year: comp?.year_co,
  //           acc_month: comp?.cutoff,
  //           acc_code: acc_ar,
  //           acc_awal: tot,
  //         });
  //       }
  //     });
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
  //         getSaldo(true, false);
  //         getSalGl();
  //         toast?.current?.show({
  //           severity: "info",
  //           summary: "Berhasil",
  //           detail: "Data berhasil ditransfer",
  //           life: 3000,
  //         });
  //         setDisplayLoad(false);
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

  // const transferSalEdit = async () => {
  //   setDisplayLoad(true);
  //   let acc = [];
  //   let tot = 0;
  //   let acc_ar = null;
  //   let grouped = show?.filter(
  //     (el, i) =>
  //       i === show.findIndex((ek) => el?.cus_id.cus_gl === ek?.cus_id.cus_gl)
  //   );

  //   grouped.forEach((el) => {
  //     show.forEach((ek) => {
  //       if (el.cus_id.cus_gl == ek.cus_id.cus_gl) {
  //         acc_ar = checkAcc(ek.cus_id.cus_gl)?.account?.acc_code;
  //         if (ek.type === "NK") {
  //           tot -= ek.nilai;
  //         } else {
  //           tot += ek.nilai;
  //         }
  //       }
  //     });

  //     salGl.forEach((ek) => {
  //       if (ek.acc_code === acc_ar) {
  //         acc.push({
  //           id: ek.id,
  //           acc_year: comp?.year_co,
  //           acc_month: comp?.cutoff,
  //           acc_code: acc_ar,
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

  // const confirmImport = (event) => {
  //   // console.log(event);
  //   confirmPopup({
  //     target: event?.currentTarget,
  //     message: "Anda yakin ingin melakukan transfer ?",
  //     icon: "pi pi-exclamation-triangle",
  //     accept: () => {
  //       let acc_ar = null;

  //       let grouped = show?.filter(
  //         (el, i) =>
  //           i ===
  //           show.findIndex((ek) => el?.cus_id.cus_gl === ek?.cus_id.cus_gl)
  //       );

  //       grouped.forEach((el) => {
  //         show.forEach((ek) => {
  //           if (el.cus_id.cus_gl == ek.cus_id.cus_gl) {
  //             acc_ar = checkAcc(ek.cus_id.cus_gl)?.account?.acc_code;
  //           }
  //         });
  //       });

  //       if (salGl.some((v) => v?.acc_code === acc_ar)) {
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
            setDisplayData(data);
            dispatch({
              type: SET_EDIT_SA_AR,
              payload: true,
            });
            dispatch({
              type: SET_CURRENT_SA_AR,
              payload: {
                ...data,
                cus_id: data?.cus_id?.id ?? null,
              },
            });
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
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
            delSaldo();
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
              // dispatch({
              //   type: SET_EDIT_SA_AR,
              //   payload: false,
              // }),
              dispatch({
                type: SET_EDIT_SA_AR,
                payload: false,

                type: SET_CURRENT_SA_AR,
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

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !sar.code || sar.code === "",
      date: !sar.date || sar.date === "",
      cus: !sar.cus_id,
      tipe: !sar.type,
      nil: !sar.nilai || sar.nilai === "" || sar.nilai === 0,
    };

    setError(errors);

    valid =
      !errors.code &&
      !errors.date &&
      !errors.cus &&
      !errors.tipe &&
      !errors.nil;

    return valid;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editSaldo();
      } else {
        setUpdate(true);
        addSaldo();
      }
    }
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

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checktype = (value) => {
    let selected = {};
    tipe?.forEach((element) => {
      if (value === element.code) {
        selected = element;
      }
    });

    return selected;
  };

  const cur = (value) => {
    let selected = {};
    currency?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const iTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.customer?.cus_name}  (${option.customer?.cus_code})`
          : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.customer?.cus_name} (${option.customer?.cus_code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const updateSAR = (e) => {
    dispatch({
      type: SET_CURRENT_SA_AR,
      payload: e,
    });
  };

  let date = new Date(comp?.year_co, comp?.cutoff - 1, 31);

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
                globalFilterFields={["sup_id.name", "code"]}
                emptyMessage="Tidak ada data"
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header="Customer"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) =>
                    `${e?.cus_id?.cus_name} (${e?.cus_id?.cus_code})`
                  }
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Bukti"
                  field={(e) => e.code}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Tanggal Bukti"
                  field={(e) => formatDate(e?.date)}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Jatuh Tempo"
                  field={(e) => formatDate(e?.due_date)}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Jenis"
                  field={(e) =>
                    e.type == "JL"
                      ? "Jual"
                      : e.type === "ND"
                      ? "Nota Debit"
                      : "Nota Kredit"
                  }
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nilai"
                  field={(e) => `Rp. ${formatIdr(e.nilai)}`}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "1rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={"Saldo Awal A/R"}
        visible={displayData}
        style={{ width: "50vw" }}
        footer={renderFooter()}
        onHide={() => {
          setDisplayData(false);
        }}
      >
        <div className="row ml-0">
          <div className="col-4  mb-3">
            <PrimeDropdown
              label={"Customer"}
              options={customer}
              value={sar?.cus_id !== null ? checkCus(sar?.cus_id) : null}
              onChange={(e) => {
                updateSAR({
                  ...sar,
                  cus_id: e.value.customer.id,
                });

                let newError = error;
                newError.cus = false;
                setError(newError);
              }}
              filter
              filterBy="customer.cus_name"
              optionLabel="customer.cus_name"
              itemTemplate={iTemplate}
              valueTemplate={valTemp}
              placeholder="Pilih Customer"
              errorMessage="Customer Belum Dipilih"
              error={error?.cus}
            />
          </div>

          <div className="col-8 mb-3"></div>

          <div className="col-4">
            <PrimeInput
              label={"Kode Bukti"}
              value={sar?.code}
              onChange={(e) => {
                updateSAR({
                  ...sar,
                  code: e.target.value,
                });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Bukti"
              error={error?.code}
            />
          </div>

          <div className="col-4">
            <PrimeCalendar
              label={"Tanggal Bukti"}
              value={new Date(`${sar.date}Z`)}
              onChange={(e) => {
                updateSAR({
                  ...sar,
                  date: e.value,
                });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              showIcon
              placeholder="Tanggal Bukti"
              dateFormat={"dd-mm-yy"}
              maxDate={date}
              error={error?.date}
            />
          </div>

          <div className="col-4">
            <PrimeCalendar
              label={"Due Date"}
              value={new Date(`${sar.due_date}Z`)}
              onChange={(e) => {
                updateSAR({
                  ...sar,
                  due_date: e.value,
                });
              }}
              showIcon
              placeholder="Due Date"
              dateFormat={"dd-mm-yy"}
            />
          </div>

          <div className="col-4">
            <PrimeDropdown
              label={"Jenis Saldo"}
              options={tipe}
              value={sar?.type && checktype(sar?.type)}
              onChange={(e) => {
                updateSAR({
                  ...sar,
                  type: e.value.code,
                });

                let newError = error;
                newError.tipe = false;
                setError(newError);
              }}
              filter
              filterBy="code"
              optionLabel="code"
              placeholder="Pilih Jenis"
              errorMessage="Jenis Trans Belum Dipilih"
              error={error?.tipe}
            />
          </div>

          <div className="col-4">
            <PrimeNumber
              label={"Nilai"}
              price
              value={sar?.nilai}
              onChange={(e) => {
                updateSAR({
                  ...sar,
                  nilai: e.value,
                  fc:
                    checkCus(sar.cus_id)?.customer?.cus_curren !== null
                      ? e.value /
                        cur(checkCus(sar?.cus_id)?.customer?.cus_curren)?.rate
                      : null,
                });

                let newError = error;
                newError.nil = false;
                setError(newError);
              }}
              placeholder="0"
              error={error?.nil}
            />
          </div>

          <div
            className="col-4"
            hidden={
              sar?.cus_id === null ||
              checkCus(sar.cus_id)?.customer?.cus_curren === null
            }
          >
            <PrimeNumber
              label={"Foreign Currency"}
              price
              value={sar?.fc}
              onChange={(e) => {}}
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

export default SaldoAwalAR;
