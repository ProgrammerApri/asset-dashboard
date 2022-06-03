import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_INV, SET_EDIT_INV, SET_INV } from "src/redux/actions";
import { Badge } from "primereact/badge";

const data = {
  id: null,
  fk_code: null,
  fk_date: null,
  fk_tax: null,
  fk_ppn: null,
  fk_lunas: null,
  ord_id: null,
  product: [],
  jasa: [],
};

const DataFaktur = ({ onAdd, onEdit }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  //   const pinv = useSelector((state) => state.pinv.pinv);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getDO();
    initFilters1();
  }, []);

  const getDO = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.do,
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
        dispatch({ type: SET_INV, payload: data });
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

  const delDO = async (id) => {
    const config = {
      ...endpoints.delDO,
      //   endpoint: endpoints.delDO.endpoint + pinv.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayDel(false);
          getDO(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Dihapus",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setDisplayDel(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Data`,
          life: 3000,
        });
      }, 500);
    }
  };

  // const actionBodyTemplate = (data) => {
  //   return (
  //     // <React.Fragment>
  //     <div className="d-flex">
  //       <Link
  //         onClick={() => {
  //           onEdit(data);
  //           let dprod = data.dprod;
  //           dispatch({
  //             type: SET_EDIT_DO,
  //             payload: true,
  //           });
  //           dprod.forEach((el) => {
  //             el.prod_id = el.prod_id.id;
  //             el.unit_id = el.unit_id.id;
  //           });
  //           let djasa = data.djasa;
  //           djasa.forEach((el) => {
  //             el.jasa_id = el.jasa_id.id;
  //             el.unit_id = el.unit_id.id;
  //           });
  //           dispatch({
  //             type: SET_CURRENT_DO,
  //             payload: {
  //               ...data,
  //               dep_id: data?.dep_id?.id ?? null,
  //               sup_id: data?.sup_id?.id ?? null,
  //               top: data?.top?.id ?? null,
  //               dprod:
  //                 dprod.length > 0
  //                   ? dprod
  //                   : [
  //                       {
  //                         id: 0,
  //                         do_id: null,
  //                         prod_id: null,
  //                         unit_id: null,
  //                         order: null,
  //                         price: null,
  //                         disc: null,
  //                         nett_price: null,
  //                         total: null,
  //                       },
  //                     ],
  //               djasa:
  //                 djasa.length > 0
  //                   ? djasa
  //                   : [
  //                       {
  //                         id: 0,
  //                         do_id: null,
  //                         jasa_id: null,
  //                         sup_id: null,
  //                         unit_id: null,
  //                         order: null,
  //                         price: null,
  //                         disc: null,
  //                         total: null,
  //                       },
  //                     ],
  //             },
  //           });
  //         }}
  //         className="btn btn-primary shadow btn-xs sharp ml-1"
  //       >
  //         <i className="fa fa-pencil"></i>
  //       </Link>

  //       <Link
  //         onClick={() => {
  //           setEdit(true);
  //           setDisplayDel(true);
  //           setCurrentItem(data);
  //         }}
  //         className="btn btn-danger shadow btn-xs sharp ml-1"
  //       >
  //         <i className="fa fa-trash"></i>
  //       </Link>
  //     </div>
  //     // </React.Fragment>
  //   );
  // };

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
            delDO();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
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
        <Button
          variant="primary"
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_INV,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_INV,
              payload: {
                ...data,
                product: [
                  {
                    id: 0,
                    ord_id: null,
                    prod_id: null,
                    unit_id: null,
                    order: null,
                    location: null,
                    price: null,
                    disc: null,
                    nett_price: null,
                    total: null,
                  },
                ],
                jasa: [
                  {
                    id: 0,
                    ord_id: null,
                    jasa_id: null,
                    sup_id: null,
                    unit_id: null,
                    order: null,
                    price: null,
                    disc: null,
                    total: null,
                  },
                ],
              },
            });
          }}
        >
          Tambah{" "}
          <span className="btn-icon-right">
            <i class="bx bx-plus"></i>
          </span>
        </Button>
      </div>
    );
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: "Semua", value: options.totalRecords },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Data per halaman:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} dari {options.totalRecords}
        </span>
      );
    },
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        responsiveLayout="scroll"
        // value={loading ? dummy : pinv}
        className="display w-150 datatable-wrapper"
        showGridlines
        dataKey="id"
        rowHover
        header={renderHeader}
        filters={filters1}
        globalFilterFields={["customer.cus_code"]}
        emptyMessage="Tidak ada data"
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        paginatorClassName="justify-content-end mt-3"
      >
        <Column
          header="Tanggal"
          style={{
            minWidth: "8rem",
          }}
          field={(e) => e.customer.cus_code}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nomor Pembelian"
          field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nomor Pesanan"
          field={(e) => e.customer.cus_address}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nama Supplier"
          field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="J/T"
          field={(e) => e.customer.cus_name}
          style={{ minWidth: "4rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Pembayaran"
          field={(e) => e.account.dou_type}
          style={{ minWidth: "8rem" }}
          body={(e) =>
            loading ? (
              <Skeleton />
            ) : (
              <div>
                {e.account.dou_type === "P" ? (
                  <Badge variant="success light">
                    <i className="bx bxs-circle text-success mr-1"></i> Paid
                  </Badge>
                ) : (
                  <Badge variant="info light">
                    <i className="bx bxs-circle text-info mr-1"></i> Unpaid
                  </Badge>
                )}
              </div>
            )
          }
        />
        <Column
          header="Status"
          field={(e) => e.cus_telp}
          style={{ minWidth: "6rem" }}
          body={loading && <Skeleton />}
        />
      </DataTable>

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
};

export default DataFaktur;
