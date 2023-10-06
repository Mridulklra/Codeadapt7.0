console.log("yess");

const firebaseConfig = {
    apiKey: "AIzaSyC7HQOk_48izg0MI3LdfcZl112Ixe316AA",
    authDomain: "login-with-firebase-data-9ad33.firebaseapp.com",
    projectId: "login-with-firebase-data-9ad33",
    storageBucket: "login-with-firebase-data-9ad33.appspot.com",
    messagingSenderId: "446403990917",
    appId: "1:446403990917:web:210464424be372690220ec"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig); // Fixed typo in initializeApp

const database = firebase.database();

// Function to register a user
function registerUser() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const branch = document.getElementById('branch').value;
  const graduationYear = document.getElementById('graduationYear').value;
  const enrollmentNumber = document.getElementById('enrollmentNumber').value;
  const semester = document.getElementById('semester').value;
  const previousSkills = document.getElementById('previousSkills').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const university = document.getElementById('university').value;
  const address = document.getElementById('address').value;

  // You can add more validations here if needed

  // Firebase registration
  var user = auth.currentUser;

  firebase.auth().createUserWithEmailAndPassword(email, 'PASSWORD') // Replace 'PASSWORD' with a secure password
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('User registered:', user);

      // You can now store additional user data to Firestore or Realtime Database
      // For example, Firestore:

      var database_ref = database.ref()

      var user_data = {
        firstName: firstName,
        lastName: lastName,
        branch: branch,
        graduationYear: graduationYear,
        enrollmentNumber: enrollmentNumber,
        semester: semester,
        previousSkills: previousSkills,
        email: email,
        phoneNumber: phoneNumber,
        university: university,
        address: address,
        last_login: Date.now()
      };

      database_ref.child('users/' + user.uid).set(user_data);

      const db = firebase.firestore();
      db.collection('users').doc(user.uid).set({
        firstName,
        lastName,
        branch,
        graduationYear,
        enrollmentNumber,
        semester,
        previousSkills,
        email,
        phoneNumber,
        university,
        address
      })
      .then(() => {
        console.log('User data added to Firestore');
      })
      .catch((error) => {
        console.error('Error adding user data to Firestore:', error);
      });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Registration Error:', errorMessage);
    });
}

// Attach the registerUser function to the button click event
document.querySelector('button').addEventListener('click', registerUser);
