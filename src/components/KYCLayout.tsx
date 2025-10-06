import { Shield } from 'lucide-react';
import ProgressStepper from './ProgressStepper';

const steps = [
  { id: 1, name: 'Aadhaar', path: '/aadhaar' },
  { id: 2, name: 'PAN', path: '/pan' },
  { id: 3, name: 'Business', path: '/business' },
];

interface KYCLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

const KYCLayout = ({ children, currentStep }: KYCLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">KYC Verification</h1>
              <p className="text-sm text-muted-foreground">Secure Identity Verification</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressStepper currentStep={currentStep} steps={steps} />
        <div className="mt-8">{children}</div>
      </main>

      <footer className="border-t mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 KYC Verification System. All rights reserved.</p>
          <p className="mt-1">Your data is encrypted and secure.</p>
        </div>
      </footer>
    </div>
  );
};

export default KYCLayout;
