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
import { useDispatch } from "react-redux";
import { SET_CURRENT_RP_AUTO } from "src/redux/actions";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { tr } from "src/data/tr";

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
  const [prefix, setPrefix] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(null);
  const dispatch = useDispatch();
  const [available, setAvailable] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [middle, setMiddle] = useState(new Date().getMonth() + 1);
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
    getCompany();
  }, []);

  // const getAccount = async () => {
  //   setLoading(true);
  //   const config = {
  //     ...endpoints.account,
  //     data: {},
  //   };
  //   console.log(config.data);
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       const { data } = response;
  //       let acc = [];
  //       data.forEach((el) => {
  //         acc.push(el.account);
  //       });
  //       setAccount(acc);
  //     }
  //   } catch (error) {}

  //   getCompany();
  // };

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
          // setAvailable(false);
        } else {
          // setAvailable(true);
        }
      }
    } catch (error) {
      // setAvailable(false);
    }

    getSetup();
  };

  const getSetup = async (needLoading = true) => {
    setLoading(needLoading);
    const config = {
      ...endpoints.getSetupautonumber,
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

  // const postCompany = async (data) => {
  //   let config = {
  //     ...endpoints.addCompany,
  //     data: {
  //       id: 0,
  //       cp_name: "",
  //       cp_addr: "",
  //       cp_ship_addr: "",
  //       cp_telp: "",
  //       cp_webs: "",
  //       cp_email: "",
  //       cp_npwp: "",
  //       cp_coper: "",
  //       cp_logo: "",
  //       multi_currency: false,
  //       appr_po: false,
  //       appr_payment: false,
  //       over_stock: false,
  //       discount: false,
  //       tiered: false,
  //       rp: false,
  //       over_po: false,
  //     },
  //   };
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       addSetup(data);
  //     }
  //   } catch (error) {}
  // };

  const addSetup = async (data) => {
    let config = {
      ...endpoints.addSetupautonumber,
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

        gr_no_ref: data?.gr_no_ref?.id ?? null,
        gr_ref_month: data?.gr_ref_month?.id ?? null,
        gr_ref_year: data?.gr_ref_year?.id ?? null,
        gr_depart: data?.gr_depart?.id ?? null,
        gr_reset_month: data?.gr_reset_month?.id ?? null,

        pi_no_ref: data?.pi_no_ref?.id ?? null,
        pi_ref_month: data?.pi_ref_month?.id ?? null,
        pi_ref_year: data?.pi_ref_year?.id ?? null,
        pi_depart: data?.pi_depart?.id ?? null,
        pi_reset_month: data?.pi_reset_month?.id ?? null,

        pr_no_ref: data?.pr_no_ref?.id ?? null,
        pr_ref_month: data?.pr_ref_month?.id ?? null,
        pr_ref_year: data?.pr_ref_year?.id ?? null,
        pr_deprart: data?.pr_deprart?.id ?? null,
        pr_reset_month: data?.pr_reset_month?.id ?? null,

        so_no_ref: data?.so_no_ref?.id ?? null,
        so_ref_month: data?.so_ref_month?.id ?? null,
        so_ref_year: data?.so_ref_year?.id ?? null,
        so_depart: data?.so_depart?.id ?? null,
        so_reset_month: data?.so_reset_month?.id ?? null,

        sl_no_ref: data?.sl_no_ref?.id ?? null,
        sl_ref_month: data?.sl_ref_month?.id ?? null,
        sl_ref_year: data?.sl_ref_year?.id ?? null,
        sl_depart: data?.sl_depart?.id ?? null,
        sl_reset_month: data?.sl_reset_month?.id ?? null,

        ip_no_ref: data?.ip_no_ref?.id ?? null,
        ip_ref_month: data?.ip_ref_month?.id ?? null,
        ip_ref_year: data?.ip_ref_year?.id ?? null,
        ip_depart: data?.ip_depart?.id ?? null,
        ip_reset_month: data?.ip_reset_month?.id ?? null,

        fp_no_ref: data?.fp_no_ref?.id ?? null,
        fp_ref_month: data?.fp_ref_month?.id ?? null,
        fp_ref_year: data?.fp_ref_year?.id ?? null,
        fp_depart: data?.fp_depart?.id ?? null,
        fp_reset_month: data?.fp_reset_month?.id ?? null,

        rpen_no_ref: data?.rpen_no_ref?.id ?? null,
        rpen_ref_month: data?.rpen_ref_month?.id ?? null,
        rpen_ref_year: data?.rpen_ref_year?.id ?? null,
        rpen_depart: data?.rpen_depart?.id ?? null,
        rpen_reset_month: data?.rpen_reset_month?.id ?? null,
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
      ...endpoints.editSetupautonumber,
      endpoint: endpoints.editSetupautonumber.endpoint + data.id,
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

        gr_no_ref: data?.gr_no_ref?.id ?? null,
        gr_ref_month: data?.gr_ref_month?.id ?? null,
        gr_ref_year: data?.gr_ref_year?.id ?? null,
        gr_depart: data?.gr_depart?.id ?? null,
        gr_reset_month: data?.gr_reset_month?.id ?? null,

        pi_no_ref: data?.pi_no_ref?.id ?? null,
        pi_ref_month: data?.pi_ref_month?.id ?? null,
        pi_ref_year: data?.pi_ref_year?.id ?? null,
        pi_depart: data?.pi_depart?.id ?? null,
        pi_reset_month: data?.pi_reset_month?.id ?? null,

        pr_no_ref: data?.pr_no_ref?.id ?? null,
        pr_ref_month: data?.pr_ref_month?.id ?? null,
        pr_ref_year: data?.pr_ref_year?.id ?? null,
        pr_deprart: data?.pr_deprart?.id ?? null,
        pr_reset_month: data?.pr_reset_month?.id ?? null,

        so_no_ref: data?.so_no_ref?.id ?? null,
        so_ref_month: data?.so_ref_month?.id ?? null,
        so_ref_year: data?.so_ref_year?.id ?? null,
        so_depart: data?.so_depart?.id ?? null,
        so_reset_month: data?.so_reset_month?.id ?? null,

        sl_no_ref: data?.sl_no_ref?.id ?? null,
        sl_ref_month: data?.sl_ref_month?.id ?? null,
        sl_ref_year: data?.sl_ref_year?.id ?? null,
        sl_depart: data?.sl_depart?.id ?? null,
        sl_reset_month: data?.sl_reset_month?.id ?? null,

        ip_no_ref: data?.ip_no_ref?.id ?? null,
        ip_ref_month: data?.ip_ref_month?.id ?? null,
        ip_ref_year: data?.ip_ref_year?.id ?? null,
        ip_depart: data?.ip_depart?.id ?? null,
        ip_reset_month: data?.ip_reset_month?.id ?? null,

        fp_no_ref: data?.fp_no_ref?.id ?? null,
        fp_ref_month: data?.fp_ref_month?.id ?? null,
        fp_ref_year: data?.fp_ref_year?.id ?? null,
        fp_depart: data?.fp_depart?.id ?? null,
        fp_reset_month: data?.fp_reset_month?.id ?? null,

        rpen_no_ref: data?.rpen_no_ref?.id ?? null,
        rpen_ref_month: data?.rpen_ref_month?.id ?? null,
        rpen_ref_year: data?.rpen_ref_year?.id ?? null,
        rpen_depart: data?.rpen_depart?.id ?? null,
        rpen_reset_month: data?.rpen_reset_month?.id ?? null,
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
    // if (available) {
      // if (data?.id) {
        // editSetup(data);
        addSetup(data);
      // } else {
        
      // }
    // } else {
    //   // postCompany(data);
    // }
  };

  const renderInputtext = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-3">
        {/* Kode yang sebelumnya untuk loading telah dihapus untuk kesederhanaan contoh */}
        <>
          <label className="text-label">{label}</label>
          <div className=" col-2">
            <InputText
              value={value}
              onChange={onChange}
              placeholder="Masukkan Disini"
            />
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
              value={value}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <InputSwitch
              // checked={resbulan}
              onChange={(e) => {
                // setResbulan(e.value);
                setAccor({ ...accor, resbulan: e.value });
              }}
            />
            <InputSwitch
              // checked={resbulan}
              onChange={(e) => {
                // setResbulan(e.value);
                setAccor({ ...accor, resbulan: e.value });
              }}
            />
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                submitUpdate();
              }}
              autoFocus
              loading={loading}
            />
          </div>
          {/* Komponen InputText lainnya bisa ditambahkan sesuai kebutuhan */}
        </>
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
            {/* {renderInputtext(
              "Aset Tetap",
              // setup.fixed_assets,
              // (e) => {
              //   setSetup({ ...setup, fixed_assets: e.value });
              //   submitUpdate({ ...setup, fixed_assets: e.value });
              },
              true,
              "d"
            )} */}
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
            {/* {renderInputtext(
              "Kas Tetap",
              setup.fixed_kas,
              (e) => {
                setSetup({ ...setup, fixed_kas: e.value });
                submitUpdate({ ...setup, fixed_kas: e.value });
              },
              true,
              "d"
            )} */}
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
            {/* {renderInputtext(
              "Selisih Currency",
              setup.selisih_kurs,
              (e) => {
                setSetup({ ...setup, selisih_kurs: e.value });
                submitUpdate({ ...setup, selisih_kurs: e.value });
              },
              true,
              "d"
            )} */}
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
                {renderInputtext(
                  "Sale Order (SO)",
                  setup?.so_no_ref,
                  (e) => {
                    setSetup({ ...setup, so_no_ref: e.target.value });
                    submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}

                {/* {renderInputtext(
                  "Sale",
                  setup.sls_prepaid,
                  (e) => {
                    setSetup({ ...setup, sls_prepaid: e.value });
                    submitUpdate({ ...setup, sls_prepaid: e.value });
                  }
                )}

                {renderInputtext(
                  "Invoice Sale",
                  setup.sls_disc,
                  (e) => {
                    setSetup({ ...setup, sls_disc: e.value });
                    submitUpdate({ ...setup, sls_disc: e.value });
                  }
                )}

                {renderInputtext(
                  "Faktur sale",
                  setup.sls_unbill,
                  (e) => {
                    setSetup({ ...setup, sls_unbill: e.value });
                    submitUpdate({ ...setup, sls_unbill: e.value });
                  }
                )}

                {renderInputtext(
                  "Retur Penjualan",
                  setup.sls_retur,
                  (e) => {
                    setSetup({ ...setup, sls_retur: e.value });
                    submitUpdate({ ...setup, sls_retur: e.value });
                  }
                )} */}
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
                {/* {renderInputtext(
                  "Pembelian (COGS)",
                  setup.pur_cogs,
                  (e) => {
                    setSetup({ ...setup, pur_cogs: e.value });
                    submitUpdate({ ...setup, pur_cogs: e.value });
                  }
                )}

                {renderInputtext(
                  "Pembelian Belum Ditagih",
                  setup.pur_unbill,
                  (e) => {
                    setSetup({ ...setup, pur_unbill: e.value });
                    submitUpdate({ ...setup, pur_unbill: e.value });
                  }
                )}

                {renderInputtext(
                  "Pengiriman Pembelian",
                  setup.pur_shipping,
                  (e) => {
                    setSetup({ ...setup, pur_shipping: e.value });
                    submitUpdate({ ...setup, pur_shipping: e.value });
                  }
                )}

                {renderInputtext(
                  "Pajak Pembelian",
                  setup.pur_tax,
                  (e) => {
                    setSetup({ ...setup, pur_tax: e.value });
                    submitUpdate({ ...setup, pur_tax: e.value });
                  }
                )}

                {renderInputtext(
                  "Uang Muka Pembelian",
                  setup.pur_advance,
                  (e) => {
                    setSetup({ ...setup, pur_advance: e.value });
                    submitUpdate({ ...setup, pur_advance: e.value });
                  }
                )} */}
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
  //       active={accor.setup}
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
  //           {renderInputtext("Piutang Usaha", setup.ar, (e) => {
  //             setSetup({ ...setup, ar: e.value });
  //             submitUpdate({ ...setup, ar: e.value });
  //           })}

  //           {renderInputtext("Hutang Usaha", setup.ap, (e) => {
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
            {/* {renderInputtext("Persediaan", setup.sto, (e) => {
              setSetup({ ...setup, sto: e.value });
              submitUpdate({ ...setup, sto: e.value });
            })} */}
            {/* {renderInputtext(
              "Persediaan - Akun Umum",
              setup.sto_general,
              (e) => {
                setSetup({ ...setup, sto_general: e.value });
                submitUpdate({ ...setup, sto_general: e.value });
              }
            )}

            {renderInputtext(
              "Persediaan Rusak",
              setup.sto_broken,
              (e) => {
                setSetup({ ...setup, sto_broken: e.value });
                submitUpdate({ ...setup, sto_broken: e.value });
              }
            )}

            {renderInputtext(
              "Persediaan Produksi",
              setup.sto_production,
              (e) => {
                setSetup({ ...setup, sto_production: e.value });
                submitUpdate({ ...setup, sto_production: e.value });
              }
            )}

            {renderInputtext(
              "Persediaan Selisih HPP",
              setup.sto_hpp_diff,
              (e) => {
                setSetup({ ...setup, sto_hpp_diff: e.value });
                submitUpdate({ ...setup, sto_hpp_diff: e.value });
              }
            )}

            {renderInputtext(
              "Persediaan WIP - Akun Umum",
              setup.sto_wip,
              (e) => {
                setSetup({ ...setup, sto_wip: e.value });
                submitUpdate({ ...setup, sto_wip: e.value });
              }
            )}

            {renderInputtext(
              "Persediaan Bahan Baku",
              setup.sto_bb,
              (e) => {
                setSetup({ ...setup, sto_bb: e.value });
                submitUpdate({ ...setup, sto_bb: e.value });
              }
            )}

            {renderInputtext(
              "Persediaan Bahan Baku Pembantu",
              setup.sto_bbp,
              (e) => {
                setSetup({ ...setup, sto_bbp: e.value });
                submitUpdate({ ...setup, sto_bbp: e.value });
              }
            )} */}
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
            {/* {renderInputtext(
              "Laba Rugi Berjalan",
              setup.pnl,
              (e) => {
                setSetup({ ...setup, pnl: e.value });
                submitUpdate({ ...setup, pnl: e.value });
              }
            )}

            {renderInputtext(
              "Laba Rugi Tahun Berjalan",
              setup.pnl_year,
              (e) => {
                setSetup({ ...setup, pnl_year: e.value });
                submitUpdate({ ...setup, pnl_year: e.value });
              }
            )}

            {renderInputtext(
              "Laba Rugi Ditahan",
              setup.rtn_income,
              (e) => {
                setSetup({ ...setup, rtn_income: e.value });
                submitUpdate({ ...setup, rtn_income: e.value });
              }
            )} */}
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
                      value={setup?.costing}
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
