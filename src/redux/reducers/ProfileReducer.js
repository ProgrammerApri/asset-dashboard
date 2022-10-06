import { SET_CURRENT_PROFILE } from "../actions";


const initialState = {
  profile: null,
};

const ProfileReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_PROFILE:
      return {
        ...state,
        profile: payload,
      };

    default:
      return state;
  }
};

export default ProfileReducer;