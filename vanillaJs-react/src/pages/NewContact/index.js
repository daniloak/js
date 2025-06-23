import React, { useRef } from 'react';
import { PageHeader } from '../../components/PageHeader';
import ContactForm from '../../components/ContactForm';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';

export default function NewContact() {
  const contactFormRef = useRef(null);

  async function handleSubmit(formData) {
    try {
      const contact = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category_id: formData.category_id,
      };
      await ContactsService.createContact(contact);
      console.log('asdas');

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
