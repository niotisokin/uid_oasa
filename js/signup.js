async function signup() {
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let rePass = document.getElementById('rePassword').value;
    let terms = document.getElementById('agree')
    
    myinput = "?username="+username+"&email="+email+"&password="+password;
    // +"&f="+filter+"&m0="+t[0]+"&m1="+t[1]+"&m2="+t[2]+"&m3="+t[3];
    console.log(myinput);
    let url = 'http://localhost:3000/signup' + myinput;
    console.log(url);
    if(password != rePass) {
        alert('Οι κωδικοί πρόσβασης που εισήχθηκαν δεν ταιριάζουν')
    } else {
        if (terms.checked === false) {
            alert('Πρέπει να αποδεχθείτε τους όρους χρήσης για να συνεχίσετε')
        } else {
            try {
                response = await axios.post(url)
                if (response.data === 'complete') {
                    alert('Η εγγραφή σας ολοκληρώθηκε')
                    location.reload()
                } else if ( response.data === 'email') {
                    alert('Αυτό το email χρησιμοποιείται.')
                } else if (response.data === 'username') {
                    alert('Αυτό το όνομα χρήστη χρησιμοποιείται. Παρακαλώ επιλέξτε ένα διαθέσιμο.')
                }
            } catch(error) {
                        console.log(error);
                    };
        }
    }
}
        
document.getElementById('signup').addEventListener('click', signup)
