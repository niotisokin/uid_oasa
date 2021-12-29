async function getDetails(id) {
    let url = `http://localhost:3000/userdetails?id=${id}`; 

    try {
        let response = await axios.get(url);
        // console.log(response.data[1][0]);

        let temporary = response.data[0][0];
        document.getElementById("firstname").innerHTML = temporary.firstname;
        document.getElementById("firstname2").innerHTML = temporary.firstname;
        document.getElementById("surname").innerHTML = temporary.lastname;
        document.getElementById("surname2").innerHTML = temporary.lastname;
        document.getElementById("myusername").innerHTML = temporary.username;
        
        document.getElementById("myemail").innerHTML = temporary.email;

        if (response.data[1][0]) {
            document.getElementById("cardnumber").innerHTML = response.data[1][0].number;
        }
        else {
            document.getElementById("cardnumber").innerHTML = "Δεν υπάρχει κάρτα συνδεδεμένη με τον λογαριασμό σας."
            document.getElementById("show-content").disabled = true;
        }
        
        // if (temporary.imgName) {
        //     document.getElementById("profile_pic").src = `.img/user-pics/${temporary}`;
        // }
        
    } catch (error) {
        console.log(error);
    }
}

function changeScreen() {
    document.getElementById("right-column").classList.toggle("hideme");
    document.getElementById("right-column2").classList.toggle("hideme");

    document.getElementById("username-toggle-1").classList.toggle("hideme");
    document.getElementById("username-toggle-2").classList.toggle("hideme");

    document.getElementById("email-toggle-1").classList.toggle("hideme");
    document.getElementById("email-toggle-2").classList.toggle("hideme");

    document.getElementById("card-toggle-1").classList.toggle("hideme");
    document.getElementById("card-toggle-2").classList.toggle("hideme");

    document.getElementById("right-column").classList.toggle("hideme");
    document.getElementById("right-column").classList.toggle("hideme");

    document.getElementById("edit-profile").classList.toggle("hideme");
    document.getElementById("save-pass").classList.toggle("hideme");
    document.getElementById("cancel-pass").classList.toggle("hideme");
}

async function changePassword() {
    try {
        let mypass = document.getElementById("mynewpassword1").value;
        let mypass2 = document.getElementById("mynewpassword2").value;

        if (mypass != mypass2) {
            alert('Οι κωδικοί στα πεδία δεν ταιριάζουν. Παρακαλώ ξαναπροσπαθήστε.');
            return;
        }
        let myoldpass = document.getElementById("mypassword").value;

        let myid = readCookie("userID");
        if (myid) {
            let url = `http://localhost:3000/checkpass?totallynotapassword=${myoldpass}&id=${myid}`;
            let response = await axios.post(url);
            if (response.data) {
                url = `http://localhost:3000/changepass?totallynotapassword=${mypass}&id=${myid}`
                response = await axios.post(url);
                console.log(response);
                alert("Ο κωδικός άλλαξε επιτυχώς!");
                location.reload();
            }
            else {
                alert("O παλιός κωδικός σας δεν είναι σωστός! Παρακαλώ ξαναπροσπαθήστε.");
            }
        }
    } catch (error) {
        console.log(error);
        alert("Κάτι πήγε στραβά! Ο κωδικός δεν άλλαξε!");
    }
}

async function init() {
    let myid = readCookie("userID");
    if (myid) {
        await getDetails(myid);
    }
    else {
        alert("Πρέπει να είστε συνδεδεμένος για να δείτε το προφίλ σας!");
        location.href = "index.html";
    }
    
    document.getElementById("edit-profile").addEventListener("click", changeScreen);
}

init();