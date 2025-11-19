import { create } from "zustand";

const useProfileSetupStore = create((set) => ({
  currentStep: 1,
  totalSteps: 5,
  validationErrors: {},

  goToNextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      validationErrors: {},
    })),
  goToPrevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
      validationErrors: {},
    })),
  setCurrentStep: (step) =>
    set((state) => ({
      currentStep: Math.max(1, Math.min(step, state.totalSteps)),
      validationErrors: {},
    })),
  setValidationError: (stepId, message) =>
    set((state) => ({
      validationErrors: { ...state.validationErrors, [stepId]: message },
    })),
}));

export default useProfileSetupStore;
