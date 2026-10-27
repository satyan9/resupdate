import React from 'react';
import { Upload, BarChart3, Sparkles } from 'lucide-react';

export default function Stepper({ currentStep, setStep, canGoToStep2, canGoToStep3 }) {
  const steps = [
    { id: 1, title: "1. Upload & Job Description", icon: Upload },
    { id: 2, title: "2. ATS Gap Analysis", icon: BarChart3, enabled: canGoToStep2 },
    { id: 3, title: "3. 95% Tailored Resume", icon: Sparkles, enabled: canGoToStep3 }
  ];

  return (
    <nav className="stepper-nav" aria-label="Workflow progress">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isClickable = step.id === 1 || step.enabled;

        return (
          <React.Fragment key={step.id}>
            <div 
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isClickable && setStep(step.id)}
              style={{ cursor: isClickable ? 'pointer' : 'not-allowed', opacity: isClickable ? 1 : 0.5 }}
            >
              <div className="step-num">
                {isCompleted ? '✓' : step.id}
              </div>
              <span>{step.title}</span>
            </div>
            {idx < steps.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
