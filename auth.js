var firebaseConfig = {
    apiKey: "AIzaSyB_OFz8V50Pup8tfZBZ7ygO605RZ3rPBUM",
    authDomain: "ecocents-e073c.firebaseapp.com",
    projectId: "ecocents-e073c",
    storageBucket: "ecocents-e073c.appspot.com",
    messagingSenderId: "451736042816",
    appId: "1:451736042816:web:114124d486b0cbeea2cea5"
};

firebase.initializeApp(firebaseConfig);

// Authentication state change listener
firebase.auth().onAuthStateChanged(function (user) {
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');
    var userDetails = document.getElementById('user-details');
    var authOptions = document.getElementById('auth-options');
    
    // Clear old user info
    resetUserDetails();

    if (user) {
        // User is signed in
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        userDetails.style.display = 'block';
        authOptions.style.display = 'none';

        document.getElementById('user-email').innerText = user.email;

        var docRef = firebase.firestore().collection("users").doc(user.uid);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                // Display user info including new fields
                document.getElementById('user-firstname').innerText = doc.data().firstname;
                document.getElementById('user-lastname').innerText = doc.data().lastname;
                document.getElementById('user-cost-per-kwh').innerText = doc.data().costPerKwh;
                document.getElementById('user-cost-per-gallon').innerText = doc.data().costPerGallon;
            } else {
                console.log("No user document found!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    } else {
        // No user signed in
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        userDetails.style.display = 'none';
        authOptions.style.display = 'block';
    }
});

// Show login form
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Show register form
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Login function
function login(event) {
    event.preventDefault();
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value.trim();

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            alert("Logged in successfully!");
        })
        .catch(function (error) {
            console.error("Error logging in:", error);
            alert("Error: " + error.message);
        });
}

// Register function
function register(event) {
    event.preventDefault();
    var email = document.getElementById('register-email').value.trim();
    var password = document.getElementById('register-password').value.trim();

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (user) {
            alert("Registration successful! Please log in.");
            showLoginForm(); // Redirect back to login after registration
        })
        .catch(function (error) {
            console.error("Error registering:", error);
            alert("Error: " + error.message);
        });
}

// Logout function
function logout() {
    firebase.auth().signOut().then(function () {
        alert("You have logged out.");
        showLoginForm(); // After logging out, go back to login form
        resetUserDetails(); // Clear user details
    }).catch(function (error) {
        console.log("Error logging out:", error);
    });
}

// Update user details
function updateUser(event) {
    event.preventDefault();
    var firstname = document.getElementById('update-firstname').value.trim();
    var lastname = document.getElementById('update-lastname').value.trim();
    var costPerKwh = document.getElementById('update-cost-per-kwh').value.trim();
    var costPerGallon = document.getElementById('update-cost-per-gallon').value.trim();
    var userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);

    // Update user details in Firestore
    userRef.set({
        firstname: firstname,
        lastname: lastname,
        costPerKwh: costPerKwh,
        costPerGallon: costPerGallon
    }, { merge: true }).then(function () {
        alert("User details updated successfully!");
        // Update the displayed values on the page
        document.getElementById('user-firstname').innerText = firstname;
        document.getElementById('user-lastname').innerText = lastname;
        document.getElementById('user-cost-per-kwh').innerText = costPerKwh;
        document.getElementById('user-cost-per-gallon').innerText = costPerGallon;
        clearInputFields(); // Clear the input fields after update
    }).catch(function (error) {
        console.error("Error updating document: ", error);
        alert("Error updating details: " + error.message);
    });
}

// Function to clear user details from the display
function resetUserDetails() {
    document.getElementById('user-firstname').innerText = "";
    document.getElementById('user-lastname').innerText = "";
    document.getElementById('user-cost-per-kwh').innerText = "";
    document.getElementById('user-cost-per-gallon').innerText = "";
}

// Function to clear the input fields for updating user details
function clearInputFields() {
    document.getElementById('update-firstname').value = "";
    document.getElementById('update-lastname').value = "";
    document.getElementById('update-cost-per-kwh').value = "";
    document.getElementById('update-cost-per-gallon').value = "";
}







// var firebaseConfig = {
//     apiKey: "AIzaSyB_OFz8V50Pup8tfZBZ7ygO605RZ3rPBUM",
//         authDomain: "ecocents-e073c.firebaseapp.com",
//         projectId: "ecocents-e073c",
//         storageBucket: "ecocents-e073c.firebasestorage.app",
//         messagingSenderId: "451736042816",
//         appId: "1:451736042816:web:114124d486b0cbeea2cea5"
// };

// firebase.initializeApp(firebaseConfig);

// firebase.auth().onAuthStateChanged(function(user){
//     var notLoggedIn = document.getElementById('not-logged-in')
//     var loggedIn = document.getElementById('logged-in')
//     if(user){
//         //User is signed in.
//         loggedIn.style.display = 'block'
//         notLoggedIn.style.display = 'none'
//         document.getElementById('user-email').innerText = firebase.auth().currentUser.email;

//         var docRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

//         docRef.get().then(function(doc){
//             if(doc.exists){
//                 document.getElementById('user-firstname').innerText = doc.data().firstname;
//                 document.getElementById('user-lastname').innerText = doc.data().lastname;
//                 document.getElementById('user-buildingname').innerText = doc.data().buildingname;
//             }else{
//                 //doc.data() will be undefined in this case
//                 console.log("No such document!");
//             }
//         }).catch(function(error){
//             console.log("Error getting document:", error);
//         });

//     } else{
//         //No user is signed in.
//         loggedIn.style.display = 'none'
//         notLoggedIn.style.display = 'block'
//     }
// });


// function login(event){
//     event.preventDefault()
//     var email = document.getElementById('email').value
//     var password = document.getElementById('password').value
//     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
//         console.log('Error signing in, ' ,error.message)
//         alert(error.message)
//     }).then(function(user){
//         if(user){
//             alert('Welcome back, you are now logged in !')
//         }
//     })
// }

// function register(event) {
//     event.preventDefault();

//     var email = document.getElementById('email').value.trim();
//     var password = document.getElementById('password').value.trim();

//     // Basic input validation
//     if (!email || !password) {
//         alert("Email and password are required.");
//         return;
//     }

//     // Email format validation (optional, Firebase does this as well)
//     var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//         alert("Please enter a valid email address.");
//         return;
//     }

//     // Firebase registration
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//         .then(function (userCredential) {
//             var user = userCredential.user;

//             // Add user info to Firestore
//             return firebase.firestore().collection("users").doc(user.uid).set({
//                 firstname: "Default First Name",
//                 lastname: "Default Last Name",
//                 buildingname: "Default Building Name"
//             });
//         })
//         .then(function () {
//             alert("Registration successful!");
//         })
//         .catch(function (error) {
//             console.error("Error registering user: ", error.message);
//             alert(error.message);
//         });
// }



// function updateUser(event){
//     event.preventDefault()
//     var firstname = document.getElementById('firstname').value
//     var lastname = document.getElementById('lastname').value
//     var buildingname = document.getElementById('buildingname').value
//     var userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);

//     var setWithMerge = userRef.set({
//         firstname: firstname,
//         lastname: lastname,
//         buildingname, buildingname
//     }, {merge: true});
// }

// function logout(){
//     firebase.auth().signOut().then(function(){
//         //Sign-out successful.
//     }).catch(function(error){
//         //An error happened.
//     });
// }