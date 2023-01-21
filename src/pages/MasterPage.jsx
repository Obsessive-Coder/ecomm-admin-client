import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import { onAuthStateChanged } from 'firebase/auth';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom components.
import AuthRoutes from './AuthRoutes';
import Login from './Login';

// Styles, utils, and other helpers.
import '../style.css';

export default function MasterPage() {
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

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  const handleLogout = () => {
    firebase.auth().signOut();
    setUser({});
    localStorage.setItem('user', JSON.stringify({}));
  };

  useEffect(() => {
    onAuthStateChanged(firebase.auth(), user => {
      let sessionUser = {};

      if (user) {
        sessionUser = { email: user.email, uid: user.uid };
      }

      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
    });
  }, [user.email]);

  return (
    <Container fluid>
      {user.email ? (
        <AuthRoutes handleLogout={handleLogout} />
      ) : (
        <Login auth={firebase.auth()} />
      )}
    </Container>
  )
}
