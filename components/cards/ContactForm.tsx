// components/cards/ContactForm.tsx
// Visual-only contact form with disabled Coming Soon submit button.
// Used in the Contact section (Phase 5). All fields are focusable and readOnly —
// they feel like a real form, not a broken one. Only the submit button is disabled.
//
// Dark theme: Contact section is dark-themed — uses on-surface* tokens (not on-surface-light*).
// No form submission logic. No useState. No validation. Purely structural/visual.
// No border-radius — sharp corners per design system.

'use client';

export function ContactForm() {
  return (
    <>
      {/* Screen reader context — explains this form is not yet active */}
      <p id="contact-coming-soon" className="sr-only">
        Form submission is not yet active. Please use the email link above.
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        aria-label="Contact form - not yet active"
        noValidate
        className="flex flex-col gap-6 max-w-lg"
      >
        {/* Name field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-name"
            className="font-body text-sm text-on-surface-muted uppercase tracking-wider"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            readOnly
            placeholder="Your name"
            className="bg-transparent border border-on-surface-subtle/30 px-4 py-3 font-body text-on-surface placeholder:text-on-surface-subtle/40 focus:outline-none focus:border-on-surface/60 transition-colors"
          />
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-email"
            className="font-body text-sm text-on-surface-muted uppercase tracking-wider"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            readOnly
            placeholder="your@email.com"
            className="bg-transparent border border-on-surface-subtle/30 px-4 py-3 font-body text-on-surface placeholder:text-on-surface-subtle/40 focus:outline-none focus:border-on-surface/60 transition-colors"
          />
        </div>

        {/* Message field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-message"
            className="font-body text-sm text-on-surface-muted uppercase tracking-wider"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            readOnly
            placeholder="Tell us about your project"
            className="bg-transparent border border-on-surface-subtle/30 px-4 py-3 font-body text-on-surface placeholder:text-on-surface-subtle/40 focus:outline-none focus:border-on-surface/60 transition-colors resize-none"
          />
        </div>

        {/* Submit button — visually disabled, communicates "not connected yet" */}
        <button
          type="submit"
          disabled
          aria-disabled="true"
          aria-describedby="contact-coming-soon"
          className="font-display text-sm tracking-widest uppercase px-8 py-4 border border-on-surface/20 text-on-surface/30 cursor-not-allowed opacity-50"
        >
          Coming Soon
        </button>
      </form>
    </>
  );
}
