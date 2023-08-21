import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

interface LoginProps {
  imageFile: any;
  isDataSent: boolean;
  registerInformation: {
    username: string;
    email: string;
    password: string;
  };
  loginError: string;
}

const initialState: LoginProps = {
  imageFile: null,
  isDataSent: false,
  registerInformation: {
    username: "",
    email: "",
    password: "",
  },
  loginError: "",
};

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    handleLogin: (state, action) => {
      const auth = getAuth();

      if (action.payload.email.length === 0 || action.payload.password.length === 0) {
        state.loginError = "Please fill the blanks";
      } else  {
        signInWithEmailAndPassword(auth, action.payload.email, action.payload.password)
          .then(() => {
            message.success("You have been successfully logged in.", 1, () => {
              window.location.replace("/home_page/Home");
            });
          })
          .catch((error) => {
            console.log("Error status code:", error.code);
            // state.loginError = error.code;
          });
      }
      
    },
  },
});

export const { handleLogin } = loginSlice.actions;
export const reducer = loginSlice.reducer;
