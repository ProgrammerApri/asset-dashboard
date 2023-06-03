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
import { SelectButton } from "primereact/selectbutton";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "react-bootstrap";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ProgressBar } from "primereact/progressbar";

const def = {
  account: {
    acc_code: "",
    acc_name: "",
    umm_code: null,
    kat_code: 0,
    dou_type: "U",
    sld_type: "",
    connect: false,
    sld_awal: 0,
  },
  kategory: {
    id: 0,
    name: "",
    kode_klasi: 0,
    kode_saldo: "",
  },
  klasifikasi: {
    id: 0,
    klasiname: "",
  },
};

const saldoNormal = [
  { name: "Debit", code: "D" },
  { name: "Kredit", code: "K" },
];

const jenisAkun = [
  { name: "Detail", code: "D" },
  { name: "Umum", code: "U" },
];

const DataAkun = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
  onSuccessImport,
  edit,
  del,
  dataLength,
  onPageChange,
  onFilter,
}) => {
  const [account, setAccount] = useState(null);

  const [trans, setTrans] = useState(null);
  const [kategori, setKategori] = useState(null);
  const [umum, setUmum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(def);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dummy = Array.from({ length: 20 });
  const [firstId, setFirstId] = useState("");
  const [firstKat, setFirstKat] = useState(0);
  const [eName, setEname] = useState(false);
  const [eKat, setEkat] = useState(false);
  const [progress, setProgress] = useState(0);
  const picker = useRef(null);
  const progressBar = useRef(null);
  const interval = useRef(null);

  useEffect(() => {
    getKategori();
    initFilters1();
  }, []);

  const getAccount = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log("jjjjjjjjjj",config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setAccount(data);
        getTrans();
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

  const getTrans = async () => {
    const config = {
      ...endpoints.trans,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setTrans(data);
      }
    } catch (error) {}
  };

  const valueUmum = (value) => {
    let selected = null;
    umum.forEach((element) => {
      if (element.account.acc_code === value) {
        selected = element;
      }
    });
    console.log(selected);
    return selected;
  };

  const getKategori = async () => {
    setLoading(true);
    const config = {
      ...endpoints.kategori,
      data: {},
    };
    let response = null
    console.log("kategori", config.data);
    try {
      const response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setKategori(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    getAccount();
  };
  

  const getAccountUmum = async () => {
    const config = {
      ...endpoints.accountUmum,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setUmum(data);
      }
    } catch (error) {}
  };

  const getAccKodeUm = async (data) => {
    const config = {
      ...endpoints.getAccKodeUm,
      endpoint: endpoints.getAccKodeUm.endpoint + data.kategory.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const res = response.data;
        setCurrentItem({
          ...currentItem,
          account: {
            ...currentItem.account,
            acc_code: res,
            kat_code: data.kategory.id,
            sld_type: data.kategory.kode_saldo,
            level: 1,
            dou_type: "U",
            umm_code: null
          },
          kategory: data.kategory,
          klasifikasi: data.klasifikasi,
        });
      }
    } catch (error) {}
  };

  const getAccKodeDet = async (data) => {
    const config = {
      ...endpoints.getAccKodeDet,
      endpoint: endpoints.getAccKodeDet.endpoint + data,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const res = response.data;
        setCurrentItem({
          ...currentItem,
          account: {
            ...currentItem.account,
            acc_code: res,
            umm_code: data,
            dou_type: "D",
          },
        });
      }
    } catch (error) {}
  };

  const getAccKodeSubUmum = async (data) => {
    const config = {
      ...endpoints.getAccKodeSubUmum,
      endpoint: endpoints.getAccKodeSubUmum.endpoint + data.account.acc_code,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const res = response.data;
        setCurrentItem({
          ...currentItem,
          account: {
            ...currentItem.account,
            acc_code: res,
            umm_code: data.account.acc_code,
          },
        });
      }
    } catch (error) {}
  };

  const getKodeUmum = async (id, data) => {
    const config = {
      ...endpoints.getAccKodeUm,
      endpoint: endpoints.getAccKodeUm.endpoint + id,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const res = response.data;
        if (data) {
          setCurrentItem({
            ...currentItem,
            account: {
              ...currentItem.account,
              acc_code: res,
              umm_code: null,
              level: 1,
              dou_type: "U",
            },
          });
        } else {
          setCurrentItem({
            ...currentItem,
            account: {
              ...currentItem.account,
              acc_code: res,
              umm_code: null,
              level: 1,
            },
          });
        }
      }
    } catch (error) {}
  };

  const addAccountImport = async (data, onSuccess) => {
    const config = {
      ...endpoints.addAccountImport,
      data: data,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        onSuccess();
      }
    } catch ({ error }) {}
  };

  const editAccount = async () => {
    setUpdate(true);
    const config = {
      ...endpoints.editAccount,
      endpoint: endpoints.editAccount.endpoint + currentItem.account.id,
      data: {
        acc_name: currentItem.account.acc_name,
        kode_kategori: currentItem.kategory.id,
        kode_acc: currentItem.account.acc_code,
        kode_umum: currentItem.account.umm_code,
        du: currentItem.account.dou_type,
        kode_saldo: currentItem.kategory.kode_saldo,
        terhubung: currentItem.account.connect,
        saldo_awal: currentItem.account.sld_awal,
        level: currentItem.account.level,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setUpdate(false);
          onHideInput();
          onInput(false);
          getKategori(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data berhasil diperbarui",
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
          detail: "Gagal memperbarui data",
          sticky: true,
          // life: 3000,
        });
      }, 500);
    }
  };

  const addAccount = async () => {
    setUpdate(true);
    const config = {
      ...endpoints.addAccount,
      data: {
        acc_name: currentItem.account.acc_name,
        kode_kategori: currentItem.kategory.id,
        kode_acc: currentItem.account.acc_code,
        kode_umum: currentItem.account.umm_code,
        du: currentItem.account.dou_type,
        kode_saldo: currentItem.kategory.kode_saldo,
        terhubung: currentItem.account.connect,
        saldo_awal: currentItem.account.sld_awal,
        level: currentItem.account.level,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setUpdate(false);
          // onHideInput();
          setLoading(false);
          setCurrentItem(def);
          setEdit(false);
          // setShowInput(false);
          setEkat(false);
          setEname(false);
          onInput(false);
          getKategori(true);
          getAccountUmum();
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data berhasil diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch ({ error }) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: `Error ${error.response.status}`,
          detail: `${error.response?.data?.message}`,
          sticky: true,
          // life: 3000,
        });
      }, 500);
    }
  };

  const delAccount = async (id) => {
    // setLoading(true);
    const config = {
      ...endpoints.delAccount,
      endpoint: endpoints.delAccount.endpoint + id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setShowDelete(false);
          onSuccessInput();
          onInput(false);
          getKategori(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data berhasil diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setShowDelete(false);
        onSuccessInput();
        onInput(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Akun`,
          sticky: true,
          // life: 3000,
        });
      }, 500);
    }
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="row">
        <Link
          onClick={() => {
            setEdit(true);
            setCurrentItem(data);
            setShowInput(true);
            onInput(true);
          }}
          className="btn btn-primary shadow btn-xs sharp ml-2"
        >
          <i className="fa fa-pencil"></i>
        </Link>
        <Link
          onClick={() => {
            setCurrentItem(data);
            setShowDelete(true);
            onInput(true);
          }}
          className={`btn ${
            trans?.length === 0 ? "" : "disabled"
          } btn-danger shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onClick = (kode, kategori) => {
    setShowInput(true);
    setCurrentItem(kategori);
    setFirstId(kategori.account.acc_code);
    setFirstKat(kategori.account.kat_code);

    if (position) {
      setPosition(position);
    }
  };

  const onSubmit = () => {
    if (isValid()) {
      setUpdate(true);
      if (isEdit) {
        editAccount();
      } else {
        addAccount();
      }
    }
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const isValid = () => {
    if (currentItem.account.acc_name !== "" && currentItem.kategory.id !== 0) {
      return true;
    } else {
      if (currentItem.account.acc_name === "") {
        setEname(true);
      }
      if (currentItem.kategory.id === 0) {
        setEkat(true);
      }
    }
    return false;
  };

  const renderFooter = (kode) => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => {
            onHideInput();
            onInput(false);
          }}
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
    );
  };

  const renderFooterDel = (kode) => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => {
            setShowDelete(false);
            setUpdate(false);
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            if (
              currentItem.account.dou_type === "D" &&
              currentItem.account.sld_awal === 0
            ) {
              delAccount(currentItem.account.id);
              setUpdate(true);
            } else if (currentItem.account.sld_awal !== 0) {
              setUpdate(true);
              setTimeout(() => {
                setUpdate(false);
                setShowDelete(false);
                toast.current.show({
                  severity: "error",
                  summary: "Gagal",
                  detail: `Tidak Dapat Menghapus Akun, Saldo Terisi`,
                  life: 5000,
                });
              }, 500);
            } else {
              setUpdate(true);
              setTimeout(() => {
                setUpdate(false);
                setShowDelete(false);
                toast.current.show({
                  severity: "error",
                  summary: "Gagal",
                  detail: `Tidak Dapat Menghapus Akun Umum`,
                  life: 5000,
                });
              }, 500);
            }
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    onFilter(value);
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
      <Row>
        <div className="flex justify-content-between col-12 pt-0">
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
              label="Export"
              icon={<i className="pi pi-file-excel px-2"></i>}
              onClick={() => {
                exportExcel();
              }}
            />
            <PrimeSingleButton
              className="mr-3"
              label="Import"
              icon={<i className="pi pi-file-excel px-2"></i>}
              onClick={(e) => {
                confirmImport(e);
              }}
              disabled={trans?.length > 0}
            />
            <PrimeSingleButton
              label="Tambah"
              icon={<i class="bx bx-plus px-2"></i>}
              onClick={() => {
                getAccountUmum();
                setShowInput(true);
                setEdit(false);
                setLoading(false);
                setCurrentItem(def);
                onInput(true);
              }}
            />
          </Row>
        </div>
        <div className="col-12" ref={progressBar} style={{ display: "none" }}>
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

  const umumTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_name} (${option.account.acc_code})`
          : ""}
      </div>
    );
  };

  const selectedou_typemumTemplate = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account.acc_name} (${option.account.acc_code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
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
    console.log(event);
    onPageChange(event);
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const exportExcel = () => {
    let data = [];
    account.forEach((el) => {
      data.push({
        KODE_ACC: el.account.acc_code,
        ACC_NAME: el.account.acc_name,
        KODE_UMM: el.account.umm_code != null ? el.account.umm_code : "-",
        KLASI_CODE: el.klasifikasi.id,
        KLASIFIKASI: el.klasifikasi.klasiname,
        KAT_CODE: el.kategory.id,
        KAT_ACC: el.kategory.name,
        D_OR_U: el.account.dou_type,
        SLD_TYPE: el.account.sld_type,
        TERHUBUNG: el.account.connect,
        SLD_AWAL: el.account.sld_awal,
      });
    });

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "account");
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

  const onHideInput = () => {
    setLoading(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
    setEkat(false);
    setEname(false);
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

        let _importedData = data.map((d) => {
          return cols.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });

        _importedData = _importedData.filter(
          (el) => el?.KLASI_CODE && el?.KAT_CODE
        );

        console.log(_importedData);
        onSuccessImport();
        progressBar.current.style.display = "";
        let totalData = _importedData.length;
        let totalSuccess = 0;
        let val = progress;

        let grouped = { umum: [], detail: [] };

        let indexUmum = 0;
        let indexDetail = 0;

        _importedData.forEach((el) => {
          if (el.D_OR_U === "U") {
            grouped.umum.push({
              acc_name: el.ACC_NAME,
              kode_umum: el.KODE_UMM === "-" ? null : el?.KODE_UMM,
              kode_kategori: el.KAT_CODE,
              du: el.D_OR_U,
              terhubung: el.TERHUBUNG,
              kode_saldo: el.SLD_TYPE,
              saldo_awal: el.SLD_AWAL ?? 0,
            });
          } else {
            grouped.detail.push({
              acc_name: el.ACC_NAME,
              kode_umum: el.KODE_UMM
                ? el.KODE_UMM === "-"
                  ? null
                  : el?.KODE_UMM
                : null,
              kode_kategori: el.KAT_CODE,
              du: el.D_OR_U,
              terhubung: el.TERHUBUNG,
              kode_saldo: el.SLD_TYPE,
              saldo_awal: el.SLD_AWAL ?? 0,
            });
          }
        });

        console.log(grouped.umum.length);
        console.log(grouped.detail.length);
        addAccountImport(grouped, () => {
          setTimeout(() => {
            toast.current.show({
              severity: "info",
              summary: "Berhasil",
              detail: "Data berhasil diperbarui",
              life: 3000,
            });
            onSuccessInput();
            picker.current.value = null;
            progressBar.current.style.display = "none";
          }, 1000);
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const renderBody = () => {
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
          value={data}
          className="display w-150 datatable-wrapper"
          showGridlines
          dataKey=""
          rowHover
          header={renderHeader}
          filters={filters1}
          globalFilterFields={[
            "account.acc_name",
            "kategory.name",
            "account.acc_code",
            "account.umm_code",
            "account.dou_type",
            "account.sld_type",
            "account.sld_awal",
          ]}
          emptyMessage="Tidak ada data"
          paginator
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          onPage={onCustomPage2}
          paginatorClassName="justify-content-end mt-3"
          selectionMode="single"
          onRowSelect={onRowSelect}
          totalRecords={dataLength ?? data?.length}
          lazy={dataLength}
        >
          <Column
            header="Kode Akun"
            style={{
              width: "10rem",
              minWidth: "8rem",
            }}
            field={(e) => e.account?.acc_code}
            body={load && <Skeleton />}
          />
          <Column
            header="Nama Akun"
            field={(e) => e.account?.acc_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Kategori"
            field={(e) => e.kategory?.name}
            style={{ minWidth: "6rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Akun Umum"
            // field={(e) => e.account.umm_code}
            style={{ minWidth: "8rem" }}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : (
                <div>{e.account?.umm_code ? e.account?.umm_code : "-"}</div>
              )
            }
          />
          <Column
            header="Jenis Akun"
            field={(e) => e.account?.dou_type}
            style={{ minWidth: "8rem" }}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : (
                <div>
                  {e.account?.dou_type === "D" ? (
                    <Badge variant="success light">
                      <i className="bx bxs-circle text-success mr-1"></i> Detail
                    </Badge>
                  ) : (
                    <Badge variant="info light">
                      <i className="bx bxs-circle text-info mr-1"></i> Umum
                    </Badge>
                  )}
                </div>
              )
            }
          />
          <Column
            header="Saldo Normal"
            field={(e) => e?.account?.sld_type}
            style={{ minWidth: "8rem" }}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : (
                <div>
                  {e.account?.sld_type === "D" ? (
                    <Badge variant="secondary light">
                      <i className="bx bxs-plus-circle text-secondary mr-1"></i>{" "}
                      Debit
                    </Badge>
                  ) : (
                    <Badge variant="warning light">
                      <i className="bx bxs-minus-circle text-warning mr-1"></i>{" "}
                      Kredit
                    </Badge>
                  )}
                </div>
              )
            }
          />
          <Column
            header="Terhubung Sub Akun"
            field={(e) => e.account?.connect}
            style={{ maxWidth: "8rem" }}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : (
                <div>
                  {e.account?.connect ? (
                    <Badge variant="primary light">
                      <i className="bx bx-check text-primary mr-1"></i>{" "}
                      Terhubung
                    </Badge>
                  ) : (
                    <Badge variant="danger light">
                      <i className="bx bx-x text-danger mr-1"></i> Tidak
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
            body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
          />
        </DataTable>
      </>
    );
  };

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={isEdit ? "Edit Akun" : "Tambah Akun"}
          visible={showInput}
          style={{ width: "50vw" }}
          footer={renderFooter}
          onHide={() => {
            onHideInput();
            onInput(false);
          }}
        >
          <div className="row ml-0 mt-0">
            <div className="col-4">
              <PrimeInput
                label={"Kode Akun"}
                value={
                  currentItem !== null ? `${currentItem.account.acc_code}` : ""
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    account: {
                      ...currentItem.account,
                      acc_code: e.target.value,
                    },
                  })
                }
                placeholder="Masukan Kode Akun"
                disabled
              />
            </div>

            <div className="col-4">
              <PrimeInput
                label={"Nama Akun"}
                value={
                  currentItem !== null ? `${currentItem.account.acc_name}` : ""
                }
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    account: {
                      ...currentItem.account,
                      acc_name: e.target.value,
                    },
                  });
                  setEname(false);
                }}
                placeholder={"Masukan Nama Akun"}
                error={eName}
              />
            </div>

            <div className="col-4">
              <PrimeDropdown
                label={"Kategori"}
                value={
                  currentItem !== null
                    ? {
                        kategory: currentItem.kategory,
                        klasifikasi: currentItem.klasifikasi,
                      }
                    : null
                }
                options={kategori}
                onChange={(e) => {
                  console.log(e.value);
                  setEkat(false);
                  if (
                    isEdit &&
                    e.value.kategory.id === firstKat &&
                    currentItem.account.dou_type === "U"
                  ) {
                    setCurrentItem({
                      ...currentItem,
                      account: {
                        ...currentItem.account,
                        acc_code: firstId,
                        kat_code: e.value.kategory.id,
                      },
                      kategory: e.value.kategory,
                      klasifikasi: e.value.klasifikasi,
                    });
                  } else {
                    getAccKodeUm(e.value);
                  }
                }}
                optionLabel="kategory.name"
                filter
                filterBy="kategory.name"
                placeholder="Pilih Kategori"
                error={eKat}
                errorMessage={"Kategori harus dipilih"}
              />
            </div>
          </div>

          <div className="col-12 mb-2">
            <label className="text-label">Jenis Akun</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  currentItem !== null && currentItem.account.dou_type !== ""
                    ? currentItem.account.dou_type === "D"
                      ? { name: "Detail", code: "D" }
                      : { name: "Umum", code: "U" }
                    : null
                }
                options={jenisAkun}
                onChange={(e) => {
                  console.log(e.value);
                  if (e.value.code === "D") {
                    // getAccountUmum();
                    if (currentItem.account.umm_code) {
                      getAccKodeDet(currentItem.account.umm_code);
                    } else {
                      setCurrentItem({
                        ...currentItem,
                        account: {
                          ...currentItem.account,
                          dou_type: e.value.code,
                          umm_code: null,
                        },
                      });
                    }
                  } else if (e.value.code === "U") {
                    if (isEdit && currentItem.account.kat_code === firstKat) {
                      setCurrentItem({
                        ...currentItem,
                        account: {
                          ...currentItem.account,
                          acc_code: firstId,
                          dou_type: e.value.code,
                          umm_code: null,
                        },
                      });
                    } else {
                      getKodeUmum(currentItem.account.kat_code, e.value.code);
                    }

                    // getAccountUmum();
                  }
                }}
                optionLabel="name"
              />
            </div>
          </div>

          <div className="col-12 mb-2">
            <label className="text-label">Akun Umum</label>
            <div className="p-inputgroup">
              <Dropdown
                value={
                  umum && currentItem.account.umm_code
                    ? valueUmum(currentItem.account.umm_code)
                    : null
                }
                options={umum}
                onChange={(e) => {
                  if (e.value) {
                    setCurrentItem({
                      ...currentItem,
                      account: {
                        ...currentItem.account,
                        level: e.value.account.level + 1,
                      },
                    });
                    console.log(e.value.account.level + 1);
                    if (currentItem.account.dou_type === "U") {
                      getAccKodeSubUmum(e.value);
                    } else {
                      getAccKodeDet(e.value.account.acc_code);
                    }
                  } else {
                    getKodeUmum(currentItem.account.kat_code);
                  }
                }}
                optionLabel="account.acc_name"
                valueTemplate={selectedou_typemumTemplate}
                itemTemplate={umumTemplate}
                filter
                filterBy="account.acc_name"
                placeholder={"Pilih Akun Umum"}
                showClear
              />
            </div>
          </div>

          <div className="col-12 mb-2">
            <label className="text-label">Saldo Normal</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  currentItem !== null && currentItem.account.sld_type !== ""
                    ? currentItem.account.sld_type === "D"
                      ? { name: "Debit", code: "D" }
                      : { name: "Kredit", code: "K" }
                    : null
                }
                options={saldoNormal}
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({
                    ...currentItem,
                    account: {
                      ...currentItem.account,
                      sld_type: e.value.code,
                    },
                  });
                }}
                optionLabel="name"
              />
            </div>
          </div>

          {currentItem !== null && currentItem.account.dou_type !== "" ? (
            currentItem.account.dou_type === "D" &&
            currentItem.account.kat_code !== 0 ? (
              <>
                <div className="col-12 mb-2">
                  <Checkbox
                    className="mb-2"
                    inputId="binary"
                    checked={currentItem ? currentItem.account.connect : false}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        account: { ...currentItem.account, connect: e.checked },
                      })
                    }
                  />
                  <label className="ml-3" htmlFor="binary">
                    {"Akun Terhubung"}
                  </label>
                </div>
              </>
            ) : null
          ) : null}
        </Dialog>

        <Dialog
          header={"Hapus Data"}
          visible={showDelete}
          style={{ width: "30vw" }}
          footer={renderFooterDel}
          onHide={() => {
            setLoading(false);
            setShowDelete(false);
            onInput(false);
          }}
        >
          <div className="ml-3 mr-3 mb-1">
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

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Akun"}
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

export default DataAkun;
