if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

async function ready() {
    let q = document.getElementsByClassName('quantities')[0]
    let t = document.getElementsByClassName('tickets')[0]
    
    let parser = new DOMParser;
    let dom = parser.parseFromString(
        '<!doctype html><body>' + sessionStorage.quantities,
        'text/html');
    let decodedString = dom.body.textContent;
    q.innerHTML = decodedString

    parser = new DOMParser;
    dom = parser.parseFromString(
        '<!doctype html><body>' + sessionStorage.titles,
        'text/html');
    decodedString = dom.body.textContent;
    t.innerHTML = decodedString

    sessionStorage.clear()
}