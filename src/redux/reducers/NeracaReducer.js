import { SET_FILTER_DATE } from "../actions";


const initialState = {
  filter_date: null,
};

const SRReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FILTER_DATE:
      return {
        ...state,
        filter_date: payload,
      };
    
    default:
      return state;
  }
};

export default SRReducer;