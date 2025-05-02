import { useState, useCallback } from "react";
import type { GenerateFlashcardsCommand, GenerationCreateResponseDto, FlashcardProposalDto } from "../../types";

/**
 * Extended flashcard proposal model with UI state
 */
export interface FlashcardProposalViewModel extends FlashcardProposalDto {
  accepted: boolean;
  edited: boolean;
}

/**
 * Custom hook for handling flashcard generation API interactions and state
 */
export function useFlashcardGeneration() {
  // Text input state
  const [sourceText, setSourceText] = useState("");

  // API interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<number | null>(null);

  // Flashcards state
  const [flashcardProposals, setFlashcardProposals] = useState<FlashcardProposalViewModel[]>([]);

  /**
   * Handle API errors with user-friendly messages
   */
  const handleApiError = useCallback((error: any) => {
    // For network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return "Network error. Please check your internet connection and try again.";
    }

    // For general API errors
    return "Failed to generate flashcards. Please try again later.";
  }, []);

  /**
   * Handles the flashcard generation process
   */
  const generateFlashcards = useCallback(async () => {
    // Input validation
    if (sourceText.length < 1000) {
      setError(`Text must contain at least 1000 characters. Current length: ${sourceText.length}`);
      return;
    }

    if (sourceText.length > 10000) {
      setError(`Text cannot exceed 10000 characters. Current length: ${sourceText.length}`);
      return;
    }

    // Reset any previous errors and set loading state
    setError(null);
    setIsLoading(true);

    try {
      // Prepare the request payload
      const payload: GenerateFlashcardsCommand = {
        source_text: sourceText,
      };

      // Call the API
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse the response
      const data = await response.json().catch(() => ({}));

      // Handle error responses
      if (!response.ok) {
        // Format error message from API response
        const errorMsg = data.details
          ? `${data.error}: ${data.details.map((e: any) => e.message).join(", ")}`
          : data.error || "An unexpected error occurred";
        setError(errorMsg);
        return;
      }

      // Handle successful response
      const result = data as GenerationCreateResponseDto;
      setGenerationId(result.generation_id);

      // Transform API response to view model with acceptance state
      const viewModelProposals = result.flashcards_proposals.map((proposal) => ({
        ...proposal,
        accepted: true, // Default to accepted
        edited: false, // Not edited by default
      }));

      setFlashcardProposals(viewModelProposals);
    } catch (err) {
      // Handle unexpected errors
      console.error("Failed to generate flashcards:", err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, handleApiError]);

  /**
   * Handles accepting/rejecting a flashcard proposal
   */
  const handleAcceptToggle = useCallback((index: number) => {
    setFlashcardProposals((prev) =>
      prev.map((proposal, i) => (i === index ? { ...proposal, accepted: !proposal.accepted } : proposal))
    );
  }, []);

  /**
   * Handles editing a flashcard proposal
   */
  const handleEdit = useCallback((index: number, front: string, back: string) => {
    setFlashcardProposals((prev) =>
      prev.map((proposal, i) =>
        i === index
          ? {
              ...proposal,
              front,
              back,
              edited: true,
              source: "ai-edited" as const,
            }
          : proposal
      )
    );
  }, []);

  /**
   * Handles removing a flashcard proposal
   */
  const handleRemove = useCallback((index: number) => {
    setFlashcardProposals((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    // State
    sourceText,
    setSourceText,
    isLoading,
    error,
    generationId,
    flashcardProposals,

    // Actions
    generateFlashcards,
    handleAcceptToggle,
    handleEdit,
    handleRemove,
    resetError: () => setError(null),
  };
}
