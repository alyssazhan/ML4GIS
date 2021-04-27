import { createContext, useContext } from "react";
export var IconDictionaryContext = createContext({});
var emptyObj = {};
export var useIconDictionary = function useIconDictionary() {
  return useContext(IconDictionaryContext) || emptyObj;
};