// -------------
// - douhnut CHART -
// -------------


// douhnut chart

var ctx = document.getElementById("pieChart");

var myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['6:00 AM to 10:00 PM', '6:00 AM to 10:00 PM', '6:00 AM to 10:00 PM'],
    datasets: [{
      label: '6:00 AM to 10:00 PM',
      data: [500, 600, 700],
      backgroundColor: [
        '#6B27E8',
        '#2BE0C3',
        '#0BCAFF'
      ],
    }]
  },
  options: {
    cutoutPercentage: 70,
    animateRotate: true,
    segmentStrokeWidth: 0,
    segmentStrokeColor: '#fff',
    animationSteps: 100,
    segmentShowStroke: true,
    responsive: true,
    legend: false,
    // https://codepen.io/iamsingularity/pen/jKLvgN?editors=0010
    legendCallback: function (chart) {
      var text = [];
      text.push('<ul class="' + chart.id + '-legend">');
      for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
        text.push('<li><span>');
        if (chart.data.labels[i]) {
          text.push(chart.data.labels[i]);
        }
        text.push('</span></li>');
      }
      text.push('</ul>');
      return text.join("");
    },
    elements: {
      center: {
        text: 'Yesterday’s Entries',
        color: '#000', //Default black
        fontStyle: 'Helvetica', //Default Arial
        sidePadding: 40 //Default 20 (as a percentage)
      }
    }

  }
});
// https://stackoverflow.com/questions/46381231/chart-js-legend-customization
Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;

      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);

      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});
$("#pieChart-legend").html(myChart.generateLegend());

// -----------------
// - douhnut CHART -
// -----------------


// -------------
// - bar CHART -
// -------------

// Chart.defaults.global.elements.rectangle.backgroundColor = '#FF0000';

var bar_ctx = document.getElementById('bar-chart').getContext('2d');

var purple_orange_gradient = bar_ctx.createLinearGradient(0, 0, 0, 600);
purple_orange_gradient.addColorStop(0, 'orange');
purple_orange_gradient.addColorStop(1, 'purple');

var green_gradient = bar_ctx.createLinearGradient(0, 0, 0, 600);
green_gradient.addColorStop(0, '#19AC96');
green_gradient.addColorStop(1, '#2BDFC2');

var purple_gradient = bar_ctx.createLinearGradient(0, 0, 0, 600);
purple_gradient.addColorStop(0, '#5202B6');
purple_gradient.addColorStop(1, '#8140F7');

// https://stackoverflow.com/questions/37090625/chartjs-new-lines-n-in-x-axis-labels-or-displaying-more-information-around-ch
Chart.pluginService.register({
  beforeInit: function (chart) {
    var hasWrappedTicks = chart.config.data.labels.some(function (label) {
      return label.indexOf('\n') !== -1;
    });

    if (hasWrappedTicks) {
      // figure out how many lines we need - use fontsize as the height of one line
      var tickFontSize = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].ticks.fontSize, Chart.defaults.global.defaultFontSize);
      var maxLines = chart.config.data.labels.reduce(function (maxLines, label) {
        return Math.max(maxLines, label.split('\n').length);
      }, 0);
      var height = (tickFontSize + 2) * maxLines + (chart.options.scales.xAxes[0].ticks.padding || 0);

      // insert a dummy box at the bottom - to reserve space for the labels
      Chart.layoutService.addBox(chart, {
        draw: Chart.helpers.noop,
        isHorizontal: function () {
          return true;
        },
        update: function () {
          return {
            height: this.height
          };
        },
        height: height,
        options: {
          position: 'bottom',
          fullWidth: 1,
        }
      });

      // turn off x axis ticks since we are managing it ourselves
      chart.options = Chart.helpers.configMerge(chart.options, {
        scales: {
          xAxes: [{
            ticks: {
              display: false,
              // set the fontSize to 0 so that extra labels are not forced on the right side
              fontSize: 0
            }
          }]
        }
      });

      chart.hasWrappedTicks = {
        tickFontSize: tickFontSize
      };
    }
  },
  afterDraw: function (chart) {
    if (chart.hasWrappedTicks) {
      // draw the labels and we are done!
      chart.chart.ctx.save();
      var tickFontSize = chart.hasWrappedTicks.tickFontSize;
      var tickFontStyle = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
      var tickFontFamily = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
      var tickLabelFont = Chart.helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
      chart.chart.ctx.font = tickLabelFont;
      chart.chart.ctx.textAlign = 'center';
      var tickFontColor = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].fontColor, Chart.defaults.global.defaultFontColor);
      chart.chart.ctx.fillStyle = tickFontColor;

      var meta = chart.getDatasetMeta(0);
      var xScale = chart.scales[meta.xAxisID];
      var yScale = chart.scales[meta.yAxisID];

      chart.config.data.labels.forEach(function (label, i) {
        label.split('\n').forEach(function (line, j) {
          chart.chart.ctx.fillText(line, xScale.getPixelForTick(i + 0.5), (chart.options.scales.xAxes[0].ticks.padding || 0) + yScale.getPixelForValue(yScale.min) +
            // move j lines down
            j * (chart.hasWrappedTicks.tickFontSize + 2));
        });
      });

      chart.chart.ctx.restore();
    }
  }
})


