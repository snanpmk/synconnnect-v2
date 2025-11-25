const DotsPagination = ({ stepsConfig, currentStep, setCurrentStep }) => (
  <div className="flex space-x-2">
    {stepsConfig.map((step) => {
      const isCurrent = step.id === currentStep;
      const isComplete = step.id < currentStep;

      return (
        <div
          key={step.id}
          className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
            isCurrent
              ? "bg-primary-hover-dark scale-110 shadow-md"
              : isComplete
              ? "bg-primary hover:bg-primary-hover"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setCurrentStep(step.id)}
          title={step.title}
        ></div>
      );
    })}
  </div>
);

export default DotsPagination;
