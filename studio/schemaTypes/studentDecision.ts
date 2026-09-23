import {defineType, defineField} from 'sanity'

export const studentDecision = defineType({
  name: 'studentDecision',
  title: 'Tracked Student Resolution',
  type: 'document',
  description: 'Recorded student choice resolving a stacking conflict between two scholarships',
  fields: [
    defineField({
      name: 'studentId',
      title: 'Student Identifier / Session Token',
      type: 'string',
      description: 'Unique student reference, e.g. student-001 or roll number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'retainedScheme',
      title: 'Retained Scheme (Chosen by Student)',
      type: 'reference',
      to: [{type: 'scholarshipScheme'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'surrenderedScheme',
      title: 'Surrendered / Rejected Scheme',
      type: 'reference',
      to: [{type: 'scholarshipScheme'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resolutionStatus',
      title: 'Resolution Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active (Scheme Retained, Conflict Resolved)', value: 'resolved'},
          {title: 'Pending Formal Surrender Letter', value: 'pending_formal_surrender'},
          {title: 'Appealed to Authority', value: 'appealed'},
        ],
      },
      initialValue: 'resolved',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resolvedAt',
      title: 'Date & Time of Resolution',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'decisionNotes',
      title: 'Decision Rationale & Formal Reference',
      type: 'text',
      rows: 3,
      description: 'e.g. Student submitted Form 4 to Directorate of Social Welfare relinquishing Scheme A.',
    }),
  ],
  preview: {
    select: {
      studentId: 'studentId',
      retainedTitle: 'retainedScheme.title',
      surrenderedTitle: 'surrenderedScheme.title',
      status: 'resolutionStatus',
    },
    prepare({studentId, retainedTitle, surrenderedTitle, status}) {
      return {
        title: `${studentId}: Kept ${retainedTitle || 'Unknown'}`,
        subtitle: `Surrendered: ${surrenderedTitle || 'Unknown'} (${status})`,
      }
    },
  },
})
