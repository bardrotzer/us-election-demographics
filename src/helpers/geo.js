import { geoPath, geoAlbersUsa } from 'd3-geo'


const projection = (width, height) => {
  return geoAlbersUsa()
      .scale(700)
      .translate([width / 2, height / 2])
}

export const path = (width, height) => {
  const _projection = projection(width, height)
  return geoPath().projection(_projection);
}