import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Card, Dropdown, Badge, OverlayTrigger, Tooltip, Button, ButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { weekDaysShortMapping, weekDaysMapping, monthNamesMapping, monthNamesShortMapping } from '../utils';
import { BASE_URL, BLUE, PINK, ORANGE, GREEN } from '../utils'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';



function Calendar({ reservations, events=[], weekly_schedule, constants, handleShowReservationModal, handleShowAvailableTimeModal }) {
      dayjs.extend(utc)
      dayjs.extend(timezone)

      const TIMEZONE = dayjs.tz.guess()

      const LIGHT_GRAY = '#F3F4F6' //E5E7EB
      const GRAY = '#D1D5DB' //9CA3AF
      const DARK_GRAY = '#1F2937'

      const reservations_dummy = [
            {
                  id:1,
                  start_time:"2024-01-03T11:00:00.000-05:00",
                  end_time:"2024-01-03T12:00:00.000-05:00",
                  class_type:"virtual",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:2,
                  start_time:"2024-01-03T19:00:00.000-05:00",
                  end_time:"2024-01-03T22:00:00.000-05:00",
                  class_type:"virtual",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:3,
                  start_time:"2023-12-29T08:30:00.000-05:00",
                  end_time:"2023-12-29T10:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:4,
                  start_time:"2023-12-29T09:00:00.000-05:00",
                  end_time:"2023-12-29T12:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:5,
                  start_time:"2023-12-29T10:00:00.000-05:00",
                  end_time:"2023-12-29T15:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:6,
                  start_time:"2023-12-29T10:00:00.000-05:00",
                  end_time:"2023-12-29T12:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:7,
                  start_time:"2023-12-29T11:00:00.000-05:00",
                  end_time:"2023-12-29T17:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:8,
                  start_time:"2023-12-29T11:00:00.000-05:00",
                  end_time:"2023-12-29T18:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:9,
                  start_time:"2023-12-29T11:00:00.000-05:00",
                  end_time:"2023-12-29T12:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:10,
                  start_time:"2023-12-29T12:00:00.000-05:00",
                  end_time:"2023-12-29T13:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
            {
                  id:11,
                  start_time:"2023-12-30T14:00:00.000-05:00",
                  end_time:"2023-12-30T16:00:00.000-05:00",
                  class_type:"virtual",
                  canceled:true,
                  total_price: 10,
                  coin: "PEN",
            },
         
      ]
      
      const weekly_schedule_dummy = [
            {
                  start_time:"2024-01-03T10:00:00.000-05:00",
                  end_time:"2024-01-03T13:00:00.000-05:00",
                  class_type:"virtual",
                  n_vacancies:2,
                  n_vacancies_taken:1,
                  is_flexible:true,
            },
            {
                  start_time:"2024-01-03T19:00:00.000-05:00",
                  end_time:"2024-01-03T22:00:00.000-05:00",
                  class_type:"virtual",
                  n_vacancies:1,
                  n_vacancies_taken:1,
                  is_flexible:false,
            },
            {
                  start_time:"2023-12-29T08:00:00.000-05:00",
                  end_time:"2023-12-29T18:00:00.000-05:00",
                  class_type:"presencial",
                  n_vacancies:10,
                  n_vacancies_taken:8,
                  is_flexible:true,
            },
            {
                  start_time:"2023-12-30T10:00:00.000-05:00",
                  end_time:"2023-12-30T12:00:00.000-05:00",
                  class_type:"virtual",
                  n_vacancies:3,
                  n_vacancies_taken:0,
                  is_flexible:false,
            },
            {
                  start_time:"2023-12-30T14:00:00.000-05:00",
                  end_time:"2023-12-30T18:00:00.000-05:00",
                  class_type:"virtual",
                  n_vacancies:1,
                  n_vacancies_taken:1,
                  is_flexible:true,
            },
      ]

      const events_dummy = [
            {
                  id:9,
                  start_time:"2024-01-04T13:00:00.000-05:00",
                  end_time:"2023-01-04T15:00:00.000-05:00",
                  class_type:"presencial",
                  canceled:false,
                  total_price: 10,
                  coin: "PEN",
            },
      ]


      //calendarDate is the date that is showed in the calendar
      const [calendarDate, setCalendarDate] = useState(new Date())
      //currentDate is the real current date and time
      const [currentDate, setCurrentDate] = useState(new Date())
      //calendarMode can be "month" "week" or "day"
      const [calendarMode, setCalendarMode] = useState("week")
      //calendarWidth makes the calendar responsive
      const [calendarWidth, setCalendarWidth] = useState(0)
      //useRef is used to scroll the calendar when loaded
      const calendarRef = useRef(null)
      const calendarListRef = useRef(null)

      //this is the array with the events to render in the calendar
      const [renderMatrixMonth, setRenderMatrixMonth] = useState([])
      const [renderMatrixWeek, setRenderMatrixWeek] = useState([])
      const [renderMatrixDay, setRenderMatrixDay] = useState([])
      const [renderMatrixList, setRenderMatrixList] = useState([])
      const [calendarListHeight, setCalendarListHeight] = useState(0)

      const calendarHeight = 300 + (calendarWidth >= 800 && 200)
      const calendarContentHeight = 600 + (calendarWidth >= 800 && 300)       
      const oneDay = 24 * 60 * 60 * 1000 //day in miliseconds

      const currentHour = currentDate.getHours()
      const currentMinute = currentDate.getMinutes()
      const currentDay = currentDate.getDate()
      const currentMonth = currentDate.getMonth() + 1 // Months are 0-indexed
      const currentYear = currentDate.getFullYear()

      const calendarDay = calendarDate.getDate()
      const calendarMonth = calendarDate.getMonth() + 1 // Months are 0-indexed
      const calendarYear = calendarDate.getFullYear()

      const numberOfDaysInCalendarMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate()
      const numberOfDaysInCalendarPreviousMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0).getDate()
      const numberOfDaysInCalendarNextMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 2, 0).getDate()

      const currentDayIndex = currentDate.getDay() % 7 + (currentDate.getDay() == 0 ? 6 : -1)
      const calendarDayIndex = calendarDate.getDay() % 7 + (calendarDate.getDay() == 0 ? 6 : -1)
      const calendarDayOfWeek = weekDaysMapping[calendarDayIndex]

      const calendarStartOfYear = new Date(calendarDate.getFullYear(), 0, 0)
      const calendarDiff = calendarDate - calendarStartOfYear
      const calendarDayOfYear = Math.floor(calendarDiff / oneDay)

      const currentStartOfYear = new Date(currentDate.getFullYear(), 0, 0)
      const currentDiff = currentDate - currentStartOfYear
      const currentDayOfYear = Math.floor(currentDiff / oneDay)

      
      function count_events_left(events_today, i) {
            let event = events_today[i]
            let start_time_i = event.start_time_i
            let end_time_i = event.end_time_i

            let n_events_left = 0
            for(let j = 0; j < i; j++){
                  let previous_event = events_today[j]
                  let previous_start_time_i = previous_event.start_time_i
                  let previous_end_time_i = previous_event.end_time_i
                  if(previous_start_time_i <= start_time_i && previous_end_time_i >= start_time_i) {
                        n_events_left += 1
                  }
            }
            if(n_events_left === 0) {
                  return 0
            } else {
                  let max_events_left = 0
                  for(let j = 0; j < i; j++){
                        let previous_event = events_today[j]
                        let previous_start_time_i = previous_event.start_time_i
                        let previous_end_time_i = previous_event.end_time_i
                        if(previous_start_time_i <= start_time_i && previous_end_time_i >= start_time_i) {
                              let previous_events_j = count_events_left(events_today, j)
                              if(previous_events_j > max_events_left){
                                    max_events_left = previous_events_j
                              }
                        }
                  }
                  return max_events_left + 1
            }
            
      }

      function count_events_right(events_today, i) {
            let event = events_today[i]
            let start_time_i = event.start_time_i
            let end_time_i = event.end_time_i

            let n_events_right = 0
            for(let j = i+1; j < events_today.length; j++){
                  let posterior_event = events_today[j]
                  let posterior_start_time_i = posterior_event.start_time_i
                  if(posterior_start_time_i >= start_time_i && posterior_start_time_i < end_time_i) {
                        n_events_right += 1
                  }
            }
            if(n_events_right === 0) {
                  return 0
            } else {
                  let max_events_right = 0
                  for(let j = i+1; j < events_today.length; j++){
                        let posterior_event = events_today[j]
                        let posterior_start_time_i = posterior_event.start_time_i
                        if(posterior_start_time_i >= start_time_i && posterior_start_time_i < end_time_i) {
                              let posterior_events_j = count_events_right(events_today, j)
                              if(posterior_events_j > max_events_right){
                                    max_events_right = posterior_events_j
                              }
                        }
                  }
                  return max_events_right + 1
            }
            
      }


      
      const handleChangeDay = (e, sign) => {
            e.preventDefault()
            let dayInterval = sign
            const newDate = new Date(calendarDate)

            if(calendarMode == "month") {
                  newDate.setDate(1)
                  newDate.setMonth(calendarDate.getMonth() + dayInterval)
                  newDate.setDate(1)
                  
            } else if(calendarMode == "week") {
                  dayInterval = 7 * sign
                  newDate.setDate(calendarDate.getDate() + dayInterval)
            } else {
                  newDate.setDate(calendarDate.getDate() + dayInterval)
            }
            setCalendarDate(newDate)
      }

      const handleChangeMode = (e, mode) => {
            setRenderMatrixDay([])
            setRenderMatrixMonth([])
            setRenderMatrixWeek([])
            e.preventDefault()
            if(mode == "month") {
                  const newDate = new Date(calendarDate)
                  newDate.setDate(1)
                  setCalendarDate(newDate)
            } else if (mode == "week") {
                  if(calendarDay == 1){
                        setCalendarDate(currentDate)
                  } 
            } else {
                  setCalendarDate(currentDate)
            }
            if(calendarMode==mode){
                  handleRenderMatrixUpdate()
            }
            setCalendarMode(mode)
            
            
         
      }
      
      const handleSelectDay = (e, year, month, day, minusDays=0) => {
            e.preventDefault()
            const newDate = new Date(year, month - 1, day)
            if(minusDays !== 0) {
                  newDate.setDate(newDate.getDate() + minusDays)
            }
            setCalendarDate(newDate)
            setCalendarMode("day")
      }
 
      const parentRef = useRef(null);
      const handleResize = () => {
            if (parentRef.current) {
                  const parentWidth = parentRef.current.offsetWidth
                  setCalendarWidth(parentWidth)
            }
            /*
            const windowsWidth = window.innerWidth
            let newWidth = 0
            if(windowsWidth < 1000){
                  newWidth = Math.round(windowsWidth * 0.9)
            } else if(windowsWidth < 2000){
                  newWidth = 800
            } else {
                  newWidth = 1500
            }
            setCalendarWidth(newWidth)
            */
      }

      const handleRenderMatrixUpdate = () => {
            //console.log("UPDATING RENDER MATRIX")
            if(calendarMode === "month"){
                  let render_matrix_month = []

                  let diff = 1 - calendarDayIndex
                  let firstDayOfCalendarRender = diff === 0 ? 1 : numberOfDaysInCalendarPreviousMonth + diff
                  let firstMonthRender = diff === 0 ? calendarMonth : calendarMonth === 1 ? 12 : calendarMonth - 1
                  let firstYearRender = diff !== 0 && calendarMonth === 1 ? calendarYear - 1 : calendarYear 
                  let dateRendering = new Date(firstYearRender, firstMonthRender-1, firstDayOfCalendarRender)
           
                  //going day by day of the current month, i is the current day
                  for(let week = 0; week < 6; week++) {
                        render_matrix_month.push([])
                        for(let day = 0; day < 7; day++) {
                              //console.log(dateRendering)
                              let schedule_today = []
                              let reservations_today = []
                              let teacher_events_today = []
                              let n_hours_available = 0
                              let n_reservations = 0
                              let n_teacher_events = 0
                              let n_canceled = 0

                              
                              for(let i = 0; i < weekly_schedule?.length; i++) {
                                    let schedule = {...weekly_schedule[i]}
                                    let startDate = new Date(schedule.start_time)      
                                    let endDate = new Date(schedule.end_time)
                                    
                                    if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                                    || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                                          schedule_today.push(schedule)
                                          let schedule_duration = endDate.getHours() - startDate.getHours()
                                          if(schedule.n_vacancies > schedule.n_vacancies_taken){
                                                n_hours_available += schedule_duration
                                          }
                                    }     
                              }
                              for(let i = 0; i < reservations?.length; i++) {
                                    let reservation = {...reservations[i]}
                                    let startDate = new Date(reservation.start_time)
                                    let endDate = new Date(reservation.end_time)

                                    if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                                    || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                                          reservations_today.push(reservation)      
                                          if(!reservation.canceled){
                                                n_reservations += 1
                                          } else {
                                                n_canceled += 1
                                          }
                                    }
                              }
                              for(let i = 0; i < events?.length; i++) {
                                    let teacher_event = {...events[i]}
                                    let startDate = new Date(teacher_event.start_time)
                                    let endDate = new Date(teacher_event.end_time)

                                    if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                                    || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                                          teacher_events_today.push(teacher_event)      
                                          if(!teacher_event.canceled){
                                                n_teacher_events += 1
                                          } else {
                                                n_canceled += 1
                                          }
                                    }
                              }

                              const render_day = {
                                    n_hours_available:n_hours_available,
                                    n_reservations:n_reservations,
                                    n_teacher_events:n_teacher_events,
                                    n_canceled:n_canceled,
                              }

                              render_matrix_month[week].push(render_day)
                              dateRendering.setDate(dateRendering.getDate() + 1)
                        }
                  }
                  setRenderMatrixMonth(render_matrix_month)
                  //console.log(render_matrix_month)
            }
            if(calendarMode === "week") {
                  let render_matrix_week = []

                  let diff = calendarDay - calendarDayIndex
                  let dateRendering = new Date(diff <= 0 && calendarMonth === 1 ? calendarYear - 1 : calendarYear , diff >= 0 ? calendarMonth - 1 : calendarMonth === 1 ? 12 : calendarMonth - 1 , calendarDate.getDate() - calendarDayIndex)
                  
                  for (let day = 0; day < 7; day++) {
                        render_matrix_week.push([])

                        let events_today = []

                        //extracting all reservations and available times of current day
                        for(let i = 0; i < weekly_schedule?.length; i++) {
                              let schedule_og = weekly_schedule[i]
                              let startDate = new Date(schedule_og.start_time)      
                              let endDate = new Date(schedule_og.end_time)
                              
                              if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                              || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                                    let schedule = {...schedule_og}
                                    schedule["type"] = "available"
                                    schedule["start_time"] = startDate.toISOString()
                                    schedule["end_time"] = endDate.toISOString()
                                    schedule["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                                    schedule["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                                    events_today.push(schedule)
                              }     
                        }
                        for(let i = 0; i < reservations?.length; i++) {
                              let reservation_og = reservations[i]
                              let startDate = new Date(reservation_og.start_time)
                              let endDate = new Date(reservation_og.end_time)

                              if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                              || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                                    let reservation = {...reservation_og}
                                    reservation["type"] = "reservation"
                                    reservation["start_time"] = startDate.toISOString()
                                    reservation["end_time"] = endDate.toISOString()
                                    reservation["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                                    reservation["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                                    events_today.push(reservation)      
                              }
                        }
                        for(let i = 0; i < events?.length; i++) {
                              let teacher_event_og = events[i]
                              let startDate = new Date(teacher_event_og.start_time)
                              let endDate = new Date(teacher_event_og.end_time)

                              if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                              || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                                    let teacher_event = {...teacher_event_og}
                                    teacher_event["type"] = "teacher_event"
                                    teacher_event["start_time"] = startDate.toISOString()
                                    teacher_event["end_time"] = endDate.toISOString()
                                    teacher_event["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                                    teacher_event["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                                    events_today.push(teacher_event)      
                              }
                        }
                        

                        events_today = events_today.sort((a, b) => {
                              const dateA = new Date(a.start_time_i);
                              const dateB = new Date(b.start_time_i);
                            
                              return dateA - dateB;
                        })

                        //filling each event information
                        for(let i = 0; i < events_today.length; i++) {
                              let event = events_today[i]

                              let start_time = event.start_time
                              let end_time = event.end_time

                              let start_time_i = event.start_time_i
                              let end_time_i = event.end_time_i

                              let n_events_left = count_events_left(events_today, i)
                              let n_events_right = count_events_right(events_today, i)
                            

                              let type = event.type
                              let class_type = event.class_type?.length > 0 ? event.class_type?.map((type_i) => ` - ${constants.class_types?.find(obj => obj?.id == type_i)?.name}` ) : constants.class_types?.find(obj => obj?.id == event.class_type)?.name
                              let first_class_type_id = event.class_type?.length > 0 ? event.class_type[0] : constants.class_types?.find(obj => obj?.id == event.class_type)?.id
                              let canceled = false
                              let closed = false
                              let n_vacancies_left = 0
                              let name = ""
                              let total_price = 0
                              let coin = ""
                              if(type === "reservation") {
                                    total_price = event.total_price
                                    coin = event.coin
                                    if(event.canceled === true){
                                          canceled = true
                                    }
                              }
                              if(type === "event") {
                                    name = event?.name
                                    if(event.canceled === true){
                                          canceled = true
                                    }
                              }
                              if(type == "available") {
                                    n_vacancies_left = event.n_vacancies - (event.n_vacancies_taken ?? 0)
                                    if(n_vacancies_left === 0) {
                                          closed = true
                                    }
                              }
                              const render_event = {
                                    id:event?.id ?? 0,
                                    start_time:start_time,
                                    end_time:end_time,
                                    start_time_i:start_time_i,
                                    end_time_i:end_time_i,
                                    n_events_left:n_events_left,
                                    n_events_right:n_events_right,
                                    type:type, //available reservation
                                    class_type:class_type, //virtual presencial
                                    first_class_type_id:first_class_type_id,
                                    canceled:canceled,
                                    closed:closed,
                                    n_vacancies_left:n_vacancies_left,
                                    name:name,
                                    total_price:total_price,
                                    coin:coin,
                              }
                              render_matrix_week[day].push(render_event)
                        }
                        
                        dateRendering.setDate(dateRendering.getDate() + 1)
                  }
                  setRenderMatrixWeek(render_matrix_week)
                  if (calendarRef.current) {
                        calendarRef.current.scrollTop = calendarContentHeight/3.7 //aprox 6:30am 
                  }
                  if (calendarListRef.current) {
                        calendarListRef.current.scrollTop = calendarContentHeight/3.7 //aprox 6:30am 
                  }

            }
            if(calendarMode === "day") {
                  let render_matrix_day = []
                  let dateRendering = calendarDate
                  let events_today = []

                  //extracting all reservations and available times of current day
                  for(let i = 0; i < weekly_schedule?.length; i++) {
                        let schedule_og = {...weekly_schedule[i]}
                        let startDate = new Date(schedule_og.start_time)      
                        let endDate = new Date(schedule_og.end_time)
                        
                        if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                        || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                              let schedule = {...schedule_og}
                              schedule["type"] = "available"
                              schedule["start_time"] = startDate.toISOString()
                              schedule["end_time"] = endDate.toISOString()
                              schedule["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                              schedule["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                              events_today.push(schedule)
                        }     
                  }
                  for(let i = 0; i < reservations?.length; i++) {
                        let reservation_og = {...reservations[i]}
                        let startDate = new Date(reservation_og.start_time)
                        let endDate = new Date(reservation_og.end_time)

                        if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                        || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                              let reservation = {...reservation_og}
                              reservation["type"] = "reservation"
                              reservation["start_time"] = startDate.toISOString()
                              reservation["end_time"] = endDate.toISOString()
                              reservation["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                              reservation["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                              events_today.push(reservation)      
                        }
                  }
                  for(let i = 0; i < events?.length; i++) {
                        let teacher_event_og = {...events[i]}
                        let startDate = new Date(teacher_event_og.start_time)
                        let endDate = new Date(teacher_event_og.end_time)

                        if((startDate.getFullYear() === dateRendering.getFullYear() && startDate.getMonth() === dateRendering.getMonth() && startDate.getDate() === dateRendering.getDate()) 
                        || (endDate.getFullYear() === dateRendering.getFullYear() && endDate.getMonth() === dateRendering.getMonth() && endDate.getDate() === dateRendering.getDate())) {
                              let teacher_event = {...teacher_event_og}
                              teacher_event["type"] = "teacher_event"
                              teacher_event["start_time"] = startDate.toISOString()
                              teacher_event["end_time"] = endDate.toISOString()
                              teacher_event["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                              teacher_event["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                              events_today.push(teacher_event)      
                        }
                  }

                  events_today = events_today.sort((a, b) => {
                        const dateA = new Date(a.start_time_i);
                        const dateB = new Date(b.start_time_i);
                        
                        return dateA - dateB;
                  })

                  //filling each event information
                  for(let i = 0; i < events_today.length; i++) {
                        let event = events_today[i]

                        let start_time = event.start_time
                        let end_time = event.end_time

                        let start_time_i = event.start_time_i
                        let end_time_i = event.end_time_i

                        let n_events_left = count_events_left(events_today, i)
                        let n_events_right = count_events_right(events_today, i)
                      

                        let type = event.type
                        let class_type = event.class_type?.length > 0 ? event.class_type?.map((type_i) => ` - ${constants.class_types?.find(obj => obj?.id == type_i)?.name}` ) : constants.class_types?.find(obj => obj?.id == event.class_type)?.name
                        let first_class_type_id = event.class_type?.length > 0 ? event.class_type[0] : event.class_type
                        let canceled = false
                        let closed = false
                        let n_vacancies_left = 0
                        let name = ""
                        let total_price = 0
                        let coin = ""
                        if(type === "reservation") {
                              total_price = event.total_price
                              coin = event.coin
                              if(event.canceled === true){
                                    canceled = true
                              }
                        }
                        if(type === "event") {
                              name = event?.name
                              if(event.canceled === true){
                                    canceled = true
                              }
                        }
                        if(type == "available") {
                              n_vacancies_left = event.n_vacancies - (event.n_vacancies_taken ?? 0)
                              if(n_vacancies_left === 0) {
                                    closed = true
                              }
                        }
                        const render_event = {
                              id:event?.id ?? 0,
                              start_time:start_time,
                              end_time:end_time,
                              start_time_i:start_time_i,
                              end_time_i:end_time_i,
                              n_events_left:n_events_left,
                              n_events_right:n_events_right,
                              type:type, //available reservation
                              class_type:class_type, //virtual presencial
                              first_class_type_id:first_class_type_id,
                              canceled:canceled,
                              closed:closed,
                              n_vacancies_left:n_vacancies_left,
                              name:name,
                              total_price:total_price,
                              coin:coin,
                        }
                        render_matrix_day.push(render_event)
                  }
                  setRenderMatrixDay(render_matrix_day)
            }
            if(calendarMode == "list"){
                  let render_matrix_list = {}
                  let list_height = 40

                  for(let i = 0; i < weekly_schedule?.length; i++) {
                        let schedule_og = {...weekly_schedule[i]}
                        let startDate = new Date(schedule_og.start_time)      
                        let endDate = new Date(schedule_og.end_time)
                        let class_type = schedule_og.class_type?.map((type_id) => ` - ${constants.class_types?.find(obj => obj?.id == type_id)?.name}` )
                        let first_class_type_id = schedule_og.class_type[0]

                        let schedule = {...schedule_og}
                        schedule["type"] = "available"
                        schedule["start_time"] = startDate.toISOString()
                        schedule["end_time"] = endDate.toISOString()
                        schedule["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                        schedule["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                        schedule["class_type"] = class_type
                        schedule["first_class_type_id"] = first_class_type_id

                        if(render_matrix_list[`${startDate.getFullYear()}`]) {
                              if(render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`]) {
                                    if(render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`]) {
                                          render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`].push(schedule)
                                          list_height += 100
                                    } else {
                                          render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [schedule]
                                          list_height += 120
                                    }
                              } else {
                                    render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`] = {}
                                    render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [schedule]
                                    list_height += 220
                              }
                        } else { 
                              render_matrix_list[`${startDate.getFullYear()}`] = {}
                              render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`] = {}
                              render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [schedule]
                              list_height += 220
                        }
                  }
                  for(let i = 0; i < reservations?.length; i++) {
                        let reservation_og = {...reservations[i]}
                        let startDate = new Date(reservation_og.start_time)
                        let endDate = new Date(reservation_og.end_time)
                        let class_type = constants.class_types?.find(obj => obj?.id == reservation_og.class_type)?.name 
                        let first_class_type_id = reservation_og.class_type
                        
                        let reservation = {...reservation_og}
                        reservation["type"] = "reservation"
                        reservation["start_time"] = startDate.toISOString()
                        reservation["end_time"] = endDate.toISOString()
                        reservation["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                        reservation["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60
                        reservation["class_type"] = class_type
                        reservation["first_class_type_id"] = first_class_type_id

                        if(render_matrix_list[`${startDate.getFullYear()}`]) {
                              if(render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`]) {
                                    if(render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`]) {
                                          render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`].push(reservation)
                                          list_height += 100
                                    } else {
                                          render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [reservation]
                                          list_height += 120
                                    }
                              } else {
                                    render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`] = {}
                                    render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [reservation]
                                    list_height += 220
                              }
                        } else { 
                              render_matrix_list[`${startDate.getFullYear()}`] = {}
                              render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`] = {}
                              render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [reservation]
                              list_height += 220
                        }  
                  }
                  for(let i = 0; i < events?.length; i++) {
                        let teacher_event_og = {...events[i]}
                        let startDate = new Date(teacher_event_og.start_time)
                        let endDate = new Date(teacher_event_og.end_time)

                        let teacher_event = {...teacher_event_og}
                        teacher_event["type"] = "teacher_event"
                        teacher_event["start_time"] = startDate.toISOString()
                        teacher_event["end_time"] = endDate.toISOString()
                        teacher_event["start_time_i"] = startDate.getHours() + startDate.getMinutes()/60
                        teacher_event["end_time_i"] = endDate.getHours() + endDate.getMinutes()/60

                        if(render_matrix_list[`${startDate.getFullYear()}`]) {
                              if(render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`]) {
                                    if(render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`]) {
                                          render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`].push(teacher_event)
                                          list_height += 100
                                    } else {
                                          render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [teacher_event]
                                          list_height += 120
                                    }
                              } else {
                                    render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`] = {}
                                    render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [teacher_event]
                                    list_height += 220
                              }
                        } else { 
                              render_matrix_list[`${startDate.getFullYear()}`] = {}
                              render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`] = {}
                              render_matrix_list[`${startDate.getFullYear()}`][`${startDate.getMonth()}`][`${startDate.getDate()}`] = [teacher_event]
                              list_height += 220
                        }  
                  }
                  //console.log(render_matrix_list)
                  setCalendarListHeight(list_height)
                  setRenderMatrixList(render_matrix_list)


            }

      }
      
      useEffect(() => {
            const intervalId = setInterval(() => {
                  setCurrentDate(new Date())
            }, 1000) // Update every second
        
            return () => clearInterval(intervalId) // Cleanup on component unmount
      }, []);

      useEffect(() => {
            handleResize()
            window.addEventListener('resize', handleResize)
      
            return () => {
                  window.removeEventListener('resize', handleResize)
            };
      }, [])

      useEffect(() => {
            if (calendarRef.current) {
                  calendarRef.current.scrollTop = calendarContentHeight/3.7 //aprox 6:30am 
            }
      }, [calendarMode])

      useEffect(() => {
            if (calendarListRef.current) {
                  calendarListRef.current.scrollTop = calendarListHeight
            }
      }, [calendarMode, calendarListHeight])
      
      
      const calendarFrameStyle = {
            width: `${calendarWidth}px`,
            height: `${calendarHeight}px`,
            overflowY: `${calendarMode === "month" ? "hidden" : "scroll"}`,
            overflowX: 'hidden',
            backgroundColor: 'white',
            borderTop: `1px solid ${GRAY}`,
            borderLeft: `1px solid ${GRAY}`,
            borderRight: `1px solid ${GRAY}`,
            borderBottom: `1px solid ${GRAY}`,
            borderRadius: '0 0 15px 15px',
            position: 'relative',
            
      };

      const calendarBarStyle = {
            width: `${calendarWidth}px`,
            height: '45px',
            backgroundColor: 'white',
            borderTop: `1px solid ${GRAY}`,
            borderLeft: `1px solid ${GRAY}`,
            borderRight: `1px solid ${GRAY}`,
            borderBottom: '0',
            borderRadius: '15px 15px 0 0',
            position: 'relative',
      }

      //this useEffect reads the reservations and the weekly_schedule arrays to edit the renderEvents to be displayed in the calendar
      
      useEffect(() => {
            handleRenderMatrixUpdate()
      }, [calendarMode, calendarDate, reservations, weekly_schedule])
      
      return (
            <>
            
            <Row ref={parentRef} className='my-2'>
                  <Col xs={12} className='flex justify-center'>
                  <div className='flex flex-col items-center'>
                  {/*calendar:{calendarDay}/{calendarMonth}/{calendarYear} index:{calendarDayIndex} | current:{currentDay}/{currentMonth}/{currentYear} index:{currentDayIndex}*/}
                  {     
                        
                        calendarMode === "month" ? (
                              <>
                                    <div style={calendarBarStyle} className='py-2'>
                                          <div style={{ position: 'absolute', top:'2px', left: `${Math.round(calendarWidth * 3 / 7)+2}px`,}}>{monthNamesMapping[calendarMonth-1]} - {calendarYear}</div>
                                          { //day titles
                                                weekDaysShortMapping.map((day, i) => (
                                                      <div key={i}  style={{ position: 'absolute',  top:'22px', left: `${Math.round(calendarWidth * (i+0.2) / (6 + 1))}px`,}}>{day}</div>
                                                ))
                                          }
                                          { //vertical lines
                                                Array.from({ length: 6 }, (_, index) => index).map((line, i) => (
                                                      <div key={i} style={{ width: '1px', height: "20px", backgroundColor: LIGHT_GRAY, position: 'absolute', top:"25px", left: `${Math.round(calendarWidth * (i+1) / (6 + 1))}px`,}}></div>
                                                ))
                                          }
                                          
                                    </div>
                                    <div style={ calendarFrameStyle }>
                                          { //vertical lines
                                                Array.from({ length: 6 }, (_, index) => index).map((line, i) => (
                                                      <div key={i} style={{ width: '1px', height: `${calendarHeight}px`, zIndex:2, backgroundColor: GRAY, position: 'absolute', left: `${Math.round(calendarWidth * (i+1) / (6 + 1))}px`,}}></div>
                                                ))
                                          }
                                          { //horizontal lines
                                                Array.from({ length: 5 }, (_, index) => index).map((line, j) => (
                                                      <div key={j} style={{ width: `${calendarWidth}px`, zIndex:2, height: '1px', backgroundColor: GRAY, position: 'absolute', top: `${Math.round(calendarHeight * (j+1) / (5 + 1))}px`,}}></div>
                                                ))
                                                
                                          }
                                          { //day squares
                                                Array.from({ length: 6 }, (_, index) => index).map((line, i) => (
                                                      <div key={i}>
                                                      {
                                                            Array.from({ length: 7 }, (_, index) => index).map((line, j) => (
                                                                  <div key={j}  
                                                                  onClick={(e) => handleSelectDay(e, calendarYear, calendarMonth, j+calendarDay-calendarDayIndex+i*7 )}
                                                                  style={{ 
                                                                        width: `${Math.round(calendarWidth / (6 + 1))+1}px`,
                                                                        height: `${Math.round(calendarHeight / (5 + 1))}px`,
                                                                        position: 'absolute', 
                                                                        top: `${Math.round(calendarHeight * (i) / (5 + 1))}px`, 
                                                                        left: `${Math.round(calendarWidth * (j) / (6 + 1))}px`, 
                                                                        paddingLeft: `${Math.round(calendarWidth * 0.2 / 7)}px`,
                                                                        paddingTop: `${Math.round(calendarWidth * 0.05 / 7)}px`,
                                                                        zIndex: 1,
                                                                        backgroundColor:`${calendarYear*365+calendarDayOfYear+j-calendarDayIndex+i*7 < currentYear*365+currentDayOfYear ? LIGHT_GRAY : ""}`,
                                                                        color:`${0 < j-calendarDayIndex+1+i*7 && j-calendarDayIndex+1+i*7 <= numberOfDaysInCalendarMonth  ? "#000000" : GRAY}`
                                                                  }}>{
                                                                        0 < j-calendarDayIndex+1+i*7 && j-calendarDayIndex+1+i*7 <= numberOfDaysInCalendarMonth ? (
                                                                              //dias en el medio
                                                                              j-calendarDayIndex+1+i*7
                                                                        ) : i == 0 ? (
                                                                              //dias de fila 1 (mes anterior)
                                                                              j-calendarDayIndex+1+i*7 + numberOfDaysInCalendarPreviousMonth
                                                                        ) : j-calendarDayIndex+1+i*7 > numberOfDaysInCalendarMonth && (
                                                                              //ultimos dias (mes siguiente)
                                                                              j-calendarDayIndex+1+i*7 - numberOfDaysInCalendarMonth
                                                                        )
                                                                        
                                                                  } </div>
                                                            ))
                                                      }
                                                      </div>
                                                ))
                                          }
                                          {
                                                renderMatrixMonth.map((week, i) => (
                                                      <div key={i}>
                                                            {
                                                                  week.map((day, j) => (
                                                                        <div key={j} >
                                                                              {
                                                                                    day.n_hours_available > 0 && (
                                                                                          <div
                                                                                                className='rounded-md flex align-items-center px-2'
                                                                                                style={{
                                                                                                      width:Math.round(calendarWidth/7)-2,
                                                                                                      height:Math.round(calendarHeight/(6*5))-2,
                                                                                                      backgroundColor:'#93c5fd',
                                                                                                      position: "absolute",
                                                                                                      zIndex: 2,
                                                                                                      top: Math.round(i*calendarHeight/6+calendarHeight*2/(6*5)),
                                                                                                      left: Math.round(j*calendarWidth/7)+1,
                                                                                                      overflow: "hidden",
                                                                                                      whiteSpace: "nowrap",
                                                                                                      color: "#FFFFFF",
                                                                                                      opacity:`${
                                                                                                      calendarYear*365+calendarDayOfYear+j-calendarDayIndex+i*7 < currentYear*365+currentDayOfYear ?
                                                                                                            "50%"
                                                                                                      : 0 < j-calendarDayIndex+1+i*7 && j-calendarDayIndex+1+i*7 <= numberOfDaysInCalendarMonth ? (
                                                                                                            //dias en el medio
                                                                                                            "100%"
                                                                                                      ) : i == 0 ? (
                                                                                                            //dias de fila 1 (mes anterior)
                                                                                                            "50%"
                                                                                                      ) : j-calendarDayIndex+1+i*7 > numberOfDaysInCalendarMonth && (
                                                                                                            //ultimos dias (mes siguiente)
                                                                                                            "50%"
                                                                                                      )}`,
                                                                                                      
                                                                                                }}
                                                                                          ><small>{day.n_hours_available} horas</small></div>
                                                                                    )
                                                                              }
                                                                              {
                                                                                    day.n_reservations > 0 && (
                                                                                          <div
                                                                                                className='rounded-md flex align-items-center px-2'
                                                                                                style={{
                                                                                                      width:Math.round(calendarWidth/7)-2,
                                                                                                      height:Math.round(calendarHeight/(6*5))-2,
                                                                                                      backgroundColor:"#2563eb",
                                                                                                      position: "absolute",
                                                                                                      zIndex: 2,
                                                                                                      top: Math.round(i*calendarHeight/6+calendarHeight*3/(6*5)),
                                                                                                      left: Math.round(j*calendarWidth/7)+1,
                                                                                                      overflow: "hidden",
                                                                                                      whiteSpace: "nowrap",
                                                                                                      color: "#FFFFFF",
                                                                                                      opacity:`${
                                                                                                            calendarYear*365+calendarDayOfYear+j-calendarDayIndex+i*7 < currentYear*365+currentDayOfYear ?
                                                                                                                  "50%"
                                                                                                            : 0 < j-calendarDayIndex+1+i*7 && j-calendarDayIndex+1+i*7 <= numberOfDaysInCalendarMonth ? (
                                                                                                                  //dias en el medio
                                                                                                                  "100%"
                                                                                                            ) : i == 0 ? (
                                                                                                                  //dias de fila 1 (mes anterior)
                                                                                                                  "50%"
                                                                                                            ) : j-calendarDayIndex+1+i*7 > numberOfDaysInCalendarMonth && (
                                                                                                                  //ultimos dias (mes siguiente)
                                                                                                                  "50%"
                                                                                                            )}`,
                                                                                                }}
                                                                                          ><small>x{day.n_reservations} reservas</small></div>
                                                                                    )
                                                                              }
                                                                              {
                                                                                    day.n_teacher_events > 0 && (
                                                                                          <div
                                                                                                className='rounded-md flex align-items-center px-2'
                                                                                                style={{
                                                                                                      width:Math.round(calendarWidth/7)-2,
                                                                                                      height:Math.round(calendarHeight/(6*5))-2,
                                                                                                      backgroundColor:"#FBBF24",
                                                                                                      position: "absolute",
                                                                                                      zIndex: 2,
                                                                                                      top: Math.round(i*calendarHeight/6+calendarHeight*4/(6*5)),
                                                                                                      left: Math.round(j*calendarWidth/7)+1,
                                                                                                      overflow: "hidden",
                                                                                                      whiteSpace: "nowrap",
                                                                                                      color: "#FFFFFF",
                                                                                                      opacity:`${
                                                                                                            calendarYear*365+calendarDayOfYear+j-calendarDayIndex+i*7 < currentYear*365+currentDayOfYear ?
                                                                                                                  "50%"
                                                                                                            : 0 < j-calendarDayIndex+1+i*7 && j-calendarDayIndex+1+i*7 <= numberOfDaysInCalendarMonth ? (
                                                                                                                  //dias en el medio
                                                                                                                  "100%"
                                                                                                            ) : i == 0 ? (
                                                                                                                  //dias de fila 1 (mes anterior)
                                                                                                                  "50%"
                                                                                                            ) : j-calendarDayIndex+1+i*7 > numberOfDaysInCalendarMonth && (
                                                                                                                  //ultimos dias (mes siguiente)
                                                                                                                  "50%"
                                                                                                            )}`,
                                                                                                }}
                                                                                          ><small>{day.n_teacher_events} evento</small></div>
                                                                                    )
                                                                              }
                                                                              {
                                                                                    day.n_canceled > 0 && (
                                                                                          <div
                                                                                                className='rounded-md flex align-items-center'
                                                                                                style={{
                                                                                                      width: Math.round(calendarWidth/(7*4))-1,
                                                                                                      height:Math.round(calendarHeight/(6*5))-2,
                                                                                                      backgroundColor:"#EF4444",
                                                                                                      position: "absolute",
                                                                                                      zIndex: 2,
                                                                                                      top: Math.round(i*calendarHeight/6+calendarHeight/(6*5))-1,
                                                                                                      left: Math.round(j*calendarWidth/7+calendarWidth*3/(7*4))-1,
                                                                                                      overflow: "hidden",
                                                                                                      whiteSpace: "nowrap",
                                                                                                      color: "#FFFFFF",
                                                                                                      opacity:`${
                                                                                                            calendarYear*365+calendarDayOfYear+j-calendarDayIndex+i*7 < currentYear*365+currentDayOfYear ?
                                                                                                                  "50%"
                                                                                                            : 0 < j-calendarDayIndex+1+i*7 && j-calendarDayIndex+1+i*7 <= numberOfDaysInCalendarMonth ? (
                                                                                                                  //dias en el medio
                                                                                                                  "100%"
                                                                                                            ) : i == 0 ? (
                                                                                                                  //dias de fila 1 (mes anterior)
                                                                                                                  "50%"
                                                                                                            ) : j-calendarDayIndex+1+i*7 > numberOfDaysInCalendarMonth && (
                                                                                                                  //ultimos dias (mes siguiente)
                                                                                                                  "50%"
                                                                                                            )}`,
                                                                                                }}
                                                                                          ><small className='m-1'>{day.n_canceled}</small></div>
                                                                                    )
                                                                              }
                                                                        </div>
                                                                  ))
                                                            }
                                                      </div>
                                                      
                                                ))
                                          }
                                          
                                    </div>
                              </>
                        ) : calendarMode === "week" ? (
                              <>
                                    <div style={calendarBarStyle} className='py-2'>
                                          <div style={{ position: 'absolute', left: `${Math.round(calendarWidth * (0.2) / (6 + 1))}px`,}}>{monthNamesShortMapping[calendarMonth-1]}</div>
                                          { //day titles
                                                weekDaysShortMapping.map((day, i) => (
                                                      <div key={i}  style={{ position: 'absolute', left: `${Math.round(calendarWidth * (i+1.2) / (7 + 1))}px`,}}>
                                                            {day} {i+calendarDay-calendarDayIndex <= numberOfDaysInCalendarMonth && i+calendarDay-calendarDayIndex > 0  ? 
                                                                        i+calendarDay-calendarDayIndex 
                                                                  : i+calendarDay-calendarDayIndex <= 0 ? 
                                                                        numberOfDaysInCalendarPreviousMonth+i+calendarDay-calendarDayIndex 
                                                                  : i-calendarDayIndex}
                                                      </div>
                                                ))
                                          }
                                          { //vertical lines
                                                Array.from({ length: 7 }, (_, index) => index).map((line, i) => (
                                                      <div key={i} style={{ width: '1px', height: "40px", backgroundColor: LIGHT_GRAY, position: 'absolute', left: `${Math.round(calendarWidth * (i+1) / (7 + 1))}px`,}}></div>
                                                ))
                                          }
                                          
                                    </div>
                                    <div style={ calendarFrameStyle }  ref={calendarRef}>
                                          <div style={{ width: '1px', height: `${calendarContentHeight}px`, backgroundColor: GRAY, zIndex:2, position: 'absolute', left: `${Math.round(calendarWidth / 8)}px` }}></div>
                                          { //vertical lines
                                                Array.from({ length: 6 }, (_, index) => index).map((line, i) => (
                                                      <div key={i} style={{ width: '1px', height: `${calendarContentHeight}px`, backgroundColor: GRAY,  zIndex:2, position: 'absolute', left: `${Math.round(calendarWidth * (i+2) / (6 + 2))}px`,}}></div>
                                                ))
                                          }
                                          { //horizontal lines
                                                Array.from({ length: 23 }, (_, index) => index).map((line, j) => (
                                                      <div key={j} style={{ width: `${calendarWidth*7/8+10}px`, height: '1px', backgroundColor: GRAY,  zIndex:2, position: 'absolute', left:`${calendarWidth/8-10}px`, top: `${Math.round(calendarContentHeight * (j+1) / (23 + 1))}px`,}}></div>
                                                ))
                                          }
                                          { //hours
                                                Array.from({ length: 23 }, (_, index) => index).map((line, j) => (
                                                      <div key={j} style={{ position: 'absolute',  left:`${calendarWidth/32}px`, top: `${Math.round(calendarContentHeight * (j+0.6) / (23 + 1))}px`,}}>{"0".repeat(2-(j+1).toString().length)}{j+1}:00</div>
                                                ))
                                          }
                                          { //day coverer
                                                Array.from({ length: 7 }, (_, index) => index).map((line, i) => (
                                                      <div onClick={(e) => handleSelectDay(e, calendarYear, calendarMonth, calendarDay, -calendarDayIndex+i)} key={i} style={{ width:`${calendarWidth / 8}px`, height: `${calendarContentHeight}px`, zIndex:1, position: 'absolute', left: `${Math.round(calendarWidth * (i+1) / (7 + 1))}px`,
                                                            backgroundColor: `${
                                                                  calendarYear < currentYear ? 
                                                                        LIGHT_GRAY
                                                                  : calendarMonth < currentMonth && calendarYear === currentYear ?
                                                                        LIGHT_GRAY
                                                                  : calendarDay < currentDay-currentDayIndex && calendarYear === currentYear && calendarMonth === currentMonth ? 
                                                                        LIGHT_GRAY
                                                                  : i < currentDayIndex && calendarYear === currentYear && calendarMonth === currentMonth && calendarDay-calendarDayIndex <= currentDay-currentDayIndex ?
                                                                        LIGHT_GRAY
                                                                  : ""
                                                            }`
                                                      }}></div>
                                                ))

                                          }
                                          <div style={{ width:`${calendarWidth / 8}px`, height: `${currentHour*calendarContentHeight/24+currentMinute*calendarContentHeight/24/60}px`, zIndex:1, position: 'absolute', left: `${Math.round(calendarWidth * (currentDayIndex + 1)/ (7 + 1))}px`, 
                                                backgroundColor: `${calendarDay-calendarDayIndex <= currentDay-currentDayIndex && calendarMonth === currentMonth && calendarYear === currentYear ? LIGHT_GRAY : ""}`}}
                                                onClick={(e) => handleSelectDay(e, calendarYear, calendarMonth, currentDay)}></div>
                                          {
                                                renderMatrixWeek.map((day, i) => (
                                                      <div key={i}>
                                                            {
                                                                  renderMatrixWeek[i].map((event, j) => (
                                                                        <div key={j}
                                                                              className='rounded-md text-xs'
                                                                              onClick={() => {
                                                                                    if(event.type === "reservation"){
                                                                                          handleShowReservationModal(event) 
                                                                                          //setDisplayedReservation(event)
                                                                                          //setShowReservationModal(true)
                                                                                    } else if(event.type === "available"){
                                                                                          handleShowAvailableTimeModal(event)
                                                                                          //setDisplayedAvailableTime(event)
                                                                                          //setShowAvailableTimeModal(true)
                                                                                    } else if(event.type === "teacher_event"){
                                                                                          return null
                                                                                    } else {
                                                                                          return null
                                                                                    }
                                                                              }}
                                                                              style={{
                                                                                    width: calendarWidth / (8 * (event.n_events_left + event.n_events_right + 1))-2,
                                                                                    height: (event.end_time_i - event.start_time_i)*calendarContentHeight/24-2,
                                                                                    backgroundColor: `${event.type === "reservation" && event.canceled === true ? "#EF4444" : event.type === "reservation" ? "#2563eb" :  event.type === "available" && event.closed == true ? "#dbeafe" : event.type === "available" ? "#93c5fd" : event.type === "teacher_event" ? "#FCD34D" : ""}`,
                                                                                    position:"absolute",
                                                                                    left: calendarWidth * (i+1) / 8 + event.n_events_left * calendarWidth / (8 * (event.n_events_left + event.n_events_right + 1)),
                                                                                    top: calendarContentHeight * event.start_time_i / 24,
                                                                                    zIndex:3,
                                                                                    overflow:"hidden",
                                                                                    whiteSpace: "nowrap",
                                                                                    color:"#FFFFFF",
                                                                                    opacity:`${
                                                                                          calendarYear < currentYear ? 
                                                                                                "50%"
                                                                                          : calendarMonth < currentMonth && calendarYear === currentYear ?
                                                                                                "50%"
                                                                                          : calendarDay < currentDay-currentDayIndex && calendarYear === currentYear && calendarMonth === currentMonth ? 
                                                                                                "50%"
                                                                                          : i < currentDayIndex && calendarYear === currentYear && calendarMonth === currentMonth && calendarDay-calendarDayIndex <= currentDay-currentDayIndex ?
                                                                                                "50%"
                                                                                          : ""
                                                                                    }`

                                                                              }}
                                                                        >
                                                                             <p className='mb-0 mt-1 mx-2'>{event.class_type}</p>
                                                                             <p className='my-0 mx-2'>{event.canceled ? "cancelado" : ""}</p>
                                                                             <p className='my-0 mx-2'>{event.closed ? "cerrado" : ""}</p>
                                                                             <p className='my-0 mx-2'>{event.n_vacancies_left > 0 ? `${event.n_vacancies_left} espacios` : ""}</p>
                                                                             <p className='my-0 mx-2'>{event.total_price > 0 ? `${event.total_price} ${event.coin?.short_name}` : ""}</p>
                                                                        </div>
                                                                  ))
                                                            }
                                                      </div>
                                                ))
                                          }
                                    </div>
                              </>
                        ) : calendarMode === "day" ? (
                              <>
                                    <div style={calendarBarStyle} className='py-2'>
                                          <h6 style={{ position: 'absolute', left: `${Math.round(calendarWidth * (0.2) / (6 + 1))}px`,}}>{monthNamesShortMapping[calendarMonth-1]}</h6>
                                          <div style={{ width: '1px', height: "40px", backgroundColor: LIGHT_GRAY, position: 'absolute', left: `${Math.round(calendarWidth / (7 + 1))}px`,}}></div>
                                          <h6  style={{ position: 'absolute',  left: `${Math.round(calendarWidth * (1.2) / (7 + 1))}px`,}}> {calendarDayOfWeek} {calendarDay}</h6>   
                                    </div>

                                    <div style={ calendarFrameStyle } ref={calendarRef}>
                                          <div style={{ width: '1px', height: `${calendarContentHeight}px`, backgroundColor: GRAY, zIndex:2, position: 'absolute', left: `${Math.round(calendarWidth / 8)}px` }}></div>
                                          <div style={{ width:`${calendarWidth }px`, height: `${calendarContentHeight}px`, zIndex:1, position: 'absolute', left: `${Math.round(calendarWidth  / (7 + 1))}px`, 
                                                backgroundColor: `${
                                                                  calendarYear < currentYear ? 
                                                                        LIGHT_GRAY
                                                                  : calendarMonth < currentMonth && calendarYear == currentYear ?
                                                                        LIGHT_GRAY
                                                                  : calendarDay < currentDay && calendarYear == currentYear && calendarMonth == currentMonth ? 
                                                                        LIGHT_GRAY
                                                                  : ""
                                                            }`}}></div>
                                          <div style={{ width:`${calendarWidth }px`, height: `${currentHour*calendarContentHeight/24+currentMinute*calendarContentHeight/24/60}px`, zIndex:1, position: 'absolute', left: `${Math.round(calendarWidth  / (7 + 1))}px`, 
                                                backgroundColor: `${calendarDay == currentDay && calendarMonth == currentMonth && calendarYear == currentYear ? LIGHT_GRAY : ""}`}}></div>

                                          { //horizontal lines
                                                Array.from({ length: 23 }, (_, index) => index).map((line, j) => (
                                                      <div key={j} style={{ width: `${calendarWidth*7/8+10}px`, height: '1px', backgroundColor: GRAY, zIndex:2, position: 'absolute', left:`${calendarWidth/8-10}px`, top: `${Math.round(calendarContentHeight * (j+1) / (23 + 1))}px`,}}></div>
                                                ))
                                          }
                                          { //hours
                                                Array.from({ length: 23 }, (_, index) => index).map((line, j) => (
                                                      <div key={j} style={{ position: 'absolute', left:`${calendarWidth/32}px`, top: `${Math.round(calendarContentHeight * (j+0.6) / (23 + 1))}px`,}}>{"0".repeat(2-(j+1).toString().length)}{j+1}:00</div>
                                                ))
                                          }
                                          {
                                                renderMatrixDay.map((event, i) => (
                                                      <div key={i}
                                                            className='rounded-md'
                                                            onClick={() => {
                                                                  if(event.type === "reservation"){
                                                                        handleShowReservationModal(event)
                                                                        //setDisplayedReservation(event)
                                                                        //setShowReservationModal(true)
                                                                  } else if(event.type === "available"){
                                                                        handleShowAvailableTimeModal(event)
                                                                        //setDisplayedAvailableTime(event)
                                                                        //setShowAvailableTimeModal(true)
                                                                  } else if(event.type === "teacher_event"){
                                                                        return null
                                                                  } else {
                                                                        return null
                                                                  }
                                                            }}
                                                            style={{
                                                                  width: calendarWidth*7/8 / (event.n_events_left + event.n_events_right + 1)-2,
                                                                  height: (event.end_time_i - event.start_time_i)*calendarContentHeight/24-2,
                                                                  backgroundColor: `${event.type === "reservation" && event.canceled === true ? "#EF4444" : event.type === "reservation" ? "#2563eb" :  event.type === "available" && event.closed == true ? "#dbeafe" : event.type === "available" ? "#93c5fd" :  event.type === "teacher_event" ? "#FCD34D" : ""}`,
                                                                  position:"absolute",
                                                                  left: calendarWidth/8 + event.n_events_left * calendarWidth*7/8 / (event.n_events_left + event.n_events_right + 1),
                                                                  top: calendarContentHeight * event.start_time_i / 24,
                                                                  zIndex:3,
                                                                  overflow:"hidden",
                                                                  whiteSpace: "nowrap",
                                                                  color:"#FFFFFF",
                                                                  opacity:`${
                                                                        calendarYear < currentYear ? 
                                                                              "50%"
                                                                        : calendarMonth < currentMonth && calendarYear === currentYear ?
                                                                              "50%"
                                                                        : calendarDay < currentDay-currentDayIndex && calendarYear === currentYear && calendarMonth === currentMonth ? 
                                                                              "50%"
                                                                        : i < currentDayIndex && calendarYear === currentYear && calendarMonth === currentMonth && calendarDay < currentDay ?
                                                                              "50%"
                                                                        : ""
                                                                  }`

                                                            }}
                                                      >
                                                            <p className='mb-0 mt-1 mx-2'>{event.class_type}</p>
                                                            <p className='my-0 mt-1 mx-2'>{event.canceled ? "cancelado" : ""}</p>
                                                            <p className='my-0 mt-1 mx-2'>{event.closed ? "cerrado" : ""}</p>
                                                            <p className='my-0 mt-1 mx-2'>{event.n_vacancies_left > 0 ? `${event.n_vacancies_left} espacios` : ""}</p>
                                                            <p className='my-0 mt-1 mx-2'>{event.total_price > 0 ? `${event.total_price} ${event.coin?.short_name}` : ""}</p>
                                                      </div>
                                                ))
                                          }
                                          
                                    </div>
                              </>
                        ) : calendarMode === "list" ? (
                              <>
                                    <div style={calendarBarStyle} className='py-2'>
                                          <h5 style={{ position: 'absolute', left: `${Math.round(calendarWidth * (0.2) / (6 + 1))}px`,}}>Tu Agenda</h5>
                                    </div>
                                    <div style={ calendarFrameStyle } ref={calendarListRef}>
                                          {/*<div style={{ width: '1px', height: `${calendarListHeight}px`, backgroundColor: LIGHT_GRAY, zIndex:2, position: 'absolute', left: `${Math.round(calendarWidth / 8)}px` }}></div>*/}
                                          {
                                                Object.keys(renderMatrixList).map((year) => (
                                                      <div key={year}>
                                                        
                                                            {
                                                                  Object.keys(renderMatrixList[year]).map((month) => (
                                                                        <div key={month}>
                                                                              <div
                                                                                    className='px-4 py-3 my-4'
                                                                                    style={{
                                                                                          width: calendarWidth,
                                                                                          height: "100px",
                                                                                          backgroundColor: "#F3F4F6",
                                                                                          zIndex:3,
                                                                                    }}
                                                                              >
                                                                                    <h2>{monthNamesMapping[month]} {year}</h2>
                                                                              </div>
                                                                              {
                                                                                    Object.keys(renderMatrixList[year][month]).map((day) => (
                                                                                          <div key={day}>
                                                                                                 <div
                                                                                                      className='p-2 my-2'
                                                                                                      style={{
                                                                                                            width: calendarWidth,
                                                                                                            height: "20px",
                                                                                                            zIndex:3,
                                                                                                      }}
                                                                                                >
                                                                                                     
                                                                                                </div>
                                                                                                <div
                                                                                                      className='px-2'
                                                                                                      style={{
                                                                                                            width: calendarWidth,
                                                                                                            height: "auto",
                                                                                                            zIndex:3,
                                                                                                            position:"absolute",
                                                                                                      }}
                                                                                                >
                                                                                                      <p className='my-0 ml-md-5'>{monthNamesShortMapping[month]}</p>
                                                                                                      <h5 className='ml-md-5'>{day}</h5>
                                                                                                </div>
                                                                                               
                                                                                                {
                                                                                                      renderMatrixList[year][month][day].map((event, i) => (
                                                                                                            <div key={i}>
                                                                                                                  <div key={i}
                                                                                                                        className='rounded-md'
                                                                                                                        onClick={() => {
                                                                                                                              if(event.type === "reservation"){
                                                                                                                                    handleShowReservationModal(event) 
                                                                                                                                    //setDisplayedReservation(event)
                                                                                                                                    //setShowReservationModal(true)
                                                                                                                              } else if(event.type === "available"){
                                                                                                                                    handleShowAvailableTimeModal(event)
                                                                                                                                    //setDisplayedAvailableTime(event)
                                                                                                                                    //setShowAvailableTimeModal(true)
                                                                                                                              } else if(event.type === "teacher_event"){
                                                                                                                                    return null
                                                                                                                              } else {
                                                                                                                                    return null
                                                                                                                              }
                                                                                                                        }}
                                                                                                                        style={{
                                                                                                                              width: calendarWidth*6.7/8,
                                                                                                                              height: "90px",
                                                                                                                              backgroundColor: `${event.type === "reservation" && event.canceled === true ? "#EF4444" : event.type === "reservation" ? "#2563eb" :  event.type === "available" && event.closed == true ? "#dbeafe" : event.type === "available" ? "#93c5fd" :  event.type === "teacher_event" ? "#FCD34D" : ""}`,
                                                                                                                              marginBottom:"10px",
                                                                                                                              zIndex:3,
                                                                                                                              marginLeft: calendarWidth/8,
                                                                                                                              overflow:"hidden",
                                                                                                                              whiteSpace: "nowrap",
                                                                                                                              color:"#FFFFFF",
                                                                                                                              opacity: "100%",

                                                                                                                        }}
                                                                                                                  >
                                                                                                                        <p className='mb-0 mt-1 mx-2'>{"0".repeat(2-(new Date(event?.start_time ?? "").getHours()).toString().length)}{new Date(event?.start_time ?? "").getHours()}:{"0".repeat(2-(new Date(event?.start_time ?? "").getMinutes()).toString().length)}{new Date(event?.start_time ?? "").getMinutes()} - {"0".repeat(2-(new Date(event?.end_time ?? "").getHours()).toString().length)}{new Date(event?.end_time ?? "").getHours()}:{"0".repeat(2-(new Date(event?.end_time ?? "").getMinutes()).toString().length)}{new Date(event?.end_time ?? "").getMinutes()}</p>
                                                                                                                        <p className='mb-0 mt-1 mx-2'>{event.class_type}</p>
                                                                                                                        <p className='my-0 mt-1 mx-2'>{event.total_price > 0 ? `${event.total_price} ${event.coin?.short_name}` : ""}</p>
                                                                                                                        <p className='my-0 mt-1 mx-2'>{event.n_vacancies_left > 0 ? `${event.n_vacancies_left} espacios` : ""}</p>
                                                                                                                        <p className='my-0 mt-1 mx-2'>{event.canceled ? "cancelado" : ""}</p>
                                                                                                                        <p className='my-0 mt-1 mx-2'>{event.closed ? "cerrado" : ""}</p>
                                                                                                                        
                                                                                                                        
                                                                                                                  </div>
                                                                                                            </div>
                                                                                                      ))
                                                                                                }
                                                                                          </div>
                                                                                    ))
                                                                              }
                                                                        </div>
                                                                  ))
                                                            }
                                                      </div>
                                                      
                                                ))
                                          }
                                          <div
                                                style={{
                                                      width: calendarWidth,
                                                      height: "40px",
                                                      zIndex:3,
                                                }}
                                          >
                                          </div>

                                    </div>
                              </>
                        ) : (<div></div>)
                  }
                  </div>
                  </Col>
            </Row>

            <Row className="my-3 mx-auto" style={{width:`${calendarWidth}px`,}}>
             
                  <Col xs={12} md={3} className='p-0 mb-3'>
                        {/*
                        <button disabled={calendarMode === "list" && true} className={`${calendarMode !== "list" && "transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-500 bg-gradient-to-b from-gray-50 to-gray-100"} py-1 px-3`} style={{ borderTop: '1px solid #D1D5DB', borderLeft: '1px solid #D1D5DB', borderRight: '0', borderBottom: '1px solid #D1D5DB', borderRadius: '15px 0 0 15px',}} onClick={(e) => {handleChangeDay(e, -1)}}><>Anterior</></button>
                        <button disabled={calendarMode === "list" && true} className={`${calendarMode !== "list" && "transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-500 bg-gradient-to-b from-gray-50 to-gray-100"} py-1 px-3`} style={{ border: '1px solid #D1D5DB', borderRadius: '0 15px 15px 0',}} onClick={(e) => {handleChangeDay(e, 1)}}><>Siguiente</></button>
                        */}
                        <button disabled={calendarMode === "list" && true} className={`${calendarMode !== "list" && "bg-gray-200 shadow-none hover:shadow-lg scale-100 hover:scale-105"} py-1 px-3`} style={{ borderRight: '1px solid white', borderRadius: '15px 0 0 15px',}} onClick={(e) => {handleChangeDay(e, -1)}}><>Anterior</></button>
                        <button disabled={calendarMode === "list" && true} className={`${calendarMode !== "list" && "bg-gray-200 shadow-none hover:shadow-lg scale-100 hover:scale-105"} py-1 px-3`} style={{ borderLeft: '1px solid white', borderRadius: '0 15px 15px 0',}} onClick={(e) => {handleChangeDay(e, 1)}}><>Siguiente</></button>
                        
                  </Col>
            
                  
                  
                  <Col xs={12} md={5} className='p-0 mb-3 text-black' >
                        <button className= {` ${calendarMode == "month" ? "bg-gray-400 border-gray-400 text-white" : "bg-gray-200 shadow-none hover:shadow-lg scale-100 hover:scale-105"} py-1 px-3`} style={{ borderRadius: '15px 0 0 15px' }} onClick={(e) => {handleChangeMode(e, "month")}}><>Mes</></button>
                        <button className= {` ${calendarMode == "week" ? "bg-gray-400 border-gray-400 text-white" : "bg-gray-200 shadow-none hover:shadow-lg scale-100 hover:scale-105"} py-1 px-3`} style={{ borderRadius: '0 0 0 0',}} onClick={(e) => {handleChangeMode(e, "week")}}><>Semana</></button>
                        <button className= {` ${calendarMode == "day" ? "bg-gray-400 border-gray-400 text-white" : "bg-gray-200 shadow-none hover:shadow-lg scale-100 hover:scale-105"} py-1 px-3`} style={{ borderRadius: '0 0 0 0',}} onClick={(e) => {handleChangeMode(e, "day")}}><>Día</></button>
                        <button className= {` ${calendarMode == "list" ? "bg-gray-400 border-gray-400 text-white" : "bg-gray-200 shadow-none hover:shadow-lg scale-100 hover:scale-105"} py-1 px-3`} style={{ borderRadius: '0 15px 15px 0' }} onClick={(e) => {handleChangeMode(e, "list")}}><>Lista</></button>
                        {/*
                        <div key={i} style={{backgroundColor:subject.is_university_subject ? ORANGE : BLUE}} className='px-3 py-1 rounded-xl mr-2 mb-2 select-none shadow-none hover:shadow-lg scale-100 hover:scale-105' onClick={() => handleSubjectModal(subject)}>{subject.name}</div>
                        <button className= {`transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-500 bg-gradient-to-b ${calendarMode == "month" ? "from-gray-400" : "from-gray-50"} to-gray-100 py-1 px-3`} style={{ borderTop: '1px solid #D1D5DB', borderLeft: '1px solid #D1D5DB', borderRight: '0', borderBottom: '1px solid #D1D5DB', borderRadius: '15px 0 0 15px',}} onClick={(e) => {handleChangeMode(e, "month")}}><>Mes</></button>
                        <button className= {`transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-500 bg-gradient-to-b ${calendarMode == "week" ? "from-gray-400" : "from-gray-50"} to-gray-100 py-1 px-3`} style={{ border: '1px solid #D1D5DB', borderRadius: '0 0 0 0',}} onClick={(e) => {handleChangeMode(e, "week")}}><>Semana</></button>
                        <button className= {`transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-500 bg-gradient-to-b ${calendarMode == "day" ? "from-gray-400" : "from-gray-50"} to-gray-100 py-1 px-3`} style={{ border: '1px solid #D1D5DB', borderRadius: '0 0 0 0',}} onClick={(e) => {handleChangeMode(e, "day")}}><>Día</></button>
                        <button className= {`transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-500 bg-gradient-to-b ${calendarMode == "list" ? "from-gray-400" : "from-gray-50"} to-gray-100 py-1 px-3`} style={{ borderTop: '1px solid #D1D5DB', borderLeft: '0', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB', borderRadius: '0 15px 15px 0',}} onClick={(e) => {handleChangeMode(e, "list")}}><>Lista</></button>
                        
                        */}
                  </Col>
                 
                  <Col xs={12} md={4}  className='p-0 mb-3'>
                        Fecha: {currentDay}/{currentMonth}/{currentYear} - {"0".repeat(2-currentHour.toString().length)}{currentHour}:{"0".repeat(2-currentMinute.toString().length)}{currentMinute} 
                  </Col>
              
            </Row>
            </>
      )
}

export default Calendar