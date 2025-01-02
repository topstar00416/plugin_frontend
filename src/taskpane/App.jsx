import React, { useCallback, useEffect, useState } from "react";
import taskpane from "./taskpane";

export default function App() {
  const [mode, setMode] = useState(null);

  const showDialog = async (inputMode) => {
    try {
      const dialogUrl = "https://localhost:3000/textDialog.html";
      const dialogOptions = {
        width: 75, // 1230:65 - 1212
        height: 75, // 602:65 - 754
        displayInIframe: false,
        title: "Insert",
      };

      Office.context.ui.displayDialogAsync(dialogUrl, dialogOptions, (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          console.error(`Dialog failed to open: ${result.error.message}`);
          return;
        }

        setMode(inputMode);

        const dialog = result.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, async (args) => {
          try {
            if (args.message && args.message !== "CANCEL") {
              await taskpane.showModal(args.message);
            }
          } catch (error) {
            console.error("Error handling dialog message:", error);
          } finally {
            dialog.close();
          }
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
