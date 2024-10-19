import React, { useContext, useEffect, useState } from 'react';
import './Chatbox.css';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore'; // Ensure 'doc' is imported
import { db } from '../config/Firebase';

const Chatbox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessages = async () => {
    try {
      if (input && messagesId) {
        // Update the messages in Firestore
        await updateDoc(doc(db, 'messages', messagesId), {
          sId: userData.id,
          text: input,
          createdAt: new Date(),  // Corrected typo here
        });

        const userId = [chatUser.rId, userData.id];
        userId.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);

            if (chatIndex !== -1) {
              // You may need to update chat data based on your structure here
              userChatData.chatsData[chatIndex] = {
                ...userChatData.chatsData[chatIndex],
                lastMessage: input,
                timestamp: new Date(),
              };

              await updateDoc(userChatsRef, userChatData);
            }
          }
        });

        setInput(""); // Clear input after sending the message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });

      return () => {
        unSub();
      };
    }
  }, [messagesId, setMessages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt='' />
        <p>{chatUser.userData.name}<img className="dot" src={assets.green_dot} alt='' /></p>
        <img src={assets.help_icon} className="help" alt='' />
      </div>
      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === userData.id ? "r-msg" : "s-msg"}>
            {msg.sender === userData.id ? (
              <p className="msg">{msg.text}</p>
            ) : (
              <>
                <img src={assets.profile_img} alt='' />
                <p className="msg">{msg.text}</p>
              </>
            )}
            <div>
              <img src={assets.profile_img} alt='' />
              <p>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          onChange={handleInputChange}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        {/* Trigger the sendMessages function on clicking the send button */}
        <img src={assets.send_button} alt="" onClick={sendMessages} />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default Chatbox;
