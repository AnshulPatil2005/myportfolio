export interface TableValueProps {
  caption?: string;
  table?: {
    rows?: { _key: string; cells: string[] }[];
  };
}

export interface QuizValueProps {
  _key: string;
  question: string;
  answer: string;
}

export type ProfileType = {
  _id: string;
  fullName: string;
  headline: string;
  profileImage: {
    image: string;
    lqip: string;
    alt: string;
  };
  shortBio: string;
  email: string;
  fullBio: string[];
  location: string;
  resumeURL: string;
};

export type JobType = {
  _id: string;
  name: string;
  jobTitle: string;
  logo?: string;
  url: string;
  description: string;
  bullets?: string[];
  startDate: string;
  endDate: string;
};

export type ProjectType = {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  projectUrl: string;
  repository: string;
  logo: string;
  coverImage: {
    image: string;
    alt: string | null;
    lqip: string;
  };
  description: string;
};

export type PostType = {
  _id: string;
  _createdAt: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  description: string;
  canonicalLink?: string;
  date?: string;
  coverImage: {
    image: string;
    lqip: string;
    alt: string | null;
  };
  tags: string[];
  author: {
    name: string;
    photo: {
      image: string;
      alt: string;
    };
    twitterUrl: string;
  };
  body: string;
  featured: boolean;
  isPublished: boolean;
};

export type ResearchProjectType = {
  _id: string;
  title: string;
  status: "Ongoing" | "Completed";
  shortDescription: string;
  fullDescription: string[];
  tags: string[];
  links?: { label: string; url: string }[];
};

export type HeroeType = {
  _id: string;
  _createdAt: string;
  name: string;
  url: string;
  met: boolean;
};
