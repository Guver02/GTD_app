import { useContext } from "react";
import { LanguageContext } from "../providers/LaguageContext";

function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("Language not exist");
  }

  return context;
}

export {useLanguage};
