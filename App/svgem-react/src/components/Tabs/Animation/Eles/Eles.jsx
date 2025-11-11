import React from 'react';
import style from './Eles.module.sass';
import Ele from './Ele/Ele';
import TimelineComponent from '../TimeLine/TimelineComponent';

const Eles = (props) => {
	const eles = props.data.map((data) => {
		return <Ele key={data.idRef} idRef={data.idRef} dispName={data.name} points={data.points}/>	
	})

	return (

		<div className={style.Eles}>
			<TimelineComponent/>
		</div>
	);
}

export default Eles;