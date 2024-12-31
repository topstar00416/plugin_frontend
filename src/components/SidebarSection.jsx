import React, { useState } from "react";

const SidebarSection = ({
  title,
  items = [],
  isExpanded: defaultExpanded = false,
  setSubSection = (f) => f,
  setMainSection = (f) => f,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // console.log("item------------->", items);
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-50"
      >
        <span className="text-sm font-medium">{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && items.length > 0 && (
        <div className="ml-2 flex flex-col gap-1">
          {items.map((item, index) => (
            <button
              key={index + 1}
              className="flex items-center gap-2 p-2 rounded-md text-sm"
              onClick={() => {
                setSubSection(item.subSectionName);
                setMainSection(title);
              }}
            >
              <span>{item.subSectionName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;
