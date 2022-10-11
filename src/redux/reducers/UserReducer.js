import { SET_CURRENT_USER, SET_USER, SET_EDIT_USER } from "../actions";


const initialState = {
  user: [],
  current: {},
  editdUser: false
};

const UserReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        current: payload,
      };
    case SET_USER:
      return {
        ...state,
        user: payload,
      };
      case SET_EDIT_USER:
        return {
          ...state,
          editdUser: payload,
        };

    default:
      return state;
  }
};

export default UserReducer;