import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  path: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
}

const ProgressStepper = ({ currentStep, steps }: ProgressStepperProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    isCompleted && 'bg-verified text-white',
                    isCurrent && 'bg-primary text-primary-foreground',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium transition-colors',
                    (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-all duration-300',
                    isCompleted ? 'bg-verified' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
