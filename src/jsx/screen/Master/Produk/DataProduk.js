import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Col, Row } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { InputNumber } from "primereact/inputnumber";
import { TabPanel, TabView } from "primereact/tabview";
import { Tooltip } from "primereact/tooltip";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Divider } from "@material-ui/core";
import { tr } from "src/data/tr";
import { ProgressBar } from "primereact/progressbar";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import formatIdr from "src/utils/formatIdr";
import { useDispatch, useSelector } from "react-redux";

const def = {
  id: null,
  code: null,
  name: null,
  group: null,
  type: null,
  codeb: null,
  unit: null,
  suplier: null,
  b_price: null,
  s_price: null,
  barcode: null,
  metode: null,
  max_stock: null,
  min_stock: null,
  re_stock: null,
  lt_stock: null,
  max_order: null,
  image: null,
  ns: null
};

const type = [
  { name: "Stock", id: 1 },
  { name: "Non Stock", id: 2 },
];

const metode = [
  { name: "First In First Out (FIFO)", id: 1 },
  { name: "Average", id: 2 },
];

const defError = [
  {
    code: false,
    name: false,
    group: false,
    type: false,
    sat: false,
    sup: false,
  },
  {
    hpp: false,
  },
];

const DataProduk = ({
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
  const product = useSelector((state) => state.product);
  const [group, setGroup] = useState(null);
  const [unit, setUnit] = useState(null);
  const [suplier, setSupplier] = useState(null);
  const [histori, setHistori] = useState(null);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [active, setActive] = useState(0);
  const picker = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(defError);
  const progressBar = useRef(null);
  const [progress, setProgress] = useState(0);
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!popUp) {
      progressBar.current.style.display = "none";
    }

    initFilters1();
    getGroup();
    getUnit();
    getSupplier();
    getHistori();
  }, []);

  const getGroup = async () => {
    const config = {
      ...endpoints.groupPro,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let grp = [];
        data.forEach((element) => {
          grp.push(element.groupPro);
        });
        setGroup(grp);
      }
    } catch (error) {}
  };

  const getUnit = async () => {
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
        setUnit(data);
      }
    } catch (error) {}
  };

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
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
        let sup = [];
        data.forEach((element) => {
          sup.push(element.supplier);
        });
        setSupplier(sup);
      }
    } catch (error) {}
  };

  const getHistori = async () => {
    const config = {
      ...endpoints.price_history,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let his = [];
        // data.forEach((elem) => {
        //   if (elem.product.id === t.id) {
        //     his.push(elem);
        //   }
        // });
        setHistori(data);
      }
    } catch (error) {}
  };

  const editProduk = async (image) => {
    const config = {
      ...endpoints.editProduct,
      endpoint: endpoints.editProduct.endpoint + currentItem.id,
      data: {
        ...currentItem,
        group: currentItem?.group?.id ?? null,
        suplier: currentItem?.suplier?.id ?? null,
        unit: currentItem?.unit?.id ?? null,
        image: image,
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

  const addProduk = async (image) => {
    const config = {
      ...endpoints.addProduct,
      data: {
        ...currentItem,
        group: currentItem?.group?.id ?? null,
        suplier: currentItem?.suplier?.id ?? null,
        unit: currentItem?.unit?.id ?? null,
        image: image,
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
          setFile(null);
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
            detail: `Kode ${currentItem.code} Sudah Digunakan`,
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

  const delProduk = async () => {
    setUpdate(true);
    const config = {
      ...endpoints.delProduct,
      endpoint: endpoints.delProduct.endpoint + currentItem.id,
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

  const uploadImage = async () => {
    if (file) {
      const config = {
        ...endpoints.uploadImage,
        data: {
          image: file,
        },
      };
      console.log(config.data);
      let response = null;
      try {
        response = await request(null, config, {
          "Content-Type": "multipart/form-data",
        });
        console.log(response);
        if (response.status) {
          if (isEdit) {
            editProduk(response.data);
          } else {
            addProduk(response.data);
          }
        }
      } catch (error) {
        if (isEdit) {
          editProduk("");
        } else {
          addProduk("");
        }
      }
    } else {
      if (isEdit) {
        editProduk("");
      } else {
        addProduk("");
      }
    }
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            setShowDetail(true);
            setDetail(data);
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>
        {/* {edit &&  */}
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
        {/* } */}

        {/* {del && ( */}
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
        {/* )} */}
      </div>
      // </React.Fragment>
    );
  };

  const onClick = () => {
    setDisplayData(true);
    // setCurrentItem();

    if (position) {
      setPosition(position);
    }
  };

  const onSubmit = () => {
    if (isValid()) {
      setUpdate(true);
      uploadImage();
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
                setFile(null);
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
          // onClick={() => {
          //   setUpdate(true);
          //   setActive(0);
          //   submitUpdate();
          // }}
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
            delProduk();
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
          {/* {edit && ( */}
          <Row className="mr-1">
            {popUp ? (
              <></>
            ) : (
              <PrimeSingleButton
                className="mr-3"
                label="Import"
                icon={<i className="pi pi-file-excel px-2"></i>}
                onClick={(e) => {
                  confirmImport(e);
                }}
              />
            )}
            <PrimeSingleButton
              label={tr[localStorage.getItem("language")].tambh}
              icon={<i class="bx bx-plus px-2"></i>}
              onClick={() => {
                setEdit(false);
                setCurrentItem(def);
                setDisplayData(true);
                onInput(true);
                // getSetupWip();
              }}
            />
          </Row>
          {/* )} */}
        </div>
        {popUp ? (
          <></>
        ) : (
          <div className="col-12" ref={progressBar}>
            <ProgressBar
              mode="indeterminate"
              style={{ height: "6px" }}
            ></ProgressBar>
          </div>
        )}
      </Row>
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

  const confirmImport = (event) => {
    // console.log(event);
    confirmPopup({
      target: event.currentTarget,
      message: "Anda yakin ingin mengimport ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        picker?.current?.click();
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

        let _importedData = data.map((d) => {
          return cols.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });

        _importedData = _importedData.filter((el) => el?.group_id);

        progressBar.current.style.display = "";
        let totalData = _importedData.length;
        let prod = [];
        let val = progress;

        _importedData.forEach((el) => {
          prod?.push({
            code: el.code,
            name: el.name,
            group: el.group_id,
            unit: el.unit_id,
            type: null,
            codeb: null,
            suplier: null,
            b_price: null,
            s_price: null,
            barcode: null,
            metode: 1,
            max_stock: null,
            min_stock: null,
            re_stock: null,
            lt_stock: null,
            max_order: null,
            ns: false,
            image: null,
          });
        });

        addProdImport(prod, () => {
          setTimeout(() => {
            toast.current.show({
              severity: "info",
              summary: "Berhasil",
              detail: "Data berhasil diperbarui",
              life: 3000,
            });
            onSuccessInput(true);
            picker.current.value = null;
            progressBar.current.style.display = "none";
          }, 1000);
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const addProdImport = async (data, onSuccess) => {
    const config = {
      ...endpoints.addProdImport,
      data: { prod: data },
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        onSuccess();
      }
    } catch ({ error }) {}
  };

  const getMetodeHPP = (value) => {
    let met = {};
    metode.forEach((element) => {
      if (value === element.id) {
        met = element;
      }
    });
    return met;
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = [
      {
        code: !currentItem.code || currentItem.code === "",
        name: !currentItem.name || currentItem.name === "",
        group: !currentItem.group?.id,
        type: !currentItem.type,
        sat: !currentItem.unit?.id,
        // sup: !currentItem.suplier?.id,
      },
      {
        hpp: !currentItem.metode,
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const renderFooterDetail = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            setShowDetail(false);
            onInput(false);
          }}
          // className="p-button-text btn-primary"
        />
      </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    let grouped = data?.history?.filter(
      (el, i) =>
        i ===
        data?.history?.findIndex((ek) => el?.supplier.id === ek?.supplier.id)
    );

    grouped?.forEach((el) => {
      el.hist = [];
      data?.history?.forEach((ek) => {
        if (el.supplier.id === ek.supplier.id) {
          el.hist.push(ek);
        }
      });
    });

    return (
      <div className="">
        <DataTable
          value={grouped}
          responsiveLayout="scroll"
          emptyMessage="Tidak ada histori"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowDetailExpansion}
        >
          <Column expander style={{ width: "1em" }} />
          <Column
            header="Supplier"
            style={{ width: "31rem" }}
            field={(e) => `${e.supplier.sup_code} - ${e.supplier.sup_name}`}
          />
          <Column
            header="Harga Beli"
            style={{ width: "10rem" }}
            field={(e) =>
              formatIdr(
                e.hist.filter(
                  (el) =>
                    new Date(`${el.order.ord_date}Z`).getTime() ===
                    new Date(
                      Math.max(
                        ...e.hist?.map((o) => new Date(`${o.order.ord_date}Z`))
                      )
                    ).getTime()
                )[0]?.price
              ) ?? "-"
            }
          />
        </DataTable>
      </div>
    );
  };

  const rowDetailExpansion = (data) => {
    console.log(data);
    return (
      <div className="">
        <DataTable
          value={data.hist}
          responsiveLayout="scroll"
          emptyMessage="Tidak ada histori"
        >
          <Column
            header="Kode Transaksi"
            style={{ width: "20rem" }}
            field={(e) => `${e.order.ord_code}`}
          />
          <Column
            header="Tanggal Transaksi"
            style={{ width: "20rem" }}
            field={(e) => formatDate(e.order.ord_date)}
          />
          <Column
            header="Harga Beli"
            style={{ width: "10rem" }}
            field={(e) => formatIdr(e.price)}
          />
        </DataTable>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <>
        <Toast ref={toast} />
        <DataTable
          responsiveLayout="scroll"
          value={product.list?.map((v) => ({
            ...v,
            history: histori?.filter((el) => v?.id === el.product?.id),
          }))}
          className="display w-150 datatable-wrapper"
          showGridlines
          dataKey="id"
          rowHover
          header={renderHeader}
          filters={filters1}
          globalFilterFields={[
            "code",
            "barcode",
            "name",
            "group.group",
            "type",
            "stock",
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
            header={tr[localStorage.getItem("language")].kd_prod}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e?.code ?? ""}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].barcode}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e?.barcode ?? "-"}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_prod}
            field={(e) => e.name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].g_prod}
            field={(e) => e?.group?.name ?? ""}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].stok}
            field={(e) => e?.max_stock ?? "-"}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          {/* {(edit || del) && ( */}
          <Column
            header="Action"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "2rem" }}
            body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
          />
          {/* )} */}
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
                  tr[localStorage.getItem("language")].prod
                }`
              : `${tr[localStorage.getItem("language")].tambh} ${
                  tr[localStorage.getItem("language")].prod
                }`
          }
          visible={displayData}
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => {
            setEdit(false);
            setDisplayData(false);
            setActive(0);
            setFile(null);
            onInput(false);
          }}
        >
          <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
            <TabPanel
              header="Informasi Produk"
              headerTemplate={renderTabHeader}
            >
              <div className="row mr-0 ml-0">
                <div className="col-4">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].kd_prod}
                    value={`${currentItem?.code ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, code: e.target.value });
                      let newError = error;
                      newError[0].code = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error[0]?.code}
                  />
                </div>

                <div className="col-4">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].nm_prod}
                    value={`${currentItem?.name ?? ""}`}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, name: e.target.value });
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
                <div className="col-4">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].g_prod}
                    value={currentItem !== null ? currentItem.group : null}
                    options={group}
                    onChange={(e) => {
                      console.log(e.target?.value?.stok);
                      setCurrentItem({
                        ...currentItem,
                        group: e.target.value ?? null,
                        ns: !e.target?.value?.stok,
                      });
                      let newError = error;
                      newError[0].group = false;
                      setError(newError);
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    errorMessage="Grup Produk Belum Dipilih"
                    error={error[0]?.group}
                  />
                </div>

                <div className="col-4">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].type_prod}
                    value={
                      currentItem !== null && currentItem.ns !== null
                        ? currentItem.ns === true
                          ? "Non Stock"
                          : "Stock"
                        : ""
                    }
                    // onChange={(e) => {
                    //   console.log(e.value);
                    //   setCurrentItem({
                    //     ...currentItem,
                    //     type: e.value.id,
                    //   });
                    //   let newError = error;
                    //   newError[0].type = false;
                    //   setError(newError);
                    // }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    // errorMessage="Tipe Produk Belum Dipilih"
                    // error={error[0]?.type}
                    disabled
                  />
                </div>

                <div className="col-4">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].satuan}
                    value={currentItem !== null ? currentItem.unit : null}
                    options={unit}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        unit: e.target.value,
                      });
                      let newError = error;
                      newError[0].sat = false;
                      setError(newError);
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    errorMessage="Satuan Produk Belum Dipilih"
                    error={error[0]?.sat}
                  />
                </div>
              </div>

              <div className="col-12 p-0">
                <div className="mt-4 ml-3 mr-3 fs-16 mb-1">
                  <b>{tr[localStorage.getItem("language")].supplier}</b>
                </div>
                <Divider className="mb-2 ml-3 mr-3"></Divider>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].supplier}
                    value={currentItem !== null ? currentItem.suplier : null}
                    options={suplier}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        suplier: e.target.value,
                      });
                      let newError = error;
                      newError[0].sup = false;
                      setError(newError);
                    }}
                    optionLabel="sup_name"
                    filter
                    filterBy="sup_name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    errorMessage="Pemasok Belum Dipilih"
                    error={error[0]?.sup}
                  />
                </div>

                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].kd_prev}
                  </label>
                  <div className="p-inputgroup">
                    <InputText
                      value={`${currentItem?.codeb ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          codeb: e.target.value,
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].hrg_bl}
                  </label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={`${currentItem?.b_price ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, b_price: e.value })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].hrg_jl}
                  </label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={`${currentItem?.s_price ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, s_price: e.value })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header="Informasi Produk Lainnya"
              headerTemplate={renderTabHeader}
            >
              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].barcode}
                  </label>
                  <div className="p-inputgroup">
                    <InputText
                      value={`${currentItem?.barcode ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          barcode: e.target.value,
                        })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <PrimeDropdown
                    label={`HPP ${tr[localStorage.getItem("language")].metode}`}
                    value={
                      currentItem !== null && currentItem.metode !== null
                        ? getMetodeHPP(currentItem.metode)
                        : null
                    }
                    options={metode}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        metode: e.value.id,
                      });
                      let newError = error;
                      newError[1].hpp = false;
                      setError(newError);
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    errorMessage="Metode HPP Belum Dipilih"
                    error={error[1]?.hpp}
                  />
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].max_sto}
                  </label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={`${currentItem?.max_stock ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, max_stock: e.value })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                      showButtons
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].min_sto}
                  </label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={`${currentItem?.min_stock ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, min_stock: e.value })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                      showButtons
                    />
                  </div>
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-6">
                  <label className="text-label">Reorder Stock</label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={`${currentItem?.re_stock ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, re_stock: e.value })
                      }
                      placeholder="Masukan Reorder Stock"
                      showButtons
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">Lead Timeout Stock</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={`${currentItem?.lt_stock ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          lt_stock: e.target.value,
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
                    {tr[localStorage.getItem("language")].max_ord}
                  </label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={`${currentItem?.max_order ?? ""}`}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, max_order: e.value })
                      }
                      placeholder="Masukan Maksimal Order"
                      showButtons
                    />
                  </div>
                </div>
              </div>

              <div className="row mr-0 ml-0">
                <div className="col-12">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].img}
                  </label>
                  <Tooltip target=".upload" mouseTrack mouseTrackLeft={10} />
                  <input
                    type="file"
                    id="file"
                    ref={picker}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      console.log(e);
                      setFile(e.target.files[0]);
                    }}
                  />
                  <div>
                    <Card
                      className="upload mb-3"
                      data-pr-tooltip="Klik untuk memilih foto"
                      style={{
                        cursor: "pointer",
                        height: "200px",
                        width: "200px",
                        background: "var(--input-bg)",
                      }}
                      onClick={() => {
                        picker.current.click();
                      }}
                    >
                      <Card.Body className="flex align-items-center justify-content-center">
                        {file ? (
                          <img
                            style={{ maxWidth: "150px" }}
                            src={URL.createObjectURL(file)}
                            alt=""
                          />
                        ) : currentItem &&
                          currentItem.image &&
                          currentItem.image !== "" ? (
                          <img
                            style={{ maxWidth: "150px" }}
                            src={currentItem.image}
                            alt=""
                          />
                        ) : (
                          <i
                            className="pi pi-image p-3"
                            style={{
                              fontSize: "3em",
                              borderRadius: "50%",
                              backgroundColor: "var(--surface-b)",
                              color: "var(--surface-d)",
                            }}
                          ></i>
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </Dialog>

        <Dialog
          header={`${tr[localStorage.getItem("language")].hapus} ${
            tr[localStorage.getItem("language")].prod
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

        <Dialog
          header={"History Supplier"}
          visible={showDetail}
          style={{ width: "45vw" }}
          footer={renderFooterDetail()}
          onHide={() => {
            setShowDetail(false);
            onInput(false);
          }}
        >
          {rowExpansionTemplate(detail)}
        </Dialog>
      </>
    );
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Produk"}
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
        <ConfirmPopup />
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
        {renderBody()}
        {renderDialog()}
      </>
    );
  }
};

export default DataProduk;
