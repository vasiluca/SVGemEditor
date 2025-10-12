import React, { Component } from 'react';
// import style from 'Animations.module.sass'
// import './Animation.module.sass' // be aware that regular styles will not work if a file is imported ending in '.module.css', without specifying import style
import './Animations.sass'
import DragHandle from '../DragHandle'
import SideBar from './SideBar/SideBar'
import Indicator from './Indicators/Indicator'
import TimeLine from './TimeLine/TimeLine'
import TaskBar from './TaskBar/TaskBar'
import Eles from './Eles/Eles'
import '../Tabs.sass'
import BtnsTop from './BtnsTop/Btns'
// import getTabStyle from '../../../../hoc/getTabStyle';

function Animation() {
	const eles = [
		{idRef: 1, name: "Element1", points: [{id: 1, x: 120}]},
		{idRef: 2, name: "Element2", points: [{id: 1, x: 40}]},
		{idRef: 3, name: "Element3", points: [{id: 1, x: 0}]},
		{idRef: 4, name: "Element4", points: [{id: 1, x: 170}, {id: 2, x: 180}]}
	];
	return (
		<>
			<DragHandle />
			<BtnsTop />

			<TimeLine></TimeLine>
			<Indicator />
			<SideBar></SideBar>
			<TaskBar></TaskBar>
			<Eles data={eles}></Eles>
		</>
	);
}

export default Animation;
