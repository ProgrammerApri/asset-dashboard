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
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_EXP, SET_EDIT_EXP, SET_EXP } from "src/redux/actions";
import { Skeleton } from "primereact/skeleton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  id: null,
  exp_code: null,
  exp_date: null,
  exp_type: null,
  exp_acc: null,
  exp_dep: null,
  exp_prj: null,
  acq_sup: null,
  acq_pay: null,
  kas_acc: null,
  bank_acc: null,
  bank_id: null,
  bank_ref: null,
  giro_num: null,
  giro_date: null,
  acq: [],
  exp: [],
};

const KasBankOutList = ({ onAdd, onEdit }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [isEdit, setEdit] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const exp = useSelector((state) => state.exp.exp);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getEXP();
    initFilters1();
  }, []);

  const getEXP = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.expense,
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
        dispatch({ type: SET_EXP, payload: data });
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

  const delEXP = async (id) => {
    const config = {
      ...endpoints.delEXP,
      endpoint: endpoints.delEXP.endpoint + currentItem.id,
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
          getEXP(true);
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
        setDisplayDel(false);
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
        {/* <Link
          onClick={() => {
            onEdit(data);
            let acq = data.acq;
            dispatch({
              type: SET_EDIT_EXP,
              payload: true,
            });
            acq.forEach((el) => {
              el.fk_id = el.fk_id?.id;
            });
            let exp = data.exp;
            exp.forEach((el) => {
              el.acc_code = el.acc_code.id;
            });
            dispatch({
              type: SET_CURRENT_EXP,
              payload: {
                ...data,
                kas_acc: data?.kas_acc?.id ?? null,
                bank_id: data?.bank_id?.id ?? null,
                acq_sup: data?.acq_sup?.id ?? null,
                // top: data?.top?.id ?? null,
                acq:
                  acq.length > 0
                    ? acq
                    : [
                        {
                          id: null,
                          fk_id: null,
                          value: null,
                          payment: null,
                        },
                      ],
                exp:
                  exp.length > 0
                    ? exp
                    : [
                        {
                          id: null,
                          acc_code: null,
                          value: null,
                          desc: null,
                        },
                      ],
              },
            });
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link> */}

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
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
            delEXP();
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
            placeholder="Cari disini"
          />
        </span>
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_EXP,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_EXP,
              payload: {
                ...data,
                exp_type: 1,
                acq_pay: 1,
                acq: [
                  // {
                  //   id: null,
                  //   exp_id: null,
                  //   fk_id: null,
                  //   value: null,
                  //   payment: null,
                  // },
                ],
                exp: [
                  {
                    id: null,
                    acc_code: null,
                    value: null,
                    desc: null,
                  },
                ],
              },
            });
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        responsiveLayout="scroll"
        value={loading ? dummy : exp}
        className="display w-150 datatable-wrapper"
        showGridlines
        dataKey="id"
        rowHover
        header={renderHeader}
        filters={null}
        globalFilterFields={["exp.exp_code"]}
        emptyMessage="Tidak ada data"
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        paginatorClassName="justify-content-end mt-3"
      >
        <Column
          header="Tanggal"
          style={{
            minWidth: "8rem",
          }}
          field={(e) => formatDate(e.exp_date)}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nomor Referensi"
          field={(e) => e.exp_code}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Tipe"
          field={(e) => e?.exp_type ?? ""}
          style={{ minWidth: "8rem" }}
          body={(e) =>
            loading ? (
              <Skeleton />
            ) : (
              <div>
                {e.exp_type === 1 ? (
                  <Badge variant="info light">
                    <i className="bx bxs-circle text-info mr-1"></i> Pelunasan
                  </Badge>
                ) : (
                  <Badge variant="warning light">
                    <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                    Pengeluaran Kas/Bank
                  </Badge>
                )}
              </div>
            )
          }
        />
        <Column
          header="Jenis Pelunasan"
          className="align-text-center"
          field={(e) => e?.acq_pay ?? ""}
          style={{ minWidth: "8rem" }}
          body={(e) =>
            loading ? (
              <Skeleton />
            ) : (
              <div>
                {e.acq_pay === 1 ? (
                  <Badge variant="info light">
                    <i className="bx bxs-circle text-info mr-1"></i> Kas
                  </Badge>
                ) : e.acq_pay === 2 ? (
                  <Badge variant="warning light">
                    <i className="bx bxs-circle text-warning mr-1"></i> Bank
                  </Badge>
                ) : e.acq_pay === 3 ? (
                  <Badge variant="success light">
                    <i className="bx bxs-circle text-success mr-1"></i> Giro
                  </Badge>
                ) : (
                  <span className="center"> - </span>
                )}
              </div>
            )
          }
        />
        <Column
          header="Status"
          field={(e) => e?.approve ?? ""}
          style={{ minWidth: "8rem" }}
          body={(e) =>
            loading ? (
              <Skeleton />
            ) : (
              <div>
                {e.approve === true ? (
                  <Badge variant="info light">
                    <i className="bx bx-check text-info mr-1"></i> Disetujui
                  </Badge>
                ) : (
                  <Badge variant="danger light">
                    <i className="bx bx-x text-danger mr-1"></i>{" "}
                    Belum Disetujui
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

export default KasBankOutList;
