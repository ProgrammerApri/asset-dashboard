const endpoints = {
    login: {
        endpoint: "/v1/api/login",
        method: "POST",
        data: {},
    },

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

};

export default endpoints;