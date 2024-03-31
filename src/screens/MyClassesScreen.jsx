import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { queryTeacherProfiles, selectTeacherProfile, fetchTeacherProfile } from '../reducers/queryReducers'
import { login, getReservations, resetReservations, createReview } from '../reducers/userReducers';
import { createChat, getUserChats } from '../reducers/chatReducers'

import Calendar from '../components/Calendar';
import ReservationList from '../components/ReservationList';

import { useNavigate } from 'react-router-dom'



import { BASE_URL, BLUE, PINK, ORANGE, GREEN, orderMapping } from '../utils'
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

function MyClassesScreen({ userInfo, userChildren, userChats, constants }) {
      const dispatch = useDispatch();
      const navigate = useNavigate()

      dayjs.extend(utc)
      dayjs.extend(timezone)

      const [reservationsPage, setReservationsPage] = useState(1)
      const [reservationsPageError, setReservationsPageError] = useState('')

      const [showReservationModal, setShowReservationModal] = useState(false)
      const [displayedReservation, setDisplayedReservation] = useState({})

      const [showReviewModal, setShowReviewModal] = useState(false)
      const [feedback, setFeedback] = useState('')
      const [rating, setRating] = useState(5)
      

      const [showTeacherProfileModal, setShowTeacherProfileModal] = useState(false)
      const [displayedTeacherProfile, setDisplayedTeacherProfile] = useState({})

      const [chatError, setChatError] = useState('')
      const [reviewError, setReviewError] = useState('')




      const handleReservationModal = (reservation) => {
            setShowReservationModal(!showReservationModal)
            setDisplayedReservation(reservation)
      }
      const handleTeacherProfileModal = (teacherProfile) => {
            setShowTeacherProfileModal(!showTeacherProfileModal)
            setDisplayedTeacherProfile(teacherProfile)
      }

      // CHAT
      const handleInitiateChat = (teacher) => {
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
      }

      const handleReservationPageChange = (change) => {
            let new_page = reservationsPage + change
            if (new_page > 0){
                  dispatch(getReservations({page:new_page, token:userInfo.token}))
                  .then((result) => {
                        if (result.error.message) {
                              setReservationsPageError(result.error.message)
                        }
                        if (result.payload) {
                              if (result.payload.error) {
                                    setReservationsPageError(result.payload.error)
                              } else {
                                    setReservationsPage(new_page)
                                    setReservationsPageError('')
                              }
                        } 
                  })
            }
            
      }

      const handleReviewModal = (reservation) => {
            let currentDate = new Date();
            let end_time = new Date(reservation?.end_time)
            if (end_time < currentDate) {
                  setReviewError('')
                  setChatError('')
                  setShowReservationModal(false)
                  setDisplayedReservation(reservation)
                  setShowReviewModal(true)
            } else {
                  setChatError('Solo puede dejar reseñas una vez pasado el tiempo de la reservación')
            }
      }

      const handleChangeRating = (rating) => {
            if (0 <= rating && rating <= 5) {
                  setRating(rating)
            } else {
                  setRating(5)
            }
      }

      const handleCreateReview = (e) => {
            e.preventDefault()
            setReviewError('')
            dispatch(createReview({user_id:userInfo?.user?.id, teacher_id:displayedReservation?.teacher?.id, reservation_id:displayedReservation?.id, rating:rating, feedback:feedback, token:userInfo?.token }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload.error) {
                              setReviewError(result.payload.error)
                        } else {
                              setRating(5)
                              setFeedback('')
                              setShowReviewModal(false)
                              setReviewError('')
                        }
                    
                  } else {
                        setReviewError(result.error.message)
                        
                  }
            })


      }

      useEffect(() => {
            dispatch(resetReservations())
            dispatch(getReservations({ page:reservationsPage, token:userInfo.token }))
      }, [])

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      return (
            <Container>
                  {/* TEACHER PROFILE DETAIL MODAL */}
                  <Modal className='text-xs bg-gray-700 bg-opacity-75' show={showTeacherProfileModal} onHide={() => handleTeacherProfileModal({})} centered size='md'>                        
                        <Modal.Body className='p-4'>
                              <span className='flex align-items-center m-2'>
                                    <img src={displayedTeacherProfile?.user?.profile_image} className='w-12 h-12 border rounded-full' />
                                    <h6 className='my-0 mx-3 w-3/4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayedTeacherProfile?.user?.first_name} {displayedTeacherProfile?.user?.last_name}</h6>
                              </span >
                              <h5 className='mx-2 mt-4'>Presentación</h5>
                              <div className='mx-2 p-2 mb-4 border rounded-xl bg-gray-100'>
                                    
                                    {displayedTeacherProfile?.resume !== '' ? displayedTeacherProfile?.resume : 'Este profesor no actualizó su presentación'}
                              </div>

                              <h5 className='mx-2'>Cursos dictados</h5>
                              <div className='flex flex-wrap mb-3 px-2 text-white'>
                                    {
                                          displayedTeacherProfile?.subjects?.length > 0 && displayedTeacherProfile.subjects?.map((subject, i) => (
                                                <div key={i} className={`px-3 py-1 rounded-xl mr-2 mb-2 select-none ${subject.is_university_subject ? 'bg-gray-700' : 'bg-gray-500'}`} >{subject.name}</div>
                                          )) 
                                    }    
                              </div>
                              <h5 className='mx-2'>Experiencia validada</h5>
                              <div style={{overflowX:"scroll", overflowY:"hidden"}}  className='flex align-items-center py-1 mb-4  text-white'>
                                    {
                                          displayedTeacherProfile.experience_validators?.length > 0 && displayedTeacherProfile.experience_validators.map((validator, i) => (
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
                                                
                                          )) 
                                    }
                              </div>                                                            
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={() => handleTeacherProfileModal({})}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>
                  {/* SHOW RESERVATION MODAL */}
                  <Modal className='text-xs' show={showReservationModal} onHide={() => {handleReservationModal({})}} centered size="lg" >
                        <Modal.Header>
                              <Modal.Title className=''>
                                    <h3>Reserva {displayedReservation?.id?.toString().padStart(6, '0')}</h3>
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              {displayedReservation?.canceled && <>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Estado</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6 className='text-red-400'>CANCELADO POR EL PROFESOR</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Mensaje de cancelación</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='p-2 border bg-gray-100 rounded-xl'>
                                                <p className='m-0 min-h-4'>{displayedReservation?.cancelation_reason}</p>
                                          </div>
                                    </Col>
                              </Row>
                              <hr></hr></>
                              }
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Profesor</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div onClick={() => {handleTeacherProfileModal(displayedReservation?.teacher)}} className='flex items-center border p-2 rounded-xl'>
                                                <img src={displayedReservation?.teacher?.user?.profile_image} className='w-10 h-10 rounded-full mr-2'/>
                                                <h6 className='m-0'>{displayedReservation?.teacher?.user?.first_name} {displayedReservation?.teacher?.user?.last_name}</h6>
                                          </div>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Cursos</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='flex flex-wrap px-2 text-white border pt-2 rounded-xl'>
                                                {
                                                      displayedReservation?.subjects?.length > 0 && displayedReservation.subjects?.map((subject, i) => (
                                                            <div key={i} className={`px-3 py-1 rounded-xl mr-2 mb-2 select-none ${subject.is_university_subject ? 'bg-gray-700' : 'bg-gray-500'}`} >{subject.name}</div>
                                                      )) 
                                                }    
                                          </div>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Comprobante de pago</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div onClick={() => {window.open(`${displayedReservation?.payment_proof}`, '_blank')}} className='p-2 text-blue-400 border rounded-xl select-none'>
                                                Link de la imagen
                                          </div>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Boleta o factura</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          {displayedReservation?.invoice != null && displayedReservation?.invoice != '' ?
                                          <div onClick={() => {window.open(`${displayedReservation?.invoice}`, '_blank')}} className='p-2 text-blue-400 border rounded-xl select-none'>
                                                Link de la imagen
                                          </div>
                                          : <div className='p-2 text-gray-400 border rounded-xl select-none'>
                                                El profesor ingresará aquí la boleta o factura si es necesario
                                          </div>
                                          }
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Modalidad</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{displayedReservation?.class_type?.name}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Fecha</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{new Date(displayedReservation?.start_time)?.getDate().toString().padStart(2, '0')}/{(new Date(displayedReservation?.start_time)?.getMonth() + 1)?.toString().padStart(2, '0')}/{new Date(displayedReservation?.start_time)?.getFullYear()}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Hora de inicio</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{new Date(displayedReservation?.start_time)?.getHours().toString().padStart(2, '0')}:{new Date(displayedReservation?.start_time)?.getMinutes().toString().padStart(2, '0')}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Hora de fin</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{new Date(displayedReservation?.end_time)?.getHours().toString().padStart(2, '0')}:{new Date(displayedReservation?.end_time)?.getMinutes().toString().padStart(2, '0')}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Precio total</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{displayedReservation?.total_price} {displayedReservation?.coin?.short_name}</h6>
                                    </Col>
                              </Row>
                              {displayedReservation?.message !== null && displayedReservation?.message !== '' &&
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Mensaje al profesor</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='p-2 border bg-gray-100 rounded-xl'>
                                                <p className='m-0 min-h-4'>{displayedReservation?.message}</p>
                                          </div>
                                    </Col>
                              </Row>}
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h5>Invitación del profesor</h5>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='p-2 border bg-gray-100 rounded-xl'>
                                                {displayedReservation?.invitation !== null && displayedReservation?.invitation !== '' ? 
                                                      <p className='m-0 min-h-4'>{displayedReservation?.invitation}</p> : 
                                                      <p className='m-0 min-h-4 text-gray-400'>El profesor ingresará un mensaje aqui si es necesario</p>
                                                }
                                          </div>
                                    </Col>
                              </Row>
                        </Modal.Body>
                        <Modal.Footer className='flex flex-col '>
                              <div className='d-flex w-full justify-end'>
                                    <Button variant='primary' onClick={() => handleReviewModal(displayedReservation)}>Dejar reseña</Button>
                                    <Button className='ml-auto mr-2' variant="primary" onClick={() => handleInitiateChat(displayedReservation?.teacher)}>Chatear con el profesor</Button>
                                    <Button variant="secondary" onClick={() => handleReservationModal({})}>Cerrar</Button>
                              </div>
                              {chatError != '' &&
                                    <div className='w-full text-red-400 text-end p-2'>{chatError}</div> 
                              }
                        </Modal.Footer>
                  </Modal>

                  {/* USER INFO EDIT MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showReviewModal} onHide={() => {setShowReviewModal(false)}} centered size="md">
                        <Form onSubmit={(e) => {handleCreateReview(e)}}>
                              <Modal.Header closeButton>
                                    <Modal.Title>Crear reseña</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                    <Form.Group controlId='rating' className='w-full mb-3'>
                                          <Row>
                                                <Col xs={3} md={4}>
                                                      <Form.Label><h6>Calificación</h6></Form.Label>
                                                </Col>
                                                <Col xs={9} md={8} className='flex pr-0'>
                                                      <Form.Control
                                                            type='number'
                                                            name='rating'
                                                            value={rating}
                                                            onChange={(e) => handleChangeRating(e.target.value)}
                                                      />
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    <Form.Group controlId='feedback' className='mb-3'>
                                          <Row>
                                                <Col xs={3} md={4}>
                                                      <Form.Label><h6>Comentario</h6></Form.Label>
                                                </Col>
                                                <Col xs={9} md={8}>
                                                      <Form.Control
                                                            as="textarea" rows={3}
                                                            name='feedback'
                                                            placeholder="Ingrese un comentario"
                                                            value={feedback}
                                                            onChange={(e) => setFeedback(e.target.value)}
                                                            className='rounded border'
                                                      />
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    
                                    <p className='text-justify'>Esta reseña será visible en el perfil del profesor.</p>                  
                              </Modal.Body>
                              <Modal.Footer className='flex flex-col'>
                                    {!userChildren.loading ? <div className='flex w-full justify-end'>
                                    <Button className='mr-2' variant="primary" type='submit' >
                                          Guardar
                                    </Button>
                                    <Button variant="secondary" onClick={() => {setShowReviewModal(false)}}>
                                          Cancelar
                                    </Button>
                                    </div> : <div className='flex w-full justify-end'><img
                                                src="/tail_blue_fast.svg"
                                                alt="Loading..."
                                                className="max-h-8 "
                                          /></div>}
                                    <div className='w-full text-end p-2 text-red-400'>{reviewError}</div>
                              </Modal.Footer>
                              
                        </Form>
                  </Modal>

                  <Row className='py-4'>
                        <Col>
                              <h5>Tus clases</h5>
                              <ReservationList 
                                    list={userChildren?.reservations?.reservations} 
                                    handleOpenItem={handleReservationModal} 
                                    isLoading={userChildren?.loading}
                                    isTeacher={false} 
                                    page={reservationsPage}
                                    handlePageChange={handleReservationPageChange}
                                    pageError={reservationsPageError}
                              />
                              <h5>Tu horario de clases</h5>
                              <div className='px-3 mt-2'>
                                    <Calendar 
                                          reservations={userChildren?.reservations?.reservations} 
                                          constants={constants} 
                                          handleShowReservationModal={() => {}} 
                                          handleShowAvailableTimeModal={() => {}} 
                                    />
                              </div>
                        </Col>
                  </Row>
            </Container>

      )
}

export default MyClassesScreen