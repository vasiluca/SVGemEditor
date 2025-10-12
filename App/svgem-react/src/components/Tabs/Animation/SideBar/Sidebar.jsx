import React from 'react';
import style from './SideBar.module.sass';
import { cache } from '../../../../../../Cache';

const SideBar = () => {
	return (
		<div className={style.SideBar} onMouseDown={() => {cache.dragTab = true;}}>
			
		</div>
	);
}

export default SideBar;
