import React, { Component } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = theme => ({
  thiccRed: {
    backgroundColor: theme.palette.error.main + '!important',
    color: theme.palette.text.main + '!important',
    width: '100%',
    fontSize: '3rem',
    transition: 'none',
  },
  thiccGreen: {
    backgroundColor: theme.palette.success.main + '!important',
    color: theme.palette.text.main + '!important',
    width: '100%',
    fontSize: '3rem',
    transition: 'none',
  }
});

class BigButton extends Component {
  render() {
    const { classes, theme, text, onClick, isRed, disabled } = this.props;
    return (
      <Button onClick={onClick} disabled={disabled || false} color='primary' variant='contained' disableRipple className={isRed ? classes.thiccRed : classes.thiccGreen}>{text}</Button>
    );
  }
}

export default withTheme(withStyles(styles)(BigButton));
