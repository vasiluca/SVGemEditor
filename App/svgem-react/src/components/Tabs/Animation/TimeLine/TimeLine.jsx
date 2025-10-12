import React from 'react';
import './TimeLine.sass'
import { cache } from '../../../../../../Cache';

const TimeLine = () => {
	return (
		<div className='TimeLine' onMouseDown={() => cache.dragTab = true}>
			
		</div>
	);
}

export default TimeLine;
