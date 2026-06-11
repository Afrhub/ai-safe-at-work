// Narration + scene data for the Module 2 explainer.
// Used by scripts/generate-voiceover-say.sh (placeholder TTS),
// scripts/generate-voiceover.ts (ElevenLabs, key required) and the
// Remotion composition.

export const VOICE_ID = "lUTamkMw7gOzZbFIwmq4"; // same ElevenLabs voice as Module 1
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
    kicker: "Module 2",
    title: "What AI tools do with what you type",
    text:
      "When you paste something into a chatbot, your words travel to a company, onto a computer, in some country, under rules almost nobody reads. This module explains those things in plain words. Because the version of the tool you use matters as much as what you type.",
  },
  {
    id: "02-five-questions",
    kicker: "Before you paste",
    title: "The five-question test",
    bullets: [
      "What type of data am I about to paste?",
      "Where is my data kept?",
      "How long is it kept?",
      "Is it used to train the next AI?",
      "Who at the company can read it?",
    ],
    text:
      "Before you paste anything more private than a recipe into an A.I. tool, ask five things. One: what type of data am I about to paste? Public, internal, confidential, personal, or special category? If you are not sure, treat it as the most sensitive kind. Two: where is my data kept? Three: how long is it kept? Four: is it used to train the next A.I.? And five: who at the company can read it? Every big A.I. company puts the answers online. They change, so check them twice a year.",
  },
  {
    id: "03-free-version",
    kicker: "Version one of four",
    title: "The free version",
    text:
      "The free version. Like ChatGPT, Claude, Gemini or Copilot when you have not paid. Depending on the provider and your settings, your conversations may be used to improve future models. Retention varies, and delete can mean hidden from you, not gone from their computers. A few chats get read by real people. And there is no deal between your company and the A.I. company, so your company has no say over the data. Most data leaks at small companies start exactly here. Using tools outside approved processes like this is called Shadow A.I.",
  },
  {
    id: "04-paid-version",
    kicker: "Version two of four",
    title: "Paid, but still personal",
    text:
      "The paid personal version. Like ChatGPT Plus or Claude Pro. Better answers, longer chats. But it is still a public tool, and there is still no deal with your company. Paying for it yourself does not change the rules. It just gives you a faster version of the wrong tool. One real plus: most paid versions have a do-not-train switch. Find it. Turn it on. Do not assume it is already on.",
  },
  {
    id: "05-team-enterprise",
    kicker: "Versions three and four",
    title: "Team and enterprise: the rules change",
    bullets: [
      "Administrative control",
      "Data governance",
      "Identity integration",
      "Auditability",
      "Compliance requirements",
    ],
    text:
      "Team and enterprise versions are different. Your company has a proper contract, a data processing agreement, with the A.I. company. Training on your data is usually off by default, and your I.T. team sets the rules. The enterprise version adds the controls a business needs to prove itself later: administrative control, data governance, identity integration, auditability, and compliance. That is what organisations are really buying. Not better answers. Evidence and control.",
  },
  {
    id: "06-trained-on",
    kicker: "The fine print",
    title: '"Trained on" — what it really means',
    text:
      "What does trained on really mean? Your words join a huge pile of data, and that pile trains the next A.I. There is no reliable way to make an A.I. forget something once it is baked in. The risk is not that it repeats your client list word for word. It is that a clever person with the right question can pull small pieces back out. You cannot fix this by deleting the chat later. You fix it by turning off training before you paste. Open settings. Find data controls. Turn off anything that says improve the model.",
  },
  {
    id: "07-postcard",
    kicker: "A handy way to think",
    title: "Treat every chat like a postcard",
    text:
      "Most big A.I. companies have safety teams, and a small number of chats get read by real people. The chance your exact chat is read is small. But no one will ever see this is not something the tool promises. So treat anything you paste into a free or paid A.I. tool like writing it on a postcard. The chance a stranger reads one postcard is small. The chance a postcard could be read is total. You would never write your bank password on a postcard.",
  },
  {
    id: "08-takeaway",
    kicker: "Where the data sits",
    title: "The version matters as much as the words",
    text:
      "One more thing. On free versions of most American A.I. tools, your data goes to American computers. G.D.P.R. controls that journey, and the protections only apply if your company has signed up to them. On a free tool, it has not. Most big tools now offer to keep data inside the E.U. on their work versions. So the takeaway from this module is one line: the version you use matters as much as what you type.",
  },
];
