// Initialize Firebase
const config = {
    apiKey: "AIzaSyAGubFMxHrOGpJVfIoWVMVf6ERDKx5zg8Y",
    authDomain: "train-scheduler-91ad1.firebaseapp.com",
    databaseURL: "https://train-scheduler-91ad1.firebaseio.com",
    projectId: "train-scheduler-91ad1",
    storageBucket: "train-scheduler-91ad1.appspot.com",
    messagingSenderId: "163791885723"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
const database = firebase.database();

// Capture Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    const trainName = $("#name-input").val().trim()
    const frequency = $("#frequency-input").val().trim()
    const firstTime = $("#time-input").val().trim()
    const destination = $("#destination-input").val().trim()

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

const updater = function () {

    //empty table so only updated times display
    $("tbody").empty()

    database.ref().on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable for convenience
        const sv = snapshot.val();

        // First Time (pushed back 1 year to make sure it comes before current time)
        const firstTimeConverted = moment(sv.firstTime, "HH:mm").subtract(1, "years");

        // Difference between the times
        const diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        const tRemainder = diffTime % sv.frequency;

        // Minutes Until Train
        const minutesAway = sv.frequency - tRemainder;

        // Next Train
        let nextTrain = moment().add(minutesAway, "minutes");
        nextTrain = moment(nextTrain).format("HH:mm")

        const subtracted = moment().diff(sv.firstTime, 'minutes');

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
   const currentTime = moment().format("HH:mm");
    const checkTime = function () {
        update = setTimeout(checkTime, 1000)
        if (currentTime !== moment().format("HH:mm")) {
            updater()
        }
    }
    //countdown function to refresh page when time changes
    checkTime()
}

updater()