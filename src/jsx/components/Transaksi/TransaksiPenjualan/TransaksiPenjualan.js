import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import ReturPenjualan from "./ReturPenjualan";
import SalesOrder from "./SalesOrder";

const TransaksiPenjualan = () => {
  return (
    <TabView>
      <TabPanel header="Sales Order">
          <SalesOrder/>
      </TabPanel>
      <TabPanel header="Retur Penjualan">
        <ReturPenjualan/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPenjualan;
