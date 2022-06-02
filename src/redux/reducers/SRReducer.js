import { SET_CURRENT_SR, SET_SR, SET_EDIT_SR } from "../actions";


const initialState = {
  sr: [],
  current: {},
  editdSr: false
};

const SRReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_SR:
      return {
        ...state,
        current: payload,
      };
    case SET_SR:
      return {
        ...state,
        sr: payload,
      };
      case SET_EDIT_SR:
        return {
          ...state,
          editdSr: payload,
        };

    default:
      return state;
  }
};

export default SRReducer;