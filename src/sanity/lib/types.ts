export interface BlockBase {
  _key: string
  sectionId?: string
}

export interface HeroBlock extends BlockBase {
  _type: 'heroBlock'
  backgroundImage?: { asset: any; alt?: string }
  headline1?: string
  headline1Color?: 'light' | 'dark'
  headline2?: string
  headline2Color?: 'light' | 'dark'
}

export interface ProjectsBlock extends BlockBase {
  _type: 'projectsBlock'
  heading?: string
  projects?: {
    _id: string
    title: string
    description: string
    featureText: any[]
    image?: { asset: any; alt?: string }
    href?: string
    ctaLabel?: string
    reversed?: boolean
    styling?: { accentColor?: string; cardBackgroundColor?: string; cardTextColor?: string }
  }[]
}

export interface MediaCardRowBlock extends BlockBase {
  _type: 'mediaCardRowBlock'
  heading?: string
  featureText?: any[]
  title?: string
  description?: string
  image?: { asset: any; alt?: string }
  href?: string
  ctaLabel?: string
  reversed?: boolean
  styling?: { accentColor?: string; cardBackgroundColor?: string; cardTextColor?: string }
}

export interface ServicesBlock extends BlockBase {
  _type: 'servicesBlock'
  heading?: string
  items?: {
    _key: string
    title: string
    description: string
    href?: string
    ctaLabel?: string
    accentColor?: string
    mediaBackgroundColor?: string
    cardBackgroundColor?: string
    cardTextColor?: string
    titleColor?: string
  }[]
}

export interface ContactBlock extends BlockBase {
  _type: 'contactBlock'
  heading?: string
  subheading?: string
  subheadingAccent?: string
  body?: string
}

export type PageBlock = HeroBlock | ProjectsBlock | MediaCardRowBlock | ServicesBlock | ContactBlock
