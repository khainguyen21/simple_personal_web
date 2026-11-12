// Everything a visitor reads on the home page lives here.
// Facts come from the resume in public/ — keep the two in sync.

export type Preview = {
  /** Shown in the hover card. */
  title: string;
  description: string;
  /** Optional screenshot in public/previews/, e.g. "/previews/evc.jpg" (2:1 works best). */
  image?: string;
};

export type Entry = {
  role?: string;
  name: string;
  href?: string;
  preview?: Preview;
};

export const profile = {
  name: "Hong Khai Nguyen",
  school: {
    label: "Evergreen Valley College",
    href: "https://www.evc.edu/",
    preview: {
      title: "Evergreen Valley College",
      description: "Community college in San José, where I’m earning an A.S. for Transfer in Computer Science.",
      image: "/previews/evc.jpg",
    },
  },
  study: "Computer Science",
  description:
    "Computer science student in San Jose looking for a backend software engineering internship.",
};

export const work: Entry[] = [
  {
    role: "Vice President",
    name: "EVC CS Club",
    href: "https://www.instagram.com/evccsc/",
    preview: {
      title: "Vice President, EVC CS Club",
      description: "Evergreen Valley College's computer science club. Vice president since September 2026.",
    },
  },
  {
    role: "Java Programming Tutor",
    name: "Evergreen Valley College",
    href: "https://www.evc.edu/",
    preview: {
      title: "Java Programming Tutor",
      description: "Tutoring Java at Evergreen Valley College since September 2025.",
    },
  },
  {
    role: "Data Science Embedded Tutor",
    name: "Evergreen Valley College",
    href: "https://www.evc.edu/",
    preview: {
      title: "Data Science Embedded Tutor",
      description: "Embedded tutor for a data science course, January to May 2025.",
    },
  },
  {
    role: "Project Manager",
    name: "EVC CS Club",
    href: "https://www.instagram.com/evccsc/",
    preview: {
      title: "Project Manager, EVC CS Club",
      description: "Project manager for the club, January to May 2024.",
    },
  },
];

export const projects: Entry[] = [
  {
    name: "EVC Tutor Schedule",
    href: "https://evctutoring.com/",
    preview: {
      title: "EVC Tutor Schedule",
      description: "Students search by course to see which tutors are available right now.",
    },
  },
  {
    name: "OnTrack",
    href: "https://plume.hackmit.org/project/bkosr-lsgra-ltfcy-ekkrm",
    preview: {
      title: "OnTrack · HackMIT 2026",
      description:
        "A React Native app for a wearable that detects freezing of gait and shows a patient’s live state.",
    },
  },
  {
    name: "RoboJab",
    href: "https://devpost.com/software/robo-jab",
    preview: {
      title: "RoboJab · 2nd place, Best Physical AI Hack",
      description:
        "UC Berkeley AI Hackathon 2026. Phone video turned into a control policy for a humanoid robot.",
    },
  },
  {
    name: "Learnr",
    href: "https://devpost.com/software/learnr-x8bpqd",
    preview: {
      title: "Learnr · Cal Hacks 12.0",
      description: "An AI tutor. I built the voice feature: hear a lecture, interrupt to ask questions.",
    },
  },
];

// Order chosen by Khai: Resume, LinkedIn, X, Email, GitHub.
export const links = [
  { label: "Resume", href: "/hong-khai-nguyen-resume.pdf" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/khainguyen21/" },
  { label: "X", href: "https://x.com/khainguyen21k" },
  { label: "Email", href: "mailto:khainguyen2004@gmail.com" },
  { label: "GitHub", href: "https://github.com/khainguyen21" },
];
