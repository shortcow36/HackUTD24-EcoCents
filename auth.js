var firebaseConfig = {
    apiKey: "AIzaSyB_OFz8V50Pup8tfZBZ7ygO605RZ3rPBUM",
    authDomain: "ecocents-e073c.firebaseapp.com",
    projectId: "ecocents-e073c",
    storageBucket: "ecocents-e073c.appspot.com",
    messagingSenderId: "451736042816",
    appId: "1:451736042816:web:114124d486b0cbeea2cea5"
};

firebase.initializeApp(firebaseConfig);

// authentication state change listener
firebase.auth().onAuthStateChanged(function (user) {
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');
    var userDetails = document.getElementById('user-details');
    var authOptions = document.getElementById('auth-options');
    
    // clear old user
    resetUserDetails();

    if (user) {
        // signed in
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        userDetails.style.display = 'block';
        authOptions.style.display = 'none';

        document.getElementById('user-email').innerText = user.email;

        var docRef = firebase.firestore().collection("users").doc(user.uid);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                // Display user info
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
        // no user signed in
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        userDetails.style.display = 'none';
        authOptions.style.display = 'block';
    }
});

// show login form
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// show register form
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// login function
function login(event) {
    event.preventDefault();
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value.trim();

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        alert("Logged in successfully!");
        // redirect
        window.location.href = "Dashboard.html";
    })
    .catch((error) => {
        console.error("Error logging in:", error);
        alert("Error: " + error.message);
    });


// register function
function register(event) {
    event.preventDefault();
    var email = document.getElementById('register-email').value.trim();
    var password = document.getElementById('register-password').value.trim();

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (user) {
            alert("Registration successful! Please log in.");
            showLoginForm(); 
        })
        .catch(function (error) {
            console.error("Error registering:", error);
            alert("Error: " + error.message);
        });
}

// logout function
function logout() {
    firebase.auth().signOut().then(function () {
        alert("You have logged out.");
        showLoginForm(); 
        resetUserDetails(); 
    }).catch(function (error) {
        console.log("Error logging out:", error);
    });
}

// update user details
function updateUser(event) {
    event.preventDefault();
    var firstname = document.getElementById('update-firstname').value.trim();
    var lastname = document.getElementById('update-lastname').value.trim();
    var costPerKwh = document.getElementById('update-cost-per-kwh').value.trim();
    var costPerGallon = document.getElementById('update-cost-per-gallon').value.trim();
    var userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);


    userRef.set({
        firstname: firstname,
        lastname: lastname,
        costPerKwh: costPerKwh,
        costPerGallon: costPerGallon
    }, { merge: true }).then(function () {
        alert("User details updated successfully!");

        document.getElementById('user-firstname').innerText = firstname;
        document.getElementById('user-lastname').innerText = lastname;
        document.getElementById('user-cost-per-kwh').innerText = costPerKwh;
        document.getElementById('user-cost-per-gallon').innerText = costPerGallon;
        clearInputFields(); 
    }).catch(function (error) {
        console.error("Error updating document: ", error);
        alert("Error updating details: " + error.message);
    });
}

// clear user details from display
function resetUserDetails() {
    document.getElementById('user-firstname').innerText = "";
    document.getElementById('user-lastname').innerText = "";
    document.getElementById('user-cost-per-kwh').innerText = "";
    document.getElementById('user-cost-per-gallon').innerText = "";
}

//clear  input fields for updating user details
function clearInputFields() {
    document.getElementById('update-firstname').value = "";
    document.getElementById('update-lastname').value = "";
    document.getElementById('update-cost-per-kwh').value = "";
    document.getElementById('update-cost-per-gallon').value = "";
}
}
