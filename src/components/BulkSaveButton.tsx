import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Save, SaveAll } from "lucide-react";
import { useFlashcardSave } from "./hooks/useFlashcardSave";
import type { FlashcardProposalViewModel } from "./hooks/useFlashcardGeneration";
import ErrorNotification from "./ErrorNotification";

interface BulkSaveButtonProps {
  flashcards: FlashcardProposalViewModel[];
  generationId: number | null;
  onSaveComplete?: () => void;
}

const BulkSaveButton = ({ flashcards, generationId, onSaveComplete }: BulkSaveButtonProps) => {
  // Use our custom hook for saving functionality
  const { isSaving, saveError, saveSuccess, saveFlashcards } = useFlashcardSave(generationId);

  // Calculate counts for display and button state
  const acceptedCount = useMemo(() => flashcards.filter((card) => card.accepted).length, [flashcards]);

  const totalCount = flashcards.length;

  // Call onSaveComplete callback when save is successful
  useMemo(() => {
    if (saveSuccess && onSaveComplete) {
      onSaveComplete();
    }
  }, [saveSuccess, onSaveComplete]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          {acceptedCount}/{totalCount} flashcards approved
        </div>

        <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            onClick={() => saveFlashcards(flashcards, true)}
            disabled={isSaving || acceptedCount === 0}
            aria-label="Save only approved flashcards"
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Approved
            {isSaving && acceptedCount > 0 && (
              <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
          </Button>

          <Button
            onClick={() => saveFlashcards(flashcards, false)}
            disabled={isSaving || totalCount === 0}
            aria-label="Save all flashcards"
            className="w-full sm:w-auto"
          >
            <SaveAll className="h-4 w-4 mr-2" />
            Save All
            {isSaving && acceptedCount === 0 && (
              <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
          </Button>
        </div>
      </div>

      {saveError && <ErrorNotification message={saveError} title="Save Error" />}

      {saveSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-300 p-4 rounded-md">
          <p className="font-medium">Success!</p>
          <p className="text-sm">Flashcards have been saved successfully.</p>
        </div>
      )}
    </div>
  );
};

export default BulkSaveButton;
