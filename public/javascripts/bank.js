// Initialize Firebase
var config = {
    apiKey: "AIzaSyBcI54P-yTiaNAXEDASZGH3eJNkcbXY7wE",
    authDomain: "ooadp-2018-sem1-e409b.firebaseapp.com",
    databaseURL: "https://ooadp-2018-sem1-e409b.firebaseio.com",
    projectId: "ooadp-2018-sem1-e409b",
    storageBucket: "ooadp-2018-sem1-e409b.appspot.com",
    messagingSenderId: "1025088843498"
};
firebase.initializeApp(config);

// ==================================================================
// ============================== PUSH ==============================
// ==================================================================

var database = firebase.database();

var firstname = document.getElementById("InputFirstName").value;
var fname = $('#InputFirstName').val();
var lastname = document.getElementById("InputLastName").value;
var accountnumber = document.getElementById("AccountNumber").value;
var availablebalance = document.getElementById("AvailableBalance").value;
var creditbardnumber = document.getElementById("CreditcardNumber").value;
var creditcardsc = document.getElementById("CreditCardSC").value;
var expireday = document.getElementById("ExpireDay").value;
var expiremonth = document.getElementById("ExpireMonth").value;

function push_users(firstname,lastname,accountnumber,availablebalance,creditbardnumber,creditcardsc,expireday,expiremonth){
    var newPostKey = firebase.database().ref().child('users').push().key;  
    var firebaseRef = firebase.database().ref();
    firebaseRef.child("users/" + newPostKey).set({
        firstname: firstname,
        lastname: lastname,
        accountnumber: accountnumber,
        availablebalance: availablebalance,
        creditbardnumber: creditbardnumber,
        creditcardsc: creditcardsc,
        expireday: expireday,
        expiremonth: expiremonth
    });
    return false;
};

function su_user(){
    push_users(firstname,lastname,accountnumber,availablebalance,creditbardnumber,creditcardsc,expireday,expiremonth);
    
};
function su_changes(){
    console.log("=== START ===");
    console.log("firstname:",firstname);
    console.log(typeof firstname);
    console.log("fname",fname);
    console.log(typeof fname);
    console.log(lastname);
    console.log(accountnumber);
    console.log(availablebalance);
    console.log(creditbardnumber);
    console.log(creditcardsc);
    console.log(creditcardtype);
    console.log(expireday);
    console.log(expiremonth);
    console.log("=== END ===");
}
// ==================================================================
// ============================== PULL ==============================
// ==================================================================
var all_users = [];
var users =  firebase.database().ref().child("users");
    users.on("child_added", snap => {
        var bp_accountnumber = (snap.child("accountnumber").val());
        var bp_availablebalance = (snap.child("availablebalance").val());
        var bp_creditbardnumber = (snap.child("creditbardnumber").val());
        var bp_creditcardsc = (snap.child("creditcardsc").val());
        var bp_expireday = (snap.child("expireday").val());
        var bp_expiremonth = (snap.child("expiremonth").val());
        var bp_firstname = (snap.child("firstname").val());
        var bp_lastname = (snap.child("lastname").val());
        // array
        var list_bp_accountnumber = [];
        list_bp_accountnumber.push(bp_accountnumber);
        var list_bp_availablebalance = [];
        list_bp_availablebalance.push(bp_availablebalance);
        var list_bp_creditbardnumber = [];
        list_bp_creditbardnumber.push(bp_creditbardnumber);
        var list_bp_creditcardsc = [];
        list_bp_creditcardsc.push(bp_creditcardsc);
        var list_bp_expireday = [];
        list_bp_expireday.push(bp_expireday);
        var list_bp_expiremonth = [];
        list_bp_expiremonth.push(bp_expiremonth);
        var list_bp_firstname = [];
        list_bp_firstname.push(bp_firstname);
        var list_bp_lastname = [];
        list_bp_lastname.push(bp_lastname);

        
        for (var i=0 ; i<list_bp_lastname.length ; i++ ){
            var user_info = document.getElementsByClassName("user_info")[0];
            var clone = user_info.cloneNode(true);
            document.body.appendChild(clone);
            var fname = document.getElementsByClassName("fname");
            var lname = document.getElementsByClassName("lname");
            var accnum = document.getElementsByClassName("accnum");
            var avabal = document.getElementsByClassName("avabal");
            var ccnum = document.getElementsByClassName("ccnum");
            var ccsc = document.getElementsByClassName("ccsc");
            var ed = document.getElementsByClassName("ed");
            var em = document.getElementsByClassName("em");
            fname[i].innerHTML = list_bp_firstname[i];
            lname[i].innerHTML = list_bp_lastname[i];
            accnum[i].innerHTML = list_bp_accountnumber[i];
            avabal[i].innerHTML = list_bp_availablebalance[i];
            ccnum[i].innerHTML = list_bp_creditbardnumber[i];
            ccsc[i].innerHTML = list_bp_creditcardsc[i];
            ed[i].innerHTML = list_bp_expireday[i];
            em[i].innerHTML = list_bp_expiremonth[i];
        };

            // user_info.style.display = "none";

    });