import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
import { InputNumber } from "primereact/inputnumber";
import { Divider, Icon } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import { Badge } from "primereact/badge";
import DataJenisPelanggan from "../../Master/JenisPelanggan/DataJenisPelanggan";
import { InputSwitch } from "primereact/inputswitch";
import DataPajak from "../../Master/Pajak/DataPajak";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { tr } from "../../../../data/tr";
import { SelectButton } from "primereact/selectbutton";
import endpoints from "../../../../utils/endpoints";
import { set } from "date-fns";
import { Checkbox } from "primereact/checkbox";

const def = {
  customer: {
    id: null,
    cus_code: null,
    cus_name: null,
    cus_jpel: null,
    cus_sub_area: null,
    cus_npwp: null,
    cus_pkp: null,
    cus_country: null,
    cus_address: null,
    cus_kota: null,
    cus_kpos: null,
    cus_telp1: null,
    cus_telp2: null,
    cus_email: null,
    cus_fax: null,
    cus_cp: null,
    cus_curren: null,
    cus_pjk: null,
    cus_ket: null,
    cus_gl: null,
    cus_uang_muka: null,
    cus_limit: null,
    sub_cus: false,
    cus_id: null,
    cus_serialNumber: 0,
  },

  jpel: {
    id: null,
    jpel_code: "",
    jpel_name: "",
    jpel_ket: "",
  },

  subArea: {
    id: null,
    sub_code: "",
    sub_area_code: "",
    sub_name: "",
    sub_ket: "",
  },

  currency: {
    id: null,
    code: "",
    name: "",
  },
};

const defError = [
  {
    code: false,
    name: false,
    // jpel: false,
    induk: false,
    addrs: false,
    city: false,
    // npwp: false,
  },
  {
    phone: false,
    email: false,
    cp: false,
  },
  {
    // ppn: false,
    ar: false,
    // um: false,
  },
];

const opt = [
  { name: "Dalam Negeri", code: "DN" },
  { name: "Luar Negeri", code: "LN" },
];

