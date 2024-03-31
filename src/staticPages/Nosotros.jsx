import React from 'react'
import { useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


function Nosotros() {
      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])
      return (
            <Container>
                  <Row className='py-5 items-center justify-center'>
                        <Col md={6} className='border rounded-xl p-4 mx-2 md:m-0 text-justify'>
                              <h5>Nosotros</h5>
                              <p>Bienvenido a <b>Aprende.pe</b>, donde la excelencia académica y la accesibilidad se encuentran en perfecta armonía. Somos un equipo de estudiantes apasionados de diversas disciplinas, desde Ingeniería Industrial hasta Ciencias de la Computación y Administración de Negocios Internacionales. Nos unimos con un propósito común: abordar una necesidad crítica en el mundo universitario.</p>

                              <p>Nuestra historia comienza como la de muchos estudiantes universitarios. Pasamos noches en vela, luchando con conceptos complejos, enfrentando desafíos académicos y a menudo, sintiéndonos frustrados por la falta de recursos adecuados. Observamos cómo nuestros compañeros enfrentaban las mismas dificultades, buscando desesperadamente ayuda, solo para encontrar que los profesores disponibles no se ajustaban a sus horarios o presupuestos limitados.</p>

                              <p>Nos dimos cuenta de una brecha significativa en el sistema educativo: la dificultad para encontrar ayuda académica personalizada y asequible. Las academias tradicionales a menudo imponen tarifas prohibitivas, dejando a muchos estudiantes sin acceso a la asistencia que tanto necesitan. Esta situación no solo afectaba el rendimiento académico, sino que también generaba estrés y desmotivación entre nuestros colegas.</p>

                              <p>Decidimos tomar cartas en el asunto. Nos comprometimos a crear una solución innovadora que conectara a estudiantes con mentores cualificados de manera eficiente y accesible. Así nació <b>Aprende.pe</b>, una plataforma diseñada para romper las barreras entre el conocimiento y aquellos que lo buscan.</p>

                              <p>En <b>Aprende.pe</b>, creemos en la colaboración y el empoderamiento mutuo. Nuestro equipo está compuesto por mentes jóvenes y creativas, dedicadas a construir un entorno educativo donde cada estudiante pueda alcanzar su máximo potencial. Nos esforzamos por brindar un servicio excepcional, donde la calidad y la accesibilidad se fusionan para crear una experiencia de aprendizaje verdaderamente enriquecedora.</p>

                              <p>Una de las características más distintivas de nuestra plataforma es la rigurosa validación de la experiencia de nuestros profesores. Cada mentor que se une a <b>Aprende.pe</b> es sometido a un proceso de evaluación exhaustivo, garantizando que solo los mejores y más calificados estén disponibles para nuestros usuarios. Además, entendemos la importancia del tiempo y la flexibilidad. Por eso, hemos creado un sistema que permite a los estudiantes reservar sesiones con profesores que se ajusten a sus horarios y presupuestos individuales.</p>

                              <p>En <b>Aprende.pe</b>, no solo ofrecemos un servicio, sino que también creamos una comunidad. Nos enorgullece ser una plataforma donde los estudiantes pueden conectarse, colaborar y crecer juntos. Cada interacción, cada sesión de tutoría, es una oportunidad para aprender, inspirar y transformar vidas.</p>

                              <p>Únete a nosotros en nuestro viaje hacia un futuro educativo más inclusivo y accesible. Juntos, podemos alcanzar nuevas alturas y superar cualquier desafío que se presente en el camino. En <b>Aprende.pe</b>, el conocimiento no tiene límites, ¡y tú tampoco!</p>

                              <p><b>Aprende.pe</b>: Donde el aprendizaje se convierte en un viaje emocionante y accesible para todos.</p>

                        </Col>
                  </Row>
            </Container>
      )
}

export default Nosotros