import data from "src/jsx/data";

const endpoints = {
  /// Login
  login: {
    endpoint: "/v1/api/login",
    method: "POST",
    data: {},
  },

  /// Klasifikasi
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

};

export default endpoints;
