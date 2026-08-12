export interface ProjectStat {
  label: string;
  prefix: string;
  val: number;
  suffix: string;
  isFloat: boolean;
}

export interface ProjectImages {
  gallery1: string;
  gallery2: string;
  gallery3: string;
}

export interface Project {
  id: string;
  color: string;
  title: string;
  year: string;
  category: string;
  desc: string;
  challenge: string;
  solution: string;
  stats: ProjectStat[];
  images: ProjectImages;
}