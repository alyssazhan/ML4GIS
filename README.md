# Introduction
A ReactJS & NodeJS based annotation tool that can collect image data.

## Acknowledgements
- [React Image Annotate](https://github.com/UniversalDataTool/react-image-annotate)
- [turktool](https://github.com/jaxony/turktool)
- [VizWiz-Visual Grounding](https://chongyanchen.com/TraditionalGroundingV2/index.html)
- [Visual Grounding for VQA](https://github.com/CCYChongyanChen/CCYChongyanChen.github.io)


## Functionalities
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
  
## UI Components and their Corresponding Folder Names
![image info](./assets/imgs/home.png)

## Configuration

The following properties can be defined on the [config.json](server/config.json)

| Prop                     | Type                          | Description                                                                             | 
| ------------------------ | ------------------------------| --------------------------------------------------------------------------------------- | 
| `enabledTools`           | `Array<string>`               | Tools(Add Rectangles/Add Points/Add polygons) allowed to be used.                       |               
| `allow-comments`         | `boolean`                     | Allow user to input text.                                                               | 
| `tags`                   | `Array<string>`               | Allowed tags for regions.                                                 |    
| `introduction`           | `string`                      | Introduction text showing on the task overview.                                         |               
| `imgUrl`                 | `string`                      | Path to the image displayed on the tutorial.                                            |               
| `steps`                  | `Array<string>`               | Steps displayed on the tutorial.                                                        |               
| `development`            | `boolean`                     | AMT Sandbox Development Environment(true) vs. Production Environment(false).            |

## Front-end Development:
Run npm run <SCRIPT_NAME> to run a script. When developing the app, cd to 'client' folder and run "npm run start".

| Script                    | Description                         | 
| ------------------------ | ------------------------------| 
| `start`           | `Run font-end app on port 3000`               |      
| `build`         | ` creates a build directory with a production build of the app`                     |

## Back-end Development:
Run npm run <SCRIPT_NAME> to run a script. When we are developing the app, cd to 'server' folder and run "npm run start".

| Script                    | Description                         | 
| ------------------------ | ------------------------------| 
| `start`           | `Run back-end on port 3001`               |      
| `build`         | ` creates a build directory with a production build of the app`                     |

## Full-stack Development:
Run npm run <SCRIPT_NAME> to run a script. When we are developing the app, go to top-level folder and run "npm run dev".

| Script                    | Description                         | 
| ------------------------ | ------------------------------| 
| `dev`           | `Run front-end app on port 3000 and back-end on port 3001`               |      
| `build`         | ` creates a build directory with a production build of the app`|

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

