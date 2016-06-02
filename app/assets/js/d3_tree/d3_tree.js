var dataSet = {
    "name": "Maekar",
    "children": [
        {
            "name": "Aeryon"
        },
        {
            "name": "Aemon"            
        },
        {
            "name": "Aegon",
            
            "children": [
                {
                    "name": "Duncan (the small)",
                },
                {
                    "name": "Aerys (the mad)",
                    "children": [
                        {"name": "Rhaegar",
                          "children": [ 
                            {
                              "name": "Rhaenys"
                            },
                            {
                              "name": "Aegon"
                            }
                          ]
                        },
                        {
                          "name": "Viserys"
                        },
                        {
                          "name": "Daenerys"
                        }
                    ]
                },
                {
                    "name": "Daeryon"                    
                }
            ]
        }
    ]
};

var height = 600,
  width = 1000;

var svg = d3.select("#hierarchy")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(75,0)");

var tree = d3.layout.tree()
  .size([height, width - 200]);

var diagonal = d3
  .svg
  .diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });
  
var search_term = "Daenerys"; 
  
dataSet.x0 = height / 2;
dataSet.y0 = 0;

var i = 0;
var duration = 750;

function findInPath(source, text) {
  if (source.name.search(text) > 0) {
    return true;
  } else if (source.children || source._children) {
    var c = source.children ? source.children : source._children;
    for (var i = 0; i < c.length; i++) {
      if (findInPath(c[i], text)) {
        return true;
      }
    }
  }
  return false;
}

var linkFilter = function(d) {
  return findInPath(d.target, search_term);
}

update(dataSet);

function update(source) {

  var nodes = tree.nodes(dataSet);
  var links = tree.links(nodes);

  var node = svg.selectAll("g.node")
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

  var nodeEnter = node
  .enter()
  .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + 20 + source.y0 + "," + source.x0 + ")";
    });
  
  img = 'http://24sevensfootball.com/wp-content/uploads/2015/05/house_targaryen_sigil_by_clockhound-d6igay5.png';
  
  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("stroke", "steelblue")
    .style("stroke-width", "1.5px");

  nodeEnter.append('image')
  .attr('xlink:href', img)
  .attr("width",0)
  .attr("height", 0)
  .attr("y", -13)
  .attr("x", -13)
  .on('click', click);

  nodeEnter.append("text")
    .attr("x", function(d) {
      return d.children || d._children ? -30 : 30;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function(d) {
      return d.name;
    })
    .style("fill-opacity", 1e-6)
    .style("font", "10px sans-serif")
    .style("fill", "black")
    .style("stroke-width", ".01px");

  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });
    
  nodeUpdate.select("circle")
    .filter(function(d) {
      return findInPath(d, search_term)
    })
    .style("fill",'none')
    .style("fill-opacity", 1e-6);
  
    /*nodeUpdate.select("circle")
    .attr("r", 25)
    .style("stroke", "steelblue")
    .style("stroke-width", "1.5px")*/
  
  nodeUpdate.select('image')
  .attr('xlink:href', img)
  .attr('height', 30)
  .attr('width', 30)

  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .style("font", "10px sans-serif")
    .style("fill", "black")
    .style("stroke-width", ".01px");
    

  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select('image')
  .attr('height', 0)
  .attr('width', 0)

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);


  var link = svg.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id;
    });

  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .style("fill", "none")
    .style("stroke", "#ccc")
    .style("stroke-width", "1.5px");

  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

link.filter(linkFilter).style("stroke", "red")

  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}