const DataCustomer = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [customer, setCustomer] = useState(null);
  const [nonSub, setNonSub] = useState(null);
  const [city, setCity] = useState(null);
  const [jpel, setJpel] = useState(null);
  const [subArea, setSubArea] = useState(null);
  const [setup, setSetup] = useState(null);
  const [acc, setAcc] = useState(null);
  const [checked, setChecked] = useState({
    customer: { cus_country: { code: "" } },
  });

  const [accAr, setAccAr] = useState(null);
  const [accUm, setAccUm] = useState(null);
  const [allAcc, setAllAcc] = useState(null);
  const [comp, setComp] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [pajak, setPajak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [active, setActive] = useState(0);
  const [showJenisPelanggan, setShowJenisPelanggan] = useState(false);
  const [showPajak, setShowPajak] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);
  const [error, setError] = useState(defError);
  const [lastSerialNumber, setLastSerialNumber] = useState("");

  useEffect(() => {
    getSetup();
    getCity();
    getJpel();
    getSubArea();
    getCurrency();
    getComp();
    getPajak();
    initFilters1();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const countries = [
    { name: "Australia", code: "AU-", id: 1 },
    { name: "Brazil", code: "BR-", id: 2 },
    { name: "China", code: "CN-", id: 3 },
    { name: "Egypt", code: "EG-", id: 4 },
    { name: "France", code: "FR-", id: 5 },
    { name: "Germany", code: "DE-", id: 6 },
    { name: "India", code: "IN-", id: 7 },
    { name: "Indonesia", code: "IND-", id: 8 },
    { name: "Japan", code: "JP-", id: 9 },
    { name: "Spain", code: "ES-", id: 10 },
    { name: "United States", code: "US-", id: 11 },
  ];

  const generateCode = () => {
    const countryCode = checked?.customer?.cus_country?.code || "";
    const jpelCode = currentItem?.jpel?.jpel_code || "";
    return checked?.customer?.cus_country?.code
      ? `${countryCode}${jpelCode}/${lastSerialNumber}`
      : `${countryCode}${jpelCode}/${lastSerialNumber}`;
  };

  const getCustomer = async () => {
    setLoading(true);
    const config = {
      ...endpoints.customer_code,
      data: {},
    };

    try {
      console.log(config.data);
      let response = await request(null, config);
      console.log("codeeeee");
      console.log(response);

      if (response.status) {
        const { data } = response;
        setLastSerialNumber(data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSetup = async () => {
    const config = {
      ...endpoints.getSetup,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response?.status) {
        const { data } = response;
        console.log(data);
        setSetup(data);
        getAcc(data);
      }
    } catch (error) {}
  };

  const getAcc = async (setup) => {
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
        let all_acc = [];
        let filt = [];
        let acc_ar = [];
        let set_acc = null;

        data?.forEach((element) => {
          if (element.account.dou_type === "D") {
            filt.push(element.account);
          }

          if (
            element?.account?.umm_code === setup?.ar?.acc_code &&
            element?.account?.dou_type === "D"
          ) {
            acc_ar.push(element?.account);
          }

          all_acc.push(element?.account);
        });

        console.log("setup");
        console.log(setup?.ar?.acc_code);

        setAcc(data);
        setAccAr(acc_ar);
        setAccUm(filt);
        setAllAcc(all_acc);
      }
    } catch (error) {}
  };

  const getCity = async () => {
    const config = {
      ...endpoints.city,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCity(data);
      }
    } catch (error) {}
  };

  const getJpel = async (isUpdate = false) => {
    const config = {
      ...endpoints.jenisPel,
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
        setJpel(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
    }
  };

  const getPajak = async (isUpdate = false) => {
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
    if (isUpdate) {
      setLoading(false);
    } else {
    }
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
        console.log(data);
        setComp(data);
      }
    } catch (error) {}
  };

  const getSubArea = async (isUpdate = false) => {
    const config = {
      ...endpoints.subArea,
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
        let sub = [];
        data.forEach((element) => {
          sub.push(element.subArea);
        });
        setSubArea(sub);
      }
    } catch (error) {}
  };

  const getCurrency = async () => {
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

  const editCustomer = async () => {
    const config = {
      ...endpoints.editCustomer,
      endpoint: endpoints.editCustomer.endpoint + currentItem.customer.id,
      data: {
        ...currentItem,
        cus_code: currentItem?.customer?.cus_code ?? null,
        cus_name: currentItem?.customer?.cus_name ?? null,
        cus_jpel: currentItem?.jpel?.id ?? null,
        cus_sub_area: currentItem?.subArea?.id ?? null,
        cus_pjk: currentItem?.customer?.cus_pjk ?? null,
        cus_npwp: currentItem?.customer?.cus_npwp ?? null,
        cus_pkp: currentItem?.customer?.cus_pkp ?? null,
        cus_country: currentItem?.customer?.cus_country ?? null,
        cus_address: currentItem?.customer?.cus_address ?? null,
        cus_kota: currentItem?.customer?.cus_kota ?? null,
        cus_kpos: currentItem?.customer?.cus_kpos ?? null,
        cus_telp1: currentItem?.customer?.cus_telp1 ?? null,
        cus_telp2: currentItem?.customer?.cus_telp2 ?? null,
        cus_email: currentItem?.customer?.cus_email ?? null,
        cus_fax: currentItem?.customer?.cus_fax ?? null,
        cus_cp: currentItem?.customer?.cus_cp ?? null,
        cus_ket: currentItem?.customer?.cus_ket ?? null,
        cus_gl: currentItem?.customer?.cus_gl ?? null,
        cus_uang_muka: currentItem?.customer?.cus_uang_muka ?? null,
        cus_limit: currentItem?.customer?.cus_limit ?? null,
        sub_cus: currentItem?.customer?.sub_cus ?? null,
        cus_id: currentItem?.customer?.cus_id ?? null,
        cus_curren: currentItem?.customer?.cus_curren ?? null,
        cus_serialNumber: currentItem?.customer?.cus_serialNumber ?? null,
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
            summary: tr[localStorage.getItem("language")].berhasl,
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

  const addCustomer = async () => {
    const config = {
      ...endpoints.addCustomer,
      data: {
        ...currentItem,
        cus_code: currentItem?.customer?.cus_code ?? null,
        cus_name: currentItem?.customer?.cus_name ?? null,
        cus_jpel: currentItem?.jpel?.id ?? null,
        cus_sub_area: currentItem?.subArea?.id ?? null,
        cus_pjk: currentItem?.customer?.cus_pjk ?? null,
        cus_npwp: currentItem?.customer?.cus_npwp ?? null,
        cus_pkp: currentItem?.customer?.cus_pkp ?? null,
        cus_country: currentItem?.customer?.cus_country.name ?? null,
        cus_address: currentItem?.customer?.cus_address ?? null,
        cus_kota: currentItem?.customer?.cus_kota ?? null,
        cus_kpos: currentItem?.customer?.cus_kpos ?? null,
        cus_telp1: currentItem?.customer?.cus_telp1 ?? null,
        cus_telp2: currentItem?.customer?.cus_telp2 ?? null,
        cus_email: currentItem?.customer?.cus_email ?? null,
        cus_fax: currentItem?.customer?.cus_fax ?? null,
        cus_cp: currentItem?.customer?.cus_cp ?? null,
        cus_curren: currentItem?.customer?.cus_curren ?? null,
        cus_ket: currentItem?.customer?.cus_ket ?? null,
        cus_gl: currentItem?.customer?.cus_gl ?? null,
        cus_uang_muka: currentItem?.customer?.cus_uang_muka ?? null,
        cus_limit: currentItem?.customer?.cus_limit ?? null,
        sub_cus: currentItem?.customer?.sub_cus ?? null,
        cus_id: currentItem?.customer?.cus_id ?? null,
        cus_serialNumber: lastSerialNumber ?? null,
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
            summary: tr[localStorage.getItem("language")].berhasl,
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
            detail: `Kode ${currentItem.customer.cus_code} Sudah Digunakan`,
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

  const delCustomer = async () => {
    setUpdate(true);
    const config = {
      ...endpoints.delCustomer,
      endpoint: endpoints.delCustomer.endpoint + currentItem.customer.id,
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
            summary: tr[localStorage.getItem("language")].berhasl,
            detail: tr[localStorage.getItem("language")].del_berhasil,
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
          detail: tr[localStorage.getItem("language")].del_gagal,
          life: 3000,
        });
      }, 500);
    }
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

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            setEdit(true);
            setShowInput(true);
            onInput(true);
            setCurrentItem({
              ...data,
              customer: { ...data.customer, cus_id: data.customer.id },
            });
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        // setUpdate(true);
        editCustomer();
        setActive(0);
      } else {
        // setUpdate(true);
        addCustomer();
        setActive(0);
      }
    }
  };

  const isValid = () => {
    let valid = false;
    let active = 2;
    let errors = [
      {
        code:
          !currentItem.customer.cus_code ||
          currentItem.customer.cus_code === "",
        name:
          !currentItem.customer.cus_name ||
          currentItem.customer.cus_name === "",
      },
      {},
      {
        ar: !currentItem.customer.cus_gl,
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
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            delCustomer();
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
          icon={<i className="bx bx-plus px-2"></i>}
          onClick={() => {
            setShowInput(true);
            setEdit(false);
            setLoading(false);
            setCurrentItem(def);
            getCustomer();
            onInput(true);
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

  const gl = (value) => {
    let acc = {};
    allAcc?.forEach((element) => {
      if (value === element.id) {
        acc = element;
      }
    });
    return acc;
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
          {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
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

  const checkPelanggan = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
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

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const chekcountry = (value) => {
    let selected = {};
    countries?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
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

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element?.account?.id) {
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
            "customer.cus_code",
            "customer.cus_name",
            "customer.cus_address",
            "customer.cus_telp1",
            "customer.cus_limit",
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
            header={tr[localStorage.getItem("language")].kd_pel}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e?.customer?.cus_code}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : e?.customer?.sub_cus ? (
                <div>
                  <span>{e?.customer?.cus_code} </span>
                  <Badge
                    value={`Sub ${e?.customer?.cus_id?.cus_code}`}
                    className={"active ml-2"}
                  ></Badge>
                </div>
              ) : (
                <span>{e?.customer?.cus_code} </span>
              )
            }
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_pel}
            field={(e) => e?.customer?.cus_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].alamat}
            field={(e) => e?.customer?.cus_address}
            style={{ minWidth: "8rem", maxWidth: "25rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].telp}
            field={(e) => e?.customer?.cus_telp1 ?? "-"}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={"Akun Distribusi GL"}
            field={(e) =>
              `${checkAcc(e?.customer.cus_gl)?.account?.acc_code} - ${
                checkAcc(e?.customer.cus_gl)?.account?.acc_name
              }`
            }
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Action"
            dataType="boolean"
            bodyClassName="text-center"
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
    console.log("edit data customer");
    console.log(currentItem);
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
              header="Informasi Pelanggan"
              headerTemplate={renderTabHeader}
            >
              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].kd_pel}
                    value={currentItem?.customer?.cus_code}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_code: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[0].code = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0]?.code}
                    // disabled
                  />
                </div>
                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].nm_pel}
                    value={`${currentItem?.customer?.cus_name ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_name: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[0].name = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0].name}
                  />
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <PrimeDropdown
                    label={"Jenis Pelanggan"}
                    value={currentItem !== null ? currentItem?.jpel : null}
                    options={jpel}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        jpel: e.value,
                      });
                      // let newError = error;
                      // newError[0].jpel = false;
                      // setError(newError);
                    }}
                    optionLabel="jpel_name"
                    filter
                    filterBy="jpel_name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    disabled={isEdit}
                    // errorMessage="Jenis pelanggan harus dipilih"
                    // error={error[0]?.jpel}
                  />
                </div>

                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].sub_area}
                  </label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={currentItem !== null ? currentItem.subArea : null}
                      options={subArea}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          subArea: e.value,
                        });
                      }}
                      optionLabel="sub_name"
                      filter
                      filterBy="sub_name"
                      placeholder={tr[localStorage.getItem("language")].pilih}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].currency}
                    value={
                      currentItem
                        ? checkCurrency(currentItem.customer.cus_curren)
                        : null
                    }
                    options={currency}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_curren: e.value.id,
                        },
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                  />
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-4">
                  <PrimeNumber
                    label={"NPWP"}
                    value={`${currentItem?.customer?.cus_npwp ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_npwp: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[0].npwp = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    type="number"
                    error={error[0]?.npwp}
                  />
                </div>

                <div className="d-flex col-2 align-items-center mt-4">
                  <InputSwitch
                    className="ml-0 mt-1"
                    checked={
                      currentItem !== null ? currentItem.customer.cus_pkp : null
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_pkp: e.value,
                        },
                      });
                    }}
                    // disabled
                  />
                  <label className="ml-3 mt-3">
                    <b>{"PKP"}</b>
                  </label>
                </div>
              </div>

              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={currentItem && currentItem?.customer?.sub_cus}
                  onChange={(e) => {
                    setCurrentItem({
                      ...currentItem,
                      customer: { ...currentItem.customer, sub_cus: e.value },
                    });
                  }}
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {tr[localStorage.getItem("language")].sub_pel}
                </label>
                <div className="col-2"></div>{" "}
                <div
                  style={{ width: "8px", marginLeft: "px", marginRight: "5px" }}
                ></div>
                {/* <div className="col-3">
                  <label>Serial Number</label>
                  <PrimeInput
                    value={`0000${currentItem?.jpel?.id ?? ""}`}
                    disabled
                  />
                </div> */}
              </div>

              {currentItem?.customer?.sub_cus && (
                <div className="col-12">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].induk_pel}
                    value={
                      currentItem !== null
                        ? checkPelanggan(currentItem?.customer?.cus_id)
                        : null
                    }
                    options={nonSub}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_id: e.value.customer.id,
                        },
                      });
                      let newError = error;
                      newError[0].induk = false;
                      setError(newError);
                    }}
                    optionLabel="customer.cus_name"
                    filter
                    filterBy="customer.cus_name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    itemTemplate={(e) => (
                      <div>{`${e?.customer.cus_name} (${e?.customer.cus_code})`}</div>
                    )}
                    valueTemplate={(e, props) =>
                      e ? (
                        <div>{`${e?.customer.cus_name} (${e?.customer.cus_code})`}</div>
                      ) : (
                        <span>{props.placeholder}</span>
                      )
                    }
                    error={error[0]?.induk}
                    errorMessage="Induk palanggan harus dipilih"
                  />
                </div>
              )}

              <div className="col-12 p-0">
                <div className="mt-4 ml-3 mr-3 fs-14 mb-1">
                  <b>Alamat Pelanggan</b>
                </div>
                <Divider className="mb-2 ml-3 mr-3"></Divider>
              </div>

              <div className="col-12">
                <div className="d-flex flex-column">
                  <label className="text-label">Negara</label>
                  <div className="d-flex align-items-center">
                    <Checkbox
                      className="mr-2"
                      checked={!!checked?.customer?.cus_country?.code}
                      onChange={(e) => {
                        const newChecked = {
                          ...checked,
                          customer: {
                            ...checked.customer,
                            cus_country: {
                              ...checked.customer.cus_country,
                              code: e.target.checked
                                ? currentItem?.customer?.cus_country?.code
                                : "",
                            },
                          },
                        };
                        setChecked(newChecked);
                      }}
                    />
                    <div className="justify-content-center flex-grow-1 ml-2">
                      <Dropdown
                        value={currentItem?.customer?.cus_country ?? null}
                        onChange={(e) => {
                          console.log("Selected country:", e.value.name);
                          setCurrentItem({
                            ...currentItem,
                            customer: {
                              ...currentItem.customer,
                              cus_country: e.value,
                            },
                          });
                        }}
                        options={countries}
                        optionLabel="name"
                        placeholder="Select a Country"
                        filter
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-12">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].alamat}
                    value={`${currentItem?.customer?.cus_address ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_address: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[0].addrs = false;
                      setError(newError);
                      const generatedCode = `${
                        currentItem?.customer?.cus_code ??
                        (currentItem?.customer?.cus_code ||
                          `${checked?.customer?.cus_country?.code ?? ""}${
                            currentItem?.jpel?.jpel_code
                          }/${lastSerialNumber}`) + ``
                      }`;
                      console.log("generat", currentItem);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_code: generatedCode,
                          cus_address: e.target.value,
                        },
                      });
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0]?.addrs}
                  />
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  {currentItem?.customer?.cus_country?.code === "IND-" ? (
                    <PrimeDropdown
                      label={tr[localStorage.getItem("language")].kota}
                      value={currentItem.customer.cus_kota ?? null}
                      options={city}
                      onChange={(e) => {
                        console.log("joo", e.target.value.postal_code);
                        setCurrentItem({
                          ...currentItem,
                          customer: {
                            ...currentItem.customer,
                            cus_kota: e.value ?? null,
                            cus_kpos: e.target.value.postal_code,
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
                      error={error[0]?.city}
                      errorMessage="Kota pelanggan harus dipilih"
                    />
                  ) : (
                    <PrimeInput
                      label={tr[localStorage.getItem("language")].kota}
                      value={
                        currentItem !== null
                          ? `${currentItem?.customer?.cus_kota ?? ""}`
                          : ""
                      }
                      onChange={(e) => {
                        setCurrentItem({
                          ...currentItem,
                          customer: {
                            ...currentItem.customer,
                            cus_kota: e.target.value,
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
                    <InputNumber
                      value={
                        currentItem !== null &&
                        currentItem.customer.cus_kota !== null
                          ? (() => {
                              const postalCode = currentItem.customer.cus_kpos;
                              console.log("postalCode", postalCode);
                              return postalCode;
                            })()
                          : null
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          customer: {
                            ...currentItem.customer,
                            cus_kpos: e.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                      disabled={currentItem?.customer?.cus_kota !== null}
                      mode="decimal"
                      useGrouping={false}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header="Informasi Kontak"
              headerTemplate={renderTabHeader}
            >
              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <PrimeInput
                    isNumber
                    label={`${tr[localStorage.getItem("language")].telp} 1`}
                    value={`${currentItem?.customer?.cus_telp1 ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_telp1: e.value,
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
                    isNumber
                    label={`${tr[localStorage.getItem("language")].telp} 2`}
                    value={`${currentItem?.customer?.cus_telp2 ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_telp2: e.value,
                        },
                      })
                    }
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    mode={"decimal"}
                    useGrouping={false}
                  />
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].email}
                    isEmail
                    value={
                      currentItem !== null
                        ? `${currentItem?.customer?.cus_email ?? ""}`
                        : ""
                    }
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_email: e.target.value,
                        },
                      });
                      let newError = error;
                      newError[1].email = false;
                      setError(newError);
                    }}
                    placeholder="Cth. ar@gmail.com"
                    error={error[1]?.email}
                  />
                </div>

                <div className="col-6">
                  <label className="text-label">Fax</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={`${currentItem?.customer?.cus_fax ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          customer: {
                            ...currentItem.customer,
                            cus_fax: e.target.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-12">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].cp}
                    value={`${currentItem?.customer?.cus_cp ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_cp: e.target.value,
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
              <div className="row mr-0 ml-0">
                {/* <div className="col-6">
                  <label className="text-label">Currency</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={currentItem !== null ? currentItem.currency : null}
                      options={currency}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          currency: e.value,
                        });
                      }}
                      optionLabel="code"
                      filter
                      filterBy="name"
                      placeholder="Pilih Jenis Currency"
                      disabled={company && !company.multi_currency}
                    />
                  </div>
                  <small className="text-blue">
                    *Aktifkan Multi Currency Pada Setup Perusahaan Terlebih
                    Dahulu
                  </small>
                </div> */}
                <div className="col-6">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].pajak}
                    value={
                      currentItem && currentItem?.customer?.cus_pjk !== null
                        ? ppn(currentItem?.customer?.cus_pjk)
                        : null
                    }
                    options={pajak}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_pjk: e?.value?.id ?? null,
                        },
                      });
                      // let newError = error;
                      // newError[2].ppn = false;
                      // setError(newError);
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    showClear
                    // error={error[2]?.ppn}
                    // errorMessage="Jenis Pajak belum dipilih"
                  />
                </div>

                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].limit}
                  </label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={`${currentItem?.customer?.cus_limit ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          customer: {
                            ...currentItem.customer,
                            cus_limit: e.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-12">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].ket}
                  </label>
                  <div className="p-inputgroup">
                    <InputTextarea
                      value={`${currentItem?.customer?.cus_ket ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          customer: {
                            ...currentItem.customer,
                            cus_ket: e.target.value,
                          },
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>
              </div>

              <h5 className="mt-4 ml-3 mr-3">
                <b>Distribusi GL/AR</b>
              </h5>
              <Divider className="mb-2 ml-3 mr-3"></Divider>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <PrimeDropdown
                    label={"Kode Distribusi AR"}
                    value={
                      currentItem !== null &&
                      currentItem?.customer?.cus_gl !== null
                        ? gl(currentItem.customer.cus_gl)
                        : null
                    }
                    options={accAr}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_gl: e.value?.id ?? null,
                        },
                      });
                      let newError = error;
                      newError[2].ar = false;
                      setError(newError);
                    }}
                    optionLabel="acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="acc_name"
                    placeholder="Pilih Kode Distribusi AR"
                    showClear
                    error={error[2]?.ar}
                    errorMessage="Kode Akun belum dipilih"
                    // disabled={localStorage.getItem("product") !== "inv+gl"}
                  />
                  <small className="text-blue">
                    *Harap Periksa Setup Akun AR/AP Apabila Daftar Akun Tidak
                    Muncul
                  </small>
                </div>

                <div className="col-6">
                  <PrimeDropdown
                    label={"Kode Distribusi Uang Muka Penjualan"}
                    value={
                      currentItem !== null &&
                      currentItem.customer.cus_uang_muka !== null
                        ? gl(currentItem.customer.cus_uang_muka)
                        : null
                    }
                    options={accUm}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_uang_muka: e.value?.id ?? null,
                        },
                      });
                      // let newError = error;
                      // newError[2].um = false;
                      // setError(newError);
                    }}
                    optionLabel="acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="acc_name"
                    placeholder="Pilih Kode Distribusi Uang Muka Penjualan"
                    showClear
                    // error={error[2]?.um}
                    // errorMessage="Kode Uang Muka Penjualan belum dipilih"
                    // disabled={localStorage.getItem("product") !== "inv+gl"}
                  />
                </div>
              </div>

              <div className="row mr-0 ml-0"></div>
            </TabPanel>
          </TabView>
        </Dialog>

        <Dialog
          header={tr[localStorage.getItem("language")].hapus_data}
          visible={showDelete}
          style={{ width: "30vw" }}
          footer={renderFooterDel}
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

        <DataJenisPelanggan
          data={jpel}
          loading={false}
          popUp={true}
          show={showJenisPelanggan}
          onHide={() => {
            setShowJenisPelanggan(false);
          }}
          onInput={(e) => {
            setShowJenisPelanggan(!e);
          }}
          onSuccessInput={(e) => {
            getJpel(true);
          }}
          onRowSelect={(e) => {
            if (doubleClick) {
              setShowJenisPelanggan(false);
              setCurrentItem({
                ...currentItem,
                jpel: e.data,
              });
            }

            setDoubleClick(true);

            setTimeout(() => {
              setDoubleClick(false);
            }, 2000);
          }}
        />

        <DataPajak
          data={pajak}
          loading={false}
          popUp={true}
          show={showPajak}
          onHide={() => {
            setShowPajak(false);
          }}
          onInput={(e) => {
            setShowPajak(!e);
          }}
          onSuccessInput={(e) => {
            getPajak(true);
          }}
          onRowSelect={(e) => {
            if (doubleClick) {
              setShowPajak(false);
              setCurrentItem({
                ...currentItem,
                cus_pjk: e.data,
              });
            }

            setDoubleClick(true);

            setTimeout(() => {
              setDoubleClick(false);
            }, 2000);
          }}
        />
      </>
    );
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Customer"}
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

export default DataCustomer;
