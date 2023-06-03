import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import { FilterMatchMode } from "primereact/api";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Button, Button as PButton } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { endpoints, request } from "src/utils";
import { InputSwitch } from "primereact/inputswitch";
import { tr } from "src/data/tr";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_AUTO } from "src/redux/actions";
// import { SET_CURRENT_AUTO } from "src/redux/actions";

const data = {
  id: 0,
  comp_id: null,
  modules: null,
  prefix: null,
  month: null,
  year: null,
  auto_renew: false,
  show_dept: false,
};

const SetupAutoNumber = () => {
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [rows2, setRows2] = useState(20);
  const [year, setYear] = useState(new Date().getFullYear());
  const toast = useRef(null);
  const rpauto = useSelector((state) => state.rpauto.rpauto);
  const [filters1, setFilters1] = useState(null);
  const [setup, setSetup] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [middle, setMiddle] = useState(new Date().getMonth() + 1);
  const [purchaseRequest, setPurchaseRequest] = useState(rpauto?.prefix || "");
  const [purchaseRequestExpanded, setpurchaseRequestExpanded] = useState(
    rpauto?.auto_renew || false
  );
  const [purchaseOrderExpanded, setpurchaseOrderExpanded] = useState(
    rpauto?.auto_renew || false
  );
  const [purchaseOrder, setPurchaseOrder] = useState(rpauto?.prefix || "");
  const [gra, setGra] = useState(rpauto?.prefix || "");
  const [invoicepurchase, setInvoicepurchase] = useState(rpauto?.prefix || "");
  const [fakturinvoice, setFakturinvoice] = useState(rpauto?.prefix || "");
  const [expanded, setExpanded] = useState(rpauto?.auto_renew || false);

  const monthsInRomanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  const romanNumeral = monthsInRomanNumerals[middle];
  const [displayInput, setDisplayInput] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [current, setCurrent] = useState(data);
  const [auto, setAuto] = useState(null);
  const [resbulan, setResbulan] = useState(data);
  const dummy = Array.from({ length: 10 });
  const [accor, setAccor] = useState({
    penjualan: true,
    pembelian: true,
    inventory: true,
    memorial: true,
    bankkeluar: false,
    bankmasuk: true,
    produksi: false,
  });

  useEffect(() => {
    getAuto();
    initFilters1();
  }, []);

  const handleSaveData = async () => {
    const updatedData = {
      ...data,
      prefix: purchaseRequest,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      prefix: purchaseOrder,
      // Assign nilai-nilai komponen lainnya ke properti yang sesuai di objek `data`
    };

    try {
      setLoadingSubmit(true);
      const config = {
        ...endpoints.addSetupautonumber,
        data: updatedData,
      };

      const response = await request(null, config);

      if (response.status) {
        setTimeout(() => {
          setLoadingSubmit(false);
          setDisplayInput(false);
          getAuto();
          // getProfile();
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Ditambahkan",
            life: 3000,
          });
        }, 500);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setTimeout(() => {
        setLoadingSubmit(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const getAuto = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getSetupautonumber,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const dispatch = useDispatch();

  const updateRp = (e) => {
    dispatch({
      type: SET_CURRENT_AUTO,
      payload: e,
    });
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const onSubmit = () => {
    if (isEdit) {
      // editMenu(rp);
    } else {
      handleSaveData(data);
    }
  };

  const renderInputtext = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        {/* Kode yang sebelumnya untuk loading telah dihapus untuk kesederhanaan contoh */}
        <>
          <label className="text-label">{label}</label>
          <div className=" col-2  "> </div>
          <InputText
            value={value}
            onChange={onChange}
            placeholder="Masukkan Disini"
            // disabled={type === "all" && expanded}
          />

          {type === "all" && (
            <>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
              <InputText
                value={year}
                // onChange={year}
                placeholder="Masukkan Disini"
                disabled
              />
              <InputText
                value={expanded ? "SUPERVISOR" : ""}
                placeholder="Masukkan Disini"
                disabled
              />{" "}
              <InputSwitch
                checked={expanded}
                onChange={(expanded) => onChange(expanded)}
              />
              <div></div>
              <InputSwitch checked={value} onChange={onChange} />
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit();
                }}
                autoFocus
                loading={loading}
              />
              {/* Komponen InputText lainnya bisa ditambahkan sesuai kebutuhan */}
            </>
          )}
        </>
      </div>
    );
  };
  const renderPurchase = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Purchase
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0 ">
                {renderInputtext(
                  "Purchase Request",
                  purchaseRequest,
                  (e) => {
                    setPurchaseRequest(e.target.value);
                  },
                  purchaseRequestExpanded
                  // (value) => {
                  //   setpurchaseRequestExpanded(value);
                  // }
                )}
                {renderInputtext(
                  "Purchase Order",
                  purchaseOrder,
                  (e) => {
                    setPurchaseOrder(e.target.value);
                  },
                  purchaseOrderExpanded,
                  (value) => {
                    setpurchaseOrderExpanded(value);
                  }
                )}
                {renderInputtext("Purchase ", gra, (e) => {
                  setGra(e.target.value);
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Purchase Invoice", rpauto?.prefix, (e) => {
                  setCurrent({ ...rpauto, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Purchase Return", rpauto?.pr_no_ref, (e) => {
                  setSetup({ ...setup, pr_no_ref: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderPenjualan = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">Auto Number Sale</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Sale Order (SO)", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}

                {renderInputtext("Sale ", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Invoice Sale", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Faktur Sale", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Sale Retur", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderMemorial = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Memorial
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Memorial", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderPersediaan = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Kas / Bank Keluar
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext(
                  "Mutasi Between Location",
                  rpauto?.prefix,
                  (e) => {
                    setSetup({ ...setup, prefix: e.target.value });
                    // submitUpdate({ ...setup, prefix: e.target.value });
                  }
                )}
                {renderInputtext("Koreksi Persediaan", rpauto?.prefix, (e) => {
                  setSetup({
                    ...setup,
                    prefix: e.target.value,
                  });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext(
                  "Pemakaian Bahan Baku",
                  rpauto?.prefix,
                  (e) => {
                    setSetup({ ...setup, prefix: e.target.value });
                    // submitUpdate({ ...setup, prefix: e.target.value });
                  }
                )}
                {renderInputtext(
                  "Penerimaan Hasil Jadi",
                  rpauto?.prefix,
                  (e) => {
                    setSetup({ ...setup, prefix: e.target.value });
                    // submitUpdate({ ...setup, prefix: e.target.value });
                  }
                )}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderKasBankMasuk = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Kas Bank / Masuk
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext(
                  "Pemasukan Uang Masuk",
                  rpauto?.prefix,
                  (e) => {
                    setSetup({ ...setup, prefix: e.target.value });
                    // submitUpdate({ ...setup, prefix: e.target.value });
                  }
                )}
                {renderInputtext(
                  "Pencairan Giro Masuk",
                  rpauto?.prefix,
                  (e) => {
                    setSetup({
                      ...setup,
                      prefix: e.target.value,
                    });
                    // submitUpdate({ ...setup, prefix: e.target.value });
                  }
                )}
                {renderInputtext("Koreksi Piutang", rpauto?.prefix, (e) => {
                  setSetup({
                    ...setup,
                    prefix: e.target.value,
                  });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderProduksi = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Produksi
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Mesin", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Formula", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Planning", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext("Batch", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext(
                  "Penerimaan Hasil Jadi",
                  rpauto?.prefix,
                  (e) => {
                    setSetup({
                      ...setup,
                      prefix: e.target.value,
                    });
                    // submitUpdate({ ...setup, prefix: e.target.value });
                  }
                )}
                {renderInputtext("Pembebanan", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderKasBankKeluar = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Kas / Bank Keluar
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Pengeluaran", rpauto?.prefix, (e) => {
                  setSetup({ ...setup, prefix: e.target.value });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
                {renderInputtext(
                  "Pencairan Giro Keluar",
                  rpauto?.prefix,
                  (e) => {
                    setSetup({
                      ...setup,
                      prefix: e.target.value,
                    });
                    // submitUpdate({ ...setup, prefix: e.target.value });
                  }
                )}
                {renderInputtext("Koreksi Hutang", rpauto?.prefix, (e) => {
                  setSetup({
                    ...setup,
                    prefix: e.target.value,
                  });
                  // submitUpdate({ ...setup, prefix: e.target.value });
                })}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-lg-12 col-sm-12 col-xs-12">
          {renderPurchase()}
          {renderPenjualan()}
          {renderPersediaan()}
          {renderMemorial()}
          {renderKasBankKeluar()}
          {renderKasBankMasuk()}
          {renderProduksi()}
        </Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">
          {/* {renderLabaRugi()} */}
          {/* {renderPembelian()} */}
          {/* {renderOthers()} */}
          {/* {renderCosting()} */}
          {/* {renderSelisihKurs()} */}
          {/* {renderKas()} */}
        </Col>
      </Row>
    </>
  );
};

export default SetupAutoNumber;
