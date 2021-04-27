import React from "react";
import WorkContainer from "./";
import SidebarBox from "../SidebarBox";
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo";
export default {
  title: "WorkContainer",
  component: WorkContainer
};
export var Basic = function Basic() {
  return /*#__PURE__*/React.createElement(WorkContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      height: 300,
      backgroundColor: "#aaa"
    }
  }, "The work is in here"));
};