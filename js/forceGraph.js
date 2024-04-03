import * as sptfy from "./spotifyRequests.js";


async function displayGenreLink(dataIn){


    //Seperating JSON objects
    var links = dataIn.links; 
    var nodes = dataIn.nodes;

    var playlistCart = new Array();

    //console.log("data for force graph: ",dataIn)

    const color = d3.scaleOrdinal(d3.schemeCategory10);


    //----------------------- Graph creation -----------------------
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("font-size","20px")
    .style("pointer-events", "none"); // This prevents tooltip from blocking event listeners
 
    var simulation = d3.forceSimulation(nodes) //Creates a new simulation
    .force("link", d3.forceLink(links).id(function(d) { return d.id; }))  //Creates the force between two nodes
    .force("charge", d3.forceManyBody().strength(-200)) //Defines force behavior using Barnes–Hut simulation
    //.force("center", d3.forceCenter(800, 1200)); //Centre of graph



    //Binding of the data to SVG element 
    var svg = d3.select("svg")
    .call(d3.zoom()
    //.scaleExtent([0.5,10]) //Bounds of zoom
    .on("zoom",zoomed)) //Used to update SVG when zooming
    .append("g");


    var link = svg.selectAll("line")//customise links here <<------------------
    .data(links)
    .enter().append("line")
    .style("stroke", "#ccc")
    .attr("stroke-width", 2) ;



    var node = svg.selectAll("circle") //customise nodes here <<------------------
    .data(nodes)
    .enter().append("circle")
    .attr("r", function(d){return 5 + d.occurences * 0.5}) //Link radius to occurences
    .attr("fill", d => color(d.group))
    .style("stroke", "black")
    .style("stroke-width",2)
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))
;

    
    simulation
    .nodes(nodes)
    .on("tick", ticked);
    
    simulation.force("link")
    .links(links);
    //----------------------- Graph creation -----------------------



    // ---------------------- Spotify -----------------------------

    async function getTracks(genre,popularity_threshold,maxTracks){

        console.log("searching for tracks")
        var popularTracks = new Array();
        var pass = 0;

        do{
            
            //console.log("pass: ", pass, popularTracks ,popularity_threshold)

            var response = await sptfy.search(genre,pass*10)
            var tracks = response.tracks.items

            
            filterTracksByPop(tracks,popularTracks,popularity_threshold)
            if (pass >= 3) {popularity_threshold -= 10*pass-3}//If program still hasnt reached 3 tracks, start deincrementing threshold as to shorten loading times
            pass++
            

        }while(popularTracks.length <= maxTracks) //Halt when popularTracks has more than max requested

        return popularTracks.slice(0,maxTracks)
        
    }

    function filterTracksByPop(tracks,popularTracks,popularity_threshold){ 

        tracks.forEach(track => {
            var trackPopularity = track.popularity
            var trackArtists = track.artists


            if ((trackPopularity >= popularity_threshold) && (!(popularTracks.includes(track))) && (!(track.artists[0].id == "06HL4z0CvFAxyc27GXpf02")))  {
     
                popularTracks.push(track)
            } //Push if greater than threshold and not already in

        });


    }
    // ---------------------- Spotify -----------------------------




    //----------------------- side window -----------------------





    async function updateGenreDetails(event, d) {


        var genreDetails = d3.select("#genre-container") //Selects to use d3 animations
        var genreDetailsContainer = document.getElementById("genre-container")
        var genreHtml = `
        <div class="closeBtn" id="closeBtnGenre">×</div>
        <h1 style="margin-bottom: 50px;">${d.id}</h1>
        <div id ="track-container">
            <div class="h-100 d-flex align-items-center justify-content-center">
                searching for tracks please wait
            </div>
        </div>
        <div id="trackDetails"></div>
        
        </div>
        `;
        genreDetailsContainer.innerHTML = genreHtml;
        genreDetails.style("right", "0"); //Slide in animation via d3


        var trackContainer = document.getElementById("track-container")

        const tracks = await getTracks(d.id,60,5); //returns tracks taking params: genre(d.id) // popularity_threshold(int, to filter irrelevant or spam tracks) // max tracks
        console.log(tracks);
        var tracksHtml = "";
        var i = 0;
        tracks.forEach(track => {


            tracksHtml += 
            `
            <div class = "track">
                <div class="container">
                    <div class="row" style="margin-bottom: 40px;">
                        
                        <div class="col-sm-3">
                            <img src="${track.album.images[2].url}" alt="${track.name}">
                        </div>

                        <div class="col-sm-6">
                            <div class = "row">
                                <div class="col-sm-12">
                                    <div class="trackName">${track.name}</div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class="col-sm-12">
                                    <div class="artistName">${track.artists[0].name}</div>
                                </div>
                            </div>

                            <div class = "row">
                                <div class="col-sm-12">
                                    <div class="duration">${msToMinHr(track.duration_ms)}</div>
                                </div>
                            </div>
                            
                        </div>

                        <div class="col-sm-3">
                            <button type="button" class="detailsBtn" value="${i}">select</button>
                        </div>
                    </div>
                </div>
            </div>
            `


            i++;
        });

        trackContainer.innerHTML = tracksHtml;
        refreshEventListeners()

        var closeBtnGenre = document.getElementById("closeBtnGenre");
        closeBtnGenre.addEventListener("click",closeGenreWindow);

        function closeGenreWindow(){
            genreDetails.style("right","-400px");
        }
        


        

        async function showDetailWindow(event) {

            var i = event.target.value
            console.log(tracks[i].external_urls.spotify) 
            
            var detailWindow = d3.select("#trackDetails")
            var detailWindowContainer = document.getElementById("trackDetails")
            var audioHTML;

            if (tracks[i].preview_url != null){
                audioHTML = 
                `
                <audio controls >
                    <source src="${tracks[i].preview_url}" type="audio/mpeg">
                </audio>
                `
            }
            else{
                audioHTML = `preview not avaliable `
            }
            

            var detailHtml =
            `
            <div class="closeBtn" id="closeBtnDetails">×</div>

            <div class="container" style="padding-top:25px">
                <div class="row" style="margin-bottom: 10px;">

                    <div class="col-sm-3">
                        <img src="${tracks[i].album.images[2].url}" alt="${tracks[i].name}">

                    </div>

                    <div class="col-sm-5">
                        <div class = "row">
                            <div class="col-sm-12">
                                <div class="trackNameDetails">${tracks[i].name}</div>
                            </div>
                        </div>

                        <div class = "row">
                            <div class="col-sm-12">
                                <div class="artistNameDetails">${tracks[i].artists[0].name}</div>
                                
                            </div>
                        </div>

                        <div class = "row">
                            <div class="col-sm-12">
                                <div class="durationDetails">${msToMinHr(tracks[i].duration_ms)}</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="albumnNameDetails">${tracks[i].album.name}</div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="releaseDateDetails">${tracks[i].album.release_date}</div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div class="row" style="margin-bottom: 10px;">

                    
                </div>


                <div class="row" style="margin-bottom:10px;">

                    <div class="col-sm-12">
                        <button id="addToPlaylistBtn" value = "${i}">add song to playlist cart</button>
                    </div>
                    
                </div>

                <div class="row" style="margin-bottom: 10px;"
                    <div class="col-sm-12">
                        ${audioHTML}
                    </div>
                </div>


                

            </div>
            `
            detailWindowContainer.innerHTML = detailHtml
            detailWindow.style("bottom", "0px");

            var closeBtnDetails = document.getElementById("closeBtnDetails");
            closeBtnDetails.addEventListener("click",closeDetailsWindow)

            var addToPlaylistBtn = document.getElementById("addToPlaylistBtn")
            addToPlaylistBtn.addEventListener("click",addToPlaylist)

            function closeDetailsWindow(){
                detailWindow.style("bottom","-400px")
            }

            function addToPlaylist(event){

                var selectedTrack = tracks[event.target.value];
                playlistCart.push(selectedTrack)
                console.log(playlistCart)
                localStorage.setItem("playlistCart",JSON.stringify(playlistCart))
                
            }
            
        }

        function refreshEventListeners(){
            var detailsBtns = document.querySelectorAll(".detailsBtn");
            detailsBtns.forEach(function(button) {
                button.addEventListener("click", showDetailWindow);
            });
        
        }
        

        
    }



    function msToMinHr(ms){

        var min = Math.floor((ms/1000/60) << 0 );
        var sec = Math.floor((ms /1000 ) % 60 );
        if(sec.toString().length == 1){
            sec = sec + "0"
        }
        var minSec = (min + ":" + sec)
        return minSec
    
    }


    function fadeIn(text) {
        text.style("opacity", 0) // initial opacity set to 0 
            .transition()
            .duration(500) //duration of fadie in
            .style("opacity", 1); // fade in to full opacity
    }

    // Handle close button for side bar
    d3.select("#closeButton").on("click", function() {
        slideWindow.style("right", "-300px");
        detailWindow.style("bottom", "-300px");
    });
    

    function addToPlaylist(selectedTrack){
        playlistCart.push(selectedTrack)
        console.log(playlistCart)

        localStorage.setItem("playlistCart",JSON.stringify(playlistCart))
    };

    //----------------------- side window -----------------------




    


    //---------------------- Tick updater ---------------------

    function ticked() { //Tick is ran at regular intervals and updates the position of nodes.
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      
        node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    simulation.on("tick", function () {//Tick function called here along with any other function that must be called.

        ticked();

        node.on("mouseover", nodeMouseOver) //with each tick checks if mouse is over a node for tooltip
        .on("mouseout",nodeMouseOut)

        link.on("mouseover",linkMouseOver)
        .on("mouseout",linkMouseOut)
    });
    //----------------------Tick updater ----------------------



    
    //---------------------- Event handlers -------------------
    function nodeMouseOver(event,d){
        console.log("current node:", d)
        var text = (d.id + "\noccurences: " + d.occurences)
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        tooltip.text(text)
        .style("white-space", "pre-line") //breaks line on \n
        .style("left", (event.pageX + 10) + "px") //Positions tooltip to mouse
        .style("top", (event.pageY - 20) + "px");
        d3.select(this).transition().duration(200).attr("r", function(d){return 15 + d.occurences * 0.75}) 

    }
    function nodeMouseOut(event,d){
        tooltip.transition()
        .duration(500)
        .style("opacity", 0); //hide tooltip
        d3.select(this).transition().duration(200).attr("r", function(d){return 5 + d.occurences * 0.75})
        
    }

    function linkMouseOver(event,d){
        //console.log("current link:", d)

        var text = (d.source.id +" ↔ " + d.target.id)
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);
        tooltip.text(text)
        .style("white-space", "pre-line") //breaks line on \n
        .style("left", (event.pageX + 10) + "px") //Positions tooltip to mouse
        .style("top", (event.pageY - 20) + "px");
        d3.select(this).transition().duration(75).attr("stroke-width", function(d){return 7.5}) 


    }

    function linkMouseOut(){

        tooltip.transition()
        .duration(500)
        .style("opacity", 0); //hide tooltip
        d3.select(this).transition().duration(75).attr("stroke-width", function(d){return 2.5}) 


    }

    //------------------------------ Event handlers ------------------------------





    //------------------------------ Dragging handlers ------------------------------
    function dragstarted(event,d) {
        if (!event.active) simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
      
    function dragged(event,d) {
        d.fx = event.x;
        d.fy = event.y;
    }
      
    function dragended(event,d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }


    function zoomed(event) { //Zooming function
        svg.attr("transform", event.transform);
    }
    //------------------------------ Dragging handlers ------------------------------

   


    node.on("click", updateGenreDetails)
    simulation.nodes(nodes);
    simulation.force("link").links(links);


}


export {displayGenreLink};