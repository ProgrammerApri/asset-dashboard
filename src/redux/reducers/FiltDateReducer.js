import {
  SET_FILTDATE_KSRING,
  SET_FILTDATE_KSRIN,
  SET_FILTDATE_KSSAL,
  SET_FILTDATE_HUT,
} from "../actions";

const initialState = {
  ksring: null,
  ksrin: null,
  kssal: null,
  hut: null,
};

const FiltDateReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FILTDATE_KSRING:
      return {
        ...state,
        ksring: payload,
      };

    case SET_FILTDATE_KSRIN:
      return {
        ...state,
        ksrin: payload,
      };

    case SET_FILTDATE_KSSAL:
      return {
        ...state,
        kssal: payload,
      };

    case SET_FILTDATE_HUT:
      return {
        ...state,
        hut: payload,
      };

    default:
      return state;
  }
};

export default FiltDateReducer;
