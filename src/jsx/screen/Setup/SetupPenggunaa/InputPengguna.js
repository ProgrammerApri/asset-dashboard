import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_USER } from "src/redux/actions";
import { Divider } from "@material-ui/core";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { InputSwitch } from "primereact/inputswitch";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { Password } from "primereact/password";
import { tr } from "src/data/tr";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { SelectButton } from "primereact/selectbutton";

const def = {
  id: null,
  username: null,
  email: null,
  password: null,
  active: true,
  menu: [],
};

const InputPengguna = ({ onCancel, onSuccess, del }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.current);
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

        if (!user.id) {
          dispatch({
            type: SET_CURRENT_USER,
            payload: {
              ...user,
              menu: filt.map((el) => ({
                menu_id: el.id,
                view: true,
                edit: true,
                delete: true,
              })),
            },
          });
        }

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
    setUpdate(true);
    const config = {
      ...endpoints.addUSER,
      data: {
        username: user.username,
        password: user.password,
        email: user.email,
        active: user.active,
        company: null,
        product: null,
        endpoint_id: null,
        menu: user.menu,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);

          onSuccess();
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

  const editUSER = async () => {
    setUpdate(true);
    const config = {
      ...endpoints.editUSER,
      endpoint: endpoints.editUSER.endpoint + user.id,
      data: {
        username: user.username,
        password: user.password,
        email: user.email,
        active: user.active,
        menu: user.menu,
      },
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
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

  const onSubmit = () => {
    setUpdate(true);
    if (user.id) {
      editUSER();
    } else {
      addUser();
    }
  };

  const renderFooterDel = (kode) => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            setShowDelete(false);
            setLoading(false);
            // onInput(false);
          }}
          className="p-button-text btn-s btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          className="p-button btn-s btn-primary"
          icon="pi pi-trash"
          onClick={() => {
            // delUSER();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };
  const updateUser = (e) => {
    dispatch({
      type: SET_CURRENT_USER,
      payload: e,
    });
  };

  const body = () => {
    return (
      <>
        <Toast ref={toast} />

        <Row className="mb-12">
          <div className="col-12 mt-1">
            <span className="fs-13">
              <b>General Information</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>
          <div className="col-3 ">
            <PrimeInput
              label={"Username"}
              value={user.username}
              onChange={(e) => {
                updateUser({ ...user, username: e.target.value });
              }}
              placeholder="Masukan Username"
            />
          </div>
          <div className="col-3">
            <PrimeInput
              label={"Email"}
              value={user.email}
              onChange={(e) => {
                updateUser({ ...user, email: e.target.value });
              }}
              placeholder="Masukan Email"
              isEmail
            />
          </div>
          <div className="col-3">
            <label className="text-label">Password</label>
            <div className="p-inputgroup">
              <Password
                value={user.password}
                onChange={(e) => {
                  updateUser({ ...user, password: e.target.value });
                  console.log(current);
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
              checked={user.active}
              onChange={(e) => {
                updateUser({ ...user, active: e.value });
              }}
            />
            <label className="mr-3 mt-1" htmlFor="email">
              {"Aktif"}
            </label>
          </div>

          <div className="col-12 mt-1">
            <span className="fs-13">
              <b>Hak Otorisasi</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>
          <div className="col-3 ">
            <PrimeDropdown
              label={"Department"}
              value={null}
              options={[]}
              onChange={(e) => {
                // updateUser({ ...user, username: e.target.value });
              }}
              placeholder="Pilih Department"
            />
          </div>
          <div className="d-flex flex-column px-3 py-2">
            <label className="text-label">Akses Data</label>
            <div className="p-inputgroup">
              <SelectButton
                value={null}
                options={[{ code: 1, name: "All Data" }, { code: 2, name: "Department Only" }]}
                onChange={(e) => {}}
                optionLabel="name"
              />
            </div>
          </div>
          <div className="d-flex col-3 align-items-center mt-4">
            <InputSwitch
              className="mr-3"
              checked={user.approver}
              onChange={(e) => {
                updateUser({ ...user, approver: e.value });
              }}
            />
            <label className="mr-3 mt-1">{"Approver"}</label>
          </div>

          {/* <div className="col-12 mt-1">
            <span className="fs-13">
              <b>Approver Settings</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>
          <div className="col-3 ">
            <PrimeInput
              label={"Approver For"}
              value={null}
              onChange={(e) => {
                // updateUser({ ...user, username: e.target.value });
              }}
              placeholder="Masukan Username"
            />
          </div> */}

          <div className="col-12 mt-1">
            <span className="fs-13">
              <b>Hak Akses Menu</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <DataTable
            responsiveLayout="scroll"
            value={loading ? dummy : menu?.map((v, i) => ({ ...v, index: i }))}
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
                    checked={user?.menu[e.index]?.view}
                    onChange={(v) => {
                      let temp = user?.menu;
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
                    checked={user?.menu[e.index]?.edit}
                    onChange={(v) => {
                      let temp = user.menu;
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
                    checked={user?.menu[e.index]?.delete}
                    onChange={(v) => {
                      let temp = user.menu;
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