var bar_chart = new Chart(bar_ctx, {
  type: 'bar',
  data: {
    // https://codepen.io/shamim539/pen/mddbaMo
    // labels: [["Main Gate","RFID"],["Main Gate","RFID"], ["Main Gate","Ped Gate 1"], ["Main Gate","Ped Gate 2"], "Melanie RFID", "Melanie Gate\nPed Gate", ["Villa Portal","Gate - RFID"], ["Villa Portal Gate","Ped Gate"]],
    labels: ["Main Gate\nRFID", "Main Gate\nPed Gate 1", "Main Gate\nPed Gate 2", "Melanie RFID", "Melanie Gate\nPed Gate", "Villa Portal\nGate - RFID", "Villa Portal Gate\nPed Gate"],
    datasets: [{
        label: 'Main Gate RFID',
        data: [12, 19, 3, 8, 14, 5, 20],
        backgroundColor: green_gradient,
        hoverBackgroundColor: green_gradient,
      },
      {
        label: 'Main Gate Ped Gate 1',
        data: [30, 29, 40, 5, 20, 3, 10],
        backgroundColor: purple_gradient,
        hoverBackgroundColor: purple_gradient,
      }
    ]
  },
  options: {
    scales: {
      spanGaps: true,
      responsive: true,
      maintainAspectRatio: false,
      xAxes: [{
        barPercentage: 0.2,
        barThickness: 13,
        maxBarThickness: 8,
        minBarLength: 2,
        categoryPercentage: 0.4,
        barPercentage: 0.4,
        gridLines: {
          display: false,
          lineWidth: 1,
          zeroLineWidth: 1,
          zeroLineColor: '#666666',
          drawTicks: true
        },
        ticks: {
          display: true,
          stepSize: 8,
          min: 5,
          autoSkip: false,
          fontSize: 11,
          padding: 25
        }
      }],
      yAxes: [{
        ticks: {
          padding: 10
        },
        gridLines: {
          display: true,
          lineWidth: 1,
          zeroLineWidth: 2,
          zeroLineColor: '#666666'
        }
      }]
    },
    legend: false,


  },

});



// AmCharts
// chartdiv

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);
// chart.hiddenState.properties.opacity = 0;

// var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

// var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
// valueAxis.tooltip.disabled = true;

