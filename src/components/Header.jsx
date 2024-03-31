import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'
import { BASE_URL } from '../utils'
import { useNavigate } from 'react-router-dom'

import { BLUE } from '../utils'

function Header({ userInfo, teacherProfile, userChildren, userMessages }) {
      const navigate = useNavigate()

      const [screenWidth, setScreenWidth] = useState(0)
      const [unreadMessages, setUnreadMessages] = useState(0)

      const homePage = () => {
            navigate('/')
            setShowMenu(false)
      }
      const findClassesPage = () => {
            navigate('/findclasses')
            setShowMenu(false)
      }
      const myClassesPage = () => {
            navigate('/myclasses')
            setShowMenu(false)
      }
      const chatsPage = () => {
            navigate('/chats')
            setShowMenu(false)
      }
      const teacherProfilePage = () => {
            navigate('/teacher-profile')
            setShowMenu(false)
      }

      const userPage = () => {
            navigate('/user')
            setShowMenu(false)
      }

      const suggestionsPage = () => {
            navigate('/suggestions')
            setShowMenu(false)
      }

      const handleResize = () => {
            const windowsWidth = window.innerWidth
            setScreenWidth(windowsWidth)
      }

      useEffect(() => {
            handleResize()
            window.addEventListener('resize', handleResize)
      
            return () => {
                  window.removeEventListener('resize', handleResize)
            };
      }, [])

      useEffect(() => {
            let unread_messages = 0
            userMessages?.forEach((chat) => {
                  chat?.messages?.forEach((message) => {
                        if (!message?.seen_at  && !message?.date && message?.sender?.email !== userInfo?.user?.email) {
                              unread_messages = unread_messages + 1
                        }
                  })
            })
            setUnreadMessages(unread_messages)
      }, [userMessages])

      

      const [showMenu, setShowMenu] = useState(false);
      const [fadeIn, setFadeIn] = useState(false);


      const handleToggleMenu = () => {
            setShowMenu(!showMenu);
            setFadeIn(true);
      };
      useEffect(() => {
            if (showMenu) {
              // Reset the fade-in after a short delay when collapsing
              const timeoutId = setTimeout(() => {
                setFadeIn(false);
              }, 10); // Adjust the delay as needed
              return () => clearTimeout(timeoutId);
            }
          }, [showMenu]);

      return ( //when screenWidth <= 800 it collapses
            <div className='' style={{height:"80px"}}>
                  {
                        screenWidth <= 1000 ? (
                              <div className='flex align-items-center bg-gray-800 justify-content-between px-4 w-full' style={{height:"80px", position: "fixed", zIndex:100, top:0 }} >
                                    {showMenu && <div  className={`absolute top-0 left-0 w-full h-screen z-20 bg-gray-900 bg-opacity-75 `}>
                                          <div className={`w-full bg-white px-4 pt-4 pb-20 flex flex-col transition-transform transform ${!fadeIn ? 'origin-top-left scale-100 opacity-100' : 'origin-top-left scale-75 opacity-0'} `}>
                                                <div className='flex mb-3'>
                                                      <img
                                                            onClick={homePage}
                                                            src="/new_large_logo.png"
                                                            alt="Aprende Pe Logo"
                                                            className="max-h-16 py-3"
                                                      />
                                                      <span className='ml-auto mt-1 w-6 h-6 select-none' onClick={() => {setShowMenu(false)}}>
                                                      <img src="/cross_thin_icon.png"
                                                      style={{
                                                            transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                      }}                                  
                                                      onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                      onMouseOver={(e) => e.target.classList.add('spin-on-hover')}
                                                      onMouseOut={(e) => e.target.classList.remove('spin-on-hover')}
                                                      /></span>
                                                </div>
                                                <span onClick={homePage} className='w-full py-2'>Inicio</span>
                                                <span onClick={findClassesPage} className='w-full py-2'>Encuentra clases</span>
                                                <span onClick={myClassesPage} className='w-full py-2'>Tus Clases</span>
                                                <span onClick={chatsPage} className='flex w-full py-2'>Chats
                                                {
                                                      unreadMessages > 0 ?
                                                      <div className='text-white bg-blue-400 ml-2 px-1 rounded-full'>{unreadMessages}</div> : null
                                                }
                                                </span>
                                                <span onClick={suggestionsPage} className='w-full py-2'>Sugerencias</span>
                                                {
                                                      userInfo.user ? (
                                                            teacherProfile.teacherProfile !== undefined && Object.keys(teacherProfile.teacherProfile)?.length >= 3 ? (
                                                                  <>
                                                                  <span onClick={teacherProfilePage} className='w-full py-2'>Panel de profesor</span>
                                                                  <span onClick={userPage} className='w-full py-2'>Tu cuenta</span>
                                                                  </>
                                                            ) : (
                                                                  <>
                                                                  <span onClick={teacherProfilePage} className='w-full py-2'>Se profesor</span>
                                                                  <span onClick={userPage} className='w-full py-2'>Tu cuenta</span>
                                                                  </>
                                                            )
                                                      ) : (
                                                            <>
                                                            <span onClick={teacherProfilePage} className='w-full py-2'>Quiero Enseñar</span>
                                                            <span onClick={userPage} className='w-full py-2'>Iniciar Sesión</span>
                                                            </>
                                                      )
                                                }
                                                
                                          </div>
                                          <div className='w-full h-full' onClick={() => {setShowMenu(false)}}></div>
                                    </div>}

                                    <div className='' onClick={() => handleToggleMenu()}>
                                          <img src="/new_short_logo_focused.png" alt="Aprende Pe Logo" className="max-h-20 py-3 mr-4"  />
                                    </div>
                                    <div className='flex align-items-center ml-auto text-gray-400'>
                                          {
                                                userInfo.user ? (
                                                      <>{teacherProfile.teacherProfile !== undefined && Object.keys(teacherProfile.teacherProfile)?.length >= 3 ? (<div onClick={teacherProfilePage} style={{backgroundColor:BLUE}}   className='px-3 py-1 mx-3 my-3 my-lg-0 rounded-3xl self-center text-white shadow-none hover:shadow-lg scale-100 hover:scale-105'>Panel Profesor</div>
                                                                  ) : ( <div onClick={teacherProfilePage} className='self-center py-1 mx-3 my-1 select-none hover:text-gray-100'>Quiero Enseñar</div>)}
                                                            <div onClick={userPage} className='flex'> <img src={userInfo.user.profile_image} alt="Profile" className="w-10 h-10 rounded-full" />   </div> </>
                                                      
                                                ) : ( <> <div onClick={teacherProfilePage} className='self-center py-1 mx-3 my-1 select-none hover:text-gray-100'>Quiero Enseñar</div>
                                                            <div onClick={userPage}>
                                                                  <img src={BASE_URL + '/images/Profile.jpg'} alt="Profile" className="w-10 h-10 rounded-full" />
                                                            </div> </> )
                                          }
                                    </div>
                              </div>
                        ) : (
                              <div className='flex items-center bg-gray-800  w-full' style={{height:"80px", position: "fixed", zIndex:100, top:0, }}>
                                    <Container className='text-gray-400'>
                                          <Row xs={12} >
                                                <Col className='flex items-center'>
                                                      <img
                                                            onClick={homePage}
                                                            src="/new_large_logo.png"
                                                            alt="Aprende Pe Logo"
                                                            className="max-h-16 py-3 mr-4"
                                                      />
                                                      <span onClick={homePage} className="mx-4 select-none hover:text-gray-100">Inicio</span>
                                                      <span onClick={findClassesPage} className="mx-4 select-none hover:text-gray-100">Encuentra clases</span>
                                                      <span onClick={myClassesPage} className="mx-4 select-none hover:text-gray-100">Tus Clases</span>
                                                      <span onClick={chatsPage} className="mx-4 select-none hover:text-gray-100 flex">Chats 
                                                      {
                                                            unreadMessages > 0 ?
                                                            <div className='text-white bg-blue-400 ml-2 px-1 rounded-full'>{unreadMessages}</div> : null
                                                      }
                                                      </span>
                                                      <span onClick={suggestionsPage} className="mx-4 select-none hover:text-gray-100">Sugerencias</span>
                                                      
                                                      <div className='flex align-items-center ml-auto'>
                                                            {
                                                            userInfo.user ? (
                                                                  <>{teacherProfile.teacherProfile !== undefined && Object.keys(teacherProfile.teacherProfile)?.length >= 3 ? (<div onClick={teacherProfilePage} style={{backgroundColor:BLUE}}  className='px-3 py-1 mx-3 my-3 my-lg-0 rounded-3xl self-center text-white shadow-none hover:shadow-lg scale-100 hover:scale-105'>Panel Profesor</div>
                                                                              ) : ( <div onClick={teacherProfilePage} className='self-center py-1 mx-3 my-1 select-none hover:text-gray-100 '>Quiero Enseñar</div>)}
                                                                        <div onClick={userPage} className='flex'> <img src={userInfo.user.profile_image} alt="Profile" className="w-10 ml-3 h-10 rounded-full" />   </div> </>
                                                                  
                                                            ) : ( <> <div onClick={teacherProfilePage} className='self-center py-1 mx-3 my-1 select-none hover:text-gray-100'>Quiero Enseñar</div>
                                                                        <div onClick={userPage}>
                                                                              <img src={'https://aprende-pe-bucket-1.s3.amazonaws.com/images/profile.jpg'} alt="Profile" className="ml-3 w-10 h-10 rounded-full" />
                                                                        </div> </> )
                                                            }
                                                      </div>
                                                </Col>
                                          </Row>
                                    </Container>
                              </div>
                        )
                  }
                  
            </div>
      )
}

export default Header