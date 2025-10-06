import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, FileText, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useKYC } from '@/contexts/KYCContext';

const Index = () => {
  const navigate = useNavigate();
  const { aadhaar, pan, business, isKYCComplete } = useKYC();

  const getNextStep = () => {
    if (!aadhaar.verified) return '/aadhaar';
    if (!pan.verified) return '/pan';
    if (!business.verified) return '/business';
    return '/success';
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'Bank-grade encryption for all your documents',
    },
    {
      icon: CheckCircle,
      title: 'Quick Process',
      description: 'Complete KYC in under 5 minutes',
    },
    {
      icon: FileText,
      title: 'Digital Documents',
      description: 'DigiLocker integration for instant verification',
    },
  ];

  const steps = [
    { name: 'Aadhaar', completed: aadhaar.verified },
    { name: 'PAN', completed: pan.verified },
    { name: 'Business', completed: business.verified },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">KYC Verification</h1>
              <p className="text-xs text-muted-foreground">Secure Identity Verification</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Complete Your KYC Verification
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fast, secure, and hassle-free identity verification for your business
            </p>
          </div>

          {isKYCComplete ? (
            <Card className="max-w-md mx-auto shadow-lg border-verified">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">KYC Complete!</h3>
                  <p className="text-muted-foreground">All verification steps completed</p>
                </div>
                <Button onClick={() => navigate('/success')} size="lg" className="w-full">
                  View Certificate
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card className="max-w-md mx-auto shadow-lg">
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Verification Progress</h3>
                    {steps.map((step, index) => (
                      <div key={step.name} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-verified text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {step.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>
                        <span
                          className={
                            step.completed ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }
                        >
                          {step.name} Verification
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button onClick={() => navigate(getNextStep())} size="lg" className="w-full">
                    {aadhaar.verified || pan.verified || business.verified
                      ? 'Continue Verification'
                      : 'Start KYC Process'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {features.map((feature) => (
                  <Card key={feature.title} className="text-center shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 KYC Verification System. All rights reserved.</p>
          <p className="mt-1">Your data is encrypted and secure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
