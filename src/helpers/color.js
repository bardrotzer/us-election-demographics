import { scaleSequential } from 'd3-scale'
import { interpolateRdBu } from 'd3-scale-chromatic'

const rbc = scaleSequential(interpolateRdBu)

export const redBlueColor = num => rbc(num)

export const repColor = '#175196'

export const demColor = '#ac1643'

export const color = type => {
  if (type === 'weight') {
    return d => d.properties.weighted
  } else if (type === 'dem') {
    return d => d.properties.winDem
  } else if (type === 'rep') {
    return d => d.properties.winRep
  }
  return d => d.properties.absolute
}