import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL,  messagePageSize, languageMapping } from '../utils'

const categoriesFromStorage = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : { categories:[], loading:false }
const universitiesFromStorage = localStorage.getItem("universities") ? JSON.parse(localStorage.getItem("universities")) : { universities:[], loading:false }

const initialState = {
      categories:categoriesFromStorage,
      universities:universitiesFromStorage,
      error:null,
}


export const getCategories = createAsyncThunk("subjects/getCategories", async () => {
      try {
            const response = await fetch(`${BASE_URL}/api/subjects/get-regular/`, {method: "GET"})
            if (!response.ok) {throw new Error("Categories request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const getUniversities = createAsyncThunk("subjects/getUniversities", async () => {
      try {
            const response = await fetch(`${BASE_URL}/api/subjects/get-university/`, {method: "GET"})
            if (!response.ok) {throw new Error("Universities request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const getSubjects = createAsyncThunk("subjects/getSubjects", async ({ category_id, is_university_degree }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/subjects/get/${category_id}/`, {method: "GET"})
            if (!response.ok) {throw new Error("Subject request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


// Create a userInfo slice
export const subjectSlice = createSlice({
      name: "subjects",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
            builder
            //GET CATEGORIES
            .addCase(getCategories.pending, (state, action) => {
                  return { ...state, categories:{...state.categories, loading:true} }
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                  localStorage.setItem("categories", JSON.stringify(action.payload))
                  return { ...state, categories:{categories:action.payload, loading:false} }
            })
            .addCase(getCategories.rejected, (state, action) => {
                  return { ...state, categories:{ categories:[], loading:false }, error: action.error.message }
            })
            //GET UNIVERSITIES
            .addCase(getUniversities.pending, (state, action) => {
                  return { ...state, universities:{...state.universities, loading:true} }
            })
            .addCase(getUniversities.fulfilled, (state, action) => {
                  localStorage.setItem("universities", JSON.stringify(action.payload))
                  return { ...state, universities:{universities:action.payload, loading:false} }
            })
            .addCase(getUniversities.rejected, (state, action) => {
                  return { ...state, universities:{ universities:[], loading:false }, error: action.error.message }
            })
            //GET CATEGORY SUBJECTS
            .addCase(getSubjects.pending, (state, action) => {
                  let { category_id, is_university_degree } = action.meta.arg
                  if (is_university_degree) {
                        let new_universities = state.universities.universities.map((university) => ({
                              ...university,
                              degrees:university.degrees.map((obj) => obj.id == category_id ? {
                                    ...obj,
                                    subjects:[]
                              } : obj)
                        }))
                        return { ...state, universities:{universities:new_universities} }
                  } else {
                        let new_categories = state.categories.categories.map((obj) => obj.id == category_id ? {
                              ...obj,
                              subjects: []
                        } : obj) 
                        return { ...state, categories:{categories:new_categories} }
                  }
            })
            .addCase(getSubjects.fulfilled, (state, action) => {
                  let { category, subjects } = action.payload
                  if (category.is_university_degree) {
                        let new_universities = state.universities.universities.map((university) => ({
                              ...university,
                              degrees:university.degrees.map((obj) => obj.id == category.id ? {
                                    ...obj,
                                    subjects:subjects
                              } : obj)
                        }))
                        localStorage.setItem("universities", JSON.stringify(new_universities))
                        return { ...state, universities:{universities:new_universities} }
                  } else {
                        let new_categories = state.categories.categories.map((obj) => obj.id == category.id ? {
                              ...obj,
                              subjects: subjects
                        } : obj) 
                        localStorage.setItem("categories", JSON.stringify(new_categories))
                        return { ...state, categories:{categories:new_categories} }
                  }
            })
            .addCase(getSubjects.rejected, (state, action) => {
                  let { category_id, is_university_degree } = action.meta.arg
                  if (is_university_degree) {
                        let new_universities = state.universities.universities.map((university) => ({
                              ...university,
                              degrees:university.degrees.map((obj) => obj.id == category_id ? {
                                    ...obj,
                                    subjects:"Error cargando"
                              } : obj)
                        }))
                        return { ...state, universities:{universities:new_universities} }
                  } else {
                        let new_categories = state.categories.categories.map((obj) => obj.id == category_id ? {
                              ...obj,
                              subjects: "Error cargando"
                        } : obj) 
                        return { ...state, categories:{categories:new_categories} }
                  }
            })
      },
});

export default subjectSlice.reducer





