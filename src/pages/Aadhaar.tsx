import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, FileCheck } from 'lucide-react';
import KYCLayout from '@/components/KYCLayout';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useKYC } from '@/contexts/KYCContext';
import { kycService } from '@/services/kycService';
import { useToast } from '@/hooks/use-toast';

const Aadhaar = () => {
  const navigate = useNavigate();
  const { aadhaar, updateAadhaar } = useKYC();
  const { toast } = useToast();
  
  const [aadhaarNumber, setAadhaarNumber] = useState(aadhaar.aadhaarNumber || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDigiLockerLoading, setIsDigiLockerLoading] = useState(false);

  const handleDigiLockerVerify = async () => {
    setIsDigiLockerLoading(true);
    try {
      const result = await kycService.verifyAadhaarDigiLocker();
      if (result.success) {
        updateAadhaar({ verified: true, digiLockerUsed: true });
        toast({
          title: 'Success',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify via DigiLocker',
        variant: 'destructive',
      });
    } finally {
      setIsDigiLockerLoading(false);
    }
  };

  const handleManualVerify = async () => {
    if (!aadhaarNumber) {
      toast({
        title: 'Error',
        description: 'Please enter your Aadhaar number',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await kycService.verifyAadhaar(aadhaarNumber);
      if (result.success) {
        updateAadhaar({ aadhaarNumber, verified: true, digiLockerUsed: false });
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
    if (!aadhaar.verified) {
      toast({
        title: 'Verification Required',
        description: 'Please verify your Aadhaar before proceeding',
        variant: 'destructive',
      });
      return;
    }
    navigate('/pan');
  };

  return (
    <KYCLayout currentStep={1}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Aadhaar Verification</CardTitle>
          <CardDescription>
            Verify your identity using your Aadhaar card
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {aadhaar.verified ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <VerifiedBadge />
              </div>
              <p className="text-center text-muted-foreground">
                {aadhaar.digiLockerUsed
                  ? 'Verified via DigiLocker'
                  : `Aadhaar Number: ${aadhaar.aadhaarNumber}`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Button
                  onClick={handleDigiLockerVerify}
                  disabled={isDigiLockerLoading}
                  className="w-full h-14 text-base"
                  size="lg"
                >
                  {isDigiLockerLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting to DigiLocker...
                    </>
                  ) : (
                    <>
                      <FileCheck className="mr-2 h-5 w-5" />
                      Verify via DigiLocker
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or verify manually</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="Enter 12-digit Aadhaar number"
                    value={aadhaarNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                      setAadhaarNumber(value);
                    }}
                    maxLength={12}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your 12-digit Aadhaar number without spaces
                  </p>
                </div>

                <Button
                  onClick={handleManualVerify}
                  disabled={isVerifying || aadhaarNumber.length !== 12}
                  variant="outline"
                  className="w-full h-12"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Aadhaar'
                  )}
                </Button>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleNext} size="lg" disabled={!aadhaar.verified}>
              Next: PAN Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    </KYCLayout>
  );
};

export default Aadhaar;
