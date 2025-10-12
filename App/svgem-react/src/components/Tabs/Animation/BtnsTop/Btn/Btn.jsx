import React from 'react';
import style from './Btn.module.sass';

const Btn = (props) => {
	return (
		<span {...props} onMouseDown={(e) => e.stopPropagation()}>
			<span className={[style.Btn, "material-icons"].join(' ')}>
				{props.children}
			</span>
		</span>
	);
}

export default Btn;
