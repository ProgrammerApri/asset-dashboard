import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SET_MSN, SET_WC } from "src/redux/actions";
import DataWorkCenter from "./DataWorkCenter";

const data = {
  id: null,
  work_code: null,
  work_name: null,
  loc_id: null,
  machine_id: null,
  work_type: null,
  work_sdm: null,
  work_estimasi: null,
  ovh_estimasi: null,
  biaya_estimasi: null,
  desc: null,
};

const WorkCenter = ({trigger}) => {
  const work_list = useSelector((state) => state.wc.wc);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getWorkCenter();
  }, []);

  const getWorkCenter = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.work_center,
      data: work_list,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        dispatch({ type: SET_WC, payload: data });
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
              <DataWorkCenter
                data={loading ? dummy : work_list}
                load={loading}
                onSuccessInput={() => getWorkCenter()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WorkCenter;
