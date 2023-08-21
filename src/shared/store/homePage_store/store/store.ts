import {createSlice} from "@reduxjs/toolkit"


const initialState={
    selectFile: null
}

export const homeSlice=createSlice({
    name: "homeSlice",
    initialState,
    reducers: {
        addImageToPost: (state, action) => {
            console.log("action.payload")
            const reader = new FileReader();
            if (action.payload.target.files[0]) {
              reader.readAsDataURL(action.payload.target.files[0]);
            }
            reader.onload = (readerEvent: any) => {
                state.selectFile=readerEvent.target?.result
            //   setSelectedFile(readerEvent.target?.result);
            // console.log(state.selectFile)
            }
          },
          setSelectedFile: (state, action)=>{
            state.selectFile=action.payload
          }

    }
})


export const {addImageToPost, setSelectedFile}=homeSlice.actions
export const reducer=homeSlice.reducer