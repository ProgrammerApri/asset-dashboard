import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import PermintaanPembelian from "./RequestPurchase/PermintaanPembelian";
import PesananPO from "./PO/PesananPembelian";
import PembelianLangsung from "./PembelianLangsung";
import Faktur from "./Faktur";
import RequestPurchase from "./RequestPurchase";
import PermintaanPO from "./PO";
import ReturBeli from "./ReturBeli";


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
        <PembelianLangsung/>
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
