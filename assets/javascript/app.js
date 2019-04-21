// Initial value

var playerConnection = "";
var myRPSGame;
var gameConnections;
var playerOneSelection;
var playerTwoSelection;
var winner;
var playerOneWinningCount = 0;
var playerTwoWinningCount = 0;
var imagesShowing =false;


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
        // console.log(playerConnection);

        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();

    }

});

// see if players information exists in the database
database.ref("/playerData").on("value", function (snapshot) {
    myRPSGame = snapshot.val();


// only need to show this once
    if ((myRPSGame.playerOne != "") && (myRPSGame.playerTwo != "")
        && (!imagesShowing)) {
        console.log("show images");
        $("#messages").empty();
        showImages();
        $("#player").addClass("toHide");
        imagesShowing = true;
    }

    $("#wins-one-count").replaceWith(myRPSGame.playerOneWins);
    $("#losses-two-count").replaceWith(myRPSGame.playerOneWins);
    $("#wins-two-count").replaceWith(myRPSGame.playerTwoWins);
    $("#losses-one-count").replaceWith(myRPSGame.playerTwoWins);

})



// see if players information exists in the database
connectionsRef.on("value", function (snap) {

    gameConnections = snap.val();
    // console.log(gameConnections);

    // console.log("there " + myRPSGame.playerOneKey);


    numberOfConnections = snap.numChildren();
    console.log("number of Connections: " + numberOfConnections);


    if (gameConnections[myRPSGame.playerOneKey] == null) {
        database.ref("/playerData").update({
            playerOneKey: "",
            playerOne: "",
            playerOneWins: 0,
            playerOneLosses: 0,
            playerOneSelection: ""
        });


    }

    if (gameConnections[myRPSGame.playerTwoKey] == null) {
        database.ref("/playerData").update({
            playerTwoKey: "",
            playerTwo: "",
            playerTwoWins: 0,
            playerTwoLosses: 0,
            playerTwoSelection: ""
        });

    }
})


// Initial value
var playerName;


// whenever a user clicks the submit button
$("#set-player-button").on("click", function (event) {
    event.preventDefault();
    console.log("clicked the button");


// get the name that was entered
    playerName = $("#player-name-input").val().trim();


// check if the first player information has been captured
    if (myRPSGame.playerOne === "") {

        console.log("value does not exists in playerOne")

        database.ref("/playerData").update({
            playerOne: playerName,
            playerOneKey: playerConnection,
            playerOneWins: 0,
            playerOneLosses: 0,
            playerOneSelection: ""
        });

        // myRPSGame.playerOne = playerName;
        playerName = "";

    } else if ((myRPSGame.playerTwo === "") && (myRPSGame.playerOne != "")) { // check if the second player's information has been captured
        console.log("again value does not exists in playerTwo")

        database.ref("/playerData").update({
            playerTwoKey: playerConnection,
            playerTwo: playerName,
            playerTwoWins: 0,
            playerTwoLosses: 0,
            playerTwoSelection: ""
        });

        myRPSGame.playerTwo = playerName;
        playerName = "";

    }

    console.log(myRPSGame.playerOne);
    console.log(myRPSGame.playerTwo);


    if (numberOfConnections > 2) {
        var message;
        message = $("#messages").text("Sorry, only two players can play at one time.")
        message.addClass("messages");
        $("#messages").append(message);
    } else if ((myRPSGame.playerOne != "") && (myRPSGame.playerTwo == "")) {
        var message;
        message = $("#messages").text("Please wait for your opponent!")
        message.addClass("messages");
        $("#messages").append(message);
    } else if ((myRPSGame.playerTwo != "") && (myRPSGame.playerOne == "")) {
        var message;
        message = $("#messages").text("Please wait for your opponent!")
        message.addClass("messages");
        $("#messages").append(message);
    } else if ((myRPSGame.playerTwo != "") && (myRPSGame.playerOne != "")) {
        console.log("two players");
    }
})


$("#player-images").addClass("toHide");
$("#score-one").addClass("toHide");
$("#score-two").addClass("toHide");


