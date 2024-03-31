import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { login, signup } from '../reducers/userReducers';
import { Container, Row, Col, Form, Card, Dropdown } from 'react-bootstrap';

import { countryCodes, genderMapping, languageMapping } from '../utils'

function UserSignup({ userInfo, handleShowLogin, constants }) {
      const dispatch = useDispatch();
      const navigate = useNavigate()

      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      
      const [first_name, setFirstName] = useState('')
      const [last_name, setLastName] = useState('')
      const [age, setAge] = useState('')

      const [gender, setGender] = useState('')
      const [language, setLanguage] = useState('')
      const [phone_number_code, setPhoneNumberCode] = useState(countryCodes[1]?.code)
      const [phone_number, setPhoneNumber] = useState('')
      const [repeat_password, setRepeatPassword] = useState('')

      const [signupError, setSignupError] = useState('')

      const handleSignup = (e) => {
            e.preventDefault();
       
            if(password === repeat_password) {
                  let phone_number_complete = phone_number_code+phone_number
                  //let language_id = constants.languages.find(item => item.name == language).id || null
                  dispatch(signup({ first_name:first_name, last_name:last_name, email:email, phone_number:phone_number_complete, password:password }))
                  .then((result) => {
                        if (result.payload) {
                              dispatch(login({ email, password, token:null, expiry:null }))
                              .then((result) => {
                                    setFirstName('')
                                    setLastName('')
                                    setEmail('')
                                    setPhoneNumberCode('')
                                    setPhoneNumber('')
                                    setGender('')
                                    setPassword('')
                                    setRepeatPassword('')
                                    setSignupError('')
                              })
                        } else {
                              setSignupError(result.error.message)
                        }
                  })
            } else {
                  setSignupError('Las contraseñas no coinciden')
            }
         
      };

      const handleCountryCodeChange = (selectedCode) => {
            setPhoneNumberCode(selectedCode);
      };

      const handleGenderChange = (selectedGender) => {
            setGender(selectedGender);
      };

      const handleLanguageChange = (selectedLanguage) => {
            setLanguage(selectedLanguage);
      };




      return (
            <Container>
                  <Row className="justify-content-center py-20 ">
                        <Col xs={12} sm={8} md={6} className=''>
                              <Card className='py-3' style={{ borderRadius: '15px' }}>
                                    <Card.Body className='flex flex-col items-center  ' >
                                          <h5 className="text-center mb-4">Regístrate</h5>
                                          <Form onSubmit={handleSignup} className='flex flex-col items-center w-3/4' >
                                                <Form.Group controlId="first_name" className='w-full'>
                                                      <Form.Label>Nombre</Form.Label>
                                                      <Form.Control
                                                            type="first_name"
                                                            placeholder="Ingrese su nombre"
                                                            value={first_name}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            className='rounded mb-3 border'
                                                            style={{ fontSize: '.75rem' }}
                                                      />
                                                </Form.Group>
                                                <Form.Group controlId="last_name" className='w-full'>
                                                      <Form.Label>Apellido</Form.Label>
                                                      <Form.Control
                                                            type="last_name"
                                                            placeholder="Ingrese su apellido"
                                                            value={last_name}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            className='rounded mb-3 border'
                                                            style={{ fontSize: '.75rem' }}
                                                      />
                                                </Form.Group>
                                                {/*
                                                <Form.Group controlId="age" className='w-full'>
                                                      <Form.Label>Edad <span className='text-red-400'>*</span></Form.Label>
                                                      <Form.Control
                                                            type="age_input"
                                                            placeholder="Ingrese su edad"
                                                            value={age}
                                                            onChange={(e) => setAge(e.target.value)}
                                                            className='rounded mb-3 border'
                                                            style={{ fontSize: '.75rem' }}
                                                            required
                                                      />
                                                </Form.Group>


                                                <Form.Group controlId="gender" className='w-full' > 
                                                      <Form.Label>Género <span className='text-red-400'>*</span></Form.Label>
                                                      <Dropdown className='rounded mb-3' onSelect={handleGenderChange} required>
                                                            <Dropdown.Toggle style={{ fontSize: '.75rem' }} className='rounded w-full bg-white border d-flex justify-content-between align-items-center' variant='light' id="gender-dropdown">
                                                                  {(gender !== "") ? gender : (<div className="text-gray-500">Seleccione su género</div>)}
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu
                                                                  align="start"
                                                                  onChange={(e) => handleGenderChange(e.target.value)}
                                                                  style={{
                                                                        maxHeight: '300px', 
                                                                        overflowY: 'auto',
                                                                  }}
                                                                  popperConfig={{
                                                                        modifiers: [{
                                                                                    name: 'offset',
                                                                                    options: {offset: [50, -100]},
                                                                        }],
                                                                  }}
                                                            >
                                                                  <Dropdown.Header>Género</Dropdown.Header>
                                                                  {Object.keys(genderMapping)?.map((key) => (
                                                                        <Dropdown.Item key={key} eventKey={genderMapping[key]}>
                                                                              {genderMapping[key]}
                                                                        </Dropdown.Item>
                                                                  ))}
                                                            </Dropdown.Menu>
                                                      </Dropdown>       
                                                </Form.Group>

                                                <Form.Group controlId="language" className='w-full'> 
                                                      <Form.Label>Idioma preferido <span className='text-red-400'>*</span></Form.Label>
                                                      <Dropdown className='rounded mb-3' onSelect={handleLanguageChange} required>
                                                            <Dropdown.Toggle style={{ fontSize: '.75rem' }} className='rounded w-full bg-white border d-flex justify-content-between align-items-center' variant='light' id="language-dropdown">
                                                                  {(language !== "") ? language : (<div className="text-gray-500">Seleccione su idioma preferido</div>)}
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu
                                                                  align="start"
                                                                  onChange={(e) => handleLanguageChange(e.target.value)}
                                                                  style={{
                                                                        maxHeight: '300px', 
                                                                        overflowY: 'auto',
                                                                  }}
                                                                  popperConfig={{
                                                                        modifiers: [{
                                                                                    name: 'offset',
                                                                                    options: {offset: [50, -100]},
                                                                        }],
                                                                  }}
                                                            >
                                                                  <Dropdown.Header>Idioma</Dropdown.Header>
                                                                  {constants?.languages?.map((language, i) => (
                                                                        <Dropdown.Item key={i} eventKey={language?.name} >
                                                                              {language?.name}
                                                                        </Dropdown.Item> 
                                                                  ))}
                                                            </Dropdown.Menu>
                                                      </Dropdown>       
                                                </Form.Group>
                                                 */}

                                                <Form.Group controlId="email" className='w-full'>
                                                      <Form.Label>Correo Electrónico <span className='text-red-400'>*</span></Form.Label>
                                                      <Form.Control
                                                            type="email"
                                                            placeholder="Ingrese su correo electrónico"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            className='rounded mb-3 border'
                                                            style={{ fontSize: '.75rem' }}
                                                      />
                                                </Form.Group>

                                                <Form.Group controlId="phone_number" className='w-full'>
                                                      <Form.Label>Número de Teléfono <span className='text-red-400'>*</span></Form.Label>
                                                      <Row className='items-center mb-3'>
                                                            <Col xs={3} className='items-center pr-0'>
                                                                  <Dropdown onSelect={handleCountryCodeChange} required>
                                                                        <Dropdown.Toggle 
                                                                              className='w-full bg-white d-flex justify-content-between align-items-center' 
                                                                              variant='light' id="phone-number-code-dropdown"
                                                                              style={{
                                                                                    borderRadius: '8px 0 0 8px', // Adjust the border-radius as needed
                                                                                    borderTop: '1px solid #dee2e6',
                                                                                    borderLeft: '1px solid #dee2e6',
                                                                                    borderBottom: '1px solid #dee2e6',
                                                                                    borderRight: '0',
                                                                                    fontSize: '.75rem'
                                                                                  }}
                                                                        >
                                                                              {(phone_number_code !== "") ? phone_number_code : (<div className="text-gray-500">-</div>)}
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu
                                                                              align="start"
                                                                              onChange={(e) => handleCountryCodeChange(e.target.value)}
                                                                              style={{
                                                                                    maxHeight: '300px', 
                                                                                    overflowY: 'auto',
                                                                              }}
                                                                              popperConfig={{
                                                                                    modifiers: [{
                                                                                                name: 'offset',
                                                                                                options: {offset: [0, -150]},
                                                                                    }],
                                                                              }}
                                                                        >
                                                                              <Dropdown.Header>Prefijo telefónico</Dropdown.Header>
                                                                              {countryCodes.map((country) => (
                                                                                    <Dropdown.Item key={country.code} eventKey={country.code}>
                                                                                          {country.code}{"_".repeat(6 - country.code.length)}{country.name}
                                                                                    </Dropdown.Item>
                                                                              ))}
                                                                        </Dropdown.Menu>
                                                                  </Dropdown>        
                                                            </Col>
                                                            <Col xs={9} className='pl-0' >
                                                                  <Form.Control
                                                                        type="phone_number"
                                                                        placeholder="Ingrese su número de teléfono"
                                                                        value={phone_number}
                                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                                        required
                                                                        className='mx-0 border'
                                                                        style={{
                                                                              borderRadius: '0 8px 8px 0', // Adjust the border-radius as needed
                                                                              fontSize: '.75rem'
                                                                            }}
                                                                  />
                                                            </Col>
                                                      </Row>
                                                </Form.Group>

                                                

                                                <Form.Group controlId="password" className='w-full'>
                                                      <Form.Label>Contraseña <span className='text-red-400'>*</span></Form.Label>
                                                      <Form.Control
                                                            type="password"
                                                            placeholder="Ingrese su contraseña"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            className='rounded mb-3 border'
                                                            style={{ fontSize: '.75rem' }}
                                                      
                                                      />
                                                </Form.Group>

                                                <Form.Group controlId="repeat_password" className='w-full'>
                                                      <Form.Label>Repetir Contraseña <span className='text-red-400'>*</span></Form.Label>
                                                      <Form.Control
                                                            type="password"
                                                            placeholder="Repita su contraseña"
                                                            value={repeat_password}
                                                            onChange={(e) => setRepeatPassword(e.target.value)}
                                                            required
                                                            className='rounded mb-3 border'
                                                            style={{ fontSize: '.75rem' }}
                                                      
                                                      />
                                                </Form.Group>
                                                <p>Al regisrarme doy constancia de que he leído los <span onClick={() => {navigate('/terminos')}} className='font-bold hover:text-blue-400'>Terminos y condiciones</span>.</p>
                                                {
                                                      userInfo.loading == true ? (
                                                            <img
                                                                  src="/tail_blue_fast.svg"
                                                                  alt="Loading..."
                                                                  className="max-h-32 "
                                                            />
                                                      ) : (
                                                            <button type="submit" className="m-2 w-32 p-2 text-white bg-green-600 rounded-xl hover:bg-gray-400">
                                                                  Registrarme
                                                            </button>
                                                      )
                                                }
                                                
                                                
                                          </Form>
                                          {
                                                signupError !== '' ? (
                                                      <p className='text-red-400'>{signupError}</p>
                                                ) : (null)
                                          }
                                          <p>¿Ya tiene una cuenta? <button className='text-blue-400 mt-2 hover:text-black' onClick={handleShowLogin}>Iniciar Sesión</button></p>
                                          
                                    </Card.Body>
                              </Card>
                        </Col>
                  </Row>
            </Container>
      )
}

export default UserSignup