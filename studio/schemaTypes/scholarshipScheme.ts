import {defineType, defineField} from 'sanity'

export const scholarshipScheme = defineType({
  name: 'scholarshipScheme',
  title: 'Scholarship Scheme',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Scheme Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authority',
      title: 'Awarding Authority',
      type: 'string',
      description: 'e.g. Directorate of Social Welfare, Govt of Goa / Samsung CSR',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Scheme Category',
      type: 'string',
      options: {
        list: [
          {title: 'Central Government', value: 'central'},
          {title: 'State Government', value: 'state'},
          {title: 'Institute / University', value: 'institute'},
          {title: 'Corporate / CSR / Private', value: 'corporate'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'officialDocumentUrl',
      title: 'Official Document / Rulebook URL',
      type: 'url',
      description: 'Direct link to official PDF, gazette notification, or portal page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'documentTitle',
      title: 'Document Title / Circular No.',
      type: 'string',
      description: 'e.g. Rulebook 2025-26, Clause 7(b)',
    }),
    defineField({
      name: 'summary',
      title: 'Brief Scheme Summary',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits Provided',
      type: 'string',
      description: 'e.g. Full tuition fee waiver, monthly maintenance stipend',
    }),
    defineField({
      name: 'stackingRule',
      title: 'Non-Stacking / Concurrent Award Rules',
      type: 'object',
      fields: [
        defineField({
          name: 'hasNonStackingRestriction',
          title: 'Has Non-Stacking Restriction?',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'exactClauseText',
          title: 'Verbatim Clause Text',
          type: 'text',
          rows: 4,
          description: 'The exact quote from the official PDF/rulebook',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'clauseReference',
          title: 'Clause / Section Reference',
          type: 'string',
          description: 'e.g. Rule 4.2(a), Section 7, Page 3',
        }),
        defineField({
          name: 'consequenceOfViolation',
          title: 'Consequence of Breach',
          type: 'string',
          description: 'e.g. Immediate disqualification, recovery of disbursed amount, blacklisting',
        }),
        defineField({
          name: 'allowedExceptions',
          title: 'Allowed Exceptions / Procedures',
          type: 'text',
          rows: 2,
          description: 'e.g. Prior written permission from competent authority, or choice within 15 days',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'authority',
    },
  },
})
