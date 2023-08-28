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
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Dropdown } from "primereact/dropdown";

const def = {
  id: null,
  username: null,
  email: null,
  password: null,
  active: true,
  menu: [],
  previlage: {
    div_id: null,
    dep_id: null,
    access_type: 0,
    approver: false,
  },
  approval_settings: [null],
};

const modules = [
  {
    code: "rp",
    name: "Request Purchase",
  },
  {
    code: "po",
    name: "Purchase Order",
  },
  {
    code: "gra",
    name: "Purchase",
  },
  {
    code: "invoice",
    name: "Invoice",
  },
  {
    code: "ra",
    name: "Record Activity",
  },
  {
    code: "so",
    name: "Sales Order",
  },
  {
    code: "sales",
    name: "Sales",
  },
];

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
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [divisi, setDivisi] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getMenu();
    getPusatBiaya();
    getDivisi()
  }, []);

  const getPusatBiaya = async () => {
    const config = {
      ...endpoints.pusatBiaya,
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
        setPusatBiaya(data);
      }
    } catch (error) {}
  };

  const getDivisi = async () => {
    const config = {
      ...endpoints.divpusatBiaya,
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
        setDivisi(data);
      }
    } catch (error) {}
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
        previlage: user?.previlage
          ? { ...user.previlage, approver: user.previlage.approver ?? false }
          : null,
        approval_settings: user?.approval_settings
          ? user?.approval_settings?.filter((e) => e !== null)
          : null,
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
        previlage: {
          ...user.previlage,
          approver: user.previlage.approver ?? false,
        },
        approval_settings: user?.approval_settings
          ? user?.approval_settings?.filter((e) => e !== null)
          : null,
      },
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          // getMenu();
          // toast.current.show({
          //   severity: "info",
          //   summary: "Berhasil",
          //   detail: "Data Berhasil Diperbarui",
          //   life: 3000,
          // });
          onSuccess();
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

  const checkDepartement = (value) => {
    let selected = null;
    pusatBiaya?.forEach((element) => {
      if (element.id === value) {
        selected = element;
      }
    });

    return selected;
  };

  const checkDivisi = (value) => {
    let selected = null;
    divisi?.forEach((element) => {
      if (element.id === value) {
        selected = element;
      }
    });

    return selected;
  };

  const checkModules = (value) => {
    let selected = null;
    modules?.forEach((element) => {
      if (element.code === value) {
        selected = element;
      }
    });

    return selected;
  };

  const renderApprovalAccess = (
    value,
    onChangeLevel,
    onChangeModule,
    onChangeType,
    expanded = false,
    onAdd,
    onRemove
  ) => {
    return (
      <div className={`${expanded ? "col-12" : "col-6"} mb-2 px-2 py-0`}>
        {loading ? (
          <>
            <Skeleton width="200px" />
            <Skeleton className="mt-3" height="45px" />
          </>
        ) : (
          <>
            <DataTable
              responsiveLayout="scroll"
              value={value?.map((e, i) => {
                return { ...e, index: i };
              })}
              className="display w-150 datatable-wrapper header-white no-border"
              showGridlines={false}
              emptyMessage={() => <div></div>}
            >
              <Column
                header={"Approval Level"}
                className="align-text-top p-2"
                field={""}
                body={(e) => (
                  <div className="p-inputgroup">
                    <Dropdown
                      value={e?.approval_level}
                      options={[1, 2, 3]}
                      onChange={(a) => {
                        onChangeLevel(e, a.value);
                      }}
                      placeholder="Pilih Level"
                    />
                  </div>
                )}
              />
              <Column
                header={"Approval Module"}
                className="align-text-top p-2"
                field={""}
                body={(e) => (
                  <div className="p-inputgroup">
                    <Dropdown
                      value={checkModules(e?.approval_module)}
                      options={modules}
                      onChange={(a) => {
                        onChangeModule(e, a.value.code);
                      }}
                      optionLabel="name"
                      placeholder="Pilih Module"
                    />
                  </div>
                )}
              />
              <Column
                header={"Approval Type"}
                className="align-text-top p-2"
                field={""}
                body={(e) => (
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        e?.approval_type === 1
                          ? { code: 1, name: "All Data" }
                          : e?.approval_type === 2
                          ? { code: 2, name: "Department Only" }
                          : null
                      }
                      options={[
                        { code: 1, name: "All Data" },
                        { code: 2, name: "Department Only" },
                      ]}
                      optionLabel="name"
                      onChange={(a) => {
                        onChangeType(e, a.value.code);
                      }}
                      placeholder="Pilih Type"
                    />
                  </div>
                )}
              />
              <Column
                header=""
                className="align-text-top"
                field={""}
                style={{
                  width: "3rem",
                }}
                body={(e) =>
                  e.index === value.length - 1 ? (
                    <Link
                      onClick={() => {
                        onAdd(e);
                        // console.log(setup.id);
                      }}
                      className="btn btn-primary shadow btn-xs sharp"
                    >
                      <i className="fa fa-plus"></i>
                    </Link>
                  ) : (
                    <Link
                      onClick={() => {
                        onRemove(e);
                      }}
                      className="btn btn-danger shadow btn-xs sharp"
                    >
                      <i className="fa fa-trash"></i>
                    </Link>
                  )
                }
              />
            </DataTable>
          </>
        )}
      </div>
    );
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
              label={"Divisi"}
              value={
                user.previlage?.div_id
                  ? checkDivisi(user.previlage.div_id)
                  : null
              }
              options={divisi}
              optionLabel={"div_ccost_name"}
              onChange={(e) => {
                console.log(e);
                updateUser({
                  ...user,
                  previlage: {
                    ...user.previlage,
                    div_id: e.value.id,
                  },
                });
              }}
              filter
              filterBy={"div_ccost_name"}
              placeholder="Pilih Divisi"
            />
          </div>

          <div className="col-3 ">
            <PrimeDropdown
              label={"Department"}
              value={
                user.previlage?.dep_id
                  ? checkDepartement(user.previlage.dep_id)
                  : null
              }
              options={pusatBiaya}
              optionLabel={"ccost_name"}
              onChange={(e) => {
                console.log(e.value);
                updateUser({
                  ...user,
                  previlage: {
                    ...user.previlage,
                    dep_id: e.value.id,
                  },
                });
              }}
              filter
              filterBy={"ccost_name"}
              placeholder="Pilih Department"
            />
          </div>
          <div className="d-flex flex-column px-3 py-2">
            <label className="text-label">Akses Data</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  user.previlage?.access_type === 1
                    ? { code: 1, name: "All Data" }
                    : user.previlage?.access_type === 2
                    ? { code: 2, name: "Department Only" }
                    : null
                }
                options={[
                  { code: 1, name: "All Data" },
                  { code: 2, name: "Department Only" },
                ]}
                onChange={(e) => {
                  if (e.value?.code) {
                    updateUser({
                      ...user,
                      previlage: {
                        ...user.previlage,
                        access_type: e.value.code,
                      },
                    });
                  }
                }}
                optionLabel="name"
              />
            </div>
          </div>
          <div className="d-flex col-3 align-items-center mt-4">
            <InputSwitch
              className="mr-3"
              checked={user.previlage?.approver}
              onChange={(e) => {
                updateUser({
                  ...user,
                  previlage: {
                    ...user.previlage,
                    approver: e.value,
                  },
                  approval_settings: !e.value ? null : user.approval_settings,
                });
              }}
            />
            <label className="mr-3 mt-1">{"Approver"}</label>
          </div>

          {user?.previlage?.approver && (
            <>
              <div className="col-12 mt-1">
                <span className="fs-13">
                  <b>Approver Settings</b>
                </span>
                <Divider className="mt-1"></Divider>
              </div>

              {renderApprovalAccess(
                user?.approval_settings ?? [null],
                (e, value) => {
                  let temp = user?.approval_settings ?? [null];
                  temp[e.index] = {
                    ...temp[e.index],
                    approval_level: value,
                  };

                  updateUser({
                    ...user,
                    approval_settings: temp,
                  });
                },
                (e, value) => {
                  let temp = user?.approval_settings ?? [null];
                  temp[e.index] = {
                    ...temp[e.index],
                    approval_module: value,
                  };

                  updateUser({
                    ...user,
                    approval_settings: temp,
                  });
                },
                (e, value) => {
                  let temp = user?.approval_settings ?? [null];
                  temp[e.index] = {
                    ...temp[e.index],
                    approval_type: value,
                  };

                  updateUser({
                    ...user,
                    approval_settings: temp,
                  });
                },
                false,
                (e) => {
                  let temp = user?.approval_settings ?? [null];
                  temp.push(null);

                  updateUser({
                    ...user,
                    approval_settings: temp,
                  });
                },
                (e) => {
                  let temp = user?.approval_settings;
                  temp.splice(e.index, 1);

                  updateUser({
                    ...user,
                    approval_settings: temp,
                  });
                }
              )}
            </>
          )}

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
