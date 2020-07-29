var userData = {};
var houseData = {};
var uuid = {};
var loggedinuser = "";

// UUID Generation
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-xxxx-8329'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    if (userData[uuid]) {
        return create_UUID()
    }
    else {
        return uuid;
    }
}
//


// Userdata functions
function add_user(user) {
    loggedinuser = user.uuid;

    userData[user.uuid] = user;
    console.log(userData)
}

function display_userData() {
    $('#user_data div').remove();

    Object.keys(userData).forEach((key) => {
        let user = userData[key];
        let houseName = userData[key].houseName || 0;
        $('#user_data').append(`
        <div><p>UUID: ${user.uuid}</p>
        <p>Uname: ${user.username}</p>
        <p>Pword: ${user.password}</p>
        <p>House: ${houseName || "No House Added Yet"}
        </br></div>`);
    });
}
//


// House Data Functions
function add_house(house) {
    houseData[house.uuid] = house;
    console.log(houseData);
}

function display_houseData() {
    $('#house_data div').remove();

    Object.keys(houseData).forEach((key) => {
        let house = houseData[key];
        $('#house_data').append(`
        <div id="${house.uuid}"><p>Owner UUID: ${house.uuid}</p>
        <p>Name: ${house.name}</p>
        <p> - ${house.roomates.length} Roomates - </p>
        <ul></ul>
        </br></div>`);

        for ( var i = 0; i < house.roomates.length; i++) {
            $(`#${house.uuid} ul`).append(`<li>${house.roomates[i]}</li>`)
        }
    });
}
//

// Roomate List Functions
function add_roomate() {
    var num_roomates = $("#roomates_container").data("roomates") + 1;
    $("#roomates_container").data("roomates", num_roomates)
    $("#roomates_container").append(`<div id="room${num_roomates}_cont"><input type="text" id="roomate${num_roomates}" placeholder="Roomate ${num_roomates}"></div>`)
}

function remove_roomate() {
    var num_roomates = $("#roomates_container").data("roomates");
    if (num_roomates <= 0) return
    $(`#room${num_roomates}_cont`).remove();
    $("#roomates_container").data("roomates", num_roomates - 1)
}
//


// Jquery form functions
$(function(){
    $("#signup_form").submit(function(e){
        e.preventDefault();
        var userData = new Object();
        var uuid = create_UUID();
        userData["uuid"] = uuid;

        var username = $("#signup_form #username").val();
        userData["username"] = username;

        var password = $("#signup_form #password").val();
        userData["password"] = password;
        $("#signup_form input").val("");

        add_user(userData);
        display_userData();
    })

    $("#house_create_form").submit(function(e){
        e.preventDefault();
        var houseData = new Object();

        houseData["uuid"] = loggedinuser;

        var name = $("#house_create_form #name").val();
        houseData["name"] = name;

        houseData["roomates"] = [];
        var num_roomates = $("#roomates_container").data("roomates");
        for (var i = 1; i <= num_roomates; i++) {
            houseData["roomates"][i-1] = $(`input#roomate${i}`).val();
        }

        if (loggedinuser) {
            userData[loggedinuser]['houseName'] = name;
            add_house(houseData);
        }
        else {
            alert("Creation Failed: No logged in User")
            return;
        }

        display_userData();
        display_houseData();
        $("#house_create_form input").val("");
    })
})
//