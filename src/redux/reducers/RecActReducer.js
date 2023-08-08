import { SET_CURRENT_RECACTIVITY, SET_RECACTIVITY, SET_EDIT } from "../actions";

const initialState = {
  recAct: [],
  current: {},
  editRecAct: false,
};

const RecActReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_RECACTIVITY:
      return {
        ...state,
        current: payload,
      };
    case SET_RECACTIVITY:
      return {
        ...state,
        recAct: payload,
      };
    case SET_EDIT:
      return {
        ...state,
        editRecAct: payload,
      };

    //

    default:
      return state;
  }
};

export default RecActReducer;
