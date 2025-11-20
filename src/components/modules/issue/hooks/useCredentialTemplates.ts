'use client';
import type { CredentialTemplate } from '@/@types/templates';

export function useCredentialTemplates() {
  const templates: CredentialTemplate[] = [
    {
      id: 'university_degree',
      title: 'University Degree',
      description: 'Degree credential issued by a university.',
      vcType: 'UniversityDegreeCredential',
      fields: [
        {
          key: 'subject',
          label: 'Subject DID',
          type: 'did',
          required: true,
          placeholder: 'Wallet (G...) – we derive DID',
        },
        {
          key: 'degreeName',
          label: 'Degree Name',
          type: 'text',
          required: true,
          placeholder: 'Bachelor of Engineering',
        },
        {
          key: 'institution',
          label: 'Institution',
          type: 'text',
          required: true,
          placeholder: 'Example University',
        },
        { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
        { key: 'expirationDate', label: 'Expiration Date', type: 'date' },
      ],
    },
    {
      id: 'kyc',
      title: 'KYC',
      description: 'Know Your Customer credential for identity verification.',
      vcType: 'KYCCredential',
      fields: [
        {
          key: 'subject',
          label: 'Subject DID',
          type: 'did',
          required: true,
          placeholder: 'Wallet (G...) – we derive DID',
        },
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'country', label: 'Country', type: 'text', required: true },
        {
          key: 'documentType',
          label: 'Document Type',
          type: 'text',
          required: true,
          placeholder: 'Passport',
        },
        { key: 'documentNumber', label: 'Document Number', type: 'text', required: true },
        { key: 'issueDate', label: 'Verification Date', type: 'date', required: true },
        { key: 'expirationDate', label: 'Expiration Date', type: 'date' },
      ],
    },
    {
      id: 'membership',
      title: 'Membership',
      description: 'Membership or subscription credential.',
      vcType: 'MembershipCredential',
      fields: [
        {
          key: 'subject',
          label: 'Subject DID',
          type: 'did',
          required: true,
          placeholder: 'Wallet (G...) – we derive DID',
        },
        { key: 'organization', label: 'Organization', type: 'text', required: true },
        { key: 'level', label: 'Level', type: 'text', required: true, placeholder: 'Gold' },
        { key: 'issueDate', label: 'Start Date', type: 'date', required: true },
        { key: 'expirationDate', label: 'End Date', type: 'date' },
      ],
    },
    {
      id: 'employee_badge',
      title: 'Employee Badge',
      description: 'Employment credential for internal use.',
      vcType: 'EmployeeCredential',
      fields: [
        {
          key: 'subject',
          label: 'Subject DID',
          type: 'did',
          required: true,
          placeholder: 'Wallet (G...) – we derive DID',
        },
        { key: 'company', label: 'Company', type: 'text', required: true },
        { key: 'role', label: 'Role', type: 'text', required: true },
        { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
        { key: 'expirationDate', label: 'Expiration Date', type: 'date' },
      ],
    },
    {
      id: 'course_certificate',
      title: 'Course Certificate',
      description: 'Credential for course completion.',
      vcType: 'CourseCertificateCredential',
      fields: [
        {
          key: 'subject',
          label: 'Subject DID',
          type: 'did',
          required: true,
          placeholder: 'Wallet (G...) – we derive DID',
        },
        { key: 'courseName', label: 'Course Name', type: 'text', required: true },
        { key: 'provider', label: 'Provider', type: 'text', required: true },
        { key: 'issueDate', label: 'Completion Date', type: 'date', required: true },
        { key: 'expirationDate', label: 'Expiration Date', type: 'date' },
      ],
    },
  ];

  return { templates };
}
