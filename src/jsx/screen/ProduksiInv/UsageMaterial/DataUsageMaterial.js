import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import endpoints from "../../../../utils/endpoints";
import { tr } from "../../../../data/tr";
import {
  SET_CURRENT_USAGE,
  SET_EDIT_USAGE,
  SET_USAGE,
} from "../../../../redux/actions";

const data = {
  id: null,
  code: null,
  date: null,
  dep_id: null,
  loc_id: null,
  material: [],
  biaya: [],
};

const DataUsageMaterial = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const usage = useSelector((state) => state.usage.usage);
  const show = useSelector((state) => state.usage.current);
  const printPage = useRef(null);
  const [trans, setTrans] = useState(null);
  const [sto, setSto] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getMaterial();
    getTrans();
    getSto();
    initFilters1();
  }, []);

  const getMaterial = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.usage_mat,
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
        data.forEach((element) => {
          if (!element.closing) {
            filt.push(element);
          }
        });
        dispatch({ type: SET_USAGE, payload: filt });
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

  const getSto = async (id, e) => {
    const config = {
      ...endpoints.sto,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSto(data);
      }
    } catch (error) {}
  };

  const getTrans = async () => {
    const config = {
      ...endpoints.trans,
      // base_url: connectUrl,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          if (element.tf_inv) {
            filt.push(element);
          }
        });
        setTrans(data);
      }
    } catch (error) {}
  };

  const delMat = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delUseMat,
      endpoint: endpoints.delUseMat.endpoint + currentItem.id,
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
          getMaterial(true);
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

  const actionBodyTemplate = (data) => {  
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onDetail();
            let material = data.material;
            let biaya = data.biaya;

            material?.forEach((elem) => {
              elem.prod_id = elem.prod_id ?? null;
              elem.unit_id = elem.unit_id ?? null;
            });

            biaya?.forEach((elem) => {
              elem.acc_id = elem.acc_id ?? null;
            });

            dispatch({
              type: SET_CURRENT_USAGE,
              payload: {
                ...data,
                dep_id: data?.dep_id?.id ?? null,
                loc_id: data?.loc_id ?? null,
                material: material?.length > 0 ? material : null,
                biaya: biaya?.length > 0 ? biaya : null,
              },
            });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            onEdit(data);
            dispatch({
              type: SET_EDIT_USAGE,
              payload: true,
            });
            let material = data.material;
            let st = 0;
            sto?.forEach((element) => {
              material?.forEach((elem) => {
                if (
                  element.loc_id === data?.loc_id.id &&
                  element.id === elem.prod_id.id
                ) {
                  st = element.stock;
                }
              });
            });
            material?.forEach((elem) => {
              elem.prod_id = elem.prod_id.id;
              elem.unit_id = elem.unit_id.id;
              elem.stock = st + elem.qty;
            });

            let biaya = data.biaya;
            let nom_d = 0;
            let dt_um = new Date(`${data?.date}Z`);
            trans?.forEach((element) => {
              let dt = new Date(`${element?.trx_date}Z`);
              biaya?.forEach((el) => {
                if (
                  element.acc_id === el.acc_id &&
                  dt.getMonth() + 1 === dt_um?.getMonth() + 1 &&
                  dt.getFullYear() === dt_um?.getFullYear()
                ) {
                  if (element.trx_dbcr === "D") {
                    nom_d += element.trx_amnt;
                  } else {
                    nom_d -= element.trx_amnt;
                  }
                }
              });
            });
            biaya?.forEach((el) => {
              el.acc_id = el?.acc_id;
              el.nom = nom_d + el.value;
            });
            dispatch({
              type: SET_CURRENT_USAGE,
              payload: {
                ...data,
                loc_id: data?.loc_id?.id ?? null,
                dep_id: data?.dep_id?.id ?? null,
                material: material?.length > 0 ? material : null,
                biaya: biaya?.length > 0 ? biaya : null,
              },
            });
          }}
          className={`btn btn-primary shadow btn-xs sharp ml-1`}
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
      // </React.Fragment>
    );
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
            delMat();
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
            placeholder={tr[localStorage.getItem("language")].cari}
          />
        </span>
        <PrimeSingleButton
          label={tr[localStorage.getItem("language")].tambh}
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_USAGE,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_USAGE,
              payload: {
                ...data,
                material: [
                  {
                    id: 0,
                    um_id: null,
                    prod_id: null,
                    unit_id: null,
                    qty: null,
                  },
                ],
                biaya: [
                  {
                    id: 0,
                    um_id: null,
                    acc_id: null,
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

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : usage}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "code",
                  "dep_id.ccost_name",
                  "loc_id.name",
                ]}
                emptyMessage={tr[localStorage.getItem("language")].empty_data}
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header={"Tanggal Pemakaian"}
                  field={(e) => formatDate(e.date)}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={"Kode Pemakaian"}
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].dep}
                  field={(e) => e.dep_id?.ccost_name ?? "-"}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={tr[localStorage.getItem("language")].hapus_data}
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

export default DataUsageMaterial;
