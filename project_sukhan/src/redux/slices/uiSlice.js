import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  zenMode: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    enableZenMode(state) {
      state.zenMode = true;
    },
    disableZenMode(state) {
      state.zenMode = false;
    },
    toggleZenMode(state) {
      state.zenMode = !state.zenMode;
    }
  }
});

export const {
  enableZenMode,
  disableZenMode,
  toggleZenMode
} = uiSlice.actions;

export default uiSlice.reducer;
