import React, { useState } from 'react';
import style from './Btns.module.sass';
import Btn from './Btn/Btn';

const PlayBtn = () => {
	const [ play, setPlay ] = useState(true);

	return (
		<Btn style={{display: 'none'}} onClick={() => setPlay(!play)}>
			{play ? 'play_arrow' : 'pause'}
		</Btn>
		
	);
}

export default PlayBtn;
