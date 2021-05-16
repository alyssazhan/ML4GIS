
import type {
  Region,
  Polygon,
  Polygon1,
  Rectangle,
  Point,
} from "../ImageCanvas/regionTools.js"

export type ToolEnum =
  | "pan"
  | "zoom"
  | "create-point"
  | "create-box"
  | "create-polygon"
| "create-polygon1"

export type Image = {
  src: string,
  thumbnailSrc?: string,
  name: string,
  regions?: Array<Region>,
  pixelSize?: { w: number, h: number },
  realSize?: { w: number, h: number, unitName: string },
}

export type Mode =
  | null
  | {| mode: "DRAW_POLYGON", regionId: string |}
  | {| mode: "MOVE_POLYGON_POINT", regionId: string, pointIndex: number |}
| {| mode: "DRAW_POLYGON1", regionId: string |}
| {| mode: "MOVE_POLYGON1_POINT", regionId: string, pointIndex: number |}
  | {|
      mode: "RESIZE_BOX",
      regionId: string,
      freedom: [number, number],
      original: { x: number, y: number, w: number, h: number },
      isNew?: boolean,
    |}
  | {| mode: "MOVE_REGION" |}

export type MainLayoutStateBase = {|
  mouseDownAt?: ?{ x: number, y: number },
  minRegionSize?: number,
  selectedTool: ToolEnum,
  mode: Mode,
  regionTagList?: Array<string>,
  enabledTools: Array<string>,
  history: Array<{ time: Date, state: MainLayoutState, name: string }>,
|}

export type MainLayoutState = {|
  ...MainLayoutStateBase,
  annotationType: "image",
  selectedImage?: string,
  images: Array<Image>,
|}

export type Action =
  | {| type: "@@INIT" |}
  | {| type: "SELECT_IMAGE", image: Image, imageIndex: number |}
  | {|
      type: "IMAGE_LOADED",
      metadata: {
        naturalWidth: number,
        naturalHeight: number,
        // duration?: number,
      },
    |}
  | {| type: "CHANGE_REGION", region: Region |}
  | {| type: "RESTORE_HISTORY" |}
  | {| type: "CLOSE_POLYGON", polygon: Polygon |}
| {| type: "CLOSE_POLYGON1", polygon1: Polygon1 |}
  | {| type: "SELECT_REGION", region: Region |}
  | {| type: "BEGIN_MOVE_POINT", point: Point |}
  | {| type: "BEGIN_BOX_TRANSFORM", rectangle: Rectangle, directions: [number, number] |}
  | {| type: "BEGIN_MOVE_POLYGON_POINT", polygon: Polygon, pointIndex: number |}
| {| type: "BEGIN_MOVE_POLYGON1_POINT", polygon1: Polygon1, point1Index: number |}
  | {|
      type: "ADD_POLYGON_POINT",
      polygon: Polygon,
      point: { x: number, y: number },
      pointIndex: number,
    |}
| {|
  type: "ADD_POLYGON1_POINT",
      polygon1: Polygon1,
      point: { x: number, y: number },
  point1Index: number,
|}
  | {| type: "MOUSE_MOVE", x: number, y: number |}
  | {| type: "MOUSE_DOWN", x: number, y: number |}
  | {| type: "MOUSE_UP", x: number, y: number |}
  | {| type: "CHANGE_REGION", region: Region |}
  | {| type: "OPEN_REGION_EDITOR", region: Region |}
  | {| type: "CLOSE_REGION_EDITOR", region: Region |}
  | {| type: "DELETE_REGION", region: Region |}
  | {| type: "DELETE_SELECTED_REGION" |}
  | {| type: "HEADER_BUTTON_CLICKED", buttonName: string |}
  | {| type: "SELECT_TOOL", selectedTool: ToolEnum |}
  | {| type: "CANCEL" |}
