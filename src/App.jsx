import React, { useEffect, useMemo, useState } from "react";
import { Brain, BookOpen, CheckCircle2, Languages, LibraryBig, RotateCcw, Search, Sigma, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { NativeSelect } from "./components/ui/select";

const PERSONS = [
  { key: "1sg", label: "1st singular" },
  { key: "2sg", label: "2nd singular" },
  { key: "3sg", label: "3rd singular" },
  { key: "1pl", label: "1st plural" },
  { key: "2pl", label: "2nd plural" },
  { key: "3pl", label: "3rd plural" },
];
const CASES = [
  { key: "nom", label: "Nominative" },
  { key: "gen", label: "Genitive" },
  { key: "dat", label: "Dative" },
  { key: "acc", label: "Accusative" },
  { key: "voc", label: "Vocative" },
];
const NUMBERS = [
  { key: "sg", label: "Singular" },
  { key: "pl", label: "Plural" },
];
const GENDERS = [
  { key: "masc", label: "Masculine" },
  { key: "fem", label: "Feminine" },
  { key: "neut", label: "Neuter" },
];

const VERBS = [
  { lemma: "λύω", translit: "luō", meaning: "loose, release", class: "omega", stems: { present: "λυ", imperfect: "λυ", future: "λυσ", aorist: "λυσ" }, principalParts: ["λύω", "λύσω", "ἔλυσα", "λέλυκα", "λέλυμαι", "ἐλύθην"] },
  { lemma: "παύω", translit: "pauō", meaning: "stop", class: "omega", stems: { present: "παυ", imperfect: "παυ", future: "παυσ", aorist: "παυσ" }, principalParts: ["παύω", "παύσω", "ἔπαυσα", "πέπαυκα", "πέπαυμαι", "ἐπαύθην"] },
  { lemma: "λέγω", translit: "legō", meaning: "say, speak", class: "omega-irregular-aorist", stems: { present: "λεγ", imperfect: "λεγ", future: "ἐρ", aorist: "ειπ" }, principalParts: ["λέγω", "ἐρῶ", "εἶπον", "εἴρηκα", "εἴρημαι", "ἐρρήθην"] },
  { lemma: "βαίνω", translit: "bainō", meaning: "go, step", class: "omega-irregular-aorist", stems: { present: "βαιν", imperfect: "βαιν", future: "βησ", aorist: "βη" }, principalParts: ["βαίνω", "βήσομαι", "ἔβην", "βέβηκα", "—", "—"] },
  { lemma: "μανθάνω", translit: "manthanō", meaning: "learn", class: "omega-irregular-aorist", stems: { present: "μανθαν", imperfect: "μανθαν", future: "μαθησ", aorist: "μαθ" }, principalParts: ["μανθάνω", "μαθήσομαι", "ἔμαθον", "μεμάθηκα", "—", "—"] },
  { lemma: "δίδωμι", translit: "didōmi", meaning: "give", class: "mi", stems: { present: "διδ", imperfect: "διδ", future: "δωσ", aorist: "δο" }, principalParts: ["δίδωμι", "δώσω", "ἔδωκα", "δέδωκα", "δέδομαι", "ἐδόθην"] },
  { lemma: "ἔχω", translit: "echō", meaning: "have, hold", class: "omega", stems: { present: "ἐχ", imperfect: "ἐχ", future: "ἑξ", aorist: "σχ" }, principalParts: ["ἔχω", "ἕξω", "ἔσχον", "ἔσχηκα", "—", "—"] },
  { lemma: "εἰμί", translit: "eimi", meaning: "be", class: "irregular-eimi", stems: { present: "", imperfect: "", future: "", aorist: "" }, principalParts: ["εἰμί", "ἔσομαι", "—", "—", "—", "—"] },
  { lemma: "γίγνομαι", translit: "gignomai", meaning: "become", class: "deponent-middle", stems: { present: "γιγν", imperfect: "γιγν", future: "γενησ", aorist: "γεν" }, principalParts: ["γίγνομαι", "γενήσομαι", "ἐγενόμην", "γέγονα", "—", "—"] },
  { lemma: "ὁράω", translit: "horaō", meaning: "see", class: "contract-alpha", stems: { present: "ὁρα", imperfect: "ὁρα", future: "ὀψ", aorist: "ιδ" }, principalParts: ["ὁράω", "ὄψομαι", "εἶδον", "ἑώρακα", "ἑώραμαι", "ὤφθην"] },
  { lemma: "ἀκούω", translit: "akouō", meaning: "hear", class: "omega", stems: { present: "ἀκου", imperfect: "ἀκου", future: "ἀκουσ", aorist: "ἀκουσ" }, principalParts: ["ἀκούω", "ἀκούσομαι", "ἤκουσα", "ἀκήκοα", "—", "—"] },
  { lemma: "γράφω", translit: "graphō", meaning: "write", class: "omega", stems: { present: "γραφ", imperfect: "γραφ", future: "γραψ", aorist: "γραψ" }, principalParts: ["γράφω", "γράψω", "ἔγραψα", "γέγραφα", "γέγραμμαι", "ἐγράφην"] },
  { lemma: "φέρω", translit: "pherō", meaning: "carry, bring", class: "omega-irregular-aorist", stems: { present: "φερ", imperfect: "φερ", future: "οἰσ", aorist: "ἐνεγκ" }, principalParts: ["φέρω", "οἴσω", "ἤνεγκον", "ἐνήνοχα", "ἐνήνεγμαι", "ἠνέχθην"] },
  { lemma: "μένω", translit: "menō", meaning: "remain", class: "omega", stems: { present: "μεν", imperfect: "μεν", future: "μεν", aorist: "μειν" }, principalParts: ["μένω", "μενῶ", "ἔμεινα", "μεμένηκα", "—", "—"] },
  { lemma: "ποιέω", translit: "poieō", meaning: "do, make", class: "contract-alpha", stems: { present: "ποιε", imperfect: "ποιε", future: "ποιησ", aorist: "ποιησ" }, principalParts: ["ποιέω", "ποιήσω", "ἐποίησα", "πεποίηκα", "πεποίημαι", "ἐποιήθην"] },
  { lemma: "λαμβάνω", translit: "lambanō", meaning: "take, receive", class: "omega-irregular-aorist", stems: { present: "λαμβαν", imperfect: "λαμβαν", future: "ληψ", aorist: "λαβ" }, principalParts: ["λαμβάνω", "λήψομαι", "ἔλαβον", "εἴληφα", "εἴλημμαι", "ἐλήφθην"] },
  { lemma: "τιμάω", translit: "timaō", meaning: "honor", class: "contract-alpha", stems: { present: "τιμα", imperfect: "τιμα", future: "τιμησ", aorist: "τιμησ" }, principalParts: ["τιμάω", "τιμήσω", "ἐτίμησα", "τετίμηκα", "τετίμημαι", "ἐτιμήθην"] },
  { lemma: "δηλόω", translit: "dēloō", meaning: "make clear, reveal", class: "contract-alpha", stems: { present: "δηλο", imperfect: "δηλο", future: "δηλωσ", aorist: "δηλωσ" }, principalParts: ["δηλόω", "δηλώσω", "ἐδήλωσα", "δεδήλωκα", "δεδήλωμαι", "ἐδηλώθην"] },
  { lemma: "ἔρχομαι", translit: "erchomai", meaning: "come, go", class: "deponent-middle", stems: { present: "ἐρχ", imperfect: "ἠρχ", future: "ἐλευσ", aorist: "ἐλθ" }, principalParts: ["ἔρχομαι", "ἐλεύσομαι", "ἦλθον", "ἐλήλυθα", "—", "—"] },
  { lemma: "κελεύω", translit: "keleuō", meaning: "order, command", class: "omega", stems: { present: "κελευ", imperfect: "κελευ", future: "κελευσ", aorist: "κελευσ" }, principalParts: ["κελεύω", "κελεύσω", "ἐκέλευσα", "κεκέλευκα", "κεκέλευμαι", "ἐκελεύσθην"] },
  { lemma: "καλέω", translit: "kaleō", meaning: "call", class: "contract-alpha", stems: { present: "καλε", imperfect: "καλε", future: "καλεσ", aorist: "καλεσ" }, principalParts: ["καλέω", "καλέσω", "ἐκάλεσα", "κέκληκα", "κέκλημαι", "ἐκλήθην"] },
  { lemma: "σῴζω", translit: "sōzō", meaning: "save, preserve", class: "omega", stems: { present: "σῳζ", imperfect: "σῳζ", future: "σωσ", aorist: "σωσ" }, principalParts: ["σῴζω", "σώσω", "ἔσωσα", "σέσωκα", "σέσωσμαι", "ἐσώθην"] },
];

const NOUNS = [
  { lemma: "λόγος", translit: "logos", meaning: "word, speech, reason", declension: "second-masc", stem: "λογ", gender: "masculine" },
  { lemma: "ἔργον", translit: "ergon", meaning: "work, deed", declension: "second-neut", stem: "ἐργ", gender: "neuter" },
  { lemma: "πόλις", translit: "polis", meaning: "city", declension: "third-polis", stem: "πολ", gender: "feminine" },
  { lemma: "ἀνήρ", translit: "anēr", meaning: "man", declension: "third-aner", stem: "ἀνδρ", gender: "masculine" },
  { lemma: "θεός", translit: "theos", meaning: "god", declension: "second-masc", stem: "θε", gender: "masculine" },
  { lemma: "οἶκος", translit: "oikos", meaning: "house", declension: "second-masc", stem: "οἰκ", gender: "masculine" },
  { lemma: "χώρα", translit: "chōra", meaning: "land", declension: "first-fem", stem: "χωρ", gender: "feminine" },
  { lemma: "ἄνθρωπος", translit: "anthrōpos", meaning: "person", declension: "second-masc", stem: "ἀνθρωπ", gender: "masculine" },
  { lemma: "γλῶττα", translit: "glōtta", meaning: "tongue, language", declension: "first-fem", stem: "γλωττ", gender: "feminine" },
  { lemma: "ἡμέρα", translit: "hēmera", meaning: "day", declension: "first-fem", stem: "ἡμερ", gender: "feminine" },
  { lemma: "νόμος", translit: "nomos", meaning: "law", declension: "second-masc", stem: "νομ", gender: "masculine" },
  { lemma: "δόμος", translit: "domos", meaning: "house", declension: "second-masc", stem: "δομ", gender: "masculine" },
  { lemma: "φίλος", translit: "philos", meaning: "friend", declension: "second-masc", stem: "φιλ", gender: "masculine" },
  { lemma: "δῶρον", translit: "dōron", meaning: "gift", declension: "second-neut", stem: "δωρ", gender: "neuter" },
  { lemma: "βίος", translit: "bios", meaning: "life", declension: "second-masc", stem: "βι", gender: "masculine" },
  { lemma: "ψυχή", translit: "psychē", meaning: "soul", declension: "first-fem", stem: "ψυχ", gender: "feminine" },
  { lemma: "παῖς", translit: "pais", meaning: "child", declension: "third-mixed", stem: "παιδ", gender: "masculine" },
  { lemma: "γυνή", translit: "gynē", meaning: "woman", declension: "third-mixed", stem: "γυναικ", gender: "feminine" },
  { lemma: "βιβλίον", translit: "biblion", meaning: "book", declension: "second-neut", stem: "βιβλι", gender: "neuter" },
  { lemma: "διδάσκαλος", translit: "didaskalos", meaning: "teacher", declension: "second-masc", stem: "διδασκαλ", gender: "masculine" },
  { lemma: "θάλαττα", translit: "thalatta", meaning: "sea", declension: "first-fem", stem: "θαλαττ", gender: "feminine" },
  { lemma: "χρόνος", translit: "chronos", meaning: "time", declension: "second-masc", stem: "χρον", gender: "masculine" },
  { lemma: "ναῦς", translit: "naus", meaning: "ship", declension: "third-naus", stem: "ναυ", gender: "feminine" },
  { lemma: "στρατιώτης", translit: "stratiōtēs", meaning: "soldier", declension: "first-masc", stem: "στρατιωτ", gender: "masculine" },
  { lemma: "στρατηγός", translit: "stratēgos", meaning: "general", declension: "second-masc", stem: "στρατηγ", gender: "masculine" },
  { lemma: "δικαιοσύνη", translit: "dikaiosynē", meaning: "justice", declension: "first-fem", stem: "δικαιοσυν", gender: "feminine" },
  { lemma: "ἀρετή", translit: "aretē", meaning: "virtue", declension: "first-fem", stem: "ἀρετ", gender: "feminine" },
  { lemma: "μάρτυς", translit: "martys", meaning: "witness", declension: "third-martys", stem: "μαρτυρ", gender: "masculine" },
  { lemma: "δικαστήριον", translit: "dikastērion", meaning: "court", declension: "second-neut", stem: "δικαστηρι", gender: "neuter" },
  { lemma: "φύσις", translit: "physis", meaning: "nature", declension: "third-polis", stem: "φυσ", gender: "feminine" },
  { lemma: "οἰκία", translit: "oikia", meaning: "household, house", declension: "first-fem", stem: "οἰκι", gender: "feminine" },
  { lemma: "ἀγορά", translit: "agora", meaning: "marketplace", declension: "first-fem", stem: "ἀγορ", gender: "feminine" },
  { lemma: "πόλεμος", translit: "polemos", meaning: "war", declension: "second-masc", stem: "πολεμ", gender: "masculine" },
  { lemma: "εἰρήνη", translit: "eirēnē", meaning: "peace", declension: "first-fem", stem: "εἰρην", gender: "feminine" },
];

const ADJECTIVES = [
  { lemma: "ἀγαθός", translit: "agathos", meaning: "good", stems: { masc: "ἀγαθ", fem: "ἀγαθ", neut: "ἀγαθ" } },
  { lemma: "καλός", translit: "kalos", meaning: "beautiful, noble", stems: { masc: "καλ", fem: "καλ", neut: "καλ" } },
  { lemma: "μικρός", translit: "mikros", meaning: "small", stems: { masc: "μικρ", fem: "μικρ", neut: "μικρ" } },
  { lemma: "σοφός", translit: "sophos", meaning: "wise", stems: { masc: "σοφ", fem: "σοφ", neut: "σοφ" } },
  { lemma: "δίκαιος", translit: "dikaios", meaning: "just", stems: { masc: "δικαι", fem: "δικαι", neut: "δικαι" } },
  { lemma: "κακός", translit: "kakos", meaning: "bad", stems: { masc: "κακ", fem: "κακ", neut: "κακ" } },
  { lemma: "μέγας", translit: "megas", meaning: "great", stems: { masc: "μεγ", fem: "μεγ", neut: "μεγ" } },
  { lemma: "ἀληθής", translit: "alēthēs", meaning: "true", stems: { masc: "ἀληθε", fem: "ἀληθε", neut: "ἀληθε" } },
  { lemma: "νέος", translit: "neos", meaning: "new, young", stems: { masc: "νε", fem: "νε", neut: "νε" } },
  { lemma: "παλαιός", translit: "palaios", meaning: "old, ancient", stems: { masc: "παλαι", fem: "παλαι", neut: "παλαι" } },
  { lemma: "πολύς", translit: "polys", meaning: "much, many", stems: { masc: "πολυ", fem: "πολλ", neut: "πολυ" } },
  { lemma: "ἄλλος", translit: "allos", meaning: "other", stems: { masc: "ἄλλ", fem: "ἄλλ", neut: "ἄλλ" } },
  { lemma: "πρῶτος", translit: "prōtos", meaning: "first", stems: { masc: "πρωτ", fem: "πρωτ", neut: "πρωτ" } },
  { lemma: "ἔσχατος", translit: "eschatos", meaning: "last", stems: { masc: "ἐσχατ", fem: "ἐσχατ", neut: "ἐσχατ" } },
];

const PRONOUNS = [
  { lemma: "ἐγώ", meaning: "I" },
  { lemma: "σύ", meaning: "you" },
  { lemma: "ἡμεῖς", meaning: "we" },
  { lemma: "ὑμεῖς", meaning: "you all" },
  { lemma: "οὗτος", meaning: "this" },
  { lemma: "αὐτός", meaning: "self, same" },
  { lemma: "ὅς", meaning: "who, which" },
  { lemma: "τίς", meaning: "who? what?" },
  { lemma: "τις", meaning: "someone, something" },
];

const PARTICIPLES = [
  { lemma: "λύων", meaning: "loosening", tenseVoice: "present active" },
  { lemma: "λύσας", meaning: "having loosened", tenseVoice: "aorist active" },
  { lemma: "λυθείς", meaning: "having been loosened", tenseVoice: "aorist passive" },
];

const PARTICLES = [
  { greek: "καί", meaning: "and, also" },
  { greek: "δέ", meaning: "but, and" },
  { greek: "γάρ", meaning: "for" },
  { greek: "οὖν", meaning: "therefore, then" },
  { greek: "μέν", meaning: "indeed, on the one hand" },
  { greek: "οὐ", meaning: "not" },
  { greek: "μή", meaning: "not" },
  { greek: "ὅτι", meaning: "that, because" },
  { greek: "εἰ", meaning: "if" },
  { greek: "ἐν", meaning: "in" },
  { greek: "εἰς", meaning: "into" },
  { greek: "περί", meaning: "about" },
];

const AUTHOR_READERS = {
  xenophon: [
    { greek: "οἱ στρατιῶται βαίνουσιν εἰς τὴν χώραν.", english: "The soldiers go into the land." },
    { greek: "ὁ στρατηγὸς τοὺς ἄνδρας κελεύει.", english: "The general commands the men." },
    { greek: "Ξενοφῶν λέγει ὅτι οἱ ἄνδρες βαίνουσι.", english: "Xenophon says that the men go." },
    { greek: "οἱ στρατιῶται ἐκ τῆς οἰκίας ἔρχονται.", english: "The soldiers come out of the house." },
  ],
  plato: [
    { greek: "ὁ Σωκράτης περὶ δικαιοσύνης λέγει.", english: "Socrates speaks about justice." },
    { greek: "τί ἐστιν ἀρετή;", english: "What is virtue?" },
    { greek: "ὁ Σωκράτης ἐρωτᾷ τί ἐστι δίκαιον.", english: "Socrates asks what is just." },
    { greek: "ἡ φύσις τί ἐστι;", english: "What is nature?" },
  ],
  lysias: [
    { greek: "ὁ ἀνὴρ εἰς τὸ δικαστήριον ἔρχεται.", english: "The man comes to the court." },
    { greek: "μάρτυρας καλεῖ.", english: "He calls witnesses." },
    { greek: "ἐν τῇ ἀγορᾷ μάρτυς λέγει.", english: "In the marketplace a witness speaks." },
  ],
};

const DAILY_LESSONS = [
  { title: "Agreement review", focus: "article + adjective + noun", tasks: ["Build one agreeing noun phrase", "Decline λόγος in singular", "Write one short sentence with εἰμί"] },
  { title: "Verb day", focus: "present and aorist contrast", tasks: ["Conjugate λύω in 1st singular present and aorist", "Write one sentence with λέγω", "Add one infinitive phrase"] },
  { title: "Reading day", focus: "mini-reader comprehension", tasks: ["Read one short sentence", "Identify the finite verb", "Translate the sentence"] },
];

const MOOD_DRILLS = [
  { mood: "subjunctive", prompt: "Give the present active subjunctive 3rd singular of λύω", answer: "λύῃ" },
  { mood: "subjunctive", prompt: "Give the present active subjunctive 1st plural of λύω", answer: "λύωμεν" },
  { mood: "optative", prompt: "Give the present active optative 3rd singular of λύω", answer: "λύοι" },
  { mood: "optative", prompt: "Give the present active optative 3rd plural of λύω", answer: "λύοιεν" },
];

const GUIDED_PROMPTS = [
  { title: "Article + adjective + noun", instruction: "Write a three-word phrase with article + adjective + noun in agreement.", example: "ὁ ἀγαθὸς λόγος" },
  { title: "Subject + verb", instruction: "Write a short sentence with a nominative subject and a finite verb.", example: "οἱ λόγοι παύουσι" },
  { title: "Noun + participle", instruction: "Write a phrase where a participle agrees with the noun it modifies.", example: "ὁ λύων ἀνήρ" },
  { title: "Infinitive construction", instruction: "Write a short phrase using an infinitive after a finite verb.", example: "βούλομαι λύειν" },
];

function normalize(text) {
  return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function scoreMatch(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  return x === y || x.includes(y) || y.includes(x);
}
function loadStoredState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("attic-greek-trainer-vnext");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function todayKey() { return new Date().toISOString().slice(0, 10); }
function computeStreak(lastStudyDate, currentStreak) {
  const today = todayKey();
  if (!lastStudyDate) return 1;
  if (lastStudyDate === today) return currentStreak || 1;
  const diff = Math.round((new Date(today) - new Date(lastStudyDate)) / (24 * 60 * 60 * 1000));
  return diff === 1 ? (currentStreak || 0) + 1 : 1;
}
function generateSecondMasc(stem, grammaticalCase, number) {
  const endings = { sg: { nom: "ος", gen: "ου", dat: "ῳ", acc: "ον", voc: "ε" }, pl: { nom: "οι", gen: "ων", dat: "οις", acc: "ους", voc: "οι" } };
  return `${stem}${endings[number][grammaticalCase]}`;
}
function generateSecondNeut(stem, grammaticalCase, number) {
  const endings = { sg: { nom: "ον", gen: "ου", dat: "ῳ", acc: "ον", voc: "ον" }, pl: { nom: "α", gen: "ων", dat: "οις", acc: "α", voc: "α" } };
  return `${stem}${endings[number][grammaticalCase]}`;
}
function generateFirstFem(stem, grammaticalCase, number) {
  const endings = { sg: { nom: "α", gen: "ας", dat: "ᾳ", acc: "αν", voc: "α" }, pl: { nom: "αι", gen: "ων", dat: "αις", acc: "ας", voc: "αι" } };
  return `${stem}${endings[number][grammaticalCase]}`;
}
function generateNounForm(noun, grammaticalCase, number) {
  if (noun.declension === "second-masc") return generateSecondMasc(noun.stem, grammaticalCase, number);
  if (noun.declension === "second-neut") return generateSecondNeut(noun.stem, grammaticalCase, number);
  if (noun.declension === "first-fem") return generateFirstFem(noun.stem, grammaticalCase, number);
  if (noun.declension === "first-masc") {
    const endings = { sg: { nom: "ης", gen: "ου", dat: "ῃ", acc: "ην", voc: "α" }, pl: { nom: "αι", gen: "ων", dat: "αις", acc: "ας", voc: "αι" } };
    return `${noun.stem}${endings[number][grammaticalCase]}`;
  }
  if (noun.declension === "third-polis") {
    const forms = {
      "πόλις": { sg: { nom: "πόλις", gen: "πόλεως", dat: "πόλει", acc: "πόλιν", voc: "πόλι" }, pl: { nom: "πόλεις", gen: "πόλεων", dat: "πόλεσι", acc: "πόλεις", voc: "πόλεις" } },
      "φύσις": { sg: { nom: "φύσις", gen: "φύσεως", dat: "φύσει", acc: "φύσιν", voc: "φύσι" }, pl: { nom: "φύσεις", gen: "φύσεων", dat: "φύσεσι", acc: "φύσεις", voc: "φύσεις" } },
    };
    return forms[noun.lemma][number][grammaticalCase];
  }
  if (noun.declension === "third-aner") {
    const forms = { sg: { nom: "ἀνήρ", gen: "ἀνδρός", dat: "ἀνδρί", acc: "ἄνδρα", voc: "ἄνερ" }, pl: { nom: "ἄνδρες", gen: "ἀνδρῶν", dat: "ἀνδράσι", acc: "ἄνδρας", voc: "ἄνδρες" } };
    return forms[number][grammaticalCase];
  }
  if (noun.declension === "third-naus") {
    const forms = { sg: { nom: "ναῦς", gen: "νεώς", dat: "νηί", acc: "ναῦν", voc: "ναῦ" }, pl: { nom: "νῆες", gen: "νεῶν", dat: "ναυσί", acc: "ναῦς", voc: "νῆες" } };
    return forms[number][grammaticalCase];
  }
  if (noun.declension === "third-martys") {
    const forms = { sg: { nom: "μάρτυς", gen: "μάρτυρος", dat: "μάρτυρι", acc: "μάρτυρα", voc: "μάρτυς" }, pl: { nom: "μάρτυρες", gen: "μαρτύρων", dat: "μάρτυσι", acc: "μάρτυρας", voc: "μάρτυρες" } };
    return forms[number][grammaticalCase];
  }
  if (noun.declension === "third-mixed") {
    if (noun.lemma === "παῖς") {
      const forms = { sg: { nom: "παῖς", gen: "παιδός", dat: "παιδί", acc: "παῖδα", voc: "παῖ" }, pl: { nom: "παῖδες", gen: "παίδων", dat: "παισί", acc: "παῖδας", voc: "παῖδες" } };
      return forms[number][grammaticalCase];
    }
    if (noun.lemma === "γυνή") {
      const forms = { sg: { nom: "γυνή", gen: "γυναικός", dat: "γυναικί", acc: "γυναῖκα", voc: "γύναι" }, pl: { nom: "γυναῖκες", gen: "γυναικῶν", dat: "γυναιξί", acc: "γυναῖκας", voc: "γυναῖκες" } };
      return forms[number][grammaticalCase];
    }
  }
  return noun.lemma;
}
function generateAdjectiveForm(adjective, gender, grammaticalCase, number) {
  if (adjective.lemma === "ἀληθής") {
    const forms = {
      masc: { sg: { nom: "ἀληθής", gen: "ἀληθοῦς", dat: "ἀληθεῖ", acc: "ἀληθῆ", voc: "ἀληθές" }, pl: { nom: "ἀληθεῖς", gen: "ἀληθῶν", dat: "ἀληθέσι", acc: "ἀληθεῖς", voc: "ἀληθεῖς" } },
      fem: { sg: { nom: "ἀληθής", gen: "ἀληθοῦς", dat: "ἀληθεῖ", acc: "ἀληθῆ", voc: "ἀληθές" }, pl: { nom: "ἀληθεῖς", gen: "ἀληθῶν", dat: "ἀληθέσι", acc: "ἀληθεῖς", voc: "ἀληθεῖς" } },
      neut: { sg: { nom: "ἀληθές", gen: "ἀληθοῦς", dat: "ἀληθεῖ", acc: "ἀληθές", voc: "ἀληθές" }, pl: { nom: "ἀληθῆ", gen: "ἀληθῶν", dat: "ἀληθέσι", acc: "ἀληθῆ", voc: "ἀληθῆ" } },
    };
    return forms[gender][number][grammaticalCase];
  }
  const stem = adjective.stems[gender];
  if (gender === "masc") return generateSecondMasc(stem, grammaticalCase, number);
  if (gender === "fem") return generateFirstFem(stem, grammaticalCase, number);
  return generateSecondNeut(stem, grammaticalCase, number);
}
function generateVerbForm(verb, tense, voice, person) {
  if (verb.class === "irregular-eimi") {
    const forms = { "1sg": "εἰμί", "2sg": "εἶ", "3sg": "ἐστί", "1pl": "ἐσμέν", "2pl": "ἐστέ", "3pl": "εἰσί" };
    return forms[person];
  }
  if (verb.class === "mi") {
    const forms = { "1sg": "δίδωμι", "2sg": "δίδως", "3sg": "δίδωσι", "1pl": "δίδομεν", "2pl": "δίδοτε", "3pl": "διδόασι" };
    return forms[person];
  }
  const activePrimary = { "1sg": "ω", "2sg": "εις", "3sg": "ει", "1pl": "ομεν", "2pl": "ετε", "3pl": "ουσι" };
  const activeSecondary = { "1sg": "ον", "2sg": "ες", "3sg": "ε", "1pl": "ομεν", "2pl": "ετε", "3pl": "ον" };
  const middlePrimary = { "1sg": "ομαι", "2sg": "ῃ", "3sg": "εται", "1pl": "ομεθα", "2pl": "εσθε", "3pl": "ονται" };
  const presentStem = verb.stems.present;
  const imperfectStem = `ἐ${verb.stems.imperfect}`;
  if (verb.class === "deponent-middle") {
    return `${tense === "imperfect" ? imperfectStem : presentStem}${tense === "imperfect" ? { "1sg": "ομην", "2sg": "ου", "3sg": "ετο", "1pl": "ομεθα", "2pl": "εσθε", "3pl": "οντο" }[person] : middlePrimary[person]}`;
  }
  if (verb.class === "contract-alpha") {
    const map = { "1sg": "ῶ", "2sg": "ᾷς", "3sg": "ᾷ", "1pl": "ῶμεν", "2pl": "ᾶτε", "3pl": "ῶσι" };
    return tense === "present" ? `${presentStem.slice(0, -1)}${map[person]}` : `${imperfectStem}${activeSecondary[person]}`;
  }
  if (tense === "present") return `${presentStem}${voice === "middle" ? middlePrimary[person] : activePrimary[person]}`;
  if (tense === "imperfect") return `${imperfectStem}${voice === "middle" ? { "1sg": "ομην", "2sg": "ου", "3sg": "ετο", "1pl": "ομεθα", "2pl": "εσθε", "3pl": "οντο" }[person] : activeSecondary[person]}`;
  if (tense === "future") return `${verb.stems.future}${activePrimary[person]}`;
  return `ἐ${verb.stems.aorist}${activeSecondary[person]}`;
}
function explainVerbForm(verb, tense, voice, person, form) {
  return `${form} = ${PERSONS.find((p) => p.key === person)?.label} ${tense} ${voice} indicative of ${verb.lemma}.`;
}
function buildLexicon() {
  const pronouns = PRONOUNS.map((p) => ({ greek: p.lemma, translit: "", meaning: p.meaning, category: "pronoun", chapter: "Pronouns", mastery: 45 }));
  const participles = PARTICIPLES.map((p) => ({ greek: p.lemma, translit: "", meaning: p.meaning, category: "participle", chapter: "Participles", mastery: 45 }));
  const infinitives = [
    { greek: "λύειν", translit: "luein", meaning: "to loosen", category: "infinitive", chapter: "Infinitives", mastery: 45 },
    { greek: "παύειν", translit: "pauein", meaning: "to stop", category: "infinitive", chapter: "Infinitives", mastery: 45 },
    { greek: "γενέσθαι", translit: "genesthai", meaning: "to become", category: "infinitive", chapter: "Infinitives", mastery: 45 },
    { greek: "μαθεῖν", translit: "mathein", meaning: "to learn", category: "infinitive", chapter: "Infinitives", mastery: 45 },
    { greek: "λέγειν", translit: "legein", meaning: "to speak", category: "infinitive", chapter: "Infinitives", mastery: 45 },
  ];
  const particles = PARTICLES.map((p) => ({ greek: p.greek, translit: "", meaning: p.meaning, category: "particle", chapter: "Particles and function words", mastery: 45 }));
  return [
    ...VERBS.map((v) => ({ greek: v.lemma, translit: v.translit, meaning: v.meaning, category: "verb", chapter: "Core verbs", mastery: 45 })),
    ...NOUNS.map((n) => ({ greek: n.lemma, translit: n.translit, meaning: n.meaning, category: "noun", chapter: "Nominals", mastery: 45 })),
    ...ADJECTIVES.map((a) => ({ greek: a.lemma, translit: a.translit, meaning: a.meaning, category: "adjective", chapter: "Adjectives", mastery: 45 })),
    ...pronouns,
    ...participles,
    ...infinitives,
    ...particles,
  ];
}
function evaluateComposition(input) {
  const text = normalize(input);
  if (!text) return { score: 0, feedback: "Write a short Attic phrase or sentence.", suggestions: [], checks: [] };
  const tokens = text.split(/\s+/).filter(Boolean);
  const checks = [];
  const suggestions = [];
  let score = 40;
  const lexemes = buildLexicon().map((x) => normalize(x.greek));
  const recognized = tokens.filter((t) => lexemes.some((w) => t.includes(w) || w.includes(t))).length;
  score += Math.min(30, recognized * 8);
  if (tokens.some((t) => buildLexicon().some((x) => x.category === "infinitive" && normalize(x.greek) === normalize(t)))) {
    checks.push("Infinitive detected.");
    score += 6;
  }
  if (tokens.some((t) => VERBS.some((v) => PERSONS.some((p) => normalize(generateVerbForm(v, "present", v.class === "deponent-middle" ? "middle" : "active", p.key)) === normalize(t))))) {
    checks.push("Finite verb detected.");
    score += 10;
  } else {
    suggestions.push("Consider adding a finite verb or clearer predicate.");
  }
  if (tokens.length >= 3) {
    checks.push("Phrase length supports a fuller structure.");
    score += 6;
  } else {
    suggestions.push("Try a fuller phrase with at least three words.");
  }
  if (tokens.some((t) => ["τις", "τίς", "ὅς", "οὗτος", "αὐτός"].map(normalize).includes(normalize(t)))) {
    checks.push("Pronoun content detected.");
    score += 4;
  }
  score = Math.min(100, score);
  return {
    score,
    feedback: score >= 80 ? "Good start. The phrase shows recognizable Attic material and some internal structure." : score >= 55 ? "Promising, but it could be more explicit or more tightly built." : "Partial match. Try clearer agreement, a stronger predicate, or a fuller phrase.",
    suggestions,
    checks,
  };
}

export default function App() {
  const stored = loadStoredState();
  const vocab = useMemo(() => buildLexicon(), []);
  const [trainerType, setTrainerType] = useState("verb");
  const [trainerAnswer, setTrainerAnswer] = useState("");
  const [trainerFeedback, setTrainerFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedVerbLemma, setSelectedVerbLemma] = useState("λύω");
  const [selectedTense, setSelectedTense] = useState("present");
  const [selectedVoice, setSelectedVoice] = useState("active");
  const [selectedPerson, setSelectedPerson] = useState("1sg");
  const [selectedNounLemma, setSelectedNounLemma] = useState("λόγος");
  const [selectedCase, setSelectedCase] = useState("nom");
  const [selectedNumber, setSelectedNumber] = useState("sg");
  const [selectedAdjectiveLemma, setSelectedAdjectiveLemma] = useState("ἀγαθός");
  const [selectedAdjectiveGender, setSelectedAdjectiveGender] = useState("masc");
  const [mistakeLog, setMistakeLog] = useState(stored?.mistakeLog || []);
  const [studyStats, setStudyStats] = useState(stored?.studyStats || { totalAnswered: 0, totalCorrect: 0, streak: 0, lastStudyDate: null });
  const [dailyLessonIndex, setDailyLessonIndex] = useState(0);
  const [moodIndex, setMoodIndex] = useState(0);
  const [moodInput, setMoodInput] = useState("");
  const [moodResult, setMoodResult] = useState(null);
  const [lexiconQuery, setLexiconQuery] = useState("");
  const [readerKey, setReaderKey] = useState("xenophon");
  const [compositionInput, setCompositionInput] = useState("");
  const [compositionResult, setCompositionResult] = useState(null);
  const [guidedPromptIndex, setGuidedPromptIndex] = useState(0);
  const [exportMessage, setExportMessage] = useState("");

  const selectedVerb = VERBS.find((v) => v.lemma === selectedVerbLemma) || VERBS[0];
  const selectedNoun = NOUNS.find((n) => n.lemma === selectedNounLemma) || NOUNS[0];
  const selectedAdjective = ADJECTIVES.find((a) => a.lemma === selectedAdjectiveLemma) || ADJECTIVES[0];
  const manualVerbForm = generateVerbForm(selectedVerb, selectedTense, selectedVoice, selectedPerson);
  const manualNounForm = generateNounForm(selectedNoun, selectedCase, selectedNumber);
  const manualAdjectiveForm = generateAdjectiveForm(selectedAdjective, selectedAdjectiveGender, selectedCase, selectedNumber);
  const currentLesson = DAILY_LESSONS[dailyLessonIndex % DAILY_LESSONS.length];
  const currentMoodDrill = MOOD_DRILLS[moodIndex % MOOD_DRILLS.length];
  const currentGuidedPrompt = GUIDED_PROMPTS[guidedPromptIndex % GUIDED_PROMPTS.length];
  const averageMastery = 52;
  const accuracy = studyStats.totalAnswered > 0 ? Math.round((studyStats.totalCorrect / studyStats.totalAnswered) * 100) : 0;
  const lexiconCount = vocab.length;
  const deployReady = lexiconCount >= 100;

  const lexiconRows = useMemo(() => {
    const q = normalize(lexiconQuery);
    return vocab.filter((v) => !q || normalize(v.greek).includes(q) || normalize(v.meaning).includes(q)).slice(0, 60);
  }, [vocab, lexiconQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("attic-greek-trainer-vnext", JSON.stringify({ mistakeLog, studyStats }));
  }, [mistakeLog, studyStats]);

  const resetProgress = () => {
    setMistakeLog([]);
    setStudyStats({ totalAnswered: 0, totalCorrect: 0, streak: 0, lastStudyDate: null });
    setExportMessage("Progress reset.");
    if (typeof window !== "undefined") window.localStorage.removeItem("attic-greek-trainer-vnext");
  };
  const exportProgress = async () => {
    const payload = JSON.stringify({ mistakeLog, studyStats }, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      setExportMessage("Progress copied to clipboard.");
    } catch {
      setExportMessage("Clipboard copy failed.");
    }
  };

  const makeTrainerPrompt = () => {
    if (trainerType === "verb") return { prompt: `Give the ${PERSONS.find((p) => p.key === selectedPerson)?.label} ${selectedTense} ${selectedVoice} indicative of ${selectedVerb.lemma}`, answer: manualVerbForm, explanation: explainVerbForm(selectedVerb, selectedTense, selectedVoice, selectedPerson, manualVerbForm), kind: "verb" };
    if (trainerType === "declension") return { prompt: `Give the ${CASES.find((c) => c.key === selectedCase)?.label.toLowerCase()} ${NUMBERS.find((n) => n.key === selectedNumber)?.label.toLowerCase()} of ${selectedNoun.lemma}`, answer: manualNounForm, explanation: `${manualNounForm} = ${selectedNoun.lemma}.`, kind: "declension" };
    return { prompt: `Give the ${CASES.find((c) => c.key === selectedCase)?.label.toLowerCase()} ${NUMBERS.find((n) => n.key === selectedNumber)?.label.toLowerCase()} ${GENDERS.find((g) => g.key === selectedAdjectiveGender)?.label.toLowerCase()} of ${selectedAdjective.lemma}`, answer: manualAdjectiveForm, explanation: `${manualAdjectiveForm} = ${selectedAdjective.lemma}.`, kind: "adjective" };
  };
  const trainer = makeTrainerPrompt();

  const submitTrainer = () => {
    const ok = scoreMatch(trainerAnswer, trainer.answer);
    setTrainerFeedback(ok ? "correct" : "incorrect");
    setShowExplanation(true);
    const updatedStreak = computeStreak(studyStats.lastStudyDate, studyStats.streak);
    setStudyStats((prev) => ({ totalAnswered: prev.totalAnswered + 1, totalCorrect: prev.totalCorrect + (ok ? 1 : 0), streak: updatedStreak, lastStudyDate: todayKey() }));
    if (!ok) setMistakeLog((prev) => [{ prompt: trainer.prompt, expected: trainer.answer, yourAnswer: trainerAnswer || "(blank)", kind: trainer.kind, date: todayKey() }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={deployReady ? "secondary" : "outline"}>{deployReady ? "Deploy-ready content" : "Content still growing"}</Badge>
            <Badge variant="secondary">Attic Greek</Badge>
            <Badge variant="outline">React + Vite</Badge>
            <Badge variant="outline">Saved progress</Badge>
          </div>
          <h1 className="text-3xl font-semibold">Attic Greek Trainer vNext</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">A deployable study app with morphology tools, a searchable lexicon, guided composition, daily lessons, mood drills, and author-based mini-readers.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportProgress}>Export progress</Button>
            <Button variant="outline" onClick={resetProgress}>Reset progress</Button>
            {exportMessage && <div className="self-center text-sm text-slate-600">{exportMessage}</div>}
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 gap-1 rounded-2xl bg-white p-1 shadow-sm md:grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="trainer">Trainer</TabsTrigger>
            <TabsTrigger value="engine">Engine</TabsTrigger>
            <TabsTrigger value="lexicon">Lexicon</TabsTrigger>
            <TabsTrigger value="readers">Readers</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="rounded-3xl shadow-sm lg:col-span-2">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Brain className="h-5 w-5" /> Study pulse</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><div className="mb-2 flex items-center justify-between text-sm"><span>Overall mastery</span><span>{averageMastery}%</span></div><Progress value={averageMastery} /></div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border p-4 text-sm">Use the lexicon to search quickly, then reinforce in lessons.</div>
                    <div className="rounded-2xl border p-4 text-sm">Readers by Xenophon, Plato, and Lysias are ready for short daily practice.</div>
                    <div className="rounded-2xl border p-4 text-sm">Review mistakes first for spaced repetition.</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><LibraryBig className="h-5 w-5" /> Stats & path</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border p-3 flex items-center justify-between"><span>Current streak</span><Badge>{studyStats.streak} days</Badge></div>
                  <div className="rounded-2xl border p-3 flex items-center justify-between"><span>Total answered</span><Badge>{studyStats.totalAnswered}</Badge></div>
                  <div className="rounded-2xl border p-3 flex items-center justify-between"><span>Accuracy</span><Badge>{accuracy}%</Badge></div>
                  <div className="rounded-2xl border p-3 flex items-center justify-between"><span>Mistakes logged</span><Badge>{mistakeLog.length}</Badge></div>
                  <div className="rounded-2xl border p-3 flex items-center justify-between"><span>Lexicon rows</span><Badge>{lexiconCount}</Badge></div>
                  <div className="rounded-2xl border p-3 flex items-center justify-between"><span>Deploy readiness</span><Badge>{deployReady ? "Ready" : "Almost there"}</Badge></div>
                  <div className="rounded-2xl border p-3"><div className="font-medium">Adaptive next focus</div><div className="mt-1 text-xs">{mistakeLog.length === 0 ? "Build baseline with mixed drills." : `Prioritize ${mistakeLog[0]?.kind || "review"} and related forms.`}</div></div>
                  <div className="rounded-2xl border p-3"><div className="font-medium">Weekly target</div><div className="mt-1 text-xs">Complete 20 prompts with 80%+ accuracy. Review mistakes first.</div></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trainer">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Sigma className="h-5 w-5" /> Core trainer</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <NativeSelect value={trainerType} onChange={setTrainerType} options={[{value:"verb",label:"Verb"},{value:"declension",label:"Declension"},{value:"adjective",label:"Adjective"}]} />
                    <NativeSelect value={selectedVerbLemma} onChange={setSelectedVerbLemma} options={VERBS.map((v)=>({value:v.lemma,label:v.lemma}))} />
                    <NativeSelect value={selectedTense} onChange={setSelectedTense} options={[{value:"present",label:"Present"},{value:"imperfect",label:"Imperfect"},{value:"future",label:"Future"},{value:"aorist",label:"Aorist"}]} />
                    <NativeSelect value={selectedPerson} onChange={setSelectedPerson} options={PERSONS.map((p)=>({value:p.key,label:p.label}))} />
                  </div>
                  <div className="rounded-2xl border p-4"><div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Prompt</div><div className="text-lg font-medium">{trainer.prompt}</div></div>
                  <Input value={trainerAnswer} onChange={(e) => setTrainerAnswer(e.target.value)} placeholder="Type your answer" />
                  {trainerFeedback === "correct" && <div className="flex items-center gap-2 rounded-2xl border p-3 text-sm"><CheckCircle2 className="h-4 w-4" /> Correct.</div>}
                  {trainerFeedback === "incorrect" && <div className="rounded-2xl border p-3 text-sm">Not quite. Expected answer: <span className="font-medium">{trainer.answer}</span></div>}
                  {showExplanation && <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-600">{trainer.explanation}</div>}
                  <div className="flex gap-2"><Button onClick={submitTrainer}>Check</Button><Button variant="outline" onClick={() => { setTrainerAnswer(""); setTrainerFeedback(null); setShowExplanation(false); }}><RotateCcw className="mr-2 h-4 w-4" /> Clear</Button></div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5" /> What this version adds</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border p-3">Visible lexicon search.</div>
                  <div className="rounded-2xl border p-3">Author readers for Xenophon, Plato, and Lysias.</div>
                  <div className="rounded-2xl border p-3">Daily lessons and mood drills.</div>
                  <div className="rounded-2xl border p-3">Saved progress for ongoing practice.</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engine">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="rounded-3xl shadow-sm"><CardHeader><CardTitle className="text-xl">Verb preview</CardTitle></CardHeader><CardContent><div className="text-3xl font-semibold">{manualVerbForm}</div><div className="mt-2 text-sm text-slate-600">{explainVerbForm(selectedVerb, selectedTense, selectedVoice, selectedPerson, manualVerbForm)}</div></CardContent></Card>
              <Card className="rounded-3xl shadow-sm"><CardHeader><CardTitle className="text-xl">Noun preview</CardTitle></CardHeader><CardContent><div className="grid gap-3"><NativeSelect value={selectedNounLemma} onChange={setSelectedNounLemma} options={NOUNS.map((n)=>({value:n.lemma,label:n.lemma}))} /><NativeSelect value={selectedCase} onChange={setSelectedCase} options={CASES.map((c)=>({value:c.key,label:c.label}))} /><NativeSelect value={selectedNumber} onChange={setSelectedNumber} options={NUMBERS.map((n)=>({value:n.key,label:n.label}))} /><div className="text-3xl font-semibold">{manualNounForm}</div></div></CardContent></Card>
              <Card className="rounded-3xl shadow-sm"><CardHeader><CardTitle className="text-xl">Adjective preview</CardTitle></CardHeader><CardContent><div className="grid gap-3"><NativeSelect value={selectedAdjectiveLemma} onChange={setSelectedAdjectiveLemma} options={ADJECTIVES.map((a)=>({value:a.lemma,label:a.lemma}))} /><NativeSelect value={selectedAdjectiveGender} onChange={setSelectedAdjectiveGender} options={GENDERS.map((g)=>({value:g.key,label:g.label}))} /><div className="text-3xl font-semibold">{manualAdjectiveForm}</div></div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="lexicon">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Languages className="h-5 w-5" /> Searchable lexicon</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 rounded-2xl border px-3 py-2"><Search className="h-4 w-4 text-slate-500" /><Input value={lexiconQuery} onChange={(e) => setLexiconQuery(e.target.value)} placeholder="Search Greek or English" className="border-0 shadow-none focus-visible:ring-0" /></div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {lexiconRows.map((row, i) => <div key={i} className="rounded-2xl border p-3 text-sm"><div className="flex items-center justify-between gap-3"><span className="font-medium text-lg">{row.greek}</span><Badge variant="outline">{row.category}</Badge></div><div className="text-slate-600">{row.meaning}</div><div className="text-xs text-slate-500">{row.chapter}</div></div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readers">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><BookOpen className="h-5 w-5" /> Author readers</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <NativeSelect value={readerKey} onChange={setReaderKey} options={[{value:"xenophon",label:"Xenophon"},{value:"plato",label:"Plato"},{value:"lysias",label:"Lysias"}]} className="max-w-xs" />
                <div className="space-y-3">
                  {AUTHOR_READERS[readerKey].map((item, i) => <div key={i} className="rounded-2xl border p-4"><div className="font-medium text-lg">{item.greek}</div><div className="mt-1 text-sm text-slate-600">{item.english}</div></div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="text-xl">Daily lesson</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border bg-slate-50 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Focus</div><div className="mt-2 text-xl font-medium">{currentLesson.title}</div><div className="mt-1 text-sm text-slate-600">{currentLesson.focus}</div></div>
                  <div className="space-y-2">{currentLesson.tasks.map((task, i) => <div key={i} className="rounded-2xl border p-3 text-sm">{task}</div>)}</div>
                  <Button variant="outline" onClick={() => setDailyLessonIndex((dailyLessonIndex + 1) % DAILY_LESSONS.length)}>Next lesson</Button>
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="text-xl">Mood trainer</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border bg-slate-50 p-4 text-sm">{currentMoodDrill.prompt}</div>
                  <Input value={moodInput} onChange={(e) => setMoodInput(e.target.value)} placeholder="Type Greek form" />
                  <div className="flex gap-2"><Button onClick={() => setMoodResult(scoreMatch(moodInput, currentMoodDrill.answer) ? "Correct" : `Try again — ${currentMoodDrill.answer}`)}>Check</Button><Button variant="outline" onClick={() => { setMoodIndex((moodIndex + 1) % MOOD_DRILLS.length); setMoodInput(""); setMoodResult(null); }}>Next</Button></div>
                  {moodResult && <div className="text-sm">{moodResult}</div>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="composition">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="text-xl">Guided composition</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border bg-slate-50 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Prompt</div><div className="mt-2 text-lg font-medium">{currentGuidedPrompt.title}</div><div className="mt-1 text-sm text-slate-600">{currentGuidedPrompt.instruction}</div><div className="mt-2 text-sm text-slate-500">Example: {currentGuidedPrompt.example}</div></div>
                  <Input value={compositionInput} onChange={(e) => setCompositionInput(e.target.value)} placeholder="Write a short Attic phrase or sentence" />
                  <div className="flex gap-2"><Button onClick={() => setCompositionResult(evaluateComposition(compositionInput))}>Check composition</Button><Button variant="outline" onClick={() => { setGuidedPromptIndex((guidedPromptIndex + 1) % GUIDED_PROMPTS.length); setCompositionResult(null); }}>Next prompt</Button></div>
                  {compositionResult && <div className="rounded-2xl border p-4 text-sm space-y-2"><div><span className="font-medium">Score:</span> {compositionResult.score}%</div><div>{compositionResult.feedback}</div>{compositionResult.checks.map((c, i) => <div key={i} className="text-slate-700">✓ {c}</div>)}{compositionResult.suggestions.map((s, i) => <div key={`s-${i}`} className="text-slate-600">• {s}</div>)}</div>}
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="text-xl">What it checks now</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border p-3">Recognizes known vocabulary from the study bank.</div>
                  <div className="rounded-2xl border p-3">Checks for likely finite verbs.</div>
                  <div className="rounded-2xl border p-3">Detects a few core infinitives and high-frequency pronouns.</div>
                  <div className="rounded-2xl border p-3">Rewards fuller phrase structure.</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="rounded-3xl shadow-sm lg:col-span-2"><CardHeader><CardTitle className="text-xl">Principal parts</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{VERBS.slice(0, 12).map((v) => <div key={v.lemma} className="rounded-2xl border p-4 text-sm"><div className="text-lg font-medium">{v.lemma}</div><div className="text-slate-500">{v.meaning}</div><div className="mt-2 space-y-1">{v.principalParts.map((p, i) => <div key={i}>{i + 1}. {p}</div>)}</div></div>)}</CardContent></Card>
              <Card className="rounded-3xl shadow-sm"><CardHeader><CardTitle className="text-xl">Form library</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-600"><div className="rounded-2xl border p-3">Verbs: {VERBS.length}</div><div className="rounded-2xl border p-3">Nouns: {NOUNS.length}</div><div className="rounded-2xl border p-3">Adjectives: {ADJECTIVES.length}</div><div className="rounded-2xl border p-3">Pronouns: {PRONOUNS.length}</div><div className="rounded-2xl border p-3">Participles: {PARTICIPLES.length}</div><div className="rounded-2xl border p-3">Total lexicon rows: {vocab.length}</div><div className="rounded-2xl border p-3">Author packs: {Object.keys(AUTHOR_READERS).length}</div></CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
