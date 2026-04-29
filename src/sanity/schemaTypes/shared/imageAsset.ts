import { defineField, type SchemaTypeDefinition } from 'sanity'

// Cast bypasses the `sanity.imageAsset` type alias, which doesn't expose
// `fields` in its public types even though the Studio supports redefinition
// at runtime.
const imageAsset = {
  name: 'sanity.imageAsset',
  type: 'sanity.imageAsset',
  title: 'Image asset',
  fields: [
    defineField({
      name: 'altText',
      title: 'Alt Text (default)',
      type: 'string',
      description:
        'Describes the image for screen readers and search engines. Set this once per image — it will be used everywhere this image appears unless overridden.',
    }),
  ],
} as unknown as SchemaTypeDefinition

export default imageAsset
