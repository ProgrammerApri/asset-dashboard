import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ProgressBar } from "primereact/progressbar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const data = {
  kategory: {
    id: 1,
    name: "",
    kode_klasi: 0,
    kode_saldo: "D",
  },
  klasifikasi: {
    id: 0,
    klasiname: "",
  },
};

const defError = {
  name: false,
  klasi: false,
  // sld: false,
};

const kodesaldo = [
  { name: "Debit", code: "D" },
  { name: "Kredit", code: "K" },
];

const KategoriAkun = ({ onSuccessImport }) => {
  const [klasifikasi, setKlasifikasi] = useState(null);
  const [kategori, setKategori] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [error, setError] = useState(defError);
  const [progress, setProgress] = useState(0);
  const picker = useRef(null);
  const progressBar = useRef(null);
  const interval = useRef(null);

  const dummy = Array.from({ length: 10 });

  const dialogFuncMap = {
    displayData: setDisplayData,
  };

  useEffect(() => {
    getKlasifikasi();
    progressBar.current.style.display = "none";
    initFilters1();
  }, []);

  const getKlasifikasi = async () => {
    console.log("-------------------");
    // console.log(currentItem);
    setLoading(true);
    const config = {
      ...endpoints.klasifikasi,
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
        setKlasifikasi(data);
      }
    } catch (error) {}
    getKategori();
  };

  const getKategori = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.kategori,
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
        setKategori(data);
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

  const editKategori = async () => {
    const config = {
      ...endpoints.editKateg,
      endpoint: endpoints.editKateg.endpoint + currentItem.kategory.id,
      data: {
        name: currentItem.kategory.name,
        kode_klasi: currentItem.klasifikasi.id,
        kode_saldo: currentItem.kategory.kode_saldo,
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
          dialogFuncMap["displayData"](false);
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
          life: 3000,
        });
      }, 500);
    }
  };

  const addKategori = async () => {
    const config = {
      ...endpoints.addKateg,
      data: {
        name: currentItem.kategory.name,
        kode_klasi: currentItem.klasifikasi.id,
        kode_saldo: currentItem.kategory.kode_saldo,
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
          dialogFuncMap["displayData"](false);
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
            onClick("displayData", data);
          }}
          className="btn btn-primary shadow btn-xs sharp ml-2"
        >
          <i className="fa fa-pencil"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onClick = (kode, kategori) => {
    dialogFuncMap[`${kode}`](true);
    setCurrentItem(kategori);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (kode) => {
    dialogFuncMap[`${kode}`](false);
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      name: !currentItem.name || currentItem.name === "",
      klasi: !currentItem.klasifikasi,
      // sld: !currentItem?.kategory.kode_saldo,
    };

    setError(errors);

    valid = !errors.name && !errors.klasi;

    return valid;
  };

  const onSubmit = () => {
    if (isValid) {
      if (isEdit) {
        setUpdate(true);
        editKategori();
      } else {
        setUpdate(true);
        addKategori();
      }
    }
  };

  const renderFooter = (kode) => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => onHide(kode)}
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
              placeholder="Cari disini"
            />
          </span>
          <Row className="mr-1">
            {/* <PrimeSingleButton
            className="mr-3"
            label="Export"
            icon={<i className="pi pi-file-excel px-2"></i>}
            onClick={() => {
              exportExcel();
            }}
          /> */}
            <PrimeSingleButton
              className="mr-3"
              label="Import"
              icon={<i className="pi pi-file-excel px-2"></i>}
              onClick={(e) => {
                confirmImport(e);
              }}
            />
            <PrimeSingleButton
              label="Tambah"
              icon={<i class="bx bx-plus px-2"></i>}
              onClick={() => {
                setEdit(false);
                setCurrentItem(data);

                onClick("displayData", data);
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

        let _importedData = data.map((d) => {
          return cols.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });

        _importedData = _importedData.filter((el) => el?.Kode_Klasifikasi);

        progressBar.current.style.display = "";
        let totalData = _importedData.length;
        let kateg = [];
        let val = progress;

        _importedData.forEach((el) => {
          kateg?.push({
            id: el.Kode,
            name: el.Nama,
            kode_klasi: el.Kode_Klasifikasi,
            kode_saldo: el.Saldo,
          });
        });

        addKategoriImport(kateg, () => {
          setTimeout(() => {
            toast.current.show({
              severity: "info",
              summary: "Berhasil",
              detail: "Data berhasil diperbarui",
              life: 3000,
            });
            getKategori(true);
            picker.current.value = null;
            progressBar.current.style.display = "none";
          }, 1000);
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const addKategoriImport = async (data, onSuccess) => {
    const config = {
      ...endpoints.addKategImport,
      data: { kateg: data },
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        onSuccess();
      }
    } catch ({ error }) {}
  };

  const exportExcel = () => {
    let data = [];
    kategori.forEach((el, i) => {
      data.push({
        Kode: i + 1,
        Nama: el.kategory.name,
        Klasifikasi: el.klasifikasi.klasiname,
        Saldo: el.kategory.kode_saldo,
      });
    });

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "account_kategory");
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

  return (
    <>
      <ConfirmPopup />
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
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
                responsive="scroll"
                value={loading ? dummy : kategori}
                className="display w-100 datatable-wrapper"
                showGridlines
                dataKey="kategory.id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "kategory.name",
                  "klasifikasi.klasiname",
                  "kategory.kode_saldo",
                ]}
                emptyMessage="Tidak ada data kategori"
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  field={(e) => e.kategory.id}
                  header="Kode"
                  style={{
                    width: "10rem",
                  }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Kategori Akun"
                  field={(e) => e.kategory.name}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Klasifikasi Akun"
                  field={(e) => e.klasifikasi.klasiname}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Saldo Normal"
                  field={(e) => e.kategory.kode_saldo}
                  style={{ minWidth: "10rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.kategory.kode_saldo === "D" ? (
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
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Dialog
        header={isEdit ? "Edit Kategori Akun" : "Tambah Kategori Akun"}
        visible={displayData}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          onHide("displayData");
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-6 mb-2">
            <PrimeInput
              label={"Nama Kategori"}
              value={currentItem !== null ? `${currentItem.kategory.name}` : ""}
              onChange={(e) => {
                setCurrentItem({
                  ...currentItem,
                  kategory: { ...currentItem.kategory, name: e.target.value },
                });

                let newError = error;
                newError.name = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Kategori"
              error={error?.name}
            />
          </div>
          <div className="col-6 mb-2">
            <PrimeDropdown
              label={"Klasifikasi"}
              value={currentItem !== null ? currentItem.klasifikasi : null}
              options={klasifikasi}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  klasifikasi: e.value,
                });

                let newError = error;
                newError.klasi = false;
                setError(newError);
              }}
              optionLabel="klasiname"
              filter
              filterBy="klasiname"
              placeholder="Pilih Klasifikasi"
              errorMessage="Klasifikasi Belum Dipilih"
              error={error?.klasi}
            />
          </div>
        </div>

        <div className="row mr-0 ml-0">
          <div className="col-12 mb-2">
            <label className="text-label">Kode Saldo Normal</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  currentItem !== null && currentItem.kategory.kode_saldo !== ""
                    ? currentItem.kategory.kode_saldo === "D"
                      ? { name: "Debit", code: "D" }
                      : { name: "Kredit", code: "K" }
                    : null
                }
                options={kodesaldo}
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({
                    ...currentItem,
                    kategory: {
                      ...currentItem.kategory,
                      kode_saldo: e.value.code,
                    },
                  });
                }}
                optionLabel="name"
                placeholder="Pilih Kode Saldo"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default KategoriAkun;
