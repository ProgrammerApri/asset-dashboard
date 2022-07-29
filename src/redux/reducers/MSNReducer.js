import { SET_CURRENT_MSN, SET_EDIT_MSN, SET_MSN } from "../actions";


const initialState = {
  msn: [],
  current: {},
  editMsn: false
};

const MSNReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_MSN:
      return {
        ...state,
        current: payload,
      };
    case SET_MSN:
      return {
        ...state,
        msn: payload,
      };
      case SET_EDIT_MSN:
        return {
          ...state,
          editMsn: payload,
        };

    default:
      return state;
  }
};

export default MSNReducer;