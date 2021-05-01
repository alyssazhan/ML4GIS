import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react"
import { Matrix } from "transformation-matrix-js"
import type {
  Region,
  Point,
  Polygon,
  Rectangle,
} from "./regionTools.js"
import { makeStyles } from "@material-ui/core/styles"
import styles from "./styles"
import useMouse from "./useMouse"
import useProjectRegionBox from "./useProjectBox"
import { useRafState } from "react-use"
import RegionTags from "../RegionTags"
import RegionSelectAndTransformBoxes from "../TransformBoxes"
import ImageCanvasBackground from "./background"
import useEventCallback from "use-event-callback"
import RegionShapes from "../RegionShapes"

const useStyles = makeStyles(styles)

type Props = {
  regions: Array<Region>,
  imageSrc?: string,
  onMouseMove?: ({ x: number, y: number }) => any,
  onMouseDown?: ({ x: number, y: number }) => any,
  onMouseUp?: ({ x: number, y: number }) => any,
  dragWithPrimary?: boolean,
  zoomWithPrimary?: boolean,
  createWithPrimary?: boolean,
  realSize?: { width: number, height: number, unitName: string },
  regionTagList?: Array<string>,
  allowedArea?: { x: number, y: number, w: number, h: number },
  allowComments?: Boolean,
  onChangeRegion: (Region) => any,
  onBeginRegionEdit: (Region) => any,
  onCloseRegionEdit: (Region) => any,
  onDeleteRegion: (Region) => any,
  onBeginBoxTransform: (Rectangle, [number, number]) => any,
  onBeginMovePolygonPoint: (Polygon, index: number) => any,
  onAddPolygonPoint: (Polygon, point: [number, number], index: number) => any,
  onSelectRegion: (Region) => any,
  onBeginMovePoint: (Point) => any,
  onLoaded: ({
    naturalWidth: number,
    naturalHeight: number,
  }) => any,
  onRegionClassAdded: () => {},
}
const getDefaultMat = (allowedArea = null, { iw, ih } = {}) => {
  let mat = Matrix.from(1, 0, 0, 1, -10, -10)
  if (allowedArea && iw) {
    mat = mat
      .translate(allowedArea.x * iw, allowedArea.y * ih)
      .scaleU(allowedArea.w + 0.05)
  }
  return mat
}

