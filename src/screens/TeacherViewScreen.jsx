import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { queryTeacherProfiles, selectTeacherProfile, fetchTeacherProfile, getTeacherReviews } from '../reducers/queryReducers'
import { createChat, getUserChats } from '../reducers/chatReducers'
import Calendar from '../components/Calendar';
import TextBox from '../components/ui/TextBox';

import { useNavigate } from 'react-router-dom'

import { BASE_URL, BLUE, PINK, ORANGE, GREEN, orderMapping } from '../utils'
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

function TeacherViewScreen({userInfo, querys, userChats, categories, universities, constants}) {
      const dispatch = useDispatch()
      const navigate = useNavigate()
      // TEACHER PROFILE
      const [displayedTeacherProfile, setDisplayedTeacherProfile] = useState({})
      const [reviewsPage, setReviewsPage] = useState(1)
      const [reviewsError, setReviewsError] = useState('')

      const [displayedExperienceValidator, setDisplayedExperienceValidator] = useState({})
      const [showExperienceValidatorModal, setShowExperienceValidatorModal] = useState(false)

      const [showSubjectModal, setShowSubjectModal] = useState(false)
      const [displayedSubject, setDisplayedSubject] = useState({})


      const [chatError, setChatError] = useState('')

      // AVAILABLE TIMES
      const [displayedAvailableTime, setDisplayedAvailableTime] = useState({})
      const [showAvailableTimeModal, setShowAvailableTimeModal] = useState(false)


       // CALENDAR MODALS
       const handleShowReservationModal = (event) => {
            return null
      }
      const handleShowAvailableTimeModal = (event) => {
            setDisplayedAvailableTime(event)
            setShowAvailableTimeModal(!showAvailableTimeModal)
      }
      
      // CHAT
      const handleInitiateChat = (teacher) => {
            if(userInfo.user) {
                  if(teacher.user.id == userInfo.user.id){
                        return null
                  }
                  let foundChat = userChats.chats?.find(obj => obj.teacher.id == teacher.id && obj.student.id == userInfo.user.id)

                  if(foundChat){
                        navigate(`/chats/${foundChat.id}`)
                  } else {
                        dispatch(createChat({user_id:userInfo.user.id, teacher_id:displayedTeacherProfile.id, token:userInfo.token}))
                        .then((result) => {
                              if (result.payload) {
                                    if (result.payload.error) {
                                          setChatError(result.payload.error)
                                    } else {
                                          setChatError('')
                                          dispatch(getUserChats({ token: userInfo.token }))
                                          .then((result) => {
                                                if(result.payload){
                                                      if(result.payload.error){
                                                            setChatError(result.payload.error)
                                                      } else {
                                                            navigate('/chats')
                                                            window.location.reload()
                                                      }
                                                }
                                          })
                                          
                                    }
                                
                              } else {
                                    setChatError(result.error.message)
                                    
                              }
                        })
                  }
            } else {
                  navigate('/user')
            }
      }

      // RESERVATION
      const handleToCreateReservation = (teacher) => {
            dispatch(fetchTeacherProfile({ id:teacher.id, token:userInfo.token }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload.error) {
                              setChatError(result.payload.error)
                        } else {
                              setChatError('')
                              //dispatch(selectTeacherProfile(teacher))
                              navigate('/reservation');                                       
                                          
                        }     
                    
                  } 
            }) 
      }

      
      const handleUserScreen = () => {
            navigate(`/user`)
      }
      // SUBJECT DETAILS MODAL
      // open/close subject modal
      const handleSubjectModal = (subject) => {
            if (Object.keys(subject).length === 0) {
                  setShowSubjectModal(false)
                  setDisplayedSubject({})
            } else {
                  setShowSubjectModal(true)
                  setDisplayedSubject(subject)
            }
      }

      // open/close experience validator modal
      const handleExperienceValidatorModal = (experienceValidator) => {
            setShowExperienceValidatorModal(!showExperienceValidatorModal)
            setDisplayedExperienceValidator(experienceValidator)
      }

      const handleReviewPageChange = (change) => {
            let new_page = reviewsPage + change
            if (0 <= new_page) {
                  dispatch(getTeacherReviews({ teacher_id:querys?.selectedTeacherProfile?.id, page:new_page, token:userInfo?.token}))
                  .then((result) => {
                        if (result.payload) {
                              if (result.payload.error) {
                                    setReviewsError(result.payload.error)
                              } else {
                                    setReviewsPage(new_page)
                                    setReviewsError('')
                              }
                        } else {
                              setReviewsError(result.error.message)
                              
                        }
                  })
            }
      }

      useEffect(() => {
            if (querys.selectedTeacherProfile == null || Object.keys(querys?.selectedTeacherProfile)?.length === 0) {
                  navigate('/findClasses')
            }
            if (!userInfo.user) {
                  navigate('/user')
            }
            dispatch(getTeacherReviews({ teacher_id:querys?.selectedTeacherProfile?.id, page:reviewsPage, token:userInfo?.token}))
            setDisplayedTeacherProfile(querys?.selectedTeacherProfile ?? {})
      }, [querys.selectedTeacherProfile] )

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      return (
            <Container>
                  {/* EXPERIENCE VALIDATOR DETAILS MODAL */}
                  <Modal className='text-xs bg-gray-900 bg-opacity-75' show={showExperienceValidatorModal} onHide={() => handleExperienceValidatorModal({})} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>Validador de experiencia</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <h6>Cursos validados</h6>    
                              <span className='flex flex-wrap'>{displayedExperienceValidator.subjects?.length > 0 && displayedExperienceValidator.subjects.map((subject, i) => <span key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} className='font-normal text-xs flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none'>
                                    {subject.name}</span>)}</span>
                              <h6>Justificación</h6>         
                              <p className='text-justify'>{displayedExperienceValidator.message}</p>
                              
                              { displayedExperienceValidator.document_is_public != undefined && displayedExperienceValidator.document_is_public == true &&
                              <>
                                    <h6>Documento</h6>    
                                    <img src={displayedExperienceValidator.document} onClick={() => window.open(displayedExperienceValidator.document, '_blank')} alt="Profile"  style={{ objectPosition: 'left top' }} className="mb-2 object-cover w-full h-40 rounded border opacity-100 hover:opacity-75" />
                              </>}
                              
                              {displayedExperienceValidator?.hours_validated > 0 && <h6 className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Horas validadas: {displayedExperienceValidator.hours_validated}</h6>}
                              <p>Este documento ha sido revisado y aprobado por el equipo de Aprende.Pe, habiendo determinado que este profesor tiene experiencia en los cursos que se encuentran listados aqui.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={() => handleExperienceValidatorModal({})}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>
                  {/* AVAILABLE TIME DETAILS MODAL */}
                  <Modal className='text-xs bg-gray-900 bg-opacity-75' show={showAvailableTimeModal} onHide={() => setShowAvailableTimeModal(false)} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>Tiempo disponible</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                             <Row>
                                    <Col xs={4} md={6}><h5>Hora de inicio</h5></Col>
                                    <Col xs={8} md={6}><h5>{String(Math.floor(displayedAvailableTime.start_time_i)).padStart(2, '0')}:{String(Math.round((displayedAvailableTime.start_time_i % 1) * 60)).padStart(2, '0')}</h5></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h5>Hora de fin</h5></Col>
                                    <Col xs={8} md={6}><h5>{String(Math.floor(displayedAvailableTime.end_time_i)).padStart(2, '0')}:{String(Math.round((displayedAvailableTime.end_time_i % 1) * 60)).padStart(2, '0')}</h5></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h5>Espacios disponibles</h5></Col>
                                    <Col xs={8} md={6}><h5>{displayedAvailableTime.n_vacancies_left}</h5></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h5>Tipo de clase permitida</h5></Col>
                                    <Col xs={8} md={6}>{displayedAvailableTime.class_type?.map((type, i) => <h5 key={i}>{type}</h5>)}</Col>
                              </Row>      
                              <p>El número de espacios indica cuantas reservaciones se pueden hacer en este rango de tiempo. El tipo de clase permitida indica que tipos de clase puede dictar el profesor en este rango de tiempo. Si deseas mas información de como dicta sus clases, puedes enviarle un mensaje.</p>                       
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={() => setShowAvailableTimeModal(false)}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>

                  {/* SUBJECT DETAILS MODAL */}
                  <Modal className='text-xs' show={showSubjectModal} onHide={() => handleSubjectModal({})} centered size="lg">
                        <Modal.Header closeButton>
                              <Modal.Title>{displayedSubject.name}{displayedSubject.is_university_subject ? ` (${displayedSubject.category?.length > 0 && displayedSubject.category.map((category) => category.is_university_degree ? category.university.name : '').filter(Boolean).join(', ')})` : ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                             
                              <h6>Descripción</h6>
                              <p className='text-justify'>{displayedSubject.description}</p>
                              <h6 className='flex flex-wrap mt-1'><span className='mt-2 mr-2'>Categorias:</span>{displayedSubject.category != undefined && displayedSubject.category != null && displayedSubject.category.map((category, i) => <span key={i} className='mr-2 mt-2'>{category.name}</span>)} </h6>
                              <h6 className='flex flex-wrap mt-3'><span className='mr-2'
                              onLoad={(e) => e.target.children[0]?.classList.add('spin-on-load')}
                              onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                              onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                              >Cursos similares:</span>{displayedSubject.related_subjects != undefined && displayedSubject.related_subjects != null && displayedSubject.related_subjects.map((subject, i) => (subject.is_university_subject === displayedSubject.is_university_subject || displayedSubject.is_university_subject) ? <span key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}}  className='font-normal text-xs flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none'>
                                    {subject.name}</span> : null)} </h6>
                                  
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={() => handleSubjectModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>

                  <Row className='my-4'>
                        <Col>
                              <span className='flex align-items-center '>
                                    <img onClick={() => {navigate('/findclasses')}} className='w-5 h-5 mr-3' src='/back_icon.png'/>
                                    <img src={displayedTeacherProfile?.user?.profile_image} className='w-12 h-12 border rounded-full' />
                                    <h6 className='my-0 mx-3 w-1/2' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayedTeacherProfile?.user?.first_name} {displayedTeacherProfile?.user?.last_name}</h6>
                                    <h5 className='my-0 ml-auto'>{displayedTeacherProfile?.hourly_price} {displayedTeacherProfile?.coin?.short_name}</h5>
                              </span >
                              
                              <div className='flex my-3'>
                                    {Array.from({length:Math.ceil(displayedTeacherProfile?.average_rating)}, (_, i) => (
                                                <div key={i}><img src='/star_filled_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                    ))}
                                    {Array.from({length:Math.floor(5-displayedTeacherProfile?.average_rating)}, (_, i) => (
                                                <div key={i}><img src='/star_empty_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                    ))}
                                    <h6 className='mx-3'>{displayedTeacherProfile?.hours_teached_reservations} horas enseñadas</h6>
                              </div>   

                              {!querys.loading ? displayedTeacherProfile.user?.id !== userInfo.user?.id && <div className='mb-3 flex '>
                                    <div className='text-sm py-2 px-3 mr-2 text-white rounded-xl shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{backgroundColor:ORANGE}} onClick={() => handleToCreateReservation(displayedTeacherProfile)}>Hacer Reservación</div>
                                    <div className='text-sm py-2 px-3 mr-2 text-white rounded-xl shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{backgroundColor:BLUE}} onClick={() => handleInitiateChat(displayedTeacherProfile)}>Chatear</div>
                              </div>:
                              <img
                              src="/tail_blue_fast.svg"
                              alt="Loading..."
                              className="w-16 h-auto mr-4"
                              />}
                              <p className='mx-2 text-red-400'>{chatError}</p>

                              <h5>Presentación</h5>
                              <div><TextBox content={displayedTeacherProfile?.resume !== '' ? displayedTeacherProfile?.resume : 'Este profesor no actualizó su presentación'}/></div>
                              <h5>Cursos dictados</h5>
                              <div className='flex flex-wrap text-white border rounded-2xl pt-2 pl-2 mb-4'>
                                    {
                                          displayedTeacherProfile?.subjects?.length > 0 && displayedTeacherProfile.subjects?.map((subject, i) => (
                                                <div key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} className='px-3 py-1 mb-2 rounded-xl mr-2  select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleSubjectModal(subject)}>{subject.name}</div>
                                          )) 
                                    }    
                              </div>
                              <h5>Experiencia validada</h5>
                              <div style={{overflowX:"scroll", overflowY:"hidden"}}  className='flex align-items-center  text-white border rounded-2xl pt-2 pr-2 mb-4'>
                                    {
                                          displayedTeacherProfile.experience_validators?.length > 0 ? displayedTeacherProfile.experience_validators.map((validator, i) => (
                                                validator.approved == true &&
                                                
                                                <div key={i} style={{width:"10rem", minWidth:"10rem"}}  className={`bg-gray-700 p-3 rounded-xl mb-2 ml-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105`}  onClick={() => handleExperienceValidatorModal(validator)}>
                                                      <h6 className='' >
                                                            {validator.subjects?.length} Cursos validados
                                                                  
                                                      </h6>
                                                      <p className='mb-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{validator.message}</p>
                                                      {validator.hours_validated > 0 ? <p className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Horas validadas: {validator.hours_validated}</p> : <p>-</p>}
                                                      <p className={`mb-0 text-green-200`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            Aprobado
                                                      </p>
                                                </div>
                                                
                                          )) : <div className='text-black p-2'>Este profesor aún no ha añadido validadores de experiencia.</div>
                                    }
                              </div>
                              <h5>Horario de disponibilidad</h5>
                              <div className='px-3'>
                                    <Calendar 
                                          reservations={[]} 
                                          weekly_schedule={displayedTeacherProfile.weekly_schedule} 
                                          constants={constants} 
                                          handleShowReservationModal={handleShowReservationModal} 
                                          handleShowAvailableTimeModal={handleShowAvailableTimeModal} 
                                    />
                              </div>
                              
                        </Col>
                  </Row>
                  <Row>
                        <Col md={6}>
                              <h5>Reseñas</h5>
                              <div className=''>
                              {
                                    querys?.selectedTeacherProfileReviews?.reviews != null && querys?.selectedTeacherProfileReviews?.reviews?.length >= 0 ?
                                    querys?.selectedTeacherProfileReviews?.reviews?.map((review) => 
                                    <div className='border rounded-xl p-3 mb-4'>
                                          <span className='flex align-items-center mb-2'>
                                                <img src={review?.user?.profile_image} className='w-12 h-12 border rounded-full' />
                                                <h6 className='my-0 mx-3 w-1/2' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review?.user?.first_name} {review?.user?.last_name}</h6>
                                          </span >
                                          <p className='mb-2'>{dayjs(review?.created_at).format("DD/MM/YYYY HH:mm")}</p>
                                          
                                          <div className='flex mb-3'>
                                                {Array.from({length:Math.round(review.rating)}, (_, i) => (
                                                            <div key={i}><img src='/star_filled_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                                ))}
                                                {Array.from({length:Math.round(5-review.rating)}, (_, i) => (
                                                            <div key={i}><img src='/star_empty_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                                ))}
                                          </div>   
                                          {review.feedback && <>
                                          <h6>Comentario</h6>
                                          <TextBox content={review.feedback}/>
                                          </>}
                                    </div>)
                                    : <div>Este profesor aún no tiene reseñas</div>
                              }</div>
                        <div className='flex mb-32'>
                        Página
                        <div className='flex ml-2 items-center'>
                              <img onClick={() => {handleReviewPageChange(-1)}} className={`w-3 h-3 ${reviewsPage == 1 ? 'opacity-25' : 'scale-100 hover:scale-105'}`} src='/back_icon.png'/>
                              <div className='mx-2'>{reviewsPage}</div>
                              <img onClick={() => {handleReviewPageChange(1)}} className='w-3 h-3 scale-100 hover:scale-105' src='/forward_icon.png'/>
                              {reviewsError != null && reviewsError != '' && <span className='ml-2 text-red-400'>{reviewsError}</span>}
                        </div>
                        
                  </div>
                        </Col>
                  </Row>
            </Container>
      )
}

export default TeacherViewScreen