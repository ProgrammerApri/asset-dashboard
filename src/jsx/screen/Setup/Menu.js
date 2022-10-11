import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FilterMatchMode } from "primereact/api";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Button as PButton } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { endpoints, request } from "src/utils";
import { InputSwitch } from "primereact/inputswitch";
import { useDispatch } from "react-redux";
import { SET_CURRENT_PROFILE } from "src/redux/actions";

const data = {
  id: 0,
  name: "",
  route_name: "",
  visible: true,
  parent_id: null,
  category: null,
  icon_file: "",
};

const category = [
  { id: 1, name: "Dashboard" },
  { id: 2, name: "Master" },
  { id: 3, name: "Transaksi" },
  { id: 4, name: "Laporan" },
  { id: 5, name: "Lainnya" },
];

export default function Menu() {
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [rows2, setRows2] = useState(20);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [displayInput, setDisplayInput] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [current, setCurrent] = useState(data);
  const [menu, setMenu] = useState(null);
  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getMenu();
    initFilters1();
  }, []);

  const addMenu = async () => {
    setLoadingSubmit(true);
    const config = {
      ...endpoints.addMenu,
      data: current,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        setTimeout(() => {
          setLoadingSubmit(false);
          setDisplayInput(false);
          getMenu();
          getProfile();
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Ditambahkan",
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
          getProfile();
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

  const dispatch = useDispatch();

  const getProfile = async () => {
    const config = {
      ...endpoints.getProfile,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        dispatch({ type: SET_CURRENT_PROFILE, payload: data });
      }
    } catch (error) {}
    
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };


  const onSubmit = () => {
    if (isEdit) {
      editMenu(current);
    } else {
      addMenu();
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayInput(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
          loading={loadingSubmit}
        />
      </div>
    );
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            // delAreaPen();
          }}
          autoFocus
          loading={loadingSubmit}
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Cari disini"
          />
        </span>
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            setEdit(false);
            setCurrent(data);
            setDisplayInput(true);
          }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (data) => {
    return (
      <div className="d-flex">
        <Link
          onClick={() => {
            setEdit(true);
            setDisplayInput(true);
            setCurrent(data);
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrent(data);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
    );
  };

  const glTemplate = (option) => {
    if (option.level === 2) {
      return (
        <div className="">{option !== null ? `└─ ${option.name}` : ""}</div>
      );
    } else if (option.level === 3) {
      return (
        <div className="ml-4">{option !== null ? `└─ ${option.name}` : ""}</div>
      );
    }
    return <div>{option !== null ? ` ${option.name}` : ""}</div>;
  };

  const valTemp = (option, props) => {
    if (option) {
      return <div>{option !== null ? `${option.name}` : ""}</div>;
    }

    return <span>{props.placeholder}</span>;
  };

  const checkMenu = (value) => {
    let selected = null;
    menu?.forEach((el) => {
      if (el.id === value) {
        selected = el;
      }
    });

    return selected;
  };

  const checkCategory = (value) => {
    let selected = null;
    category.forEach((el) => {
      if (el.id === value) {
        selected = el;
      }
    });

    return selected;
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : menu}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="name"
                rowHover
                header={renderHeader}
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
                  header="Visible"
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
                            temp[menu.findIndex(obj => obj.id === e.id)].visible = v.value;
                            setMenu(temp)
                            editMenu({...e, visible: v.value})
                        }}
                      />
                    )
                  }
                />
                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ width: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={isEdit ? "Edit Menu" : "Tambah Menu"}
        visible={displayInput}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          setDisplayInput(false);
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-6">
            <label className="text-label">Nama</label>
            <div className="p-inputgroup">
              <InputText
                value={current?.name ?? ""}
                onChange={(e) => {
                  setCurrent({ ...current, name: e.target.value });
                }}
                placeholder="Masukan Nama Menu"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Route</label>
            <div className="p-inputgroup">
              <InputText
                value={current?.route_name ?? ""}
                onChange={(e) => {
                  setCurrent({ ...current, route_name: e.target.value });
                }}
                placeholder="Masukan Endpoint"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Parent Menu</label>
            <div className="p-inputgroup">
              <Dropdown
                value={checkMenu(current.parent_id)}
                options={menu}
                onChange={(e) => {
                  setCurrent({
                    ...current,
                    parent_id: e.value?.id,
                    category: e.value?.category,
                  });
                }}
                placeholder="Pilih Parent Menu"
                optionLabel="name"
                itemTemplate={glTemplate}
                valueTemplate={valTemp}
                filter
                filterBy="name"
                showClear
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Kategori Menu</label>
            <div className="p-inputgroup">
              <Dropdown
                value={checkCategory(current.category)}
                options={category}
                onChange={(e) => {
                  setCurrent({ ...current, category: e.value.id });
                }}
                placeholder="Pilih Kategori Menu"
                optionLabel="name"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Icon Name</label>
            <div className="p-inputgroup">
              <InputText
                value={current?.icon_file ?? ""}
                onChange={(e) => {
                  setCurrent({ ...current, icon_file: e.target.value });
                }}
                placeholder="Masukan Icon Name"
              />
            </div>
          </div>
          <i class={`mt-4 pt-3 fs-32 ${current.icon_file}`}></i>
        </div>
      </Dialog>

      <Dialog
        header={"Hapus Data"}
        visible={displayDel}
        style={{ width: "30vw" }}
        footer={renderFooterDel("displayDel")}
        onHide={() => {
          setDisplayDel(false);
        }}
      >
        <div className="ml-3 mr-3">
          <i
            className="pi pi-exclamation-triangle mr-3 align-middle"
            style={{ fontSize: "2rem" }}
          />
          <span>Apakah anda yakin ingin menghapus data ?</span>
        </div>
      </Dialog>
    </>
  );
}
