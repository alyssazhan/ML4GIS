"use strict";

exports.__esModule = true;

var _react = require("react");

function getDimensionObject(node) {
    var rect = node.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height,
        top: "x" in rect ? rect.x : rect.top,
        left: "y" in rect ? rect.y : rect.left,
        x: "x" in rect ? rect.x : rect.left,
        y: "y" in rect ? rect.y : rect.top,
        right: rect.right,
        bottom: rect.bottom
    };
}
function useDimensions() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$liveMeasure = _ref.liveMeasure,
        liveMeasure = _ref$liveMeasure === undefined ? true : _ref$liveMeasure;

    var _useState = (0, _react.useState)({}),
        dimensions = _useState[0],
        setDimensions = _useState[1];

    var _useState2 = (0, _react.useState)(null),
        node = _useState2[0],
        setNode = _useState2[1];

    var ref = (0, _react.useCallback)(function (node) {
        setNode(node);
    }, []);
    (0, _react.useLayoutEffect)(function () {
        if (node) {
            var measure = function measure() {
                return window.requestAnimationFrame(function () {
                    return setDimensions(getDimensionObject(node));
                });
            };
            measure();
            if (liveMeasure) {
                window.addEventListener("resize", measure);
                window.addEventListener("scroll", measure);
                return function () {
                    window.removeEventListener("resize", measure);
                    window.removeEventListener("scroll", measure);
                };
            }
        }
    }, [node]);
    return [ref, dimensions, node];
}
exports.default = useDimensions;
//# sourceMappingURL=index.js.map

module.exports = exports["default"];