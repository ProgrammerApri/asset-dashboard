import {
  SET_CURRENT_SA_AP,
  SET_CURRENT_SA_AR,
  SET_CURRENT_SA_INV,
  SET_EDIT_SA_AP,
  SET_EDIT_SA_AR,
  SET_EDIT_SA_INV,
  SET_SA_AP,
  SET_SA_AR,
  SET_SA_INV,
} from "../actions";

const initialState = {
  sa_inv: [],
  curr_sa_inv: {},
  edit_sa_inv: false,

  sa_ap: [],
  curr_sa_ap: {},
  edit_sa_ap: false,

  sa_ar: [],
  curr_sa_ar: {},
  edit_sa_ar: false,
};

const SaldoAwalReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_SA_INV:
      return {
        ...state,
        curr_sa_inv: payload,
      };
    case SET_SA_INV:
      return {
        ...state,
        sa_inv: payload,
      };
    case SET_EDIT_SA_INV:
      return {
        ...state,
        edit_sa_inv: payload,
      };

    case SET_CURRENT_SA_AP:
      return {
        ...state,
        curr_sa_ap: payload,
      };
    case SET_SA_AP:
      return {
        ...state,
        sa_ap: payload,
      };
    case SET_EDIT_SA_AP:
      return {
        ...state,
        edit_sa_ap: payload,
      };

    case SET_CURRENT_SA_AR:
      return {
        ...state,
        curr_sa_ar: payload,
      };
    case SET_SA_AR:
      return {
        ...state,
        sa_ar: payload,
      };
    case SET_EDIT_SA_AR:
      return {
        ...state,
        edit_sa_ar: payload,
      };

    default:
      return state;
  }
};

export default SaldoAwalReducer;
