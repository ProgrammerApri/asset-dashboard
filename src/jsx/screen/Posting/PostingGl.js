import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
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
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { ProgressBar } from "primereact/progressbar";
import { Link } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

const data = {
  post_year: null,
  post_month: null,
};

const Posting = () => {
  const [posting, setPosting] = useState(null);
  const [year, setYear] = useState();
  const [load, setLoad] = useState(0);
  const [displayData, setDisplayData] = useState(false);
  const [displayLoad, setDisplayLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const dummy = Array.from({ length: 50 });
  const interval = useRef(null);

  useEffect(() => {
    getPost();
    initFilters1();
  }, []);

  const getPost = async (isUpdate = false) => {
    const config = {
      ...endpoints.posting,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filtered = data?.filter(
          (el, i) =>
            i ===
            data.findIndex(
              (ek) =>
                el?.acc_month === ek?.acc_month &&
                el.acc_year === ek.acc_year &&
                !el.sa && !el.from_closing && !el.transfer
            )
        );
        setPosting(filtered);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    getYear();
  };

  const getYear = async (isUpdate = false) => {
    // setLoading(true);
    const config = {
      ...endpoints.posting_ym,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setYear(data);
      }
    } catch (error) {}
  };

  const AddPosting = async (onSuccess) => {
    // setLoading(true);
    const config = {
      ...endpoints.addPost,
      data: {
        post_year: year?.year,
        post_month: year?.month,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      setDisplayLoad(false);
      setLoad(0);
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal memperbarui data",
          // sticky: true,
          life: 3000,
        });
      }, 500);
    }
  };

  const unpost = async (month, year) => {
    setLoading(true);
    const config = {
      ...endpoints.unpost,
      endpoint: endpoints.unpost.endpoint + `${month}/${year}`,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setLoading(false);
        getPost(true);
      }
    } catch (error) {}
  };

  const closing = async (month, year) => {
    setLoading(true);
    const config = {
      ...endpoints.closing,
      endpoint: endpoints.closing.endpoint + `${month}/${year}`,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setLoading(false);
        getPost(true);
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Berhasil melakukan Closing GL",
          life: 3000,
        });
      }
    } catch (error) {}
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
            placeholder="Cari disini"
          />
        </span>
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            getYear();
            setEdit(false);
            setLoading(false);
            setDisplayData(true);
          }}
        />
      </div>
    );
  };

  const runProgress = () => {
    let val = load;
    let limit = 90;
    AddPosting(() => {
      limit = 100;
    });
    interval.current = setInterval(() => {
      if (val <= limit) {
        val += Math.floor(Math.random() * 2) + 1;
      }

      if (val >= 100) {
        val = 100;
        setTimeout(() => {
          getPost(true);
          setDisplayLoad(false);
          setLoad(0);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Proses Posting Berhasil",
            life: 3000,
          });
        }, 500);
        clearInterval(interval.current);
      }

      setLoad(val);
    }, 75);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  };

  const renderFooter = (kode) => {
    return (
      <div>
        <Button
          label="Batal"
          onClick={() => setDisplayData(false)}
          className="p-button-text btn-primary"
        />
        <Button
          label="Posting"
          icon="pi pi-check"
          onClick={() => {
            setDisplayLoad(true);
            setDisplayData(false);
            runProgress();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };

  const actionBodyTemplate = (data, disabled) => {
    return (
      <div className="d-flex">
        <Tooltip target=".closing-gl" />
        <Tooltip target=".unpost" />
        <Link
          onClick={(e) => {
            confirmClosing(e, data);
          }}
          className={`btn${disabled ? " disabled" : ""} btn-primary shadow btn-xs sharp ml-2 closing-gl`}
          data-pr-tooltip="Closing GL"
          disabled={disabled}
        >
          <i className="fa fa-check-square"></i>
        </Link>

        <Link
          onClick={(e) => {
            confirmUnpost(e, data);
          }}
          className={`btn${disabled ? " disabled" : ""} btn-danger shadow btn-xs sharp ml-2 unpost`}
          data-pr-tooltip="Unposting"
          disabled={disabled}
        >
          <i className="fa fa-history"></i>
        </Link>
      </div>
    );
  };

  const confirmUnpost = (event, data) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Anda yakin ingin unpost ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log(data);
        unpost(data.acc_month, data.acc_year);
      },
    });
  };

  const confirmClosing = (event, data) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Anda yakin ingin melakukan PAB ?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        closing(data.acc_month, data.acc_year);
      },
    });
  };

  return (
    <>
      <ConfirmPopup />
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : posting}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey=""
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["account.acc_name", "kategory.name"]}
                emptyMessage="Tidak ada data"
              >
                <Column
                  header="Tahun"
                  style={{
                    width: "15rem",
                  }}
                  field={(e) => e.acc_year}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Bulan"
                  field={(e) => e.acc_month}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Action"
                  bodyClassName="text-center"
                  style={{ width: "10rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      actionBodyTemplate(
                        e,
                        year?.month !== e?.acc_month || year?.year !== e?.acc_year
                      )
                    )
                  }
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header="Posting GL"
        visible={displayData}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-6 mb-0">
            <label className="text-label">Tahun</label>
            <div className="p-inputgroup">
              <InputText value={year?.year} placeholder="Tahun" disabled />
            </div>
          </div>

          <div className="col-6 mb-0">
            <label className="text-label">Bulan</label>
            <div className="p-inputgroup">
              <InputText value={year?.month} placeholder="Bulan" disabled />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={displayLoad}
        style={{ width: "25vw" }}
        footer
        closable={false}
      >
        <div>
          <ProgressBar value={load}></ProgressBar>
        </div>
      </Dialog>
    </>
  );
};

export default Posting;
