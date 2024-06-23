"use client";
import React, { use, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import { convertDateToString } from "@/lib/utils";

type Props = {
  data: {
    createdAt: Date;
    count: number;
  }[];
};

const panelColors = {
  0: "#4b515c",
  8: "#7BC96F",
  4: "#C6E48B",
  12: "#239A3B",
  32: "#196127",
};

const HeatMapDisplay = (props: Props) => {
  const formatedDates = props.data.map((item) => ({
    date: convertDateToString(item.createdAt),
    count: item.count,
  }));
  const [range, setRange] = useState(5);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (
    e: React.MouseEvent<SVGRectElement>,
    count: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipTop = rect.top - 10;
    const tooltipLeft = rect.left + rect.width / 2;
    setTooltipContent(`count: ${count || 0}`);
    setTooltipPos({ top: tooltipTop, left: tooltipLeft });
    setTooltipVisible(true);
  };
  const handleMouseExit = () => {
    setTooltipVisible(false);
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max="5"
        step="0.1"
        value={range}
        onChange={(e) => setRange(parseFloat(e.target.value))}
      />{" "}
      {range}
      <HeatMap
        value={formatedDates}
        width="93%"
        style={{ color: "#888" }}
        startDate={new Date("2024/01/01")}
        panelColors={panelColors}
        rectProps={{
          rx: range,
        }}
        rectRender={(props, data) => {
          return (
            <rect
              {...props}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => handleMouseEnter(e, data.count)}
              onMouseLeave={handleMouseExit}
            />
          );
        }}
      />
      {tooltipVisible && (
        <div
          style={{
            position: "fixed",
            top: tooltipPos.top,
            left: tooltipPos.left,
            backgroundColor: "black",
            textAlign: "center",
            color: "white",
            padding: "3px",
            borderRadius: "3px",
            zIndex: "999",
            opacity: "0.8",
            transform: "translate(-50%, -100%)",
          }}
          className="w-"
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default HeatMapDisplay;
