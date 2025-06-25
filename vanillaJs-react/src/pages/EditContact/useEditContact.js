import { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';
import useSafeAsyncAction from '../../hooks/useSafeAsyncAction';

export default function useEditContact() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const history = useHistory();
  const safeAsyncAction = useSafeAsyncAction();

  const contactFormRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadContact() {
      try {
        const contact = await ContactsService.getContact(id, controller.signal);

        safeAsyncAction(() => {
          contactFormRef.current.setFieldValues(contact);
          setIsLoading(false);
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return; // Request was aborted, do nothing
        }

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

    return () => {
      controller.abort(); // Cancel the request if the component unmounts
    };
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

  return { isLoading, contactFormRef, handleSubmit };
}
