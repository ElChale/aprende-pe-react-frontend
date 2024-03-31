import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, getReservations } from '../reducers/userReducers';
import { getTeacherProfile } from '../reducers/teacherReducers';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';


function UserLogin({ userInfo, handleShowLogin }) {
      const dispatch = useDispatch();

      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')

      const [loginError, setLoginError] = useState('')

      const handleLogin = (e) => {
            e.preventDefault();

            dispatch(login({ email, password, token:userInfo.token, expiry:userInfo.expiry }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload.error) {
                              setLoginError(result.payload.error)
                        } else {
                              dispatch(getReservations({ page:1, token:result.payload.token }))
                              dispatch(getTeacherProfile({ token:result.payload.token }))
                              setEmail('')
                              setPassword('')
                              setLoginError('')
                        }
                    
                  } else {
                        setLoginError(result.error.message)
                        
                  }
            })
      };

      return (
            <Container>
                  <Row className="justify-content-center py-20">
                        <Col xs={12} sm={8} md={6}>
                              <Card className='py-3'  style={{ borderRadius: '15px' }}>
                                    <Card.Body className='flex flex-col items-center mx-sm-5' >
                                          <h5 className="text-center mb-4">Iniciar Sesión</h5>
                                          <Form onSubmit={handleLogin} className='flex flex-col items-center w-3/4 ' >
                                                <Form.Group controlId="email" className='w-full'>
                                                      <Form.Label>Correo Electrónico</Form.Label>
                                                      <Form.Control
                                                            type="email"
                                                            placeholder="Ingrese su correo electrónico"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            className='rounded mb-3'
                                                            style={{ fontSize: '.75rem' }}
                                                      />
                                                </Form.Group>

                                                <Form.Group controlId="password" className='w-full'>
                                                      <Form.Label>Contraseña</Form.Label>
                                                      <Form.Control
                                                            type="password"
                                                            placeholder="Ingrese su contraseña"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            className='rounded mb-3'
                                                            style={{ fontSize: '.75rem' }}
                                                      
                                                      />
                                                </Form.Group>
                                                {
                                                      userInfo.loading == true ? (
                                                            <img
                                                                  src="/tail_blue_fast.svg"
                                                                  alt="Loading..."
                                                                  className="max-h-32 "
                                                            />
                                                      ) : (
                                                            <button type="submit" className="m-2 w-32 p-2 text-white bg-green-600 rounded-xl hover:bg-gray-400">
                                                                  Iniciar Sesión
                                                            </button>
                                                      )
                                                }
                                                
                                                
                                          </Form>
                                          {
                                                loginError !== '' ? (
                                                      <p className='text-red-400'>{loginError}</p>
                                                ) : (null)
                                          }
                                          <p>¿No tienes cuenta? <button className='text-blue-400 mt-2 hover:text-black' onClick={handleShowLogin}>Regístrarse</button></p>
                                    </Card.Body>
                              </Card>
                        </Col>
                  </Row>
            </Container>
      )
}

export default UserLogin