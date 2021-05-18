import type { MainLayoutState, Action } from "../MainLayout/types"
import { moveRegion } from "../ImageCanvas/regionTools.js"
import { getIn, setIn, updateIn } from "seamless-immutable"
import isEqual from "lodash/isEqual"
import getActiveImage from "./getActiveImage"
import { saveToHistory } from "./historyHandler.js"
import colors from "../ImageCanvas/colors"

const getRandomId = () => Math.random().toString().split(".")[1]

export default (state: MainLayoutState, action: Action) => {
  // Throttle certain actions
  if (action.type === "MOUSE_MOVE") {
    if (Date.now() - ((state: any).lastMouseMoveCall || 0) < 16) return state
    state = setIn(state, ["lastMouseMoveCall"], Date.now())
  }
  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action)
  }

  const { currentImageIndex, pathToActiveImage, activeImage } = getActiveImage(
    state
  )

  const getRegionIndex = (region) => {
    const regionId =
      typeof region === "string" || typeof region === "number"
        ? region
        : region.id
    if (!activeImage) return null
    const regionIndex = (activeImage.regions || []).findIndex(
      (r) => r.id === regionId
    )
    return regionIndex === -1 ? null : regionIndex
  }
  const getRegion = (regionId) => {
    if (!activeImage) return null
    const regionIndex = getRegionIndex(regionId)
    if (regionIndex === null) return [null, null]
    const region = activeImage.regions[regionIndex]
    return [region, regionIndex]
  }
  const modifyRegion = (regionId, obj) => {
    const [region, regionIndex] = getRegion(regionId)
    if (!region) return state
    if (obj !== null) {
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...region,
        ...obj,
      })
    } else {
      // delete region
      const regions = activeImage.regions
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (regions || []).filter((r) => r.id !== region.id)
      )
    }
  }

  const closeEditors = (state: MainLayoutState) => {
    if (currentImageIndex === null) return state
    return setIn(
      state,
      [...pathToActiveImage, "regions"],
      (activeImage.regions || []).map((r) => ({
        ...r,
        editingLabels: false,
      }))
    )
  }

  const setNewImage = (img: string | Object, index: number) => {
    let { src } = typeof img === "object" ? img : { src: img }
    return setIn(
      setIn(state, ["selectedImage"], index),
      ["selectedImageFrameTime"]
    )
  }

  switch (action.type) {
    case "@@INIT": {
      return state
    }
    case "SELECT_IMAGE": {
      return setNewImage(action.image, action.imageIndex)
    }
    case "CHANGE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const oldRegion = activeImage.regions[regionIndex]
      if (oldRegion.cls !== action.region.cls) {
        state = saveToHistory(state, "Change Region Classification")
        const clsIndex = state.regionClsList.indexOf(action.region.cls)
        if (clsIndex !== -1) {
          action.region.color = colors[clsIndex % colors.length]
        }
      }
      if (!isEqual(oldRegion.tags, action.region.tags)) {
        state = saveToHistory(state, "Change Region Tags")
      }
      if (!isEqual(oldRegion.comment, action.region.comment)) {
        state = saveToHistory(state, "Change Region Comment")
      }
      return setIn(
        state,
        [...pathToActiveImage, "regions", regionIndex],
        action.region
      )
    }
    case "CHANGE_IMAGE": {
      if (!activeImage) return state
      const { delta } = action
      for (const key of Object.keys(delta)) {
        if (key === "cls") saveToHistory(state, "Change Image Class")
        if (key === "tags") saveToHistory(state, "Change Image Tags")
        state = setIn(state, [...pathToActiveImage, key], delta[key])
      }
      return state
    }
    case "SELECT_REGION": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const regions = [...(activeImage.regions || [])].map((r) => ({
        ...r,
        highlighted: r.id === region.id,
        editingLabels: r.id === region.id,
      }))
      return setIn(state, [...pathToActiveImage, "regions"], regions)
    }
    case "BEGIN_MOVE_POINT": {
      state = closeEditors(state)
      return setIn(state, ["mode"], {
        mode: "MOVE_REGION",
        regionId: action.point.id,
      })
    }
    case "BEGIN_BOX_TRANSFORM": {
      const { rectangle, directions } = action
      state = closeEditors(state)
      if (directions[0] === 0 && directions[1] === 0) {
        return setIn(state, ["mode"], { mode: "MOVE_REGION", regionId: rectangle.id })
      } else {
        return setIn(state, ["mode"], {
          mode: "RESIZE_BOX",
          regionId: rectangle.id,
          freedom: directions,
          original: { x: rectangle.x, y: rectangle.y, w: rectangle.w, h: rectangle.h },
        })
      }
    }
    case "BEGIN_MOVE_POLYGON_POINT": {
      const { polygon, pointIndex } = action
      state = closeEditors(state)
      if (
        state.mode &&
        state.mode.mode === "DRAW_POLYGON" &&
        pointIndex === 0
      ) {
        return setIn(
          modifyRegion(polygon, {
            points: polygon.points.slice(0, -1),
            open: false,
          }),
          ["mode"],
          null
        )
      } else {
        state = saveToHistory(state, "Move Polygon Point")
      }
      return setIn(state, ["mode"], {
        mode: "MOVE_POLYGON_POINT",
        regionId: polygon.id,
        pointIndex,
      })
    }
    case "ADD_POLYGON_POINT": {
      const { polygon, point, pointIndex } = action
      const regionIndex = getRegionIndex(polygon)
      if (regionIndex === null) return state
      const points = [...polygon.points]
      points.splice(pointIndex, 0, point)
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...polygon,
        points,
      })
    }
    case "BEGIN_MOVE_POLYGON1_POINT": {
      const { polygon1, point1Index } = action
      state = closeEditors(state)
      if (
          state.mode &&
          state.mode.mode === "DRAW_POLYGON1" &&
          point1Index === 0
      ) {
        return setIn(
            modifyRegion(polygon1, {
              points: polygon1.points.slice(0, -1),
              open: false,
            }),
            ["mode"],
            null
        )
      } else {
        state = saveToHistory(state, "Move Polygon Point")
      }
      return setIn(state, ["mode"], {
        mode: "MOVE_POLYGON_POINT",
        regionId: polygon1.id,
        point1Index,
      })
    }
    case "ADD_POLYGON1_POINT": {
      const { polygon1, point1, point1Index} = action
      const regionIndex = getRegionIndex(polygon1)
      if (regionIndex === null) return state
      const points = [...polygon1.points]
      const holes = [...polygon1.holes]
      const open=[...polygon1.open]
      let creatingHole=[...polygon1.creatingHole]

      points.splice(point1Index, 0, point1)
      if(!open){
        creatingHole=true
        holes.splice(point1Index-points.length, 0, point1);
      }

      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...polygon1,
        points,
        holes,
        creatingHole,
      })
    }
    case "MOUSE_MOVE": {
      const { x, y } = action

      if (!state.mode) return state
      if (!activeImage) return state
      const { mouseDownAt } = state
      switch (state.mode.mode) {
        case "MOVE_POLYGON_POINT": {
          const { pointIndex, regionId } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              pointIndex,
            ],
            [x, y]
          )
        }
        case "MOVE_POLYGON1_POINT": {
          const { pointIndex, regionId } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          return setIn(
              state,
              [
                ...pathToActiveImage,
                "regions",
                regionIndex,
                "points",
                "holes",
                pointIndex,
              ],
              [x, y]
          )
        }
        case "MOVE_REGION": {
          const { regionId } = state.mode
          if (regionId === "$$allowed_area") {
            const {
              allowedArea: { w, h },
            } = state
            return setIn(state, ["allowedArea"], {
              x: x - w / 2,
              y: y - h / 2,
              w,
              h,
            })
          }
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [...pathToActiveImage, "regions", regionIndex],
            moveRegion(activeImage.regions[regionIndex], x, y)
          )
        }
        case "RESIZE_BOX": {
          const {
            regionId,
            freedom: [xFree, yFree],
            original: { x: ox, y: oy, w: ow, h: oh },
          } = state.mode

          const dx = xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox
          const dw =
            xFree === 0
              ? ow
              : xFree === -1
              ? ow + (ox - dx)
              : Math.max(0, ow + (x - ox - ow))
          const dy = yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy
          const dh =
            yFree === 0
              ? oh
              : yFree === -1
              ? oh + (oy - dy)
              : Math.max(0, oh + (y - oy - oh))

          // determine if we should switch the freedom
          if (dw <= 0.001) {
            state = setIn(state, ["mode", "freedom"], [xFree * -1, yFree])
          }
          if (dh <= 0.001) {
            state = setIn(state, ["mode", "freedom"], [xFree, yFree * -1])
          }

          if (regionId === "$$allowed_area") {
            return setIn(state, ["allowedArea"], {
              x: dx,
              w: dw,
              y: dy,
              h: dh,
            })
          }

          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          const rectangle= activeImage.regions[regionIndex]

          return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
            ...rectangle,
            x: dx,
            w: dw,
            y: dy,
            h: dh,
          })
        }
        case "DRAW_POLYGON": {
          const { regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (!region) return setIn(state, ["mode"], null)
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              (region: any).points.length - 1,
            ],
            [x, y]
          )
        }
        case "DRAW_POLYGON1": {
          const { regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (!region) return setIn(state, ["mode"], null)
          return setIn(
              state,
              [
                ...pathToActiveImage,
                "regions",
                regionIndex,
                "points",
                "holes",
                "createHole",
                (region: any).points.length+(region: any).holes.length - 1,
              ],
              [x, y]
          )
        }
        case "RESIZE_CIRCLE": {
          const { regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (!region) return setIn(state, ["mode"], null)
          return setIn(
              state,
              ["images", currentImageIndex, "regions", regionIndex],
              {
                ...region,
                xr: Math.abs(region.x - x),
                yr: Math.abs(region.y - y)
              }
          )
        }
        default:
          return state
      }
    }
    case "MOUSE_DOWN": {
      if (!activeImage) return state
      const { x, y } = action

      state = setIn(state, ["mouseDownAt"], { x, y })

      if (state.mode) {
        switch (state.mode.mode) {
          case "DRAW_POLYGON": {
            const [polygon, regionIndex] = getRegion(state.mode.regionId)
            if (!polygon) break
            return setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex],
              { ...polygon, points: polygon.points.concat([[x, y]]) }
            )
          }
          case "DRAW_POLYGON1": {
            const [polygon1, region1Index] = getRegion(state.mode.regionId)
            if (!polygon1) break
            return setIn(
                state,
                [...pathToActiveImage, "regions", region1Index],
                { ...polygon1, points: polygon1.points.concat([[x, y]]),holes:polygon1.holes.concat([[x, y]]) }
            )
          }
          case "DRAW_CIRCLE": {
            const [circle, regionIndex] = getRegion(state.mode.regionId)
            if (!circle) break
            return setIn(
                state,
                [...pathToActiveImage, "regions", regionIndex],
                { ...circle}
            )
          }
          default:
            break
        }
      }

      let newRegion
      let defaultRegionCls = undefined,
        defaultRegionColor = "#ff0000"
      if (activeImage && (activeImage.regions || []).length > 0) {
        defaultRegionCls = activeImage.regions.slice(-1)[0].cls
        const clsIndex = (state.regionClsList || []).indexOf(defaultRegionCls)
        if (clsIndex !== -1) {
          defaultRegionColor = colors[clsIndex % colors.length]
        }
      }

      switch (state.selectedTool) {
        case "create-point": {
          state = saveToHistory(state, "Create Point")
          newRegion = {
            type: "point",
            x,
            y,
            highlighted: true,
            editingLabels: true,
            color: defaultRegionColor,
            id: getRandomId(),
            cls: defaultRegionCls,
          }
          break
        }
        case "create-rectangle": {
          state = saveToHistory(state, "Create Rectangle")
          newRegion = {
            type: "rectangle",
            x: x,
            y: y,
            w: 0,
            h: 0,
            highlighted: true,
            editingLabels: false,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "RESIZE_BOX",
            editLabelEditorAfter: true,
            regionId: newRegion.id,
            freedom: [1, 1],
            original: { x, y, w: newRegion.w, h: newRegion.h },
            isNew: true,
          })
          break
        }
        case "create-polygon": {
          if (state.mode && state.mode.mode === "DRAW_POLYGON") break
          state = saveToHistory(state, "Create Polygon")
          newRegion = {
            type: "polygon",
            points: [
              [x, y],
              [x, y],
            ],
            open: true,
            highlighted: true,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_POLYGON",
            regionId: newRegion.id,
          })
          break
        }
        case "create-polygon1": {
          if (state.mode && state.mode.mode === "DRAW_POLYGON1") break
          state = saveToHistory(state, "Create Polygon1")
          newRegion = {
            type: "polygon1",
            points: [
              [x, y],
              [x, y],
            ],
            holes:[[x, y],
              [x, y],],
            open: true,
            creatingHole:false,
            highlighted: true,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_POLYGON1",
            regionId: newRegion.id,
          })
          break
        }
        case "create-circle": {
          state = saveToHistory(state, "Create Circle")
          newRegion = {
            type: "circle",
            x: x,
            y: y,
            xr: 0.1,
            yr: 0.1,
            highlighted: true,
            editingLabels: false,
            color: defaultRegionColor,
            id: getRandomId()
          }
          // state = unselectRegions(state)
          state = setIn(state, ["mode"], {
            mode: "RESIZE_CIRCLE",
            editLabelEditorAfter: true,
            regionId: newRegion.id,
            original: { x: x, y: y, xr: newRegion.xr, yr: newRegion.yr }
          })
          break
        }
        default:
          break
      }

      const regions = [...(getIn(state, pathToActiveImage).regions || [])]
        .map((r) =>
          setIn(r, ["editingLabels"], false).setIn(["highlighted"], false)
        )
        .concat(newRegion ? [newRegion] : [])

      return setIn(state, [...pathToActiveImage, "regions"], regions)
    }
    case "MOUSE_UP": {
      const { x, y } = action

      const { mouseDownAt = { x, y } } = state
      if (!state.mode) return state
      state = setIn(state, ["mouseDownAt"], null)
      switch (state.mode.mode) {
        case "RESIZE_BOX": {
          if (state.mode.isNew) {
            if (
              Math.abs(state.mode.original.x - x) < 0.002 ||
              Math.abs(state.mode.original.y - y) < 0.002
            ) {
              return setIn(
                modifyRegion(state.mode.regionId, null),
                ["mode"],
                null
              )
            }
          }
          if (state.mode.editLabelEditorAfter) {
            return {
              ...modifyRegion(state.mode.regionId, { editingLabels: true }),
              mode: null,
            }
          }
        }
        case "MOVE_REGION":
        case "RESIZE_CIRCLE": {
          if (state.mode.editLabelEditorAfter) {
            return {
              ...modifyRegion(state.mode.regionId, { editingLabels: true }),
              mode: null
            }
          }
        }
        case "MOVE_POLYGON_POINT": {
          return { ...state, mode: null }
        }
        case "MOVE_POLYGON1_POINT": {
          return { ...state, mode: null }
        }
        default:
          return state
      }
    }
    case "OPEN_REGION_EDITOR": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const newRegions = setIn(
        activeImage.regions.map((r) => ({
          ...r,
          highlighted: false,
          editingLabels: false,
        })),
        [regionIndex],
        {
          ...(activeImage.regions || [])[regionIndex],
          highlighted: true,
          editingLabels: true,
        }
      )
      return setIn(state, [...pathToActiveImage, "regions"], newRegions)
    }
    case "CLOSE_REGION_EDITOR": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...(activeImage.regions || [])[regionIndex],
        editingLabels: false,
      })
    }
    case "DELETE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (activeImage.regions || []).filter((r) => r.id !== action.region.id)
      )
    }
    case "DELETE_SELECTED_REGION": {
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (activeImage.regions || []).filter((r) => !r.highlighted)
      )
    }
    case "HEADER_BUTTON_CLICKED": {
      const buttonName = action.buttonName.toLowerCase()
      switch (buttonName) {
        case "prev": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === 0) return state
          return setNewImage(
            state.images[currentImageIndex - 1],
            currentImageIndex - 1
          )
        }
        case "next": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setNewImage(
            state.images[currentImageIndex + 1],
            currentImageIndex + 1
          )
        }
        case "clone": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setIn(
            setNewImage(
              state.images[currentImageIndex + 1],
              currentImageIndex + 1
            ),
            ["images", currentImageIndex + 1, "regions"],
            activeImage.regions
          )
        }
        case "hotkeys": {
          return state
        }
        case "exit":
        case "done": {
          return state
        }
        default:
          return state
      }
    }
    case "SELECT_TOOL": {

      state = setIn(state, ["mode"], null)
      return setIn(state, ["selectedTool"], action.selectedTool)
    }
    case "BEGIN_CIRCLE_TRANSFORM": {
      const { circle, directions } = action
      state = closeEditors(state)
      if (directions === "MOVE_REGION") {
        return setIn(state, ["mode"], {
          mode: "MOVE_REGION",
          regionId: circle.id
        })
      } else {
        return setIn(state, ["mode"], {
          mode: "RESIZE_CIRCLE",
          regionId: circle.id,
          original: { x: circle.x, y: circle.y, rx: circle.rx, ry: circle.ry }
        })
      }
    }
    case "CANCEL": {
      const { mode } = state
      if (mode) {
        switch (mode.mode) {
          case "DRAW_POLYGON": {
            const { regionId } = mode
            return modifyRegion(regionId, null)
          }
          case "DRAW_POLYGON1": {
            const { regionId } = mode
            return modifyRegion(regionId, null)
          }
          case "MOVE_POLYGON_POINT":
          case "MOVE_POLYGON1_POINT":
          case "RESIZE_BOX":
          case "RESIZE_CIRCLE":
          case "MOVE_REGION": {
            return setIn(state, ["mode"], null)
          }
          default:
            return state
        }
      }
      // Close any open boxes
      const regions: any = activeImage.regions
      if (regions && regions.some((r) => r.editingLabels)) {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            editingLabels: false,
          }))
        )
      } else if (regions) {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            highlighted: false,
          }))
        )
      }
      break
    }


    default:
      break
  }
  return state
}
