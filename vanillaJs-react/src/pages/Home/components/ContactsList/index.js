import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListHeader } from './styles';
import { Link } from 'react-router-dom';
import formatPhone from '../../../../utils/formatPhone';

export default function ContactsList({
  filteredContacts,
  orderBy,
  onToggleOrderBy,
  onDeleteContact,
}) {
  return (
    <>
      {filteredContacts.length > 0 && (
        <ListHeader>
          <button type="button" onClick={onToggleOrderBy}>
            <span>Name {orderBy}</span>
          </button>
        </ListHeader>
      )}
      {filteredContacts.map((contact) => (
        <Card key={contact.id}>
          <div className="info">
            <div className="contact-name">
              <strong>{contact.name}</strong>
              {contact.category.name && <small>{contact.category.name}</small>}
            </div>
            <span>{contact.email}</span>
            <span>{formatPhone(contact.phone || '')}</span>
          </div>
          <div className="actions">
            <Link to={`/edit/${contact.id}`}>E</Link>
            <button type="button" onClick={() => onDeleteContact(contact)}>
              D
            </button>
          </div>
        </Card>
      ))}
    </>
  );
}

ContactsList.propTypes = {
  filteredContacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      phone: PropTypes.string,
      category: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
  orderBy: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onToggleOrderBy: PropTypes.func.isRequired,
  onDeleteContact: PropTypes.func.isRequired,
};
