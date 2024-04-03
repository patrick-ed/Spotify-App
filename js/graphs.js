
function displayArtistsFromSaved(discoveredArtists,divId){

    console.log(discoveredArtists)
    var occurences = Object.values(discoveredArtists);
    var minOccurences = 3;


    const resArray = []; 
    for (const [key, value] of Object.entries(discoveredArtists)) { 

        if (value >= minOccurences){
            resArray.push({artist:`${key}`, occurences:`${value}`});    
        };

    } 
    var data = resArray
    var maxOccr = Math.max.apply(null,occurences)

    data.sort(function(b, a) {
        return a.occurences - b.occurences;
        });

    var occurencesData = data.map(function(d) { return d.occurences; });

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 100, left: 60},
    width = 2000 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    //Add X Axis
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.artist; }))
        .padding(0.2)
        .range([ 0, width ]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")") 
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size","13px")
            .style("fill","white ");
        

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, maxOccr])
        .range([ height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("path,line,text")
        .style("stroke","white")
        .attr("stroke-width",0.5)


    const tooltip = d3.select(divId)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "grey")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    
    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = function(event, d) {
        tooltip
            .html(`Occurences: ${occurencesData[d]}`) 
            .style("opacity", 1)

        }
    
    const mousemove = function(event, d) {
    tooltip.style("transform","translateY(-55%)")
        .style("top", (event.x)/2 + "px")
        .style("left", (event.y)/2-30 + "px");

    }
    
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(event,d) {
    tooltip
        .style("opacity", 0)
    }
    
    
    // Add bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x",function(d){return x(d.artist)}) //d.artist
        .attr("y", function(d){return y(0)})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return (height - y(0));})
        .on("mousemove", mousemove )
        .on("mouseover", mouseover )
        .on("mouseleave", mouseleave ) // Y is rendered as 0 first for the animation to reveal 
        .attr("fill", "#69b3a2");
        

    //Add transition
    
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return y(d.occurences); })
        .attr("height", function(d) { return height - y(d.occurences); })
        .delay(function(d,i){ return(i*100)});
    
        

        


}















function displayDecadesChart(releaseDecade,divId){

    var occurences = Object.values(releaseDecade);

    const resArray = []; 
    for (const [key, value] of Object.entries(releaseDecade)) { 
        resArray.push({decade:`${key}`, occurences:`${value}`}); 
    } 
    var data = resArray
    var maxOccr = Math.max.apply(null,occurences)

    data.sort(function(b, a) {
        return a.occurences - b.occurences;
        });

    
    var occurencesData = data.map(function(d) { return d.occurences; });

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 100, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    //Add X Axis
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.decade; }))
        .padding(0.2)
        .range([ 0, width ]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")") 
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "centre")
            .style("fill","white")
            .style ("font-size","30px");
        

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, maxOccr])
        .range([ height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("path,line,text")
        .style("stroke","white")
        .attr("stroke-width",0.5)


    const tooltip = d3.select(divId)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "grey")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    
    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = function(event, d) {
        tooltip
            .html(`Occurences: ${occurencesData[d]}`) 
            .style("opacity", 1)
    }
    
    const mousemove = function(event, d) {
    tooltip.style("transform","translateY(-55%)")
        .style("top", (event.x)/2 + "px")
        .style("left", (event.y)/2-30 + "px");

    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(event,d) {
    tooltip
        .style("opacity", 0)
    }
    
    
    // Add bars
    svg.selectAll(divId)
        .data(data)
        .enter()
        .append("rect")
        .attr("x",function(d){return x(d.decade)}) //d.artist
        .attr("y", function(d){return y(0)})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return (height - y(0));})
        .on("mousemove", mousemove )
        .on("mouseover", mouseover )
        .on("mouseleave", mouseleave ) // Y is rendered as 0 first for the animation to reveal 
        .attr("fill", "#69b3a2");
        

    //Add transition
    
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return y(d.occurences); })
        .attr("height", function(d) { return height - y(d.occurences); })
        .delay(function(d,i){ return(i*100)});
    
}










