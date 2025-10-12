import React from 'react';
import './TaskBar.sass'
import { cache } from '../../../../../../Cache';

const TaskBar = () => {
	return (
		<div className="AniOptions" onMouseDown={() => cache.dragTab = true}>
			<div className="tfmMode"><span className="material-icons">control_camera</span><span className="txt">transform</span></div>
			<div className="transforms">
				<div className="opacity"><span className="material-icons opacity">opacity</span><span className="txt">opacity</span></div>
				<div className="translate"><span className="material-icons translate">settings_overscan</span><span className="txt">translate</span></div>
				<div className="scale"><span className="material-icons scale">photo_size_select_small</span><span className="txt">scale</span></div>
				<div className="rotate"><span className="material-icons rotate">refresh</span><span className="txt">rotate</span></div>
				<div className="skew"><span className="material-icons skew">sync_alt</span><span className="txt">skew</span>
				</div>
			</div>
			<div className="functions">
				<div className="syncOrder"><span className="material-icons syncOrder">toggle_off</span><span className="txt">order</span></div>
				<div className="group"><span className="material-icons group">filter_none</span><span className="txt">group</span></div>
			</div>
		</div>

	);
}

export default TaskBar;
