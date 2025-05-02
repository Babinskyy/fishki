import TextInputArea from "./TextInputArea";
import SkeletonLoader from "./SkeletonLoader";
import ErrorNotification from "./ErrorNotification";
import FlashcardList from "./FlashcardList";
import BulkSaveButton from "./BulkSaveButton";
import { useFlashcardGeneration } from "./hooks/useFlashcardGeneration";
import { useState } from "react";

const FlashcardGenerationView = () => {
  // Use our custom hook for generation functionality
  const {
    sourceText,
    setSourceText,
    isLoading,
    error,
    generationId,
    flashcardProposals,
    generateFlashcards,
    handleAcceptToggle,
    handleEdit,
    handleRemove,
  } = useFlashcardGeneration();

  // Additional UI state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle save completion
  const handleSaveComplete = () => {
    setSuccessMessage("Flashcards saved successfully!");

    // Optionally clear success message after some time
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Text input area with validation */}
      <TextInputArea
        value={sourceText}
        onChange={setSourceText}
        isLoading={isLoading}
        onGenerate={generateFlashcards}
      />

      {/* Error display */}
      {error && <ErrorNotification message={error} />}

      {/* Success message display */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-300 p-4 rounded-md">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <SkeletonLoader />}

      {/* Results display */}
      {!isLoading && flashcardProposals.length > 0 && (
        <div className="space-y-8">
          <FlashcardList
            flashcards={flashcardProposals}
            onAccept={handleAcceptToggle}
            onEdit={handleEdit}
            onRemove={handleRemove}
            generationId={generationId}
          />

          <BulkSaveButton
            flashcards={flashcardProposals}
            generationId={generationId}
            onSaveComplete={handleSaveComplete}
          />
        </div>
      )}

      {/* Empty state - when no flashcards and not loading */}
      {!isLoading && flashcardProposals.length === 0 && sourceText.length >= 1000 && (
        <div className="text-center py-8 border border-dashed rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            Enter your text above and click &apos;Generate Flashcards&apos; to create flashcards.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerationView;
