import React from 'react';
import style from './Ele.module.sass'
import Points from './Points/Points';

const Ele = (props) => {
	return (
		<div className={style.Ele}>
			{/* stopPropagation prevents a change to the name in the animation tab from propagating up */}
			<input type='text' defaultValue={props.dispName} onKeyDown={(e) => e.stopPropagation()}/> 

			<Points points={props.points}/>
		</div>
	);
}

export default Ele;
