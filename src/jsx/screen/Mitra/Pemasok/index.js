import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataSupplier from "./DataPemasok";
import CircleProgress from "src/jsx/components/CircleProgress/circleProgress";
import CustomCardMitra from "src/jsx/components/CustomCardChart/CustomCardMitra";

const data = {
  supplier: {
    id: null,
    sup_code: null,
    sup_name: null,
    sup_jpem: null,
    sup_ppn: null,
    sup_npwp: null,
    sup_address: null,
    sup_kota: null,
    sup_kpos: null,
    sup_pkp: null,
    sup_maklon: null,
    sup_telp1: null,
    sup_telp2: null,
    sup_fax: null,
    sup_cp: null,
    sup_curren: null,
    sup_ket: null,
    sup_hutang: null,
    sup_uang_muka: null,
    sup_limit: null,
    sup_serialnumber: null,
  },

  currency: {
    id: 0,
    code: "",
    name: "",
  },

  jenisPemasok: {
    id: 1,
    jpem_code: "",
    jpem_name: "",
    jpem_ket: "",
  },

  city: {
    city_id: 0,
    province_id: 0,
    province: "",
    type: "",
    city_name: "",
    postal_code: 0,
  },
};

const Supplier = ({ edit, del }) => {
  const [supplier, setSupplier] = useState(null);
  const [ap, setAp] = useState(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSupplier();
    getAP();
  }, []);
  

  const getSupplier = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.supplier,
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
        setSupplier(data);
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

  const getAP = async () => {
    const config = {
      ...endpoints.apcard,
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
        setAp(data);
      }
    } catch (error) {}
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const getHutangBJT = () => {
    let jt = 0;
    ap?.forEach((element) => {
      let due = new Date(`${element?.ord_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jt += diff <= 0 ? element.trx_amnh : 0;
    });
    console.log("cek");
    console.log(jt);
    return jt;
  };

  const getHutangJTt = () => {
    let jtt = 0;
    ap?.forEach((element) => {
      let due = new Date(`${element?.ord_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jtt += diff > 30 ? element.trx_amnh : 0;
    });
    return jtt;
  };

  const getHutangJT = () => {
    let jte = 0;
    ap?.forEach((element) => {
      let due = new Date(`${element?.ord_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jte += diff > 60 ? element.trx_amnh : 0;
    });
    return jte;
  };

  const getTotal = () => {
    let total = 0;
    ap?.forEach((element) => {
      total += element.trx_amnh;

      // console.log("cek");
      // console.log(total);
    });
    return total;
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
      <Row>
        <CustomCardMitra
          tittle={"Lebih Dari 30 Hari"}
          subTittle={"Hutang Jatuh Tempo"}
          saldo={getHutangJTt()}
        />

        <CustomCardMitra
          tittle={"Lebih Dari 60 Hari"}
          subTittle={"Hutang Jatuh Tempo"}
          saldo={getHutangJT()}
        />

        <CustomCardMitra
          tittle={"Belum Jatuh Tempo"}
          subTittle={"Hutang"}
          saldo={getHutangBJT()}
        />

        <CustomCardMitra
          tittle={"Total Hutang Seluruhnya"}
          subTittle={"Total Hutang"}
          saldo={getTotal()}
        />
      </Row>

      <Col>
        <Card>
          <Card.Body>
            <DataSupplier
              data={loading ? dummy : supplier}
              load={loading}
              onSuccessInput={() => getSupplier()}
              edit={edit}
              del={del}
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default Supplier;
