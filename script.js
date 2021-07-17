//Mean sea level in meters
var mean_sea_level = 6371146;

//Inserts a polyline element containing the outline map of the world based on the PR_Geo method
function convertTOSVG(){
  var fullSVG = "";
  //Parse the geojson
  var parsedgeoJSON = JSON.parse(world_map);
  //Access the features list(countries) which contains a list of lists of objects which represent each individual contry outline on the map
  var countries = parsedgeoJSON["features"];
  var circumference = (Math.PI * mean_sea_level) / 2;
  //console.log(countries);
  //Set the SVG heigh, width and viewbox
  /*//360 degrees wide
  document.getElementById("world_map").style.width = `${circumference}px`;
  //180 degrees heigh
  document.getElementById("world_map").style.height = `${circumference / 2}px`;*/
  //Set the viewbox to contain the entire map
  document.getElementById("world_map").setAttribute("viewBox",`${-circumference/2} ${-circumference / 4} ${circumference} ${circumference / 2}`);
  countries.forEach(country => {
    //console.log(country);
    var typeOfGeometry = country["geometry"]["type"];
    //Reference the country coordinates(its an array of arrays in the form of [latitude,longitude])
    var country_coordinates = country["geometry"]["coordinates"];
    //Save the name of the country in a variable
    var country_name = country["properties"]["COUNTRY"];
    //console.log(country_coordinates);
    country_coordinates.forEach((coordinate_list)=>{
      //A variable to hold the coordinates in the format of the points property specified by the SVG standard
      var points = "";
      coordinate_list.forEach((all_coordinates)=>{
        all_coordinates.forEach((coordinate)=>{
          //console.log(coordinate);
          //TODO: Convert to coordinates using the PR_Geo formula
          var latitude = (coordinate[0] / 360) * circumference;
          var longitude = (coordinate[1] / 360) * circumference;
          //Invert the longitude due to the fact that SVG Y axis coordinate system is inverted
          longitude = - longitude;
          points += latitude + "," + longitude + " ";
        });
      });
      //Add the polygon to the svg and events to change color
      fullSVG += `<polygon points="${points}" style="fill: #659B5E" onmouseover="onCountryHover(this)" onmouseout="onLeaveCountry(this)" data-country="${country_name}"/>"`;
    });
  });
  document.getElementById("world_map").innerHTML = fullSVG;
}

//Triggered when the countries get hovered
function onCountryHover(element){
  document.getElementById("country_name").style.display = "block";
  element.style.fill = "#42423D";
  document.getElementById("country_name").innerHTML = element.dataset.country;
}

function onLeaveCountry(element){
  document.getElementById("country_name").style.display = "none";
  element.style.fill = "#659B5E";
}