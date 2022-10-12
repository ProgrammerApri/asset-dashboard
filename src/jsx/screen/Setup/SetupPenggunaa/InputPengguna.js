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
import { tr } from "src/data/tr";

const def = {
  id: null,
  username: null,
  email: null,
  password: null,
  active: true,
  menu: [],
};

const InputPengguna = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(null);
  const toast = useRef(null);
  const exp = useSelector((state) => state.exp.current);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(null);
  const [current, setCurrent] = useState(def);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getMenu();
  }, []);

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

        setCurrent({
          ...current,
          menu: filt.map((el) => ({
            menu_id: el.id,
            view: true,
            edit: true,
            delete: true,
          })),
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

  const addUser = async () => {
    setLoading(true);
    const config = {
      ...endpoints.addUSER,
      data: {
        username: current.username,
        name: null,
        password: current.password,
        email: current.email,
        active: current.active,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setLoading(false);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const onSubmit = () => {
    setUpdate(true);
    addUser();
    // if (isValid()) {
    //   if (isEdit) {
    //     setUpdate(true);
    //   } else {
    //     setUpdate(true);
    //   }
    // }
  };

  const body = () => {
    return (
      <>
        <Toast ref={toast} />

        <Row className="mb-12">
          <div className="col-3 ">
            <PrimeInput
              label={"Username"}
              value={current.username}
              onChange={(e) => {
                setCurrent({ ...current, username: e.target.value });
              }}
              placeholder="Masukan Username"
            />
          </div>
          <div className="col-3">
            <PrimeInput
              label={"Email"}
              value={current.email}
              onChange={(e) => {
                setCurrent({ ...current, email: e.target.value });
              }}
              placeholder="Masukan Email"
              isEmail
            />
          </div>
          <div className="col-3">
            <label className="text-label">Password</label>
            <div className="p-inputgroup">
              <Password
                value={current.password}
                onChange={(e) => {
                  setCurrent({ ...current, password: e.target.value });
                }}
                placeholder="Masukan Password"
                toggleMask
              />
            </div>
          </div>

          <div className="d-flex col-3 align-items-center mt-4">
            <InputSwitch
              className="mr-3"
              inputId="email"
              checked={current.active}
              onChange={(e) => {
                setCurrent({ ...current, active: e.value });
              }}
            />
            <label className="mr-3 mt-1" htmlFor="email">
              {"Aktif"}
            </label>
          </div>

          <div className="col-12 mt-1">
            <span className="fs-13">
              <b>Hak Akses Menu</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <DataTable
            responsiveLayout="scroll"
            value={loading ? dummy : menu.map((v, i) => ({ ...v, index: i }))}
            className="col-12 display datatable-wrapper"
            showGridlines
            dataKey="name"
            rowHover
            emptyMessage="Tidak ada data"
          >
            <Column
              header="Name"
              style={{
                minWidth: "30rem",
              }}
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
              style={{ width: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <InputSwitch
                    className="mr-3"
                    checked={current.menu[e.index].view}
                    onChange={(v) => {
                      let temp = current.menu;
                      temp[e.index].view = v.value;
                      if (!v.value) {
                        temp[e.index].delete = v.value;
                        temp[e.index].edit = v.value;
                      }
                      setCurrent({ ...current, menu: temp });
                    }}
                  />
                )
              }
            />
            <Column
              header="Edit"
              style={{ width: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <InputSwitch
                    className="mr-3"
                    checked={current.menu[e.index].edit}
                    onChange={(v) => {
                      let temp = current.menu;
                      temp[e.index].edit = v.value;
                      if (v.value) {
                        temp[e.index].view = v.value;
                      }
                      setCurrent({ ...current, menu: temp });
                    }}
                  />
                )
              }
            />
            <Column
              header="Delete"
              style={{ width: "8rem" }}
              body={(e) =>
                loading ? (
                  <Skeleton />
                ) : (
                  <InputSwitch
                    className="mr-3"
                    checked={current.menu[e.index].delete}
                    onChange={(v) => {
                      let temp = current.menu;
                      temp[e.index].delete = v.value;
                      if (v.value) {
                        temp[e.index].view = v.value;
                      }
                      setCurrent({ ...current, menu: temp });
                    }}
                  />
                )
              }
            />
          </DataTable>
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
