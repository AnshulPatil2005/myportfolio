import {
  BiLogoGithub,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { BiEnvelope } from "react-icons/bi";
import { SiLeetcode } from "react-icons/si";

export const socialLinks = [
  {
    id: 1,
    name: "GitHub",
    url: "https://github.com/AnshulPatil2005",
    icon: BiLogoGithub,
    status: "social",
  },
  {
    id: 2,
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/anshul-patil-575006280/",
    icon: BiLogoLinkedinSquare,
    status: "social",
  },
  {
    id: 3,
    name: "LeetCode",
    url: `https://leetcode.com/u/${process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? "Anshulpatil2011"}`,
    icon: SiLeetcode,
    status: "social",
  },
  {
    id: 4,
    name: "Email",
    url: "mailto:anshulpatil1022@gmail.com",
    icon: BiEnvelope,
    status: "social",
  },
];
