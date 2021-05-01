import {red} from "@material-ui/core/colors";
import {bold} from "colorette";

export default {
    homeContainer:{
        margin: "auto",
        width:"85%",
        fontFamily: "Arial",
    },
    introTutorial:{
        backgroundColor: "#E8E8E8",
        paddingBottom:20,
    },
    /*intro*/
    introContainer:{
        color: "DodgerBlue",
        textAlign: "center",
       paddingTop: 10
    },
    jumbotron:{
        paddingTop:100,
        backgroundColor: "#E8E8E8"
    },
    introContent:{
        padding: 40,
        fontSize: "x-large",
    },
    introTitle: {
        fontWeight: bold(),
    },
    buttonTitle: {
        padding: "40px",
    },
    // tutorial
    card:{
        margin: 20,

    },
    tutorialTitles:{
        textAlign: "center",

    },
    imageContainer: {
        display: "block",
        margin: "auto",
        maxWidth: 1000,
        padding:5,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9

    },

    avatar: {
        backgroundColor: red[500],
    },
    steps:{
        paddingLeft:"25%",
    },
    /*annotate*/
    annotateContainer: {
        marginTop: "170px",
    }
}

