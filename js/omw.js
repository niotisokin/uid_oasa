
/* <a href="">
<div class="result">
<div class="d-flex flex-fill">
<img class="icon" src="./img/tram.png" alt=""><span class="tram">T1</span>Ανθούπολη<img class="arrow" src="./img/arrow_right.png" alt=""> <img class="icon" src="./img/metro.png" alt=""><span class="M1">M1</span>Σύνταγμα<img class="arrow" src="./img/arrow_right.png" alt="">Ευαγγελισμός
</div>
<div class="d-flex flex-fill est-time flex-fill flex-row-reverse">Εκτιμώμενος Χρόνος: 25'</div>
</div>
</a> */

function createSimpleNode(from, i, to) {
    let time = Math.floor((Math.random() * 20) + 11);
    
    let itype = i.type;
    if (i.type === 'metro') {
        itype = i.line;
    }
    
    node = [time, `
    <div class="result">
    <div class="d-flex flex-fill">
    ${from}
    <img class="icon" src="./img/${i.type}.png" alt="">
    <span class="${itype}">${i.line}</span>
    <img class="arrow" src="./img/arrow_right.png" alt="">
    ${to}
    </div>
    <div class="d-flex flex-fill est-time flex-fill flex-row-reverse">Εκτιμώμενος Χρόνος: ${time}'</div>
    </div>`] 
    
    return node;
}

function createComplexNode(from, k, l, to) {
    let time = Math.floor((Math.random() * 20) + 21);
    
    let ktype = k.type;
    if (k.type === 'metro') {
        ktype = k.line;
    }    
    let ltype = l.type;
    if (l.type === 'metro') {
        ltype = l.line;
    }
    
    node = [time, `
    <div class="result">
    <div class="d-flex flex-fill">
    ${from}
    <img class="icon" src="./img/${k.type}.png" alt="">
    <span class="${ktype}">${k.line}</span>
    <img class="arrow" src="./img/arrow_right.png" alt="">
    ${k.name}
    <img class="icon" src="./img/${l.type}.png" alt="">
    <span class="${ltype}">${l.line}</span>
    <img class="arrow" src="./img/arrow_right.png" alt="">
    ${to}
    </div>
    <div class="d-flex flex-fill est-time flex-fill flex-row-reverse">Εκτιμώμενος Χρόνος: ${time}'</div>
    </div>`]
    
    return node;
}

async function routeSearch() {
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;
    let amea = document.getElementById("amea").checked === true ? 1 : 0;
    // let leave = document.getElementById("option1").checked === true ? 1 : 0;
    // let date = document.getElementById("date").value;
    // let time = document.getElementById("time").value;
    
    let filter = 0;
    {   let filters = document.getElementById("filtra").getElementsByTagName("input");
    if (filters[0].checked === true) {
        filter = 1
    }
    else if (filters[1].checked === true) {
        filter = 2
    }
    else if (filters[2].checked === true) {
        filter = 3
    }   }
    
    let mmm = document.getElementById("travelWith").getElementsByTagName("input");
    let t = {"bus":mmm[0].checked === true ? 1 : 0,
    "metro":mmm[1].checked === true ? 1 : 0,
    "tram":mmm[2].checked === true ? 1 : 0,
    "trolley":mmm[3].checked === true ? 1 : 0}
    let myinput = "?from="+from+"&to="+to+"&a="+amea;
    // +"&l="+leave+"&f="+filter+"&m0="+t[0]+"&m1="+t[1]+"&m2="+t[2]+"&m3="+t[3];
    let url = "http://localhost:3000/findroute" + myinput;
    try {
        
        console.log(url);
        let r = document.getElementById("results");
        // console.log(from, to);
        
        if (from === "" || to === "") {
            r.innerHTML = "Παρακαλώ συμπληρώστε τα απαραίτητα πεδία!";
            r.classList.add("errormessage");
            return;
        }
        
        if (from === to) {
            r.innerHTML = "Η Αφετηρία και ο Προορισμός δεν μπορούν να είναι ίδιοι!";
            r.classList.add("errormessage");
            return;
        }
        
        let response = await axios.get(url);
        let start = response.data[0];
        let dest = response.data[1];
        let stops1 = response.data[2];
        let stops2 = response.data[3];
        
        let results = [];
        // let short = 0;
        start.forEach(i => {
            dest.forEach(j => {
                // console.log(i, j, i.type, t[i.type]);
                if ((amea == false || ( i.amea == true && j.amea == true)) &&
                i.line === j.line && t[i.type] === 1 &&
                results.length < 3)
                {  //if in same line
                    results.push(createSimpleNode(from, i, to));
                }
            });
        });
        start.forEach(i => {
            dest.forEach(j => {
                stops1.forEach(k => {
                    stops2.forEach(l => {
                        if (k.line != l.line && k.name === l.name &&
                            k.name != i.name && k.line === i.line &&
                            l.name != j.name && l.line === j.line &&
                            i.line != j.line &&
                            t[i.type] === 1 && t[j.type] ===1 &&
                            t[k.type] === 1 && t[l.type] === 1 &&
                            (amea == false || ( i.amea == true && j.amea == true && k.amea == true)) && 
                            results.length < 3) 
                            {
                                results.push(createComplexNode(from, k, l, to));
                        }
                    });
                });
            });
        });
        if (filter != 3){
            results.sort((a, b) => {
                return a[0] > b[0];
            });
        }
        r.innerHTML = "";
        results.forEach(str => {            
            let node = document.createElement("a");
            node.innerHTML = str[1];
            node.href = '';
            r.append(node);
        });
        if (results.length === 0) {
            r.innerHTML = "Δεν υπάρχουν αποτελέσματα για την αναζήτησή σας!";
            r.classList.add("errormessage");
        }
    } catch (error) {
        console.log(error);
    }
}

async function getOptions(arg) {
    let url = "http://localhost:3000/" + arg;
    try {
        let response = await axios.get(url);
        
        // console.log(response.data);
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
    var temp = document.getElementById("from").value;
    document.getElementById("from").value = document.getElementById("to").value;
    document.getElementById("to").value = temp;
}

async function init() {

    document.getElementById("switch-icon").addEventListener("click", switch_content);
    
    let a = document.getElementsByClassName("close");
    for (let i = 0; i < a.length; i++) {
        let element = a[i];
        element.addEventListener("click", () => {
            let myinput = element.parentElement.parentElement.getElementsByTagName("input")[i];
            myinput.value = '';
            myinput.focus();
        });
    }
    
    document.getElementById("filtra").getElementsByTagName("input")[0].click(); 
    console.log(document.getElementById("filtra").getElementsByTagName("input")[0]);
    // document.getElementById("option1").click();
    
    document.getElementById("submit-button").addEventListener("click", routeSearch);
    
    let temp = document.createElement("div");
    temp.innerHTML = await getOptions("stops");
    document.getElementById("stops").appendChild(temp);

    if (sessionStorage.from) {
        document.getElementById("from").value = sessionStorage.from;
    }
    if (sessionStorage.to) {
        document.getElementById("to").value = sessionStorage.to;
    }
    if (sessionStorage.amea === "true") {
        // document.getElementById("amea").checked = sessionStorage.amea;
        document.getElementById("amea").click();
    }
    if (sessionStorage.leave === "false") {
        document.getElementById("option2").click();
    } else {
        document.getElementById("option1").click();
    }
    if (sessionStorage.go === "true") {
        routeSearch()
    }
    sessionStorage.clear();
}

init();