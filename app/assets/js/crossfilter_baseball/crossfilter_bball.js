var hist = function(data_in, chart_id, value, chart_title) {

  var margin = {
      "top": 30,
      "right": 30,
      "bottom": 50,
      "left": 30
    },
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data_in, function(d) {
      return d.value[value];
    })])
    .range([height, 0]);
	
  d3.select("#" + chart_id).remove();
  
  var div = d3.select("#baseball-wrap")
  .append("div").attr("id", chart_id);
  
  div.append("h3")
  .attr("class", "chart-title")
  .text(chart_title);
  
  var svg = div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
    .data(data_in)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      return "translate(" + x(i / data_in.length) + "," + y(d.value[value]) + ")";
    });

  bar.append("rect")
    .attr("x", 1)
    .attr("width", width / data_in.length - 1)
    .attr("height", function(d) {
      return height - y(d.value[value]);
    });

  var formatCount = d3.format(",.0f");

  bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", (width / data_in.length - 1) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.value.count);
    });

  var unique_names = data_in.map(function(d) {
    return d.key;
  });

  var xScale = d3.scale.ordinal()
  .domain(unique_names).rangePoints([0, width]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var xTicks = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", "10px")
    .attr("transform", function(d) { return "rotate(-50)" });


  var yAxis = d3.svg.axis()
    .ticks(5)
    .scale(y)
    .orient("left");

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", "10px");
}

d3.json("https://still-taiga-34733.herokuapp.com/baseball",
  function(error, games_json) {
  //console.log(games_json)
  
  // Build player dropdown
  var playerSelect = d3.select("#player-filter")
  .append("select")
  .attr("id", "player-select")
  
  playerSelect.selectAll("option")
  .data(games_json)
  .enter()
  .append("option")
  .attr("value", function(d){return d.player_id; })
  .text(function(d){return d.player_id});

  d3.select("#player-filter")
  .append("button")
  .attr("id", "player-button")
  .text("Submit");

  d3.select("#player-filter")
  .append("button")
  .attr("id", "player-reset")
  .text("Reset");
  
  // Build team dropdown
  var teamSelect = d3.select("#team-filter")
  .append("select")
  .attr("id", "team-select")
  
  teamSelect.selectAll("option")
  .data(games_json)
  .enter()
  .append("option")
  .attr("value", function(d){return d.team_id; })
  .text(function(d){return d.team_id});

  d3.select("#team-filter")
  .append("button")
  .attr("id", "team-button")
  .text("Submit");

  d3.select("#team-filter")
  .append("button")
  .attr("id", "team-reset")
  .text("Reset");

  
  //console.log(options);

    var cf = crossfilter(games_json);
    var dim_team = cf.dimension(function(d) { return d.team_id; });
    var dim_team2 = cf.dimension(function(d) { return d.team_id; });
    var dim_ngames = cf.dimension(function(d){ return d.g_all;     });
    /* add more dimensions here */
    var dim_player = cf.dimension(function(d){ return d.player_id; });
    var dim_year = cf.dimension(function(d){ return d.year; });
    var dim_year2 = cf.dimension(function(d){ return d.year; })
    
    var group_team = dim_team.group();
    /* add more groups here */
    var group_year = dim_year2.group();
     
    /* 
    // sanity check
    
    group_team
      .top(Infinity)
      .forEach(function(d, i) {
        console.log(JSON.stringify(d));
      });
      
    */
    
    /* --------------------------------------------------------- 
    
    	Add a third and 4th variable to this map reduction
      - the third should be the minimum year
      - the fourth should be the maximum year
      - hint: use inequalities
      
    */
    
    var reduce_init = function() {
      return {
        "count": 0,
        "total": 0,
        "max_year": 0,
        "all_years": []
      };
    }

    var reduce_add = function(p, v, nf) {
      ++p.count;
      p.total += v.g_all;
      if(p.max_year < v.year) {
      	p.max_year = v.year;
        p.all_years.push(v.year)
      }
      return p;
    }

    var reduce_remove = function(p, v, nf) {
      --p.count;
      p.total -= v.g_all;
      // remove year
      p.all_years.splice(p.all_years.indexOf(v.year), 1); 
  		// get max over array
      p.max_year = Math.max.apply(null, p.all_years); 
      
      return p;
    }
    
    /* --------------------------------------------------------- */
    
    
    group_team.reduce(reduce_add, reduce_remove, reduce_init);
  	/* reduce the more groups here */
    group_year.reduce(reduce_add, reduce_remove, reduce_init);
    
    var render_plots = function(){
      // count refers to a specific key specified in reduce_init 
      // and updated in reduce_add and reduce_subtract
      // Modify this for the chart to plot the specified variable on the y-axis
      hist(group_team.top(Infinity), 
      	"appearances_by_team", 
        "count", 
        "# of Appearances by Team"
      );
      
      /* build more charts here */
       hist(group_year.top(Infinity), 
      	"games_bper_year", 
        "count", 
        "# of Games per Year"
      );       
    }
    
    
    /* --------------------------------------------------------- 
       this is a slider, see the html section above
    */
    var n_games_slider = new Slider(
      "#n_games_slider", {
        "id": "n_games_slider",
        "min": 0,
        "max": 100,
        "range": true,
        "value": [0, 100]
      });
    
    /* add at least 3 more sliders here */
    var year_slider = new Slider(
    	"#year_slider", {
      	"id": "year_slider",
        "min": 1872,
        "max": 1905,
        "range": true,
        "value": [1872, 1905]
      })
   
    // this is an event handler for a particular slider
    n_games_slider.on("slide", function(e) {
      d3.select("#n_games_slider_txt").text("min: " + e[0] + ", max: " + e[1]);
    	
      // filter based on the UI element
      dim_ngames.filter(e);
      //dim_year.filter(e);
      
   		// re-render
      render_plots(); 
       
     /* update the other charts here 
      hint: each one of your event handlers needs to update all of the charts
     */
       
    });
    
    year_slider.on("slide", function(e) {
    	d3.select("#year_slider_txt").text("min: " + e[0] + ", max: " + e[1]);
      dim_year.filter(e);
      console.log(e)
      
      render_plots();
    
    });
    
    // Filter by player
    d3.select("#player-button")    
    .on("click", function(e) {
      var selected = d3.select("#player-select")
      .property("value");
      
      //console.log(selected)
    	dim_player.filter(selected);
      
      render_plots();
    });
    
    d3.select("#player-reset")
    .on("click", function(e) {
    	dim_player.filter(null); 
      
      render_plots();
    });
    
    // Filter by team
    d3.select("#team-button")    
    .on("click", function(e) {
      var team = d3.select("#team-select")
      .property("value");
      
      //console.log(selected)
    	dim_team2.filter(team);
      
      
      render_plots();
    });
    
    d3.select("#team-reset")
    .on("click", function(e) {
    	dim_team2.filter(null); 
      
      render_plots();
    });
     
     
     render_plots(); // this just renders the plots for the first time
    
  });