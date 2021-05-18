import React, { Fragment, memo } from "react"
import { styled } from "@material-ui/core/styles"

const TransformMyStyles = styled("div")({
  width: 8,
  height: 8,
  zIndex: 2,
  border: "2px solid #FFF",
  position: "absolute",
})

const boxCursorMap = [
  ["nw-resize", "n-resize", "ne-resize"],
  ["w-resize", "grab", "e-resize"],
  ["sw-resize", "s-resize", "se-resize"],
]

const arePropsEqual = (prev, next) => {
  return (
    prev.region === next.region &&
    prev.dragWithPrimary === next.dragWithPrimary &&
    prev.createWithPrimary === next.createWithPrimary &&
    prev.zoomWithPrimary === next.zoomWithPrimary &&
    prev.mat === next.mat
  )
}

export const RegionSelectAndTransformBox = memo(
  ({
    region: r,
    mouseEvents,
    projectRegionBox,
    dragWithPrimary,
    createWithPrimary,
    zoomWithPrimary,
    onBeginMovePoint,
    onSelectRegion,
    layoutParams,
    mat,
    onBeginBoxTransform,
    onBeginMovePolygonPoint,
       onBeginMovePolygon1Point,
    onBeginMoveKeypoint,
    onAddPolygonPoint,
       onAddPolygon1Point,
       onBeginCircleTransform
  }) => {
    const pbox = projectRegionBox(r)
    const { iw, ih } = layoutParams.current
    return (
      <Fragment>
        <div>
          {r.type === "rectangle" &&
            !dragWithPrimary &&
            !zoomWithPrimary &&
            !r.locked &&
            r.highlighted &&
            mat.a < 1.2 &&
            [
              [0, 0],
              [0.5, 0],
              [1, 0],
              [1, 0.5],
              [1, 1],
              [0.5, 1],
              [0, 1],
              [0, 0.5],
              [0.5, 0.5],
            ].map(([px, py], i) => (
              <TransformMyStyles
                key={i}
                {...mouseEvents}
                onMouseDown={(e) => {
                  if (e.button === 0)
                    return onBeginBoxTransform(r, [px * 2 - 1, py * 2 - 1])
                  mouseEvents.onMouseDown(e)
                }}
                style={{
                  left: pbox.x - 4 - 2 + pbox.w * px,
                  top: pbox.y - 4 - 2 + pbox.h * py,
                  cursor: boxCursorMap[py * 2][px * 2],
                  borderRadius: px === 0.5 && py === 0.5 ? 4 : undefined,
                }}
              />
            ))}
            {
                r.type === "circle" &&
                !dragWithPrimary &&
                !zoomWithPrimary &&
                !r.locked &&
                r.highlighted &&
                [
                    [r.x, r.y],
                    [(r.x*iw + Math.sqrt(Math.pow((r.xr-r.x)*iw,2) + Math.pow((r.yr-r.y)*ih,2)))/iw, r.y],
                    [r.x, (r.y*ih + Math.sqrt(Math.pow((r.xr-r.x)*iw,2) + Math.pow((r.yr-r.y)*ih,2)))/ih],
                    [(r.x*iw - Math.sqrt(Math.pow((r.xr-r.x)*iw,2) + Math.pow((r.yr-r.y)*ih,2)))/iw, r.y],
                    [r.x, (r.y*ih - Math.sqrt(Math.pow((r.xr-r.x)*iw,2) + Math.pow((r.yr-r.y)*ih,2)))/ih]
                ].map(([px, py], i) => {
                    const proj = mat
                        .clone()
                        .inverse()
                        .applyToPoint(px * iw, py * ih)
                    return(
                        <div
                            key={i}
                            // className={classes.transformGrabber}
                            {...mouseEvents}
                            onMouseDown={e => {
                                if (e.button === 0 && i==0){
                                    return onBeginCircleTransform(r, "MOVE_REGION")
                                }else if(e.button === 0 && i!=0){
                                    return onBeginCircleTransform(r, "RESIZE_CIRCLE")
                                }
                                mouseEvents.onMouseDown(e)
                            }}
                            style={{
                                left: proj.x - 4,
                                top: proj.y - 4,
                                borderRadius: px === r.x && py === r.y ? 4 : undefined
                            }}
                        />
                    )
                })
            }
          {r.type === "polygon" &&
            !dragWithPrimary &&
            !zoomWithPrimary &&
            !r.locked &&
            r.highlighted &&
            r.points.map(([px, py], i) => {
              const proj = mat
                .clone()
                .inverse()
                .applyToPoint(px * iw, py * ih)
              return (
                <TransformMyStyles
                  key={i}
                  {...mouseEvents}
                  onMouseDown={(e) => {
                    if (e.button === 0 && (!r.open || i === 0))
                      return onBeginMovePolygonPoint(r, i)
                    mouseEvents.onMouseDown(e)
                  }}
                  style={{
                    cursor: !r.open ? "move" : i === 0 ? "pointer" : undefined,
                    zIndex: 10,
                    pointerEvents:
                      r.open && i === r.points.length - 1 ? "none" : undefined,
                    left: proj.x - 4,
                    top: proj.y - 4,
                  }}
                />
              )
            })}
            {r.type === "polygon1" &&
            !dragWithPrimary &&
            !zoomWithPrimary &&
            !r.locked &&
            r.highlighted &&
            r.points.map(([px, py], i) => {
                const proj = mat
                    .clone()
                    .inverse()
                    .applyToPoint(px * iw, py * ih)
                return (
                    <TransformMyStyles
                        key={i}
                        {...mouseEvents}
                        onMouseDown={(e) => {
                            if (e.button === 0 && (!r.open || i === 0))
                                return onBeginMovePolygon1Point(r, i)
                            mouseEvents.onMouseDown(e)
                        }}
                        style={{
                            cursor: !r.open ? "move" : i === 0 ? "pointer" : undefined,
                            zIndex: 10,
                            pointerEvents:
                                r.open && i === r.points.length - 1 ? "none" : undefined,
                            left: proj.x - 4,
                            top: proj.y - 4,
                        }}
                    />
                )
            })}
          {r.type === "polygon" &&
            r.highlighted &&
            !dragWithPrimary &&
            !zoomWithPrimary &&
            !r.locked &&
            !r.open &&
            r.points.length > 1 &&
            r.points
              .map((p1, i) => [p1, r.points[(i + 1) % r.points.length]])
              .map(([p1, p2]) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2])
              .map((pa, i) => {
                const proj = mat
                  .clone()
                  .inverse()
                  .applyToPoint(pa[0] * iw, pa[1] * ih)
                return (
                  <TransformMyStyles
                    key={i}
                    {...mouseEvents}
                    onMouseDown={(e) => {
                      if (e.button === 0) return onAddPolygonPoint(r, pa, i + 1)
                      mouseEvents.onMouseDown(e)
                    }}
                    style={{
                      cursor: "copy",
                      zIndex: 10,
                      left: proj.x - 4,
                      top: proj.y - 4,
                      border: "2px dotted #fff",
                      opacity: 0.5,
                    }}
                  />
                )
              })}
            {r.type === "polygon1" &&
            r.highlighted &&
            !dragWithPrimary &&
            !zoomWithPrimary &&
            !r.locked &&
            !r.open &&
            r.points.length > 1 &&
            r.points
                .map((p1, i) => [p1, r.points[(i + 1) % r.points.length]])
                .map(([p1, p2]) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2])
                .map((pa, i) => {
                    const proj = mat
                        .clone()
                        .inverse()
                        .applyToPoint(pa[0] * iw, pa[1] * ih)
                    return (
                        <TransformMyStyles
                            key={i}
                            {...mouseEvents}
                            onMouseDown={(e) => {
                                if (e.button === 0) return onAddPolygon1Point(r, pa, i + 1)
                                mouseEvents.onMouseDown(e)
                            }}
                            style={{
                                cursor: "copy",
                                zIndex: 10,
                                left: proj.x - 4,
                                top: proj.y - 4,
                                border: "2px dotted #fff",
                                opacity: 0.5,
                            }}
                        />
                    )
                })}
        </div>
      </Fragment>
    )
  },
  arePropsEqual
)

export const RegionSelectAndTransformBoxes = memo(
  (props) => {
    return props.regions
      .filter((r) => r.visible || r.visible === undefined)
      .filter((r) => !r.locked)
      .map((r, i) => {
        return <RegionSelectAndTransformBox key={r.id} {...props} region={r} />
      })
  },
  (n, p) => n.regions === p.regions && n.mat === p.mat
)

export default RegionSelectAndTransformBoxes
