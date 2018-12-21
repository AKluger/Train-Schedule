
var update;
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAGubFMxHrOGpJVfIoWVMVf6ERDKx5zg8Y",
    authDomain: "train-scheduler-91ad1.firebaseapp.com",
    databaseURL: "https://train-scheduler-91ad1.firebaseio.com",
    projectId: "train-scheduler-91ad1",
    storageBucket: "train-scheduler-91ad1.appspot.com",
    messagingSenderId: "163791885723"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Capture Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#name-input").val().trim()
    var frequency = $("#frequency-input").val().trim()
    var firstTime = $("#time-input").val().trim()
    var destination = $("#destination-input").val().trim()

    // Code for handling the push
    database.ref().push({
        name: trainName,
        frequency: frequency,
        firstTime: firstTime,
        destination: destination,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    //clear form
    $("input").val("")

    //prevent duplicate row 
    updater()
});

var updater = function () {

    //empty table so only updated times display
    $("tbody").empty()

    database.ref().on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        // Console.logging the last user's data
        console.log(sv.name);
        console.log(sv.frequency);
        console.log(sv.firstTime);
        console.log(sv.destination);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(sv.firstTime, "HH:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % sv.frequency;

        // Minutes Until Train
        var minutesAway = sv.frequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(minutesAway, "minutes");
        nextTrain = moment(nextTrain).format("HH:mm")

        var subtracted = moment().diff(sv.firstTime, 'minutes');

        // Change the HTML to reflect
        $("tbody").append("<tr>  <td > " + sv.name + " </td>" +
            "<td> " + sv.destination + " </td>" +
            "<td> " + sv.frequency + " </td>" +
            "<td> " + nextTrain + " </td>" +
            "<td> " + minutesAway + " </td>"
        )

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    //keeping site up to date to the second
    currentTime = moment().format("HH:mm");
    var checkTime = function () {
        update = setTimeout(checkTime, 1000)
        if (currentTime !== moment().format("HH:mm")) {
            updater()
        }
    }

    //countdown function to refresh page when time changes
    checkTime()
}

updater()