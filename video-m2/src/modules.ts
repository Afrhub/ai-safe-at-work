// Per-module explainer scripts (M3–M12), data-driven via ModuleVideo.
// Narration is plain spoken English ("A.I." spelled for TTS), matching M2.
import type { ModuleSpec } from "./ModuleVideo";

export const MODULES: ModuleSpec[] = [
  /* ───────────────────────── MODULE 3 ───────────────────────── */
  {
    id: "Module3", dir: "m3", ref: "REF AISW·M03", watermark: "§3",
    scenes: [
      { id: "01-intro", kicker: "Module 3", title: "The never-paste list",
        text: "If one module sticks, make it this one. Some kinds of information should never go into a free or paid A.I. tool — no matter how you dress up the task. Just to format it, or just to sum it up, still counts." },
      { id: "02-classify", kicker: "First, classify", title: "What kind of data is it?", type: "manifest",
        bullets: ["Public — already out there", "Internal — staff only", "Confidential — client or commercial", "Personal — about a person", "Special category — health, race, more"],
        text: "Before you paste, decide what the information is. Public, already out there. Internal, for staff. Confidential, client or commercial. Personal, about a living person. Or special category — health, race, politics and the rest. The more sensitive the class, the higher the bar for where it can go. If you are not sure, treat it as the most sensitive kind." },
      { id: "03-never", kicker: "The list", title: "Nine kinds that never go in", type: "manifest",
        bullets: ["Customer and personal records", "Special-category personal data", "Anything covered by an NDA", "Unreleased or commercial secrets", "Credentials, keys and passwords", "Source code from private repos"],
        text: "Here is the heart of it. Customer and personal records. Special-category data like health or biometrics. Anything under a non-disclosure agreement. Unreleased products and commercial secrets. Passwords, keys and credentials. And private source code. These never go into a public tool." },
      { id: "04-why", kicker: "Why it bites", title: "The data leaves your control", type: "stamp",
        stamp: { word: "NO PASTE", tone: "red" },
        text: "Once it is pasted, it sits on a computer your company has no deal with, no right to check, and maybe no legal reach over. You cannot pull it back. That is why the rule is a hard line, not a judgement call." },
      { id: "05-reformulate", kicker: "The safe move", title: "Describe the shape, not the secret", type: "compare",
        columns: [
          { head: "Don't", tone: "bad", body: "Paste the real contract, the real client list, the real numbers." },
          { head: "Do", tone: "good", body: "Describe the structure and ask in general terms — no real names, no real data." },
        ],
        text: "Most of the time you can get the same help without the risk. Don't paste the real contract or the real client list. Instead, describe the shape of the problem in general terms — no real names, no real numbers — and apply the answer yourself." },
      { id: "06-standards", kicker: "Where the rules land", title: "GDPR and ISO back this up",
        text: "This is not just good manners. G.D.P.R. governs personal data. ISO twenty-seven thousand and one asks you to classify and label information and prevent data leakage. The never-paste list is how a normal person meets those rules on a normal day.",
        takeaway: "When in doubt, treat it as the most sensitive class." },
    ],
  },

  /* ───────────────────────── MODULE 4 ───────────────────────── */
  {
    id: "Module4", dir: "m4", ref: "REF AISW·M04", watermark: "§4",
    scenes: [
      { id: "01-intro", kicker: "Module 4", title: "Picking the right tool for the job",
        text: "The same task can be safe in one A.I. tool and a problem in another. This module is about matching the work to the right tool — and knowing when to stop and ask first." },
      { id: "02-match", kicker: "The decision", title: "Match the data to the tool", type: "flow",
        steps: ["What is the task?", "What class of data?", "Which approved tool?"],
        text: "It comes down to three questions. What is the task? What class of data does it touch? And which approved tool is cleared for that class? Answer those in order and most decisions make themselves." },
      { id: "03-shadow", kicker: "The hidden risk", title: "Shadow AI", type: "stamp",
        stamp: { word: "SHADOW AI", tone: "red" },
        text: "When people use A.I. tools outside approved company processes, it is called Shadow A.I. It reduces visibility, increases risk, and makes governance far harder — because no one can manage data they do not know is leaving." },
      { id: "04-approved", kicker: "Use what's cleared", title: "Approved beats convenient", type: "compare",
        columns: [
          { head: "Convenient", tone: "bad", body: "A free tool you found yourself, no company deal, no oversight." },
          { head: "Approved", tone: "good", body: "A tool your business cleared, with a contract and admin controls." },
        ],
        text: "The convenient tool is the one you already have open. The approved tool is the one your business has a contract with and can oversee. For anything beyond public data, approved beats convenient every time." },
      { id: "05-ask", kicker: "When unsure", title: "Ask before you paste",
        text: "If there is no approved tool for the task, that is not a dead end — it is a question for your manager or I.T. Asking first is cheap. Cleaning up a leak is not.",
        takeaway: "No approved tool? Ask before you paste." },
    ],
  },

  /* ───────────────────────── MODULE 5 ───────────────────────── */
  {
    id: "Module5", dir: "m5", ref: "REF AISW·M05", watermark: "§5",
    scenes: [
      { id: "01-intro", kicker: "Module 5", title: "Verifying what the AI tells you",
        text: "A.I. tools sound confident even when they are wrong. They invent facts, citations and quotes that look perfect. This module is about trusting nothing important until you have checked it." },
      { id: "02-hallucinate", kicker: "The core problem", title: "Confident, fluent, and sometimes wrong",
        text: "An A.I. does not know things the way you do. It predicts likely text. Most of the time that is useful. Sometimes it produces a made-up case, a fake statistic, or a quote nobody said — delivered with total confidence." },
      { id: "03-twosource", kicker: "The rule", title: "The two-source rule", type: "flow",
        steps: ["AI gives an answer", "Check source one", "Check source two", "Then rely on it"],
        text: "For anything that matters, use the two-source rule. The A.I. gives you an answer. You confirm it against one independent source, then a second. Only then do you rely on it. Facts, figures, names, legal references — all get checked." },
      { id: "04-oversight", kicker: "EU AI Act Article 14", title: "Human oversight means real review", type: "compare",
        columns: [
          { head: "Rubber-stamping", tone: "bad", body: "Accept the output, sign it off, move on. Not oversight." },
          { head: "Real oversight", tone: "good", body: "Read it, judge it, able to override it. That is the law's bar." },
        ],
        text: "The E.U. A.I. Act calls for meaningful human oversight of higher-risk A.I. That means a person who actually reads the output, judges it, and can overrule it — not someone who clicks approve without looking." },
      { id: "05-takeaway", kicker: "The habit", title: "Cite as you summarise",
        text: "When you use A.I. to summarise, keep the link to the source beside the summary. It makes checking quick and proves where the answer came from.",
        takeaway: "Verify before you rely. Always." },
    ],
  },

  /* ───────────────────────── MODULE 6 ───────────────────────── */
  {
    id: "Module6", dir: "m6", ref: "REF AISW·M06", watermark: "§6",
    scenes: [
      { id: "01-intro", kicker: "Module 6", title: "Scams, upgraded by AI",
        text: "A.I. has made scams cheaper, faster and far more convincing. The old advice — watch for bad spelling — no longer protects you. This module is about the new shape of the attack." },
      { id: "02-phishing", kicker: "Phishing", title: "Perfect-looking, perfectly wrong",
        text: "A significant and growing share of phishing is now written or polished by A.I. The grammar is clean, the tone is right, the logo is perfect. The red flag is no longer the writing. It is the request." },
      { id: "03-deepfake", kicker: "Deepfakes", title: "A voice that sounds right", type: "stat",
        stat: { value: "£20M", label: "lost to one deepfake video call" },
        text: "A.I. can clone a voice from seconds of audio and fake a face on a video call. One firm, Arup, lost about twenty million pounds when a worker joined a call with people who all looked and sounded real, and were not. It is increasingly difficult to distinguish from real." },
      { id: "04-bec", kicker: "Business email compromise", title: "The costliest pattern",
        text: "Business email compromise is one of the most common and costly A.I.-enhanced frauds. An urgent message, apparently from a boss or supplier, asks you to move money or change bank details. It looks completely normal. That is the danger." },
      { id: "05-verify", kicker: "The defence", title: "Verify the channel", type: "flow",
        steps: ["Unexpected urgent request", "Stop", "Confirm on a known channel", "Then act"],
        text: "The defence is simple and human. An unexpected, urgent request to move money or data? Stop. Confirm it on a channel you already trust — a known number, in person — not the one the message came from. Then act." },
      { id: "06-governance", kicker: "Governance insight", title: "Still a human problem",
        text: "Social engineering remains primarily a human problem. A.I. increases the scale, quality and speed — but governance, awareness, verification and strong authentication remain the most effective controls.",
        takeaway: "The red flag is the request, not the writing." },
    ],
  },

  /* ───────────────────────── MODULE 7 ───────────────────────── */
  {
    id: "Module7", dir: "m7", ref: "REF AISW·M07", watermark: "§7",
    scenes: [
      { id: "01-intro", kicker: "Module 7", title: "Bias, fairness and high-stakes decisions",
        text: "A.I. learns from the past, including its unfairness. When it shapes decisions about people — who to hire, who to serve, what to charge — bias stops being abstract and starts affecting lives." },
      { id: "02-scales", kicker: "How bias hides", title: "Who is missing from the data?", type: "stamp",
        stamp: { word: "WHO IS MISSING?", tone: "peri" },
        text: "Bias usually is not malicious. It is in the data. If the training data under-represents a group, the A.I. quietly works less well for them. The question to keep asking is simple: who is missing from this picture?" },
      { id: "03-highrisk", kicker: "EU AI Act", title: "Some uses are high-risk",
        text: "Certain A.I. systems used for things like hiring, credit, education or essential services may be classified as high-risk under the E.U. A.I. Act, depending on how they are used. That can bring additional governance, oversight and compliance obligations." },
      { id: "04-draft", kicker: "It's just a draft", title: "The risk is unreviewed influence", type: "compare",
        columns: [
          { head: "The danger", tone: "bad", body: "Letting an A.I. recommendation drive a decision without challenge." },
          { head: "The fix", tone: "good", body: "A human reviews, questions, and can overturn the recommendation." },
        ],
        text: "Using A.I. to draft is fine. The risk is letting its recommendation influence a real decision without appropriate review and challenge. The output is a starting point, never the verdict." },
      { id: "05-governance", kicker: "Governance insight", title: "Manage bias, don't pretend it's gone",
        text: "Bias management is not about removing all bias from A.I. It is about identifying possible sources of unfairness, applying appropriate controls, and making sure someone is accountable for the decision.",
        takeaway: "A human owns every decision about a person." },
    ],
  },

  /* ───────────────────────── MODULE 8 ───────────────────────── */
  {
    id: "Module8", dir: "m8", ref: "REF AISW·M08", watermark: "§8",
    scenes: [
      { id: "01-intro", kicker: "Module 8", title: "Copyright, IP and other people's content",
        text: "A.I. and copyright is really two questions people often blur together. What goes in — and what comes out. The law here is moving, so this is about managing risk, not memorising rules." },
      { id: "02-input", kicker: "What goes in", title: "Don't feed it other people's work", type: "compare",
        columns: [
          { head: "High risk", tone: "bad", body: "Paywalled articles, licensed material, a competitor's documents." },
          { head: "Safer", tone: "good", body: "Your own material, or content you have the rights to use." },
        ],
        text: "Pasting other people's content into an A.I. is not always neutral. Paywalled articles, licensed material, confidential documents — feeding those in is likely to create legal, contractual or confidentiality concerns." },
      { id: "03-output", kicker: "What comes out", title: "You may not own it",
        text: "Fully A.I.-generated material with no significant human creative input may not qualify for copyright protection in many jurisdictions. The position keeps evolving and varies by country. Ownership, authorship and copyright are separate ideas, and may be treated differently." },
      { id: "04-trademark", kicker: "A separate risk", title: "Brands and trademarks", type: "stamp",
        stamp: { word: "CHECK THE BRAND", tone: "peri" },
        text: "A.I. content can also reproduce protected logos, brand names or product designs by accident — a separate risk from copyright. Treat a brand and trademark check as its own step on anything customer-facing." },
      { id: "05-governance", kicker: "Governance insight", title: "Can you prove provenance?",
        text: "The key question is often not can we use A.I.-generated content, but can we demonstrate ownership, licensing rights, provenance and appropriate review? A short record of how each asset was made is what lets the business stand behind it.",
        takeaway: "Keep the receipt: prompts, edits, rights." },
    ],
  },

  /* ───────────────────────── MODULE 9 ───────────────────────── */
  {
    id: "Module9", dir: "m9", ref: "REF AISW·M09", watermark: "§9",
    scenes: [
      { id: "01-intro", kicker: "Module 9", title: "Logging, accountability and who used what",
        text: "Six months after A.I. helped make a decision, someone may ask how it was decided. The honest answer takes ten seconds to note at the time, and is nearly impossible to reconstruct later." },
      { id: "02-significant", kicker: "What counts", title: "Which uses are worth logging?", type: "manifest",
        bullets: ["Does it affect another person?", "Does it represent the business?", "Was the data sensitive?", "Was the decision costly or hard to reverse?", "Does it touch a regulator or audit?"],
        text: "Not every chat needs a record. Log it when two or more of these are true: it affects another person, it represents the business, the data was sensitive, the decision was costly or irreversible, or it touches a regulatory or audit activity." },
      { id: "03-log", kicker: "The minimum log", title: "Nine quick fields", type: "manifest",
        bullets: ["Date and who", "Tool and tier", "Task, in one line", "What went in, what came back", "What you did with it", "Outcome — used, rejected, escalated"],
        text: "The log can live in a spreadsheet. Date and who. The tool and tier. The task in one line. What kind of data went in, and what came back. What you did with the output. And the outcome — used, rejected, escalated, or sent for further review." },
      { id: "04-article22", kicker: "GDPR Article 22", title: "Protections for automated decisions",
        text: "G.D.P.R. Article twenty-two gives protections around certain decisions made solely by automated means, alongside transparency duties. A meaningful human in the loop keeps a decision from being solely automated — but transparency and accountability may still apply." },
      { id: "05-blame", kicker: "Beware 'the AI decided'", title: "Accountability stays with you", type: "stamp",
        stamp: { word: "THE ORG OWNS IT", tone: "peri" },
        text: "It is tempting to say the A.I. decided. Legally that is backwards. Accountability for the decision stays with the organisation and the decision-maker — never with the A.I. system." },
      { id: "06-governance", kicker: "Governance insight", title: "Logging, not surveillance",
        text: "The purpose of logging is accountability, traceability and improvement — not monitoring staff performance. Keep those two purposes clearly separate in policy and in practice.",
        takeaway: "If it matters, write it down — at the time." },
    ],
  },

  /* ───────────────────────── MODULE 10 ───────────────────────── */
  {
    id: "Module10", dir: "m10", ref: "REF AISW·M10", watermark: "§10",
    scenes: [
      { id: "01-intro", kicker: "Module 10", title: "When something goes wrong",
        text: "No matter how careful, sometimes it happens. What matters is the first hour after you notice. This module walks that hour, in order — calm, fast, and honest." },
      { id: "02-firsthour", kicker: "The first ten minutes", title: "Stop, preserve, tell, write", type: "flow",
        steps: ["Stop the bleeding", "Don't delete the evidence", "Tell someone", "Write down what happened"],
        text: "Whatever the incident, start the same way. Stop whatever is making it worse. Do not delete the evidence — investigators will need it. Tell your manager or I.T. straight away. And write down what happened while it is fresh." },
      { id: "03-categories", kicker: "Four kinds", title: "Name the incident", type: "manifest",
        bullets: ["A data leak", "Bad output acted upon", "A successful attack", "A vendor incident"],
        text: "There are four shapes. A data leak — sensitive data went into the wrong tool. Bad output acted upon — a wrong answer was used. A successful attack — money or access was given up. Or a vendor incident — your A.I. supplier had a breach. Naming it early saves days of confusion." },
      { id: "04-clock", kicker: "GDPR", title: "The 72-hour window", type: "stat",
        stat: { value: "72h", label: "potential breach-notification window" },
        text: "If personal data may have leaked, there is a potential seventy-two-hour notification requirement once the business becomes aware. The window runs continuously, including weekends and holidays. Your speed of telling your D.P.O. is what makes it survivable." },
      { id: "05-governance", kicker: "Governance insight", title: "Response, not blame",
        text: "The goal of incident response is containment, evidence preservation, assessment and learning — not assigning blame. Cultures that punish the person who reports are cultures that stop getting reports.",
        takeaway: "Tell someone fast. That is the whole game." },
    ],
  },

  /* ───────────────────────── MODULE 11 ───────────────────────── */
  {
    id: "Module11", dir: "m11", ref: "REF AISW·M11", watermark: "§11",
    scenes: [
      { id: "01-intro", kicker: "Module 11", title: "The sixty-second check",
        text: "Everything in this course comes down to a short pause before you press send. Sixty seconds, every time you use A.I. for something that matters." },
      { id: "02-check", kicker: "Before you send", title: "Three questions", type: "manifest",
        bullets: ["Nothing from the never-paste list?", "Facts and citations checked?", "A human signs it off — you?"],
        text: "Three questions. Is there anything from the never-paste list in here? Have the facts and citations been checked against real sources? And is a human — you — signing it off? Three yeses, and you are clear." },
      { id: "03-buckets", kicker: "The whole course", title: "It all maps to three risks", type: "compare",
        columns: [
          { head: "What you put in", tone: "bad", body: "Private data that leaks." },
          { head: "What it gives back", tone: "bad", body: "Made-up facts you trust." },
        ],
        text: "Every lesson maps to three risks. What you put in — private data that leaks. What it gives back — made-up facts you trust. And A.I. aimed at you — scams and deepfakes. The check guards all three." },
      { id: "04-print", kicker: "Keep it close", title: "Print it. Pin it.", type: "stamp",
        stamp: { word: "60-SECOND CHECK", tone: "green" },
        text: "This one is built to print. Put it by your desk, in the team channel, in the onboarding pack. A habit you can see is a habit you keep.",
        takeaway: "Sixty seconds now saves the worst day later." },
    ],
  },

  /* ───────────────────────── MODULE 12 ───────────────────────── */
  {
    id: "Module12", dir: "m12", ref: "REF AISW·M12", watermark: "§12",
    scenes: [
      { id: "01-intro", kicker: "Standards reference", title: "The standards behind this course",
        text: "Four sources of rules sit behind everything you have learned. They overlap and approach the same risks from different angles. Here is what each one means on a normal Tuesday." },
      { id: "02-four", kicker: "The four", title: "Two laws, two standards", type: "manifest",
        bullets: ["GDPR — personal data", "EU AI Act — AI systems, by risk", "ISO 27001 — information security", "ISO 42001 — AI governance"],
        text: "Two are laws you must follow: G.D.P.R., on personal data, and the E.U. A.I. Act, which sorts A.I. by risk. Two are voluntary standards you can choose to meet: ISO twenty-seven thousand and one for security, and ISO forty-two thousand and one for A.I. governance." },
      { id: "03-regvstd", kicker: "Regulation vs standard", title: "Must versus choose to prove", type: "compare",
        columns: [
          { head: "Regulation", tone: "bad", body: "A law. If it applies, you comply — penalties and enforcement if you don't." },
          { head: "Standard", tone: "good", body: "Voluntary good practice you can be certified against." },
        ],
        text: "A regulation is a law. If it applies to you, you must comply, and non-compliance brings regulatory penalties and enforcement. A standard is voluntary — good practice, increasingly asked for by customers and insurers, that you can choose to demonstrate." },
      { id: "04-literacy", kicker: "EU AI Act Article 4", title: "This course is the literacy measure",
        text: "Article four of the E.U. A.I. Act, in force since February twenty twenty-five, says every deployer must ensure staff have a sufficient level of A.I. literacy. This course is one such measure." },
      { id: "05-governance", kicker: "Governance insight", title: "One framework, four surfaces",
        text: "These are not four separate compliance exercises. Together they cover data, security, risk, accountability and A.I. governance — one connected framework. U.K. teams may also know Cyber Essentials and N.C.S.C. guidance as a familiar baseline.",
        takeaway: "Follow the habits; the standards follow." },
    ],
  },

  /* ───────────────────────── PLUS PACK ───────────────────────── */
  {
    id: "PlusPack", dir: "pp", ref: "REF AISW·PLUS", watermark: "PP",
    scenes: [
      { id: "01-intro", kicker: "Plus Pack", title: "Your AI governance starter kit",
        text: "Download each of the ten documents and have them ready for the A.I. Starter Management System. The Plus Pack is the paperwork that turns training into governance — the policy, the registers and the assessments an auditor expects to see." },
      { id: "02-included", kicker: "What's inside", title: "Ten documents, audit-ready", type: "manifest",
        bullets: ["Acceptable Use Policy", "Use Case & Risk Registers", "Risk Assessment Template", "Incident Form", "Roles Matrix & Steering Group", "Vendor & Supplier due diligence"],
        text: "Inside are ten documents. An Acceptable Use Policy. A Use Case Register and a Risk Register. A Risk Assessment Template and an Incident Form. A Governance Roles Matrix and Steering Group Terms of Reference. Vendor and Supplier due diligence. And an Implementation Guide to put them all to work." },
      { id: "03-system", kicker: "How it fits", title: "Assemble your AI management system", type: "flow",
        steps: ["Policy sets the rules", "Registers track the use", "Assessments score the risk", "Reviews keep it live"],
        text: "Together they form a starter A.I. management system. The policy sets the rules. The registers track where A.I. is used. The assessments score the risk. And regular reviews keep it all current." },
      { id: "04-standards", kicker: "Where the rules land", title: "Mapped to ISO 42001 and the EU AI Act",
        text: "Every document is ready to fill in, prints to P.D.F., and is mapped to ISO forty-two thousand and one and the E.U. A.I. Act. It is the documentation a regulator or an auditor expects to see.",
        takeaway: "Have the ten ready — that's your starter management system." },
    ],
  },
];

export const MODULE_BY_ID: Record<string, ModuleSpec> = Object.fromEntries(MODULES.map((m) => [m.id, m]));
