import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        user: null, // Add this: we'll store the { name, role } object here
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token; // Changed from just 'token'
            state.user = action.payload.user;   // Capture the user object!
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.user = null; // Clear the user
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;