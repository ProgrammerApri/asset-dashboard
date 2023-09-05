import { SET_CURRENT_RAK, SET_EDIT_RAK, SET_FILT_RAK, SET_RAK } from "../actions";

const initialState = {
  rak: [],
  current: {},
  filter: null,
  editRak: false,
};

const RAKReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_RAK:
      return {
        ...state,
        current: payload,
      };
    case SET_RAK:
      return {
        ...state,
        rak: payload,
      };
    case SET_FILT_RAK:
      return {
        ...state,
        filter: payload,
      };
    case SET_EDIT_RAK:
      return {
        ...state,
        editRak: payload,
      };

    default:
      return state;
  }
};

export default RAKReducer;
