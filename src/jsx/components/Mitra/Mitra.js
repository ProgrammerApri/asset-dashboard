import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import Customer from "./Pelanggan";
import Supplier from "./Pemasok";

const Mitra = () => {
  return (
    <TabView>
      <TabPanel header="Pelanggan">
          <Customer/>
      </TabPanel>
      <TabPanel header="Pemasok">
        <Supplier/>
      </TabPanel>
    </TabView>
  );
};

export default Mitra;
