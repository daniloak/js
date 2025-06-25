import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';

export default function useHome() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted, setContactBeingDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const deferredSearchTerm = useDeferredValue(searchTerm); //Result will be updated after the render cycle (deffered), searchTerm is the urgent value
  //We can also use useTransition to make the input value not block the UI while the search is being processed

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().startsWith(searchTerm.toLocaleLowerCase())
    );
  }, [contacts, deferredSearchTerm]);

  const loadContacts = useCallback(
    async (signal) => {
      try {
        setIsLoading(true);
        const contactsList = await ContactsService.listContacts(
          orderBy,
          signal
        );
        setHasError(false);
        setContacts(contactsList);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setHasError(true);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [orderBy]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadContacts(controller.signal);

    return () => {
      controller.abort(); // Cancel the request if the component unmounts
    };
  }, [loadContacts]);

  function handleToggleOrderBy() {
    setOrderBy((prevState) => (prevState === 'asc' ? 'desc' : 'asc'));
  }

  function handleChangeSearchTerm(event) {
    setSearchTerm(event.target.value);
  }

  function handleTryAgain() {
    loadContacts();
  }

  function handleDeleteContact(contact) {
    setContactBeingDeleted(contact);
    setIsDeleteModalVisible(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalVisible(false);
  }

  async function handleConfirmDeleteContact() {
    try {
      setIsLoadingDelete(true);
      await ContactsService.deleteContact(contactBeingDeleted.id);

      setContacts((prevState) =>
        prevState.filter((contact) => contact.id !== contactBeingDeleted.id)
      );

      handleCloseDeleteModal();
      toast({
        type: 'success',
        text: 'Contact deleted',
      });
    } catch {
      toast({
        type: 'danger',
        text: 'An error occurred',
      });
    } finally {
      setIsLoadingDelete(false);
    }
  }

  return {
    contacts,
    orderBy,
    searchTerm,
    isLoading,
    hasError,
    isDeleteModalVisible,
    contactBeingDeleted,
    isLoadingDelete,
    filteredContacts,
    handleToggleOrderBy,
    handleChangeSearchTerm,
    handleTryAgain,
    handleDeleteContact,
    handleCloseDeleteModal,
    handleConfirmDeleteContact,
  };
}
