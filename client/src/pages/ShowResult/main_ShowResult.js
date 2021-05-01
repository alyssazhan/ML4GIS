import React, { Component } from "react";
import AnnotationTool from "../Home/annotateComponents/main_Annotate";

import results from "../../train_results.json";



export default class main_ShowResult extends Component {

  render() {
    //transfer object to arr
    const resultsArr = []
    Object.keys(results).forEach(
        key => resultsArr.push(
             results[key]))
    console.log( resultsArr)
    return (
        <div>
          {
            //loop through arr
            resultsArr.map((result, index) => {
              if (result.Submit==="Yes")
              return (
                  <div key={index} >


          <AnnotationTool

    images={result.Annotation}
    enabledTools={["create-point", "create-rectangle", "create-polygon"]}
    regionTagList={["tag1", "tag2", "tag3"]}
    // comments
    allowComments={true}
    onExit={output => console.log(output.images)}

    />
                  </div>
              )
            })
          }
        </div>
    )

  }
}
