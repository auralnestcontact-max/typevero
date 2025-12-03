import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-10">
        
        {/* HERO */}
        <section className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
            TYPING TEST • MULTILINGUA
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-400">Type</span>vero
          </h1>

          <p className="text-neutral-300 text-sm md:text-base mb-6">
            Un test di digitazione moderno, minimal e rilassante. Allenati a
            scrivere più veloce in italiano, inglese, spagnolo, francese e
            tedesco, con statistiche in tempo reale, testi naturali e
            interfaccia pulita.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/test"
              className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-semibold text-sm md:text-base hover:bg-cyan-400 transition shadow-lg"
            >
              Inizia il test
            </Link>

            <span className="text-neutral-400 text-xs md:text-sm">
              Nessuna registrazione richiesta. Apri, digita e guarda i tuoi
              progressi.
            </span>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
            <h2 className="font-semibold mb-2 text-sm md:text-base">🌍 Multilingua</h2>
            <p className="text-neutral-400 text-xs md:text-sm">
              Allenati digitando in 5 lingue diverse con testi naturali.
            </p>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
            <h2 className="font-semibold mb-2 text-sm md:text-base">📊 Statistiche chiare</h2>
            <p className="text-neutral-400 text-xs md:text-sm">
              WPM, accuratezza e storico degli ultimi test sempre visibili.
            </p>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
            <h2 className="font-semibold mb-2 text-sm md:text-base">🧘 Interfaccia rilassante</h2>
            <p className="text-neutral-400 text-xs md:text-sm">
              Tema scuro, colori morbidi e nessuna distrazione: solo tu e il testo.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center text-neutral-400 text-xs md:text-sm">
          Pronto a iniziare?{" "}
          <Link
            href="/test"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Vai al test di digitazione →
          </Link>
        </section>
      </div>
    </main>
  );
}
