import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  addLanguageToPerson,
  deleteLanguageFromPerson,
  getLanguagesOfPerson,
  updateLanguageOfPerson,
  getAvailableLanguages,
} from "../services/lenguageService";

import { getItems } from "../services/itemService";

export const useLanguage = () => {
  const [languages, setLanguages] = useState([]);
  const [optionsLanguages, setOptionsLanguages] = useState([]);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);

  const fetchAvailableLanguages = async (personCod) => {
    try {
      const data = await getAvailableLanguages(personCod);
      const formattedData = data.map((item) => ({
        ...item,
        label: item.item_name,
        value: item.cod_item,
        name: item.item_name,
        placeholder: item.item_name,
      }));
      setAvailableLanguages(formattedData);
    } catch (error) {
      console.error("Error fetching available languages:", error);
    }
  };

  const fetchLanguages = async (personCod) => {
    try {
      console.log("Fetching languages for personCod:", personCod);

      const data = await getLanguagesOfPerson(personCod);
      setLanguages(data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const fetchLanguageOptions = async () => {
    try {
      const categoryCode = Number(import.meta.env.VITE_LANGUAGE_CATEGORY_CODE);
      const serviceCode = Number(import.meta.env.VITE_ROLE_SERVICE_CODE);
      const items = await getItems(serviceCode, categoryCode);

      const formattedItems = items.map((item) => ({
        ...item,
        label: item.item_name,
        value: item.cod_item,
        name: item.item_name,
        placeholder: item.item_name,
      }));

      setOptionsLanguages(formattedItems);
    } catch (error) {
      console.error("Error fetching language options:", error);
    }
  };

  const addLanguage = async (languageData, personCod) => {
    try {
      const formatedData = {
        ...languageData,
        language_service_cod: Number(import.meta.env.VITE_ROLE_SERVICE_CODE),
        language_category_cod: Number(
          import.meta.env.VITE_LANGUAGE_CATEGORY_CODE
        ),
      };

      await addLanguageToPerson(formatedData, personCod);
      await fetchLanguages(personCod);
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };

  const editLanguage = async (languageCod, updatedData, personCod) => {
    try {
      await updateLanguageOfPerson(languageCod, updatedData);
      await fetchLanguages(personCod);
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  const deleteLanguage = async (languageCod, personCod) => {
    try {
      await deleteLanguageFromPerson(languageCod, personCod);
      await fetchLanguages(personCod);
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  const dominionLevels = [
    { label: "Básico", value: "Básico" },
    { label: "Intermedio", value: "Intermedio" },
    { label: "Avanzado", value: "Avanzado" },
    { label: "Nativo", value: "Nativo" },
  ];

  const fields = [
    {
      name: "language_cod",
      label: "Código",
      type: "text",
      width: 100,
      placeholder: "Código",
      disabled: true,
    },
    {
      name: "language_item_cod",
      label: "Lenguaje",
      type: "select",
      options: availableLanguages,
      width: 300,
      placeholder: "Seleccione un lenguaje",
    },
    {
      name: "language_level",
      label: "Nivel de Dominio",
      type: "select",
      placeholder: "Seleccione un nivel",
      options: dominionLevels,
      width: 300,
    },
  ];

  return {
    optionsLanguages,
    languages,
    fetchLanguages,
    addLanguage,
    editLanguage,
    deleteLanguage,
    isAddingLanguage,
    setIsAddingLanguage,
    fetchLanguageOptions,
    fields,
    fetchAvailableLanguages,
    availableLanguages,
    isEditingLanguage,
    setIsEditingLanguage,
  };
};
