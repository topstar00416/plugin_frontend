import React, { useState, useEffect } from "react";
import SlideCard from "../components/SlideCard";
import PresentationTextArea from "../components/PresentationTextArea";
import SidebarSection from "../components/SidebarSection";
import Sidebar from "../components/Sidebar";

import mockup from "../../mockup.json";

const CreateSlides = () => {
  const [activeButton, setActiveButton] = useState(window.localStorage.getItem("appState"));
  const [activeTab, setActiveTab] = useState("found");
  const [step, setStep] = useState("first");
  const [deck, setDeck] = useState(mockup.storylineSlides.sections);
  const [mainSection, setMainSection] = useState(mockup.storylineSlides.sections[0].sectionName);
  const [subSection, setSubSection] = useState(mockup.storylineSlides.sections[0].subSections[0].subSectionName);

  const [selectSlides, setSelectSlides] = useState([]);

  const tabs = [
    { id: "found", label: "Found styles" },
    { id: "selected", label: "Selected slides" },
  ];

  useEffect(() => {
    // Remove the loading animation when component is mounted
    const loadingElement = document.querySelector(".loading-wave");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }, []);

  useEffect(() => {
    console.log("my_log", selectSlides);
  }, [selectSlides]);

  return (
    <div className="h-screen w-screen">
      <div className="absolute bg-white overflow-y-auto shadow-lg w-full h-full">
        <Sidebar activeButton={activeButton} setActiveButton={setActiveButton} />

        <div
          className={
            step === "first"
              ? "ml-[200px] mr-[200px] min-h-screen bg-white flex flex-col z-0 flex justify-center items-center pt-[100px]"
              : "ml-[100px] mr-[240px] min-h-screen bg-white flex flex-col z-0 flex justify-center items-center "
          }
        >
          <div className="w-[80%]">
            <div className="flex-1 p-4 w-full overflow-y-auto">
              {/* Search and Filter */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-between mb-6 w-[100%]">
                  <PresentationTextArea step={step} setStep={setStep} />
                </div>
              </div>

              {/* Tabs */}
              {step === "second" && (
                <div className="flex gap-6 border-b border-[#E6E6EA]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-1 py-2 text-sm font-medium transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? "text-[#00BEC0] border-b-2 border-[#00BEC0] -mb-[1px]"
                        : "text-[#666666] hover:text-[#333333]"
                    }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid Content */}
              {activeTab === "found" && (
                <div
                  className={`
                ${
                  step === "first"
                    ? "flex flex-row overflow-x-auto gap-2 pb-4 hide-scrollbar"
                    : "flex flex-col overflow-y-auto grid grid-cols-3 gap-2 pb-4 hide-scrollbar mt-[20px]"
                }
              `}
                >
                  {(mainSection
                    ? mockup.storylineSlides.sections
                        .find((item) => item.sectionName === mainSection)
                        .subSections.find((item) => item.subSectionName === subSection).slides
                    : mockup.storylineSlides.sections[0].subSections[0].slides
                  ).map((slide, index) => {
                    console.log("my_log_slide", slide);
                    return (
                      <div
                        key={slide.slideId}
                        className={`
                    ${step === "first" ? "flex-shrink-0 w-[180px]" : ""}
                  `}
                      >
                        <SlideCard
                          slide={slide}
                          setSelectSlides={setSelectSlides}
                          selectSlides={selectSlides}
                          mainSection={mainSection}
                          subSection={subSection}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {activeTab === "selected" && (
                <div className="flex flex-col overflow-y-auto grid grid-cols-3 gap-2 pb-4 hide-scrollbar mt-[20px]">
                  {selectSlides?.map((slide, index) => (
                    <div key={slide.slideId}>
                      <div className="group flex flex-col justify-center items-center transform transition-transform duration-100 active:scale-95">
                        <div
                          className="rounded-lg overflow-hidden bg-white border border-[#E6E6EA] 
                            transition-all duration-200 hover:border-[#00BEC0] hover:shadow-md"
                        >
                          <div className="aspect-[16/9] w-full">
                            <img src={slide.presignedUrl} alt={slide.fileId} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex items-center gap-2 mx-1 ml-2">
                            <span className="text-sm text-[#666666]">{slide.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectSlides.length === 0 && <h1>No slides selected</h1>}
                </div>
              )}
            </div>

            {/* Bottom Buttons */}
            {step === "second" && (
              <div className="sticky bottom-0 w-full border-t border-[#e6e6ea] bg-white p-4 flex justify-end">
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-md border border-[#00BEC0] text-[#00BEC0] hover:bg-[#f0fafa] transition-colors">
                    AI edits
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-[#00BEC0] text-white hover:bg-[#00a5a7] transition-colors"
                    onClick={() => setDeck(selectSlides)}
                  >
                    Insert to deck
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        {step === "second" && (
          <div className="w-[240px] right-0 h-full fixed top-0 border-l border-[#e6e6ea] bg-white p-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-medium">Content Structure</h3>

              {deck.map((section, index) => (
                <SidebarSection
                  key={index + 1}
                  title={section.sectionName}
                  items={section.subSections}
                  isExpanded={index === 0} // First section expanded by default
                  setMainSection={setMainSection}
                  setSubSection={setSubSection}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSlides;
