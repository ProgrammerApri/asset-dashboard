import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, TabPane } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Divider, Icon } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import { Badge } from "primereact/badge";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { tr } from "../../../../data/tr";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { Checkbox } from "primereact/checkbox";

const def = {
  supplier: {
    id: null,
    sup_code: null,
    sup_name: null,
    sup_jpem: null,
    sup_ppn: null,
    sup_pkp: false,
    sup_maklon: false,
    sup_kode_country: null,
    sup_npwp: null,
    sup_country: null,
    sup_address: null,
    sup_kota: null,
    sup_kpos: null,
    sup_telp1: null,
    sup_telp2: null,
    sup_fax: null,
    sup_cp: null,
    sup_curren: null,
    sup_ket: null,
    sup_hutang: null,
    sup_uang_muka: null,
    sup_limit: null,
    // sup_serialNumber: 0,
  },

  currency: {
    id: 0,
    code: "",
    name: "",
  },

  jpem: {
    id: 1,
    jpem_code: "",
    jpem_name: "",
    jpem_ket: "",
  },

  city: {
    city_id: 0,
    province_id: 0,
    province: "",
    type: "",
    city_name: "",
    postal_code: 0,
  },
};

const defError = [
  {
    code: false,
    name: false,
    // jpem: false,
    addrs: false,
    city: false,
    // npwp: false,
  },
  {
    phone: false,
    cp: false,
  },
  {
    // ppn: false,
    ap: false,
    // um: false,
  },
];

