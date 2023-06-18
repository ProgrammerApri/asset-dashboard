import { SET_CURRENT_BU, SET_EDIT_BU, SET_BU } from "../actions";

const initialState = {
  bu: [],
  curr_bu: {},
  edit_bu: false,
};

const BudgetingReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_BU:
      return {
        ...state,
        curr_bu: payload,
      };
    case SET_BU:
      return {
        ...state,
        bu: payload,
      };
    case SET_EDIT_BU:
      return {
        ...state,
        edit_bu: payload,
      };

    default:
      return state;
  }
};

export default BudgetingReducer;
