import React from 'react';
import Point from './Point/Point';
import style from './Points.module.sass'

const Points = (props) => {
	const points = props.points.map((data,index) => {
		return (<Point key={data.id || index} x={data.x} type={data.type}></Point>)
	})
	return (
		<div className={style.Points}>
			{points}
		</div>
	)
}

export default Points;
