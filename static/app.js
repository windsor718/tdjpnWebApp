//Basic developer preference:
//what to visualize in the initial landing
displayLoading();
const region = "jp";
//const region = "gl";
const initDateFile = {"filename":"latestDatetime_"+region+".json"};
$("#checkBox_"+region).prop("checked", true);
initDate(initDateFile).done(function(result) {
  selectedDate = result.date //global. the value will be modified by the function
  selectedTime = result.time //global. the value will be modified by the function
  removeLoading();
});

//Initializeing and create landing page:
layers = new Array(); //global scope
const d3box = initChart();
const map = initMap(d3box); //global scope
let layer = addPoints("archive/latest_"+region+".geojson", "latest_"+region);
layers[region] = layer;

// Map drawing scripts
function initMap(d3box) {
  /// Generate leaflet map layer and add GeoJSON layer from the url.

  const map = L.map('mapcontainer');
  map.setView([35.40, 136], 5);
  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2luZHNvcjYzMCIsImEiOiJjanZtMzB3bXMweTZhNDBvZnljaGJkbGphIn0.337nen32QKVZ4WD_elH1cA', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
  }).addTo(map);
  return map
}

function addPoints(path, name) {

  const layer = $.getJSON(path, function(data) {
      L.geoJSON(data, {

        onEachFeature: function (feature, layer) {
          const ID = feature.properties.ID;
          const posts = {"name":name, "ID":ID};
          layer.on("click", function(ID) {
            $.ajax({
              type:"POST",
              url:"/data",
              contentType:"json",
              data:JSON.stringify(posts),
              dataType:"json",
              success:function(data) {
                updateData(data, d3box)
              }
            });
          });
        },

        pointToLayer: function (feature, latlng) {
          const colors = {
            10: "#1E88E5",
            50: "#43A047",
            100: "#FDD835",
            200: "#D32F2F"
          };
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: colors[feature.properties.DPI],
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        }

      }).addTo(map); //global scope, not a instance
    });
  return layer
}
//

//Drawing Graph scripts
function initChart() {

  const dataset = [
    ["2000-01-01-00 -00", 0],
    ["2000-01-01-01 -00", 0],
    ["2000-01-01-02 -00", 0],
    ["2000-01-01-03 -00", 0],
    ["2000-01-01-04 -00", 0]
  ];
 
  const width = 500;
  const height = 300;
  const margin = { "top": 30, "bottom": 60, "right": 30, "left": 60 };
 
  const svg = d3.select("#hydrograph").append("svg").attr("width", width).attr("height", height);
 
  const parseDate = d3.timeParse("%Y-%m-%d-%H %Z");
  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, function(d) { return parseDate(d[0]); }))
    .range([margin.left, width - margin.right]);
 
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
    .range([height - margin.bottom, margin.top]);
 
  const axisx = d3.axisBottom(xScale).ticks(5);
  const axisy = d3.axisLeft(yScale).ticks(5);
 
  svg.append("g")
    .attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
    .call(axisx)
    .attr("class", "x axis")
    .append("text")
    .attr("fill", "black")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "10pt")
    .attr("font-weight", "bold")
    .text("Date");
 
  svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .call(axisy)
    .attr("class", "y axis")
    .append("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .attr("font-size", "10pt")
    .text("Water level");
 
  svg.append("path")
    .datum(dataset)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return xScale(parseDate(d[0])); })
      .y(function(d) { return yScale(d[1]); }));

  return [xScale, yScale, svg]
}

function updateData(data, d3box) {
  const xScale = d3box[0]
  const yScale = d3box[1]
  const svg = d3box[2]

  const parseDate = d3.timeParse("%Y-%m-%d-%H %Z");
  // Scale the range of the data again 
  xScale.domain(d3.extent(data, function(d) { return parseDate(d.dates) }));
  yScale.domain([0, d3.max(data, function(d) { return d.values; })]);

  const axisx = d3.axisBottom(xScale).ticks(5);
  const axisy = d3.axisLeft(yScale).ticks(5);

  const valueline = d3.line()
    .x(function(d) { return xScale(parseDate(d.dates)); })
    .y(function(d) { return yScale(d.values); });

  svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(axisx);

  svg.select(".y.axis")
      .transition()
      .duration(1000)
      .call(axisy);

  svg.select(".line")
      .transition()
      .duration(1000)
      .attr("d", valueline(data));
};
//

//SideMenu Scripts
$('.header__icon').on('click',function(){
  openSideMenu();
});

$('.sideMenu__icon').on('click',function(){
  closeSideMenu();
});

$("#dateForm").pickadate({
  format: "yyyy-mm-dd"
});

$("#timeForm").pickatime({
  interval:180,
  format: "HH:i"
});

$(".submitButton").on("click", function() {
  displayLoading();
  const date = $("#dateForm").val();
  const time = $("#timeForm").val();
  updateTimeText(date, time);
  bindNewData(date, time);
  closeSideMenu();
  selectedDate = date
  selectedTime = time
});

$(".region-select").on("click", function() {
  console.log(selectedDate)
  displayLoading();
  bindNewData(selectedDate, selectedTime);
  removeLoading();
})

function openSideMenu() {
  $('.sideMenu').css(
    'display','block'
  ).animate({
    left:'0'
  }, 
    150
  );
  $('.sideMenu-bg').css(
    'display','block'
  ).animate({
    opacity:'0.5'
  },
    150
  );
};

function closeSideMenu() {
  $('.sideMenu').animate({
    left:'-200px'
  },
    150
  );
  $('.sideMenu-bg').animate({
    opacity:'0'
  },
    150
  );
  setTimeout(function(){
    $('.sideMenu').css('display','none');
    $('.sideMenu-bg').css('display','none');
  },
    150
  );
};

function bindNewData(date, time) {
  clearLayers();
  const name = date.replace(/-/g, "") + time.split(":")[0];
  if ($("#checkBox_gl").prop("checked")) {
    let path = "archive/" + name + "_gl.geojson"
    layer_gl = addPoints(path, name+"_gl")
    layers["gl"] = layer_gl
  };
  if ($("#checkBox_jp").prop("checked")) {
    let path = "archive/" + name + "_jp.geojson"
    layer_jp = addPoints(path, name+"_jp")
    layers["jp"] = layer_jp
  };
};

function clearLayers() {
  for (let i in layers) {
    map.removeLayer(layers[i])
  };
  layers = new Array()
}
//

//.datetimeInfo
function updateTimeText(date, time) {
  d3.select(".dateInfo").text(date)
  d3.select(".timeInfo").text(time)
};

function initDate(filenameJSON) {
  return $.ajax({
    type:"POST",
    url:"/init",
    contentType:"json",
    data:JSON.stringify(filenameJSON),
    dataType:"json",
    success:function(data) {
      updateTimeText(data.date, data.time);
    }
  }); 
}

//other functions
function displayLoading() {
  $('.sideMenu-bg').css(
    'display','block'
  ).animate({
    opacity:'0.5'
  });
}

function removeLoading() {
  $('.sideMenu-bg').animate({
    opacity:'0'
  },
    150
  );
  setTimeout(function(){
    $('.sideMenu-bg').css('display','none');
  },
    150
  );
}