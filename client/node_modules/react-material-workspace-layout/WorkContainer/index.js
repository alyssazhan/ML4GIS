import React from "react";
import { styled } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
var Container = styled("div")({
  position: "relative",
  flexGrow: 1,
  flexShrink: 1,
  height: "100%",
  backgroundColor: grey[50],
  overflowY: "auto"
});
var ShadowOverlay = styled("div")({
  content: "' '",
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  pointerEvents: "none",
  boxShadow: "inset 0 3px 5px rgba(0,0,0,0.15), inset -3px 0 5px rgba(0,0,0,0.15), inset 3px 0 5px rgba(0,0,0,0.15)"
});
export var WorkContainer = React.forwardRef(function (_ref, ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(Container, {
    ref: ref
  }, children, /*#__PURE__*/React.createElement(ShadowOverlay, null));
});
export default WorkContainer;