"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DocumentCanvas } from "@/components/merge-editor/document-canvas";
import { SaveDesignModal } from "@/components/ui/save-design-modal";
import { PrintPreviewModal } from "@/components/ui/print-preview-modal";
import { useAuth } from "@/components/layout/auth-provider";
import { documentTypeList, getDocumentTypeConfig } from "@/lib/document-types";
import { accentPalette, backgroundGradients } from "@/lib/document";
import type { BackgroundKey } from "@/types/document";
import { useDocumentEditor } from "@/hooks/use-document-editor";
import { useDatasetImport } from "@/hooks/use-dataset-import";
import { usePreviewMode } from "@/hooks/use-preview-mode";
import { useSaveDesign } from "@/hooks/use-save-design";
import "./press-notes-editor.css";

const MAX_RAIL_RECORDS = 150;

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

  const [isPrintPreviewOpen, setPrintPreviewOpen] = useState(false);
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

  // Annotation layer ("Show notes" per the Press Notes anatomy)
  const [notesVisible, setNotesVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/create");
    }
  }, [isLoading, isAuthenticated, router]);

  // Alt + arrow keys page through connected records while previewing
  useEffect(() => {
    if (!isPreviewMode || datasetRows.length === 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleRecordChange(
          Math.min(previewRecordIndex + 1, datasetRows.length - 1)
        );
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleRecordChange(Math.max(previewRecordIndex - 1, 0));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPreviewMode, datasetRows.length, previewRecordIndex, handleRecordChange]);

  const handlePickFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        void handleDatasetImport(file);
      }
      event.target.value = "";
    },
    [handleDatasetImport]
  );

  const handleRecordClick = useCallback(
    (index: number) => {
      handleRecordChange(index);
      if (!isPreviewMode) {
        handleTogglePreview();
      }
    },
    [handleRecordChange, isPreviewMode, handleTogglePreview]
  );

  const handleViewTemplate = useCallback(() => {
    if (isPreviewMode) {
      handleTogglePreview();
    }
  }, [isPreviewMode, handleTogglePreview]);

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

  const config = getDocumentTypeConfig(document.documentType);
  const activeFieldData = document.fields.find(
    (field) => field.id === activeField
  );
  const headers = importSummary?.headers ?? [];
  const railRecords = datasetRows.slice(0, MAX_RAIL_RECORDS);
  const backgroundKeys = Object.keys(backgroundGradients) as BackgroundKey[];

  return (
    <div className="pn-app">
      {/* Issue header */}
      <header className="pn-ed-header">
        <Link href="/">Mail Buddy</Link>
        <span>
          {importSummary
            ? `${importSummary.fileName} / ${datasetRows.length} rows`
            : "No sheet connected / template mode"}
        </span>
        <nav aria-label="Editor actions">
          <button
            type="button"
            className="pn-ed-pink"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImportingDataset}
          >
            {isImportingDataset ? "Reading file…" : "Import data"}
          </button>
          <button type="button" onClick={() => setNotesVisible((v) => !v)}>
            {notesVisible ? "Hide notes" : "Show notes"}
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <button type="button" onClick={handleOpenSaveModal}>
            Save design
          </button>
          <button
            type="button"
            className="pn-ed-dark"
            onClick={() => setPrintPreviewOpen(true)}
            disabled={!canPrint}
          >
            Preview &amp; print
          </button>
        </nav>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handlePickFile}
          className="hidden"
          aria-label="Import CSV or Excel file"
        />
      </header>

      {/* Editorial title block */}
      <section className="pn-ed-title">
        <div>
          <span>Visual document editor</span>
          <div className="pn-ed-types" role="tablist" aria-label="Document type">
            {documentTypeList.map((type, index) => (
              <button
                key={type.id}
                type="button"
                role="tab"
                aria-selected={document.documentType === type.id}
                className={document.documentType === type.id ? "on" : ""}
                onClick={() => handleDocumentTypeChange(type.id)}
              >
                <i>{String(index + 1).padStart(2, "0")}</i>
                {type.label}
              </button>
            ))}
          </div>
        </div>
        <h1>
          {config.label}
          <br />
          breakdown.
        </h1>
        <p>
          A living editorial system for{" "}
          <i>
            {datasetRows.length
              ? `${datasetRows.length} record${datasetRows.length === 1 ? "" : "s"}.`
              : "your list."}
          </i>
          <br />
          One carefully considered composition.
        </p>
      </section>

      {/* Contents index / document sheet / properties */}
      <section className="pn-ed-board">
        <div className="pn-ed-index">
          <span>Contents</span>
          {document.fields.map((field, index) => (
            <button
              key={field.id}
              type="button"
              className={`${field.id === activeField ? "on" : ""} ${
                field.visible ? "" : "is-hidden"
              }`}
              onClick={() => selectField(field.id)}
            >
              {String(index + 1).padStart(2, "0")} /{" "}
              {field.name || `Field ${index + 1}`}
            </button>
          ))}
          <button type="button" className="pn-ed-add" onClick={addField}>
            + Add field
          </button>
          <p>Every annotation maps to a reusable document field.</p>
        </div>

        <div className="pn-ed-stage">
          {importError && (
            <p className="pn-ed-error" role="alert">
              ■ {importError}
            </p>
          )}
          <DocumentCanvas
            document={document}
            activeField={activeField}
            previewMode={isPreviewMode}
            previewData={currentPreviewData}
            notesVisible={notesVisible && !isPreviewMode}
            onSelectField={selectField}
            onFieldPositionChange={updateField}
          />
          <p className="pn-ed-status">
            {isPreviewMode ? (
              <>
                Viewing record{" "}
                <i>{String(previewRecordIndex + 1).padStart(3, "0")}</i> / live
                merged data · Alt + arrows to page
              </>
            ) : (
              <>Template mode / drag fields to reposition</>
            )}
          </p>
        </div>

        <aside className="pn-ed-properties">
          {activeFieldData ? (
            <>
              <span>Field / {activeFieldData.name || "Untitled"}</span>
              <h2>{activeFieldData.name || "Untitled field"}</h2>
              <p className="pn-ed-token">{activeFieldData.text || "—"}</p>

              <label>
                Field name
                <input
                  type="text"
                  value={activeFieldData.name}
                  onChange={(event) =>
                    handleFieldChange(activeFieldData.id, {
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Content — {"{{ Field }}"} merges data
                <input
                  type="text"
                  value={activeFieldData.text}
                  onChange={(event) =>
                    handleFieldChange(activeFieldData.id, {
                      text: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Size (px)
                <input
                  type="number"
                  min={8}
                  max={96}
                  value={activeFieldData.fontSize}
                  onChange={(event) =>
                    handleFieldChange(activeFieldData.id, {
                      fontSize: Number(event.target.value) || 8,
                    })
                  }
                />
              </label>

              <label>
                Ink
                <span className="pn-ed-ink-row">
                  <input
                    type="color"
                    value={activeFieldData.color}
                    onChange={(event) =>
                      handleFieldChange(activeFieldData.id, {
                        color: event.target.value,
                      })
                    }
                    aria-label="Field ink color"
                  />
                  <b>{activeFieldData.color}</b>
                </span>
              </label>

              <button
                type="button"
                className="pn-ed-row-btn"
                onClick={() =>
                  handleFieldChange(activeFieldData.id, {
                    visible: !activeFieldData.visible,
                  })
                }
              >
                {activeFieldData.visible ? "Hide on sheet" : "Show on sheet"}
              </button>
              <button
                type="button"
                className="pn-ed-row-btn pn-ed-delete"
                onClick={() => removeField(activeFieldData.id)}
                disabled={document.fields.length <= 1}
              >
                Delete field
              </button>

              <div className="pn-rule" />

              <label>
                Alignment
                <span className="pn-ed-seg">
                  {(["left", "center", "right"] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      className={document.textAlign === align ? "on" : ""}
                      onClick={() => handleThemeChange({ textAlign: align })}
                    >
                      {align}
                    </button>
                  ))}
                </span>
              </label>

              <label>
                Background
                <span className="pn-ed-seg">
                  {backgroundKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={document.background === key ? "on" : ""}
                      onClick={() => handleThemeChange({ background: key })}
                    >
                      {key}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={document.background === "custom" ? "on" : ""}
                    onClick={() => handleThemeChange({ background: "custom" })}
                  >
                    Custom
                  </button>
                </span>
              </label>

              {document.background === "custom" && (
                <label>
                  Custom paper
                  <span className="pn-ed-ink-row">
                    <input
                      type="color"
                      value={document.customBackground}
                      onChange={(event) =>
                        handleThemeChange({
                          customBackground: event.target.value,
                        })
                      }
                      aria-label="Custom background color"
                    />
                    <b>{document.customBackground}</b>
                  </span>
                </label>
              )}

              <label>
                Accent
                <span className="pn-ed-swatches">
                  {accentPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={document.accent === color ? "on" : ""}
                      style={{ backgroundColor: color }}
                      onClick={() => handleThemeChange({ accent: color })}
                      aria-label={`Select accent color ${color}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={document.accent}
                    onChange={(event) =>
                      handleThemeChange({ accent: event.target.value })
                    }
                    aria-label="Custom accent color"
                  />
                </span>
              </label>

              <div className="pn-rule" />

              <small>Founder note</small>
              <blockquote>
                &ldquo;Clarity can still have a sense of humor.&rdquo;
              </blockquote>
            </>
          ) : (
            <>
              <span>Field / none selected</span>
              <h2>Pick a field</h2>
              <p className="pn-ed-token">
                Select an entry in the contents index to edit it here.
              </p>
            </>
          )}
        </aside>
      </section>

      {/* Connected-sheet rail */}
      <footer className="pn-ed-data">
        <div className="pn-ed-data-meta">
          <span>Connected sheet</span>
          <b>
            {datasetRows.length
              ? `${datasetRows.length} row${datasetRows.length === 1 ? "" : "s"}`
              : "Nothing yet"}
          </b>
          {datasetRows.length > 0 && (
            <button
              type="button"
              className={!isPreviewMode ? "on" : ""}
              onClick={handleViewTemplate}
            >
              View template
            </button>
          )}
        </div>

        <div className="pn-ed-records">
          {railRecords.length === 0 ? (
            <button
              type="button"
              className="pn-ed-import"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImportingDataset}
            >
              + Connect a CSV / XLSX — recipient columns become merge fields
            </button>
          ) : (
            <>
              {railRecords.map((row, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    isPreviewMode && previewRecordIndex === index ? "on" : ""
                  }
                  onClick={() => handleRecordClick(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{row[headers[0]] || "—"}</b>
                  <small>{row[headers[1]] || ""}</small>
                </button>
              ))}
              {datasetRows.length > MAX_RAIL_RECORDS && (
                <span className="pn-ed-more">
                  +{datasetRows.length - MAX_RAIL_RECORDS} more
                </span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          className="pn-ed-generate"
          onClick={() => setPrintPreviewOpen(true)}
          disabled={!canPrint}
        >
          Generate issue -&gt;
        </button>
      </footer>

      {/* Save Design Modal */}
      <SaveDesignModal
        isOpen={showSaveModal}
        onClose={handleCloseSaveModal}
        onSave={handleSaveSubmit}
      />

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setPrintPreviewOpen(false)}
        documentData={document}
        datasetRows={datasetRows}
      />

      {/* Save Status Toast */}
      {savingStatus && <div className="pn-ed-toast">{savingStatus}</div>}
    </div>
  );
}
