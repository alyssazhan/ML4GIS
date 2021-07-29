import React, {Component, useEffect, useState} from "react";
import Intro from "./Introduction/main_Introduction";
import Tutorial from "./Tutorial/main_Tutorial";
import SubmitHIT from "./SubmitHIT/main_SubmitHIT"
import styles from './styles_Home'
import {makeStyles} from "@material-ui/core/styles";
// get style from style.js
const myStyle = makeStyles(styles)

export default function Home() {

    const classes = myStyle();
    const [tutorial, setTutorial] = useState({
        steps:null,
        imgUrl:null,
    })
    const [intro, setIntro]=useState({
        intro:null,})
    const [hasError, setHasError] = useState(false)
    const [loading, setLoading]= useState(false)
    useEffect(() => {
        setLoading(true);
        fetch("./backendConfig.json").then(res=>res.json()).then(
            (result) => {
                console.log("start setState");
                setTutorial({
                    steps:result["setup"]["tutorial"]["steps"],
                    imgUrl:result["setup"]["tutorial"]["imgUrl"]
                });
                setIntro({
                    intro:result["setup"]["introduction"],
                });
                setLoading(false);
            }
        ).catch(err => {
            setHasError(err)
            setLoading(false)})
    },[]);

    if (hasError!=false) {
        return <div>Error: {hasError.message}</div>;
    } else if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className={classes.homeContainer}>
                <div className={classes.introTutorial}>
                    <Intro title="Show tutorial"
                           intro={intro}>
                        <Tutorial tutorial={tutorial} />
                    </Intro >
                </div>
                <div className={classes.annotateContainer}>
                    <SubmitHIT />
                </div>
            </div>

        );
    }

}


