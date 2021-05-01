import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import styles from "../styles.js"
import {Jumbotron} from "react-bootstrap";
import {withStyles} from "@material-ui/core/styles";
const useStyles = theme => (styles)
class Introduction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            error: null,
            isLoaded: false,
            intro:null,
        };
        this.props = props;
        this.toggleBox = this.toggleBox.bind(this);
        this.componentDidMount=this.componentDidMount(this);

    }

    toggleBox() {
        const { opened } = this.state;
        this.setState({
            opened: !opened,
        });
    }

    componentDidMount()  {
        function getIntro(data) {
            const intro =data["introduction"]
            return intro

        }

        fetch("/api",{ mode: 'cors'})
            .then(res => res.json())
            .then(
                (result) => {
                    const intro=getIntro(result["setup"])
                    this.setState({
                        isLoaded: true,
                        intro:intro,
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
    };
    render() {
        const {classes} =this.props;

        var { title, children } = this.props;
        const { opened, error, isLoaded ,intro} = this.state;
        if (opened){
            title ='Hide Tutorial';
        }else{
            title ='Show Tutorial';
        }
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <div className={classes.introContainer}>
                        <Jumbotron  className={classes.jumbotron}>
                            <h1 className={classes.introTitle}>Task Overview</h1>
                            <p className={classes.introContent}>
                                { intro}
                            </p>
                            <p>
                                <div className={classes.buttonTitle}>
                                    <Button
                                        variant="outline-primary"
                                        size="lg"
                                        onClick={this.toggleBox}>
                                        {title}
                                    </Button>
                                </div>
                            </p>
                        </Jumbotron>
                    </div>


                    {opened && (

                        <div class="boxContent">
                            {children}

                        </div>
                    )}
                </div>
            );
        }
    }
}
export default withStyles(useStyles)(Introduction)
