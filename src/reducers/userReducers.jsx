import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, genderMapping, languageMapping } from '../utils'


// Define an initial state that includes userInfo from localStorage if available
const userInfoFromStorage = localStorage.getItem("userInfo") ? {...JSON.parse(localStorage.getItem("userInfo")), loading:false} : {expiry:null,token:null,user:null, loading:false}

const userChildrenFromStorage = localStorage.getItem("userChildren") ? {...JSON.parse(localStorage.getItem("userChildren")), loading:false} : {reservations:{reservations:null, pages:null}, loading:false}

const initialState = {
      userInfo: userInfoFromStorage,
      userChildren: userChildrenFromStorage,
      error: null,
}

// Create an async thunk for the login action
export const login = createAsyncThunk("userInfo/login", async ({ email, password, token, expiry }) => {
      try {
            if (token) {
                  // If a token is available, send a refresh request
                  const response = await fetch(`${BASE_URL}/api/users/refresh/`, {method: "GET", headers: {Authorization: `Token ${token}`,}})

                  if (!response.ok) {throw new Error("Refresh request failed")}

                  const refreshed = await response.json()
                  const data = {expiry:expiry, token:token, user:refreshed}
                  return data
            } else {
                  // If no token is available, send a login request with email and password
                  const formData = new FormData()
                  formData.append("email", email)
                  formData.append("password", password)

                  const response = await fetch(`${BASE_URL}/api/users/login/`, {method: "POST", body: formData})

                  if (!response.ok) {
                        const data = await response.json()
                        if (data.non_field_errors) throw new Error("Wrong credentials")
                        if (data.email) throw new Error("Invalid email")
                        throw new Error("Login failed")
                  }

                  const data = await response.json()
                  return data
            }
      } catch (error) {
            // Handle any errors here
            throw error;
      }
});

