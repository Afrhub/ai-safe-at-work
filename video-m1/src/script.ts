// Narration + scene data for the Module 1 explainer.
// Used by scripts/generate-voiceover.ts (TTS) and the Remotion composition.

export const VOICE_ID = "lUTamkMw7gOzZbFIwmq4"; // user-selected ElevenLabs voice
export const FPS = 30;

export interface Scene {
  id: string;
  kicker: string;
  title: string;
  text: string; // narration (also drives duration)
  bullets?: string[];
  stat?: { value: string; label: string };
}

export const SCENES: Scene[] = [
  {
    id: "01-intro",
    kicker: "Module 1",
    title: "Why this course exists",
    text:
      "Why does this course exist? Three true stories. Three normal workers. Three big messes that cost real money. None of these companies built A.I. They just used it.",
  },
  {
    id: "02-story-intern",
    kicker: "Story one",
    title: "The helpful intern",
    stat: { value: "40,000", label: "customer rows pasted in" },
    text:
      "Story one. An intern has a messy list of forty thousand customers to tidy up: names, home addresses, and what each person ordered. They paste the whole thing into ChatGPT and ask it to clean and sort the list. It comes back neat, and their boss is pleased. But six months later, a researcher finds the company's customer list on Google. Old chatbot chats had leaked. Now the company pays: a letter from the regulator, a warning to every customer, and one big client walks away. The real mistake happened higher up. Nobody had decided which information was safe to put into which tool.",
  },
  {
    id: "03-story-lawyer",
    kicker: "Story two",
    title: "The lawyer who didn't check",
    stat: { value: "6", label: "fake cases, all made up" },
    text:
      "Story two. A lawyer is running late on a court document. They ask ChatGPT for past cases about a contract argument. It gives back six cases that look perfect, and the lawyer puts all six in the document. The judge checks them. Not one is real. The A.I. made them up. The cost comes fast: a public telling-off, the firm's name in the news, and two clients gone. This really happened, in a case called Mata versus Avianca. Many have followed.",
  },
  {
    id: "04-story-deepfake",
    kicker: "Story three",
    title: "The fake boss on the video call",
    stat: { value: "$25M", label: "sent to scammers" },
    text:
      "Story three. A worker who handles payments joins a video call with the finance boss and three senior people. On the call, the boss tells them to send urgent payments, adding up to twenty-five million dollars. But every face on that call was fake. A.I. made the boss's voice and face, and the others too. The worker sent the money, and it vanished. This really happened, to a real firm called Arup. The worker did everything the old training said to do. The training was built for a world that has changed.",
  },
  {
    id: "05-three-risks",
    kicker: "What they share",
    title: "Three shapes of AI risk",
    bullets: [
      "What you put in: private data that leaks",
      "What it gives back: made-up facts you trust",
      "AI aimed at you: deepfakes and scam emails",
      "And what to do when something goes wrong",
    ],
    text:
      "What do these stories share? Each time, good staff used normal tools in normal ways. No hackers. No viruses. The safety rules were just years out of date. A.I. risk comes in three shapes. One: what you put in, like private data that leaks. Two: what it gives back, like made-up facts you trust. And three: A.I. aimed at you, like deepfakes and scam emails. Plus one more: what to do when something goes wrong.",
  },
  {
    id: "06-rules",
    kicker: "But I only write emails",
    title: "Where the rules land",
    bullets: [
      "EU AI Act: staff need enough know-how",
      "GDPR: handle data lawfully, fairly, openly",
      "ISO 27001 and 42001: keep it safe, manage suppliers",
    ],
    text:
      "You might think: but I only use A.I. to write emails. That is exactly who these rules are for. The big rules, like the E.U. A.I. Act, the G.D.P.R., and the I.S.O. standards, cover any company that uses A.I. to do its work. G.D.P.R. says you must handle personal data in a way that is lawful, fair, and open. And the E.U. A.I. Act says staff who use A.I. need enough know-how to use it safely. This course is part of that know-how.",
  },
  {
    id: "07-takeaway",
    kicker: "The takeaway",
    title: "Spot the risk. Dodge the mistakes.",
    text:
      "This course will not turn you into a compliance officer, or tell you which tools to buy. It helps you spot A.I. risk and dodge the common mistakes. Finish it, and workmates will start asking what you think before they hit send. Remember this one line: I was just trying to save time can be a very costly thing to say.",
  },
];