export const ImageCanvas = ({
  regions,
  imageSrc,
  onMouseMove = (p) => null,
  onMouseDown = (p) => null,
  onMouseUp = (p) => null,
  dragWithPrimary = false,
  zoomWithPrimary = false,
  createWithPrimary = false,
  regionTagList,
  allowedArea,
  onLoaded,
  onChangeRegion,
  onBeginRegionEdit,
  onCloseRegionEdit,
  onBeginBoxTransform,
  onBeginMovePolygonPoint,
  onAddPolygonPoint,
  onBeginMoveKeypoint,
  onSelectRegion,
  onBeginMovePoint,
  onDeleteRegion,
  onRegionClassAdded,
  zoomOnAllowedArea = true,
  allowComments,
}: Props) => {
  const classes = useStyles()

  const canvasEl = useRef(null)
  const layoutParams = useRef({})
  const [dragging, changeDragging] = useRafState(false)
  const [zoomStart, changeZoomStart] = useRafState(null)
  const [zoomEnd, changeZoomEnd] = useRafState(null)
  const [mat, changeMat] = useRafState(getDefaultMat())

  const { mouseEvents, mousePosition } = useMouse({
    canvasEl,
    dragging,
    mat,
    layoutParams,
    changeMat,
    zoomStart,
    zoomEnd,
    changeZoomStart,
    changeZoomEnd,
    changeDragging,
    zoomWithPrimary,
    dragWithPrimary,
    onMouseMove,
    onMouseDown,
    onMouseUp,
  })



  const projectRegionBox = useProjectRegionBox({ layoutParams, mat })

  const [imageDimensions, changeImageDimensions] = useState()
  const imageLoaded = Boolean(imageDimensions && imageDimensions.naturalWidth)

  const ImageLoaded = useEventCallback(
    ({ naturalWidth, naturalHeight}) => {
      const dims = { naturalWidth, naturalHeight}
      if (onLoaded) onLoaded(dims)
      changeImageDimensions(dims)

    }
  )
  const canvas = canvasEl.current
  if (canvas && imageLoaded) {
    const { clientWidth, clientHeight } = canvas

    const fitScale = Math.max(
      imageDimensions.naturalWidth / (clientWidth - 20),
      imageDimensions.naturalHeight / (clientHeight - 20)
    )

    const [iw, ih] = [
      imageDimensions.naturalWidth / fitScale,
      imageDimensions.naturalHeight / fitScale,
    ]

    layoutParams.current = {
      iw,
      ih,
      fitScale,
      canvasWidth: clientWidth,
      canvasHeight: clientHeight,
    }
  }

  useEffect(() => {
    if (!imageLoaded) return
    changeMat(
      getDefaultMat(
        zoomOnAllowedArea ? allowedArea : null,
        layoutParams.current
      )
    )
  }, [imageLoaded])

  useLayoutEffect(() => {
    if (!imageDimensions) return
    const { clientWidth, clientHeight } = canvas
    canvas.width = clientWidth
    canvas.height = clientHeight
    const context = canvas.getContext("2d")

    context.save()
    context.transform(...mat.clone().inverse().toArray())

    const { iw, ih } = layoutParams.current

    if (allowedArea) {
      // Pattern to indicate the NOT allowed areas
      const { x, y, w, h } = allowedArea
      context.save()
      context.globalAlpha = 1
      const outer = [
        [0, 0],
        [iw, 0],
        [iw, ih],
        [0, ih],
      ]
      const inner = [
        [x * iw, y * ih],
        [x * iw + w * iw, y * ih],
        [x * iw + w * iw, y * ih + h * ih],
        [x * iw, y * ih + h * ih],
      ]
      context.moveTo(...outer[0])
      outer.forEach((p) => context.lineTo(...p))
      context.lineTo(...outer[0])
      context.closePath()

      inner.reverse()
      context.moveTo(...inner[0])
      inner.forEach((p) => context.lineTo(...p))
      context.lineTo(...inner[0])

      context.fill()

      context.restore()
    }

    context.restore()
  })

  const { iw, ih } = layoutParams.current

  let zoomBox =
    !zoomStart || !zoomEnd
      ? null
      : {
          ...mat.clone().inverse().applyToPoint(zoomStart.x, zoomStart.y),
          w: (zoomEnd.x - zoomStart.x) / mat.a,
          h: (zoomEnd.y - zoomStart.y) / mat.d,
        }
  if (zoomBox) {
    if (zoomBox.w < 0) {
      zoomBox.x += zoomBox.w
      zoomBox.w *= -1
    }
    if (zoomBox.h < 0) {
      zoomBox.y += zoomBox.h
      zoomBox.h *= -1
    }
  }

  const imagePosition = {
    topLeft: mat.clone().inverse().applyToPoint(0, 0),
    bottomRight: mat.clone().inverse().applyToPoint(iw, ih),
  }


  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "calc(100vh - 68px)",
        position: "relative",
        overflow: "hidden",
        cursor: createWithPrimary
          ? "crosshair"
          : dragging
          ? "grabbing"
          : dragWithPrimary
          ? "grab"
          : zoomWithPrimary
          ? mat.a < 1
            ? "zoom-out"
            : "zoom-in"
          : undefined,
      }}
    >
      {imageLoaded && !dragging && (
        <RegionSelectAndTransformBoxes
          key="regionSelectAndTransformBoxes"
          regions={
             !allowedArea
              ? regions
              : [
                  {
                    type: "rectangle",
                    id: "$$allowed_area",
                    cls: "allowed_area",
                    highlighted: true,
                    x: allowedArea.x,
                    y: allowedArea.y,
                    w: allowedArea.w,
                    h: allowedArea.h,
                    visible: true,
                    color: "#ff0",
                  },
                ]
          }
          mouseEvents={mouseEvents}
          projectRegionBox={projectRegionBox}
          dragWithPrimary={dragWithPrimary}
          createWithPrimary={createWithPrimary}
          zoomWithPrimary={zoomWithPrimary}
          onBeginMovePoint={onBeginMovePoint}
          onSelectRegion={onSelectRegion}
          layoutParams={layoutParams}
          mat={mat}
          onBeginBoxTransform={onBeginBoxTransform}
          onBeginMovePolygonPoint={onBeginMovePolygonPoint}
          onBeginMoveKeypoint={onBeginMoveKeypoint}
          onAddPolygonPoint={onAddPolygonPoint}
        />
      )}
      {imageLoaded  && !dragging && (
        <div key="regionTags">
          <RegionTags
            regions={regions}
            projectRegionBox={projectRegionBox}
            mouseEvents={mouseEvents}
            regionTagList={regionTagList}
            onBeginRegionEdit={onBeginRegionEdit}
            onChangeRegion={onChangeRegion}
            onCloseRegionEdit={onCloseRegionEdit}
            onDeleteRegion={onDeleteRegion}
            layoutParams={layoutParams}
            imageSrc={imageSrc}
            onRegionClassAdded={onRegionClassAdded}
            allowComments={allowComments}
          />
       </div>
      )}

      {zoomWithPrimary && zoomBox !== null && (
        <div
          key="zoomBox"
          style={{
            position: "absolute",
            zIndex: 1,
            border: "1px solid #fff",
            pointerEvents: "none",
            left: zoomBox.x,
            top: zoomBox.y,
            width: zoomBox.w,
            height: zoomBox.h,
          }}
        />
      )}

      <div
        style={{ width: "100%", height: "100%" }}
        {...mouseEvents}
      >

        <>
          <canvas
            style={{ opacity: 0.25 }}
            className={classes.canvas}
            ref={canvasEl}
          />
          <RegionShapes
            imagePosition={imagePosition}
            regions={regions}
          />
          <ImageCanvasBackground
            imagePosition={imagePosition}
            mouseEvents={mouseEvents}
            onLoad={ImageLoaded}
            imageSrc={imageSrc}
          />
        </>
      </div>
      <div className={classes.zoomIndicator}>
        {((1 / mat.a) * 100).toFixed(0)}%
      </div>
    </div>
  )
}

export default ImageCanvas
