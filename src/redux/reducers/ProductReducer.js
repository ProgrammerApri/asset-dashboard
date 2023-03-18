import {
  SET_APPLY_FILTER_PRODUCT,
  SET_FILTER_PRODUCT,
  SET_ORIGINAL_PRODUCT,
  SET_PRODUCT,
} from "../actions";

const initialState = {
  list: [],
  original: [],
  filter: null,
};

const ProductReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PRODUCT:
      return {
        ...state,
        list: payload,
      };

    case SET_ORIGINAL_PRODUCT:
      return {
        ...state,
        original: payload,
      };
    case SET_FILTER_PRODUCT:
      return {
        ...state,
        filter: payload,
      };
    case SET_APPLY_FILTER_PRODUCT:
      return {
        ...state,
        list: state.filter?.groupProduct.length
          ? state.original?.filter((v) =>
              state.filter?.groupProduct?.some((el) => el.name === v.group.name)
            )
          : state.original,
      };

    default:
      return state;
  }
};

export default ProductReducer;
