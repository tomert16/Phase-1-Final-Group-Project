

// const transporationMethodDiv = document.getElementById("transporation-method")
// selectVehicle = document.getElementById("dropdown-transportation-method").value



// const walkingImage = document.createElement("img")
// walkingImage.setAttribute(id="walking-image")
// walkingImage.src= vehicles[4].image
// walkingImage.alt="Cannot load image"
// const bicycleImage = document.createElement("img")
// bicycleImage.setAttribute(id="bicycle-image")
// bicycleImage.src= vehicles[3].image
// bicycleImage.alt="Cannot load image"
// const drivingImage = document.createElement("img")
// drivingImage.setAttribute(id="driving-image")
// drivingImage.src= vehicles[2].image
// drivingImage.alt="Cannot load image"
// const rocketImage = document.createElement("img")
// rocketImage.setAttribute(id="rocket-image")
// rocketImage.src= vehicles[1].image
// rocketImage.alt="Cannot load image"
// const speedOfLightImage = document.createElement("img")
// speedOfLightImage.setAttribute(id="speed-of-light-image")
// speedOfLightImage.src= vehicles[5].image
// speedOfLightImage.alt="Cannot load image"



let firstMainPlanet = null;
let secondMainPlanet = null 

///fetch all the planet data

fetch("http://localhost:3000/planets")
.then (resp => resp.json())
.then(planetArray => {    
     planetArray.forEach((planet) => { 
       addPlanetToPlanetList(planet);
    });    
   
});




//we need to add a catch for if there is no planet selected for either side 

const tripButton = document.getElementById('trip-btn')
tripButton.addEventListener('click', () => {
    calculateDistanceBetweenTwoPlanets (firstMainPlanet, secondMainPlanet)

})
















const planetDOMList = document.getElementById('planet-list');
function addPlanetToPlanetList(planet){    
    
    const planetImageDomElement = document.createElement("img");    
    planetImageDomElement.setAttribute('id', `planet-id-${planet.id}`);   
    planetImageDomElement.src = planet.image;        
    planetImageDomElement.addEventListener("click", () =>{
        updateDisplay(planet)
    })      
    planetDOMList.append(planetImageDomElement);
};



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

function updateDisplay (planet){
   

    const startEndSelectorValue = startEndPlanetSelector.value

    if(startEndSelectorValue === "start"){
        firstMainPlanet = planet
        firstMainDisplayImage.src = planet.image
        firstMainDisplayText.innerText = planet.name
        firstPlanetSunDistance.innerText = planet.distanceFromSun + " km from the Sun"
        firstPlanetYearLength.innerText = planet.lengthOfYear + " to go around the Sun"
        firstPlanetDayLength.innerText = "A day is " + planet.lengthOfDay
    }
    else if(startEndSelectorValue === "end"){
        secondMainPlanet = planet
        secondMainDisplayImage.src = planet.image
        secondMainDisplayText.innerText = planet.name
        secondPlanetSunDistance.innerText = planet.distanceFromSun + " km from the Sun"
        secondPlanetYearLength.innerText = planet.lengthOfYear + " to go around the Sun"
        secondPlanetDayLength.innerText = "A day is " + planet.lengthOfDay
    }
    else{alert("please pick a star or end location")}
}


const tripInfoDistance = document.getElementById("trip-distance")
function calculateDistanceBetweenTwoPlanets (planetOne, planetTwo){
    const distanceBetweenPlanets = Math.abs(planetOne.distanceFromSun - planetTwo.distanceFromSun)
    tripInfoDistance.innerText = `Your trip is ${distanceBetweenPlanets} kms long`

}
