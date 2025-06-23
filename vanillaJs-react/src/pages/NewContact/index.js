import React, { useRef } from 'react';
import { PageHeader } from '../../components/PageHeader';
import ContactForm from '../../components/ContactForm';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';
import ContactMapper from '../../services/mappers/ContactMapper';

export default function NewContact() {
  const contactFormRef = useRef(null);

  async function handleSubmit(contact) {
    try {
      await ContactsService.createContact(contact);

      contactFormRef.current.resetFields();

      toast({
        type: 'success',
        text: 'Contact created',
      });
    } catch {
      toast({
        type: 'danger',
        text: 'An error has occurred',
        duration: 7000,
      });
    }
  }

  return (
    <>
      <PageHeader title="New contact" />
      <ContactForm
        ref={contactFormRef}
        buttonLabel="Create"
        onSubmit={handleSubmit}
      />
    </>
  );
}
