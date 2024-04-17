import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Calendar from '../components/Calendar';
import PlanOptions from '../components/PlanOptions';
import TextBox from '../components/ui/TextBox';
import ReservationList from '../components/ReservationList';

import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'
import { getTeacherReservations, getTeacherProfile, createTeacherProfile, resetTeacherReservations, addSubject, deleteSubject, addExperienceValidator, deleteExperienceValidator, editConfiguration, addAvailableTime, deleteAvailableTime, editReservation } from '../reducers/teacherReducers'
import { createChat, getUserChats } from '../reducers/chatReducers'

import { DatePicker, TimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useNavigate } from 'react-router-dom'




function TeacherProfileScreen({ userInfo, teacherProfile, userChildren, userChats, categories, universities, constants }) {
      const dispatch = useDispatch()
      const navigate = useNavigate()

      dayjs.extend(utc)
      dayjs.extend(timezone)

      // SUBJECT
      const [teacherSubjects, setTeacherSubjects] = useState([])
      const [displayedSubject, setDisplayedSubject] = useState({})

      // EXPERIENCE VALIDATORS
      const [teacherExperienceValidators, setTeacherExperienceValidators] = useState({})
      const [displayedExperienceValidator, setDisplayedExperienceValidator] = useState({})

      // MODALS

      // CATEGORY / SUBJECTS MODAL
      const [showCategoriesModal, setShowCategoriesModal] = useState(false)
      const [showSubjectModal, setShowSubjectModal] = useState(false)
      const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
      const [showDeleteSubjectModal, setShowDeleteSubjectModal] = useState(false)

      const [showUniversities, setShowUniversities] = useState(false)
      const [openUniversity, setOpenUniversity] = useState(null)
      const [openCategory, setOpenCategory] = useState(null)
      const [search, setSearch] = useState('');


      // EXPERIENCE VALIDATOR MODAL
      const [showExperienceValidatorModal, setShowExperienceValidatorModal] = useState(false)
      const [showAddExperienceValidatorModal, setShowAddExperienceValidatorModal] = useState(false)
      const [showDeleteExperienceValidatorModal, setShowDeleteExperienceValidatorModal] = useState(false)

      const [validationMessage, setValidationMessage] = useState('')
      const [validationHours, setValidationHours] = useState(0)
      const [validationDocumentIsPublic, setValidationDocumentIsPublic] = useState(false)

      // CONFIGURATION MODAL
      const [showEditConfigurationModal, setShowEditConfigurationModal] = useState(false)
      const [resume, setResume] = useState('')
      const [paymentCredentials, setPaymentCredentials] = useState('')
      const [paymentQr, setPaymentQr] = useState('')
      const [hourlyPrice, setHourlyPrice] = useState(0)
      const [coin, setCoin] = useState('')

      // AVAILABLE TIME MODAL
      const [showAddAvailableTimeModal, setShowAddAvailableTimeModal] = useState(false)

      const currentDate = new Date();
      const isoStringInTimeZone = currentDate.toLocaleString('en-US', { timeZone: dayjs.tz.guess() });

      const [availableDate, setAvailableDate] = useState(isoStringInTimeZone)
      const [availableStartTime, setAvailableStartTime] = useState(isoStringInTimeZone)
      const [availableEndTime, setAvailableEndTime] = useState(isoStringInTimeZone)
      const [availableRepeatTimes, setAvailableRepeatTimes] = useState(1)
      const [availableRepeatInterval, setAvailableRepeatInterval] = useState('dias')
      const [availableVacancies, setAvailableVacancies] = useState(1)
      const [availableError, setAvailableError] = useState('')

      // DETAILS MODAL
      const [displayedAvailableTime, setDisplayedAvailableTime] = useState({})
      const [showAvailableTimeModal, setShowAvailableTimeModal] = useState(false)
      const [showDeleteAvailableTimeModal, setShowDeleteAvailableTimeModal] = useState(false)
      

      //RESERVATIONS
      const [showReservationModal, setShowReservationModal] = useState(false)
      const [displayedReservation, setDisplayedReservation] = useState({})
      const [reservationsPage, setReservationsPage] = useState(1)
      const [reservationsPageError, setReservationsPageError] = useState('')

      const [showEditReservationModal, setShowEditReservationModal] = useState(false)
      const [invitation, setInvitation] = useState('')
      const [canceled, setCanceled] = useState(false)
      const [cancelationReason, setCancelationReason] = useState('')

      const [chatError, setChatError] = useState('')


      const handleReservationPageChange = (change) => {
            let new_page = reservationsPage + change
            if (new_page > 0){
                  dispatch(getTeacherReservations({page:new_page, token:userInfo.token}))
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


      const handleReservationModal = (reservation) => {
            setShowReservationModal(!showReservationModal)
            setDisplayedReservation(reservation)
      }

      
      const handleEditReservationModal = (reservation) => {
            setShowReservationModal(false)
            setShowEditReservationModal(!showEditReservationModal)
            setDisplayedReservation(reservation ?? {})
            setInvitation(reservation?.invitation ?? '')
            setCanceled(reservation?.canceled ?? false)
            setCancelationReason(reservation?.cancelation_reason ?? '')
      }
      
      const handleEditReservation = (e) => {
            e.preventDefault()
            setShowEditReservationModal(false)
            const form_data = new FormData(e.target)
            let invoice = form_data.get('invoice')
            dispatch(editReservation({
                  reservation_id:displayedReservation.id,
                  invitation:invitation,
                  invoice:invoice.size !== 0 ? invoice : null,
                  canceled:canceled,
                  cancelation_reason:cancelationReason,
                  token:userInfo.token
            }))
            setInvitation('')
            setCanceled(false)
            setCancelationReason('')
      }

      // CHAT
      const handleInitiateChat = (student) => {
            if(student.id == userInfo.user.id){
                  return null
            }
            let foundChat = userChats.chats?.find(obj => obj.student.id == student.id && obj.teacher.id == teacherProfile.teacherProfile.id)

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


   
      
      // SUBJECTS LOGIC
      // opening/closing categories modal
      const handleCategoriesModal = () => {
            setShowCategoriesModal(!showCategoriesModal)
            setShowUniversities(false)
            setOpenCategory(null)
            setOpenUniversity(null)
      }
      // searching categories
      const handleSearch = (e) => {
            setSearch(e.target.value)
      }
      // showing/hiding universities
      const handleShowUniversities = (value) => {
            setShowUniversities(value)
            setSearch('')
      }
      // open specific university
      const handleOpenUniversity = (university_id) => {
            if(openUniversity == university_id){
                  setOpenUniversity(null)
            } else {
                  setOpenUniversity(university_id)
            }
      }
      // open specific category
      const handleOpenCategory = (category_id) => {
            if(openCategory == category_id){
                  setOpenCategory(null)
            } else {
                  setOpenCategory(category_id)
            }
      }

      
      // SUBJECT DETAILS MODAL
      // open/close subject modal
      const handleSubjectModal = (subject) => {
            setShowSubjectModal(!showSubjectModal)
            setDisplayedSubject(subject)
      }
      // open/close add subject verification modal
      const handleAddSubjectModal = (subject) => {
            setShowSubjectModal(false) // closes any subject details model that was open
            setShowAddSubjectModal(!showAddSubjectModal)
            setDisplayedSubject(subject)
      }
      // add subject
      const handleAddSubject = (subject) => {
            setShowAddSubjectModal(false)
            setShowCategoriesModal(false)
            dispatch(addSubject({token:userInfo.token, subject_id:subject.id}))
      }
      // open/close delete subject verification modal
      const handleDeleteSubjectModal = () => {
            setShowSubjectModal(false)
            setShowDeleteSubjectModal(!showDeleteSubjectModal)
      } 
      // delete subject 
      const handleDeleteSubject = (subject) => {
            setShowDeleteSubjectModal(false)
            dispatch(deleteSubject({token:userInfo.token, subject_id:subject.id}))
      }

      // EXPERIENCE VALIDATOR MODALS
      // opening/closing ExperienceValidator details modal
      const handleExperienceValidatorModal = (experienceValidator) => {
            setShowExperienceValidatorModal(!showExperienceValidatorModal)
            setDisplayedExperienceValidator(experienceValidator)
      }
      // open/close add ExperienceValidator verification modal
      const handleAddExperienceValidatorModal = () => {
            setShowExperienceValidatorModal(false) // closes any subject details model that was open
            setShowAddExperienceValidatorModal(!showAddExperienceValidatorModal)
      }
      // add ExperienceValidator
      const handleAddExperienceValidator = (e) => {
            e.preventDefault()
            setShowAddExperienceValidatorModal(false)
            const form_data = new FormData(e.target)
            let subjects = form_data.getAll('subjects').map((str) => parseInt(str,10))
            let document = form_data.get('document')
            let message = form_data.get('message')
            let hours_validated = form_data.get('hours_validated')
            let document_is_public = form_data.get('document_is_public')
            dispatch(addExperienceValidator({
                  token:userInfo.token, 
                  subjects:subjects, 
                  document:document,
                  message:message,
                  hours_validated:hours_validated,
                  document_is_public:document_is_public
            }))
            setValidationMessage('')
            setValidationHours(0)
            setValidationDocumentIsPublic(false)
      }
      // open/close delete ExperienceValidator verification modal
      const handleDeleteExperienceValidatorModal = () => {
            setShowExperienceValidatorModal(false)
            setShowDeleteExperienceValidatorModal(!showDeleteExperienceValidatorModal)
      } 
      // delete ExperienceValidator 
      const handleDeleteExperienceValidator = (experienceValidator) => {
            setShowDeleteExperienceValidatorModal(false)
            dispatch(deleteExperienceValidator({token:userInfo.token, validator_id:experienceValidator.id}))
      }


      // EDIT CONFIGURATION MODAL
      // open/close edit configuration modal
      const handleEditConfigurationModal = () => {
            setResume(teacherProfile.teacherProfile.resume)
            setPaymentCredentials(teacherProfile.teacherProfile.payment_credentials)
            setPaymentQr(teacherProfile.teacherProfile.payment_qr)
            setHourlyPrice(teacherProfile.teacherProfile.hourly_price)
            setShowEditConfigurationModal(!showEditConfigurationModal)
      }

      // submit edit configuration modal
      const handldeSubmitEditConfigurationModal = (e) => {
            e.preventDefault()
            setShowEditConfigurationModal(false)
            const form_data = new FormData(e.target)
            let resume = form_data.get('resume')
            let hourly_price = form_data.get("hourly_price")
            let payment_credentials = form_data.get("payment_credentials")
            let coin_id = constants.coin_types.find((obj) => obj.short_name == coin).id

            dispatch(editConfiguration({ resume:resume, payment_credentials:payment_credentials, payment_qr:null, hourly_price:hourly_price, coin:coin_id, token:userInfo.token }));

            /* This would print all the values of the form data
            let form_values = {}
            for (const [key, value] of form_data.entries()) { form_values[key] = value; }
            console.log(form_values)
            */
      }
      const handleCoinChange = (value) => {
            /* This would convert the hourly price to the coin equivalence
            let coin_object = constants.coin_types?.length > 0 ? constants.coin_types.find((coin_type) => coin_type.short_name == coin) : undefined
            let new_coin = constants.coin_types?.length > 0 ? constants.coin_types.find((coin_type) => coin_type.short_name == value) : undefined
            let factor =coin_object.dolar_equivalence / new_coin.dolar_equivalence 
            setHourlyPrice(Math.round(hourlyPrice * factor * 10000) / 10000)
            */
            setCoin(value)
      }


      // ADD AVAILABLE TIME MODAL
      // open/close add available time modal
      const handleAddAvailableTimeModal = () => {
      
            const currentDate = new Date();
            const isoStringInTimeZone = currentDate.toLocaleString('en-US', { timeZone: dayjs.tz.guess() });
      
            setAvailableDate(isoStringInTimeZone)
            setAvailableStartTime(isoStringInTimeZone)
            setAvailableEndTime(isoStringInTimeZone)
            setAvailableRepeatTimes(1)
            setAvailableRepeatInterval('dias')
            setAvailableVacancies(1)
            setAvailableError('')
            setShowAddAvailableTimeModal(!showAddAvailableTimeModal)
         
      }

      // CALENDAR AVAILABE TIME MODALS
      const handleShowReservationModal = (calendar_reservation) => {
            let reservation_id = calendar_reservation.id
            let reservation = teacherProfile.teacherProfile.reservations.reservations.find((item) => item.id === reservation_id)
            setDisplayedReservation(reservation)
            setShowReservationModal(!showReservationModal)
      }
      const handleShowAvailableTimeModal = (event) => {
            setDisplayedAvailableTime(event)
            setShowAvailableTimeModal(!showAvailableTimeModal)
      }

      const handleSubmitAddAvailableTimeModal = (e) => {
            e.preventDefault()
            
            const form_data = new FormData(e.target)
            let start_time = new Date(availableDate.split(',')[0] + availableStartTime.split(',')[1])
            let end_time = new Date(availableDate.split(',')[0]  + availableEndTime.split(',')[1])

            let vacancies = availableVacancies
            let repeat_times = availableRepeatTimes
            let repeat_interval = availableRepeatInterval
            let class_types = form_data.getAll('class_types').map((str) => parseInt(str,10))
            let user_timezone = dayjs.tz.guess()

            if(vacancies >= 50) { setAvailableError('La máxima cantidad de reservas debe ser menor que 50'); return }
            if(repeat_times >= 40){ setAvailableError('La máxima cantidad de repeticiones es 40'); return }
            if(start_time.getHours() >= end_time.getHours()) { setAvailableError('El tiempo disponible debe ser de almenos 1 hora'); return }

            for(let i=0;i<teacherProfile.teacherProfile.weekly_schedule?.length;i++){
                  let item = teacherProfile.teacherProfile.weekly_schedule[i]
                  let item_start_time_miliseconds = new Date(item.start_time).getTime()
                  let item_end_time_miliseconds = new Date(item.end_time).getTime()
                  let start_time_miliseconds = start_time.getTime()
                  let end_time_miliseconds = end_time.getTime()
                  if(start_time_miliseconds >= item_start_time_miliseconds && start_time_miliseconds <= item_end_time_miliseconds){setAvailableError('Ya cuenta con un tiempo disponible en ese horario'); return}
                  if(end_time_miliseconds >= item_start_time_miliseconds && end_time_miliseconds <= item_end_time_miliseconds){setAvailableError('Ya cuenta con un tiempo disponible en ese horario'); return}
            } 
                  
            setAvailableError('')
            setShowAddAvailableTimeModal(false)
            
            dispatch(addAvailableTime({ start_time:start_time.toISOString(), end_time:end_time.toISOString(), user_timezone:user_timezone, vacancies:vacancies, repeat_times:repeat_times, repeat_interval:repeat_interval, class_types:class_types, token:userInfo.token }))
            
            /* This would print all the values of the form data 
            let form_values = {}
            for (const [key, value] of form_data.entries()) { form_values[key] = value; }
            console.log(form_values)
            */
      }



      // VARIABLE INITIAL SETUP

      useEffect(() => {
            // LISTS
            setTeacherSubjects(teacherProfile.teacherProfile.subjects || [])
            setTeacherExperienceValidators(teacherProfile.teacherProfile.experience_validators || [])
            // EDIT CONFIG
            setResume(teacherProfile.teacherProfile.resume)
            setPaymentCredentials(teacherProfile.teacherProfile.payment_credentials)
            setPaymentQr(teacherProfile.teacherProfile.payment_qr)
            setHourlyPrice(teacherProfile.teacherProfile.hourly_price)
            setCoin(teacherProfile.teacherProfile.coin?.short_name)

      }, [teacherProfile.teacherProfile])

      useEffect(() => {
            dispatch(getTeacherProfile({token:userInfo.token}))
            if (teacherProfile.teacherProfile !== undefined && userInfo.user !== null && Object.keys(teacherProfile.teacherProfile)?.length >= 3) {
                  dispatch(resetTeacherReservations())
                  dispatch(getTeacherReservations({ page:reservationsPage, token:userInfo.token }))
            } else {
                  navigate('/teacher-landing')
            }
            
      }, [])

      const formatDaysHoursMinutesSeconds = ({date_string, dias=false, horas=false, minutos=false, segundos=false}) => {
            // recives date string formats: 'days hours:minutes:seconds' - 'hours:minutes:seconds'
            return (
                  <h6>
                        {date_string.includes(" ") ? `${dias ? `${parseInt(date_string.split(" ")[0],10)} dias ` : ''}${horas ? `${parseInt(date_string.split(" ")[1].split(":")[0],10)} horas ` : ''}${minutos ? `${parseInt(date_string.split(" ")[1].split(":")[1],10)} minutos ` : ''}${segundos ? `${parseInt(date_string.split(" ")[1].split(":")[2],10)} segundos` : ''}` :
                              `${horas ? `${parseInt(date_string.split(":")[0],10)} horas ` : ''}${minutos ? `${parseInt(date_string.split(":")[1],10)} minutos ` : ''}${segundos ? `${parseInt(date_string.split(":")[2],10)} segundos` : ''}`
                        } 
                  </h6>
            )
      }

      const fileInputRef = useRef(null);
      const handleImageClick = () => {
            fileInputRef.current.click(); // Trigger the file input click
      };
      
      const handleFileChange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                  dispatch(editConfiguration({ payment_credentials:teacherProfile.teacherProfile.payment_credentials, payment_qr:selectedFile, hourly_price:teacherProfile.teacherProfile.hourly_price, coin:teacherProfile.teacherProfile.coin.id, token:userInfo.token }));
            }
      };

      const handleDeleteAvailableTime = (id) => {
            dispatch(deleteAvailableTime({ id:id, token:userInfo.token }));
      }

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])
      

      return (
            <div className=''>
                  {     teacherProfile.teacherProfile !== undefined && userInfo.user !== null && Object.keys(teacherProfile.teacherProfile)?.length >= 3 ? (
            <Container  className="py-3">

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
                                          <h6>Estado</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6 className='text-red-400'>CANCELADO POR EL PROFESOR</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Mensaje de cancelación</h6>
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
                                          <h6>Alumno</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='flex items-center border p-2 rounded-xl'>
                                                <img src={displayedReservation?.user?.profile_image} className='w-10 h-10 rounded-full mr-2'/>
                                                <h6 className='m-0'>{displayedReservation?.user?.first_name} {displayedReservation?.user?.last_name}</h6>
                                          </div>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Cursos</h6>
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
                                          <h6 className='whitespace-normal'>Comprobante de pago</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div onClick={() => {window.open(`${displayedReservation?.payment_proof}`, '_blank')}} className='p-2 text-blue-400 border rounded-xl select-none'>
                                                Link de la imagen
                                          </div>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Boleta o factura</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          {displayedReservation?.invoice != null && displayedReservation?.invoice != '' ?
                                          <div onClick={() => {window.open(`${ displayedReservation?.invoice}`, '_blank')}} className='p-2 text-blue-400 border rounded-xl select-none'>
                                                Link de la imagen
                                          </div>
                                          : <div className='p-2 text-gray-400 border rounded-xl select-none'>
                                                Usted puede ingresar aqui la boleta o factura
                                          </div>
                                          }
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Modalidad</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{displayedReservation?.class_type?.name}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Fecha</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{new Date(displayedReservation?.start_time)?.getDate().toString().padStart(2, '0')}/{(new Date(displayedReservation?.start_time)?.getMonth() + 1)?.toString().padStart(2, '0')}/{new Date(displayedReservation?.start_time)?.getFullYear()}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Hora de inicio</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{new Date(displayedReservation?.start_time)?.getHours().toString().padStart(2, '0')}:{new Date(displayedReservation?.start_time)?.getMinutes().toString().padStart(2, '0')}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Hora de fin</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{new Date(displayedReservation?.end_time)?.getHours().toString().padStart(2, '0')}:{new Date(displayedReservation?.end_time)?.getMinutes().toString().padStart(2, '0')}</h6>
                                    </Col>
                              </Row>
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Precio total</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{displayedReservation?.total_price} {displayedReservation?.coin?.short_name}</h6>
                                    </Col>
                              </Row>
                              {displayedReservation?.message !== null && displayedReservation?.message !== '' &&
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Mensaje al profesor</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='p-2 border bg-gray-100 rounded-xl'>
                                                <p className='m-0 min-h-4'>{displayedReservation?.message}</p>
                                          </div>
                                    </Col>
                              </Row>}
                              <Row className='mb-3'>
                                    <Col xs={4} md={6}>
                                          <h6>Invitación del profesor</h6>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='p-2 border bg-gray-100 rounded-xl'>
                                                {displayedReservation?.invitation !== null && displayedReservation?.invitation !== '' ? 
                                                      <p className='m-0 min-h-4'>{displayedReservation?.invitation}</p> : 
                                                      <p className='m-0 min-h-4 text-gray-400'>Usted puede ingresar aqui una invitación al alumno</p>
                                                }
                                          </div>
                                    </Col>
                              </Row>
                        </Modal.Body>
                        <Modal.Footer className='flex flex-wrap'>
                              <Button variant="primary" className='mb-2' onClick={() => handleInitiateChat(displayedReservation?.user)}>Chatear con el alumno</Button>
                              <Button variant="secondary" className='mb-2' onClick={() => handleEditReservationModal(displayedReservation)}>Editar</Button>
                              <Button variant="secondary" className='mb-2' onClick={() => handleReservationModal({})}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>
                  {/* EDIT RESERVATION MODAL */}
                  <Modal className='bg-gray-800 bg-opacity-75 text-xs' show={showEditReservationModal} onHide={() => {handleEditReservationModal({})}} centered size="lg" >
                        <Form onSubmit={(e) => {handleEditReservation(e)}}>
                              <Modal.Header>
                                    <Modal.Title className=''>
                                          <h3>Editar reserva {displayedReservation?.id?.toString().padStart(6, '0')}</h3>
                                    </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                    <Form.Group controlId='invitation' className='mb-3'>
                                          <Row>
                                                <Col xs={3} md={4}>
                                                      <Form.Label><h6>Invitación para el alumno</h6></Form.Label>
                                                </Col>
                                                <Col xs={9} md={8}>
                                                      <Form.Control
                                                            as="textarea" rows={3}
                                                            name='invitation'
                                                            placeholder="Ingrese una invitación para el alumno"
                                                            value={invitation}
                                                            onChange={(e) => setInvitation(e.target.value)}
                                                            className='rounded border'
                                                      />
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    <Form.Group controlId='invoice' className='mb-3'>
                                          <Row>
                                                <Col xs={3} md={4}>
                                                      <Form.Label><h6>Boleta o factura</h6></Form.Label>
                                                </Col>
                                                <Col xs={9} md={8}>
                                                      <Form.Control type="file" name="invoice" accept="image/*"/>
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    <Form.Group controlId='canceled' className='mb-3'>
                                          <Row>
                                                <Col xs={3} md={4}>
                                                      <Form.Label><h6>Cancelar reserva</h6></Form.Label>
                                                </Col>
                                                <Col xs={9} md={8}>
                                                      <div className='w-16 p-0.5' style={{border:'1px solid #c4c4c4', borderRadius:'20px'}} onClick={() => {setCanceled(!canceled); setCancelationReason('')}}>
                                                            <div className={`rounded-full h-6 w-6  transition-transform-translate duration-500 ease-in-out ${canceled ? 'bg-red-600 translate-x-8' : 'bg-gray-400'} `}></div>
                                                      </div>
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    {canceled && <Form.Group controlId='cancelation_reason' className='mb-3'>
                                          <Row>
                                                <Col xs={3} md={4}>
                                                      <Form.Label><h6>Mensaje de cancelación <span className='text-red-400'>*</span></h6> </Form.Label>
                                                </Col>
                                                <Col xs={9} md={8}>
                                                      <Form.Control
                                                            as="textarea" rows={3}
                                                            name='cancelation_reason'
                                                            placeholder="Ingrese la razón de la cancelación de la reserva"
                                                            value={cancelationReason}
                                                            onChange={(e) => setCancelationReason(e.target.value)}
                                                            className='rounded border'
                                                            required={canceled}
                                                      />
                                                </Col>
                                          </Row>
                                    </Form.Group>}
                              </Modal.Body>
                              <Modal.Footer>
                                    <Button variant="primary" type="submit">Guardar</Button>
                                    <Button variant="secondary" onClick={() => setShowEditReservationModal(false)}>Cerrar</Button>
                              </Modal.Footer>
                        </Form>
                  </Modal>


                  {/* SUBJECT CATEGORIES MODAL */}
                  <Modal className='text-xs' show={showCategoriesModal} onHide={() => handleCategoriesModal()} centered size="lg">
                        <Modal.Header closeButton className='align-items-center'>
                              <Modal.Title className=''>
                                    <span className={`select-none ${showUniversities ? 'text-gray-400 font-normal' : ''}`} onClick={() => handleShowUniversities(false)}>Categorias</span> <span className='text-gray-200 font-thin'>|</span> <span className={`select-none ${showUniversities ? '' : 'text-gray-400 font-normal'}`} onClick={() => handleShowUniversities(true)}>Universidades</span>
                              </Modal.Title>
                              <span className='ml-auto mt-1 w-6 h-6 select-none' onClick={() => handleCategoriesModal()}>
                                    <img src="/cross_thin_icon.png"
                                    style={{
                                          transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                    }}                                  
                                    onLoad={(e) => e.target.classList.add('spin-on-load')}
                                    onMouseOver={(e) => e.target.classList.add('spin-on-hover')}
                                    onMouseOut={(e) => e.target.classList.remove('spin-on-hover')}
                                    /></span>
                              
                        </Modal.Header>
                        
                        <Modal.Body className='' style={{height:500, overflowY:'scroll', overflowX:'hidden'}}>
                              <Form className="flex">
                                    <Form.Group className="mb-3 w-full" controlId="formBasicText">
                                          <Form.Control 
                                                value={search} 
                                                onChange={handleSearch}
                                                type="text" 
                                                placeholder="Buscar" 
                                                className=''
                                          />
                                    </Form.Group>
                              </Form>
                              {
                                    showUniversities ? 
                                          universities.universities !== undefined && universities.universities !== null ? universities.universities.map((university, i) => (
                                                university.name.toLowerCase().includes(search) && university.degrees !== undefined && university.degrees !== null && university.degrees?.length > 0 ? 
                                                <div key={i}>
                                                      <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenUniversity(university.id)}>
                                                            <h6>{university.name}</h6>
                                                            <img className={`w-3 h-3 transition-transform transform ${university.id == openUniversity ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                      </div>
                                                      <div className={`mt-3 transition-transform transform ${university.id == openUniversity ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                            {
                                                            university.id == openUniversity ? (
                                                                  university.degrees !== undefined && university.degrees !== null ? university.degrees.map((degree, j) => (
                                                                        degree.is_university_degree && degree.subjects !== undefined && degree.subjects !== null && degree.subjects?.length > 0 ?
                                                                              <div key={j}>
                                                                              <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenCategory(degree.id)}>
                                                                                    <span>{degree.name}</span>
                                                                                    <img className={`w-3 h-3 transition-transform transform ${degree.id == openCategory ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                                              </div>
                                                                              <div className={`flex flex-wrap mt-3 transition-transform transform ${degree.id == openCategory ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                                                    {
                                                                                          degree.id == openCategory ? (
                                                                                                degree.subjects !== undefined && degree.subjects !== null ? degree.subjects.map((subject, k) => (
                                                                                                      subject.is_university_subject ?
                                                                                                            <div key={k} style={{backgroundColor:ORANGE}} onClick={() => handleAddSubjectModal(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                                            onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                                                                                            onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                                                                                            >
                                                                                                                  {subject.name}<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                                                                                                  style={{
                                                                                                                        transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                                                                                  }}
                                                                                                                  onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                                                                                  /></div>
                                                                                                      : null
                                                                                                )) : null
                                                                                          ) : null
                                                                                    }
                                                                              </div>
                                                                              </div>
                                                                        : null
                                                                  )) : null
                                                            ) : null
                                                            }
                                                      </div>
                                                </div> : null
                                          )) : "Error"
                                     : 
                                          categories.categories !== undefined && categories.categories !== null ? categories.categories.map((category,i) => (
                                                category.name.toLowerCase().includes(search) && category.subjects !== undefined && category.subjects !== null && category.subjects?.length > 0 ?
                                                <div key={i}>
                                                      <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenCategory(category.id)}>
                                                            <h6>{category.name}</h6>
                                                            <img className={`w-3 h-3 transition-transform transform ${category.id == openCategory ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                      </div>
                                                      <div className={`flex flex-wrap mt-3 transition-transform transform ${category.id == openCategory ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                            {
                                                                  category.id == openCategory ? (
                                                                        category.subjects !== undefined && category.subjects !== null ? category.subjects.map((subject, j) => (
                                                                              !subject.is_university_subject ?
                                                                                    <div key={j} style={{backgroundColor:BLUE}} onClick={() => handleAddSubjectModal(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                   
                                                                                    onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                                                                    onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                                                                    >
                                                                                          {subject.name}<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                                                                          style={{
                                                                                                transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                                                          }}
                                                                                          onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                                                          /></div>
                                                                              : null
                                                                        )) : null
                                                                  ) : null
                                                            }
                                                      </div>
                                                </div> : null
                                          )) : "Error"
                                    
                              }       
                              {
                                    showUniversities ? 
                                    <div className='mx-3 text-orange-400'>¿No está tu universidad o hay algun curso faltante o incorrecto? Escribele con toda confianza a nuestro <span className='text-blue-400 text-sub select-none' onClick={() => {window.open(`https://api.whatsapp.com/send?phone=${CONTACT_PHONE}&text=Hola%20soy%20un%20usuario%20de%20aprende.pe%20y%20quiero%20solicitar%20que%20se%20agregue:%20`, '_blank')}}>equipo técnico</span> para añadirlo o editarlo.</div>
                                    :
                                    <div className='mx-3 text-orange-400'>¿Quisieras que se añada un curso o categoría? Escribele con toda confianza a nuestro <span className='text-blue-400 text-sub select-none' onClick={() => {window.open(`https://api.whatsapp.com/send?phone=${CONTACT_PHONE}&text=Hola%20soy%20un%20usuario%20de%20aprende.pe%20y%20quiero%20solicitar%20que%20se%20agregue:%20`, '_blank')}}>equipo técnico</span> para añadirlo o editarlo.</div>
                              }                             
                        </Modal.Body>
                  </Modal>
                  {/* SUBJECT DETAILS MODAL */}
                  <Modal className='text-xs' show={showSubjectModal} onHide={() => handleSubjectModal({})} centered size="lg">
                        <Modal.Header closeButton>
                              <Modal.Title>{displayedSubject.name}{displayedSubject.is_university_subject ? ` (${displayedSubject.category?.length > 0 && displayedSubject.category.map((category) => category.is_university_degree ? category.university.name : '').filter(Boolean).join(', ')})` : ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                             
                              <h6>Descripción</h6>
                              <TextBox content={displayedSubject.description}/>
                              <h6 className='flex flex-wrap mt-1'><span className='mt-2 mr-2'>Categorias:</span>{displayedSubject.category != undefined && displayedSubject.category != null && displayedSubject.category.map((category, i) => <span key={i} className='mr-2 mt-2'>{category.name}</span>)} </h6>
                              <h6 className='flex flex-wrap mt-3'><span className='mr-2'
                              onLoad={(e) => e.target.children[0]?.classList.add('spin-on-load')}
                              onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                              onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                              >Cursos similares:</span>{displayedSubject.related_subjects != undefined && displayedSubject.related_subjects != null && displayedSubject.related_subjects.map((subject, i) => (subject.is_university_subject === displayedSubject.is_university_subject || displayedSubject.is_university_subject) ? <span key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} onClick={() => handleAddSubjectModal(subject)} className='font-normal text-xs flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'>
                                    {subject.name}<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                    style={{
                                          transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                    }}
                                    /></span> : null)} </h6>
                                  
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteSubjectModal()}>
                                    Eliminar
                              </Button>
                              <Button variant="secondary" onClick={() => handleSubjectModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* SUBJECT ADD CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showAddSubjectModal} onHide={() => handleAddSubjectModal({})} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>Agregar curso: {displayedSubject.name}{displayedSubject.is_university_subject ? ` (${displayedSubject.category?.length > 0 ? displayedSubject.category.map((category) => category.is_university_degree ? category.university.name : '').filter(Boolean).join(', ') : 'Curso universitario'})` : ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <h6>Descripción</h6>
                              <TextBox content={displayedSubject.description}/>
                              <p className='text-justify'>
                              Al agregar este curso a su perfil de profesor, certifica que está capacitado para enseñarlo, permitiendo que su perfil aparezca en los resultados de búsqueda correspondientes. Esto sucede únicamente cuando su perfil está 
                              <OverlayTrigger
                                    key="bottom_1"
                                    placement="bottom"
                                    overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                              ><b> activo</b></OverlayTrigger>. Para obtener prioridad en los resultados de búsqueda, se recomienda añadir un 
                              <OverlayTrigger
                                    key="bottom_2"
                                    placement="auto"
                                    overlay={<Tooltip id="tooltip-bottom">Puede añadir validadores de experiencia en la pagina de perfil de profesor</Tooltip>}
                              ><b> validador de experiencia</b></OverlayTrigger> relacionado con este curso.
                              </p>                              
                              <h6 className='flex flex-wrap mt-1'><span className='mt-2 mr-2'>Categorias:</span>{displayedSubject.category != undefined && displayedSubject.category != null && displayedSubject.category.map((category, i) => <span key={i} className='mr-2 mt-2'>{category.name}</span>)} </h6>
                                  
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="primary" onClick={() => handleAddSubject(displayedSubject)}>
                                    Agregar
                              </Button>
                              <Button variant="secondary" onClick={() => handleAddSubjectModal({})}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* SUBJECT DELETE CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showDeleteSubjectModal} onHide={() => handleDeleteSubjectModal()} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>Eliminar curso: {displayedSubject.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p>Por favor confirmenos que desea eliminar el curso de <b>{displayedSubject.name}</b> de su perfil de profesor. Esto significará que usted ya no aparecerá en los resultados de busqueda de este curso.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteSubject(displayedSubject)}>
                                    Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => handleDeleteSubjectModal()}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>

                  
                  {/* EXPERIENCE VALIDATOR DETAILS MODAL */}
                  <Modal className='text-xs' show={showExperienceValidatorModal} onHide={() => handleExperienceValidatorModal({})} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title className='flex flex-wrap'>Validador de experiencia {new Date(displayedExperienceValidator.created_at).toLocaleDateString()}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <h6>Estado: <span className={`${displayedExperienceValidator.approved ? "text-green-500" : displayedExperienceValidator.reason ?? "" !== "" ? "text-red-500" : "text-gray-500"}`}>{displayedExperienceValidator.approved ? "Aprobado" : displayedExperienceValidator.reason ?? "" !== "" ? "Rechazado" : "Esperando aprobación"}</span></h6>
                              {
                                    displayedExperienceValidator.reason ?? "" !== "" ? <>
                                          <h6>Mensaje de aprobación</h6>
                                          <p>{displayedExperienceValidator.reason}</p>
                                    </> : null
                              }
                              <h6>Cursos validados</h6>    
                              <span className='flex flex-wrap'>{displayedExperienceValidator.subjects?.length > 0 && displayedExperienceValidator.subjects.map((subject, i) => <span key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} className='font-normal text-xs flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none'>
                                    {subject.name}</span>)}</span>
                              <h6>Justificación</h6>         
                              <TextBox content={displayedExperienceValidator?.message}/>
                              <h6>Documento</h6>    
                              <img src={displayedExperienceValidator.document} onClick={() => window.open(displayedExperienceValidator.document, '_blank')} alt="Profile"  style={{ objectPosition: 'left top' }} className="mb-2 object-cover w-full h-40 rounded border opacity-100 hover:opacity-75" />
                              <h6 className='flex'>Documento público: 
                                          <Form.Switch 
                                                className='mx-2'
                                                checked={displayedExperienceValidator.document_is_public != undefined ? displayedExperienceValidator.document_is_public : false}
                                                id="disabled-custom-switch"
                                                readOnly
                                                label=""/>
                              </h6>
                              <h6 className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Horas validadas: {displayedExperienceValidator.hours_validated}</h6>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteExperienceValidatorModal()}>
                                    Eliminar
                              </Button>
                              <Button variant="secondary" onClick={() => handleExperienceValidatorModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* EXPERIENCE VALIDATOR ADD CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showAddExperienceValidatorModal} onHide={() => handleAddExperienceValidatorModal({})} centered size="lg">
                        <Form onSubmit={(e) => {handleAddExperienceValidator(e)}}>
                              <Modal.Header closeButton>
                                    <Modal.Title>Añadir validador de experiencia</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          
                                          <Form.Group controlId="subjects" className='mb-3'>
                                                <Form.Label><h6>Cursos para validar <span className='text-red-400'>*</span></h6></Form.Label>
                                                <Form.Control as="select" name="subjects" multiple required>
                                                      {
                                                            teacherProfile.teacherProfile.subjects?.length > 0 && teacherProfile.teacherProfile.subjects.map((subject,i) => <option key={i} value={subject.id}>
                                                                  {subject.name}
                                                            </option>)
                                                      }
                                                      
                                                </Form.Control>
                                                <Form.Text className="text-gray-400 text-xs">Presione Ctrl+Click para seleccionar varias opciones</Form.Text>
                                          </Form.Group>
                                          <Form.Group controlId="document" className='mb-3'>
                                                <Form.Label><h6>Adjunte un documento <span className='text-red-400'>*</span></h6></Form.Label>
                                                <Form.Control type="file" name="document" accept="image/*" required/>
                                                <Form.Text className="text-gray-400 text-xs">Puede subir cualquier imagen que respalde su experiencia enseñando los cursos que ha seleccionado. Esto puede incluir un comprobante de pago de alguna clase, una captura de pantalla de su perfil en otra aplicación de enseñanza para demostrar su experiencia, o una certificación de su nota en alguna universidad, entre otras opciones. Actualmente solo aceptamos imagenes en este campo.</Form.Text>

                                          </Form.Group>
                                          <Form.Group controlId="document_is_public" className='w-full flex mb-2'>
                                                <Form.Label><h6>Documento público</h6></Form.Label>
                                                <Form.Switch
                                                      name="document_is_public"
                                                      value={validationDocumentIsPublic}
                                                      onChange={(e) => setValidationDocumentIsPublic(!validationDocumentIsPublic)}
                                                      className='rounded text-gray-400 ml-3'
                                                      label="Marque aqui si desea que este documento sea visible al público en general."
                                                      style={{ fontSize: '.75rem' }}
                                                />

                                          </Form.Group>
                                          <Form.Group controlId="hours_validated" className='w-full mb-3'>
                                                <Form.Label><h6>Horas validadas</h6></Form.Label>
                                                <Form.Control
                                                      type="number"
                                                      name="hours_validated"
                                                      placeholder="Ingrese su nombre"
                                                      value={validationHours}
                                                      onChange={(e) => setValidationHours(e.target.value)}
                                                      className='rounded border'
                                                      style={{ fontSize: '.75rem' }}
                                                />
                                                <Form.Text className="text-gray-400 text-xs">Si desea, puede añadir un número de horas enseñadas para validarlo y añadirlo a las estadísticas de su perfil.</Form.Text>

                                          </Form.Group>
                                          <Form.Group controlId="message" className='w-full mb-3'>
                                                <Form.Label><h6>Añadir una justificación <span className='text-red-400'>*</span></h6></Form.Label>
                                                <Form.Control
                                                      as="textarea" rows={3}
                                                      name="message"
                                                      placeholder="Escriba un mensaje de justificación"
                                                      value={validationMessage}
                                                      onChange={(e) => setValidationMessage(e.target.value)}
                                                      className='rounded border'
                                                      style={{ fontSize: '.75rem' }}
                                                      required
                                                />
                                                <Form.Text className="text-gray-400 text-xs">Por favor, proporcione una explicación sobre el documento adjunto y las horas validadas. Esta información será revisada con atención por nuestro equipo para llevar a cabo la evaluación y aprobación correspondiente del documento.</Form.Text>

                                          </Form.Group>
                                    
                                    <p className='text-justify'>
                                    Cuando envia un validador de experiencia, nuestro equipo revisa el documento y la justificación que adjunte. Después, evaluamos si aprobamos esta información. Si es aprobada, su validador de experiencia le dará prioridad en los resultados de búsqueda de los cursos que usted elija en el formulario. Tenga en cuenta que esto solo sucede cuando su perfil está 
                                    <OverlayTrigger
                                          key="bottom_1"
                                          placement="bottom"
                                          overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                                    ><b> activo</b></OverlayTrigger>.</p>                              
                              </Modal.Body>
                              <Modal.Footer>
                                    <Button variant="primary" type='submit' >
                                          Agregar
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleAddExperienceValidatorModal({})}>
                                          Cancelar
                                    </Button>
                              </Modal.Footer>
                        </Form>
                  </Modal>
                  {/* EXPERIENCE VALIDATOR DELETE CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showDeleteExperienceValidatorModal} onHide={() => handleDeleteExperienceValidatorModal()} centered size="md      ">
                        <Modal.Header closeButton>
                              <Modal.Title>Eliminar validador de experiencia</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              { 
                              displayedExperienceValidator.approved ? <>
                                    <h6>Estado: <span className={`${displayedExperienceValidator.approved == true ? "text-green-500" : displayedExperienceValidator.reason ?? "" !== "" ? "text-red-500" : "text-black"}`}>{displayedExperienceValidator.approved == true ? "Aprobado" : displayedExperienceValidator.reason ?? "" !== "" ? "Rechazado" : "Esperando aprobación"}</span></h6>
                                    <p>Por favor confirmenos que desea eliminar este validador de experiencia de su perfil de profesor. Esto significa que ya no será destacado en los resultados de búsqueda de los cursos asociados si solo están validados por este documento.</p>
                                    <h6>Cursos que ya no se validarán</h6>    
                                    <span className='flex flex-wrap'>{displayedExperienceValidator.subjects?.length > 0 && displayedExperienceValidator.subjects.map((subject, i) => <span key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}}  className='font-normal text-xs flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none'>
                                          {subject.name}</span>)}</span>
                                          <h6>Documento</h6>    
                                    <img src={displayedExperienceValidator.document} alt="Profile"  style={{ objectPosition: 'left top' }} className="mb-2 object-cover w-full h-40 rounded border" />
                                    <h6 className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Horas validadas que se restarán: {displayedExperienceValidator.hours_validated}</h6>
                              </> :
                              <>
                                    <h6>Estado: <span className={`${displayedExperienceValidator.approved == true ? "text-green-500" : displayedExperienceValidator.reason ?? "" !== "" ? "text-red-500" : "text-black"}`}>{displayedExperienceValidator.approved ? "Aprobado" : displayedExperienceValidator.reason ?? "" !== "" ? "Rechazado" : "Esperando aprobación"}</span></h6>
                                    <p>Por favor confirmenos que desea eliminar este validador de experiencia de su perfil de profesor. Como este documento no ha sido aprobado, eliminarlo no afectará su visibilidad en los resultados de busqueda.</p>
                              </>
                              }
                              
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteExperienceValidator(displayedExperienceValidator)}>
                                    Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => handleDeleteExperienceValidatorModal()}>
                                    Cancelar
                              </Button>   
                        </Modal.Footer>
                  </Modal>

                  {/* USER INFO EDIT MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showEditConfigurationModal} onHide={() => handleEditConfigurationModal()} centered size="lg">
                        <Form onSubmit={(e) => {handldeSubmitEditConfigurationModal(e)}}>
                              <Modal.Header closeButton>
                                    <Modal.Title>Editar configuración</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          {
                                                teacherProfile.loading == true ? (
                                                      <div className='flex align-items-center justify-content-center mb-4'>
                                                            <img
                                                                  src="/tail_blue_fast.svg"
                                                                  alt="Loading..."
                                                                  className="w-40 h-40"
                                                            />
                                                      </div>
                                                ) : (
                                                      <div className='flex align-items-center justify-content-center mb-4'>
                                                            <div className="relative group" onClick={handleImageClick}>
                                                                  <img
                                                                        src={`${paymentQr}`}
                                                                        alt="Payment QR"
                                                                        style={{ cursor: 'pointer' }}
                                                                        className="w-40 h-40"
                                                                  />
                                                                  <div className="hidden w-40 h-40 absolute inset-0 bg-black bg-opacity-50 text-white justify-center items-center group-hover:flex">
                                                                        <span className="text-2xl">Cambiar QR</span>
                                                                  </div>
                                                            </div>
                                                            <input
                                                                  type="file"
                                                                  ref={fileInputRef}
                                                                  accept="image/*"
                                                                  style={{ display: 'none' }}
                                                                  onChange={handleFileChange}
                                                            />
                                                      </div>
                                                )
                                          }

                                          <Form.Group controlId='resume' className='mb-3'>
                                                <Row>
                                                      <Col xs={3} md={4}>
                                                            <Form.Label><h6>Presentación de profesor</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={9} md={8}>
                                                            <Form.Control
                                                                  as="textarea" rows={3}
                                                                  name='resume'
                                                                  placeholder="Ingrese su presentación de profesor"
                                                                  value={resume}
                                                                  onChange={(e) => setResume(e.target.value)}
                                                                  className='rounded border'
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          
                                          <Form.Group controlId='payment_credentials' className='mb-3'>
                                                <Row>
                                                      <Col xs={3} md={4}>
                                                            <Form.Label><h6>Credenciales de pago</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={9} md={8}>
                                                            <Form.Control
                                                                  as="textarea" rows={3}
                                                                  name='payment_credentials'
                                                                  placeholder="Ingrese sus credenciales de pago"
                                                                  value={paymentCredentials}
                                                                  onChange={(e) => setPaymentCredentials(e.target.value)}
                                                                  className='rounded border'
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='hourly_price' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={3} md={4}>
                                                            <Form.Label><h6>Precio por hora</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={5} md={4} className='flex pr-0'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='hourly_price'
                                                                  value={hourlyPrice}
                                                                  onChange={(e) => setHourlyPrice(e.target.value)}
                                                                  className='h-12'
                                                                  style={{borderRadius: '4px 0 0 4px', borderTop: '1px solid #dee2e6', borderLeft: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6', borderRight: '0'}}
                                                            />
                                                      </Col>
                                                      <Col xs={4} md={4} className='flex pl-0'>
                                                            <Dropdown className='w-full' onSelect={handleCoinChange}>
                                                                  <Dropdown.Toggle id='coin_type'  className='w-full h-12 bg-white d-flex justify-content-between align-items-center mx-0 border p-2' variant='light' style={{borderRadius: '0 4px 4px 0' }}>
                                                                        {coin}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu
                                                                        align="start"
                                                                        onChange={(e) => handleCoinChange(e.target.value)}
                                                                        style={{maxHeight: '300px', overflowY: 'auto'}}
                                                                        popperConfig={{modifiers: [{name: 'offset', options: {offset: [0, -150]} }] }}>
                                                                        <Dropdown.Header>Moneda </Dropdown.Header>
                                                                        {constants.coin_types?.map((coin_type, i) => (
                                                                              <Dropdown.Item key={i} eventKey={coin_type.short_name} /*value={coin_type.short_name}*/>
                                                                                    {coin_type.short_name} - {coin_type.name}
                                                                              </Dropdown.Item>
                                                                        ))}
                                                                  </Dropdown.Menu>
                                                            </Dropdown> 
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          
                                    
                                    <p className='text-justify'>
                                    Esta información es importante para configurar las reservas que los usuarios pueden comprarle a usted. Tenga en cuenta que los usuarios solo pueden hacer reservas cuando su perfil está 
                                    <OverlayTrigger
                                          key="bottom_1"
                                          placement="bottom"
                                          overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                                    ><b> activo</b></OverlayTrigger>.</p>                              
                              </Modal.Body>
                              <Modal.Footer>
                                    <Button variant="primary" type='submit' >
                                          Guardar
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleEditConfigurationModal()}>
                                          Cancelar
                                    </Button>
                              </Modal.Footer>
                        </Form>
                  </Modal>


                  {/* ADD AVAILABLE TIME MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showAddAvailableTimeModal} onHide={() => handleAddAvailableTimeModal()} centered size="md">
                        <Form onSubmit={(e) => {handleSubmitAddAvailableTimeModal(e)}}>
                              <Modal.Header closeButton>
                                    <Modal.Title>Agregar tiempo disponible</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>                                          
                                          <Form.Group controlId='payment_credentials' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Fecha <span className='text-red-400'>*</span></h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <DatePicker 
                                                                  id='date'
                                                                  name='date'
                                                                  value={dayjs(availableDate)}
                                                                  required
                                                                  onChange={(value) => setAvailableDate(value.format('M/D/YYYY, H:m:s'))} //A 
                                                                  slotProps={{ 
                                                                        textField: { size: 'small', color:'info' },
                                                                   }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>

                                          <Form.Group controlId='payment_credentials' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Hora de inicio <span className='text-red-400'>*</span></h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <TimePicker 
                                                                  id='start_time'
                                                                  name='start_time'
                                                                  value={dayjs(availableStartTime)}
                                                                  required
                                                                  onChange={(value) => setAvailableStartTime(value.format('M/D/YYYY, H:m:s'))} //A
                                                                  slotProps={{ 
                                                                        textField: { size: 'small', color:'info' },
                                                                   }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>

                                          <Form.Group controlId='payment_credentials' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Hora de fin <span className='text-red-400'>*</span></h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <TimePicker 
                                                                  id='end_time'
                                                                  name='end_time'
                                                                  value={dayjs(availableEndTime)}
                                                                  required
                                                                  onChange={(value) => setAvailableEndTime(value.format('M/D/YYYY, H:m:s'))} //A
                                                                  slotProps={{ 
                                                                        textField: { size: 'small', color:'info' },
                                                                   }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>


                                          <Form.Group controlId='repeat' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Repetir por <span className='text-red-400'>*</span></h6></Form.Label>
                                                      </Col>
                                                      <Col xs={4} md={3} className='flex pr-0'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='repeat_times'
                                                                  value={availableRepeatTimes}
                                                                  onChange={(e) => setAvailableRepeatTimes(e.target.value)}
                                                                  className='h-10'
                                                                  required
                                                                  style={{borderRadius: '4px 0 0 4px', borderTop: '1px solid #c4c4c4', borderLeft: '1px solid #c4c4c4', borderBottom: '1px solid #c4c4c4', borderRight: '0'}}
                                                            />
                                                      </Col>
                                                      <Col xs={4} md={3} className='flex pl-0'>
                                                            <Dropdown className='w-full' onSelect={(value) => setAvailableRepeatInterval(value)}>
                                                                  <Dropdown.Toggle id='coin_type' required className='w-full h-10 bg-white d-flex justify-content-between align-items-center mx-0  p-2' variant='light' style={{borderRadius: '0 4px 4px 0', border:'1px solid #c4c4c4' }}>
                                                                        {availableRepeatInterval}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu
                                                                        align="start"
                                                                        name = 'repeat_interval'
                                                                        onChange={(e) => setAvailableRepeatInterval(e.target.value)}
                                                                        style={{maxHeight: '300px', overflowY: 'auto'}}
                                                                        popperConfig={{modifiers: [{name: 'offset', options: {offset: [0, -150]} }] }}>
                                                                        <Dropdown.Header>Intervalo </Dropdown.Header>
                                                                        <Dropdown.Item  eventKey={'dias'} >
                                                                              dias
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item  eventKey={'semanas'} >
                                                                              semanas
                                                                        </Dropdown.Item>
                                                            
                                                                  </Dropdown.Menu>
                                                            </Dropdown> 
                                                      </Col>
                                                </Row>
                                          </Form.Group>

                                          <Form.Group controlId="class_types" className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Tipo de clase permitida <span className='text-red-400'>*</span></h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control as="select" name="class_types" multiple required>
                                                                  {
                                                                        constants.class_types?.length > 0 && constants.class_types.map((class_type,i) => <option key={i} value={class_type.id}>
                                                                              {class_type.name}
                                                                        </option>)
                                                                  }
                                                                  
                                                            </Form.Control>
                                                            <Form.Text className="text-gray-400 text-xs">Presione Ctrl+Click para seleccionar varias opciones</Form.Text>
                                                      </Col>
                                                </Row>     
                                          </Form.Group>
                                          
                                          <Form.Group controlId='payment_credentials' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Máxima cantidad de reservas <span className='text-red-400'>*</span></h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='vacancies'
                                                                  value={availableVacancies}
                                                                  onChange={(e) => setAvailableVacancies(e.target.value)}
                                                                  className='h-10'
                                                                  required
                                                                  style={{border: '1px solid #c4c4c4'}}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                    <p className='text-justify'>
                                    Al guardar este documento usted certifica que está disponible en este rango de tiempo para dictar clases. De esta forma, los usuarios podrán reservar clases en este tiempo. Recuerde que los usuarios solo podrán encontrar su cuenta si está 
                                    <OverlayTrigger
                                          key="bottom_1"
                                          placement="bottom"
                                          overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                                    ><b> activa</b></OverlayTrigger>.</p>    
                                    <p className='text-red-400'>{availableError}</p>                          
                              </Modal.Body>
                              <Modal.Footer>
                                    <Button variant="primary" type='submit' >
                                          Guardar
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleAddAvailableTimeModal()}>
                                          Cancelar
                                    </Button>
                              </Modal.Footer>
                        </Form>
                  </Modal>
                  {/* AVAILABLE TIME DETAILS MODAL */}
                  <Modal className='text-xs' show={showAvailableTimeModal} onHide={() => setShowAvailableTimeModal(false)} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>Tiempo disponible</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                             <Row>
                                    <Col xs={4} md={6}><h6>Hora de inicio</h6></Col>
                                    <Col xs={8} md={6}><h6>{String(Math.floor(displayedAvailableTime.start_time_i)).padStart(2, '0')}:{String(Math.round((displayedAvailableTime.start_time_i % 1) * 60)).padStart(2, '0')}</h6></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h6>Hora de fin</h6></Col>
                                    <Col xs={8} md={6}><h6>{String(Math.floor(displayedAvailableTime.end_time_i)).padStart(2, '0')}:{String(Math.round((displayedAvailableTime.end_time_i % 1) * 60)).padStart(2, '0')}</h6></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h6>Espacios disponibles</h6></Col>
                                    <Col xs={8} md={6}><h6>{displayedAvailableTime.n_vacancies_left}</h6></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h6>Tipo de clase permitida</h6></Col>
                                    <Col xs={8} md={6}>{displayedAvailableTime.class_type?.map((type, i) => <h6 key={i}>{type}</h6>)}</Col>
                              </Row>    
                              <p className='text-justify mt-3'>
                              Este documento usted certifica que está disponible en este rango de tiempo para dictar clases. De esta forma, los usuarios podrán reservar clases en este tiempo. Recuerde que los usuarios solo podrán encontrar su cuenta si está 
                              <OverlayTrigger
                                    key="bottom_1"
                                    placement="bottom"
                                    overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                              ><b> activa</b></OverlayTrigger>.</p>                                
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => {setShowAvailableTimeModal(false); setShowDeleteAvailableTimeModal(true)}}>Eliminar</Button>
                              <Button variant="secondary" onClick={() => setShowAvailableTimeModal(false)}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>
                  {/* AVAILABLE TIME DELETE MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showDeleteAvailableTimeModal} onHide={() => setShowDeleteAvailableTimeModal(false)} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>Eliminar tiempo disponible</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <Row>
                                    <Col xs={4} md={6}><h6>Espacios disponibles</h6></Col>
                                    <Col xs={8} md={6}><h6>{displayedAvailableTime.n_vacancies_left}</h6></Col>
                              </Row>
                              <p className='text-justify mt-3'>
                              Por favor confirmenos que desea eliminar este tiempo dispinible en su horario de profesor. Al eliminar este documento los usuarios ya no podrán reservar clases en este rango de tiempo.</p>                   
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => {setShowDeleteAvailableTimeModal(false); handleDeleteAvailableTime(displayedAvailableTime.id) }}>Eliminar</Button>
                              <Button variant="secondary" onClick={() => setShowDeleteAvailableTimeModal(false)}>Cancelar</Button>
                        </Modal.Footer>
                  </Modal>


                  
                        {
                              teacherProfile.teacherProfile?.is_public ? (
                                    <Row className='pt-4'>
                                    <Col>
                                    <h5>Reservas hechas por tus alumnos</h5>
                                    <h5>{teacherProfile.teacherProfile.is_public}</h5>
                                    <ReservationList 
                                          list={teacherProfile.teacherProfile?.reservations?.reservations} 
                                          handleOpenItem={handleReservationModal} 
                                          isLoading={teacherProfile?.loading}
                                          isTeacher={true} 
                                          page={reservationsPage}
                                          handlePageChange={handleReservationPageChange}
                                          pageError={reservationsPageError}
                                    />
                              </Col>
                              </Row>    
                              ) : (
                                    <PlanOptions userInfo={userInfo}/>
                              )
                        }
                  
                  <Row>
                        <Col>
                        <h5>Edita tu perfil de profesor</h5>                                
                        </Col>
                  </Row>    
                                   
                  <Row className='mb-4 my-3 '>
                        <Col sm={5}  className='mb-4 flex flex-col'>
                              
                              <div className='bg-gray-100 w-full h-full'>
                                    <Card className='mx-4 my-4 shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{borderRadius:'20px'}} onClick={() => {handleEditConfigurationModal()}}>
                                          <Card.Body>
                                                <div className='flex align-items-center justify-content-center mb-2'>
                                                      <img src={userInfo.user?.profile_image} className='w-12 h-12 rounded-full border'/>
                                                      <h6 className='my-0 px-2 w-1/2' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userInfo === undefined && userInfo === null ? ("") : (`${userInfo.user?.first_name} ${userInfo.user?.last_name}`)}</h6>
                                                </div>
                                                {
                                                      teacherProfile.loading ? 
                                                      <div className='flex align-items-center justify-content-center'>
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-60 h-60"
                                                      /></div> :
                                                      <>
                                                      
                                                      <img className='p-3' src={`${paymentQr}`}/>
                                                      <div className='flex flex-col align-items-center justify-content-center '>
                                                            <p>{teacherProfile.teacherProfile.payment_credentials}</p>
                                                            <h6>Precio por hora</h6>
                                                            <h3>{teacherProfile.teacherProfile.hourly_price} {coin}</h3>
                                                      </div>
                                                      </>
                                                }
                                                
                                          </Card.Body>
                                    </Card>
                              </div>
                        </Col>

                        <Col sm={7}  className=''>
                              {teacherProfile?.teacherProfile?.is_public ? <><h5 className='text-green-400'>Tu perfil está activo</h5><hr></hr></> : null}
                              <h6>Presentación</h6>
                              <TextBox content={resume}/>
                              <h6>Cursos dictados</h6>
                              <div className='flex flex-wrap mb-3 text-white border rounded-2xl pt-2 pl-2'>
                                    {
                                          teacherSubjects?.length > 0 && teacherSubjects.map((subject, i) => (
                                                <div key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} className='px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleSubjectModal(subject)}>{subject.name}</div>
                                          )) 
                                    }
                                    {
                                          teacherProfile.loading ? 
                                          <img src="/tail_blue_fast.svg" alt="Loading..." className="w-6 h-6" /> 
                                          :
                                          <div className='bg-gray-400 px-2 py-1 mb-2 rounded-xl text-md flex align-items-center justify-content-center select-none' onClick={() => handleCategoriesModal()}
                                          onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                          onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                          >
                                                Agregar<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                                style={{
                                                      transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                }}
                                                onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                />
                                          </div>
                                    }     
                              </div>
                              {/*
                              <h6>Idiomas de dictado</h6>
                              <div className='flex flex-wrap mb-3 text-white'>
                                    {
                                          teacherLanguages?.length > 0 && teacherLanguages.map((language, i) => (
                                                <div key={i} className='bg-gray-700 px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'  onClick={() => handleLanguageModal(language)}>{language.name}</div>
                                          )) 
                                    }
                                    {
                                          teacherProfile.loading ? 
                                          <img src="/tail_blue_fast.svg" alt="Loading..." className="w-6 h-6" /> 
                                          :
                                          <div className='bg-gray-400 px-2 py-1 mb-2 rounded-xl text-md flex align-items-center justify-content-center select-none' onClick={() => handleLanguagesListModal()}
                                          onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                          onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                          >
                                                Agregar<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                                style={{
                                                      transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                }}
                                                onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                
                                                />
                                          </div>
                                    }     
                              </div>
                               */}
                              {/*
                              <h6>Métodos de enseñanza</h6>
                              <div className='flex flex-wrap mb-3 text-white'>
                                    {
                                          teacherStyles?.length > 0 && teacherStyles.map((style, i) => (
                                                <div key={i} className='bg-gray-700 px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'  onClick={() => handleStyleModal(style)}>{style.name}</div>
                                          )) 
                                    }
                                    {
                                          teacherProfile.loading ? 
                                          <img src="/tail_blue_fast.svg" alt="Loading..." className="w-6 h-6" /> 
                                          :
                                          <div className='bg-gray-400 px-2 py-1 mb-2 rounded-xl text-md flex align-items-center justify-content-center select-none' onClick={() => handleStylesListModal()}
                                          onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                          onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                          >
                                                Agregar<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                                style={{
                                                      transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                }}
                                                onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                
                                                />
                                          </div>
                                    }     
                              </div>
                               */}
                              <h6>Experiencia validada</h6>
                              <div style={{overflowX:"scroll", overflowY:"hidden"}}  className='flex align-items-center  text-white border rounded-2xl pt-2 pr-2'>
                                    {
                                          teacherExperienceValidators?.length > 0 && teacherExperienceValidators.map((validator, i) => (
                                                
                                                <div key={i} style={{width:"10rem", minWidth:"10rem"}}  className={`${validator.approved == true ? 'bg-gray-700' : 'bg-gray-400'} p-3 rounded-xl mb-2 ml-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105`}  onClick={() => handleExperienceValidatorModal(validator)}>
                                                      <h6 className='' >
                                                            {validator.subjects?.length} Cursos validados
                                                                  
                                                      </h6>
                                                      <p className='mb-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{validator.message}</p>
                                                      <p className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Horas validadas: {validator.hours_validated}</p>
                                                      <p className={`mb-0 ${validator.approved == true ? 'text-green-200' : validator.reason ?? "" !== "" ? 'text-red-600' : 'text-gray-200'}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {validator.approved == true ? 'Aprobado' : validator.reason ?? "" !== "" ? 'Rechazado' : 'Esperando aprobación'}
                                                      </p>
                                                </div>
                                                
                                          )) 
                                    }
                                    {
                                          teacherProfile.loading ? 
                                          <img src="/tail_blue_fast.svg" alt="Loading..." className="w-6 h-6" /> 
                                          :
                                          <div className='bg-gray-400 px-2 py-1 ml-2 mb-2 rounded-xl text-md flex align-items-center justify-content-center select-none' onClick={() => handleAddExperienceValidatorModal()}
                                          onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                          onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                          >
                                                Agregar<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                                style={{
                                                      transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                }}
                                                onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                
                                                />
                                          </div>
                                    }   
                              </div>
                        </Col>
                  </Row>
                  <Row>
                        <Col xs={12} className='px-4'>
                              <span className='mb-3 flex'>
                                    <h6 className='mr-2'>Calendario de reservaciones</h6>
                                    {
                                          teacherProfile.loading ? 
                                          <img src="/tail_blue_fast.svg" alt="Loading..." className="w-6 h-6" /> 
                                          :
                                          <div className='bg-gray-400 px-2 py-1 ml-2 mb-2 rounded-xl text-md flex align-items-center justify-content-center text-white select-none' onClick={() => handleAddAvailableTimeModal()}
                                          onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                          onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                          >
                                                Agregar tiempo disponible<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                                style={{
                                                      transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                }}
                                                onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                
                                                />
                                          </div>
                                    }   
                              </span>
                              <div className='px-1'>
                                    <Calendar 
                                          reservations={teacherProfile?.teacherProfile?.reservations?.reservations} 
                                          weekly_schedule={teacherProfile.teacherProfile.weekly_schedule} 
                                          constants={constants} 
                                          handleShowReservationModal={handleShowReservationModal} 
                                          handleShowAvailableTimeModal={handleShowAvailableTimeModal} 
                                    />
                              </div>
                        </Col>

                  </Row>

                                  
                  
            </Container>
                  ) : (null)
                  }
            </div>
      )
}

export default TeacherProfileScreen