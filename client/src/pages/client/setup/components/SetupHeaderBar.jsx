const SetupHeaderBar = ({ currentStep, totalSteps }) => (
  <header className="p-2 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
    <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4">
      <h1 className="text-xl font-bold text-gray-900">Profile Setup</h1>
      <p className="text-sm font-medium text-gray-600">
        Step {currentStep} / {totalSteps}
      </p>
    </div>
  </header>
);

export default SetupHeaderBar;
