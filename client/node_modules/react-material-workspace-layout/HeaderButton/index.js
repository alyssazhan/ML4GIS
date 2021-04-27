import React from "react";
import Button from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { useIconDictionary } from "../icon-dictionary.js";
import { iconMapping } from "../icon-mapping.js";
import { colors } from "@material-ui/core";
var defaultNameIconMapping = iconMapping;

var getIcon = function getIcon(name, customIconMapping) {
  var Icon = customIconMapping[name.toLowerCase()] || defaultNameIconMapping[name.toLowerCase()] || defaultNameIconMapping.help;
  return /*#__PURE__*/React.createElement(Icon, null);
};

var StyledButton = styled(Button)({
  textTransform: "none",
  width: 60,
  paddingTop: 8,
  paddingBottom: 4,
  marginLeft: 1,
  marginRight: 1
});
var ButtonInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column"
});
var IconContainer = styled("div")(function (_ref) {
  var textHidden = _ref.textHidden;
  return {
    color: colors.grey[700],
    height: textHidden ? 32 : 20,
    paddingTop: textHidden ? 8 : 0,
    "& .MuiSvgIcon-root": {
      width: 18,
      height: 18
    }
  };
});
var Text = styled("div")({
  fontWeight: "bold",
  fontSize: 11,
  color: colors.grey[800],
  display: "flex",
  alignItems: "center",
  lineHeight: 1,
  justifyContent: "center"
});
export var HeaderButton = function HeaderButton(_ref2) {
  var name = _ref2.name,
      icon = _ref2.icon,
      disabled = _ref2.disabled,
      onClick = _ref2.onClick,
      _ref2$hideText = _ref2.hideText,
      hideText = _ref2$hideText === void 0 ? false : _ref2$hideText;
  var customIconMapping = useIconDictionary();
  return /*#__PURE__*/React.createElement(StyledButton, {
    onClick: onClick,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(ButtonInnerContent, null, /*#__PURE__*/React.createElement(IconContainer, {
    textHidden: hideText
  }, icon || getIcon(name, customIconMapping)), !hideText && /*#__PURE__*/React.createElement(Text, null, /*#__PURE__*/React.createElement("div", null, name))));
};
export default HeaderButton;