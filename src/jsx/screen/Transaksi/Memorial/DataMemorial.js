import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
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
import { SET_CURRENT_MM, SET_EDIT_MM, SET_MM } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Card, Row } from "react-bootstrap";
import { ProgressBar } from "primereact/progressbar";
import { tr } from "src/data/tr";

const data = {
  id: null,
  code: null,
  date: null,
  desc: null,
  memo: [],
};

const DataMemorial = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(null);
  const [account, setAccount] = useState(null);
  const [update, setUpdate] = useState(true);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const picker = useRef(null);
  const progressBar = useRef(null);
  const memorial = useSelector((state) => state.memorial.memorial);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getMemorial();
    progressBar.current.style.display = "none";
    initFilters1();
    getAcc();
  }, []);

  const getMemorial = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.memorial,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        dispatch({ type: SET_MM, payload: data });
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

  const delMM = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delMM,
      endpoint: endpoints.delMM.endpoint + currentItem.id,
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
          getMemorial(true);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].del_berhasil,
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
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].del_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account.acc_code) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];

        setAccount(data);
      }
    } catch (error) {}
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>

      <div className="d-flex">
        <Link
          onClick={() => {
              onEdit(data);
              let memo = data.memo;
              dispatch({
                type: SET_EDIT_MM,
                payload: true,
              });
              memo.forEach((el) => {
                el.acc_id = el.acc_id?.id;
                el.dep_id = el.dep_id?.id ?? null;
                el.currency = el.currency?.id ?? null;
              });
              dispatch({
                type: SET_CURRENT_MM,
                payload: {
                  ...data,
                  memo:
                    memo.length > 0
                      ? memo
                      : [
                          {
                            id: 0,
                            acc_id: null,
                            dep_id: null,
                            currency: null,
                            dbcr: null,
                            amnt: null,
                            amnh: null,
                            desc: null,
                          },
                        ],
                },
              });
          }}
          className={`btn ${
            data.imp === false ? "" : "hidden"
          } btn-primary shadow btn-xs sharp ml-1`}
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
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            delMM();
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

  const addMemoImport = async (data, onSuccess) => {
    const config = {
      ...endpoints.addMemorialImport,
      data: { memo: data },
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        onSuccess();
      }
    } catch ({ error }) {}
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const renderHeader = () => {
    return (
      <Row>
        <div className="flex justify-content-between col-12">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder={tr[localStorage.getItem("language")].cari}
            />
          </span>
          <Row className="mr-1">
            <PrimeSingleButton
              className="mr-3"
              label="Import"
              icon={<i className="pi pi-file-excel px-2"></i>}
              onClick={(e) => {
                confirmImport(e);
              }}
            />
            <PrimeSingleButton
              label={tr[localStorage.getItem("language")].tambh}
              icon={<i class="bx bx-plus px-2"></i>}
              onClick={() => {
                onAdd();
                dispatch({
                  type: SET_EDIT_MM,
                  payload: false,
                });
                dispatch({
                  type: SET_CURRENT_MM,
                  payload: {
                    ...data,
                    memo: [
                      {
                        id: 0,
                        acc_id: null,
                        dep_id: null,
                        currency: null,
                        dbcr: null,
                        amnt: null,
                        amnh: 0,
                        desc: null,
                      },
                    ],
                  },
                });
              }}
            />
          </Row>
        </div>
        <div className="col-12" ref={progressBar}>
          <ProgressBar
            mode="indeterminate"
            style={{ height: "6px" }}
          ></ProgressBar>
        </div>
      </Row>
    );
  };

  const confirmImport = (event) => {
    // console.log(event);
    confirmPopup({
      target: event.currentTarget,
      message: "Anda yakin ingin mengimport ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        picker.current.click();
      },
    });
  };

  const processExcel = (file) => {
    import("xlsx").then((xlsx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = xlsx.read(e.target.result, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        // Prepare DataTable
        const cols = data[0];
        data.shift();

        let new_memorial = [];
        let not_valid = [];
        let accNotValid = [];

        let _importedData = data.map((d) => {
          return cols.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });

        progressBar.current.style.display = "";

        _importedData = _importedData.filter((el) => el?.KODE);

        console.log(_importedData);

        let single = Object.keys(_importedData[0]).some((v) => v === "ACC_D");

        if (single) {
          _importedData.forEach((ek) => {
            let debit = 0;
            let credit = 0;
            let validAccount = 0;
            let memoLength = 0;

            if (ek.KODE) {
              validAccount += checkAcc(ek.ACC_D)?.account?.id ? 1 : 0;
              if (!checkAcc(ek.ACC_D)?.account?.id) {
                accNotValid.push({
                  acc: ek.ACC_D,
                });
              }

              validAccount += checkAcc(ek.ACC_K)?.account?.id ? 1 : 0;
              if (!checkAcc(ek.ACC_K)?.account?.id) {
                accNotValid.push({
                  acc: ek.ACC_K,
                });
              }

              debit = ek.NILAI_D;
              credit = ek.NILAI_K;

              if (debit === credit && validAccount == 2) {
                let date = ek.TGL.split("/");
                new_memorial.push({
                  code: ek.KODE,
                  date: `${date[1]}/${date[0]}/${date[2]}`,
                  desc: ek.DESKRIPSI,
                  memo: [
                    {
                      acc_id: checkAcc(ek.ACC_D)?.account?.id,
                      dep_id: null,
                      currency: null,
                      dbcr: "d",
                      amnt: debit,
                      amnh: 0,
                      desc: ek.DESKRIPSI,
                    },
                    {
                      acc_id: checkAcc(ek.ACC_K)?.account?.id,
                      dep_id: null,
                      currency: null,
                      dbcr: "k",
                      amnt: credit,
                      amnh: 0,
                      desc: ek.DESKRIPSI,
                    },
                  ],
                });
              } else {
                if (debit !== credit) {
                  not_valid.push({
                    kode: ek.KODE,
                    message: "Nominal Belum Balance",
                  });
                }
                if (validAccount !== memoLength) {
                  accNotValid.forEach((e) => {
                    not_valid.push({
                      kode: ek.KODE,
                      message: `Akun ${e.acc} tidak ditemukan`,
                    });
                  });
                }
              }
            }
          });
        } else {
          let grouped = _importedData.filter(
            (el, i) =>
              i === _importedData.findIndex((ek) => el?.KODE === ek?.KODE)
          );
          console.log(grouped);

          grouped?.forEach((el) => {
            let memo = [];
            let debit = 0;
            let credit = 0;
            let validAccount = 0;
            let memoLength = 0;
            _importedData.forEach((ek) => {
              if (el.KODE === ek.KODE) {
                memo.push({
                  acc_id: checkAcc(ek.ACC)?.account?.id,
                  dep_id: null,
                  currency: null,
                  dbcr: ek.DK.toLowerCase(),
                  amnt: ek.NILAI,
                  amnh: 0,
                  desc: ek.DESKRIPSI,
                });
                validAccount += checkAcc(ek.ACC)?.account?.id ? 1 : 0;
                if (!checkAcc(ek.ACC)?.account?.id) {
                  accNotValid.push({
                    acc: ek.ACC,
                  });
                }
                memoLength += 1;
                debit += ek.DK === "D" ? ek.NILAI : 0;
                credit += ek.DK === "K" ? ek.NILAI : 0;
              }
            });
            if (debit === credit && validAccount === memoLength) {
              let date = el.TGL.split("/");
              new_memorial.push({
                code: el.KODE,
                date: `${date[1]}/${date[0]}/${date[2]}`,
                desc: null,
                memo: memo,
              });
            } else {
              if (debit !== credit) {
                not_valid.push({
                  kode: el.KODE,
                  message: "Nominal Belum Balance",
                });
              }
              if (validAccount !== memoLength) {
                accNotValid.forEach((e) => {
                  not_valid.push({
                    kode: el.KODE,
                    message: `Akun ${e.acc} tidak ditemukan`,
                  });
                });
              }
            }
          });
        }

        console.log(new_memorial);

        not_valid.forEach((el) => {
          toast.current.show({
            severity: "error",
            summary: el.kode,
            detail: el.message,
            sticky: true,
          });
        });

        if (new_memorial.length) {
          addMemoImport(
            new_memorial,
            () => {
              setTimeout(() => {
                toast.current.show({
                  severity: "info",
                  summary: "Berhasil",
                  detail: "Data berhasil diimport",
                  life: 3000,
                });
                getMemorial(true);
                // lazyTable.current.refresh()
                picker.current.value = null;
                progressBar.current.style.display = "none";
              }, 1000);
            },
            () => {
              setTimeout(() => {
                toast.current.show({
                  severity: "error",
                  summary: "Gagal",
                  detail: "Gagal melakukan import",
                  life: 3000,
                });
                picker.current.value = null;
                progressBar.current.style.display = "none";
              }, 1000);
            }
          );
        } else {
          setTimeout(() => {
            toast.current.show({
              severity: "error",
              summary: "Gagal",
              detail: "Tidak ada data untuk diimport",
              life: 3000,
            });
            picker.current.value = null;
            progressBar.current.style.display = "none";
          }, 1000);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: tr[localStorage.getItem("language")].hal, value: options.totalRecords },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            {tr[localStorage.getItem("language")].page}{" "}
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
          {options.first} - {options.last} {tr[localStorage.getItem("language")].dari} {options.totalRecords}
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

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <DataTable value={data.memo} responsiveLayout="scroll">
          <Column
            header={tr[localStorage.getItem("language")].akun}
            style={{ width: "31rem" }}
            field={(e) => `${e.acc_id.acc_name} - ${e.acc_id.acc_code}`}
          />
          <Column
            header={tr[localStorage.getItem("language")].dep}
            style={{ width: "24rem" }}
            field={(e) => e.dep_id.ccost_name ?? "-"}
          />
          <Column
            header={tr[localStorage.getItem("language")].sld_memo}
            style={{ width: "15rem" }}
            field={(e) => e.dbcr.toUpperCase()}
          />
          <Column
            header="Nominal"
            style={{ width: "15rem" }}
            field={(e) => formatIdr(e.amnt !== null ? e.amnt : "-")}
          />
          <Column
            header={tr[localStorage.getItem("language")].ket}
            field={(e) => (e.desc !== null ? e.desc : "-")}
            // style={{ minWidth: "8rem" }}
            // body={loading && <Skeleton />}
          />
        </DataTable>
      </div>
    );
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <>
      <ConfirmPopup />
      <Toast ref={toast} />

      <input
        type="file"
        id="file"
        ref={picker}
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: "none" }}
        onChange={(e) => {
          console.log(e.target.value);
          // setFile(e.target.files[0]);
          const file = e.target.files[0];
          processExcel(file);
        }}
      />

      <DataTable
        responsiveLayout="scroll"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        value={loading ? dummy : memorial}
        className="display w-150 datatable-wrapper"
        showGridlines
        rowHover
        header={renderHeader}
        filters={filters1}
        globalFilterFields={["code"]}
        emptyMessage={tr[localStorage.getItem("language")].empty_data}
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        paginatorClassName="justify-content-end mt-3"
      >
        <Column expander style={{ width: "3em" }} />
        <Column
          header={tr[localStorage.getItem("language")].kd_memo}
          style={{
            minWidth: "4rem",
          }}
          field={(e) => e.code}
          body={loading && <Skeleton />}
        />
        <Column
          header={tr[localStorage.getItem("language")].tgl}
          field={(e) => formatDate(e.date)}
          style={{ minWidth: "4rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header={tr[localStorage.getItem("language")].ket}
          field={(e) => (e.desc !== null ? e.desc : "-")}
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

      <Dialog
        header={`${tr[localStorage.getItem("language")].hapus} ${tr[localStorage.getItem("language")].memo}`}
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
          <span>{tr[localStorage.getItem("language")].pesan_hapus}</span>
        </div>
      </Dialog>
    </>
  );
};

export default DataMemorial;
