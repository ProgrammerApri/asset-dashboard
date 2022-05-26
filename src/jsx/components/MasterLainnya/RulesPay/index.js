import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Toast } from "primereact/toast";
import DataRulesPay from "./DataRulesPay";

const data = {
  id: 1,
  name: "",
  day: 0,
  ket: "",
};

const RulesPay = () => {
  const [rulesPay, setRulesPay] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getRulesPay();
  }, []);

  const getRulesPay = async (isUpdate) => {
    setLoading(true);
    const config = {
      ...endpoints.rules_pay,
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
        setRulesPay(data);
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
    <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataRulesPay
                data={loading ? dummy : rulesPay}
                load={loading}
                onSuccessInput={() => getRulesPay()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RulesPay;
