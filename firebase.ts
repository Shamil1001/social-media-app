import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {getAuth} from 'firebase/auth'
import 'firebase/firestore'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxRhsOuHo3qtfer7Pl26sgFyynjcyV5FY",
    authDomain: "social-media-5e2b7.firebaseapp.com",
    databaseURL: "https://social-media-5e2b7-default-rtdb.firebaseio.com",
    projectId: "social-media-5e2b7",
    storageBucket: "social-media-5e2b7.appspot.com",
    messagingSenderId: "851337046978",
    appId: "1:851337046978:web:1477f5dc28235f117e445b",
    measurementId: "G-4BQ096GL3F"
  };

const app=initializeApp(firebaseConfig)
// const app =!getApps().length ? initializeApp(firebaseConfig) : getApp()
const db= getFirestore()
const storage= getStorage()

export default app
export {db, storage}
export const auth = getAuth()
