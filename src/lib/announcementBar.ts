interface AnnouncementBarContent {
  label?: string
  message?: string
  linkText?: string
  href?: string
}

export const ANNOUNCEMENT_BAR_STORAGE_KEY = 'jtbi:announcement-bar:dismissed-id'

export const getAnnouncementBarId = ({
  label,
  message,
  linkText,
  href,
}: AnnouncementBarContent) => {
  const seed = [label, message, linkText, href].filter(Boolean).join('|')

  let hash = 0
  for (const character of seed) {
    hash += character.charCodeAt(0)
  }
  return hash.toString(36)
}
