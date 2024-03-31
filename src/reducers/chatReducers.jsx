import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL,  messagePageSize, languageMapping } from '../utils'

const userChatsFromStorage = localStorage.getItem("userChats") ? {...JSON.parse(localStorage.getItem("userChats")), loading:false} : { chats:[], pages:[], loading:false }
const userMessagesFromStorage = localStorage.getItem("userMessages") ? [...JSON.parse(localStorage.getItem("userMessages"))] : []

const initialState = {
      userChats:userChatsFromStorage,
      userMessages:userMessagesFromStorage,
      error:null,
}



function addDateObjectsToMessages(messages) {
      return messages.reduce((result, message, index) => {
            const currentCreatedAt = new Date(message.created_at);
            const nextCreatedAt = index < messages.length - 1 ? new Date(messages[index + 1].created_at) : null;
            result.push(message)
      
            if (nextCreatedAt && currentCreatedAt - nextCreatedAt > 86400000) {
                  result.push({ date: currentCreatedAt.toLocaleDateString() });
            }
            return result;
      }, [])
}

export const getUserChats = createAsyncThunk("userChats/getChats", async ({ token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/chats/get/`, {method: "GET", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Chat request failed")}
            
            const { page, chats } = await response.json()
            return { page:page, chats:chats }
      } catch (error) {
            throw error;
      }
});


export const getUserChatsPage = createAsyncThunk("userChats/getChatsPage", async ({ n_page, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/chats/get/?page=${n_page}`, {method: "GET", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Chat request failed")}
            
            const { page, chats } = await response.json()
            return { page:page, chats:chats }
      } catch (error) {
            throw error;
      }
});

export const getChatMessages = createAsyncThunk("userChats/getMessages", async ({ chat_id, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/chats/get-messages/${chat_id}/`, {method: "GET", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Messages request failed")}
            
            //const { page, messages } = await response.json()
            const data = await response.json()
            const page = data["page"]
            const messages = data["messages"]

            let updatedMessages = addDateObjectsToMessages(messages)
            return { chat_id:chat_id, page:page, messages:updatedMessages }
      } catch (error) {
            throw error
      }
});

export const getChatMessagesPage = createAsyncThunk("userChats/getMessagesPage", async ({ chat_id, n_page, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/chats/get-messages/${chat_id}/?page=${n_page}`, {method: "GET", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Messages request failed")}
            
            const data = await response.json()
            const page = data["page"]
            const messages = data["messages"]

            let updatedMessages = addDateObjectsToMessages(messages)
            return { chat_id:chat_id, page:page, messages:updatedMessages }
      } catch (error) {
            throw error
      }
});


export const createChat = createAsyncThunk("userChats/createChat", async ({ user_id, teacher_id, token }) => {
      try {
            const response = await fetch(`${BASE_URL}/api/chats/create/${user_id}/${teacher_id}/`, {method: "POST", headers: {Authorization: `Token ${token}`,}})
            if (!response.ok) {throw new Error("Error al crear chat")}
            
            const data = await response.json()
            return data
      } catch (error) {
            throw error
      }
});





function createLoadingMessage(message) {
      return { 
            sender:{ email: "abcdefghijklmnopqrstuvwxyz@email.com" }, 
            created_at: new Date().toISOString(), 
            is_loading: true, 
            content:message, 
            file:null, 
            reaction:null 
      }
}

function insertMessage(state, chat_id, message) {
      const new_user_messages = state.userMessages.map(obj => obj.id === chat_id ? {
            ...obj, messages: [ 
                  message, 
                  ...obj.messages ]
                  .sort((a,b) => { const a_date = new Date(a.updated_at); const b_date = new Date(b.updated_at); return b_date - a_date })
                  .slice(0, messagePageSize * obj.pages.length)
      } : obj)
      return new_user_messages
}

function updateChat(state, chat_id) {
      const new_user_chats = { ...state.userChats, chats:state.userChats.chats.map(obj => obj.id === chat_id ? {
            ...obj,
            updated_at: new Date().toISOString(),
      } : obj)
      }

      return new_user_chats 
}

function updateMessages(state, chat_id, updated_messages) {
      let found = false
      const new_user_messages = state.userMessages.map((obj) => {
                  if(obj.id === chat_id) {
                        found = true
                        return { ...obj, ...updated_messages } 
                  } else {
                         return obj
                  }
            }
      ) 
      if (!found) {
            new_user_messages.push({...updated_messages, id: chat_id})
      }
      return new_user_messages
}

function openMessages(state, chat_id, user_id) {
      const new_user_messages = state.userMessages.map(obj => obj.id === chat_id && obj.messages !== undefined ? {
            ...obj, 
            messages: obj.messages.map(message => 
                  message.sender && message.sender.id !== user_id && message.seen_at === null ? {...message, seen_at:new Date().toISOString()} : message)
      } : obj) 
      return new_user_messages
}

// Create a userInfo slice
export const userChatSlice = createSlice({
      name: "userChat",
      initialState,
      reducers: {
            resetUserChats: (state) => {
                  localStorage.removeItem("userChats")
                  localStorage.removeItem("userMessages")
                  return { userChats: { chats:[], pages:[], loading:false }, userMessages: [], error:null }
            },
            //adds loading message at top
            addLoadingMessage: (state, action) => {
                  let { chat_id, message } = action.payload
                  let new_user_messages = insertMessage(state, chat_id, createLoadingMessage(message))
                  return { ...state,  userMessages:new_user_messages }
            },
            //removes the loading message with content === action.message
            removeLoadingMessage: (state, action) => {
                  let { chat_id, message } = action.payload
                  let new_user_messages = state.userMessages.map(obj => obj.id === chat_id ? {
                        ...obj,
                        messages: obj.messages.map(_message =>
                              _message.content === message && _message.is_loading ? [] : _message).flat()
                  } : obj)
                  return { ...state,  userMessages:new_user_messages }
            },
            //adds the action.message to the chat with action.chat_id and sorts the chats by updated_at
            addRecievedMessage: (state, action) => { 
                  let { chat_id, message } = action.payload
                  let new_user_chats = updateChat(state, chat_id)
                  let new_user_messages = insertMessage(state, chat_id, message)
                  localStorage.setItem("userChats", JSON.stringify(new_user_chats))
                  localStorage.setItem("userMessages", JSON.stringify(new_user_messages))
                  return { ...state, userChats:new_user_chats,  userMessages:new_user_messages }
            },
            //updates all the messages that have the sender.id === user_id and seen_at === null
            updateOpenedMessages: (state, action) => {
                  let { chat_id, user_id } = action.payload
                  let new_user_messages = openMessages(state, chat_id, user_id)
                  return { ...state,  userMessages:new_user_messages }
            }
      },
      extraReducers: (builder) => {
            builder
            //GET CHATS
            .addCase(getUserChats.pending, (state, action) => {
                  return { ...state, userChats:{...state.userChats, loading:true} }
            })
            .addCase(getUserChats.fulfilled, (state, action) => {
                  let { chats, page } = action.payload
                  let complete_payload = { chats:chats, pages:[page] }
                  localStorage.setItem("userChats", JSON.stringify(complete_payload))
                  return { ...state, userChats:{...complete_payload, loading:false} }
            })
            .addCase(getUserChats.rejected, (state, action) => {
                  return { ...state, userChats:{ chats:[], pages:[], loading:false }, error: action.error.message }
            })
            //CREATE CHAT
            .addCase(createChat.pending, (state, action) => {
                  return { ...state, userChats:{...state.userChats, loading:true} }
            })
            .addCase(createChat.fulfilled, (state, action) => {
                  return { ...state, userChats:{...state.userChats, loading:false} }
            })
            .addCase(createChat.rejected, (state, action) => {
                  return { ...state, userChats:{...state.userChats, loading:false} }
            })

            //GET CHATS PAGE
            .addCase(getUserChatsPage.pending, (state, action) => {
                  return { ...state, userChats:{...state.userChats, loading:true} }
            })
            .addCase(getUserChatsPage.fulfilled, (state, action) => {
                  let { chats, page } = action.payload
                  let complete_payload = { chats: [ ...state.userChats.chats, chats ], pages: [ ...state.userChats.pages, page ] }
                  localStorage.setItem("userChats", JSON.stringify(complete_payload))
                  return { ...state, userChats:{...complete_payload, loading:false} }
            })
            .addCase(getUserChatsPage.rejected, (state, action) => {
                  return { ...state, userChats:{...state.userChats, loading:false}, error: action.error.message }
            })

            //GET CHAT MESSAGES
            .addCase(getChatMessages.pending, (state, action) => {
                  let chat_id = action.meta.arg.chat_id
                  let new_user_chats = updateMessages(state, chat_id, {  loading: true })
                  return { ...state, userMessages: new_user_chats }
            })
            .addCase(getChatMessages.fulfilled, (state, action) => {
                  let { chat_id, page, messages } = action.payload
                  let new_user_chats = updateMessages(state, chat_id, { messages: messages, pages: [page], loading: false })             
                  localStorage.setItem("userMessages", JSON.stringify(new_user_chats))
                  return { ...state, userMessages: new_user_chats }
            })
            .addCase(getChatMessages.rejected, (state, action) => {
                  let chat_id = action.meta.arg.chat_id
                  let new_user_chats = updateMessages(state, chat_id, { messages: [], pages: [], loading: false }) 
                  return { ...state, userMessages: new_user_chats }
            })

            //GET CHAT MESSAGES PAGE
            .addCase(getChatMessagesPage.pending, (state, action) => {
                  let chat_id = action.meta.arg.chat_id
                  let new_user_chats = updateMessages(state, chat_id, {  loading: true })
                  return { ...state, userMessages: new_user_chats }
            })
            .addCase(getChatMessagesPage.fulfilled, (state, action) => {
                  let { chat_id, page, messages } = action.payload
                  //let new_user_chats = updateMessages(state, chat_id, { messages: messages, pages: [page], loading: false })     
                  let found = false
                  let new_user_messages = state.userMessages.map((obj) => {
                              if(obj.id === chat_id) {
                                    found = true
                                    return { ...obj, messages: [ ...obj.messages, ...messages ], pages: [ ...obj.pages, page ], loading: false } 
                              } else {
                                    return obj
                              }
                        }
                  ) 
                  if (!found) { new_user_messages.push({ messages: messages, pages: [page], loading: false, id: chat_id }) }

                  localStorage.setItem("userMessages", JSON.stringify(new_user_messages))
                  return { ...state, userMessages: new_user_messages }
            })
            .addCase(getChatMessagesPage.rejected, (state, action) => {
                  let chat_id = action.meta.arg.chat_id
                  let new_user_chats = updateMessages(state, chat_id, { loading: false }) 
                  return { ...state, userMessages: new_user_chats }
            })


            
      },
});

export const { resetUserChats, addLoadingMessage, removeLoadingMessage, addRecievedMessage, updateOpenedMessages } = userChatSlice.actions;

export default userChatSlice.reducer