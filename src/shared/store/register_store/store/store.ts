import {createSlice} from "@reduxjs/toolkit"
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
  } from "firebase/auth";
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import { v4 as uuidv4 } from "uuid";
  import { storage, auth, db } from "../../../../../firebase";
import { message } from "antd";
import replace  from "next/router";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";


interface RegisterProps{
    imageFile: any,
    isDataSent: boolean,
    registerInformation: {
        username: string,
        email: string,
        password: string
    },
    registerError: string

}

const initialState: RegisterProps={
    imageFile: null,
    isDataSent: false,
    registerInformation: {
        username: "",
        email: "",
        password: "",
    },
    registerError: ""    

}

export const resgiterSlice=createSlice({
    name: 'resgiterSlice',
    initialState,
    reducers:{
        handleSelectFile: (state, action)=>{
            if (action.payload && action.payload[0].size < 10000000) {
                state.imageFile=action.payload[0]
                // console.log(action.payload[0]);
              } else {
                message.error("file size is too long");
              }
        },
        handleUploadUserData: (state, action)=>{
            const uid = uuidv4();
            // const route = useRouter();
            if (state.imageFile) {
              const storageRef = ref(storage, `images/${uid}/${state.imageFile.name}`);
              const uploadTask = uploadBytesResumable(storageRef, state.imageFile);
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  switch (error.code) {
                    case "storage/unauthorized":
                      break;
                    case "storage/canceled":
                      break;
                    case "storage/unknown":
                      break;
                  }
                },
                () => {
                  // if(action.payload.email.length==0 || action.payload.password.length==0 || action.payload.username.length==0){
                  //   state.registerError=="Please, fill the blanks"
                  // }
                  // else if(action.payload.password!==action.payload.confirmPassword){
                  //   state.registerError=="Password error"
                  // }
                  // else{
                    createUserWithEmailAndPassword(
                      auth,
                      action.payload.email,
                      action.payload.password
                    )
                      .then((userCredential) => {
                        const user = userCredential.user;
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                          console.log("File available at", downloadURL);
                          updateProfile(user, {
                            displayName: action.payload.username,
                            photoURL: downloadURL,
                          });
                          const userProperties = {
                            displayName: action.payload.username,
                            email: user.email,
                            photoUrl: downloadURL,
                            uid: user.uid,
                            timeStamp: user.metadata.creationTime,
                            posts: [],
                            requestNotification: [],
                            friendRequests: [],
                            following: [],
                            followers: []
                          };
                          const users = async () => {
                            await addDoc(collection(db, "users"), userProperties);
                            window.location.replace("/home_page/Home");
                          };
                          users()
                        });
                        message.success(
                          "You have been successfully registered.",
                          1,
                          () => {
                            console.log("HEreeee",user)
                            // const userData={...user}
                                                                                               
                          }
                        );
                      })
                      .catch(() => {
                        console.log("User is already have");
                      });
                  }
                  
                // }
              );
            }
        }
    }

})

export const {handleUploadUserData, handleSelectFile, }=resgiterSlice.actions
export const reducer=resgiterSlice.reducer