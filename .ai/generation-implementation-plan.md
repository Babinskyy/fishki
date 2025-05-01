# API Endpoint Implementation Plan: POST /generations

## 1. Przegląd punktu końcowego
Endpoint POST `/generations` umożliwia użytkownikowi inicjację procesu generacji propozycji fiszek na podstawie przesłanego tekstu. Po walidacji wejścia wywoływana jest usługa AI, która generuje propozycje, a metadane generacji są zapisywane w bazie danych. W przypadku błędów zapisywane są logi w tabeli `generation_error_logs`.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **URL:** `/generations`
- **Parametry:**
  - **Wymagane:** 
    - `source_text` (string, o długości między 1000 a 10000 znaków)
  - **Opcjonalne:** Brak
- **Request Body:**
  ```json
  {
    "source_text": "User provided text (1000 to 10000 characters)"
  }
  ```

## 3. Wykorzystywane typy
- **GenerateFlashcardsCommand:** reprezentuje strukturę żądania (walidacja `source_text`).
- **GenerationCreateResponseDto:** struktura odpowiedzi zawierająca:
  - `generation_id` (number)
  - `flashcards_proposals` (tablica obiektów FlashcardProposalDto, każdy z polami: front, back, source – wartość stała "ai-full")
  - `generated_count` (number)
- **FlashcardProposalDto:** reprezentuje pojedynczą propozycję fiszki.

## 4. Szczegóły odpowiedzi
- **Status 201:** Sukces, generacja fiszek została utworzona.
  ```json
  {
    "generation_id": 123,
    "flashcards_proposals": [
      { "front": "Generated Question", "back": "Generated Answer", "source": "ai-full" }
    ],
    "generated_count": 5
  }
  ```
- **Błędy:**
  - **400:** Nieprawidłowe dane wejściowe.
  - **401:** Brak autoryzacji.
  - **500:** Wewnętrzny błąd serwera (np. błąd usługi AI).

## 5. Przepływ danych
1. Klient wysyła żądanie POST `/generations` z obiektem `GenerateFlashcardsCommand`.
2. Endpoint waliduje długość `source_text` za pomocą Zod.
3. System sprawdza autoryzację użytkownika wykorzystując Supabase Auth oraz RLS.
4. Po pozytywnej walidacji, wywołanie dedykowanego serwisu, np. `generation.service`.
5. Usługa AI generuje propozycje fiszek.
6. Metadane generacji są zapisywane w tabeli `generations`.
7. W przypadku wystąpienia błędów z usługą AI logowany jest wpis w tabeli `generation_error_logs`.
8. Endpoint zwraca odpowiedź w formacie `GenerationCreateResponseDto`.

## 6. Względy bezpieczeństwa
- **Autentykacja i autoryzacja:** Wymagana autoryzacja użytkownika (Supabase Auth). RLS zapewnia, że użytkownik ma dostęp tylko do swoich danych.
- **Walidacja danych wejściowych:** Użycie Zod do zatwierdzania, że `source_text` spełnia reguły długości.
- **Ochrona przed atakami:** Sanitizacja wejścia, ograniczenie zakresu `source_text`.
- **Bezpieczne logowanie błędów:** Rejestrowanie błędów do `generation_error_logs` bez udostępniania szczegółowych informacji klientowi.

## 7. Obsługa błędów
- **400 Bad Request:** Gdy `source_text` nie spełnia wymagań walidacyjnych (np. niepoprawna długość).
- **401 Unauthorized:** Gdy żądanie pochodzi od niezautoryzowanego użytkownika.
- **500 Internal Server Error:** Gdy nastąpi błąd podczas komunikacji z usługą AI lub problem przy zapisie do bazy danych. Dodatkowo:
  - Zapisywanie pełnych danych błędu w tabeli `generation_error_logs`.
  - Wysyłanie przyjaznej wiadomości błędu do klienta.

## 8. Rozważania dotyczące wydajności
- Minimalny narzut walidacji i sprawdzenia autoryzacji.
- Zaplanowane asynchroniczne przetwarzanie.
- Maksymalny czas żądania 60 sekund, inaczej błąd timeout.

## 9. Etapy wdrożenia
1. **Utworzenie endpointu:** Dodaj plik API w `./src/pages/api/generations.ts`.
2. **Walidacja danych:** Zaimplementuj zestaw walidacji używając Zod dla `source_text`.
3. **Autoryzacja:** Zapewnij middleware do sprawdzania autentykacji użytkownika.
4. **Logika usługi:** Wyodrębnij logikę wywołania usługi AI do dedykowanego modułu w `generation.service`.
5. **Zapis w bazie:** Implementuj mechanizm zapisu metadanych generacji w tabeli `generations` oraz mechanizm logowania do `generation_error_logs`.
6. **Obsługa błędów:** Implementuj struktury obsługi błędów i odpowiednie komunikaty/error logging.