import React from 'react';
import style from './Ele.module.sass'
import Points from './Points/Points';

const Ele = (props) => {
	return (
		<div className={style.Ele}>
			<input type='text' value={props.dispName}/>

			<Points points={props.points}/>
		</div>
	);
}

export default Ele;
