import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

function FAQS() {
      //DIFERENTIALS AND QUESTIONS
      const [openQuestion, setOpenQuestion] = useState(1)

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])
      return (
            <Container className=''>
                  <Row className='py-4'>
                        <Col>
                              <h4>Preguntas Frecuentes</h4>
                              

                        </Col>
                  </Row>
                  <Row >
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 1 ? setOpenQuestion(1) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué son los validadores de experiencia?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 1 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 1 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 1 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Los validadores de experiencia constituyen una herramienta fundamental para respaldar y validar su pericia en áreas específicas de enseñanza. Al utilizar este recurso, usted puede subir documentos que certifiquen su experiencia o conocimientos relacionados con cursos específicos. <br />Para completar este proceso, simplemente ingrese los cursos que desea validar, adjunte el archivo de imagen de validación y proporcione una breve justificación textual. Es importante destacar que puede elegir mantener la privacidad de estos documentos, ya que puede indicar si desea que sean públicos o no. <br /> Nuestro equipo en Aprende.Pe revisará y aprobará estos documentos una vez sean validados. Una vez aprobados, los usuarios podrán visualizarlos en su perfil de profesor, brindándole una constancia tangible de su competencia en los cursos que imparte.</p>}

                        </Col>
                  </Row>
                  <Row >
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 2 ? setOpenQuestion(2) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo establezco el método de pago?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 2 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 2 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 2 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>En su perfil de profesor, siempre tendrá la posibilidad de editar y configurar su método de pago preferido. Facilitamos dos formas de mostrar esta información: a través de un archivo de imagen y un cuadro de texto. <br/>Puede subir un código QR de plataformas como Yape o Plin, o ingresar detalles como números de cuenta bancaria u otros métodos de pago. Los usuarios podrán visualizar esta información al realizar una reserva y deberán adjuntar un comprobante de pago, el cual deberá validar que el estudiante ha realizado el pago a través del método que usted ha indicado.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 3 ? setOpenQuestion(3) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué sucede si un alumno no paga?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 3 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 3 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 3 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Una vez que un alumno realiza una reserva, puede revisar la información en su perfil de profesor y evaluar el comprobante de pago adjunto. En caso de detectar fraude o invalidez en el comprobante, tiene la opción de cancelar la reserva mediante el botón de edición. <br/>Es importante que incluya una justificación para la cancelación. Nuestro equipo en Aprende.Pe evaluará la situación y podrá tomar medidas, incluso la posibilidad de restringir al usuario en cuestión.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 4 ? setOpenQuestion(4) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo atiendo de forma efectiva a un alumno que compra una reserva?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 4 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 4 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 4 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Cuando un alumno compra una reserva según su disponibilidad de horarios, podrá visualizar la información en su perfil de profesor. Puede editar la reserva para agregar un comprobante de pago y/o una invitación textual que el alumno podrá leer para ponerse en contacto con usted. <br/>Además, tanto usted como el alumno pueden iniciar un chat privado y seguro en nuestro servicio de mensajes, donde podrán coordinar los detalles de los servicios que el alumno desea y cómo usted puede proporcionarlos de manera efectiva.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 5 ? setOpenQuestion(5) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo mejoro mi rating como profesor?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 5 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 5 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 5 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>La mejora de su calificación como profesor se logra a través de reservas válidas y el cumplimiento exitoso del tiempo reservado. Una vez concluida la reserva, el alumno puede agregar un comentario con una calificación y un mensaje de feedback. Las reservas válidas no solo contribuyen a su perfil con horas enseñadas, sino que también suman calificaciones, aumentando su visibilidad y posicionamiento en los resultados de búsqueda de nuestra plataforma.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 6 ? setOpenQuestion(6) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo selecciono el profesor y el curso que mejor se adapten a mis necesidades?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 6 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 6 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 6 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Para encontrar el profesor y curso ideales, puedes utilizar nuestros filtros de búsqueda. Refina tu búsqueda según la categoría del curso, ubicación del profesor, horarios disponibles y las calificaciones proporcionadas por otros estudiantes. De esta manera, podrás tomar decisiones informadas basadas en tus necesidades y preferencias.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 7 ? setOpenQuestion(7) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué debo hacer si tengo preguntas específicas antes de reservar una clase?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 7 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 7 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 7 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Antes de reservar una clase, puedes utilizar la función de chat para comunicarte directamente con el profesor. Plantea todas tus preguntas, inquietudes o solicitudes especiales. Esto te permitirá obtener información detallada y garantizar que la clase cumpla con tus expectativas.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 8 ? setOpenQuestion(8) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo sé que la información del profesor y sus cursos es confiable?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 8 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 8 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 8 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>La confianza es fundamental en nuestra plataforma. Revisamos y verificamos cuidadosamente la información proporcionada por cada profesor, incluyendo sus validadores de experiencia. Además, los comentarios y calificaciones de otros estudiantes te brindarán una perspectiva real sobre la calidad de la enseñanza y la experiencia global del profesor.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 9 ? setOpenQuestion(9) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Qué debo hacer si necesito cancelar o reprogramar una reserva?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 9 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 9 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 9 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>En caso de necesitar modificar una reserva, ya sea para cancelarla o reprogramarla, puedes comunicarte directamente con el profesor a través del chat incorporado en nuestra plataforma. Antes de hacerlo, te recomendamos revisar las políticas de cancelación establecidas por el profesor, disponibles en su perfil. Si necesitas asistencia adicional o encuentras dificultades para contactar al profesor, nuestro equipo de soporte en Aprende.Pe está disponible para brindarte la ayuda necesaria. Nos esforzamos por asegurar una experiencia educativa fluida y satisfactoria, proporcionando el respaldo necesario tanto a profesores como a alumnos.</p>}

                        </Col>
                  </Row>
                  <Row>
                        <Col>
                              <div className='flex items-center' onClick={() => {openQuestion !== 10 ? setOpenQuestion(10) : setOpenQuestion(null)}}>
                                    <h5 className='m-0'>¿Cómo puedo evaluar y proporcionar retroalimentación después de una clase?</h5>
                                    <img className={`w-5 h-5 ml-auto transition-transform transform ${openQuestion == 10 ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                              </div>
                              <hr></hr>
                              {openQuestion == 10 && <p className={`mt-3 text-lg p-4 bg-gray-100 border rounded-xl transition-transform transform ${openQuestion == 10 ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>Después de cada clase, tendrás la oportunidad de evaluar al profesor y proporcionar comentarios. Este proceso es fundamental para la comunidad educativa y ayuda a otros estudiantes a tomar decisiones informadas. Puedes calificar la clase y dejar un comentario detallado sobre tu experiencia, contribuyendo así a la transparencia y la calidad de la enseñanza en nuestra plataforma.</p>}

                        </Col>
                  </Row>
                  
            </Container>
      )
}

export default FAQS