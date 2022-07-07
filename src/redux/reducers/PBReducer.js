import { SET_CURRENT_PB, SET_PB, SET_EDIT_PB } from "../actions";


const initialState = {
  pb: [],
  current: {},
  editdPb: false
};

const PBReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PB:
      return {
        ...state,
        current: payload,
      };
    case SET_PB:
      return {
        ...state,
        pb: payload,
      };
      case SET_EDIT_PB:
        return {
          ...state,
          editdPb: payload,
        };

    default:
      return state;
  }
};

export default PBReducer;