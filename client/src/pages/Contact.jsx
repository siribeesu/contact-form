// src/pages/Contact.jsx
// Contact form page with full validation and submission

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';
import { submitContact } from '../services/contactService';
import Spinner from '../components/Spinner';

// ── Validation Schema ────────────────────────────────────────────────────────
const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-().]{7,20}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  subject: yup
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
    .required('Message is required'),
});

// ── Form Field Component ─────────────────────────────────────────────────────
const FormField = ({ label, id, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
    {error && (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

// ── Contact Info Items ───────────────────────────────────────────────────────
const contactInfo = [
  { icon: HiMail, label: 'Email', value: 'president@shecanfoundation.org', href: 'mailto:president@shecanfoundation.org', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { icon: HiPhone, label: 'Phone', value: '+91-8283841830', href: 'tel:+918283841830', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { icon: HiLocationMarker, label: 'Website', value: 'shecanfoundation.org', href: 'https://shecanfoundation.org', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
];

// ── Main Component ───────────────────────────────────────────────────────────
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), mode: 'onTouched' });

  const onSubmit = async (data) => {
    try {
      await submitContact(data);
      setSubmitted(true);
      reset();
      toast.success('🎉 Message submitted successfully!', { duration: 4000 });
      // Reset success state after 5 seconds to allow resubmission
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'Failed to submit. Please try again.';
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50 dark:bg-dark-900">
      <div className="container-custom">

        {/* Page Header */}
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h1 className="section-heading mb-4">
            Contact <span className="gradient-text">She Can Foundation</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Have a question, want to volunteer, or partner with She Can Foundation? We're a Govt. Registered NGO under the Indian Society Act, 1860. Reach out and we'll respond within 24–48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Contact Info ── */}
          <div className="space-y-4 animate-fade-in">
            {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
              <div key={label} className="card flex items-start gap-4 hover:shadow-glow transition-all duration-300">
                <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-gray-800 dark:text-gray-200 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                      {value}
                    </a>
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 text-center py-8">
              <span className="text-4xl mb-3 block">🌸</span>
              <p className="text-primary-700 dark:text-primary-300 font-semibold">She Can Foundation</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Govt. Reg. NGO · Indian Society Act, 1860</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Founded by <span className="text-primary-600 dark:text-primary-400 font-medium">Reeta Mishra</span></p>
              <a
                href="https://shecanfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                Visit Official Website ↗
              </a>
            </div>
          </div>

          {/* ── Right: Contact Form ── */}
          <div className="lg:col-span-2 animate-slide-up">
            <div className="card">

              {/* Success Banner */}
              {submitted && (
                <div className="mb-6 p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl flex items-center gap-3 animate-fade-in">
                  <span className="text-3xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300">Form Submitted Successfully!</p>
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      Thank you for reaching out. We'll get back to you within 24–48 hours.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                {/* Row: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Full Name" id="name" error={errors.name?.message}>
                    <input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                      {...register('name')}
                    />
                  </FormField>

                  <FormField label="Email Address" id="email" error={errors.email?.message}>
                    <input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                      {...register('email')}
                    />
                  </FormField>
                </div>

                {/* Row: Phone + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Phone Number" id="phone" error={errors.phone?.message}>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1 (234) 567-890"
                      className={`input-field ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                      {...register('phone')}
                    />
                  </FormField>

                  <FormField label="Subject" id="subject" error={errors.subject?.message}>
                    <input
                      id="subject"
                      type="text"
                      placeholder="How can we help?"
                      className={`input-field ${errors.subject ? 'border-red-400 focus:ring-red-400' : ''}`}
                      {...register('subject')}
                    />
                  </FormField>
                </div>

                {/* Message */}
                <FormField label="Message" id="message" error={errors.message?.message}>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Write your message here... (at least 20 characters)"
                    className={`input-field resize-none ${errors.message ? 'border-red-400 focus:ring-red-400' : ''}`}
                    {...register('message')}
                  />
                </FormField>

                {/* Submit */}
                <button
                  type="submit"
                  id="submit-contact"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
