import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';
import useSafeAsyncAction from '../../hooks/useSafeAsyncAction';
import Presentation from './Presentation';

export default function Container() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const history = useHistory();
  const safeAsyncAction = useSafeAsyncAction();

  const contactFormRef = useRef(null);

  useEffect(() => {
    async function loadContact() {
      try {
        const contact = await ContactsService.getContact(id);

        safeAsyncAction(() => {
          contactFormRef.current.setFieldValues(contact);
          setIsLoading(false);
        });
      } catch (err) {
        safeAsyncAction(() => {
          history.push('/');
          toast({
            type: 'danger',
            text: 'Contact not found',
          });
        });
      }
    }

    loadContact();
  }, [id, history, safeAsyncAction]);

  async function handleSubmit(contact) {
    try {
      await ContactsService.updateContact(id, contact);

      toast({
        type: 'success',
        text: 'Contact updated',
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
    <Presentation
      isLoading={isLoading}
      contactFormRef={contactFormRef}
      onSubmit={handleSubmit}
    ></Presentation>
  );
}
