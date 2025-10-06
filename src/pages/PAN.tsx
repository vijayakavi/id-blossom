import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import KYCLayout from '@/components/KYCLayout';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useKYC } from '@/contexts/KYCContext';
import { kycService } from '@/services/kycService';
import { useToast } from '@/hooks/use-toast';

const PAN = () => {
  const navigate = useNavigate();
  const { aadhaar, pan, updatePAN } = useKYC();
  const { toast } = useToast();
  
  const [panNumber, setPanNumber] = useState(pan.panNumber || '');
  const [isVerifying, setIsVerifying] = useState(false);

  // Redirect if Aadhaar not verified
  if (!aadhaar.verified) {
    navigate('/aadhaar');
    return null;
  }

  const handleVerify = async () => {
    if (!panNumber) {
      toast({
        title: 'Error',
        description: 'Please enter your PAN number',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await kycService.verifyPAN(panNumber);
      if (result.success) {
        updatePAN({ panNumber: panNumber.toUpperCase(), verified: true });
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        toast({
          title: 'Verification Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during verification',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (!pan.verified) {
      toast({
        title: 'Verification Required',
        description: 'Please verify your PAN before proceeding',
        variant: 'destructive',
      });
      return;
    }
    navigate('/business');
  };

  const formatPAN = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  };

  return (
    <KYCLayout currentStep={2}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">PAN Verification</CardTitle>
          <CardDescription>
            Verify your Permanent Account Number (PAN)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {pan.verified ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <VerifiedBadge />
              </div>
              <p className="text-center text-muted-foreground">
                PAN Number: {pan.panNumber}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  type="text"
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(formatPAN(e.target.value))}
                  maxLength={10}
                  className="h-12 text-base font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)
                </p>
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying || panNumber.length !== 10}
                className="w-full h-12"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying PAN...
                  </>
                ) : (
                  'Verify PAN'
                )}
              </Button>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button onClick={() => navigate('/aadhaar')} variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} size="lg" disabled={!pan.verified}>
              Next: Business Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </KYCLayout>
  );
};

export default PAN;
