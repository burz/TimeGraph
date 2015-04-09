# TimeGraph
#### A JS graph class for non-uniform time data

TimeGraph is used for data like the following:
```
var data = [
  {"name":"Series 1","created_at":"2015-03-30T06:06:48.363Z","data":[
    {"created_at":"2015-03-30T06:06:48.439Z","value":1500}
  ]},
  {"name":"Series 2","created_at":"2015-03-29T21:37:00.846Z","data":[
    {"created_at":"2015-03-30T03:57:04.024Z","value":73042},
    {"created_at":"2015-03-30T01:05:20.670Z","value":73042},
    {"created_at":"2015-03-29T21:42:39.941Z","value":73042},
    {"created_at":"2015-03-29T21:37:00.858Z","value":1500}
  ]},
  {"name":"Series 3","created_at":"2015-04-02T17:42:42.759Z","data":[
    {"created_at":"2015-04-02T17:42:42.812Z","value":1500}
  ]}
];
```
Suppose that we have an HTML `div` element with id `graph_canvas`, then we can render
a graph with the following javascript commands:
```
  var margin = { top: 10, bottom: 40, left: 65, right: 20 };
  var width = 700;
  var height = 400;
  var graph = new TimeGraph(margin, width, height, '#graph_canvas');
  graph.loadGraph(data);
```
Note that d3 and jquery.tipsy are required.
