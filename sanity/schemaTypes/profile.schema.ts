import {defineField, defineType} from 'sanity'

export const ProfileType = defineType({
  name: 'profile',
  title: 'Profiles',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(2).max(50).error('Name must be between 2 and 50 characters'),
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          {title: 'Male', value: 'male'},
          {title: 'Female', value: 'female'},
          {title: 'Non-binary', value: 'nonbinary'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required().error('Please select a gender'),
    }),
    defineField({
      name: 'birthday',
      title: 'Date of Birth',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).error('Location must be at least 2 characters'),
    }),
    defineField({
      name: 'lookingFor',
      title: 'Looking For',
      type: 'string',
      options: {
        list: [
          {title: 'Relationship', value: 'relationship'},
          {title: 'Friendship', value: 'friendship'},
          {title: 'Casual', value: 'casual'},
          {title: 'Not sure yet', value: 'unsure'},
        ],
      },
      validation: (Rule) => Rule.required().error("Please select what you're looking for"),
    }),
    defineField({
      name: 'relationshipType',
      title: 'Relationship Type',
      type: 'string',
      options: {
        list: [
          {title: 'Monogamous', value: 'monogamous'},
          {title: 'Non-monogamous', value: 'nonmonogamous'},
          {title: 'Open to either', value: 'either'},
        ],
      },
      validation: (Rule) => Rule.required().error('Please select a relationship type'),
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) =>
        Rule.required().min(1).max(6).error('Please upload between 1 and 6 photos'),
    }),
    defineField({
      name: 'aboutMe',
      title: 'About Me',
      type: 'text',
      validation: (Rule) =>
        Rule.required().min(10).max(500).error('About me must be between 10 and 500 characters'),
    }),
    defineField({
      name: 'interestedIn',
      title: 'Interested In',
      type: 'string',
      options: {
        list: [
          {title: 'Men', value: 'men'},
          {title: 'Women', value: 'women'},
          {title: 'Everyone', value: 'everyone'},
        ],
      },
      validation: (Rule) => Rule.required().error("Please select who you're interested in"),
    }),
    defineField({
      name: 'ageRange',
      title: 'Age Range',
      type: 'string',
      validation: (Rule) => Rule.required().error('Please select an age range'),
    }),
    defineField({
      name: 'smoking',
      title: 'Smoking',
      type: 'string',
      options: {
        list: [
          {title: 'Never', value: 'never'},
          {title: 'Socially', value: 'socially'},
          {title: 'Regularly', value: 'regularly'},
        ],
      },
      validation: (Rule) => Rule.required().error('Please select your smoking preference'),
    }),
    defineField({
      name: 'drinking',
      title: 'Drinking',
      type: 'string',
      options: {
        list: [
          {title: 'Never', value: 'never'},
          {title: 'Socially', value: 'socially'},
          {title: 'Regularly', value: 'regularly'},
        ],
      },
      validation: (Rule) => Rule.required().error('Please select your drinking preference'),
    }),
    defineField({
      name: 'cannabis',
      title: 'Cannabis',
      type: 'string',
      options: {
        list: [
          {title: 'Never', value: 'never'},
          {title: 'Socially', value: 'socially'},
          {title: 'Regularly', value: 'regularly'},
        ],
      },
      validation: (Rule) => Rule.required().error('Please select your cannabis preference'),
    }),
    defineField({
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (Rule) =>
        Rule.required().min(1).max(8).error('Please select between 1 and 8 interests'),
    }),
    defineField({
      name: 'lookingForKids',
      title: 'Looking for Kids',
      type: 'string',
      options: {
        list: [
          {title: 'Want kids', value: 'want'},
          {title: "Don't want kids", value: 'dont-want'},
          {title: 'Open to kids', value: 'open'},
          {title: 'Have kids already', value: 'have'},
        ],
      },
      validation: (Rule) => Rule.required().error('Please select your preference about kids'),
    }),
    defineField({
      name: 'vaccinationStatus',
      title: 'Vaccination Status',
      type: 'string',
      options: {
        list: [
          {title: 'Vaccinated', value: 'vaccinated'},
          {title: 'Not vaccinated', value: 'not-vaccinated'},
          {title: 'Prefer not to say', value: 'prefer-not-to-say'},
        ],
      },
      validation: (Rule) => Rule.required().error('Please select your vaccination status'),
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      hidden: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      media: 'photos.0',
    },
  },
})
