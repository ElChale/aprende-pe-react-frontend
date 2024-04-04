import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getUserChats, getUserChatsPage, getChatMessages, getChatMessagesPage, resetUserChats, addLoadingMessage, removeLoadingMessage, addRecievedMessage, updateOpenedMessages } from '../reducers/chatReducers';
import { queryTeacherProfiles, queryRecentTeacherProfiles, selectTeacherProfile, fetchTeacherProfile } from '../reducers/queryReducers'

import { useParams, useNavigate  } from 'react-router-dom'    
import { Container, Row, Col, Form, Card, Dropdown, Badge, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { BASE_URL, SHORT_BASE_URL, chatPageSize, messagePageSize, weekDaysMapping } from '../utils';

function ChatsScreen({ userInfo, userChildren, userChats, userMessages, openSockets, handleReloadChats }) {
      const dispatch = useDispatch();
      const navigate = useNavigate()
      const chatRef = useRef(null)
      const inputRef = useRef(null)

      const { chatIndex } = useParams()

      const [openChat, setOpenChat] = useState("")
      const [openChatContent, setOpenChatContent] = useState(userChats.chats.find(obj => obj.id == openChat)) 
      const [openChatMessages, setOpenChatMessages] = useState(userMessages.find(obj => obj.id == openChat)) 
      const [newMessage, setNewMessage] = useState("")
      const [error, setError] = useState('')

      const [chatScreenWidth, setChatScreenWidth] = useState(0)
      const [chatScreenHeight, setChatScreenHeight] = useState(0)
      const [mainHeight, setMainHeight] = useState(550)
      const [topHeight, setTopHeight] = useState(50)

      const [teacherError, setTeacherError] = useState('')

      




      // Step 2: Handle Navigation
      // ------------------------
      // To update the openChat based on navigation:
      // 2.1 Pull the chatIndex from the URL parameters
      // 2.2 If a valid index is obtained, set openChat to the updated index
      // 2.3 If the index is not valid or undefined, set openChat to an empty string

      // Relevant functions:
      // - handleNavigation(): Updates openChat based on the extracted chatIndex

      const handleNavigation = () => {
            const updatedChatIndex = parseInt(chatIndex, 10);
            if (!isNaN(updatedChatIndex)) {
                  setOpenChat(updatedChatIndex)
            } else {
                  setOpenChat("")
            }
      }
      // Attach event listener for popstate to handle browser navigation
      useEffect(() => {
            window.addEventListener('popstate', handleNavigation);
            return () => {
                  // Cleanup: Remove event listener when the component unmounts
                  window.removeEventListener('popstate', handleNavigation);
            }
      }, []) 
      // Call handleNavigation initially and whenever chatIndex changes
      useEffect(() => {
            handleNavigation()
      }, [chatIndex]) 

      const handleSelectChat = (chatIndex) => {
            navigate(`/chats/${chatIndex}`)
      }

      
      
      // Step 3: Set up Opening Messages
      // -------------------------------
      // To establish the logic for opening messages:
      // 3.1 Find the websocket of the current open chat.
      // 3.2 Send a message with the type "open_messages".
      // 3.3 Repeat the process whenever the open chat, open sockets, or open chat content is updated.

      // Relevant functions:
      // - handleOpenMessages(): Sends a message to the websocket corresponding to the open chat.
      // - handleSendMessage(): Sends a "chat_message" and an "open_messages" message to the websocket of the open chat.

      const handleOpenMessages = () => {
            try {
                  openSockets.find(obj => obj.id === openChatContent.id).socket.send(JSON.stringify({
                        type:"open_messages",
                  }))
            } catch(error) {
                  console.log('Error opening messages', error)
            }
      }
      // Update openChatContent and openChatMessages when userMessages or openChat changes
      useEffect(() => {
            setOpenChatContent(userChats.chats.find(obj => obj.id == openChat)) 
            setOpenChatMessages(userMessages.find(obj => obj.id == openChat)) 
      }, [userMessages, openChat])

      // Check if the open chat is loaded, open sockets are loaded, and the open chat content has updated to the current open chat
      useEffect(() => {
            if(openChatContent !== null && openChat != "" && openSockets.length > 0 && openChatContent !== undefined && openChatContent.id === openChat) {
                  handleOpenMessages()
            }
      }, [openChat, openSockets, openChatContent])
      

      // Declare function to send a message to the websocket of the open chat
      const handleSendMessage = (e) => {
            e.preventDefault()
            
            // Verify that the websocket of the current open chat exists and the message is not empty
            if(typeof openSockets.find(obj => obj.id === openChat) !== undefined && newMessage !== '' ){

                  const open_socket = openSockets.find(obj => obj.id === openChat).socket
                  
                  // Send a "chat_message" with the message content and an "open_messages" to trigger the opening messages
                  open_socket.send(JSON.stringify({
                        type:"chat_message",
                        content:newMessage,
                  }))
                  open_socket.send(JSON.stringify({
                        type:"open_messages",
                  }))
                  dispatch(addLoadingMessage({ chat_id:open_socket.id, message:newMessage }))
                  setNewMessage('')
                  inputRef.current.focus()

            }
      }

      // Handle updating main height and top height
      const handleResize = () => {
            const windows_width = window.innerWidth
            const windows_height = window.innerHeight
            setChatScreenWidth(windows_width)
            setChatScreenHeight(windows_height)
            if(windows_width < 1000) {
                  setMainHeight(windows_height*0.6)
                  setTopHeight(windows_height*0.07)
            } else {
                        setMainHeight(550)
                  setTopHeight(50)
            }
      }
      useEffect(() => {
            handleResize()
            window.addEventListener('resize', handleResize)
            return () => { window.removeEventListener('resize', handleResize) }
      }, [])



      // Handle focusing inputRef and scrolling down chatRef
      useEffect(() => {
            if (inputRef.current) {
                  inputRef.current.focus()
            }
      }, [openChat])
      useEffect(() => {
            if (chatRef.current) { 
                  chatRef.current.scrollTop = chatRef.current.children.length * 34 * 1.5 //messagePageSize * 2.5 * 34 
            } 
      }, [chatIndex, userMessages, openChatMessages, openChat])



      const sentMessageStyle = {
            backgroundColor:"#bfdbfe",
            maxWidth:"80%",
            width:"fit-content",
            marginLeft:"auto"  
      }
      const recievedMessageStyle = {
            backgroundColor:"#F3F4F6",
            maxWidth:"80%",
            width:"fit-content",
      }

      const handleLoadChatPage = () => {
            dispatch(getUserChatsPage({ n_page:Math.max(...userChats.pages)+1, token:userInfo.token }))
      }

      const handleLoadMessagesPage = () => {
            dispatch(getChatMessagesPage({ chat_id:openChat, n_page:Math.max(...userMessages.find(obj => obj.id === openChat).pages)+1, token:userInfo.token }))
      }

      // TEACHER PROFILE
      // open/close teacher profile details modal
      const handleToTeacherPage = (teacher) => {
            if (userInfo.user) {
                  dispatch(fetchTeacherProfile({ id:teacher.id, token:userInfo.token }))
                  .then((result) => {
                        if (result.payload) {
                              if (result.payload.error) {
                                    setTeacherError(result.payload.error)
                              } else {
                                    setTeacherError('')
                                    //dispatch(selectTeacherProfile(teacher))
                                    navigate('/teacher-view');                                       
                                                
                              }     
                        
                        } 
                  }) 
            } else {
                  navigate('/user')
            }

      }

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])





      return ( 
            <Container className='bg-white border my-lg-4' style={chatScreenWidth < 1000 ? {position:"fixed", left:0, right:0, top:"80px", zIndex:4, height:chatScreenHeight} : {borderRadius:"20px"}} >
                  <Row>
                        <Col md={3}  className={`${openChat !== "" ? "hidden" : ""} md:block border-r`} >
                              <div onClick={() => handleSelectChat("")} style={{height:topHeight}} className='flex items-center  p-2 border-b'>Tus chats
                              {
                                                userChats.loading == true ? (
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-6 h-auto ml-2"
                                                      />
                                                ) : (
                                                      <button onClick={() => {handleReloadChats()}} className='ml-2'>
                                                            <img
                                                                  src="/reload_icon.png"
                                                                  alt="Reload"
                                                                  className="w-4 h-auto mb-1"
                                                            />
                                                      </button>
                                                )
                                          }
                              </div>
                        </Col>
                        <Col md={9} className={`${openChat === "" ? "hidden" : ""} md:block`} >
                              <div className='flex py-2 align-items-center border-b' style={{height:topHeight}}>
                                    <div className='m-0 flex align-items-center'>
                                          {
                                                openChatContent ? (
                                                      <>
                                                            <div className='md:hidden'>
                                                                  <img onClick={() => {handleSelectChat("")}} src="/back_icon.png" alt="Back" className="w-4 h-4 mx-2" />
                                                            </div>
                                                            {
                                                            openChatContent && openChatContent?.student && openChatContent?.student?.email == userInfo?.user?.email ? 
                                                                  (
                                                                        <div className='flex border rounded-xl items-center py-1 pl-2 pr-3 hover:opacity-75' onClick={() => {handleToTeacherPage(openChatContent.teacher)}}>
                                                                        <img onClick={() => {}} src={`${openChatContent.teacher.user.profile_image}`} alt="Back" className="w-8 h-8 rounded-xl mx-2" />
                                                                        <h6 className='m-0'>Profesor {openChatContent.teacher.user.first_name} {openChatContent.teacher.user.last_name}</h6>
                                                                        </div>
                                                                  ) 
                                                                  : (
                                                                        <>
                                                                        <img onClick={() => {}} src={openChatContent.student ? `${openChatContent.student.profile_image}` : ""} alt="Back" className="w-8 h-8 rounded-xl mx-2" />
                                                                        <h6 className='m-0'><span className='text-blue-500'>Estudiante</span> {openChatContent.student ? openChatContent.student.first_name : ""} {openChatContent.student ? openChatContent.student.last_name : ""}</h6>
                                                                        </>
                                                                  )
                                                            }
                                                      </>
                                                ) : ""
                                          }
                                    </div>
                              </div>
                        </Col>
                  </Row>
                  <Row>
                    
                        <Col md={3}  className={`${openChat !== "" ? "hidden" : ""} md:block p-0 h-screen border-r`} style={{height:mainHeight+topHeight*2, position:"relative", overflowY:"scroll", overflowX:"hidden"}}>
                      
                              {     
                                    userChats.chats && userChats.chats.length > 0 ? 
                                          userChats.chats.slice().sort((a, b) => new Date(b.updated_at).toISOString().localeCompare(new Date(a.updated_at).toISOString())).map((chat, i) => (
                                                <div key={i} onClick={() => handleSelectChat(chat.id)} 
                                                      className={`${chat.id === openChat ? "bg-blue-200" : ""} p-2 border-b flex`}
                                                      
                                                >
                                                      <img
                                                            onClick={() => {}}
                                                            src={`${chat.student !== undefined && userInfo.user !== null && chat.student.email == userInfo.user.email ?  chat.teacher.user.profile_image : chat.student ?  chat.student.profile_image : ""}`}
                                                            alt="Back"
                                                            className="w-6 h-6 rounded-xl m-1"
                                                      />
                                                      <div className='flex-row align-items-center w-full px-2'>
                                                            
                                                            <h6 className='m-0'>
                                                            {
                                                                  chat.student !== undefined && userInfo.user !== null &&
                                                                  (chat.student.email === userInfo.user.email
                                                                  ? `${chat.teacher.user.first_name} (profesor)`
                                                                  : (
                                                                        <>
                                                                        {chat.student.first_name}
                                                                        <span className='text-blue-500'> (estudiante)</span>
                                                                        </>
                                                                        )
                                                                  )
                                                            }
                                                            </h6>

                                                            <div className='flex' style={{overflow:"hidden", maxHeight:"20px", opacity:"75%"}}>
                                                            {
                                                                  userMessages.find(obj => obj.id === chat.id)?.messages?.length > 0
                                                                  ? 
                                                                  <div>{userMessages.find(obj => obj.id === chat.id).messages[0].sender?.email == userInfo?.user?.email && 'Tú: '} {userMessages.find(obj => obj.id === chat.id).messages[0].content}</div>
                                                                  : userMessages.find(obj => obj.id === chat.id)?.loading == true ? 
                                                                  <img
                                                                        src="/tail_blue_fast.svg"
                                                                        alt="Loading..."
                                                                        className="w-6 h-6"
                                                                  /> : null
                                                            }
                                                            {
                                                                  userMessages.find(obj => obj.id === chat.id)?.messages?.length > 0 && userMessages.find(obj => obj.id === chat.id)?.messages?.filter(obj => !obj.seen_at && !obj.date && obj.sender?.email !== userInfo.user?.email)?.length > 0 ?
                                                                  <div className='text-white bg-blue-400 ml-auto px-1 rounded-full'>{userMessages.find(obj => obj.id === chat.id)?.messages?.filter(obj => !obj.seen_at && !obj.date && obj.sender?.email !== userInfo.user?.email)?.length}</div> : null
                                                            }
                                                                  
                                                            </div>      
                                                            <div className='flex justify-content-end opacity-75'>
                                                                  {
                                                                        userMessages.find(obj => obj.id === chat.id)?.loading == false ? (
                                                                        new Date().getFullYear() === new Date(chat.updated_at).getFullYear() && new Date().getMonth() === new Date(chat.updated_at).getMonth() && new Date().getDate() === new Date(chat.updated_at).getDate() ? (
                                                                              `${"0".repeat(2-(new Date(chat.updated_at).getHours()).toString().length)}${new Date(chat.updated_at).getHours()}:${"0".repeat(2-(new Date(chat.updated_at).getMinutes()).toString().length)}${new Date(chat.updated_at).getMinutes()}`
                                                                        ) : new Date(chat.updated_at).getDay() <= new Date().getDay() && Math.abs(new Date() - new Date(chat.updated_at)) / (24 * 60 * 60 * 1000) <= 6 ? (
                                                                              `${weekDaysMapping[new Date(chat.updated_at).getDay()-1 + (7 * new Date(chat.updated_at).getDay()-1 <= 0 )]}`
                                                                        ) : (
                                                                              `${new Date(chat.updated_at).getDate()}/${new Date(chat.updated_at).getMonth()+1}/${new Date(chat.updated_at).getFullYear()}`
                                                                        )
                                                                        ) : <div>00:00</div>

                                                                  }
                                                                
                                                            </div>
                                                      </div>
                                                
                                                      
                                                </div>
                                          ))


                                    : userChats.loading ? 
                                          <div className='flex align-items-center justify-content-center w-full'>
                                                <img
                                                      src="/tail_blue_fast.svg"
                                                      alt="Loading..."
                                                      className="w-20 h-auto m-2"
                                                />      
                                          </div>   
                                    :
                                          <div className='p-4'>Inicie un chat con un profesor para verlo aquí.</div>
                              }
                              {
                                    userChats.chats.length >= chatPageSize && userChats.loading == false ? 
                                          <div onClick={() => {handleLoadChatPage()}}  className='flex align-items-center justify-content-center'>
                                                <span className='bg-gray-300 py-1 px-2 mt-2 rounded-xl'>Cargar más chats</span>
                                          </div>
                                    : userChats.loading == true ?
                                          <div className='flex align-items-center justify-content-center'>
                                                <img
                                                      src="/tail_blue_fast.svg"
                                                      alt="Back"
                                                      className="w-20 h-20 m-2"
                                                />
                                          </div>
                                    : null
                              }
                        </Col>

                        <Col md={9} className={`${openChat === "" ? "hidden" : ""} md:block p-0`}  >
                              
                              <div className='flex-row px-3' ref={chatRef} style={{height:mainHeight+topHeight, position:"relative", overflowY:"scroll", overflowX:"hidden"}}>
                                    {
                                          userMessages.find(obj => obj.id == openChat) !== undefined && userMessages.find(obj => obj.id == openChat).loading == true ?
                                                <div className='flex align-items-center justify-content-center'>
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Back"
                                                            className="w-20 h-20 m-2"
                                                      />
                                                </div>
                                          : openChatMessages && openChatMessages.messages && openChatMessages.messages.length >= messagePageSize ?
                                                <div onClick={() => {handleLoadMessagesPage()}}  className='flex align-items-center justify-content-center'>
                                                      <span className='bg-gray-300 py-1 px-2 mt-2 rounded-xl'>Cargar más mensajes</span>
                                                </div>
                                          : null
                                    }
                                    {
                                          openChatMessages && openChatMessages.messages ? openChatMessages.messages.slice().reverse().map((message, i) => (
                                                message.date ? (
                                                      <div key={i} className='flex align-items-center justify-content-center'>
                                                            <span className='bg-gray-300 py-1 px-2 mt-2 rounded-xl'>{message.date}</span>
                                                      </div>
                                                ) : (
                                                      <div key={i} style={ message.sender && userInfo.user.email &&
                                                            message.sender.email === "abcdefghijklmnopqrstuvwxyz@email.com" ? sentMessageStyle 
                                                            : message.sender && userInfo.user.email && message.sender.email === userInfo.user.email ?
                                                            sentMessageStyle : recievedMessageStyle
                                                      } className='my-2 p-2 rounded flex' >
                                                            <p className='p-0 my-0 mr-2'>{message.content}</p>
                                                            <small className='mt-auto ml-auto mr-2 opacity-75 flex align-items-center'>
                                                                  <p className='m-0'>
                                                                  {
                                                                        message.created_at !== null && "0".repeat(2-(new Date(message.created_at).getHours()).toString().length)
                                                                  }
                                                                  {
                                                                        new Date(message.created_at).getHours()
                                                                  }:
                                                                  {
                                                                        message.created_at !== null && "0".repeat(2-(new Date(message.created_at).getMinutes()).toString().length)
                                                                  }
                                                                  {
                                                                        new Date(message.created_at).getMinutes()
                                                                  }
                                                                  </p>
                                                                  <img
                                                                        src={message.is_loading ? "/tail_blue_fast.svg" : message.seen_at ? "/seen_icon.png" : "/delivered_icon.png"}
                                                                        alt="Back"
                                                                        className="w-3 h-3 ml-1"
                                                                  />
                                                            </small>
                                                      </div>
                                                )
                                          )) : userMessages.find(obj => obj.id == openChat) !== undefined && userMessages.find(obj => obj.id == openChat).loading != true && <div className='p-4'>Seleccione un chat para poder verlo aqui.</div>
                                    }
                                   
                              </div>
                              <Form onSubmit={(e) => {}} className='flex' style={{ position: 'relative', bottom: 0, height:topHeight }}>
                                   
                                    <Form.Control
                                          ref={inputRef}
                                          id="message"
                                          disabled={openChat === ""}
                                          type="message"
                                          placeholder="Escriba un mensaje"
                                          value={newMessage}
                                          onChange={(e) => setNewMessage(e.target.value)}
                                          className='m-2 '
                                          style={{ fontSize: '.75rem',  }}
                                    />
                                    
                                    <button disabled={openChat === ""} onClick={(e) => {handleSendMessage(e)}} className={`mr-2 my-2 w-32 p-1 text-white rounded-xl ${openChat === "" ? "bg-gray-400" : "bg-blue-500 hover:bg-gray-400"}`} >
                                          Enviar
                                    </button>
                              </Form>
                        </Col>
                        
                  </Row>
            </Container>
      )
}

export default ChatsScreen