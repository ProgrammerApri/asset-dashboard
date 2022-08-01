import { SET_CURRENT_BTC, SET_EDIT_BTC, SET_BTC } from "../actions";


const initialState = {
  btc: [],
  current: {},
  editBtc: false
};

const BTCReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_BTC:
      return {
        ...state,
        current: payload,
      };
    case SET_BTC:
      return {
        ...state,
        btc: payload,
      };
      case SET_EDIT_BTC:
        return {
          ...state,
          editBtc: payload,
        };

    default:
      return state;
  }
};

export default BTCReducer;