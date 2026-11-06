import { type ReactNode } from "react";

export interface SearchSuggestionsPanelProps {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  /** Runs a search for this text (recent and trending searches). */
  onSubmitQuery: (value: string) => void;
  /** Live suggestions for what's typed, shown instead of the panel's starting content. */
  top?: ReactNode;
}
