import React from "react";
import { LuCheck } from "react-icons/lu";

// Use generics to ensure currentStep is one of the strings in the steps array
interface StepperProps<T extends string> {
  steps: readonly T[];
  currentStep: T;
}

export const Stepper = <T extends string>({
  steps,
  currentStep,
}: StepperProps<T>) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <nav
      className="flex w-full items-start justify-between"
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <React.Fragment key={step}>
            {/* The Step (Icon + Label) */}
            <div className="flex flex-col items-center text-center min-w-20 flex-1 relative">
              {index < steps.length - 1 && (
                <div
                  className={` absolute w-full left-1/2
                  grow h-0.5 mt-3 
                  transition-all duration-300
                  ${isComplete ? "bg-brand-primary" : "bg-gray-200"}
                `}
                />
              )}

              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center 
                  font-bold transition-all duration-300 relative
                  ${
                    isComplete
                      ? "bg-brand-primary border-2 border-brand-primary"
                      : ""
                  }
                  ${isCurrent ? "bg-white border-2 border-brand-primary" : ""}
                  ${isPending ? "bg-white border-2 border-gray-200" : ""}
                `}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isComplete && <LuCheck className="w-4 h-4 text-white" />}
                {isCurrent && (
                  <div className="w-2.5 h-2.5 bg-brand-primary rounded-full" />
                )}
              </div>

              {/* Step Label */}
              <div
                className={`
                  mt-2 text-xs font-medium
                  ${isCurrent ? "text-brand-primary font-semibold" : ""}
                  ${isComplete ? "text-gray-800" : ""}
                  ${isPending ? "text-gray-400" : ""}
                `}
              >
                {step}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Stepper;
