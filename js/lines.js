async function getOptions(arg) {
    let url = "http://localhost:3000/" + arg;
    try {
        let response = await axios.get(url)
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

async function getStops(val) {
    let url = `http://localhost:3000/stopline?name=${val}`;
    try {
        let response = await axios.get(url)
        let str = ``;
        response.data.forEach(element => {
            str = str + `
            <div class="d-flex">
                <img src="./img/${element.type}_white.png" alt="">
                <span>${element.name}</span>
            </div>`;
        });

        return str;
    } catch (error) {
        console.log(error);
    }

}

async function getlinestops(val) {
    let url = `http://localhost:3000/linestops?code=${val}`;
    try {
        let response = await axios.get(url)
        let str = ``;
        response.data.forEach(element => {
            str = str + `
            <div class="d-flex">
                <span>${element.name}</span>`
            if (element.amea) {
                str = str + `
                <img src="./img/wheelchair_icon.png" alt="">`;
            }
            str = str + `
            </div>`;
        });

        return str;
    } catch (error) {
        console.log(error);
    }
}

let cl = document.getElementsByClassName("close"); //setting bin buttons functionality
for (let i = 0; i < cl.length; i++) {
    let element = cl[i];
    element.addEventListener("click", () => {
        let myinput = element.parentElement.parentElement.getElementsByTagName("input")[i];
        myinput.value = '';
        myinput.focus();
    });
}

function setShown(id) {
    document.getElementById("default-screen").classList.remove("shownn");
    document.getElementById("line-search-screen").classList.remove("shownn");
    document.getElementById("stop-search-screen").classList.remove("shownn");
    
    document.getElementById(id).classList.add("shownn");
}

async function setTimetableScreen() {
    let val = document.getElementById("my_search_bar1").value;
    if (val === "") {
        console.log("No Value!");
        return;
    }
    else {
        try {
            setShown("line-search-screen");
            let temp = document.createElement("div");
            temp.innerHTML = await getOptions(`timetable?code=${val}`);
            document.getElementById("wres").innerHTML = '';
            document.getElementById("wres").appendChild(temp);
            
            let temp2 = document.createElement("div");
            temp2.innerHTML = await getlinestops(val);
            document.getElementById("staseis").innerHTML = '';
            document.getElementById("staseis").appendChild(temp2);
            
            let txts = temp2.getElementsByTagName("div");
            for (let i = 0; i < txts.length; i++) {
                let element = txts[i];
                element.addEventListener("click", async () => {
                    let myval = element.getElementsByTagName("span")[0].innerText;
                    document.getElementById("my_search_bar2").value = myval;
                    await setStopScreen();
                });
            }
            
        } catch (error) {
            console.log(error);
        }
    }
}

async function setStopScreen() {
    let val = document.getElementById("my_search_bar2").value;
    if (val === "") {
        console.log("No Value!");
        return;
    }
    else {
        try {
            setShown("stop-search-screen");
            let temp = document.createElement("div");
            
            temp.innerHTML = await getStops(val);
            document.getElementById("grammes").innerHTML = '';
            document.getElementById("grammes").appendChild(temp);

            let txts = temp.getElementsByTagName("div");
            for (let i = 0; i < txts.length; i++) {
                let element = txts[i];                
                element.addEventListener("click", async () => {
                    let myval = element.getElementsByTagName("span")[0].innerText;                    
                    document.getElementById("my_search_bar1").value = myval;
                    await setTimetableScreen();
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

async function init() {
    setShown("default-screen");

    let temp = document.createElement("div");
    temp.innerHTML = await getOptions("lines");
    document.getElementById("lines").appendChild(temp);
    
    temp = document.createElement("div");
    temp.innerHTML = await getOptions("stops");
    document.getElementById("stops").appendChild(temp);

    document.getElementById("searchbar1").addEventListener("click", setTimetableScreen);
    document.getElementById("searchbar2").addEventListener("click", setStopScreen);
}

init();

