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
    const [hasError, setHasError] = useState(false)
    const [loading, setLoading]= useState(false)
    useEffect(() => {
        setLoading(true)
        fetch("/api",{ mode: 'cors'}).then(res=>res.json()).then(
            (result) => {
                console.log("start setState");
                setTutorial({
                    steps:result["setup"]["tutorial"]["steps"],
                    imgUrl:result["setup"]["tutorial"]["imgUrl"]
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
                    <Intro title="Show tutorial">
                        <Tutorial tutorial={tutorial} />
                    </Intro>
                </div>
                <div className={classes.annotateContainer}>
                    < SubmitHIT />
                </div>
            </div>

        );
    }

}


