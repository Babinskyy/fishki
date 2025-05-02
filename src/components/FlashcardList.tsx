import { useMemo } from "react";
import FlashcardListItem from "./FlashcardListItem";
import type { FlashcardProposalViewModel } from "./hooks/useFlashcardGeneration";

interface FlashcardListProps {
  flashcards: FlashcardProposalViewModel[];
  onAccept: (index: number) => void;
  onEdit: (index: number, front: string, back: string) => void;
  onRemove: (index: number) => void;
  generationId: number | null;
}

const FlashcardList = ({ flashcards, onAccept, onEdit, onRemove }: FlashcardListProps) => {
  // Compute counts for display
  const acceptedCount = useMemo(() => flashcards.filter((card) => card.accepted).length, [flashcards]);

  const totalCount = flashcards.length;

  if (flashcards.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No flashcards available.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Generated Flashcards ({acceptedCount}/{totalCount} Approved)
      </h2>

      <div className="grid gap-4 sm:gap-6">
        {flashcards.map((flashcard, index) => (
          <FlashcardListItem
            key={index}
            flashcard={flashcard}
            index={index}
            onAccept={onAccept}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;
