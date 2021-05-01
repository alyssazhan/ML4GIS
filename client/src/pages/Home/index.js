import React, {Component, useEffect, useState} from "react";
import Intro from "./Introduction";
import Tutorial from "./Tutorial";
import SubmitHIT from "./SubmitHIT"
import styles from './styles.js'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(styles)

export default function Home() {

        const classes = useStyles();
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
        function getIntro(data) {
            const intro =data["introduction"]
            return intro

        }
        fetch("/api",{ mode: 'cors'}).then(res=>res.json()).then(
            (result) => {
                // const intro=getIntro(result["setup"]);
                console.log("start setState");
                setTutorial({
                    steps:result["setup"]["tutorial"]["steps"],
                    imgUrl:result["setup"]["tutorial"]["imgUrl"]
                });
                setIntro({
                    intro:result["setup"]["introduction"],
                });
                setLoading(false);
                console.log("intro is",intro)
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
                    < SubmitHIT />
                </div>
            </div>

        );
    }

}


