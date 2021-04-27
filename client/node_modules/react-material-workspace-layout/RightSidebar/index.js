import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useReducer, useEffect, useMemo } from "react";
import { styled } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import ExpandIcon from "@material-ui/icons/KeyboardArrowLeft";
import ContractIcon from "@material-ui/icons/KeyboardArrowRight";
import { grey } from "@material-ui/core/colors";
var Container = styled("div")({
  width: 0,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flexShrink: 0,
  backgroundColor: "#fff",
  position: "relative",
  transition: "width 500ms",
  "&.expanded": {
    width: 300
  }
});
var Expander = styled(ButtonBase)({
  width: 23,
  height: 40,
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "flex-start",
  borderTopLeftRadius: "50%",
  borderBottomLeftRadius: "50%",
  boxSizing: "border-box",
  borderTop: "1px solid ".concat(grey[400]),
  borderBottom: "1px solid ".concat(grey[400]),
  borderLeft: "1px solid ".concat(grey[400]),
  boxShadow: "-1px 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "#fff",
  position: "absolute",
  top: "calc(50% - 20px)",
  left: -23,
  zIndex: 9999,
  transition: "opacity 500ms, left 500ms, width 500ms",
  "&.expanded": {
    left: -20,
    width: 20,
    opacity: 0.4,
    "& .icon": {
      marginLeft: 0
    }
  },
  "& .icon": {
    marginLeft: 3
  }
});
var Slider = styled("div")({
  position: "absolute",
  right: 0,
  top: 0,
  width: 0,
  bottom: 0,
  overflow: "hidden",
  transition: "opacity 500ms, left 500ms, width 500ms",
  "&.expanded": {
    width: 300
  }
});
var InnerSliderContent = styled("div")({
  width: 300,
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0
});

var getInitialExpandedState = function getInitialExpandedState() {
  try {
    return JSON.parse(window.localStorage.__REACT_WORKSPACE_LAYOUT_EXPANDED);
  } catch (e) {
    return window.innerWidth > 1000 ? true : false;
  }
};

export var RightSidebar = function RightSidebar(_ref) {
  var children = _ref.children,
      initiallyExpanded = _ref.initiallyExpanded,
      height = _ref.height;

  var _useReducer = useReducer(function (state) {
    return !state;
  }, initiallyExpanded === undefined ? getInitialExpandedState() : initiallyExpanded),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      expanded = _useReducer2[0],
      toggleExpanded = _useReducer2[1];

  useEffect(function () {
    if (initiallyExpanded === undefined) {
      window.localStorage.__REACT_WORKSPACE_LAYOUT_EXPANDED = JSON.stringify(expanded);
    }
  }, [initiallyExpanded, expanded]);
  var containerStyle = useMemo(function () {
    return {
      height: height || "100%"
    };
  }, [height]);
  return /*#__PURE__*/React.createElement(Container, {
    className: expanded ? "expanded" : "",
    style: containerStyle
  }, /*#__PURE__*/React.createElement(Slider, {
    className: expanded ? "expanded" : ""
  }, /*#__PURE__*/React.createElement(InnerSliderContent, null, children)), /*#__PURE__*/React.createElement(Expander, {
    onClick: toggleExpanded,
    className: expanded ? "expanded" : ""
  }, expanded ? /*#__PURE__*/React.createElement(ContractIcon, {
    className: "icon"
  }) : /*#__PURE__*/React.createElement(ExpandIcon, {
    className: "icon"
  })));
};
export default RightSidebar;