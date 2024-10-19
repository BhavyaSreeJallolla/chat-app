import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore"; // Added Firestore imports
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDqMqs3TwR-YZMq1gMPkQxlSrNM5do9NdY",
  authDomain: "chat-app-gs-223a2.firebaseapp.com",
  projectId: "chat-app-gs-223a2",
  storageBucket: "chat-app-gs-223a2.appspot.com",
  messagingSenderId: "801652985633",
  appId: "1:801652985633:web:ec88b15b1949b8a122b860",
  measurementId: "G-38R2HCV044"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Ensure this is defined after the import

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Save user details to Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(), // Fixed toLowerCase typo
      email,
      name: "",
      avatar: "",
      bio: "Hey, There I am using chat app",
      lastSeen: Date.now(),
    });

    // Create an empty chat document for the user
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });

    toast.success("User created successfully!"); // Optional success message
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('.').join(" "));
  }
};

const login= async(email,password)=>{
    try{
        await signInWithEmailAndPassword(auth,email,password);
    }
 catch(error){
    console.error(error);
    toast.error(error.code.split('/')[1].split('.').join(" "));
 }
} 

const logout = async()=>{
    try{
          
        awaitsignOut(auth)
    } catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('.').join(" "));

    }
}

export { signup,login,logout,auth,db }; // Exported the signup function
