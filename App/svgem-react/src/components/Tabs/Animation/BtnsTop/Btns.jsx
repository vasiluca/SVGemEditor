import React from 'react';
import style from './Btns.module.sass';
import Btn from './Btn/Btn'
import { cache } from '../../../../../../Cache';
import PlayBtn from './PlayBtn';

const Btns = () => {
	return (
		<div className={style.Btns} onMouseDown={() => cache.dragTab = true}>
			<div className={style.BtnsLeft}>
				<PlayBtn/>
			</div>
			<div className={style.BtnsRight}>
				<Btn>
					fast_rewind
				</Btn>
			</div>
			
			
		</div>
	);
}

export default Btns;
