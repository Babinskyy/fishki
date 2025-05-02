import { useState, useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Edit, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FlashcardProposalViewModel } from "./hooks/useFlashcardGeneration";

interface FlashcardListItemProps {
  flashcard: FlashcardProposalViewModel;
  index: number;
  onAccept: (index: number) => void;
  onEdit: (index: number, front: string, back: string) => void;
  onRemove: (index: number) => void;
}

const MAX_FRONT_LENGTH = 200;
const MAX_BACK_LENGTH = 500;

const FlashcardListItem = ({ flashcard, index, onAccept, onEdit, onRemove }: FlashcardListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [front, setFront] = useState(flashcard.front);
  const [back, setBack] = useState(flashcard.back);
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);

  // Generate unique IDs for form elements
  const frontId = useId();
  const backId = useId();

  // Reset form when switching between cards or modes
  useEffect(() => {
    if (!isEditing) {
      setFront(flashcard.front);
      setBack(flashcard.back);
      setFrontError(null);
      setBackError(null);
    }
  }, [flashcard, isEditing]);

  // Validate form fields
  useEffect(() => {
    setFrontError(front.length > MAX_FRONT_LENGTH ? `Front text must not exceed ${MAX_FRONT_LENGTH} characters` : null);

    setBackError(back.length > MAX_BACK_LENGTH ? `Back text must not exceed ${MAX_BACK_LENGTH} characters` : null);
  }, [front, back]);

  const handleSave = () => {
    if (frontError || backError) return;

    onEdit(index, front, back);
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel edit
      setIsEditing(false);
      setFront(flashcard.front);
      setBack(flashcard.back);
    } else {
      // Start edit
      setIsEditing(true);
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-shadow ${
        flashcard.accepted ? "border-primary/50" : "border-muted opacity-75"
      }`}
    >
      {isEditing ? (
        // Edit mode
        <CardContent className="pt-6 grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={frontId} className="text-sm font-medium">
                Front (Question)
              </Label>
              <span className={`text-xs ${frontError ? "text-destructive" : "text-muted-foreground"}`}>
                {front.length}/{MAX_FRONT_LENGTH}
              </span>
            </div>
            <Textarea
              id={frontId}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Front side content"
              className={`resize-none h-20 ${frontError ? "border-destructive" : ""}`}
              aria-invalid={!!frontError}
              aria-describedby={frontError ? `${frontId}-error` : undefined}
            />
            {frontError && (
              <p id={`${frontId}-error`} className="text-sm text-destructive">
                {frontError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={backId} className="text-sm font-medium">
                Back (Answer)
              </Label>
              <span className={`text-xs ${backError ? "text-destructive" : "text-muted-foreground"}`}>
                {back.length}/{MAX_BACK_LENGTH}
              </span>
            </div>
            <Textarea
              id={backId}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Back side content"
              className={`resize-none h-32 ${backError ? "border-destructive" : ""}`}
              aria-invalid={!!backError}
              aria-describedby={backError ? `${backId}-error` : undefined}
            />
            {backError && (
              <p id={`${backId}-error`} className="text-sm text-destructive">
                {backError}
              </p>
            )}
          </div>
        </CardContent>
      ) : (
        // View mode
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{flashcard.front}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{flashcard.back}</p>
          </CardContent>
        </>
      )}

      <CardFooter className="flex flex-wrap gap-2 py-3 bg-muted/10 sm:flex-nowrap">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={handleToggleEdit} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!!frontError || !!backError} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={flashcard.accepted ? "default" : "outline"}
              size="sm"
              onClick={() => onAccept(index)}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1 sm:inline hidden" />
              {flashcard.accepted ? "Approved" : "Approve"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleEdit} className="flex-1">
              <Edit className="h-4 w-4 mr-1 sm:inline hidden" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onRemove(index)} className="flex-1">
              <X className="h-4 w-4 mr-1 sm:inline hidden" />
              Remove
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default FlashcardListItem;
