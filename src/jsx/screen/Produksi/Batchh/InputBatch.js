import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_FM } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

const defError = {
  code: false,
  name: false,
  prod: [
    {
      id: false,
      qty: false,
      aloc: false,
    },
  ],
  mtrl: [
    {
      id: false,
      qty: false,
      prc: false,
    },
  ],
};

const InputBatch = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const forml = useSelector((state) => state.forml.current);
  const isEdit = useSelector((state) => state.forml.editForml);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [error, setError] = useState(defError);
  const [accor, setAccor] = useState({
    produk: true,
    material: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getProduct();
    getSatuan();
  }, []);

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setProduct(data);
        console.log("jsdj");
        console.log(data);
      }
    } catch (error) {}
  };

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSatuan(data);
      }
    } catch (error) {}
  };

  const editFM = async () => {
    const config = {
      ...endpoints.editFormula,
      endpoint: endpoints.editFormula.endpoint + forml.id,
      data: forml,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addFM = async () => {
    const config = {
      ...endpoints.addFormula,
      data: forml,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${forml.po_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Gagal Memperbarui Data",
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkUnit = (value) => {
    let selected = {};
    satuan?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editFM();
      } else {
        setUpdate(true);
        addFM();
      }
    }
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

  const updateFM = (e) => {
    dispatch({
      type: SET_CURRENT_FM,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !forml.fcode || forml.fcode === "",
      name: !forml.fname || forml.fname === "",
      prod: [],
      mtrl: [],
    };

    forml?.product.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty || element.aloc) {
          errors.prod[i] = {
            id: !element.prod_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
            aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
          aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
        };
      }
    });

    forml?.material.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty || element.price) {
          errors.mtrl[i] = {
            id: !element.prod_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
            prc:
              !element.price || element.price === "" || element.price === "0",
          };
        }
      } else {
        errors.mtrl[i] = {
          id: !element.prod_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
          prc: !element.price || element.price === "" || element.price === "0",
        };
      }
    });

    if (!errors.prod[0]?.id && !errors.prod[0]?.qty && !errors.prod[0]?.aloc) {
      errors.mtrl?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (!errors.mtrl[0]?.id && !errors.mtrl[0]?.qty && !errors.mtrl[0]?.prc) {
      errors.prod?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validProduct = false;
    let validMtrl = false;
    errors.prod?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });
    if (!validProduct) {
      errors.mtrl.forEach((el) => {
        for (var k in el) {
          validMtrl = !el[k];
        }
      });
    }

    valid = !errors.code && !errors.name && (validProduct || validMtrl);

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pembelian (PO)</b>
        {/* <b>{isEdit ? "Edit" : "Buat"} Pembelian (PO)</b> */}
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-2 text-black">
            <PrimeInput
              label={"Kode Batch"}
              value={forml.fcode}
              onChange={(e) => {
                updateFM({ ...forml, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="001-001"
              error={error?.code}
              //   disabled
            />
          </div>
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              //   placeholder="Pilih Tanggal"
              //   showIcon
              //   dateFormat="dd-mm-yy"
              disabled
              error={error?.date}
            />
          </div>
          {/* <div className="col-5"></div> */}
          <div className="col-8 text-black"></div>

          <div className="col-2 text-black">
            <label className="text-black">Kode Planning</label>
            <div className="p-inputgroup"></div>

            <Dropdown
              //   label={"Kode Planning"}
              value={forml.fcode}
              onChange={(e) => {
                updateFM({ ...forml, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="001-001xx"
              error={error?.code}
            />
          </div>
          {/* <div className="col-3 text-black"></div> */}

          <div className="col-2 text-black">
            <PrimeInput
              label={"Nama Planning"}
              value={forml.fcode}
              onChange={(e) => {
                updateFM({ ...forml, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Planning"
              error={error?.code}
            />
          </div>
          {/* <div className="col-"></div> */}
          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal Rencana Produksi"}
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>

          <div className="col-6"></div>
          <div className="col-2  text-black ">
            {/* <div className="col-1"> */}
            <label className="text-black">Kode Formula</label>
            <div className="p-inputgroup"></div>
            <Dropdown
              //   label={"Kode Planning"}
              value={forml.fcode}
              onChange={(e) => {
                updateFM({ ...forml, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="001-001xx"
              error={error?.code}
            />
          </div>

          {/* <div className="col-1"></div> */}
          <div className="col-2 text-black">
            <PrimeInput
              label={"Nama Formula"}
              value={forml.fname}
              onChange={(e) => {
                updateFM({ ...forml, fname: e.target.value });
                let newError = error;
                newError.name = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Formula"
              error={error?.name}
            />
          </div>
          <div className="col-1 text-black">
            <PrimeNumber
              label={"Versi"}
              value={forml.version}
              onChange={(e) => {
                updateFM({ ...forml, version: e.target.value });
              }}
              placeholder="0"
              type="number"
              min={0}
            />
          </div>
          <div className="col-1 text-black">
            <PrimeNumber
              label={"Revisi"}
              value={forml.rev}
              onChange={(e) => {
                updateFM({ ...forml, rev: e.target.value });
              }}
              placeholder="0"
              type="number"
              min={0}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeInput
              label={"Tanggal Revisi"}
              value={formatDate(date)}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="dd/mm/yyyy"
              disabled
            />
          </div>
          {/* <div className="col-1"></div> */}
          <div className="col-4 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={forml.desc}
                onChange={(e) => updateFM({ ...forml, desc: e.target.value })}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>

          {/* <div className="col-3"></div> */}
          {/* <div className="col-"></div> */}
          <div className="col-2 text-black">
            <PrimeInput
              label={"Total Pembuatan"}
              value={forml.fname}
              onChange={(e) => {
                updateFM({ ...forml, fname: e.target.value });
                let newError = error;
                newError.name = false;
                setError(newError);
              }}
              placeholder="200"
              error={error?.name}
            />
          </div>
          <div className="col-1">
            <label className="text-black">Satuan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={null}
              onChange={(e) => {
                // updateRp({ ...rp, req_dep: e.id });
              }}
              //   option={""}
              detail
              //   onDetail={() => setShowDepartemen(true)}
              label={"[ccost_name] ([ccost_code])"}
              placeholder="Pcs"
            />
          </div>
          <div className="col-9"></div>
          <div className="col-2 text-black">
            <label className="text-black">Departement</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              //   label={"Kode Planning"}
              value={null}
              onChange={(e) => {
                // updateRp({ ...rp, req_dep: e.id });
              }}
              //   option={""}
              detail
              //   onDetail={() => setShowDepartemen(true)}
              label={"[ccost_name] ([ccost_code])"}
              placeholder="Sambel Ngulek"
            />
          </div>

          {/* <div className="col-7"></div> */}
        </Row>

        <CustomAccordion
          tittle={"Produk"}
          defaultActive={true}
          active={accor.produk}
          onClick={() => {
            setAccor({
              ...accor,
              produk: !accor.produk,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="none"
                value={forml.product?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    // order: v?.order ?? 0,
                  };
                })}
                className="display w-150 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Produk Hasil Jadi"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "30rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(t) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === t.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === t.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...forml.product];
                        temp[e.index].prod_id = t.id;
                        temp[e.index].unit_id = t.unit?.id;
                        updateFM({ ...forml, product: temp });

                        let newError = error;
                        newError.prod[e.index].id = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Produk"
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowProd(true);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header="Satuan"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "15rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...forml.product];
                        temp[e.index].unit_id = t.id;
                        updateFM({ ...forml, product: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                    />
                  )}
                />

                <Column
                  header="Kuantitas"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "5rem",
                  // }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.qty ? e.qty : ""}
                      onChange={(t) => {
                        let temp = [...forml.product];
                        temp[e.index].qty = t.target.value;
                        updateFM({ ...forml, product: temp });

                        let newError = error;
                        newError.prod[e.index].qty = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.prod[e.index]?.qty}
                    />
                  )}
                />

                <Column
                  header="Cost Alokasi (%)"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   minWidth: "7rem",
                  // }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.aloc && e.aloc}
                      onChange={(u) => {
                        let temp = [...forml.product];
                        temp[e.index].aloc = u.target.value;
                        updateFM({ ...forml, product: temp });

                        let newError = error;
                        newError.prod[e.index].aloc = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.prod[e.index]?.aloc}
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === forml.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({ qty: false, aloc: false });
                          setError(newError);

                          updateFM({
                            ...forml,
                            product: [
                              ...forml.product,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                qty: null,
                                aloc: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...forml.product];
                          temp.splice(e.index, 1);
                          updateFM({
                            ...forml,
                            product: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    )
                  }
                />
              </DataTable>
            </>
          }
        />

        <CustomAccordion
          tittle={"Mesin"}
          defaultActive={true}
          active={accor.produk}
          onClick={() => {
            setAccor({
              ...accor,
              produk: !accor.produk,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="none"
                value={forml.product?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    // order: v?.order ?? 0,
                  };
                })}
                className="display w-150 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Kode Mesin"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "60rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(t) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === t.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === t.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...forml.product];
                        temp[e.index].prod_id = t.id;
                        temp[e.index].unit_id = t.unit?.id;
                        updateFM({ ...forml, product: temp });

                        let newError = error;
                        newError.prod[e.index].id = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Produk"
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowProd(true);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header="Action"
                  //   paginatorClassName="text-align: right"
                  className="align-text-right"
                  field={""}
                  style={{
                    minWidth: "10rem",
                  }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.aloc && e.aloc}
                      onChange={(u) => {
                        let temp = [...forml.product];
                        temp[e.index].aloc = u.target.value;
                        updateFM({ ...forml, product: temp });

                        let newError = error;
                        newError.prod[e.index].aloc = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.prod[e.index]?.aloc}
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === forml.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({ qty: false, aloc: false });
                          setError(newError);

                          updateFM({
                            ...forml,
                            product: [
                              ...forml.product,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                qty: null,
                                aloc: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...forml.product];
                          temp.splice(e.index, 1);
                          updateFM({
                            ...forml,
                            product: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    )
                  }
                />
              </DataTable>
            </>
          }
        />

        <CustomAccordion
          tittle={"Bahan"}
          defaultActive={true}
          active={accor.material}
          onClick={() => {
            setAccor({
              ...accor,
              material: !accor.material,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="none"
                value={forml.material?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    // order: v?.order ?? 0,
                    // price: v?.price ?? 0,
                  };
                })}
                className="display w-150 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Bahan Hasil Jadi"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "30rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(t) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === t.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === t.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...forml.material];
                        temp[e.index].prod_id = t.id;
                        temp[e.index].unit_id = t.unit?.id;
                        updateFM({ ...forml, material: temp });

                        let newError = error;
                        newError.mtrl[e.index].id = false;
                        setError(newError);
                      }}
                      label={"[name]"}
                      placeholder="Pilih Bahan"
                      errorMessage="Bahan Belum Dipilih"
                      error={error?.mtrl[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header="Satuan"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "15rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...forml.material];
                        temp[e.index].unit_id = t.id;
                        updateFM({ ...forml, material: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                    />
                  )}
                />

                <Column
                  header="Kuantitas"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "5rem",
                  // }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.qty ? e.qty : ""}
                      onChange={(t) => {
                        let temp = [...forml.material];
                        temp[e.index].qty = t.target.value;
                        updateFM({ ...forml, material: temp });

                        let newError = error;
                        newError.mtrl[e.index].qty = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.mtrl[e.index]?.qty}
                    />
                  )}
                />

                <Column
                  header="Harga"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   minWidth: "7rem",
                  // }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.price ? e.price : ""}
                      onChange={(t) => {
                        let temp = [...forml.material];
                        temp[e.index].price = t.target.value;
                        updateFM({ ...forml, material: temp });

                        let newError = error;
                        newError.mtrl[e.index].prc = false;
                        setError(newError);
                      }}
                      min={0}
                      placeholder="0"
                      type="number"
                      error={error?.mtrl[e.index]?.prc}
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === forml.material.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.mtrl.push({ qty: false, prc: false });
                          setError(newError);

                          updateFM({
                            ...forml,
                            material: [
                              ...forml.material,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                qty: null,
                                price: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...forml.material];
                          temp.splice(e.index, 1);
                          updateFM({
                            ...forml,
                            material: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    )
                  }
                />
              </DataTable>
            </>
          }
        />
        <div className="row mb-8">
          <span className="mb-8"></span>
        </div>
      </>
    );
  };

  const getIndex = () => {
    let total = 0;
    forml?.product?.forEach((el) => {
      total += el.index;
    });

    return total;
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left">
            <label className="text-label">
              <b>Jumlah Produk : </b>
            </label>
            <span> {}</span>
            <label className="ml-8">
              <b>Jumlah Bahan : </b>
            </label>
            <span>{}</span>
          </div>
        </div>

        <div className="row justify-content-right col-6">
          <div className="col-12 mt-0 fs-12 text-right">
            <PButton
              label="Batal"
              onClick={onCancel}
              className="p-button-text btn-primary"
            />
            <PButton
              label="Simpan"
              icon="pi pi-check"
              onClick={() => onSubmit()}
              autoFocus
              loading={update}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col className="pt-0">
          <>
            {/* {header()} */}
            {body()}
            {footer()}
          </>
        </Col>
      </Row>

      <DataProduk
        data={product}
        loading={false}
        popUp={true}
        show={showProd}
        onHide={() => {
          setShowProd(false);
        }}
        onInput={(e) => {
          setShowProd(!e);
        }}
        onSuccessInput={(e) => {
          getProduct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProd(false);
            let sat = [];
            satuan.forEach((element) => {
              if (element.id === e.data.unit.id) {
                sat.push(element);
              } else {
                if (element.u_from?.id === e.data.unit.id) {
                  sat.push(element);
                }
              }
            });
            setSatuan(sat);

            let temp = [...forml.product];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;

            let tempm = [...forml.material];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateFM({ ...forml, product: temp, material: tempm });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataSatuan
        data={satuan}
        loading={false}
        popUp={true}
        show={showSatuan}
        onHide={() => {
          setShowSatuan(false);
        }}
        onInput={(e) => {
          setShowSatuan(!e);
        }}
        onSuccessInput={(e) => {
          getSatuan();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSatuan(false);
            let temp = [...forml.product];
            temp[currentIndex].unit_id = e.data.id;

            let tempm = [...forml.material];
            tempm[currentIndex].unit_id = e.data.id;
            updateFM({ ...forml, product: temp, material: tempm });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />
    </>
  );
};

export default InputBatch;
