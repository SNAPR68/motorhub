"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";

const MAX_COMPARE = 3;

interface CompareState {
  ids: string[];
}

type CompareAction =
  | { type: "ADD"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

function reducer(state: CompareState, action: CompareAction): CompareState {
  switch (action.type) {
    case "ADD": {
      if (state.ids.includes(action.id)) return state;
      if (state.ids.length >= MAX_COMPARE) return state;
      return { ids: [...state.ids, action.id] };
    }
    case "REMOVE":
      return { ids: state.ids.filter((id) => id !== action.id) };
    case "CLEAR":
      return { ids: [] };
    default:
      return state;
  }
}

interface CompareContextValue {
  compareIds: string[];
  isInCompare: (id: string) => boolean;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  compareCount: number;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { ids: [] });

  const isInCompare = useCallback(
    (id: string) => state.ids.includes(id),
    [state.ids]
  );

  const addToCompare = useCallback(
    (id: string) => dispatch({ type: "ADD", id }),
    []
  );

  const removeFromCompare = useCallback(
    (id: string) => dispatch({ type: "REMOVE", id }),
    []
  );

  const clearCompare = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <CompareContext.Provider
      value={{
        compareIds: state.ids,
        isInCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
        compareCount: state.ids.length,
        isFull: state.ids.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
