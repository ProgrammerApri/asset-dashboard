import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataAkun from "./DataAkun";

const data = {
  account: {
    acc_code: "",
    acc_name: "",
    umm_code: null,
    kat_code: 0,
    dou_type: "U",
    sld_type: "",
    connect: false,
    sld_awal: 0,
  },
  kategory: {
    id: 0,
    name: "",
    kode_klasi: 0,
    kode_saldo: "",
  },
  klasifikasi: {
    id: 0,
    klasiname: "",
  },
};

const Akun = () => {
  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountDisplay, setAccountDisplay] = useState(null);
  const [dataLength, setDataLength] = useState(null);
  const [olddataLength, setOldDataLength] = useState(null);
  const [rows, setRows] = useState(20);
  const dummy = Array.from({ length: 10 });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(searchTerm);
      getAccountFilter(1, rows, searchTerm === "" ? 0 : searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    // getAccount();
    getAccountFilter(1, rows, 0);
  }, []);

  const getAccountFilter = async (
    page,
    length,
    filter,
    reset = false,
    isUpdate = false
  ) => {
    if (page * length > account?.length || filter !== 0 || reset) {
      setLoading(true);
      let acc = [];
      if (!reset) {
        acc = account;
      }

      const config = {
        ...endpoints.accountFilter,
        endpoint:
          endpoints.accountFilter.endpoint + `${page}/${length}/${filter}`,
      };
      console.log(config.data);
      let response = null;
      try {
        response = await request(null, config);
        console.log(response);
        if (response.status) {
          const { data } = response;
          setAccountDisplay(data.data);
          if (filter === 0) {
            acc = [...acc, ...data.data];
            setAccount(acc);
            setOldDataLength(data.length);
          }
          setDataLength(data.length);
        }
      } catch (error) {
        console.log(error);
      }
      if (isUpdate) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } else {
      setDataLength(olddataLength);
      setAccountDisplay(account?.slice(page * length - length, page * length));
    }
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataAkun
                data={loading ? dummy : accountDisplay}
                load={loading}
                onSuccessInput={() =>
                  getAccountFilter(
                    1,
                    rows !== 50 && rows !== 20 ? rows + 1 : rows,
                    0,
                    true,
                    false
                  )
                }
                onSuccessImport={() => {
                  // setAccount([])
                }}
                dataLength={dataLength}
                onPageChange={(event) => {
                  getAccountFilter(
                    event.first == 0 ? 1 : event.first / event.rows + 1,
                    event.rows,
                    event.filters.global.value === null ||
                      event.filters.global.value === ""
                      ? 0
                      : event.filters.global.value,
                    event.rows !== rows
                  );
                  console.log(event.rows !== rows);
                  setRows(event.rows);
                }}
                onFilter={(value) => {
                  setSearchTerm(value);
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Akun;
