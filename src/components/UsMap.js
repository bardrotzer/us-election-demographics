import { json, csv } from 'd3-fetch'
import { redBlueColor, repColor, demColor, color } from '@/helpers/color.js'
import { select, selectAll } from 'd3-selection'
import { transition } from 'd3-transition'
import * as topojson from 'topojson-client'
import { path } from '@/helpers/geo.js'


export default class UsMap {
  constructor(width, height) {
    this.values = []
    this.height = height
    this.width = width
    this.path = path(width, height)
    this.topo = null
    this.currentColor = null
    this.currentDisplay = null
  }

  async load() {
    /**
     * first load and parse the raw election data
     */
    const n = await csv('/data/county_election_nodes.csv')
    this.values = this.parseNodes(n)
    /**
     * Then parse the geojson, adding node data to the map
     */
    const topo = await json('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json');
    this.topo = this.parseTopo(topo)

  }

  draw(el) {
    const map = select(el).append('svg')
    .attr('height', this.height)
    .attr('width', this.width)
    // remove old
    selectAll('.chart').remove()

    const g = map
      .append('g')
      .attr('class', 'map-layers')
      .style('fill', '#FFF');

    g.selectAll('path')
      .data(topojson.feature(this.topo, this.topo.objects.nation).features)
      .enter()
      .append('path')
      .attr('class', 'states')
      .attr('fill', '#ececec')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.7)
      .attr('d', d => this.path(d));

    const countyPaths = g.append('g').attr('class', 'countyPath'); 
      
    countyPaths
      .selectAll('path')
      .data(topojson.feature(this.topo, this.topo.objects.counties).features)
      .enter()
      .append('path')
      .attr('class', 'counties')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.3)
      .attr('d', d => this.path(d));

    const circleStuff = g.append('g').attr('class', 'circles');
    const circles = circleStuff
      .selectAll('circle')
      .data(this.values)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('r', 0)
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .attr('cx', d => d.xInitial)
      .attr('cy', d => d.yInitial);
  }

  transition(type) {
    if (type === this.currentDisplay) {
      return
    }
    this.currentDisplay = type
    const countyPaths = select('.countyPath');
    const circles = select('.circles');
    const circle = selectAll('.circle');
    console.log(countyPaths)
    const t = countyPaths.transition().duration(1500);
    const ct = circle.transition().duration(1500);
    const cst = circles.transition().duration(1500);

    if (type === 'popular') {
      countyPaths.transition(t).attr('opacity', 0);
      circle
        .transition(ct)
        .attr('r', d => d.r)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      circles.transition(cst).attr('transform', 'scale(1.135 1.135)');
    } else if (type === 'geographic') {
      countyPaths.transition(t).attr('opacity', 1);
      circle
        .transition(ct)
        .attr('r', 0)
        .attr('cx', d => d.xInitial)
        .attr('cy', d => d.yInitial);
      circles.transition(cst).attr('transform', 'scale(1, 1)');
    }
  }

  setColor(type) {
    if (type === this.currentColor) {
      return
    }
    this.currentColor = type
    const colorAccessor = color(type)
    selectAll('.counties').style('fill', d => colorAccessor(d));
    selectAll('.circle').style('fill', d => colorAccessor(d));
}

  parseNodes(n) {
    return n.map(d => {
      const dem = +d.dem
      const rep = +d.rep
      const winner = dem > rep ? 'dem' : 'rep'
      return {
        fips: d.fips,
        r: +d.r,
        pop: +d.pop,
        x: +d.x,
        y: +d.y,
        xInitial: +d.xInitial,
        yInitial: +d.yInitial,
        dem,
        rep,
        index: +d.index,
        vy: +d.vy,
        vx: +d.vx,
        winner,
        properties: {
          weighted: redBlueColor(dem * 0.01),
          absolute: winner === 'dem' ? demColor : repColor,
          winDem: winner === 'dem' ? demColor : '#ececec',
          winRep: winner === 'rep' ? repColor : '#ececec'
        }
      }
    })
  }

  parseTopo(topo) {
    topo.objects.counties.geometries.forEach(d => {
      const filtered = this.values.find(v => v.fips === d.id)
      if (filtered) {
        d.properties.weighted = redBlueColor(filtered.dem * 0.01)
        d.properties.absolute = filtered.winner === 'dem' ? demColor : repColor
        d.properties.winDem = filtered.winner === 'dem' ? demColor : '#ececec'
        d.properties.winRep = filtered.winner === 'rep' ? repColor : '#ececec'
      }
    });
    return topo
  }
}
  