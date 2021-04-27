import React from "react";
import { action } from "@storybook/addon-actions";
import Workspace from "./";
import SidebarBox from "../SidebarBox";
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo";
import PlayIcon from "@material-ui/icons/PlayArrow";
export default {
  title: "Workspace",
  component: Workspace
};
export var Basic = function Basic() {
  return /*#__PURE__*/React.createElement(Workspace, {
    allowFullscreen: true,
    headerItems: [{
      name: "Prev"
    }, {
      name: "Next"
    }, {
      name: "Save"
    }],
    onClickHeaderItem: action("onClickHeaderItem"),
    onClickIconSidebarItem: action("onClickIconSidebarItem"),
    rightSidebarExpanded: true,
    iconSidebarItems: [{
      name: "Play",
      helperText: "Play Tooltip"
    }, {
      name: "Pause",
      helperText: "Pause Tooltip"
    }],
    rightSidebarItems: [/*#__PURE__*/React.createElement(SidebarBox, {
      icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
      title: "Region Selector"
    }, "Hello world!"), /*#__PURE__*/React.createElement(SidebarBox, {
      icon: /*#__PURE__*/React.createElement(PlayIcon, null),
      title: "Playable GIFs"
    }, "Hello world!")]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 40,
      width: 400,
      height: 400,
      backgroundColor: "#f00"
    }
  }, "Hello World"));
};
Basic.story = {
  name: "Basic"
};
export var WithIconDictionary = function WithIconDictionary() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 400
    }
  }, /*#__PURE__*/React.createElement(Workspace, {
    allowFullscreen: true,
    iconDictionary: {
      "custom icon": FeaturedVideoIcon
    },
    headerItems: [{
      name: "Prev"
    }, {
      name: "Next"
    }, {
      name: "Save"
    }, {
      name: "Custom Icon"
    }],
    onClickHeaderItem: action("onClickHeaderItem"),
    onClickIconSidebarItem: action("onClickIconSidebarItem"),
    iconSidebarItems: [{
      name: "Custom Icon"
    }, {
      name: "Pause"
    }],
    rightSidebarItems: [/*#__PURE__*/React.createElement(SidebarBox, {
      icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
      title: "Region Selector"
    }, "Hello world!")]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "150vw",
      height: "150vh"
    }
  }, "Hello World!")));
};
WithIconDictionary.story = {
  name: "WithIconDictionary"
};
export var FullWidthHeightViewport = function FullWidthHeightViewport() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "90vw",
      height: "90vh"
    }
  }, /*#__PURE__*/React.createElement(Workspace, {
    allowFullscreen: true,
    headerItems: [{
      name: "Prev"
    }, {
      name: "Next"
    }, {
      name: "Save"
    }],
    onClickHeaderItem: action("onClickHeaderItem"),
    onClickIconSidebarItem: action("onClickIconSidebarItem"),
    selectedTools: ["play"],
    iconSidebarItems: [{
      name: "Play",
      helperText: "Play Tooltip"
    }, {
      name: "Pause",
      helperText: "Pause Tooltip"
    }],
    rightSidebarItems: [/*#__PURE__*/React.createElement(SidebarBox, {
      icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
      title: "Region Selector"
    }, "Hello world!")]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 40,
      width: 400,
      height: 400,
      backgroundColor: "#f00"
    }
  }, "Hello World")));
};
FullWidthHeightViewport.story = {
  name: "FullWidthHeightViewport"
};
export var HideHeader = function HideHeader() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "90vw",
      height: "90vh"
    }
  }, /*#__PURE__*/React.createElement(Workspace, {
    allowFullscreen: true,
    hideHeader: true,
    headerItems: [{
      name: "Prev"
    }, {
      name: "Next"
    }, {
      name: "Save"
    }],
    onClickHeaderItem: action("onClickHeaderItem"),
    onClickIconSidebarItem: action("onClickIconSidebarItem"),
    selectedTools: ["play"],
    iconSidebarItems: [{
      name: "Play",
      helperText: "Play Tooltip"
    }, {
      name: "Pause",
      helperText: "Pause Tooltip"
    }],
    rightSidebarItems: [/*#__PURE__*/React.createElement(SidebarBox, {
      icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
      title: "Region Selector"
    }, "Hello world!")]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 40,
      width: 400,
      height: 400,
      backgroundColor: "#f00"
    }
  }, "Hello World")));
};
HideHeader.story = {
  name: "HideHeader"
};
export var HideHeaderText = function HideHeaderText() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "90vw",
      height: "90vh"
    }
  }, /*#__PURE__*/React.createElement(Workspace, {
    allowFullscreen: true,
    hideHeaderText: true,
    headerItems: [{
      name: "Prev"
    }, {
      name: "Next"
    }, {
      name: "Save"
    }],
    onClickHeaderItem: action("onClickHeaderItem"),
    onClickIconSidebarItem: action("onClickIconSidebarItem"),
    selectedTools: ["play"],
    iconSidebarItems: [{
      name: "Play",
      helperText: "Play Tooltip"
    }, {
      name: "Pause",
      helperText: "Pause Tooltip"
    }],
    rightSidebarItems: [/*#__PURE__*/React.createElement(SidebarBox, {
      icon: /*#__PURE__*/React.createElement(FeaturedVideoIcon, null),
      title: "Region Selector"
    }, "Hello world!")]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 40,
      width: 400,
      height: 400,
      backgroundColor: "#f00"
    }
  }, "Hello World")));
};
HideHeaderText.story = {
  name: "HideHeaderText"
};