// Add data
// 30 days data
var chartData = [{
  "date": "2019-10-01",
  "value": 13,
  "value2": 16,
  "value3": 15,
}, {
  "date": "2019-10-02",
  "value": 11,
  "value2": 15,
  "value3": 16,
}, {
  "date": "2019-10-03",
  "value": 15,
  "value2": 16,
  "value3": 20,
}, {
  "date": "2019-10-04",
  "value": 16,
  "value2": 11,
  "value3": 15,
}, {
  "date": "2019-10-05",
  "value": 18,
  "value2": 13,
  "value3": 16,
}, {
  "date": "2019-10-06",
  "value": 13,
  "value2": 18,
  "value3": 20,
}, {
  "date": "2019-10-07",
  "value": 22,
  "value2": 23,
  "value3": 23,
}, {
  "date": "2019-10-08",
  "value": 23,
  "value2": 20,
  "value3": 17,
}, {
  "date": "2019-10-09",
  "value": 20,
  "value2": 17,
  "value3": 22,
}, {
  "date": "2019-10-10",
  "value": 17,
  "value2": 22,
  "value3": 24,
}, {
  "date": "2019-10-11",
  "value": 29,
  "value2": 17,
  "value3": 13,
}, {
  "date": "2019-10-12",
  "value": 32,
  "value2": 18,
  "value3": 13,
}, {
  "date": "2019-10-13",
  "value": 18,
  "value2": 17,
  "value3": 32,
}, {
  "date": "2019-10-14",
  "value": 24,
  "value2": 22,
  "value3": 18,
}, {
  "date": "2019-10-15",
  "value": 22,
  "value2": 24,
  "value3": 24,
}, {
  "date": "2019-10-16",
  "value": 24,
  "value2": 24,
  "value3": 19,
}, {
  "date": "2019-10-17",
  "value": 19,
  "value2": 15,
  "value3": 13,
}, {
  "date": "2019-10-18",
  "value": 14,
  "value2": 19,
  "value3": 12,
}, {
  "date": "2019-10-19",
  "value": 15,
  "value2": 22,
  "value3": 9,
}, {
  "date": "2019-10-20",
  "value": 12,
  "value2": 14,
  "value3": 13,
}, {
  "date": "2019-10-21",
  "value": 8,
  "value2": 12,
  "value3": 15,
}, {
  "date": "2019-10-22",
  "value": 9,
  "value2": 8,
  "value3": 11,
}, {
  "date": "2019-10-23",
  "value": 8,
  "value2": 8,
  "value3": 22,
}, {
  "date": "2019-10-24",
  "value": 7,
  "value2": 22,
  "value3": 13,
}, {
  "date": "2019-10-25",
  "value": 5,
  "value2": 11,
  "value3": 7,
}, {
  "date": "2019-10-26",
  "value": 11,
  "value2": 7,
  "value3": 13,
}, {
  "date": "2019-10-27",
  "value": 13,
  "value2": 14,
  "value3": 9,
}, {
  "date": "2019-10-28",
  "value": 18,
  "value2": 5,
  "value3": 11,
}, {
  "date": "2019-10-29",
  "value": 20,
  "value2": 11,
  "value3": 20,
}, {
  "date": "2019-10-30",
  "value": 29,
  "value2": 8,
  "value3": 8,
}, {
  "date": "2019-10-31",
  "value": 33,
  "value2": 19,
  "value3": 33,
}];

chart.data = chartData;


var chartTemporaryData = [{
  "date": "2019-10-01",
  "value": 13,
}, {
  "date": "2019-10-02",
  "value": 11,
}, {
  "date": "2019-10-03",
  "value": 15,
}, {
  "date": "2019-10-04",
  "value": 16,
}, {
  "date": "2019-10-05",
  "value": 18,
}, {
  "date": "2019-10-06",
  "value": 13,
}, {
  "date": "2019-10-07",
  "value": 22,
}, {
  "date": "2019-10-08",
  "value": 23,
}, {
  "date": "2019-10-09",
  "value": 20,
}, {
  "date": "2019-10-10",
  "value": 17,
}, {
  "date": "2019-10-11",
  "value": 29,
}, {
  "date": "2019-10-12",
  "value": 32,
}, {
  "date": "2019-10-13",
  "value": 18,
}, {
  "date": "2019-10-14",
  "value": 24,
}, {
  "date": "2019-10-15",
  "value": 22,
}, {
  "date": "2019-10-16",
  "value": 24,
}, {
  "date": "2019-10-17",
  "value": 19,
}, {
  "date": "2019-10-18",
  "value": 14,
}, {
  "date": "2019-10-19",
  "value": 15,
}, {
  "date": "2019-10-20",
  "value": 12,
}, {
  "date": "2019-10-21",
  "value": 8,
}, {
  "date": "2019-10-22",
  "value": 9,
}, {
  "date": "2019-10-23",
  "value": 8,
}, {
  "date": "2019-10-24",
  "value": 7,
}, {
  "date": "2019-10-25",
  "value": 5,
}, {
  "date": "2019-10-26",
  "value": 11,
}, {
  "date": "2019-10-27",
  "value": 13,
}, {
  "date": "2019-10-28",
  "value": 18,
}, {
  "date": "2019-10-29",
  "value": 20,
}, {
  "date": "2019-10-30",
  "value": 29,
}, {
  "date": "2019-10-31",
  "value": 33,
}];

