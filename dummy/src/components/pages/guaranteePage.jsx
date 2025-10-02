import React from "react";
import { useGuarantees } from "../../utils/useGuarantees";
import GuaranteesTable from "../organisms/guaranteeTable";

const GuaranteePage = () => {
  const {
    guaranteesList,
    fields,
    STATUS_OPTIONS,
    CURRENCY_OPTIONS,
    CATEGORY_OPTIONS,
    loading,
    NOTIFIED_OPTIONS,
    handleEditGuarantee,
    handleDeleteGuarantee,
    handleSearchGuarantees,
    searchFields,
  } = useGuarantees();

  return (
       <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Garantías
      </h1>
      <GuaranteesTable
        data={guaranteesList}
        fields={fields}
        STATUS_OPTIONS={STATUS_OPTIONS}
        CURRENCY_OPTIONS={CURRENCY_OPTIONS}
        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        NOTIFIED_OPTIONS={NOTIFIED_OPTIONS}
        singularName="Garantía"
        isLoading={loading}
        onEdit={handleEditGuarantee}
        onDelete={handleDeleteGuarantee}
        handleSearch={handleSearchGuarantees}
        searchFields={searchFields}
      />
    </div>
  );
};

export default GuaranteePage;