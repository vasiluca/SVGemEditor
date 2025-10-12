import React, { cache, useState } from 'react';
import style from './Btns.module.sass';
import Btn from './Btn/Btn';

const PlayBtn = () => {
	const [ play, setPlay ] = useState(true);

	return (
		<Btn onClick={() => setPlay(!play)}>
			{play ? 'play_arrow' : 'pause'}
		</Btn>
		
	);
}

export default PlayBtn;
