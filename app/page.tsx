"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const START_DATE = new Date(2024, 4, 5, 0, 0, 0);
const EARTH_CIRCUMFERENCE_KM = 40075;
const MOON_DISTANCE_KM = 384400;

type LiveStats = {
  elapsedMs: number;
  elapsedSeconds: number;
  elapsedMinutes: number;
  elapsedHours: number;
  elapsedDays: number;
  elapsedCalendarMonths: number;
  displayDays: number;
};

type Counter = {
  value: (stats: LiveStats) => string;
  label: string;
  note?: string;
};

type CounterGroup = {
  id: string;
  title: string;
  eyebrow: string;
  tone: string;
  counters: Counter[];
};

type FloatingPhoto = {
  src: string;
  width: number;
  height: number;
};

const floatingPhotos: FloatingPhoto[] = [
  {
    src: "/2god/IMG-20260428-WA0003.jpg",
    width: 1080,
    height: 1920,
  },
  {
    src: "/2god/20260427_192909.jpg",
    width: 4000,
    height: 3000,
  },
  {
    src: "/2god/20260402_194141(0).jpg",
    width: 4000,
    height: 3000,
  },
  {
    src: "/2god/20260323_164552.jpg",
    width: 4000,
    height: 3000,
  },
  {
    src: "/2god/20260314_145230.jpg",
    width: 4000,
    height: 3000,
  },
];

const formatNumber = (value: number, options: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    ...options,
  }).format(value);

const dateFromStartMonthOffset = (monthOffset: number) =>
  new Date(
    START_DATE.getFullYear(),
    START_DATE.getMonth() + monthOffset,
    START_DATE.getDate(),
    START_DATE.getHours(),
    START_DATE.getMinutes(),
    START_DATE.getSeconds(),
    START_DATE.getMilliseconds(),
  );

const calendarMonthsSince = (now: number) => {
  if (now <= START_DATE.getTime()) {
    return 0;
  }

  const current = new Date(now);
  let completedMonths =
    (current.getFullYear() - START_DATE.getFullYear()) * 12 +
    current.getMonth() -
    START_DATE.getMonth();

  if (dateFromStartMonthOffset(completedMonths).getTime() > now) {
    completedMonths -= 1;
  }

  const lastAnniversary = dateFromStartMonthOffset(completedMonths).getTime();
  const nextAnniversary = dateFromStartMonthOffset(
    completedMonths + 1,
  ).getTime();

  return (
    completedMonths +
    (now - lastAnniversary) / (nextAnniversary - lastAnniversary)
  );
};

function MemoryPhotoCard({
  className = "",
  photo,
}: {
  className?: string;
  photo: FloatingPhoto;
}) {
  return (
    <figure className={`memory-photo ${className}`} aria-hidden="true">
      <Image
        alt=""
        className="memory-photo-image"
        height={photo.height}
        sizes="(max-width: 900px) 82vw, 18vw"
        src={photo.src}
        width={photo.width}
      />
    </figure>
  );
}

const elapsedStats = (now: number): LiveStats => {
  const elapsedMs = Math.max(0, now - START_DATE.getTime());
  const elapsedSeconds = elapsedMs / 1000;
  const elapsedMinutes = elapsedSeconds / 60;
  const elapsedHours = elapsedMinutes / 60;
  const elapsedDays = elapsedHours / 24;

  return {
    elapsedMs,
    elapsedSeconds,
    elapsedMinutes,
    elapsedHours,
    elapsedDays,
    elapsedCalendarMonths: calendarMonthsSince(now),
    displayDays: Math.max(1, Math.ceil(elapsedDays)),
  };
};

