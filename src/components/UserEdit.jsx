import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { update, imageUpdate } from '../reducers/userReducers';
import { Container, Row, Col, Form, Card, Dropdown, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';

import { countryCodes, genderMapping, languageMapping  } from '../utils'

function UserEdit({ userInfo, handleShowEditForm, constants }) {
      const dispatch = useDispatch()

      const [email, setEmail] = useState(userInfo.user.email)
      const [password, setPassword] = useState('')
      
      const [first_name, setFirstName] = useState(userInfo.user.first_name)
      const [last_name, setLastName] = useState(userInfo.user.last_name)
      const [age, setAge] = useState(userInfo.user.age)
      const raw_phone_number = userInfo.user.phone_number
      const [phone_number_code, setPhoneNumberCode] = useState(raw_phone_number.substring(0, raw_phone_number.length - 9))
      const [phone_number, setPhoneNumber] = useState(raw_phone_number.substring(phone_number_code.length, raw_phone_number.length))
 
      const [gender, setGender] = useState(genderMapping[userInfo.user.gender])
      const [language, setLanguage] = useState(userInfo.user.language?.name)
      const [repeat_password, setRepeatPassword] = useState('')
      
      const [updateError, setUpdateError] = useState('')
      

      const handleUpdate = () => {
            if(password == repeat_password) {
                  let phone_number_complete = phone_number_code+phone_number
                  let language_id = constants?.languages?.find(item => item?.name == language)?.id || null
                  dispatch(update({ id:userInfo.user.id, first_name, last_name, email, phone_number:phone_number_complete, gender, age, language:language_id, password, token:userInfo.token }))
                  .then((result) => {
                        if (result.payload) {
                              handleShowEditForm()
                              setFirstName('')
                              setLastName('')
                              setAge('')
                              setEmail('')
                              setPhoneNumberCode('')
                              setPhoneNumber('')
                              setGender('')
                              setLanguage('')
                              setPassword('')
                              setRepeatPassword('')
                              setUpdateError('')
                        } else {
                              setUpdateError(result.error.message)
                        }
                  })
            } else {
                  setUpdateError('Passwords do not match')
            }
 
      }

      const handleCancel = () => {
            handleShowEditForm()
            setFirstName('')
            setLastName('')
            setAge('')
            setEmail('')
            setPhoneNumberCode('')
            setPhoneNumber('')
            setGender('')
            setLanguage('')
            setPassword('')
            setRepeatPassword('')
            setUpdateError('')
      }

      const fileInputRef = useRef(null);
      
      const handleImageClick = () => {
            fileInputRef.current.click(); // Trigger the file input click
      };
      
      const handleFileChange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                  dispatch(imageUpdate({ id:userInfo.user.id, email:userInfo.user.email, gender:userInfo.user.gender, profile_image:selectedFile, token:userInfo.token }));
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
            <Container fluid className="d-flex align-items-center justify-content-center">
                  <Card className="bg-light w-70 my-5" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4 ">
                              <Row>
                                    <Col xs={12} md={5} className="flex items-start justify-center pb-3 pb-md-0">
                                          {
                                                userInfo.loading == true ? (
                                                      <img
                                                            src="/tail_blue_fast.svg"
                                                            alt="Loading..."
                                                            className="w-80"
                                                      />
                                                ) : (
                                                      <div>
                                                            <div className="relative group" onClick={handleImageClick}>
                                                                  <img
                                                                        src={userInfo.user.profile_image}
                                                                        alt="Profile Image"
                                                                        style={{ cursor: 'pointer' }}
                                                                        className="w-80 h-auto rounded-2xl border-2 border-black"
                                                                  />
                                                                  <div className="hidden rounded-2xl absolute inset-0 bg-black bg-opacity-50 text-white justify-center items-center group-hover:flex">
                                                                        <span className="text-2xl">Cambiar Imagen</span>
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
                                          
                                    </Col>
                                    <Col xs={12} md={7} className="text-center mx-sm-3 mx-md-0">
                                          <div className="flex flex-col items-start justify-top h-full">
                                                <h5 className="font-semibold my-4">
                                                      Editar Perfil
                                                </h5>
                                                <Form id="userEditForm" disabled readOnly onSubmit={(e) => {e.preventDefault(); handleUpdate()}} className='flex flex-col items-start text-start ' >
                                                      
                                                      
                                                      <Row className='items-center mb-3'>
                                                            <Col xs={6} className='items-center'> 
                                                                  <Form.Group controlId="first_name" className='w-full'>
                                                                        <Form.Label>Nombre</Form.Label>
                                                                        <Form.Control
                                                                              type="first_name"
                                                                              placeholder="Ingrese su nombre"
                                                                              value={first_name}
                                                                              onChange={(e) => setFirstName(e.target.value)}
                                                                              className='rounded border'
                                                                              style={{ fontSize: '.75rem' }}
                                                                        />
                                                                  </Form.Group>
                                                            </Col>
                                                            <Col xs={6} className='items-center'>
                                                                  <Form.Group controlId="last_name" className='w-full'>
                                                                        <Form.Label>Apellido</Form.Label>
                                                                        <Form.Control
                                                                              type="last_name"
                                                                              placeholder="Ingrese su apellido"
                                                                              value={last_name}
                                                                              onChange={(e) => setLastName(e.target.value)}
                                                                              className='rounded border'
                                                                              style={{ fontSize: '.75rem' }}
                                                                        />
                                                                  </Form.Group>

                                                            </Col>
                                                      </Row>

                                                      <Row className='items-center mb-3 w-full m-0   '>
                                                            <Col xs={6} className='items-center pl-0'> 
                                                                  <Form.Group controlId="gender" className='w-full'> 
                                                                        <Form.Label>Género</Form.Label>
                                                                        <Dropdown className='' onSelect={handleGenderChange} >
                                                                              <Dropdown.Toggle style={{ fontSize: '.75rem' }} className='rounded w-full bg-white border border-gray d-flex justify-content-between align-items-center' variant='light' id="gender-dropdown">
                                                                                    {(gender !== "" && gender != null && gender != undefined) ? gender : (<div className="text-gray-500">Seleccione su género</div>)}
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
                                                                                                      options: {offset: [0, -100]},
                                                                                          }],
                                                                                    }}
                                                                              >
                                                                                    <Dropdown.Header>Género</Dropdown.Header>
                                                                                    {Object.keys(genderMapping).map((key) => (
                                                                                          <Dropdown.Item key={key} eventKey={genderMapping[key]}>
                                                                                                {genderMapping[key]}
                                                                                          </Dropdown.Item>
                                                                                    ))}
                                                                              </Dropdown.Menu>
                                                                        </Dropdown>       
                                                                  </Form.Group>
                                                            </Col>
                                                            
                                                            <Col xs={6} className='items-center pr-0'>
                                                                  <Form.Group controlId="age" className='w-full'>
                                                                        <Form.Label>Edad</Form.Label>
                                                                        <Form.Control
                                                                              type="age"
                                                                              placeholder="Ingrese su edad"
                                                                              value={age}
                                                                              onChange={(e) => setAge(e.target.value)}
                                                                              className='rounded border'
                                                                              style={{ fontSize: '.75rem' }}
                                                                        />
                                                                  </Form.Group>

                                                            </Col>
                                                      </Row>

                                                      <Form.Group controlId="language" className='w-full'> 
                                                            <Form.Label>Idioma Preferido</Form.Label>
                                                            <Dropdown className='rounded mb-3' onSelect={handleLanguageChange} required>
                                                                  <Dropdown.Toggle style={{ fontSize: '.75rem' }} className='rounded w-full bg-white border d-flex justify-content-between align-items-center' variant='light' id="language-dropdown">
                                                                        {(language !== "" && language !== null && language != undefined) ? language : (<div className="text-gray-500">Seleccione su idioma preferido</div>)}
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
                                                                        {constants.languages.map((language, i) => (
                                                                              <Dropdown.Item key={i} eventKey={language?.name} >
                                                                                    {language?.name}
                                                                              </Dropdown.Item> 
                                                                        ))}
                                                                  </Dropdown.Menu>
                                                            </Dropdown>       
                                                      </Form.Group>

                                                      <Form.Group controlId="phone_number" className='w-full'>
                                                            
                                                            <Form.Label>
                                                                  Número de Teléfono
                                                                  <OverlayTrigger 
                                                                        key="bottom" 
                                                                        placement="bottom" 
                                                                        overlay={<Tooltip id="tooltip-bottom">Si cambias tu número de teléfono, tendrás que verificarlo nuevamente</Tooltip>}
                                                                  >
                                                                        <Badge bg="info" className="text-white ml-2">i</Badge>
                                                                  </OverlayTrigger>
                                                            </Form.Label>
                                                            <Row className='items-center mb-3'>
                                                                  <Col xs={3} className='items-center pr-0 '> 
                                                                  <Dropdown className='rounded' onSelect={handleCountryCodeChange}>
                                                                        <Dropdown.Toggle
                                                                              className=' w-full bg-white  d-flex justify-content-between align-items-center mx-0' 
                                                                              variant='light' 
                                                                              id="phone-number-code-dropdown"
                                                                              style={{
                                                                                    borderRadius: '4px 0 0 4px', // Adjust the border-radius as needed
                                                                                    borderTop: '1px solid #dee2e6',
                                                                                    borderLeft: '1px solid #dee2e6',
                                                                                    borderBottom: '1px solid #dee2e6',
                                                                                    borderRight: '0',
                                                                                    fontSize: '.75rem',
                                                                                  }}
                                                                      
                                                                        >
                                                                              {(phone_number_code !== "") ? phone_number_code : "-"}
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
                                                                              <Dropdown.Header>Prefijo telefónico </Dropdown.Header>
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
                                                                              style={{
                                                                                    borderRadius: '0 4px 4px 0', // Adjust the border-radius as needed
                                                                                    fontSize: '.75rem',
                                                                                  }}
                                                                                  className='rounded-l-none mx-0 border'
                                                                              />
                                                                  </Col>
                                                            </Row>
                                                      </Form.Group>

                                                      <Form.Group controlId="email" className='w-full'>
                                                            <Form.Label>
                                                                  Correo Electrónico
                                                                  <OverlayTrigger 
                                                                        key="bottom" 
                                                                        placement="bottom" 
                                                                        overlay={<Tooltip id="tooltip-bottom">Si cambias tu correo electrónico, tendrás que verificarlo nuevamente</Tooltip>}
                                                                        
                                                                  >
                                                                        <Badge bg="info" className="text-white ml-2">i</Badge>
                                                                  </OverlayTrigger>
                                                            </Form.Label>
                                                            <Form.Control
                                                                  type="email"
                                                                  placeholder="Ingrese su correo electrónico"
                                                                  value={email}
                                                                  onChange={(e) => setEmail(e.target.value)}
                                                                  className='rounded mb-3 border'
                                                                  style={{ fontSize: '.75rem' }}
                                                            />
                                                      </Form.Group>

                                                      <Form.Group controlId="password" className='w-full'>
                                                            <Form.Label>Cambiar Contraseña</Form.Label>
                                                            <Form.Control
                                                                  type="password"
                                                                  placeholder="Ingrese la contraseña nueva"
                                                                  value={password}
                                                                  onChange={(e) => setPassword(e.target.value)}
                                                                  className='rounded mb-3 border'
                                                                  style={{ fontSize: '.75rem' }}
                                                            
                                                            />
                                                      </Form.Group>

                                                      <Form.Group controlId="repeat_password" className='w-full'>
                                                            <Form.Label>Repetir Contraseña Nueva</Form.Label>
                                                            <Form.Control
                                                                  type="password"
                                                                  placeholder="Repita la contraseña nueva"
                                                                  value={repeat_password}
                                                                  onChange={(e) => setRepeatPassword(e.target.value)}
                                                                  className='rounded mb-3 border'
                                                                  style={{ fontSize: '.75rem' }}
                                                            
                                                            />
                                                      </Form.Group>
                                                      
                                                      {
                                                            userInfo.loading == true ? (
                                                                  <img
                                                                        src="/tail_blue_fast.svg"
                                                                        alt="Loading..."
                                                                        className="max-h-24"
                                                                  />
                                                            ) : (
                                                                  <div className="flex flex-wrap mt-2">
                                                                        <button type="submit" className="mr-2 my-2 w-32 p-1 text-white bg-blue-600 rounded-xl hover:bg-gray-400" >
                                                                              Guardar
                                                                        </button>
                                                                        <button className="m-2 w-32 p-1 text-black border-2 rounded-xl bg-white  hover:text-gray-400" onClick={(e) => {e.preventDefault(); handleCancel()}} >
                                                                              Cancelar
                                                                        </button> 
                                                                  </div>
                                                            )
                                                      }
                                                      

                                                      {
                                                            updateError !== '' ? (
                                                                  <p className='text-red-400'>{updateError}</p>
                                                            ) : (null)
                                                      }
                                                      
                                                </Form>
                                                
                                          </div>
                                    </Col>
                              </Row>
                        </Card.Body>
                  </Card>
            </Container>
      )
}

export default UserEdit