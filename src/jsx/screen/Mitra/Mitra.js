import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import Customer from "./Pelanggan";
import Supplier from "./Pemasok";
import { tr } from "src/data/tr";

const Mitra = () => {
  return (
    <TabView>
      <TabPanel header={tr[localStorage.getItem("language")].customer}>
          <Customer/>
      </TabPanel>
      <TabPanel header={tr[localStorage.getItem("language")].supplier}>
        <Supplier/>
      </TabPanel>
    </TabView>
  );
};

export default Mitra;
