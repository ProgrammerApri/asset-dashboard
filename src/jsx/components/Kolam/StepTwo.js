import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import {
  SplitButton,
  ButtonGroup,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

const StepOne = () => {
const [panjang, setPanjang] = useState(0);
const [lebar, setLebar] = useState(0);
const [luas, setLuas] = useState(0);
const [kapasitas, setKapasitas] = useState(0);

   return (
      <section>
         <div className="row">
            <div className="col-6 mb-2">
              <label className="text-label">Panjang Kolam*</label>
              <div className="col-1">
                <InputNumber inputId="panjang" placeholder="Panjang" value={panjang} onValueChange={(e) => setPanjang(e.value)} mode="decimal" showButtons min={0} max={100} />
              </div>
            </div>
           
            <div className="col-6 mb-2">
              <label className="text-label">Lebar Kolam*</label>
              <div className="col-1">
                <InputNumber inputId="lebar" placeholder="Lebar" value={lebar} onValueChange={(e) => setLebar(e.value)} mode="decimal" showButtons min={0} max={100} />
              </div>
            </div>

            <div className="col-6 mb-2">
              <label className="text-label">Luas Kolam*</label>
              <div className="col-1">
                <InputNumber inputId="luas" placeholder="Luas" value={luas} onValueChange={(e) => setLuas(e.value)} mode="decimal" showButtons min={0} max={100} />
              </div>
            </div>

            <div className="col-6">
              <label className="text-label">Kapasitas Kolam*</label>
              <div className="col-1">
                <InputNumber inputId="kapasitas" placeholder="Kapasitas" value={kapasitas} onValueChange={(e) => setKapasitas(e.value)} mode="decimal" showButtons min={0} max={100} />
              </div>
            </div>
         </div>
      </section>
   );
};

export default StepOne;
