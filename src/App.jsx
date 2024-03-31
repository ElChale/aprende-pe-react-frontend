import { BrowserRouter, Routes,  Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect,  } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import HomeScreen from './screens/HomeScreen';
import FindClassesScreen from './screens/FindClassesScreen'
import MyClassesScreen from './screens/MyClassesScreen';
import ChatsScreen from './screens/ChatsScreen';
import TeacherProfileScreen from './screens/TeacherProfileScreen';
import TeacherLandingScreen from './screens/TeacherLandingScreen';
import SuggestionsScreen from './screens/SuggestionsScreen';

import UserScreen from './screens/UserScreen'
import ReservationScreen from './screens/ReservationScreen'
import TeacherViewScreen from './screens/TeacherViewScreen';

import { login, getReservations, resetUserInfo } from './reducers/userReducers';
import { getCategories, getUniversities, getSubjects } from './reducers/subjectReducers';
import { getTeacherProfile, getTeacherReservations } from './reducers/teacherReducers';
import { getUserChats, getChatMessages, removeLoadingMessage, addRecievedMessage, updateOpenedMessages } from './reducers/chatReducers';
import { getConstants } from './reducers/constantReducers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { BASE_URL, SHORT_BASE_URL, chatPageSize, messagePageSize, weekDaysMapping } from './utils';

import FAQS from './staticPages/FAQS'
import Nosotros from './staticPages/Nosotros'
import Terminos from './staticPages/Terminos'
import SampleQr from './staticPages/SampleQr'


