import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "react-bootstrap";

const Pengguna = () => {
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

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
        <Row className="mr-1">
          <Button variant="primary" onClick={() => {}}>
            Tambah{" "}
            <span className="btn-icon-right">
              <i class="bx bx-plus"></i>
            </span>
          </Button>
        </Row>
      </div>
    );
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <DataTable
              responsive
              value={null}
              className="display w-100 datatable-wrapper"
              showGridlines
              dataKey="id"
              rowHover
              header={renderHeader}
              emptyMessage="Tidak ada data"
              paginator
              paginatorTemplate={template2}
              first={first2}
              rows={rows2}
              onPage={onCustomPage2}
              paginatorClassName="justify-content-end mt-3"
            >
              <Column
                field="id"
                header="Username"
                style={{
                  width: "10rem",
                }}
                //   body={loading && <Skeleton />}
              />
              <Column
                header="Email"
                field="klasiname"
                style={{ minWidth: "10rem" }}
                //   body={loading && <Skeleton />}
              />
              <Column
                header="Perusahaan"
                field="klasiname"
                style={{ minWidth: "10rem" }}
                //   body={loading && <Skeleton />}
              />
              <Column
                header="Hak Akses"
                field="klasiname"
                style={{ minWidth: "10rem" }}
                //   body={loading && <Skeleton />}
              />
              <Column
                header="Action"
                dataType="boolean"
                bodyClassName="text-center"
                style={{ minWidth: "2rem" }}
                //   body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
              />
            </DataTable>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Pengguna;
