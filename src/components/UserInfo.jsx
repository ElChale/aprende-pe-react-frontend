import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userReducers';
import { Container, Row, Col, Form, Card, Dropdown, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { genderMapping, languageMapping } from '../utils';

function UserProfile( {userInfo, handleShowEditForm} ) {
      const dispatch = useDispatch()

      const [gender, setGender] = useState('')
      const [language, setLanguage] = useState('')
      const [phone_number_code, setPhoneNumberCode] = useState('')
      const [phone_number, setPhoneNumber] = useState('')

      useEffect(() => {
            const raw_phone_number = userInfo.user.phone_number
            const phone_number_code = raw_phone_number.substring(0, raw_phone_number.length - 9)
            const phone_number_main = raw_phone_number.slice(-9)
            setPhoneNumberCode(phone_number_code)
            setPhoneNumber(phone_number_main)
            const genderValue = genderMapping[userInfo.user.gender]
            setGender(genderValue)
            const languageValue = languageMapping[userInfo.user.language]
            setLanguage(languageValue)
      }, [userInfo])

      const handleLogout = (e) => {
            e.preventDefault();
           
            dispatch(logout({ token:userInfo.token }));
      };

      return (
            <Container fluid className="d-flex align-items-center justify-content-center">
                  <Card className="bg-light w-70 my-5" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4 ">
                              <Row>
                                    <Col xs={12} md={5} className="flex items-start justify-center pb-3 pb-md-0">
                                          <img
                                                src={userInfo.user.profile_image}
                                                alt="Profile"
                                                className="w-80 h-auto rounded-2xl border border-gray-600"
                                          />
                                    </Col>
                                    <Col xs={12} md={7} className="text-center mx-sm-3 mx-md-0">
                                          <div className="flex flex-col items-start justify-top h-full">
                                                <h2 className="text-2xl font-semibold my-4">
                                                      Tu Perfil
                                                </h2>
                                                
                                                <Form id="userProfileForm" disabled readOnly onSubmit={(e) => {e.preventDefault()}} className='flex flex-col items-start text-start  ' >
                                                      <Form.Group controlId="name" className='w-full '>
                                                            
                                                            <Row className='items-center mb-3'>
                                                                  <Col xs={6} className='items-center'> 
                                                                        <Form.Label>Nombre</Form.Label>
                                                                        <Form.Control
                                                                              type="first_name"
                                                                              value={userInfo.user.first_name}
                                                                              className='rounded'
                                                                              readOnly
                                                                        />
                                                                  </Col>
                                                                  <Col xs={6} >
                                                                        <Form.Label>Apellido</Form.Label>
                                                                        <Form.Control
                                                                              type="last_name"
                                                                              value={userInfo.user.last_name}
                                                                              className='rounded'
                                                                              readOnly
                                                                        />
                                                                  </Col>
                                                            </Row>
                                                      </Form.Group>

                                                      <Form.Group controlId="name" className='w-full '>
                                                            
                                                            <Row className='items-center mb-3'>
                                                                  <Col xs={6} className='items-center'> 
                                                                        <Form.Label>Género</Form.Label>
                                                                        <Form.Control
                                                                              type="first_name"
                                                                              value={gender}
                                                                              className='rounded'
                                                                              readOnly
                                                                        />
                                                                  </Col>
                                                                  <Col xs={6} >
                                                                        <Form.Label>Edad</Form.Label>
                                                                        <Form.Control
                                                                              type="last_name"
                                                                              value={userInfo.user.age}
                                                                              className='rounded'
                                                                              readOnly
                                                                        />
                                                                  </Col>
                                                            </Row>
                                                      </Form.Group>
                                                      
                                                      <Form.Group controlId="email" className='w-full'>
                                                            <Form.Label>Idioma Preferido</Form.Label>
                                                            <Form.Control
                                                                  type="email"
                                                                  value={language}
                                                                  className='rounded mb-3'
                                                                  readOnly
                                                            />
                                                      </Form.Group>
                                                      
                                                      <Form.Group controlId="phone_number" className='w-full'>
                                                            
                                                            <Form.Label>
                                                                  Número de Teléfono
                                                            </Form.Label>
                                                            <Row className='items-center mb-3'>
                                                                  <Col xs={3} className='pr-0'> 
                                                                        <Form.Control
                                                                              type="phone_number"
                                                                              value={phone_number_code}
                                                                              className='mx-0'
                                                                              readOnly
                                                                              style={{
                                                                                    borderRadius: '8px 0 0 8px', // Adjust the border-radius as needed
                                                                                    borderTop: '1px solid #ced4da',
                                                                                    borderLeft: '1px solid #ced4da',
                                                                                    borderBottom: '1px solid #ced4da',
                                                                                    borderRight: '0'
                                                                                  }}
                                                                        />
                                                                  </Col>
                                                                  <Col xs={9} className='pl-0'>
                                                                        <Form.Control
                                                                              type="phone_number"
                                                                              value={phone_number}
                                                                              className='mx-0'
                                                                              readOnly
                                                                              style={{
                                                                                    borderRadius: '0 8px 8px 0', // Adjust the border-radius as needed
                                                                                  }}
                                                                        />
                                                                  </Col>
                                                            </Row>
                                                      </Form.Group>

                                                      <Form.Group controlId="email" className='w-full'>
                                                            <Form.Label>
                                                                  Correo Electrónico
                                                            </Form.Label>
                                                            <Form.Control
                                                                  type="email"
                                                                  value={userInfo.user.email}
                                                                  className='rounded mb-3'
                                                                  readOnly
                                                            />
                                                      </Form.Group>

                                                      


                                                      

                                                      <div className="flex flex-wrap mt-2">
                                                            <button className="m-2 w-32 p-2 text-black border-2 rounded-xl bg-white  hover:text-gray-400" onClick={(e) => {e.preventDefault() ;handleShowEditForm(false)}} >
                                                                  Editar Perfil
                                                            </button>  
                                                            <button className="m-2 w-32 p-2 text-white bg-red-600 rounded-xl hover:bg-gray-400" onClick={handleLogout} >
                                                                  Cerrar Sesión
                                                            </button>
                                                                              
                                                      </div>
                                                </Form>
                              
                                          </div>
                                    </Col>
                              </Row>
                        </Card.Body>
                  </Card>
            </Container>
      )
}

export default UserProfile