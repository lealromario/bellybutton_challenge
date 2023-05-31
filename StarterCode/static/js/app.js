// URL to the sample data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to populate the dropdown menu with names
function populateDropdown(names) {
  var dropdown = d3.select("#selDataset");
  dropdown.selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .text(name => name)
    .property("value", name => name);
}

// the function to handle any changes in the selection
function optionChanged(selectedName) {
  // Fetch the JSON data
  d3.json(url).then(function(data) {
    // gathering the  data for a selected individual
    var samples = data.samples;
    var selectedSample = samples.find(sample => sample.id === selectedName);
    var topTenOTUIds = selectedSample.otu_ids.slice(0, 10).map(String).reverse();
    var topTenSampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    var topTenOTULabels = selectedSample.otu_labels.slice(0, 10).reverse();
    var otuIds = selectedSample.otu_ids;
    var sampleValues = selectedSample.sample_values;
    var otuLabels = selectedSample.otu_labels;

    // metadata for the individual
    var metadata = data.metadata.find(meta => meta.id.toString() === selectedName);

    // Displaying demographic metadata
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      demographicInfo.append("p").text(`${key}: ${value}`);
    });

    // Creating the bar chart
    var barTrace = {
      type: "bar",
      orientation: "h",
      x: topTenSampleValues,
      y: topTenOTUIds,
      text: topTenOTULabels,
      hovertemplate: "OTU ID: %{y}<br>Sample Value: %{x}<br>%{text}",
      marker: {
        color: "rgb(58, 200, 225)"
      },
      width: 0.8
    };

    var barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Value" },
      yaxis: {
        title: "OTU ID",
        showticklabels: true,
        type: "category",
        automargin: true
      },
      margin: { t: 30, l: 150 }
    };

    // Creating the bubble chart
    var bubbleTrace = {
      type: "scatter",
      mode: "markers",
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      hovertemplate: "OTU ID: %{x}<br>Sample Value: %{y}<br>%{text}",
      marker: {
        size: sampleValues.map(value => value / 3),
        sizemode: "diameter",
        sizeref: 0.5,
        color: otuIds,
        colorscale: "Viridis"
      }
    };

    var bubbleLayout = {
      title: "All OTUs",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" },
      margin: { t: 30, l: 150 }
    };

    var barChartData = [barTrace];
    var bubbleChartData = [bubbleTrace];
    Plotly.newPlot("bar", barChartData, barLayout);
    Plotly.newPlot("bubble", bubbleChartData, bubbleLayout);
  });
}

// Gathering the JSON data for the dropdown menu
d3.json(url).then(function(data) {
  var names = data.names;
  populateDropdown(names);

  // Add event listener for dropdown change
  d3.select("#selDataset").on("change", function() {
    var selectedName = d3.event.target.value;
    optionChanged(selectedName);
  });

  // Initialize the page with the first name in the dropdown
  optionChanged(names[0]);
})
.catch(function(error) {
  console.log("Error loading the JSON file:", error);
});
