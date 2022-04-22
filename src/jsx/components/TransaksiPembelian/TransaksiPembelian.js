import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import PermintaanPembelian from "./PermintaanPembelian";
import PesananPO from "./PesananPembelian";
import PembelianPC from "./PembelianPC";
import PembelianLangsung from "./PembelianLangsung";
import Faktur from "./Faktur";

const TransaksiPembelian = () => {
  return (
    <TabView>
      <TabPanel header="Permintaan Pembelian">
          <PermintaanPembelian/>
      </TabPanel>
      <TabPanel header="Pesanan Pembelian PO">
        <PesananPO/>
      </TabPanel>
      <TabPanel header="Pembelian Dengan PC">
        <PembelianPC/>
      </TabPanel>
      <TabPanel header="Pembelian Langsung">
        <PembelianLangsung/>
      </TabPanel>
      <TabPanel header="Faktur">
        <Faktur/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPembelian;
