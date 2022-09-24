import { SET_CURRENT_MM, SET_EDIT_MM, SET_MM } from "../actions";


const initialState = {
  memorial: [],
  current: {},
  editMemo: false
};

const MemorialReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_MM:
      return {
        ...state,
        current: payload,
      };
    case SET_MM:
      return {
        ...state,
        memorial: payload,
      };
      case SET_EDIT_MM:
        return {
          ...state,
          editMemo: payload,
        };

    default:
      return state;
  }
};

export default MemorialReducer;