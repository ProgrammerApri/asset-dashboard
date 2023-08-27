import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_LM, SET_EDIT_LM, SET_LM } from "src/redux/actions";
import { tr } from "../../../../../data/tr";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import CustomAccordion from "../../../../components/Accordion/Accordion";
import endpoints from "../../../../../utils/endpoints";
import { Tooltip } from "primereact/tooltip";

const data = {
  id: null,
  mtsi_code: null,
  mtsi_date: null,
  loc_from: null,
  loc_to: null,
  dep_id: null,
  prj_id: null,
  doc: null,
  doc_date: null,
  approve: false,
  desc: null,
  mutasi: [],
};

const MutasiAntarList = ({ onAdd, onEdit, onDetail, onSuccess, onCancel }) => {
  const mutasi = useSelector((state) => state.lm.lm);
  const lm = useSelector((state) => state.lm.current);
  const isEdit = useSelector((state) => state.lm.editLm);
  const [update, setUpdate] = useState(true);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [setup, setSetup] = useState(null);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [proj, setProj] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [accor, setAccor] = useState({
    produk: true,
  });

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    initFilters1();
    getMutasi();
    getProduct();
    getSatuan();
    getPusatBiaya();
    getLokasi();
    getProj();
  }, []);

  const getMutasi = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.mutasi,
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
        data?.forEach((element) => {
          if (!element.closing) {
            filt.push(element);
          }
        });
        dispatch({ type: SET_LM, payload: filt });
        getSetup();
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

  const getCoderp = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getcode_mutasi,
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
          type: SET_CURRENT_LM,
          payload: {
            ...data,
            mtsi_code: kode,
            mutasi: [
              {
                id: 0,
                prod_id: null,
                unit_id: null,
                qty: null,
                qty_terima: null,
              },
            ],
          },
        });
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setProduct(data);
      }
    } catch (error) {}
  };

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSatuan(data);
      }
    } catch (error) {}
  };

  const getPusatBiaya = async () => {
    const config = {
      ...endpoints.pusatBiaya,
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
        setPusatBiaya(data);
      }
    } catch (error) {}
  };

  const getLokasi = async () => {
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

        setLokasi(data);
      }
    } catch (error) {}
  };

  const getProj = async () => {
    const config = {
      ...endpoints.project,
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
        setProj(data);
      }
    } catch (error) {}
  };

  const confirmLM = async () => {
    const config = {
      ...endpoints.editMutasi,
      endpoint: endpoints.editMutasi.endpoint + lm.id,
      data: lm,
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
          getMutasi(true);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhasl,
            detail: tr[localStorage.getItem("language")].del_berhasil,
            life: 3000,
          });
        }, 100);
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

  const delMut = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delMutasi,
      endpoint: endpoints.delMutasi.endpoint + currentItem.id,
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
          getMutasi(true);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhasl,
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
            delMut();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
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
            getCoderp()
            dispatch({
              type: SET_EDIT_LM,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_LM,
              payload: {
                ...data,
                mutasi: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    qty: null,
                    qty_terima: null,
                  },
                ],
              },
            });
          }}
          disabled={setup?.cutoff === null && setup?.year_co === null}
        />
      </div>
    );
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Tooltip target=".btn" />
        <Link
          onClick={() => {
            onDetail();
            let mutasi = data.mutasi;
            // mutasi?.forEach((el) => {
            //   el.prod_id = el.prod_id?.id;
            // });
            dispatch({
              type: SET_CURRENT_LM,
              payload: {
                ...data,
                mutasi: mutasi.length > 0 ? mutasi : null,
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
            let mutasi = data.mutasi;
            dispatch({
              type: SET_EDIT_LM,
              payload: true,
            });
            mutasi.forEach((el) => {
              el.prod_id = el.prod_id?.id;
              el.unit_id = el.unit_id?.id;
            });

            dispatch({
              type: SET_CURRENT_LM,
              payload: {
                ...data,
                loc_from: data?.loc_from?.id ?? null,
                loc_to: data?.loc_to?.id ?? null,
                dep_id: data?.dep_id?.id ?? null,
                prj_id: data?.prj_id?.id ?? null,
                approve: false,
                mutasi:
                  mutasi.length > 0
                    ? mutasi
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          qty: null,
                          qty_terima: null,
                        },
                      ],
              },
            });
          }}
          className={`btn ${
            data.post === false ? "" : "disabled"
          } btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            // setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className={`btn ${
            data.post === false ? "" : "disabled"
          } btn-danger shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>

        <Link
          data-pr-tooltip="Approve Penerimaan Mutasi"
          data-pr-position="right"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
          onClick={() => {
            setUpdate(false);
            let mutasi = data.mutasi;
            mutasi.forEach((el) => {
              el.prod_id = el.prod_id?.id;
              el.unit_id = el.unit_id?.id;
            });
            setDisplayData(
              dispatch({
                type: SET_EDIT_LM,
                payload: true,
              }),

              dispatch({
                type: SET_CURRENT_LM,
                payload: {
                  ...data,
                  loc_from: data?.loc_from?.id ?? null,
                  loc_to: data?.loc_to?.id ?? null,
                  dep_id: data?.dep_id?.id ?? null,
                  prj_id: data?.prj_id?.id ?? null,
                  approve: true,
                  mutasi:
                    mutasi.length > 0
                      ? mutasi
                      : [
                          {
                            id: 0,
                            prod_id: null,
                            unit_id: null,
                            qty: null,
                            qty_terima: null,
                          },
                        ],
                },
              })
            );
          }}
          className={
            data?.approve
              ? `btn ${
                  data.approve === false ? "" : "disabled"
                } btn-danger shadow btn-xs sharp ml-1`
              : `btn btn-primary shadow btn-xs sharp ml-1`
          }
        >
          <i className="fa fa-check"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const confirmFooter = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label="Batal"
            onClick={(e) => {
              setUpdate(false);
              setDisplayData(false);
              getMutasi(true);
            }}
            className="p-button-text btn-primary"
          />
          <PButton
            label="Simpan"
            icon="pi pi-check"
            onClick={() => {
              if (isEdit) {
                setUpdate(true);
                confirmLM();
              }
            }}
            autoFocus
            loading={update}
            disabled={setup?.cutoff === null && setup?.year_co === null}
          />
        </div>
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

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkUnit = (value) => {
    let selected = {};
    satuan?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const dept = (value) => {
    let selected = {};
    pusatBiaya?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const prj = (value) => {
    let selected = {};
    proj?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const loc = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const updateLM = (e) => {
    dispatch({
      type: SET_CURRENT_LM,
      payload: e,
    });
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
                value={loading ? dummy : mutasi}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={null}
                globalFilterFields={["mtsi_code"]}
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
                    minWidth: "8rem",
                  }}
                  field={(e) => formatDate(e.mtsi_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_mut}
                  field={(e) => e.mtsi_code}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].mut_asal}
                  field={(e) => (e.loc_from !== null ? e.loc_from.name : "-")}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].mut_tujuan}
                  field={(e) => (e.loc_to !== null ? e.loc_to.name : "-")}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={"Status Mutasi"}
                  field={(e) => e.surat_jalan}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.approve ? (
                          <>
                            <Badge variant="info light">
                              <i className="bx bxs-check-circle text-info mr-1 mt-1"></i>{" "}
                              Approved
                            </Badge>
                          </>
                        ) : (
                          <Badge variant="danger light">
                            <i className="bx bxs-x-circle text-danger mr-1 mt-1"></i>{" "}
                            Not Approved
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
                  style={{ minWidth: "1rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={"Approve Penerimaan Produk Mutasi"}
        visible={displayData}
        style={{ width: "60vw" }}
        footer={confirmFooter("displayData")}
        onHide={() => {
          setUpdate(false);
          setDisplayData(false);
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-3">
            <label className="text-label">Kode Mutasi</label>
            <div className="p-inputgroup">
              <InputText
                value={`${lm?.mtsi_code}`}
                // onChange={(e) =>
                //   updateLM({ ...lm, mtsi_code: e.target.value })
                // }
                placeholder="Kode Mutasi"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Tanggal Mutasi</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${lm.mtsi_date}Z`)}
                // onChange={(e) =>
                //   setCurrentItem({ ...currentItem, jpel_name: e.target.value })
                // }
                placeholder="Tanggal Mutasi"
                dateFormat="dd-mm-yy"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">No. Dokumen</label>
            <div className="p-inputgroup">
              <InputText
                value={lm?.doc ?? "-"}
                // onChange={(e) =>
                //   updateLM({ ...lm, mtsi_code: e.target.value })
                // }
                placeholder="No. Dokumen"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Tanggal Dokumen</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${lm.doc_date}Z`)}
                // onChange={(e) =>
                //   setCurrentItem({ ...currentItem, jpel_name: e.target.value })
                // }
                placeholder="Tanggal Dokumen"
                dateFormat="dd-mm-yy"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="row mr-0 ml-0">
          <div className="col-3">
            <label className="text-label">Lokasi Asal</label>
            <div className="p-inputgroup">
              <InputText
                value={loc(lm?.loc_from)?.name ?? "-"}
                // onChange={(e) =>
                //   updateLM({ ...lm, mtsi_code: e.target.value })
                // }
                placeholder="Lokasi Asal"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Lokasi Tujuan</label>
            <div className="p-inputgroup">
              <InputText
                value={loc(lm.loc_to)?.name ?? "-"}
                // onChange={(e) =>
                //   setCurrentItem({ ...currentItem, jpel_name: e.target.value })
                // }
                placeholder="Lokasi Tujuan"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup">
              <InputText
                value={dept(lm.dep_id)?.ccost_name ?? "-"}
                // onChange={(e) =>
                //   setCurrentItem({ ...currentItem, jpel_name: e.target.value })
                // }
                placeholder="Departemen"
                disabled
              />
            </div>
          </div>
          <div className="col-3">
            <label className="text-label">Project</label>
            <div className="p-inputgroup">
              <InputText
                value={prj(lm.prj_id)?.proj_name ?? "-"}
                // onChange={(e) =>
                //   setCurrentItem({ ...currentItem, jpel_name: e.target.value })
                // }
                placeholder="Project"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="row mr-0 ml-0 mt-3">
          <div className="col-12">
            <CustomAccordion
              tittle={"Mutasi Produk"}
              defaultActive={true}
              active={accor.produk}
              onClick={() => {
                setAccor({
                  ...accor,
                  produk: !accor.produk,
                });
              }}
              key={1}
              body={
                <>
                  <DataTable
                    responsiveLayout="none"
                    value={lm.mutasi?.map((v, i) => {
                      return {
                        ...v,
                        index: i,
                      };
                    })}
                    className="display w-150 datatable-wrapper header-white no-border"
                    showGridlines={false}
                    emptyMessage={() => <div></div>}
                  >
                    <Column
                      header="Produk"
                      className="align-text-top"
                      style={{
                        maxWidth: "20rem",
                      }}
                      field={""}
                      body={(e) => (
                        <PrimeInput
                          value={
                            e.prod_id &&
                            `${checkProd(e.prod_id)?.name} (${
                              checkProd(e.prod_id)?.code
                            })`
                          }
                          options={product}
                          onChange={(u) => {}}
                          optionLabel="name"
                          placeholder="Pilih Produk"
                          filter
                          filterBy="name"
                          disabled
                        />
                      )}
                    />
                    <Column
                      header="Jumlah Mutasi"
                      className="align-text-top"
                      style={{
                        width: "10rem",
                      }}
                      field={""}
                      body={(e) => (
                        <PrimeNumber
                          price
                          value={e.qty ? e.qty : null}
                          onChange={(a) => {}}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      )}
                    />

                    <Column
                      header="Satuan"
                      className="align-text-top"
                      style={{
                        maxWidth: "15rem",
                      }}
                      field={""}
                      body={(e) => (
                        <PrimeInput
                          value={e.unit_id && checkUnit(e.unit_id)?.name}
                          onChange={(e) => {}}
                          placeholder="Satuan"
                          disabled
                        />
                      )}
                    />

                    <Column
                      header="Jumlah Terima"
                      className="align-text-top"
                      style={{
                        width: "10rem",
                      }}
                      field={""}
                      body={(e) => (
                        <PrimeNumber
                          price
                          value={e.qty_terima ? e.qty_terima : null}
                          onChange={(a) => {
                            let temp = [...lm.mutasi];
                            temp[e.index].qty_terima = a.value;
                            if (a.value > temp[e.index].qty) {
                              temp[e.index].qty_terima = temp[e.index].qty;
                            }
                            updateLM({ ...lm, mutasi: temp });

                            // let newError = error;
                            // newError.mut[e.index].jum = false;
                            // setError(newError);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          // error={error?.mut[e.index]?.jum}
                        />
                      )}
                    />
                  </DataTable>
                </>
              }
            />
          </div>
        </div>
      </Dialog>

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

export default MutasiAntarList;
