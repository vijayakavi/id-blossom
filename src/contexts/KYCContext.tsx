import React, { createContext, useContext, useState, useEffect } from 'react';

interface AadhaarData {
  aadhaarNumber?: string;
  verified: boolean;
  digiLockerUsed?: boolean;
}

interface PANData {
  panNumber?: string;
  verified: boolean;
}

interface BusinessData {
  businessName?: string;
  registrationNumber?: string;
  gstin?: string;
  documentUrl?: string;
  verified: boolean;
}

interface KYCContextType {
  aadhaar: AadhaarData;
  pan: PANData;
  business: BusinessData;
  updateAadhaar: (data: Partial<AadhaarData>) => void;
  updatePAN: (data: Partial<PANData>) => void;
  updateBusiness: (data: Partial<BusinessData>) => void;
  resetKYC: () => void;
  isKYCComplete: boolean;
}

const KYCContext = createContext<KYCContextType | undefined>(undefined);

const initialState = {
  aadhaar: { verified: false },
  pan: { verified: false },
  business: { verified: false },
};

export const KYCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aadhaar, setAadhaar] = useState<AadhaarData>(initialState.aadhaar);
  const [pan, setPAN] = useState<PANData>(initialState.pan);
  const [business, setBusiness] = useState<BusinessData>(initialState.business);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKYC = localStorage.getItem('kycData');
    if (savedKYC) {
      const data = JSON.parse(savedKYC);
      setAadhaar(data.aadhaar || initialState.aadhaar);
      setPAN(data.pan || initialState.pan);
      setBusiness(data.business || initialState.business);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('kycData', JSON.stringify({ aadhaar, pan, business }));
  }, [aadhaar, pan, business]);

  const updateAadhaar = (data: Partial<AadhaarData>) => {
    setAadhaar((prev) => ({ ...prev, ...data }));
  };

  const updatePAN = (data: Partial<PANData>) => {
    setPAN((prev) => ({ ...prev, ...data }));
  };

  const updateBusiness = (data: Partial<BusinessData>) => {
    setBusiness((prev) => ({ ...prev, ...data }));
  };

  const resetKYC = () => {
    setAadhaar(initialState.aadhaar);
    setPAN(initialState.pan);
    setBusiness(initialState.business);
    localStorage.removeItem('kycData');
  };

  const isKYCComplete = aadhaar.verified && pan.verified && business.verified;

  return (
    <KYCContext.Provider
      value={{
        aadhaar,
        pan,
        business,
        updateAadhaar,
        updatePAN,
        updateBusiness,
        resetKYC,
        isKYCComplete,
      }}
    >
      {children}
    </KYCContext.Provider>
  );
};

export const useKYC = () => {
  const context = useContext(KYCContext);
  if (context === undefined) {
    throw new Error('useKYC must be used within a KYCProvider');
  }
  return context;
};
