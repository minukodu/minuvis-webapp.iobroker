import { createContext } from "react";

export const ContextData = createContext({
  data: null,
  setContextData: () => {}
});
