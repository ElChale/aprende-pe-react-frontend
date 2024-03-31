import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTeacherProfile, fetchTeacherProfile } from '../reducers/queryReducers'
import { createReservation } from '../reducers/userReducers'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, orderMapping } from '../utils'
import Calendar from '../components/Calendar';
import TextBox from '../components/ui/TextBox';

import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

function ReservationScreen({ userInfo, userChildren, querys, constants }) {
      const dispatch = useDispatch()
      const navigate = useNavigate()
      dayjs.extend(utc)
      dayjs.extend(timezone)


      const [displayedTeacherProfile, setDisplayedTeacherProfile] = useState({...querys.selectedTeacherProfile})
      const [showTeacherProfileModal, setShowTeacherProfileModal] = useState(false)
      const [showTeacherScheduleModal, setShowTeacherScheduleModal] = useState(false)

      const [displayedExperienceValidator, setDisplayedExperienceValidator] = useState({})
      const [showExperienceValidatorModal, setShowExperienceValidatorModal] = useState(false)

      const [showReservationConfirmationModal, setShowReservationConfirmationModal] = useState(false)
      const [reservationFormData, setReservationFormData] = useState(new FormData)

      // AVAILABLE TIMES
      const [displayedAvailableTime, setDisplayedAvailableTime] = useState({})
      const [showAvailableTimeModal, setShowAvailableTimeModal] = useState(false)

      // FORM VALUES
      const currentDate = new Date();
      const isoStringInTimeZone = currentDate.toLocaleString('en-US', { timeZone: dayjs.tz.guess() })

      const [subjects, setSubjects] = useState([])
      const [classType, setClassType] = useState('')
      const [startTime, setStartTime] = useState(dayjs(isoStringInTimeZone))
      const [endTime, setEndTime] = useState(dayjs(isoStringInTimeZone))
      const [autoPrice, setAutoPrice] = useState(0)
      const [autoHourlyPrice, setAutoHourlyPrice] = useState(0)
      const [coin, setCoin] = useState(displayedTeacherProfile?.coin?.short_name)
      const [paymentProof, setPaymentProof] = useState('')
      const [message, setMessage] = useState('')

      // START END TIME VALIDATION
      const [startTimeError, setStartTimeError] = useState('')
      const [endTimeError, setEndTimeError] = useState('')
      const [classTypeError, setClassTypeError] = useState('')
      const [generalError, setGeneralError] = useState('')
      


      // TEACHER PROFILE
      // open/close teacher profile details modal
      const handleTeacherProfileModal = () => {
            setShowTeacherProfileModal(!showTeacherProfileModal)
      }
      // open/close teacher profile details modal
      const handleTeacherScheduleModal = () => {
            setShowTeacherScheduleModal(!showTeacherScheduleModal)
      }
      // open/close experience validator modal
      const handleExperienceValidatorModal = (experienceValidator) => {
            setShowExperienceValidatorModal(!showExperienceValidatorModal)
            setDisplayedExperienceValidator(experienceValidator)
      }

      // CALENDAR MODALS
      const handleShowReservationModal = (event) => {
            return null
      }
      const handleShowAvailableTimeModal = (event) => {
            setDisplayedAvailableTime(event)
            setShowAvailableTimeModal(!showAvailableTimeModal)
      }
      const handleSelectAvailableTime = (event) => {
            let start_time = dayjs(event?.start_time)
            let end_time = dayjs(event?.end_time)
            let class_type =  constants?.class_types?.find(item => item.id == event.first_class_type_id)?.name?.toString()
        
            setStartTime(start_time)
            setEndTime(end_time)
            setClassType(class_type)
            setShowTeacherScheduleModal(false)
            setShowAvailableTimeModal(false)
      }

      const handleBackToSearch = () => {
            navigate(`/findclasses`)
      }

      // FORMS SUBMIT
      const handleReservationSubmit = (e) => {
            e.preventDefault()
            if (startTimeError === '' && endTimeError === '' && classTypeError === '') {
                  const form_data = new FormData(e.target)
                  let subjects = form_data.getAll('subjects').map((str) => parseInt(str,10))
                  setSubjects(subjects)
                  setGeneralError('')
                  setReservationFormData(form_data)
                  setShowReservationConfirmationModal(true)
            } else {
                  setGeneralError('Por favor corriga los errores en la configuración de la reserva')
            }
      }
      const handleReservation = () => {
            setShowReservationConfirmationModal(false)
            const form_data = reservationFormData
            /*
            let form_values = {}
            for (const [key, value] of form_data.entries()) { form_values[key] = value; }
            console.log(form_values)
            */
            let id = displayedTeacherProfile.id
            let subjects = form_data.getAll('subjects').map((str) => parseInt(str,10))
            let document = form_data.get('document')
            let message = form_data.get('message')
            let start_time = new Date(startTime)
            let end_time = new Date(endTime)
            let class_type_id = constants?.class_types?.find(item => item?.name == classType)?.id
            let coin_id = constants?.coin_types?.find(item => item?.short_name == coin)?.id
            let total_price = autoPrice
            let hourly_price = autoHourlyPrice
            let total_duration = Number((total_price / hourly_price).toFixed(2))
            let token = userInfo.token
            dispatch(createReservation({ id:id, subjects:subjects, document:document, message:message, start_time:start_time.toISOString(), end_time:end_time.toISOString(), class_type_id:class_type_id, coin_id:coin_id, total_price:total_price, hourly_price:hourly_price, total_duration:total_duration, token:token }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload.error) {
                              setGeneralError(result.payload.error)
                        } else {
                              setGeneralError('')
                              setReservationFormData('')
                              navigate(`/myclasses`)
                        }     
                    
                  } else {
                        setGeneralError(result.error.message)
                        
                  }
            })
      }

      const handleTeacherRefresh = () => {
            dispatch(fetchTeacherProfile({ id:querys.selectedTeacherProfile.id, token:userInfo.token }))
      }

      // Initial redirect if not a displayedteacher
      useEffect(() => {
            if (Object.keys(querys?.selectedTeacherProfile)?.length === 0) {
                  navigate(`/findclasses`)
            } else {
                  //dispatch(fetchTeacherProfile({ id:querys.selectedTeacherProfile.id, token:userInfo.token }))
            }
      }, [])

      // Initial setup of star end time and class type
      useEffect(() => {
            let first_available_time = querys?.selectedTeacherProfile?.weekly_schedule?.filter(item => dayjs(item?.start_time).isAfter(dayjs()))[0]
            let start_time = dayjs(first_available_time?.start_time)
            let end_time = dayjs(first_available_time?.end_time)
            let class_type =  constants?.class_types?.find(item => item.id == first_available_time?.class_type[0])?.name?.toString()

            setStartTime(start_time)
            setEndTime(end_time)
            setClassType(class_type)
      }, [])

      // Validation of star end time and class type
      useEffect(() => {
            let valid_available_times = displayedTeacherProfile?.weekly_schedule?.filter(item => dayjs(item?.start_time).isAfter(dayjs()))

            let found_element = {}
            if (valid_available_times?.length > 0) {
                  valid_available_times.forEach((item) => {
                        let item_start_time = dayjs(item?.start_time).startOf('minute')
                        let item_end_time = dayjs(item?.end_time).startOf('minute')
                        let input_start_time = dayjs(startTime).startOf('minute')
                        let input_end_time = dayjs(endTime).startOf('minute')
                        if (
                              (input_start_time.isSame(item_start_time) || input_start_time.isAfter(item_start_time)) && 
                              (input_start_time.isSame(item_end_time) || input_start_time.isBefore(item_end_time)) &&
                              (input_end_time.isSame(item_start_time) || input_end_time.isAfter(item_start_time)) &&
                              (input_end_time.isSame(item_end_time) || input_end_time.isBefore(item_end_time))
                        ) {
                              found_element = item
                        }
                  })
            }

            if (Object.keys(found_element).length === 0) {
                  setStartTimeError('El profesor no está disponible en este rango de tiempo')
                  setEndTimeError('El profesor no está disponible en este rango de tiempo')
                  setClassTypeError('')
            } else {
                  let class_type_index = constants?.class_types?.find(item => item.name == classType)?.id?.toString()
                  if (!found_element?.class_type?.includes(class_type_index)) {
                        setStartTimeError('')
                        setEndTimeError('')
                        setClassTypeError('El profesor no permite este tipo de clase en ese rango de tiempo')
                  } else {
                        setStartTimeError('')
                        setEndTimeError('')
                        setClassTypeError('')
                  }
            }
      }, [startTime, endTime, classType])

      useEffect(() => {
            setDisplayedTeacherProfile({...querys.selectedTeacherProfile})
      }, [querys.selectedTeacherProfile])

      useEffect(() => {
            const startDateTime = dayjs(startTime);
            const endDateTime = dayjs(endTime);
          
            const minutesDifference = endDateTime.diff(startDateTime, 'minutes');
            const hoursDifference = minutesDifference / 60

            const hourlyPrice = displayedTeacherProfile.hourly_price
            let coin_object = constants.coin_types?.length > 0 ? constants.coin_types.find((coin_type) => coin_type.short_name == displayedTeacherProfile?.coin?.short_name) : undefined
            let new_coin = constants.coin_types?.length > 0 ? constants.coin_types.find((coin_type) => coin_type.short_name == coin) : undefined
            let factor = coin_object?.dolar_equivalence / new_coin?.dolar_equivalence 
            const total_price = hourlyPrice * hoursDifference * factor
            const new_hourly_price = hourlyPrice * factor
            
            setAutoHourlyPrice(Number(new_hourly_price.toFixed(2)))
            setAutoPrice(Number(total_price.toFixed(2)))
      }, [startTime, endTime, coin])

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])



      return (
            <Container className='py-4'>

                  {/* TEACHER PROFILE DETAIL MODAL */}
                  <Modal className='text-xs' show={showTeacherProfileModal} onHide={() => handleTeacherProfileModal()} centered size='lg'>                        
                        <Modal.Body className='p-4'>
                              <span className='flex align-items-center m-2'>
                                    <img src={displayedTeacherProfile?.user?.profile_image} className='w-12 h-12 border rounded-full' />
                                    <h6 className='my-0 mx-3 w-3/4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayedTeacherProfile?.user?.first_name} {displayedTeacherProfile?.user?.last_name}</h6>
                              </span >
                              <h5 className='mx-2 mt-4'>Presentación</h5>
                              <div className='mx-2'><TextBox content={displayedTeacherProfile?.resume !== '' ? displayedTeacherProfile?.resume : 'Este profesor no actualizó su presentación'}/></div>
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
                              <Button variant="secondary" onClick={() => handleTeacherProfileModal()}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>
                  {/* TEACHER PROFILE SCHEDULE MODAL */}
                  <Modal className='text-xs' show={showTeacherScheduleModal} onHide={() => handleTeacherScheduleModal()} centered size='lg'>      
                        <Modal.Header className='flex-col'>
                              <h5 className='mx-2'>Horario de disponibilidad</h5>
                              <p className='mx-2 mb-0'>Seleccione un tiempo disponible para reservar</p>
                        </Modal.Header>                  
                        <Modal.Body className='px-2 pb-0'>                              
                              <div className='px-4'>
                                    <Calendar 
                                          reservations={[]} 
                                          weekly_schedule={displayedTeacherProfile.weekly_schedule} 
                                          constants={constants} 
                                          handleShowReservationModal={handleShowReservationModal} 
                                          handleShowAvailableTimeModal={handleShowAvailableTimeModal} 
                                    />
                              </div>                  
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={() => handleTeacherScheduleModal()}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>

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
                                    <Col xs={8} md={6}><h5>{String(Math.floor(displayedAvailableTime?.start_time_i)).padStart(2, '0')}:{String(Math.round((displayedAvailableTime?.start_time_i % 1) * 60)).padStart(2, '0')}</h5></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h5>Hora de fin</h5></Col>
                                    <Col xs={8} md={6}><h5>{String(Math.floor(displayedAvailableTime?.end_time_i)).padStart(2, '0')}:{String(Math.round((displayedAvailableTime?.end_time_i % 1) * 60)).padStart(2, '0')}</h5></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h5>Espacios disponibles</h5></Col>
                                    <Col xs={8} md={6}><h5>{displayedAvailableTime?.n_vacancies_left}</h5></Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}><h5>Tipo de clase permitida</h5></Col>
                                    <Col xs={8} md={6}>{displayedAvailableTime?.class_type?.map((type, i) => <h5 key={i}>{type}</h5>)}</Col>
                              </Row>      
                              <p>El número de espacios indica cuantas reservaciones se pueden hacer en este rango de tiempo. El tipo de clase permitida indica que tipos de clase puede dictar el profesor en este rango de tiempo. Si deseas mas información de como dicta sus clases, puedes enviarle un mensaje.</p>                       
                        </Modal.Body>
                        <Modal.Footer> 
                              <Button variant="primary" onClick={() => handleSelectAvailableTime(displayedAvailableTime)}>Seleccionar</Button>
                              <Button variant="secondary" onClick={() => setShowAvailableTimeModal(false)}>Cerrar</Button>
                        </Modal.Footer>
                  </Modal>
                  
                  {/* MAKE RESERVATION CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showReservationConfirmationModal} onHide={() => setShowReservationConfirmationModal(false)} centered size="lg">
                        <Modal.Header closeButton>
                              <Modal.Title>Confirmar reserva</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <Row>
                                    <Col xs={4} md={6}>
                                          <Form.Label><h5>Cursos</h5></Form.Label>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <div className='flex'>
                                                {subjects?.map((subject_id, i) => <h6 className='mr-2' key={i}>{querys?.selectedTeacherProfile?.subjects?.find((item) => item?.id == subject_id)?.name}</h6>)}
                                          </div>
                                    </Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}>
                                          <Form.Label><h5>Tiempo de inicio</h5></Form.Label>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{dayjs.isDayjs(startTime) ? startTime.format('YYYY-MM-DD HH:mm') : ''}</h6>
                                    </Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}>
                                          <Form.Label><h5>Tiempo de fin</h5></Form.Label>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{dayjs.isDayjs(endTime) ? endTime.format('YYYY-MM-DD HH:mm') : ''}</h6>
                                    </Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}>
                                          <Form.Label><h5>Modalidad</h5></Form.Label>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{classType}</h6>
                                    </Col>
                              </Row>
                              <Row>
                                    <Col xs={4} md={6}>
                                          <Form.Label><h5>Precio total</h5></Form.Label>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{autoPrice} {coin}</h6>
                                    </Col>
                              </Row>
                              {message !== '' && <Row>
                                    <Col xs={4} md={6}>
                                          <Form.Label><h5>Mensaje para el profesor</h5></Form.Label>
                                    </Col>
                                    <Col xs={8} md={6}>
                                          <h6>{message}</h6>
                                    </Col>
                              </Row>}
                              <Row>
                                    <Col>
                                          <p>Al hacer esta reserva usted certifica que el documento de pago adjuntado es válido. El profesor recibirá este documento y se pondrá en contacto con usted para darle el servicio solicitado. Usted podrá ver los detalles de todas las reservas que usted haya realizado en la pestaña de "Tus Clases"</p>
                                    </Col>
                              </Row>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="primary" type='submit' onClick={() => handleReservation()}>
                                    Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => setShowReservationConfirmationModal(false)}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  { userInfo.user ? ( 
                   
                  <>
                  <Row>
                        <Col md={4}>
                              <h4>Hacer reservación</h4>
                              <p>Rellene los campos para hacer una reservación</p>
                        </Col>
                        <Col>
                              
                              <span className='flex items-center'>
                                    {
                                          querys.loading == true ? (
                                                <img
                                                      src="/tail_blue_fast.svg"
                                                      alt="Loading..."
                                                      className="w-6 h-auto ml-auto"
                                                />
                                          ) : (
                                                <button onClick={() => {handleTeacherRefresh()}} className='ml-auto mb-1'>
                                                      <img
                                                            src="/reload_icon.png"
                                                            alt="Reload"
                                                            className="w-4 h-auto"
                                                      />
                                                </button>
                                          )
                                    }
                                    <h6 onClick={() => {handleTeacherProfileModal()}} className=' my-0 mx-3 max-w-1/2' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayedTeacherProfile?.user?.first_name} {displayedTeacherProfile?.user?.last_name}</h6>
                                    <img onClick={() => {handleTeacherProfileModal()}} src={displayedTeacherProfile?.user?.profile_image} className='w-12 h-12 border rounded-full' />
                              </span>
                              <div className='flex w-full my-3' onClick={() => {handleTeacherProfileModal()}}>
                                    <div className='flex ml-auto items-center'>
                                          {Array.from({length:Math.round(displayedTeacherProfile?.average_rating/2)}, (_, i) => (
                                                      <div key={i}><img src='/star_filled_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                          ))}
                                          {Array.from({length:Math.round(5-displayedTeacherProfile?.average_rating/2)}, (_, i) => (
                                                      <div key={i}><img src='/star_empty_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                          ))}
                                          <h6 className='ml-4 my-0'>{displayedTeacherProfile?.hours_teached_reservations} horas enseñadas</h6>
                                    </div>
                              </div> 
                        </Col>
                  </Row>

                  <Row>
                        <Col>                             
                              <Form className='mt-4 mb-32' onSubmit={(e) => {handleReservationSubmit(e)}}>
                                    <Form.Group controlId='subject_and_type' className=''>
                                          <Row>
                                                <Col xs={12} md={6} className='mt-3'>
                                                      <Form.Label><h6>Cursos <span className='text-red-400'>*</span></h6></Form.Label>
                                                      <Form.Control as="select" name="subjects" style={{border:"1px solid #c4c4c4"}} multiple required>
                                                      {
                                                            displayedTeacherProfile.subjects?.length > 0 && displayedTeacherProfile.subjects.map((subject,i) => <option key={i} value={subject.id}>
                                                                  {subject.name}
                                                            </option>)
                                                      }
                                                      
                                                      </Form.Control>
                                                      <Form.Text className="text-gray-400 text-xs">Presione Ctrl+Click para seleccionar varias opciones</Form.Text>
                                                </Col>
                                                <Col xs={12} md={6} className='mt-3'>
                                                      <Form.Label><h6>Modalidad <span className='text-red-400'>*</span></h6></Form.Label>
                                                      <Dropdown className=''  onSelect={setClassType}>
                                                            <Dropdown.Toggle id='class_type' className='w-full h-10 bg-white d-flex justify-content-between align-items-center mx-0 border p-2' variant='light'>
                                                                  {classType}
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu
                                                                  align="start"
                                                                  onChange={(e) => setClassType(e.target.value)}>
                                                                  <Dropdown.Header>Tipo de clase </Dropdown.Header>
                                                                  {constants.class_types?.map((class_type, i) => (
                                                                        <Dropdown.Item key={i} eventKey={class_type.name}>
                                                                              {class_type.short_name} - {class_type.name}
                                                                        </Dropdown.Item>
                                                                  ))}
                                                            </Dropdown.Menu>
                                                      </Dropdown> 
                                                      <Form.Text className="text-red-400 text-xs">{classTypeError}</Form.Text>                                                      
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    <Form.Group controlId='start_end_time' className=''>
                                          <Row>
                                                <Col xs={12} md={6} className='mt-3'>
                                                      <Form.Label><h6>Tiempo de inicio <span className='text-red-400'>*</span></h6></Form.Label>
                                                      <DateTimePicker 
                                                            id='start_time'
                                                            name='start_time'
                                                            disablePast
                                                            value={dayjs(startTime)}
                                                            required
                                                            onChange={(value) => setStartTime(value.format('M/D/YYYY, H:m:s'))} //A
                                                            slotProps={{ 
                                                                  textField: { size: 'small', color: 'info', fullWidth:true },
                                                            }}
                                                      />
                                                      <Form.Text className="text-red-400 text-xs">{startTimeError}</Form.Text>    
                                                </Col>
                                                <Col xs={12} md={6} className='mt-3'>
                                                      <Form.Label><h6>Tiempo de fin <span className='text-red-400'>*</span></h6></Form.Label>
                                                      <DateTimePicker 
                                                            id='end_time'
                                                            name='end_time'
                                                            disablePast
                                                            value={dayjs(endTime)}
                                                            required
                                                            onChange={(value) => setEndTime(value.format('M/D/YYYY, H:m:s'))} //A
                                                            slotProps={{ 
                                                                  textField: { size: 'small', color: 'info', fullWidth:true  },
                                                            }}
                                                      />
                                                      <Form.Text className="text-red-400 text-xs">{endTimeError}</Form.Text>    
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    <div className='flex w-full my-3' onClick={() => {handleTeacherScheduleModal()}}>
                                          <Button className='ml-auto'>Seleccionar en el horario del profesor</Button>
                                    </div>
                                    <h4 className='mt-5'>Proceso de pago</h4>
                                    <Form.Group controlId='start_end_time' className=''>
                                          
                                          <Row>
                                                <Col xs={12} md={6} className='mt-3 flex flex-wrap '>
                                                      <div className='bg-gray-100 w-full h-full'>
                                                      <Card className='mx-5 my-4 shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{borderRadius:'20px'}} onClick={() => {handleTeacherProfileModal()}}>
                                                            <Card.Body>
                                                                  <div className='flex align-items-center justify-content-center mb-2'>
                                                                        <img src={displayedTeacherProfile?.user?.profile_image} className='w-12 h-12 rounded-full border'/>
                                                                        <h5 className='my-0 px-2 w-1/2' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayedTeacherProfile === undefined && displayedTeacherProfile === null ? ("") : (`${displayedTeacherProfile.user?.first_name} ${displayedTeacherProfile.user?.last_name}`)}</h5>
                                                                  </div>
                                                                  <img className='p-3' src={`${displayedTeacherProfile?.payment_qr}`}/>
                                                                  <div className='flex flex-col align-items-center justify-content-center '>
                                                                        <p>{displayedTeacherProfile?.payment_credentials}</p>
                                                                        <h5>Precio por hora</h5>
                                                                        <h3>{displayedTeacherProfile?.hourly_price} {displayedTeacherProfile?.coin?.short_name}</h3>
                                                                  </div>
                                                            </Card.Body>
                                                      </Card>
                                                      </div>
                                                </Col>
                                               
                                                <Col xs={12} md={6} className='mt-3 '>
                                                      <Form.Label className='w-full'><h6>Precio calculado de reserva</h6></Form.Label>
                                                      <div className='flex'>
                                                            <div className='w-1/2'>
                                                                  <Form.Control
                                                                              type='number'
                                                                              name='hourly_price'
                                                                              value={autoPrice}
                                                                              className='h-10 bg-white'
                                                                              disabled
                                                                              style={{borderRadius: '4px 0 0 4px', borderTop: '1px solid #dee2e6', borderLeft: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6', borderRight: '0'}}
                                                                  />
                                                            </div>
                                                            <Dropdown className='w-1/2' onSelect={setCoin}>
                                                                  <Dropdown.Toggle id='coin_type'  className='w-full h-10 bg-white d-flex justify-content-between align-items-center mx-0 border p-2' variant='light' style={{borderRadius: '0 4px 4px 0' }}>
                                                                        {coin}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu
                                                                        align="start"
                                                                        onChange={(e) => setCoin(e.target.value)}
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
                                                      </div>
                                                      <Form.Text className="text-gray-400 text-xs mb-3">Este es el precio que costará su reserva segun las horas y el tipo de moneda que usted ha seleccionado</Form.Text>
                                                      
                                                      <Form.Label className='w-full'><h6>Comprobante de pago <span className='text-red-400'>*</span></h6></Form.Label>
                                                      <Form.Control type="file" name="document" accept="image/*" required/>
                                                      <Form.Text className="text-gray-400 text-xs">Por favor adjunte el comprobante de pago del costo de la reserva. El pago debe ser realizado a travez del método de pago especificado por el profesor. El profesor revisará este documento y podrá cancelar la reserva si no es válido. Actualmente solo aceptamos imagenes en este campo.</Form.Text>
                                                      
                                                      
                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    <h4 className='mt-5'>Mensaje al profesor</h4>
                                    <Form.Group controlId='message' className=''>
                                          <Row>
                                                <Col  className='mt-3'>
                                                      <Form.Control
                                                            as="textarea" rows={3}
                                                            name="message"
                                                            placeholder="Escriba un mensaje al profesor"
                                                            value={message}
                                                            onChange={(e) => setMessage(e.target.value)}
                                                            className='rounded border'
                                                            style={{ fontSize: '.75rem' }}
                                                      />
                                                      <Form.Text className="text-gray-400 text-xs">Opcionalmente, puede agregar un mensaje para el profesor acerca de esta reserva.</Form.Text>

                                                </Col>
                                          </Row>
                                    </Form.Group>
                                    
                                    <Form.Group>
                                          <Row >
                                                { !userChildren.loading ?
                                                <Col xs={12} className='mt-3 flex'>
                                                      <Button className='ml-auto mr-2' variant="primary" type='submit' >
                                                            Reservar
                                                      </Button>
                                                      <Button variant="secondary" onClick={() => {handleBackToSearch()}}>
                                                            Buscar otro profesor
                                                      </Button>
                                                      
                                                </Col >
                                                :
                                                <img
                                                      src="/tail_blue_fast.svg"
                                                      alt="Loading..."
                                                      className="w-12 h-auto ml-auto"
                                                />
                                                }
                                                <p className='text-red-400 w-full text-end m-3'>{generalError}</p>
                                                
                                                
                                          </Row>
                                    </Form.Group>

                                    
                              </Form>
                        </Col>
                  </Row>
                  </>)
                
                  :
                  (<Row>
                        <Col>
                              <div className='flex flex-col justify-center items-center p-5'>
                              <h4>Registrese para poder reservar un horario con cualquier profesor.</h4>
                              <Button className='w-fit' onClick={() => {navigate('/user')}}>Registrarse o iniciar sesión</Button>
                              </div>
                        </Col>
                  </Row>)
                  }
            </Container>
      )
}

export default ReservationScreen