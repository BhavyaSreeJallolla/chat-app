import React from 'react'
import './Rightsidebar.css'
import assets from '../../assets/assets'
import { logout } from '../config/Firebase'

const Rightsidebar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.profile_img} alt=''/>
        <h3>Richard Sanford<img src={assets.green_dot} className='dot' alt=''/></h3>
        <p>Hey, There IAM RICHARD SANFORD USING CHAT APP</p>
      </div>
      <hr/>
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt=''/>
          <img src={assets.pic2}alt=''/>
          <img src={assets.pic3} alt=''/>
          <img src={assets.pic4} alt=''/>
          <img src={assets.pic1} alt=''/>
          <img src={assets.pic2} alt=''/>
        </div>
      </div>
      <button onClick={()=>logout()} >LogOut</button>
    </div>
  )
}

export default Rightsidebar