const counterGroups: CounterGroup[] = [
  {
    id: "vrijeme",
    title: "Naše vrijeme skupa :P",
    eyebrow: "Običan kalendar je bezveze, a znaš da volim komplicirat",
    tone: "counter-section-earth",
    counters: [
      {
        value: ({ elapsedCalendarMonths }) =>
          formatNumber(elapsedCalendarMonths, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "mjeseci",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays / 7, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "tjedana",
      },
      {
        value: ({ elapsedHours }) => formatNumber(Math.floor(elapsedHours)),
        label: "sati",
      },
      {
        value: ({ elapsedSeconds }) => formatNumber(Math.floor(elapsedSeconds)),
        label: "sekundi",
      },
    ],
  },
  {
    id: "priroda",
    title: "Na prirodnoj skali",
    eyebrow:
      "Malo veće dimenzije, just like my ... ..... ...... feelings for you <3",
    tone: "counter-section-sun",
    counters: [
      {
        value: ({ elapsedDays }) =>
          formatNumber((elapsedDays / 365) * 7, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "psećih godina",
        note: "psi stare ~7x brže",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber((elapsedDays / 365) * 5, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "mačjih godina",
        note: "mačke stare ~5x brže",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays / 687, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "Marsovskih godina",
        note: "1 Mars godina = 687 dana",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays / 28, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "Mjesečevih orbita",
        note: "28 dana svaka",
      },
    ],
  },
  {
    id: "Udaljenost",
    title: "Kretanje i ostale kilometraže",
    eyebrow: "Vježbaj pička ti materina, koliko smo mogli pregazit' do sad",
    tone: "counter-section-leaf",
    counters: [
      {
        value: ({ elapsedDays }) =>
          formatNumber(Math.floor(elapsedDays * 7500)),
        label: "koraka je moglo biti napravljeno",
        note: "prosjek 7,500/dan",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays * 5.5, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
        label: "km prošetano",
        note: "~5.5 km/dnevno prosjek",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber((elapsedDays * 5.5) / EARTH_CIRCUMFERENCE_KM, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }),
        label: "krugova oko zemlje",
        note: "40,075 km u opsegu, ovo će nam još malo duže trajat",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(((elapsedDays * 5.5) / MOON_DISTANCE_KM) * 100, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "% puta do mjeseca",
        note: "384,400 km udaljenosti",
      },
    ],
  },
  {
    id: "Konzumiranje medija",
    title: "Mediji",
    eyebrow:
      "Možda si obrisala instagram, ali ovdje imamo dovoljno minuta screentimea da spržimo bar 2 generacije dijece",
    tone: "counter-section-clay",
    counters: [
      {
        value: ({ elapsedHours }) =>
          formatNumber(elapsedHours / 7, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
        label: "knjiga pročitano",
        note: "prosjek 7 sati/knjiga",
      },
      {
        value: ({ elapsedMinutes }) =>
          formatNumber(Math.floor(elapsedMinutes / 40)),
        label: "epizoda pogledano",
        note: "prosjek 40 min po epizodi",
      },
      {
        value: ({ elapsedHours }) =>
          formatNumber(elapsedHours / 2, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
        label: "filmova pogledano",
        note: "prosjek 2 sata po filmu",
      },
      {
        value: ({ elapsedMinutes }) =>
          formatNumber(Math.floor(elapsedMinutes / 3.5)),
        label: "pjesama slušano",
        note: "prosjek 3.5 min po pjesmi",
      },
    ],
  },
  {
    id: "Hrana i pare",
    title: "Hrana i pare",
    eyebrow:
      "Obroka koje smo mogli pojest skupa, i novaca koje smo mogli zaraditi za daljnje večere",
    tone: "counter-section-cream",
    counters: [
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays * 8 * 6.6, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
        label: "Eura na minimalcu u studentskom centru",
        note: "8 sati dnevno BEZ PAUZE",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays * 2, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "Prijatnih kafica",
        note: "2 kafice dnevno, jedna jutarnja jedna prijatna",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays * 3, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "Obroka podijeljeno",
        note: "3 obroka dnevno, ako ne racunamo cipseve i slične kapitalističke otrove",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays * (220 / 365), {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        label: "Gin tonika popijeno",
        note: "Prosječan Hrvat pije 11 litara alkohola godišnje",
      },
    ],
  },
  {
    id: "Biologija",
    title: "Biologija",
    eyebrow: "We can explore some biology together ;)",
    tone: "counter-section-night",
    counters: [
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays * 8, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
        label: "Sati odspavano",
        note: "8 sati dnevno, OBAVEZNO, nema zajebancije, MY SLEEP SCHEDULE WILL PUT A TODDLER TO SHAME",
      },
      {
        value: ({ elapsedMinutes }) =>
          formatNumber(Math.floor(elapsedMinutes * 70)),
        label: "Otkucaja srca",
        note: "70 bpm dnevni prosjek, iako znam da ti je srce brže kad me vidiš hehehqehehwhhw",
      },
      {
        value: ({ elapsedMinutes }) =>
          formatNumber(Math.floor(elapsedMinutes * 16)),
        label: "Udisaja zraka",
        note: "16 udisaja/min",
      },
      {
        value: ({ elapsedDays }) =>
          formatNumber(elapsedDays * 5, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
        label: "Snova odsanjano",
        note: "~4-6 ciklusa/večer. Tebi je vjerojatno 18 puta više al jbg",
      },
    ],
  },
];

export default function Home() {
  const [now, setNow] = useState(() => START_DATE.getTime());

  useEffect(() => {
    const tick = () => setNow(Date.now());

    tick();
    const interval = window.setInterval(tick, 250);

    return () => window.clearInterval(interval);
  }, []);

  const stats = useMemo(() => elapsedStats(now), [now]);

  return (
    <main className="anniversary-shell min-h-screen overflow-hidden bg-[#fff1bf] text-[#3b2416]">
      <section className="relative flex min-h-[92vh] items-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="sun-orb" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="hero-layout relative z-10 mx-auto grid w-full max-w-7xl items-end gap-12">
          <div className="hero-copy max-w-5xl pt-20 sm:pt-28 2xl:pt-0">
            <p className="mb-5 inline-flex -rotate-2 rounded-full border-4 border-[#3b2416] bg-[#f6d66f] px-5 py-2 text-sm font-black uppercase tracking-[0.22em] shadow-[6px_6px_0_#3b2416]">
              Skupa od
            </p>
            <h1 className="font-display max-w-5xl text-[clamp(3rem,8vw,7.6rem)] font-black leading-[0.86] text-[#4a2a18]">
              05/05/2024
            </h1>
            <p className="hero-intro mt-8 max-w-2xl text-xl font-bold leading-8 text-[#5f3a21] sm:text-2xl">
              Mali brojač s glupostima koje sam mogao usporedit sa jebeno
              prelijepe 2 godine koje sam proveo s tobom :D
            </p>
          </div>

          <div className="hero-ticket relative w-full max-w-sm border-4 border-[#3b2416] bg-[#f5efe0] p-5 shadow-[12px_12px_0_#3b2416] 2xl:ml-auto">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#2f8f83]">
              Dana skupa
            </p>
            <span className="font-display mt-4 block text-[clamp(5rem,18vw,9rem)] leading-[0.78] text-[#d74f2f]">
              {formatNumber(stats.displayDays)}
            </span>
            <p className="mt-4 w-fit rounded-full border-4 border-[#3b2416] bg-[#ffcf48] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_#3b2416]">
              live tracking
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <span className="h-28 rounded-[55%_45%_48%_52%] bg-[#ef8f2f]" />
              <span className="h-28 rounded-[44%_56%_58%_42%] bg-[#6f8f3f]" />
              <span className="h-28 rounded-[58%_42%_42%_58%] bg-[#cc3f2d]" />
            </div>
          </div>
        </div>
      </section>

      {counterGroups.map((group, groupIndex) => {
        const sectionPhoto =
          groupIndex === counterGroups.length - 1
            ? floatingPhotos[0]
            : floatingPhotos[groupIndex + 1];

        return (
          <section
            className={`counter-section ${group.tone}`}
            id={group.id}
            key={group.id}
          >
            {groupIndex === 0 ? (
              <div className="terrain-strip top" aria-hidden="true" />
            ) : null}
            <div
              className={`counter-section-layout ${
                sectionPhoto
                  ? groupIndex % 2 === 0
                    ? "counter-section-layout-right"
                    : "counter-section-layout-left"
                  : ""
              }`}
            >
              <div className="counter-content">
                <div className="counter-heading">
                  <p className="mb-4 text-sm font-black uppercase tracking-[0.24em]">
                    {group.eyebrow}
                  </p>
                  <h2 className="font-display max-w-4xl text-6xl leading-[0.9] sm:text-8xl">
                    {group.title}
                  </h2>
                </div>

                <div className="counter-grid mt-12">
                  {group.counters.map((counter, index) => (
                    <article
                      className={`counter-card panel-${((groupIndex + index) % 8) + 1}`}
                      key={`${group.id}-${counter.label}`}
                    >
                      <div className="counter-index">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <span className="counter-value">
                        {counter.value(stats)}
                      </span>
                      <h3 className="counter-label">{counter.label}</h3>
                      {counter.note ? (
                        <p className="counter-note">{counter.note}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>

              {sectionPhoto ? (
                <MemoryPhotoCard
                  className={`memory-photo-section memory-photo-section-${groupIndex + 1}`}
                  photo={sectionPhoto}
                />
              ) : null}
            </div>
          </section>
        );
      })}

      <section className="final-sun relative flex min-h-[78vh] items-center justify-center overflow-hidden px-5 py-24 text-center text-[#3b2416]">
        <div className="relative z-10 max-w-5xl">
          <p className="mx-auto mb-6 w-fit -rotate-2 rounded-full border-4 border-[#3b2416] bg-[#2f8f83] px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#fff8dc] shadow-[6px_6px_0_#3b2416]">
            NAJBITNIJE
          </p>
          <h2 className="font-display text-[clamp(3.2rem,12vw,12rem)] font-black leading-[0.78]">
            Još uvijek brojimo!!!!!{" "}
            <span className="text-border-earth mt-4 block text-[0.72em] leading-[0.9] text-[#2f8f83]">
              Volim te jako puno. Sretna Godišnjica.
            </span>
          </h2>
        </div>
      </section>
    </main>
  );
}
