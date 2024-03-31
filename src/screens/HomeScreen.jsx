import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import { createTeacherProfile } from '../reducers/teacherReducers';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'
import { Navigate } from 'react-router-dom';

function HomeScreen() {
      const dispatch = useDispatch()
      const navigate = useNavigate()

      //DIFERENTIALS AND QUESTIONS
      const [openDiferential, setOpenDiferential] = useState(1)
      const [openQuestion, setOpenQuestion] = useState(1)
      
      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])
      
      return (
            <div className='mb-20'> 
               <div style={{
                  backgroundImage: `url(${'https://aprende-pe-bucket-1.s3.amazonaws.com/static/the_rock_banner.jpg'})`,
                  backgroundSize: 'cover', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'center', 
                  backgroundColor: '#f0f0f0', 
            }} >
                  <div className='flex bg-gray-800 bg-opacity-75'>
            <Container className=''>
                  <Row className='py-4 flex items-center' >
                        <Col className='mt-4 py-5 flex flex-col items-center'>
                              <img className='my-4' src='text_banner_alumnos_white.png'/>
                              <Button size='lg' onClick={() => {navigate('/findclasses')}}>Buscar profesores</Button>
                        </Col>
                       
                  </Row>
            </Container>
            </div>
            </div>

            <Container >
                  <Row className='bg-gray-100 rounded-xl my-5'>
                        <Col md={6} >
                              <div className='p-4 flex flex-col h-full items-start justify-center text-start'>
                                    <h3 className='font-bold'>Lo que nos hace únicos</h3>
                                    <h6 className=''>Nos esforzamos por entender las necesidades de nuestros clientes</h6>
                              </div>
                         </Col>
                        <Col md={6} >
                              <div className='p-4'>
                                    <div className='border rounded-xl p-4'>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 1 ? setOpenDiferential(1) : setOpenDiferential(null)}}>
                                                <h5>Amplia Variedad de Profesores y Cursos</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 1 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 1 && <p className={`mt-3 transition-transform transform ${openDiferential == 1 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Los alumnos tienen acceso a una amplia gama de profesores y cursos, desde especialidades específicas hasta programas académicos universitarios. Esta variedad garantiza que los alumnos encuentren el instructor y el contenido que mejor se adapten a sus necesidades educativas.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 2 ? setOpenDiferential(2) : setOpenDiferential(null)}}>
                                                <h5>Reservas de Clases Personalizadas</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 2 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 2 && <p className={`mt-3 transition-transform transform ${openDiferential == 2 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>La aplicación permite a los alumnos realizar reservas de tiempo con flexibilidad, adaptándose a sus horarios y preferencias. Esta funcionalidad brinda comodidad a los estudiantes al programar sesiones de aprendizaje según su disponibilidad.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 3 ? setOpenDiferential(3) : setOpenDiferential(null)}}>
                                                <h5>Evaluaciones y Comentarios Transparentes</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 3 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 3 && <p className={`mt-3 transition-transform transform ${openDiferential == 3 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Los alumnos pueden tomar decisiones informadas al revisar las evaluaciones y comentarios de otros estudiantes sobre los profesores. Esta transparencia proporciona una visión auténtica de la calidad de la enseñanza y ayuda a los alumnos a seleccionar al instructor más adecuado para sus necesidades.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 4 ? setOpenDiferential(4) : setOpenDiferential(null)}}>
                                                <h5>Cursos universitarios</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 4 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 4 && <p className={`mt-3 transition-transform transform ${openDiferential == 4 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Contamos con una gran seleccion de cursos universitarios de las universidades más reconocidas en tu zona. Aqui puedes encontrar profesores capacitados para darte un apoyo adicional en los cursos que te parezcan más dificiles de tu carrera universitaria.</p>}
                                          <hr></hr>
                                          <div className='flex items-center' onClick={() => {openDiferential !== 5 ? setOpenDiferential(5) : setOpenDiferential(null)}}>
                                                <h5>Chat Directo y Seguro</h5>
                                                <img className={`w-4 h-4 ml-auto transition-transform transform ${openDiferential == 5 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                          </div>
                                          {openDiferential == 5 && <p className={`mt-3 transition-transform transform ${openDiferential == 5 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Los alumnos pueden abrir chats seguros con los profesores para discutir dudas, recibir asesoramiento o aclarar detalles antes de realizar una reserva. Esta función facilita la comunicación directa y eficiente entre ambas partes, mejorando la experiencia de aprendizaje.</p>}
                                         

                                    </div>
                              </div>
                        </Col>
                  </Row>
            </Container>
           
            <Container>
                  <Row className='pt-2'>
                        <Col>
                        <h2 className='font-bold flex justify-center'>Encuentra a tu profesor ideal</h2>
                        <hr></hr>
                        </Col>
                  </Row>
                  <Row>
                        <Col md={6} className='order-2 order-md-1'>
                             <div className='p-4'>
                                    <img
                                          src={'https://aprende-pe-bucket-1.s3.amazonaws.com/static/student_step_1.jpg'}
                                          alt="Paso 1"
                                          className="w-full h-auto object-cover rounded-xl"
                                    />
                              </div>
                        </Col>
                        <Col md={6} className='order-1 order-md-2'>
                              <div className='p-4 flex flex-col h-full items-start justify-center text-justify '>
                                    <h4>Seleccione los cursos que desea aprender</h4>
                                    <p>Explore nuestra amplia variedad de cursos y elija aquellos que se adapten a sus necesidades y objetivos educativos. Utilice nuestros filtros para ordenar la búsqueda por hora, rating y horas enseñadas de los profesores. </p><p>Además, descubra la opción de <b>cursos universitarios</b> provenientes de las mejores universidades de su zona. Este proceso le permitirá personalizar su experiencia educativa de acuerdo con sus preferencias y requisitos de aprendizaje.</p>
                              </div>
                        </Col>
                  </Row>
                  <Row>
                        <Col md={6}>
                              <div className='p-4 flex flex-col h-full items-start justify-center text-justify'>
                                    <h4>Seleccione al mejor profesor</h4>
                                    <p>Una vez que haya identificado los cursos de interés, seleccione al profesor que mejor se adapte a sus necesidades. Evalúe la presentación del profesor, explore sus validadores de experiencia que respaldan su conocimiento y revise su horario disponible. </p><p>Esta evaluación le proporcionará una visión integral para tomar una decisión informada sobre el profesional que guiará su aprendizaje de manera efectiva.</p>
                              </div>
                        </Col>
                        <Col md={6}>
                             <div className='p-4'>
                                    <img
                                          src={'https://aprende-pe-bucket-1.s3.amazonaws.com/static/student_step_2.jpg'}
                                          alt="Paso 2"
                                          className="w-full h-auto object-cover rounded-xl"
                                    />
                              </div>
                        </Col>
                        
                  </Row>
                  <Row>
                        <Col md={6} className='order-2 order-md-1'>
                             <div className='p-4'>
                                    <img
                                          src={'https://aprende-pe-bucket-1.s3.amazonaws.com/static/student_step_3.jpg'}
                                          alt="Paso 3"
                                          className="w-full h-auto object-cover rounded-xl"
                                    />
                              </div>
                        </Col>
                        <Col md={6} className='order-1 order-md-2'>
                              <div className='p-4 flex flex-col h-full items-start justify-center text-justify'>
                                    <h4>Haga una reserva</h4>
                                    <p>Después de elegir al profesor perfecto, realice una reserva del tiempo disponible en su horario. Durante este proceso, tenga la tranquilidad de saber que puede comunicarse de manera segura con el profesor a través de nuestro <b>servicio de chat</b>. </p><p>Esta función le brinda la oportunidad de coordinar detalles adicionales, aclarar dudas y garantizar que la experiencia de aprendizaje se adapte completamente a sus expectativas. En Aprende.Pe, la comunicación efectiva entre profesores y alumnos es clave para un aprendizaje exitoso.</p>
                              </div>
                         </Col>
                  </Row>
            </Container>

            <Container>
                  <Row>
                        <Col>
                              <h2 className='font-bold flex justify-center mt-4'>Preguntas frecuentes</h2>
                              <hr></hr>
                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 1 ? setOpenQuestion(1) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo selecciono el profesor y el curso que mejor se adapten a mis necesidades?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 1 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 1 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 1 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Para encontrar el profesor y curso ideales, puedes utilizar nuestros filtros de búsqueda. Refina tu búsqueda según la categoría del curso, ubicación del profesor, horarios disponibles y las calificaciones proporcionadas por otros estudiantes. De esta manera, podrás tomar decisiones informadas basadas en tus necesidades y preferencias.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 2 ? setOpenQuestion(2) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué debo hacer si tengo preguntas específicas antes de reservar una clase?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 2 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 2 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 2 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Antes de reservar una clase, puedes utilizar la función de chat para comunicarte directamente con el profesor. Plantea todas tus preguntas, inquietudes o solicitudes especiales. Esto te permitirá obtener información detallada y garantizar que la clase cumpla con tus expectativas.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 3 ? setOpenQuestion(3) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo sé que la información del profesor y sus cursos es confiable?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 3 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 3 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 3 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>La confianza es fundamental en nuestra plataforma. Revisamos y verificamos cuidadosamente la información proporcionada por cada profesor, incluyendo sus validadores de experiencia. Además, los comentarios y calificaciones de otros estudiantes te brindarán una perspectiva real sobre la calidad de la enseñanza y la experiencia global del profesor.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 4 ? setOpenQuestion(4) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué debo hacer si necesito cancelar o reprogramar una reserva?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 4 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 4 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 4 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>En caso de necesitar modificar una reserva, ya sea para cancelarla o reprogramarla, puedes comunicarte directamente con el profesor a través del chat incorporado en nuestra plataforma. Antes de hacerlo, te recomendamos revisar las políticas de cancelación establecidas por el profesor, disponibles en su perfil. Si necesitas asistencia adicional o encuentras dificultades para contactar al profesor, nuestro equipo de soporte en Aprende.Pe está disponible para brindarte la ayuda necesaria. Nos esforzamos por asegurar una experiencia educativa fluida y satisfactoria, proporcionando el respaldo necesario tanto a profesores como a alumnos.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 5 ? setOpenQuestion(5) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo puedo evaluar y proporcionar retroalimentación después de una clase?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 5 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 5 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 5 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Después de cada clase, tendrás la oportunidad de evaluar al profesor y proporcionar comentarios. Este proceso es fundamental para la comunidad educativa y ayuda a otros estudiantes a tomar decisiones informadas. Puedes calificar la clase y dejar un comentario detallado sobre tu experiencia, contribuyendo así a la transparencia y la calidad de la enseñanza en nuestra plataforma.</p>}

                        </Col>
                  </Row>
            </Container>
            

            
      </div>
      );
}

export default HomeScreen;
