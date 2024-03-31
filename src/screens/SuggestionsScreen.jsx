import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { getSuggestions, createSuggestion, likeSuggestion, dislikeSuggestion, unLikeSuggestion, unDislikeSuggestion } from '../reducers/suggestionReducers';
import { useSelector, useDispatch } from 'react-redux';
import { BASE_URL } from '../utils';
import TextBox from '../components/ui/TextBox';

import dayjs from 'dayjs';


function SuggestionsScreen({ userInfo, suggestions}) {
      const dispatch = useDispatch()
      const navigate = useNavigate()

      const [page, setPage] = useState(1)
      const [pageError, setPageError] = useState('')
      const [suggestionError, setSuggestionError] = useState('')

      const [showSuggestionModal, setShowSuggestionModal] = useState(false)
      const [suggestion, setSuggestion] = useState('')


      const handleLike = (id) => {
            dispatch(likeSuggestion({ id:id, token:userInfo.token}))
      }
      const handleDislike = (id) => {
            dispatch(dislikeSuggestion({ id:id, token:userInfo.token}))
      }
      const handleUnlike = (id) => {
            dispatch(unLikeSuggestion({ id:id, token:userInfo.token}))
      }
      const handleUndislike = (id) => {
            dispatch(unDislikeSuggestion({ id:id, token:userInfo.token}))
      }

      const handlePageChange = (change) => {
            let new_page = page + change
            if(0 < new_page && new_page <= suggestions?.suggestions?.num_pages) {
                  dispatch(getSuggestions({page:new_page, token:userInfo?.token}))
                  .then((result) => {
                        if (result.payload) {
                              if (result.payload.error) {
                                    setPageError(result.payload.error)
                              } else {
                                    setPage(new_page)
                                    setPageError('')
                              }
                        } else {
                              setPageError(result.error.message)
                              
                        }
                  })
            }
      }

      const handleCreateSuggestion = (e) => {
            e.preventDefault()
            if (suggestion != '' && suggestion != null) {
                  dispatch(createSuggestion({suggestion:suggestion, token:userInfo?.token}))
                  .then((result) => {
                        if (result.payload) {
                              if (result.payload.error) {
                                    setSuggestionError(result.payload.error)
                              } else {
                                    setSuggestion('')
                                    setSuggestionError('')
                                    setPage(1)
                                    setShowSuggestionModal(false)
                                    dispatch(getSuggestions({page:1, token:userInfo?.token}))
                              }
                        } else {
                              setSuggestionError(result.error.message)
                              
                        }
                  })
            }
      }

      useEffect(() => {
            dispatch(getSuggestions({page:1, token:userInfo?.token}))
      }, [])

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      return (
            <Container>
                  {/* USER INFO EDIT MODAL */}
                  <Modal className='text-xs bg-gray-800 bg-opacity-75' show={showSuggestionModal} onHide={() => setShowSuggestionModal(false)} centered size="md">
                        <Form onSubmit={(e) => handleCreateSuggestion(e)}>
                              <Modal.Header closeButton>
                                    <Modal.Title>Enviar sugerencia</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                          <Form.Group controlId='suggestion' className='mb-3'>
                                                <Row>
                                                      <Col xs={3} md={4}>
                                                            <Form.Label><h6>Sugerencia</h6></Form.Label>
                                                      </Col>
                                                      <Col xs={9} md={8}>
                                                            <Form.Control
                                                                  as="textarea" rows={3}
                                                                  name='suggestion'
                                                                  placeholder="Ingrese una sugerencia"
                                                                  value={suggestion}
                                                                  onChange={(e) => setSuggestion(e.target.value)}
                                                                  className='rounded border'
                                                            />
                                                      </Col>
                                                </Row>
                                          </Form.Group>                                    
                                    <p className='text-justify'>Esta sugerencia será visible por todos los usuarios registrados. Los administradores la leeran y podrán eliminarla.</p>                              
                              </Modal.Body>
                              <Modal.Footer className='flex flex-col'>
                                    <div className='flex justify-end w-full'> 
                                    <Button className='mr-2' variant="primary" type='submit' >
                                          Guardar
                                    </Button>
                                    <Button variant="secondary" onClick={() => setShowSuggestionModal(false)}>
                                          Cancelar
                                    </Button>
                                    </div>
                                    <span className='text-end w-full m-3 text-red-400'>{suggestionError}</span>
                              </Modal.Footer>
                        </Form>
                  </Modal>
                  {userInfo?.user ? 
                  <>
                  <Row className='py-4'>
                        <Col>
                              <h5>Sugerencias</h5>
                              <p>Dejanos tus sujerencias para mejorar la plataforma o dale like a las sugerencias de otros.</p>
                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <Button onClick={() => setShowSuggestionModal(true)}>Añadir sugerencia</Button>
                        </Col>
                  </Row>
                  <Row className='py-4'>
                        <Col>
                              {
                                    !suggestions?.loading ? suggestions?.suggestions?.suggestions?.map((suggestion, i) => 
                                          <div key={i} className='w-full border rounded-xl pt-3 px-4 pb-0 mb-4'>
                                                <span className='flex align-items-center mb-3'>
                                                      <img src={suggestion?.user?.profile_image} className='w-10 h-10 border rounded-full' />
                                                      <div>
                                                            <h6 className='my-0 mx-3 w-full overflow-hidden whitespace-nowrap' >{suggestion?.user?.first_name} {suggestion?.user?.last_name}</h6>
                                                            <span className='mx-3'>{dayjs(suggestion?.created_at).format("DD/MM/YYYY HH:mm")}</span>
                                                      </div>
                                                      <div className='ml-auto flex items-center'>
                                                            {
                                                                  suggestion?.likes?.includes(userInfo?.user?.id) ? 
                                                                  <img onClick={() => handleUnlike(suggestion?.id)} className='w-8 h-8' src='/like_icon_active.png'/> : 
                                                                  <img onClick={() => handleLike(suggestion?.id)} className='w-8 h-8 hover:opacity-50' src='/like_icon.png'/>
                                                            }
                                                            <span className='mx-1'>{suggestion?.likes?.length}</span>
                                                            {
                                                                  suggestion?.dislikes?.includes(userInfo?.user?.id) ? 
                                                                  <img onClick={() => handleUndislike(suggestion?.id)} className='w-8 h-8' src='/dislike_icon_active.png'/> : 
                                                                  <img onClick={() => handleDislike(suggestion?.id)} className='w-8 h-8 hover:opacity-50' src='/dislike_icon.png'/>
                                                            }
                                                            <span className='ml-1'>{suggestion?.dislikes?.length}</span>
                                                      </div>
                                                </span >
                                                <TextBox content={suggestion.suggestion}/>
                                          </div>
                                    ) :
                                    <img
                                          src="/tail_blue_fast.svg"
                                          alt="Loading..."
                                          className="max-h-32 "
                                    />
                              }
                              
                        </Col>
                        
                  </Row>
                  <Row>
                        <Col className='flex justify-center items-center mb-5'>
                              <div className='flex ml-2 items-center'>
                                    <img onClick={() => {handlePageChange(-1)}} className={`w-3 h-3 ${page == 1 ? 'opacity-25' : 'scale-100 hover:scale-105'}`} src='/back_icon.png'/>
                                    <div className='mx-2'>{page}</div>
                                    <img onClick={() => {handlePageChange(1)}} className={`w-3 h-3 ${page >= suggestions?.suggestions?.num_pages ? 'opacity-25' : 'scale-100 hover:scale-105'}`} src='/forward_icon.png'/>
                                    {pageError != null && pageError != '' && <span className='ml-2 text-red-400'>{pageError}</span>}
                              </div>
                        </Col>
                  </Row>
                  </>
                  : 
                  <Row>
                        <Col>
                              <h5>Inicie sesión para poder dejar sugerencias</h5>
                              <Button onClick={()=>{navigate('/user')}}>Iniciar sesión</Button>
                        </Col>
                  </Row>}
            </Container>
      )
}

export default SuggestionsScreen