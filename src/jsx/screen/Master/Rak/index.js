import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SET_JENIS_KERJA } from "src/redux/actions";
import DataRak from "./DataRak";
// import DataJeniskerja from "./DataJeniskerja";

const data = {
  id: null,
  rak_typecode: null,
  rak_name: null,
  lokasi_rak: null,
  
};

const Rak = () => {
  // const jenis_kerja = useSelector((state) => state.jns_kerja.jns_kerja);
  const [rak, setRak] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getRak();
  }, []);

  const getRak = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getRak,
      data: {},
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
        setRak(data);
        // dispatch({ type: SET_JENIS_KERJA, payload: data });
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
              <DataRak
                data={loading ? dummy : rak}
                load={loading}
                onSuccessInput={() => getRak()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Rak;
