import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from "../styles_Home"
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
export default function Tutorial(props) {
    const classes = useStyles();
    const [dense, setDense] = React.useState(false);
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
                            image={props.tutorial.imgUrl}/>
                    </div>
                    <Box boxShadow={3}>
                        <CardContent className={classes.steps}>
                            <List dense={dense}>
                                {generate(props.tutorial.steps)}
                            </List>
                        </CardContent>
                    </Box>
                </Card>
            </div>
        );
    // }
}
