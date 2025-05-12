import {defineField, defineType} from 'sanity'

export const PhoneType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'UserId',
      type: 'string',
      description: 'Unique identifier for the user',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone_number',
      title: 'Phone Number',
      type: 'string',
      description: 'User phone number',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'userId',
      subtitle: 'phone_number',
    },
  },
})
