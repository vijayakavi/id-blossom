// Mock KYC verification services

interface VerificationResult {
  success: boolean;
  message: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const kycService = {
  // Aadhaar verification via DigiLocker
  async verifyAadhaarDigiLocker(): Promise<VerificationResult> {
    await delay(2000);
    // Mock successful verification
    return {
      success: true,
      message: 'Aadhaar verified successfully via DigiLocker',
    };
  },

  // Manual Aadhaar verification
  async verifyAadhaar(aadhaarNumber: string): Promise<VerificationResult> {
    await delay(1500);
    
    // Basic validation
    if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
      return {
        success: false,
        message: 'Invalid Aadhaar number. Must be 12 digits.',
      };
    }

    // Mock successful verification
    return {
      success: true,
      message: 'Aadhaar verified successfully',
    };
  },

  // PAN verification
  async verifyPAN(panNumber: string): Promise<VerificationResult> {
    await delay(1500);
    
    // PAN format: ABCDE1234F
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!panRegex.test(panNumber)) {
      return {
        success: false,
        message: 'Invalid PAN format. Expected format: ABCDE1234F',
      };
    }

    // Mock successful verification
    return {
      success: true,
      message: 'PAN verified successfully',
    };
  },

  // Business verification
  async verifyBusiness(
    businessName: string,
    registrationNumber: string,
    gstin?: string
  ): Promise<VerificationResult> {
    await delay(2000);
    
    if (!businessName || businessName.length < 3) {
      return {
        success: false,
        message: 'Business name must be at least 3 characters',
      };
    }

    if (!registrationNumber || registrationNumber.length < 5) {
      return {
        success: false,
        message: 'Invalid registration number',
      };
    }

    // Optional GSTIN validation
    if (gstin) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(gstin)) {
        return {
          success: false,
          message: 'Invalid GSTIN format',
        };
      }
    }

    // Mock successful verification
    return {
      success: true,
      message: 'Business details verified successfully',
    };
  },

  // Upload business document
  async uploadDocument(file: File): Promise<VerificationResult> {
    await delay(1000);
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: 'File size must be less than 5MB',
      };
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Only PDF and image files are allowed',
      };
    }

    // Mock successful upload
    return {
      success: true,
      message: 'Document uploaded successfully',
    };
  },
};
