import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const webcamPreview = defineType({
  name: 'webcamPreview',
  title: 'Webcam Preview',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'passwordProtected',
      title: 'Password Protected',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'webcamUrl',
      title: 'Webcam URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Webcam Preview', subtitle: 'Webcam Section'}
    },
  },
})
