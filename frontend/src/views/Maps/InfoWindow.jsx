import React, { Component } from "react";
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
};

class InfoWindow extends Component {

    render() {
        const { classes } = this.props;
        return (
          <div>
            InfoWindow!
          </div>
        );
    }
}


export default withStyles(styles)(InfoWindow);