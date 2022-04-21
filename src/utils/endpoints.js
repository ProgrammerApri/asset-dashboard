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

  /// Customer
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

  editCustomer: {
    endpoint: "/v1/api/customer/",
    method: "PUT",
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
};

export default endpoints;