var chartPermanentData = [{
  "date": "2019-10-01",
  "value2": 16,
}, {
  "date": "2019-10-02",
  "value2": 15,
}, {
  "date": "2019-10-03",
  "value2": 16,
}, {
  "date": "2019-10-04",
  "value2": 11,
}, {
  "date": "2019-10-05",
  "value2": 13,
}, {
  "date": "2019-10-06",
  "value2": 18,
}, {
  "date": "2019-10-07",
  "value2": 23,
}, {
  "date": "2019-10-08",
  "value2": 20,
}, {
  "date": "2019-10-09",
  "value2": 17,
}, {
  "date": "2019-10-10",
  "value2": 22,
}, {
  "date": "2019-10-11",
  "value2": 17,
}, {
  "date": "2019-10-12",
  "value2": 18,
}, {
  "date": "2019-10-13",
  "value2": 17,
}, {
  "date": "2019-10-14",
  "value2": 22,
}, {
  "date": "2019-10-15",
  "value2": 24,
}, {
  "date": "2019-10-16",
  "value2": 24,
}, {
  "date": "2019-10-17",
  "value2": 15,
}, {
  "date": "2019-10-18",
  "value2": 19,
}, {
  "date": "2019-10-19",
  "value2": 22,
}, {
  "date": "2019-10-20",
  "value2": 14,
}, {
  "date": "2019-10-21",
  "value2": 12,
}, {
  "date": "2019-10-22",
  "value2": 8,
}, {
  "date": "2019-10-23",
  "value2": 8,
}, {
  "date": "2019-10-24",
  "value2": 22,
}, {
  "date": "2019-10-25",
  "value2": 11,
}, {
  "date": "2019-10-26",
  "value2": 7,
}, {
  "date": "2019-10-27",
  "value2": 14,
}, {
  "date": "2019-10-28",
  "value2": 5,
}, {
  "date": "2019-10-29",
  "value2": 11,
}, {
  "date": "2019-10-30",
  "value2": 8,
}, {
  "date": "2019-10-31",
  "value2": 19,
}];

var chartVendorData = [{
  "date": "2019-10-01",
  "value3": 15,
}, {
  "date": "2019-10-02",
  "value3": 16,
}, {
  "date": "2019-10-03",
  "value3": 20,
}, {
  "date": "2019-10-04",
  "value3": 15,
}, {
  "date": "2019-10-05",
  "value3": 16,
}, {
  "date": "2019-10-06",
  "value3": 20,
}, {
  "date": "2019-10-07",
  "value3": 23,
}, {
  "date": "2019-10-08",
  "value3": 17,
}, {
  "date": "2019-10-09",
  "value3": 22,
}, {
  "date": "2019-10-10",
  "value3": 24,
}, {
  "date": "2019-10-11",
  "value3": 13,
}, {
  "date": "2019-10-12",
  "value3": 13,
}, {
  "date": "2019-10-13",
  "value3": 32,
}, {
  "date": "2019-10-14",
  "value3": 18,
}, {
  "date": "2019-10-15",
  "value3": 24,
}, {
  "date": "2019-10-16",
  "value3": 19,
}, {
  "date": "2019-10-17",
  "value3": 13,
}, {
  "date": "2019-10-18",
  "value3": 12,
}, {
  "date": "2019-10-19",
  "value3": 9,
}, {
  "date": "2019-10-20",
  "value3": 13,
}, {
  "date": "2019-10-21",
  "value3": 15,
}, {
  "date": "2019-10-22",
  "value3": 11,
}, {
  "date": "2019-10-23",
  "value3": 22,
}, {
  "date": "2019-10-24",
  "value3": 13,
}, {
  "date": "2019-10-25",
  "value3": 7,
}, {
  "date": "2019-10-26",
  "value3": 13,
}, {
  "date": "2019-10-27",
  "value3": 9,
}, {
  "date": "2019-10-28",
  "value3": 11,
}, {
  "date": "2019-10-29",
  "value3": 20,
}, {
  "date": "2019-10-30",
  "value3": 8,
}, {
  "date": "2019-10-31",
  "value3": 33,
}];




