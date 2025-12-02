"use client";

import React, {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";

type Language = "it" | "en" | "es" | "fr" | "de";

type TestResult = {
  id: number;
  language: Language;
  duration: number;
  wpm: number;
  accuracy: number;
  correctWords: number;
  typedWords: number;
};

// Frasi per ogni lingua
const TEXTS: Record<Language, string[]> = {
  it: [
    "La digitazione veloce non riguarda solo la velocità, ma anche la precisione. Un flusso costante di parole ben scritte rende l'esperienza molto più piacevole.",
    "Molte persone pensano che scrivere velocemente sia solo una questione di talento, ma in realtà è il risultato di allenamento costante e di una buona postura alla tastiera.",
    "Un buon test di digitazione ti permette di seguire i tuoi progressi nel tempo, misurando velocità, errori e miglioramenti giorno dopo giorno.",
    "Allenarsi ogni giorno anche per pochi minuti è sufficiente per sviluppare memoria muscolare e sicurezza alla tastiera.",
    "Quando ti concentri solo sul testo che hai davanti, senza notifiche o distrazioni, la tua velocità di scrittura migliora naturalmente.",
    "Molti professionisti del digitale investono tempo per migliorare la digitazione, perché ogni minuto risparmiato davanti alla tastiera si moltiplica nel lungo periodo.",
  ],
  en: [
    "Typing fast is not just about speed, but about rhythm and comfort. When your hands move smoothly, your thoughts can flow directly onto the screen.",
    "Many users underestimate how much daily typing practice can improve productivity, especially for students and remote workers.",
    "A modern typing test should feel calm, focused and minimal, so you can concentrate only on the words in front of you.",
    "Short training sessions with clear feedback are far more effective than long, exhausting practice once in a while.",
    "Good posture, relaxed shoulders and a stable chair can make a bigger difference than you might expect for typing speed.",
    "As you improve your typing, you also reduce small moments of friction that interrupt your ideas while you write.",
  ],
  es: [
    "Escribir rápido es una habilidad que se puede entrenar como cualquier deporte, con paciencia, práctica y una buena técnica.",
    "Un teclado cómodo y una buena postura son fundamentales para evitar el cansancio y mantener una velocidad constante.",
    "Los mejores tests de mecanografía combinan diseño agradable con estadísticas claras y fáciles de entender.",
    "Unos pocos minutos al día son suficientes para notar una mejora real en tu velocidad de escritura.",
    "Cuando eliminamos distracciones y nos centramos solo en las palabras, la mente sigue un ritmo más fluido.",
    "Mejorar tu mecanografía también puede hacer que responder correos y mensajes sea mucho menos pesado.",
  ],
  fr: [
    "La vitesse de frappe est importante, mais la vraie clé est la régularité. De petites séances quotidiennes valent mieux qu'un long entraînement occasionnel.",
    "Un test de frappe moderne doit être simple, lisible et agréable, afin que l'utilisateur se concentre uniquement sur le texte.",
    "Améliorer sa dactylographie peut rendre chaque journée de travail un peu plus fluide et moins fatigante.",
    "Une bonne posture et un clavier confortable réduisent la tension dans les mains et les épaules pendant la frappe.",
    "Lorsque l'interface est calme et épurée, le cerveau peut se concentrer sur le rythme des mots.",
    "Suivre ses progrès au fil du temps rend l'entraînement plus motivant et plus satisfaisant.",
  ],
  de: [
    "Schnelles Tippen ist eine Fähigkeit, die im Alltag oft unterschätzt wird, obwohl wir jeden Tag unzählige Wörter auf der Tastatur schreiben.",
    "Ein ruhiges und klares Interface hilft dabei, sich auf den Text zu konzentrieren und nicht von unnötigen Elementen abgelenkt zu werden.",
    "Regelmäßiges Training mit kurzen Tests ist der beste Weg, um Geschwindigkeit und Genauigkeit dauerhaft zu verbessern.",
    "Wenn Hände und Schultern entspannt bleiben, fühlt sich langes Tippen deutlich angenehmer an.",
    "Gute Rückmeldungen nach jedem Test machen es einfacher, eigene Fortschritte realistisch einzuschätzen.",
    "Wer seine Tippgeschwindigkeit erhöht, spart über Wochen und Monate erstaunlich viel Zeit.",
  ],
};

// Testo lungo (praticamente “infinito” per 60s)
function generateText(language: Language, minWords: number = 300): string {
  const pool = TEXTS[language];
  const words: string[] = [];

  while (words.length < minWords) {
    const sentence = pool[Math.floor(Math.random() * pool.length)] ?? "";
    if (!sentence) break;
    words.push(...sentence.split(" "));
  }

  return words.join(" ");
}

export default function TestPage() {
  const [language, setLanguage] = useState<Language>("it");
  const [duration, setDuration] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  // input “una parola alla volta”
  const [currentInput, setCurrentInput] = useState<string>("");
  const [typedWords, setTypedWords] = useState<string[]>([]);

  const [wpm, setWpm] = useState<number>(0);
  const [correctWords, setCorrectWords] = useState<number>(0);
  const [typedWordsCount, setTypedWordsCount] = useState<number>(0);

  const [results, setResults] = useState<TestResult[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  // genera testo quando cambia lingua
  useEffect(() => {
    setText(generateText(language));
    setCurrentInput("");
    setTypedWords([]);
    setCorrectWords(0);
    setTypedWordsCount(0);
    setActiveIndex(0);
  }, [language]);

  // indice della parola attuale = numero parole confermate
  useEffect(() => {
    setActiveIndex(typedWords.length);
  }, [typedWords]);

  // auto-scroll sulla parola attiva
  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [activeIndex, text, language]);

  // Timer
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const id = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [isRunning, timeLeft]);

  // Salvataggio risultato quando finisce il tempo
  useEffect(() => {
    if (timeLeft === 0 && !isRunning) {
      const safeWpm = isNaN(wpm) ? 0 : wpm;
      const accuracy =
        typedWordsCount === 0
          ? 0
          : Math.round((correctWords / typedWordsCount) * 100);

      const newResult: TestResult = {
        id: Date.now(),
        language,
        duration,
        wpm: safeWpm,
        accuracy,
        correctWords,
        typedWords: typedWordsCount,
      };

      setResults((prev) => {
        const updated = [newResult, ...prev];
        return updated.slice(0, 5);
      });
    }
  }, [timeLeft, isRunning, language, duration, wpm, correctWords, typedWordsCount]);

  // Calcolo statistiche parole corrette / totali
  useEffect(() => {
    if (!text) {
      setCorrectWords(0);
      setTypedWordsCount(0);
      return;
    }

    const targetWords = text.split(" ");
    let correct = 0;

    for (let i = 0; i < typedWords.length && i < targetWords.length; i++) {
      if (typedWords[i] === targetWords[i]) {
        correct++;
      }
    }

    setCorrectWords(correct);
    setTypedWordsCount(typedWords.length);
  }, [typedWords, text]);

  // Calcolo WPM basato sulle parole confermate
  useEffect(() => {
    const elapsed = duration - timeLeft;
    if (elapsed <= 0) {
      setWpm(0);
      return;
    }

    const minutes = elapsed / 60;
    const currentWpm = Math.round(typedWordsCount / minutes);
    setWpm(currentWpm);
  }, [typedWordsCount, duration, timeLeft]);

  function handleDurationChange(newDuration: number) {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
    setCurrentInput("");
    setTypedWords([]);
    setText(generateText(language));
    setWpm(0);
    setCorrectWords(0);
    setTypedWordsCount(0);
    setActiveIndex(0);
  }

  function handleLanguageChange(newLang: Language) {
    setLanguage(newLang);
    setIsRunning(false);
    setTimeLeft(duration);
    setCurrentInput("");
    setTypedWords([]);
    setWpm(0);
    setCorrectWords(0);
    setTypedWordsCount(0);
    setActiveIndex(0);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!isRunning && timeLeft === duration) {
      setIsRunning(true);
    }
    setCurrentInput(value);
  }

  // confermiamo la parola quando premi SPAZIO o INVIO
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmed = currentInput.trim();
      if (!trimmed) return;

      setTypedWords((prev) => [...prev, trimmed]);
      setCurrentInput("");
    }
  }

  function handleReset() {
    setIsRunning(false);
    setTimeLeft(duration);
    setCurrentInput("");
    setTypedWords([]);
    setText(generateText(language));
    setWpm(0);
    setCorrectWords(0);
    setTypedWordsCount(0);
    setActiveIndex(0);
  }

  // rendering testo con colori
  const renderText = () => {
    if (!text) {
      return <span className="text-neutral-500">Caricamento testo...</span>;
    }

    const targetWords = text.split(" ");

    return targetWords.map((word, index) => {
      let className = "text-neutral-300";

      if (index < typedWords.length) {
        className =
          typedWords[index] === word ? "text-emerald-400" : "text-red-400";
      } else if (index === typedWords.length) {
        className = "text-cyan-400";
      }

      return (
        <span
          key={index}
          className={className}
          ref={index === activeIndex ? activeWordRef : null}
        >
          {word + " "}
        </span>
      );
    });
  };

  const accuracy =
    typedWordsCount === 0
      ? 0
      : Math.round((correctWords / typedWordsCount) * 100);

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl text-white space-y-8">
        {/* LOGO */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold">
            <span className="text-cyan-400">Type</span>vero
          </h1>
          <p className="text-neutral-400 text-sm">
            Allenati a scrivere più veloce, in più lingue, in un ambiente calmo
            e pulito.
          </p>
        </div>

        {/* CONTROLLI SUPERIORI */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Durata */}
          <div className="flex gap-3">
            {[15, 30, 60].map((sec) => (
              <button
                key={sec}
                onClick={() => handleDurationChange(sec)}
                className={`px-4 py-2 rounded-xl border text-sm md:text-base transition ${
                  duration === sec
                    ? "bg-cyan-500 text-black border-cyan-400 shadow-lg"
                    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Lingue */}
          <div className="flex gap-2 text-xs md:text-sm">
            {([
              ["it", "IT"],
              ["en", "EN"],
              ["es", "ES"],
              ["fr", "FR"],
              ["de", "DE"],
            ] as [Language, string][]).map(([code, label]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`px-3 py-1 rounded-full border transition ${
                  language === code
                    ? "bg-neutral-100 text-neutral-900 border-neutral-300"
                    : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Timer + WPM + Reset */}
          <div className="flex items-center gap-4 text-sm md:text-base">
            <div className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700">
              ⏱ <span className="font-semibold">{timeLeft}s</span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700">
              ⚡ WPM:{" "}
              <span className="font-semibold">{isNaN(wpm) ? 0 : wpm}</span>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* TESTO DA DIGITARE */}
        <div className="bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-800 text-sm md:text-base leading-relaxed max-h-48 overflow-y-auto">
          {renderText()}
        </div>

        {/* INPUT UNA PAROLA ALLA VOLTA */}
        <input
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isRunning || timeLeft !== duration
              ? "Digita una parola, poi premi SPAZIO o INVIO..."
              : "Quando inizi a scrivere qui, il timer partirà automaticamente..."
          }
          className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-base text-neutral-100 focus:outline-none focus:border-cyan-400"
          disabled={timeLeft <= 0}
        />

        {/* MESSAGGIO FINALE + RISULTATI */}
        {timeLeft <= 0 && (
          <div className="space-y-2 text-center text-sm md:text-base">
            <p className="text-neutral-400">
              ⏰ Tempo finito! Premi{" "}
              <span className="font-semibold">Reset</span> per un nuovo test.
            </p>
            <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-800 border border-neutral-700 text-xs md:text-sm">
              <span>
                ⚡ <span className="font-semibold">{isNaN(wpm) ? 0 : wpm}</span>{" "}
                WPM
              </span>
              <span>|</span>
              <span>
                🎯 Accuratezza:{" "}
                <span className="font-semibold">{accuracy}%</span>
              </span>
              <span>|</span>
              <span>
                ✅ Corrette:{" "}
                <span className="font-semibold">{correctWords}</span> /{" "}
                {typedWordsCount}
              </span>
            </div>
          </div>
        )}

        {/* STORICO ULTIMI TEST */}
        {results.length > 0 && (
          <div className="pt-4 border-t border-neutral-800 text-xs md:text-sm space-y-2">
            <p className="text-neutral-400">
              Ultimi test (solo questa sessione):
            </p>
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full bg-neutral-800 text-neutral-200">
                      {r.language.toUpperCase()}
                    </span>
                    <span className="text-neutral-300">
                      {r.duration}s •{" "}
                      <span className="font-semibold">{r.wpm}</span> WPM
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-300">
                    <span>
                      🎯 <span className="font-semibold">{r.accuracy}%</span>
                    </span>
                    <span>
                      ✅ {r.correctWords}/{r.typedWords}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
