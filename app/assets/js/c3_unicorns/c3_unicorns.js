var myData = [
  ["Countries","USA","China","India","United Kingdom","Germany","Sweden","South Korea","Singapore","Canada","Israel"],
  ['Unicorn companies',92,25,7,5,4,2,2,2,2,2],
  ['Valuation',317.41,126.05,27.6,10.78,9,8.23,6.7,3.43,2.7,],
  ['Valuation',51,46,25.5,20,16,15,15,15,12,11],
  ['Valuation',46,3.6,1,1,1],
 ['No of companies',31,24,20,14,10,9,9,8,7,5]
             ];
             
var myCategories = [
	["USA","China","India","United Kingdom","Germany","Sweden","South Korea","Singapore","Canada","Israel"],
['Uber','Xiaomi','Airbnb','Palantir Technologies','Snapchat','Didi Kuaidi','Flipkart','China Internet Plus Holding','SpaceX','Pinterest'],
['Xiaomi', 'Ucar Group', 'BeiBei', 'Iwjw.com', 'Dada'],
['eCommerce/Marketplace','Internet Software & Services','Fintech','Big Data','Healthcare','On-Demand','Hardware','Social','Cybersecurity','Mobile Software & Services']
];

var chart_gen = function() {

  var chart = c3.generate({
    data: {
      columns: [myData[1]],
      type: 'bar',
      selection: {
        enabled: true
      }
    },
    axis: {
      x: {
        type: 'category',
        tick: {
                rotate: 90,
                multiline: false
              },
        categories: myCategories[0]
      },
      y: {
        label: {
          text: 'No. of Unicorn Companies',
          position: 'outer-top'
        }
      }
    }
  });
  return chart;
};


var slide_0 = function() {
  chart = chart_gen();
  document.getElementById('message').innerHTML = 'What are unicorns?';
}

var slide_1 = function() {
  document.getElementById('message').innerHTML = "Unicorns are private companies that are valued at more than $1 billion. CB Insights releases an annual list of all such companies in the world. Here is a look at them.";
}

var slide_2 = function() {
  document.getElementById('message').innerHTML = "92 of them are in the United States.<br><br> China has 25. <br><br> India has 7.";
}

var slide_3 = function() {
  chart.load({
        columns: [myData[2]],
        unload: chart.columns    
    }); 
  chart.axis.labels({y:'Valuation in $bn'});
  chart.ygrids.add([
    {
      value: 317.41,
      text: "$317.4 billion"
    },
    {
      value: 126,
      text: "$126 billion"
  	},
    {
      value: 27,
      text: "$317.4 billion"
  	}
  ]);
  document.getElementById('message').innerHTML = "The total worth of US-based unicorns is <mark>#317.41 billion</mark>. <br><br> China is second, home to <mark>$126 billion</mark> worth in companies. <br><br> India is third, with <mark>$27 billion</mark>."; 
}

var slide_4 = function () {
	chart.destroy();
  chart = c3.generate({
  data: {
    columns: [myData[3]],
    type: 'bar',
    selection: {
      enabled: true
    }
  },
  axis: {
  	rotated: true,
    x: {
      type: 'category',
      tick: {
              rotate: 90,
              multiline: false
            },
      categories: myCategories[1]
    },
    y: {
      label: {
        text: 'Valuation in $bn',
        position: 'outer-top'
      }
    }
  }
});
document.getElementById('message').innerHTML = "These are the top 10 most valuable private companies in the world."
}

var slide_5 = function () {
	chart = chart.destroy();
  
  chart = c3.generate({
  data: {
    columns: [myData[4]],
    type: 'bar',
    selection: {
      enabled: true
    }
  },
  axis: {
  	rotated: true,
    x: {
      type: 'category',
      tick: {
              rotate: 90,
              multiline: false
            },
      categories: myCategories[2]
    },
    y: {
      label: {
        text: 'Valuation in $bn',
        position: 'outer-top'
      }
    }
  }
}); 
  
document.getElementById('message').innerHTML = "The top five companies to rise to a billion-dollar valuation in the shortest period of time are all from China.<br> All of them crossed this valuation in <mark>one year</mark>."
}

var slide_6 = function() {
	chart.destroy();
  
  chart = c3.generate({
  data: {
    columns: [myData[5]],
    type: 'bar',
    selection: {
      enabled: true
    }
  },
  axis: {
    x: {
      type: 'category',
      tick: {
              rotate: 90,
              multiline: false
            },
      categories: myCategories[3]
    },
    y: {
      label: {
        text: 'Number of companies',
        position: 'outer-top'
      }
    }
  }
});
  
document.getElementById('message').innerHTML = "Here are the industries they belong to.";
}

var slides = [slide_0, slide_1, slide_2, slide_3, slide_4, slide_5, slide_6];

// cycle through slides
var current_slide = 0;

var run = function() {
	//console.log(current_slide);
  slides[current_slide]();
  current_slide += 1;

  if (current_slide === 1) {
    document.getElementById("start_btn").innerHTML = "Start";
  } else if (current_slide === slides.length) {
    current_slide = 0;
    document.getElementById("start_btn").innerHTML = "Replay";
  } else {
    document.getElementById("start_btn").innerHTML = "Continue";
  }
};

// button event handler
document.getElementById('start_btn').addEventListener("click", run);

// init
run();