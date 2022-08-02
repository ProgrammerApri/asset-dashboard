import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { endpoints, request } from "src/utils";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";

const set = {
  id: null,
  cp_id: null,
  ar: null,
  ap: null,
  pnl: null,
  pnl_year: null,
  rtn_income: null,
  sls_rev: null,
  sls_disc: null,
  sls_retur: null,
  sls_shipping: null,
  sls_prepaid: null,
  sls_unbill: null,
  sls_unbill_recv: null,
  sls_tax: null,
  pur_cogs: null,
  pur_discount: null,
  pur_shipping: null,
  pur_retur: null,
  pur_advance: null,
  pur_unbill: null,
  pur_tax: null,
  sto: null,
  sto_broken: null,
  sto_general: null,
  sto_production: null,
  sto_hpp_diff: null,
  sto_wip: null,
  fixed_assets: null,
};

const SetupAkun = () => {
  const toast = useRef(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(null);
  const [available, setAvailable] = useState(false);
  const [accor, setAccor] = useState({
    penjualan: true,
    pembelian: true,
    ar_ap: true,
    persediaan: false,
    lainnya: false,
    labarugi: true,
  });

  useEffect(() => {
    getAccount();
  }, []);

  const getAccount = async () => {
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
        let acc = [];
        data.forEach((el) => {
          acc.push(el.account);
        });
        setAccount(acc);
      }
    } catch (error) {}

    getCompany();
  };

  const getCompany = async () => {
    const config = endpoints.getCompany;
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        if (
          Object.keys(response.data).length === 0 &&
          response.data.constructor === Object
        ) {
          setAvailable(false);
        } else {
          setAvailable(true);
        }
      }
    } catch (error) {
      setAvailable(false);
    }

    getSetup();
  };

  const getSetup = async (needLoading = true) => {
    setLoading(needLoading);
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

        setSetup(data);
      } else {
        setSetup(set);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const postCompany = async (data) => {
    let config = {
      ...endpoints.addCompany,
      data: {
        id: 0,
        cp_name: "",
        cp_addr: "",
        cp_ship_addr: "",
        cp_telp: "",
        cp_webs: "",
        cp_email: "",
        cp_npwp: "",
        cp_coper: "",
        cp_logo: "",
        multi_currency: false,
        appr_po: false,
        appr_payment: false,
        over_stock: false,
        discount: false,
        tiered: false,
        rp: false,
        over_po: false,
      },
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        addSetup(data);
      }
    } catch (error) {}
  };

  const addSetup = async (data) => {
    let config = {
      ...endpoints.addSetup,
      data: {
        ar: data?.ar?.id ?? null,
        ap: data?.ap?.id ?? null,
        pnl: data?.pnl?.id ?? null,
        pnl_year: data?.pnl_year?.id ?? null,
        rtn_income: data?.rtn_income?.id ?? null,
        sls_rev: data?.sls_rev?.id ?? null,
        sls_disc: data?.sls_disc?.id ?? null,
        sls_retur: data?.sls_retur?.id ?? null,
        sls_shipping: data?.sls_shipping?.id ?? null,
        sls_prepaid: data?.sls_prepaid?.id ?? null,
        sls_unbill: data?.sls_unbill?.id ?? null,
        sls_unbill_recv: data?.sls_unbill_recv?.id ?? null,
        sls_tax: data?.sls_tax?.id ?? null,
        pur_cogs: data?.pur_cogs?.id ?? null,
        pur_discount: data?.pur_discount?.id ?? null,
        pur_shipping: data?.pur_shipping?.id ?? null,
        pur_retur: data?.pur_retur?.id ?? null,
        pur_advance: data?.pur_advance?.id ?? null,
        pur_unbill: data?.pur_unbill?.id ?? null,
        pur_tax: data?.pur_tax?.id ?? null,
        sto: data?.sto?.id ?? null,
        sto_broken: data?.sto_broken?.id ?? null,
        sto_general: data?.sto?.sto_general ?? null,
        sto_production: data?.sto?.sto_production ?? null,
        sto_hpp_diff: data?.sto_hpp_diff?.id ?? null,
        sto_wip: data?.sto_wip?.id ?? null,
        sto_bb: data?.sto_bb?.id ?? null,
        sto_bbp: data?.sto_bbp?.id ?? null,
        fixed_assets: data?.fixed_assets?.id ?? null,
      },
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }

    getSetup(false);
  };

  const editSetup = async (data) => {
    let config = {
      ...endpoints.editSetup,
      endpoint: endpoints.editSetup.endpoint + data.id,
      data: {
        ar: data?.ar?.id ?? null,
        ap: data?.ap?.id ?? null,
        pnl: data?.pnl?.id ?? null,
        pnl_year: data?.pnl_year?.id ?? null,
        rtn_income: data?.rtn_income?.id ?? null,
        sls_rev: data?.sls_rev?.id ?? null,
        sls_disc: data?.sls_disc?.id ?? null,
        sls_retur: data?.sls_retur?.id ?? null,
        sls_shipping: data?.sls_shipping?.id ?? null,
        sls_prepaid: data?.sls_prepaid?.id ?? null,
        sls_unbill: data?.sls_unbill?.id ?? null,
        sls_unbill_recv: data?.sls_unbill_recv?.id ?? null,
        sls_tax: data?.sls_tax?.id ?? null,
        pur_cogs: data?.pur_cogs?.id ?? null,
        pur_discount: data?.pur_discount?.id ?? null,
        pur_shipping: data?.pur_shipping?.id ?? null,
        pur_retur: data?.pur_retur?.id ?? null,
        pur_advance: data?.pur_advance?.id ?? null,
        pur_unbill: data?.pur_unbill?.id ?? null,
        pur_tax: data?.pur_tax?.id ?? null,
        sto: data?.sto?.id ?? null,
        sto_broken: data?.sto_broken?.id ?? null,
        sto_general: data?.sto_general?.id ?? null,
        sto_production: data?.sto_production?.id ?? null,
        sto_hpp_diff: data?.sto_hpp_diff?.id ?? null,
        sto_wip: data?.sto_wip?.id ?? null,
        sto_bb: data?.sto_bb?.id ?? null,
        sto_bbp: data?.sto_bbp?.id ?? null,
        fixed_assets: data?.fixed_assets?.id ?? null,
      },
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }

    getSetup(false);
  };

  const submitUpdate = (data) => {
    if (available) {
      if (data.id) {
        editSetup(data);
      } else {
        addSetup(data);
      }
    } else {
      postCompany(data);
    }
  };

  const renderAccountDropdown = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    let option = [];
    if (type === "u") {
      if (account) {
        account.forEach((el) => {
          if (el.dou_type === "U") {
            option.push(el);
          }
        });
      }
    } else if (type === "d") {
      if (account) {
        account.forEach((el) => {
          if (el.dou_type === "D") {
            option.push(el);
          }
        });
      }
    } else {
      option = account;
    }
    return (
      <div className={`${expanded ? "col-12" : "col-6"} mb-2`}>
        {loading ? (
          <>
            <Skeleton width="200px" />
            <Skeleton className="mt-3" height="45px" />
          </>
        ) : (
          <>
            <label className="text-label">{label}</label>
            <div className="p-inputgroup">
              <Dropdown
                value={value}
                options={option && option}
                onChange={onChange}
                optionLabel={(option) => (
                  <div>
                    {option !== null
                      ? `(${option.acc_code}) - ${option.acc_name}`
                      : ""}
                  </div>
                )}
                filter
                filterBy="acc_name"
                placeholder="Pilih Akun"
                itemTemplate={(option) => (
                  <div>
                    {option !== null
                      ? `(${option.acc_code}) - ${option.acc_name}`
                      : ""}
                  </div>
                )}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderOthers = () => {
    return (
      <CustomAccordion
        tittle={"Aset"}
        defaultActive={false}
        active={accor.lainnya}
        onClick={() => {
          setAccor({
            ...accor,
            lainnya: !accor.lainnya,
          });
        }}
        key={1}
        body={
          <Row className="mr-0 ml-0">
            {renderAccountDropdown(
              "Aset Tetap",
              setup && setup.fixed_assets,
              (e) => {
                setSetup({ ...setup, fixed_assets: e.value });
                submitUpdate({ ...setup, fixed_assets: e.value });
              },
              true,
              "d"
            )}
          </Row>
        }
      />
    );
  };

  const renderPenjualan = () => {
    return (
      <Accordion className="accordion " defaultActiveKey="0">
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
            <span className="accordion__header--text">Penjualan</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                {renderAccountDropdown(
                  "Pendapatan Penjualan",
                  setup && setup.sls_rev,
                  (e) => {
                    setSetup({ ...setup, sls_rev: e.value });
                    submitUpdate({ ...setup, sls_rev: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Pembayaran Dimuka",
                  setup && setup.sls_prepaid,
                  (e) => {
                    setSetup({ ...setup, sls_prepaid: e.value });
                    submitUpdate({ ...setup, sls_prepaid: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Diskon Penjualan",
                  setup && setup.sls_disc,
                  (e) => {
                    setSetup({ ...setup, sls_disc: e.value });
                    submitUpdate({ ...setup, sls_disc: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Penjualan Belum Ditagih",
                  setup && setup.sls_unbill,
                  (e) => {
                    setSetup({ ...setup, sls_unbill: e.value });
                    submitUpdate({ ...setup, sls_unbill: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Retur Penjualan",
                  setup && setup.sls_retur,
                  (e) => {
                    setSetup({ ...setup, sls_retur: e.value });
                    submitUpdate({ ...setup, sls_retur: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Piutang Belum Ditagih",
                  setup && setup.sls_unbill_recv,
                  (e) => {
                    setSetup({ ...setup, sls_unbill_recv: e.value });
                    submitUpdate({ ...setup, sls_unbill_recv: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Pengiriman Penjualan",
                  setup && setup.sls_shipping,
                  (e) => {
                    setSetup({ ...setup, sls_shipping: e.value });
                    submitUpdate({ ...setup, sls_shipping: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Hutang Pajak Penjualan",
                  setup && setup.sls_tax,
                  (e) => {
                    setSetup({ ...setup, sls_tax: e.value });
                    submitUpdate({ ...setup, sls_tax: e.value });
                  }
                )}
              </Row>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderPembelian = () => {
    return (
      <Accordion className="accordion " defaultActiveKey="0">
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.pembelian ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                pembelian: !accor.pembelian,
              });
            }}
          >
            <span className="accordion__header--text">Pembelian</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                {renderAccountDropdown(
                  "Pembelian (COGS)",
                  setup && setup.pur_cogs,
                  (e) => {
                    setSetup({ ...setup, pur_cogs: e.value });
                    submitUpdate({ ...setup, pur_cogs: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Pembelian Belum Ditagih",
                  setup && setup.pur_unbill,
                  (e) => {
                    setSetup({ ...setup, pur_unbill: e.value });
                    submitUpdate({ ...setup, pur_unbill: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Pengiriman Pembelian",
                  setup && setup.pur_shipping,
                  (e) => {
                    setSetup({ ...setup, pur_shipping: e.value });
                    submitUpdate({ ...setup, pur_shipping: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Pajak Pembelian",
                  setup && setup.pur_tax,
                  (e) => {
                    setSetup({ ...setup, pur_tax: e.value });
                    submitUpdate({ ...setup, pur_tax: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Uang Muka Pembelian",
                  setup && setup.pur_advance,
                  (e) => {
                    setSetup({ ...setup, pur_advance: e.value });
                    submitUpdate({ ...setup, pur_advance: e.value });
                  }
                )}
              </Row>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderArAp = () => {
    return (
      <CustomAccordion
        tittle={"AR/AP"}
        active={accor.ar_ap}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            ar_ap: !accor.ar_ap,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {renderAccountDropdown("Piutang Usaha", setup && setup.ar, (e) => {
              setSetup({ ...setup, ar: e.value });
              submitUpdate({ ...setup, ar: e.value });
            })}

            {renderAccountDropdown("Hutang Usaha", setup && setup.ap, (e) => {
              setSetup({ ...setup, ap: e.value });
              submitUpdate({ ...setup, ap: e.value });
            })}
          </Row>
        }
      />
    );
  };

  const renderPersediaan = () => {
    return (
      <CustomAccordion
        tittle={"Persediaan"}
        active={accor.persediaan}
        key={1}
        defaultActive={false}
        onClick={() => {
          setAccor({
            ...accor,
            persediaan: !accor.persediaan,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {/* {renderAccountDropdown("Persediaan", setup && setup.sto, (e) => {
              setSetup({ ...setup, sto: e.value });
              submitUpdate({ ...setup, sto: e.value });
            })} */}
            {renderAccountDropdown(
              "Persediaan - Akun Umum",
              setup && setup.sto_general,
              (e) => {
                setSetup({ ...setup, sto_general: e.value });
                submitUpdate({ ...setup, sto_general: e.value });
              }
            )}

            {renderAccountDropdown(
              "Persediaan Rusak",
              setup && setup.sto_broken,
              (e) => {
                setSetup({ ...setup, sto_broken: e.value });
                submitUpdate({ ...setup, sto_broken: e.value });
              }
            )}

            {renderAccountDropdown(
              "Persediaan Produksi",
              setup && setup.sto_production,
              (e) => {
                setSetup({ ...setup, sto_production: e.value });
                submitUpdate({ ...setup, sto_production: e.value });
              }
            )}

            {renderAccountDropdown(
              "Persediaan Selisih HPP",
              setup && setup.sto_hpp_diff,
              (e) => {
                setSetup({ ...setup, sto_hpp_diff: e.value });
                submitUpdate({ ...setup, sto_hpp_diff: e.value });
              }
            )}

            {renderAccountDropdown(
              "Persediaan WIP - Akun Umum",
              setup && setup.sto_wip,
              (e) => {
                setSetup({ ...setup, sto_wip: e.value });
                submitUpdate({ ...setup, sto_wip: e.value });
              }
            )}

            {renderAccountDropdown(
              "Persediaan Bahan Baku",
              setup && setup.sto_bb,
              (e) => {
                setSetup({ ...setup, sto_bb: e.value });
                submitUpdate({ ...setup, sto_bb: e.value });
              }
            )}

            {renderAccountDropdown(
              "Persediaan Bahan Baku Pembantu",
              setup && setup.sto_bbp,
              (e) => {
                setSetup({ ...setup, sto_bbp: e.value });
                submitUpdate({ ...setup, sto_bbp: e.value });
              }
            )}
          </Row>
        }
      />
    );
  };

  const renderLabaRugi = () => {
    return (
      <CustomAccordion
        tittle={"Laba Rugi"}
        active={accor.labarugi}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            labarugi: !accor.labarugi,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {renderAccountDropdown(
              "Laba Rugi Berjalan",
              setup && setup.pnl,
              (e) => {
                setSetup({ ...setup, pnl: e.value });
                submitUpdate({ ...setup, pnl: e.value });
              }
            )}

            {renderAccountDropdown(
              "Laba Rugi Tahun Berjalan",
              setup && setup.pnl_year,
              (e) => {
                setSetup({ ...setup, pnl_year: e.value });
                submitUpdate({ ...setup, pnl_year: e.value });
              }
            )}

            {renderAccountDropdown(
              "Laba Rugi Ditahan",
              setup && setup.rtn_income,
              (e) => {
                setSetup({ ...setup, rtn_income: e.value });
                submitUpdate({ ...setup, rtn_income: e.value });
              }
            )}
          </Row>
        }
      />
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-lg-6 col-sm-12 col-xs-12">
          {renderArAp()} {renderPenjualan()} {renderPersediaan()}
        </Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">
          {renderLabaRugi()}
          {renderPembelian()}
          {renderOthers()}
        </Col>
      </Row>
    </>
  );
};

export default SetupAkun;
