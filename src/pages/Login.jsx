import React, { useEffect } from 'react';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import firebase from 'firebase/compat/app';

export default function Login({ auth }) {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('.firebase-auth-container', {
      signInOptions: [{
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
        disableSignUp: {
          status: true,
          adminEmail: ['test@test.com']
        }
      }],
      signInSuccessUrl: '/',
      privacyPolicyUrl: ''
    });
  }, [auth]);

  return (
    <div>
      <div className="firebase-auth-container"></div>
    </div>
  );
}
