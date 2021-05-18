import React, { useMemo } from "react"
import { HotKeys } from "react-hotkeys"

export const defaultHotkeys = [
  {
    id: "zoom_tool",
    description: "Select the Zoom Tool",
  },
  {
    id: "create_point",
    description: "Create a point",
  },
  {
    id: "create_rectangle",
    description: "Create a rectangle",
  },
  {
    id: "pan_tool",
    description: "Select the Pan Tool",
  },
  {
    id: "create_polygon",
    description: "Create a Polygon",
  },
  {
    id: "create_polygon1",
    description: "Create a Polygon with Holes",
  },
  {
    id: "create_circle",
    description: "Create a Circle",
  },
  {
    id: "save_and_previous_sample",
    description: "Save and go to previous sample",
  },
  {
    id: "save_and_next_sample",
    description: "Save and go to next sample",
  },
  {
    id: "save_and_exit_sample",
    description: "Save and exit current sample",
  },
  {
    id: "exit_sample",
    description: "Exit sample without saving",
  },
  {
    id: "delete_region",
    description: "Delete selected region",
  },
  {
    id: "undo",
    description: "Undo latest change",
  },
]
export const defaultKeyMap = {}
for (const { id, binding } of defaultHotkeys) defaultKeyMap[id] = binding

export const useDispatchHotkeyHandlers = ({ dispatch }) => {
  const handlers = useMemo(
    () => ({

      zoom_tool: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "zoom",
        })
      },
      create_point: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-point",
        })
      },
      create_rectangle: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-rectangle",
        })
      },
      pan_tool: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "pan",
        })
      },
      create_polygon: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-polygon",
        })
      },
      create_polygon1: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-polygon1",
        })
      },
      create_circle: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-circle",
        })
      },

      save_and_previous_sample: () => {
        dispatch({
          type: "HEADER_BUTTON_CLICKED",
          buttonName: "Prev",
        })
      },
      save_and_next_sample: () => {
        dispatch({
          type: "HEADER_BUTTON_CLICKED",
          buttonName: "Next",
        })
      },
      save_and_exit_sample: () => {
        dispatch({
          type: "HEADER_BUTTON_CLICKED",
          buttonName: "Save",
        })
      },
      delete_region: () => {
        dispatch({
          type: "DELETE_SELECTED_REGION",
        })
      },
      undo: () => {
        dispatch({
          type: "RESTORE_HISTORY",
        })
      },
    }),
    [dispatch]
  )
  return handlers
}

export default ({ children, dispatch }) => {
  const handlers = useDispatchHotkeyHandlers({ dispatch })
  return (
    <HotKeys allowChanges handlers={handlers}>
      {children}
    </HotKeys>
  )
}
