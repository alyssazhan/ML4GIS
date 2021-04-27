
import React, { useReducer, useEffect } from "react"
import MainLayout from "./MainLayout"
import type {
  Image,
  MainLayoutState,
  Action,
} from "./MainLayout/types"

import combineReducers from "./reducers/combineReducers.js"
import generalReducer from "./reducers/generalReducer.js"
import imageReducer from "./reducers/imageReducer.js"
import historyHandler from "./reducers/historyHandler.js"
import useEventCallback from "use-event-callback"
import makeImmutable, { without } from "seamless-immutable"

type Props = {
  regionTagList?: Array<string>,
  enabledTools?: Array<string>,
  selectedTool?: String,
  selectedImage?: string | number,
  images?: Array<Image>,
  onExit: (MainLayoutState) => any,
}

export const Annotator = ({
  images,
  selectedImage = images && images.length > 0 ? 0 : undefined,
  enabledTools = [
    "select",
    "create-point",
    "create-rectangle",
    "create-polygon",
  ],
  selectedTool = "select",
  regionTagList = [],
  onExit,
  onNextImage,
  onPrevImage,
  allowComments,
}: Props) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = "image"
  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        imageReducer ,
        generalReducer
      )
    ),
    makeImmutable({
      annotationType,
      selectedTool,
      mode: null,
      regionTagList,
      enabledTools,
      history: [],
      allowComments,
      ...({
            selectedImage,
            images,
          }),
    })
  )

  const dispatch = useEventCallback((action: Action) => {
    if (action.type === "HEADER_BUTTON_CLICKED") {
      if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
        return onExit(without(state, "history"))
      } else if (action.buttonName === "Next" && onNextImage) {
        return onNextImage(without(state, "history"))
      } else if (action.buttonName === "Prev" && onPrevImage) {
        return onPrevImage(without(state, "history"))
      }
    }
    dispatchToReducer(action)
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  useEffect(() => {
    if (selectedImage === undefined) return
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage],
    })
  }, [selectedImage])

  if (!images )
    return 'Missing required prop "images" '

  return (

      <MainLayout
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        dispatch={dispatch}
        onRegionClassAdded={onRegionClassAdded}
      />

  )
}
export default Annotator
