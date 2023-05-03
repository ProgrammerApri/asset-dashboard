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
import { el } from "date-fns/locale";
import { Messages } from "primereact/messages";

const data = {
  account: {
    acc_code: "",
    acc_name: "",
    umm_code: null,
    kat_code: 0,
    dou_type: "U",
    sld_type: "",
    connect: false,
    sld_awal: 0,
  },
  kategory: {
    id: 0,
    name: "",
    kode_klasi: 0,
    kode_saldo: "",
  },
  klasifikasi: {
    id: 0,
    klasiname: "",
  },
};

const SaldoAkhir = () => {
  const [account, setAccount] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [setAcc, setSetupAcc] = useState(null);
  const [setup, setSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(data);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(100);
  const [month, setMonth] = useState();
  const [comp, setComp] = useState(null);
  const messages = useRef(null);
  const dummy = Array.from({ length: 100 });

  useEffect(() => {
    getSetAcc();
    getYear();
    initFilters1();
    getAccDef();
  }, []);

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
        setMonth(data);
      }
    } catch (error) {}
  };

  const getAccDef = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAccount(data);
      }
    } catch (error) {}
    setLoading(false);
  };

  const getAccount = async (setup) => {
    setLoading(true);
    const config = {
      ...endpoints.account,
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
          if (element.account.umm_code === setup.sto.acc_code) {
            if (element.account.dou_type === "D") {
              filt.push({
                acc_code: element.account.acc_code,
                acc_name: element.account.acc_name,
                saldo: 0,
                id: 0,
              });
            }
          }
        });
        getSetup(filt);
      }
    } catch (error) {}
    setLoading(false);
  };

  const getSetup = async (saldo) => {
    const config = {
      ...endpoints.getSetupSa,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        messages.current.clear();
        saldo.forEach((el) => {
          if (!data.some((v) => v.sto.acc_code === el.acc_code)) {
            messages.current.show({
              severity: "warn",
              summary: "",
              detail: `${el.acc_code}-${el.acc_name} setup is not completed`,
              sticky: true,
            });
            el.valid = false;
          } else {
            el.valid = true;
          }
        });
        setSaldo(saldo);
        getSaldo(true, saldo);
      }
    } catch (error) {
      console.log("errorr" + error);
    }
  };

  const getSaldo = async (loading = true, saldo) => {
    if (loading) {
      setLoading(true);
    }
    const config = {
      ...endpoints.saldoAkhir,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        if (data.length) {
          let temp = saldo;
          temp.forEach((el) => {
            data.forEach((ek) => {
              if (el.acc_code === ek.acc_code) {
                el.saldo = ek.saldo;
                el.id = ek.id;
              }
            });
          });
          setSaldo(temp);
        }
      }
    } catch (error) {}
    setLoading(false);
  };

  const getSetAcc = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getSetup,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSetupAcc(data);
        console.log("+++++++++++++++++++++");
        console.log(data);
        getAccount(data);
      }
    } catch (error) {}
  };

  const addSal = async () => {
    let acc = [];
    saldo?.forEach((element) => {
      acc.push({
        id: element.id,
        acc_code: element.acc_code,
        date: new Date(),
        saldo: element.saldo,
      });
    });
    const config = {
      ...endpoints.addSaldoAkhir,
      data: {
        sld_akhir: acc,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          getSaldo(false, saldo);
          toast?.current?.show({
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
        toast?.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal memperbarui data",
          sticky: true,
        });
      }, 500);
    }
  };

  const onSubmit = () => {
    console.log(saldo);
    addSal();
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
        <div className="col-12 pt-0 pb-0">
          <Messages ref={messages}></Messages>
        </div>
        <div className="flex justify-content-between col-12 pt-0">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Cari disini"
            />
          </span>
          <Row className="mr-1"></Row>
        </div>
      </Row>
    );
  };

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account?.acc_code) {
        selected = element;
      }
    });

    return selected;
  };

  const textEditor = (data) => {
    console.log(data);
    return (
      <div className="p-inputgroup">
        <InputNumber
          value={saldo[data.rowIndex].saldo}
          onValueChange={(e) => {
            let temp = saldo;
            temp[data.rowIndex].saldo = e.value;
            setSaldo(temp);
          }}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : saldo}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey=""
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["acc_code"]}
                emptyMessage="Tidak ada data"
              >
                <Column
                  header="Kode Akun"
                  field={(e) => e?.acc_code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Akun"
                  field={(e) => checkAcc(e?.acc_code)?.account?.acc_name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Saldo Akhir"
                  editor={(e) =>
                    saldo[e.rowIndex].valid ? (
                      textEditor(e)
                    ) : (
                      <div>{formatIdr(saldo[e.rowIndex].saldo)}</div>
                    )
                  }
                  field={(e) => formatIdr(e?.saldo)}
                  style={{ width: "25rem" }}
                  body={loading && <Skeleton />}
                  onCellEditComplete={(e) =>
                    saldo[e.rowIndex].valid ? onSubmit() : null
                  }
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SaldoAkhir;
