import React, { useEffect, useRef, useState } from "react";

import Scene from "scenejs";

import {
    useScene,
    useSceneItem,
    useFrame,
    useNowFrame
} from "react-scenejs";

import Timeline from "react-scenejs-timeline";

import './TimelineComponent.sass';

function TimelineComponent() {
  const scene = new Scene({
    "#editor": {
      0: {
          left: "0px",
          top: "0px",
          transform: `translate(0px, 0px)`,
      },
      1: {
          left: "100px",
          top: "100px",
          transform: `translate(100px, 0px)`,
      },
    }
  });
  // useEffect(() => {
  //   scene.play();
  // }, [])

  return <Timeline 
            scene={scene} 
            keyboard={false}
            onSelect={(e) => {
              console.log('selected', e.target);
            }} />;
}

export default TimelineComponent;