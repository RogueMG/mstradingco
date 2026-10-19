import { createContext, useContext } from "react";

export interface EnquiryContextValue {
  /** Opens the site-wide enquiry form, optionally pre-filled with a category and product. */
  openEnquiry: (category?: string, product?: string) => void;
  closeEnquiry: () => void;
}

export const EnquiryContext = createContext<EnquiryContextValue | null>(null);

/** Opens the shared enquiry popup rendered by EnquiryProvider in the layout. */
export function useEnquiry(): EnquiryContextValue {
  const context = useContext(EnquiryContext);

  if (!context) {
    throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  }

  return context;
}
