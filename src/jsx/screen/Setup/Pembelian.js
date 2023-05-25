import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { InputSwitch } from "primereact/inputswitch";
import { endpoints, request } from "src/utils";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { SET_USER } from "src/redux/actions";
import { useDispatch, useSelector } from "react-redux";

const data = {
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
  rp1: null,
  rp2: null,
  rp3: null,
  po1: null,
  po2: null,
  po3: null,
  gra1: null,
  gra2: null,
  gra3: null,
};

const Pembelian = () => {
  const toast = useRef(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accor, setAccor] = useState({
    main: true,
    rp: true,
    po: true,
    gra: true,
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    getCompany();
    getUser();
  }, []);

  const getUser = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getUser,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        dispatch({
          type: SET_USER,
          payload: data.filter((v) => v.previlage?.approver),
        });
        setLoading(false);
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

  const getCompany = async (needLoading = true) => {
    if (needLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
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
          setCurrentData(data);
        } else {
          setCurrentData(response.data);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const postCompany = async (logo, isUpdate = false, data) => {
    let config = {};
    if (isUpdate) {
      if (data) {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData.id,
          data: data,
        };
      } else {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData.id,
          data: {
            ...currentData,
            cp_logo: logo !== "" ? logo : currentData.cp_logo,
          },
        };
      }
    } else {
      if (data) {
        config = {
          ...endpoints.addCompany,
          data: data,
        };
      } else {
        config = {
          ...endpoints.addCompany,
          data: { ...currentData, cp_logo: logo },
        };
      }
    }
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        getCompany(false);
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
  };

  const submitUpdate = (data) => {
    if (currentData.id === 0) {
      postCompany("", data);
    } else {
      postCompany("", true, data);
    }
  };

  const checkUser = (value) => {
    let selected = null;
    user?.forEach((element) => {
      if (element.id === value) {
        selected = element;
      }
    });

    return selected;
  };

  const renderLoading = (width) => {
    return (
      <div className="d-flex col-12 align-items-center">
        <Skeleton
          className="mr-3"
          height="30px"
          width="50px"
          borderRadius="20px"
        />
        <Skeleton className="mr-3" width={width ? width : "250px"} />
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <Accordion className="acordion" defaultActiveKey="0">
        <div className="accordion__item" key={1}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.main ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                main: !accor.main,
              });
            }}
          >
            <span className="accordion__header--text">
              Pengaturan Pembelian
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              {loading ? (
                <>
                  {renderLoading()}
                  {renderLoading("400px")}
                </>
              ) : (
                <>
                  <div className="d-flex col-12 align-items-center">
                    <InputSwitch
                      className="mr-3"
                      inputId="email"
                      checked={currentData && currentData.rp}
                      onChange={(e) => {
                        setCurrentData({ ...currentData, rp: e.value });
                        submitUpdate({ ...currentData, rp: e.value });
                      }}
                    />
                    <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label>
                  </div>

                  <div className="d-flex col-12 align-items-center">
                    <InputSwitch
                      className="mr-3"
                      inputId="email"
                      checked={currentData && currentData.over_po}
                      onChange={(e) => {
                        setCurrentData({ ...currentData, over_po: e.value });
                        submitUpdate({ ...currentData, over_po: e.value });
                      }}
                    />
                    <label className="mr-3 mt-1" htmlFor="email">
                      {"Pembelian barang boleh melebihi PO"}
                    </label>
                  </div>
                </>
              )}
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderApprovalRp = () => {
    return (
      <CustomAccordion
        tittle={"Approval Request Purchase (RP)"}
        active={accor.rp}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            rp: !accor.rp,
          });
        }}
        body={
          <Row>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 1"}
                value={currentData?.rp1 ? checkUser(currentData?.rp1) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, rp1: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 2"}
                value={currentData?.rp2 ? checkUser(currentData?.rp2) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, rp2: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 3"}
                value={currentData?.rp3 ? checkUser(currentData?.rp3) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, rp3: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
          </Row>
        }
      />
    );
  };

  const renderApprovalPo = () => {
    return (
      <CustomAccordion
        tittle={"Approval Purchase Order (PO)"}
        active={accor.po}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            po: !accor.po,
          });
        }}
        body={
          <Row>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 1"}
                value={currentData?.po1 ? checkUser(currentData?.po1) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, po1: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 2"}
                value={currentData?.po2 ? checkUser(currentData?.po2) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, po2: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 3"}
                value={currentData?.po3 ? checkUser(currentData?.po3) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, po3: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
          </Row>
        }
      />
    );
  };

  const renderApprovalGra = () => {
    return (
      <CustomAccordion
        tittle={"Approval Pembelian (GRA)"}
        active={accor.gra}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            gra: !accor.gra,
          });
        }}
        body={
          <Row>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 1"}
                value={currentData?.gra1 ? checkUser(currentData?.gra1) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, gra1: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 2"}
                value={currentData?.gra2 ? checkUser(currentData?.gra2) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, gra2: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 3"}
                value={currentData?.gra3 ? checkUser(currentData?.gra3) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, gra3: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
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
        <Col className="col-lg-12 col-sm-12 col-xs-12 pb-0">
          {renderSettings()}
        </Col>
        <Col className="col-lg-6 col-sm-12 col-xs-12">
          <div className="row">
            <div className="col-12">
              {renderApprovalRp()}
              {renderApprovalGra()}
            </div>
          </div>
        </Col>
        <Col className="col-lg-6 col-sm-12 col-xs-12">
          <div className="row">
            <div className="col-12">{renderApprovalPo()}</div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Pembelian;
