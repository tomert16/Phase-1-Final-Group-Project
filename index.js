////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Global Variables
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//these get used between functions and help to keep track of the selected objects
let firstMainPlanet = null;
let secondMainPlanet = null;
let mainVehicle = null;
let lastVehicleIDOnServer = 0
let distanceUnit = null
let numberOfMoons


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Start Up Data Fetch and Page Setup
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//fetch all the planet data then calls the fucntion to add the planets to the top list
fetch("http://localhost:3000/planets")
.then (resp => resp.json())
.then(planetArray => {    
     planetArray.forEach((planet) => { 
       addBodyToBodiesList(planet);
    });

    //update the main display at launch with the Sun and Earth
    firstMainPlanet = planetArray[0]
    secondMainPlanet = planetArray[3]
    updateFirstMainDisplay(firstMainPlanet)  
    updateSecondMainDisplay(secondMainPlanet)  
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

//updates the distance unit at the start
distanceUnit = document.getElementsByClassName("switch-input")[0].checked ? 'miles' : 'kilometers'



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Add Listerners to Interactables
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//will updated the main area with the distance between the planets and then the time for
//the trip based on the vehicle selected
const tripButton = document.getElementById('trip-btn')
tripButton.addEventListener('click', () => {
    //makes sure that a vehicle is picked form the drop down
    if (vehicleTypeDropDown.value === "dummy-vehicle"){
        alert("Please pick a vehicle")
    }
    else{
        //calls the function that updates the center display
        calculateDistanceBetweenTwoPlanets (firstMainPlanet, secondMainPlanet)
    }
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
        speed: calculateSpeedOfNewVehicle(),
        image: document.getElementById('new-image').value 
    }
    //checks to see if all boxes on the form are filled
    if (newVehicle.name === "" || newVehicle.image === ""){
        alert("Please fill all form boxes")
    }
    //if they are all filled
    else{
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
    }
})



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////
///Planet Bar 
/////////////////////////////////////

//Adds a planet to the planet bar at the top of the screen
const planetDOMList = document.getElementById('planet-list');
function addBodyToBodiesList(planet){ 
    //creates the div that the image and name will sit in then makes the name and image   
    const planetBarDiv = document.createElement('div')
    const planetImageDomElement = document.createElement("img");
    const planetImageName = document.createElement("div")    
    //give each element a class or ID so we can refence it in the code or CSS 
    planetBarDiv.setAttribute('class', 'planet-card')
    planetImageDomElement.setAttribute('id', `planet-id-${planet.id}`);   
    planetImageName.setAttribute('class', 'planet-name')
    //adds the image and the text to the element
    planetImageDomElement.src = planet.image;
    planetImageName.innerText = planet.name
    //adds the evennt clicker      
    planetImageDomElement.addEventListener("click", () =>{
        updateDisplay(planet)
    })
    //adds a listener that will slightly grey the image and show the name if the mouse goes over it
    planetImageDomElement.addEventListener("mouseover", () =>{
        planetImageDomElement.style.opacity = 0.3;
        planetImageName.style.opacity = 1;        
    })
    planetImageDomElement.addEventListener("mouseout", () =>{
        planetImageDomElement.style.opacity = 1;
        planetImageName.style.opacity = 0; 
    });
    //adds the elements together then adds it to the planet list
    planetBarDiv.append(planetImageName);
    planetBarDiv.append(planetImageDomElement) 
    planetDOMList.append(planetBarDiv);
}


/////////////////////////////////////
///Distance Button 
/////////////////////////////////////

//called by the switch on the html and updates what unit we are using for distance
const switchToggle = document.getElementById("toggle-switch")
function toggleDistanceUnit(){
    //checks what side the slider is on and then updates the global variable with that info
    distanceUnit = document.getElementsByClassName("switch-input")[0].checked ? 'miles' : 'kilometers'
    //refresh the displays when we change the distance unit 
    updateFirstMainDisplay(firstMainPlanet)   
    updateSecondMainDisplay(secondMainPlanet)
    calculateDistanceBetweenTwoPlanets(firstMainPlanet, secondMainPlanet)
}


/////////////////////////////////////
///Start End Dropdown  
/////////////////////////////////////

//Gets the start or end planet selector drop down
const startEndPlanetSelector = document.getElementById("start-end-planet-selector")
//sets the drop down vto "end body" when the page loads
startEndPlanetSelector.value = "end"
//updates either the left or right planet divs with the selected planet depending on the 
// start or end planet drop down selector
function updateDisplay (planet){  
    if(startEndPlanetSelector.value === "start"){
        //calls the function to update the left planet displays
        updateFirstMainDisplay(planet)
    }
    else if(startEndPlanetSelector.value === "end"){
        //calls the funtion to update the right planet displays
        updateSecondMainDisplay(planet)
    }
    else{alert("please pick a star and end location")}
}


/////////////////////////////////////
///Planet Type Dropdown
/////////////////////////////////////

//changes the planets bar between plaents and dwarf planets baes on the drowdown list
const planetTypePicker = document.getElementById("body-type-selector")
//resets the value to planets upon the page first loading
planetTypePicker.value = "planets"
function updatePlanetList(){
    numberOfMoons = 0
    //removes all the children (the images) from the bodies list
    while(planetDOMList.firstChild){
        planetDOMList.removeChild(planetDOMList.firstChild)
    }
    //populates the planet bar with the approiate type of body depending on the drop down bar    
    if(planetTypePicker.value === "planets"){
        fetch("http://localhost:3000/planets")
        .then (resp => resp.json())
        .then(planetArray => {    
            planetArray.forEach((planet) => { 
            addBodyToBodiesList(planet);
            });
        })
    }
    else if(planetTypePicker.value === "dwarfPlanets"){
        fetch("http://localhost:3000/dwarfPlanets")
        .then (resp => resp.json())
        .then(dwarfPlanetsArray => {
            dwarfPlanetsArray.forEach((dwarfPlanet) => {
                addBodyToBodiesList(dwarfPlanet)
            })
        })
    }
    else if(planetTypePicker.value === "moons"){
        fetch("http://localhost:3000/moons")
        .then(resp => resp.json())
        .then(moonArray => {
            moonArray.forEach((moon) => {
                findMoonsToDisplay(moon)                
            })
            //if the planet does not have any moons, we let the user know
            if(numberOfMoons < 1){
                alert(firstMainPlanet.name + " does not have any moons")
            }
        })
    }
}

//will find and then display all the moons of that body
function findMoonsToDisplay (moon){
    if (firstMainPlanet.name === moon.parent){
        addBodyToBodiesList(moon)        
        numberOfMoons++
    }
}


/////////////////////////////////////
///Vehecle Dropdown  
/////////////////////////////////////

//when you change veheicals on the dropdown it gets all the info of that veheical from the server 
//then updates the main area with all of that veheicals info
const tripVehicleName = document.getElementById("trip-vehicle-name")
const tripVehicleImg = document.getElementById('trip-vehicle-img')
function transporationModeChange() {
    //checks to makesure we picked a vehicle from the dropdown and not the dummy value
    if(vehicleTypeDropDown.value !== 'dummy-vehicle'){    
        //gets the info of the chosen vehicle from the server
        fetch(`http://localhost:3000/vehicles/${vehicleTypeDropDown.value}`)
        .then (resp => resp.json())
        .then(vehicle => {
            tripVehicleName.innerText = vehicle.name
            tripVehicleImg.src = vehicle.image
            mainVehicle = vehicle
        })
    }
}

//adds a veheicle to the veheicle drop down menu
const vehicleTypeDropDown = document.getElementById('dropdown-vehicle-picker')
function addVehiclesToDropdown(vehicle){
    const vehicleToAdd = document.createElement('option')
    vehicleToAdd.setAttribute("value", vehicle.id)
    vehicleToAdd.innerText = vehicle.name
    vehicleTypeDropDown.append(vehicleToAdd)
}


/////////////////////////////////////
///Main Planet Display Update   
/////////////////////////////////////

//gets all the elements that we will be updating with the infomation from the start planet
const firstMainDisplay = document.getElementById("first-main-planet")
const firstMainDisplayImage = document.querySelector("#first-main-planet .main-planet-detail-image")
const firstMainDisplayText = document.querySelector("#first-main-planet .main-planet-name")
const firstPlanetSunDistance = document.querySelector("#first-main-planet-info .distance-from-sun")
const firstPlanetYearLength = document.querySelector("#first-main-planet-info .year-length")
const firstPlanetDayLength = document.querySelector("#first-main-planet-info .day-length")
//updates the left main planet display
function updateFirstMainDisplay(planet){
    //stops the user from putting a moon on the left side display   
    if (planet.type === "satellite"){
        alert("You cannot start your trip on a moon")
    }
    else{        
        //stops the user from picking the same planet twice
        if(secondMainPlanet === planet){
            alert('You cannot travel to the same planet')
        }
        else{
            //updates the frist main planet global variable so other functions know which one is in the first area 
            firstMainPlanet = planet
            firstMainDisplayImage.src = planet.image
            firstMainDisplayText.innerText = planet.name       
            //checks to see if we are displaying The Sun and if so we display special text 
            if(planet.name === "Sun"){
                firstPlanetSunDistance.innerText = "You cannot get any closer to the Sun"
                firstPlanetYearLength.innerText = "It is complicated -- Look up Sun barycenter"
            }
            else{
                //checkes what distance unit we should be displaying based on the toggle switch
                if(distanceUnit === "kilometers"){
                    firstPlanetSunDistance.innerText = planet.distanceFromSun.toLocaleString() + " km from the Sun"
                }
                else if(distanceUnit === "miles"){
                    firstPlanetSunDistance.innerText = (planet.distanceFromSun * 0.62137).toLocaleString() + " miles from the Sun"
                }
                firstPlanetYearLength.innerText = planet.lengthOfYear + " to go around the Sun"
            }
            firstPlanetDayLength.innerText = "A day is " + planet.lengthOfDay   
        } 
    }
}

//gets all the elements that we will be updating with the infomation from the end planet
const secondMainDisplay = document.getElementById("second-main-planet")
const secondMainDisplayImage = document.querySelector("#second-main-planet .main-planet-detail-image")
const secondMainDisplayText = document.querySelector("#second-main-planet .main-planet-name")
const secondPlanetSunDistance = document.querySelector("#second-main-planet-info .distance-from-sun")
const secondPlanetYearLength = document.querySelector("#second-main-planet-info .year-length")
const secondPlanetDayLength = document.querySelector("#second-main-planet-info .day-length")
//updates the right main planet display
function updateSecondMainDisplay(planet){   
     //stops teh user from picking the same planet twice
     if(firstMainPlanet === planet){
        alert('You cannot travel to the same planet')
    }
    else{
        //updates the second main planet global variable so other functions know which one is in the second area 
        secondMainPlanet = planet
        secondMainDisplayImage.src = planet.image
        secondMainDisplayText.innerText = planet.name    
        //checks to see if we are displaying The Sun and if so we display special text 
        if(planet.name === "Sun"){
            secondPlanetSunDistance.innerText = "You cannot get any closer to the Sun"
            secondPlanetYearLength.innerText = "It is complicated -- Look up Sun barycenter"
        }
        else{
            //checkes what distance unit we should be displaying based on the toggle switch
            if(distanceUnit === "kilometers"){
                //checks if we are displaying a moon or a planet
                if(planet.type === "satellite"){
                    secondPlanetSunDistance.innerText = planet.distanceFromSun.toLocaleString() + " km from " + firstMainPlanet.name
                }
                else{
                    secondPlanetSunDistance.innerText = planet.distanceFromSun.toLocaleString() + " km from the Sun"
                }
            }
            else if(distanceUnit === "miles"){
                if(planet.type === "satellite"){
                    secondPlanetSunDistance.innerText = (planet.distanceFromSun * 0.62137).toLocaleString() + " miles from " + firstMainPlanet.name
                }
                else{
                    secondPlanetSunDistance.innerText = (planet.distanceFromSun * 0.62137).toLocaleString() + " miles from the Sun"
                }
            }
            if(planet.type === "satellite"){
                secondPlanetYearLength.innerText = planet.lengthOfYear + " to go around " + firstMainPlanet.name
            }
            else{
                secondPlanetYearLength.innerText = planet.lengthOfYear + " to go around the Sun"
            }
        }   
        if(planet.type === "satellite"){
            secondPlanetDayLength.innerText = ""
        }
        else{
            secondPlanetDayLength.innerText = "A day is " + planet.lengthOfDay    
        }
    }
}


/////////////////////////////////////
///Middle Info Display Update   
/////////////////////////////////////

//calculates the distance between the two planets that are selcted
const tripInfoDistance = document.getElementById("trip-distance")
function calculateDistanceBetweenTwoPlanets (planetOne, planetTwo){
    const distanceBetweenPlanets = Math.abs(planetOne.distanceFromSun - planetTwo.distanceFromSun)
    //checks which distance unit we should be displaying in
    if(distanceUnit === "kilometers"){
        tripInfoDistance.innerText = `Your trip is ${distanceBetweenPlanets.toLocaleString()} kms long`
    }
    else if(distanceUnit === "miles"){
        tripInfoDistance.innerText = `Your trip is ${(distanceBetweenPlanets * 0.62137).toLocaleString()} miles long`
    }
    calculateTimeForTrip(distanceBetweenPlanets)
}

//calcualtes the time it will take given the vehicle selected and the distace between the planets
const tripInfoTime = document.getElementById("trip-time")
function calculateTimeForTrip (distance){
    //checks to make sure we picked a vehicle before we do the calcualtions
    if (mainVehicle !== null){
        //converts the time the trip will take into seconds
        const tripInSeconds = (distance / mainVehicle.speed) * 3600
        //converts the seconds into a readable string and displays it 
        tripInfoTime.innerText = `And will take ${secondsToString(tripInSeconds)}`
    }
}


/////////////////////////////////////
///Helper Functions   
/////////////////////////////////////

//converts a given amount of seconds and returns a more readable time duration
function secondsToString(seconds){
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400); 
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    return numyears.toLocaleString() + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
}

//makes sure that the speed of the new vehicle is in KPH which is what is stored on the server
const newVehicleDistanceUnit = document.getElementById('new-vehicle-distance-unit')
function calculateSpeedOfNewVehicle (){
    document.getElementById('new-speed').value    
    if (newVehicleDistanceUnit.value === 'dummy-unit'){
        alert('Please Pick A Unit of Speed')
    }
    else if (newVehicleDistanceUnit.value === 'kph'){
        return document.getElementById('new-speed').value
    }
    else if (newVehicleDistanceUnit.value === 'mph'){
        return (document.getElementById('new-speed').value * 1.60934)
    }
}

