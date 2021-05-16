
import React, { useRef, useCallback } from "react"
import { makeStyles, styled } from "@material-ui/core/styles"
import ImageCanvas from "../ImageCanvas/main_ImageCanvas"
import styles from "./styles_MainLayout"
import type, { MainLayoutState, Action } from "./types"
import useKey from "use-key-hook"
import classnames from "classnames"
import getActiveImage from "../reducers/getActiveImage"
import { useDispatchHotkeyHandlers } from "../ShortcutsManager/main_ShortcutsManager"
import { withHotKeys } from "react-hotkeys"
import iconDictionary from "./iconDictionary"
import Workspace from "react-material-workspace-layout/Workspace"
import useEventCallback from "use-event-callback"
// get style from style.js

const myStyle = makeStyles(styles)

const HotkeyDiv = withHotKeys(({ hotKeys, children, divRef, ...props }) => (
  <div {...{ ...hotKeys, ...props }} ref={divRef}>
    {children}
  </div>
))

type Props = {
  state: MainLayoutState,
  dispatchAction: (Action) => any,
  onRegionClassAdded: () => {},
}

export const MainLayout = ({
  state,
  dispatchAction,
}: Props) => {
  const classes = myStyle()

  const memoizedActionFns = useRef({})
  const action = (type: string, ...params: Array<string>) => {
    const fnKey = `${type}(${params.join(",")})`
    if (memoizedActionFns.current[fnKey])
      return memoizedActionFns.current[fnKey]

    const fn = (...args: any) =>
      params.length > 0
        ? dispatchAction(
            ({
              type,
              ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
            }: any)
          )
        : dispatchAction({ type, ...args[0] })
    memoizedActionFns.current[fnKey] = fn
    return fn
  }

  const { currentImageIndex, activeImage } = getActiveImage(state)
  let nextImage
  if (currentImageIndex !== null) {
    nextImage = state.images[currentImageIndex + 1]
  }

  useKey(() => dispatchAction({ type: "CANCEL" }), {
    detectKeys: [27],
  })

  const innerContainerRef = useRef()
  const hotkeyHandlers = useDispatchHotkeyHandlers({ dispatchAction })
  const refocusOnMouseEvent = useCallback((e) => {
    if (!innerContainerRef.current) return
    if (innerContainerRef.current.contains(document.activeElement)) return
    if (innerContainerRef.current.contains(e.target)) {
      innerContainerRef.current.focus()
      e.target.focus()
    }
  }, [])

  const canvas = (
    <ImageCanvas
      key={state.selectedImage}
      showTags={state.showTags}
      regionTagList={state.regionTagList}
      regions={
        activeImage.regions || []
      }
      realSize={activeImage ? activeImage.realSize : undefined}
      imageSrc={state.annotationType === "image" ? activeImage.src : null}
      pointDistancePrecision={state.pointDistancePrecision}
      createWithPrimary={state.selectedTool.includes("create")}
      dragWithPrimary={state.selectedTool === "pan"}
      zoomWithPrimary={state.selectedTool === "zoom"}
      onMouseMove={action("MOUSE_MOVE")}
      onMouseDown={action("MOUSE_DOWN")}
      onMouseUp={action("MOUSE_UP")}
      onChangeRegion={action("CHANGE_REGION", "region")}
      onBeginRegionEdit={action("OPEN_REGION_EDITOR", "region")}
      onCloseRegionEdit={action("CLOSE_REGION_EDITOR", "region")}
      onDeleteRegion={action("DELETE_REGION", "region")}
      onBeginBoxTransform={action("BEGIN_BOX_TRANSFORM", "rectangle", "directions")}
      onBeginMovePolygonPoint={action(
        "BEGIN_MOVE_POLYGON_POINT",
        "polygon",
        "pointIndex"
      )}
      onAddPolygonPoint={action(
        "ADD_POLYGON_POINT",
        "polygon",
        "point",
        "pointIndex"
      )}
      onBeginMovePolygon1Point={action(
          "BEGIN_MOVE_POLYGON1_POINT",
          "polygon1",
          "point1Index"
      )}
      onAddPolygon1Point={action(
          "ADD_POLYGON1_POINT",
          "polygon1",
          "point1",
          "point1Index"
      )}
      onSelectRegion={action("SELECT_REGION", "region")}
      onBeginMovePoint={action("BEGIN_MOVE_POINT", "point")}
      onImageLoaded={action("IMAGE_LOADED", "image")}
      allowComments={state.allowComments}
    />
  )

  const onClickIconSidebarItem = useEventCallback((item) => {
    dispatchAction({ type: "SELECT_TOOL", selectedTool: item.name })
  })

  const onClickHeaderItem = useEventCallback((item) => {
    dispatchAction({ type: "HEADER_BUTTON_CLICKED", buttonName: item.name })
  })
  return (
        <HotkeyDiv
          tabIndex={-1}
          divRef={innerContainerRef}
          onMouseDown={refocusOnMouseEvent}
          onMouseOver={refocusOnMouseEvent}
          allowChanges
          handlers={hotkeyHandlers}
          className={classnames(
            classes.container,

          )}
        >
          <Workspace
            iconDictionary={iconDictionary}
            headerLeftSide={[
               activeImage ? (
                <div className={classes.headerTitle}>{activeImage.name}</div>
              ) : null,
            ].filter(Boolean)}
            headerItems={[
              { name: "Prev" },
              { name: "Next" },
              { name: "Save" },
            ].filter(Boolean)}
            onClickHeaderItem={onClickHeaderItem}
            onClickIconSidebarItem={onClickIconSidebarItem}
            selectedTools={[
              state.selectedTool,
            ].filter(Boolean)}
            iconSidebarItems={[
              {
                name: "pan",
                helperText:
                  "Drag/Pan (right or middle click)",
                alwaysShowing: true,
              },
              {
                name: "zoom",
                helperText:
                  "Zoom In/Out",
                alwaysShowing: true,
              },
              {
                name: "create-point",
                helperText: "Add Point" ,
              },
              {
                name: "create-rectangle",
                helperText:
                  "Add Rectangle" ,
              },
              {
                name: "create-polygon",
                helperText: "Add Polygon",
              },
              {
                name: "create-polygon1",
                helperText: "Add Polygon1",
              },

            ]
              .filter(Boolean)
              .filter(
                (a) => a.alwaysShowing || state.enabledTools.includes(a.name)
              )}

          >
            {canvas}
          </Workspace>
        </HotkeyDiv>
  )
}

export default MainLayout
