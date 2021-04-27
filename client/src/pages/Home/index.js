import React, { Component } from "react";
import Intro from "./Introduction";
import Tutorial from "./Tutorial";
import SubmitHIT from "./SubmitHIT"
import styles from './styles.js'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(styles)

export default function Home() {

        const classes = useStyles();
        return (
            <div className={classes.homeContainer}>
                <div className={classes.introTutorial}>
                    <Intro title="Show tutorial" >
                        <Tutorial  />
                    </Intro>
                </div>
                <div className={classes.annotateContainer}>
                    < SubmitHIT />
                </div>
            </div>

            );

}


