import {defineField, defineType} from 'sanity'
import {VideoIcon} from '@sanity/icons'

export const webcamGrid = defineType({
  name: 'webcamGrid',
  title: 'Webcam Grid',
  type: 'object',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Live Webcams',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'trustMessage',
      title: 'Trust Message',
      type: 'text',
      rows: 2,
      description: 'Optional message displayed between heading and camera grid (e.g. transparency/peace of mind)',
    }),
    defineField({
      name: 'showGroupHeaders',
      title: 'Show Group Headers',
      type: 'boolean',
      description: 'Display "Indoor Play Areas" and "Outdoor Play Areas" headings',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Webcam Grid', subtitle: 'Live Camera Feeds'}
    },
  },
})
