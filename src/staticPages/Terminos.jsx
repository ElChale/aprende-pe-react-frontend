import React from 'react'
import { useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { CONTACT_EMAIL } from '../utils';

function Terminos() {
      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])
      return (
            <Container>
                  <Row className='py-5 items-center justify-center'>
                        <Col md={6} className='border rounded-xl p-4 mx-2 md:m-0 text-justify' >
                        <h4>Privacidad y Términos de <b>Aprende.pe</b></h4>

                              <h4 className='text-left'>Introducción</h4>
                              <p>Bienvenido/a a <b><b>Aprende.pe</b></b>, una plataforma innovadora diseñada para conectar a profesores y estudiantes de cursos regulares y universitarios, facilitando el proceso de enseñanza-aprendizaje. En <b>Aprende.pe</b>, nos enorgullece brindar un servicio de calidad superior, respetando la privacidad y seguridad de nuestros usuarios como prioridad máxima. Los presentes Términos y Condiciones, junto con nuestra Política de Privacidad, regulan el uso de nuestra plataforma y servicios relacionados. Al acceder y utilizar nuestra plataforma, aceptas cumplir con estos términos de manera vinculante. Si no estás de acuerdo con alguna de las disposiciones, te pedimos que no utilices nuestros servicios.</p>

                              <h4 className='text-left'>Recopilación y Uso de Información Personal</h4>
                              <p>En <b>Aprende.pe</b>, recopilamos información personal de nuestros usuarios con el fin de mejorar su experiencia, ofrecerles servicios personalizados y mantener un entorno seguro y confiable. La información recopilada puede incluir, pero no se limita a:</p>
                              <ul>
                              <li>Nombre y apellidos (opcional)</li>
                              <li>Número de teléfono</li>
                              <li>Edad (opcional)</li>
                              <li>Idioma preferido (opcional)</li>
                              <li>Correo electrónico</li>
                              </ul>

                              <p>Adicionalmente, para los usuarios registrados como profesores, solicitamos información adicional relevante, como:</p>
                              <ul>
                              <li>Descripción personal y biografía</li>
                              <li>Ubicación geográfica (opcional)</li>
                              <li>Cursos o materias que imparten</li>
                              <li>Experiencia docente y calificaciones (opcional)</li>
                              </ul>

                              <p>Esta información es utilizada únicamente con fines de personalización de servicios, mejora de la plataforma, comunicaciones relevantes y cumplimiento de obligaciones legales. En ningún caso, tu información personal será vendida o compartida con terceros sin tu consentimiento expreso.</p>

                              <h4 className='text-left'>Seguridad de la Información</h4>
                              <p>En <b>Aprende.pe</b>, nos tomamos muy en serio la protección de tus datos personales y la seguridad de tu información. Hemos implementado medidas de seguridad avanzadas, incluyendo cifrado de datos, protocolos de autenticación y control de acceso, para salvaguardar la información de nuestros usuarios contra accesos no autorizados, divulgación o destrucción. Nuestros sistemas de almacenamiento de datos están alojados en centros de datos seguros de Amazon Web Services (AWS), reconocidos por sus altos estándares de seguridad y privacidad.</p>

                              <p>Te recomendamos no ingresar información sensible o confidencial que no sea estrictamente necesaria para el uso de nuestra plataforma.</p>

                              <h4>Términos de Pago y Cancelación</h4>
                              <p>Los profesores deberán abonar una suscripción mensual para poder aparecer en las búsquedas de la plataforma y acceder a todas las funcionalidades disponibles. Los usuarios pueden cancelar su suscripción en cualquier momento, pero no se realizarán reembolsos por servicios ya pagados. Al aceptar estos términos, se comprometen a cumplir con los pagos mensuales mientras su servicio esté activo, y a proporcionar información de pago precisa y actualizada.</p>

                              <p><b>Aprende.pe</b> se reserva el derecho de modificar los planes de suscripción y precios en cualquier momento, previa notificación a los usuarios con un plazo razonable. Los nuevos precios entrarán en vigencia al término del período de suscripción actual.</p>

                              <h4 className='text-left'>Modificaciones y Cambios</h4>
                              <p>Nos reservamos el derecho de modificar estos Términos y Condiciones, así como nuestra Política de Privacidad, en cualquier momento. Cualquier cambio será comunicado a través de nuestra plataforma o por correo electrónico con un plazo razonable de anticipación. Es responsabilidad del usuario revisar periódicamente estos términos para mantenerse al tanto de las actualizaciones y cambios.</p>

                              <p>Si no estás de acuerdo con las modificaciones realizadas, tienes la opción de cancelar tu suscripción y dejar de utilizar nuestros servicios. La continuación del uso de la plataforma después de la entrada en vigencia de los cambios se considerará como la aceptación de los nuevos términos y condiciones.</p>

                              <h4 className='text-left'>Contacto</h4>
                              <p>Si tienes alguna pregunta, inquietud, sugerencia o reclamo relacionado con nuestros Términos y Condiciones, Política de Privacidad o cualquier otro aspecto de nuestros servicios, no dudes en contactarnos a través de <b>{CONTACT_EMAIL}</b>. Nuestro equipo de atención al cliente estará encantado de asistirte y resolver cualquier consulta o problema que puedas tener.</p>

                              <p>En <b>Aprende.pe</b>, nos esforzamos por brindar una experiencia de aprendizaje segura, confiable y enriquecedora. Gracias por elegirnos y formar parte de nuestra comunidad educativa.</p>

                              <p>Fecha de entrada en vigor: 01/04/2024<br></br>
                              Última actualización: 01/04/2024</p>
                        </Col>
                  </Row>
            </Container>
      )
}

export default Terminos