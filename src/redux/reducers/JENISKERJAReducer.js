import { SET_CURRENT_JENIS_KERJA, SET_EDIT_JENIS_KERJA, SET_JENIS_KERJA } from "../actions";


const initialState = {
  jns_Kerja: [],
  current: {},
  editJnsKerja: false
};

const JENISKERJAReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_JENIS_KERJA:
      return {
        ...state,
        current: payload,
      };
    case SET_JENIS_KERJA:
      return {
        ...state,
        jns_Kerja: payload,
      };
      case SET_EDIT_JENIS_KERJA:
        return {
          ...state,
          editJnsKerja: payload,
        };

    default:
      return state;
  }
};

export default JENISKERJAReducer;