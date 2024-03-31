import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, genderMapping, languageMapping } from '../utils'


const teacherProfileFromStorage = localStorage.getItem("teacherProfile") ? JSON.parse(localStorage.getItem("teacherProfile")) : {reservations:{reservations:null, pages:null}}

const initialState = {
      teacherProfile:teacherProfileFromStorage,
      loading:false,
      error:null,
}



export const getTeacherProfile = createAsyncThunk("teacher/getTeacherProfile", async ({ token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/get-profile/`, {method: "GET", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Teacher profile request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const createTeacherProfile = createAsyncThunk("teacher/createTeacherProfile", async ({ subjects, resume, hourly_price, coin, token }) => {
      try {
            const formData = new FormData();
            formData.append("subjects", subjects);
            formData.append("resume", resume);
            formData.append("hourly_price", hourly_price);
            formData.append("coin", coin);

            const response = await fetch(`${BASE_URL}/api/teachers/create-profile/`, {
                  method: "POST", 
                  headers: {Authorization: `Token ${token}`},
                  body: formData
            })
            if (!response.ok) {throw new Error("Teacher profile request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


export const getTeacherReservations = createAsyncThunk("teacher/getTeacherReservations", async ({ page, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/get-reservations/?page=${page}`, {method: "GET", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Pagina no encontrada")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});



export const addSubject = createAsyncThunk("teacher/addSubject", async ({ token, subject_id }) => {
      try { 
            const response = await fetch(`${BASE_URL}/api/teachers/subject-add/?subject_id=${subject_id}`, {method: "POST", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Add subject request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const deleteSubject = createAsyncThunk("teacher/deleteSubject", async ({ token, subject_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/subject-delete/?subject_id=${subject_id}`, {method: "DELETE", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Delete subject request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const addLanguage = createAsyncThunk("teacher/addLanguage", async ({ token, language_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/language-add/?language_id=${language_id}`, {method: "POST", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Add language request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const deleteLanguage = createAsyncThunk("teacher/deleteLanguage", async ({ token, language_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/language-delete/?language_id=${language_id}`, {method: "DELETE", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Delete language request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});



export const addPaymentMethod = createAsyncThunk("teacher/addPaymentMethod", async ({ token, payment_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/payment-method-add/?payment_id=${payment_id}`, {method: "POST", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Add payment method request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const deletePaymentMethod = createAsyncThunk("teacher/deletePaymentMethod", async ({ token, payment_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/payment-method-delete/?payment_id=${payment_id}`, {method: "DELETE", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Delete payment method request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


export const addStyle = createAsyncThunk("teacher/addStyle", async ({ token, style_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/style-add/?style_id=${style_id}`, {method: "POST", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Add style request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const deleteStyle = createAsyncThunk("teacher/deleteStyle", async ({ token, style_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/style-delete/?style_id=${style_id}`, {method: "DELETE", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Delete style request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});



export const addExperienceValidator = createAsyncThunk("teacher/addExperienceValidator", async ({ token, subjects, document, message, hours_validated, document_is_public }) => {
      try {
            
            const formData = new FormData();
            formData.append("subjects", subjects);
            formData.append("document", document);
            formData.append("message", message);
            formData.append("hours_validated", hours_validated);
            if(document_is_public){
                  formData.append("document_is_public", document_is_public);
            }

            const response = await fetch(`${BASE_URL}/api/teachers/experience-validator-add/`, {
                  method: "POST", 
                  headers: {Authorization: `Token ${token}`},
                  body: formData
            })
            if (!response.ok) {throw new Error("Add Experience Validator request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});

export const deleteExperienceValidator = createAsyncThunk("teacher/deleteExperienceValidator", async ({ token, validator_id }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/teachers/experience-validator-delete/?validator_id=${validator_id}`, {method: "DELETE", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Delete Experience Validator request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});



export const editConfiguration = createAsyncThunk("teacher/editConfiguration", async ({ resume, payment_credentials, payment_qr, hourly_price, coin, token }) => {
      try {
            
            const formData = new FormData();
            formData.append("resume", resume);
            formData.append("payment_credentials", payment_credentials);
            formData.append("hourly_price", hourly_price);
            formData.append("coin", coin);
            if(payment_qr !== null){
                  formData.append("payment_qr", payment_qr);
            }
        
            const response = await fetch(`${BASE_URL}/api/teachers/edit-configuration/`, {
                  method: "PUT",
                  headers: {Authorization: `Token ${token}`},
                  body: formData,
            })

            const data = await response.json()

            if(!response.ok) {
                  throw new Error("Error updating user")
            }

            return data
          
      } catch (error) {
            throw error;
      }
});

export const addAvailableTime = createAsyncThunk("teacher/addAvailableTime", async ({ start_time, end_time, user_timezone, vacancies, repeat_times, repeat_interval, class_types, token }) => {
      try {
            const formData = new FormData();
            formData.append("start_time", start_time);
            formData.append("end_time", end_time);
            formData.append("user_timezone", user_timezone);
            formData.append("vacancies", vacancies);
            formData.append("repeat_times", repeat_times);
            formData.append("repeat_interval", repeat_interval);
            formData.append("class_types", class_types);
            
            const response = await fetch(`${BASE_URL}/api/teachers/available-time-add/`, {
                  method: "PUT",
                  headers: {Authorization: `Token ${token}`},
                  body: formData,
            })

            const data = await response.json()
            if(!response.ok) {
                  throw new Error("Error adding available time")
            }

            return data
      } catch (error) {
            throw error;
      }
});

export const deleteAvailableTime = createAsyncThunk("teacher/deleteAvailableTime", async ({ id, token }) => {
      try {
            const formData = new FormData();
            formData.append("id", id);
            
            const response = await fetch(`${BASE_URL}/api/teachers/available-time-delete/`, {
                  method: "DELETE",
                  headers: {Authorization: `Token ${token}`},
                  body: formData,
            })

            const data = await response.json()
            if(!response.ok) {
                  throw new Error("Error deleting available time")
            }

            return data
      } catch (error) {
            throw error;
      }
});


export const editReservation = createAsyncThunk("teacher/editReservation", async ({ reservation_id, invitation, invoice, canceled, cancelation_reason, token }) => {
      try {
            
            const formData = new FormData();
            
            formData.append("invitation", invitation);     
            formData.append("canceled", canceled);
            formData.append("cancelation_reason", cancelation_reason);
            if(invoice !== null){
                  formData.append("invoice", invoice);
            }
            
            const response = await fetch(`${BASE_URL}/api/products/edit-reservation/${reservation_id}/`, {
                  method: "PUT", 
                  headers: {Authorization: `Token ${token}`},
                  body: formData
            })
            if (!response.ok) {throw new Error("Add Experience Validator request failed")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error;
      }
});


// Create a userInfo slice
export const teacherSlice = createSlice({
      name: "teacher",
      initialState,
      reducers: {
            resetTeacherProfile: (state) => {
                  localStorage.removeItem("teacherProfile")
                  return { teacherProfile:{reservations:{reservations:null, pages:null}}, loading:false, error: null }
            },
            resetTeacherReservations: (state) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, reservations:{reservations:null, pages:null}}))
                  return { teacherProfile:{...state.teacherProfile, reservations:{reservations:null, pages:null}}, loading:false, error: null }
            },
      },
      extraReducers: (builder) => {
            builder
            //GET TEACHER PROFILE
            .addCase(getTeacherProfile.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(getTeacherProfile.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(getTeacherProfile.rejected, (state, action) => {
                  localStorage.removeItem("teacherProfile")
                  return { teacherProfile:{reservations:{reservations:null, pages:null}}, loading:false, error: action.error.message }
            })
            //CREATE TEACHER PROFILE
            .addCase(createTeacherProfile.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(createTeacherProfile.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(createTeacherProfile.rejected, (state, action) => {
                  localStorage.removeItem("teacherProfile")
                  return { teacherProfile:{reservations:{reservations:null, pages:null}}, loading:false, error: action.error.message }
            })
            //GET TEACHER RESERVATIONS
            .addCase(getTeacherReservations.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(getTeacherReservations.fulfilled, (state, action) => {
                  let { reservations, page } = action.payload
                  let complete_payload = { reservations: state.teacherProfile.reservations.reservations === null ? 
                        [...reservations] : state.teacherProfile.reservations.pages.includes(page) ? 
                        [...state.teacherProfile.reservations.reservations] : 
                        [ ...state.teacherProfile.reservations.reservations, ...reservations ], 
                        pages: state.teacherProfile.reservations.pages === null ? 
                        [page] : state.teacherProfile.reservations.pages.includes(page) ? 
                        [ ...state.teacherProfile.reservations.pages] : [ ...state.teacherProfile.reservations.pages, page ] 
                  }
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, reservations:complete_payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, reservations:complete_payload}, loading:false }
            })
            .addCase(getTeacherReservations.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //ADD SUBJECT
            .addCase(addSubject.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(addSubject.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(addSubject.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //DELETE SUBJECT
            .addCase(deleteSubject.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(deleteSubject.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //ADD LANGUAGE
            .addCase(addLanguage.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(addLanguage.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(addLanguage.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //DELETE LANGUAGE
            .addCase(deleteLanguage.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(deleteLanguage.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(deleteLanguage.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //ADD PAYMENT METHOD
            .addCase(addPaymentMethod.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(addPaymentMethod.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(addPaymentMethod.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //DELETE PAYMENT METHOD
            .addCase(deletePaymentMethod.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(deletePaymentMethod.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(deletePaymentMethod.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //ADD TEACHING STYLE
            .addCase(addStyle.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(addStyle.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(addStyle.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //DELETE TEACHING STYLE
            .addCase(deleteStyle.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(deleteStyle.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(deleteStyle.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //ADD EXPERIENCE VALIDATOR
            .addCase(addExperienceValidator.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(addExperienceValidator.fulfilled, (state, action) => {
                  let new_teacher_profile = {
                        ...state.teacherProfile,
                        experience_validators: [...state.teacherProfile.experience_validators, action.payload]
                  }
                  localStorage.setItem("teacherProfile", JSON.stringify(new_teacher_profile))
                  return { ...state, teacherProfile:new_teacher_profile, loading:false }
            })
            .addCase(addExperienceValidator.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //DELETE EXPERIENCE VALIDATOR
            .addCase(deleteExperienceValidator.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(deleteExperienceValidator.fulfilled, (state, action) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({...state.teacherProfile, ...action.payload}))
                  return { ...state, teacherProfile:{...state.teacherProfile, ...action.payload}, loading:false }
            })
            .addCase(deleteExperienceValidator.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //EDIT CONFIGURATION
            .addCase(editConfiguration.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(editConfiguration.fulfilled, (state, action) => {
                  let new_teacher_profile = {...state.teacherProfile, ...action.payload}
                  localStorage.setItem("teacherProfile", JSON.stringify(new_teacher_profile))
                  return { ...state, teacherProfile:new_teacher_profile, loading:false }
            })
            .addCase(editConfiguration.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //ADD AVAILABLE TIME
            .addCase(addAvailableTime.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(addAvailableTime.fulfilled, (state, action) => {
                  let new_teacher_profile = {...state.teacherProfile, ...action.payload}
                  localStorage.setItem("teacherProfile", JSON.stringify(new_teacher_profile))
                  return { ...state, teacherProfile:new_teacher_profile, loading:false }
            })
            .addCase(addAvailableTime.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //DELETE AVAILABLE TIME
            .addCase(deleteAvailableTime.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(deleteAvailableTime.fulfilled, (state, action) => {
                  let new_teacher_profile = {...state.teacherProfile, ...action.payload}
                  localStorage.setItem("teacherProfile", JSON.stringify(new_teacher_profile))
                  return { ...state, teacherProfile:new_teacher_profile, loading:false }
            })
            .addCase(deleteAvailableTime.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            //EDIT RESERVATION
            .addCase(editReservation.pending, (state, action) => {
                  return { ...state,  loading:true }
            })
            .addCase(editReservation.fulfilled, (state, action) => {
                  let new_teacher_profile = {...state.teacherProfile, reservations:state.teacherProfile.reservations.reservations.map((reservation) => reservation.id == action.payload.id ? action.payload : reservation)}
                  localStorage.setItem("teacherProfile", JSON.stringify(new_teacher_profile))
                  return { ...state, teacherProfile:new_teacher_profile, loading:false }
            })
            .addCase(editReservation.rejected, (state, action) => {
                  return { ...state, loading:false, error: action.error.message }
            })
            
      },
});

export const { resetTeacherProfile, resetTeacherReservations } = teacherSlice.actions;


export default teacherSlice.reducer
