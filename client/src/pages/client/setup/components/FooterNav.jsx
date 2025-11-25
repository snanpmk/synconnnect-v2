import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import DotsPagination from "./DotsPagination";

const FooterNav = ({
  currentStep,
  totalSteps,
  goToPrevStep,
  handleNextStep,
  isPending,
  currentStepError,
  handleSubmit,
  onSubmit,
  stepsConfig,
  setCurrentStep,
}) => (
  <footer className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-2xl z-30">
    <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4">
      {/* Previous */}
      <button
        type="button"
        onClick={goToPrevStep}
        disabled={currentStep === 1 || isPending}
        className={`flex items-center px-3 py-2 text-sm rounded-lg font-semibold transition-all duration-300 border border-gray-200 shadow-sm ${
          currentStep === 1 || isPending
            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Pagination */}
      <DotsPagination
        stepsConfig={stepsConfig}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* Next or Submit */}
      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={handleNextStep}
          disabled={isPending}
          className="flex items-center px-3 py-2 text-sm rounded-lg text-white font-semibold transition-all duration-300 shadow-md bg-primary hover:bg-lime-700 disabled:bg-gray-400"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleSubmit(onSubmit)()}
          disabled={!!currentStepError || isPending}
          className={`flex items-center px-4 py-2 text-sm rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
            !currentStepError && !isPending
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-1" /> Finish
            </>
          )}
        </button>
      )}
    </div>
  </footer>
);

export default FooterNav;
