
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
    // Don't refresh the page!
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

});

database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();


    //.text replaces the text on a  page
    // Console.logging the last user's data
    console.log(sv.name);
    console.log(sv.frequency);
    console.log(sv.firstTime);
    console.log(sv.destination);
    // console.log(sv.dateAdded);



// somehow think I want diff in firstTime and currentTime, then I could decide if one is greater than the other use this value 
// Using remainder seems like the way to go, 

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(sv.firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "days");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % sv.frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = sv.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("HH:mm")
    console.log("ARRIVAL TIME: " + nextTrain);

    var subtracted = moment().diff(sv.firstTime, 'minutes');

    // Change the HTML to reflect
    $("tbody").append("<tr>  <td > " + sv.name + " </td>" +
        "<td> " + sv.destination + " </td>" +
        "<td> " + sv.frequency + " </td>" +
        "<td> " + nextTrain + " </td>" +
        "<td> " + tMinutesTillTrain + " </td>"
    )



    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});