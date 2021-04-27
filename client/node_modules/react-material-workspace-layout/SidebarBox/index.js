import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, memo, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ExpandIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import { grey } from "@material-ui/core/colors";
import classnames from "classnames";
import useEventCallback from "use-event-callback";
import Typography from "@material-ui/core/Typography";
import { useIconDictionary } from "../icon-dictionary.js";
import ResizePanel from "@seveibar/react-resize-panel";
var useStyles = makeStyles({
  container: {
    borderBottom: "2px solid ".concat(grey[400]),
    "&:first-child": {
      borderTop: "1px solid ".concat(grey[400])
    }
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    paddingLeft: 16,
    paddingRight: 12,
    "& .iconContainer": {
      color: grey[600],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16
      }
    }
  },
  title: {
    fontSize: 11,
    flexGrow: 1,
    fontWeight: 800,
    paddingLeft: 8,
    color: grey[800],
    "& span": {
      color: grey[600],
      fontSize: 11
    }
  },
  expandButton: {
    padding: 0,
    width: 30,
    height: 30,
    "& .icon": {
      width: 20,
      height: 20,
      transition: "500ms transform",
      "&.expanded": {
        transform: "rotate(180deg)"
      }
    }
  },
  expandedContent: {
    maxHeight: 300,
    overflowY: "auto",
    "&.noScroll": {
      overflowY: "visible",
      overflow: "visible"
    }
  }
});

var getExpandedFromLocalStorage = function getExpandedFromLocalStorage(title) {
  try {
    return JSON.parse(window.localStorage["__REACT_WORKSPACE_SIDEBAR_EXPANDED_".concat(title)]);
  } catch (e) {
    return false;
  }
};

var setExpandedInLocalStorage = function setExpandedInLocalStorage(title, expanded) {
  window.localStorage["__REACT_WORKSPACE_SIDEBAR_EXPANDED_".concat(title)] = JSON.stringify(expanded);
};

export var SidebarBox = function SidebarBox(_ref) {
  var icon = _ref.icon,
      title = _ref.title,
      subTitle = _ref.subTitle,
      children = _ref.children,
      _ref$noScroll = _ref.noScroll,
      noScroll = _ref$noScroll === void 0 ? false : _ref$noScroll,
      expandedByDefault = _ref.expandedByDefault;
  var classes = useStyles();
  var content = /*#__PURE__*/React.createElement("div", {
    className: classnames(classes.expandedContent, noScroll && "noScroll")
  }, children);

  var _useState = useState(expandedByDefault === undefined ? getExpandedFromLocalStorage(title) : expandedByDefault),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      changeExpandedState = _useState2[1];

  var changeExpanded = useCallback(function (expanded) {
    changeExpandedState(expanded);
    setExpandedInLocalStorage(title, expanded);
  }, [changeExpandedState, title]);
  var toggleExpanded = useEventCallback(function () {
    return changeExpanded(!expanded);
  });
  var customIconMapping = useIconDictionary();
  var TitleIcon = customIconMapping[title.toLowerCase()];
  return /*#__PURE__*/React.createElement("div", {
    className: classes.container
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.header
  }, /*#__PURE__*/React.createElement("div", {
    className: "iconContainer"
  }, icon || /*#__PURE__*/React.createElement(TitleIcon, {
    className: classes.titleIcon
  })), /*#__PURE__*/React.createElement(Typography, {
    className: classes.title
  }, title, " ", /*#__PURE__*/React.createElement("span", null, subTitle)), /*#__PURE__*/React.createElement(IconButton, {
    onClick: toggleExpanded,
    className: classes.expandButton
  }, /*#__PURE__*/React.createElement(ExpandIcon, {
    className: classnames("icon", expanded && "expanded")
  }))), noScroll ? expanded ? content : null : /*#__PURE__*/React.createElement(Collapse, {
    in: expanded
  }, /*#__PURE__*/React.createElement(ResizePanel, {
    direction: "s",
    style: {
      height: 200
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      display: "block",
      overflow: "hidden",
      height: 500
    }
  }, content))));
};
export default memo(SidebarBox, function (prev, next) {
  return prev.title === next.title && prev.children === next.children;
});