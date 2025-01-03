import React, { useState, useEffect } from "react";
import SlideCard from "../components/SlideCard";
import PresentationTextArea from "../components/PresentationTextArea";
import SidebarSection from "../components/SidebarSection";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";

const CreateSlides = () => {
  const [activeButton, setActiveButton] = useState(window.localStorage.getItem("appState"));
  const [activeTab, setActiveTab] = useState("found");
  const [step, setStep] = useState("first");

  const [createdDeck, setCreatedDeck] = useState(null);
  const [deck, setDeck] = useState(null);
  const [mainSection, setMainSection] = useState(null);
  const [subSection, setSubSection] = useState(null);

  const [selectSlides, setSelectSlides] = useState([]);
  const [insertData, setInsertData] = useState([]);

  const tabs = [
    { id: "found", label: "Found slides" },
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
    // Message handler for dialog communication
    const messageHandler = async (event) => {
      if (event.data.type === 'insertSlide') {
        try {
          // Make sure Office is ready
          await Office.onReady();
          
          await PowerPoint.run(async (context) => {
            const presentation = context.presentation;
            
            // Get the current slides collection
            const slides = presentation.slides;
            slides.load("items");
            await context.sync();
            
            // Get the first slide master and layout
            const masterSlides = presentation.slideMasters;
            masterSlides.load("items");
            await context.sync();
            
            const firstMaster = masterSlides.items[0];
            firstMaster.layouts.load("items");
            await context.sync();
            
            // Use the first layout (usually blank)
            const layout = firstMaster.layouts.items[0];
            
            // Add new slide at the end
            const newSlide = slides.add({
              position: slides.items.length
            });
            
            await context.sync();
            console.log("Slide added successfully");
          });
        } catch (error) {
          console.error("Error adding slide:", error);
          // Log more detailed error information
          if (error.debugInfo) {
            console.error("Debug info:", error.debugInfo);
          }
        }
      }
    };

    // Add message listener
    window.addEventListener('message', messageHandler);

    // Cleanup
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const createDeck = (payload) => {
    api
      .post("/decks/", payload)
      .then((res) => {
        console.log("Create Deck Response: ", res.data);
        setCreatedDeck(res.data);
        setDeck(res.data.storylineSlides.sections);
        setMainSection(res.data.storylineSlides.sections[0].sectionName);
        setSubSection(res.data.storylineSlides.sections[0].subSections[0].subSectionName);
        setStep("second");
      })
      .catch((err) => {
        console.log("Create Deck Error: ", err);
      });
  };

  const createPowerPointSlides = async (deck) => {
    try {
      await PowerPoint.run(async (context) => {
        const presentation = context.presentation;

        for (const slideData of deck) {
          // Add a new slide and get its reference
          const slideMaster = presentation.slideMasters.getItemAt(0);
          const layout = slideMaster.layouts.getItemAt(0); // Get the first layout
          const newSlide = presentation.slides.addSlide(0, layout); // Specify layout

          // Load and sync before adding content
          newSlide.load("id");
          await context.sync();

          // Add texts
          slideData.texts.forEach((text, index) => {
            if (text) {
              try {
                const textBox = newSlide.shapes.addTextBox(text);
                // Position text boxes at different locations based on index
                switch (index) {
                  case 0: // First text
                    textBox.left = 50;
                    textBox.top = 50;
                    break;
                  case 1: // Second text
                    textBox.left = 50;
                    textBox.top = 100;
                    break;
                  case 2: // Third text
                    textBox.left = 50;
                    textBox.top = 150;
                    break;
                  case 3: // Fourth text
                    textBox.left = 50;
                    textBox.top = 200;
                    break;
                  default:
                    textBox.left = 50;
                    textBox.top = 50 + index * 50;
                }

                // Style the text
                textBox.width = 400;
                textBox.height = 40;
                const textRange = textBox.textFrame.textRange;
                textRange.font.size = 18;
                textRange.font.color = "#000000";
              } catch (e) {
                console.error(`Error adding text ${index}:`, e);
              }
            }
          });

          // Add images if any
          slideData.images.forEach((imageBase64, index) => {
            if (imageBase64) {
              try {
                const image = newSlide.shapes.addImage(`data:image/png;base64,${imageBase64}`);
                // Position image after text
                image.left = 50;
                image.top = 250;
                image.width = 400;
                image.height = 300;
              } catch (e) {
                console.error(`Error adding image ${index}:`, e);
              }
            }
          });

          await context.sync(); // Sync after each slide
        }
      });

      console.log("Slides created successfully!");
    } catch (error) {
      console.error("Error creating slides:", error);
    }
  };

  const insertToDeck = (payload) => {
    try {
      // Get the dialog object using Office.context.ui
      const messageObject = {
        type: 'insertSlide',
        // payload: payload
      };

      // Use Office Dialog API to send message to parent
      Office.context.ui.messageParent(JSON.stringify(messageObject));
      
      console.log("Message sent to taskpane:", messageObject);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
                  <PresentationTextArea step={step} setStep={setStep} createDeck={createDeck} />
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
                  {(mainSection && subSection
                    ? deck
                        ?.find((item) => item.sectionName === mainSection)
                        ?.subSections.find((item) => item.subSectionName === subSection).slides || []
                    : deck
                      ? deck[0].subSections[0].slides
                      : []
                  ).map((slide, index) => (
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
                  ))}
                </div>
              )}
              {activeTab === "selected" && (
                <div className="flex flex-col overflow-y-auto grid grid-cols-3 gap-2 pb-4 hide-scrollbar mt-[20px]">
                  {selectSlides?.map((slide, index) => (
                    <div key={slide.slideId}>
                      <SlideCard
                        slide={slide}
                        setSelectSlides={setSelectSlides}
                        selectSlides={selectSlides}
                        mainSection={slide.mainSection}
                        subSection={slide.subSection}
                      />
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
                    onClick={() => {
                      insertToDeck({
                        file_name: "mckinsey.pptx",
                        slides: selectSlides.map((item) => ({
                          slide_id: item.slideId,
                          file_id: item.fileId,
                        })),
                      });
                    }}
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

              {deck?.map((section, index) => (
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
