import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Calendar from '../components/Calendar';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN } from '../utils'
import { addSubject, deleteSubject, addLanguage, deleteLanguage, addPaymentMethod, deletePaymentMethod, addStyle, deleteStyle, addExperienceValidator, deleteExperienceValidator } from '../reducers/teacherReducers'


function TeacherProfileScreen({ userInfo, teacherProfile, userChildren, categories, universities, constants }) {
      const dispatch = useDispatch()

      const [teacherSubjects, setTeacherSubjects] = useState([])
      const [displayedSubject, setDisplayedSubject] = useState({})

      const [teacherLanguages, setTeacherLanguages] = useState({})
      const [displayedLanguage, setDisplayedLanguage] = useState({})

      const [teacherPaymentMethods, setTeacherPaymentMethods] = useState({})
      const [displayedPaymentMethod, setDisplayedPaymentMethod] = useState({})

      const [teacherStyles, setTeacherStyles] = useState({})
      const [displayedStyle, setDisplayedStyle] = useState({})

      const [teacherExperienceValidators, setTeacherExperienceValidators] = useState({})
      const [displayedExperienceValidator, setDisplayedExperienceValidator] = useState({})

      const [showCategoriesModal, setShowCategoriesModal] = useState(false)
      const [showSubjectModal, setShowSubjectModal] = useState(false)
      const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
      const [showDeleteSubjectModal, setShowDeleteSubjectModal] = useState(false)

      const [showLanguagesListModal, setShowLanguagesListModal] = useState(false)
      const [showLanguageModal, setShowLanguageModal] = useState(false)
      const [showAddLanguageModal, setShowAddLanguageModal] = useState(false)
      const [showDeleteLanguageModal, setShowDeleteLanguageModal] = useState(false)

      const [showPaymentMethodsListModal, setShowPaymentMethodsListModal] = useState(false)
      const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false)
      const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState(false)
      const [showDeletePaymentMethodModal, setShowDeletePaymentMethodModal] = useState(false)

      const [showStylesListModal, setShowStylesListModal] = useState(false)
      const [showStyleModal, setShowStyleModal] = useState(false)
      const [showAddStyleModal, setShowAddStyleModal] = useState(false)
      const [showDeleteStyleModal, setShowDeleteStyleModal] = useState(false)

      const [showExperienceValidatorModal, setShowExperienceValidatorModal] = useState(false)
      const [showAddExperienceValidatorModal, setShowAddExperienceValidatorModal] = useState(false)
      const [showDeleteExperienceValidatorModal, setShowDeleteExperienceValidatorModal] = useState(false)
      


      const [showUniversities, setShowUniversities] = useState(false)
      const [openUniversity, setOpenUniversity] = useState(null)
      const [openCategory, setOpenCategory] = useState(null)
      const [search, setSearch] = useState('');

      const [validationMessage, setValidationMessage] = useState('')
      const [validationHours, setValidationHours] = useState(0)
      const [validationDocumentIsPublic, setValidationDocumentIsPublic] = useState(false)

      const [showEditConfigurationModal, setShowEditConfigurationModal] = useState(false)
      const [paymentCredentials, setPaymentCredentials] = useState('')
      const [hourlyPrice, setHourlyPrice] = useState(0)
      const [coin, setCoin] = useState('')
      const [minAge, setMinAge] = useState(0)
      const [maxAge, setMaxAge] = useState(0)
      const [minAnticipation, setMinAnticipation] = useState(0)
      const [maxAnticipation, setMaxAnticipation] = useState(0)
      const [timeIntervalHour, setTimeIntervalHour] = useState(0)
      const [timeIntervalMinute, setTimeIntervalMinute] = useState(0)
      const [minReservationTimeHour, setMinReservationTimeHour] = useState(0)
      const [minReservationTimeMinute, setMinReservationTimeMinute] = useState(0)
      const [maxReservationTimeHour, setMaxReservationTimeHour] = useState(0)
      const [maxReservationTimeMinute, setMaxReservationTimeMinute] = useState(0)
      const [trialSesions, setTrialSesions] = useState('')
      const [refundPolicy, setRefundPolicy] = useState('')
      const [flexibleSchedule, setFlexibleSchedule] = useState('')
      

      const [profileWidth, setProfileWidth] = useState(window.innerWidth < 1000 ? Math.round(window.innerWidth * 0.9) : window.innerWidth < 2000 ? 800 : 1500)

      const handleResize = () => {
            const windowsWidth = window.innerWidth
            let newWidth = 0
            if(windowsWidth < 1000){
                  newWidth = Math.round(windowsWidth * 0.9)
            } else if(windowsWidth < 2000){
                  newWidth = 800
            } else {
                  newWidth = 1500
            }
            newWidth += 30
            setProfileWidth(newWidth)
      }

      useEffect(() => {
            handleResize()
            window.addEventListener('resize', handleResize)
      
            return () => {
                  window.removeEventListener('resize', handleResize)
            };
      }, [])

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

      // LANGUAGE MODALS
      // opening/closing languages modal
      const handleLanguagesListModal = () => {
            setShowLanguagesListModal(!showLanguagesListModal)
      }
      // opening/closing language details modal
      const handleLanguageModal = (language) => {
            setShowLanguageModal(!showLanguageModal)
            setDisplayedLanguage(language)
      }
      // open/close add language verification modal
      const handleAddLanguageModal = (language) => {
            setShowLanguageModal(false) // closes any subject details model that was open
            setShowAddLanguageModal(!showAddLanguageModal)
            setDisplayedLanguage(language)
      }
      // add language
      const handleAddLanguage = (language) => {
            setShowLanguagesListModal(false)
            setShowAddLanguageModal(false)
            dispatch(addLanguage({token:userInfo.token, language_id:language.id}))
      }
      // open/close delete subject verification modal
      const handleDeleteLanguageModal = () => {
            setShowLanguageModal(false)
            setShowDeleteLanguageModal(!showDeleteLanguageModal)
      } 
      // delete language 
      const handleDeleteLanguage = (language) => {
            setShowDeleteLanguageModal(false)
            dispatch(deleteLanguage({token:userInfo.token, language_id:language.id}))
      }


      // PAYMENT METHODS MODALS
      // opening/closing payment methods modal
      const handlePaymentMethodsListModal = () => {
            setShowPaymentMethodsListModal(!showPaymentMethodsListModal)
      }
      // opening/closing payment methods details modal
      const handlePaymentMethodModal = (payment) => {
            setShowPaymentMethodModal(!showPaymentMethodModal)
            setDisplayedPaymentMethod(payment)
      }
      // open/close add payment method verification modal
      const handleAddPaymentMethodModal = (payment) => {
            setShowPaymentMethodModal(false) // closes any subject details model that was open
            setShowAddPaymentMethodModal(!showAddPaymentMethodModal)
            setDisplayedPaymentMethod(payment)
      }
      // add payment method
      const handleAddPaymentMethod = (payment) => {
            setShowPaymentMethodsListModal(false)
            setShowAddPaymentMethodModal(false)
            dispatch(addPaymentMethod({token:userInfo.token, payment_id:payment.id}))
      }
      // open/close delete subject verification modal
      const handleDeletePaymentMethodModal = () => {
            setShowPaymentMethodModal(false)
            setShowDeletePaymentMethodModal(!showDeletePaymentMethodModal)
      } 
      // delete payment method 
      const handleDeletePaymentMethod = (payment) => {
            setShowDeletePaymentMethodModal(false)
            dispatch(deletePaymentMethod({token:userInfo.token, payment_id:payment.id}))
      }


      // TEACHING STYLES MODALS
      // opening/closing teaching styles modal
      const handleStylesListModal = () => {
            setShowStylesListModal(!showStylesListModal)
      }
      // opening/closing style details modal
      const handleStyleModal = (style) => {
            setShowStyleModal(!showStyleModal)
            setDisplayedStyle(style)
      }
      // open/close add style verification modal
      const handleAddStyleModal = (style) => {
            setShowStyleModal(false) // closes any subject details model that was open
            setShowAddStyleModal(!showAddStyleModal)
            setDisplayedStyle(style)
      }
      // add style
      const handleAddStyle = (style) => {
            setShowStylesListModal(false)
            setShowAddStyleModal(false)
            dispatch(addStyle({token:userInfo.token, style_id:style.id}))
      }
      // open/close delete style verification modal
      const handleDeleteStyleModal = () => {
            setShowStyleModal(false)
            setShowDeleteStyleModal(!showDeleteStyleModal)
      } 
      // delete style 
      const handleDeleteStyle = (style) => {
            setShowDeleteStyleModal(false)
            dispatch(deleteStyle({token:userInfo.token, style_id:style.id}))
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
      const handleEditConfigurationModal = () => {
            setPaymentCredentials(teacherProfile.teacherProfile.payment_credentials)
            setHourlyPrice(teacherProfile.teacherProfile.hourly_price)
            setCoin(teacherProfile.teacherProfile.coin?.short_name)
            setMinAge(teacherProfile.teacherProfile.min_student_age)
            setMaxAge(teacherProfile.teacherProfile.max_student_age)
            let min_anticipation_time = teacherProfile.teacherProfile.min_anticipation_time
            let max_anticipation_time = teacherProfile.teacherProfile.max_anticipation_time
            setMinAnticipation(parseInt(min_anticipation_time?.split(' ')[0],10))
            setMaxAnticipation(parseInt(max_anticipation_time?.split(' ')[0],10)) 
            let time_interval = teacherProfile.teacherProfile.time_interval
            setTimeIntervalHour(parseInt(time_interval.split(':')[0],10)) //
            setTimeIntervalMinute(parseInt(time_interval.split(':')[1],10)) //
            let min_reservation_time = teacherProfile.teacherProfile.min_reservation_time
            setMinReservationTimeHour(parseInt(min_reservation_time?.split(':')[0],10)) //
            setMinReservationTimeMinute(parseInt(min_reservation_time?.split(':')[1],10)) //
            let max_reservation_time = teacherProfile.teacherProfile.max_reservation_time
            setMaxReservationTimeHour(parseInt(max_reservation_time?.split(':')[0],10)) //
            setMaxReservationTimeMinute(parseInt(max_reservation_time?.split(':')[1],10)) //
            setTrialSesions(teacherProfile.teacherProfile.trial_sesions)
            setRefundPolicy(teacherProfile.teacherProfile.refund_policy)
            setFlexibleSchedule(teacherProfile.teacherProfile.flexible_booking)
            setShowEditConfigurationModal(!showEditConfigurationModal)
      }
      // submit edit configuration modal
      const hanldeSubmitEditConfigurationModal = (e) => {
            e.preventDefault()
            setShowEditConfigurationModal(false)
            const form_data = new FormData(e.target)

            // HAS ALL VALUES EXCEPT COIN WHICH MUST BE PULLED FROM STATE


            /* This would print all the values of the form data
            let form_values = {}
            for (const [key, value] of form_data.entries()) {
                  form_values[key] = value;
            }
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


      useEffect(() => {
            setTeacherSubjects(teacherProfile.teacherProfile.subjects || [])
            setTeacherLanguages(teacherProfile.teacherProfile.languages || [])
            setTeacherPaymentMethods(teacherProfile.teacherProfile.payment_methods || [])
            setTeacherStyles(teacherProfile.teacherProfile.teaching_styles || [])
            setTeacherExperienceValidators(teacherProfile.teacherProfile.experience_validators || [])
            //RESERVATION CONFIG
            setPaymentCredentials(teacherProfile.teacherProfile.payment_credentials)
            setHourlyPrice(teacherProfile.teacherProfile.hourly_price)
            setCoin(teacherProfile.teacherProfile.coin?.short_name)
            setMinAge(teacherProfile.teacherProfile.min_student_age)
            setMaxAge(teacherProfile.teacherProfile.max_student_age)
            let min_anticipation_time = teacherProfile.teacherProfile.min_anticipation_time
            let max_anticipation_time = teacherProfile.teacherProfile.max_anticipation_time
            setMinAnticipation(parseInt(min_anticipation_time?.split(' ')[0],10))
            setMaxAnticipation(parseInt(max_anticipation_time?.split(' ')[0],10)) 
            let time_interval = teacherProfile.teacherProfile.time_interval
            setTimeIntervalHour(parseInt(time_interval?.split(':')[0],10)) //
            setTimeIntervalMinute(parseInt(time_interval?.split(':')[1],10)) //
            let min_reservation_time = teacherProfile.teacherProfile.min_reservation_time
            setMinReservationTimeHour(parseInt(min_reservation_time?.split(':')[0],10)) //
            setMinReservationTimeMinute(parseInt(min_reservation_time?.split(':')[1],10)) //
            let max_reservation_time = teacherProfile.teacherProfile.max_reservation_time
            setMaxReservationTimeHour(parseInt(max_reservation_time?.split(':')[0],10)) //
            setMaxReservationTimeMinute(parseInt(max_reservation_time?.split(':')[1],10)) //
            setTrialSesions(teacherProfile.teacherProfile.trial_sesions)
            setRefundPolicy(teacherProfile.teacherProfile.refund_policy)
            setFlexibleSchedule(teacherProfile.teacherProfile.flexible_booking)

      }, [teacherProfile.teacherProfile])

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


      return (
            <div className='m-0'>
                  {     teacherProfile.teacherProfile !== undefined && Object.keys(teacherProfile.teacherProfile)?.length !== 0 ? (
            <Container fluid className="d-flex align-items-center justify-content-center m-0 w-full  flex-col p-0 px-lg-5 ">
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
                                                university.name.toLowerCase().includes(search) ? 
                                                <div key={i}>
                                                      <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenUniversity(university.id)}>
                                                            <h6>{university.name}</h6>
                                                            <img className={`w-3 h-3 transition-transform transform ${university.id == openUniversity ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                      </div>
                                                      <div className={`mt-3 min-h-8 transition-transform transform ${university.id == openUniversity ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                            {
                                                            university.id == openUniversity ? (
                                                                  university.degrees !== undefined && university.degrees !== null ? university.degrees.map((degree, j) => (
                                                                        degree.is_university_degree ?
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
                                                category.name.toLowerCase().includes(search) ?
                                                <div key={i}>
                                                      <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenCategory(category.id)}>
                                                            <h6>{category.name}</h6>
                                                            <img className={`w-3 h-3 transition-transform transform ${category.id == openCategory ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                      </div>
                                                      <div className={`flex flex-wrap mt-3 min-h-8 transition-transform transform ${category.id == openCategory ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
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
                        </Modal.Body>
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
                              <p className='text-justify'>{displayedSubject.description}</p>
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


                  {/* LANGUAGES LIST MODAL */}
                  <Modal className='text-xs' show={showLanguagesListModal} onHide={() => handleLanguagesListModal()} centered size="md">
                        <Modal.Header closeButton className='align-items-center'>
                              <Modal.Title className=''>Agregar idioma</Modal.Title>
                              <span className='ml-auto mt-1 w-6 h-6 select-none' onClick={() => handleLanguagesListModal()}>
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
                              {  
                                    constants.languages?.length > 0 && constants.languages.map((language,i) => (
                                          <div key={i}>
                                                <div  className='flex justify-between align-items-center border-b p-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleAddLanguageModal(language)}>
                                                      <h6>{language.short_name} - {language.name}</h6>
                                                </div>
                                               
                                          </div> 
                                    )) 
                                    
                              }                                  
                        </Modal.Body>
                  </Modal>
                  {/* LANGUAGE DETAILS MODAL */}
                  <Modal className='text-xs' show={showLanguageModal} onHide={() => handleLanguageModal({})} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>{displayedLanguage.short_name} - {displayedLanguage.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p className='text-justify'>Este idioma ha sido incorporado en su perfil de profesor, lo que atestigua su competencia y habilidad para enseñar en dicha lengua. Si en algún momento desea retirar este idioma de su perfil, puede hacerlo presionando el botón correspondiente.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteLanguageModal()}>
                                    Eliminar
                              </Button>
                              <Button variant="secondary" onClick={() => handleLanguageModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* LANGUAGE ADD CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showAddLanguageModal} onHide={() => handleAddLanguageModal({})} centered size="sm">
                        <Modal.Header closeButton>
                              <Modal.Title>Agregar idioma: {displayedLanguage.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p className='text-justify'>
                              Al agregar este idioma a su perfil de profesor, certifica que está capacitado para enseñar en dicha lengua, permitiendo que su perfil aparezca en los resultados de búsqueda correspondientes. Esto sucede únicamente cuando su perfil está 
                              <OverlayTrigger
                                    key="bottom_1"
                                    placement="bottom"
                                    overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                              ><b> activo</b></OverlayTrigger>. 
                              </p>                              
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="primary" onClick={() => handleAddLanguage(displayedLanguage)}>
                                    Agregar
                              </Button>
                              <Button variant="secondary" onClick={() => handleAddLanguageModal({})}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* LANGUAGE DELETE CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showDeleteLanguageModal} onHide={() => handleDeleteLanguageModal()} centered size="sm">
                        <Modal.Header closeButton>
                              <Modal.Title>Eliminar idioma: {displayedLanguage.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p>Por favor confirmenos que desea eliminar el idioma <b>{displayedLanguage.name}</b> de su perfil de profesor. Esto significará que usted ya no aparecerá en los resultados de busqueda de este idioma.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteLanguage(displayedLanguage)}>
                                    Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => handleDeleteLanguageModal()}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>


                  {/* PAYMENT METHODS LIST MODAL */}
                  <Modal className='text-xs' show={showPaymentMethodsListModal} onHide={() => handlePaymentMethodsListModal()} centered size="md">
                        <Modal.Header closeButton className='align-items-center'>
                              <Modal.Title className=''>Agregar metodo de pago</Modal.Title>
                              <span className='ml-auto mt-1 w-6 h-6 select-none' onClick={() => handlePaymentMethodsListModal()}>
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
                              {  
                                    constants.payment_methods?.length > 0 && constants.payment_methods.map((payment,i) => (
                                          <div key={i}>
                                                <div  className='flex justify-between align-items-center border-b p-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleAddPaymentMethodModal(payment)}>
                                                      <h6>{payment.short_name} - {payment.name}</h6>
                                                </div>
                                               
                                          </div> 
                                    )) 
                                    
                              }                                  
                        </Modal.Body>
                  </Modal>
                  {/* PAYMENT METHODS DETAILS MODAL */}
                  <Modal className='text-xs' show={showPaymentMethodModal} onHide={() => handlePaymentMethodModal({})} centered size="md">
                        <Modal.Header closeButton>
                              <Modal.Title>{displayedPaymentMethod.short_name} - {displayedPaymentMethod.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p className='text-justify'>Este método de pago ha sido agregado a su perfil de profesor, lo que informa a cualquier usuario interesado en adquirir una reserva que puede utilizar este método. Para facilitar el proceso de pago, le instamos a que incluya sus credenciales de pago en la sección de configuración de reservas, ubicada en esta misma página. En cualquier momento que lo desee, puede retirar este método de pago de su perfil mediante la opción correspondiente.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeletePaymentMethodModal()}>
                                    Eliminar
                              </Button>
                              <Button variant="secondary" onClick={() => handlePaymentMethodModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* PAYMENT METHODS ADD CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showAddPaymentMethodModal} onHide={() => handleAddPaymentMethodModal({})} centered size="sm">
                        <Modal.Header closeButton>
                              <Modal.Title>Agregar idioma: {displayedPaymentMethod.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p className='text-justify'>
                              Al agregar este método de pago a su perfil de profesor, indicará a cualquier usuario interesado en adquirir una reserva que puede utilizar este método para hacerlo. Esto sucede únicamente cuando su perfil está 
                              <OverlayTrigger
                                    key="bottom_1"
                                    placement="bottom"
                                    overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                              ><b> activo</b></OverlayTrigger>. 
                              </p>                              
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="primary" onClick={() => handleAddPaymentMethod(displayedPaymentMethod)}>
                                    Agregar
                              </Button>
                              <Button variant="secondary" onClick={() => handleAddPaymentMethodModal({})}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* PAYMENT METHODS DELETE CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showDeletePaymentMethodModal} onHide={() => handleDeletePaymentMethodModal()} centered size="sm">
                        <Modal.Header closeButton>
                              <Modal.Title>Eliminar idioma: {displayedPaymentMethod.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p>Por favor confirmenos que desea eliminar el método de pago <b>{displayedPaymentMethod.name}</b> de su perfil de profesor. Esto significará que los usuarios interesados en adquirir una reserva no utilizarán este método de pago.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeletePaymentMethod(displayedPaymentMethod)}>
                                    Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => handleDeletePaymentMethodModal()}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>


                  {/* STYLES LIST MODAL */}
                  <Modal className='text-xs' show={showStylesListModal} onHide={() => handleStylesListModal()} centered size="md">
                        <Modal.Header closeButton className='align-items-center'>
                              <Modal.Title className=''>Agregar estilo de enseñanza</Modal.Title>
                              <span className='ml-auto mt-1 w-6 h-6 select-none' onClick={() => handleStylesListModal()}>
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
                              {  
                                    constants.teaching_styles?.length > 0 && constants.teaching_styles.map((style,i) => (
                                          <div key={i}>
                                                <div  className='flex justify-between align-items-center border-b p-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleAddStyleModal(style)}>
                                                      <h6>{style.name}</h6>
                                                </div>
                                               
                                          </div> 
                                    )) 
                                    
                              }                                  
                        </Modal.Body>
                  </Modal>
                  {/* STYLE DETAILS MODAL */}
                  <Modal className='text-xs' show={showStyleModal} onHide={() => handleStyleModal({})} centered size="lg">
                        <Modal.Header closeButton>
                              <Modal.Title>{displayedStyle.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <h6>Descripción</h6>         
                              <p className='text-justify'>{displayedStyle.description}</p>
                              <p className='text-justify'>Este estilo de enseñanza ha sido incorporado en su perfil de profesor, lo que señala que emplea esta modalidad en sus clases. Si en algún momento desea retirar este estilo de su perfil, puede hacerlo presionando el botón correspondiente.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteStyleModal()}>
                                    Eliminar
                              </Button>
                              <Button variant="secondary" onClick={() => handleStyleModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* STYLE ADD CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showAddStyleModal} onHide={() => handleAddStyleModal({})} centered size="lg">
                        <Modal.Header closeButton>
                              <Modal.Title>Agregar estilo de enseñanza: {displayedStyle.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <h6>Descripción</h6>         
                              <p className='text-justify'>{displayedStyle.description}</p>
                              <p className='text-justify'>
                              Al agregar este estilo a su perfil de profesor, señala que emplea esta modalidad en sus clases, lo que posibilita que su perfil sea visible en los resultados de búsqueda pertinentes. Esto sucede únicamente cuando su perfil está 
                              <OverlayTrigger
                                    key="bottom_1"
                                    placement="bottom"
                                    overlay={<Tooltip id="tooltip-bottom">Puede activar su perfil en la pagina de perfil de profesor</Tooltip>}
                              ><b> activo</b></OverlayTrigger>. Añadir estilos de enseñanza es voluntario, pero ofrece a los usuarios la posibilidad de encontrar un profesor que imparta clases de acuerdo con sus preferencias de aprendizaje.
                              </p>
                              
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="primary" onClick={() => handleAddStyle(displayedStyle)}>
                                    Agregar
                              </Button>
                              <Button variant="secondary" onClick={() => handleAddStyleModal({})}>
                                    Cancelar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  {/* STYLE DELETE CONFIRMATION MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showDeleteStyleModal} onHide={() => handleDeleteStyleModal()} centered size="md      ">
                        <Modal.Header closeButton>
                              <Modal.Title>Eliminar estilo de enseñanza: {displayedStyle.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p>Por favor confirmenos que desea eliminar el estilo de enseñanza de <b>{displayedStyle.name}</b> de su perfil de profesor. Esto significará que usted ya no aparecerá en los resultados de busqueda de este estilo.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteStyle(displayedStyle)}>
                                    Confirmar
                              </Button>
                              <Button variant="secondary" onClick={() => handleDeleteStyleModal()}>
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
                              <p className='text-justify'>{displayedExperienceValidator.message}</p>
                              <h6>Documento</h6>    
                              <img src={BASE_URL + displayedExperienceValidator.document} onClick={() => window.open(BASE_URL + displayedExperienceValidator.document, '_blank')} alt="Profile"  style={{ objectPosition: 'left top' }} className="mb-2 object-cover w-full h-40 rounded border opacity-100 hover:opacity-75" />
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
                                    <img src={BASE_URL + displayedExperienceValidator.document} alt="Profile"  style={{ objectPosition: 'left top' }} className="mb-2 object-cover w-full h-40 rounded border" />
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



                  {/* EDIT CONFIGURATION  MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showEditConfigurationModal} onHide={() => handleEditConfigurationModal()} centered size="lg">
                        <Form onSubmit={(e) => {hanldeSubmitEditConfigurationModal(e)}}>
                              <Modal.Header closeButton>
                                    <Modal.Title>Editar configuración</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          
                                          <Form.Group controlId='payment_credentials' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Credenciales de pago</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  as="textarea" rows={3}
                                                                  name='payment_credentials'
                                                                  placeholder="Ingrese sus credenciales de pago"
                                                                  value={paymentCredentials}
                                                                  onChange={(e) => setPaymentCredentials(e.target.value)}
                                                                  className='rounded border'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='hourly_price' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Precio por hora</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={5} md={4} className='flex pr-0'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='hourly_price'
                                                                  value={hourlyPrice}
                                                                  onChange={(e) => setHourlyPrice(e.target.value)}
                                                                  className='h-fit'
                                                                  style={{borderRadius: '4px 0 0 4px', borderTop: '1px solid #dee2e6', borderLeft: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6', borderRight: '0', fontSize: '.75rem'}}
                                                            />
                                                      </Col>
                                                      <Col xs={3} md={2} className='flex pl-0'>
                                                            <Dropdown className='w-full' onSelect={handleCoinChange}>
                                                                  <Dropdown.Toggle id='coin_type'  className='w-full h-8 bg-white d-flex justify-content-between align-items-center mx-0 border p-2' variant='light' style={{borderRadius: '0 4px 4px 0', fontSize: '.75rem', }}>{coin}</Dropdown.Toggle>
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
                                          <Form.Group controlId='min_student_age' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Edad mínima del estudiante</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6} className='flex'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='min_student_age'
                                                                  value={minAge}
                                                                  onChange={(e) => setMinAge(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='ml-2'><h6>años</h6></Form.Text>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='max_student_age' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Edad máxima del estudiante</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6} className='flex'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='max_student_age'
                                                                  value={maxAge}
                                                                  onChange={(e) => setMaxAge(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='ml-2'><h6>años</h6></Form.Text>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='min_anticipation_time' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Tiempo mínimo de anticipación de reserva</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6} className='flex'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='min_anticipation_time'
                                                                  value={minAnticipation}
                                                                  onChange={(e) => setMinAnticipation(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='ml-2'><h6>dias</h6></Form.Text>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='max_anticipation_time' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Tiempo máximo de anticipación de reserva</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6} className='flex'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='max_anticipation_time'
                                                                  value={maxAnticipation}
                                                                  onChange={(e) => setMaxAnticipation(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='ml-2'><h6>dias</h6></Form.Text>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='time_interval' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Intervalo de tiempo de reserva</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6} className='flex'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='time_interval_hour'
                                                                  value={timeIntervalHour}
                                                                  onChange={(e) => setTimeIntervalHour(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='mx-2'><h6>horas</h6></Form.Text>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='time_interval_minute'
                                                                  value={timeIntervalMinute}
                                                                  onChange={(e) => setTimeIntervalMinute(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='ml-2'><h6>minutos</h6></Form.Text>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='min_reservation_time' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Tiempo de reserva mínimo</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6} className='flex'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='min_reservation_time_hour'
                                                                  value={minReservationTimeHour}
                                                                  onChange={(e) => setMinReservationTimeHour(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='mx-2'><h6>horas</h6></Form.Text>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='min_reservation_time_minute'
                                                                  value={minReservationTimeMinute}
                                                                  onChange={(e) => setMinReservationTimeMinute(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='ml-2'><h6>minutos</h6></Form.Text>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='max_reservation_time' className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Tiempo de reserva máximo</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6} className='flex'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='max_reservation_time_hour'
                                                                  value={maxReservationTimeHour}
                                                                  onChange={(e) => setMaxReservationTimeHour(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='mx-2'><h6>horas</h6></Form.Text>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='max_reservation_time_minute'
                                                                  value={maxReservationTimeMinute}
                                                                  onChange={(e) => setMaxReservationTimeMinute(e.target.value)}
                                                                  className='rounded border h-min'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                            <Form.Text className='ml-2'><h6>minutos</h6></Form.Text>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='trial_sesions' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Sesiones de prueba</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  as="textarea" rows={3}
                                                                  name='trial_sesions'
                                                                  placeholder="Ingrese su política de sesiones de prueba"
                                                                  value={trialSesions}
                                                                  onChange={(e) => setTrialSesions(e.target.value)}
                                                                  className='rounded border'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='refund_policy' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Política de reembolso</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  as="textarea" rows={3}
                                                                  name='refund_policy'
                                                                  placeholder="Ingrese su política de reembolso"
                                                                  value={refundPolicy}
                                                                  onChange={(e) => setRefundPolicy(e.target.value)}
                                                                  className='rounded border'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='flexible_schedule' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Horario flexible</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  as="textarea" rows={3}
                                                                  name='flexible_schedule'
                                                                  placeholder="Ingrese su política de flexibilidad de horario"
                                                                  value={flexibleSchedule}
                                                                  onChange={(e) => setFlexibleSchedule(e.target.value)}
                                                                  className='rounded border'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
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

                  
                  

                  <Row className='w-full '>
                        <Card className="bg-light w-full mx-lg-5 mt-lg-3 mb-5 py-3 align-items-center" style={{ borderRadius: '0', borderWidth:0 }}>
                              <Card.Body className="p-3 jutify-content-center" style={{width: profileWidth}}>
                                    
                                    <Row className='mb-4'>
                                          
                                          <Col xs={2} className="pr-0">
                                                <img src={userInfo.user.profile_image} alt="Imagen de Perfil" className=" w-32 img-fluid rounded-2xl border border-gray-600"/>
                                          </Col>
                                          <Col xs={10} className="">
                                                <h4>Perfil de profesor</h4>
                                                <h6>{userInfo === undefined && userInfo === null ? ("") : (`${userInfo.user.first_name} ${userInfo.user.last_name}`)}</h6>
                                                <p className='text-md'>{userChildren.loading == true ? (""):(teacherProfile.teacherProfile.resume)}</p>

                                          </Col>      
                                    </Row>
                                    <Row>
                                          <Col xs={12} className=''><h5>Cursos dictados</h5></Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className='flex flex-wrap mb-2 text-white'>
                                                {
                                                      teacherSubjects?.length > 0 && teacherSubjects.map((subject, i) => (
                                                            <div key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} className='px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleSubjectModal(subject)}>{subject.name}</div>
                                                      )) 
                                                }
                                                {
                                                      teacherProfile.loading ? 
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-6 h-6"
                                                      /> :
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
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className=''><h5>Idiomas de dictado</h5></Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className='flex flex-wrap mb-2 text-white'>
                                                {
                                                      teacherLanguages?.length > 0 && teacherLanguages.map((language, i) => (
                                                            <div key={i} className='bg-gray-700 px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'  onClick={() => handleLanguageModal(language)}>{language.name}</div>
                                                      )) 
                                                }
                                                {
                                                      teacherProfile.loading ? 
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-6 h-6"
                                                      /> :
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
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className=''><h5>Métodos de pago aceptados</h5></Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className='flex flex-wrap mb-2 text-white'>
                                                {
                                                      teacherPaymentMethods?.length > 0 && teacherPaymentMethods.map((payment, i) => (
                                                            <div key={i} className='bg-gray-700 px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'  onClick={() => handlePaymentMethodModal(payment)}>{payment.name}</div>
                                                      )) 
                                                }
                                                {
                                                      teacherProfile.loading ? 
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-6 h-6"
                                                      /> :
                                                      <div className='bg-gray-400 px-2 py-1 mb-2 rounded-xl text-md flex align-items-center justify-content-center select-none' onClick={() => handlePaymentMethodsListModal()}
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
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className=''><h5>Métodos de enseñanza</h5></Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className='flex flex-wrap mb-2 text-white'>
                                                {
                                                      teacherStyles?.length > 0 && teacherStyles.map((style, i) => (
                                                            <div key={i} className='bg-gray-700 px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'  onClick={() => handleStyleModal(style)}>{style.name}</div>
                                                      )) 
                                                }
                                                {
                                                      teacherProfile.loading ? 
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-6 h-6"
                                                      /> :
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
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs={12} className=''><h5>Experiencia validada</h5></Col>
                                    </Row>
                                    <Row className='pl-2 pr-3'>
                                          <div style={{overflowX:"scroll", overflowY:"hidden"}}  className='flex align-items-center py-1 mb-2 text-white'>
                                          {
                                                teacherExperienceValidators?.length > 0 && teacherExperienceValidators.map((validator, i) => (
                                                      
                                                      <div key={i} style={{width:"10rem", minWidth:"10rem"}}  className={`${validator.approved == true ? 'bg-gray-700' : 'bg-gray-400'} p-3 rounded-xl mb-2 ml-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105`}  onClick={() => handleExperienceValidatorModal(validator)}>
                                                            <h6 className='' >
                                                                  {validator.subjects?.length} Cursos validados
                                                                        
                                                            </h6>
                                                            <p className='mb-0' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{validator.message}</p>
                                                            <p className='' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Horas validadas: {validator.hours_validated}</p>
                                                            <p className={`mb-0 ${validator.approved == true ? 'text-green-200' : validator.reason ?? "" !== "" ? 'text-red-600' : 'text-gray-200'}`}>
                                                                  {validator.approved == true ? 'Aprobado' : validator.reason ?? "" !== "" ? 'Rechazado' : 'Esperando aprobación'}
                                                            </p>
                                                      </div>
                                                      
                                                )) 
                                          }
                                          {
                                                      teacherProfile.loading ? 
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-6 h-6"
                                                      /> :
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
                                          
                                    </Row>
                                    <Row>

                                          <Col xs={12} className=''><h5>Horario de reservas y eventos</h5></Col>
                                    </Row>
      
                                    <Calendar userChildren={userChildren}/>
                                    
                                    <Row className='border-b mt-3'>
                                          <Col xs={12} className='flex'>
                                                <h5>Configuración de reservas</h5>
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Credenciales de pago</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                <h6>{teacherProfile.teacherProfile.payment_credentials}</h6>
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Precio por hora</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                <h6>{teacherProfile.teacherProfile.hourly_price} {teacherProfile.teacherProfile.coin?.short_name}</h6>
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Edad mínima de estudiante</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                <h6>{teacherProfile.teacherProfile.min_student_age} años</h6>
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Edad máxima de estudiante</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                <h6>{teacherProfile.teacherProfile.max_student_age} años</h6>
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Tiempo mínimo de anticipación de reserva</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                {formatDaysHoursMinutesSeconds({date_string:teacherProfile.teacherProfile.min_anticipation_time, dias:true})}
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Tiempo máximo de anticipación de reserva</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                {formatDaysHoursMinutesSeconds({date_string:teacherProfile.teacherProfile.max_anticipation_time, dias:true})}
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Intervalo de tiempo de reserva</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                {formatDaysHoursMinutesSeconds({date_string:teacherProfile.teacherProfile.time_interval, horas:true, minutos:true})}
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Tiempo de reserva mínimo</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                {formatDaysHoursMinutesSeconds({date_string:teacherProfile.teacherProfile.min_reservation_time, horas:true, minutos:true})}
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Tiempo de reserva máximo</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                {formatDaysHoursMinutesSeconds({date_string:teacherProfile.teacherProfile.max_reservation_time, horas:true, minutos:true})}
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Sesiones de prueba</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                <h6>{teacherProfile.teacherProfile.trial_sesions || 'No añadido'}</h6>
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Politica de reembolso</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                <h6>{teacherProfile.teacherProfile.refund_policy || 'No añadido'}</h6>
                                          </Col>
                                    </Row>
                                    <Row className='border-b mt-3'>
                                          <Col xs={6}>
                                                <h6>Horario flexible</h6>
                                          </Col>
                                          <Col xs={6} className='text-end'>
                                                <h6>{teacherProfile.teacherProfile.flexible_booking || 'No añadido'}</h6>
                                          </Col>
                                    </Row>

                                    <Row>
                                          <Col xs={12} className='flex mt-3'>
                                                <div className='bg-gray-400 ml-auto flex justify-content-center px-3 py-1 mb-2 rounded-xl text-md text-white select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleEditConfigurationModal()}
                                                >Editar configuración de reservas</div>
                                          </Col>
                                    </Row>

                                    
                                    <Row className='mt-4'>
                                          <Col xs={12}>
                                                <h5>Ubicación</h5>
                                          </Col>
                                          </Row>
                                    
                                    <Row>
                                          <Col xs={12} className=''><h5>Materiales publicados</h5></Col>
                                          </Row>
                                    <Row>
                                          <Col xs={12}>
                                                <h5>Estadísticas</h5>
                                                <p>horas enseñadas (reservas eventos y validadas)</p>
                                                <p>ganancia total</p>
                                                <p>calificación (reservas materiales)</p>
                                                <p>busquedas diarias</p>
                                                <p>clicks diarios</p>
                                                <p>deuda (reservas eventos ya pagada)</p>
                                          </Col>
                                    </Row>

                              </Card.Body>
                        </Card>
                  </Row>
                  
            </Container>
                  ) : (<div>xd</div>)
                  }
            </div>
      )
}

export default TeacherProfileScreen