import React, { useEffect, useRef, useState } from "react";
import { Timeline, TimelineModel } from "animation-timeline-js";

function TimelineComponent(props) {
  const { model, time } = props;
  const timelineElRef = useRef(null);
  const [timeline, setTimeline] = useState(undefined);

  useEffect(() => {
    let newTimeline = null;
    // On component init
    console.log('timelineElRef.current', timelineElRef.current);
    if (timelineElRef.current) {
      
      newTimeline = new Timeline({ id: timelineElRef.current });
      // Here you can subscribe on timeline component events
      setTimeline(newTimeline);
    }

    // cleanup on component unmounted.
    return () => newTimeline?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineElRef.current]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    timeline?.setModel(model);
  }, [model, timeline]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    if (time || time === 0) {
      timeline?.setTime(time);
    }
  }, [time, timeline]);

  return <div style={{ width: "100%", height: '100%'}} ref={timelineElRef} />;
}

export default TimelineComponent;