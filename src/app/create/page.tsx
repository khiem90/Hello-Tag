"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocumentCanvas, DocumentForm, PreviewNavigation } from "@/components/merge-editor";
import { SaveDesignModal } from "@/components/ui/save-design-modal";
import { PrintPreviewModal } from "@/components/ui/print-preview-modal";
import { useAuth } from "@/components/layout/auth-provider";
import {
  useDocumentEditor,
  useDatasetImport,
  usePreviewMode,
  useSaveDesign,
  usePrintPreview,
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

  // Print preview handling
  const {
    isOpen: isPrintPreviewOpen,
    handleOpenPrintPreview,
    handleClosePrintPreview,
  } = usePrintPreview();

  const canPrint = datasetRows.length > 0;

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
      <div className="flex min-h-screen items-center justify-center bg-sage">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-sage px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        {/* Editorial title block */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="pn-eyebrow text-muted-ink">Mail Buddy — Merge editor</p>
            <h1 className="pn-display-l mt-1 text-ink">The working file</h1>
          </div>
          <p className="pn-hand -rotate-2 text-muted-ink">
            every note left in on purpose
          </p>
        </header>

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
              canPrint={canPrint}
              onOpenPrintPreview={handleOpenPrintPreview}
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

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={handleClosePrintPreview}
        documentData={document}
        datasetRows={datasetRows}
      />

      {/* Save Status Toast */}
      {savingStatus && (
        <div className="pn-eyebrow fixed bottom-6 right-6 z-50 animate-fade-up rounded-none border border-ink bg-cream px-5 py-3 text-ink shadow-paper">
          {savingStatus}
        </div>
      )}
    </div>
  );
}
