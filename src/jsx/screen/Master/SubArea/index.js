import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataSubArea from "./SubArea";

const data = {
  subArea: {
    id: 1,
    sub_code: "",
    sub_area_code: "",
    sub_name: "",
    sub_ket: "",
  },
  areaPen: {
    id: 0,
    area_pen_code: "",
    area_pen_name: "",
  },
};

const SubArea = () => {
  const [subArea, setSubArea] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSubArea();
  }, []);

  
  const getSubArea = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.subArea,
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
        setSubArea(data);
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
              <DataSubArea
                data={loading ? dummy : subArea}
                load={loading}
                onSuccessInput={() => getSubArea()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SubArea;
