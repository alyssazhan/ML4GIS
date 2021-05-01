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
    const [hit,setHit]=useState({
        error: null,
        isLoaded: false,
        EnabledTools:null,
        AllowComments:null,
        Tags:null,
        imgData: [
            {
                src:"https://geodata.lib.utexas.edu/assets/blac_featured_image_map-dca4cbca4e07010e5bd201ad8fab1cc0aa9abd24a8842f90e3c1eef1834e8498.jpg",
                name: "Image 1",
                regions: []
            },
            {
                src:"https://geodata.lib.utexas.edu/assets/utlmaps_featured_image_map-c07ae2551145ff2e5f5fa3c71baa345d9d674a33b08f422449203cf9ed47e0d1.jpg",
                name: "Image 2",
                regions: []
            },
            {
                src:"https://1igc0ojossa412h1e3ek8d1w-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/TMSELEMWORLD.M.jpg",
                name: "Image 3",
                regions: []
            }
        ],
    })
    const [hasError, setHasError] = useState(false)
    const [loading, setLoading]= useState(false)
    useEffect(() => {
        setLoading(true);
        function getIntro(data) {
            const intro =data["introduction"]
            return intro

        }
        function getEnabledTools(data) {
            const enabledTools =data["enabledTools"]
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
            }
            return res

        }
        fetch("/api",{ mode: 'cors'}).then(res=>res.json()).then(
            (result) => {
                const enabledTools=getEnabledTools(result["setup"])
                setHit({
                    isLoaded: true,
                    EnabledTools:enabledTools,
                    AllowComments:result["setup"]["allow-comments"],
                    Tags:result["setup"]["tags"]
                });
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
                    <SubmitHIT hit={hit}/>
                </div>
            </div>

        );
    }

}