function showImages() {

    console.log("show images function");

    $("#player-images").addClass("toShow");
    $("#player-images").removeClass("toHide");

    $("#score-one").addClass("toShow");
    $("#score-one").removeClass("toHide");

    $("#score-two").addClass("toShow");
    $("#score-two").removeClass("toHide");


    $("#rock").on("click", function (event) {

        console.log("playerConnection = " + playerConnection);

        if (playerConnection === myRPSGame.playerOneKey) {
            playerOneSelection = "rock";
            console.log("Player One Rock");

            database.ref("/playerData").update({
                playerOneSelection: playerOneSelection
            });

            seeWhoWon();



        } else if (playerConnection = myRPSGame.playerTwoKey) {
            playerTwoSelection = "rock";
            console.log("Player Two Rock");

            database.ref("/playerData").update({
                playerTwoSelection: playerTwoSelection
            });

            seeWhoWon();

        }

    })

    $("#paper").on("click", function (event) {

        if (playerConnection === myRPSGame.playerOneKey) {
            playerOneSelection = "paper";
            console.log("Player One Paper");

            database.ref("/playerData").update({
                playerOneSelection: playerOneSelection
            });

            seeWhoWon();


        } else if (playerConnection = myRPSGame.playerTwoKey) {
            playerTwoSelection = "paper";
            console.log("Player Two Paper");

            database.ref("/playerData").update({
                playerTwoSelection: playerTwoSelection
            });

            seeWhoWon();


        }


    })

    $("#scissors").on("click", function (event) {

        if (playerConnection === myRPSGame.playerOneKey) {
            playerOneSelection = "scissors";
            console.log("Player One Scissors");

            database.ref("/playerData").update({
                playerOneSelection: playerOneSelection
            });

            seeWhoWon();


        } else if (playerConnection === myRPSGame.playerTwoKey) {
            playerTwoSelection = "scissors";
            console.log("Player Two Scissors");

            database.ref("/playerData").update({
                playerTwoSelection: playerTwoSelection
            });

            seeWhoWon();

        }


    })
}

function seeWhoWon()
{

    console.log("Game Begins - check if both have made a selection");
    if ((myRPSGame.playerOneSelection != "") && (myRPSGame.playerTwoSelection != "")) {
        winner = whoWon();
        calculateWinsAndLosses(winner);

    }
}

function whoWon() {
    console.log("let see who won")

    var result = "nobody";

    console.log("get the results");
    console.log("playerOne = " + myRPSGame.playerOneSelection);
    console.log("playerTwo = " + myRPSGame.playerTwoSelection);


    if (((myRPSGame.playerOneSelection == "scissors") && (myRPSGame.playerTwoSelection == "scissors")) ||
        ((myRPSGame.playerOneSelection == "rock") && (myRPSGame.playerTwoSelection == "rock")) ||
        ((myRPSGame.playerOneSelection == "paper") && (myRPSGame.playerTwoSelection == "paper"))) {
        console.log("It was a tie");
        result = "tie"
    } else if (((myRPSGame.playerOneSelection == "rock") && (myRPSGame.playerTwoSelection == "scissors")) ||
        ((myRPSGame.playerOneSelection == "scissors") && (myRPSGame.playerTwoSelection == "paper")) ||
        ((myRPSGame.playerOneSelection == "paper") && (myRPSGame.playerTwoSelection == "rock"))) {
        console.log("Player One Won");
        result = "One"
    } else if (((myRPSGame.playerTwoSelection == "rock") && (myRPSGame.playerOneSelection == "scissors")) ||
        ((myRPSGame.playerTwoSelection == "scissors") && (myRPSGame.playerOneSelection == "paper")) ||
        ((myRPSGame.playerTwoSelection == "paper") && (myRPSGame.playerOneSelection == "rock"))) {
        console.log("Player Two Won");
        result = "Two";
    }

    return result;

}


function calculateWinsAndLosses(winner) {

    console.log("calculateWinsAndLosses = " + winner);

    if (winner === "One") {
        console.log("PLAYER ONE WON");
        playerOneWinningCount = playerOneWinningCount + 1;
        database.ref("/playerData").update({
            playerOneWins: playerOneWinningCount,
            playerTwoLosses: playerOneWinningCount
        });

    }

    if (winner === "Two") {
        console.log("PLAYER TWO WON");
        playerTwoWinningCount = playerTwoWinningCount + 1;
        database.ref("/playerData").update({
            playerTwoWins: playerTwoWinningCount,
            playerOneLosses: playerTwoWinningCount
        });
    }
    

}







