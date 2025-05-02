import { useState, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  isLoading?: boolean;
  onGenerate: () => void;
}

const TextInputArea = ({
  value,
  onChange,
  placeholder = "Paste your text here to generate flashcards...",
  minLength = 1000,
  maxLength = 10000,
  isLoading = false,
  onGenerate,
}: TextInputAreaProps) => {
  const [textLength, setTextLength] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTextLength(value.length);

    if (value.length === 0) {
      setError(null);
      setIsValid(false);
    } else if (value.length < minLength) {
      setError(`Text must contain at least ${minLength} characters`);
      setIsValid(false);
    } else if (value.length > maxLength) {
      setError(`Text cannot exceed ${maxLength} characters`);
      setIsValid(false);
    } else {
      setError(null);
      setIsValid(true);
    }
  }, [value, minLength, maxLength]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col w-full mb-6">
      <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
        <label htmlFor="source-text" className="text-sm font-medium">
          Source Text
        </label>
        <span className={`text-xs ${error ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
          {textLength} / {maxLength} characters {error && `(${error})`}
        </span>
      </div>
      <textarea
        id="source-text"
        className={`w-full h-48 sm:h-64 md:h-80 p-3 border rounded-md resize-none bg-background ${
          error ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-primary"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={handleTextChange}
        disabled={isLoading}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "text-error" : undefined}
      />
      {error && (
        <p id="text-error" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <Button onClick={onGenerate} disabled={!isValid || isLoading} className="w-full sm:w-auto px-4 sm:px-6">
          {isLoading ? "Generating..." : "Generate Flashcards"}
        </Button>
      </div>
    </div>
  );
};

export default TextInputArea;
