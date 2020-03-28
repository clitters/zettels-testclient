var idblog = document.getElementById("idblog");
idblog.value += "init.js Start";
// In der folgenden Zeile sollten Sie die Präfixe einfügen, die Sie testen wollen.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// Verwenden Sie "var indexedDB = ..." NICHT außerhalb einer Funktion.
// Ferner benötigen Sie evtl. Referenzen zu einigen window.IDB* Objekten:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla hat diese Objekte nie mit Präfixen versehen, also brauchen wir kein window.mozIDB*)

if (!window.indexedDB) {
    window.alert("Ihr Browser unterstützt keine stabile Version von IndexedDB. Dieses und jenes Feature wird Ihnen nicht zur Verfügung stehen.");
}

// Öffnen unserer Datenbank
var request = window.indexedDB.open("zettels-testdb", 2);

request.onerror = function (event) {
    // Machen Sie etwas mit request.errorCode!
    idblog.value += 'err: ' + request.error;
};
request.onsuccess = function (event) {
    // Machen Sie etwas mit request.result!
    idblog.value += 'res: ' + request.result;
};

// Dieses Event ist lediglich in modernen Browsern verfügbar
request.onupgradeneeded = function (event) {
    var db = event.target.result;

    // Erstelle ein ObjectStore für diese Datenbank
    var objectStore = db.createObjectStore("Todo", { keyPath: "_id" });
    // Indizes
    // objectStore.createIndex("")

};

const user = {
    "email": "christoph@litters.org",
    "password": "sagichdirnet"
}
/*var xhr = new XMLHttpRequest();
var url = "http://127.0.0.1:3000/user/login";
let authtoken = '';
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        //console.log(json.token);
        authtoken = '' + json.token;
    }
};
var data = JSON.stringify(user);
xhr.send(data);
*/

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append('Accept', 'application/json');

//
//myHeaders.append('Access-Control-Allow-Origin', '*');

(async () => {
    const rawResponse = await fetch('http://127.0.0.1:3000/user/login', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(user)
    });
    const content = await rawResponse.json();
    myHeaders.append('auth-token', content.token);
    const myRequest = new Request('http://127.0.0.1:3000/todo', {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
    });
    const todosResponse = await fetch(myRequest);
    const todos = await todosResponse.json();
    return todos;
})()
    .then(
        addTodosObjectstore
    );
function addTodosObjectstore(todos) {
    var db = window.indexedDB.open("zettels-testdb", 2);

    // Erstelle ein ObjectStore für diese Datenbank
    var objectStore = db.createObjectStore("Todo", { keyPath: "_id" });
    for (i in todos) {
        objectStore.add(todos[i]);
    }
}
/*
fetch('http://127.0.0.1:3000/user/login', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: myHeaders
})
    .then((response) => {
        console.log(response.body.getReader().read);
        response.json()

    })
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
*/

