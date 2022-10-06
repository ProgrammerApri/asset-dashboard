import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_EXP } from "src/redux/actions";
import { Divider } from "@material-ui/core";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { InputSwitch } from "primereact/inputswitch";
import { TabPanel } from "primereact/tabview";
import SetupAkun from "../SetupAkun";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Link } from "react-router-dom";
import { Password } from "primereact/password";

const data = {
  id: 0,
  name: "",
  route_name: "",
  visible: true,
  parent_id: null,
  category: null,
  icon_file: "",
};

const defError = {
  code: false,
  date: false,
  sup: false,
  akn: false,
  btc: false,
  // proj: false,
  // dep: false,
  acco: false,
  bn_code: false,
  bn_acc: false,
  gr: false,
  tgl: false,
  bn_id: false,
  exp: [
    {
      acc: false,
      nil: false,
    },
  ],
  // acq: [
  //   {
  //     pay: false,
  //   },
  // ],
};

const InputPengguna = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(defError);
  const toast = useRef(null);
  const [displayInput, setDisplayInput] = useState(false);
  const exp = useSelector((state) => state.exp.current);
  // const isEdit = useSelector((state) => state.exp.editExp);
  const dispatch = useDispatch();
  const [displayDel, setDisplayDel] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [account, setAccount] = useState(null);
  const [accKas, setAccKas] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [bank, setBank] = useState(null);
  const [supplier, setSupplier] = useState(null);
  // const [faktur, setFaktur] = useState(null);
  const [current, setCurrent] = useState(data);
  const [value3, setValue3] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apcard, setAP] = useState(null);
  const [dept, setDept] = useState(null);
  const [proj, setProj] = useState(null);
  const [menu, setMenu] = useState(null);

  const dummy = Array.from({ length: 10 });
  const [batch, setBatch] = useState(null);
  const [accor, setAccor] = useState({
    bayar: true,
    keluar: false,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getMenu();
    // getAccKas();
    // getBank();
    getSupplier();
    // getBatch();
    // getProj();
    // getDept();
    // getAccount();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !exp.exp_code || exp.exp_code === "",
      date: !exp.exp_date || exp.exp_date === "",
      sup: exp.exp_type === 1 ? !exp.acq_sup : false,
      akn: exp.exp_type === 2 ? !exp.exp_acc : false,
      btc: exp.exp_type === 3 ? !exp.batch_id : false,
      acco: exp.acq_pay === 1 ? !exp.kas_acc : false,
      bn_code: exp.acq_pay === 2 ? !exp.bank_ref : false,
      bn_acc: exp.acq_pay === 2 ? !exp.bank_acc : false,
      gr: exp.acq_pay === 3 ? !exp.giro_num : false,
      tgl: exp.acq_pay === 3 ? !exp.giro_date : false,
      bn_id: exp.acq_pay === 3 ? !exp.bank_id : false,
      exp: [],
      // acq: [],
    };

    exp?.exp.forEach((element, i) => {
      if (i > 0) {
        if (element.acc_code || element.value) {
          errors.exp[i] = {
            acc: !element.acc_code,
            nil:
              !element.value || element.value === "" || element.value === "0",
          };
        }
      } else {
        errors.exp[i] = {
          acc: !element.acc_code,
          nil: !element.value || element.value === "" || element.value === "0",
        };
      }
    });

    // exp?.acq?.forEach((element, i) => {
    //   if (i > 0) {
    //     if (element.payment) {
    //       errors.acq[i] = {
    //         pay:
    //           !element.payment ||
    //           element.payment === "" ||
    //           element.payment === "0",
    //       };
    //     }
    //   } else {
    //     errors.acq[i] = {
    //       pay:
    //         !element.payment ||
    //         element.payment === "" ||
    //         element.payment === "0",
    //     };
    //   }
    // });

    // if (exp !== null && exp.exp_type === 2) {
    if (!errors.exp[0].acc && !errors.exp[0].nil) {
      errors.acq?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }
    // }

    // if (exp !== null && exp.exp_type === 1) {
    // if (exp?.acq.length) {
    //   if (!errors.acq[0]?.pay) {
    //     errors.exp?.forEach((e) => {
    //       for (var key in e) {
    //         e[key] = false;
    //       }
    //     });
    //   }
    // }
    // }

    let validExp = false;
    let validAcq = false;
    errors.exp?.forEach((el) => {
      for (var k in el) {
        validExp = !el[k];
      }
    });
    // if (!validExp) {
    //   errors.acq?.forEach((el) => {
    //     for (var k in el) {
    //       validAcq = !el[k];
    //     }
    //   });
    // }

    setError(errors);

    valid =
      !errors.code &&
      !errors.date &&
      !errors.sup &&
      !errors.akn &&
      !errors.btc &&
      !errors.acco &&
      !errors.bn_code &&
      !errors.bn_acc &&
      !errors.gr &&
      !errors.tgl &&
      !errors.bn_id &&
      (validExp || validAcq);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const getAPCard = async (spl) => {
    const config = {
      ...endpoints.apcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let sup = [];
        spl.forEach((element) => {
          element.ap = [];
          data.forEach((el) => {
            if (el.trx_type === "LP" && el.pay_type === "P1") {
              if (element.supplier.id === el.sup_id.id) {
                element.ap.push(el);
              }
            }
          });
          if (element.ap.length > 0) {
            sup.push(element);
          }
          console.log("hdjsdjs");
          console.log(element);
        });
        setAP(data);
        setSupplier(sup);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editMenu = async (data) => {
    setLoadingSubmit(true);
    const config = {
      ...endpoints.editMenu,
      endpoint: endpoints.editMenu.endpoint + data.id,
      data: data,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        setTimeout(() => {
          setLoadingSubmit(false);
          setDisplayInput(false);
          getMenu();
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoadingSubmit(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const getMenu = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getMenu,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        let filt = [];
        const { data } = response;
        data.forEach((el) => {
          filt.push({
            ...data,
            id: el.id,
            name: el.name,
            route_name: el.route_name,
            icon_file: el.icon_file,
            visible: el.visible,
            parent_id: el.parent_id,
            category: el.category,
            level: 1,
          });
          el.submenu.forEach((ek) => {
            filt.push({
              ...data,
              id: ek.id,
              name: ek.name,
              route_name: ek.route_name,
              icon_file: ek.icon_file,
              visible: ek.visible,
              parent_id: ek.parent_id,
              category: ek.category,
              level: 2,
            });
            ek.lastmenu.forEach((ej) => {
              filt.push({
                ...data,
                id: ej.id,
                name: ej.name,
                route_name: ej.route_name,
                icon_file: ej.icon_file,
                visible: ej.visible,
                parent_id: ej.parent_id,
                category: ej.category,
                level: 3,
              });
            });
          });
        });
        setMenu(filt);
        setLoading(false);
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

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        getAPCard(data);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const editEXP = async () => {
    const config = {
      ...endpoints.editEXP,
      endpoint: endpoints.editEXP.endpoint + exp.id,
      data: exp,
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

  const addEXP = async () => {
    const config = {
      ...endpoints.addEXP,
      data: exp,
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
            detail: `Kode ${exp.exp_code} Sudah Digunakan`,
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editEXP();
      } else {
        setUpdate(true);
        addEXP();
      }
    }
  };

  const updateExp = (e) => {
    dispatch({
      type: SET_CURRENT_EXP,
      payload: e,
    });
  };

  

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-12">
          <div className="col-12 ">
            <div className="col-6 ">
              <label className="text-label">Username</label>
              <div className="p-inputgroup"> </div>
              <PrimeInput
                value={exp.exp_code}
                onChange={(e) => {
                  updateExp({ ...exp, exp_code: e.target.value });

                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Username"
                error={error?.code}
              />
              <label className="text-label">Email</label>
              <div className="p-inputgroup"></div>
              <PrimeInput
                // label={"Email"}
                value={exp.exp_code}
                onChange={(e) => {
                  updateExp({ ...exp, exp_code: e.target.value });

                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Email"
                error={error?.code}
              />
            </div>
            <div className="col-6">
              <label className="text-label">Password</label>
              <div className="p-inputgroup"></div>
              <Password
                value={exp.exp_code}
                onChange={(e) => {
                  updateExp({ ...exp, exp_code: e.target.value });

                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Password"
                error={error?.code}
                toggleMask
              />
            </div>

            <div className="col-6 ">
              <label className="text-label">Perusahaan</label>
              <div className="p-inputgroup"></div>
              <PrimeInput
                value={exp.exp_code}
                onChange={(e) => {
                  updateExp({ ...exp, exp_code: e.target.value });

                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Perusahaan"
                error={error?.code}
              />
            </div>
            <div className="col-12 mb-2">
            <label className="text-label">Aktif</label>
            <div className="p-inputgroup"></div>
            <div className="d-flex col-12 align-items-center">
              <InputSwitch
                className="mr-9"
                inputId="email"
                // checked={currentItem && currentItem.active}
                onChange={(e) => {
                  // setCurrentItem({ ...currentItem, active: e.value });
                }}
              />
            </div>
          </div>
          </div>

         

          {/* </div> */}

          <div className="col-12 mt-1">
            <span className="fs-13">
              <b>Hak Akses Menu</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <DataTable
            responsiveLayout="scroll"
            value={loading ? dummy : menu}
            className="display w-150 datatable-wrapper"
            showGridlines
            dataKey="name"
            rowHover
            // header={renderHeader}
            filters={filters1}
            globalFilterFields={["name"]}
            emptyMessage="Tidak ada data"
          >
            <Column
              header="Name"
              style={{
                minWidth: "30rem",
              }}
              field={(e) => e.name}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : e.level === 2 ? (
                  <div>{`└─ ${e.name}`}</div>
                ) : e.level === 3 ? (
                  <div className="ml-4">{`└─ ${e.name}`}</div>
                ) : (
                  <div>{e.name}</div>
                )
              }
            />
            <Column
              header="View"
              field={(e) => e.area_pen_name}
              style={{ width: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <InputSwitch
                    className="mr-3"
                    checked={e.visible}
                    onChange={(v) => {
                      let temp = menu;
                      temp[menu.findIndex((obj) => obj.id === e.id)].visible =
                        v.value;
                      setMenu(temp);
                      editMenu({ ...e, visible: v.value });
                    }}
                  />
                )
              }
            />
            <Column
              header="Edit"
              field={(e) => e.area_pen_name}
              style={{ width: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <InputSwitch
                    className="mr-3"
                    checked={e.visible}
                    onChange={(v) => {
                      let temp = menu;
                      temp[menu.findIndex((obj) => obj.id === e.id)].visible =
                        v.value;
                      setMenu(temp);
                      editMenu({ ...e, visible: v.value });
                    }}
                  />
                )
              }
            />
            <Column
              header="Delete"
              field={(e) => e.area_pen_name}
              style={{ width: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <InputSwitch
                    className="mr-3"
                    checked={e.visible}
                    onChange={(v) => {
                      let temp = menu;
                      temp[menu.findIndex((obj) => obj.id === e.id)].visible =
                        v.value;
                      setMenu(temp);
                      editMenu({ ...e, visible: v.value });
                    }}
                  />
                )
              }
            />
           
          </DataTable>

          {/* Type Pembayaran */}
          {exp !== null && exp.exp_type === 1 ? (
            <>
              {/* kode pembayaran cash  */}
              {exp !== null && exp.acq_pay === 1 ? (
                <></>
              ) : // pembayaran bank
              exp !== null && exp.acq_pay === 2 ? (
                <></>
              ) : (
                // pembayran giro
                <></>
              )}

              {exp?.acq?.length ? <CustomAccordion /> : <></>}
            </>
          ) : exp !== null && exp.exp_type === 2 ? (
            // Type Pengeluaran
            <>
              {" "}
              {/* <CustomAccordion
                className="col-12 mt-4"
                tittle={"Pengeluaran Kas / Bank"}
                defaultActive={true}
                active={accor.keluar}
                onClick={() => {
                  setAccor({
                    ...accor,
                    keluar: !accor.keluar,
                  });
                }}
                key={1}
                body={<></>}
              /> */}
            </>
          ) : (
            <></>
          )}
        </Row>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
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
    );
  };

  return (
    <Row>
      <Col className="pt-0">
        <Card>
          <Card.Body>
            {/* {header()} */}
            {body()}
            {footer()}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default InputPengguna;
