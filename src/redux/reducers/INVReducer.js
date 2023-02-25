import {
  SET_CURRENT_FK,
  SET_CURRENT_INV,
  SET_CURRENT_INVPJ,
  SET_CURRENT_PB_FK,
  SET_EDIT_FK,
  SET_EDIT_INV,
  SET_EDIT_INVPJ,
  SET_EDIT_PB_FK,
  SET_FK,
  SET_INV,
  SET_INVPJ,
  SET_PB_FK,
} from "../actions";

const initialState = {
  inv: [],
  current: {},
  editInv: false,

  fk_pb: [],
  current_pb_fk: {},
  editFkPb: false,

  fk_pj: [],
  current_fk: {},
  editFk: false,

  inv_pj: [],
  current_inv: {},
  editInvPj: false,
};

const INVReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    // Invoice Penjualan
    case SET_CURRENT_INV:
      return {
        ...state,
        current: payload,
      };
    case SET_INV:
      return {
        ...state,
        inv: payload,
      };
    case SET_EDIT_INV:
      return {
        ...state,
        editInv: payload,
      };

    // Faktur Pembelian
    case SET_CURRENT_PB_FK:
      return {
        ...state,
        current_pb_fk: payload,
      };
    case SET_PB_FK:
      return {
        ...state,
        fk_pb: payload,
      };
    case SET_EDIT_PB_FK:
      return {
        ...state,
        editFkPb: payload,
      };

    // Faktur Penjualan
    case SET_CURRENT_FK:
      return {
        ...state,
        current_fk: payload,
      };
    case SET_FK:
      return {
        ...state,
        fk_pj: payload,
      };
    case SET_EDIT_FK:
      return {
        ...state,
        editFk: payload,
      };

    // Invoice Penjualan
    case SET_CURRENT_INVPJ:
      return {
        ...state,
        current_inv: payload,
      };
    case SET_INVPJ:
      return {
        ...state,
        inv_pj: payload,
      };
    case SET_EDIT_INVPJ:
      return {
        ...state,
        editInvPj: payload,
      };

    default:
      return state;
  }
};

export default INVReducer;