const DataSupplier = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [jpem, setJpem] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [city, setCity] = useState(null);
  const [setup, setSetup] = useState(null);
  const [accHut, setAccHut] = useState(null);
  const [accUm, setAccUm] = useState(null);
  const [accAll, setAccAll] = useState(null);
  const [checked, setChecked] = useState({
    supplier: { sup_country: { code: "" } },
  });
  const [comp, setComp] = useState(null);
  const [pajak, setPajak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [active, setActive] = useState(0);
  const [error, setError] = useState(defError);
  const [number, setNumber] = useState(0);
  // const [lastSerialNumber, setLastSerialNumber] = useState("");

  useEffect(() => {
    getJpem();
    getCurrency();
    getCity();
    getSetup();
    getCompany();
    getPajak();
    initFilters1();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const countries = [
    { name: "Australia", code: "AU" },
    { name: "Brazil", code: "BR" },
    { name: "China", code: "CN" },
    { name: "Egypt", code: "EG" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "IND" },
    { name: "Japan", code: "JP" },
    { name: "Spain", code: "ES" },
    { name: "United States", code: "US" },
  ];

  // const generateCode = () => {
  //   const countryCode = checked?.supplier?.sup_country?.code || "";
  //   const jpelCode = currentItem?.jpem?.jpem_code || "";
  //   return checked?.supplier?.sup_country?.code
  //     ? `${countryCode}${jpelCode}/${lastSerialNumber}`
  //     : `${countryCode}${jpelCode}/${lastSerialNumber}`;
  // };

  const getSup = async () => {
    setLoading(true);
    const config = {
      ...endpoints.supplier_code,
      data: {},
    };
    try {
      console.log(config.data);
      let response = await request(null, config);
      console.log("code suplier");
      console.log(response);

      if (response.status) {
        const { data } = response;
        setNumber(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getJpem = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.jenisPemasok,
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
        setJpem(data);
      }
    } catch (error) {}
  };

  const getCurrency = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.currency,
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
        setCurrency(data);
      }
    } catch (error) {}
  };

  const getCity = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.city,
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
        setCity(data);
      }
    } catch (error) {}
  };

  const getSetup = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getSetup,
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
        setSetup(data);
        getAccHut(data);
      }
    } catch (error) {}
  };

  const getAccHut = async (setup) => {
    setLoading(true);
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
        let filt = [];
        let acc_hut = [];
        let account = [];
        let set_acc = null;
        data.forEach((elem) => {
          if (
            elem?.account?.umm_code === setup?.ap?.acc_code &&
            elem?.account?.dou_type === "D"
          ) {
            acc_hut.push(elem.account);
          }

          if (elem.account.dou_type === "D") {
            filt.push(elem.account);
          }
          account.push(elem.account);
        });
        console.log(data);
        setAccHut(acc_hut);
        setAccUm(filt);
        setAccAll(account);
      }
    } catch (error) {}
  };

  const getCompany = async (isUpdate = false) => {
    setLoading(true);
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

  const getPajak = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.pajak,
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
        setPajak(data);
      }
    } catch (error) {}
  };

  const editSupplier = async () => {
    const config = {
      ...endpoints.editSupplier,
      endpoint: endpoints.editSupplier.endpoint + currentItem.supplier.id,
      data: {
        sup_code: generateCodePreview(),
        sup_name: currentItem?.supplier?.sup_name ?? null,
        sup_jpem: currentItem?.jpem?.id ?? null,
        sup_ppn: currentItem?.supplier?.sup_ppn ?? null,
        sup_pkp: currentItem?.supplier?.sup_pkp ?? null,
        sup_maklon: currentItem?.supplier?.sup_maklon ?? null,
        sup_kode_country: currentItem?.supplier?.sup_kode_country ?? null,
        sup_npwp: currentItem?.supplier?.sup_npwp ?? null,
        sup_country: currentItem?.supplier?.sup_country.name ?? null,
        sup_address: currentItem?.supplier?.sup_address ?? null,
        sup_kota: currentItem?.supplier?.sup_kota ?? null,
        sup_kpos: currentItem?.supplier?.sup_kpos ?? null,
        sup_telp1: currentItem?.supplier?.sup_telp1 ?? null,
        sup_telp2: currentItem?.supplier?.sup_telp2 ?? null,
        sup_fax: currentItem?.supplier?.sup_fax ?? null,
        sup_cp: currentItem?.supplier?.sup_cp ?? null,
        sup_curren: currentItem?.supplier?.sup_curren ?? null,
        sup_ket: currentItem?.supplier?.sup_ket ?? null,
        sup_hutang: currentItem?.supplier?.sup_hutang ?? null,
        sup_uang_muka: currentItem?.supplier?.sup_uang_muka ?? null,
        sup_limit: currentItem?.supplier?.sup_limit ?? null,
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

  const addSupplier = async () => {
    const config = {
      ...endpoints.addSupplier,
      data: {
        sup_code: generateCodePreview(),
        sup_name: currentItem?.supplier?.sup_name ?? null,
        sup_jpem: currentItem?.jpem?.id ?? null,
        sup_ppn: currentItem?.supplier?.sup_ppn ?? null,
        sup_pkp: currentItem?.supplier?.sup_pkp ?? null,
        sup_maklon: currentItem?.supplier?.sup_maklon ?? null,
        sup_kode_country: currentItem?.supplier?.sup_kode_country ?? null,
        sup_npwp: currentItem?.supplier?.sup_npwp ?? null,
        sup_country: currentItem?.supplier?.sup_country.name ?? null,
        sup_address: currentItem?.supplier?.sup_address ?? null,
        sup_kota: currentItem?.supplier?.sup_kota ?? null,
        sup_kpos: currentItem?.supplier?.sup_kpos ?? null,
        sup_telp1: currentItem?.supplier?.sup_telp1 ?? null,
        sup_telp2: currentItem?.supplier?.sup_telp2 ?? null,
        sup_fax: currentItem?.supplier?.sup_fax ?? null,
        sup_cp: currentItem?.supplier?.sup_cp ?? null,
        sup_curren: currentItem?.supplier?.sup_curren ?? null,
        sup_ket: currentItem?.supplier?.sup_ket ?? null,
        sup_hutang: currentItem?.supplier?.sup_hutang ?? null,
        sup_uang_muka: currentItem?.supplier?.sup_uang_muka ?? null,
        sup_limit: currentItem?.supplier?.sup_limit ?? null,
        // sup_serialNumber: lastSerialNumber ?? null,
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
            summary: "Gagal",
            detail: `Kode ${currentItem.supplier.sup_code} Sudah Digunakan`,
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

  const delSupplier = async () => {
    setUpdate(true);
    const config = {
      ...endpoints.delSupplier,
      endpoint: endpoints.delSupplier.endpoint + currentItem.supplier.id,
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
      setTimeout(() => {
        setUpdate(false);
        setShowDelete(false);
        onInput(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
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
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        // setUpdate(true);
        editSupplier();
        setActive(0);
      } else {
        // setUpdate(true);
        addSupplier();
        setActive(0);
      }
    }
  };

  const renderFooter = () => {
    if (active !== 2) {
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
                onHideInput();
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
          onClick={() => {
            setUpdate(true);
            onSubmit();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
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
            delSupplier();
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
        <PrimeSingleButton
          label={tr[localStorage.getItem("language")].tambh}
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            setShowInput(true);
            setEdit(false);
            setLoading(false);
            setCurrentItem({
              ...def,
              supplier: {
                ...def.supplier,
                // sup_hutang: setup?.ap?.id,
                // sup_uang_muka: setup?.pur_advance?.id,
              },
            });
            onInput(true);
            getSup();
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

  const ppn = (value) => {
    let selected = {};
    pajak?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });
    return selected;
  };

  const kota = (value) => {
    let selected = {};
    city?.forEach((element) => {
      if (element.city_name === `${value}`) {
        selected = element;
      }
    });
    console.log(currentItem);
    return selected;
  };

  const hut = (value) => {
    let hut = {};
    accAll?.forEach((element) => {
      if (value === element.id) {
        hut = element;
      }
    });
    return hut;
  };

  const generateCodePreview = () => {
    let code = [];

    if (currentItem?.supplier?.sup_kode_country) {
      code.push(currentItem?.supplier?.sup_country?.code);
    }
    if (currentItem?.jpem) {
      code.push(currentItem.jpem.jpem_code);
    }

    code.push(number);

    return code.join("/");
  };
  const glTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
      </div>
    );
  };

  const clear = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option?.acc_name} - ${option?.acc_code}` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
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
  const scrollToTop = () => {
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

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const onHideInput = () => {
    setError(defError);
    setLoading(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
  };

  const isValid = () => {
    let valid = false;
    let active = 2;
    let errors = [
      {
        code:
          !currentItem.supplier.sup_code ||
          currentItem.supplier.sup_code === "",
        name:
          !currentItem.supplier.sup_name ||
          currentItem.supplier.sup_name === "",
        // jpem: !currentItem.jpem?.id,
        // addrs:
        //   !currentItem.supplier.sup_address ||
        //   currentItem.supplier.sup_address === "",
        // city: !currentItem.supplier.sup_kota,
        // npwp:
        //   !currentItem.supplier.sup_npwp ||
        //   currentItem.supplier.sup_npwp === "",
      },
      {
        // phone:
        //   !currentItem.supplier.sup_telp1 ||
        //   currentItem.supplier.sup_telp1 === "0",
        // cp: !currentItem.supplier.sup_cp || currentItem.supplier.sup_cp === "",
      },
      {
        // ppn: !currentItem.supplier.sup_ppn,
        ap:
          localStorage.getItem("product") == "inv+gl"
            ? !currentItem.supplier.sup_hutang
            : false,
        // um: !currentItem.supplier.sup_uang_muka,
      },
    ];

    setError(errors);

    errors.forEach((el, i) => {
      for (var key in el) {
        valid = !el[key];
        if (el[key] && i < active) {
          active = i;
        }
      }
    });

    console.log(active);
    console.log(valid);

    if (!valid) {
      setActive(active);
    }

    return valid;
  };

  const checkCurrency = (value) => {
    let selected = {};
    currency?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const renderBody = () => {
    return (
      <>
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
            "supplier.sup_code",
            "supplier.sup_name",
            "supplier.sup_address",
            "supplier.sup_telp1",
            "supplier.sup_limit",
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
            header={tr[localStorage.getItem("language")].kd_pem}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.supplier?.sup_code}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_pem}
            field={(e) => e.supplier?.sup_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].alamat}
            field={(e) => e.supplier?.sup_address}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].telp}
            field={(e) => e.supplier?.sup_telp1 ?? "-"}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={"Akun Distribusi GL"}
            field={(e) =>
              `${hut(e?.supplier?.sup_hutang)?.acc_code} - ${
                hut(e?.supplier?.sup_hutang)?.acc_name
              }`
            }
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Action"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "3rem" }}
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
        <Toast ref={toast} />
        <Dialog
          header={
            isEdit
              ? tr[localStorage.getItem("language")].edit_data
              : tr[localStorage.getItem("language")].add_data
          }
          visible={showInput}
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => {
            onHideInput();
            onInput(false);
            setActive(0);
          }}
        >
          <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
            <TabPanel
              header="Informasi Supplier"
              headerTemplate={renderTabHeader}
            >
              <div className="row ml-0 mt-0">
                <div className="col-4 mt-0">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].kd_pem}
                    value={generateCodePreview(currentItem?.supplier?.sup_code)}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0]?.code}
                    disabled
                  />
                </div>
                <div className="col-4 mt-0">
                  <PrimeDropdown
                    label={"Jenis Pemasok"}
                    value={currentItem !== null ? currentItem.jpem : null}
                    options={jpem}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        jpem: e.value,
                      });
                      // let newError = error;
                      // newError[0].jpem = false;
                      // setError(newError);
                    }}
                    optionLabel="jpem_name"
                    filter
                    filterBy="jpem_name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    disabled={isEdit}
                    // errorMessage="Jenis Pemasok Belum Dipilih"
                    // error={error[0]?.jpem}
                  />
                </div>{" "}
                <div className="col-4 mt-0"></div>
                <div className="col-4">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].nm_pem}
                    value={
                      currentItem !== null
                        ? `${currentItem?.supplier?.sup_name ?? ""}`
                        : ""
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_name: e.target.value,
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
                <div className="col-4">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].kd_cr}
                  </label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        currentItem
                          ? checkCurrency(currentItem.supplier.sup_curren)
                          : null
                      }
                      options={currency}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_curren: e.target.value.id,
                          },
                        });
                      }}
                      optionLabel="name"
                      filter
                      filterBy="name"
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      // disabled={company && !company.multi_currency}
                    />
                  </div>
                  {/* <small className="text-blue">
                    *Aktifkan Multi Currency Pada Setup Perusahaan Terlebih
                    Dahulu
                  </small> */}
                </div>
                <div className="col-4">
                  <PrimeNumber
                    number
                    label={"NPWP"}
                    value={
                      currentItem !== null
                        ? currentItem?.supplier?.sup_npwp ?? ""
                        : ""
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_npwp: e.target.value,
                        },
                      });

                      // let newError = error;
                      // newError[0].npwp = false;
                      // setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    type="number"
                    min={0}
                    maxLength={16}
                    // error={error[0]?.npwp}
                  />
                </div>{" "}
                <div className="d-flex col-2 align-items-center mt-0">
                  <InputSwitch
                    className="ml-0 mt-1"
                    checked={
                      currentItem !== null ? currentItem.supplier.sup_pkp : null
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_pkp: e.value,
                        },
                      });
                    }}
                    // disabled
                  />
                  <label className="ml-3 mt-2">
                    <b>{"PKP"}</b>
                  </label>
                </div>
                <div className="d-flex col-4 align-items-center mt-0">
                  <InputSwitch
                    className="ml-0 mt-1"
                    checked={
                      currentItem !== null
                        ? currentItem.supplier.sup_maklon
                        : null
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_maklon: e.value,
                        },
                      });
                    }}
                    // disabled
                  />
                  <label className="ml-3 mt-2">
                    <b>{"Maklon"}</b>
                  </label>
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div
                  style={{ width: "px", marginLeft: "px", marginRight: "px" }}
                ></div>
                {/* <div className="col-3">
                  <label>Serial Number</label>
                  <PrimeInput
                    value={`0000${currentItem?.jpem?.id ?? ""}`}
                    disabled
                  />
                </div> */}
              </div>

              <div className="col-12 p-0">
                <div className="mt-4 ml-3 mr-3 fs-16 mb-1">
                  <b>Alamat Pemasok</b>
                </div>
                <Divider className="mb-2 ml-3 mr-3"></Divider>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-6 ">
                  <div className="d-flex flex-column">
                    <label className="text-label">Negara</label>
                    <div className="d-flex align-items-center">
                      <Checkbox
                        className="mr-2"
                        checked={currentItem?.supplier?.sup_kode_country}
                        onChange={(e) => {
                          setCurrentItem({
                            ...currentItem,
                            supplier: {
                              ...currentItem.supplier,
                              sup_kode_country: e.target.checked,
                            },
                          });
                        }}
                      />

                      <div className="justify-content-center flex-grow-1 ml-2">
                        <Dropdown
                          value={currentItem?.supplier?.sup_country}
                          onChange={(e) => {
                            setCurrentItem({
                              ...currentItem,
                              supplier: {
                                ...currentItem.supplier,
                                sup_country: e.value,
                              },
                            });
                          }}
                          options={countries}
                          optionLabel="name"
                          placeholder="Select a Country"
                          filter
                          className="w-full "
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].alamat}
                    value={
                      currentItem !== null
                        ? `${currentItem?.supplier?.sup_address ?? ""}`
                        : ""
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_address: e.target.value,
                        },
                      });
                      const generatedCode = `${
                        currentItem?.supplier?.sup_code ??
                        (currentItem?.supplier?.sup_code ||
                          `${currentItem?.supplier?.sup_country?.code ?? ""}${
                            currentItem?.jpem?.jpem_code
                          }
                          /${number}`) + ``
                      }`;
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_code: generatedCode,
                          sup_address: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[0].addrs = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0]?.addrs}
                  />
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-6">
                  {currentItem?.supplier?.sup_country?.code === "IND" ? (
                    <PrimeDropdown
                      label={tr[localStorage.getItem("language")].kota}
                      value={currentItem?.supplier?.sup_kota ?? null}
                      options={city}
                      onChange={(e) => {
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_kota: e.value ?? null,
                            sup_kpos: e.target.value?.postal_code,
                          },
                        });
                        let newError = error;
                        newError[0].city = false;
                        setError(newError);
                      }}
                      optionLabel="city_name"
                      filter
                      filterBy="city_name"
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      errorMessage="Kota Belum Dipilih"
                      error={error[0]?.city}
                    />
                  ) : (
                    <PrimeInput
                      label={tr[localStorage.getItem("language")].kota}
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_kota ?? ""}`
                          : ""
                      }
                      onChange={(e) => {
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_kota: e.target.value,
                          },
                        });
                      }}
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  )}
                </div>

                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].kd_pos}
                  </label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null &&
                        currentItem.supplier.sup_kota !== null
                          ? (() => {
                              const postalCode = currentItem.supplier.sup_kpos;
                              return postalCode;
                            })()
                          : null
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_kpos: e.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                      disabled={currentItem?.supplier?.sup_kota !== null}
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header="Informasi Kontak"
              headerTemplate={renderTabHeader}
            >
              <div className="row ml-0 mt-0">
                <div className="col-6 mt-0">
                  <PrimeInput
                    label={`${tr[localStorage.getItem("language")].telp} 1`}
                    value={
                      currentItem !== null
                        ? `${currentItem?.supplier?.sup_telp1 ?? ""}`
                        : ""
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_telp1: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[1].phone = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[1]?.phone}
                  />
                </div>

                <div className="col-6">
                  <PrimeInput
                    label={`${tr[localStorage.getItem("language")].telp} 2`}
                    value={
                      currentItem !== null
                        ? `${currentItem?.supplier?.sup_telp2 ?? ""}`
                        : ""
                    }
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_telp2: e.target.value,
                        },
                      })
                    }
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    mode={"decimal"}
                    useGrouping={false}
                  />
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-6 mt-0">
                  <label className="text-label">Fax</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_fax ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_fax: e.target.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].cp}
                    value={
                      currentItem !== null
                        ? `${currentItem?.supplier?.sup_cp ?? ""}`
                        : ""
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_cp: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[1].cp = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[1]?.cp}
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header={tr[localStorage.getItem("language")].limit}
              headerTemplate={renderTabHeader}
            >
              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].pajak}
                    value={
                      currentItem && currentItem?.supplier?.sup_ppn !== null
                        ? ppn(currentItem?.supplier?.sup_ppn)
                        : null
                    }
                    options={pajak}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_ppn: e.value.id ?? null,
                        },
                      });
                      let newError = error;
                      newError[2].ppn = false;
                      setError(newError);
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    errorMessage="Jenis Pajak Belum Dipilih"
                    error={error[2]?.ppn}
                    showClear
                  />
                </div>

                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].limit}
                  </label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_limit ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_limit: e.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-12">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].ket}
                  </label>
                  <div className="p-inputgroup">
                    <InputTextarea
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_ket ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_ket: e.target.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 p-0">
                <div className="mt-4 ml-3 mr-3 fs-16 mb-1">
                  <b>Distribusi GL/AP</b>
                </div>
                <Divider className="mb-2 ml-3 mr-3"></Divider>
              </div>
              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <PrimeDropdown
                    label={"Kode Distribusi AP"}
                    value={
                      currentItem && currentItem?.supplier?.sup_hutang !== null
                        ? hut(currentItem?.supplier?.sup_hutang)
                        : null
                    }
                    options={accHut}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_hutang: e?.value?.id ?? null,
                        },
                      });
                      let newError = error;
                      newError[2].ap = false;
                      setError(newError);
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="acc_name"
                    placeholder="Kode Distribusi Hutang"
                    showClear
                    errorMessage="Kode Distribusi AP Belum Dipilih"
                    error={error[2]?.ap}
                  />
                  <small className="text-blue">
                    *Harap Periksa Setup Akun AR/AP Apabila Daftar Akun Tidak
                    Muncul
                  </small>
                </div>

                <div className="col-6">
                  <PrimeDropdown
                    label={"Uang Muka Pembelian"}
                    value={
                      currentItem?.supplier?.sup_uang_muka !== null
                        ? hut(currentItem?.supplier?.sup_uang_muka)
                        : null
                    }
                    options={accUm}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_uang_muka: e.value?.id ?? null,
                        },
                      });
                      // let newError = error;
                      // newError[2].um = false;
                      // setError(newError);
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="acc_name"
                    placeholder="Kode Distribusi Uang Muka"
                    showClear
                    // errorMessage="Uang Muka Pembelian Belum Dipilih"
                    // error={error[2]?.um}
                  />
                </div>
              </div>
              <div className="row ml-0 mt-0"></div>
            </TabPanel>
          </TabView>
        </Dialog>

        <Dialog
          header={tr[localStorage.getItem("language")].hapus_data}
          visible={showDelete}
          style={{ width: "30vw" }}
          footer={renderFooterDel()}
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
          header={"Data Supplier"}
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

export default DataSupplier;
