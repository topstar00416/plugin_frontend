import React from "react";

const PresentationTextArea = ({ step, setStep }) => {
  return (
    <div className="relative flex-1">
      <div className="text-sm font-bold text-[#666666] mb-2">Describe the presentation you would like</div>
      <div className="relative">
        <textarea
          type="text"
          placeholder="Search for slides by typing down the content or the visuals"
          className={`
              ${
                step === "first"
                  ? "w-full h-[200px] px-4 pr-10 py-2 bg-[#F5F5F5] rounded-lg text-sm outline-none focus:border-[#00BEC0] transition-all duration-200"
                  : "w-full h-[130px] px-4 pr-10 py-2 bg-[#F5F5F5] rounded-lg text-sm outline-none focus:border-[#00BEC0] transition-all duration-200"
              }`}
        ></textarea>
        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">0/100000 characters</span>
          <div className="flex gap-2">
            <button className="p-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button
              className="bg-[#00BEC0] text-white px-4 py-1 rounded-md hover:bg-[#00a5a7] transition-colors"
              onClick={() => {
                if (step === "first") {
                  setStep("second");
                }
              }}
            >
              {step === "first" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationTextArea;