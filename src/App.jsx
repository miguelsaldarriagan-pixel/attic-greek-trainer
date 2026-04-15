import React, { useEffect, useMemo, useState } from "react";
import { Brain, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Eye, EyeOff, Languages, LibraryBig, RotateCcw, Search, Sigma, Sparkles, Star } from "lucide-react";
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
  { mood: "subjunctive", prompt: "Give the present active subjunctive 2nd singular of παύω", answer: "παύῃς" },
  { mood: "subjunctive", prompt: "Give the present active subjunctive 3rd plural of λέγω", answer: "λέγωσι" },
  { mood: "optative", prompt: "Give the present active optative 1st singular of παύω", answer: "παύοιμι" },
  { mood: "optative", prompt: "Give the present active optative 2nd plural of λέγω", answer: "λέγοιτε" },
  { mood: "subjunctive", prompt: "Give the present active subjunctive 3rd singular of ποιέω", answer: "ποιῇ" },
  { mood: "optative", prompt: "Give the present active optative 3rd singular of ποιέω", answer: "ποιοίη" },
];

const DCC_CORE = [
  { greek: "ὁ ἡ τό", meaning: "the", category: "definite article", semanticGroup: "Pronouns/Interrogatives", rank: 1 },
  { greek: "αὐτός αὐτή αὐτό", meaning: "him- her- itself etc. (for emphasis); the same (with article); (pron.) him, her, it etc. (in oblique cases)", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 2 },
  { greek: "καί", meaning: "and, also, even; καί...καί both...and", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 3 },
  { greek: "δέ", meaning: "and; but", category: "conjunction: coordinating", semanticGroup: "Particles", rank: 4 },
  { greek: "τίς τί", meaning: "who? what? which? (interrog. pron./adj.)", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 5 },
  { greek: "εἰμί, ἔσομαι, impf. ἦν, infin. εἶναι", meaning: "be, exist", category: "verb: irregular", semanticGroup: "Humanity and Being", rank: 6 },
  { greek: "οὗτος αὕτη τοῦτο", meaning: "this, these; μετὰ ταῦτα after this", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 7 },
  { greek: "ἤ", meaning: "or; than (after a comparative); ἤ...ἤ either...or", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 8 },
  { greek: "ἐν", meaning: "in, among (+dat.)", category: "preposition", semanticGroup: "Direction", rank: 9 },
  { greek: "μέν...δέ", meaning: "on the one hand...on the other hand (often untranslated); μέν (by itself) indeed", category: "conjunction: coordinating", semanticGroup: "Particles", rank: 10 },
  { greek: "τις τι", meaning: "someone, something, anyone, anything, some, any (enclitic indef. pron./adj.)", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 11 },
  { greek: "ὅς ἥ ὅ", meaning: "who, which, that", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 12 },
  { greek: "γάρ", meaning: "for (explanatory), indeed, in fact (confirming)", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 13 },
  { greek: "οὐ, οὐκ, οὐχ", meaning: "not (with indicative verbs)", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 14 },
  { greek: "λέγω, ἐρῶ, εἶπον, εἴρηκα, λέλεγμαι, ἐλέχθην and ἐρρήθην", meaning: "say, speak (of), recount; pick up, collect, count", category: "verb: irregular", semanticGroup: "Writing and Talking", rank: 15 },
  { greek: "ὡς", meaning: "as, since; (introducing purpose clause) so that (+subj./opt.); (introducing indir. statement) that", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 16 },
  { greek: "τε", meaning: "and; τε…τε both…and", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 17 },
  { greek: "εἰς", meaning: "into, to, towards (+acc.)", category: "preposition", semanticGroup: "Direction", rank: 18 },
  { greek: "ἐπί", meaning: "at (+gen.); on (+dat.); on to, against (+acc.)", category: "preposition", semanticGroup: "Direction", rank: 19 },
  { greek: "κατά", meaning: "down, down (from or along), throughout, according to; κατὰ γῆν by land; κατὰ φύσιν in accordance with nature; κατ’ ἔθνη by nations; καθ᾿ἕνα one by one.", category: "preposition", semanticGroup: "Direction", rank: 20 },
  { greek: "ἐγώ ἐμοῦ, (pl.) ἡμεῖς, ἡμῶν", meaning: "I, we", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 21 },
  { greek: "πρός", meaning: "from the side of, in the presence of (+gen.); near, at, in addition to (+dat.); to, towards, in relation to (+acc.)", category: "preposition", semanticGroup: "Direction", rank: 22 },
  { greek: "γίγνομαι, γενήσομαι, 2 aor. ἐγενόμην, γέγονα, γεγένημαι, ἐγενήθην", meaning: "become; be born; happen, be", category: "verb: deponent", semanticGroup: "Humanity and Being", rank: 23 },
  { greek: "ἐάν (εἰ-ἄν)", meaning: "if (+subj.)", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 24 },
  { greek: "διά", meaning: "through, during, because of (+gen., acc.)", category: "preposition", semanticGroup: "Prepositions without Direction", rank: 25 },
  { greek: "ἀλλά", meaning: "but", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 26 },
  { greek: "πᾶς πᾶσα πᾶν", meaning: "every, all; whole (with article)", category: "noun: 3rd declension irregular", semanticGroup: "Measurements and Numerals", rank: 27 },
  { greek: "ἔχω, ἕξω or σχήσω, 2 aor. ἔσχον, ἔσχηκα, impf. εἶχον", meaning: "have, hold, keep", category: "verb: irregular", semanticGroup: "Taking and Giving", rank: 28 },
  { greek: "ἐκ, ἐξ", meaning: "from, out of (+gen.)", category: "preposition", semanticGroup: "Direction", rank: 29 },
  { greek: "πολύς πολλή πολύ", meaning: "much, many; ὡς ἐπὶ τὸ πολύ for the most part", category: "noun: 3rd declension irregular", semanticGroup: "Measurements and Numerals", rank: 30 },
  { greek: "περί", meaning: "around, about; concerning (+gen.)", category: "preposition", semanticGroup: "Direction", rank: 31 },
  { greek: "μή", meaning: "not (marks the negative as subjective or conditional); εἰ μή if not, except", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 32 },
  { greek: "ὅστις ἥτις ὅ τι", meaning: "anyone who, anything which; (in indir. quest.) who, which, what", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 33 },
  { greek: "ἄν", meaning: "[marks verbs as potential (with optative), or generalizing (with subjunctive)]", category: "adverb", semanticGroup: "Particles", rank: 34 },
  { greek: "σύ, σοῦ, (pl.) ὑμεῖς, ὑμῶν", meaning: "you", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 35 },
  { greek: "ἀνά", meaning: "up, on; throughout", category: "preposition", semanticGroup: "Direction", rank: 36 },
  { greek: "ὅτι", meaning: "because, that; (with superl.) as...as possible", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 37 },
  { greek: "εἰ", meaning: "if (+indic. or opt.); εἴπερ if indeed", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 38 },
  { greek: "ἄλλος ἄλλη ἄλλο", meaning: "other, another", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 39 },
  { greek: "ἀπό", meaning: "from (+gen.)", category: "preposition", semanticGroup: "Direction", rank: 40 },
  { greek: "φημί, φήσω, impf. ἔφην", meaning: "say, assert, declare; οὐ φημί deny, refuse, say that...not", category: "verb: -μι", semanticGroup: "Writing and Talking", rank: 41 },
  { greek: "ὑπό", meaning: "under (+gen., dat.); by (+gen. of personal agent); down under (+acc.)", category: "preposition", semanticGroup: "Direction", rank: 42 },
  { greek: "ποιέω, ποιήσω, ἐποίησα, πεποίηκα, πεποίημαι, ἐποιήθην", meaning: "make, produce, cause, do; (mid.) consider, reckon", category: "verb: contracted", semanticGroup: "Work and Leisure", rank: 43 },
  { greek: "οὖν", meaning: "therefore, accordingly; at any rate", category: "adverb", semanticGroup: "Particles", rank: 44 },
  { greek: "λόγος λόγου, ὁ", meaning: "word, speech, discourse; thought, reason, account", category: "noun: 2nd declension", semanticGroup: "Writing and Talking", rank: 45 },
  { greek: "παρά", meaning: "from (+gen.); beside (+dat.); to, to the side of, contrary to (+acc.)", category: "preposition", semanticGroup: "Direction", rank: 46 },
  { greek: "οὕτως", meaning: "in this way", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 47 },
  { greek: "πρότερος προτέρα πρότερον", meaning: "before, earlier; τὸ πρότερον previously, before", category: "adjective: 1st and 2nd declension", semanticGroup: "Time", rank: 48 },
  { greek: "θεός θεοῦ, ὁ/ἡ", meaning: "god, goddess", category: "noun: 2nd declension", semanticGroup: "Religion", rank: 49 },
  { greek: "μετά", meaning: "with (+gen.); after (+acc.)", category: "preposition", semanticGroup: "Prepositions without Direction", rank: 50 },
  { greek: "ἑαυτοῦ ἑαυτῆς ἑαυτοῦ", meaning: "him- her- itself (reflexive pron.)", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 51 },
  { greek: "μέγας μεγάλη μέγα", meaning: "big, great, powerful", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 52 },
  { greek: "οὐδέ", meaning: "and not, but not, nor; οὐδέ...οὐδέ not even...nor yet", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 53 },
  { greek: "ἐκεῖνος ἐκείνη ἐκεῖνο", meaning: "that person or thing; ἐκεῖνος…οὗτος the former…the latter", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 54 },
  { greek: "τοιοῦτος τοιαύτη τοιοῦτο", meaning: "such, of such a sort", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 55 },
  { greek: "οὐδείς οὐδεμία οὐδέν", meaning: "no one, nothing", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 56 },
  { greek: "εἶπον", meaning: "I said, I spoke, 2 aor. → λέγω, φημί", category: "verb: irregular", semanticGroup: "Writing and Talking", rank: 57 },
  { greek: "ἀγαθός ἀγαθή ἀγαθόν", meaning: "good, virtuous, brave, noble", category: "adjective: 1st and 2nd declension", semanticGroup: "Ethics and Morals", rank: 58 },
  { greek: "γε", meaning: "(enclitic) indeed; at least, at any rate", category: "adverb", semanticGroup: "Particles", rank: 59 },
  { greek: "δή", meaning: "surely, really, now, in fact, indeed (gives greater exactness)", category: "adverb", semanticGroup: "Particles", rank: 60 },
  { greek: "πόλις πόλεως, ἡ", meaning: "city, city-state", category: "noun: 3rd declension ι-stem", semanticGroup: "Government and Society", rank: 61 },
  { greek: "εἷς μία ἕν", meaning: "one", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 62 },
  { greek: "ἵημι, ἥσω, ἧκα, -εἷκα, εἷμαι, -εἵθην", meaning: "put in motion, let go, shoot; (mid.) hasten, rush", category: "verb: -μι", semanticGroup: "Work and Leisure", rank: 63 },
  { greek: "δέω, δεήσω, ἐδέησα, δεδέηκα, δεδέημαι, ἐδεήθην", meaning: "lack, miss, stand in need of (+gen.)", category: "verb: contracted", semanticGroup: "Taking and Giving", rank: 64 },
  { greek: "ἄνθρωπος –ου, ὁ/ἡ", meaning: "human being", category: "noun: 2nd declension", semanticGroup: "Humanity and Being", rank: 65 },
  { greek: "ὁράω, ὄψομαι, 2 aor. εἶδον, ἑόρακα and ἑώρακα, ὤφθην, impf. ἑώρων", meaning: "see, look (to)", category: "verb: irregular", semanticGroup: "The Senses and Feelings", rank: 66 },
  { greek: "μόνος μόνη μόνον", meaning: "alone, single", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 67 },
  { greek: "οὔτε...οὔτε", meaning: "neither...nor", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 68 },
  { greek: "οἷος οἵα οἷον", meaning: "such as, of what sort, like, (exclam.) what a!, how! ; οἷός τε (+infin.) fit or able to; οἷόν τε (+infin.) it is possible to", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 69 },
  { greek: "λαμβάνω, λήψομαι, ἔλαβον, εἴληφα, εἴλημμαι, ἐλήφθην", meaning: "take, grasp, seize; receive, get", category: "verb: -ω labial stem", semanticGroup: "Taking and Giving", rank: 70 },
  { greek: "δοκέω, δόξω, ἔδοξα", meaning: "think, suppose, imagine (+acc. and infin.); seem, seem good; (impers.) δοκεῖ μοι it seems to me", category: "verb: contracted", semanticGroup: "The Mind, Perceiving and Learning", rank: 71 },
  { greek: "ἕτερος ἑτέρα ἕτερον", meaning: "the other (of two); other, another", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 72 },
  { greek: "κακός –ή –όν", meaning: "bad, wicked, cowardly", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 73 },
  { greek: "ἀνήρ ἀνδρός, ὁ", meaning: "man, husband", category: "noun: 3rd declension irregular", semanticGroup: "Humanity and Being", rank: 74 },
  { greek: "ἐπεί", meaning: "after, since, when", category: "conjunction: subordinating", semanticGroup: "Time", rank: 75 },
  { greek: "ὅσος ὅση ὅσον", meaning: "however much; as great as; (in pl.) as many as; ὅσον (adv.) as much as", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 76 },
  { greek: "καλέω, καλῶ, ἐκάλεσα, κέκληκα, κέκλημαι, ἐκλήθην", meaning: "call, summon", category: "verb: contracted", semanticGroup: "Writing and Talking", rank: 77 },
  { greek: "σῶμα σώματος, τό", meaning: "body", category: "noun: 3rd declension consonant stem", semanticGroup: "Body Parts", rank: 78 },
  { greek: "δεῖ, δεήσει, impf. ἔδει", meaning: "it is necessary, one must, one ought (+acc. and infin.)", category: "verb: impersonal", semanticGroup: "Ethics and Morals", rank: 79 },
  { greek: "ὥσπερ", meaning: "just as, as if", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 80 },
  { greek: "δίδωμι, δώσω, ἔδωκα, δέδωκα, δέδομαι, ἐδόθην", meaning: "give, grant, offer", category: "verb: -μι", semanticGroup: "Taking and Giving", rank: 81 },
  { greek: "ἔτι", meaning: "still, yet", category: "adverb", semanticGroup: "Time", rank: 82 },
  { greek: "φύσις φύσεως, ἡ", meaning: "nature; (of the mind) one’s nature or disposition; regular order of nature", category: "noun: 3rd declension ι-stem", semanticGroup: "World Order", rank: 83 },
  { greek: "μικρός –ά –όν", meaning: "small, little, short", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 84 },
  { greek: "δύναμαι, δυνήσομαι, ἐδυνήθην, δεδύνημαι", meaning: "(+infin.) to be able (to), be strong enough (to)", category: "verb: deponent", semanticGroup: "Work and Leisure", rank: 85 },
  { greek: "ὥστε", meaning: "(introducing natural or actual result clause) so as, so that, (with the result) that", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 86 },
  { greek: "ἀρχή ἀρχῆς, ἡ", meaning: "beginning, origin; rule, empire, realm; magistracy", category: "noun: 1st declension", semanticGroup: "Time", rank: 87 },
  { greek: "ἕκαστος ἑκάστη ἕκαστον", meaning: "each (of several)", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 88 },
  { greek: "ἡμέρα ἡμέρας, ἡ", meaning: "day", category: "noun: 1st declension", semanticGroup: "World Order", rank: 89 },
  { greek: "φύω, φύσω, ἔφυσα", meaning: "bring forth, produce, beget; 2 aor. ἔφυν grew, pf. πέφυκα be by nature", category: "verb: -ω vowel stem", semanticGroup: "World Order", rank: 90 },
  { greek: "ἅπας ἅπασα ἅπαν", meaning: "all together", category: "noun: 3rd declension irregular", semanticGroup: "Measurements and Numerals", rank: 91 },
  { greek: "ὅμοιος ὁμοία ὅμοιον", meaning: "like, resembling (+dat.)", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 92 },
  { greek: "νῦν, νυνί", meaning: "now", category: "adverb", semanticGroup: "Time", rank: 93 },
  { greek: "γῆ γῆς, ἡ", meaning: "earth", category: "noun: 1st declension", semanticGroup: "Earth", rank: 94 },
  { greek: "δύναμις δυνάμεως, ἡ", meaning: "power, strength, ability", category: "noun: 3rd declension ι-stem", semanticGroup: "War and Peace", rank: 95 },
  { greek: "καλός –ή –όν", meaning: "beautiful, noble, honorable", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 96 },
  { greek: "κύριος κυρίου, ὁ", meaning: "lord, master", category: "noun: 2nd declension", semanticGroup: "Government and Society", rank: 97 },
  { greek: "μᾶλλον", meaning: "more, rather; μᾶλλον...ἤ rather than", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 98 },
  { greek: "ὅδε ἥδε τόδε", meaning: "this", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 99 },
  { greek: "ὅλος ὅλη ὅλον", meaning: "whole, entire, complete", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 100 },
  { greek: "μέρος μέρους, τό", meaning: "part, share", category: "noun: 3rd declension σ-stem", semanticGroup: "Measurements and Numerals", rank: 101 },
  { greek: "ἄρα", meaning: "therefore, then (drawing an inference)", category: "adverb", semanticGroup: "Particles", rank: 102 },
  { greek: "ἐμός ἐμή ἐμόν", meaning: "my, mine", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 103 },
  { greek: "χράομαι, χρήσομαι, ἐχρησάμην, κέχρημαι, ἐχρήσθην", meaning: "use, experience, suffer (+dat.); treat someone in a certain way (+dat. and adv.)", category: "verb: deponent", semanticGroup: "Government and Society", rank: 104 },
  { greek: "δύο", meaning: "two", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 105 },
  { greek: "χρόνος χρόνου, ὁ", meaning: "time", category: "noun: 2nd declension", semanticGroup: "Time", rank: 106 },
  { greek: "ἴσος ἴση ἴσον", meaning: "equal, the same as (+dat.)", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 107 },
  { greek: "ὅταν (ὅτε-ἄν)", meaning: "whenever (+subj.)", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 108 },
  { greek: "μόνον", meaning: "only", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 109 },
  { greek: "οἶδα, infin. εἰδέναι, imper. ἴσθι, plupf. used as impf. ᾔδειν", meaning: "to know (pf. in pres. sense); to know how to (+infin.)", category: "verb: irregular", semanticGroup: "The Mind, Perceiving and Learning", rank: 110 },
  { greek: "βασιλεύς βασιλέως, ὁ", meaning: "king", category: "noun: 3rd declension -εύς, -έως", semanticGroup: "Government and Society", rank: 111 },
  { greek: "ὦ", meaning: "oh! (unemphatic when with the vocative)", category: "interjection", semanticGroup: "Particles", rank: 112 },
  { greek: "βούλομαι, βουλήσομαι, βεβούλημαι, ἐβουλήθην", meaning: "(+infin.) will, wish (to); be willing (to); ὁ βουλόμενος anyone who likes", category: "verb: deponent", semanticGroup: "The Senses and Feelings", rank: 113 },
  { greek: "φαίνω, φανῶ, ἔφηνα, πέφηνα, πέφασμαι, ἐφάνην", meaning: "bring to light, make appear, make clear; (pass.) come to light, be seen, appear, appear to be (+ptc. or infin.)", category: "verb: -ω liquid stem", semanticGroup: "Showing and Finding", rank: 114 },
  { greek: "γράφω, γράψω, ἔγραψα, γέγραφα, γέγραμμαι, ἐγράφην", meaning: "write", category: "verb: -ω labial stem", semanticGroup: "Writing and Talking", rank: 115 },
  { greek: "φέρω, οἴσω, 1 aor. ἤνεγκα, 2 aor. ἤνεγκον, ἐνήνοχα, ἐνήνεγμαι, ἠνέχθην", meaning: "carry, bring, fetch; carry off or away; φέρε come now, well", category: "verb: irregular", semanticGroup: "Work and Leisure", rank: 116 },
  { greek: "ψυχή ψυχῆς, ἡ", meaning: "breath, life, soul", category: "noun: 1st declension", semanticGroup: "Humanity and Being", rank: 117 },
  { greek: "μηδείς μηδεμία μηδέν", meaning: "no one, nothing", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 118 },
  { greek: "αἴτιος αἰτία αἴτιον", meaning: "responsible, guilty", category: "adjective: 1st and 2nd declension", semanticGroup: "Law and Judgment", rank: 119 },
  { greek: "πάλιν", meaning: "back, backwards; again", category: "adverb", semanticGroup: "Direction", rank: 120 },
  { greek: "μάλιστα", meaning: "most, most of all; (in replies) certainly", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 121 },
  { greek: "ὑπάρχω, ὑπάρξω, ὑπῆρξα, ὑπῆργμαι, ὑπήρχθην", meaning: "exist, be, belong to; τὰ ὑπάρχοντα existing circumstances", category: "verb: -ω palatal stem", semanticGroup: "Humanity and Being", rank: 122 },
  { greek: "ἄρχω, ἄρξω, ἦρξα, ἦργμαι, ἤρχθην", meaning: "begin (+gen.); lead, rule, govern (+gen.)", category: "verb: -ω palatal stem", semanticGroup: "Time", rank: 123 },
  { greek: "γυνή γυναικός, ἡ", meaning: "woman, wife", category: "noun: 3rd declension irregular", semanticGroup: "Humanity and Being", rank: 124 },
  { greek: "ποτε (enclitic)", meaning: "at some time, ever, in the world", category: "adverb", semanticGroup: "Time", rank: 125 },
  { greek: "ἵνα", meaning: "in order that (conj. +subj. or opt.); where (rel. adv. +indic.)", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 126 },
  { greek: "ὄνομα ὀνόματος, τό", meaning: "name; fame", category: "noun: 3rd declension consonant stem", semanticGroup: "Writing and Talking", rank: 127 },
  { greek: "ὑπέρ", meaning: "for (+gen), beyond (+acc.)", category: "preposition", semanticGroup: "Prepositions without Direction", rank: 128 },
  { greek: "ἤδη", meaning: "already, now (of the immediate past); presently (of the immediate future)", category: "adverb", semanticGroup: "Time", rank: 129 },
  { greek: "πατήρ πατρός, ὁ", meaning: "father", category: "noun: 3rd declension irregular", semanticGroup: "Family and Friendship and the Home", rank: 130 },
  { greek: "ἀκούω, ἀκούσομαι, ἤκουσα, ἀκήκοα, plup. ἠκηκόη or ἀκηκόη, ἠκούσθην", meaning: "listen (to), hear (of)", category: "verb: -ω vowel stem", semanticGroup: "The Senses and Feelings", rank: 131 },
  { greek: "γένος γένους, τό", meaning: "race, family; kind, class", category: "noun: 3rd declension σ-stem", semanticGroup: "Family and Friendship and the Home", rank: 132 },
  { greek: "τόπος τόπου, ὁ", meaning: "place; topic", category: "noun: 2nd declension", semanticGroup: "Earth", rank: 133 },
  { greek: "πράσσω, πράξω, ἔπραξα, πέπραχα, πέπραγμαι, ἐπράχθην", meaning: "do, achieve, accomplish; do or fare in a certain way (+adv.)", category: "verb: -ω dental stem", semanticGroup: "Work and Leisure", rank: 134 },
  { greek: "πρῶτος πρώτη πρῶτον", meaning: "first, foremost, earliest; (adv.) τὸ πρῶτον in the first place", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 135 },
  { greek: "εὑρίσκω, εὑρήσω, 2 aor. ηὗρον or εὗρον, ηὕρηκα or εὕρηκα, εὕρημαι, εὑρέθην", meaning: "find (out), discover, devise", category: "verb: -ω palatal stem", semanticGroup: "Showing and Finding", rank: 136 },
  { greek: "παῖς παιδός, ὁ/ἡ", meaning: "son, daughter, child; slave", category: "noun: 3rd declension consonant stem", semanticGroup: "Family and Friendship and the Home", rank: 137 },
  { greek: "ἔρχομαι, fut. εἶμι or ἐλεύσομαι, 2 aor. ἦλθον, ἐλήλυθα", meaning: "come, go", category: "verb: deponent", semanticGroup: "Movement", rank: 138 },
  { greek: "υἱός υἱοῦ, ὁ", meaning: "son", category: "noun: 2nd declension", semanticGroup: "Family and Friendship and the Home", rank: 139 },
  { greek: "ὕδωρ ὕδατος, τό", meaning: "water", category: "noun: 3rd declension consonant stem", semanticGroup: "World Order", rank: 140 },
  { greek: "ἴδιος ἰδία ἴδιον", meaning: "one’s own; peculiar, separate, distinct", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 141 },
  { greek: "σός σή σόν", meaning: "your, yours (sg.; ὑμέτερος = pl.)", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 142 },
  { greek: "γιγνώσκω, γνώσομαι, ἔγνων, ἔγνωκα, ἔγνωσμαι, ἐγνώσθην", meaning: "come to know, learn; judge, think, or determine that (+acc. and infin.)", category: "verb: irregular", semanticGroup: "The Mind, Perceiving and Learning", rank: 143 },
  { greek: "τυγχάνω, τεύξομαι, ἔτυχον, τετύχηκα, τέτυγμαι, ἐτύχθην", meaning: "hit, light upon, meet by chance (+gen.); reach, gain, obtain; happen to be (+ptc.)", category: "verb: -ω palatal stem", semanticGroup: "Humanity and Being", rank: 144 },
  { greek: "ἵστημι στήσω will set, ἔστησα set, caused to stand, 2 aor. ἔστην stood, ἕστηκα stand, plup. εἱστήκη stood, ἐστάθην stood", meaning: "make to stand, set", category: "verb: -μι", semanticGroup: "Work and Leisure", rank: 145 },
  { greek: "ἅμα", meaning: "at the same time; (prep.) together with (+dat.)", category: "adverb", semanticGroup: "Time", rank: 146 },
  { greek: "ἄγω, ἄξω, ἤγαγον, ἦχα, ἦγμαι, ἤχθην", meaning: "lead, carry, bring; pass (time)", category: "verb: -ω palatal stem", semanticGroup: "Movement", rank: 147 },
  { greek: "τρόπος τρόπου, ὁ", meaning: "way, manner, fashion; way of life, habit, custom", category: "noun: 2nd declension", semanticGroup: "Characteristics", rank: 148 },
  { greek: "μήτε...μήτε", meaning: "neither...nor", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 149 },
  { greek: "μέσος μέση μέσον", meaning: "middle, in the middle, moderate; τὸ μέσον midst", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 150 },
  { greek: "ἀλλήλων –οις", meaning: "(oblique cases plural only) one another, each other", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 151 },
  { greek: "ἀεί", meaning: "always", category: "adverb", semanticGroup: "Time", rank: 152 },
  { greek: "φίλος φίλη φίλον", meaning: "beloved, dear; friendly", category: "adjective: 1st and 2nd declension", semanticGroup: "Family and Friendship and the Home", rank: 153 },
  { greek: "συμβαίνω, συμβήσομαι, 2 aor. συνέβην, συμβέβηκα", meaning: "meet, come to an agreement, correspond; happen, occur, come to pass; turn out in a certain way (+adv.), result", category: "verb: -ω liquid stem", semanticGroup: "Family and Friendship and the Home", rank: 154 },
  { greek: "ἔργον ἔργου, τό", meaning: "work, achievement, exploit", category: "noun: 2nd declension", semanticGroup: "Work and Leisure", rank: 155 },
  { greek: "πλέω, πλεύσομαι, ἔπλευσα, πέπλευκα, πέπλευσμαι, ἐπλεύσθην", meaning: "sail", category: "verb: contracted", semanticGroup: "Government and Society", rank: 156 },
  { greek: "τότε", meaning: "then, at that time; οἱ τότε the men of that time (opp. οἱ νῦν)", category: "adverb", semanticGroup: "Time", rank: 157 },
  { greek: "μήν", meaning: "[emphasizes preceding particle]", category: "adverb", semanticGroup: "Particles", rank: 158 },
  { greek: "χρή, impf. χρῆν or ἐχρῆν, infin. χρῆναι", meaning: "it is necessary, it is fated, one ought (+infin. or +acc. and infin.)", category: "verb: impersonal", semanticGroup: "Ethics and Morals", rank: 159 },
  { greek: "δείκνυμι, δείξω, ἔδειξα, δέδειχα, δέδειγμαι, ἐδείχθην", meaning: "show, point out", category: "verb: -μι", semanticGroup: "Showing and Finding", rank: 160 },
  { greek: "ζῷον ζῴου, τό", meaning: "living being, animal", category: "noun: 2nd declension", semanticGroup: "Animals and Plants", rank: 161 },
  { greek: "πρᾶγμα πράγματος, τό", meaning: "thing; (pl.) circumstances, affairs, business", category: "noun: 3rd declension consonant stem", semanticGroup: "Work and Leisure", rank: 162 },
  { greek: "ἐναντίος ἐναντία ἐναντίον", meaning: "opposite, facing; opposing", category: "adjective: 1st and 2nd declension", semanticGroup: "Direction", rank: 163 },
  { greek: "τίθημι, θήσω, ἔθηκα, τέθηκα, τέθειμαι (but usu. κεῖμαι instead), ἐτέθην", meaning: "to put, place; establish, ordain, institute; put in a certain state", category: "verb: -μι", semanticGroup: "Work and Leisure", rank: 164 },
  { greek: "εἶδον, 2 aor. of ὁράω, act. infin. ἰδεῖν, mid.infin. ἰδέσθαι", meaning: "I saw", category: "verb: irregular", semanticGroup: "The Senses and Feelings", rank: 165 },
  { greek: "χείρ χειρός, ἡ", meaning: "hand", category: "noun: 3rd declension consonant stem", semanticGroup: "Body Parts", rank: 166 },
  { greek: "μηδέ", meaning: "and not", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 167 },
  { greek: "ὀλίγος ὀλίγη ὀλίγον", meaning: "little, small, few", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 168 },
  { greek: "νόμος νόμου, ὁ", meaning: "custom, tradition, law", category: "noun: 2nd declension", semanticGroup: "Law and Judgment", rank: 169 },
  { greek: "κοινός –ή –όν", meaning: "common, shared, mutual", category: "adjective: 1st and 2nd declension", semanticGroup: "Government and Society", rank: 170 },
  { greek: "οἴομαι or οἶμαι, οἰήσομαι, impf. ᾤμην, aor. ᾠήθην", meaning: "think, suppose, imagine (+acc. and infin.)", category: "verb: deponent", semanticGroup: "The Mind, Perceiving and Learning", rank: 171 },
  { greek: "κινέω, κινήσω, ἐκίνησα, κεκίνηκα, κεκίνημαι, ἐκινήθην", meaning: "set in motion, move, rouse", category: "verb: contracted", semanticGroup: "Movement", rank: 172 },
  { greek: "πάσχω, πείσομαι, ἔπαθον, πέπονθα", meaning: "suffer, experience, be affected in a certain way (+adv.)", category: "verb: -ω dental stem", semanticGroup: "Life and Death", rank: 173 },
  { greek: "πῶς", meaning: "how?", category: "adverb", semanticGroup: "Pronouns/Interrogatives", rank: 174 },
  { greek: "ὅσπερ ἥπερ ὅπερ", meaning: "the very one who, the very thing which", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 175 },
  { greek: "τοσοῦτος –αύτη –οῦτο(ν)", meaning: "so large, so much", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 176 },
  { greek: "σύν", meaning: "with (+ dat. of accompaniment or means)", category: "preposition", semanticGroup: "Prepositions without Direction", rank: 177 },
  { greek: "εἶτα", meaning: "then, next", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 178 },
  { greek: "ἀληθής –ές", meaning: "true", category: "adjective: 3rd declension -ης, -ες", semanticGroup: "Ethics and Morals", rank: 179 },
  { greek: "δίκαιος δικαία δίκαιον", meaning: "right, just", category: "adjective: 1st and 2nd declension", semanticGroup: "Law and Judgment", rank: 180 },
  { greek: "μέλλω, μελλήσω, ἐμέλλησα", meaning: "(+infin.) think of doing, intend to, be about to", category: "verb: -ω liquid stem", semanticGroup: "The Senses and Feelings", rank: 181 },
  { greek: "ἐθέλω, ἐθελήσω, ἠθέλησα, ἠθέληκα", meaning: "(+infin.) wish (to); be willing (to)", category: "verb: -ω liquid stem", semanticGroup: "The Senses and Feelings", rank: 182 },
  { greek: "λοιπός –ή –όν", meaning: "rest, remaining, rest-of-the", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 183 },
  { greek: "ἀνάγκη ἀνάγκης, ἡ", meaning: "necessity", category: "noun: 1st declension", semanticGroup: "World Order", rank: 184 },
  { greek: "ὅτε", meaning: "when, whenever (+indic. or opt.)", category: "conjunction: subordinating", semanticGroup: "Time", rank: 185 },
  { greek: "δεύτερος –α –ον", meaning: "second", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 186 },
  { greek: "πόλεμος πολέμου ὁ", meaning: "war", category: "noun: 2nd declension", semanticGroup: "War and Peace", rank: 187 },
  { greek: "χώρα χώρας, ἡ", meaning: "land; place", category: "noun: 1st declension", semanticGroup: "Earth", rank: 188 },
  { greek: "ζάω, ζήσω, ἔζησα, ἔζηκα", meaning: "live", category: "verb: contracted", semanticGroup: "Life and Death", rank: 189 },
  { greek: "πλῆθος πλήθους, τό", meaning: "mass, throng, crowd; number", category: "noun: 3rd declension σ-stem", semanticGroup: "Government and Society", rank: 190 },
  { greek: "ἥλιος ἡλίου, ὁ", meaning: "sun", category: "noun: 2nd declension", semanticGroup: "World Order", rank: 191 },
  { greek: "αἰτία αἰτίας, ἡ", meaning: "cause, origin; charge, accusation", category: "noun: 1st declension", semanticGroup: "Law and Judgment", rank: 192 },
  { greek: "πείθω, πείσω, ἔπεισα, πέποιθα, πέπεισμαι, ἐπείσθην", meaning: "persuade, win over; (mid. and pass.) obey, believe in, trust in (+dat.)", category: "verb: -ω dental stem", semanticGroup: "Writing and Talking", rank: 193 },
  { greek: "πάρειμι", meaning: "be present, be ready or at hand; (impers.) πάρεστί μοι it depends on me, it is in my power; τὰ παρόντα the present circumstances; τὸ παρόν just now", category: "verb: irregular", semanticGroup: "Humanity and Being", rank: 194 },
  { greek: "πλεῖστος πλείστη πλεῖστον", meaning: "most, greatest, largest (superl. of πολύς)", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 195 },
  { greek: "εἶδος εἴδους, τό", meaning: "form, shape, figure; class, kind, sort", category: "noun: 3rd declension σ-stem", semanticGroup: "Measurements and Numerals", rank: 196 },
  { greek: "ὅπως", meaning: "how, as; so that, in order that (+subj. or opt.)", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 197 },
  { greek: "τρεῖς τρία", meaning: "three", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 198 },
  { greek: "βίος βίου, ὁ", meaning: "life", category: "noun: 2nd declension", semanticGroup: "Life and Death", rank: 199 },
  { greek: "νομίζω, νομιῶ, ἐνόμισα, νενόμικα, νενόμισμαι, ἐνομίσθην", meaning: "think, believe that (+acc. and infin.); hold as a custom, be accustomed to (+infin.)", category: "verb: -ω dental stem", semanticGroup: "The Mind, Perceiving and Learning", rank: 200 },
  { greek: "κύκλος κύκλου, ὁ", meaning: "circle, ring, orb, disc, circular motion", category: "noun: 2nd declension", semanticGroup: "Measurements and Numerals", rank: 201 },
  { greek: "πάθος πάθους, τό", meaning: "incident, accident, misfortune, experience; passion, emotion; state, condition", category: "noun: 3rd declension σ-stem", semanticGroup: "The Senses and Feelings", rank: 202 },
  { greek: "πρό", meaning: "before, in front of (+gen.)", category: "preposition", semanticGroup: "Time", rank: 203 },
  { greek: "ὀνομάζω, ὀνομάσω, ὠνόμασα, ὠνόμακα, ὠνόμασμαι, ὠνομάσθην", meaning: "call by name", category: "verb: -ω dental stem", semanticGroup: "Writing and Talking", rank: 204 },
  { greek: "μέντοι", meaning: "however; of course", category: "adverb", semanticGroup: "Particles", rank: 205 },
  { greek: "ἀρετή ἀρετῆς, ἡ", meaning: "goodness, excellence; virtue; valor, bravery", category: "noun: 1st declension", semanticGroup: "Ethics and Morals", rank: 206 },
  { greek: "ὑμέτερος ὑμετέρα ὑμέτερον", meaning: "your, yours (pl.; σός = sg.)", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 207 },
  { greek: "ἔτος ἔτους, τό", meaning: "year", category: "noun: 3rd declension σ-stem", semanticGroup: "Time", rank: 208 },
  { greek: "ἀντί", meaning: "opposite (+gen.)", category: "preposition", semanticGroup: "Direction", rank: 209 },
  { greek: "ναῦς νεώς, ἡ", meaning: "ship", category: "noun: 3rd declension irregular", semanticGroup: "Work and Leisure", rank: 210 },
  { greek: "τρίτος –η –ον", meaning: "third", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 211 },
  { greek: "πνεῦμα πνεύματος, τό", meaning: "wind, breath, spirit", category: "noun: 3rd declension consonant stem", semanticGroup: "Earth", rank: 212 },
  { greek: "ὀρθός –ή –όν", meaning: "upright, straight, true, regular", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 213 },
  { greek: "θάλασσα θαλάσσης, ἡ", meaning: "the sea", category: "noun: 1st declension", semanticGroup: "Earth", rank: 214 },
  { greek: "διαφέρω, διοίσω, 1 aor. διήνεγκα, 2 aor. διήνεγκον, διενήνοχα, διενήνεγμαι", meaning: "carry in different ways, spread; differ; (impers.) διαφέρει it makes a difference to (+dat.)", category: "verb: -ω liquid stem", semanticGroup: "Work and Leisure", rank: 215 },
  { greek: "μέχρι", meaning: "until (conj.); as far as, up to (prep. +gen.)", category: "preposition", semanticGroup: "Time", rank: 216 },
  { greek: "δόξα δόξης, ἡ", meaning: "opinion, judgment; reputation, honor, glory", category: "noun: 1st declension", semanticGroup: "Ethics and Morals", rank: 217 },
  { greek: "κεφαλή –ῆς, ἡ", meaning: "head", category: "noun: 1st declension", semanticGroup: "Body Parts", rank: 218 },
  { greek: "πῦρ πυρός, τό", meaning: "fire", category: "noun: 3rd declension consonant stem", semanticGroup: "World Order", rank: 219 },
  { greek: "ἐλάσσων ἔλασσον", meaning: "smaller, less, fewer (comp. of μικρός)", category: "adjective: 3rd declension -ων, -ον", semanticGroup: "Measurements and Numerals", rank: 220 },
  { greek: "πούς ποδός, ὁ", meaning: "foot", category: "noun: 3rd declension consonant stem", semanticGroup: "Body Parts", rank: 221 },
  { greek: "ἱερός –ά –όν", meaning: "holy, venerated, divine", category: "adjective: 1st and 2nd declension", semanticGroup: "Religion", rank: 222 },
  { greek: "εὐθύς εὐθεῖα εὐθύ", meaning: "straight, direct; (adv.) immediately", category: "adjective: -ύς, -εῖα, -ύ", semanticGroup: "Measurements and Numerals", rank: 223 },
  { greek: "εἶμι, infin. ἰέναι, ptc. ἰών, ἰοῦσα, ἰόν", meaning: "I will go (fut. of ἔρχομαι)", category: "verb: -μι", semanticGroup: "Movement", rank: 224 },
  { greek: "ταχύς ταχεῖα ταχύ", meaning: "quick, fast; (adv.) τάχα quickly; perhaps", category: "adjective: -ύς, -εῖα, -ύ", semanticGroup: "Characteristics", rank: 225 },
  { greek: "ποταμός –οῦ, ὁ", meaning: "river, stream", category: "noun: 2nd declension", semanticGroup: "Earth", rank: 226 },
  { greek: "οὐσία οὐσίας, ἡ", meaning: "substance, property; essence", category: "noun: 1st declension", semanticGroup: "Family and Friendship and the Home", rank: 227 },
  { greek: "ἀριθμός –οῦ, ὁ", meaning: "number", category: "noun: 2nd declension", semanticGroup: "Measurements and Numerals", rank: 228 },
  { greek: "ὕστερος ὑστέρα ὕστερον", meaning: "coming after, following (+gen.); next, later; (adv.) ὕστερον afterwards", category: "adjective: 1st and 2nd declension", semanticGroup: "Direction", rank: 229 },
  { greek: "φυλάσσω, φυλάξω, ἐφύλαξα, πεφύλαχα, πεφύλαγμαι, ἐφυλάχθην", meaning: "watch, guard, defend; (mid.) be on one’s guard against (+acc.)", category: "verb: -ω palatal stem", semanticGroup: "War and Peace", rank: 230 },
  { greek: "καιρός καιροῦ, ὁ", meaning: "the right time", category: "noun: 2nd declension", semanticGroup: "Time", rank: 231 },
  { greek: "οἰκέω, οἰκήσω, ᾤκησα, ᾤκηκα, ᾠκήθην", meaning: "inhabit, occupy", category: "verb: contracted", semanticGroup: "Family and Friendship and the Home", rank: 232 },
  { greek: "ἀμφότερος ἀμφοτέρα ἀμφότερον", meaning: "both", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 233 },
  { greek: "σημεῖον σημείου, τό", meaning: "sign, signal, mark", category: "noun: 2nd declension", semanticGroup: "Showing and Finding", rank: 234 },
  { greek: "παρέχω, παρέξω, παρέσχον, παρέσχηκα, impf. παρεῖχον", meaning: "provide, present, offer; allow, grant", category: "verb: -ω palatal stem", semanticGroup: "Taking and Giving", rank: 235 },
  { greek: "ἑκάτερος ἑκατέρα ἑκάτερον", meaning: "each (of two)", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 236 },
  { greek: "δηλόω, δηλώσω, ἐδήλωσα, δεδήλωκα, ἐδηλώθην", meaning: "show, declare, explain", category: "verb: contracted", semanticGroup: "Showing and Finding", rank: 237 },
  { greek: "οἰκεῖος οἰκεία οἰκεῖον", meaning: "domestic, of the house; one’s own; fitting, suitable", category: "adjective: 1st and 2nd declension", semanticGroup: "Family and Friendship and the Home", rank: 238 },
  { greek: "κελεύω, κελεύσω, ἐκέλευσα, κεκέλευκα, κεκέλευσμαι, ἐκελεύσθην", meaning: "order, bid, command (+acc. and infin.)", category: "verb: -ω vowel stem", semanticGroup: "Law and Judgment", rank: 239 },
  { greek: "τέλος τέλους, τό", meaning: "end, fulfillment, achievement", category: "noun: 3rd declension σ-stem", semanticGroup: "Life and Death", rank: 240 },
  { greek: "ἡγέομαι, ἡγήσομαι, ἡγησάμην, ἥγημαι", meaning: "lead, be the leader; regard, believe, think", category: "verb: deponent", semanticGroup: "The Mind, Perceiving and Learning", rank: 241 },
  { greek: "ἄξιος ἀξία ἄξιον", meaning: "worthy, deserving", category: "adjective: 1st and 2nd declension", semanticGroup: "Ethics and Morals", rank: 242 },
  { greek: "ἦ", meaning: "truly (emphasizes what follows)", category: "adverb", semanticGroup: "Particles", rank: 243 },
  { greek: "δῆλος δήλη δῆλον", meaning: "visible, clear, manifest", category: "adjective: 1st and 2nd declension", semanticGroup: "Showing and Finding", rank: 244 },
  { greek: "τοίνυν (τοί-νυν)", meaning: "therefore, accordingly (inferential); further, moreover (transitional)", category: "adverb", semanticGroup: "Particles", rank: 245 },
  { greek: "πολέμιος πολεμία πολέμιον", meaning: "hostile; οἱ πολέμιοι the enemy", category: "adjective: 1st and 2nd declension", semanticGroup: "War and Peace", rank: 246 },
  { greek: "ἔρομαι, ἐρήσομαι, 2 aor. ἠρόμην", meaning: "ask, ask one about (+double acc.)", category: "verb: deponent", semanticGroup: "Writing and Talking", rank: 247 },
  { greek: "ἀδελφός –οῦ, ὁ", meaning: "brother", category: "noun: 2nd declension", semanticGroup: "Family and Friendship and the Home", rank: 248 },
  { greek: "μέγεθος μεγέθους, τό", meaning: "greatness, size, magnitude", category: "noun: 3rd declension σ-stem", semanticGroup: "Measurements and Numerals", rank: 249 },
  { greek: "εἴτε…εἴτε", meaning: "whether…or", category: "conjunction: coordinating", semanticGroup: "Conjunctions/Adverbs", rank: 250 },
  { greek: "κεῖμαι, κείσομαι", meaning: "to lie, be situated, be laid up in store, be set up, be established or ordained (used as pf. pass. of τίθημι)", category: "verb: deponent", semanticGroup: "Work and Leisure", rank: 251 },
  { greek: "πολλάκις", meaning: "often", category: "adverb", semanticGroup: "Time", rank: 252 },
  { greek: "πίνω, πίομαι, 2 aor. ἔπιον, πέπωκα, -πέπομαι, -επόθην", meaning: "drink", category: "verb: -ω liquid stem", semanticGroup: "The Senses and Feelings", rank: 253 },
  { greek: "χάρις χάριτος, ἡ", meaning: "splendor, honor, glory; favor, goodwill, gratitude, thanks", category: "noun: 3rd declension consonant stem", semanticGroup: "Ethics and Morals", rank: 254 },
  { greek: "ἔπειτα", meaning: "then, next", category: "adverb", semanticGroup: "Time", rank: 255 },
  { greek: "ζητέω, ζητήσω, ἐζήτησα, ἐζήτηκα", meaning: "seek", category: "verb: contracted", semanticGroup: "Showing and Finding", rank: 256 },
  { greek: "σχῆμα σχήματος, τό", meaning: "form, figure, appearance, character", category: "noun: 3rd declension consonant stem", semanticGroup: "Measurements and Numerals", rank: 257 },
  { greek: "τροφή τροφῆς, ἡ", meaning: "nourishment, food", category: "noun: 1st declension", semanticGroup: "Life and Death", rank: 258 },
  { greek: "μανθάνω, μαθήσομαι, ἔμαθον, μεμάθηκα", meaning: "learn, ascertain", category: "verb: -ω liquid stem", semanticGroup: "The Mind, Perceiving and Learning", rank: 259 },
  { greek: "ἐνταῦθα", meaning: "here, there", category: "adverb", semanticGroup: "Direction", rank: 260 },
  { greek: "φεύγω, φεύξομαι, ἔφυγον, πέφευγα", meaning: "flee, run away, avoid, shun", category: "verb: -ω palatal stem", semanticGroup: "Movement", rank: 261 },
  { greek: "ἵππος ἵππου, ὁ", meaning: "horse", category: "noun: 2nd declension", semanticGroup: "Animals and Plants", rank: 262 },
  { greek: "κόσμος κόσμου, ὁ", meaning: "order; ornament, decoration, adornment; world, universe", category: "noun: 2nd declension", semanticGroup: "World Order", rank: 263 },
  { greek: "αἷμα αἵματος, τό", meaning: "blood", category: "noun: 3rd declension consonant stem", semanticGroup: "Body Parts", rank: 264 },
  { greek: "αἱρέω, αἱρήσω, 2 aor. εἷλον, ᾕρηκα, ᾕρημαι, ᾑρέθην", meaning: "take, grasp, take by force; (mid.) choose", category: "verb: contracted", semanticGroup: "Taking and Giving", rank: 265 },
  { greek: "προστίθημι, προσθήσω, προσέθηκα, προστέθηκα, προστέθειμαι (but commonly προσκεῖμαι instead), προσετέθην", meaning: "add; (med.) join", category: "verb: -μι", semanticGroup: "Taking and Giving", rank: 266 },
  { greek: "ἀξιόω, ἀξιώσω, ἠξίωσα, ἠξίωκα, ἠξίωμαι, ἠξιώθην", meaning: "consider worthy; require, demand, ask, claim", category: "verb: contracted", semanticGroup: "Ethics and Morals", rank: 267 },
  { greek: "ἕως", meaning: "until; while, so long as", category: "conjunction: subordinating", semanticGroup: "Time", rank: 268 },
  { greek: "νέος νέα νέον", meaning: "young, new, fresh", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 269 },
  { greek: "ἔοικα, ptc. εἰκώς", meaning: "be like, look like (+dat.); seem; befit", category: "verb: irregular", semanticGroup: "Characteristics", rank: 270 },
  { greek: "κἄν (καὶ-ἄν)", meaning: "even if (+subj.)", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 271 },
  { greek: "καθίστημι, καταστήσω, κατέστησα, κατέστην, καθέστηκα, plupf. καθειστήκη, κατεστάθην", meaning: "set down, establish; bring into a certain state, render", category: "verb: -μι", semanticGroup: "Work and Leisure", rank: 272 },
  { greek: "τέχνη τέχνης, ἡ", meaning: "art, skill, craft", category: "noun: 1st declension", semanticGroup: "Government and Society", rank: 273 },
  { greek: "χρῆμα χρήματος, τό", meaning: "thing, matter; (more commonly in pl.) goods or property, esp. money", category: "noun: 3rd declension consonant stem", semanticGroup: "Government and Society", rank: 274 },
  { greek: "σῴζω, σώσω, ἔσωσα, σέσωκα, ἐσώθην", meaning: "save", category: "verb: -ω dental stem", semanticGroup: "Help and Safety", rank: 275 },
  { greek: "πέμπω, πέμψω, ἔπεμψα, πέπομφα, πέπεμμαι, ἐπέμφθην", meaning: "send", category: "verb: -ω labial stem", semanticGroup: "Movement", rank: 276 },
  { greek: "φωνή φωνῆς, ἡ", meaning: "sound, voice", category: "noun: 1st declension", semanticGroup: "The Senses and Feelings", rank: 277 },
  { greek: "ἕνεκα", meaning: "on account of, for the sake of (+gen.)", category: "preposition", semanticGroup: "Prepositions without Direction", rank: 278 },
  { greek: "ἀπόλλυμι, ἀπολῶ, ἀπώλεσα, 2 aor. mid. ἀπωλόμην, pf. ἀπολώλεκα (“I have utterly destroyed”) or ἀπόλωλα (“I am undone”)", meaning: "kill, destroy; (mid.) perish, die", category: "verb: -μι", semanticGroup: "Life and Death", rank: 279 },
  { greek: "θάνατος θανάτου, ὁ", meaning: "death", category: "noun: 2nd declension", semanticGroup: "Life and Death", rank: 280 },
  { greek: "νύξ νυκτός, ἡ", meaning: "night", category: "noun: 3rd declension consonant stem", semanticGroup: "World Order", rank: 281 },
  { greek: "ὁδός ὁδοῦ, ἡ", meaning: "road, way, path", category: "noun: 2nd declension", semanticGroup: "Government and Society", rank: 282 },
  { greek: "ἔθνος ἔθνους, τό", meaning: "nation", category: "noun: 3rd declension σ-stem", semanticGroup: "Government and Society", rank: 283 },
  { greek: "ἀποδίδωμι, ἀποδώσω, ἀπέδωκα, ἀποδέδωκα, ἀποδέδομαι, ἀπεδόθην", meaning: "give back; render; allow; (mid.) sell", category: "verb: -μι", semanticGroup: "Taking and Giving", rank: 284 },
  { greek: "νοῦς, νοῦ, ὁ (other dialects: νόος, νόου, ὁ)", meaning: "mind, perception, sense", category: "noun: 2nd declension", semanticGroup: "The Mind, Perceiving and Learning", rank: 285 },
  { greek: "μένω, μενῶ, ἔμεινα, μεμένηκα", meaning: "stay, remain, endure, await", category: "verb: -ω liquid stem", semanticGroup: "Movement", rank: 286 },
  { greek: "ἀποθνῄσκω, ἀποθανοῦμαι, 2 aor. ἀπέθανον, ἀποτέθνηκα", meaning: "die", category: "verb: -ω palatal stem", semanticGroup: "Life and Death", rank: 287 },
  { greek: "πάνυ", meaning: "altogether, entirely", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 288 },
  { greek: "εὖ", meaning: "well (opp. κακῶς); thoroughly, competently; happily, fortunately", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 289 },
  { greek: "κρίνω, κρινῶ, ἔκρινα, κέκρικα, κέκριμαι, ἐκρίθην", meaning: "judge, decide, determine", category: "verb: -ω liquid stem", semanticGroup: "Law and Judgment", rank: 290 },
  { greek: "ἀναιρέω, ἀναιρήσω, ἀνεῖλον, ἀνῄρηκα, ἀνῄρημαι, ἀνῃρέθην", meaning: "raise, take up; kill, destroy", category: "verb: contracted", semanticGroup: "War and Peace", rank: 291 },
  { greek: "μακρός –ά –όν", meaning: "long, tall, large, long-lasting", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 292 },
  { greek: "ἥκω, ἥξω, pf. ἧκα", meaning: "I have come, I am present", category: "verb: -ω palatal stem", semanticGroup: "Movement", rank: 293 },
  { greek: "ἡδονή –ῆς, ἡ", meaning: "pleasure, enjoyment", category: "noun: 1st declension", semanticGroup: "Work and Leisure", rank: 294 },
  { greek: "μήτηρ μητρός, ἡ", meaning: "mother", category: "noun: 3rd declension irregular", semanticGroup: "Family and Friendship and the Home", rank: 295 },
  { greek: "δεινός –ή –όν", meaning: "awesome, terrible; clever, clever at (+infin.)", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 296 },
  { greek: "διαφορά –ᾶς, ἡ", meaning: "difference, disagreement", category: "noun: 1st declension", semanticGroup: "Law and Judgment", rank: 297 },
  { greek: "κρατέω, κρατήσω, ἐκράτησα, κεκράτηκα, κεκράτημαι, ἐκρατήθην", meaning: "be victorious, conquer, rule, surpass, excel (+gen.)", category: "verb: contracted", semanticGroup: "Government and Society", rank: 298 },
  { greek: "δῆμος δήμου, ὁ", meaning: "the (common) people; country district (opp. πόλις)", category: "noun: 2nd declension", semanticGroup: "Humanity and Being", rank: 299 },
  { greek: "οὐρανός –οῦ, ὁ", meaning: "sky, heaven", category: "noun: 2nd declension", semanticGroup: "World Order", rank: 300 },
  { greek: "ἕπομαι ἕψομαι, 2 aor. ἑσπόμην", meaning: "follow", category: "verb: deponent", semanticGroup: "Movement", rank: 301 },
  { greek: "ἥσσων ἧσσον", meaning: "less, weaker (comp. of κακός or μικρός)", category: "adjective: 3rd declension -ων, -ον", semanticGroup: "Characteristics", rank: 302 },
  { greek: "ὄρος ὄρους, τό", meaning: "mountain, hill", category: "noun: 3rd declension σ-stem", semanticGroup: "Earth", rank: 303 },
  { greek: "πλήν", meaning: "(prep.) except (+gen.); (conj.) except that, unless, but", category: "preposition", semanticGroup: "Prepositions without Direction", rank: 304 },
  { greek: "τέσσαρες τέσσαρα", meaning: "four", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 305 },
  { greek: "δυνατός –ή –όν", meaning: "strong, powerful, able", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 306 },
  { greek: "οἶκος οἴκου, ὁ", meaning: "house, home, family", category: "noun: 2nd declension", semanticGroup: "Family and Friendship and the Home", rank: 307 },
  { greek: "ἄριστος ἀρίστη ἄριστον", meaning: "best, noblest (superl. of ἀγαθός)", category: "adjective: 1st and 2nd declension", semanticGroup: "Ethics and Morals", rank: 308 },
  { greek: "ῥᾴδιος ῥᾳδία ῥᾴδιον", meaning: "easy", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 309 },
  { greek: "ἀφαιρέω, ἀφαιρήσω, ἀφεῖλον, ἀφῄρηκα, ἀφῄρημαι, ἀφῃρέθην", meaning: "take from, take away", category: "verb: contracted", semanticGroup: "Taking and Giving", rank: 310 },
  { greek: "τύχη τύχης, ἡ", meaning: "luck, fortune (good or bad), fate, chance", category: "noun: 1st declension", semanticGroup: "Life and Death", rank: 311 },
  { greek: "φανερός –ά –όν", meaning: "clear, evident", category: "adjective: 1st and 2nd declension", semanticGroup: "The Senses and Feelings", rank: 312 },
  { greek: "πρόσωπον προσώπου, τό", meaning: "face, mask, person", category: "noun: 2nd declension", semanticGroup: "Body Parts", rank: 313 },
  { greek: "πιστεύω, πιστεύσω, ἐπίστευσα, πεπίστευκα, πεπίστευμαι, ἐπιστεύθην", meaning: "trust, rely on, believe in (+dat.)", category: "verb: -ω vowel stem", semanticGroup: "The Senses and Feelings", rank: 314 },
  { greek: "διδάσκω, διδάξω, ἐδίδαξα, δεδίδαχα, δεδίδαγμαι, ἐδιδάχθην", meaning: "teach", category: "verb: -ω palatal stem", semanticGroup: "The Mind, Perceiving and Learning", rank: 315 },
  { greek: "ἄνω", meaning: "up, upwards", category: "adverb", semanticGroup: "Direction", rank: 316 },
  { greek: "τάσσω, τάξω, ἔταξα, τέταχα, τέταγμαι, ἐτάχθην", meaning: "arrange, put in order", category: "verb: -ω palatal stem", semanticGroup: "Government and Society", rank: 317 },
  { greek: "ὀφθαλμός –οῦ, ὁ", meaning: "eye", category: "noun: 2nd declension", semanticGroup: "Body Parts", rank: 318 },
  { greek: "δέχομαι, δέξομαι, ἐδεξάμην, δέδεγμαι, -εδέχθην", meaning: "take, accept; welcome, entertain", category: "verb: deponent", semanticGroup: "Family and Friendship and the Home", rank: 319 },
  { greek: "ἀφικνέομαι, ἀφίξομαι, 2 aor. ἀφικόμην, ἀφῖγμαι", meaning: "come to, arrive at", category: "verb: deponent", semanticGroup: "Movement", rank: 320 },
  { greek: "ἱκανός –ή –όν", meaning: "sufficient, enough; competent, able to (+infin.)", category: "adjective: 1st and 2nd declension", semanticGroup: "Help and Safety", rank: 321 },
  { greek: "ἐργάζομαι, ἐργάσομαι, εἰργασάμην, εἴργασμαι", meaning: "work, labor", category: "verb: deponent", semanticGroup: "Work and Leisure", rank: 322 },
  { greek: "μάχη μάχης, ἡ", meaning: "battle", category: "noun: 1st declension", semanticGroup: "War and Peace", rank: 323 },
  { greek: "τρέφω, θρέψω, ἔθρεψα, τέθραμμαι, ἐτράφην", meaning: "nourish, feed, support, maintain; rear, educate", category: "verb: -ω labial stem", semanticGroup: "Life and Death", rank: 324 },
  { greek: "ἀδύνατος –ον", meaning: "impossible; powerless", category: "adjective: 1st and 2nd declension", semanticGroup: "Government and Society", rank: 325 },
  { greek: "ἀκριβής –ές", meaning: "exact, accurate, precise", category: "adjective: 3rd declension -ης, -ες", semanticGroup: "Measurements and Numerals", rank: 326 },
  { greek: "που", meaning: "(enclitic) somewhere; I suppose, perhaps (to qualify an assertion)", category: "adverb", semanticGroup: "Particles", rank: 327 },
  { greek: "ὅθεν", meaning: "from where, whence", category: "adverb", semanticGroup: "Direction", rank: 328 },
  { greek: "στόμα στόματος, τό", meaning: "mouth, face, opening", category: "noun: 3rd declension consonant stem", semanticGroup: "Body Parts", rank: 329 },
  { greek: "χωρίς", meaning: "separately, apart; (+gen.) without, separate from", category: "adverb", semanticGroup: "Direction", rank: 330 },
  { greek: "κρείσσων κρεῖσσον", meaning: "stronger, mightier; better, more excellent (comp. of ἀγαθός)", category: "adjective: 3rd declension -ων, -ον", semanticGroup: "Characteristics", rank: 331 },
  { greek: "βραχύς βραχεῖα βραχύ", meaning: "brief, short", category: "adjective: -ύς, -εῖα, -ύ", semanticGroup: "Characteristics", rank: 332 },
  { greek: "ἰσχυρός –ά –όν", meaning: "strong", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 333 },
  { greek: "ἀλήθεια ἀληθείας, ἡ", meaning: "truth", category: "noun: 1st declension", semanticGroup: "Ethics and Morals", rank: 334 },
  { greek: "δίκη δίκης, ἡ", meaning: "justice, lawsuit, trial, penalty", category: "noun: 1st declension", semanticGroup: "Law and Judgment", rank: 335 },
  { greek: "χωρίον χωρίου, τό", meaning: "place, spot, district", category: "noun: 2nd declension", semanticGroup: "Earth", rank: 336 },
  { greek: "ἡδύς ἡδεῖα ἡδύ", meaning: "sweet, pleasant", category: "adjective: -ύς, -εῖα, -ύ", semanticGroup: "Characteristics", rank: 337 },
  { greek: "νόσος νόσου, ἡ", meaning: "disease, sickness", category: "noun: 2nd declension", semanticGroup: "Life and Death", rank: 338 },
  { greek: "λίθος λίθου, ὁ", meaning: "stone", category: "noun: 2nd declension", semanticGroup: "Earth", rank: 339 },
  { greek: "παλαιός –ά –όν", meaning: "old, ancient", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 340 },
  { greek: "ἀφίημι, ἀφήσω, ἀφῆκα, ἀφεῖκα, ἀφεῖμαι, ἀφείθην", meaning: "send away, let go; let alone, neglect", category: "verb: -μι", semanticGroup: "Taking and Giving", rank: 341 },
  { greek: "ἄλλως", meaning: "otherwise", category: "adverb", semanticGroup: "Pronouns/Interrogatives", rank: 342 },
  { greek: "πρᾶξις πράξεως, ἡ", meaning: "action, transaction, business", category: "noun: 3rd declension ι-stem", semanticGroup: "Work and Leisure", rank: 343 },
  { greek: "σαφής σαφές", meaning: "clear, distinct, plain", category: "adjective: 3rd declension -ης, -ες", semanticGroup: "Showing and Finding", rank: 344 },
  { greek: "σοφός –ή –όν", meaning: "wise, clever, skilled", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 345 },
  { greek: "νικάω, νικήσω, ἐνίκησα, νενίκηκα, νενίκημαι, ἐνικήθην", meaning: "conquer, win", category: "verb: contracted", semanticGroup: "War and Peace", rank: 346 },
  { greek: "ὁμολογέω, ὁμολογήσω, ὡμολόγησα, ὡμολόγηκα, ὡμολόγημαι, ὡμολογήθην", meaning: "agree with, say the same thing as (+dat.)", category: "verb: contracted", semanticGroup: "Law and Judgment", rank: 347 },
  { greek: "ναός (νεώς) ναοῦ (νεώ), ὁ", meaning: "temple", category: "noun: 2nd declension", semanticGroup: "Religion", rank: 348 },
  { greek: "αὖ, αὖθις", meaning: "moreover; on the other hand; back (again)", category: "adverb", semanticGroup: "Particles", rank: 349 },
  { greek: "πατρίς πατρίδος, ἡ", meaning: "fatherland", category: "noun: 3rd declension consonant stem", semanticGroup: "Government and Society", rank: 350 },
  { greek: "ὀξύς ὀξεῖα ὀξύ", meaning: "sharp, keen, shrill, pungent", category: "adjective: -ύς, -εῖα, -ύ", semanticGroup: "Characteristics", rank: 351 },
  { greek: "καίτοι (καί-τοι)", meaning: "and indeed, and yet", category: "adverb", semanticGroup: "Particles", rank: 352 },
  { greek: "πλέον", meaning: "more, rather", category: "adverb", semanticGroup: "Measurements and Numerals", rank: 353 },
  { greek: "πλέων πλέον", meaning: "more, larger (comp. of πολύς)", category: "adjective: 3rd declension -ων, -ον", semanticGroup: "Measurements and Numerals", rank: 354 },
  { greek: "γνώμη γνώμης, ἡ", meaning: "thought, intelligence, opinion, purpose", category: "noun: 1st declension", semanticGroup: "The Mind, Perceiving and Learning", rank: 355 },
  { greek: "τιμή τιμῆς, ἡ", meaning: "honor, esteem; price, value; office, magistracy", category: "noun: 1st declension", semanticGroup: "Ethics and Morals", rank: 356 },
  { greek: "μεταξύ", meaning: "between (prep. + gen.); in the midst of (adv.)", category: "preposition", semanticGroup: "Direction", rank: 357 },
  { greek: "προσήκω προσήξω", meaning: "belong to, have to do with; be fitting for (+dat.); arrive at; οἱ προσήκοντες relatives; τὰ προσήκoντα duties", category: "verb: -ω palatal stem", semanticGroup: "Ethics and Morals", rank: 358 },
  { greek: "πρίν", meaning: "before, until", category: "conjunction: subordinating", semanticGroup: "Time", rank: 359 },
  { greek: "ἀδικέω, ἀδικήσω, ἠδίκησα, ἠδίκηκα, ἠδίκημαι, ἠδικήθην", meaning: "do wrong; injure", category: "verb: contracted", semanticGroup: "Ethics and Morals", rank: 360 },
  { greek: "στρατηγός –οῦ, ὁ", meaning: "leader of an army, commander, general", category: "noun: 2nd declension", semanticGroup: "War and Peace", rank: 361 },
  { greek: "οὐκέτι", meaning: "no longer, no more", category: "adverb", semanticGroup: "Time", rank: 362 },
  { greek: "πρέσβυς πρέσβεως, ὁ", meaning: "old man; (pl.) ambassadors", category: "noun: 3rd declension -εύς, -έως", semanticGroup: "Government and Society", rank: 363 },
  { greek: "παύω, παύσω, ἔπαυσα, πέπαυκα, πέπαυμαι, ἐπαύθην", meaning: "stop, put an end to; (mid.) cease", category: "verb: -ω vowel stem", semanticGroup: "Movement", rank: 364 },
  { greek: "τελευτάω, τελευτήσω, ἐτελεύτησα, τετελεύτηκα, τετελεύτημαι, ἐτελευτήθην", meaning: "finish; die", category: "verb: contracted", semanticGroup: "Life and Death", rank: 365 },
  { greek: "μίγνυμι, μίξω, ἔμιξα, μέμιχα,μέμιγμαι, ἐμίχθην", meaning: "mix, mingle", category: "verb: -μι", semanticGroup: "Work and Leisure", rank: 366 },
  { greek: "λαός λαοῦ, ὁ", meaning: "the people, folk", category: "noun: 2nd declension", semanticGroup: "Humanity and Being", rank: 367 },
  { greek: "θυγάτηρ θυγατρός, ἡ", meaning: "daughter", category: "noun: 3rd declension irregular", semanticGroup: "Family and Friendship and the Home", rank: 368 },
  { greek: "οἰκία οἰκίας, ἡ", meaning: "building, house, dwelling", category: "noun: 1st declension", semanticGroup: "Family and Friendship and the Home", rank: 369 },
  { greek: "παραδίδωμι, παραδώσω, παρέδωκα, παραδέδωκα, παραδέδομαι, παρεδόθην", meaning: "transmit, hand over, surrender", category: "verb: -μι", semanticGroup: "Taking and Giving", rank: 370 },
  { greek: "ἔξω", meaning: "outside; except", category: "adverb", semanticGroup: "Direction", rank: 371 },
  { greek: "νῆσος νήσου, ἡ", meaning: "island", category: "noun: 2nd declension", semanticGroup: "Earth", rank: 372 },
  { greek: "ἐκεῖ", meaning: "there", category: "adverb", semanticGroup: "Direction", rank: 373 },
  { greek: "ἐπιστήμη –ης, ἡ", meaning: "knowledge, understanding, skill", category: "noun: 1st declension", semanticGroup: "The Mind, Perceiving and Learning", rank: 374 },
  { greek: "ἐάω, ἐάσω, εἴασα", meaning: "allow, permit (+acc. and infin.); let be, let alone", category: "verb: contracted", semanticGroup: "Law and Judgment", rank: 375 },
  { greek: "θαυμάζω, θαυμάσομαι, ἐθαύμασα, τεθαύμακα, τεθαύμασμαι, ἐθαυμάσθην", meaning: "to be in awe (of), be astonished (at)", category: "verb: -ω dental stem", semanticGroup: "The Senses and Feelings", rank: 376 },
  { greek: "αἰσθάνομαι, αἰσθήσομαι, 2 aor. ᾐσθόμην, ᾔσθημαι", meaning: "perceive, understand, hear, learn", category: "verb: deponent", semanticGroup: "The Mind, Perceiving and Learning", rank: 377 },
  { greek: "χαίρω, χαιρήσω, κεχάρηκα, κεχάρημαι, ἐχάρην", meaning: "to be happy, rejoice at (+dat.), take joy in (+ptc.); χαῖρε, (pl.) χαίρετε hello, goodbye", category: "verb: -ω liquid stem", semanticGroup: "The Senses and Feelings", rank: 378 },
  { greek: "χαλεπός –ή –όν", meaning: "difficult, troublesome", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 379 },
  { greek: "τέκνον τέκνου, τό", meaning: "child", category: "noun: 2nd declension", semanticGroup: "Family and Friendship and the Home", rank: 380 },
  { greek: "καταλαμβάνω, καταλήψομαι, κατέλαβον, κατείληφα, κατείλημμαι, κατελήφθην", meaning: "seize, catch up with, arrest, compel", category: "verb: -ω labial stem", semanticGroup: "War and Peace", rank: 381 },
  { greek: "μάχομαι, μαχοῦμαι, ἐμαχεσάμην, μεμάχημαι", meaning: "fight (against) (+dat.)", category: "verb: deponent", semanticGroup: "War and Peace", rank: 382 },
  { greek: "μιμνήσκω, -μνήσω, -έμνησα, pf. μέμνημαι, ἐμνήσθην", meaning: "remind; (in pf. mid.) remember", category: "verb: -ω palatal stem", semanticGroup: "The Mind, Perceiving and Learning", rank: 383 },
  { greek: "θνῄσκω, 2 aor. -έθανον, τέθνηκα, θανοῦμαι", meaning: "to die, be dying", category: "verb: -ω palatal stem", semanticGroup: "Life and Death", rank: 384 },
  { greek: "λύω, λύσω, ἔλυσα, λέλυκα, λέλυμαι, ἐλύθην", meaning: "loosen, unbind, set free; undo, destroy", category: "verb: -ω vowel stem", semanticGroup: "War and Peace", rank: 384 },
  { greek: "τιμάω, τιμήσω, ἐτίμησα, τετίμηκα, τετίμημαι, ἐτιμήθην", meaning: "to honor", category: "verb: contracted", semanticGroup: "Ethics and Morals", rank: 386 },
  { greek: "τεῖχος τείχους, τό", meaning: "wall", category: "noun: 3rd declension σ-stem", semanticGroup: "Government and Society", rank: 387 },
  { greek: "ἴσως", meaning: "equally, probably, perhaps", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 388 },
  { greek: "αἴρω, ἀρῶ, ἦρα, ἦρκα, ἦρμαι, ἤρθην", meaning: "take up, lift up; remove", category: "verb: -ω palatal stem", semanticGroup: "Movement", rank: 389 },
  { greek: "ἀποκτείνω, ἀποκτενῶ, ἀπέκτεινα, ἀπέκτονα", meaning: "kill", category: "verb: -ω liquid stem", semanticGroup: "War and Peace", rank: 390 },
  { greek: "στρατιώτης –ου, ὁ", meaning: "soldier", category: "noun: 2nd declension", semanticGroup: "War and Peace", rank: 391 },
  { greek: "ἄνευ", meaning: "without (+gen.)", category: "preposition", semanticGroup: "Prepositions without Direction", rank: 392 },
  { greek: "πότερος ποτέρα πότερον", meaning: "which of the two? πότερον whether", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 393 },
  { greek: "ἁπλῶς", meaning: "simply, singly, in one way", category: "adverb", semanticGroup: "Measurements and Numerals", rank: 394 },
  { greek: "πίπτω, πεσοῦμαι, ἔπεσον, πέπτωκα", meaning: "fall, fall down", category: "verb: -ω dental stem", semanticGroup: "War and Peace", rank: 395 },
  { greek: "τέταρτος –η –ον", meaning: "fourth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 396 },
  { greek: "κατασκευάζω, κατασκευάσω, κατεσκεύασα", meaning: "equip, furnish, make ready", category: "verb: -ω dental stem", semanticGroup: "Work and Leisure", rank: 397 },
  { greek: "ἐχθρός –ά –όν", meaning: "hated, hateful; hostile to (+dat.)", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 398 },
  { greek: "ἀγών ἀγῶνος, ὁ", meaning: "contest; struggle", category: "noun: 3rd declension consonant stem", semanticGroup: "Government and Society", rank: 399 },
  { greek: "κωλύω, κωλύσω, ἐκώλυσα, κεκώλυκα, κεκώλυμαι, ἐκωλύθην", meaning: "hinder, check, prevent (+acc. and infin.)", category: "verb: -ω vowel stem", semanticGroup: "War and Peace", rank: 400 },
  { greek: "ἁμαρτάνω, ἁμαρτήσομαι, ἡμάρτησα, 2 aor. ἥμαρτον, ἡμάρτηκα, ἡμάρτημαι, ἡμαρτήθην", meaning: "miss the mark (+gen.); fail, be wrong, make a mistake", category: "verb: -ω dental stem", semanticGroup: "Ethics and Morals", rank: 401 },
  { greek: "διαφθείρω, διαφθερῶ, διέφθειρα, διέφθαρκα, διέφθαρμαι, διεφθάρην", meaning: "destroy; corrupt", category: "verb: -ω liquid stem", semanticGroup: "War and Peace", rank: 402 },
  { greek: "πως", meaning: "(enclitic) somehow, in some way, in any way", category: "adverb", semanticGroup: "Particles", rank: 403 },
  { greek: "πόνος πόνου, ὁ", meaning: "work, labor; stress, trouble, pain", category: "noun: 2nd declension", semanticGroup: "Work and Leisure", rank: 404 },
  { greek: "ἔνθα", meaning: "there", category: "adverb", semanticGroup: "Direction", rank: 405 },
  { greek: "τάξις τάξεως, ἡ", meaning: "arrangement, order; military unit", category: "noun: 3rd declension ι-stem", semanticGroup: "War and Peace", rank: 406 },
  { greek: "πειράω (usually mid. πειράομαι), πειράσομαι, ἐπείρασα, πεπείραμαι, ἐπειράθην", meaning: "attempt, try, make a trial of (+gen.)", category: "verb: contracted", semanticGroup: "Work and Leisure", rank: 407 },
  { greek: "φοβέω, φοβήσω, ἐφόβησα, πεφόβημαι, ἐφοβήθην", meaning: "put to flight; (mid. and pass.) flee, fear", category: "verb: contracted", semanticGroup: "The Senses and Feelings", rank: 408 },
  { greek: "βάλλω, βαλῶ, 2 aor. ἔβαλον, βέβληκα, βέβλημαι, ἐβλήθην", meaning: "throw, hurl; throw at, hit (acc.) with (dat.)", category: "verb: -ω liquid stem", semanticGroup: "Movement", rank: 409 },
  { greek: "πονηρός –ά –όν", meaning: "worthless, bad, wicked", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 410 },
  { greek: "ξένος ξένου, ὁ", meaning: "guest-friend; foreigner, stranger", category: "noun: 2nd declension", semanticGroup: "Government and Society", rank: 411 },
  { greek: "βάρβαρος –ον", meaning: "non-Greek, foreign; barbarous", category: "adjective: 1st and 2nd declension", semanticGroup: "Government and Society", rank: 412 },
  { greek: "ὅπου", meaning: "where, wherever", category: "conjunction: subordinating", semanticGroup: "Conjunctions/Adverbs", rank: 413 },
  { greek: "συμφέρω, συνοίσω, 1 aor. συνήνεγκα", meaning: "benefit, be useful or profitable to (+dat.); (impers.) συμφέρει it is of use, expedient (+infin.); τὸ συμφέρον use, profit, advantage", category: "verb: irregular", semanticGroup: "Help and Safety", rank: 414 },
  { greek: "πυνθάνομαι, πεύσομαι, 2 aor. ἐπυθόμην, πέπυσμαι", meaning: "learn, hear, inquire concerning (+gen.)", category: "verb: deponent", semanticGroup: "The Mind, Perceiving and Learning", rank: 415 },
  { greek: "δοῦλος δούλου, ὁ", meaning: "slave", category: "noun: 2nd declension", semanticGroup: "Government and Society", rank: 416 },
  { greek: "τέμνω, τεμῶ, 2 aor. ἔτεμον, -τέτμηκα, τέτμημαι, ἐτμήθην", meaning: "cut, cut down, cut to pieces", category: "verb: -ω liquid stem", semanticGroup: "War and Peace", rank: 417 },
  { greek: "χρήσιμος χρησίμη χρήσιμον", meaning: "useful, serviceable", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 418 },
  { greek: "ποῖος ποία ποῖον", meaning: "what sort of?", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 419 },
  { greek: "ὅπλον ὅπλου, τό", meaning: "weapon, tool, implement (mostly pl.)", category: "noun: 2nd declension", semanticGroup: "War and Peace", rank: 420 },
  { greek: "πίστις πίστεως, ἡ", meaning: "trust in others, faith; that which gives confidence, assurance, pledge, guarantee", category: "noun: 3rd declension ι-stem", semanticGroup: "The Senses and Feelings", rank: 421 },
  { greek: "ὑπολαμβάνω, ὑπολήψομαι, ὑπέλαβον, ὑπείληφα, ὑπείλημμαι, ὑπελήφθην", meaning: "take up, seize; answer, reply; assume, suppose", category: "verb: -ω labial stem", semanticGroup: "The Mind, Perceiving and Learning", rank: 422 },
  { greek: "ποιητής –οῦ, ὁ", meaning: "creator, poet", category: "noun: 2nd declension", semanticGroup: "Writing and Talking", rank: 423 },
  { greek: "λανθάνω, λήσω, ἔλαθον, λέληθα", meaning: "escape the notice of (+acc. and nom. participle), be unknown; (mid. and pass.) forget", category: "verb: -ω liquid stem", semanticGroup: "Government and Society", rank: 424 },
  { greek: "βελτίων βέλτιον", meaning: "better (comp. of ἀγαθός)", category: "adjective: 3rd declension -ων, -ον", semanticGroup: "Ethics and Morals", rank: 425 },
  { greek: "πάντως", meaning: "altogether, in all ways; at any rate", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 426 },
  { greek: "πορεύω, πορεύσω, ἐπόρευσα, πεπόρευμαι, ἐπορεύθην", meaning: "carry; (mid. and pass) go, walk, march", category: "verb: -ω vowel stem", semanticGroup: "Work and Leisure", rank: 427 },
  { greek: "ἀποκρίνω, ἀποκρινῶ, ἀπεκρινάμην, ἀπεκρίθη", meaning: "separate, set apart, choοse; (mid.) answer, reply", category: "verb: -ω liquid stem", semanticGroup: "Writing and Talking", rank: 428 },
  { greek: "πέντε", meaning: "five", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 429 },
  { greek: "κίνδυνος κινδύνου, ὁ", meaning: "danger", category: "noun: 2nd declension", semanticGroup: "War and Peace", rank: 430 },
  { greek: "κατηγορέω, κατηγορήσω, κατηγόρησα, κατηγόρηκα, κατηγόρημαι, κατηγορήθην", meaning: "to speak against, to accuse (+gen.)", category: "verb: contracted", semanticGroup: "Law and Judgment", rank: 431 },
  { greek: "τρέπω, τρέψω, ἔτρεψα, τέτροφα, ἐτράπην", meaning: "turn, direct towards a thing; put to flight, defeat; (pass.) turn one’s steps in a certain direction, go", category: "verb: -ω labial stem", semanticGroup: "Movement", rank: 432 },
  { greek: "ὅμως", meaning: "nevertheless, all the same, notwithstanding", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 433 },
  { greek: "θεῖος θεία θεῖον", meaning: "divine", category: "adjective: 1st and 2nd declension", semanticGroup: "Religion", rank: 434 },
  { greek: "ἱππεύς ἱππέως, ὁ", meaning: "horseman, rider, charioteer", category: "noun: 3rd declension -εύς, -έως", semanticGroup: "War and Peace", rank: 435 },
  { greek: "κτάομαι, κτήσομαι, ἐκτησάμην, κέκτημαι", meaning: "get, gain, acquire", category: "verb: deponent", semanticGroup: "Taking and Giving", rank: 436 },
  { greek: "λείπω, λείψω, ἔλιπον, λέλοιπα, λέλειμμαι, ἐλείφθην", meaning: "leave, abandon", category: "verb: -ω labial stem", semanticGroup: "Movement", rank: 437 },
  { greek: "βουλή βουλῆς, ἡ", meaning: "will, determination; counsel, piece of advice; council of elders", category: "noun: 1st declension", semanticGroup: "Government and Society", rank: 438 },
  { greek: "ἐλπίς ἐλπίδος, ἡ", meaning: "hope; expectation", category: "noun: 3rd declension consonant stem", semanticGroup: "The Senses and Feelings", rank: 439 },
  { greek: "γραφή γραφῆς, ἡ", meaning: "a drawing, painting, writing; indictment", category: "noun: 1st declension", semanticGroup: "Writing and Talking", rank: 440 },
  { greek: "τίκτω, τέξω or τέξομαι, ἔτεκον, τέτοκα, τέτεγμαι, ἐτέχθην", meaning: "beget, give birth to, produce", category: "verb: -ω palatal stem", semanticGroup: "Family and Friendship and the Home", rank: 441 },
  { greek: "κομίζω, κομιῶ, ἐκόμισα, κεκόμικα, κεκόμισμαι, ἐκομίσθην", meaning: "take care of, provide for", category: "verb: -ω dental stem", semanticGroup: "Help and Safety", rank: 442 },
  { greek: "θυμός θυμοῦ, ὁ", meaning: "life, spirit; soul, heart, mind", category: "noun: 2nd declension", semanticGroup: "Religion", rank: 443 },
  { greek: "βλέπω, βλέψομαι, ἔβλεψα", meaning: "see, look (at)", category: "verb: -ω labial stem", semanticGroup: "The Senses and Feelings", rank: 444 },
  { greek: "φόβος φόβου, ὁ", meaning: "panic, fear, flight", category: "noun: 2nd declension", semanticGroup: "The Senses and Feelings", rank: 445 },
  { greek: "πολιτεία –ας, ἡ", meaning: "constitution, citizenship, republic", category: "noun: 1st declension", semanticGroup: "Government and Society", rank: 446 },
  { greek: "στάδιον σταδίου, τό (pl. στάδια and στάδιοι)", meaning: "stadion or stade, the longest Greek unit of linear measure, about 185 meters", category: "noun: 2nd declension", semanticGroup: "Measurements and Numerals", rank: 447 },
  { greek: "φρονέω, φρονήσω, ἐφρόνησα", meaning: "think, intend to (+infin.); be minded towards (+adv. and dat.)", category: "verb: contracted", semanticGroup: "The Mind, Perceiving and Learning", rank: 448 },
  { greek: "τοιόσδε τοιάδε τοιόνδε", meaning: "such (as this), of such a sort (as this)", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 449 },
  { greek: "ὁρμάω, ὁρμήσω, ὥρμησα, ὥρμηκα, ὥρμημαι, ὡρμήθην", meaning: "set in motion, urge on; (intrans.) start, hasten on", category: "verb: contracted", semanticGroup: "Movement", rank: 450 },
  { greek: "παρασκευάζω, παρασκευάσω, παρεσκεύασα", meaning: "get ready, prepare, provide", category: "verb: -ω dental stem", semanticGroup: "Work and Leisure", rank: 451 },
  { greek: "λαλέω, λαλήσω, ἐλάλησα, λελάληκα, ἐλαλήθην", meaning: "talk, chatter, babble", category: "verb: contracted", semanticGroup: "Writing and Talking", rank: 452 },
  { greek: "δράω, δράσω, ἔδρασα, δέδρακα, δέδραμαι, ἐδράσθην", meaning: "do, accomplish", category: "verb: contracted", semanticGroup: "Work and Leisure", rank: 453 },
  { greek: "σκοπέω, σκοπήσω, ἐσκόπησα", meaning: "look at, watch; look into, consider, examine", category: "verb: contracted", semanticGroup: "The Senses and Feelings", rank: 454 },
  { greek: "βοῦς βοός, ὁ/ἡ", meaning: "bull, ox, cow", category: "noun: 3rd declension irregular", semanticGroup: "Animals and Plants", rank: 455 },
  { greek: "ἡμέτερος ἡμετέρα ἡμέτρον", meaning: "our", category: "adjective: 1st and 2nd declension", semanticGroup: "Pronouns/Interrogatives", rank: 456 },
  { greek: "γράμμα γράμματος, τό", meaning: "letter, written character; (pl.) piece of writing, document(s)", category: "noun: 3rd declension consonant stem", semanticGroup: "Writing and Talking", rank: 457 },
  { greek: "ἐρωτάω, ἐρήσομαι, 2 aor. ἠρόμην", meaning: "ask someone (acc.) something (acc.); question, beg", category: "verb: contracted", semanticGroup: "Writing and Talking", rank: 458 },
  { greek: "πολεμέω, πολεμήσω, ἐπολέμησα, πεπολέμηκα", meaning: "make war", category: "verb: contracted", semanticGroup: "War and Peace", rank: 459 },
  { greek: "θύω, θύσω, ἔθυσα, τέθυκα, τέθυμαι, ἐτύθην", meaning: "sacrifice", category: "verb: -ω vowel stem", semanticGroup: "Religion", rank: 460 },
  { greek: "ἐλαύνω, ἐλῶ, ἤλασα, -ελήλακα, ἐλήλαμαι, ἠλάθην", meaning: "drive, set in motion", category: "verb: -ω liquid stem", semanticGroup: "Movement", rank: 461 },
  { greek: "δέδοικα, δείσομαι, ἔδεισα", meaning: "fear", category: "verb: -ω dental stem", semanticGroup: "The Senses and Feelings", rank: 462 },
  { greek: "σύμμαχος –ον", meaning: "allied with (+dat.); οἱ σύμμαχοι allies", category: "adjective: 1st and 2nd declension", semanticGroup: "War and Peace", rank: 463 },
  { greek: "ἡγεμών ἡγεμόνος, ὁ", meaning: "guide, leader, commander", category: "noun: 3rd declension consonant stem", semanticGroup: "Government and Society", rank: 464 },
  { greek: "βαρύς βαρεῖα βαρύ", meaning: "heavy, grievous, tiresome", category: "adjective: -ύς, -εῖα, -ύ", semanticGroup: "Characteristics", rank: 465 },
  { greek: "ὧδε", meaning: "thus, in this way; hither, here", category: "adverb", semanticGroup: "Direction", rank: 466 },
  { greek: "αἰσχρός –ά –όν", meaning: "ugly, shameful, disgraceful", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 467 },
  { greek: "εἰρήνη εἰρήνης, ἡ", meaning: "peace", category: "noun: 1st declension", semanticGroup: "War and Peace", rank: 468 },
  { greek: "ἁλίσκομαι, ἁλώσομαι, 2 aor. ἑάλων, ἑάλωκα", meaning: "to be taken, conquered (act. supplied by αἱρέω)", category: "verb: deponent", semanticGroup: "War and Peace", rank: 469 },
  { greek: "δέκα", meaning: "ten", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 470 },
  { greek: "ἀμείνων ἄμεινον", meaning: "better, abler, stronger, braver (comp. of ἀγαθός)", category: "adjective: 3rd declension -ων, -ον", semanticGroup: "Ethics and Morals", rank: 471 },
  { greek: "χείρων χεῖρον", meaning: "worse, inferior (comp. of κακός)", category: "adjective: 3rd declension -ων, -ον", semanticGroup: "Ethics and Morals", rank: 472 },
  { greek: "βοηθέω, βοηθήσω, ἐβοήθησα, βεβοήθηκα", meaning: "help, assist (+dat.)", category: "verb: contracted", semanticGroup: "Help and Safety", rank: 473 },
  { greek: "λαμπρός –ά –όν", meaning: "bright, brilliant; well-known, illustrious", category: "adjective: 1st and 2nd declension", semanticGroup: "Characteristics", rank: 474 },
  { greek: "ἀπαλλάσσω, ἀπαλλάξω, ἀπήλλαξα, ἀπήλλαχα, ἀπήλλαγμαι, ἀπηλλάχθην or ἀπηλλάγην", meaning: "set free, release, deliver", category: "verb: -ω palatal stem", semanticGroup: "Help and Safety", rank: 475 },
  { greek: "βουλεύω βουλεύσω, ἐβούλευσα, βεβούλευκα, βεβούλευμαι, ἐβουλεύθην", meaning: "plan (to), decide (to); (mid.) deliberate", category: "verb: -ω vowel stem", semanticGroup: "War and Peace", rank: 476 },
  { greek: "μάλα", meaning: "very, very much", category: "adverb", semanticGroup: "Conjunctions/Adverbs", rank: 477 },
  { greek: "αἰτέω, αἰτήσω, ᾔτησα, ᾔτηκα, ᾔτημαι, ᾐτήθην", meaning: "ask (for), beg", category: "verb: contracted", semanticGroup: "Writing and Talking", rank: 478 },
  { greek: "σωτηρία σωτηρίας, ἡ", meaning: "safety, deliverance", category: "noun: 1st declension", semanticGroup: "Help and Safety", rank: 479 },
  { greek: "ἆρα", meaning: "[introduces a question]", category: "adverb", semanticGroup: "Particles", rank: 480 },
  { greek: "διώκω, διώξομαι, ἐδίωξα, δεδίωχα, ἐδιώχθην", meaning: "pursue", category: "verb: -ω palatal stem", semanticGroup: "Movement", rank: 481 },
  { greek: "δαίμων δαίμονος, ὁ/ἡ", meaning: "spirit, god, demon", category: "noun: 3rd declension consonant stem", semanticGroup: "Religion", rank: 482 },
  { greek: "οὐκοῦν", meaning: "surely then (inviting assent to an inference)", category: "adverb", semanticGroup: "Particles", rank: 483 },
  { greek: "γλῶσσα γλώσσης, ἡ", meaning: "tongue; language", category: "noun: 1st declension", semanticGroup: "Body Parts", rank: 484 },
  { greek: "ἑπτά", meaning: "seven", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 485 },
  { greek: "τολμάω, τολμήσω, ἐτόλμησα, τετόλμηκα, τετόλμημαι, ἐτολμήθην", meaning: "have the courage, dare; undertake, undergo", category: "verb: contracted", semanticGroup: "The Senses and Feelings", rank: 486 },
  { greek: "δεσπότης –ου, ὁ", meaning: "master (of the household); absolute ruler", category: "noun: 1st declension", semanticGroup: "Government and Society", rank: 487 },
  { greek: "εἰκός εἰκότος, τό", meaning: "likelihood, probability; εἰκός (ἐστι) it is likely (+infin.) →ἔοικα", category: "noun: 3rd declension consonant stem", semanticGroup: "The Mind, Perceiving and Learning", rank: 488 },
  { greek: "ἄδικος ἄδικον", meaning: "unjust", category: "adjective: 1st and 2nd declension", semanticGroup: "Ethics and Morals", rank: 489 },
  { greek: "εἴκοσι(ν)", meaning: "twenty", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 490 },
  { greek: "μυρίος μυρία μυρίον", meaning: "countless; μύριοι 10,000; μυριάς -άδος ἡ 10,000, a countless amount", category: "adjective: 1st and 2nd declension", semanticGroup: "Measurements and Numerals", rank: 491 },
  { greek: "αὐτίκα", meaning: "at once, immediately", category: "adverb", semanticGroup: "Time", rank: 492 },
  { greek: "δέκατος –η –ον", meaning: "tenth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 493 },
  { greek: "βαίνω, βήσομαι, 2 aor. ἔβην, βέβηκα", meaning: "walk, come, go", category: "verb: -ω liquid stem", semanticGroup: "Movement", rank: 494 },
  { greek: "περ", meaning: "[enclitic added to pronouns and other particles for emphasis]", category: "adverb", semanticGroup: "Particles", rank: 495 },
  { greek: "ἐλεύθερος ἐλευθέρα ἐλεύθερον", meaning: "free, independent", category: "adjective: 1st and 2nd declension", semanticGroup: "Government and Society", rank: 496 },
  { greek: "στρατιά –ᾶς, ἡ", meaning: "army", category: "noun: 1st declension", semanticGroup: "War and Peace", rank: 497 },
  { greek: "ἀμφί", meaning: "about, around", category: "preposition", semanticGroup: "Direction", rank: 498 },
  { greek: "συμφορά –ᾶς, ἡ", meaning: "event, circumstance, misfortune", category: "noun: 1st declension", semanticGroup: "Life and Death", rank: 499 },
  { greek: "ἑκατόν", meaning: "hundred", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 500 },
  { greek: "νίκη νίκης, ἡ", meaning: "victory", category: "noun: 1st declension", semanticGroup: "War and Peace", rank: 501 },
  { greek: "ἔπος ἔπους, τό", meaning: "word, speech, tale; prophecy", category: "noun: 3rd declension σ-stem", semanticGroup: "Writing and Talking", rank: 502 },
  { greek: "στρατός –οῦ, ὁ", meaning: "army", category: "noun: 2nd declension", semanticGroup: "War and Peace", rank: 503 },
  { greek: "φράζω, φράσω, ἔφρασα, πέφρακα, πέφρασμαι, ἐφράσθην", meaning: "tell, declare; (mid. and pass.) think (about)", category: "verb: -ω dental stem", semanticGroup: "Writing and Talking", rank: 504 },
  { greek: "ἀργύριον ἀργυρίου, τό", meaning: "money", category: "noun: 2nd declension", semanticGroup: "Government and Society", rank: 505 },
  { greek: "τριάκοντα", meaning: "thirty", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 506 },
  { greek: "ἕξ", meaning: "six", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 507 },
  { greek: "πεμπτός –ή –όν", meaning: "fifth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 508 },
  { greek: "μάρτυς μάρτυρος, ὁ/ἡ", meaning: "witness", category: "noun: 3rd declension consonant stem", semanticGroup: "Law and Judgment", rank: 509 },
  { greek: "χαλκοῦς –ῆ –οῦν", meaning: "of copper or bronze", category: "adjective: 1st and 2nd declension", semanticGroup: "Earth", rank: 510 },
  { greek: "ἕβδομος –η –ον", meaning: "seventh", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 511 },
  { greek: "ποῦ", meaning: "where", category: "pronoun", semanticGroup: "Pronouns/Interrogatives", rank: 512 },
  { greek: "ναί", meaning: "indeed, yes (used in strong affirmation)", category: "adverb", semanticGroup: "Particles", rank: 513 },
  { greek: "φῶς φωτός, τό", meaning: "light, daylight", category: "noun: 3rd declension consonant stem", semanticGroup: "World Order", rank: 514 },
  { greek: "ὀκτώ", meaning: "eight", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 515 },
  { greek: "ἕκτος –η –ον", meaning: "sixth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 516 },
  { greek: "τριακοστός –ή –όν", meaning: "thirtieth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 517 },
  { greek: "ἐννέα", meaning: "nine", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 518 },
  { greek: "πότε", meaning: "when?", category: "adverb", semanticGroup: "Time", rank: 519 },
  { greek: "ὄγδοος –η –ον", meaning: "eighth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 520 },
  { greek: "ἔνατος –α –ον", meaning: "ninth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 521 },
  { greek: "εἰκοστός –ή –όν", meaning: "twentieth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 522 },
  { greek: "ἀγγέλλω, ἀγγελῶ, ἤγγειλα, ἤγγελκα, ἤγγελμαι, ἠγγέλθην", meaning: "report, tell", category: "verb: -ω liquid stem", semanticGroup: "Writing and Talking", rank: 523 },
  { greek: "ἑκατοστός –ή –όν", meaning: "hundredth", category: "adjective: numeral", semanticGroup: "Measurements and Numerals", rank: 524 },
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

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}
function compareGreekAnswer(answer, expected, accentMode = "accent-insensitive", typoTolerance = true) {
  const rawA = String(answer || "").trim();
  const rawB = String(expected || "").trim();
  if (!rawA || !rawB) return { ok: false, mode: "blank" };
  if (accentMode === "accent-sensitive") {
    if (rawA === rawB) return { ok: true, mode: "exact" };
    if (typoTolerance && levenshtein(rawA, rawB) <= 1) return { ok: true, mode: "near" };
    return { ok: false, mode: "exact-required" };
  }
  const a = normalize(rawA);
  const b = normalize(rawB);
  if (a === b || a.includes(b) || b.includes(a)) return { ok: true, mode: "normalized" };
  if (typoTolerance && levenshtein(a, b) <= 1) return { ok: true, mode: "near" };
  return { ok: false, mode: "normalized-required" };
}
function greekTokens(text) {
  return String(text || "").replace(/[·.,;:!?]/g, "").split(/\s+/).filter(Boolean);
}
function categoryBucket(category) {
  const c = String(category || "").toLowerCase();
  if (c.includes("verb")) return "verb";
  if (c.includes("noun")) return "noun";
  if (c.includes("adjective")) return "adjective";
  if (c.includes("pronoun")) return "pronoun";
  if (c.includes("particle")) return "particle";
  if (c.includes("preposition")) return "preposition";
  if (c.includes("conjunction")) return "conjunction";
  if (c.includes("article")) return "article";
  if (c.includes("participle")) return "participle";
  if (c.includes("infinitive")) return "infinitive";
  return "other";
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
  const pronouns = PRONOUNS.map((p) => ({ greek: p.lemma, translit: "", meaning: p.meaning, category: "pronoun", chapter: "Pronouns", mastery: 45, source: "custom" }));
  const participles = PARTICIPLES.map((p) => ({ greek: p.lemma, translit: "", meaning: p.meaning, category: "participle", chapter: "Participles", mastery: 45, source: "custom" }));
  const infinitives = [
    { greek: "λύειν", translit: "luein", meaning: "to loosen", category: "infinitive", chapter: "Infinitives", mastery: 45, source: "custom" },
    { greek: "παύειν", translit: "pauein", meaning: "to stop", category: "infinitive", chapter: "Infinitives", mastery: 45, source: "custom" },
    { greek: "γενέσθαι", translit: "genesthai", meaning: "to become", category: "infinitive", chapter: "Infinitives", mastery: 45, source: "custom" },
    { greek: "μαθεῖν", translit: "mathein", meaning: "to learn", category: "infinitive", chapter: "Infinitives", mastery: 45, source: "custom" },
    { greek: "λέγειν", translit: "legein", meaning: "to speak", category: "infinitive", chapter: "Infinitives", mastery: 45, source: "custom" },
  ];
  const particles = PARTICLES.map((p) => ({ greek: p.greek, translit: "", meaning: p.meaning, category: "particle", chapter: "Particles and function words", mastery: 45, source: "custom" }));

  const customRows = [
    ...VERBS.map((v) => ({ greek: v.lemma, translit: v.translit, meaning: v.meaning, category: "verb", chapter: "Core verbs", mastery: 45, source: "custom" })),
    ...NOUNS.map((n) => ({ greek: n.lemma, translit: n.translit, meaning: n.meaning, category: "noun", chapter: "Nominals", mastery: 45, source: "custom" })),
    ...ADJECTIVES.map((a) => ({ greek: a.lemma, translit: a.translit, meaning: a.meaning, category: "adjective", chapter: "Adjectives", mastery: 45, source: "custom" })),
    ...pronouns,
    ...participles,
    ...infinitives,
    ...particles,
  ];

  const dccRows = DCC_CORE.map((x) => ({
    greek: x.greek,
    translit: "",
    meaning: x.meaning,
    category: x.category,
    chapter: `DCC Core #${x.rank}`,
    mastery: 45,
    source: "dcc",
    semanticGroup: x.semanticGroup,
    rank: x.rank,
  }));

  const seen = new Set();
  const merged = [];
  [...customRows, ...dccRows].forEach((row) => {
    const key = normalize(row.greek);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(row);
    }
  });

  return merged;
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
  const [lexiconFilter, setLexiconFilter] = useState("all");
  const [lexiconPosFilter, setLexiconPosFilter] = useState("all");
  const [lexiconSort, setLexiconSort] = useState("rank");
  const [lexiconPage, setLexiconPage] = useState(1);
  const [readerKey, setReaderKey] = useState("xenophon");
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedReaderWord, setSelectedReaderWord] = useState("");
  const [compositionInput, setCompositionInput] = useState("");
  const [compositionResult, setCompositionResult] = useState(null);
  const [guidedPromptIndex, setGuidedPromptIndex] = useState(0);
  const [accentMode, setAccentMode] = useState("accent-insensitive");
  const [typoTolerance, setTypoTolerance] = useState(true);
  const [exportMessage, setExportMessage] = useState("");
  const [favoriteWords, setFavoriteWords] = useState(stored?.favoriteWords || []);
  const [wordStatus, setWordStatus] = useState(stored?.wordStatus || {});

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

  const reviewQueue = [...mistakeLog].slice(0, 8);
  const pageSize = 24;
  const favoritesSet = new Set(favoriteWords);
  const readerDifficulty = {
    xenophon: "Intermediate",
    plato: "Intermediate",
    lysias: "Intermediate",
  };
  const readerPassages = AUTHOR_READERS[readerKey] || [];
  const selectedReaderGloss = selectedReaderWord
    ? vocab.find((v) => normalize(v.greek) === normalize(selectedReaderWord) || normalize(v.greek).split(" ")[0] === normalize(selectedReaderWord))
    : null;

  const lexiconRows = useMemo(() => {
    const q = normalize(lexiconQuery);
    const filtered = vocab
      .filter((v) => !q || normalize(v.greek).includes(q) || normalize(v.meaning).includes(q))
      .filter((v) => lexiconFilter === "all" ? true : v.source === lexiconFilter)
      .filter((v) => lexiconPosFilter === "all" ? true : categoryBucket(v.category) === lexiconPosFilter);

    const sorted = [...filtered].sort((a, b) => {
      if (lexiconSort === "rank") return (a.rank || 999999) - (b.rank || 999999);
      if (lexiconSort === "alpha") return a.greek.localeCompare(b.greek, "el");
      if (lexiconSort === "semantic") return String(a.semanticGroup || "").localeCompare(String(b.semanticGroup || ""));
      return 0;
    });
    return sorted;
  }, [vocab, lexiconQuery, lexiconFilter, lexiconPosFilter, lexiconSort]);
  const lexiconPageCount = Math.max(1, Math.ceil(lexiconRows.length / pageSize));
  const pagedLexiconRows = lexiconRows.slice((lexiconPage - 1) * pageSize, lexiconPage * pageSize);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("attic-greek-trainer-vnext", JSON.stringify({ mistakeLog, studyStats, favoriteWords, wordStatus }));
  }, [mistakeLog, studyStats, favoriteWords, wordStatus]);

  useEffect(() => {
    setLexiconPage(1);
  }, [lexiconQuery, lexiconFilter, lexiconPosFilter, lexiconSort]);

  const resetProgress = () => {
    setMistakeLog([]);
    setStudyStats({ totalAnswered: 0, totalCorrect: 0, streak: 0, lastStudyDate: null });
    setFavoriteWords([]);
    setWordStatus({});
    setExportMessage("Progress reset.");
    if (typeof window !== "undefined") window.localStorage.removeItem("attic-greek-trainer-vnext");
  };
  const exportProgress = async () => {
    const payload = JSON.stringify({ mistakeLog, studyStats, favoriteWords, wordStatus }, null, 2);
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
    const comparison = compareGreekAnswer(trainerAnswer, trainer.answer, accentMode, typoTolerance);
    const ok = comparison.ok;
    setTrainerFeedback(ok ? `correct (${comparison.mode})` : "incorrect");
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
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="text-xl">Due review queue</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  {reviewQueue.length === 0 ? <div className="rounded-2xl border p-3">No due review items yet. Get a few answers wrong and the queue will populate for spaced repetition.</div> : reviewQueue.map((item, i) => <div key={i} className="rounded-2xl border p-3"><div className="font-medium text-slate-800">{item.prompt}</div><div>Expected: {item.expected}</div></div>)}
                </CardContent>
              </Card>
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="text-xl">Checking mode</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 text-sm text-slate-600">
                  <NativeSelect value={accentMode} onChange={setAccentMode} options={[{value:"accent-insensitive",label:"Accent-insensitive"},{value:"accent-sensitive",label:"Accent-sensitive"}]} />
                  <NativeSelect value={typoTolerance ? "on" : "off"} onChange={(v)=>setTypoTolerance(v==="on")} options={[{value:"on",label:"Typo tolerance on"},{value:"off",label:"Typo tolerance off"}]} />
                  <div className="rounded-2xl border p-3 md:col-span-2">Use accent-sensitive mode when you want stricter production practice. Leave typo tolerance on for faster drilling.</div>
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
                  <div className="text-xs text-slate-500">Checking mode: {accentMode === "accent-sensitive" ? "accent-sensitive" : "accent-insensitive"} · typo tolerance {typoTolerance ? "on" : "off"}</div>
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
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="flex items-center gap-2 rounded-2xl border px-3 py-2 md:col-span-2"><Search className="h-4 w-4 text-slate-500" /><Input value={lexiconQuery} onChange={(e) => setLexiconQuery(e.target.value)} placeholder="Search Greek or English" className="border-0 shadow-none focus-visible:ring-0" /></div>
                  <NativeSelect value={lexiconFilter} onChange={setLexiconFilter} options={[{ value: "all", label: "All sources" },{ value: "dcc", label: "DCC only" },{ value: "custom", label: "Custom only" }]} />
                  <NativeSelect value={lexiconPosFilter} onChange={setLexiconPosFilter} options={[{value:"all",label:"All parts of speech"},{value:"verb",label:"Verbs"},{value:"noun",label:"Nouns"},{value:"adjective",label:"Adjectives"},{value:"pronoun",label:"Pronouns"},{value:"particle",label:"Particles"},{value:"preposition",label:"Prepositions"},{value:"conjunction",label:"Conjunctions"},{value:"article",label:"Articles"}]} />
                </div>
                <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                  <NativeSelect value={lexiconSort} onChange={setLexiconSort} options={[{value:"rank",label:"Sort by rank"},{value:"alpha",label:"Sort alphabetically"},{value:"semantic",label:"Sort by semantic group"}]} />
                  <div className="text-sm text-slate-500 self-center">Showing {pagedLexiconRows.length} of {lexiconRows.length} entries on page {lexiconPage}/{lexiconPageCount}.</div>
                </div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {pagedLexiconRows.map((row, i) => (
                    <div key={i} className="rounded-2xl border p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-lg">{row.greek}</span>
                        <div className="flex items-center gap-2">
                          <button className="rounded p-1 hover:bg-slate-100" onClick={() => setFavoriteWords((prev) => favoritesSet.has(row.greek) ? prev.filter((x) => x !== row.greek) : [...prev, row.greek])}><Star className={`h-4 w-4 ${favoritesSet.has(row.greek) ? "fill-current" : ""}`} /></button>
                          <Badge variant="outline">{row.category}</Badge>
                        </div>
                      </div>
                      <div className="text-slate-600">{row.meaning}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>{row.chapter}</span>
                        {row.rank && <span>Rank {row.rank}</span>}
                        {row.semanticGroup && <span>{row.semanticGroup}</span>}
                        <span>{row.source === "dcc" ? "DCC" : "Custom"}</span>
                        {wordStatus[row.greek] && <span>Status: {wordStatus[row.greek]}</span>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="outline" className="px-2 py-1 text-xs" onClick={() => setWordStatus((prev) => ({ ...prev, [row.greek]: "new" }))}>New</Button>
                        <Button variant="outline" className="px-2 py-1 text-xs" onClick={() => setWordStatus((prev) => ({ ...prev, [row.greek]: "weak" }))}>Weak</Button>
                        <Button variant="outline" className="px-2 py-1 text-xs" onClick={() => setWordStatus((prev) => ({ ...prev, [row.greek]: "known" }))}>Known</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={() => setLexiconPage((p) => Math.max(1, p - 1))} disabled={lexiconPage === 1}><ChevronLeft className="mr-2 h-4 w-4" /> Previous</Button>
                  <Button variant="outline" onClick={() => setLexiconPage((p) => Math.min(lexiconPageCount, p + 1))} disabled={lexiconPage === lexiconPageCount}>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readers">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><BookOpen className="h-5 w-5" /> Author readers</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <NativeSelect value={readerKey} onChange={(v) => { setReaderKey(v); setSelectedReaderWord(""); }} options={[{value:"xenophon",label:"Xenophon"},{value:"plato",label:"Plato"},{value:"lysias",label:"Lysias"}]} className="max-w-xs" />
                  <Button variant="outline" onClick={() => setShowTranslation((v) => !v)}>{showTranslation ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}{showTranslation ? "Hide translation" : "Show translation"}</Button>
                </div>
                <div className="text-sm text-slate-500">Difficulty: {readerDifficulty[readerKey]}. Tap a Greek word to see a gloss from the lexicon.</div>
                <div className="space-y-3">
                  {readerPassages.map((item, i) => <div key={i} className="rounded-2xl border p-4">
                    <div className="font-medium text-lg leading-8">
                      {greekTokens(item.greek).map((tok, j) => <button key={j} className="mr-2 rounded px-1 hover:bg-slate-100" onClick={() => setSelectedReaderWord(tok)}>{tok}</button>)}
                    </div>
                    {showTranslation && <div className="mt-1 text-sm text-slate-600">{item.english}</div>}
                    <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                      <div className="font-medium text-slate-800">Comprehension check</div>
                      <div>Can you identify the main verb and the subject before revealing the translation?</div>
                    </div>
                  </div>)}
                </div>
                {selectedReaderWord && <div className="rounded-2xl border p-4 text-sm">
                  <div className="font-medium text-slate-800">Gloss for {selectedReaderWord}</div>
                  {selectedReaderGloss ? <div className="mt-1 text-slate-600">{selectedReaderGloss.meaning}</div> : <div className="mt-1 text-slate-500">No exact gloss found in the current lexicon.</div>}
                </div>}
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
                  <div className="flex gap-2"><Button onClick={() => (() => { const comparison = compareGreekAnswer(moodInput, currentMoodDrill.answer, accentMode, typoTolerance); setMoodResult(comparison.ok ? `Correct (${comparison.mode})` : `Try again — ${currentMoodDrill.answer}`); })()}>Check</Button><Button variant="outline" onClick={() => { setMoodIndex((moodIndex + 1) % MOOD_DRILLS.length); setMoodInput(""); setMoodResult(null); }}>Next</Button></div>
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
              <Card className="rounded-3xl shadow-sm"><CardHeader><CardTitle className="text-xl">Form library</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-600"><div className="rounded-2xl border p-3">Verbs: {VERBS.length}</div><div className="rounded-2xl border p-3">Nouns: {NOUNS.length}</div><div className="rounded-2xl border p-3">Adjectives: {ADJECTIVES.length}</div><div className="rounded-2xl border p-3">Pronouns: {PRONOUNS.length}</div><div className="rounded-2xl border p-3">Participles: {PARTICIPLES.length}</div><div className="rounded-2xl border p-3">Total lexicon rows: {vocab.length}</div><div className="rounded-2xl border p-3">DCC rows: {vocab.filter((x) => x.source === "dcc").length}</div><div className="rounded-2xl border p-3">Favorite words: {favoriteWords.length}</div><div className="rounded-2xl border p-3">Author packs: {Object.keys(AUTHOR_READERS).length}</div></CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
