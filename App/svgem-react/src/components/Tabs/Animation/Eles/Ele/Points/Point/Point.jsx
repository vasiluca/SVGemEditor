import React from 'react';

import style from './Point.module.sass';
const Point = (props) => {
	return (
		<div key={props.idRef} className={`${style.Pt} material-icons`}
			style={{
				left: props.x
			}}>
			
		</div>
	);
}

export default Point;
