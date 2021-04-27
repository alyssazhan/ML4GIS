import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useEffect } from "react";
import SidebarBox from "./";
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo";
export default {
  title: "SidebarBox",
  component: SidebarBox
};
export var Basic = function Basic() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      height: 400
    }
  }, /*#__PURE__*/React.createElement(SidebarBox, {
    icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
    title: "Region Selector"
  }, "Content inside sidebar box"));
};
export var NoChildren = function NoChildren() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      height: 400
    }
  }, /*#__PURE__*/React.createElement(SidebarBox, {
    icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
    title: "Region Selector"
  }));
};
export var StopRendering = function StopRendering() {
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      t = _useState2[0],
      setT = _useState2[1];

  useEffect(function () {
    var tLocal = 0;
    setInterval(function () {
      setT(tLocal);
      tLocal = (tLocal + 1) % 4;
    }, 500);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      width: 300,
      height: 500
    }
  }, (t === 0 || t === 3) && /*#__PURE__*/React.createElement(SidebarBox, {
    icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
    title: "Region Selector"
  }, t === 0 || t === 2 ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: 300
    }
  }, "hello") : null));
};