export const getReservations = createAsyncThunk("userInfo/getReservations", async ({ page, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/users/get-reservations/?page=${page}`, {method: "GET", headers: {Authorization: `Token ${token}`,}})

            if (!response.ok) {throw new Error("Pagina no encontrada")}

            const refreshed = await response.json()
            const data = refreshed
            return data
           
      } catch (error) {
            throw error;
      }
});


export const signup = createAsyncThunk("userInfo/signup", async ({ first_name, last_name, email, phone_number, password }) => {
      try {
            //const lowercasedGender = gender.toLowerCase();
            //const genderValue = Object.keys(genderMapping).find(key => genderMapping[key] === lowercasedGender);
            const formData = new FormData();
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("email", email);
            formData.append("phone_number", phone_number);
            formData.append("password", password);
        
            const response = await fetch(`${BASE_URL}/api/users/register/`, {
                  method: "POST",
                  body: formData,
            })

            const data = await response.json()
           
            if (response.status === 201) {
                  return data
                }

            if (!response.ok) {
                  console.log(data)
                  if (data.email) throw new Error("User with that email already exists")
                  if (data.phone_number) { 
                        if(data.phone_number[0] === "The phone number entered is not valid.") throw new Error("The phone number entered is not valid")
                        throw new Error("User with that phone number already exists")
                  } 
                  throw new Error("Error creating user")
            }

          
      } catch (error) {
            // Handle any errors here
            throw error;
      }
});

export const update = createAsyncThunk("userInfo/update", async ({ id, first_name, last_name, email, phone_number, gender, age, language, password, token }) => {
      try {

            const lowercasedGender = gender?.toLowerCase();
            const genderValue = Object.keys(genderMapping)?.find(key => genderMapping[key] === lowercasedGender) || null;

            const formData = new FormData();
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("age", age);
            formData.append("email", email);
            formData.append("phone_number", phone_number);
            formData.append("gender", genderValue);  
            formData.append("language", language); 
            formData.append("password", password);
        
            const response = await fetch(`${BASE_URL}/api/users/update/${id}/`, {
                  method: "PUT",
                  headers: {Authorization: `Token ${token}`},
                  body: formData,
            })

            const data = await response.json()

            if(!response.ok) {
                  if (data.email) {
                        if (data.email[0] === "CustomUser with this email already exists.") throw new Error("User with that email already exists")
                        throw new Error("Invalid email address")
                  }
                  if (data.phone_number) { 
                        if(data.phone_number[0] === "The phone number entered is not valid.") throw new Error("The phone number entered is not valid")
                        throw new Error("User with that phone number already exists")
                  } 
                  throw new Error("Error updating user")
            }

            return data
          
      } catch (error) {
            // Handle any errors here
            throw error;
      }
});

export const imageUpdate = createAsyncThunk("userInfo/imageUpdate", async ({ id, email, gender, profile_image, token }) => {
      try {       
            const formData = new FormData();
            formData.append("email", email);
            formData.append("gender", gender);  
            formData.append("profile_image", profile_image);
           
            const response = await fetch(`${BASE_URL}/api/users/update/${id}/`, {
                  method: "PUT",
                  headers: { Authorization: `Token ${token}` },
                  body: formData,
            });
      
            const data = await response.json()
      
            if (!response.ok) {
                  // Handle error responses as needed
                  throw new Error("Error updating profile image")
            }
      
            return data

      } catch (error) {
      // Handle any errors here
            throw error;
      }
});
    


export const logout = createAsyncThunk("userInfo/logout", async ({ token }) => {
      try {           
            const response = await fetch(`${BASE_URL}/api/users/logout/`, {method: "POST", headers: {Authorization: `Token ${token}`,}})

            if (response.status === 204) {
                  // Return a resolved promise with the desired result
                  return null;
                  
                }

            if (!response.ok && response.stats !== 204) {throw new Error("Logout request failed")}

            const data = await response.json()
            return data

      } catch (error) {
            // Handle any errors here
            throw error;
      }
});




export const createReservation = createAsyncThunk("userInfo/createReservation", async ({ id, subjects, document, message, start_time, end_time, class_type_id, coin_id, total_price, hourly_price, total_duration, token }) => {
      try {

            const formData = new FormData();
            formData.append("subjects", subjects);
            formData.append("document", document);
            formData.append("message", message);
            formData.append("start_time", start_time);
            formData.append("end_time", end_time);
            formData.append("class_type_id", class_type_id);  
            formData.append("coin_id", coin_id); 
            formData.append("total_price", total_price);
            formData.append("hourly_price", hourly_price);
            formData.append("total_duration", total_duration);
        
            const response = await fetch(`${BASE_URL}/api/products/create-reservation/${id}/`, {
                  method: "POST",
                  headers: {Authorization: `Token ${token}`},
                  body: formData,
            })

            const data = await response.json()
            return data
          
      } catch (error) {
            throw error;
      }
});


export const createReview = createAsyncThunk("userInfo/createReview", async ({ user_id, teacher_id, reservation_id, rating, feedback, token }) => {
      try {

            const formData = new FormData();
            formData.append("rating", rating);
            formData.append("feedback", feedback);
      
            const response = await fetch(`${BASE_URL}/api/products/create-review/${user_id}/${teacher_id}/${reservation_id}/`, {
                  method: "POST",
                  headers: {Authorization: `Token ${token}`},
                  body: formData,
            })

            const data = await response.json()
            return data
          
      } catch (error) {
            throw error;
      }
});


// Create a userInfo slice
export const userInfoSlice = createSlice({
      name: "userInfo",
      initialState,
      reducers: {
            resetUserInfo: (state) => {
                  localStorage.removeItem("userInfo")
                  return {
                        ...state,
                        userInfo: {expiry:null,token:null,user:null, loading:false},
                        userChildren:{reservations:{reservations:null, pages:null}, loading:false},
                        error: null,
                  }
            },
            resetReservations: (state) => {
                  localStorage.setItem("teacherProfile", JSON.stringify({reservations:{reservations:null, pages:null}, ...state.userChildren}))
                  return {...state, userChildren:{reservations:{reservations:null, pages:null}, loading:false, error:null}}
            },
      },
      extraReducers: (builder) => {
            builder
            .addCase(signup.pending, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, loading:true},
                  }
            })
            .addCase(signup.fulfilled, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, loading:false},
                  }
            })
            .addCase(signup.rejected, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{expiry:null,token:null,user:null, loading:false},
                        error: action.error.message,
                  }
            })
            .addCase(login.pending, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, loading:true},
                  }
            })
            .addCase(login.fulfilled, (state, action) => {
                  localStorage.setItem("userInfo", JSON.stringify(action.payload))
                  return {
                        ...state, 
                        userInfo:{...action.payload, loading:false},
                  }
            })
            .addCase(login.rejected, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{expiry:null,token:null,user:null, loading:false},
                        error: action.error.message,
                  }
            })
            .addCase(getReservations.pending, (state, action) => {
                  return {
                        ...state, 
                        userChildren:{...state.userChildren, loading: true}
                  }
            })
            .addCase(getReservations.fulfilled, (state, action) => {
                  let { reservations, page } = action.payload
                  let complete_payload = { reservations: state.userChildren.reservations.reservations === null ? 
                        [...reservations] : state.userChildren.reservations.pages.includes(page) ? 
                        [...state.userChildren.reservations.reservations] : 
                        [ ...state.userChildren.reservations.reservations, ...reservations ], 
                        pages: state.userChildren.reservations.pages === null ? 
                        [page] : state.userChildren.reservations.pages.includes(page) ? 
                        [ ...state.userChildren.reservations.pages] : [ ...state.userChildren.reservations.pages, page ] 
                  }
                  localStorage.setItem("userChildren", JSON.stringify({reservations:complete_payload, ...state.userChildren}))
                  return {...state,  userChildren:{...state.userChildren, reservations:complete_payload, loading: false}}
            })
            .addCase(getReservations.rejected, (state, action) => {
                  localStorage.setItem("userChildren", JSON.stringify({reservations:{reservations:null, pages:null}, ...state.userChildren}))
                  localStorage.removeItem("userChildren")
                  return {
                        ...state, 
                        userChildren:{...state.userChildren, loading:false},
                        error: action.error.message,
                  }
            })
            .addCase(update.pending, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, loading:true}
                  }
            })
            .addCase(update.fulfilled, (state, action) => {
                  const existingUserInfo = JSON.parse(localStorage.getItem("userInfo"))
                  existingUserInfo.user = action.payload
                  localStorage.setItem("userInfo", JSON.stringify(existingUserInfo))
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, user:action.payload, loading:false}
                  }
            })
            .addCase(update.rejected, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, loading:false}
                  }
            })
            .addCase(imageUpdate.pending, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, loading:true}
                  }
            })
            .addCase(imageUpdate.fulfilled, (state, action) => {
                  const existingUserInfo = JSON.parse(localStorage.getItem("userInfo"))
                  existingUserInfo.user = action.payload
                  localStorage.setItem("userInfo", JSON.stringify(existingUserInfo))
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, user:action.payload, loading:false}
                  }
            })
            .addCase(imageUpdate.rejected, (state, action) => {
                  return {
                        ...state, 
                        userInfo:{...state.userInfo, loading:false}
                  }
            })
            .addCase(logout.pending, (state, action) => {
                  return {
                        ...state,
                        userInfo: {...state.userInfo, loading:true},
                        userChildren:{...state.userChildren, loading:false},
                  }
            })
            .addCase(logout.fulfilled, (state, action) => {
                  localStorage.removeItem("userInfo")
                  return {
                        ...state,
                        userInfo: {expiry:null,token:null,user:null, loading:false},
                        userChildren:{reservations:{reservations:null, pages:null}, loading:false},
                        error: null,
                  }
            })
            .addCase(logout.rejected, (state, action) => {
                  localStorage.removeItem("userInfo")
                  return {
                        ...state,
                        userInfo: {expiry:null,token:null,user:null, loading:false},
                        userChildren:{reservations:{reservations:null, pages:null}, loading:false},
                        error: null,
                  }
            })
            .addCase(createReservation.pending, (state, action) => {
                  return {...state, userChildren:{...state.userChildren, loading:true}}
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                  return {...state, userChildren:{...state.userChildren, loading:false}}
            })
            .addCase(createReservation.rejected, (state, action) => {
                  return {...state, userChildren:{...state.userChildren, loading:false, error:action.error.message}}
            })
            .addCase(createReview.pending, (state, action) => {
                  return {...state, userChildren:{...state.userChildren, loading:true}}
            })
            .addCase(createReview.fulfilled, (state, action) => {
                  return {...state, userChildren:{...state.userChildren, loading:false}}
            })
            .addCase(createReview.rejected, (state, action) => {
                  return {...state, userChildren:{...state.userChildren, loading:false, error:action.error.message}}
            })
      },
});

export const { resetUserInfo, resetReservations } = userInfoSlice.actions;

export default userInfoSlice.reducer
