
import React, { memo } from "react"
import colorAlpha from "color-alpha"

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

const RegionComponents = {
  point: memo(({ region, iw, ih }) => (
    <g transform={`translate(${region.x * iw} ${region.y * ih})`}>
      <path
        d={"M0 8L8 0L0 -8L-8 0Z"}
        strokeWidth={2}
        stroke={region.color}
        fill="transparent"
      />
    </g>
  )),
    rectangle: memo(({ region, iw, ih }) => (
    <g transform={`translate(${region.x * iw} ${region.y * ih})`}>
      <rect
        strokeWidth={2}
        x={0}
        y={0}
        width={Math.max(region.w * iw, 0)}
        height={Math.max(region.h * ih, 0)}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    </g>
  )),
  polygon: memo(({ region, iw, ih, fullSegmentationMode }) => {
    const Component = region.open ? "polyline" : "polygon"
    return (
      <Component
        points={region.points
          .map(([x, y]) => [x * iw, y * ih])
          .map((a) => a.join(" "))
          .join(" ")}
        strokeWidth={2}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    )
  }),
    polygon1: memo(({ region, iw, ih, fullSegmentationMode }) => {
        const Component = region.open ? "polyline" : "polygon"
        return (
            <Component
                points={region.points
                    .map(([x, y]) => [x * iw, y * ih])
                    .map((a) => a.join(" "))
                    .join(" ")}
                strokeWidth={2}
                stroke={colorAlpha(region.color, 0.75)}
                fill={colorAlpha(region.color, 0.25)}
            />
        )
    }),
  pixel: () => null,
}


export const WrappedRegionList = memo(
  ({ regions, keypointDefinitions, iw, ih, fullSegmentationMode }) => {
    return regions
      .filter((r) => r.visible !== false)
      .map((r) => {
        const Component = RegionComponents[r.type]
        return (
          <Component
            key={r.regionId}
            region={r}
            iw={iw}
            ih={ih}
          />
        )
      })
  },
  (n, p) => n.regions === p.regions && n.iw === p.iw && n.ih === p.ih
)

export const RegionShapes = ({
  mat,
  imagePosition,
  regions = [],
}) => {
  const iw = imagePosition.bottomRight.x - imagePosition.topLeft.x
  const ih = imagePosition.bottomRight.y - imagePosition.topLeft.y
  if (isNaN(iw) || isNaN(ih)) return null
  return (
    <svg
      width={iw}
      height={ih}
      style={{
        position: "absolute",
        zIndex: 2,
        left: imagePosition.topLeft.x,
        top: imagePosition.topLeft.y,
        pointerEvents: "none",
        width: iw,
        height: ih,
      }}
    >
      <WrappedRegionList
        key="wrapped-region-list"
        regions={regions}
        iw={iw}
        ih={ih}
      />
    </svg>
  )
}

export default RegionShapes
