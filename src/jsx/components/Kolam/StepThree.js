import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import {
  SplitButton,
  ButtonGroup,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

const StepOne = () => {
const [idkar, setIdkar] = useState(null);
const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];

   return (
      <section>
         <div className="row">
         <div className="col-12 mb-2">
              <label className="text-label">ID Karyawan*</label>
              <div className="p-dropdown-addon">
                    <Dropdown inputId="dropdown" placeholder="ID Karyawan" value={idkar} options={cities} onChange={(e) => setIdkar(e.value)} optionLabel="name" className="p-invalid" />
                </div>
            </div>

            <div className="col-6 mb-2">
              <label className="text-label">Nama Pengelola*</label>
              <div className="p-inputgroup">
               <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                   <InputText placeholder="Nama Pengelola" />
              </div>
            </div>

            <div className="col-6 mb-2">
              <label className="text-label">*</label>
              <div className="p-inputgroup">
               <span className="p-inputgroup-addon">
                  <i className="pi pi-card-id"></i>
                </span>
                   <InputText placeholder="" />
              </div>
            </div>
         </div>
      </section>
   );
};

export default StepOne;
