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
import { SET_CURRENT_INC, SET_EDIT_INC, SET_INC } from "src/redux/actions";
import { Skeleton } from "primereact/skeleton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  id: null,
  inc_code: null,
  inc_date: null,
  type_trx: null,
  acq_cus: null,
  acq_pay: null,
  acq_kas: null,
  bank_ref: null,
  bank_acc: null,
  giro_num: null,
  giro_date: null,
  giro_bnk: null,
  inc_type: null,
  inc_kas: null,
  inc_bnk: null,
  inc_dep: null,
  inc_acc: null,
  inc_prj: null,
  acc_type: null,
  dp_type: 1,
  dp_cus: null,
  dp_kas: null,
  dp_bnk: null,
  acq: [],
  inc: [],
  det_dp: [],
};

const KasBankInList = ({ onAdd }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [dep, setDep] = useState(null);
  const [proj, setProj] = useState(null);
  const [ord, setOrd] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [displayData, setDisplayDat] = useState(false);
  const dispatch = useDispatch();
  const inc = useSelector((state) => state.inc.inc);
  const [expandedRows, setExpandedRows] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    initFilters1();
    getINC();
  }, []);

  const getINC = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.income,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        dispatch({ type: SET_INC, payload: data });
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
            placeholder="Cari disini"
          />
        </span>
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_INC,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_INC,
              payload: {
                ...data,
                inc_type: 1,
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
                inc: [
                  {
                    id: null,
                    acc_code: null,
                    dbcr: null,
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

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <>
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={loading ? dummy : inc}
            className="display w-150 datatable-wrapper"
            showGridlines
            dataKey="id"
            rowHover
            header={renderHeader}
            filters={filters1}
            globalFilterFields={["inc.inc_code"]}
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
              field={(e) => formatDate(e.inc_date)}
              body={loading && <Skeleton />}
            />
            <Column
              header="Nomor Referensi"
              field={(e) => e.inc_code}
              style={{ minWidth: "8rem" }}
              body={loading && <Skeleton />}
            />
            <Column
              header="Tipe"
              field={(e) => e?.inc_type ?? ""}
              style={{ minWidth: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <div>
                    {e.inc_type === 1 ? (
                      <Badge variant="info light">
                        <i className="bx bxs-circle text-info mr-1"></i>{" "}
                        Pelunasan
                      </Badge>
                    ) : (
                      <Badge variant="warning light">
                        <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                        Pemasukan Kas/Bank
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
                      <Badge variant="primary light">
                        <i className="bx bxs-circle text-primary mr-1"></i> Kas
                      </Badge>
                    ) : e.acq_pay === 2 ? (
                      <Badge variant="warning light">
                        <i className="bx bxs-circle text-warning mr-1"></i> Bank
                      </Badge>
                    ) : e.acq_pay === 3 ? (
                      <Badge variant="info light">
                        <i className="bx bxs-circle text-info mr-1"></i> Giro
                      </Badge>
                    ) : (
                      <span className="center"> - </span>
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
              // body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
            />
          </DataTable>
        </Col>
      </Row>
    </>
  );
};

export default KasBankInList;
