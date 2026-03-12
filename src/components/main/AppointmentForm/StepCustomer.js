import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useLanguage } from '@/context/LanguageContext';

export default function StepCustomer({ initialValues, validationSchema, onSubmit }) {
  const { t } = useLanguage();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="grid grid-cols-2 gap-4 w-full">
        <div className="flex-column col-span-2">
          <label className="text-xs text-gold-dark" htmlFor="name">{t('form.label.name')}</label>
          <Field
            className="flex w-full border-2 border-gold-light rounded-md h-12 outline-none px-4"
            name="name"
            id="name"
          />
          <span className="flex text-red-600 text-xs">
            <ErrorMessage name="name" />
          </span>
        </div>
        <div className="flex-column col-span-2">
          <label className="text-xs text-gold-dark" htmlFor="email">{t('form.label.email')}</label>
          <Field
            className="flex w-full border-2 border-gold-light rounded-md h-12 outline-none px-4"
            name="email"
            id="email"
            type="email"
          />
          <span className="flex text-red-600 text-xs">
            <ErrorMessage name="email" />
          </span>
        </div>
        <div className="flex-column col-span-2">
          <label className="text-xs text-gold-dark" htmlFor="phone">{t('form.label.phone')}</label>
          <Field
            className="flex w-full border-2 border-gold-light rounded-md h-12 outline-none px-4"
            name="phone"
            id="phone"
          />
          <span className="flex text-red-600 text-xs">
            <ErrorMessage name="phone" />
          </span>
        </div>
        <div className="flex-column col-span-2">
          <label className="text-xs text-gold-dark" htmlFor="message">{t('form.label.reason')}</label>
          <Field
            className="flex w-full border-2 border-gold-light rounded-md h-24 outline-none px-4 py-2"
            name="message"
            id="message"
            component="textarea"
          />
          <span className="flex text-red-600 text-xs">
            <ErrorMessage name="message" />
          </span>
        </div>
        <div className="flex col-span-2">
          <button
            className="h-12 mt-2 flex justify-center items-center text-lg text-white bg-gold font-semibold rounded-full w-full"
            type="submit"
          >
            <span className="mr-2" aria-hidden="true">&rarr;</span>
            {t('form.button.next')}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
