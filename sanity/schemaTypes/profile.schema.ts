import {defineField, defineType} from 'sanity'

export const ProfileType = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    // Basic Information
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
      description: 'Minimum age 18 required',
      validation: (Rule) =>
        Rule.required().custom((date) => {
          const today = new Date()
          const birthDate = new Date(date!)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()

          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }

          return age >= 18 ? true : 'Must be at least 18 years old'
        }),
    }),

    // Location & Dating Preferences
    defineField({
      name: 'postcode',
      title: 'Postcode',
      type: 'string',
      description: 'I date 10 miles around this postcode',
      validation: (Rule) => Rule.required().min(3).max(10),
    }),
    defineField({
      name: 'datingPurpose',
      title: 'I am dating for...',
      type: 'string',
      options: {
        list: [
          {title: 'For fun', value: 'fun'},
          {title: 'For a Serious Relationship', value: 'serious'},
          {title: 'For a Husband', value: 'marriage'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // Gallery
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.max(6).min(1).required(),
      description: 'Upload up to 6 images',
    }),

    // About Sections
    defineField({
      name: 'aboutMe',
      title: 'About Me',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(1000),
    }),
    defineField({
      name: 'aboutYou',
      title: 'About You',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(1000),
    }),

    // Physical Attributes
    defineField({
      name: 'height',
      title: 'My Height',
      type: 'object',
      fields: [
        defineField({
          name: 'feet',
          title: 'Feet',
          type: 'number',
          validation: (Rule) => Rule.required().min(3).max(8),
        }),
        defineField({
          name: 'inches',
          title: 'Inches',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(11),
        }),
      ],
    }),
    defineField({
      name: 'weight',
      title: 'My Weight',
      type: 'object',
      fields: [
        defineField({
          name: 'value',
          title: 'Weight',
          type: 'number',
          validation: (Rule) => Rule.required().min(50).max(500),
        }),
        defineField({
          name: 'unit',
          title: 'Unit',
          type: 'string',
          options: {
            list: [
              {title: 'Pounds (lbs)', value: 'lbs'},
              {title: 'Kilograms (kg)', value: 'kg'},
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // Background Information
    defineField({
      name: 'education',
      title: 'Education',
      type: 'string',
      options: {
        list: [
          {title: 'Doctorate', value: 'doctorate'},
          {title: 'Masters', value: 'masters'},
          {title: 'Bachelors', value: 'bachelors'},
          {title: 'Higher National Diploma', value: 'hnd'},
          {title: 'College', value: 'college'},
          {title: 'Leaver', value: 'leaver'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'work',
      title: 'Work',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'zodiac',
      title: 'Zodiac Sign',
      type: 'string',
      options: {
        list: [
          {title: 'Aries', value: 'aries'},
          {title: 'Taurus', value: 'taurus'},
          {title: 'Gemini', value: 'gemini'},
          {title: 'Cancer', value: 'cancer'},
          {title: 'Leo', value: 'leo'},
          {title: 'Virgo', value: 'virgo'},
          {title: 'Libra', value: 'libra'},
          {title: 'Scorpio', value: 'scorpio'},
          {title: 'Sagittarius', value: 'sagittarius'},
          {title: 'Capricorn', value: 'capricorn'},
          {title: 'Aquarius', value: 'aquarius'},
          {title: 'Pisces', value: 'pisces'},
        ],
      },
    }),

    // Lifestyle Choices
    defineField({
      name: 'poisonsOfChoice',
      title: 'Poisons of Choice',
      type: 'object',
      fields: [
        defineField({
          name: 'substances',
          title: 'Substances',
          type: 'string',
          options: {
            list: [
              {title: 'Smoker', value: 'smoker'},
              {title: 'Drinker', value: 'drinker'},
              {title: 'Both', value: 'both'},
              {title: 'Other stuff', value: 'other_stuff'},
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'frequency',
          title: 'Frequency',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Lightly', value: 'lightly'},
              {title: 'Medium', value: 'medium'},
              {title: 'Heavily', value: 'heavily'},
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // Interests
    defineField({
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.min(1).max(20),
    }),

    // Personality Choices
    defineField({
      name: 'personalityChoices',
      title: 'Personality Choices - Pick One from Each Pair',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'choice',
              title: 'Your Choice',
              type: 'string',
              options: {
                list: [
                  {title: 'Option A', value: 'optionA'},
                  {title: 'Option B', value: 'optionB'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'category',
              subtitle: 'choice',
            },
            prepare(selection) {
              const {title, subtitle} = selection
              return {
                title: title || 'Personality Choice',
                subtitle: subtitle === 'optionA' ? 'Option A' : 'Option B',
              }
            },
          },
        },
      ],
      initialValue: [
        {category: 'Too Fat vs. Too Short', choice: null},
        {category: 'Hates Pets vs. Loves Pets Too Much', choice: null},
        {category: 'No Sense of Humor vs. Laughs at Everything', choice: null},
        {category: 'Talks Only About Themselves vs. Never Shares Anything Personal', choice: null},
        {category: 'Average looking and loyal vs. Good looking but disloyal', choice: null},
        {category: 'Addicted to Social Media vs. Has No Online Presence', choice: null},
        {category: 'Always Wants to Stay Home vs. Never Wants to Stay Home', choice: null},
        {category: 'Terrible Taste in Music vs. Judges Your Taste in Music', choice: null},
        {category: 'Mommy Issues vs. Daddy Issues', choice: null},
        {category: 'No Ambition vs. Workaholic', choice: null},
        {
          category: 'Believes in Every Conspiracy Theory vs. Dismisses Everything as "Fake News"',
          choice: null,
        },
        {category: 'Know-It-All vs. Knows-Nothing', choice: null},
        {category: 'Spends Too Much Money vs. Excessively Frugal', choice: null},
        {
          category:
            'Smart, highly motivated, and poor vs. Not smart, highly unmotivated, but well-off',
          choice: null,
        },
        {
          category: 'Rich but very unethical and immoral vs. Poor but very ethical and moral',
          choice: null,
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Preferences & Deal Breakers
    defineField({
      name: 'dontShowMe',
      title: "Don't Show Me",
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.max(3),
      description: 'Maximum 3 entries',
    }),
    defineField({
      name: 'dealBreakers',
      title: 'Deal Breakers',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.max(3),
      description: 'Maximum 3 entries',
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      hidden: true,
    }),
  ],

  // Preview configuration
  preview: {
    select: {
      title: 'firstName',
      subtitle: 'lastName',
      media: 'gallery.0',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: `${title} ${subtitle}`,
        media: media,
      }
    },
  },
})
