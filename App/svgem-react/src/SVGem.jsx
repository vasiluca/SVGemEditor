// import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import Animation from './components/Tabs/Animation/Animation';

const animationTab = document.getElementsByClassName('animation')[0];
const animationRoot = createRoot(animationTab);
animationRoot.render(
	<Animation/>
);
