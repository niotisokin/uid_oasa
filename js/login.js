if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', checkLoggedIn)
} else {
    checkLoggedIn()
}

function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}

function writeCookie(name,value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

async function login() {
    // var sessionUserID = readCookie('userID');
    // if (sessionUserID) {
    //     console.log(sessionUserID)
    //     writeCookie('userID','',0)
    //     return
    // }
    let username = document.getElementById('login-username').value;
    let password = document.getElementById('login-pw').value;

    myinput = '?username='+username+'&pw='+password;
    console.log(myinput);
    let url = 'http://localhost:3000/login' + myinput;
    console.log(url);

    if (username.length > 0 && password.length > 0){
        try {
            let response = await axios.post(url)
            console.log(response.data.id)
            if (response.data.id) {
                let userID = response.data.id.toString(10)
                writeCookie('userID',userID,1)
                // alert('logged in!!!')
                location.reload()
            } else {
                alert('Λάθος όνομα χρήστη ή κωδικός πρόσβασης')
            }
        } catch(error) {
            console.log(error)
        }
    }
}

async function logout() {
    writeCookie('userID','',0) //delete sessionUserCookie
    location.reload()
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdownlog").classList.toggle("shown");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtnlog')) {
        var dropdowns = document.getElementsByClassName("dropdown-contentlog");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('shown')) {
                openDropdown.classList.remove('shown');
            }
        }
    }
}

async function checkLoggedIn() {
    var cookieUserId = readCookie('userID');
    if (cookieUserId) {
        console.log('A user is aleady logged in, '+cookieUserId);
        let loginTrigger = document.getElementsByClassName('login-trigger')[0];
        let myinput = '?id='+cookieUserId;
        let url =  'http://localhost:3000/getname' + myinput;
        try{
            let response = await axios.post(url);
            // console.log(response)
            var accountUsername = response.data;
            // console.log(username)
            let text =`
            <a href="#" class="accountTrigger dropdownlog" id="login-register">
            <button onclick="myFunction()" class="dropbtnlog" style="height: 100%;">
            <img src="./img/person_icon.png" alt="">
            ${accountUsername}
            </button>
            <div id="myDropdownlog" class="dropdown-contentlog">
            <a href="profile.html">Προβολή λογαριασμού</a>
            <a href="#">Τα εισητήριά μου</a>
            <a href="#" onclick="logout()" style="border-top: solid 1px #bebebe">Αποσύνδεση</a>
            </div>
            </a>`;
            // <a href="#" class="accountTrigger" id="login-register">
            //     <img src="./img/person_icon.png" alt="">
            //     <span id="login-text">${accountUsername}</span>
            // </a>`
            
            // console.log(loginTrigger.outerHTML)
            loginTrigger.outerHTML = text;
            let accountTrigger = document.getElementsByClassName('accountTrigger')[0];
        } catch(error) {
            console.log(error);
        }
    } 
}

document.getElementById('login-btn').addEventListener('click', login);
let blueText = document.getElementsByClassName('blue-text')
blueText[0].addEventListener('click', function() {
    document.getElementsByClassName('nav-link')[1].click();
})
blueText[2].addEventListener('click', function() {
    document.getElementsByClassName('nav-link')[0].click();
})
