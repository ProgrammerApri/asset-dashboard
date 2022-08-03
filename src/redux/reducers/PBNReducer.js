import { SET_CURRENT_PBN, SET_EDIT_PBN, SET_PBN } from "../actions";


const initialState = {
  pbn: [],
  current: {},
  editPbn: false
};

const PBNReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PBN:
      return {
        ...state,
        current: payload,
      };
    case SET_PBN:
      return {
        ...state,
        pbn: payload,
      };
      case SET_EDIT_PBN:
        return {
          ...state,
          editPbn: payload,
        };

    default:
      return state;
  }
};

export default PBNReducer;