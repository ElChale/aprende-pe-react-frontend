import { configureStore } from '@reduxjs/toolkit'
import userInfoReducer from './reducers/userReducers'
import userChatsReducer from './reducers/chatReducers'
import subjectReducer from './reducers/subjectReducers'
import teacherReducer from './reducers/teacherReducers'
import queryReducer from './reducers/queryReducers'
import suggestionReducer from './reducers/suggestionReducers'
import constantReducer from './reducers/constantReducers'


export const store = configureStore({
      reducer: {
            userInfo: userInfoReducer,
            teacherProfile: teacherReducer,
            userChats: userChatsReducer,
            subjects: subjectReducer,
            querys: queryReducer,
            suggestions: suggestionReducer,
            constants: constantReducer,
      },
      //middleware: () => new Tuple(thunk, logger)
}) 