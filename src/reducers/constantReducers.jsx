import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL,  messagePageSize, languageMapping } from '../utils'

const constantsFromStorage = localStorage.getItem("constants") ? JSON.parse(localStorage.getItem("constants")) : {}

const initialState = {
      constants:constantsFromStorage,
      loading:false,
      error:null,
}


export const getConstants = createAsyncThunk("constants/getConstants", async () => {
      try {
            const response = await fetch(`${BASE_URL}/api/constants/get/`, {method: "GET"})
            if (!response.ok) {throw new Error("Teacher profile request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});



// Create a userInfo slice
export const constantSlice = createSlice({
      name: "constants",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
            //GET CONSTANTS
            .addCase(getConstants.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(getConstants.fulfilled, (state, action) => {
                  localStorage.setItem("constants", JSON.stringify(action.payload))
                  return { ...state, constants:action.payload, loading:false }
            })
            .addCase(getConstants.rejected, (state, action) => {
                  return { constants:{}, loading:false, error: action.error.message }
            })
            
      },
});

export default constantSlice.reducer


