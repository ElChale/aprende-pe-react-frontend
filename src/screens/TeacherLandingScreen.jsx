import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import { createTeacherProfile } from '../reducers/teacherReducers';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'
import { Navigate } from 'react-router-dom';

function TeacherLandingScreen({userInfo, teacherProfile, categories, universities, constants}) {
      const dispatch = useDispatch()
      const navigate = useNavigate()

      // SUBJECT
      const [subjects, setSubjects] = useState([])
      const [displayedSubject, setDisplayedSubject] = useState({})

      //TEACHER PROFILE
      const [resume, setResume] = useState('')
      const [hourlyPrice, setHourlyPrice] = useState(0)
      const [coin, setCoin] = useState(constants?.coin_types != undefined && constants?.coin_types?.length > 0 ? constants.coin_types[0]?.short_name : '')
      const [teacherError, setTeacherError] = useState('')

      //DIFERENTIALS AND QUESTIONS
      const [openDiferential, setOpenDiferential] = useState(null)
      const [openQuestion, setOpenQuestion] = useState(null)

      // MODALS

      // CATEGORY / SUBJECTS MODAL
      const [showCategoriesModal, setShowCategoriesModal] = useState(false)
      const [showSubjectModal, setShowSubjectModal] = useState(false)

      const [showUniversities, setShowUniversities] = useState(false)
      const [openUniversity, setOpenUniversity] = useState(null)
      const [openCategory, setOpenCategory] = useState(null)
      const [search, setSearch] = useState('');

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
            setSubjects(subjects => subjects?.some(item => item.id == subject.id) ? subjects : [...subjects, subject])
      }
      // delete subject 
      const handleDeleteSubject = (subject) => {
            setShowSubjectModal(false)
            setSubjects(subjects.filter(item => item.id != subject.id))
      }

      const handleCreateTeacherProfile = (e) => {
            e.preventDefault()
            if (userInfo.user) {
                  if (subjects.length > 0) {
                        setTeacherError('')
                        dispatch(createTeacherProfile({subjects:subjects.map(obj => obj.id).join(','), resume:resume, hourly_price:hourlyPrice, coin:constants.coin_types.find((obj) => obj.short_name == coin).id, token:userInfo?.token}))
                        .then((result) => {
                              if (result?.error?.message) {
                                    setTeacherError(result.error.message)
                              }
                              if (result.payload) {
                                    if (result.payload.error) {
                                          setTeacherError(result.payload.error)
                                    } else {
                                          navigate('/teacher-profile')
                                          setTeacherError('')
                                    }
                              } 
                        })
                  } else {
                        setTeacherError('Por favor seleccione al menos un curso')
                  }
            } else {
                  navigate('/user')
            }
            
      }

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      return (
            <div className='mb-20'>
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
                                          universities.universities !== undefined && universities.universities !== null ? universities?.universities?.map((university, i) => (
                                                university.name.toLowerCase().includes(search) && university.degrees !== undefined && university.degrees !== null && university.degrees?.length > 0 ? 
                                                <div key={i}>
                                                      <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenUniversity(university.id)}>
                                                            <h6>{university.name}</h6>
                                                            <img className={`w-3 h-3 transition-transform transform ${university.id == openUniversity ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                      </div>
                                                      <div className={`mt-3 transition-transform transform ${university.id == openUniversity ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                            {
                                                            university.id == openUniversity ? (
                                                                  university.degrees !== undefined && university.degrees !== null ? university?.degrees?.map((degree, j) => (
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
                                                                                                            <div key={k} style={{backgroundColor:ORANGE}} onClick={() => handleAddSubject(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                                            onMouseOver={(e) => e.target?.children[0]?.classList.add('spin-on-hover')}
                                                                                                            onMouseOut={(e) => e.target?.children[0]?.classList.remove('spin-on-hover')}
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
                                          categories.categories !== undefined && categories.categories !== null ? categories?.categories?.map((category,i) => (
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
                                                                                    <div key={j} style={{backgroundColor:BLUE}} onClick={() => handleAddSubject(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                   
                                                                                    onMouseOver={(e) => e.target?.children[0]?.classList.add('spin-on-hover')}
                                                                                    onMouseOut={(e) => e.target?.children[0]?.classList.remove('spin-on-hover')}
                                                                                    >
                                                                                          {subject.name}<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                                                                          style={{
                                                                                                transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                                                          }}
                                                                                          onLoad={(e) => e.target?.classList.add('spin-on-load')}
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
                              <Modal.Title>{displayedSubject.name}{displayedSubject.is_university_subject ? ` (${displayedSubject.category?.length > 0 && displayedSubject?.category?.map((category) => category.is_university_degree ? category?.university?.name : '').filter(Boolean).join(', ')})` : ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                             
                              <h6>Descripción</h6>
                              <p className='text-justify'>{displayedSubject.description}</p>
                              <h6 className='flex flex-wrap mt-1'><span className='mt-2 mr-2'>Categorias:</span>{displayedSubject.category != undefined && displayedSubject.category != null && displayedSubject.category.map((category, i) => <span key={i} className='mr-2 mt-2'>{category.name}</span>)} </h6>
                              <h6 className='flex flex-wrap mt-3'><span className='mr-2'
                              onLoad={(e) => e.target.children[0]?.classList.add('spin-on-load')}
                              onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                              onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                              >Cursos similares:</span>{displayedSubject.related_subjects != undefined && displayedSubject.related_subjects != null && displayedSubject?.related_subjects?.map((subject, i) => (subject.is_university_subject === displayedSubject.is_university_subject || displayedSubject.is_university_subject) ? <span key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} onClick={() => handleAddSubject(subject)} className='font-normal text-xs flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'>
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
            
            <div style={{
                  backgroundImage: 'url(https://aprende-pe-bucket-1.s3.amazonaws.com/static/dark_kid_banner.jpg)',
                  backgroundSize: 'cover', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'center', 
                  backgroundColor: '#f0f0f0', 
            }} >
                  <div className='flex bg-gray-800 bg-opacity-75'>
            <Container className=''>
                  <Row className='py-4 flex items-center' >
                        <Col md={6} className='mt-4'>
                              <img src='text_banner_profes_white.png'/>
                        </Col>
                        <Col md={6} className='mt-4'>
                              <div className='px-2'>
                                    {teacherProfile.teacherProfile !== undefined && userInfo.user !== null && Object.keys(teacherProfile.teacherProfile)?.length >= 3 ? (
                                          <div className='rounded-2xl bg-white p-4 my-48 flex flex-col items-center justify-center'>
                                                <h5 className='mb-4'>¡Felicidades! Ya creaste tu perfil, ahora</h5>
                                                <Button onClick={() => {navigate('/teacher-profile')}}>Activalo</Button>
                                          </div>
                                    ) :(

                                    
                                    <Form onSubmit={(e)=> {handleCreateTeacherProfile(e)}} className='rounded-2xl bg-white p-4 mb-5'>
                                          <span className='flex items-center mb-3'>
                                                {userInfo.user ? <>
                                                <img src={userInfo?.user?.profile_image} alt="Profile" className="w-10 h-10 rounded-full mr-3" />  
                                                <h6 className='m-0'><span className='text-blue-400'>Profesor@</span> {userInfo?.user?.first_name} {userInfo?.user?.last_name}</h6>
                                                </>: <h5 className=''>Regístrese como profesor</h5> 
                                                }
                                          </span>
                                          <hr></hr>
                                          <h6 className='text-orange-400'>Puedes editar esta información en cualquier momento, no será visible hasta que solicite que se active su perfil.</h6>
                                          <Form.Group controlId='presentation' className='mb-3' >
                                                <h6>Tu presentación</h6>
                                                <Form.Control
                                                      as="textarea" rows={3}
                                                      name='resume'
                                                      placeholder="Ingrese su presentación de profesor"
                                                      value={resume}
                                                      onChange={(e) => setResume(e.target?.value)}
                                                      className='border'
                                                      required
                                                />
                                          </Form.Group>
                                          <Form.Group controlId='subjects' className='mb-3' >
                                                <h6>Cursos que quieres enseñar</h6>
                                                <div className='flex flex-wrap text-white border rounded-2xl pt-2 pl-2'>
                                                      {
                                                            subjects?.length > 0 && subjects.map((subject, i) => (
                                                                  <div key={i} style={{backgroundColor:subject?.is_university_subject ? ORANGE : BLUE}} className='px-3 py-1 mb-2 rounded-xl mr-2  select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleSubjectModal(subject)}>{subject.name}</div>
                                                            )) 
                                                      }
                                                      <div className='bg-gray-400 px-2 py-1 rounded-xl text-md mb-2 flex align-items-center justify-content-center select-none' onClick={() => handleCategoriesModal()}
                                                      onMouseOver={(e) => e.target?.children[0]?.classList.add('spin-on-hover')}
                                                      onMouseOut={(e) => e.target?.children[0]?.classList.remove('spin-on-hover')}
                                                      >
                                                            Agregar<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                                            style={{
                                                                  transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                            }}
                                                            onLoad={(e) => e.target?.classList?.add('spin-on-load')}
                                                            />
                                                      </div>
                                                </div>
                                          </Form.Group >
                                          <Form.Group controlId='presentation' className='mb-3' >
                                                <h6>Precio por hora</h6>
                                                <Row>
                                                      <Col xs={6} md={8} className='flex pr-0'>
                                                            <Form.Control
                                                                  type='number'
                                                                  name='hourly_price'
                                                                  value={hourlyPrice}
                                                                  onChange={(e) => setHourlyPrice(e.target?.value)}
                                                                  className='h-12'
                                                                  style={{borderRadius: '4px 0 0 4px', borderTop: '1px solid #dee2e6', borderLeft: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6', borderRight: '0'}}
                                                                  required
                                                            />
                                                      </Col>
                                                      <Col xs={6} md={4} className='flex pl-0'>
                                                            <Dropdown className='w-full' onSelect={setCoin}>
                                                                  <Dropdown.Toggle id='coin_type' required  className='w-full h-12 bg-white d-flex justify-content-between align-items-center mx-0 border p-2' variant='light' style={{borderRadius: '0 4px 4px 0' }}>
                                                                        {coin}
                                                                  </Dropdown.Toggle>
                                                                  <Dropdown.Menu
                                                                        align="start"
                                                                        onChange={(e) => setCoin(e.target?.value)}
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
                                          <Form.Group controlId='submit' className='mb-3 pt-3' >
                                                <div className='flex flex-col items-center justify-center'>
                                                      {
                                                teacherProfile.loading == true ? (
                                                      <div className='flex align-items-center justify-content-center mb-4'>
                                                            <img
                                                                  src="/tail_blue_fast.svg"
                                                                  alt="Loading..."
                                                                  className="w-40 h-40"
                                                            />
                                                      </div>
                                                ) : (<>
                                                      <p>Usted podrá cambiar esta información en cualquier momento. Esta recién será visible al público cuando usted acive su perfil.</p>
                                                      <Button type='submit'>{userInfo.user ? 'Cree su perfil de profesor gratis' : 'Inicie sesión previamente'}</Button>
                                                      <p className='my-2 text-red-400'>{teacherError}</p></>
                                                )
                                                }
                                                </div>
                                          </Form.Group>

                                    </Form>
                                    )
                              }
                              </div>
                        </Col>
                  </Row>
            </Container>
            </div>
            </div>

            <Container >
                  <Row className='bg-gray-100 rounded-xl my-5'>
                        <Col md={6} >
                              <div className='p-4 flex flex-col h-full items-start justify-center text-start'>
                                    <h3 className='font-bold'>Lo que nos hace únicos</h3>
                                    <h6 className=''>Nos esforzamos por entender las necesidades de nuestros clientes</h6>
                              </div>
                         </Col>
                        <Col md={6} >
                              <div className='p-4'>
                                    <div className='border rounded-xl p-4'>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 1 ? setOpenDiferential(1) : setOpenDiferential(null)}}>
                                                <h5>Variedad de Opciones de Enseñanza</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 1 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 1 && <p className={`mt-3 transition-transform transform ${openDiferential == 1 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Los profesores pueden ampliar su alcance al seleccionar cursos regulares de diversas categorías o cursos universitarios de las principales instituciones educativas cercanas. Esta amplia oferta permite a los profesores diversificar sus habilidades y llegar a un público más amplio.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 2 ? setOpenDiferential(2) : setOpenDiferential(null)}}>
                                                <h5>Flexibilidad en la Fijación de Precios</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 2 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 2 && <p className={`mt-3 transition-transform transform ${openDiferential == 2 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Nuestra aplicación permite a los profesores establecer sus propios precios para los cursos que ofrecen. Esta flexibilidad brinda a los profesionales de la educación la autonomía para valorar su experiencia y conocimientos, adaptándose a sus objetivos financieros y al mercado.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 3 ? setOpenDiferential(3) : setOpenDiferential(null)}}>
                                                <h5>Gestión Eficiente del Tiempo</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 3 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 3 && <p className={`mt-3 transition-transform transform ${openDiferential == 3 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Los profesores pueden gestionar fácilmente su horario de disponibilidad a través de la aplicación, proporcionando una herramienta eficaz para optimizar su tiempo y garantizar una distribución equitativa entre las clases y otros compromisos personales o profesionales.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 4 ? setOpenDiferential(4) : setOpenDiferential(null)}}>
                                                <h5>Métodos de Pago Personalizados</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 4 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 4 && <p className={`mt-3 transition-transform transform ${openDiferential == 4 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Ofrecemos a los profesores la posibilidad de elegir su método de pago preferido, brindándoles comodidad y adaptabilidad. Ya sea mediante transferencias bancarias, plataformas de pago en línea o efectivo, nuestros profesores tienen la libertad de seleccionar la opción que mejor se ajuste a sus necesidades financieras.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 5 ? setOpenDiferential(5) : setOpenDiferential(null)}}>
                                                <h5>Interacción Segura con Alumnos</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 5 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 5 && <p className={`mt-3 transition-transform transform ${openDiferential == 5 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>La aplicación proporciona un entorno seguro para la comunicación entre profesores y alumnos. La función de chat integrada permite a los profesores establecer una conexión segura con los alumnos, fomentando la comunicación efectiva y la construcción de relaciones positivas.</p>}
                                         

                                    </div>
                              </div>
                        </Col>
                  </Row>
            </Container>
           
            <Container>
                  <Row className='pt-2'>
                        <Col>
                        <h2 className='font-bold flex justify-center'>Enseña en Aprende.Pe</h2>
                        <hr></hr>
                        </Col>
                  </Row>
                  <Row>
                        <Col md={6} className='order-2 order-md-1'>
                             <div className='p-4'>
                                    <img
                                          src={'https://aprende-pe-bucket-1.s3.amazonaws.com/static/teacher_step_1.jpg'}
                                          alt="Paso 1"
                                          className="w-full h-auto object-cover rounded-xl"
                                    />
                              </div>
                        </Col>
                        <Col md={6} className='order-1 order-md-2'>
                              <div className='p-4 flex flex-col h-full items-start justify-center text-justify '>
                                    <h4>Seleccione los cursos que desea impartir</h4>
                                    <p>En nuestro extenso catálogo, usted encontrará una variada selección de cursos entre los cuales puede elegir, permitiendo a los alumnos localizarlo de manera adecuada.</p>
                                    <p>Además, disponemos de <b>cursos universitarios</b>, que incluyen las materias impartidas en las principales universidades de su área. Esto posibilita que los estudiantes de dichos cursos puedan beneficiarse de sus servicios.</p>
                                    <p>Para validar su experiencia en la enseñanza de estos cursos, hemos implementado <b>validadores de experiencia</b>. Estos permiten que publique documentos en su perfil que respalden su experiencia docente en las áreas seleccionadas.</p>
                              </div>
                        </Col>
                  </Row>
                  <Row>
                        <Col md={6}>
                              <div className='p-4 flex flex-col h-full items-start justify-center text-justify'>
                                    <h4>Ingrese su horario de disponibilidad</h4>
                                    <p>Indique las horas en las que se encuentra disponible para impartir clases, así como las modalidades de enseñanza disponibles en cada franja horaria y el número máximo de reservas permitidas en cada sesión.</p>
                                    <p>Los usuarios podrán visualizar su horario y realizar reservas conforme a las horas indicadas por usted.</p>
                              </div>
                        </Col>
                        <Col md={6}>
                             <div className='p-4'>
                                    <img
                                          src={'https://aprende-pe-bucket-1.s3.amazonaws.com/static/teacher_step_2.jpg'}
                                          alt="Paso 2"
                                          className="w-full h-auto object-cover rounded-xl"
                                    />
                              </div>
                        </Col>
                        
                  </Row>
                  <Row>
                        <Col md={6} className='order-2 order-md-1'>
                             <div className='p-4'>
                                    <img
                                          src={'https://aprende-pe-bucket-1.s3.amazonaws.com/static/teacher_step_3.jpg'}
                                          alt="Paso 3"
                                          className="w-full h-auto object-cover rounded-xl"
                                    />
                              </div>
                        </Col>
                        <Col md={6} className='order-1 order-md-2'>
                              <div className='p-4 flex flex-col h-full items-start justify-center text-justify'>
                                    <h4>Active su perfil</h4>
                                    <p>Una vez haya completado la información de su perfil, puede proceder a su activación. Esto se logra poniéndose en contacto con uno de los asesores de Aprende.Pe y seleccionando uno de los planes disponibles.</p>
                                    <p>La activación es instantánea; una vez que nuestro asesor haya verificado su pago, su perfil de profesor estará automáticamente activo. De esta manera, cualquier usuario podrá encontrarlo en las búsquedas realizadas en nuestra plataforma.</p> 
                              </div>
                         </Col>
                  </Row>
            </Container>

            <Container>
                  <Row>
                        <Col>
                              <h2 className='font-bold flex justify-center mt-4'>Preguntas frecuentes</h2>
                              <hr></hr>
                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 1 ? setOpenQuestion(1) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué son los validadores de experiencia?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 1 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 1 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 1 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Los validadores de experiencia constituyen una herramienta fundamental para respaldar y validar su pericia en áreas específicas de enseñanza. Al utilizar este recurso, usted puede subir documentos que certifiquen su experiencia o conocimientos relacionados con cursos específicos. <br />Para completar este proceso, simplemente ingrese los cursos que desea validar, adjunte el archivo de imagen de validación y proporcione una breve justificación textual. Es importante destacar que puede elegir mantener la privacidad de estos documentos, ya que puede indicar si desea que sean públicos o no. <br /> Nuestro equipo en Aprende.Pe revisará y aprobará estos documentos una vez sean validados. Una vez aprobados, los usuarios podrán visualizarlos en su perfil de profesor, brindándole una constancia tangible de su competencia en los cursos que imparte.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 2 ? setOpenQuestion(2) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo establezco el método de pago?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 2 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 2 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 2 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>En su perfil de profesor, siempre tendrá la posibilidad de editar y configurar su método de pago preferido. Facilitamos dos formas de mostrar esta información: a través de un archivo de imagen y un cuadro de texto. <br/>Puede subir un código QR de plataformas como Yape o Plin, o ingresar detalles como números de cuenta bancaria u otros métodos de pago. Los usuarios podrán visualizar esta información al realizar una reserva y deberán adjuntar un comprobante de pago, el cual deberá validar que el estudiante ha realizado el pago a través del método que usted ha indicado.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 3 ? setOpenQuestion(3) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué sucede si un alumno no paga?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 3 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 3 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 3 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Una vez que un alumno realiza una reserva, puede revisar la información en su perfil de profesor y evaluar el comprobante de pago adjunto. En caso de detectar fraude o invalidez en el comprobante, tiene la opción de cancelar la reserva mediante el botón de edición. <br/>Es importante que incluya una justificación para la cancelación. Nuestro equipo en Aprende.Pe evaluará la situación y podrá tomar medidas, incluso la posibilidad de restringir al usuario en cuestión.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 4 ? setOpenQuestion(4) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo atiendo de forma efectiva a un alumno que compra una reserva?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 4 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 4 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 4 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Cuando un alumno compra una reserva según su disponibilidad de horarios, podrá visualizar la información en su perfil de profesor. Puede editar la reserva para agregar un comprobante de pago y/o una invitación textual que el alumno podrá leer para ponerse en contacto con usted. <br/>Además, tanto usted como el alumno pueden iniciar un chat privado y seguro en nuestro servicio de mensajes, donde podrán coordinar los detalles de los servicios que el alumno desea y cómo usted puede proporcionarlos de manera efectiva.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 5 ? setOpenQuestion(5) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo mejoro mi rating como profesor?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 5 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 5 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 5 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>La mejora de su calificación como profesor se logra a través de reservas válidas y el cumplimiento exitoso del tiempo reservado. Una vez concluida la reserva, el alumno puede agregar un comentario con una calificación y un mensaje de feedback. Las reservas válidas no solo contribuyen a su perfil con horas enseñadas, sino que también suman calificaciones, aumentando su visibilidad y posicionamiento en los resultados de búsqueda de nuestra plataforma.</p>}

                        </Col>
                  </Row>
            </Container>
            
            </div>
      )
}

export default TeacherLandingScreen