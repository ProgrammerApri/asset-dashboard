import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import Penjualan from "./Penjualan";
import ReturPenjualan from "./ReturPenjualan";
import SalesOrder from "./SalesOrder";

const TransaksiPenjualan = () => {
  return (
    <TabView>
      <TabPanel header="Pesanan Penjualan">
          <SalesOrder/>
      </TabPanel>
      <TabPanel header="Penjualan">
          <Penjualan/>
      </TabPanel>
      <TabPanel header="Retur Penjualan">
        <ReturPenjualan/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPenjualan;
