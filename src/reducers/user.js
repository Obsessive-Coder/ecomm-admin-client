import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Firebase.
import 'firebaseui';
import firebase from 'firebase/compat/app';
import { getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDNCKU_ztvevPFell0ItLvZHj5LXMXvDrM",
  authDomain: "admin-site-7045f.firebaseapp.com",
  projectId: "admin-site-7045f",
  storageBucket: "admin-site-7045f.appspot.com",
  messagingSenderId: "132117631723",
  appId: "1:132117631723:web:0aef2bf89067b71131a4ae",
  measurementId: "G-KE2FHM4V1P"
};

firebase.initializeApp(firebaseConfig);

export const logIn = createAsyncThunk(
  'user/logIn',
  async ({ email, password }) => {
    try {
      const auth = getAuth();
      const { user: { uid, accessToken } = {} } = await signInWithEmailAndPassword(auth, email, password);

      let user = {};
      if (uid) {
        user = { email, uid, accessToken };
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.log(error.message);
      return {};
    }
  }
);

export const logOut = createAsyncThunk(
  '/user/logOut',
  async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem('user');
    return {};
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: { value: JSON.parse(localStorage.getItem('user')) ?? {} },
  reducers: {
    clearItem(state) {
      state.value = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.value = { ...state.value, ...action.payload };
    });

    builder.addCase(logOut.fulfilled, (state, action) => {
      state.value = {};
    });
  }
});

export const { clearItem } = userSlice.actions;
export const reduxActions = { logIn, logOut, clearItem };

export default userSlice.reducer;