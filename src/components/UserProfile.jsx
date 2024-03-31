import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, getReservations, logout } from '../reducers/userReducers';
import { Container, Row, Col, Form, Card, Dropdown, Badge, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { genderMapping, languageMapping } from '../utils';
import { resetUserChats } from '../reducers/chatReducers'
import { resetTeacherProfile } from '../reducers/teacherReducers';

import { CONTACT_PHONE, CONTACT_EMAIL } from '../utils'

function UserProfile( {userInfo, teacherProfile, userChildren, handleShowEditForm} ) {
      const dispatch = useDispatch()

      const [gender, setGender] = useState('')
      const [phone_number_code, setPhoneNumberCode] = useState('')
      const [phone_number, setPhoneNumber] = useState('')

      useEffect(() => {
            if(userInfo.user && userInfo.user.phone_number) {
                  const raw_phone_number = userInfo.user.phone_number
                  const phone_number_code = raw_phone_number.substring(0, raw_phone_number.length - 9)
                  const phone_number_main = raw_phone_number.slice(-9)
                  setPhoneNumberCode(phone_number_code)
                  setPhoneNumber(phone_number_main)
                  const genderValue = genderMapping[userInfo.user.gender]
                  setGender(genderValue)
            }
            
      }, [userInfo])

      const handleRefresh = (e) => {
            e.preventDefault();

            dispatch(login({ email:"", password:"", token:userInfo.token, expiry:userInfo.expiry }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload.error) {
                              setLoginError(result.payload.error)
                        } else {
                              dispatch(getReservations({ page:1, token:result.payload.token }))
                        }
                  } else {
                        setLoginError(result.error.message)
                  }
            })
            
      };


      const handleLogout = (e) => {
            e.preventDefault();
           
            dispatch(logout({ token:userInfo.token }))
            dispatch(resetUserChats())
            dispatch(resetTeacherProfile());
      };

      return (
            <Container  className=" ">
                  <Row className='pt-5'>
                        <Col xs={12} md={5} className="flex items-start justify-center pb-3 pb-md-0">
                              <div className='bg-gray-100 w-full h-full flex items-start justify-center py-3'>
                              <img src={userInfo.user.profile_image} alt="Imagen de Perfil" className="w-80 h-auto rounded-2xl border border-gray-600"/>
                              </div>
                        </Col>
                        
                        <Col xs={12} md={7} className="text-center mx-sm-3 mx-md-0">
                              <div className="flex flex-col  items-start justify-top h-full">
                                    <h5 className="font-semibold flex align-items-center">
                                          Tu Perfil
                                          {
                                                userInfo.loading == true ? (
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-6 h-auto ml-2"
                                                      />
                                                ) : (
                                                      <button onClick={(e) => {handleRefresh(e)}} className='ml-2'>
                                                            <img
                                                                  src="/reload_icon.png"
                                                                  alt="Reload"
                                                                  className="w-4 h-auto"
                                                            />
                                                      </button>
                                                )
                                          }
                                    </h5>
                                    
                                    <Form id="userProfileForm" disabled readOnly onSubmit={(e) => {e.preventDefault()}} className='flex flex-col w-full items-start text-start mb-5 ' >
                                          <Form.Group controlId="name" className='w-full '>
                                                
                                                <Row className='items-center mb-3'>
                                                      <Col xs={6} className='items-center'> 
                                                            <Form.Label>Nombre</Form.Label>
                                                            <Form.Control type="first_name" style={{ fontSize: '.75rem' }} value={userInfo.loading == true ? (""):(userInfo.user.first_name)} className='rounded' readOnly/>
                                                      </Col>
                                                      <Col xs={6} >
                                                            <Form.Label>Apellido</Form.Label>
                                                            <Form.Control type="last_name" style={{ fontSize: '.75rem' }} value={userInfo.loading == true ? (""):(userInfo.user.last_name)} className='rounded' readOnly/>
                                                      </Col>
                                                </Row>
                                          </Form.Group>

                                          <Form.Group controlId="name" className='w-full '>
                                                
                                                <Row className='items-center mb-3'>
                                                      <Col xs={6} className='items-center'> 
                                                            <Form.Label>Género</Form.Label>
                                                            <Form.Control type="gender" style={{ fontSize: '.75rem' }} value={userInfo.loading == true ? (""):(gender || " ")} className='rounded' readOnly/>
                                                      </Col>
                                                      <Col xs={6} >
                                                            <Form.Label>Edad</Form.Label>
                                                            <Form.Control type="age" style={{ fontSize: '.75rem' }} value={userInfo.loading == true ? (""):(userInfo.user.age || " ")} className='rounded' readOnly/>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                          
                                          <Form.Group controlId="email" className='w-full'>
                                                <Form.Label>Idioma Preferido</Form.Label>
                                                <Form.Control type="email" style={{ fontSize: '.75rem' }} value={userInfo.loading == true ? (" "):(userInfo.user.language ? userInfo.user.language.name : " ")} className='rounded mb-3' readOnly/>
                                          </Form.Group>
                                          
                                          <Form.Group controlId="phone_number" className='w-full'>
                                                
                                                <Form.Label>Número de Teléfono</Form.Label>
                                                <Row className='items-center mb-3'>
                                                      <Col xs={3} className='pr-0'> 
                                                            <Form.Control type="phone_number" value={userInfo.loading == true ? (""):(phone_number_code)} className='mx-0' readOnly style={{borderRadius: '4px 0 0 4px', borderTop: '1px solid #ced4da', borderLeft: '1px solid #ced4da', borderBottom: '1px solid #ced4da', borderRight: '0', fontSize: '.75rem' }}/>
                                                      </Col>
                                                      <Col xs={9} className='pl-0'>
                                                            <Form.Control type="phone_number" value={userInfo.loading == true ? (""):(phone_number)} className='mx-0' readOnly style={{borderRadius: '0 4px 4px 0', fontSize: '.75rem'}}/>
                                                      </Col> 
                                                </Row>
                                          </Form.Group>

                                          <Form.Group controlId="email" className='w-full'>
                                                <Form.Label>
                                                      Correo Electrónico{`${userInfo.user.email_confirmed}` === "true" ? (<Badge bg="success" className="text-white ml-2">Verificado</Badge>) : (<OverlayTrigger key="bottom" placement="bottom" overlay={<Tooltip id="tooltip-bottom">Ingrese a su correo electrónico y haga click en el link de verificación. Si no le ha llegado el link escribir a nuestro equipo al {CONTACT_PHONE} o a nuestro correo electrónico {CONTACT_EMAIL}.</Tooltip>}><Badge bg="danger" className="text-white ml-2">No Verificado</Badge></OverlayTrigger>)} 
                                                </Form.Label>
                                                <Form.Control type="email" style={{ fontSize: '.75rem' }} value={userInfo.loading == true ? (""):(userInfo.user.email)} className='rounded mb-3' readOnly/>
                                          </Form.Group>

                                    
                                          <Button variant="link" className="px-0" style={{"color":"black", fontSize: '.75rem'}} onClick={(e) => {e.preventDefault() ;handleShowEditForm(false)}}>Editar Perfil</Button>
                                          <Button variant="link" className='px-0' style={{"color":"red", fontSize: '.75rem'}} onClick={handleLogout}>Cerrar Sesión</Button>
                                    </Form>
                  
                              </div>
                        </Col>
                  </Row>
                  
                {/* ADD ROWS HERE */}
                           
                  
            </Container>
      )
}

export default UserProfile