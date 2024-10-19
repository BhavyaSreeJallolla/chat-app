import React, { useContext, useState } from 'react';
import './Leftsidebar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/Firebase';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { AppContext } from '../../context/AppContext';

const Leftsidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData,chatUser, setChatUser,setMessages ,messageId} = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('username', '==', input.toLowerCase()));
        const querySnap = await getDocs(q);
        
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.forEach((chat) => {
            if (chat.id === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          setUser(querySnap.docs[0].data());
        } else {
          setUser(null);
        }

        setShowSearch(true);  // Show search results if query runs
      } else {
        setShowSearch(false);  // Hide search results if input is empty
        setUser(null);         // Reset user
      }
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  const addChat = async () => {
    const messagesRef = collection(db, 'messages');
    const chatsRef = collection(db, 'chats');
    try {
      const newMessageRef = doc(messagesRef);  // Create a new message doc
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      });

      // Add the chat reference to the searched user
      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),  // Use Date.now() for timestamp
          messagesSeen: true
        })
      });

      // Add the chat reference to the current logged-in user
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messagesSeen: true
        })
      });
    } catch (error) {
      console.error("Error adding chat: ", error);
    }
  };

  const setChat = async (item)=>{

    setMessagesId(item.messageId);
    setChatUser(item)

  }

  return (
    <div className='ls'>
      <div className='ls-top'>
        <div className='ls-nav'>
          <img src={assets.logo} className='logo' alt='' />
          <div className="menu">
            <img src={assets.menu_icon} alt='' />
            <div className="sub-menu">
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className='ls-search'>
          <img src={assets.search_icon} alt='' />
          <input onChange={inputHandler} type='text' placeholder='Search here..' />
        </div>
      </div>

      <div className='ls-list'>
        {showSearch && user ? (
          <div onClick={addChat} className='friends add-user'>
            <img src={user.avatar} alt='' />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div onClick={()=>setChat} key={index} className="friends">
              <img src={item.userData.avatar} alt='' />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leftsidebar;
