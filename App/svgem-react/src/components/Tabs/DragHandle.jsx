import React, { Component } from 'react';
import style from './DragHandle.module.sass';

class DragHandle extends Component {

	render() {
		return (
			<span className={`material-icons drag Drag`}>
				<span className={[style.Drag].join(' ')}>
					drag_handle
				</span>
			</span>
		);
	}
}

export default DragHandle;