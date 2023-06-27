import React, { useState, useEffect, useRef } from "react";
import { endpoints, request } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row, Col, Card } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
// import { SET_SALDO_STATUS } from "src/redux/actions";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Calendar } from "primereact/calendar";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import { tr } from "src/data/tr";
// import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";

const data = {
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
const yearOptions = [
  { label: "2022", value: 2022 },
  { label: "2023", value: 2023 },
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
  { label: "2026", value: 2026 },
  { label: "2027", value: 2027 },
  { label: "2028", value: 2028 },
  { label: "2029", value: 2029 },
  { label: "2030", value: 2030 },
  { label: "2031", value: 2031 },
  { label: "2032", value: 2032 },
  { label: "2033", value: 2033 },
  { label: "2034", value: 2034 },
  { label: "2035", value: 2035 },
  { label: "2036", value: 2036 },
  { label: "2037", value: 2037 },
  { label: "2038", value: 2038 },
  { label: "2039", value: 2039 },
  { label: "2040", value: 2040 },
];

const Budgeting = () => {
  const [account, setAccount] = useState(null);
  const [trans, setTrans] = useState(null);
  const [budget, setBudget] = useState(null);
  const [setAcc, setSetupAcc] = useState(null);
  const [setup, setSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(100);
  const [month, setMonth] = useState();
  const [comp, setComp] = useState(null);
  const dummy = Array.from({ length: 100 });
  const [products, setProducts] = useState([]);
  const [nama, setNama] = useState("");
  const [janu, setjanu] = useState("");
  const [februari, setfebruari] = useState("");
  const [maret, setmaret] = useState("");
  const [april, setapril] = useState("");
  const [mei, setmei] = useState("");
  const [juni, setjuni] = useState("");
  const [value, setValue] = useState("");
  const [juli, setjuli] = useState("");
  const [agus, setagus] = useState("");
  const [sept, setsept] = useState("");
  const [okto, setokto] = useState("");
  const [nove, setnove] = useState("");
  const [dese, setdese] = useState("");
  // const [filtDate, setFiltDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getSetAcc();
    getSetup();
    getComp();
    getYear();
    initFilters1();
    getAccDef();
    getTrans();
  }, []);

  // const getSaStatus = async () => {
  //   const config = {
  //     ...endpoints.saldo_sa_gl_sts,
  //     data: {},
  //   };
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       const { data } = response;
  //       dispatch({
  //         type: SET_SALDO_STATUS,
  //         payload: data,
  //       });
  //     }
  //   } catch (error) {}
  // };

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

  const getYear = async (isUpdate = false) => {
    // setLoading(true);
    const config = {
      ...endpoints.getYear,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setMonth({
          ...data,
          month: data.month === 1 ? 12 : data.month,
          year: data.month === 1 ? data.year - 1 : data.year,
        });
      }
    } catch (error) {}
  };

  const getAccDef = async (isUpdate = false) => {
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
        setAccount(data);
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

  const getAccount = async (isUpdate = false) => {
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
        console.log("saldo akun", filt);
        data.forEach((element) => {
          if (
            element.klasifikasi.id === 1 ||
            element.klasifikasi.id === 2 ||
            element.klasifikasi.id === 3 ||
            element.klasifikasi.id === 4 ||
            element.klasifikasi.id === 5 ||
            element.klasifikasi.id === 6 ||
            element.klasifikasi.id === 7 ||
            element.klasifikasi.id === 8 ||
            element.klasifikasi.id === 9
          ) {
            if (element.account.dou_type === "D") {
              filt.push({
                acc_year: null,
                acc_month: null,
                acc_code: element.account.acc_code,
                acc_awal: 0,
                nom_jan: 0,
                nom_feb: 0,
                nom_mar: 0,
                nom_apr: 0,
                nom_mei: 0,
                nom_jun: 0,
                nom_jul: 0,
                nom_agu: 0,
                nom_sep: 0,
                nom_okt: 0,
                nom_nov: 0,
                nom_des: 0,
              });
            }
          }
        });
        setBudget(filt);
        setAccount(data);
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

  const getSaldo = async (isUpdate = false, loading = true) => {
    if (loading) {
      setLoading(true);
    }
    const config = {
      ...endpoints.budgeting,
      data: {},
    };
    console.log("kokokokoko", config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        if (data.length) {
          setBudget(data);
          setEdit(true);
        } else {
          getAccount();
        }
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    // getSaStatus();
  };

  const getSetup = async (isUpdate = false) => {
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

        setSetup(data);
      }
    } catch (error) {}
  };

  const getSetAcc = async () => {
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
        setSetupAcc(data);
      }
    } catch (error) {}
    getSaldo();
  };

  const addSal = async () => {
    let acc = [];
    budget?.forEach((element) => {
      acc.push({
        acc_year: new Date().getFullYear(),
        acc_month: setup?.cutoff,
        acc_code: element.acc_code,
        acc_awal: element.acc_awal,
        nom_jan: element.nom_jan,
        nom_feb: element.nom_feb,
        nom_mar: element.nom_mar,
        nom_apr: element.nom_apr,
        nom_mei: element.nom_mei,
        nom_jun: element.nom_jun,
        nom_jul: element.nom_jul,
        nom_agu: element.nom_agu,
        nom_sep: element.nom_sep,
        nom_okt: element.nom_okt,
        nom_nov: element.nom_nov,
        nom_des: element.nom_des,
        // checkAcc(element.acc_code)?.account?.sld_type == "D"
        //   ? element.acc_awal
        //   : 0 - element.acc_awal,
      });
    });
    const config = {
      ...endpoints.add_budgeting,
      data: {
        // nama_budget: currentItem.nama_budget ?? null,
        // tahun_budget: currentItem.tahun_budget ?? null,

        acc: acc,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          getSaldo(true, false);
          toast?.current?.show({
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
        toast?.current?.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Berhasil memperbarui data",
          // sticky: true,
          life: 3000,
        });
      }, 500);
    }
  };

  const editSaldo = async () => {
    let acc = [];
    budget?.forEach((element) => {
      acc.push({
        id: element.id,
        acc_year: new Date().getFullYear(),
        acc_month: setup?.cutoff,
        acc_code: element.acc_code,
        acc_awal: element.acc_awal,
        nom_jan: element.nom_jan,
        nom_feb: element.nom_feb,
        nom_mar: element.nom_mar,
        nom_apr: element.nom_apr,
        nom_mei: element.nom_mei,
        nom_jun: element.nom_jun,
        nom_jul: element.nom_jul,
        nom_agu: element.nom_agu,
        nom_sep: element.nom_sep,
        nom_okt: element.nom_okt,
        nom_nov: element.nom_nov,
        nom_des: element.nom_des,
        // checkAcc(element.acc_code)?.account?.sld_type == "D"
        //   ? element.acc_awal
        //   : 0 - element.acc_awal,
      });
    });

    const config = {
      ...endpoints.edit_budget,
      data: {
        // nama_budget: currentItem.nama_budget ?? null,
        // tahun_budget: currentItem.tahun_budget ?? null,
        acc: acc,
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
          getSaldo(true, false);
          toast?.current?.show({
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
        toast?.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal memperbarui data",
          // sticky: true,
          life: 3000,
        });
      }, 500);
    }
  };

  const onSubmit = () => {
    if (isEdit) {
      editSaldo();
    } else {
      addSal();
    }
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
    let date = new Date();
    return (
      <Row>
        <div className="flex  col-3">
          <span className="p-float-label">
            <InputText
             header="Februari"
            //  field={(e) => formatIdr(e?.nama_budget)}
             style={{ minWidth: "6rem" }}
             body={loading && <Skeleton />}
             editor={(e) => textEditor(e, "nama_budget")}
             onCellEditComplete={(e) => {
               console.log(e);
               onSubmit();
             }}
            />
            <label htmlFor="username">Masukkan Nama Budget</label>
          </span>
          <div className="col-1"></div>
          <div className="p-float-label">
            <Dropdown
              id="year"
              value={selectedYear}
              options={yearOptions}
              onChange={(e) => setSelectedYear(e.value)}
              style={{ width: "200px" }}
            />
            <label htmlFor="year">Pilih Tahun Budget</label>
          </div>
        </div>
      </Row>
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

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account?.acc_code) {
        selected = element;
      }
    });

    return selected;
  };

  const textEditor = (data, field) => {
    console.log("================");
    console.log(data.rowData);
    return (
      <div className="p-inputgroup">
        <PrimeNumber
          price
          value={data?.rowData?.[field]}
          onChange={(e) => {
            let temp = budget;
            temp[data.rowIndex][field] = e.value;
            console.log("================");
            console.log(data.rowData);
            setBudget(temp);
          }}
        />
      </div>
    );
  };

  console.log("=========post month", month?.month);
  console.log("=========post year", month?.year);
  console.log("=========co month", comp?.cutoff);
  console.log("=========co year", comp?.year_co);
  console.log("=========trans", trans?.length);
  const [inputValues, setInputValues] = useState({});
  const onCellValueChange = (event, rowData, field) => {
    const updatedProducts = [...products];
    const updatedProduct = { ...rowData, [field]: event.target.value };
    const rowIndex = products.findIndex((product) => product.id === rowData.id);
    updatedProducts[rowIndex] = updatedProduct;
    setProducts(updatedProducts);
  };

  const handleInputChange = (e, rowData, month) => {
    const { name, value } = e.target;

    // Menggunakan format key berdasarkan ID baris dan bulan untuk mengidentifikasi inputan pada setiap baris secara unik
    const inputKey = `${rowData?.id}-${month}`;

    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [inputKey]: value,
    }));
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : budget}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey=""
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["acc_code"]}
                emptyMessage="Tidak ada data"
                editMode={month?.month - 1 === comp?.cutoff ? "cell" : null}
              >
                <Column
                  header="Kode Akun"
                  field={(e) => e?.acc_code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Akun"
                  field={(e) => checkAcc(e?.acc_code)?.account?.acc_name}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Januari"
                  field={(e) => formatIdr(e?.nom_jan)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_jan")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />

                <Column
                  header="Februari"
                  field={(e) => formatIdr(e?.nom_feb)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_feb")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="Maret"
                  field={(e) => formatIdr(e?.nom_mar)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_mar")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="April"
                  field={(e) => formatIdr(e?.nom_apr)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_apr")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="Mei"
                  field={(e) => formatIdr(e?.nom_mei)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_mei")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="Juni"
                  field={(e) => formatIdr(e?.nom_jun)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_jun")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="Juli"
                  field={(e) => formatIdr(e?.nom_jul)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_jul")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="Agustus"
                  field={(e) => formatIdr(e?.nom_agu)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_agu")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="September"
                  field={(e) => formatIdr(e?.nom_sep)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_sep")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="Oktober"
                  field={(e) => formatIdr(e?.nom_okt)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_okt")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="November"
                  field={(e) => formatIdr(e?.nom_nov)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_nov")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                <Column
                  header="Desember"
                  field={(e) => formatIdr(e?.nom_des)}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
                  editor={(e) => textEditor(e, "nom_des")}
                  onCellEditComplete={(e) => {
                    console.log(e);
                    onSubmit();
                  }}
                />
                {/* {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="Maret"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_mar)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="Maret"
                    field={(e) => formatIdr(e?.nom_mar)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )} */}
                {/* /> */}
                {/* {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="April"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_apr)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="April"
                    field={(e) => formatIdr(e?.nom_apr)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )} */}
                {/* /> */}
                {/* {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="Mei"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_mei)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="Mei"
                    field={(e) => formatIdr(e?.nom_mei)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )} */}
                {/* /> */}
                {/* {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="Juni"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_jun)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="Juni"
                    field={(e) => formatIdr(e?.nom_jun)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )} */}
                {/* /> */}
                {/* {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="Juli"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_jul)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="Juli"
                    field={(e) => formatIdr(e?.nom_jul)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )}
                {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="Agustus"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_agu)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="Agustus"
                    field={(e) => formatIdr(e?.nom_agu)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )}
                {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="September"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_sep)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="September"
                    field={(e) => formatIdr(e?.nom_sep)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )}
                {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="Oktober"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_okt)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="Oktober"
                    field={(e) => formatIdr(e?.nom_okt)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )}
                {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="November"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_nov)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="November"
                    field={(e) => formatIdr(e?.nom_nov)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )}
                {month?.month === comp?.cutoff &&
                month?.year === comp?.year_co &&
                trans?.length === 0 ? (
                  <Column
                    header="Desember"
                    editor={(e) => textEditor(e)}
                    field={(e) => formatIdr(e?.nom_des)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                    onCellEditComplete={(e) => {
                      console.log(e);
                      if (!checkAcc(e.rowData?.acc_code)?.account?.connect) {
                        onSubmit();
                      }
                    }}
                  />
                ) : (
                  <Column
                    header="Desember"
                    field={(e) => formatIdr(e?.nom_des)}
                    style={{ minWidth: "6rem" }}
                    body={loading && <Skeleton />}
                  />
                )} */}
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Budgeting;
