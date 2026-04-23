# Instrukcja przywrócenia pełnej wersji strony

Niniejszy dokument opisuje zmiany wprowadzone 23.04.2026 w celu ograniczenia strony do trybu "Landing Page" (tylko strona główna) oraz instrukcję ich cofnięcia.

## Co zostało zrobione?
1.  **Wyłączono trasy dynamiczne**: Foldery podstron w `src/app/` zostały przemianowane, aby Next.js ignorował ich istnienie.
2.  **Ukryto linki w UI**: Sekcje na stronie głównej (`Coverage`, `Baza Wiedzy`, `News`) oraz lista miast w stopce zostały zakomentowane.
3.  **Zablokowano indeksowanie**: Dodano plik `robots.txt` oraz metadane `noindex` w `layout.tsx`, aby domena "nabierała wieku" bez publicznej ekspozycji treści w Google.

---

## Jak przywrócić pełną funkcjonalność?

### KROK 1: Przywrócenie folderów (tras)
Zmień nazwy katalogów w `src/app/` na oryginalne. Możesz to zrobić jednym poleceniem w terminalu:

```bash
mv src/app/\[_service_disabled\] src/app/\[service\] && \
mv src/app/_pomoc-drogowa_disabled src/app/pomoc-drogowa && \
mv src/app/_poradnik_disabled src/app/poradnik && \
mv src/app/_lokalizacje_disabled src/app/lokalizacje
```

### KROK 2: Odkomentowanie kodu w plikach
Musisz usunąć znaki komentarza `{/*` oraz `*/}` w następujących miejscach:

1.  **Plik `src/app/page.tsx`**:
    *   Sekcja `News` (okolice linii 300)
    *   Sekcja `CoverageSection` (okolice linii 350)
    *   Sekcja `Baza Wiedzy` (okolice linii 360)
2.  **Plik `src/components/Footer.tsx`**:
    *   Lista miast (Column 2 & 3 - okolice linii 50)

### KROK 3: Włączenie indeksowania (SEO)
Gdy będziesz gotowy na wejście do Google:

1.  **Plik `public/robots.txt`**:
    *   Zmień `Disallow: /` na `Allow: /`.
2.  **Plik `src/app/layout.tsx`**:
    *   Usuń sekcję `robots` z obiektu `metadata` lub zmień wartości na `true`:
    ```typescript
    robots: {
      index: true,
      follow: true,
    },
    ```

---

## Opcja szybka (Git Revert)
Jeśli nie wprowadziłeś innych zmian w międzyczasie, możesz po prostu wycofać ostatni commit:
```bash
git revert HEAD
```
Pamiętaj, aby po tej operacji zrobić `git push`.
