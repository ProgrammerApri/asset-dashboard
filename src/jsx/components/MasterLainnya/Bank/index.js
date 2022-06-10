import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataBank from "./DataBank";

const data = {
  bank: {
    id: 1,
    BANK_CODE: "",
    BANK_NAME: "",
    BANK_DESC: "",
    acc_id: 0,
    user_entry: 0,
    user_edit: null,
    entry_date: "",
    edit_date: "",
  },

  account: {
    id: 0,
    acc_code: "",
    acc_name: "",
    umm_code: null,
    kat_code: 0,
    dou_type: "",
    sld_type: "",
    connect: true,
    sld_awal: 0,
  },
};

const Bank = () => {
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getBank();
  }, []);

  const getBank = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.bank,
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
        setBank(data);
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

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataBank
                data={loading ? dummy : bank}
                load={loading}
                onSuccessInput={() => getBank()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Bank;
