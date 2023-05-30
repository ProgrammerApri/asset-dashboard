import React from "react";
import Perusahaan from "./Perusahaan";
import { TabView, TabPanel } from 'primereact/tabview';
import Penjualan from "./Penjualan";
import Pembelian from "./Pembelian";
import SetupAkun from "./SetupAkun";
import SetupNeraca from "./SetupNeraca";
import SetupPnl from "./SetupPnl";
import Menu from "./Menu";
import InputPengguna from "./SetupPenggunaa/InputPengguna";
import Pengguna from "./SetupPenggunaa/Pengguna";
import SetupPenggunaa from "./SetupPenggunaa";
import SetupSaldoAkhir from "./SetupSaldoAkhir";
import SetupPnl2 from "./SetupPnl2";
import SetupCashFlow from "./setupCashFlow";
import SetupAutoNumber from "./SetupAutoNumber";
import SetupAutoNumbercopy from "./SetupAutoNumbercopy";

const Setup = () => {
  return (
    <TabView>
      <TabPanel header="Perusahaan">
          <Perusahaan/>
      </TabPanel>
      <TabPanel header="Penjualan">
        <Penjualan/>
      </TabPanel>
      <TabPanel header="Pembelian">
        <Pembelian/>
      </TabPanel>
      <TabPanel header="Pengguna">
        <SetupPenggunaa/>
      </TabPanel>
      <TabPanel header="Menu">
        <Menu/>
      </TabPanel>
      <TabPanel header="Setup Akun">
        <SetupAkun/>
      </TabPanel>
      <TabPanel header="Setup Neraca">
        <SetupNeraca/>
      </TabPanel>
      <TabPanel header="Arus Kas Tidak Langsung ">
        <SetupCashFlow />
      </TabPanel>
      {/* <TabPanel header="Setup P/L">
        <SetupPnl/>
      </TabPanel> */}
      <TabPanel header="Setup P/L">
        <SetupPnl2/>
      </TabPanel>
      <TabPanel header="Setup Saldo Akhir">
        <SetupSaldoAkhir/>
      </TabPanel>
      <TabPanel header="Setup Auto Number">
        <SetupAutoNumber/>
      </TabPanel>
      {/* <TabPanel header="Setup Auto Number">
        <SetupAutoNumbercopy/>
      </TabPanel> */}
    </TabView>
  );
};

export default Setup;
