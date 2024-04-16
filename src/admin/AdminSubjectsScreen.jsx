import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, FormControl, Card, Dropdown, Badge, Modal, Button, OverlayTrigger, Tooltip, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, CONTACT_PHONE, CONTACT_EMAIL } from '../utils'

import CreateSubjectCategory from '../admin_components/CreateSubjectCategory';
import CreateUniversity from '../admin_components/CreateUniversity';
import CreateSubjectList from '../admin_components/CreateSubjectList';
import CreateUniversityDegree from '../admin_components/CreateUniversityDegree';
import CreateSubjectListUniversity from '../admin_components/CreateSubjectListUniversity';




function AdminSubjectsScreen({ userInfo, categories, universities }) {
      const [showUniversities, setShowUniversities] = useState(false)
      const [openUniversity, setOpenUniversity] = useState(null)
      const [openCategory, setOpenCategory] = useState(null)

      // 1 for create subject category 
      // 2 for create university
      // 3 for create subject list for subject category - REQUIRES SUBJECT CATEGORY
      // 4 for create subject category list for universiy - REQUIRES UNIVERSITY
      // 5 for create subject list for subject category of university - REQUIRES SUBJECT CATEGORY OF UNIVERSITY
      const [displayedForm, setDisplayedForm] = useState(0)


      // open specific university
      const handleOpenUniversity = (university) => {
            if(openUniversity == university){
                  setOpenUniversity(null)
                  setDisplayedForm(0)
            } else {
                  setOpenUniversity(university)
            }
      }
      // open specific category
      const handleOpenCategory = (category) => {
            if(openCategory == category){
                  setOpenCategory(null)
                  if(displayedForm == 3) {
                        setDisplayedForm(0)
                  }

            } else {
                  setOpenCategory(category)
            }
      }

      // forms 1 and 2: create subject category or create university
      const handleFirstForms = () => {
            if(showUniversities) {
                  setDisplayedForm(2)
            } else {
                  setDisplayedForm(1)
            }
      }

      // forms 3 
      const handleThirdForm = () => {
            setDisplayedForm(3)
      }

      // forms 4
      const handleFourthForm = () => {
            setDisplayedForm(4)
      }

      // forms 5
      const handleFifthForm = () => {
            setDisplayedForm(5)
      }


      return (
            <Container >
                  <Row className='my-4 px-3 p-md-0'>
                        <Col md={4} className='border rounded-xl p-3 max-h-96 overflow-auto' >
                              <h5 className='mb-3'><span className={`select-none ${showUniversities ? 'text-gray-400 font-normal' : ''}`} onClick={() => setShowUniversities(false)}>Categorias</span> <span className='text-gray-200 font-thin'>|</span> <span className={`select-none ${showUniversities ? '' : 'text-gray-400 font-normal'}`} onClick={() => setShowUniversities(true)}>Universidades</span></h5>
                              <div className='bg-gray-400 text-white px-2 py-1 rounded-xl text-md mb-3 flex align-items-center justify-content-center select-none' onClick={() => handleFirstForms()}
                              onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                              onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                              >
                                    Crear {showUniversities ? 'universidad' : 'categoria'}<img src='/plus_icon.png' alt="+" className="ml-2 w-3 h-3"
                                    style={{
                                          transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                    }}
                                    onLoad={(e) => e.target.classList.add('spin-on-load')}
                                    />
                              </div>
                              { 
                                    showUniversities ? 
                                          !universities.loading ? universities.universities !== undefined && universities.universities !== null ? universities.universities.slice().reverse().map((university, i) => (
                                                <div key={i}>
                                                      <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenUniversity(university)}>
                                                            <h6>{university.name}</h6>
                                                            <img className={`w-3 h-3 transition-transform transform ${university.id == openUniversity ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                      </div>
                                                      <div className={`mt-3 transition-transform transform ${university == openUniversity ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                            {
                                                            university == openUniversity ? <>
                                                                  <div onClick={() => handleFourthForm()} className='flex align-items-center bg-gray-400 text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                  onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                                                  onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                                                  >
                                                                        Crear Carreras<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                                                        style={{
                                                                              transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                                        }}
                                                                        onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                                  /></div>
                                                                  {
                                                                        university.degrees !== undefined && university.degrees !== null ? university.degrees.slice().reverse().map((degree, j) => (
                                                                              degree.is_university_degree ?
                                                                                    <div key={j}>
                                                                                    <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenCategory(degree)}>
                                                                                          <span>{degree.name}</span>
                                                                                          <img className={`w-3 h-3 transition-transform transform ${degree == openCategory ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                                                    </div>
                                                                                    <div className={`flex flex-wrap mt-3 transition-transform transform ${degree == openCategory ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                                                          {
                                                                                                degree == openCategory ? <>
                                                                                                      <div onClick={() => handleFifthForm()} className='flex align-items-center bg-gray-400 text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                                      onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                                                                                      onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                                                                                      >
                                                                                                            Crear Cursos<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                                                                                            style={{
                                                                                                                  transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                                                                            }}
                                                                                                            onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                                                                      /></div>
                                                                                                      {
                                                                                                            degree.subjects !== undefined && degree.subjects !== null ? degree.subjects.slice().reverse().map((subject, k) => (
                                                                                                                  subject.is_university_subject ?
                                                                                                                        <div key={k} style={{backgroundColor:ORANGE}} onClick={() => handleAddSubject(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                                                        onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                                                                                                        onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                                                                                                        >
                                                                                                                              {subject.name}</div>
                                                                                                                  : null
                                                                                                            )) : null
                                                                                                      }
                                                                                                </> : null
                                                                                          }
                                                                                    </div>
                                                                                    </div>
                                                                              : null
                                                                        )) : null
                                                                  }
                                                            </> : null
                                                            }
                                                      </div>
                                                </div> 
                                          )) : "Error" : 
                                          <img
                                                src="/tail_blue_fast.svg"
                                                alt="Loading..."
                                                className="max-h-32 "
                                          />
                                     : 
                                          !categories.loading ? categories.categories !== undefined && categories.categories !== null ? categories.categories.slice().reverse().map((category,i) => (
                                                <div key={i}>
                                                      <div  className='flex justify-between align-items-center border-b p-2 select-none' onClick={() => handleOpenCategory(category)}>
                                                            <h6>{category.name}</h6>
                                                            <img className={`w-3 h-3 transition-transform transform ${category == openCategory ? 'rotate-180' : ''}`} src="/down_arrow_icon.png" />
                                                      </div>
                                                      <div className={`flex flex-wrap mt-3 transition-transform transform ${category == openCategory ? 'origin-top-left scale-100' : 'origin-top-left scale-75'}`}>
                                                            
                                                            {
                                                                  category == openCategory ? <>
                                                                        <div onClick={() => handleThirdForm()} className='flex align-items-center bg-gray-400 text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                        onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                                                        onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                                                        >
                                                                              Crear Cursos<img className='w-3 h-3 ml-2' src="/plus_icon.png" 
                                                                              style={{
                                                                                    transition: 'transform 1s cubic-bezier(0.43, 0.13, 0.23, 0.96)'
                                                                              }}
                                                                              onLoad={(e) => e.target.classList.add('spin-on-load')}
                                                                        /></div>
                                                                        {
                                                                              category.subjects !== undefined && category.subjects !== null ? category.subjects.map((subject, j) => (
                                                                                    !subject.is_university_subject ?
                                                                                          <div key={j} style={{backgroundColor:BLUE}} onClick={() => handleAddSubject(subject)} className='flex align-items-center text-white rounded-xl px-2 py-1 mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105'
                                                                                    
                                                                                          onMouseOver={(e) => e.target.children[0]?.classList.add('spin-on-hover')}
                                                                                          onMouseOut={(e) => e.target.children[0]?.classList.remove('spin-on-hover')}
                                                                                          >
                                                                                                {subject.name}</div>
                                                                                    : null
                                                                              )) : null
                                                                        }
                                                                  </> : null
                                                            }
                                                            
                                                      </div>
                                                      
                                                </div> 
                                          )) : "Error" :
                                          <img
                                                src="/tail_blue_fast.svg"
                                                alt="Loading..."
                                                className="max-h-32 "
                                          />
                                    
                              }      
                        </Col>
                        <Col md={8} >
                              {
                                    displayedForm == 1 && 
                                    <CreateSubjectCategory userInfo={userInfo} categories={categories} />
                              }
                              {
                                    displayedForm == 2 && 
                                    <CreateUniversity  userInfo={userInfo} universities={universities} />
                              }
                              {
                                    displayedForm == 3 && 
                                    <CreateSubjectList  userInfo={userInfo} categories={categories} openCategory={openCategory} />
                              }
                              {
                                    displayedForm == 4 && 
                                    <CreateUniversityDegree  userInfo={userInfo} universities={universities} openUniversity={openUniversity}/>
                              }
                              {
                                    displayedForm == 5 && 
                                    <CreateSubjectListUniversity  userInfo={userInfo} universities={universities}  openCategory={openCategory} />
                              }
                        </Col>
                  </Row>
            </Container>
      )
}




export default AdminSubjectsScreen