
export type BaseRegion = {
  id: string | number,
  cls?: string,
  locked?: boolean,
  visible?: boolean,
  color: string,
  editingLabels?: boolean,
  highlighted?: boolean,
  tags?: Array<string>,
}

export type Point = {|
  ...$Exact<BaseRegion>,
  type: "point",
  x: number,
  y: number,
|}

export type Rectangle = {|
  ...$Exact<BaseRegion>,
  type: "rectangle",
  x: number,
  y: number,
  w: number,
  h: number,
|}

export type Polygon = {|
  ...$Exact<BaseRegion>,
  type: "polygon",
  open?: boolean,
  points: Array<[number, number]>,
|}

export type Polygon1 = {|
...$Exact<BaseRegion>,
    type:
"polygon1",
    points:Array<[number, number]>,
    holes: Array<[number, number]>,
    open?: boolean,
    creatingHole?:  boolean,
|}
export type Circle = {|
...$Exact<BaseRegion>,
    type: "circle",
    // x and y indicate the coordinates of the centre of the circle
    x: number,
    y: number,
    // x and y radius (technically, Circles are capable of representing Ovals)
    xr: number,
    xr: number
|}
export type Region =
  | Point
  | Rectangle
  | Polygon
  | Polygon1
  |Circle

export const getEnclosingBox = (region: Region) => {
  switch (region.type) {
    case "polygon": {
      const rectangle = {
        x: Math.min(...region.points.map(([x, y]) => x)),
        y: Math.min(...region.points.map(([x, y]) => y)),
        w: 0,
        h: 0,
      }
      rectangle.w = Math.max(...region.points.map(([x, y]) => x)) - rectangle.x
      rectangle.h = Math.max(...region.points.map(([x, y]) => y)) - rectangle.y
      return rectangle
    }
    case "polygon1": {
      const rectangle = {
        x: Math.min(...region.points.map(([x, y]) => x)),
        y: Math.min(...region.points.map(([x, y]) => y)),
        w: 0,
        h: 0,
      }
      rectangle.w = Math.max(...region.points.map(([x, y]) => x)) - rectangle.x
      rectangle.h = Math.max(...region.points.map(([x, y]) => y)) - rectangle.y
      return rectangle
    }
    case "circle": {
      return {
        x: region.x - region.xr,
        y: region.y - region.yr,
        w: region.xr * 2,
        h: region.yr * 2
      }
    }
    case "rectangle": {
      return { x: region.x, y: region.y, w: region.w, h: region.h }
    }
    case "point": {
      return { x: region.x, y: region.y, w: 0, h: 0 }
    }
    default: {
      return { x: 0, y: 0, w: 0, h: 0 }
    }
  }
  throw new Error("unknown region")
}

export const moveRegion = (region: Region, x: number, y: number) => {
  switch (region.type) {
    case "point": {
      return { ...region, x, y }
    }
    case "rectangle": {
      return { ...region, x: x - region.w / 2, y: y - region.h / 2 }
    }
    case "circle": {
      return {
        ...region,
        x,
        y
      }
    }
  }
  return region
}
