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
const [value7, setValue7] = useState(null);
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
              <label className="text-label">ID Kolam*</label>
              <div className="p-inputgroup">
               <span className="p-inputgroup-addon">
                  <i className="pi pi-id-card"></i>
                </span>
                   <InputText placeholder="ID Kolam" />
              </div>
            </div>

            <div className="col-12 mb-2">
              <label className="text-label">Nama Kolam*</label>
              <div className="p-inputgroup">
               <span className="p-inputgroup-addon">
                  <i className="pi pi-water"></i>
                </span>
                   <InputText placeholder="Nama Kolam" />
              </div>
            </div>
           
            <div className="col-12 mb-2">
               <label className="text-label">Lokasi Kolam*</label>
                <div className="p-dropdown-addon">
                    <Dropdown inputId="dropdown" value={value7} options={cities} onChange={(e) => setValue7(e.value)} optionLabel="name" className="p-invalid" />
                </div>
            </div>

            <div className="col-12 mb-2">
              <label className="text-label">Alamat Kolam*</label>
              <div className="p-inputgroup">
               <span className="p-inputgroup-addon">
                  <i className="pi pi-card-id"></i>
                </span>
                   <InputText placeholder="Alamat Kolam" />
              </div>
            </div>
         </div>
      </section>
   );
};

export default StepOne;
