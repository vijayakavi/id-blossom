import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useKYC } from '@/contexts/KYCContext';

const Success = () => {
  const navigate = useNavigate();
  const { isKYCComplete, aadhaar, pan, business, resetKYC } = useKYC();

  if (!isKYCComplete) {
    navigate('/aadhaar');
    return null;
  }

  const handleDownloadCertificate = () => {
    // Mock download - in real app, would generate PDF certificate
    const blob = new Blob(
      [
        `KYC Verification Certificate\n\n` +
        `Status: Verified ✓\n` +
        `Date: ${new Date().toLocaleDateString()}\n\n` +
        `Aadhaar: ${aadhaar.digiLockerUsed ? 'Verified via DigiLocker' : `${aadhaar.aadhaarNumber}`}\n` +
        `PAN: ${pan.panNumber}\n` +
        `Business: ${business.businessName}\n` +
        `Registration: ${business.registrationNumber}\n` +
        (business.gstin ? `GSTIN: ${business.gstin}\n` : '')
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kyc-certificate.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    resetKYC();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-verified-light flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl animate-fade-in">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-success flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">KYC Completed Successfully! 🎉</h1>
            <p className="text-lg text-muted-foreground">
              Your identity verification is complete
            </p>
          </div>

          <div className="bg-muted rounded-lg p-6 space-y-3 text-left">
            <h2 className="font-semibold text-lg mb-4">Verification Summary</h2>
            
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-verified flex-shrink-0" />
              <div>
                <p className="font-medium">Aadhaar Verification</p>
                <p className="text-sm text-muted-foreground">
                  {aadhaar.digiLockerUsed ? 'Verified via DigiLocker' : `Number: ${aadhaar.aadhaarNumber}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-verified flex-shrink-0" />
              <div>
                <p className="font-medium">PAN Verification</p>
                <p className="text-sm text-muted-foreground">Number: {pan.panNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-verified flex-shrink-0" />
              <div>
                <p className="font-medium">Business Verification</p>
                <p className="text-sm text-muted-foreground">{business.businessName}</p>
                <p className="text-xs text-muted-foreground">Reg: {business.registrationNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleDownloadCertificate} size="lg" className="flex-1">
              <Download className="mr-2 h-5 w-5" />
              Download Certificate
            </Button>
            <Button onClick={handleStartOver} variant="outline" size="lg" className="flex-1">
              <Home className="mr-2 h-5 w-5" />
              Start Over
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Verification completed on {new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
