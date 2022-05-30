import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import Faktur from "./Faktur";
import RequestPurchase from "./RequestPurchase";
import PermintaanPO from "./PO";
import ReturBeli from "./ReturBeli";
import DataDirectOr from "./DO";


const TransaksiPembelian = () => {
  return (
    <TabView>
      <TabPanel header="Permintaan Pembelian (RP)">
          <RequestPurchase/>
      </TabPanel>
      <TabPanel header="Pesanan Pembelian (PO)">
        <PermintaanPO/>
      </TabPanel>
      <TabPanel header="Pembelian Langsung">
        <DataDirectOr/>
      </TabPanel>
      <TabPanel header="Faktur">
        <Faktur/>
      </TabPanel>
      <TabPanel header="Retur Pembelian">
        <ReturBeli/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPembelian;
