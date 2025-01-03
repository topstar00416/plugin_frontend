import React, { useCallback, useEffect, useState } from "react";
import taskpane from "./taskpane";

export default function App() {
  const [mode, setMode] = useState(null);

  const showDialog = async (inputMode) => {
    try {
      const dialogUrl = "https://localhost:3000/textDialog.html";
      const dialogOptions = {
        width: 75,
        height: 75,
        displayInIframe: true,
        title: "Insert",
      };

      // First set the mode so the dialog knows what to display
      setMode(inputMode);
      window.localStorage.setItem("appState", inputMode);

      Office.context.ui.displayDialogAsync(dialogUrl, dialogOptions, (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          console.error(`Dialog failed to open: ${result.error.message}`);
          return;
        }

        const dialog = result.value;
        
        // Handle messages from dialog
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, async (args) => {
          try {
            console.log("Message received from dialog:", args.message);

            const parsedMsg = JSON.parse(args.message)
            console.log(parsedMsg)
            if (parsedMsg && parsedMsg.type === 'insertSlide') {
              console.log("Inserting slide");
              // Handle the slide insertion here in the taskpane
              await PowerPoint.run(async (context) => {
                const presentation = context.presentation;
                
                // Get the current slides collection
                const slides = presentation.slides;
                slides.load("items");
                await context.sync();
                
                // Add new slide at the end
                const newSlide = slides.add({
                  position: slides.items.length
                });
                
                await context.sync();
                console.log("Slide added successfully");
              });
            }
          } catch (error) {
            console.error("Error handling dialog message:", error);
          } finally {
            dialog.close();
          }
        });

        // Handle dialog closed event
        dialog.addEventHandler(Office.EventType.DialogEventReceived, (arg) => {
          console.log("Dialog event received:", arg);
        });
      });
    } catch (error) {
      console.error("Error showing dialog:", error);
    }
  };

  useEffect(() => {
    if (mode) {
      window.localStorage.setItem("appState", mode);
    }
  }, [mode]);

  const renderHeader = () => (
    <header className="flex items-center mb-5">
      <button className="text-2xl p-2 transition-transform active:scale-90">☰</button>
      <h1 className="ml-2 text-2xl text-[#00A4A6]">Cordial</h1>
    </header>
  );

  const renderSearchBar = () => (
    <div className="mb-4">
      <button
        className="w-full p-4 rounded-lg bg-[#00BEC0] text-white flex items-center gap-2 justify-center
          transition-all hover:shadow-md active:scale-[0.98]"
        onClick={() => showDialog("search")}
      >
        {/* <span className="opacity-80 text-lg">🔍</span> */}
        Search Slides
      </button>
    </div>
  );

  const renderCreateButton = () => (
    <button
      className="w-full p-4 rounded-lg bg-white shadow-sm flex items-center justify-center gap-3 
      transition-all hover:shadow-md active:scale-[0.98]"
      onClick={() => showDialog("create")}
    >
      <span className="text-gray-600">+</span>
      Create Slides
    </button>
  );

  const renderChatInput = () => (
    <div className="relative mt-4">
      <textarea
        placeholder="Ask for any changes..."
        className="w-full min-h-[150px] p-4 rounded-lg bg-white shadow-sm resize-none 
          text-sm outline-none transition-all focus:scale-[1.01] focus:shadow-md"
      />
      <button
        className="absolute bottom-3 left-3 text-xl opacity-60 transition-all 
        hover:opacity-100 active:scale-90"
      >
        💬
      </button>
    </div>
  );

  return (
    <div className="w-full mx-auto p-4 min-h-screen bg-[#FAFAFA]">
      {renderHeader()}
      {renderSearchBar()}
      {renderCreateButton()}
      {renderChatInput()}
    </div>
  );
}
