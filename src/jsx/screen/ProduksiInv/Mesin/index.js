import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SET_MSN } from "src/redux/actions";
import DataMesin from "./DataMesin";

const data = {
  id: null,
  msn_code: null,
  msn_name: null,
  desc: null,
};

const Mesin = () => {
  const msn = useSelector((state) => state.msn.msn);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getMesin();
  }, []);

  const getMesin = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.mesin,
      data: msn,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        dispatch({ type: SET_MSN, payload: data });
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
              <DataMesin
                data={loading ? dummy : msn}
                load={loading}
                onSuccessInput={() => getMesin()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Mesin;
