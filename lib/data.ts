import { ProfileType, JobType, ProjectType, PostType, HeroeType } from "@/types";

export const profile: ProfileType = {
  _id: "anshul-patil",
  fullName: "Anshul Patil",
  headline: "Full-Stack Developer building reliable web applications",
  profileImage: {
    image: "",
    lqip: "",
    alt: "Anshul Patil",
  },
  shortBio:
    "I build reliable, maintainable web applications with a strong focus on clean architecture, performance, and product quality.",
  email: "anshulpatil1022@gmail.com",
  fullBio: [
    "I'm a full-stack developer passionate about building production-grade web applications that are reliable, maintainable, and scalable.",
    "My core focus areas include backend API architecture, React frontend systems with clear interaction design, and reliable delivery workflows with cloud infrastructure and observability.",
    "I enjoy the intersection of clean engineering and product quality — writing code that not only works today but remains easy to understand and modify as requirements evolve.",
  ],
  location: "India",
  resumeURL: "/AnshulPatil.pdf",
};

export const jobs: JobType[] = [];

export const projects: ProjectType[] = [
  {
    _id: "portfolio-website",
    name: "Portfolio Website",
    slug: "portfolio-website",
    tagline:
      "Personal portfolio built with Next.js, TypeScript, and Tailwind CSS",
    projectUrl: "",
    repository: "https://github.com/AnshulPatil2005",
    logo: "",
    coverImage: {
      image: "",
      alt: null,
      lqip: "",
    },
    description:
      "A clean, performant personal portfolio showcasing my work and experience. Built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.",
  },
];

export const posts: PostType[] = [];

export const heroes: HeroeType[] = [];
