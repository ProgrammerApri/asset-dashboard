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

  /// Account
  account: {
    endpoint: "/v1/api/account",
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

  editCustomer: {
    endpoint: "/v1/api/customer/",
    method: "PUT",
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

  /// PO
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

  /// DP
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

  /// Faktur
  faktur: {
    endpoint: "/v1/api/faktur",
    method: "GET",
    data: {},
  },

  editFK: {
    endpoint: "/v1/api/faktur/",
    method: "PUT",
    data: {},
  },

  addFK: {
    endpoint: "/v1/api/faktur",
    method: "POST",
    data: {},
  },

  fakturCode: {
    endpoint: "/v1/api/faktur/code",
    method: "GET",
    data: {},
  },

  delFK: {
    endpoint: "/v1/api/faktur/",
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

  /// Expense
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

  /// Mesin
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


  /// Formula
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

  // /// Pembebanan
  // pbn: {
  //   endpoint: "/v1/api/pbn",
  //   method: "GET",
  //   data: {},
  // },

  // addPbn: {
  //   endpoint: "/v1/api/pbn",
  //   method: "POST",
  //   data: {},
  // },

  // editPbn: {
  //   endpoint: "/v1/api/pbn/",
  //   method: "PUT",
  //   data: {},
  // },

  delPbn: {
    endpoint: "/v1/api/pbn/",
    method: "DELETE",
    data: {},
  },

  /// RPBB_REPORT
  rpbb: {
    endpoint: "/v1/api/rpbb",
    method: "GET",
    data: {},
  },
  // delPbn: {
  //   endpoint: "/v1/api/pbn/",
  //   method: "DELETE",
  //   data: {},
  // },
};

export default endpoints;
