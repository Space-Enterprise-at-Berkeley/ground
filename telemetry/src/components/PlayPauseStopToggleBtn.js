import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { PlayArrow, Pause, Stop }from '@material-ui/icons';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles({

});

export default function PlayPauseStopButton() {
	const classes = useStyles();
	const [playback, setPlayback] = React.useState('undefined');

	const handlePlayback = (event, newPlayback) => {
	  setPlayback(newPlayback);
	};
  	return (
		<ToggleButtonGroup 
			value={playback}
			exclusive
			onChange={handlePlayback}
		>
			<ToggleButton value="play">
				<PlayArrow />
			</ToggleButton>
			<ToggleButton value="pause">
				<Pause />
			</ToggleButton>
			<ToggleButton value="stop">
				<Stop />
			</ToggleButton>
		</ToggleButtonGroup>
	);
  	
}