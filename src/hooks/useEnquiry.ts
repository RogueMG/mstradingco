import { useCallback, useState } from "react";

interface EnquiryState {
  open: boolean;
  category?: string;
  product?: string;
}

export function useEnquiry() {
  const [state, setState] = useState<EnquiryState>({
    open: false,
  });

  const openEnquiry = useCallback(
    (category?: string, product?: string) => {
      setState({
        open: true,
        category,
        product,
      });
    },
    [],
  );

  const closeEnquiry = useCallback(() => {
    setState({
      open: false,
    });
  }, []);

  return {
    ...state,
    openEnquiry,
    closeEnquiry,
  };
}