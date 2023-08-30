import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataCustomer from "./DataCustomer";
import CircleProgress from "src/jsx/components/CircleProgress/circleProgress";
import CustomCardMitra from "src/jsx/components/CustomCardChart/CustomCardMitra";

const data = {
  customer: {
    id: null,
    cus_code: null,
    cus_name: null,
    cus_jpel: null,
    cus_sub_area: null,
    cus_npwp: null,
    cus_address: null,
    cus_kota: null,
    cus_kpos: null,
    cus_telp1: null,
    cus_telp2: null,
    cus_email: null,
    cus_kode_country: null,
    cus_country: null,
    cus_fax: null,
    cus_cp: null,
    cus_curren: null,
    cus_pjk: null,
    cus_ket: null,
    cus_gl: null,
    cus_uang_muka: null,
    cus_limit: null,
    sub_cus: false,
    cus_id: null,
  },

  jpel: {
    id: null,
    jpel_code: "",
    jpel_name: "",
    jpel_ket: "",
  },

  subArea: {
    id: null,
    sub_code: "",
    sub_area_code: "",
    sub_name: "",
    sub_ket: "",
  },

  currency: {
    id: null,
    code: "",
    name: "",
  },
};

const pajak = [
  { name: "Include", code: "I" },
  { name: "Exclude", code: "E" },
  { name: "Non PPN", code: "N" },
];

const Customer = ({ edit, del }) => {
  const [customer, setCustomer] = useState(null);
  const [ar, setAr] = useState(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [nonSub, setNonSub] = useState(true);
  const [lastSerialNumber, setLastSerialNumber] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getCustomer();
    getAR();
  }, []);

  const getCustomer = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.customer,
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
        setCustomer(data);
        let non = [];
        data.forEach((el) => {
          if (!el.customer.sub_cus) {
            non.push(el);
          }
        });
        setNonSub(non);
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

  const getAR = async () => {
    const config = {
      ...endpoints.arcard,
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
          if (element.trx_type === "JL" && element.pay_type === "P1") {
            filt.push(element);
          }
        });
        setAr(filt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPiutangBJT = () => {
    let jt = 0;
    ar?.forEach((element) => {
      let due = new Date(`${element?.trx_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jt += diff <= 0 ? element.trx_amnh : 0;
    });
    return jt;
  };

  const getPiutangJTt = () => {
    let jtt = 0;
    ar?.forEach((element) => {
      let due = new Date(`${element?.trx_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jtt += diff > 30 ? element.trx_amnh : 0;
    });
    return jtt;
  };

  const getPiutangJT = () => {
    let jte = 0;
    ar?.forEach((element) => {
      let due = new Date(`${element?.trx_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jte += diff > 60 ? element.trx_amnh : 0;
    });
    return jte;
  };

  const getTotal = () => {
    let total = 0;
    ar?.forEach((element) => {
      total += element.trx_amnh;

      // console.log("cek");
      // console.log(total);
    });
    return total;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <>
      <Row>
        <CustomCardMitra
          tittle={"Lebih Dari 30 Hari"}
          subTittle={"Piutang Jatuh Tempo"}
          saldo={getPiutangJTt()}
        />

        <CustomCardMitra
          tittle={"Lebih Dari 60 Hari"}
          subTittle={"Piutang Jatuh Tempo"}
          saldo={getPiutangJT()}
        />

        <CustomCardMitra
          tittle={"Belum Jatuh Tempo"}
          subTittle={"Piutang"}
          saldo={getPiutangBJT()}
        />

        <CustomCardMitra
          tittle={"Total Piutang Seluruhnya"}
          subTittle={"Total Piutang"}
          saldo={getTotal()}
        />
      </Row>

      <Col>
        <Card>
          <Card.Body>
            <DataCustomer
              data={loading ? dummy : customer}
              load={loading}
              onSuccessInput={() => getCustomer()}
              edit={edit}
              del={del}
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default Customer;
