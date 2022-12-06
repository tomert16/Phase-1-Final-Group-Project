
//////////////////////////////////
///Global Variables
/////////////////////////////////
//these get used between functions and help to keep track of the selected objects
let firstMainPlanet = null;
let secondMainPlanet = null;
let mainVehicle = null;
let lastVehicleIDOnServer = 0





///////////////////////////////
///Start Up Data Fetch
//////////////////////////////


///fetch all the planet data then calls the fucntion to add the planets to the top list
fetch("http://localhost:3000/planets")
.then (resp => resp.json())
.then(planetArray => {    
     planetArray.forEach((planet) => { 
       addPlanetToPlanetList(planet);
    });    
});

//fetch all the vehicle data and then call the function to add it to the vehicle dropdown   
fetch("http://localhost:3000/vehicles")
.then (resp => resp.json())
.then(vehicleArray => {
    vehicleArray.forEach((vehicle) => {
        addVehiclesToDropdown(vehicle)
    })
    //figues out the id of the last vehicle on the API. Used when making a new vehicle 
    lastVehicleIDOnServer = (vehicleArray[vehicleArray.length - 1].id)
})




///////////////////////////////////////
///Add listerners to interactables
//////////////////////////////////////

//we need to add a catch for if there is no planet selected for either side 

//will updated the main area with the distance between the planets and then the time for
//the trip based on the vehicle selected
const tripButton = document.getElementById('trip-btn')
tripButton.addEventListener('click', () => {
    calculateDistanceBetweenTwoPlanets (firstMainPlanet, secondMainPlanet)
})

//adds a new veheicle to the API 
const newVehicleForm = document.getElementById('new-vehicle')
newVehicleForm.addEventListener('submit', (e) => {
    //prevent the page from reloading
    e.preventDefault()
    //get the next ID in the veheicle list so we can keep the ID's in the correct order 
    lastVehicleIDOnServer ++
    //build the new veheicle object
    const newVehicle = {
        id: lastVehicleIDOnServer,
        name: document.getElementById('new-name').value,
        speed: document.getElementById('new-speed').value,
        image: document.getElementById('new-image').value 
    }
    //add the new vehecial object to the dropdown
    addVehiclesToDropdown(newVehicle)
    //adds the new vehecial to the API
    fetch("http://localhost:3000/vehicles", {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(newVehicle)        
    })
    //resets the form
    e.target.reset() 
})




//////////////////////////////////
///Functions
/////////////////////////////////

//Adds a planet to the planet bar at the top of the screen
const planetDOMList = document.getElementById('planet-list');
function addPlanetToPlanetList(planet){    
    const planetImageDomElement = document.createElement("img");
    //give each planet image object and ID incase we want to refrence it    
    planetImageDomElement.setAttribute('id', `planet-id-${planet.id}`);   
    planetImageDomElement.src = planet.image;        
    planetImageDomElement.addEventListener("click", () =>{
        updateDisplay(planet)
    })      
    planetDOMList.append(planetImageDomElement);
};



//Getting all the elements that we will be updating with the infomation when we click a planet
const startEndPlanetSelector = document.getElementById("start-end-planet-selector")

const firstMainDisplay = document.getElementById("first-main-planet")
const firstMainDisplayImage = document.querySelector("#first-main-planet .main-planet-detail-image")
const firstMainDisplayText = document.querySelector("#first-main-planet .main-planet-name")
const firstPlanetSunDistance = document.querySelector("#first-main-planet-info .distance-from-sun")
const firstPlanetYearLength = document.querySelector("#first-main-planet-info .year-length")
const firstPlanetDayLength = document.querySelector("#first-main-planet-info .day-length")


const secondMainDisplay = document.getElementById("second-main-planet")
const secondMainDisplayImage = document.querySelector("#second-main-planet .main-planet-detail-image")
const secondMainDisplayText = document.querySelector("#second-main-planet .main-planet-name")
const secondPlanetSunDistance = document.querySelector("#second-main-planet-info .distance-from-sun")
const secondPlanetYearLength = document.querySelector("#second-main-planet-info .year-length")
const secondPlanetDayLength = document.querySelector("#second-main-planet-info .day-length")

//updates either the left or right planet divs with the selected planet depending on the 
// start or end planet drop down selector
function updateDisplay (planet){  
    if(startEndPlanetSelector.value === "start"){
        //updates the frist main planet global variable so other functions know which one is in the first area 
        firstMainPlanet = planet
        firstMainDisplayImage.src = planet.image
        firstMainDisplayText.innerText = planet.name
        firstPlanetSunDistance.innerText = planet.distanceFromSun + " km from the Sun"
        firstPlanetYearLength.innerText = planet.lengthOfYear + " to go around the Sun"
        firstPlanetDayLength.innerText = "A day is " + planet.lengthOfDay
    }
    else if(startEndPlanetSelector.value === "end"){
        //updates the second main planet global variable so other functions know which one is in the second area 
        secondMainPlanet = planet
        secondMainDisplayImage.src = planet.image
        secondMainDisplayText.innerText = planet.name
        secondPlanetSunDistance.innerText = planet.distanceFromSun + " km from the Sun"
        secondPlanetYearLength.innerText = planet.lengthOfYear + " to go around the Sun"
        secondPlanetDayLength.innerText = "A day is " + planet.lengthOfDay
    }
    else{alert("please pick a star or end location")}
}


//calculates the distance between the two planets that are selcted
const tripInfoDistance = document.getElementById("trip-distance")
function calculateDistanceBetweenTwoPlanets (planetOne, planetTwo){
    const distanceBetweenPlanets = Math.abs(planetOne.distanceFromSun - planetTwo.distanceFromSun)
    tripInfoDistance.innerText = `Your trip is ${distanceBetweenPlanets} kms long`
    calculateTimeForTrip(distanceBetweenPlanets)
}

//calcualtes the time it will take given the vehicle selected and the distace between the planets
const tripInfoTime = document.getElementById("trip-time")
function calculateTimeForTrip (distance){
    const tripInHours = (distance / mainVehicle.speed)
    tripInfoTime.innerText = `Your trip will take ${tripInHours} hours`
}

//adds a veheicle to the vehecial drop down menu
const vehicleTypeDropDown = document.getElementById('dropdown-vehicle-picker')
function addVehiclesToDropdown(vehicle){
    const vehicleToAdd = document.createElement('option')
    vehicleToAdd.setAttribute("value", vehicle.id)
    vehicleToAdd.innerText = vehicle.name
    vehicleTypeDropDown.append(vehicleToAdd)
}

//when you change veheicals on the dropdown it gets all the info of that veheical from the server 
//then updates the main area with all of that veheicals info
const tripVehicleName = document.getElementById("trip-vehicle-name")
const tripVehicleImg = document.getElementById('trip-vehicle-img')
function transporationModeChange() {    
    fetch(`http://localhost:3000/vehicles/${vehicleTypeDropDown.value}`)
    .then (resp => resp.json())
    .then(vehicle => {
        tripVehicleName.innerText = vehicle.name
        tripVehicleImg.src = vehicle.image
        mainVehicle = vehicle
        console.log(vehicle)
    })
}



