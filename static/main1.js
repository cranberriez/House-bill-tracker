var userData = {};
var houseData = {};
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
    $.ajax({
        url: "/register",
        data: user,
        dataType: "json",
        type: "POST"
    }).done(function() {
        alert("user added")
    });
    
    loggedinuser = user.uuid;
    userData[user.uuid] = user;
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
}

function add_bill(uuid, billData) {
    houseData[uuid].bills.push(billData);
}

function display_houseData() {
    $('#house_data div').remove();

    Object.keys(houseData).forEach((key) => {
        let house = houseData[key];
        $('#house_data').append(`
        <div id="${house.uuid}"><p>Owner UUID: ${house.uuid}</p>
        <p>Name: ${house.name}</p>
        <p> - ${house.roommates.length} roommates - </p>
        <ul></ul>
        </div>`);

        for ( var i = 0; i < house.roommates.length; i++) {
            $(`#${house.uuid} ul`).append(`<li>${house.roommates[i]}</li>`)
        }

        if (house.bills.length) {
            $(`#${house.uuid}`).append(`<p> - Bills - </p>`)
        }

        for ( var i = 0; i < house.bills.length; i++) {
            let bill = house.bills[i]
            $(`#${house.uuid}`).append(`
            <div>
                <p>${bill.name}</p>
                <ul class="bill_roommates"></ul>
            </div>`);
        }

        for ( var i = 0; i < house.bills.length; i++) {
            let bill = house.bills[i]
            $(`#${house.uuid} .bill_roommates`).append(`<li>${bill.roommates[i]}</li>`)
        }
    });
}
//

// Roommate List Functions
function add_roommate() {
    var num_roommates = $("#house_create_form #roommates_container").data("roommates") + 1;
    $("#house_create_form #roommates_container").data("roommates", num_roommates);
    $("#house_create_form #roommates_container").append(`<div id="roomm${num_roommates}_cont"><input type="text" id="roommate${num_roommates}" placeholder="Roommate ${num_roommates}"></div>`);
}

function remove_roommate() {
    var num_roommates = $("#house_create_form #roommates_container").data("roommates");
    if (num_roommates <= 0) return;
    $(`#roomm${num_roommates}_cont`).remove();
    $("#house_create_form #roommates_container").data("roommates", num_roommates - 1);
}
//


// Jquery form functions
$(function(){
    console.log("Javascript & JQuery Loaded...")

    $("#signup_form").submit(function(e) {
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


    $("#add_roommate_button").click(function(){
        add_roommate();
    })
    $("#remove_roommate_button").click(function(){
        remove_roommate();
    })

    $("#house_create_form").submit(function(e) {
        e.preventDefault();
        var houseData = new Object();

        houseData["uuid"] = loggedinuser;

        var name = $("#house_create_form #hname").val();
        houseData["name"] = name;

        houseData["roommates"] = [];
        var num_roommates = $("#roommates_container").data("roommates");
        for (var i = 1; i <= num_roommates; i++) {
            houseData["roommates"][i-1] = $(`input#roommate${i}`).val();
        }

        houseData["bills"] = [];

        if (loggedinuser) {
            userData[loggedinuser]['houseName'] = name;
            add_house(houseData);
        }
        else {
            alert("Creation Failed: No logged in User");
            return;
        }

        display_userData();
        display_houseData();
        $("#house_create_form input").val("");
    })

    $("#bill_create_form #h_uuid").change(function() {
        var uuid = $("#bill_create_form #h_uuid").val();
        if (houseData[uuid]) {
            for (let i = 0; i < houseData[uuid].roommates.length; i++) {
                var roommate_name = houseData[uuid].roommates[i];
                $("#bill_create_form #roommates_container fieldset").append(`<input type="checkbox" name="roommate_select" value="${roommate_name}">${roommate_name}<br>`);
            }
        }
    })

    $("#bill_create_form").submit(function(e) {
        e.preventDefault();
        var billData = new Object();
        var uuid = $("#bill_create_form #h_uuid").val();

        billData["name"] = $("#bill_create_form #bname").val();
        billData["roommates"] = [];
        $.each($("input[name='roommate_select']:checked"), function(){
            billData["roommates"].push($(this).val());
        });

        billData["cost"] = $("#bill_create_form #cost").val();
        billData["date"] = $("#bill_create_form #date").val();

        $("#bill_create_form input").val("");
        $("#bill_create_form input[type='checkbox']").remove();
        
        add_bill(uuid, billData);
        display_houseData();
    })
})
//