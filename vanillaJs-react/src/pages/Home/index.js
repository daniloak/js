import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Loader from '../../components/Loader';
import {
  Container,
  InputSearchContainer,
  Header,
  Card,
  ListHeader,
  ErrorContainer,
  EmptyListContainer,
  SearchNotFoundContainer,
} from './styles';
import { Link } from 'react-router-dom';
import formatPhone from '../../utils/formatPhone';
import ContactsService from '../../services/ContactsService';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import toast from '../../utils/toast';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted, setContactBeingDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().startsWith(searchTerm.toLocaleLowerCase())
    );
  }, [contacts, searchTerm]);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const contactsList = await ContactsService.listContacts(orderBy);
      setHasError(false);
      setContacts(contactsList);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  useEffect(() => {
    loadContacts();
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
    setContactBeingDeleted(null);
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

  return (
    <Container>
      <Loader isLoading={isLoading} />

      <Modal
        danger
        isLoading={isLoadingDelete}
        visible={isDeleteModalVisible}
        title={`Are you sure to delete ${contactBeingDeleted?.name}?`}
        confirmLabel="Delete"
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteContact}
      >
        This action can't be undone
      </Modal>

      {contacts.length > 0 && (
        <InputSearchContainer>
          <input
            value={searchTerm}
            type="text"
            placeholder="Search"
            onChange={handleChangeSearchTerm}
          />
        </InputSearchContainer>
      )}

      <Header
        $justifyContent={
          hasError
            ? 'flex-end'
            : contacts.length > 0
            ? 'space-between'
            : 'center'
        }
      >
        {!hasError && contacts.length > 0 && (
          <strong>
            {filteredContacts.length}
            {filteredContacts.length === 1 ? ' contato' : ' contatos'}
          </strong>
        )}
        <Link to="/new">New contact</Link>
      </Header>

      {hasError && (
        <ErrorContainer>
          <div className="details">
            <strong>An error has occured</strong>
            <Button type="button" onClick={handleTryAgain}>
              Try again
            </Button>
          </div>
        </ErrorContainer>
      )}

      {!hasError && (
        <>
          {contacts.length < 1 && !isLoading && (
            <EmptyListContainer>
              <p>
                You don't have any contact. Click in{' '}
                <strong>"New contact"</strong>
              </p>
            </EmptyListContainer>
          )}

          {contacts.length > 0 && filteredContacts.length < 1 && (
            <SearchNotFoundContainer>
              <strong>No contact found</strong>
            </SearchNotFoundContainer>
          )}

          {filteredContacts.length > 0 && (
            <ListHeader>
              <button type="button" onClick={handleToggleOrderBy}>
                <span>Name {orderBy}</span>
              </button>
            </ListHeader>
          )}
          {filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <div className="info">
                <div className="contact-name">
                  <strong>{contact.name}</strong>
                  {contact.category.name && (
                    <small>{contact.category.name}</small>
                  )}
                </div>
                <span>{contact.email}</span>
                <span>{formatPhone(contact.phone || '')}</span>
              </div>
              <div className="actions">
                <Link to={`/edit/${contact.id}`}>E</Link>
                <button
                  type="button"
                  onClick={() => handleDeleteContact(contact)}
                >
                  D
                </button>
              </div>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}
