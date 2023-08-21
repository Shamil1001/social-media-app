import { configureStore } from "@reduxjs/toolkit"
import {resgiterSlice} from '@/shared/store/register_store/store/store'
import {loginSlice} from '@/shared/store/login_store/store/store'
import {homeSlice} from "@/shared/store/homePage_store/store/store"
import { friendSlice } from "@/shared/store/friends-store/store"

export const store=configureStore({
    reducer: {
        register: resgiterSlice.reducer,
        login: loginSlice.reducer,
        home: homeSlice.reducer,
        friend: friendSlice.reducer
    }
})