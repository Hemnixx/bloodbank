import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'), // True if token exists, false if not
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token'); // Destroys the wristband!
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;