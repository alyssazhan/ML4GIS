import React from "react";
import RightSidebar from "./";
import SidebarBox from "../SidebarBox";
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo";
export default {
  title: "RightSidebar",
  component: RightSidebar
};
export var Basic = function Basic() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 500,
      height: 500
    }
  }, /*#__PURE__*/React.createElement(RightSidebar, null, /*#__PURE__*/React.createElement(SidebarBox, {
    icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
    title: "Region Selector"
  }, "Content inside sidebar box"), /*#__PURE__*/React.createElement(SidebarBox, {
    icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
    title: "Region Selector"
  }, "Content inside sidebar box")));
};
export var NoChildren = function NoChildren() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 500,
      height: 500
    }
  }, /*#__PURE__*/React.createElement(RightSidebar, null));
};