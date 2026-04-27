import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _type: 'reference'
    _ref: string
  }
  alt?: string
}

export interface BlockBase {
  _key: string
  sectionId?: string
}

export interface HeroBlock extends BlockBase {
  _type: 'heroBlock'
  hidden?: boolean
  backgroundImage?: SanityImage
  carouselImages?: SanityImage[]
  headline1?: string
  headline1Color?: 'light' | 'dark'
  headline2?: string
  headline2Color?: 'light' | 'dark'
}

export interface ProjectsBlock extends BlockBase {
  _type: 'projectsBlock'
  hidden?: boolean
  heading?: string
  projects?: {
    _id: string
    title: string
    slug?: { current: string }
    description: string
    featureText: PortableTextBlock[]
    cardImage?: SanityImage
    ctaLabel?: string
    reversed?: boolean
    styling?: { accentColor?: string; cardBackgroundColor?: string; cardTextColor?: string }
  }[]
}

export interface MediaCardRowBlock extends BlockBase {
  _type: 'mediaCardRowBlock'
  hidden?: boolean
  heading?: string
  featureText?: PortableTextBlock[]
  title?: string
  description?: string
  image?: SanityImage
  href?: string
  ctaLabel?: string
  reversed?: boolean
  styling?: { accentColor?: string; cardBackgroundColor?: string; cardTextColor?: string }
}

export interface ServicesBlock extends BlockBase {
  _type: 'servicesBlock'
  hidden?: boolean
  heading?: string
  items?: {
    _id: string
    title: string
    description: string
    image?: SanityImage
    href?: string
    ctaLabel?: string
    styling?: {
      accentColor?: string
      mediaBackgroundColor?: string
      cardBackgroundColor?: string
      cardTextColor?: string
      titleColor?: string
    }
  }[]
}

export interface ContactBlock extends BlockBase {
  _type: 'contactBlock'
  hidden?: boolean
  heading?: string
  subheading?: string
  subheadingAccent?: string
  body?: string
}

export type PageBlock = HeroBlock | ProjectsBlock | MediaCardRowBlock | ServicesBlock | ContactBlock
