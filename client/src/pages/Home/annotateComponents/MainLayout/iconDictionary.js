// @flow

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCrosshairs,
  faDrawPolygon,
  faVectorSquare,
  faHandPaper,
  faSearch,
    faMinusSquare,
} from "@fortawesome/free-solid-svg-icons"
import { faCircle } from "@fortawesome/free-regular-svg-icons"

const faStyle = { marginTop: 4, width: 16, height: 16, marginBottom: 4 }

export const iconDictionary = {
  pan: () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faHandPaper} />
  ),
  zoom: () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faSearch} />
  ),
  "create-point": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faCrosshairs} />
  ),
  "create-rectangle": () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faVectorSquare}
    />
  ),
  "create-polygon": () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faDrawPolygon}
    />
  ),
  "create-polygon1": () => (
      <FontAwesomeIcon
          style={faStyle}
          size="xs"
          fixedWidth
          icon={faMinusSquare}
      />
  ),
  "create-circle": () => (
      <FontAwesomeIcon
          style={faStyle}
          size="xs"
          fixedWidth
          icon={faCircle}
      />
  ),


}

export default iconDictionary
