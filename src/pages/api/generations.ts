import type { APIContext } from "astro";
import { z } from "zod";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { generateFlashcards } from "../../lib/services/generation.service";
import type { GenerateFlashcardsCommand, GenerationCreateResponseDto } from "../../types";

// Wyłączenie prerenderowania - endpointy API muszą być procesowane dynamicznie
export const prerender = false;

// Schemat walidujący dane wejściowe
const generateFlashcardsSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Tekst źródłowy musi zawierać co najmniej 1000 znaków")
    .max(10000, "Tekst źródłowy nie może przekraczać 10000 znaków"),
});

/**
 * Endpoint do generowania fiszek na podstawie przesłanego tekstu.
 *
 * Metoda: POST
 * URL: /generations
 * Request body: { "source_text": string }
 * Response: { "generation_id": number, "flashcards_proposals": FlashcardProposalDto[], "generated_count": number }
 *
 * @param context Kontekst żądania API z Astro
 * @returns Odpowiedź zawierająca wygenerowane propozycje fiszek
 */
export async function POST(context: APIContext): Promise<Response> {
  try {
    // 1. Pobierz i zwaliduj dane wejściowe
    const requestData = (await context.request.json()) as GenerateFlashcardsCommand;

    // 2. Walidacja danych wejściowych przy użyciu Zod
    const validationResult = generateFlashcardsSchema.safeParse(requestData);

    if (!validationResult.success) {
      // Jeśli walidacja się nie powiodła, zwróć błąd 400 Bad Request
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane wejściowe",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 3. Sprawdź autoryzację użytkownika (w prawdziwej implementacji)
    // W tym przypadku używamy DEFAULT_USER_ID dla uproszczenia
    // W rzeczywistej implementacji pobieralibyśmy identyfikator użytkownika z kontekstu autoryzacji
    const userId = DEFAULT_USER_ID;

    // Alternatywnie, gdyby była zaimplementowana autoryzacja:
    // const userId = context.locals.userSession?.id;
    // if (!userId) {
    //   return new Response(
    //     JSON.stringify({ error: "Brak autoryzacji" }),
    //     { status: 401, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // 4. Wywołanie serwisu generującego fiszki
    const result: GenerationCreateResponseDto = await generateFlashcards(
      context.locals.supabase, // Klient Supabase z middleware
      validationResult.data.source_text,
      userId
    );

    // 5. Zwróć wynik generacji z kodem 201 Created
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // 6. Obsługa błędów - zwróć ogólny komunikat błędu, szczegółowy został już zalogowany
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas generowania fiszek",
        message: error instanceof Error ? error.message : "Nieznany błąd",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
