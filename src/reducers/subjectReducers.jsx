import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL,  messagePageSize, languageMapping } from '../utils'

const categoriesFromStorage = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : { categories:[], loading:false }
const universitiesFromStorage = localStorage.getItem("universities") ? JSON.parse(localStorage.getItem("universities")) : { universities:[], loading:false }

const initialState = {
      categories:categoriesFromStorage,
      universities:universitiesFromStorage,
      error:null,
}


export const createUniversity = createAsyncThunk("subjects/createUniversity", async ({ name, description, token }) => {
      try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);

            const response = await fetch(`${BASE_URL}/api/subjects/create-university/`, {
                  method: "POST", 
                  headers: {Authorization: `Token ${token}`},
                  body: formData
            })
            if (!response.ok) {throw new Error("Create university request failed.")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const createSubjectCategory = createAsyncThunk("subjects/createSubjectCategory", async ({ name, description, token }) => {
      try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);

            const response = await fetch(`${BASE_URL}/api/subjects/create-subjectcategory/`, {
                  method: "POST", 
                  headers: {Authorization: `Token ${token}`},
                  body: formData
            })
            if (!response.ok) {throw new Error("Create subjectcategory request failed.")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const createSubjectList = createAsyncThunk("subjects/createSubjectList", async ({ subjects, category_id, token }) => {
      try {
            let subject_list = subjects.split(/\r?\n/)
            let data = []
            for (let subject of subject_list) {
                  if(subject != ''){
                        let formData = new FormData();
                        formData.append("name", subject);
                        formData.append("description", subject);
                        formData.append("category", category_id);
                        let response = await fetch(`${BASE_URL}/api/subjects/create-subject/`, {
                              method: "POST", 
                              headers: {Authorization: `Token ${token}`},
                              body: formData
                        })
                        let subject_data = await response.json()
                        data.push(subject_data)
                  }
            }
            return data
      } catch (error) {
            throw error;
      }
});

export const createUniversityDegree = createAsyncThunk("subjects/createUniversityDegree", async ({ degrees, university_id, token }) => {
      try {
            let degree_list = degrees.split(/\r?\n/)
            let data = []
            for (let degree of degree_list) {
                  if(degree != ''){
                        let formData = new FormData();
                        formData.append("name", degree);
                        formData.append("description", degree);
                        formData.append("is_university_degree", true);
                        formData.append("university", university_id);
                        let response = await fetch(`${BASE_URL}/api/subjects/create-subjectcategory/`, {
                              method: "POST", 
                              headers: {Authorization: `Token ${token}`},
                              body: formData
                        })
                        let degree_data = await response.json()
                        data.push(degree_data)
                  }
            }
            return data
      } catch (error) {
            throw error;
      }
});


export const createSubjectListUniversity = createAsyncThunk("subjects/createSubjectListUniversity", async ({ subjects, category_id, token }) => {
      try {
            let subject_list = subjects.split(/\r?\n/)
            let data = []
            for (let subject of subject_list) {
                  if(subject != ''){
                        let formData = new FormData();
                        formData.append("name", subject);
                        formData.append("description", subject);
                        formData.append("is_university_subject", true);
                        formData.append("category", category_id);
                        let response = await fetch(`${BASE_URL}/api/subjects/create-subject/`, {
                              method: "POST", 
                              headers: {Authorization: `Token ${token}`},
                              body: formData
                        })
                        let subject_data = await response.json()
                        data.push(subject_data)
                  }
            }
            return data
      } catch (error) {
            throw error;
      }
});


// GETS

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
            //CREATE UNIVERSITIY
            .addCase(createUniversity.pending, (state, action) => {
                  return { ...state, universities:{...state.universities, loading:true} }
            })
            .addCase(createUniversity.fulfilled, (state, action) => {
                  let new_university = action.payload
                  new_university["degrees"] = []
                  let new_universities = [...state.universities.universities, new_university]
                  localStorage.setItem("universities", JSON.stringify(new_universities))
                  return { ...state, universities:{universities:new_universities, loading:false} }
            })
            .addCase(createUniversity.rejected, (state, action) => {
                  return { ...state, universities:{...state.universities, loading:false }, error: action.error.message }
            })
            //CREATE SUBJECT CATEGORY
            .addCase(createSubjectCategory.pending, (state, action) => {
                  return { ...state, categories:{...state.categories, loading:true} }
            })
            .addCase(createSubjectCategory.fulfilled, (state, action) => {
                  let new_subjectcategory = action.payload
                  new_subjectcategory["subjects"] = []
                  let new_categories = [...state.categories.categories, new_subjectcategory]
                  localStorage.setItem("categories", JSON.stringify(new_categories))
                  return { ...state, categories:{categories:new_categories, loading:false} }
            })
            .addCase(createSubjectCategory.rejected, (state, action) => {
                  return { ...state, categories:{...state.categories, loading:false }, error: action.error.message }
            })
            //CREATE SUBJECT LIST
            .addCase(createSubjectList.pending, (state, action) => {
                  return { ...state, categories:{...state.categories, loading:true} }
            })
            .addCase(createSubjectList.fulfilled, (state, action) => {
                  let { category_id } = action.meta.arg
                  let new_categories = state.categories.categories.map((obj) => obj.id == category_id ? {
                        ...obj,
                        subjects: [...obj.subjects, ...action.payload ]
                  } : obj) 
                  localStorage.setItem("categories", JSON.stringify(new_categories))
                  return { ...state, categories:{categories:new_categories} }
            })
            .addCase(createSubjectList.rejected, (state, action) => {
                  return { ...state, categories:{...state.categories, loading:false }, error: action.error.message }
            })
            //CREATE UNIVERSITY DEGREES
            .addCase(createUniversityDegree.pending, (state, action) => {
                  return { ...state, universities:{...state.universities, loading:true} }
            })
            .addCase(createUniversityDegree.fulfilled, (state, action) => {
                  let { university_id } = action.meta.arg
                  let new_universities = state.universities.universities.map((obj) => obj.id == university_id ? {
                        ...obj,
                        degrees: [...obj.degrees, ...action.payload ]
                  } : obj)
                  localStorage.setItem("universities", JSON.stringify(new_universities))
                  return { ...state, universities:{universities:new_universities} }
            })
            .addCase(createUniversityDegree.rejected, (state, action) => {
                  return { ...state, universities:{...state.universities, loading:false }, error: action.error.message }
            })
            //CREATE SUBJECT LIST FOR DEGREE
            .addCase(createSubjectListUniversity.pending, (state, action) => {
                  return { ...state, universities:{...state.universities, loading:true} }
            })
            .addCase(createSubjectListUniversity.fulfilled, (state, action) => {
                  let { category_id } = action.meta.arg
                  let new_universities = state.universities.universities.map((university) => ({
                        ...university,
                        degrees:university.degrees.map((obj) => obj.id == category_id ? {
                              ...obj,
                              subjects:[...obj.subjects, ...action.payload]
                        } : obj)
                  }))
                  return { ...state, universities:{universities:new_universities} }
            })

            .addCase(createSubjectListUniversity.rejected, (state, action) => {
                  return { ...state, universities:{...state.universities, loading:false }, error: action.error.message }
            })



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





