import React from "react";
import Button from 'react-bootstrap/Button';
import styles from "../styles_Home"
import {Jumbotron} from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

export default function Introduction (props){
    const classes = useStyles();
    const [opened, setOpened] = React.useState(false);
    const [title, setTitle]=React.useState('Show Tutorial');
    function toggleBox(e) {
        if (opened) {
            setTitle('Show Tutorial');

        } else {
            setTitle('Hide Tutorial');

        }
        setOpened(!opened);

    }
    return (
        <div>
            <div className={classes.introContainer}>
                <Jumbotron  className={classes.jumbotron}>
                    <h1 className={classes.introTitle}>Task Overview</h1>
                    <p className={classes.introContent}>
                        { props.intro.intro}
                    </p>
                    <p>
                        <div className={classes.buttonTitle}>
                            <Button
                                variant="outline-primary"
                                size="lg"
                                onClick={e => toggleBox(e)}>
                                {title}
                            </Button>
                        </div>
                    </p>
                </Jumbotron>
            </div>
            {opened && (

                <div class="boxContent">
                    {props.children}
                </div>
            )}
        </div>
    );
}
