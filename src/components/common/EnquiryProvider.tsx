import { useCallback, useMemo, useState, type ReactNode } from "react";

import EnquiryModal from "./EnquiryModal";
import { EnquiryContext } from "../../hooks/useEnquiry";

interface EnquiryState {
  open: boolean;
  /** Bumped on every open so the form re-mounts with fresh, pre-filled state. */
  session: number;
  category?: string;
  product?: string;
}

/** Holds the one enquiry popup for the whole site, so any page can open it. */
function EnquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EnquiryState>({
    open: false,
    session: 0,
  });

  const openEnquiry = useCallback((category?: string, product?: string) => {
    setState((current) => ({
      open: true,
      session: current.session + 1,
      category,
      product,
    }));
  }, []);

  const closeEnquiry = useCallback(() => {
    setState((current) => ({ ...current, open: false }));
  }, []);

  const value = useMemo(
    () => ({ openEnquiry, closeEnquiry }),
    [openEnquiry, closeEnquiry],
  );

  return (
    <EnquiryContext.Provider value={value}>
      {children}

      <EnquiryModal
        key={state.session}
        open={state.open}
        onClose={closeEnquiry}
        category={state.category}
        product={state.product}
      />
    </EnquiryContext.Provider>
  );
}

export default EnquiryProvider;
