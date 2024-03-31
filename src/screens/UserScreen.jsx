import React from 'react';
import { useState, useEffect, useRef } from 'react';

import UserProfile from '../components/UserProfile';
import UserEdit from '../components/UserEdit';
import UserLogin from '../components/UserLogin';
import UserSignup from '../components/UserSignup';
    
//import backgroundImage from '../assets/background1.jpeg';

function UserScreen({ userInfo, teacherProfile, userChildren, constants }) {

      const [showLogin, setShowLogin] = useState(true)
      const [showEditForm, setShowEditForm] = useState(false)

      const handleShowLogin = () => {
            setShowLogin(!showLogin)
      }

      const handleShowEditForm = () => {
            setShowEditForm(!showEditForm)
      }

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      return (
            <div  className='m-0'>
            {
                  userInfo.user ? (

                        !showEditForm ? (
                              <UserProfile userInfo={userInfo} teacherProfile={teacherProfile} userChildren={userChildren} handleShowEditForm={handleShowEditForm}/>
                        ) : (
                              <UserEdit userInfo={userInfo} constants={constants} handleShowEditForm={handleShowEditForm} />
                        )
                        
                  ) : showLogin ? (
                        <UserLogin userInfo={userInfo} handleShowLogin={handleShowLogin} />
                  ) : (
                        <UserSignup userInfo={userInfo} handleShowLogin={handleShowLogin} constants={constants} />
                  )
            }
            </div>

      );
}

export default UserScreen;
