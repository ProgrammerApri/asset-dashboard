import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { endpoints, request } from "src/utils";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";

const set = {
  id: null,
  cp_id: null,
  pur: null,
  pur_discount: null,
  pur_shipping: null,
  pur_retur: null,
  hpp: null,
  sto: null,
};

const SetupSaldoAkhir = () => {
  const toast = useRef(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(null);
  const [setupAcc, setSetupAcc] = useState(null);
  const [available, setAvailable] = useState(false);
  const [jenis, setJenis] = useState(null);
  const [accor, setAccor] = useState({
    saldoAkhir: true,
  });

  useEffect(() => {
    getCompany();
    getSetupAcc();
  }, []);

  const getAccount = async (sacc) => {
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
        let st = [];
        data.forEach((el) => {
          acc.push(el.account);

          if (
            sacc?.sto?.acc_code === el.account.umm_code &&
            el.account.dou_type === "D"
          ) {
            st.push({
              sto: el.account,
              pur: null,
              pur_shipping: null,
              pur_retur: null,
              pur_discount: null,
              hpp: null,
            });
          }
        });
        getSetup(true, st);
        // console.log("============");
        // console.log(st);
        // setSetup(st)
        setAccount(acc);
      }
    } catch (error) {}
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

        setJenis(response.data.comp_type);
      }
    } catch (error) {
      setAvailable(false);
    }
  };

  const getSetup = async (needLoading = true, st) => {
    setLoading(needLoading);
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
        let temp = st;
        data?.forEach((element) => {
          temp.forEach((elem) => {
            if (elem.sto.id === element.sto.id) {
              elem.id = element.id;
              elem.pur = element.pur;
              elem.pur_shipping = element.pur_shipping;
              elem.pur_retur = element.pur_retur;
              elem.pur_discount = element.pur_discount;
              elem.hpp = element.hpp;
            }
          });
        });

        setSetup(temp);
      }
      setLoading(false);
    } catch (error) {
      console.log("errorr" + error);
      setLoading(false);
    }
  };

  const getSetupAcc = async (needLoading = true) => {
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

        setSetupAcc(data);

        getAccount(data);
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
      ...endpoints.addSetupSa,
      data: {
        sto: data?.sto?.id ?? null,
        pur: data?.pur?.id ?? null,
        pur_discount: data?.pur_discount?.id ?? null,
        pur_shipping: data?.pur_shipping?.id ?? null,
        pur_retur: data?.pur_retur?.id ?? null,
        hpp: data?.hpp?.id ?? null,
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

    getSetup(true, setup);
  };

  const editSetup = async (data) => {
    let config = {
      ...endpoints.editSetupSa,
      endpoint: endpoints.editSetupSa.endpoint + data.id,
      data: {
        sto: data?.sto?.id ?? null,
        pur: data?.pur?.id ?? null,
        pur_discount: data?.pur_discount?.id ?? null,
        pur_shipping: data?.pur_shipping?.id ?? null,
        pur_retur: data?.pur_retur?.id ?? null,
        hpp: data?.hpp?.id ?? null,
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

    getSetup(true, setup);
  };

  const submitUpdate = (data) => {
    if (available) {
      if (data?.id) {
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
    type = "all",
    disabled = false,
    clear = false
  ) => {
    let option = [];
    if (type === "sto") {
      account?.forEach((el) => {
        if (setupAcc?.sto?.acc_code === el.umm_code) {
          if (el.dou_type === "D") {
            option.push(el);
          }
        }
      });
    } else if (type === "pur") {
      account?.forEach((el) => {
        if (setupAcc?.pur?.acc_code === el.umm_code) {
          if (el.dou_type === "D") {
            option.push(el);
          }
        }
      });
    } else if (type === "pur_ship") {
      account?.forEach((el) => {
        if (setupAcc?.pur_shipping?.acc_code === el.umm_code) {
          if (el.dou_type === "D") {
            option.push(el);
          }
        }
      });
    } else if (type === "pur_ret") {
      account?.forEach((el) => {
        if (setupAcc?.pur_retur?.acc_code === el.umm_code) {
          if (el.dou_type === "D") {
            option.push(el);
          }
        }
      });
    } else if (type === "pur_dis") {
      account?.forEach((el) => {
        if (setupAcc?.pur_discount?.acc_code === el.umm_code) {
          if (el.dou_type === "D") {
            option.push(el);
          }
        }
      });
    } else if (type === "hpp") {
      account?.forEach((el) => {
        if (setupAcc?.hpp?.acc_code === el.umm_code) {
          if (el.dou_type === "D") {
            option.push(el);
          }
        }
      });
    } else {
      option = account;
    }
    return (
      <div className={`${expanded ? "col-2" : "col-6"} mb-2`}>
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
                type={type}
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
                disabled={disabled}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSetupSaldo = () => {
    return (
      <CustomAccordion
        tittle={"Setup Saldo Akhir"}
        active={accor.saldoAkhir}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            saldoAkhir: !accor.saldoAkhir,
          });
        }}
        body={setup?.map((val, i) => {
          // console.log("========");
          // console.log(val);
          return (
            <Row className="mr-0 ml-0">
              {renderAccountDropdown(
                "Persediaan",
                val.sto,
                (e) => {
                  setSetup({ ...setup, sto: e.value });
                  submitUpdate({ ...setup, sto: e.value });
                },
                true,
                "sto",
                true
              )}
              {renderAccountDropdown(
                "Pembelian",
                val?.pur,
                (e) => {
                  let temp = setup;
                  temp[i].pur = e.value;
                  setSetup(temp);
                  submitUpdate(temp[i]);
                },
                true,
                "pur",
                false,
                true
              )}
              {renderAccountDropdown(
                "Beban Angkut Pembelian",
                val?.pur_shipping,
                (e) => {
                  let temp = setup;
                  temp[i].pur_shipping = e.value;
                  setSetup(temp);
                  submitUpdate(temp[i]);
                },
                true,
                "pur_ship"
              )}
              {renderAccountDropdown(
                "Retur Pembelian",
                val?.pur_retur,
                (e) => {
                  let temp = setup;
                  temp[i].pur_retur = e.value;
                  setSetup(temp);
                  submitUpdate(temp[i]);
                },
                true,
                "pur_ret"
              )}
              {renderAccountDropdown(
                "Potongan Pembelian",
                val?.pur_discount,
                (e) => {
                  let temp = setup;
                  temp[i].pur_discount = e.value;
                  setSetup(temp);
                  submitUpdate(temp[i]);
                },
                true,
                "pur_dis"
              )}
              {renderAccountDropdown(
                "Harga Pokok Pembelian",
                val?.hpp,
                (e) => {
                  let temp = setup;
                  temp[i].hpp = e.value;
                  setSetup(temp);
                  submitUpdate(temp[i]);
                },
                true,
                "hpp"
              )}
            </Row>
          );
        })}
      />
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-lg-12 col-sm-2 col-xs-12">{renderSetupSaldo()}</Col>
      </Row>
    </>
  );
};

export default SetupSaldoAkhir;
