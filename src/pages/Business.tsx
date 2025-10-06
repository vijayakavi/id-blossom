import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Upload, FileText } from 'lucide-react';
import KYCLayout from '@/components/KYCLayout';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useKYC } from '@/contexts/KYCContext';
import { kycService } from '@/services/kycService';
import { useToast } from '@/hooks/use-toast';

const Business = () => {
  const navigate = useNavigate();
  const { aadhaar, pan, business, updateBusiness } = useKYC();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    businessName: business.businessName || '',
    registrationNumber: business.registrationNumber || '',
    gstin: business.gstin || '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if previous steps not verified
  if (!aadhaar.verified || !pan.verified) {
    navigate('/aadhaar');
    return null;
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await kycService.uploadDocument(file);
      if (result.success) {
        setUploadedFile(file);
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        toast({
          title: 'Upload Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerify = async () => {
    if (!formData.businessName || !formData.registrationNumber) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: 'Error',
        description: 'Please upload a business proof document',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await kycService.verifyBusiness(
        formData.businessName,
        formData.registrationNumber,
        formData.gstin || undefined
      );
      
      if (result.success) {
        updateBusiness({
          ...formData,
          verified: true,
          documentUrl: URL.createObjectURL(uploadedFile),
        });
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

  const handleComplete = () => {
    if (!business.verified) {
      toast({
        title: 'Verification Required',
        description: 'Please verify your business details before proceeding',
        variant: 'destructive',
      });
      return;
    }
    navigate('/success');
  };

  return (
    <KYCLayout currentStep={3}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Business Verification</CardTitle>
          <CardDescription>
            Provide your business details and upload verification documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {business.verified ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <VerifiedBadge />
              </div>
              <div className="space-y-2 text-center text-muted-foreground">
                <p><strong>Business Name:</strong> {business.businessName}</p>
                <p><strong>Registration No:</strong> {business.registrationNumber}</p>
                {business.gstin && <p><strong>GSTIN:</strong> {business.gstin}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">
                  Business Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Registration Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="registrationNumber"
                  type="text"
                  placeholder="Enter business registration number"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstin">
                  GSTIN <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="gstin"
                  type="text"
                  placeholder="Enter GSTIN (15 characters)"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  maxLength={15}
                  className="h-12 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Business Proof Document <span className="text-destructive">*</span>
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 mx-auto text-success" />
                      <p className="text-sm font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          variant="outline"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Choose File'
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PDF or images (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleVerify}
                disabled={
                  isVerifying ||
                  !formData.businessName ||
                  !formData.registrationNumber ||
                  !uploadedFile
                }
                className="w-full h-12"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Business...
                  </>
                ) : (
                  'Verify Business Details'
                )}
              </Button>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button onClick={() => navigate('/pan')} variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleComplete} size="lg" disabled={!business.verified}>
              Complete KYC
            </Button>
          </div>
        </CardContent>
      </Card>
    </KYCLayout>
  );
};

export default Business;