function App() {
      const dispatch = useDispatch();

      const userInfoFromRedux = useSelector((state) => state.userInfo.userInfo)
      const teacherProfileFromRedux = useSelector((state) => state.teacherProfile)
      const userChildrenFromRedux = useSelector((state) => state.userInfo.userChildren)
      const userChatsFromRedux = useSelector((state) => state.userChats.userChats)
      const userMessagesFromRedux = useSelector((state) => state.userChats.userMessages)
      const categoriesFromRedux = useSelector((state) => state.subjects.categories)
      const universitiesFromRedux = useSelector((state) => state.subjects.universities)
      const querysFromRedux = useSelector((state) => state.querys)
      const suggestionsFromRedux = useSelector((state) => state.suggestions)
      const constantsFromRedux = useSelector((state) => state.constants.constants)


      const [userInfo, setUserInfo] = useState(userInfoFromRedux)
      const [teacherProfile, setTeacherProfile] = useState(teacherProfileFromRedux)
      const [userChildren, setUserChildren] = useState(userChildrenFromRedux)
      const [userChats, setUserChats] = useState(userChatsFromRedux)
      const [userMessages, setUserMessages] = useState(userMessagesFromRedux)
      const [categories, setCategories] = useState(categoriesFromRedux)
      const [universities, setUniversities] = useState(universitiesFromRedux)
      const [querys, setQuerys] = useState(querysFromRedux)
      const [suggestions, setSuggestions] = useState(suggestionsFromRedux)
      const [constants, setConstants] = useState(constantsFromRedux)

      const [openSockets, setOpenSockets] = useState([])

      
      useEffect(() => { setUserInfo(userInfoFromRedux) }, [userInfoFromRedux]);
      useEffect(() => { setTeacherProfile(teacherProfileFromRedux) }, [teacherProfileFromRedux]);
      useEffect(() => { setUserChildren(userChildrenFromRedux) }, [userChildrenFromRedux]);
      useEffect(() => { setUserChats(userChatsFromRedux) }, [userChatsFromRedux]);
      useEffect(() => { setUserMessages(userMessagesFromRedux) }, [userMessagesFromRedux]);
      useEffect(() => { setCategories(categoriesFromRedux) }, [categoriesFromRedux]);
      useEffect(() => { setUniversities(universitiesFromRedux) }, [universitiesFromRedux]);
      useEffect(() => { setQuerys(querysFromRedux) }, [querysFromRedux]);
      useEffect(() => { setSuggestions(suggestionsFromRedux) }, [suggestionsFromRedux]);
      useEffect(() => { setConstants(constantsFromRedux) }, [constantsFromRedux]);

      
      useEffect(() => {
            if (userInfo.token) {
                  dispatch(login({ email:null, password:null, token:userInfo.token, expiry:userInfo.expiry }))
                  dispatch(getTeacherProfile({ token:userInfo.token }))
                  dispatch(getTeacherReservations({ page:1, token:userInfo.token}))
                  dispatch(getReservations({ page:1, token:userInfo.token }))
                  dispatch(getConstants())
            } else {
                  dispatch(resetUserInfo())
            }
      }, [])
      

      useEffect(() => {
            dispatch(getCategories())
            dispatch(getUniversities())
      }, [dispatch]);
    
      useEffect(() => {
            if (categories.categories) {
                  categories.categories.forEach((item, i) => {
                        if (item.subjects === undefined) {
                              dispatch(getSubjects({ category_id: item.id, is_university_degree: false }));
                        }
                  });
            }
      }, [dispatch, categories]);
    
      
      useEffect(() => {
            if (universities.universities) {
                  universities.universities.forEach((university, i) => { 
                        university.degrees.forEach((item, j) => {
                              if (item.subjects === undefined) {
                                    dispatch(getSubjects({ category_id: item.id, is_university_degree: true }));
                              }
                        })
                        
                  });
            }
      }, [dispatch, universities]);
    
      useEffect(() => {
        console.log("Mounting app");
      }, []);


      //CHATS WEBSOCKETS SETUP

      // Step 1: Fetching Chats and opening websockets
      // ----------------------
      // To initialize the chat functionality, we follow these steps:
      // 1.1 Fetch user chats using dispatch(getUserChats())
      // 1.2 For each loaded chat:
      //     - Dispatch getChatMessages() to fetch chat messages
      //     - Open websockets for real-time updates using handleUpdateOpenSockets()
      // 1.3 Update openChatContent and openChatMessages for rendering

      // Relevant functions:
      // - fetchMessagesForChat(chatId): Fetches chat messages for a specific chat
      // - handleUpdateOpenSockets(chats): Opens websockets for each chat
      const fetchMessagesForChat = (chatId) => {
            try {
                  const response = dispatch(getChatMessages({ chat_id: chatId, token: userInfo.token }))
            } catch (error) {
                  console.error('Error fetching messages for chat', chatId, error.message);
            }
      }
      const handleUpdateOpenSockets = (chats) => {
            
            if(typeof userInfo.user !== undefined && openSockets.length === 0 ) {
                        let opened_sockets = []
                        for(let i = 0; i < chats.length; i++) {
                              // Open websocket
                              const socketURL = `ws://${SHORT_BASE_URL}/ws/chat/${chats[i].teacher.user.email}/${chats[i].student.email}/?token=${userInfo.token}`
                              const newSocket = new WebSocket(socketURL)

                              // Declare websocket methods
                              // 1 onopen
                              // 2 onmessage
                              // 3 onclose

                              newSocket.onopen = () => { console.log(`WebSocket connected: ${newSocket.url}`) }
            
                              newSocket.onmessage = (event) => {
                                    const data = JSON.parse(event.data)
                                    const { type, message } = data

                                    if(type === 'chat_message'){
                                          dispatch(removeLoadingMessage({ chat_id:chats[i].id, message:message }))
                                          dispatch(addRecievedMessage({ chat_id:chats[i].id, message:message }))
                                          const pathSegments = window.location.pathname.split('/');
                                          const index = pathSegments[pathSegments.length - 1];

                                          if(parseInt(index) === message.chat && message.sender.id !== userInfo.user.id){
                                                newSocket.send(JSON.stringify({
                                                      type:"open_messages",
                                                }))
                                          }
                                          
                                    } else if(type === 'open_messages') {
                                          dispatch(updateOpenedMessages({ chat_id:chats[i].id, user_id:message.id /*this is the user id of the person that sent the message*/ }))
                                    }
                              }
                              newSocket.onclose = () => { console.log(`WebSocket closed: ${newSocket.url}`) }

                              // Push websocket to array
                              opened_sockets.push({id:chats[i].id, socket:newSocket})
                        }

                        // Set openSockets to include all websockets
                        setOpenSockets(opened_sockets)

                        return () => {opened_sockets.forEach(socket => socket.close())}
                  }
      }
      useEffect(() => {
            // Fetch user chats 
            dispatch(getUserChats({ token: userInfo.token }))
      }, [userInfo.token])
      useEffect(() => {
            if(userChats.chats.length !== 0 ) {
                  userChats.chats.forEach((chat) => {
                        fetchMessagesForChat(chat.id)  // Fetch messages for the current chat
                  })
            }
            /* Handle websockets for real-time updates if(userChats.chats.length !== 0 ) {handleUpdateOpenSockets(userChats.chats)} */

      }, [])
      useEffect(() => {
            if(userChats.chats.length !== 0 && userMessages.length === 0) {
                  userChats.chats.forEach((chat) => {
                        fetchMessagesForChat(chat.id)  // Fetch messages for the current chat
                  })
            }
            if(userChats.chats.length !== 0 && openSockets.length === 0) {
                  handleUpdateOpenSockets(userChats.chats) // Handle websockets for real-time updates
            }
            /* Update openChatContent and openChatMessages for rendering  if(false && userChats.chats.length !== 0 && userMessages.length !== 0) {setOpenChatContent(userChats.chats.find(obj => obj.id == openChat)); setOpenChatMessages(userMessages.find(obj => obj.id == openChat))}*/ 
      }, [userChats.chats])


      return (
            <div className="flex-column text-xs bg-white font-personalized" style={{/*backgroundImage: "linear-gradient(to right, #EFF6FF, #93C5FD)",*/ minHeight:"100vh"}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <BrowserRouter basename="/">
                        <Header userInfo={userInfo} teacherProfile={teacherProfile} userChildren={userChildren} userMessages={userMessages}/>
                        <div className='min-h-screen'>
                        <Routes >
                                    <Route path="/" Component={HomeScreen} />
                                    <Route path="/index.html" Component={HomeScreen} />
                                    <Route path="/findclasses" element={<FindClassesScreen categories={categories} querys={querys} universities={universities} userChats={userChats} userInfo={userInfo} constants={constants}/>} /> 
                                    <Route path="/myclasses" element={<MyClassesScreen userInfo={userInfo} userChildren={userChildren} userChats={userChats} constants={constants}/>} /> 
                                    <Route path="/chats/:chatIndex?" element={<ChatsScreen userInfo={userInfo} userChildren={userChildren} userChats={userChats} userMessages={userMessages} openSockets={openSockets} />} /> 
                                    <Route path="/teacher-profile" element={<TeacherProfileScreen userInfo={userInfo} teacherProfile={teacherProfile} userChildren={userChildren} userChats={userChats} categories={categories} universities={universities} constants={constants}/>} /> 
                                    <Route path="/teacher-landing" element={<TeacherLandingScreen userInfo={userInfo} teacherProfile={teacherProfile} categories={categories} universities={universities} constants={constants}/>} /> 
                                    <Route path="/user" element={<UserScreen teacherProfile={teacherProfile} userInfo={userInfo} userChildren={userChildren} constants={constants} />}  /> 
                                    <Route path="/reservation" element={<ReservationScreen userInfo={userInfo} userChildren={userChildren} querys={querys} constants={constants} />}  /> 
                                    <Route path="/teacher-view" element={<TeacherViewScreen userInfo={userInfo} querys={querys} userChats={userChats} categories={categories} universities={universities} constants={constants} />}  /> 
                                    <Route path="/suggestions" element={<SuggestionsScreen userInfo={userInfo} suggestions={suggestions} />}  /> 
                                    
                                    {/* STATICS */}
                                    <Route path="/FAQS" element={<FAQS />}  /> 
                                    <Route path="/Nosotros" element={<Nosotros />}  /> 
                                    <Route path="/Terminos" element={<Terminos />}  /> 
                                    <Route path="/sample_qr" element={<SampleQr />}  /> 

                              
                        </Routes>
                        </div>
                        <Footer/>
                  </BrowserRouter>
                  </LocalizationProvider>
            </div>   
      )
}

export default App