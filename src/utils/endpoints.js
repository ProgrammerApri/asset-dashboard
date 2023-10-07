import data from "src/jsx/data";

const endpoints = {
  /// Login
  login: {
    endpoint: "/v1/api/login",
    method: "POST",
    data: {},
  },

  /// Klasifikasi
  klasifikasi: {
    endpoint: "/v1/api/klasifikasi",
    method: "GET",
    data: {},
  },

  editKlasi: {
    endpoint: "/v1/api/klasifikasi/",
    method: "PUT",
    data: {},
  },

  /// Kategori
  kategori: {
    endpoint: "/v1/api/kategory",
    method: "GET",
    data: {},
  },

  editKateg: {
    endpoint: "/v1/api/kategory/",
    method: "PUT",
    data: {},
  },

  addKateg: {
    endpoint: "/v1/api/kategory",
    method: "POST",
    data: {},
  },

  addKategImport: {
    endpoint: "/v1/api/import/kategori",
    method: "POST",
    data: {},
  },

  /// Account
  account: {
    endpoint: "/v1/api/account",
    method: "GET",
    data: {},
  },

  accountFilter: {
    endpoint: "/v1/api/account/",
    method: "GET",
    data: {},
  },

  editAccount: {
    endpoint: "/v1/api/account/",
    method: "PUT",
    data: {},
  },

  addAccount: {
    endpoint: "/v1/api/account",
    method: "POST",
    data: {},
  },

  addAccountImport: {
    endpoint: "/v1/api/import/account",
    method: "POST",
    data: {},
  },

  getAccKodeUm: {
    endpoint: "/v1/api/account/u/",
    method: "GET",
    data: {},
  },

  getAccKodeDet: {
    endpoint: "/v1/api/account/d/",
    method: "GET",
    data: {},
  },

  getAccKodeSubUmum: {
    endpoint: "/v1/api/account/su/",
    method: "GET",
    data: {},
  },

  accountUmum: {
    endpoint: "/v1/api/account/umum",
    method: "GET",
    data: {},
  },

  delAccount: {
    endpoint: "/v1/api/account/",
    method: "DELETE",
    data: {},
  },

  /// Pusat Biaya
  pusatBiaya: {
    endpoint: "/v1/api/cost-center",
    method: "GET",
    data: {},
  },

  addPusatBiaya: {
    endpoint: "/v1/api/cost-center",
    method: "POST",
    data: {},
  },

  editPusatBiaya: {
    endpoint: "/v1/api/cost-center/",
    method: "PUT",
    data: {},
  },

  delPusatBiaya: {
    endpoint: "/v1/api/cost-center/",
    method: "DELETE",
    data: {},
  },
  /// divisi Pusat Biaya
  divpusatBiaya: {
    endpoint: "/v1/api/divisi-cost-center",
    method: "GET",
    data: {},
  },

  addDivPusatBiaya: {
    endpoint: "/v1/api/divisi-cost-center",
    method: "POST",
    data: {},
  },

  editDivPusatBiaya: {
    endpoint: "/v1/api/divisi-cost-center/",
    method: "PUT",
    data: {},
  },

  delDivPusatBiaya: {
    endpoint: "/v1/api/divisi-cost-center/",
    method: "DELETE",
    data: {},
  },

  /// Project
  project: {
    endpoint: "/v1/api/project",
    method: "GET",
    data: {},
  },

  addProject: {
    endpoint: "/v1/api/project",
    method: "POST",
    data: {},
  },

  editProject: {
    endpoint: "/v1/api/project/",
    method: "PUT",
    data: {},
  },

  delProject: {
    endpoint: "/v1/api/project/",
    method: "DELETE",
    data: {},
  },

  /// Bank
  bank: {
    endpoint: "/v1/api/bank",
    method: "GET",
    data: {},
  },

  addBank: {
    endpoint: "/v1/api/bank",
    method: "POST",
    data: {},
  },

  editBank: {
    endpoint: "/v1/api/bank/",
    method: "PUT",
    data: {},
  },

  delBank: {
    endpoint: "/v1/api/bank/",
    method: "DELETE",
    data: {},
  },

  /// Jenis Pelanggan
  jenisPel: {
    endpoint: "/v1/api/jenis-pelanggan",
    method: "GET",
    data: {},
  },

  addJenisPel: {
    endpoint: "/v1/api/jenis-pelanggan",
    method: "POST",
    data: {},
  },

  editJenisPel: {
    endpoint: "/v1/api/jenis-pelanggan/",
    method: "PUT",
    data: {},
  },

  delJenisPel: {
    endpoint: "/v1/api/jenis-pelanggan/",
    method: "DELETE",
    data: {},
  },

  /// Jenis Pemasok
  jenisPemasok: {
    endpoint: "/v1/api/jenis-pemasok",
    method: "GET",
    data: {},
  },

  addJenisPem: {
    endpoint: "/v1/api/jenis-pemasok",
    method: "POST",
    data: {},
  },

  editJenisPem: {
    endpoint: "/v1/api/jenis-pemasok/",
    method: "PUT",
    data: {},
  },

  delJenisPem: {
    endpoint: "/v1/api/jenis-pemasok/",
    method: "DELETE",
    data: {},
  },

  /// Salesman
  salesman: {
    endpoint: "/v1/api/salesman",
    method: "GET",
    data: {},
  },

  addSalesman: {
    endpoint: "/v1/api/salesman",
    method: "POST",
    data: {},
  },

  editSalesman: {
    endpoint: "/v1/api/salesman/",
    method: "PUT",
    data: {},
  },

  delSalesman: {
    endpoint: "/v1/api/salesman/",
    method: "DELETE",
    data: {},
  },

  /// Area Penjualan
  areaPen: {
    endpoint: "/v1/api/area-penjualan",
    method: "GET",
    data: {},
  },

  addAreaPen: {
    endpoint: "/v1/api/area-penjualan",
    method: "POST",
    data: {},
  },

  editAreaPen: {
    endpoint: "/v1/api/area-penjualan/",
    method: "PUT",
    data: {},
  },

  delAreaPen: {
    endpoint: "/v1/api/area-penjualan/",
    method: "DELETE",
    data: {},
  },

  /// Sub Area
  subArea: {
    endpoint: "/v1/api/sub-area",
    method: "GET",
    data: {},
  },

  addSubArea: {
    endpoint: "/v1/api/sub-area",
    method: "POST",
    data: {},
  },

  editSubArea: {
    endpoint: "/v1/api/sub-area/",
    method: "PUT",
    data: {},
  },

  delSubArea: {
    endpoint: "/v1/api/sub-area/",
    method: "DELETE",
    data: {},
  },

  /// Currency
  currency: {
    endpoint: "/v1/api/currency",
    method: "GET",
    data: {},
  },

  addCurrency: {
    endpoint: "/v1/api/currency",
    method: "POST",
    data: {},
  },

  editCurrency: {
    endpoint: "/v1/api/currency/",
    method: "PUT",
    data: {},
  },

  delCurrency: {
    endpoint: "/v1/api/currency/",
    method: "DELETE",
    data: {},
  },

  /// Lokasi
  lokasi: {
    endpoint: "/v1/api/lokasi",
    method: "GET",
    data: {},
  },

  addLokasi: {
    endpoint: "/v1/api/lokasi",
    method: "POST",
    data: {},
  },

  editLokasi: {
    endpoint: "/v1/api/lokasi/",
    method: "PUT",
    data: {},
  },

  delLokasi: {
    endpoint: "/v1/api/lokasi/",
    method: "DELETE",
    data: {},
  },

  /// Rules Payment
  rules_pay: {
    endpoint: "/v1/api/rules-payment",
    method: "GET",
    data: {},
  },

  addRulesPay: {
    endpoint: "/v1/api/rules-payment",
    method: "POST",
    data: {},
  },

  editRulesPay: {
    endpoint: "/v1/api/rules-payment/",
    method: "PUT",
    data: {},
  },

  delRulesPay: {
    endpoint: "/v1/api/rules-payment/",
    method: "DELETE",
    data: {},
  },

  uploadImage: {
    endpoint: "/v1/api/upload",
    method: "POST",
    data: {},
  },

  addCompany: {
    endpoint: "/v1/api/company",
    method: "POST",
    data: {},
  },

  updateCompany: {
    endpoint: "/v1/api/company/",
    method: "PUT",
    data: {},
  },

  getCompany: {
    endpoint: "/v1/api/company",
    method: "GET",
    data: {},
  },

  getCflow: {
    endpoint: "/v1/api/setup/cflow",
    method: "GET",
    data: {},
  },

  addCflow: {
    endpoint: "/v1/api/setup/cflow",
    method: "POST",
    data: {},
  },

  editCflow: {
    endpoint: "/v1/api/setup/cflow/",
    method: "PUT",
    data: {},
  },

  getSetup: {
    endpoint: "/v1/api/setup/account",
    method: "GET",
    data: {},
  },

  addSetup: {
    endpoint: "/v1/api/setup/account",
    method: "POST",
    data: {},
  },

  editSetup: {
    endpoint: "/v1/api/setup/account/",
    method: "PUT",
    data: {},
  },

  //setup auto number
  getSetupautonumber: {
    endpoint: "/v1/api/setup/autonumber",
    method: "GET",
    data: {},
  },

  addSetupautonumber: {
    endpoint: "/v1/api/setup/autonumber",
    method: "POST",
    data: {},
  },

  updateSetupautonumber: {
    endpoint: "/v1/api/setup/autonumber/",
    method: "PUT",
    data: {},
  },

  //auto
  getAutonumber: {
    endpoint: "/v1/api/autonumber",
    method: "GET",
    data: {},
  },

  addAutonumber: {
    endpoint: "/v1/api/autonumber",
    method: "POST",
    data: {},
  },

  updateAutonumber: {
    endpoint: "/v1/api/autonumber/",
    method: "PUT",
    data: {},
  },

  // Setup Neraca

  getNeraca: {
    endpoint: "/v1/api/setup/neraca",
    method: "GET",
    data: {},
  },

  addNeraca: {
    endpoint: "/v1/api/setup/neraca",
    method: "POST",
    data: {},
  },

  editNeraca: {
    endpoint: "/v1/api/setup/neraca/",
    method: "PUT",
    data: {},
  },

  // setup neraca exceptions

  getNeracaException: {
    endpoint: "/v1/api/setup/neraca/exception",
    method: "GET",
    data: {},
  },

  addNeracaException: {
    endpoint: "/v1/api/setup/neraca/exception",
    method: "POST",
    data: {},
  },

  editNeracaException: {
    endpoint: "/v1/api/setup/neraca/exception/",
    method: "PUT",
    data: {},
  },

  // Setup P/L

  getPnl: {
    endpoint: "/v1/api/setup/pnl",
    method: "GET",
    data: {},
  },

  addPnl: {
    endpoint: "/v1/api/setup/pnl",
    method: "POST",
    data: {},
  },

  editPnl: {
    endpoint: "/v1/api/setup/pnl/",
    method: "PUT",
    data: {},
  },
  delPnl: {
    endpoint: "/v1/api/setup/pnl/",
    method: "DELETE",
    data: {},
  },
  // Rak

  getRak: {
    endpoint: "/v1/api/rak",
    method: "GET",
    data: {},
  },

  addRak: {
    endpoint: "/v1/api/rak",
    method: "POST",
    data: {},
  },

  editRak: {
    endpoint: "/v1/api/rak/",
    method: "PUT",
    data: {},
  },
  delRak: {
    endpoint: "/v1/api/rak/",
    method: "DELETE",
    data: {},
  },

  //report setup
  reportPnl: {
    endpoint: "/v1/api/report/pnl/",
    method: "GET",
    data: {},
  },

  editCustomer: {
    endpoint: "/v1/api/customer/",
    method: "PUT",
    data: {},
  },

  customer_code: {
    endpoint: "/v1/api/customer/generate-code",
    method: "GET",
    data: {},
  },
  customer: {
    endpoint: "/v1/api/customer",
    method: "GET",
    data: {},
  },

  addCustomer: {
    endpoint: "/v1/api/customer",
    method: "POST",
    data: {},
  },

  delCustomer: {
    endpoint: "/v1/api/customer/",
    method: "DELETE",
    data: {},
  },

  /// Supplier
  supplier_code: {
    endpoint: "/v1/api/supplier/generate-code",
    method: "GET",
    data: {},
  },
  supplier: {
    endpoint: "/v1/api/supplier",
    method: "GET",
    data: {},
  },

  addSupplier: {
    endpoint: "/v1/api/supplier",
    method: "POST",
    data: {},
  },

  editSupplier: {
    endpoint: "/v1/api/supplier/",
    method: "PUT",
    data: {},
  },

  delSupplier: {
    endpoint: "/v1/api/supplier/",
    method: "DELETE",
    data: {},
  },

  /// City
  city: {
    endpoint: "/v1/api/city",
    method: "GET",
    data: {},
  },

  /// Divisi
  divisi: {
    endpoint: "/v1/api/divisi",
    method: "GET",
    data: {},
  },

  addDivisi: {
    endpoint: "/v1/api/divisi",
    method: "POST",
    data: {},
  },

  editDivisi: {
    endpoint: "/v1/api/divisi/",
    method: "PUT",
    data: {},
  },

  delDivisi: {
    endpoint: "/v1/api/divisi/",
    method: "DELETE",
    data: {},
  },

  /// Group Produk
  groupPro: {
    endpoint: "/v1/api/group-product",
    method: "GET",
    data: {},
  },

  addGroupPro: {
    endpoint: "/v1/api/group-product",
    method: "POST",
    data: {},
  },

  editGroupPro: {
    endpoint: "/v1/api/group-product/",
    method: "PUT",
    data: {},
  },

  delGroupPro: {
    endpoint: "/v1/api/group-product/",
    method: "DELETE",
    data: {},
  },

  getSatuan: {
    endpoint: "/v1/api/unit",
    method: "GET",
    data: {},
  },

  /// Produk

  product: {
    endpoint: "/v1/api/product",
    method: "GET",
    data: {},
  },

  product_code: {
    endpoint: "/v1/api/product/code/",
    method: "GET",
    data: {},
  },
  product_generate_code: {
    endpoint: "/v1/api/product/generate-code",
    method: "GET",
    data: {},
  },

  addSatuan: {
    endpoint: "/v1/api/unit",
    method: "POST",
    data: {},
  },

  addProduct: {
    endpoint: "/v1/api/product",
    method: "POST",
    data: {},
  },

  updateSatuan: {
    endpoint: "/v1/api/unit/",
    method: "PUT",
    data: {},
  },

  editProduct: {
    endpoint: "/v1/api/product/",
    method: "PUT",
    data: {},
  },

  deleteSatuan: {
    endpoint: "/v1/api/unit/",
    method: "DELETE",
    data: {},
  },

  convertSatuan: {
    endpoint: "/v1/api/unit-konversi",
    method: "POST",
    data: {},
  },

  delProduct: {
    endpoint: "/v1/api/product/",
    method: "DELETE",
    data: {},
  },

  /// Pajak
  pajak: {
    endpoint: "/v1/api/pajak",
    method: "GET",
    data: {},
  },

  addPajak: {
    endpoint: "/v1/api/pajak",
    method: "POST",
    data: {},
  },

  editPajak: {
    endpoint: "/v1/api/pajak/",
    method: "PUT",
    data: {},
  },

  delPajak: {
    endpoint: "/v1/api/pajak/",
    method: "DELETE",
    data: {},
  },

  /// Jasa
  jasa: {
    endpoint: "/v1/api/jasa",
    method: "GET",
    data: {},
  },

  addJasa: {
    endpoint: "/v1/api/jasa",
    method: "POST",
    data: {},
  },

  editJasa: {
    endpoint: "/v1/api/jasa/",
    method: "PUT",
    data: {},
  },

  delJasa: {
    endpoint: "/v1/api/jasa/",
    method: "DELETE",
    data: {},
  },

  /// Request Puechase
  getStatusRP: {
    endpoint: "/v1/api/rp/status",
    method: "GET",
    data: {},
  },

  codePurchase: {
    endpoint: "/v1/api/rp/code",
    method: "GET",
    data: {},
  },

  rPurchase: {
    endpoint: "/v1/api/rp",
    method: "GET",
    data: {},
  },

  addRp: {
    endpoint: "/v1/api/rp",
    method: "POST",
    data: {},
  },

  editRp: {
    endpoint: "/v1/api/rp/",
    method: "PUT",
    data: {},
  },

  delRp: {
    endpoint: "/v1/api/rp/",
    method: "DELETE",
    data: {},
  },

  approveRp: {
    endpoint: "/v1/api/approval/rp/",
    method: "PUT",
    data: {},
  },

  rejectRp: {
    endpoint: "/v1/api/reject/rp/",
    method: "PUT",
    data: {},
  },

  /// PO

  getStatusPO: {
    endpoint: "/v1/api/po/status",
    method: "GET",
    data: {},
  },
  kodepo: {
    endpoint: "/v1/api/po/code",
    method: "GET",
    data: {},
  },

  po: {
    endpoint: "/v1/api/po",
    method: "GET",
    data: {},
  },

  addPO: {
    endpoint: "/v1/api/po",
    method: "POST",
    data: {},
  },

  editPO: {
    endpoint: "/v1/api/po/",
    method: "PUT",
    data: {},
  },

  delPO: {
    endpoint: "/v1/api/po/",
    method: "DELETE",
    data: {},
  },

  closePO: {
    endpoint: "/v1/api/po-close/",
    method: "PUT",
    data: {},
  },

  approvePo: {
    endpoint: "/v1/api/approval/po/",
    method: "PUT",
    data: {},
  },

  rejectPo: {
    endpoint: "/v1/api/reject/po/",
    method: "PUT",
    data: {},
  },

  /// SO
  so: {
    endpoint: "/v1/api/so",
    method: "GET",
    data: {},
  },

  addSO: {
    endpoint: "/v1/api/so",
    method: "POST",
    data: {},
  },

  editSO: {
    endpoint: "/v1/api/so/",
    method: "PUT",
    data: {},
  },

  delSO: {
    endpoint: "/v1/api/so/",
    method: "DELETE",
    data: {},
  },

  closeSO: {
    endpoint: "/v1/api/so-close/",
    method: "PUT",
    data: {},
  },

  /// Record Activity
  recordActCode: {
    endpoint: "/v1/api/record-activity/code",
    method: "GET",
    data: {},
  },
  recordActStatus: {
    endpoint: "/v1/api/record-activity/status",
    method: "GET",
    data: {},
  },
  recordAct: {
    endpoint: "/v1/api/record-activity",
    method: "GET",
    data: {},
  },

  addRecordAct: {
    endpoint: "/v1/api/record-activity",
    method: "POST",
    data: {},
  },

  editRecordAct: {
    endpoint: "/v1/api/record-activity/",
    method: "PUT",
    data: {},
  },

  delRecordAct: {
    endpoint: "/v1/api/record-activity/",
    method: "DELETE",
    data: {},
  },

  // Approval Record Activity
  approveRec: {
    endpoint: "/v1/api/approval/rec-activity/",
    method: "PUT",
    data: {},
  },

  rejectRec: {
    endpoint: "/v1/api/reject/rec-activity/",
    method: "PUT",
    data: {},
  },

  /// so
  getStatusSO: {
    endpoint: "/v1/api/so/status",
    method: "GET",
    data: {},
  },

  getcode_SO: {
    endpoint: "/v1/api/so/code",
    method: "GET",
    data: {},
  },
  /// DP
  getStatusGRA: {
    endpoint: "/v1/api/order/status",
    method: "GET",
    data: {},
  },

  getcode_invoice: {
    endpoint: "/v1/api/invoicepb/code",
    method: "GET",
    data: {},
  },

  getcode_retursl: {
    endpoint: "/v1/api/retursale/code",
    method: "GET",
    data: {},
  },

  getstatus_retursl: {
    endpoint: "/v1/api/retursale/status",
    method: "GET",
    data: {},
  },


  getcode_mutasi: {
    endpoint: "/v1/api/mutasi/code",
    method: "GET",
    data: {},
  },

  getstatus_mutasi: {
    endpoint: "/v1/api/mutasi/status",
    method: "GET",
    data: {},
  },

  getcode_memorial: {
    endpoint: "/v1/api/memorial/code",
    method: "GET",
    data: {},
  },

  getstatus_memorial: {
    endpoint: "/v1/api/memorial/status",
    method: "GET",
    data: {},
  },



 

  getcode_returpb: {
    endpoint: "/v1/api/returpb/code",
    method: "GET",
    data: {},
  },

  getstatus_returpb: {
    endpoint: "/v1/api/returpb/status",
    method: "GET",
    data: {},
  },

  getstatus_invoice: {
    endpoint: "/v1/api/invoice-pb/status",
    method: "GET",
    data: {},
  },

  getcode_order: {
    endpoint: "/v1/api/order/code",
    method: "GET",
    data: {},
  },

  order: {
    endpoint: "/v1/api/order",
    method: "GET",
    data: {},
  },

  addODR: {
    endpoint: "/v1/api/order",
    method: "POST",
    data: {},
  },

  editODR: {
    endpoint: "/v1/api/order/",
    method: "PUT",
    data: {},
  },

  delODR: {
    endpoint: "/v1/api/order/",
    method: "DELETE",
    data: {},
  },

  approveGra: {
    endpoint: "/v1/api/approval/gra/",
    method: "PUT",
    data: {},
  },

  rejectGra: {
    endpoint: "/v1/api/reject/gra/",
    method: "PUT",
    data: {},
  },

  /// Invoice Pembelian
  invoice_pb: {
    endpoint: "/v1/api/invoice-pb",
    method: "GET",
    data: {},
  },

  editInvPb: {
    endpoint: "/v1/api/invoice-pb/",
    method: "PUT",
    data: {},
  },

  addInvPb: {
    endpoint: "/v1/api/invoice-pb",
    method: "POST",
    data: {},
  },

  delInvPb: {
    endpoint: "/v1/api/invoice-pb/",
    method: "DELETE",
    data: {},
  },

  /// Faktur
  faktur: {
    endpoint: "/v1/api/faktur-pb",
    method: "GET",
    data: {},
  },

  editFK: {
    endpoint: "/v1/api/faktur-pb/",
    method: "PUT",
    data: {},
  },

  addFK: {
    endpoint: "/v1/api/faktur-pb",
    method: "POST",
    data: {},
  },

  fakturCode: {
    endpoint: "/v1/api/faktur/code",
    method: "GET",
    data: {},
  },

  delFK: {
    endpoint: "/v1/api/faktur-pb/",
    method: "DELETE",
    data: {},
  },

  /// Retur-Beli
  retur_order: {
    endpoint: "/v1/api/retur-order",
    method: "GET",
    data: {},
  },

  addPr: {
    endpoint: "/v1/api/retur-order",
    method: "POST",
    data: {},
  },

  editPr: {
    endpoint: "/v1/api/retur-order/",
    method: "PUT",
    data: {},
  },

  delPr: {
    endpoint: "/v1/api/retur-order/",
    method: "DELETE",
    data: {},
  },

  /// Penjualan
  status_sale: {
    endpoint: "/v1/api/sale/status",
    method: "GET",
    data: {},
  },
  code_sale: {
    endpoint: "/v1/api/sale/code",
    method: "GET",
    data: {},
  },
  sale: {
    endpoint: "/v1/api/sales",
    method: "GET",
    data: {},
  },

  addSale: {
    endpoint: "/v1/api/sales",
    method: "POST",
    data: {},
  },

  editSales: {
    endpoint: "/v1/api/sales/",
    method: "PUT",
    data: {},
  },

  delSales: {
    endpoint: "/v1/api/sales/",
    method: "DELETE",
    data: {},
  },

  /// Invoice Penjualan
 
  status_invoicepj: {
    endpoint: "/v1/api/invoice-pj/status",
    method: "GET",
    data: {},
  },

  code_invoicepj: {
    endpoint: "/v1/api/invoice-pj/code",
    method: "GET",
    data: {},
  },

  invoice_pj: {
    endpoint: "/v1/api/invoice-pj",
    method: "GET",
    data: {},
  },

  addInvPj: {
    endpoint: "/v1/api/invoice-pj",
    method: "POST",
    data: {},
  },

  editInvPj: {
    endpoint: "/v1/api/invoice-pj/",
    method: "PUT",
    data: {},
  },

  delInvPj: {
    endpoint: "/v1/api/invoice-pj/",
    method: "DELETE",
    data: {},
  },

  /// Faktur Penjualan
  getfaktur_pj: {
    endpoint: "/v1/api/fakturpj/status",
    method: "GET",
    data: {},
  },
  getfaktur_pjcode: {
    endpoint: "/v1/api/fakturpj/code",
    method: "GET",
    data: {},
  },

  faktur_pj: {
    endpoint: "/v1/api/faktur-pj",
    method: "GET",
    data: {},
  },

  addFkPj: {
    endpoint: "/v1/api/faktur-pj",
    method: "POST",
    data: {},
  },

  editFkPj: {
    endpoint: "/v1/api/faktur-pj/",
    method: "PUT",
    data: {},
  },

  delFkPj: {
    endpoint: "/v1/api/faktur-pj/",
    method: "DELETE",
    data: {},
  },

  /// Expense
  expenseStatus: {
    endpoint: "/v1/api/pengeluaran/status",
    method: "GET",
    data: {},
  },
  
  expenseCode: {
    endpoint: "/v1/api/pengeluaran/code",
    method: "GET",
    data: {},
  },
  
  expense: {
    endpoint: "/v1/api/expense",
    method: "GET",
    data: {},
  },

  addEXP: {
    endpoint: "/v1/api/expense",
    method: "POST",
    data: {},
  },

  editEXP: {
    endpoint: "/v1/api/expense/",
    method: "PUT",
    data: {},
  },

  delEXP: {
    endpoint: "/v1/api/expense/",
    method: "DELETE",
    data: {},
  },

  exp_sisa: {
    endpoint: "/v1/api/sisa-exp",
    method: "GET",
    data: {},
  },

  /// Income
  incomeCode: {
    endpoint: "/v1/api/pemasukan-uang-masuk/code",
    method: "GET",
    data: {},
  },
  incomeStatus: {
    endpoint: "/v1/api/pemasukan-uang-masuk/status",
    method: "GET",
    data: {},
  },
  income: {
    endpoint: "/v1/api/income",
    method: "GET",
    data: {},
  },

  addINC: {
    endpoint: "/v1/api/income",
    method: "POST",
    data: {},
  },

  editINC: {
    endpoint: "/v1/api/income/",
    method: "PUT",
    data: {},
  },

  delINC: {
    endpoint: "/v1/api/income/",
    method: "DELETE",
    data: {},
  },

  inc_sisa: {
    endpoint: "/v1/api/sisa-inc",
    method: "GET",
    data: {},
  },

  //User
  user: {
    endpoint: "/v1/api/user",
    method: "GET",
    data: {},
  },
  addUSER: {
    endpoint: "/v1/api/user",
    method: "POST",
    data: {},
  },
  editUSER: {
    endpoint: "/v1/api/user/",
    method: "PUT",
    data: {},
  },
  delUSER: {
    endpoint: "/v1/api/user/",
    method: "DELETE",
    data: {},
  },

  /// Retur-Jual
  retur_sale: {
    endpoint: "/v1/api/retur-sales",
    method: "GET",
    data: {},
  },

  addSR: {
    endpoint: "/v1/api/retur-sales",
    method: "POST",
    data: {},
  },

  editSR: {
    endpoint: "/v1/api/retur-sales/",
    method: "PUT",
    data: {},
  },

  delSR: {
    endpoint: "/v1/api/retur-sales/",
    method: "DELETE",
    data: {},
  },

  /// APCARD
  apcard: {
    endpoint: "/v1/api/apcard",
    method: "GET",
    data: {},
  },

  /// ARCARD
  arcard: {
    endpoint: "/v1/api/arcard",
    method: "GET",
    data: {},
  },

  /// GIRO
  giro: {
    endpoint: "/v1/api/giro",
    method: "GET",
    data: {},
  },

  editGiro: {
    endpoint: "/v1/api/giro/",
    method: "PUT",
    data: {},
  },

  /// GIRO INCOME
  giro_inc: {
    endpoint: "/v1/api/giro-inc",
    method: "GET",
    data: {},
  },

  editGr: {
    endpoint: "/v1/api/giro-inc/",
    method: "PUT",
    data: {},
  },

  dashboard: {
    endpoint: "/v1/api/dashboard-info",
    method: "GET",
    data: {},
  },

  // ord_gra: {
  //   endpoint: "/v1/api/order",
  //   method: "GET",
  //   data: {},
  // },

  ord_date: {
    endpoint: "/v1/api/order/date",
    method: "POST",
    data: {},
  },

  // Report Jurnal
  reportJurnal: {
    endpoint: "/v1/api/report/jurnal/",
    method: "GET",
    data: {},
  },

  trans: {
    endpoint: "/v1/api/trans",
    method: "GET",
    data: {},
  },

  st_card: {
    endpoint: "/v1/api/stcard",
    method: "GET",
    data: {},
  },

  price_history: {
    endpoint: "/v1/api/price-history",
    method: "GET",
    data: {},
  },

  /// Koreksi Persediaan
  ic: {
    endpoint: "/v1/api/ic",
    method: "GET",
    data: {},
  },

  addIC: {
    endpoint: "/v1/api/ic",
    method: "POST",
    data: {},
  },

  editIC: {
    endpoint: "/v1/api/ic/",
    method: "PUT",
    data: {},
  },
  delIC: {
    endpoint: "/v1/api/ic/",
    method: "DELETE",
    data: {},
  },

  /// Pemakaian Bahan
  pb: {
    endpoint: "/v1/api/pb",
    method: "GET",
    data: {},
  },

  addPB: {
    endpoint: "/v1/api/pb",
    method: "POST",
    data: {},
  },

  editPB: {
    endpoint: "/v1/api/pb/",
    method: "PUT",
    data: {},
  },
  delPB: {
    endpoint: "/v1/api/pb/",
    method: "DELETE",
    data: {},
  },

  /// Penerimaan Hasil Jadi
  getcode_phj: {
    endpoint: "/v1/api/phj/code",
    method: "GET",
    data: {},
  },

  getstatus_phj: {
    endpoint: "/v1/api/phj/status",
    method: "GET",
    data: {},
  },


  phj: {
    endpoint: "/v1/api/phj",
    method: "GET",
    data: {},
  },

  addPHJ: {
    endpoint: "/v1/api/phj",
    method: "POST",
    data: {},
  },

  editPHJ: {
    endpoint: "/v1/api/phj/",
    method: "PUT",
    data: {},
  },

  delPHJ: {
    endpoint: "/v1/api/phj/",
    method: "DELETE",
    data: {},
  },

  /// Pembebanan
  getcode_pbb: {
    endpoint: "/v1/api/pbb/code",
    method: "GET",
    data: {},
  },

  getstatus_pbb: {
    endpoint: "/v1/api/pbb/status",
    method: "GET",
    data: {},
  },

  pbb: {
    endpoint: "/v1/api/pbb",
    method: "GET",
    data: {},
  },

  addPBB: {
    endpoint: "/v1/api/pbb",
    method: "POST",
    data: {},
  },

  editPBB: {
    endpoint: "/v1/api/pbb/",
    method: "PUT",
    data: {},
  },

  delPBB: {
    endpoint: "/v1/api/pbb/",
    method: "DELETE",
    data: {},
  },

  //setup auto number
  getNumber: {
    endpoint: "/v1/api/numb",
    method: "GET",
    data: {},
  },

 
  addNumber: {
    endpoint: "/v1/api/numb",
    method: "POST",
    data: {},
  },

  updateNumber: {
    endpoint: "/v1/api/numb/",
    method: "PUT",
    data: {},
  },

  /// Jenis Kerja
  Jeniskerja: {
    endpoint: "/v1/api/jenis-pekerjaan",
    method: "GET",
    data: {},
  },

  addJeniskerja: {
    endpoint: "/v1/api/jenis-pekerjaan",
    method: "POST",
    data: {},
  },

  editJeniskerja: {
    endpoint: "/v1/api/jenis-pekerjaan/",
    method: "PUT",
    data: {},
  },

  delJeniskerja: {
    endpoint: "/v1/api/jenis-pekerjaan/",
    method: "DELETE",
    data: {},
  },

  /// Mesin
  code_mesin: {
    endpoint: "/v1/api/mesin/code",
    method: "GET",
    data: {},
  },
  status_mesin: {
    endpoint: "/v1/api/mesin/status",
    method: "GET",
    data: {},
  },
  mesin: {
    endpoint: "/v1/api/mesin",
    method: "GET",
    data: {},
  },

  addMesin: {
    endpoint: "/v1/api/mesin",
    method: "POST",
    data: {},
  },

  editMesin: {
    endpoint: "/v1/api/mesin/",
    method: "PUT",
    data: {},
  },

  delMesin: {
    endpoint: "/v1/api/mesin/",
    method: "DELETE",
    data: {},
  },

  cleanMesin: {
    endpoint: "/v1/api/clean-mesin/",
    method: "PUT",
    data: {},
  },

  /// Formula
  formula_code: {
    endpoint: "/v1/api/formula/code",
    method: "GET",
    data: {},
  },
  formula_status: {
    endpoint: "/v1/api/formula/status",
    method: "GET",
    data: {},
  },
  formula: {
    endpoint: "/v1/api/formula",
    method: "GET",
    data: {},
  },

  addFormula: {
    endpoint: "/v1/api/formula",
    method: "POST",
    data: {},
  },

  editFormula: {
    endpoint: "/v1/api/formula/",
    method: "PUT",
    data: {},
  },

  delFormula: {
    endpoint: "/v1/api/formula/",
    method: "DELETE",
    data: {},
  },

  /// Planning
  planning_code: {
    endpoint: "/v1/api/planning/code",
    method: "GET",
    data: {},
  },
  planning_status: {
    endpoint: "/v1/api/planning/status",
    method: "GET",
    data: {},
  },
  planning: {
    endpoint: "/v1/api/planning",
    method: "GET",
    data: {},
  },

  addPlan: {
    endpoint: "/v1/api/planning",
    method: "POST",
    data: {},
  },

  editPlan: {
    endpoint: "/v1/api/planning/",
    method: "PUT",
    data: {},
  },

  delPlan: {
    endpoint: "/v1/api/planning/",
    method: "DELETE",
    data: {},
  },

  /// Batch
  batch_code: {
    endpoint: "/v1/api/batch/code",
    method: "GET",
    data: {},
  },
  batch_status: {
    endpoint: "/v1/api/batch/status",
    method: "GET",
    data: {},
  },
  batch: {
    endpoint: "/v1/api/batch",
    method: "GET",
    data: {},
  },

  addBatch: {
    endpoint: "/v1/api/batch",
    method: "POST",
    data: {},
  },

  editBatch: {
    endpoint: "/v1/api/batch/",
    method: "PUT",
    data: {},
  },

  delBatch: {
    endpoint: "/v1/api/batch/",
    method: "DELETE",
    data: {},
  },

  // memorial
  memorial: {
    endpoint: "/v1/api/memorial",
    method: "GET",
    data: {},
  },

  addMemorialImport: {
    endpoint: "/v1/api/import/memorial",
    method: "POST",
    data: {},
  },

  addMM: {
    endpoint: "/v1/api/memorial",
    method: "POST",
    data: {},
  },

  editMM: {
    endpoint: "/v1/api/memorial/",
    method: "PUT",
    data: {},
  },

  delMM: {
    endpoint: "/v1/api/memorial/",
    method: "DELETE",
    data: {},
  },

  // /// Pembebanan
  mutasi: {
    endpoint: "/v1/api/mutasi",
    method: "GET",
    data: {},
  },

  addMutasi: {
    endpoint: "/v1/api/mutasi",
    method: "POST",
    data: {},
  },

  editMutasi: {
    endpoint: "/v1/api/mutasi/",
    method: "PUT",
    data: {},
  },

  delMutasi: {
    endpoint: "/v1/api/mutasi/",
    method: "DELETE",
    data: {},
  },

  // RPBB_REPORT
  rpbb: {
    endpoint: "/v1/api/rpbb",
    method: "GET",
    data: {},
  },

  //
  sto_loc: {
    endpoint: "/v1/api/sto/",
    method: "GET",
    data: {},
  },

  sto: {
    endpoint: "/v1/api/sto",
    method: "GET",
    data: {},
  },

  addMenu: {
    endpoint: "/v1/api/menu",
    method: "POST",
    data: {},
  },

  getMenu: {
    endpoint: "/v1/api/menu",
    method: "GET",
    data: {},
  },

  editMenu: {
    endpoint: "/v1/api/menu/",
    method: "PUT",
    data: {},
  },

  deleteMenu: {
    endpoint: "/v1/api/menu/",
    method: "DELETE",
    data: {},
  },

  getProfile: {
    endpoint: "/v1/api/myprofile",
    method: "GET",
    data: {},
  },

  getAccess: {
    endpoint: "/v1/api/akses-menu",
    method: "GET",
    data: {},
  },

  getImage: {
    endpoint: "/v1/api/upload/",
    method: "GET",
    data: {},
  },

  getUser: {
    endpoint: "/v1/api/user",
    method: "GET",
    data: {},
  },

  // Koreksi Hutang
  korHutCode: {
    endpoint: "/v1/api/koreksi-hutang/code",
    method: "GET",
    data: {},
  },

  korHutStatus: {
    endpoint: "/v1/api/koreksi-hutang/status",
    method: "GET",
    data: {},
  },

  korHut: {
    endpoint: "/v1/api/koreksi-hut",
    method: "GET",
    data: {},
  },

  addKorHut: {
    endpoint: "/v1/api/koreksi-hut",
    method: "POST",
    data: {},
  },

  editKorHut: {
    endpoint: "/v1/api/koreksi-hut/",
    method: "PUT",
    data: {},
  },

  delKorHut: {
    endpoint: "/v1/api/koreksi-hut/",
    method: "DELETE",
    data: {},
  },

  // Koreksi Piutang
  korPiuCode: {
    endpoint: "/v1/api/koreksi-piutang/code",
    method: "GET",
    data: {},
  },
  korPiuStatus: {
    endpoint: "/v1/api/koreksi-piutang/status",
    method: "GET",
    data: {},
  },
  korPiu: {
    endpoint: "/v1/api/koreksi-piu",
    method: "GET",
    data: {},
  },
  getKorper: {
    endpoint: "/v1/api/koreksi-persediaan/code",
    method: "GET",
    data: {},
  },
  getKorper_status: {
    endpoint: "/v1/api/koreksi-persediaan/status",
    method: "GET",
    data: {},
  },
  addKorSto: {
    endpoint: "/v1/api/koreksi-sto",
    method: "POST",
    data: {},
  },
  editKorSto: {
    endpoint: "/v1/api/koreksi-sto/",
    method: "PUT",
    data: {},
  },
  delKorSto: {
    endpoint: "/v1/api/koreksi-sto/",
    method: "DELETE",
    data: {},
  },
  getKorSto: {
    endpoint: "/v1/api/koreksi-sto",
    method: "GET",
    data: {},
  },

  addKorPiu: {
    endpoint: "/v1/api/koreksi-piu",
    method: "POST",
    data: {},
  },

  editKorPiu: {
    endpoint: "/v1/api/koreksi-piu/",
    method: "PUT",
    data: {},
  },

  delKorPiu: {
    endpoint: "/v1/api/koreksi-piu/",
    method: "DELETE",
    data: {},
  },

  // Budget
  budgeting: {
    endpoint: "/v1/api/budget",
    method: "GET",
    data: {},
  },

  add_budgeting: {
    endpoint: "/v1/api/budgeting",
    method: "POST",
    data: {},
  },

  edit_budget: {
    endpoint: "/v1/api/budgeting",
    method: "PUT",
    data: {},
  },

  // Saldo Awal GL
  saldo_sa_gl: {
    endpoint: "/v1/api/saldo-awal-gl",
    method: "GET",
    data: {},
  },

  add_sa_gl: {
    endpoint: "/v1/api/saldo-awal-gl",
    method: "POST",
    data: {},
  },

  edit_sa_gl: {
    endpoint: "/v1/api/saldo-awal-gl",
    method: "PUT",
    data: {},
  },

  saldo_sa_gl_sts: {
    endpoint: "/v1/api/saldo-awal-gl/status",
    method: "GET",
    data: {},
  },

  // Saldo Awal Inv
  saldo_sa_inv: {
    endpoint: "/v1/api/saldo-awal-inv",
    method: "GET",
    data: {},
  },

  add_sa_inv: {
    endpoint: "/v1/api/saldo-awal-inv",
    method: "POST",
    data: {},
  },

  // Saldo Awal AP
  saldo_sa_ap: {
    endpoint: "/v1/api/saldo-awal-ap",
    method: "GET",
    data: {},
  },

  addSA_ap: {
    endpoint: "/v1/api/saldo-awal-ap",
    method: "POST",
    data: {},
  },

  editSA_ap: {
    endpoint: "/v1/api/saldo-awal-ap/",
    method: "PUT",
    data: {},
  },

  delSA_ap: {
    endpoint: "/v1/api/saldo-awal-ap/",
    method: "DELETE",
    data: {},
  },

  // Saldo Awal AR
  saldo_sa_ar: {
    endpoint: "/v1/api/saldo-awal-ar",
    method: "GET",
    data: {},
  },

  addSA_ar: {
    endpoint: "/v1/api/saldo-awal-ar",
    method: "POST",
    data: {},
  },

  editSA_ar: {
    endpoint: "/v1/api/saldo-awal-ar/",
    method: "PUT",
    data: {},
  },

  delSA_ar: {
    endpoint: "/v1/api/saldo-awal-ar/",
    method: "DELETE",
    data: {},
  },

  // Posting
  getYear: {
    endpoint: "/v1/api/posting/ym",
    method: "GET",
    data: {},
  },

  posting: {
    endpoint: "/v1/api/posting",
    method: "GET",
    data: {},
  },

  addPost: {
    endpoint: "/v1/api/posting",
    method: "POST",
    data: {},
  },

  unpost: {
    endpoint: "/v1/api/saldo-awal-ar/",
    method: "GET",
    data: {},
  },

  transferGl: {
    endpoint: "/v1/api/posting/transfer",
    method: "POST",
    data: {},
  },

  closing: {
    endpoint: "/v1/api/closing/",
    method: "GET",
    data: {},
  },

  // Setup Saldo Akhir
  getSetupSa: {
    endpoint: "/v1/api/setup/saldo-akhir",
    method: "GET",
    data: {},
  },

  addSetupSa: {
    endpoint: "/v1/api/setup/saldo-akhir",
    method: "POST",
    data: {},
  },

  editSetupSa: {
    endpoint: "/v1/api/setup/saldo-akhir/",
    method: "PUT",
    data: {},
  },

  // Saldo Akhir
  saldoAkhir: {
    endpoint: "/v1/api/saldo-akhir",
    method: "GET",
    data: {},
  },

  addSaldoAkhir: {
    endpoint: "/v1/api/saldo-akhir",
    method: "POST",
    data: {},
  },

  // Work Center
  work_center: {
    endpoint: "/v1/api/work-center",
    method: "GET",
    data: {},
  },

  addWorkCenter: {
    endpoint: "/v1/api/work-center",
    method: "POST",
    data: {},
  },

  editWorkCenter: {
    endpoint: "/v1/api/work-center/",
    method: "PUT",
    data: {},
  },

  delWorkCenter: {
    endpoint: "/v1/api/work-center/",
    method: "DELETE",
    data: {},
  },

  // Clean Up Monitoring
  cleanUpMonitoring: {
    endpoint: "/v1/api/clean-up-monitoring",
    method: "GET",
    data: {},
  },

};

export default endpoints;
