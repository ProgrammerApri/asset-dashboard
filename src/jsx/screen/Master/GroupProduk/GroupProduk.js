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
import { Badge } from "primereact/badge";
import { Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { InputSwitch } from "primereact/inputswitch";
import { tr } from "src/data/tr";
import { SelectButton } from "primereact/selectbutton";

const def = {
  groupPro: {
    id: null,
    code: null,
    name: null,
    wip: false,
    stok: true,
    div_code: null,
    acc_sto: null,
    acc_send: null,
    acc_terima: null,
    hrg_pokok: null,
    acc_penj: null,
    potongan: null,
    pengembalian: null,
    selisih: null,
    biaya: null,
  },

  divisi: {
    id: null,
    code: null,
    name: null,
    desc: null,
  },
};

const defError = [
  {
    code: false,
    name: false,
  },
  {
    acc_1: false,
    acc_2: false,
    acc_3: false,
    acc_4: false,
    acc_5: false,
    acc_6: false,
    acc_7: false,
    acc_8: false,
    acc_9: false,
    biaya: false,
  },
];

const tipe = [
  { name: "Stock", code: true },
  { name: "Non Stock", code: false },
];

const DataGroupProduk = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
  edit,
  del,
}) => {
  const [groupPro, setGroup] = useState(null);
  const [divisi, setDivisi] = useState(null);
  const [setup, setSetup] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [checked1, setChecked1] = useState(false);
  const [wip, setWip] = useState(null);

  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(def);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [active, setActive] = useState(0);
  const [error, setError] = useState(defError);

  useEffect(() => {
    getDivisi();
    getSetup();

    initFilters1();
  }, []);

  const getDivisi = async () => {
    const config = {
      ...endpoints.divisi,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setDivisi(data);
      }
    } catch (error) {}
  };

  const getSetup = async (isUpdate = false) => {
    const config = {
      ...endpoints.getSetup,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSetup(data);
        getAccount(data);
      }
    } catch (error) {}
  };

  const getAccount = async (setup) => {
    const config = {
      ...endpoints.account,
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
          if (
            element.account.kat_code === setup?.sto_wip?.kat_code &&
            element.account.dou_type === "U"
          ) {
            filt.push(element);
          }
        });
        setWip(filt);
        setAccount(data);
      }
    } catch (error) {}
  };

  const editGroupProduk = async () => {
    const config = {
      ...endpoints.editGroupPro,
      endpoint: endpoints.editGroupPro.endpoint + currentItem.groupPro.id,
      data: {
        code: currentItem?.groupPro?.code ?? null,
        name: currentItem?.groupPro?.name ?? null,
        div_code: currentItem?.divisi?.id ?? null,
        stok: currentItem?.groupPro?.stok ?? null,
        wip: currentItem?.groupPro?.wip ?? null,
        acc_sto: currentItem?.groupPro?.acc_sto ?? null,
        acc_send: currentItem?.groupPro?.acc_send ?? null,
        acc_wip: currentItem?.groupPro?.acc_wip ?? null,
        acc_terima: currentItem?.groupPro?.acc_terima ?? null,
        hrg_pokok: currentItem?.groupPro?.hrg_pokok ?? null,
        acc_penj: currentItem?.groupPro?.acc_penj ?? null,
        potongan: currentItem?.groupPro?.potongan ?? null,
        pengembalian: currentItem?.groupPro?.pengembalian ?? null,
        selisih: currentItem?.groupPro?.selisih ?? null,
        biaya: currentItem?.groupPro?.biaya ?? null,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayData(false);
          setActive(0);
          onSuccessInput(true);
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
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const addGroupProduk = async () => {
    const config = {
      ...endpoints.addGroupPro,
      data: {
        code: currentItem?.groupPro?.code ?? null,
        name: currentItem?.groupPro?.name ?? null,
        div_code: currentItem?.divisi?.id ?? null,
        stok: currentItem?.groupPro?.stok ?? null,
        wip: currentItem?.groupPro?.wip ?? null,
        acc_sto: currentItem?.groupPro?.acc_sto ?? null,
        acc_send: currentItem?.groupPro?.acc_send ?? null,
        acc_wip: currentItem?.groupPro?.acc_wip ?? null,
        acc_terima: currentItem?.groupPro?.acc_terima ?? null,
        hrg_pokok: currentItem?.groupPro?.hrg_pokok ?? null,
        acc_penj: currentItem?.groupPro?.acc_penj ?? null,
        potongan: currentItem?.groupPro?.potongan ?? null,
        pengembalian: currentItem?.groupPro?.pengembalian ?? null,
        selisih: currentItem?.groupPro?.selisih ?? null,
        biaya: currentItem?.groupPro?.biaya ?? null,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayData(false);
          setActive(0);
          onSuccessInput();
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
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode ${currentItem.groupPro.code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
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

  const delGroupProduk = async (id) => {
    const config = {
      ...endpoints.delGroupPro,
      endpoint: endpoints.delGroupPro.endpoint + currentItem.groupPro.id,
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
        setUpdate(false);
        setDisplayDel(false);
        onSuccessInput();
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
        {edit && (
          <Link
            onClick={() => {
              console.log(data);
              setEdit(true);
              onClick("displayData", data);
              setCurrentItem(data);
              onInput(true);
            }}
            className="btn btn-primary shadow btn-xs sharp ml-1"
          >
            <i className="fa fa-pencil"></i>
          </Link>
        )}

        {del && (
          <Link
            onClick={() => {
              setEdit(true);
              setDisplayDel(true);
              setCurrentItem(data);
              onInput(true);
            }}
            className="btn btn-danger shadow btn-xs sharp ml-1"
          >
            <i className="fa fa-trash"></i>
          </Link>
        )}
      </div>
      // </React.Fragment>
    );
  };

  const onClick = () => {
    setDisplayData(true);
    setCurrentItem();

    if (position) {
      setPosition(position);
    }
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editGroupProduk();
        setActive(0);
      } else {
        setUpdate(true);
        addGroupProduk();
        setActive(0);
      }
    }
  };

  const renderFooter = () => {
    if (active !== 1) {
      return (
        <div className="mt-3">
          {active > 0 ? (
            <PButton
              label={tr[localStorage.getItem("language")].sebelumnya}
              onClick={() => {
                if (active > 0) {
                  setActive(active - 1);
                }
              }}
              className="p-button-text btn-primary"
            />
          ) : (
            <PButton
              label={tr[localStorage.getItem("language")].batal}
              onClick={() => {
                setDisplayData(false);
                setActive(0);
                onInput(false);
              }}
              className="p-button-text btn-primary"
            />
          )}
          <PButton
            label={tr[localStorage.getItem("language")].selanjutnya}
            onClick={() => {
              if (active < 2) {
                setActive(active + 1);
              }
            }}
            autoFocus
            loading={update}
          />
        </div>
      );
    }

    return (
      <div className="mt-3">
        <PButton
          label={tr[localStorage.getItem("language")].sebelumnya}
          onClick={() => {
            if (active > 0) {
              setActive(active - 1);
            }
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].simpan}
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
          loading={update}
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
            setDisplayDel(false);
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            delGroupProduk();
          }}
          autoFocus
          loading={update}
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
        {edit && (
          <PrimeSingleButton
            label={tr[localStorage.getItem("language")].tambh}
            icon={<i class="bx bx-plus px-2"></i>}
            onClick={() => {
              setEdit(false);
              setCurrentItem({
                ...def,
                groupPro: {
                  ...def.groupPro,
                  wip: false,
                  acc_sto: setup?.sto?.id,
                  acc_send: setup?.pur_shipping?.id,
                  acc_terima: setup?.ap?.id,
                  // acc_wip: setup?.sto_wip?.id,
                  hrg_pokok: setup?.pur_cogs?.id,
                  acc_penj: setup?.sls_rev?.id,
                  potongan: setup?.sls_disc?.id,
                  pengembalian: setup?.sls_shipping?.id,
                  selisih: setup?.sto_hpp_diff?.id,
                },
              });
              setDisplayData(true);
              onInput(true);
            }}
          />
        )}
      </div>
    );
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
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
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const renderTabHeader = (options) => {
    return (
      <button
        type="button"
        onClick={options.onClick}
        className={options.className}
      >
        {options.titleElement}
        <Badge
          value={`${options.index + 1}`}
          className={`${active === options.index ? "active" : ""} ml-2`}
        ></Badge>
      </button>
    );
  };

  const gl = (value) => {
    let gl = {};
    account?.forEach((element) => {
      if (value === element.account.id) {
        gl = element;
      }
    });
    return gl;
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_name} - ${option.account.acc_code}`
          : ""}
      </div>
    );
  };

  const clear = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account.acc_name} - ${option.account.acc_code}`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = [
      {
        code: !currentItem.groupPro.code || currentItem.groupPro.code === "",
        name: !currentItem.groupPro.name || currentItem.groupPro.name === "",
      },
      {
        // acc_1: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.acc_sto,
        // acc_2: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.acc_send,
        // acc_3: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.acc_terima,
        // acc_4: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.hrg_pokok,
        // acc_5: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.acc_penj,
        // acc_6: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.potongan,
        // acc_7: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.pengembalian,
        // acc_8: currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.selisih,
        // acc_9: !currentItem.groupPro.wip
        //   ? false
        //   : !currentItem.groupPro?.acc_wip,
        biaya:
          currentItem.groupPro.stok === false
            ? !currentItem.groupPro?.biaya
            : false,
      },
    ];

    setError(errors);
    let count = 0;
    let total_valid = 0;
    errors.forEach((el, i) => {
      for (var key in el) {
        count++;
        if (!el[key]) {
          total_valid++;
        }

        if (el[key] && i < active) {
          active = i;
        }
      }
    });
    console.log(count);
    console.log(total_valid);

    valid = count === total_valid;

    if (!valid) {
      setActive(active);
    }

    return valid;
  };

  const renderBody = () => {
    return (
      <>
        <Toast ref={toast} />
        <DataTable
          responsiveLayout="scroll"
          value={data}
          className="display w-150 datatable-wrapper"
          showGridlines
          dataKey="id"
          rowHover
          header={renderHeader}
          filters={filters1}
          globalFilterFields={[
            "groupPro.code",
            "groupPro.name",
            "groupPro.div_code",
          ]}
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
          <Column
            header={tr[localStorage.getItem("language")].kd_grup}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.groupPro?.code}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_grup}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.groupPro?.name}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].divisi}
            field={(e) => e.divisi?.name ?? "-"}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          {(edit || del) && (
            <Column
              header="Action"
              dataType="boolean"
              bodyClassName="text-center"
              style={{ minWidth: "2rem" }}
              body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
            />
          )}
        </DataTable>
      </>
    );
  };

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={
            isEdit
              ? `${tr[localStorage.getItem("language")].edit} ${
                  tr[localStorage.getItem("language")].g_prod
                }`
              : `${tr[localStorage.getItem("language")].tambh} ${
                  tr[localStorage.getItem("language")].g_prod
                }`
          }
          visible={displayData}
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => {
            setEdit(false);
            setDisplayData(false);
            setActive(0);
            onInput(false);
          }}
        >
          <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
            <TabPanel
              header="Informasi Produk"
              headerTemplate={renderTabHeader}
            >
              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].kd_grup}
                    value={`${currentItem?.groupPro?.code ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          code: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[0].code = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0]?.code}
                  />
                </div>

                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].nm_grup}
                    value={`${currentItem?.groupPro?.name ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          name: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[0].name = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0]?.name}
                  />
                </div>
              </div>
              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].divisi}
                  </label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={currentItem !== null ? currentItem.divisi : null}
                      options={divisi}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          divisi: e.target.value,
                        });
                      }}
                      optionLabel="name"
                      filter
                      filterBy="name"
                      placeholder={tr[localStorage.getItem("language")].pilih}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">{"Tipe Persediaan"}</label>
                  <div className="p-inputgroup">
                    <SelectButton
                      value={
                        currentItem.groupPro !== null &&
                        currentItem.groupPro.stok !== ""
                          ? currentItem.groupPro.stok === true
                            ? { code: true, name: "Stock" }
                            : { code: false, name: "Non Stock" }
                          : null
                      }
                      options={tipe}
                      onChange={(e) => {
                        setCurrentItem({
                          ...currentItem,
                          groupPro: {
                            ...currentItem.groupPro,
                            stok: e.value?.code,
                            wip: false,
                          },
                        });
                      }}
                      optionLabel="name"
                      filter
                      filterBy="name"
                      // placeholder="Pilih Divisi"
                    />
                  </div>
                </div>

                <div className="row mr-0 ml-0">
                  <div className="col-12">
                    {/*  */}
                    <div className="col-12"></div>

                    <div className="col-12"></div>
                    <div className="p-inputgroup">
                      <InputSwitch
                        className="mr-3"
                        checked={currentItem && currentItem.groupPro.wip}
                        onChange={(e) => {
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              wip: e.target.value,
                            },
                          });
                        }}
                        disabled={currentItem.groupPro.stok === false}
                      />
                      <label className="mr-5 mt-1">{`${
                        tr[localStorage.getItem("language")].g_prod
                      } WIP`}</label>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header="Distribusi GL Kontrol Stock"
              headerTemplate={renderTabHeader}
            >
              {currentItem && currentItem?.groupPro?.stok ? (
                <>
                  <div className="row mr-0 ml-0">
                    <div className="col-6">
                      <PrimeDropdown
                        label={"Akun Persediaan"}
                        value={
                          currentItem.groupPro.acc_sto !== null
                            ? gl(currentItem.groupPro.acc_sto)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              acc_sto: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_1 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        errorMessage="Akun Persediaan Belum Dipilih"
                        error={error[1]?.acc_1}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>

                    <div className="col-6">
                      <PrimeDropdown
                        label={"Akun Pengiriman Barang"}
                        value={
                          currentItem.groupPro.acc_send !== null
                            ? gl(currentItem.groupPro.acc_send)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              acc_send: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_2 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // errorMessage="Akun Pengiriman Belum Dipilih"
                        // error={error[1]?.acc_2}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>
                  </div>

                  <div className="row mr-0 ml-0">
                    <div className="col-6">
                      <PrimeDropdown
                        label={"Akun Penerimaan Barang"}
                        value={
                          currentItem.groupPro.acc_terima !== null
                            ? gl(currentItem.groupPro.acc_terima)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              acc_terima: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_3 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // errorMessage="Akun Penerimaan Belum Dipilih"
                        // error={error[1]?.acc_3}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>
                    <div className="col-6">
                      <PrimeDropdown
                        label={"Akun WIP"}
                        value={
                          currentItem.groupPro.acc_wip !== null
                            ? gl(currentItem.groupPro.acc_wip)
                            : null
                        }
                        options={wip}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              acc_wip: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_9 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        disabled={currentItem && !currentItem.groupPro.wip}
                        errorMessage="Akun wip harus dipilih"
                        error={error[1]?.acc_9}
                      />
                    </div>
                  </div>

                  <div className="col-12 p-0">
                    <div className="mt-4 ml-3 mr-3 fs-16 mb-2">
                      <b>Informasi Akun Penjualan</b>
                    </div>
                    <Divider className="mb-2 ml-3 mr-3"></Divider>
                  </div>

                  <div className="row mr-0 ml-0">
                    <div className="col-6">
                      <PrimeDropdown
                        label={"Harga Pokok Penjualan"}
                        value={
                          currentItem.groupPro.hrg_pokok !== null
                            ? gl(currentItem.groupPro.hrg_pokok)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              hrg_pokok: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_4 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // errorMessage="Akun HPP Belum Dipilih"
                        // error={error[1]?.acc_4}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>

                    <div className="col-6">
                      <PrimeDropdown
                        label={"Penjualan"}
                        value={
                          currentItem.groupPro.acc_penj !== null
                            ? gl(currentItem.groupPro.acc_penj)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.account);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              acc_penj: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_5 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // errorMessage="Akun Penjualan Belum Dipilih"
                        // error={error[1]?.acc_5}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>
                  </div>

                  <div className="row mr-0 ml-0 mt-2">
                    <div className="col-6">
                      <PrimeDropdown
                        label={"Potongan Penjualan"}
                        value={
                          currentItem.groupPro.potongan !== null
                            ? gl(currentItem.groupPro.potongan)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              potongan: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_6 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // errorMessage="Akun Potongan Penjualan Belum Dipilih"
                        // error={error[1]?.acc_6}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>

                    <div className="col-6">
                      <PrimeDropdown
                        label={"Pengembalian Penjualan"}
                        value={
                          currentItem.groupPro.pengembalian !== null
                            ? gl(currentItem.groupPro.pengembalian)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              pengembalian: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_7 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // errorMessage="Akun Pengembalian Belum Dipilih"
                        // error={error[1]?.acc_7}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>
                  </div>

                  <div className="row mr-0 ml-0">
                    <div className="col-12">
                      <PrimeDropdown
                        label={"Selisih Harga Pokok"}
                        value={
                          currentItem.groupPro.selisih !== null
                            ? gl(currentItem.groupPro.selisih)
                            : null
                        }
                        options={account}
                        onChange={(e) => {
                          console.log(e.value);
                          setCurrentItem({
                            ...currentItem,
                            groupPro: {
                              ...currentItem.groupPro,
                              selisih: e.value?.account?.id ?? null,
                            },
                          });
                          let newError = error;
                          newError[1].acc_8 = false;
                          setError(newError);
                        }}
                        optionLabel="account.acc_name"
                        valueTemplate={clear}
                        itemTemplate={glTemplate}
                        filter
                        filterBy="account.acc_name"
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // errorMessage="Akun Selisih Harga Belum Dipilih"
                        // error={error[1]?.acc_8}
                        disabled={currentItem.groupPro.wip === true}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="row mr-0 ml-0">
                  <div className="col-12">
                    <PrimeDropdown
                      label={"Akun Biaya"}
                      value={
                        currentItem.groupPro.biaya !== null
                          ? gl(currentItem.groupPro.biaya)
                          : null
                      }
                      options={account}
                      onChange={(e) => {
                        setCurrentItem({
                          ...currentItem,
                          groupPro: {
                            ...currentItem.groupPro,
                            biaya: e.value?.account?.id ?? null,
                          },
                        });
                        let newError = error;
                        newError[1].biaya = false;
                        setError(newError);
                      }}
                      optionLabel="account.acc_name"
                      valueTemplate={clear}
                      itemTemplate={glTemplate}
                      filter
                      filterBy="account.acc_name"
                      placeholder="Pilih Akun Biaya"
                      showClear
                      errorMessage="Akun Biaya Belum Dipilih"
                      error={error[1]?.biaya}
                      // disabled={currentItem.groupPro.wip === true}
                    />
                  </div>
                </div>
              )}
            </TabPanel>
          </TabView>
        </Dialog>

        <Dialog
          header={`${tr[localStorage.getItem("language")].hapus} ${
            tr[localStorage.getItem("language")].g_prod
          }`}
          visible={displayDel}
          style={{ width: "30vw" }}
          footer={renderFooterDel("displayDel")}
          onHide={() => {
            setDisplayDel(false);
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
          header={"Data Group Produk"}
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

export default DataGroupProduk;
