import React from 'react'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'


function PlanOptions({ userInfo }) {
      const handleWhatsappRequest = (plan) => {
            const message = `Hola, mi nombre es ${userInfo?.user?.first_name} ${userInfo?.user?.last_name} y quiero solicitar el plan ${plan} para activar mi perfil de profesor en Aprende.Pe. \nMi correo es: ${userInfo?.user?.email} y mi número de telefono es: ${userInfo?.user?.phone_number}`;

            const whatsappLink = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;

            window.open(whatsappLink, '_blank');
      }

      const handleEmailRequest = (plan) => {
            const subject = `Solicitud de plan ${plan} para Aprende.pe`;
            const body = `Hola, mi nombre es ${userInfo?.user?.first_name} ${userInfo?.user?.last_name} y quiero solicitar el plan ${plan} para activar mi perfil de profesor en Aprende.Pe. \nMi correo es: ${userInfo?.user?.email} y mi número de telefono es: ${userInfo?.user?.phone_number}`;
            const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.open(mailtoLink, '_blank'); 
      }
      return (
            <>
            <Row className='my-4'>
                  <Col>
                        <h5>Activa tu perfil de profesor</h5>
                        <p>¡Felicidades! Ya creaste tu perfil de profesor, ya puedes editarlo a tu gusto y poner los cursos que dictas y la experiencia que tienes. Sin embargo, para que los usuarios puedan ver tu perfil debes <b>activarlo</b>. </p>
                  </Col>
            </Row>
            <Row className='mb-5 bg-gray-100 py-4'>
                  <Col md={4}>
                        <div className='m-2 p-5 bg-white border rounded-xl flex flex-col items-center text-center'>
                              <h5>Plan semanal</h5>
                              <h2>10 PEN</h2>
                              <p>Pago semanal, cancelable en cualquier momento</p>
                              <Button onClick={() => {handleWhatsappRequest('semanal (5 PEN)')}} className='mb-2'>Solicitar por whatsapp</Button>
                              <Button onClick={() => {handleEmailRequest('semanal (5 PEN)')}}>Solicitar por correo</Button>
                        </div>
                  </Col>
                  <Col md={4}>
                        <div className='px-5 py-14 bg-white border rounded-xl flex flex-col items-center text-center'>
                              <h5>Plan mensual</h5>
                              <h2>30 PEN</h2>
                              <p>Pago mensual, cancelable en cualquier momento</p>
                              <Button onClick={() => {handleWhatsappRequest('mensual (17 PEN)')}} className='mb-2'>Solicitar por whatsapp</Button>
                              <Button onClick={() => {handleEmailRequest('mensual (17 PEN)')}}>Solicitar por correo</Button>
                        </div>
                  </Col>
                  <Col md={4}>
                        <div className='m-2 p-5 bg-white border rounded-xl flex flex-col items-center text-center'>
                              <h5>Plan anual</h5>
                              <h2>300 PEN</h2>
                              <p>Pago anual, cancelable en cualquier momento</p>
                              <Button onClick={() => {handleWhatsappRequest('anual (97 PEN)')}} className='mb-2'>Solicitar por whatsapp</Button>
                              <Button onClick={() => {handleEmailRequest('anual (97 PEN)')}}>Solicitar por correo</Button>
                        </div>
                  </Col>
            </Row>
            
            </>
      )
}

export default PlanOptions