import {defineField, defineType} from 'sanity'
import {VideoIcon} from '@sanity/icons'

export const webcam = defineType({
  name: 'webcam',
  title: 'Webcam',
  type: 'document',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Camera Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cameraId',
      title: 'Camera ID',
      type: 'string',
      description: 'The IPCamLive camera alias (e.g. 604dbc7f006f8)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          {title: 'Indoor', value: 'indoor'},
          {title: 'Outdoor', value: 'outdoor'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within their group',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Group, then Sort Order',
      name: 'groupSortOrder',
      by: [
        {field: 'group', direction: 'asc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', group: 'group', enabled: 'enabled'},
    prepare({title, group, enabled}) {
      const emoji = group === 'indoor' ? '🏠' : '🌳'
      const status = enabled === false ? ' (disabled)' : ''
      return {
        title: `${emoji} ${title || 'Untitled'}${status}`,
        subtitle: group ? `${group.charAt(0).toUpperCase()}${group.slice(1)}` : '',
      }
    },
  },
})