function weekData() {
  var newData = [{
    "date": "2019-10-01",
    "value": 13,
    "value2": 13,
    "value3": 13,
  }, {
    "date": "2019-10-02",
    "value": 11,
    "value2": 15,
    "value3": 13,
  }, {
    "date": "2019-10-03",
    "value": 15,
    "value2": 16,
    "value3": 13,
  }, {
    "date": "2019-10-04",
    "value": 16,
    "value2": 11,
    "value3": 13,
  }, {
    "date": "2019-10-05",
    "value": 18,
    "value2": 13,
    "value3": 13,
  }, {
    "date": "2019-10-06",
    "value": 13,
    "value2": 18,
    "value3": 13,
  }, {
    "date": "2019-10-07",
    "value": 22,
    "value2": 23,
    "value3": 13,
  }];
  return newData;
}


function thisWeekData() {
  chart.data = weekData();
}


function thisMonthData() {
  chart.data = chartData;
}

function resetChart() {
  thisMonthData();
}

function temporaryData() {
  chart.data = chartTemporaryData;
}

function permanentData() {
  chart.data = chartPermanentData;
}

function vendorData() {
  chart.data = chartVendorData;
}

// Set input format for the dates
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "value";
series.dataFields.dateX = "date";
series.tooltipText = "{value}"
series.stroke = am4core.color("#6B27E8");
series.name = 'Temporary Guest';
series.tensionX = 0.8;
series.strokeWidth = 2;
series.tooltip.pointerOrientation = "vertical";
series.legendSettings.valueText = "{valueY}";

var series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.dateX = "date";
series2.dataFields.valueY = "value2";
series2.name = 'Permanent Guest';
series2.sequencedInterpolation = true;
series2.defaultState.transitionDuration = 1500;
series2.tooltipText = "{value}"
series2.tensionX = 0.8;
series2.stroke = am4core.color("#0BCAFF");
series2.strokeWidth = 2;
series2.tooltip.pointerOrientation = "vertical";
series2.legendSettings.valueText = "{valueY}";


var series3 = chart.series.push(new am4charts.LineSeries());
series3.dataFields.dateX = "date";
series3.dataFields.valueY = "value3";
series3.name = 'Vendor';
series3.sequencedInterpolation = true;
series3.defaultState.transitionDuration = 1500;
series3.tooltipText = "{value}"
series3.tensionX = 0.8;
series3.stroke = am4core.color("#00D166");
series3.strokeWidth = 2;
series3.tooltip.pointerOrientation = "vertical";
series3.legendSettings.valueText = "{valueY}";

chart.cursor = new am4charts.XYCursor();
chart.cursor.snapToSeries = series;
chart.cursor.xAxis = dateAxis;






// function filterData(quarter) {
//     chart.dataProvider = chartData[0].quarter;
//     chart.validateData();
//   }

//   function resetChart() {
//     chart.dataProvider = chartData;
//     chart.validateData();
//   }


// Array.prototype.forEach.call(
//   document.querySelectorAll('.filterButton'),
//   function (button) {
//     if (button.dataset.quarter === "reset") {
//       button.addEventListener('click', resetChart);
//     } else {
//       button.addEventListener('click', function () {
//         filterData(button.dataset.quarter);
//       });
//     }
//   }
// );


// dashboard widget custom selection
// https://stackoverflow.com/questions/34744474/copy-selected-checkboxes-into-another-div


$(document).ready(function () {
  var data = localStorage.showning;
  var $checkboxes = $(".dashboard-widget input[class='tech']");
  $checkboxes.change(function () {
      var maxAllowed = 4;
      var cnt = $(".dashboard-widget input[class='tech']:checked").length;

      if (cnt > maxAllowed) {
          $(this).prop("checked", "");
          alert('You can select maximum ' + maxAllowed + ' technologies!!');
      }

      var arr = $(":checkbox:checked").map(function() {
        return $(this).next().html();
      }).get();
      $("#dashboard-widgetarea").empty();
      $("#dashboard-widgetarea").html(arr.join(''));
  });

});


function ToggleBGColour(item) {
  var td = $(item).parent();      
  if (td.is('.rowSelected'))      
      td.removeClass("rowSelected");      
  else        
      td.addClass("rowSelected");     
}

