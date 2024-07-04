import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAwH9YSYxVFVX8fUpOHuuKTA_DAwLoANnI",
    authDomain: "mysarisaristore-bc480.firebaseapp.com",  
    projectId: "mysarisaristore-bc480",  
    storageBucket: "mysarisaristore-bc480.appspot.com",  
    messagingSenderId: "472989334850",  
    appId: "1:472989334850:web:17fd8296c394a61fd29cdb"  
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);    
    firebase.firestore().settings({ experimentalForceLongPolling: true });
}

export{firebase};