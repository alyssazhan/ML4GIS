import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from "../styles.js"
import {Card, CardContent, CardHeader, CardMedia, Box} from "@material-ui/core";

const useStyles = makeStyles(styles);

function generate(data) {
    console.log("data before is:",data)
    return !data ? null :data.map(step => {
        return (<ListItem>
            <ListItemText primary={step} />
        </ListItem>)
    });

};
export default function Index() {
    const classes = useStyles();
    const [dense, setDense] = React.useState(false);

    const [state, setState] = useState({
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
                setState({
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
        const img=state.imgUrl;
        const steps=state.steps;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <Box boxShadow={3}>
                        <CardHeader
                            className={classes.tutorialTitles}
                            title="Tutorial"
                            subheader="This short tutorial is meant to guide you through the annotation process. "
                        />
                    </Box>
                    <div className={classes.imageContainer}>
                        <CardMedia
                            className={classes.media}
                            image={img}/>
                    </div>
                    <Box boxShadow={3}>
                        <CardContent className={classes.steps}>
                            <List dense={dense}>
                                {generate(steps)}
                            </List>
                        </CardContent>
                    </Box>
                </Card>
            </div>
        );
    }
}
