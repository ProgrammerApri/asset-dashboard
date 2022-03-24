import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Slider } from "primereact/slider";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { CustomerService } from "./CustomerService";
import data from "../../../constants/data.js";
import { Card, Badge, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
// import './DataTableDemo.css';

const PaginatedTable2 = () => {
  const [customers1, setCustomers1] = useState(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [loading1, setLoading1] = useState(false);
  const representatives = [
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ];

  const statuses = [
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
    "proposal",
  ];

  useEffect(() => {
    console.log(data.data);
    setCustomers1(getCustomers(data.data));
    initFilters1();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

  const formatDate = (value) => {
    return value.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const clearFilter1 = () => {
    initFilters1();
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
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "country.name": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue1("");
  };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={clearFilter1}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="image-text">{rowData.country.name}</span>
      </React.Fragment>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    const representative = rowData.representative;
    return (
      <React.Fragment>
        <span className="image-text">{representative.name}</span>
      </React.Fragment>
    );
  };

  const representativeFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };

  const representativesItemTemplate = (option) => {
    return (
      <div className="p-multiselect-representative-option">
        <span className="image-text">{option.name}</span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.date);
  };

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return rowData.status === "new" ? (
      <Badge variant="success light">
        <i className="fa fa-circle text-success mr-1"></i>
        New
      </Badge>
    ) : rowData.status === "unqualified" ? (
      <Badge variant="danger light">
        <i className="fa fa-circle text-danger mr-1"></i>
        Unqualified
      </Badge>
    ) : rowData.status === "proposal" ? (
      <Badge variant="warning light">
        <i className="fa fa-circle text-warning mr-1"></i>
        Proposal
      </Badge>
    ) : (
        <Badge variant="warning light">
        <i className="fa fa-circle text-warning mr-1"></i>
        {rowData.status}
      </Badge>
    );
  };

  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const activityBodyTemplate = (rowData) => {
    return (
      <ProgressBar now={rowData.activity} variant="danger" />
    );
  };

  const activityFilterTemplate = (options) => {
    return (
      <React.Fragment>
        <Slider
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
          range
          className="m-3"
        ></Slider>
        <div className="flex align-items-center justify-content-between px-2">
          <span>{options.value ? options.value[0] : 0}</span>
          <span>{options.value ? options.value[1] : 100}</span>
        </div>
      </React.Fragment>
    );
  };


  const actionBodyTemplate = () => {
    return (
      <div className="d-flex">
        <Link to="#" className="btn btn-secondary shadow btn-xs sharp mr-1">
          <i className="fa fa-eye"></i>
        </Link>
        <Link to="#" className="btn btn-primary shadow btn-xs sharp mr-1">
          <i className="fa fa-pencil"></i>
        </Link>
        <Link to="#" className="btn btn-danger shadow btn-xs sharp">
          <i className="fa fa-trash"></i>
        </Link>
      </div>
    );
  };

  const header1 = renderHeader1();

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>Tes</Card.Title>
        </Card.Header>
        <Card.Body>
          <DataTable
            value={customers1}
            paginator
            className="p-datatable-customers"
            showGridlines
            rows={10}
            dataKey="id"
            filters={filters1}
            filterDisplay="menu"
            loading={loading1}
            responsiveLayout="scroll"
            globalFilterFields={[
              "name",
              "country.name",
              "representative.name",
              "balance",
              "status",
            ]}
            header={header1}
            emptyMessage="No customers found."
          >
            <Column
              field="name"
              header="Name"
              filter
              filterPlaceholder="Search by name"
              style={{ minWidth: "12rem" }}
            />
            <Column
              header="Country"
              filterField="country.name"
              style={{ minWidth: "12rem" }}
              body={countryBodyTemplate}
              filter
              filterPlaceholder="Search by country"
            />
            <Column
              header="Agent"
              filterField="representative"
              showFilterMatchModes={false}
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "14rem" }}
              body={representativeBodyTemplate}
              filter
              filterElement={representativeFilterTemplate}
            />
            <Column
              header="Date"
              filterField="date"
              dataType="date"
              style={{ minWidth: "10rem" }}
              body={dateBodyTemplate}
              filter
              filterElement={dateFilterTemplate}
            />
            <Column
              field="status"
              header="Status"
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "12rem" }}
              body={statusBodyTemplate}
              filter
              filterElement={statusFilterTemplate}
            />
            <Column
              field="activity"
              header="Activity"
              showFilterMatchModes={false}
              style={{ minWidth: "12rem" }}
              body={activityBodyTemplate}
              filter
              filterElement={activityFilterTemplate}
            />
            <Column
              header="Action"
              dataType="boolean"
              bodyClassName="text-center"
              style={{ minWidth: "8rem" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </Card.Body>
      </Card>
    </>
  );
};

export default PaginatedTable2;
