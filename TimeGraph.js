// The margin is an object with fields top, bottom, left, and right
// The width is the overall width of the svg that will be appended
// The height is the overall height of the svg that will be appended
// The selector is the jQuery style tag to select the element to append the svg to
function TimeGraph(margin, width, height, selector) {
  this.margin = margin;
  this.width = width - margin.left - margin.right;
  this.height = height - margin.top - margin.bottom;
  this.parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ').parse;
  this.x = d3.time.scale().range([0, this.width]);
  this.y = d3.scale.linear().range([this.height, 0]);
  this.color = d3.scale.category10();
  this.xAxis = d3.svg.axis().scale(this.x).orient('bottom');
  this.yAxis = d3.svg.axis().scale(this.y).orient('left');
  this.line = d3.svg.line().interpolate('basis')
    .x(function (d) { return this.x(d.time); })
    .y(function (d) { return this.y(d.value); });
  this.svg = d3.select(selector).append('svg')
    .attr('width', width).attr('height', height).append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}
TimeGraph.prototype.setDomain = function (data) {
  var self = this;
  var times = [];
  data.forEach(function (d) {
    d.data.forEach(function (d) {
      d.time = self.parseDate(d.created_at);
      times.push(d.time);
    });
  });
  this.x.domain(d3.extent(times, function (d) { return d; }));
  this.y.domain([
    d3.min(data, function (d) {
      return d3.min(d.data, function (d) { return d.value; });
    }),
    d3.max(data, function (d) {
      return d3.max(d.data, function (d) { return d.value; });
    })
  ]);
};
TimeGraph.prototype.loadGraph = function (data) {
  var self = this;
  var names = data.map(function (d) {
    return d.name;
  }).push("average");
  self.color.domain(d3.keys(names));
  self.setDomain(data);
  self.svg.append("g").attr("class", "x axis")
    .attr("transform", "translate(0," + (self.height + 10) + ")")
    .call(self.xAxis);
  self.svg.append("g").attr("class", "y axis")
    .attr("transform", "translate(-10, 0)")
    .call(self.yAxis);
  var nodes = [];
  data.forEach(function (v, i) {
    var c = self.color(v.name);
    self.svg.append("path")
      .attr("d", self.line(v.data))
      .attr("stroke", c)
      .attr("stroke-width", 1)
      .attr("fill", "none");
    v.data.forEach(function (d) {
      nodes.push({
        name: v.name,
        color: c,
        data: d
      });
    });
  });
  var node = self.svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("a")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + self.x(d.data.time) + "," + self.y(d.data.value) + ")";
    });
  var circle = node.append("circle")
    .attr("stroke", "black")
    .attr("fill", function (d) { return d.color; })
    .attr("r", 3.75);
  $('svg .node').tipsy({
    gravity: $.fn.tipsy.autoNS,
    html: true,
    title: function () {
      var d = this.__data__;
      var date = new Date(d.data.created_at);
      var dataColor = function (c) {
        return '<span style="font-size: 150%; color: ' +
                d.color + ';">' + c + "</span>";
      };
      return "<h4>" + dataColor(d.name) + "</h4>" +
             "Date: " + dataColor(date.toDateString()) +
             "<br>Time: " + dataColor(date.toTimeString()) +
             "<br>Value: " + dataColor(d.data.value);
    }
  });
};
TimeGraph.prototype.reloadGraph = function (data) {
  $(this.selector + ' svg g').empty();
  this.loadGraph(data);
};
