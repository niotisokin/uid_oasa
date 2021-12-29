function moveOn() {
    sessionStorage.from = document.getElementById("anaxorisi").value;
    sessionStorage.to = document.getElementById("proorismos").value;
    sessionStorage.amea = document.getElementById("amea").checked;
    
    sessionStorage.leave = document.getElementById("option1").parentElement.classList.contains("active");
    // sessionStorage.date = document.getElementById("date").value;
    // sessionStorage.time = document.getElementById("time").value;
    
    sessionStorage.go = "true";
    location.href = "omw.html";
}

async function getOptions(arg) {
    let url = "http://localhost:3000/" + arg;
    try {
        let response = await axios.get(url);

        let str = ``;
        response.data.forEach(element => {
            str = str + `
            <option>${element.name}</option>`
        });
        
        return str;
    } catch (error) {
        console.log(error);
    }
}

function switch_content() {
    var temp = document.getElementById("anaxorisi").value;
    document.getElementById("anaxorisi").value = document.getElementById("proorismos").value;
    document.getElementById("proorismos").value = temp;
}

async function init() {
    
    sessionStorage.from = "";
    sessionStorage.to = "";
    sessionStorage.amea = "";
    sessionStorage.leave = "";


    document.getElementById("option1").click();
    document.getElementById("switch-icon").addEventListener("click", switch_content);
    document.getElementById("submit-button").addEventListener("click", moveOn);

    let temp = document.createElement("div");
    temp.innerHTML = await getOptions("stops");
    document.getElementById("stops").appendChild(temp);

}

init();