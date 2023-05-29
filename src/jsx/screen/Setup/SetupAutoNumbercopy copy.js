import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { endpoints, request } from "src/utils";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

const set = {
  id: null,
  cp_id: null,
  rp_no_ref: null,
  rp_ref_month: null,
  rp_ref_year: null,
  rp_depart: null,
  rp_reset_month: false,
  po_no_ref: null,
  po_ref_month: null,
  po_ref_year: null,
  po_depart: null,
  po_reset_month: false,
  gr_no_ref: null,
  gr_ref_month: null,
  gr_ref_year: null,
  gr_depart: null,
  gr_reset_month: false,
  pi_no_ref: null,
  pi_ref_month: null,
  pi_ref_year: null,
  pi_depart: null,
  pi_reset_month: false,
  pr_no_ref: null,
  pr_ref_month: null,
  pr_ref_year: null,
  pr_depart: null,
  pr_reset_month: false,

  so_no_ref: null,
  so_ref_month: null,
  so_ref_year: null,
  so_depart: null,
  so_reset_month: false,
  sl_no_ref: null,
  sl_ref_month: null,
  sl_ref_year: null,
  sl_depart: null,
  sl_reset_month: false,
  ip_no_ref: null,
  ip_ref_month: null,
  ip_ref_year: null,
  ip_depart: null,
  ip_reset_month: false,
  fp_no_ref: null,
  fp_ref_month: null,
  fp_ref_year: null,
  fp_depart: null,
  fp_reset_month: false,
  rpen_no_ref: null,
  rpen_ref_month: null,
  rpen_ref_year: null,
  rpen_depart: null,
  rpen_reset_month: false,

  mutasiantarlok_no_ref: null,
  mutasiantarlok_ref_month: null,
  mutasiantarlok_ref_year: null,
  mutasiantarlok_depart: null,
  mutasiantarlok_reset_month: false,
  korpersediaan_no_ref: null,
  korpersediaan_ref_month: null,
  korpersediaan_ref_year: null,
  korpersediaan_depart: null,
  korpersediaan_reset_month: false,

  pemkaianbb_no_ref: null,
  pemkaianbb_ref_month: null,
  pemkaianbb_ref_year: null,
  pemkaianbb_depart: null,
  pemkaianbb_reset_month: false,

  penerimaanhj_no_ref: null,
  penerimaanhj_ref_month: null,
  penerimaanhj_ref_year: null,
  penerimaanhj_depart: null,
  penerimaanhj_reset_month: false,

  memorial_no_ref: null,
  memorial_ref_month: null,
  memorial_ref_year: null,
  memorial_depart: null,
  memorial_reset_month: false,

  pengeluaran_no_ref: null,
  pengeluaran_ref_month: null,
  pengeluaran_ref_year: null,
  pengeluaran_depart: null,
  pengeluaran_reset_month: false,

  pencairangirokeluar_no_ref: null,
  pencairangirokeluar_ref_month: null,
  pencairangirokeluar_ref_year: null,
  pencairangirokeluar_depart: null,
  pencairangirokeluar_reset_month: false,

  koreksihutang_no_ref: null,
  koreksihutang_ref_month: null,
  koreksihutang_ref_year: null,
  koreksihutang_depart: null,
  koreksihutang_reset_month: false,

  pemasukan_no_ref: null,
  pemasukan_ref_month: null,
  pemasukan_ref_year: null,
  pemasukan_depart: null,
  pemasukan_reset_month: false,

  pencairangiromasuk_no_ref: null,
  pencairangiromasuk_ref_month: null,
  pencairangiromasuk_ref_year: null,
  pencairangiromasuk_depart: null,
  pencairangiromasuk_reset_month: false,

  koreksipiutang_no_ref: null,
  koreksipiutang_ref_month: null,
  koreksipiutang_ref_year: null,
  koreksipiutang_depart: null,
  koreksipiutang_reset_month: false,

  mesin_no_ref: null,
  mesin_ref_month: null,
  mesin_ref_year: null,
  mesin_depart: null,
  mesin_reset_month: false,

  formula_no_ref: null,
  formula_ref_month: null,
  formula_ref_year: null,
  formula_depart: null,
  formula_reset_month: false,

  planning_no_ref: null,
  planning_ref_month: null,
  planning_ref_year: null,
  planning_depart: null,
  planning_reset_month: false,

  batch_no_ref: null,
  batch_ref_month: null,
  batch_ref_year: null,
  batch_depart: null,
  batch_reset_month: false,

  penerimaanhasiljadi_no_ref: null,
  penerimaanhasiljadi_ref_month: null,
  penerimaanhasiljadi_ref_year: null,
  penerimaanhasiljadi_depart: null,
  penerimaanhasiljadi_reset_month: false,

  pembebanan_no_ref: null,
  pembebanan_ref_month: null,
  pembebanan_ref_year: null,
  pembebanan_depart: null,
  pembebanan_reset_month: false,
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
    inventory: true,
    memorial: true,
    bankkeluar: false,
    bankmasuk: true,
    produksi: false,
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

  // const getSetup = async (needLoading = true) => {
  //   setLoading(needLoading);
  //   const config = {
  //     ...endpoints.getSetupautonumber,
  //     data: {},
  //   };
  //   console.log(config.data);
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       const { data } = response;

  //       setSetup(data);
  //     } else {
  //       setSetup(set);
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

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
        
        rp_no_ref: data?.rp_no_ref?.id ?? null,
        rp_ref_month: data?.rp_ref_month?.id ?? null,
        rp_ref_year: data?.rp_ref_year?.id ?? null,
        rp_depart: data?.rp_depart?.id ?? null,
        rp_reset_month: data?.rp_reset_month?.id ?? null,

        po_no_ref: data?.po_no_ref?.id ?? null,
        po_ref_month: data?.po_ref_month?.id ?? null,
        po_ref_year: data?.po_ref_year?.id ?? null,
        po_depart: data?.po_depart?.id ?? null,
        po_reset_month: data?.po_reset_month?.id ?? null,

        rp_no_ref: data?.rp_no_ref?.id ?? null,
        rp_ref_month: data?.rp_ref_month?.id ?? null,
        rp_ref_year: data?.rp_ref_year?.id ?? null,
        rp_depart: data?.rp_depart?.id ?? null,
        rp_reset_month: data?.rp_reset_month?.id ?? null,

        rp_no_ref: data?.rp_no_ref?.id ?? null,
        rp_ref_month: data?.rp_ref_month?.id ?? null,
        rp_ref_year: data?.rp_ref_year?.id ?? null,
        rp_depart: data?.rp_depart?.id ?? null,
        rp_reset_month: data?.rp_reset_month?.id ?? null,

        rp_no_ref: data?.rp_no_ref?.id ?? null,
        rp_ref_month: data?.rp_ref_month?.id ?? null,
        rp_ref_year: data?.rp_ref_year?.id ?? null,
        rp_depart: data?.rp_depart?.id ?? null,
        rp_reset_month: data?.rp_reset_month?.id ?? null,

        rp_no_ref: data?.rp_no_ref?.id ?? null,
        rp_ref_month: data?.rp_ref_month?.id ?? null,
        rp_ref_year: data?.rp_ref_year?.id ?? null,
        rp_depart: data?.rp_depart?.id ?? null,
        rp_reset_month: data?.rp_reset_month?.id ?? null,
        
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
        sls: data?.sls?.id ?? null,
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
        fixed_kas: data?.fixed_kas?.id ?? null,
        selisih_kurs: data?.selisih_kurs?.id ?? null,
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
      <div className="col-2">
        {loading ? (
          <>
            <Skeleton width="200px" />
            <Skeleton className="mt-3" height="45px" />
          </>
        ) : (
          <>
            <label className="text-label">{label}</label>
            <div className="p-inputgroup">
              <InputText
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
            <div className="p-inputgroup">
              <InputText
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
            <div className="p-inputgroup">
              <InputText
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
            <div className="p-inputgroup">
              <InputText
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
            <div className="p-inputgroup">
              <InputSwitch
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
            <div className="p-inputgroup">
              <InputSwitch
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
            <div className="p-inputgroup">
              <Button
                value={value}
                options={option && option}
                onChange={onChange}
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

  const renderKas = () => {
    return (
      <CustomAccordion
        tittle={"Kas"}
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
              "Kas Tetap",
              setup && setup.fixed_kas,
              (e) => {
                setSetup({ ...setup, fixed_kas: e.value });
                submitUpdate({ ...setup, fixed_kas: e.value });
              },
              true,
              "d"
            )}
          </Row>
        }
      />
    );
  };

  const renderSelisihKurs = () => {
    return (
      <CustomAccordion
        tittle={"Selisih Currency"}
        defaultActive={false}
        active={accor.selisih}
        onClick={() => {
          setAccor({
            ...accor,
            selisih: !accor.selisih,
          });
        }}
        key={1}
        body={
          <Row className="mr-0 ml-0">
            {renderAccountDropdown(
              "Selisih Currency",
              setup && setup.selisih_kurs,
              (e) => {
                setSetup({ ...setup, selisih_kurs: e.value });
                submitUpdate({ ...setup, selisih_kurs: e.value });
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
              <Row className="mr-0 ml-0">
                {renderAccountDropdown(
                  "Sale Order (SO)",
                  setup && setup.sls_rev,
                  (e) => {
                    setSetup({ ...setup, sls_rev: e.value });
                    submitUpdate({ ...setup, sls_rev: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Sale",
                  setup && setup.sls_prepaid,
                  (e) => {
                    setSetup({ ...setup, sls_prepaid: e.value });
                    submitUpdate({ ...setup, sls_prepaid: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Invoice Sale",
                  setup && setup.sls_disc,
                  (e) => {
                    setSetup({ ...setup, sls_disc: e.value });
                    submitUpdate({ ...setup, sls_disc: e.value });
                  }
                )}

                {renderAccountDropdown(
                  "Faktur sale",
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

  // const renderPurchase = () => {
  //   return (
  //     <CustomAccordion
  //       tittle={"contoh fodang"}
  //       active={accor.rp_auto}
  //       key={1}
  //       defaultActive={true}
  //       onClick={() => {
  //         setAccor({
  //           ...accor,
  //           ar_ap: !accor.ar_ap,
  //         });
  //       }}
  //       body={
  //         <Row className="mr-0 ml-0">
  //           {renderAccountDropdown("Piutang Usaha", setup && setup.ar, (e) => {
  //             setSetup({ ...setup, ar: e.value });
  //             submitUpdate({ ...setup, ar: e.value });
  //           })}

  //           {renderAccountDropdown("Hutang Usaha", setup && setup.ap, (e) => {
  //             setSetup({ ...setup, ap: e.value });
  //             submitUpdate({ ...setup, ap: e.value });
  //           })}
  //         </Row>
  //       }
  //     />
  //   );
  // };

  const renderPersediaan = () => {
    return (
      <CustomAccordion
        tittle={"Persediaan"}
        active={accor.persediaan}
        key={1}
        defaultActive={true}
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
            costing: !accor.costing,
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

  const renderCosting = () => {
    return (
      <CustomAccordion
        tittle={"Costing"}
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
            <div className={"col-12"}>
              {loading ? (
                <>
                  <Skeleton width="200px" />
                  <Skeleton className="mt-3" height="45px" />
                </>
              ) : (
                <>
                  <label className="text-label">Jenis Costing</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={setup && setup?.costing}
                      options={[
                        { code: 1, name: "Standard Costing" },
                        { code: 2, name: "Prepectual Costing" },
                      ]}
                      onChange={(e) => {
                        setSetup({ ...setup, costing: e.value });
                      }}
                      optionLabel={(option) => (
                        <div>{option !== null ? `${option.name}` : ""}</div>
                      )}
                      filter
                      filterBy="name"
                      placeholder="Pilih Jenis Costing"
                      itemTemplate={(option) => (
                        <div>{option !== null ? `${option.name}` : ""}</div>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
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
          {/* {renderPurchase()} */}
          {renderPenjualan()}
          {renderPersediaan()}
        </Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">
          {renderLabaRugi()}
          {renderPembelian()}
          {renderOthers()}
          {renderCosting()}
          {renderSelisihKurs()}
          {renderKas()}
        </Col>
      </Row>
    </>
  );
};

export default SetupAkun;
