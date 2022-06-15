import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_GIRO } from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataBank from "src/jsx/components/MasterLainnya/Bank/DataBank";

const PencairanGiroMundurList = ({ onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doubleClick, setDoubleClick] = useState(false);
  const toast = useRef(null);
  const giro = useSelector((state) => state.giro.current);
  const isEdit = useSelector((state) => state.giro.editGiro);
  const dispatch = useDispatch();
  const [bank, setBank] = useState(null);
  const [showBank, setShowBank] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getBank();
    initFilters1();
  }, []);

  const getBank = async () => {
    const config = {
      ...endpoints.bank,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setBank(data);
      }
    } catch (error) {}
  };

  const editGiro = async () => {
    const config = {
      ...endpoints.editGiro,
      endpoint: endpoints.editGiro.endpoint + giro.id,
      data: giro,
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

  const addGiro = async () => {
    const config = {
      ...endpoints.addGiro,
      data: giro,
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
            detail: `Kode ${giro.giro_code} Sudah Digunakan`,
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

  const checkBank = (value) => {
    let selected = {};
    bank?.forEach((element) => {
      if (value === element.bank.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editGiro();
    } else {
      setUpdate(true);
      addGiro();
    }
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

  const updateGR = (e) => {
    dispatch({
      type: SET_CURRENT_GIRO,
      payload: e,
    });
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label="Batal"
            onClick={() => setDisplayData(false)}
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

  // const renderHeader = () => {
  //   return (
  //     <div className="flex justify-content-between">
  //       <span className="p-input-icon-left">
  //         <i className="pi pi-search" />
  //         <InputText
  //           // value={globalFilterValue1}
  //           // onChange={onGlobalFilterChange1}
  //           placeholder="Cari disini"
  //         />
  //       </span>
  //       <Button
  //         variant="primary"
  //         onClick={() => {
  //           onAdd();
  //         }}
  //       >
  //         Tambah{" "}
  //         <span className="btn-icon-right">
  //           <i class="bx bx-plus"></i>
  //         </span>
  //       </Button>
  //     </div>
  //   );
  // };

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

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  return (
    <>
      <DataTable
        responsiveLayout="scroll"
        value={null}
        className="display w-150 datatable-wrapper"
        showGridlines
        dataKey="id"
        rowHover
        header={null}
        filters={filters1}
        globalFilterFields={["customer.cus_code"]}
        emptyMessage="Tidak ada data"
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        doubleClick={displayData}
        paginatorClassName="justify-content-end mt-3"
      >
        <Column
          header="Tanggal Pencairan"
          style={{
            minWidth: "8rem",
          }}
          // field={(e) => e.customer.cus_code}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nomer Giro"
          // field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
           body={loading && <Skeleton />}
        />
        <Column
          header="Bank"
          // field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
           body={loading && <Skeleton />}
        />
        <Column
          header="Kode Pembayaran"
          // field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
           body={loading && <Skeleton />}
        />
        <Column
          header="Tanggal Pembayaran"
          // field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
           body={loading && <Skeleton />}
        />
        <Column
          header="Pemasok"
          // field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
           body={loading && <Skeleton />}
        />
        <Column
          header="Nilai"
          // field={(e) => e.customer.cus_address}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
      </DataTable>

      <Dialog
        header={"Pencairan Giro"}
        visible={displayData}
        style={{ width: "40vw" }}
        footer={footer}
        onHide={() => {
          isEdit(false);
          setDisplayData(false);
        }}
      >
        <Row className="mb-4">
          <div className="col-4">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${giro.giro_date}Z`)}
                onChange={(e) => {
                  updateGR({ ...giro, giro_date: e.value });
                }}
                placeholder="Tanggal Pencairan"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Nomor Giro</label>
            <div className="p-inputgroup">
              <InputText
                value={giro.giro_code}
                onChange={(e) =>
                  updateGR({ ...giro, giro_code: e.target.value })
                }
                placeholder="Nomor Giro"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Nilai Giro</label>
            <div className="p-inputgroup">
              <InputText
                value={giro.giro_value}
                onChange={(e) =>
                  updateGR({ ...giro, giro_value: e.target.value })
                }
                placeholder="Nilai Giro"
                type="number"
                min={0}
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Kode Bank</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={giro.bank_code && checkBank(giro.bank_code)}
              option={bank}
              onChange={(e) => updateGR({ ...giro, bank_code: e.target.value })}
              label={"[bank.BANK_NAME] ([bank.BANK_CODE])"}
              placeholder="Pilih Kode Bank"
              detail
              onDetail={() => setShowBank(true)}
            />
          </div>
        </Row>
      </Dialog>
    </>
  );
};

export default PencairanGiroMundurList;
