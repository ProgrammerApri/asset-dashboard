import { SET_CURRENT_PO, SET_PO, SET_EDIT_PO } from "../actions";

const initialState = {
  po: [],
  current: {},
  editpo: false
};

const POReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PO:
      return {
        ...state,
        current: payload,
      };
    case SET_PO:
      return {
        ...state,
        po: payload,
      };
      case SET_EDIT_PO:
        return {
          ...state,
          editpo: payload,
        };

    default:
      return state;
  }
};

export default POReducer;