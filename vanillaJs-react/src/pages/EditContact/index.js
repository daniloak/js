import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import ContactForm from '../../components/ContactForm';
import Loader from '../../components/Loader';
import useEditContact from './useEditContact';

export default function EditContact() {
  const { isLoading, contactFormRef, handleSubmit } = useEditContact();

  return (
    <>
      <Loader isLoading={isLoading} />
      <PageHeader title="Edit contact" />
      <ContactForm
        ref={contactFormRef}
        buttonLabel="Save"
        onSubmit={handleSubmit}
      />
    </>
  );
}
