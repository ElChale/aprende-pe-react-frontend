import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL,  messagePageSize, languageMapping } from '../utils'

const initialState = {
      suggestions:[],
      loading:false,
      error:null,
}


export const getSuggestions = createAsyncThunk("suggestions/getSuggestions", async ({ page, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/suggestions/get-suggestions/?page=${page}`, {
                  method: "GET",
                  headers: {Authorization: `Token ${token}`},
            })
            if (!response.ok) {throw new Error("Suggestions request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


export const createSuggestion = createAsyncThunk("suggestions/createSuggestion", async ({ suggestion, token }) => {
      try {
            const formData = new FormData();
            formData.append("suggestion", suggestion);
            const response = await fetch(`${BASE_URL}/api/suggestions/create-suggestion/`, {
                  method: "POST",
                  headers: {Authorization: `Token ${token}`},
                  body: formData
            })
            if (!response.ok) {throw new Error("Error al crear sugerencia")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const likeSuggestion = createAsyncThunk("suggestions/likeSuggestion", async ({ id, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/suggestions/like-suggestion/${id}/`, {
                  method: "POST",
                  headers: {Authorization: `Token ${token}`},
            })
            if (!response.ok) {throw new Error("Error al dar like")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


export const dislikeSuggestion = createAsyncThunk("suggestions/dislikeSuggestion", async ({ id, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/suggestions/dislike-suggestion/${id}/`, {
                  method: "POST",
                  headers: {Authorization: `Token ${token}`},
            })
            if (!response.ok) {throw new Error("Error al dar dislike")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});



export const unLikeSuggestion = createAsyncThunk("suggestions/unLikeSuggestion", async ({ id, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/suggestions/unlike-suggestion/${id}/`, {
                  method: "POST",
                  headers: {Authorization: `Token ${token}`},
            })
            if (!response.ok) {throw new Error("Error al quitar like")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


export const unDislikeSuggestion = createAsyncThunk("suggestions/unDislikeSuggestion", async ({ id, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/suggestions/undislike-suggestion/${id}/`, {
                  method: "POST",
                  headers: {Authorization: `Token ${token}`},
            })
            if (!response.ok) {throw new Error("Error al quitar dislike")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


// Create a userInfo slice
export const suggestionslice = createSlice({
      name: "suggestions",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
            //GET SUGGESTIONS
            .addCase(getSuggestions.pending, (state, action) => {
                  return { ...state, loading:true} 
            })
            .addCase(getSuggestions.fulfilled, (state, action) => {
                  return { ...state, suggestions:action.payload, loading:false} 
            })
            .addCase(getSuggestions.rejected, (state, action) => {
                  return { ...state, error:action.error.message, loading:false }
            })
            //CREATE SUGGESTION
            .addCase(createSuggestion.pending, (state, action) => {
                  return { ...state, loading:true} 
            })
            .addCase(createSuggestion.fulfilled, (state, action) => {
                  return { ...state, loading:false} 
            })
            .addCase(createSuggestion.rejected, (state, action) => {
                  return { ...state, error:action.error.message, loading:false }
            })
            //LIKE SUGGESTION
            .addCase(likeSuggestion.pending, (state, action) => {
                  return { ...state} 
            })
            .addCase(likeSuggestion.fulfilled, (state, action) => {
                  return { ...state, suggestions:{...state.suggestions, suggestions:state.suggestions.suggestions.map(obj => obj.id === action.payload.id ? action.payload : obj)}} 
            })
            .addCase(likeSuggestion.rejected, (state, action) => {
                  return { ...state, error:action.error.message}
            })
            //DISLIKE SUGGESTION
            .addCase(dislikeSuggestion.pending, (state, action) => {
                  return { ...state} 
            })
            .addCase(dislikeSuggestion.fulfilled, (state, action) => {
                  return { ...state, suggestions:{...state.suggestions, suggestions:state.suggestions.suggestions.map(obj => obj.id === action.payload.id ? action.payload : obj)}} 
            })
            .addCase(dislikeSuggestion.rejected, (state, action) => {
                  return { ...state, error:action.error.message}
            })
            //UNLIKE SUGGESTION
            .addCase(unLikeSuggestion.pending, (state, action) => {
                  return { ...state} 
            })
            .addCase(unLikeSuggestion.fulfilled, (state, action) => {
                  return { ...state, suggestions:{...state.suggestions, suggestions:state.suggestions.suggestions.map(obj => obj.id === action.payload.id ? action.payload : obj)}} 
            })
            .addCase(unLikeSuggestion.rejected, (state, action) => {
                  return { ...state, error:action.error.message}
            })
            //UNDISLIKE SUGGESTION
            .addCase(unDislikeSuggestion.pending, (state, action) => {
                  return { ...state} 
            })
            .addCase(unDislikeSuggestion.fulfilled, (state, action) => {
                  return { ...state, suggestions:{...state.suggestions, suggestions:state.suggestions.suggestions.map(obj => obj.id === action.payload.id ? action.payload : obj)}} 
            })
            .addCase(unDislikeSuggestion.rejected, (state, action) => {
                  return { ...state, error:action.error.message}
            })
      },
});

export default suggestionslice.reducer





