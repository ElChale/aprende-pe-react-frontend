import React from 'react'
import { BASE_URL, BLUE, PINK, ORANGE, GREEN, GRAY } from '../utils'

/**
 * @returns list of reservations
 * if @isTeacher == true, each item will display info of the the student (user)
 * if @isTeacher == false, each item will display info of the the teacher 
 * (a reservation has a teacher and a student)
 */
function ReservationList({ list=[], handleOpenItem=()=>{}, isLoading=false, isTeacher=false, page=1, handlePageChange, pageError='XD' }) {
      return ( 
            <>
                  <div className='flex px-3 py-1 border-t border-x rounded-t-xl'>
                        <div className='w-1/4 pl-2'>{isTeacher ? 'Alumno' : 'Profesor'}</div>
                        <div className='w-1/3 text-end pr-2'>Fecha</div>
                        <div className='w-1/3 text-end pr-2'>Horas</div>
                  </div>
                  <div className='border py-2 px-3 h-96 overflow-y-scroll overflow-x-hidden'> 
                        
                        {
                              list?.length === 0 && <div className='p-2'>{isTeacher ? 'Aqui apareceran las reservas hechas por estudiantes en su perfil' : 'Aqui apareceran las reservas realizadas por usted'}</div>
                        }
                        {
                              !isLoading ? list?.length > 0 && list?.map((reservation, i) => 
                                    <div key={i} onClick={() => {handleOpenItem(reservation)}} className='rounded-3xl p-2 mb-2 text-white flex items-center select-none shadow-none hover:shadow-lg scale-y-100 hover:scale-y-105' style={{backgroundColor:reservation?.canceled ? GRAY : BLUE}}>
                                          <div className='w-1/4 flex items-center' >
                                                <img src={isTeacher ? reservation?.user?.profile_image : reservation?.teacher?.user?.profile_image} className='w-10 h-10 rounded-full mr-2'/>
                                                <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className='m-0'>{isTeacher ? reservation?.user?.first_name : reservation?.teacher?.user?.first_name} {isTeacher ? reservation?.user?.last_name : reservation?.teacher?.user?.last_name}</p>
                                          </div>
                                          <div className='w-1/3 text-end'> 
                                                {new Date(reservation?.start_time)?.getDate().toString().padStart(2, '0')}/{(new Date(reservation?.start_time)?.getMonth() + 1)?.toString().padStart(2, '0')}/{new Date(reservation?.start_time)?.getFullYear()}
                                                
                                          </div>
                                          <div className='w-1/3 text-end'>{reservation?.total_duration} horas</div>
                                    </div>
                              ) : <div className='w-full p-2 flex items-center justify-center'>
                                    <img
                                          src="/tail_blue_fast.svg"
                                          alt="Loading..."
                                          className="max-h-32 "
                                    />
                              </div>
                        }
                  </div>
                  <div className='flex px-3 py-1 border-b border-x rounded-b-xl mb-4'>
                        Página
                        <div className='flex ml-2 items-center'>
                              <img onClick={() => {handlePageChange(-1)}} className={`w-3 h-3 ${page == 1 ? 'opacity-25' : 'scale-100 hover:scale-105'}`} src='/back_icon.png'/>
                              <div className='mx-2'>{page}</div>
                              <img onClick={() => {handlePageChange(1)}} className='w-3 h-3 scale-100 hover:scale-105' src='/forward_icon.png'/>
                              {pageError != null && pageError != '' && <span className='ml-2 text-red-400'>{pageError}</span>}
                        </div>
                        
                  </div>
            </>
      )
}

export default ReservationList