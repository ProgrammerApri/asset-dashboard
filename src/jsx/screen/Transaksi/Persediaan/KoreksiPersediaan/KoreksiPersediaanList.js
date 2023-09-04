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
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_IC, SET_EDIT_IC, SET_IC } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
// import data from "src/jsx/data";

const data = {
  id: null,
  code: null,
  date: null,
  dep_id: null,
  proj_id: null,
  kprod: null,
};

const KoreksiPersediaanList = ({ onAdd, onEdit }) => {
  const dispatch = useDispatch();
  const ic = useSelector((state) => state.ic.ic);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [displayDel, setDisplayDel] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const toast = useRef(null);
  const [expandedRows, setExpandedRows] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getKorSto();
  }, []);


  const getKorCode = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.getKorper,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const kode = response.data;
        onAdd();
        dispatch({
          type: SET_CURRENT_IC,
          payload: {
            ...data,
            code:kode,
            kprod: [
              {
                id: 0,
                prod_id: null,
                unit_id: null,
                dbcr: null,
                location: null,
                qty: null,
              },
            ],
          },
        });
      }
    } catch (error) {}
  };


  const getKorSto = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getKorSto,
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
        dispatch({ type: SET_IC, payload: data });
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            // value={globalFilterValue1}
            // onChange={onGlobalFilterChange1}
            placeholder={tr[localStorage.getItem("language")].cari}
          />
        </span>
        <PrimeSingleButton
          label={tr[localStorage.getItem("language")].tambh}
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            getKorCode()
            dispatch({
              type: SET_EDIT_IC,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_IC,
              payload: {
                ...data,
                kprod: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    dbcr: null,
                    location: null,
                    qty: null,
                  },
                ],
              },
            });
          }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onEdit(data);
            let kprod = data.kprod;
            dispatch({
              type: SET_EDIT_IC,
              payload: true,
            });
            kprod.forEach((el) => {
              el.prod_id = el.prod_id?.id;
              el.unit_id = el.unit_id?.id ?? null;
              el.location = el.location?.id ?? null;
            });
            dispatch({
              type: SET_CURRENT_IC,
              payload: {
                ...data,
                dep_id: data?.dep_id?.id ?? null,
                proj_id: data?.proj_id?.id ?? null,
                kprod:
                  kprod.length > 0
                    ? kprod
                    : [
                        {
                          id: 0,
                          kor_id: null,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          dbcr: null,
                          qty: null,
                        },
                      ],
              },
            });
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
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

  const delKor = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delKorSto,
      endpoint: endpoints.delKorHut.endpoint + currentItem.id,
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
          getKorSto(true);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].del_berhasil,
            life: 3000,
          });
        }, 100);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setDisplayDel(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].del_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            setLoading(true);
            delKor();
          }}
          autoFocus
          loading={loading}
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <DataTable value={data.kprod} responsiveLayout="scroll">
          <Column
            header={tr[localStorage.getItem("language")].prod}
            style={{ width: "26rem" }}
            field={(e) => `${e.prod_id.name} (${e.prod_id.code})`}
          />
          <Column
            header={tr[localStorage.getItem("language")].gudang}
            style={{ width: "15rem" }}
            field={(e) => e.location.name}
          />
          <Column
            header={tr[localStorage.getItem("language")].qty}
            style={{ width: "15rem" }}
            field={(e) => e.qty}
          />
          <Column
            header={tr[localStorage.getItem("language")].sat}
            style={{ width: "24rem" }}
            field={(e) => e.unit_id.code}
            // style={{ minWidth: "8rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            header="Debit/Kredit"
            style={{ width: "24rem" }}
            field={(e) => (e.dbcr === "D" ? "Debit" : "Kredit")}
            // style={{ minWidth: "8rem" }}
            // body={loading && <Skeleton />}
          />
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={loading ? dummy : ic}
            className="display w-150 datatable-wrapper"
            showGridlines
            dataKey="id"
            rowHover
            header={renderHeader}
            filters={null}
            globalFilterFields={["ref"]}
            emptyMessage={tr[localStorage.getItem("language")].empty_data}
            paginator
            paginatorTemplate={template2}
            first={first2}
            rows={rows2}
            onPage={onCustomPage2}
            paginatorClassName="justify-content-end mt-3"
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
          >
            <Column expander style={{ width: "3em" }} />
            <Column
              header={tr[localStorage.getItem("language")].tgl}
              style={{
                minWidth: "8rem",
              }}
              field={(e) => formatDate(e.date)}
              body={loading && <Skeleton />}
            />
            <Column
              header={tr[localStorage.getItem("language")].kd_kor}
              field={(e) => e.code}
              style={{ minWidth: "8rem" }}
              body={loading && <Skeleton />}
            />
            {/* <Column
              header="Kode Akun"
              field="acc"
              style={{ minWidth: "8rem" }}
              // body={loading && <Skeleton />}
            /> */}
            <Column
              header={tr[localStorage.getItem("language")].dep}
              field={(e) => e.dep_id.ccost_name ?? "-"}
              style={{ minWidth: "8rem" }}
              body={loading && <Skeleton />}
            />
            <Column
              header={tr[localStorage.getItem("language")].proj}
              field={(e) => e.proj_id.proj_name ?? "-"}
              style={{ minWidth: "8rem" }}
              body={loading && <Skeleton />}
            />
            <Column
              header="Action"
              dataType="boolean"
              bodyClassName="text-center"
              style={{ minWidth: "2rem" }}
              body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
            />
          </DataTable>
        </Col>
      </Row>

      <Dialog
        header={`${tr[localStorage.getItem("language")].hapus} ${
          tr[localStorage.getItem("language")].kor_sto
        }`}
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
          <span>{tr[localStorage.getItem("language")].pesan_hapus}</span>
        </div>
      </Dialog>
    </>
  );
};

export default KoreksiPersediaanList;
