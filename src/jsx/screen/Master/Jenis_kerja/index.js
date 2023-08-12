import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SET_JENIS_KERJA } from "src/redux/actions";
import DataJeniskerja from "./DataJeniskerja";
// import DataJeniskerja from "./DataJeniskerja";

const data = {
  id: null,
  jenis_code: null,
  jenis_name: null,
  mutasi: null,
  desc: null,
};

const Jeniskerja = () => {
  const jns_kerja = useSelector((state) => state.jns_kerja.jns_kerja);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getJeniskerja();
  }, []);

  const getJeniskerja = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.Jeniskerja,
      data: jns_kerja,
    };
    console.log("datanya");
    console.log(config?.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log("hello bawah");
        console.log(data);
        dispatch({ type: SET_JENIS_KERJA, payload: data });
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
              <DataJeniskerja
                data={loading ? dummy : jns_kerja}
                load={loading}
                onSuccessInput={() => getJeniskerja()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Jeniskerja;