function displayBoxPLot(dataIn,divId){
    var data = dataIn
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select(divId)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    

    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Species;})
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.25)
      median = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.5)
      q3 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(data)  

    
  // Show the X scale
  var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(["setosa", "versicolor", "virginica"])
  .paddingInner(1)
  .paddingOuter(.5)
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Show the Y scale
var y = d3.scaleLinear()
  .domain([3,9])
  .range([height, 0])
svg.append("g").call(d3.axisLeft(y))

// Show the main vertical line
svg
  .selectAll("vertLines")
  .data(sumstat)
  .enter()
  .append("line")
    .attr("x1", function(d){return(x(d.key))})
    .attr("x2", function(d){return(x(d.key))})
    .attr("y1", function(d){return(y(d.value.min))})
    .attr("y2", function(d){return(y(d.value.max))})
    .attr("stroke", "black")
    .style("width", 40)

// rectangle for the main box
var boxWidth = 100
svg
  .selectAll("boxes")
  .data(sumstat)
  .enter()
  .append("rect")
      .attr("x", function(d){return(x(d.key)-boxWidth/2)})
      .attr("y", function(d){return(y(d.value.q3))})
      .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
      .attr("width", boxWidth )
      .attr("stroke", "black")
      .style("fill", "#69b3a2")

// Show the median
svg
  .selectAll("medianLines")
  .data(sumstat)
  .enter()
  .append("line")
    .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
    .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
    .attr("y1", function(d){return(y(d.value.median))})
    .attr("y2", function(d){return(y(d.value.median))})
    .attr("stroke", "black")
    .style("width", 80)

    


    

}












async function displayGenreLink(dataIn,divId){

    var data = dataIn;

    const width = 2000;
    const height = 2000;


    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select(divId)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    



    const mouseover = function(event, d) {
    tooltip
    .style("opacity", 1)
    }

    const mousemove = function(event,d) {
    tooltip
    .html("Genre of node: " + d.id+"<br><img src='../images/spotifyLogo1.png' class='logo'>")
    .style("top", d3.select(this).attr("cy")  + "px")
    .style("left", d3.select(this).attr("cx") + 90 + "px")
    }


    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(event,d) {
    tooltip
    .style("opacity", 0)
    }



    const links = data.links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(function(d) {return d.id;}))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

    // Create the SVG container.
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .enter().append("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .enter().append("circle")
    .attr("r", 7)
    .attr("fill", d => color(d.group))
    .on("mouseover",mouseover)
    .on("mousemove",mousemove)
    .on("mouseout",mouseleave)
    .call(d3.drag()
    .on("start",dragstarted)
    .on("drag", dragged)
    .on("end",dragended))


    node.append("title")
        .text(d => d.id);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    };


    function dragstarted(event,d) {
        if (!event.active) simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
        }

        // Update the subject (dragged node) position during drag.
        function dragged(event,d) {
        d.fx = event.x;
        d.fy = event.y;
        }

        // Restore the target alpha so the simulation cools after dragging ends.
        // Unfix the subject position now that it’s no longer being dragged.
        function dragended(event,d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }


    return svg.node();




}


export function artistChart(data,divId){

    console.log(data)
    // Set up SVG
    const svg = d3.select(divId);
    const margin = { top: 20, right: 20, bottom: 100, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);


    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // Set up scales
    const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(Object.keys(data));

    const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(Object.values(data))]);

    // Add x axis
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    // Add y axis
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Occurrences");

    
    // Draw bars
    g.selectAll(".bar")
    .data(Object.entries(data))
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[1]))
    .attr("fill", "steelblue")
    .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`Occurrences: ${d[1]}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });



    


    

}









export {displayArtistsFromSaved, displayBoxPLot, displayDecadesChart,displayGenreLink}