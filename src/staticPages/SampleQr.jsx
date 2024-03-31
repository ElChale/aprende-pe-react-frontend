import React from 'react'
import { useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


function SampleQr() {
      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])
      return (
            <Container>
                  <Row className='py-5 items-center justify-center'>
                        <Col md={6} className='border rounded-xl p-4 mx-2 md:m-0 text-justify'>
                              <h5>Ups</h5>
                              <p>Parece que a este profesor se le olvido añadir un qr o una imagen con su método de pago.</p>
                              <p>Por favor comuniquese con el profesor a travez de nuestro servicio de chats.</p>
                              <p>Puede iniciar un chat en el perfil de cualquier profesor.</p>
                        </Col>
                  </Row>
            </Container>
      )
}

export default SampleQr