import React from 'react'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'


function PlanOptions({ userInfo }) {
      const handleWhatsappRequest = (plan) => {
            const message = `Hola, mi nombre es ${userInfo?.user?.first_name} ${userInfo?.user?.last_name} y quiero solicitar el plan ${plan} para activar mi perfil de profesor en Aprende.Pe. \nMi correo para que pueda ubicar mi usuario es: ${userInfo?.user?.email}`;

            const whatsappLink = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;

            window.open(whatsappLink, '_blank');
      }

      const handleEmailRequest = (plan) => {
            const subject = `Solicitud de plan ${plan} para Aprende.pe`;
            const body = `Hola, mi nombre es ${userInfo?.user?.first_name} ${userInfo?.user?.last_name} y quiero solicitar el plan ${plan} para activar mi perfil de profesor en Aprende.Pe. \nMi correo es para que pueda ubicar mi usuario es: ${userInfo?.user?.email}`;
            const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.open(mailtoLink, '_blank'); 
      }
      return (
            <div className='relative'>
                  <div className='flex flex-col items-center justify-center text-white absolute text-lg font-bold bg-gray-800 bg-opacity-75 top-20 left-0 right-0 bottom-0 z-10' >
      ¡Es grátis!
      <Button onClick={() => {handleWhatsappRequest('GRATIS')}} className='my-2'>Solicitar por whatsapp</Button>
      <Button onClick={() => {handleEmailRequest('GRATIS')}}>Solicitar por correo</Button>

    </div>
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
            
            </div>
      )
}

export default PlanOptions