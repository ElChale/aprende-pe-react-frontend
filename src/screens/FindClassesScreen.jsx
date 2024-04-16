import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { queryTeacherProfiles, queryRecentTeacherProfiles, selectTeacherProfile, fetchTeacherProfile } from '../reducers/queryReducers'
import { createChat, getUserChats } from '../reducers/chatReducers'
import Calendar from '../components/Calendar';
import TextBox from '../components/ui/TextBox';

import { useNavigate } from 'react-router-dom'



import { BASE_URL, BLUE, PINK, ORANGE, GREEN, orderMapping } from '../utils'
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

function FindClassesScreen({categories, querys, universities, userChats, userInfo, constants}) {
      const dispatch = useDispatch()
      const navigate = useNavigate()
      dayjs.extend(utc)
      dayjs.extend(timezone)

      // SUBJECT
      const [subjects, setSubjects] = useState([])
      const [displayedSubject, setDisplayedSubject] = useState({})

      // CLASS TYPES
      const [classTypes, setClassTypes] = useState([])
      const [displayedClassType, setDisplayedClassType] = useState({})

      // ORDERING
      const [filterByPrice, setFilterByPrice] = useState(false)
      const [minPrice, setMinPrice] = useState(0)
      const [maxPrice, setMaxPrice] = useState(100)
      const [priceOrder, setPriceOrder] = useState(0)
      const [showPriceModal, setShowPriceModal] = useState(false)

      const [filterByRating, setFilterByRating] = useState(false)
      const [minRating, setMinRating] = useState(0)
      const [maxRating, setMaxRating] = useState(5)
      const [ratingOrder, setRatingOrder] = useState(0)
      const [showRatingModal, setShowRatingModal] = useState(false)
      
      const [filterByHoursTeached, setFilterByHoursTeached] = useState(false)
      const [minHoursTeached, setMinHoursTeached] = useState(0)
      const [maxHoursTeached, setMaxHoursTeached] = useState(100000)
      const [hoursTeachedOrder, setHoursTeachedOrder] = useState(0)
      const [showHoursTeachedModal, setShowHoursTeachedModal] = useState(false)


      // SCHEDULE
      const currentDate = new Date();
      const isoStringInTimeZone = currentDate.toLocaleString('en-US', { timeZone: dayjs.tz.guess() })

      const [filterByDate, setFilterByDate] = useState(false)
      const [requestedDate, setRequestedDate] = useState(isoStringInTimeZone)
      const [requestedStartTime, setRequestedStartTime] = useState(isoStringInTimeZone)
      const [requestedEndTime, setRequestedEndTime] = useState(isoStringInTimeZone)
      const [showDateModal, setShowDateModal] = useState(false)

      // QUERYY
      const [teacherProfilesQuery, setTeacherProfilesQuery] = useState([])
      const [page, setPage] = useState(1)
      const [numPages, setNumPages] = useState(1)

      const [teacherError, setTeacherError] = useState('')

      


      // MODALS

      // CATEGORY / SUBJECTS MODAL
      const [showCategoriesModal, setShowCategoriesModal] = useState(false)
      const [showSubjectModal, setShowSubjectModal] = useState(false)

      const [showUniversities, setShowUniversities] = useState(false)
      const [openUniversity, setOpenUniversity] = useState(null)
      const [openCategory, setOpenCategory] = useState(null)
      const [search, setSearch] = useState('');

      // CLASS TYPES MODAL
      const [showClassTypesListModal, setShowClassTypesListModal] = useState(false)
      const [showClassTypeModal, setShowClassTypeModal] = useState(false)

      // CONTROL OF QUERY TYPE
      const [isInitial, setIsInitial] = useState(true)
      

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
      // add subject
      const handleAddSubject = (subject) => {
            setShowCategoriesModal(false)
            setShowSubjectModal(false)
            setSubjects(subjects => subjects.some(item => item.id == subject.id) ? subjects : [...subjects, subject])
      }
      // delete subject 
      const handleDeleteSubject = (subject) => {
            setShowSubjectModal(false)
            setSubjects(subjects.filter(item => item.id != subject.id))
      }

      // CLASS TYPES DETAILS MODAL
      // open/close class types modal
      const handleClassTypesListModal = () => {
            setShowClassTypesListModal(!showClassTypesListModal)
      }
      // open/close class type modal
      const handleClassTypeModal = (type) => {
            setDisplayedClassType(type)
            setShowClassTypeModal(!showClassTypeModal)
      }
      // add class types
      const handleAddClassType = (type) => {
            setShowClassTypesListModal(false)
            setShowClassTypeModal(false)
            setClassTypes(classTypes => classTypes.some(item => item.id == type.id) ? classTypes : [...classTypes, type])
      }
      // delete class types 
      const handleDeleteClassType = (type) => {
            setShowClassTypeModal(false)
            setClassTypes(classTypes.filter(item => item.id != type.id))
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
      

     

      // QUERY
      const handleQueryTeacherProfiles = () => {
            dispatch(queryTeacherProfiles({ subject_ids:subjects.map(item => item.id), price_order:priceOrder, rating_order:ratingOrder, hours_teached_order:hoursTeachedOrder, page:page }))
            setIsInitial(false)
      }
      const handlePageChange = (page) => {
            if(0 < page && page <= numPages) {
                  dispatch(queryTeacherProfiles({ subject_ids:subjects.map(item => item.id), price_order:priceOrder, rating_order:ratingOrder, hours_teached_order:hoursTeachedOrder, page:page }))
            }
      }


      const getPageNumbers = () => {
            const currentPage = page;
            const totalPages = numPages;
            const maxVisiblePages = 5;
        
            if (totalPages <= maxVisiblePages) {
              return Array.from({ length: totalPages }, (_, index) => index + 1);
            }
        
            const halfVisiblePages = Math.floor(maxVisiblePages / 2);
            const startPage = Math.max(currentPage - halfVisiblePages, 1);
            const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
        
            return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
      };

 
      useEffect(() => {
            setTeacherProfilesQuery(querys.teacherProfiles?.query ?? [])
            setPage(querys.teacherProfiles?.page ?? 1)
            setNumPages(querys.teacherProfiles?.numPages ?? 1)
      }, [querys] )

      useEffect(() => {
            window.scrollTo(0, 0)
            dispatch(queryRecentTeacherProfiles({ page:1 }))
      }, [])


      return (
            <Container>
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
                                                      <div className={`mt-3 transition-transform transform ${university.id == openUniversity ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
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
                                                                                                            <div key={k} style={{backgroundColor:ORANGE}} onClick={() => handleAddSubject(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
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
                                                      <div className={`flex flex-wrap mt-3 transition-transform transform ${category.id == openCategory ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                            {
                                                                  category.id == openCategory ? (
                                                                        category.subjects !== undefined && category.subjects !== null ? category.subjects.map((subject, j) => (
                                                                              !subject.is_university_subject ?
                                                                                    <div key={j} style={{backgroundColor:BLUE}} onClick={() => handleAddSubject(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                   
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
                              >Cursos similares:</span>{displayedSubject.related_subjects != undefined && displayedSubject.related_subjects != null && displayedSubject.related_subjects.map((subject, i) => (subject.is_university_subject === displayedSubject.is_university_subject || displayedSubject.is_university_subject) ? <span key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} onClick={() => handleAddSubject(subject)} className='font-normal text-xs flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'>
                                    {subject.name}<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                    style={{
                                          transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                    }}
                                    /></span> : null)} </h6>
                                  
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteSubject(displayedSubject)}>
                                    Eliminar
                              </Button>
                              <Button variant="secondary" onClick={() => handleSubjectModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                 

                  {/* CLASS TYPES LIST MODAL */}
                  <Modal className='text-xs' show={showClassTypesListModal} onHide={() => handleClassTypesListModal()} centered size="md">
                        <Modal.Header closeButton className='align-items-center'>
                              <Modal.Title className=''>Agregar tipo de clase</Modal.Title>
                              <span className='ml-auto mt-1 w-6 h-6 select-none' onClick={() => handleClassTypesListModal()}>
                                    <img src="/cross_thin_icon.png"
                                    style={{
                                          transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                    }}                                  
                                    onLoad={(e) => e.target.classList.add('spin-on-load')}
                                    onMouseOver={(e) => e.target.classList.add('spin-on-hover')}
                                    onMouseOut={(e) => e.target.classList.remove('spin-on-hover')}
                                    /></span>
                        </Modal.Header>
                        
                        <Modal.Body className='' style={{height:200, overflowY:'scroll', overflowX:'hidden'}}>
                              {  
                                    constants.class_types?.length > 0 && constants.class_types.map((type,i) => (
                                          <div key={i}>
                                                <div  className='flex justify-between align-items-center border-b p-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleAddClassType(type)}>
                                                      <h6>{type.short_name} - {type.name}</h6>
                                                </div>
                                          </div> 
                                    )) 
                                    
                              }                                  
                        </Modal.Body>
                  </Modal>
                  {/* CLASS TYPE DETAILS MODAL */}
                  <Modal className='text-xs' show={showClassTypeModal} onHide={() => handleClassTypeModal({})} centered size="sm">
                        <Modal.Header closeButton>
                              <Modal.Title>{displayedClassType.short_name} - {displayedClassType.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <p className='text-justify'>Se incluirán en tus resultados de busqueda los profesores que dicten clases en esta modalidad.</p>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" onClick={() => handleDeleteClassType(displayedClassType)}>
                                    Eliminar
                              </Button>
                              <Button variant="secondary" onClick={() => handleClassTypeModal({})}>
                                    Cerrar
                              </Button>
                        </Modal.Footer>
                  </Modal>
                  
                  {/* SELECT PRICE MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showPriceModal} onHide={() => {setShowPriceModal(false)}} centered size="md">
                        <Form onSubmit={(e) => {e.preventDefault()}}>
                              <Modal.Header>
                                    <Modal.Title>Filtro de precio por hora</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          {/*
                                          <Form.Group controlId="min_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Precio mínimo</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  type="number"
                                                                  name="hours_validated"
                                                                  placeholder="Ingrese su nombre"
                                                                  value={minPrice}
                                                                  onChange={(e) => setMinPrice(e.target.value)}
                                                                  className='rounded'
                                                                  style={{ border:'1px solid #c4c4c4'}}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId="max_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Precio máximo</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  type="number"
                                                                  name="hours_validated"
                                                                  placeholder="Ingrese su nombre"
                                                                  value={maxPrice}
                                                                  onChange={(e) => setMaxPrice(e.target.value)}
                                                                  className='rounded'
                                                                  style={{ border:'1px solid #c4c4c4'}}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                           */}
                                          <Form.Group controlId="max_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Orden deseado</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Dropdown className='w-full' onSelect={(value) => {setPriceOrder(value)}}>
                                                                  <Dropdown.Toggle id='coin_type'  className='w-full  bg-white d-flex justify-content-between align-items-center mx-0 p-1.5' variant='light' style={{ border:'1px solid #c4c4c4'}} >
                                                                        {orderMapping[priceOrder]}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu
                                                                        align="start"
                                                                        onChange={(e, value) => {setPriceOrder(value)}}
                                                                        style={{maxHeight: '300px', overflowY: 'auto'}}
                                                                        popperConfig={{modifiers: [{name: 'offset', options: {offset: [0, -150]} }] }}>
                                                                        <Dropdown.Header>Ordenar por precio</Dropdown.Header>
                                                                        {Object.entries(orderMapping)?.map(([key, value], i) => (
                                                                              <Dropdown.Item key={i} eventKey={key}>
                                                                                    {value}
                                                                              </Dropdown.Item>
                                                                        ))}
                                                                  </Dropdown.Menu>
                                                            </Dropdown>       
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='check' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Activar filtro</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <div className='w-16 p-0.5' style={{border:'1px solid #c4c4c4', borderRadius:'20px'}} onClick={() => {setFilterByPrice(!filterByPrice)}}>
                                                                  <div className={`rounded-full h-6 w-6  transition-transform-translate duration-500 ease-in-out ${filterByPrice ? 'bg-green-600 translate-x-8' : 'bg-gray-400'} `}></div>
                                                            </div>
                                                      </Col>
                                                </Row>     
                                          </Form.Group>       

                              </Modal.Body>
                             
                        </Form>
                  </Modal>
                  {/* SELECT RATING MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showRatingModal} onHide={() => {setShowRatingModal(false)}} centered size="md">
                        <Form onSubmit={(e) => {e.preventDefault()}}>
                              <Modal.Header>
                                    <Modal.Title>Filtro de rating</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          {/*
                                          <Form.Group controlId="min_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Rating mínimo</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  type="number"
                                                                  name="hours_validated"
                                                                  placeholder="Ingrese su nombre"
                                                                  value={minRating}
                                                                  onChange={(e) => setMinRating(e.target.value)}
                                                                  className='rounded'
                                                                  style={{ border:'1px solid #c4c4c4'}}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId="max_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Rating máximo</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  type="number"
                                                                  name="hours_validated"
                                                                  placeholder="Ingrese su nombre"
                                                                  value={maxRating}
                                                                  onChange={(e) => setMaxRating(e.target.value)}
                                                                  className='rounded'
                                                                  style={{ border:'1px solid #c4c4c4'}}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                           */}
                                          <Form.Group controlId="max_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Orden deseado</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Dropdown className='w-full' onSelect={(value) => {setRatingOrder(value)}}>
                                                                  <Dropdown.Toggle id='coin_type'  className='w-full  bg-white d-flex justify-content-between align-items-center mx-0 p-1.5' variant='light' style={{ border:'1px solid #c4c4c4'}} >
                                                                        {orderMapping[ratingOrder]}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu
                                                                        align="start"
                                                                        onChange={(e, value) => {setRatingOrder(value)}}
                                                                        style={{maxHeight: '300px', overflowY: 'auto'}}
                                                                        popperConfig={{modifiers: [{name: 'offset', options: {offset: [0, -150]} }] }}>
                                                                        <Dropdown.Header>Ordenar por rating</Dropdown.Header>
                                                                        {Object.entries(orderMapping)?.map(([key, value], i) => (
                                                                              <Dropdown.Item key={i} eventKey={key}>
                                                                                    {value}
                                                                              </Dropdown.Item>
                                                                        ))}
                                                                  </Dropdown.Menu>
                                                            </Dropdown>       
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='check' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Activar filtro</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <div className='w-16 p-0.5' style={{border:'1px solid #c4c4c4', borderRadius:'20px'}} onClick={() => {setFilterByRating(!filterByRating)}}>
                                                                  <div className={`rounded-full h-6 w-6  transition-transform-translate duration-500 ease-in-out ${filterByRating ? 'bg-green-600 translate-x-8' : 'bg-gray-400'} `}></div>
                                                            </div>
                                                      </Col>
                                                </Row>     
                                          </Form.Group>       

                              </Modal.Body>
                             
                        </Form>
                  </Modal>
                  {/* SELECT HOURS MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showHoursTeachedModal} onHide={() => {setShowHoursTeachedModal(false)}} centered size="md">
                        <Form onSubmit={(e) => {e.preventDefault()}}>
                              <Modal.Header>
                                    <Modal.Title>Filtro de horas enseñadas</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          {/*
                                          <Form.Group controlId="min_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Horas enseñadas mínimas</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  type="number"
                                                                  name="hours_validated"
                                                                  placeholder="Ingrese su nombre"
                                                                  value={minHoursTeached}
                                                                  onChange={(e) => setMinHoursTeached(e.target.value)}
                                                                  className='rounded'
                                                                  style={{ border:'1px solid #c4c4c4'}}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId="max_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Horas enseñadas máximas</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Form.Control
                                                                  type="number"
                                                                  name="hours_validated"
                                                                  placeholder="Ingrese su nombre"
                                                                  value={maxHoursTeached}
                                                                  onChange={(e) => setMaxHoursTeached(e.target.value)}
                                                                  className='rounded'
                                                                  style={{ border:'1px solid #c4c4c4'}}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                           */}
                                          <Form.Group controlId="max_hours_teached" className='w-full mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Orden deseado</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <Dropdown className='w-full' onSelect={(value) => {setHoursTeachedOrder(value)}}>
                                                                  <Dropdown.Toggle id='coin_type'  className='w-full  bg-white d-flex justify-content-between align-items-center mx-0 p-1.5' variant='light' style={{ border:'1px solid #c4c4c4'}} >
                                                                        {orderMapping[hoursTeachedOrder]}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu
                                                                        align="start"
                                                                        onChange={(e, value) => {setHoursTeachedOrder(value)}}
                                                                        style={{maxHeight: '300px', overflowY: 'auto'}}
                                                                        popperConfig={{modifiers: [{name: 'offset', options: {offset: [0, -150]} }] }}>
                                                                        <Dropdown.Header>Ordenar por horas enseñadas</Dropdown.Header>
                                                                        {Object.entries(orderMapping)?.map(([key, value], i) => (
                                                                              <Dropdown.Item key={i} eventKey={key}>
                                                                                    {value}
                                                                              </Dropdown.Item>
                                                                        ))}
                                                                  </Dropdown.Menu>
                                                            </Dropdown>       
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          <Form.Group controlId='check' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Activar filtro</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <div className='w-16 p-0.5' style={{border:'1px solid #c4c4c4', borderRadius:'20px'}} onClick={() => {setFilterByHoursTeached(!filterByHoursTeached)}}>
                                                                  <div className={`rounded-full h-6 w-6  transition-transform-translate duration-500 ease-in-out ${filterByHoursTeached ? 'bg-green-600 translate-x-8' : 'bg-gray-400'} `}></div>
                                                            </div>
                                                      </Col>
                                                </Row>     
                                          </Form.Group>       

                              </Modal.Body>
                             
                        </Form>
                  </Modal>
                  {/* SELECT TIME MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showDateModal} onHide={() => {setShowDateModal(false)}} centered size="md">
                        <Form onSubmit={(e) => {e.preventDefault()}}>
                              <Modal.Header>
                                    <Modal.Title>Filtro de rango de fechas</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          <Form.Group controlId='start_time' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Fecha de inicio</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <DateTimePicker 
                                                                  id='start_time'
                                                                  name='start_time'
                                                                  value={dayjs(requestedStartTime)}
                                                                  required
                                                                  onChange={(value) => setRequestedStartTime(value.format('M/D/YYYY, H:m:s'))} //A
                                                                  slotProps={{ 
                                                                        textField: { size: 'small', color:'info' },
                                                                   }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>

                                          <Form.Group controlId='end_time' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Fecha de fin</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <DateTimePicker 
                                                                  id='end_time'
                                                                  name='end_time'
                                                                  value={dayjs(requestedEndTime)}
                                                                  required
                                                                  onChange={(value) => setRequestedEndTime(value.format('M/D/YYYY, H:m:s'))} //A
                                                                  slotProps={{ 
                                                                        textField: { size: 'small', color:'info' },
                                                                   }}
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>  
                                          <Form.Group controlId='check' className='mb-3'>
                                                <Row>
                                                      <Col xs={4} md={6}>
                                                            <Form.Label><h6>Activar filtro</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={8} md={6}>
                                                            <div className='w-16 p-0.5' style={{border:'1px solid #c4c4c4', borderRadius:'20px'}} onClick={() => {setFilterByDate(!filterByDate)}}>
                                                                  <div className={`rounded-full h-6 w-6  transition-transform-translate duration-500 ease-in-out ${filterByDate ? 'bg-green-600 translate-x-8' : 'bg-gray-400'} `}></div>
                                                            </div>
                                                      </Col>
                                                </Row>     
                                          </Form.Group>                
                              </Modal.Body>
                             
                        </Form>
                  </Modal>

                

                  

                 
                  <Row className='pt-4'>
                        
                        <Col>
                              <h6 className=''>Seleccionar cursos</h6>
                              <div className='flex flex-wrap text-white border rounded-2xl pt-2 pl-2'>
                                    {
                                          subjects?.length > 0 && subjects.map((subject, i) => (
                                                <div key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} className='px-3 py-1 mb-2 rounded-xl mr-2  select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleSubjectModal(subject)}>{subject.name}</div>
                                          )) 
                                    }
                                    <div className='bg-gray-400 px-2 py-1 rounded-xl text-md mb-2 flex align-items-center justify-content-center select-none' onClick={() => handleCategoriesModal()}
                                    onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                    onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                    >
                                          {subjects?.length > 0 ? "Agregar" : "Seleccionar cursos"}<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                          style={{
                                                transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                          }}
                                          onLoad={(e) => e.target.classList.add('spin-on-load')}
                                          />
                                    </div>
                              </div>
                              {/*
                                    <h6 className='mt-3'>Modalidades</h6>
                                    <div className='flex flex-wrap text-white border rounded-2xl pt-2 pl-2'>
                                          {
                                                classTypes?.length > 0 && classTypes.map((type, i) => (
                                                      <div key={i} className='bg-gray-700 px-3 py-1 mb-2 rounded-xl mr-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'  onClick={() => handleClassTypeModal(type)}>{type.name}</div>
                                                )) 
                                          }
                                          <div className='bg-gray-400 px-2 py-1 rounded-xl text-md mb-2 flex align-items-center justify-content-center select-none' onClick={() => handleClassTypesListModal()}
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
                                    </div>  
                               */}                            
                        </Col>
                  </Row>
                  <Row>
                         <Col sm={6} md={4} className='pt-3'>
                              <h6>Precio por hora</h6>
                              <div className='border rounded-2xl  py-2 px-3 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => {setShowPriceModal(true)}}  >
                                    { filterByPrice ? 
                                          `${orderMapping[priceOrder]}`
                                          : "Agregar filtro"
                                    }
                              </div>

                        </Col>
                        <Col sm={6} md={4} className='pt-3'>
                              <h6>Rating</h6>
                              <div className='border rounded-2xl  py-2 px-3 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => {setShowRatingModal(true)}}  >
                                    { filterByRating ? 
                                          `${orderMapping[ratingOrder]}`
                                          : "Agregar filtro"
                                    }
                              </div>

                        </Col>
                        <Col sm={6} md={4} className='pt-3'>
                              <h6>Horas enseñadas</h6>
                              <div className='border rounded-2xl  py-2 px-3 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => {setShowHoursTeachedModal(true)}}  >
                                    { filterByHoursTeached ? 
                                          `${orderMapping[hoursTeachedOrder]}`
                                          : "Agregar filtro"
                                    }
                              </div>

                        </Col>
                        {/*
                              <Col sm={6} md={3} className='pt-3'>
                                    <h6>Fecha</h6>
                                    <div className='border rounded-2xl  py-2 px-3 select-none' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => {setShowDateModal(true)}}  >
                                          { filterByDate ? 
                                                `${requestedStartTime} - ${requestedEndTime} `
                                                : "Escoger fecha"
                                          }
                                    </div>

                              </Col>
                         */}
                  </Row>
                  <Row>
                        <Col sm={{span:6, offset:6}} md={{span:4, offset:8}} className='pt-3'>
                              <div onClick={() => {handleQueryTeacherProfiles()}} style={{backgroundColor:BLUE}}  className='px-3 py-2 rounded-2xl self-center text-white shadow-none hover:shadow-lg scale-100 hover:scale-105'>
                                    Buscar Clases
                              </div>
                        </Col>
                  </Row>

                  <hr></hr>
                  {isInitial &&
                        <Row>
                              <Col className='flex flex-col items-center my-5'>
                                    <h4>Profesores nuevos</h4>
                                    
                              </Col>
                        </Row>
                  }
                  <Row>
                        { !querys.loading ?
                              teacherProfilesQuery?.map((teacher, i) => (
                                    <Col key={i} sm={6} md={4} className='mb-4'>
                                          <Card onClick={() => handleToTeacherPage(teacher)} className='border p-1 shadow-none hover:shadow-lg scale-100 hover:scale-105' style={{borderRadius:'20px'}}>
                                                <Card.Body>
                                                      <span className='flex align-items-center mb-3'>
                                                            <img src={teacher?.user?.profile_image} className='w-12 h-12 border rounded-full' />
                                                            <h6 className='my-0 mx-3 w-2/5' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacher.user?.first_name} {teacher.user?.last_name}</h6>
                                                            <h5 className='my-0 ml-auto'>{teacher.hourly_price} {teacher.coin?.short_name}</h5>
                                                      </span >
                                                   
                                                      <TextBox content={teacher.resume !== '' ? teacher.resume : 'Este profesor no actualizó su presentación'} short={true}/>

                                                      <div className='flex mt-10'>
                                                            {Array.from({length:Math.ceil(teacher.average_rating)}, (_, i) => (
                                                                        <div key={i}><img src='/star_filled_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                                            ))}
                                                            {Array.from({length:Math.floor(5-teacher.average_rating)}, (_, i) => (
                                                                        <div key={i}><img src='/star_empty_icon.png' className='w-5 h-5 mr-0.5'/></div>
                                                            ))}
                                                            <h6 className='mx-3 overflow-x-hidden whitespace-nowrap'>{teacher.hours_teached_reservations} horas enseñadas</h6>
                                                      </div>                                               
                                                </Card.Body>
                                          </Card>
                                    </Col>
                              ))
                        :
                        <Col>
                              <div className='flex flex-col items-center justify-center'>
                                    <img
                                    src="/tail_blue_fast.svg"
                                    alt="Loading..."
                                    className="w-48 h-auto "
                                    />
                              </div>
                        </Col>
                        }
                  </Row>
                  {
                        teacherError !== '' && <Row><Col className='flex flex-col items-center text-red-400'>{teacherError}</Col></Row>
                  }
                  {teacherProfilesQuery?.length < 9 && 
                        <Row>
                              <Col className='flex flex-col items-center my-5'>
                                    <h4>Parece que aun no hay muchos profesores que enseñan estos cursos</h4>
                                    <Button className='my-3' onClick={() => {navigate('/teacher-profile')}}>Regístrate para ser profesor</Button>
                                    <Button onClick={() => handleCategoriesModal()}>Seleccionar otros cursos</Button>
                              </Col>
                        </Row>
                  }
                  {!isInitial &&
                        <Row>
                              <Col className='flex justify-center items-center mb-5'>
                                    <div className='w-fit flex items-center justify-center py-2 px-3 border rounded-xl'>
                                          <img onClick={() => {handlePageChange(page-1)}} className={`w-3 h-3 ${page == 1 ? 'opacity-25' : 'scale-100 hover:scale-105'}`} src='/back_icon.png'/>
                                          {getPageNumbers().map((pageNumber) => (
                                                <span
                                                      key={pageNumber}
                                                      className={`mx-2  ${pageNumber === page ? 'text-black' : 'text-gray-400'}`}
                                                      onClick={() => handlePageChange(pageNumber)}
                                                >
                                                      {pageNumber}
                                                </span>
                                          ))}
                                          <img onClick={() => {handlePageChange(page+1)}} className='w-3 h-3 scale-100 hover:scale-105' src='/forward_icon.png'/>
                                    </div>
                              </Col>
                        </Row>
                  }
                  
                 
            </Container>
      )
}

export default FindClassesScreen