# Introduction
An annotation tool that can collect map data.

## Functionalities

- Tutorial
- Drag Image
- Zoom In/Out Image
- Add Rectangles
  * add tag
  * allow comment
- Add Points
  * add tag
  * allow comment
- Add polygons
  * add tag
  * allow comment
  
## Configuration

All the properties can be defined on the config.json

| Prop                     | Type                          | Description                                                                             | 
| ------------------------ | ------------------------------| --------------------------------------------------------------------------------------- | 
| `enabledTools`           | `boolean`                     | Tools allowed to be used.                                                               |               
| `allow-comments`         | `boolean`                     | Allow user to input text.                                                               | 
| `tags`                   | `Array<string>`               | Allowed "tags" (exclusive) for regions.                                                 |    
| `introduction`           | `string`                      | Introduction to the task.                                                               |               
| `imgUrl`                 | `string`                      | Image path on the tutorial.                                                             |               
| `steps`                  | `Array<string>`               | Steps on the tutorial.                                                                  |               
| `development`            | `boolean`                     | Environment. true means "development", otherwise, "production"                          |
                       
## UI and Corresponding Folder Path
![image info](./assets/imgs/home.png)


## File Tree
 - __client__
   - __public__
     - [favicon.ico](client/public/favicon.ico)
     - [index.html](client/public/index.html)
   - __src__
     - [config.json](client/src/config.json)
     - [index.js](client/src/index.js)
     - __pages__
       - __Home__
         - __Introduction__
           - [main\_Introduction.js](client/src/pages/Home/Introduction/main_Introduction.js)
         - __SubmitHIT__
           - [main\_SubmitHIT.js](client/src/pages/Home/SubmitHIT/main_SubmitHIT.js)
           - [serviceWorker.js](client/src/pages/Home/SubmitHIT/serviceWorker.js)
         - __Tutorial__
           - [main\_Tutorial.js](client/src/pages/Home/Tutorial/main_Tutorial.js)
         - __annotateComponents__
           - __ImageCanvas__
             - [background.js](client/src/pages/Home/annotateComponents/ImageCanvas/background.js)
             - [colors.js](client/src/pages/Home/annotateComponents/ImageCanvas/colors.js)
             - [main\_ImageCanvas.js](client/src/pages/Home/annotateComponents/ImageCanvas/main_ImageCanvas.js)
             - [regionTools.js](client/src/pages/Home/annotateComponents/ImageCanvas/regionTools.js)
             - [styles\_ImageCanvas.js](client/src/pages/Home/annotateComponents/ImageCanvas/styles_ImageCanvas.js)
             - [useMouse.js](client/src/pages/Home/annotateComponents/ImageCanvas/useMouse.js)
             - [useProjectBox.js](client/src/pages/Home/annotateComponents/ImageCanvas/useProjectBox.js)
           - __MainLayout__
             - [iconDictionary.js](client/src/pages/Home/annotateComponents/MainLayout/iconDictionary.js)
             - [main\_MainLayout.js](client/src/pages/Home/annotateComponents/MainLayout/main_MainLayout.js)
             - [styles\_MainLayout.js](client/src/pages/Home/annotateComponents/MainLayout/styles_MainLayout.js)
             - [types.js](client/src/pages/Home/annotateComponents/MainLayout/types.js)
           - __RegionLabel__
             - [main\_RegionLabel.js](client/src/pages/Home/annotateComponents/RegionLabel/main_RegionLabel.js)
             - [styles\_RegionLabel.js](client/src/pages/Home/annotateComponents/RegionLabel/styles_RegionLabel.js)
           - __RegionShapes__
             - [main\_RegionShapes.js](client/src/pages/Home/annotateComponents/RegionShapes/main_RegionShapes.js)
           - __RegionTags__
             - [main\_RegionTags.js](client/src/pages/Home/annotateComponents/RegionTags/main_RegionTags.js)
           - __ShortcutsManager__
             - [main\_ShortcutsManager.js](client/src/pages/Home/annotateComponents/ShortcutsManager/main_ShortcutsManager.js)
           - __TransformBoxes__
             - [main\_TransformBoxes.js](client/src/pages/Home/annotateComponents/TransformBoxes/main_TransformBoxes.js)
           - [main\_Annotate.js](client/src/pages/Home/annotateComponents/main_Annotate.js)
           - __reducers__
             - [combineReducers.js](client/src/pages/Home/annotateComponents/reducers/combineReducers.js)
             - [generalReducer.js](client/src/pages/Home/annotateComponents/reducers/generalReducer.js)
             - [getActiveImage.js](client/src/pages/Home/annotateComponents/reducers/getActiveImage.js)
             - [historyHandler.js](client/src/pages/Home/annotateComponents/reducers/historyHandler.js)
             - [imageReducer.js](client/src/pages/Home/annotateComponents/reducers/imageReducer.js)
         - [main\_Home.js](client/src/pages/Home/main_Home.js)
         - [styles\_Home.js](client/src/pages/Home/styles_Home.js)
       - __ShowResult__
         - [main\_ShowResult.js](client/src/pages/ShowResult/main_ShowResult.js)
     - [route.js](client/src/route.js)
     - [site.css](client/src/site.css)
 - __server__
   - [config.json](server/config.json)
   - [index.js](server/index.js)

