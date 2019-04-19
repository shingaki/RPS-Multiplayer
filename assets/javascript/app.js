// Initial value

var playerConnection = "";
var myRPSGame;
var gameConnections;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAkMx249jAwJgv06NtxWSDFE51AZaqIsyc",
    authDomain: "rockpaperscissorsa.firebaseapp.com",
    databaseURL: "https://rockpaperscissorsa.firebaseio.com",
    projectId: "rockpaperscissorsa",
    storageBucket: "rockpaperscissorsa.appspot.com",
    messagingSenderId: "198773386942"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database(); // pointer to datbase


// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");


// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// global parameters
var numberOfConnections;

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        var con = connectionsRef.push(true);
        playerConnection = con.key;
        console.log(playerConnection);

        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();

    }

});


// Initial value
var playerName;


// whenever a user clicks the submit button
$("#set-player-button").on("click", function (event) {
    event.preventDefault();
    console.log("clicked the button");

    playerName = $("#player-name-input").val().trim();

    if (myRPSGame.playerOne === "") {
        console.log("value does not exists in playerOne")

        database.ref("/playerData").update({
            playerOne: playerName,
            playerOneKey: playerConnection,
            playerOneWins: 0,
            playerOneLosses: 0
        });

        snapshot.val().playerOne = "tbd"
    }

    if (myRPSGame.playerTwo === "") {
        console.log("value does not exists in playerTwo")

        database.ref("/playerData").update({
            playerTwoKey: playerConnection,
            playerTwo: playerName,
            playerTwoWins: 0,
            playerTwoLosses: 0
        });

        snapshot.val().playerTwo = "tbd"
    }


})

// see if players information exists in the database
database.ref("/playerData").on("value", function (snapshot) {
        myRPSGame = snapshot.val();
        console.log("here " + myRPSGame.playerOneKey);
    }
)


// see if players information exists in the database
connectionsRef.on("value", function (snap) {

    gameConnections = snap.val();
    console.log(gameConnections);

    console.log("there " + myRPSGame.playerOneKey);

    if (gameConnections[myRPSGame.playerOneKey] == null) {
        database.ref("/playerData").update({
            playerOneKey: "",
            playerOne: "",
            playerOneWins: 0,
            playerOneLosses: 0
        });
    }

    if (gameConnections[myRPSGame.playerTwoKey] == null) {
        database.ref("/playerData").update({
            playerTwoKey: "",
            playerTwo: "",
            playerTwoWins: 0,
            playerTwoLosses: 0
        });
    }
});


