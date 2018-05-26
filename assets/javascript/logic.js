$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCL5IqzO6uykMhmbMM8_z-keV3gPimfMho",
        authDomain: "rps-game-5204f.firebaseapp.com",
        databaseURL: "https://rps-game-5204f.firebaseio.com",
        projectId: "rps-game-5204f",
        storageBucket: "rps-game-5204f.appspot.com",
        messagingSenderId: "1049592478342"
    };
    firebase.initializeApp(config);

    //Variables

    var p1 = {
        name: "",
        wins: 0,
        losses: 0,
        weapon: "",
    }

    var p2 = {
      name: "",
      wins: 0,
      losses: 0,
      weapon: "",
    }

    var databasep1 = firebase.database().ref().child('p1');
    var databasep2 = firebase.database().ref().child('p2');
    var database = firebase.database();

    var weaponOutput1;
    var weaponOutput2;

    //Functions

    databasep1.on("value", function(snapshot){
        var nameOutput1 = snapshot.val().name;
        var winsOutput1 = snapshot.val().wins;
        var lossesOutput1 = snapshot.val().losses;
        var weaponOutput1 = snapshot.val().weapon;

        $(".p1-name").text(nameOutput1);
        $(".p1-weapon").text(weaponOutput1);
        $(".p1-wins").text(winsOutput1);
        $(".p1-losses").text(lossesOutput1); 
    })
    
    databasep2.on("value", function(snapshot){
        var nameOutput2 = snapshot.val().name;
        var winsOutput2 = snapshot.val().wins;
        var lossesOutput2 = snapshot.val().losses;
        var weaponOutput2 = snapshot.val().weapon;

        $(".p2-name").text(nameOutput2);
        $(".p2-weapon").text(weaponOutput2);
        $(".p2-wins").text(winsOutput2);
        $(".p2-losses").text(lossesOutput2); 
    })
    
    function clearWeapons() {
        p1.weapon = "";
        p2.weapon = "";
    }
  
    function p1Win() {
        p1.wins++;
        databasep1.update(p1);
        $(".results").text("P1 wins. Play again!")
        clearWeapons();
    }

    function p2Win() {
        p2.wins++;
        databasep2.update(p2);
        $(".results").text("P2 wins. Play again!")
        clearWeapons();
    }

    function resetGame(){
        p1 = {
            name: "",
            wins: 0,
            losses: 0,
            weapon: "",
        }
      
        p2 = {
          name: "",
          wins: 0,
          losses: 0,
          weapon: "",
       }
       databasep1.update(p1);
       databasep2.update(p2);
    }

    $(document).on("click",".reset",function(snapshot) {
        resetGame();
    });

    $(document).on("click","#p1play",function(snapshot) {
        

        event.preventDefault();
        if (weaponOutput2) {
            playGame();
        } else {
            $(".results").text("Please choose a weapon, P2.")
        }
    })

    
    $(document).on("click","#p2play",function() {
        event.preventDefault();
        if (weaponOutput1) {
            playGame();
        } else {
            $(".results").text("Please choose a weapon, P1.")
        }
    })

    $(".p1-weapons").on("click", "button", function(){
        p1.weapon=($(this).attr("data-value"));
        console.log("p1 weapon = " + p1.weapon);
        databasep1.update(p1);
    })

    $(".p2-weapons").on("click", "button", function(){
        p2.weapon=($(this).attr("data-value"));
        console.log("p2 weapon = " + p2.weapon);
        databasep2.update(p2);
    })
    
    $("#p1Submit").on("click", function(){
        var name1 = $("#p1-name-input").val();
        p1.name=(name1);
        databasep1.update(p1);
    })
    
    $("#p2Submit").on("click", function(){
        var name2 = $("#p2-name-input").val();
        p2.name=(name2);
        databasep2.update(p2);
    })

   

    //Game Logic
        function playGame() {
            console.log("play game");

        do {
            if (weaponOutput1=="rock" && p2=="scissors") {
                p1win();
            } else if (weaponOutput1=="rock" && weaponOutput2=="paper") {
                p2win();
            } else if (weaponOutput1=="paper" && weaponOutput2=="rock") {
                p1win();
            } else if (weaponOutput1=="paper" && weaponOutput2=="scissors") {
                p2win();
            } else if (weaponOutput1=="scissors" && weaponOutput2=="paper") {
                p1win();
            } else if (weaponOutput1=="scissors" && weaponOutput2=="rock") {
               p2win();
            } else if (weaponOutput1==weaponOutput2) {
                $(".results").text("It's a draw. Play again!")
                clearWeapons();
            }
        } 
        while (weaponOutput1 == weaponOutput2);
        }

        //Connections part. If p1 connected... display info. If p2 is not connected.. display waiting for P2, then when connected, start game  
        //Revise p1 and p2play click event function
        //,,should be p1 chooses a weapon first,, and then p2 and the start the game right away

        //Connections

        var maxPlayers = 2;
        var playersList= database.ref('/connections');
        var connectedRef = database.ref(".info/connected");
        var playerData = "";

        connectedRef.on("value", function(snapshot) {

            // If they are connected..
            if (snapshot.val()) {
        
            // Add user to the connections list.
            var con = playersList.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
            }
        });
        
        // When first loaded or when the connections list changes...
        playersList.on("value", function(snapshot) {
        
            // Display the viewer count in the html.
            // The number of online users is the number of children in the connections list.
            $(".connected-viewers").text(snapshot.numChildren());
        });
        

})
   