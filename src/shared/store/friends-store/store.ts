import {createSlice} from "@reduxjs/toolkit"
import Router from 'next/router';


interface LoginProps{
    selectedFriend: [],
    selectedId: string
}

const initialState: LoginProps={
  selectedFriend: [],
  selectedId: ""

}

export const friendSlice=createSlice({
    name: 'loginSlice',
    initialState,
    reducers:{
        handleSelectId: (state,action)=>{
            // console.log("action",action.payload)
            state.selectedId=action.payload
        },
        handleSelectUser: (state, action)=>{
            state.selectedFriend=action.payload
            console.log(action.payload)
            Router.push(`/friends_profile/${action.payload.uid}`)
            // 
        }
       
    }

})

export const {handleSelectUser, handleSelectId}=friendSlice.actions
export const reducer=friendSlice.reducer