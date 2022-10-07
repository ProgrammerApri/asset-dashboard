import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PO, SET_EDIT_PO } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";

const data = {
  id: null,
  po_code: null,
  po_date: null,
  preq_id: null,
  sup_id: null,
  ppn_type: null,
  top: null,
  due_date: false,
  split_PO: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  rprod: [],
  rjasa: [],
  psup: [],
};

const PesananPO = ({ onAdd, onEdit, onDetail }) => {
  const [po, setPO] = useState(null);
  const [comp, setComp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [confirm, setDisplayConfirm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const PO = useSelector((state) => state.po.po);
  const closePo = useSelector((state) => state.po.current);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPO();
    getComp();
    initFilters1();
  }, []);

  const getPO = async (isUpdate = false) => {
    setLoading(true);
    const config = endpoints.po;
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setPO(data);
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

  const getComp = async (isUpdate = false) => {
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
        console.log(data);
        setComp(data);
      }
    } catch (error) {}
  };

  const delPO = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delPO,
      endpoint: endpoints.delPO.endpoint + currentItem.id,
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
          getPO(true);
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
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].del_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const closePO = async () => {
    const config = {
      ...endpoints.closePO,
      endpoint: endpoints.closePO.endpoint + closePo.id,
      data: closePo,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayConfirm(false);
          getPO(true);
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

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onDetail();
            let pprod = data.pprod;
            let pjasa = data.pjasa;

            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                ord_id: data?.ord_id?.id ?? null,
                product:
                  pprod.length > 0
                    ? pprod
                    : [
                        {
                          id: 0,
                          rprod_id: null,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          order: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total: null,
                        },
                      ],
                pjasa:
                  pjasa.length > 0
                    ? pjasa
                    : [
                        {
                          id: 0,
                          rjasa_id: null,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          order: null,
                          price: null,
                          disc: null,
                          total: null,
                        },
                      ],
              },
            });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            onEdit();
            dispatch({
              type: SET_EDIT_PO,
              payload: true,
            });

            let pprod = data.pprod;
            pprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let pjasa = data.pjasa;
            pjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            // let psup = data.psup;
            // psup.forEach((el) => {
            //   el.sup_id = el.sup_id.id;
            //   el.prod_id = el.prod_id.id;
            // });

            if (!pprod.length) {
              pprod.push({
                id: 0,
                prod_id: null,
                rprod_id: null,
                unit_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            if (!pjasa.length) {
              pjasa.push({
                id: 0,
                jasa_id: null,
                rjasa_id: null,
                unit_id: null,
                sup_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            // if (!psup.length) {
            //   psup.push({
            //     id: 0,
            //     sup_id: null,
            //     prod_id: null,
            //     price: null,
            //     image: null,
            //   });
            // }

            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                preq_id: data?.preq_id?.id,
                sup_id: data?.sup_id?.id,
                top: data?.top?.id,
                pprod: pprod,
                pjasa: pjasa,
                // psup: psup,
              },
            });
          }}
          className={`btn ${
            data.status === 0 ? "" : "disabled"
          } btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setDisplayConfirm(true);
            dispatch({
              type: SET_EDIT_PO,
              payload: true,
            });

            let pprod = data.pprod;
            pprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let pjasa = data.pjasa;
            pjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });

            if (!pprod.length) {
              pprod.push({
                id: 0,
                prod_id: null,
                rprod_id: null,
                unit_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            if (!pjasa.length) {
              pjasa.push({
                id: 0,
                jasa_id: null,
                rjasa_id: null,
                unit_id: null,
                sup_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                preq_id: data?.preq_id?.id,
                sup_id: data?.sup_id?.id,
                top: data?.top?.id,
                pprod: pprod,
                pjasa: pjasa,
              },
            });
          }}
          className={`btn ${
            data.status !== 2 ? "" : "disabled"
          } btn-warning shadow btn-xs sharp ml-1`}
        >
          <i className="bx bx-task-x mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className={`btn ${
            data.status !== 2 ? "" : "disabled"
          } btn-danger shadow btn-xs sharp ml-1`}
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
            delPO();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const footerClose = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayConfirm(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Ya"
          icon="pi pi-check"
          onClick={() => {
            setUpdate(true);
            closePO();
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
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_PO,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                ref_sup: false,
                pprod: [],
                pjasa: [],
                psup: [],
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
        { label: tr[localStorage.getItem("language")].hal, value: options.totalRecords },
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
          {options.first} - {options.last} {tr[localStorage.getItem("language")].dari} {options.totalRecords}
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

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : po}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "po_code",
                  "preq_id?.req_code",
                  "formatDate(po_date)",
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
                  header={tr[localStorage.getItem("language")].tgl}
                  style={{
                    minWidth: "10rem",
                  }}
                  field={(e) => formatDate(e.po_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_ord}
                  field={(e) => e.po_code}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_req}
                  field={(e) => e.preq_id?.req_code}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].supplier}
                  field={(e) => e.sup_id?.sup_name ?? "-"}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].sts}
                  field={(e) => e?.status ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.status !== 2 ? (
                          <Badge variant="success light">
                            <i className="bx bx-check text-success mr-1"></i>{" "}
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="danger light">
                            <i className="bx bx-x text-danger mr-1"></i> Close
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
        header={`${tr[localStorage.getItem("language")].close} ${
          tr[localStorage.getItem("language")].ord_pur
        }`}
        visible={confirm}
        style={{ width: "30vw" }}
        footer={footerClose("confirm")}
        onHide={() => {
          setDisplayConfirm(false);
        }}
      >
        <div className="ml-3 mr-3">
          <i
            className="pi pi-exclamation-triangle mr-3 align-middle"
            style={{ fontSize: "2rem" }}
          />
          <span>{tr[localStorage.getItem("language")].pesan_cls}</span>
        </div>
      </Dialog>

      <Dialog
        header={`${tr[localStorage.getItem("language")].hapus} ${
          tr[localStorage.getItem("language")].ord_pur
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

export default PesananPO;
