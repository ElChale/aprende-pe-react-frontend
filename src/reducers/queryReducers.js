import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, genderMapping, languageMapping } from '../utils'


const initialState = {
      teacherProfiles:{query:[], page:1, numPages:1},
      selectedTeacherProfile:{},
      selectedTeacherProfileReviews:{},
      loading:false,
      error:null,
}



export const queryRecentTeacherProfiles = createAsyncThunk("query/recetTeacherProfiles", async ({ page }) => {
      try {

            const response = await fetch(`${BASE_URL}/api/query/recent-teacher-profiles/?page=${page}`, {
                  method: "GET",
                  //headers: {Authorization: `Token ${token}`},
            })           
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const queryTeacherProfiles = createAsyncThunk("query/teacherProfiles", async ({ subject_ids, price_order, rating_order, hours_teached_order, page }) => {
      try {

            const response = await fetch(`${BASE_URL}/api/query/teacher-profiles/?subject_ids=${subject_ids}&price_order=${price_order}&rating_order=${rating_order}&hours_teached_order=${hours_teached_order}&page=${page}`, {
                  method: "GET",
                  //headers: {Authorization: `Token ${token}`},
            })           
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


export const fetchTeacherProfile = createAsyncThunk("query/teacherProfile", async ({ id, token }) => {
      try {

            const response = await fetch(`${BASE_URL}/api/teachers/get-public-profile/${id}/`, {
                  method: "GET",
                  headers: {Authorization: `Token ${token}`},
            })           
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


export const getTeacherReviews = createAsyncThunk("query/getTeacherReviews", async ({ teacher_id, page, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/get-reviews/${teacher_id}/?page=${page}`, {method: "GET", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Pagina no encontrada")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const querySlice = createSlice({
      name: "querys",
      initialState,
      reducers: {
            selectTeacherProfile: (state, action) => {
                  return { ...state, selectedTeacherProfile:action.payload }
            },
      },
      extraReducers: (builder) => {
            builder
            //QUERY TEACHERPROFILES
            .addCase(queryRecentTeacherProfiles.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(queryRecentTeacherProfiles.fulfilled, (state, action) => {
                  const { page, num_pages, teacher_profiles } = action.payload
                  return { ...state, teacherProfiles:{query:teacher_profiles, page:page, numPages:num_pages}, loading:false }
            })
            .addCase(queryRecentTeacherProfiles.rejected, (state, action) => {
                  return { ...state, teacherProfiles:{query:[], page:1, numPages:1}, loading:false, error: action.error.message }
            })
            //QUERY TEACHERPROFILES
            .addCase(queryTeacherProfiles.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(queryTeacherProfiles.fulfilled, (state, action) => {
                  const { page, num_pages, teacher_profiles } = action.payload
                  return { ...state, teacherProfiles:{query:teacher_profiles, page:page, numPages:num_pages}, loading:false }
            })
            .addCase(queryTeacherProfiles.rejected, (state, action) => {
                  return { ...state, teacherProfiles:{query:[], page:1, numPages:1}, loading:false, error: action.error.message }
            })
            //FETCH SINGLE TEACHERPROFILE
            .addCase(fetchTeacherProfile.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
                  return { ...state, selectedTeacherProfile:action.payload, loading:false }
            })
            .addCase(fetchTeacherProfile.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //FETCH TEACHERPROFILE REVIEWS
            .addCase(getTeacherReviews.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(getTeacherReviews.fulfilled, (state, action) => {
                  return { ...state, selectedTeacherProfileReviews:action.payload, loading:false }
            })
            .addCase(getTeacherReviews.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
      },
});

export const { selectTeacherProfile } = querySlice.actions;

export default querySlice.reducer
