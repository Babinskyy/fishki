import { useState, useCallback } from "react";
import type { FlashcardCreateDto, FlashcardsCreateCommand } from "../../types";
import type { FlashcardProposalViewModel } from "./useFlashcardGeneration";

/**
 * Custom hook for handling flashcard saving functionality
 */
export function useFlashcardSave(generationId: number | null) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /**
   * Creates the payload for saving flashcards
   */
  const createFlashcardsPayload = useCallback(
    (flashcards: FlashcardProposalViewModel[], onlyAccepted: boolean): FlashcardsCreateCommand => {
      const cardsToSave = onlyAccepted ? flashcards.filter((card) => card.accepted) : flashcards;

      return {
        flashcards: cardsToSave.map(
          (card) =>
            ({
              front: card.front,
              back: card.back,
              source: card.source,
              generation_id: generationId,
            }) as FlashcardCreateDto
        ),
      };
    },
    [generationId]
  );

  /**
   * Reset all state related to saving
   */
  const resetSaveState = useCallback(() => {
    setSaveError(null);
    setSaveSuccess(false);
  }, []);

  /**
   * Handle API errors with user-friendly messages
   */
  const handleApiError = useCallback((error: any) => {
    // For network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return "Network error. Please check your internet connection and try again.";
    }

    // For general API errors
    return "Failed to save flashcards. Please try again later.";
  }, []);

  /**
   * Handles saving flashcards to the database
   */
  const saveFlashcards = useCallback(
    async (flashcards: FlashcardProposalViewModel[], onlyAccepted: boolean) => {
      // Handle missing generation ID
      if (!generationId) {
        setSaveError("Missing generation ID. Please try again.");
        return;
      }

      // Reset state
      resetSaveState();
      setIsSaving(true);

      try {
        // Prepare the payload
        const payload = createFlashcardsPayload(flashcards, onlyAccepted);

        // Validation check
        if (payload.flashcards.length === 0) {
          setSaveError("No flashcards selected for saving.");
          setIsSaving(false);
          return;
        }

        // Call the API
        const response = await fetch("/api/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // Handle response
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));

          const errorMsg = data.details
            ? `${data.error}: ${data.details.map((e: any) => e.message).join(", ")}`
            : data.error || "An unexpected error occurred";

          setSaveError(errorMsg);
          return;
        }

        // Handle successful save
        setSaveSuccess(true);
      } catch (err) {
        console.error("Failed to save flashcards:", err);
        setSaveError(handleApiError(err));
      } finally {
        setIsSaving(false);
      }
    },
    [generationId, createFlashcardsPayload, resetSaveState, handleApiError]
  );

  return {
    // State
    isSaving,
    saveError,
    saveSuccess,

    // Actions
    saveFlashcards,
    resetSaveState,
  };
}
