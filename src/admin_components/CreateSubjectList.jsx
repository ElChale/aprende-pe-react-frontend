import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'

import { createSubjectList } from '../reducers/subjectReducers'

function CreateSubjectList({ userInfo, categories, openCategory }) {
      const dispatch = useDispatch()

      const [error, setError] = useState('')

      const [subjects, setSubjects] = useState('')

      const handleSubmit = (e) => {
            e.preventDefault()
            dispatch(createSubjectList({ subjects:subjects, category_id:openCategory.id, token:userInfo.token }))
            .then((result) => {
                  if (result.payload) {
                        if (result.payload?.error) {
                              setError(result.payload.error)
                        } else {
                              setSubjects('')
                              setError('')
                        }
                  } else {
                        setError(result?.error?.message)
                  }
            })
      }
      return (
            <div className='py-4 px-0 px-md-4'>
                  <h5 className='mb-3'>Crear cursos para la categoría: {openCategory?.name}</h5>
                  <Form onSubmit={(e) => {handleSubmit(e)}}>
                        <Form.Group controlId='subjects' className='mb-3'>
                              <Row>
                                    <Col xs={3} md={4}>
                                          <Form.Label><h6>Cursos</h6></Form.Label>
                                    </Col>
                                    <Col xs={9} md={8}>
                                          <Form.Control
                                                as="textarea" rows={10}
                                                name='subjects'
                                                placeholder="Ingrese la lista de cursos"
                                                value={subjects}
                                                onChange={(e) => setSubjects(e.target.value)}
                                          />
                                    </Col>
                              </Row>
                        </Form.Group>       
                        {categories.loading ? 
                        <img
                              src="/tail_blue_fast.svg"
                              alt="Loading..."
                              className="max-h-32 "
                        />
                        :       
                        <Button variant="primary" type='submit' >
                              Crear Cursos
                        </Button>
                        }
                        <p className='text-red-400'>{error}</p>
                  </Form>
            </div>
      )
}

export default CreateSubjectList