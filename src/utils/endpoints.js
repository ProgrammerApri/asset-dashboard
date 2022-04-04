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

    editAkun: {
        endpoint: "/v1/api/akun/",
        method: "PUT",
        data: {},
    },

    addAkun: {
        endpoint: "/v1/api/akun",
        method: "POST",
        data: {},
    },
};

export default endpoints;