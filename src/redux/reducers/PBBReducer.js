import { SET_CURRENT_PBB, SET_PBB, SET_EDIT_PBB } from "../actions";


const initialState = {
  pbb: [],
  current: {},
  editPbb: false
};

const PBBReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PBB:
      return {
        ...state,
        current: payload,
      };
    case SET_PBB:
      return {
        ...state,
        pbb: payload,
      };
      case SET_EDIT_PBB:
        return {
          ...state,
          editPbb: payload,
        };

    default:
      return state;
  }
};

export default PBBReducer;