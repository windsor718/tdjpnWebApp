// Map drawing scripts
const map = L.map('mapcontainer');
map.setView([35.40, 136], 5);
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2luZHNvcjYzMCIsImEiOiJjanZtMzB3bXMweTZhNDBvZnljaGJkbGphIn0.337nen32QKVZ4WD_elH1cA', {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
}).addTo(map);

const sample = {"type":"FeatureCollection","features":[
  {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[139.76712226867676,35.68107370561057]}},
  {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[139.70030307769775,35.69045025639499]}},
  {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[139.7512435913086,35.707283453190406]}}]};

const geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

const valueline = d3.line()
  .x(function(d) { return xScale(d.dates); })
  .y(function(d) { return yScale(d.values); });

L.geoJSON(sample, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }
}).addTo(map).on('click', function(e) {
  $.ajax({
    type:"POST",
    url:"/data",
    data:"{}",
    dataType:"json",
    success:function(data) {
      const result = data;
      const values = result.values;
      const dates = result.dates;
      updateData(data)
    }
  });
});
//

//Drawing Graph scripts
// 1. データの準備
const dataset = [
    [5, 20],
    [25, 67],
    [85, 21],
    [100, 33],
    [220, 88],
    [250, 50],
    [330, 95],
    [410, 12],
    [475, 44],
    [480, 90]
];
 
const width = 500; // グラフの幅
const height = 300; // グラフの高さ
const margin = { "top": 30, "bottom": 60, "right": 30, "left": 60 };
 
// 2. SVG領域の設定
const svg = d3.select("#hydrograph").append("svg").attr("width", width).attr("height", height);
 
// 3. 軸スケールの設定
const xScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d[0]; })])
  .range([margin.left, width - margin.right]);
 
const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d[1]; })])
  .range([height - margin.bottom, margin.top]);
 

// 4. 軸の表示
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
  .text("X Label");
 
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
  .text("Y Label");
 
// 5. ラインの表示
svg.append("path")
  .datum(dataset)
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return xScale(d[0]); })
    .y(function(d) { return yScale(d[1]); }));

function updateData(data) {

  const parseDate = d3.timeParse("%Y-%m-%d");
  // Scale the range of the data again 
  //xScale.domain(d3.extent(data, function(d) { return parseDate(d.dates) }));
  xScale.domain(d3.extent(data, function(d) { return d.dates; }));
  yScale.domain([0, d3.max(data, function(d) { return d.values; })]);

  const axisx = d3.axisBottom(xScale).ticks(5);
  const axisy = d3.axisLeft(yScale).ticks(5);

  svg.select(".x.axis")
      .transition()
      .duration(1500)
      .call(axisx);

  svg.select(".y.axis")
      .transition()
      .duration(1500)
      .call(axisy);

  svg.select(".line")
      .transition()
      .duration(1500)
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
  const date = $("#dateForm").val();
  const time = $("#timeForm").val();
  updateTimeText(date,time);
  closeSideMenu()
});

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

function updateTimeText(date, time) {
  d3.select(".dateInfo").text(date)
  d3.select(".timeInfo").text(time)
};
//

//Other functions