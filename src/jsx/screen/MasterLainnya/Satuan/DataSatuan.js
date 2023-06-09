import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { TabView, TabPanel } from "primereact/tabview";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Divider, Icon } from "@material-ui/core";
import { Badge } from "react-bootstrap";
import { Badge as PBadge } from "primereact/badge";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { tr } from "src/data/tr";

const def = {
  id: 0,
  code: null,
  name: null,
  type: "d",
  desc: null,
  active: true,
  qty: 1,
  u_from: null,
  u_to: null,
};

const defError = {
  code: false,
  name: false,
  konv: [
    {
      qty: false,
      s_big: false,
      s_small: false,
    },
  ],
};

const DataSatuan = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [satuan, setSatuan] = useState(null);
  const [satuanDasar, setSatuanDasar] = useState(null);
  const [satuanKonversi, setSatuanKonversi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(def);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState(defError);
  const [konversi, setKonversi] = useState([
    {
      id: 0,
      qty: 1,
      u_from: null,
      u_to: null,
    },
  ]);

  useEffect(() => {
    getSatuan();
    initFilters1();

    window.addEventListener("scroll", handleScroll);

    // Hapus event listener saat komponen tidak lagi digunakan
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getSatuan = async (isUpdate = false) => {
    // setLoading(true);
    const config = {
      ...endpoints.getSatuan,
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
        setSatuan(data);
        let dasar = [];
        data.forEach((el) => {
          if (el.type === "d") {
            dasar.push(el);
          }
        });
        setSatuanDasar(dasar);
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

  const editSatuan = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.updateSatuan,
      endpoint: endpoints.updateSatuan.endpoint + currentItem.id,
      data: { ...currentItem, konversi: konversi },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setLoading(false);
          onHideInput();
          onInput(false);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const addSatuan = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.addSatuan,
      data: { ...currentItem, konversi: konversi },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setLoading(false);
          onHideInput();
          onInput(false);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode Project ${currentItem.proj_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: tr[localStorage.getItem("language")].pesan_gagal,
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const delSatuan = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.deleteSatuan,
      endpoint: endpoints.deleteSatuan.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setLoading(false);
          setShowDelete(false);
          onSuccessInput();
          onInput(false);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].del_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        setShowDelete(false);
        onInput(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].del_gagal,
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
            setEdit(true);
            onClick("showInput", data);
            if (data.type == "k") {
              let conv = [];
              satuan.forEach((el) => {
                if (el.code == data.code) {
                  conv.push({
                    id: el?.id,
                    qty: el?.qty,
                    u_from: el.u_from?.id,
                    u_to: el.u_to?.id,
                  });
                }
              });
              setKonversi(conv);
            } else {
              setKonversi([
                {
                  id: 0,
                  qty: 1,
                  u_from: null,
                  u_to: null,
                },
              ]);
            }
            setCurrentItem(data);
            setShowInput(true);
            onInput(true);
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setCurrentItem(data);
            setShowDelete(true);
            onInput(true);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };
  const scrollToTop = () => {
    // Menggulir halaman ke bagian atas
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const handleScroll = () => {
    const scrollButton = document.getElementById("myBtn");
    if (scrollButton) {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        scrollButton.style.display = "block";
      } else {
        scrollButton.style.display = "none";
      }
    }
  };

  const onClick = () => {
    setShowInput(true);
    setCurrentItem();

    if (position) {
      setPosition(position);
    }
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setLoading(true);
        editSatuan();
      } else {
        setLoading(true);
        addSatuan();
      }
    }
  };

  const isValid = () => {
    let valid = false;

    let errors = {
      code: !currentItem.code || currentItem.code === "",
      name: !currentItem.name || currentItem.name === "",
      konv: [],
    };

    if (currentItem.type === "k") {
      konversi.forEach((el, i) => {
        console.log(el);
        if (i > 0) {
          if (el.u_to || el.u_from) {
            errors.konv.push({
              qty: !el.qty || el.qty <= 0,
              s_big: !el.u_to,
              s_small: !el.u_from,
            });
          } else {
            errors.konv[i] = error.konv[i];
          }
        } else {
          errors.konv.push({
            qty: !el.qty || el.qty <= 0,
            s_big: !el.u_to,
            s_small: !el.u_from,
          });
        }
      });
    } else {
      errors.konv = error.konv;
    }

    for (var key in errors) {
      if (key !== "konv") {
        valid = !errors[key];
      }
    }

    let validKonv = false;

    errors.konv.forEach((el) => {
      for (var k in el) {
        validKonv = !el[k];
      }
    });

    valid = valid && validKonv;

    setError(errors);

    return valid;
  };

  const renderFooter = () => {
    return (
      <div className="mt-3">
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            onHideInput();
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].simpan}
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            setShowDelete(false);
            setLoading(false);
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            setLoading(true);
            delSatuan();
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
            placeholder={tr[localStorage.getItem("language")].cari}
          />
        </span>
        <PrimeSingleButton
          label={tr[localStorage.getItem("language")].tambh}
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            setEdit(false);
            setCurrentItem(def);
            setKonversi([
              {
                id: 0,
                qty: 1,
                u_from: null,
                u_to: null,
              },
            ]);
            setShowInput(true);
            onInput(true);
            setLoading(false);
          }}
        />
      </div>
    );
  };

  const template2 = {
    layout:
      "RowsPerPageDropdown CurrentPageReport PrevPageLink  NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        {
          label: tr[localStorage.getItem("language")].hal,
          value: options.totalRecords,
        },
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
          {options.first} - {options.last}{" "}
          {tr[localStorage.getItem("language")].dari} {options.totalRecords}
        </span>
      );
    },

    // Top: () => {
    //   return (
    //     <div>
    //       <Button onClick={scrollToTop} id="myBtn" title="Ke atas">
    //         Ke atas
    //       </Button>
    //     </div>
    //   );
    // },
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const checkUnit = (value) => {
    let selected = {};
    satuan.forEach((el) => {
      if (value === el.id) {
        selected = el;
      }
    });

    return selected;
  };

  const onHideInput = () => {
    setLoading(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
    setError(defError);
  };
  function topFunction() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const renderBody = () => {
    return (
      <>
        <Toast ref={toast} />

        <DataTable
          responsiveLayout="scroll"
          value={data}
          className="display w-150 datatable-wrapper header-white"
          showGridlines
          dataKey="id"
          rowHover
          header={renderHeader}
          rowGroupMode="subheader"
          rowGroupHeaderTemplate={(e) =>
            load ? (
              <Skeleton />
            ) : (
              <PBadge className="mt-2 active" value={`${e?.name}`}></PBadge>
            )
          }
          groupRowsBy="name"
          filters={filters1}
          globalFilterFields={["code", "name", "status", "ket"]}
          emptyMessage={tr[localStorage.getItem("language")].empty_data}
          paginator
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          onPage={onCustomPage2}
          paginatorClassName="justify-content-end mt-3"
          selectionMode="single"
          onRowSelect={onRowSelect}
        >
          {/* <Column
                  header="Kode Satuan"
                  style={{
                    minWidth: "8rem",
                  }}
                  field="code"
                  body={loading && <Skeleton />}
                /> */}
          <Column
            header={tr[localStorage.getItem("language")].kd_sat}
            field="code"
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].qty}
            field={(e) => e?.qty ?? "-"}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].sat_besar}
            field={(e) => e?.u_to?.code ?? e.code}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].sat_kecil}
            field={(e) => e?.u_from?.code ?? e.code}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].sts}
            style={{ minWidth: "8rem" }}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : e.type == "d" ? (
                <Badge variant="warning light"> Dasar</Badge>
              ) : (
                <Badge variant="info light"> Konversi</Badge>
              )
            }
          />
          <Column
            header="Action"
            dataType="boolean"
            bodyClassName="text-center"
            field="code"
            style={{ minWidth: "2rem" }}
            body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
          />
        </DataTable>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            onClick={scrollToTop}
            id="myBtn"
            title="Ke atas"
            style={{ display: "none" }}
            className="p-button-text p-button-plain"
          >
            <Icon className="pi pi-chevron-up" />
          </Button>
        </div>
      </>
    );
  };

  const renderDialog = () => {
    return (
      <>
        <Dialog
          header={
            isEdit
              ? `${tr[localStorage.getItem("language")].edit} ${
                  tr[localStorage.getItem("language")].sat
                }`
              : `${tr[localStorage.getItem("language")].tambh} ${
                  tr[localStorage.getItem("language")].sat
                }`
          }
          visible={showInput}
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => {
            onHideInput();
            onInput(false);
          }}
        >
          <div className="row mr-0 ml-0">
            <div className="col-6">
              <PrimeInput
                label={tr[localStorage.getItem("language")].kd_sat}
                value={currentItem !== null ? currentItem.code : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, code: e.target.value });
                  setError({ ...error, code: false });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                error={error.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={tr[localStorage.getItem("language")].nm_sat}
                value={currentItem !== null ? currentItem.name : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, name: e.target.value });
                  setError({ ...error, code: false });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                error={error.name}
              />
            </div>
          </div>

          <div className="col-12">
            <label className="text-label">
              {tr[localStorage.getItem("language")].ket}
            </label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentItem !== null ? currentItem.desc : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, desc: e.target.value });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
              />
            </div>
          </div>

          <div className="d-flex col-12 align-items-center">
            <InputSwitch
              className="mr-3"
              inputId="email"
              checked={currentItem && currentItem.active}
              onChange={(e) => {
                setCurrentItem({ ...currentItem, active: e.value });
              }}
            />
            <label className="mr-3 mt-1" htmlFor="email">
              {tr[localStorage.getItem("language")].aktif}
            </label>
          </div>
          <div className="d-flex col-12 align-items-center">
            <InputSwitch
              className="mr-3"
              inputId="email"
              checked={currentItem && currentItem.type == "d"}
              onChange={(e) => {
                setCurrentItem({
                  ...currentItem,
                  type: e.value ? "d" : "k",
                });
                if (!e.value) {
                  setKonversi([
                    {
                      id: 0,
                      qty: 1,
                      u_from: null,
                      u_to: null,
                    },
                  ]);
                }
              }}
            />
            <label className="mr-3 mt-1" htmlFor="email">
              {tr[localStorage.getItem("language")].sat_dasar}
            </label>
          </div>

          {currentItem && currentItem.type == "k" && (
            <>
              <h4 className="mt-4 ml-3 mr-3">
                <b>{tr[localStorage.getItem("language")].konver}</b>
              </h4>
              <Divider className="mb-2 ml-3 mr-3"></Divider>

              <div className="row ml-0 mr-0 mb-0">
                <div className="col-3">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].qty}
                  </label>
                </div>

                <div className="col-4">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].sat_besar}
                  </label>
                </div>

                <div className="ml-1"> </div>

                <div className="col-4">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].sat_kecil}
                  </label>
                </div>

                <div className="d-flex">
                  <div className="mt-5"></div>
                </div>
              </div>

              {konversi.map((v, i) => {
                return (
                  <div className="row ml-0 mr-0">
                    <div className="col-3">
                      <div className="p-inputgroup">
                        <InputNumber
                          value={v.qty}
                          onChange={(e) => {
                            let temp = konversi;
                            temp[i].qty = e.value;
                            setKonversi(temp);
                            let newKonv = error.konv;
                            newKonv[i].qty = false;
                            setError({ ...error, konv: newKonv });
                          }}
                          placeholder={
                            tr[localStorage.getItem("language")].masuk
                          }
                          showButtons
                        />
                      </div>
                      {error.konv[i].qty && (
                        <small id="name-error" className="p-error block">
                          <i class="bx bxs-error-circle ml-1"></i> Kuantitas
                          Tidak Sesuai
                        </small>
                      )}
                    </div>

                    <div className="col-4">
                      <PrimeDropdown
                        value={v.u_to && checkUnit(konversi[i].u_to)}
                        options={satuanDasar}
                        onChange={(e) => {
                          let temp = [...konversi];
                          temp[i].u_to = e.value.id;
                          setKonversi(temp);
                          let newKonv = error.konv;
                          newKonv[i].s_big = false;
                          setError({ ...error, konv: newKonv });
                        }}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        error={error.konv[i].s_big}
                        errorMessage="Satuan Besar Belum Dipilih"
                      />
                    </div>

                    <div className="col-4">
                      <PrimeDropdown
                        value={v.u_from && checkUnit(konversi[i].u_from)}
                        options={satuanDasar}
                        onChange={(e) => {
                          let temp = [...konversi];
                          temp[i].u_from = e.value.id;
                          setKonversi(temp);
                          let newKonv = error.konv;
                          newKonv[i].s_small = false;
                          setError({ ...error, konv: newKonv });
                        }}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        error={error.konv[i].s_small}
                        errorMessage="Satuan Kecil Belum Dipilih"
                      />
                    </div>

                    <div className="d-flex">
                      <div className="mt-3">
                        {i == konversi.length - 1 ? (
                          <Link
                            onClick={() => {
                              setKonversi([
                                ...konversi,
                                {
                                  id: 0,
                                  qty: 1,
                                  u_from: null,
                                  u_to: null,
                                },
                              ]);
                              setError({
                                ...error,
                                konv: [
                                  ...error.konv,
                                  { qty: false, s_big: false, s_small: false },
                                ],
                              });
                            }}
                            className="btn btn-primary shadow btn-xs sharp ml-1"
                          >
                            <i className="fa fa-plus"></i>
                          </Link>
                        ) : (
                          <Link
                            onClick={() => {
                              console.log(konversi);
                              console.log(i);
                              let temp = [...konversi];
                              temp.splice(i, 1);
                              setKonversi(temp);
                              let newKonv = error.konv;
                              newKonv.splice(i, 1);
                              setError({ ...error, konv: newKonv });
                            }}
                            className="btn btn-danger shadow btn-xs sharp ml-1"
                          >
                            <i className="fa fa-trash"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </Dialog>

        <Dialog
          header={`${tr[localStorage.getItem("language")].hapus} ${
            tr[localStorage.getItem("language")].sat
          }`}
          visible={showDelete}
          style={{ width: "30vw" }}
          footer={renderFooterDel("displayDel")}
          onHide={() => {
            setLoading(false);
            setShowDelete(false);
            onInput(false);
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

  if (popUp) {
    return (
      <>
        <Dialog
          header={`${tr[localStorage.getItem("language")].data} ${
            tr[localStorage.getItem("language")].sat
          }`}
          visible={show}
          footer={() => <div></div>}
          style={{ width: "60vw" }}
          onHide={onHide}
        >
          <Row className="ml-0 mr-0">
            <Col>{renderBody()}</Col>
          </Row>
        </Dialog>
        {renderDialog()}
      </>
    );
  } else {
    return (
      <>
        {renderBody()}
        {renderDialog()}
      </>
    );
  }
};

export default DataSatuan;
