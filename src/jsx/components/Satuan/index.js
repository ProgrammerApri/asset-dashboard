import React, { useState, useEffect, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import DataSatuan from "./Satuan";
import Konversi from "./Konversi";



const Satuan = () => {
    return <TabView>
    <TabPanel header="Data Satuan" >
      <DataSatuan/>
    </TabPanel>

    <TabPanel header="Konversi Satuan">
      <Konversi/>
    </TabPanel>
  </TabView>
}

export default Satuan