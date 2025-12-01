"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocumentCanvas, DocumentForm, PreviewNavigation } from "@/components/merge-editor";
import { SaveDesignModal } from "@/components/ui/save-design-modal";
import { useAuth } from "@/components/layout/auth-provider";
import {
  useDocumentEditor,
  useDatasetImport,
  useDocumentExport,
  usePreviewMode,
  useSaveDesign,
} from "@/hooks";

export default function CreatePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Document editing state and handlers
  const {
    document,
    activeField,
    selectField,
    updateField,
    addField,
    removeField,
    handleThemeChange,
    handleDocumentTypeChange,
    handleReset,
    handleFieldChange,
    syncFieldsToHeaders,
  } = useDocumentEditor();

  // Dataset import handling
  const {
    datasetRows,
    importSummary,
    importError,
    isImportingDataset,
    handleDatasetImport,
  } = useDatasetImport({
    fieldCount: document.fields.length,
    onHeadersImported: syncFieldsToHeaders,
  });

  // Document export handling
  const {
    isExporting,
    exportError,
    canExport,
    handleExportDocuments,
  } = useDocumentExport({
    document,
    datasetRows,
  });

  // Preview mode handling
  const {
    isPreviewMode,
    previewRecordIndex,
    currentPreviewData,
    handleTogglePreview,
    handleRecordChange,
  } = usePreviewMode({
    datasetRows,
  });

  // Save design handling
  const {
    showSaveModal,
    savingStatus,
    handleOpenSaveModal,
    handleCloseSaveModal,
    handleSaveSubmit,
  } = useSaveDesign({
    document,
  });

  // Auth redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/create");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone border-t-terracotta" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        {/* Preview Navigation Bar */}
        <PreviewNavigation
          isPreviewMode={isPreviewMode}
          onTogglePreview={handleTogglePreview}
          currentRecord={previewRecordIndex}
          totalRecords={datasetRows.length}
          onRecordChange={handleRecordChange}
          hasData={datasetRows.length > 0}
        />

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,400px)] lg:items-start">
          <div className="order-1 lg:order-0">
            <DocumentCanvas
              document={document}
              activeField={activeField}
              previewMode={isPreviewMode}
              previewData={currentPreviewData}
              onSelectField={selectField}
              onFieldPositionChange={updateField}
            />
          </div>

          <div className="order-2 lg:order-0">
            <DocumentForm
              document={document}
              activeFieldId={activeField}
              onSelectField={selectField}
              onFieldChange={handleFieldChange}
              onAddField={addField}
              onRemoveField={removeField}
              onThemeChange={handleThemeChange}
              onDocumentTypeChange={handleDocumentTypeChange}
              onReset={handleReset}
              onImportDataset={handleDatasetImport}
              importSummary={importSummary}
              importError={importError}
              isImportingDataset={isImportingDataset}
              canExport={canExport}
              onExportDocuments={handleExportDocuments}
              isExportingDocuments={isExporting}
              exportError={exportError}
              isAuthenticated={isAuthenticated}
              onSaveDesign={handleOpenSaveModal}
            />
          </div>
        </section>
      </div>

      {/* Save Design Modal */}
      <SaveDesignModal
        isOpen={showSaveModal}
        onClose={handleCloseSaveModal}
        onSave={handleSaveSubmit}
      />

      {/* Save Status Toast */}
      {savingStatus && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up rounded-lg border border-sage/30 bg-sage-light px-5 py-3 text-sm font-medium text-ink shadow-soft">
          {savingStatus}
        </div>
      )}
    </div>
  );
}
