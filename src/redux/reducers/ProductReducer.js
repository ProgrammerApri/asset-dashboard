import { SET_PRODUCT } from "../actions";

const initialState = {
  product: []
};

const ProductReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PRODUCT:
      return {
        ...state,
        product: payload,
      };
    
    default:
      return state;
  }
};

export default ProductReducer;