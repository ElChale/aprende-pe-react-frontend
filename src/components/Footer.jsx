import React from 'react'
import { Row, Col, Navbar, Nav, Container } from 'react-bootstrap'
import { BASE_URL, BLUE, CONTACT_EMAIL, CONTACT_PHONE, WHATSAP_COMUNIDAD } from '../utils'
import { useNavigate } from 'react-router-dom'

function Footer() {
      const navigate = useNavigate()

      const homePage = () => {
            navigate('/')
      }
      const findClassesPage = () => {
            navigate('/findclasses')
      }
      const myClassesPage = () => {
            navigate('/myclasses')
      }
      const chatsPage = () => {
            navigate('/chats')
      }

      const userPage = () => {
            navigate('/user')
      }

      const suggestionsPage = () => {
            navigate('/suggestions')
      }

      const teacherProfilePage = () => {
            navigate('/teacher-profile')
            setShowMenu(false)
      }

      const nosotrosPage = () => {
            navigate('/Nosotros')
      }

      const faqsPage = () => {
            navigate('/FAQS')
      }

      const terminosPage = () => {
            navigate('/Terminos')
      }

      //https://www.instagram.com/aprende.pe_/
      return (
            <div /*style={{backgroundImage: "linear-gradient(to top, #0f1e47, #000000)"}}*/ className='bg-gray-800 text-gray-400'>
                  <Container className='py-10'>
                        <Row className='px-4 px-sm-2'>
                              <Col sm={12} md={3} className=''>
                                    <div onClick={homePage}>
                                          <img
                                                src="/new_large_logo_white.png"
                                                alt="Aprende Pe Logo"
                                                className="max-h-16 py-2 pr-lg-5 mb-3"
                                          />
                                    </div> 
                                    
                              </Col>

                              <Col xs={6} sm={3} md={2} className='py-3'>
                                    <h6 className='mb-8 text-white'>Páginas</h6>

                                    <p onClick={homePage} className='mb-2 select-none hover:text-gray-100'>Inicio</p>
                                    <p onClick={findClassesPage} className='mb-2 select-none hover:text-gray-100'>Encuentra Clases</p>
                                    <p onClick={myClassesPage} className='mb-2 select-none hover:text-gray-100'>Tus Clases</p>
                                    <p onClick={chatsPage} className='mb-2 select-none hover:text-gray-100'>Chats</p>
                                    <p onClick={teacherProfilePage} className='mb-2 select-none hover:text-gray-100'>Se Profesor</p>
                                    <p onClick={userPage} className='mb-2 select-none hover:text-gray-100'>Iniciar Sesión</p>
                                    <p onClick={suggestionsPage} className='mb-2 select-none hover:text-gray-100'>Sugerencias</p>
                                    
                              </Col>

                              

                              <Col xs={6} sm={3} md={2} className='py-3'>
                                    <h6 className='mb-8 text-white'>Recursos</h6>

                                    <p onClick={nosotrosPage} className='mb-2 select-none hover:text-gray-100'>Nosotros</p>
                                    <p onClick={faqsPage} className='mb-2 select-none hover:text-gray-100'>FAQ's</p>
                                    <p onClick={terminosPage} className='mb-2 select-none hover:text-gray-100'>Privacidad y Términos</p>
                                    
                              </Col>

                              <Col xs={6} sm={3} md={2} className='py-3'>
                                    <h6 className='mb-8 text-white'>Síguenos</h6>

                                    <p onClick={() => {window.open('https://www.instagram.com/aprende.pe_', '_blank')}} className='mb-2 select-none hover:text-gray-100'>Instagram</p>
                                    <p onClick={() => {window.open('https://www.tiktok.com/@aprende.pe_', '_blank')}} className='mb-2 select-none hover:text-gray-100'>TikTok</p>
                                    <p onClick={() => {window.open(WHATSAP_COMUNIDAD, '_blank')}} className='mb-2 select-none hover:text-gray-100'>Comunidad whatsapp</p>

                              </Col>  

                              <Col xs={6} sm={3} md={2} className='py-3'>
                                    <h6 className='mb-8 text-white'>Soporte</h6>

                                    <p onClick={() => {window.open(WHATSAP_COMUNIDAD, '_blank')}} className='mb-2 select-none hover:text-gray-100'>Comunidad whatsapp</p>
                                    <p onClick={() => {window.open(`https://api.whatsapp.com/send?phone=${CONTACT_PHONE}&text=Hola%20quiero%20informaci%C3%B3n%20acerca%20de%20aprende.pe`, '_blank')}} className='mb-2 select-none hover:text-gray-100'>Soporte whatsapp</p>
                                    <p onClick={() => {window.open(`mailto:${CONTACT_EMAIL}?subject=Consulta%20general%20acerca%20de%20Aprende.pe&body=Estimado%20equipo%20de%20Aprende.pe%2C%20tengo%20una%20consulta%20acerca%20de%20la%20plataforma`, '_blank')}} className='mb-2 select-none hover:text-gray-100'>Email</p>
                                    
                              </Col>
                        </Row>
                        
                  </Container>
            </div>
   
      )
}

export default Footer