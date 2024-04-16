import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'

import { createUniversityDegree } from '../reducers/subjectReducers'

function CreateUniversityDegree({ userInfo, universities, openUniversity }) {
      const dispatch = useDispatch()

      const [error, setError] = useState('')

      const [degrees, setDegrees] = useState('')

      const handleSubmit = (e) => {
            e.preventDefault()
            dispatch(createUniversityDegree({ degrees:degrees, university_id:openUniversity.id, token:userInfo.token }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload?.error) {
                              setError(result.payload.error)
                        } else {
                              setDegrees('')
                              setError('')
                        }
                  } else {
                        setError(result?.error?.message)
                  }
            })
      }
      return (
            <div className='py-4 px-0 px-md-4'>
                  <h5 className='mb-3'>Crear carreras para la universidad: {openUniversity?.name}</h5>
                  <Form onSubmit={(e) => {handleSubmit(e)}}>
                        <Form.Group controlId='degrees' className='mb-3'>
                              <Row>
                                    <Col xs={3} md={4}>
                                          <Form.Label><h6>Carreras</h6></Form.Label>
                                    </Col>
                                    <Col xs={9} md={8}>
                                          <Form.Control
                                                as="textarea" rows={10}
                                                name='degrees'
                                                placeholder="Ingrese la lista de carreras"
                                                value={degrees}
                                                onChange={(e) => setDegrees(e.target.value)}
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
                              Crear Carreras
                        </Button>
                        }
                        <p className='text-red-400'>{error}</p>
                  </Form>
            </div>
      )
}

export default CreateUniversityDegree