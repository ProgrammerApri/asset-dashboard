import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import RequestPurchase from "./RequestPurchase";
import PermintaanPO from "./PO";
import ReturBeli from "./ReturBeli";
import FakturPembelian from "./FakturPembelian";
import Order from "./Order";


const TransaksiPembelian = () => {
  return (
    <TabView>
      <TabPanel header="Permintaan Pembelian (RP)">
          <RequestPurchase/>
      </TabPanel>
      <TabPanel header="Pesanan Pembelian (PO)">
        <PermintaanPO/>
      </TabPanel>
      <TabPanel header="Pembelian">
        <Order/>
      </TabPanel>
      <TabPanel header="Faktur">
        <FakturPembelian/>
      </TabPanel>
      <TabPanel header="Retur Pembelian">
        <ReturBeli/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPembelian;
