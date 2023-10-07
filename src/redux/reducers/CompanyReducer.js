import { SET_COMPANY } from "../actions";


const initialState = {
  company :null
};

const CompanyReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_COMPANY:
      return {
        ...state,
        company: payload,
      };

    default:
      return state;
  }
};

export default CompanyReducer;