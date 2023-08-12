import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
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
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import {
  SET_CURRENT_WC,
  SET_EDIT_WC,
} from "src/redux/actions";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Tooltip } from "primereact/tooltip";
import { Timeline } from "primereact/timeline";
import { tr } from "date-fns/locale";
import DataLokasi from "../Lokasi/DataLokasi";
import DataMesin from "../Mesin/DataMesin";

const def = {
  id: null,
  work_code: null,
  work_name: null,
  loc_id: null,
  machine_id: null,
  work_type: null,
  work_sdm: null,
  work_estimasi: null,
  ovh_estimasi: null,
  biaya_estimasi: null,
  desc: null,
};

const dum_data = {

}

const DataWorkCenter = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [doubleClick, setDoubleClick] = useState(false);
  const dispatch = useDispatch();
  const work = useSelector((state) => state.wc.current);
  const isEdit = useSelector((state) => state.wc.editWc);
  const [showMachine, setShowMachine] = useState(false);
  const [showLocat, setShowLocat] = useState(false);
  const [showType, setShowType] = useState(false);
  const [machine, setMachine] = useState(null);
  const [location, setLocation] = useState(null);
  const [workType, setWorkType] = useState(null);
  const profile = useSelector((state) => state.profile.profile);
  const [expandedRows, setExpandedRows] = useState(null);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getLocation();
    getMachine();
    getWorkType();
    initFilters1();
  }, []);

  const getLocation = async () => {
    const config = {
      ...endpoints.lokasi,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setLocation(data);
      }
    } catch (error) {}
  };

  const getMachine = async () => {
    const config = {
      ...endpoints.mesin,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setMachine(data);
      }
    } catch (error) {}
  };

  const getWorkType = async () => {
    const config = {
      ...endpoints.work_type,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setWorkType(data);
      }
    } catch (error) {}
  };

  const editFM = async () => {
    const config = {
      ...endpoints.editWorkCenter,
      endpoint: endpoints.editWorkCenter.endpoint + work.id,
      data: work,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setShowInput(false);
          onSuccessInput(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbaharui",
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

  const addFM = async () => {
    const config = {
      ...endpoints.addWorkCenter,
      data: work,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setShowInput(false);
          onSuccessInput(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbaharui",
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
            detail: `Kode ${work.work_code} Sudah Digunakan`,
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

  const delFM = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delWorkCenter,
      endpoint: endpoints.delWorkCenter.endpoint + currentItem.id,
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
          onSuccessInput(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Dihapus",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setShowDelete(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Data`,
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
            setShowDelete(
              dispatch({
                type: SET_EDIT_WC,
                payload: true,
              }),

              dispatch({
                type: SET_CURRENT_WC,
                payload: {
                  ...data,
                  loc_id: data?.loc_id?.id ?? null,
                  machine_id: data?.machine_id?.id ?? null,
                  work_type: data?.work_type?.id ?? null,
                },
              })
            );
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
            delFM();
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

  const onSubmit = () => {
    // if (isValid()) {
    if (isEdit) {
      setUpdate(true);
      editFM();
    } else {
      setUpdate(true);
      addFM();
    }
    // }
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
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            setUpdate(false)
            setShowInput(
              dispatch({
                type: SET_EDIT_WC,
                payload: false,
              }),
              dispatch({
                type: SET_CURRENT_WC,
                payload: def,
              })
            );
          }}
        />
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left"></div>
        </div>

        <div className="row justify-content-right col-6">
          <div className="col-12 mt-0 fs-12 text-right">
            <PButton
              label="Batal"
              onClick={() => {
                setShowInput(false);
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
        </div>
      </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="row">
        <div className="col-12 pb-0"></div>
      </div>
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const onHideInput = () => {
    setLoading(false);
    setShowInput(false);
  };

  const checkLoc = (value) => {
    let selected = {};
    location?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkMch = (value) => {
    let selected = {};
    machine?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkType = (value) => {
    let selected = {};
    workType?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const updateWc = (e) => {
    dispatch({
      type: SET_CURRENT_WC,
      payload: e,
    });
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
          globalFilterFields={["work_code", "work_name"]}
          emptyMessage="Tidak ada data"
          paginator
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          onPage={onCustomPage2}
          paginatorClassName="justify-content-end mt-3"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          selectionMode="single"
          onRowSelect={onRowSelect}
        >
          <Column expander style={{ width: "3em" }} />

          <Column
            header="Kode Work Center"
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.work_code ?? "-"}
            body={load && <Skeleton />}
          />
          <Column
            header="Nama Work Center"
            field={(e) => e.work_name ?? "-"}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Lokasi"
            field={(e) => (e?.machine_id ? e.machine_id?.code : "-")}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Mesin"
            field={(e) => (e?.machine_id ? e.machine_id?.code : "-")}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Jenis Pekerjaan"
            field={(e) => (e?.work_type ? checkType(e.work_type)?.jenis_name : "-")}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          {/* <Column
          header="Jumlah SDM (Orang)"
          field={(e) => (e?.work_sdm ? e.work_sdm : "-")}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Jumlah SDM (Orang)"
          field={(e) => (e?.work_sdm ? e.work_sdm : "-")}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        /> */}

          <Column
            header="Action"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "2rem" }}
            body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
          />
        </DataTable>

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

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={isEdit ? "Edit Data" : "Tambah Data"}
          visible={showInput}
          style={{ width: "50vw" }}
          footer={renderFooter("displayData")}
          onHide={() => {
            onHideInput();
            onInput(false);
          }}
        >
          <Row className="mb-0">
            <div className="col-6 text-black">
              <PrimeInput
                label={"Kode Work Center"}
                value={work.work_code}
                onChange={(e) => {
                  updateWc({ ...work, work_code: e.target.value });
                }}
                placeholder="Masukan Kode Work Center"
              />
            </div>
            <div className="col-6 text-black">
              <PrimeInput
                label={"Nama Work Center"}
                value={work.work_name}
                onChange={(e) => {
                  updateWc({ ...work, work_name: e.target.value });
                  // let newError = error;
                  // newError.name = false;
                  // setError(newError);
                }}
                placeholder="Masukan Nama Work Center"
                // error={error?.name}
              />
            </div>

            <div className="col-12 text-black">
              <label className="text-label">Keterangan</label>
              <div className="p-inputgroup">
                <InputText
                  value={work.desc}
                  onChange={(e) => updateWc({ ...work, desc: e.target.value })}
                  placeholder="Masukan Keterangan"
                />
              </div>
            </div>


            <div className="col-4 text-black">
              <label className="text-label">Lokasi</label>
              <CustomDropdown
                value={work.loc_id && checkLoc(work.loc_id)}
                onChange={(u) => {
                  updateWc({ ...work, loc_id: u?.id ?? null });
                }}
                option={location}
                detail
                onDetail={() => {
                  setShowLocat(true);
                }}
                label={"[name] ([code])"}
                placeholder="Pilih Lokasi"
              />
            </div>
            <div className="col-4 text-black">
              <label className="text-label">Mesin</label>
              <CustomDropdown
                value={work.machine_id && checkMch(work.machine_id)}
                onChange={(u) => {
                  updateWc({ ...work, machine_id: u?.id ?? null });
                }}
                option={machine}
                detail
                onDetail={() => {
                  setShowMachine(true);
                }}
                label={"[msn_name] ([msn_code])"}
                placeholder="Pilih Mesin"
              />
            </div>
            <div className="col-4 text-black">
              <label className="text-label">Jenis Pekerjaan</label>
              <CustomDropdown
                value={work.work_type && checkType(work.work_type)}
                onChange={(u) => {
                  updateWc({ ...work, work_type: u?.id ?? null });
                }}
                option={workType}
                detail
                onDetail={() => {
                  setShowType(true);
                }}
                label={"[name] ([code])"}
                placeholder="Pilih Jenis Pekerjaan"
              />
            </div>

            <div className="col-12 mt-3">
              <label className="text-label fs-14"><b>Waktu dan Biaya Pengerjaan</b></label>
              <Divider></Divider>
            </div>

            <div className="col-3 text-black">
              <label className="text-label">Jumlah SDM</label>
              <PrimeNumber
                value={work.work_sdm ? work.work_sdm : null}
                onChange={(u) => {
                  updateWc({ ...work, work_sdm: u?.value ?? null });
                }}
                placeholder="0"
              />
            </div>
            <div className="col-3 text-black">
              <label className="text-label">Estimasi Pengerjaan (Jam)</label>
              <PrimeNumber
                price
                value={work.work_estimasi ? work.work_estimasi : null}
                onChange={(u) => {
                  updateWc({ ...work, work_estimasi: u?.value ?? null });
                }}
                placeholder="0"
              />
            </div>
            <div className="col-3 text-black">
              <label className="text-label">Estimasi OVH</label>
              <PrimeNumber
                price
                value={work.ovh_estimasi ? work.ovh_estimasi : null}
                onChange={(u) => {
                  updateWc({ ...work, ovh_estimasi: u?.value ?? null });
                }}
                placeholder="0"
              />
            </div>
            <div className="col-3 text-black">
              <label className="text-label">Estimasi Biaya Kerja</label>
              <PrimeNumber
                price
                value={work.biaya_estimasi ? work.biaya_estimasi : null}
                onChange={(u) => {
                  updateWc({ ...work, biaya_estimasi: u?.value ?? null });
                }}
                placeholder="0"
              />
            </div>
          </Row>
        </Dialog>

        <Dialog
          header={"Hapus Data"}
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
            <span>{"Apakah Anda Yakin Ingin Menghapus Data?"}</span>
          </div>
        </Dialog>

        <DataLokasi
        data={location}
        loading={false}
        popUp={true}
        show={showLocat}
        onHide={() => {
          setShowLocat(false);
        }}
        onInput={(e) => {
          setShowLocat(!e);
        }}
        onSuccessInput={(e) => {
          getLocation();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLocat(false);
            updateWc({ ...work, loc_id: e?.data?.id ?? null });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataMesin
        data={machine}
        loading={false}
        popUp={true}
        show={showMachine}
        onHide={() => {
          setShowMachine(false);
        }}
        onInput={(e) => {
          setShowMachine(!e);
        }}
        onSuccessInput={(e) => {
          getMachine();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowMachine(false);
            updateWc({ ...work, machine_id: e.data?.id ?? null });
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
          header={"Data Work Center"}
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

export default DataWorkCenter;
