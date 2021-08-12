import React, { Component } from "react";
import axios from "axios";
import AnnotationTool from "../annotateComponents/main_Annotate";
import Button from 'react-bootstrap/Button';

var env = process.env.NODE_ENV;
var config = require("../../../config.json");

export default class SubmitHIT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            EnabledTools:null,
            AllowComments:null,
            Tags:null,
            imgData: null,
            Local:null
        }

        this.props = props;
        this.submitTask = this.submitTask.bind(this);
        this.getSubmissionUrl = this.getSubmissionUrl.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentDidMount=this.componentDidMount(this);

    }
    getTools(res){
        console.log("get tool:",res.Tools['enenabledTools'])

    }
//get data from api
    componentDidMount() {
        function getEnabledTools(data) {
            const enabledTools=data["enabledTools"]
            var res=[]
            for (var i = 0; i < enabledTools.length; i++) {
                if (enabledTools[i]["create point"]==true){
                    res.push("create-point")
                }
                else if (enabledTools[i]["create rectangle"]==true){
                    res.push("create-rectangle")
                }
                else if(enabledTools[i]["create polygon"]==true){
                    res.push("create-polygon")
                }
                else if(enabledTools[i]["create polygon1"]==true){
                    res.push("create-polygon1")
                }
                else if(enabledTools[i]["create ellipse"]==true){
                    res.push("create-circle")
                }
            }
            return res
        }

        fetch("./backendConfig.json")
            .then(res => res.json())
            .then(
                (result) => {
                    const enabledTools=getEnabledTools(result["setup"])
                    if (result["setup"]["importData"]) {
                        this.setState({imgData:result["setup"]["importData"]});
                    } else {
                        this.setState({imgData:result["setup"]["defaultImgData"]});
                    }
                    
                    this.setState({
                        isLoaded: true,
                        EnabledTools:enabledTools,
                        AllowComments:result["setup"]["allow-comments"],
                        Tags:result["setup"]["tags"],
                        Local:result["setup"]["local"],
                    });



                    console.log("res is: ", result)
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    parseParameters(url){
        var params = {
            'assignmentId' : null,
            'hitId' : null,
            'workerId' : null,
            'turkSubmitTo' : null
        };

        var queryString = url.split('?')[1];

        if (queryString){
            var queryPieces = queryString.split('&');
            for (var i = 0; i < queryPieces.length; ++i){
                var pieces = queryPieces[i].split('=');
                var paramName = pieces[0];
                var paramValue = pieces[1];
                if(paramName in params){
                    params[paramName] = paramValue;
                }
            }
        }

        return params;
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('submitButton');
        input.setAttribute('value', JSON.stringify(this.state.imgData));
        console.log(input);
        const form = document.getElementById('submitForm');
        HTMLFormElement.prototype.submit.call(form);

    }

    submitTask(e) {
        // e.preventDefault();
        console.log("POSTing data");
        axios
            .post(`${this.getSubmissionUrl()}`, {})
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    getSubmissionUrl() {
        let mturkParams = this.parseParameters(window.location.href);
        const assignmentID =  mturkParams['assignmentId'];
        const url = config["submit"][env] + "/?assignmentId=" + assignmentID;
        console.log(url);
        return url;
    }

    render() {
        const { error, isLoaded, EnabledTools, AllowComments, Tags, imgData, Local} = this.state;
        console.log("render data is:", this.state)
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (Local) {
            return (
                <div id="Submit">

                    <form
                        id="submitForm"
                        type="submit"
                        method="POST"
                    >
                        <AnnotationTool
                            name="AnnotationTool"
                            type="submit"
                            ref={value => {
                                this.value = value;
                            }}
                            images={imgData}
                            enabledTools={EnabledTools}
                            regionTagList={Tags}
                            allowComments={AllowComments}
                            Local={Local}
                            imgData={imgData}
                            onExit={output => {
                                this.setState({imgData: output.images});
                                console.log("output:", JSON.stringify(output.images));
                                console.log(typeof({imgData}));
                                console.log({imgData});
                            }}

                        />
                        <br />
                        <div>
                            <Button
                                variant="outline-dark" size="lg" block
                                name="Annotation"
                                type="submit"
                                id="submitButton"
                                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                JSON.stringify(this.state.imgData)
                                )}`}
                                download="results.json"
                            >
                            {`Download Annotations as Json File`}
                            </Button>   
                        </div>
                        <br />
                        <br />
                    </form>
                </div>
            );
        } else {
            return (
                <div id="Submit">

                    <form
                        id="submitForm"
                        type="submit"
                        method="POST"
                        action={this.getSubmissionUrl()}
                    >
                        <AnnotationTool
                            name="AnnotationTool"
                            type="submit"
                            ref={value => {
                                this.value = value;
                            }}
                            images={imgData}
                            enabledTools={EnabledTools}
                            regionTagList={Tags}
                            allowComments={AllowComments}
                            Local={Local}
                            imgData={imgData}
                            onExit={output => {
                                this.setState({imgData: output.images});
                                console.log("output:", JSON.stringify(output.images));
                            }}

                        />
                        <br />
                        <div>
                            <Button variant="outline-dark" size="lg" block
                                    name="Annotation"
                                    type="submit"
                                    id="submitButton"
                                    value={JSON.stringify(this.state.imgData)}
                                    ref={value => {
                                        this.value = value;
                                    }}
                            >Complete the HIT</Button>
                        </div>
                        <br />
                        <br />
                    </form>
                </div>
            );
        }
    }
}
