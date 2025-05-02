import type { FlashcardProposalDto, GenerationCreateResponseDto } from "../../types";
import type { SupabaseClient } from "../../db/supabase.client";

/**
 * Generuje propozycje fiszek na podstawie dostarczonego tekstu.
 * W przypadku błędów, zapisuje je w tabeli generation_error_logs.
 *
 * @param supabase Klient Supabase do interakcji z bazą danych
 * @param sourceText Tekst źródłowy do generacji fiszek (1000-10000 znaków)
 * @param userId ID użytkownika inicjującego generację
 * @returns Obiekt zawierający ID generacji, wygenerowane propozycje fiszek oraz ich liczbę
 */
export async function generateFlashcards(
  supabase: SupabaseClient,
  sourceText: string,
  userId: string
): Promise<GenerationCreateResponseDto> {
  try {
    // 1. Wywołaj usługę AI do generacji fiszek
    // Ponieważ pracujemy na zmockowanych danych, tworzymy przykładowe propozycje
    const startTime = Date.now();
    const flashcardsProposals = mockGenerateFlashcardsFromText(sourceText);
    const generationDuration = Date.now() - startTime;

    // 2. Zapisz metadane generacji w bazie danych
    const { data: generationData, error: generationError } = await supabase
      .from("generations")
      .insert({
        user_id: userId,
        source_text_length: sourceText.length,
        source_text_hash: await createHash(sourceText),
        model: "gpt-3.5-turbo", // Przykładowa nazwa modelu
        generated_count: flashcardsProposals.length,
        generation_duration: generationDuration,
      })
      .select("id")
      .single();

    if (generationError) {
      throw new Error(`Błąd podczas zapisywania generacji: ${generationError.message}`);
    }

    const generationId = generationData.id;

    // 3. Przygotuj odpowiedź
    return {
      generation_id: generationId,
      flashcards_proposals: flashcardsProposals,
      generated_count: flashcardsProposals.length,
    };
  } catch (error) {
    // Loguj błąd w tabeli generation_error_logs
    await logGenerationError(supabase, sourceText, error as Error, userId);
    throw error;
  }
}

/**
 * Loguje błąd generacji do dedykowanej tabeli w bazie danych.
 *
 * @param supabase Klient Supabase do interakcji z bazą danych
 * @param sourceText Tekst źródłowy, który spowodował błąd
 * @param error Obiekt błędu
 * @param userId ID użytkownika inicjującego generację
 */
async function logGenerationError(
  supabase: SupabaseClient,
  sourceText: string,
  error: Error,
  userId: string
): Promise<void> {
  try {
    await supabase.from("generation_error_logs").insert({
      user_id: userId,
      error_code: "AI_SERVICE_ERROR",
      error_message: error.message,
      model: "gpt-3.5-turbo", // Przykładowa nazwa modelu
      source_text_hash: await createHash(sourceText),
      source_text_length: sourceText.length,
    });
  } catch {
    // Jeśli logowanie błędu nie powiedzie się, ignorujemy to w trybie produkcyjnym
    // lub można by użyć zewnętrznego narzędzia do logowania
  }
}

/**
 * Tworzy hash z tekstu źródłowego.
 * W rzeczywistej implementacji należałoby użyć odpowiedniego algorytmu hashującego.
 *
 * @param text Tekst do zahashowania
 * @returns Hash tekstu
 */
async function createHash(text: string): Promise<string> {
  // Prosta implementacja hash dla celów testowych
  // W produkcji użyj odpowiedniego algorytmu hashującego
  return `hash_${text.length}`;
}

/**
 * Funkcja mockująca generację fiszek przez AI.
 * W prawdziwej implementacji, tutaj byłoby wywołanie do API modelu językowego.
 *
 * @param text Tekst źródłowy
 * @returns Tablica wygenerowanych propozycji fiszek
 */
function mockGenerateFlashcardsFromText(text: string): FlashcardProposalDto[] {
  // Symulacja generacji fiszek - w rzeczywistej implementacji
  // byłoby to wywołanie do API AI
  const sampleWords = text
    .slice(0, 500)
    .split(" ")
    .filter((w) => w.length > 5);
  const count = Math.min(5, Math.max(3, Math.floor(text.length / 2000)));

  return Array.from({ length: count }).map(() => {
    const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
    return {
      front: `Co to jest ${randomWord}?`,
      back: `${randomWord} to ważny termin z tekstu, który oznacza...`,
      source: "ai-full" as const,
    };
  });
}
