import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'

import { createUniversity } from '../reducers/subjectReducers'

function CreateUniversity({ userInfo, universities }) {
      const dispatch = useDispatch()

      const [error, setError] = useState('')

      const [name, setName] = useState('')
      const [description, setDescription] = useState('')

      const handleSubmit = (e) => {
            e.preventDefault()
            dispatch(createUniversity({ name:name, description:description, token:userInfo.token }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload.error) {
                              setError(result.payload.error)
                        } else {
                              setName('')
                              setDescription('')
                              setError('')
                        }
                  } else {
                        setError(result.error.message)
                  }
            })
      }

      return (
            <div className='py-4 px-0 px-md-4'>
                  <h5 className='mb-3'>Crear universidad</h5>
                  <Form onSubmit={(e) => {handleSubmit(e)}}>
                        <Form.Group controlId='name' className='mb-3'>
                              <Row>
                                    <Col xs={3} md={4}>
                                          <Form.Label><h6>Nombre</h6></Form.Label>
                                    </Col>
                                    <Col xs={9} md={8}>
                                          <Form.Control
                                                type='text'
                                                name='name'
                                                value={name}
                                                placeholder="Ingrese el nombre"
                                                onChange={(e) => {setName(e.target.value); setDescription(e.target.value)}}
                                          />
                                    </Col>
                              </Row>
                        </Form.Group>
                        <Form.Group controlId='description' className='mb-3'>
                              <Row>
                                    <Col xs={3} md={4}>
                                          <Form.Label><h6>Descripción</h6></Form.Label>
                                    </Col>
                                    <Col xs={9} md={8}>
                                          <Form.Control
                                                as="textarea" rows={5}
                                                name='description'
                                                placeholder="Ingrese la descripcion"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                          />
                                    </Col>
                              </Row>
                        </Form.Group>       
                        {universities.loading ? 
                        <img
                              src="/tail_blue_fast.svg"
                              alt="Loading..."
                              className="max-h-32 "
                        />
                        :       
                        <Button variant="primary" type='submit' >
                              Crear Universidad
                        </Button>
                        }
                        <p className='text-red-400'>{error}</p>
                  </Form>
            </div>
      )
}

export default CreateUniversity