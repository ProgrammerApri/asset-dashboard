import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "@material-ui/core";



const ReturBeliList = ({onAdd}) => {

    const [displayData, setDisplayData] = useState(false);

    const renderHeader = () => {
        return (
          <div className="flex justify-content-between">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                // value={globalFilterValue1}
                // onChange={onGlobalFilterChange1}
                placeholder="Cari disini"
              />
            </span>
            <Button
              variant="primary"
              onClick={() => {
                onAdd()
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
   
    return (
      <>
        
        <Row>
          <Col className="pt-0">
           
                <DataTable
                  responsiveLayout="scroll"
                  value={null}
                  className="display w-150 datatable-wrapper"
                  showGridlines
                  dataKey="id"
                  rowHover
                  header={renderHeader}
                  filters={null}
                  globalFilterFields={["customer.cus_code"]}
                  emptyMessage="Tidak ada data"
                  paginator
                  paginatorTemplate={template2}
                  first={null}
                  rows={null}
                  onPage={null}
                  paginatorClassName="justify-content-end mt-3"
                >
                  <Column
                    header="Tanggal"
                    style={{
                      minWidth: "8rem",
                    }}
                   // field={(e) => e.customer.cus_code}
                   // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Nomor Retur Pembelian"
                   // field={(e) => e.customer.cus_name}
                    style={{ minWidth: "8rem" }}
                  //  body={loading && <Skeleton />}
                  />
                  <Column
                    header="Nomor Faktur"
                   // field={(e) => e.customer.cus_address}
                    style={{ minWidth: "8rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Nama Supplier"
                   // field={(e) => e.customer.cus_name}
                    style={{ minWidth: "8rem" }}
                    // body={loading && <Skeleton />}
                  />
                  {/* <Column
                    header="J/T"
                   // field={(e) => e.customer.cus_name}
                    style={{ minWidth: "4rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Pembayaran"
                    field={(e) => e.account.dou_type}
                    style={{ minWidth: "8rem" }}
                    // body={(e) =>
                    //   loading ? (
                    //     <Skeleton />
                    //   ) : (
                    //     <div>
                    //       {e.account.dou_type === "P" ? (
                    //         <Badge variant="success light">
                    //           <i className="bx bxs-circle text-success mr-1"></i>{" "}
                    //           Paid
                    //         </Badge>
                    //       ) : (
                    //         <Badge variant="info light">
                    //           <i className="bx bxs-circle text-info mr-1"></i>{" "}
                    //           Unpaid
                    //         </Badge>
                    //       )}
                    //     </div>
                    //   )
                    // }
                  /> */}
                  {/* <Column
                    header="Status"
                    field={(e) => e.cus_telp}
                    style={{ minWidth: "6rem" }}
                   // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Action"
                    dataType="boolean"
                    bodyClassName="text-center"
                    style={{ minWidth: "2rem" }}
                    //body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                  /> */}
                </DataTable>
            
          </Col>
        </Row>
  
        {/* <Dialog
          header={isEdit ? "Edit Data Faktur" : "Tambah Data Faktur"}
          visible={displayData}
          style={{ width: "50vw" }}
          footer={renderFooter("displayData")}
          onHide={() => {
            setEdit(false);
            setDisplayData(false);
          }}
        >
         
        </Dialog> */}
  
        {/* <Dialog
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
        </Dialog> */}
      </>
    );
  };
  
  export default ReturBeliList;