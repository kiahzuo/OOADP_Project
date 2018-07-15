var config = {
    apiKey: "AIzaSyBcI54P-yTiaNAXEDASZGH3eJNkcbXY7wE",
    authDomain: "ooadp-2018-sem1-e409b.firebaseapp.com",
    databaseURL: "https://ooadp-2018-sem1-e409b.firebaseio.com",
    projectId: "ooadp-2018-sem1-e409b",
    storageBucket: "ooadp-2018-sem1-e409b.appspot.com",
    messagingSenderId: "1025088843498"
  };
  firebase.initializeApp(config);

function reply_click(button_id){
    var id = button_id.slice(6);
    var date = document.getElementById("date"+id).innerHTML.slice(11);
    var time = document.getElementById("time"+id).innerHTML.slice(11);
    var from = document.getElementById("from"+id).innerHTML.slice(11);
    var to = document.getElementById("to"+id).innerHTML.slice(9);
    var amount = document.getElementById("amount"+id).innerHTML.slice(14);
    // alert(date +"\n"+ time +"\n"+ from +"\n"+ to +"\n"+ amount);

}