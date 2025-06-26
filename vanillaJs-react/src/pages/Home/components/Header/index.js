import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';
import { Link } from 'react-router-dom';

export default function Header({
  hasError,
  qtyOfContacts,
  qtyOfFilteredContacts,
}) {
  const aligment = hasError
    ? 'flex-end'
    : qtyOfContacts > 0
    ? 'space-between'
    : 'center';

  return (
    <Container $justifyContent={aligment}>
      {!hasError && qtyOfContacts > 0 && (
        <strong>
          {qtyOfFilteredContacts}
          {qtyOfFilteredContacts === 1 ? ' contato' : ' contatos'}
        </strong>
      )}
      <Link to="/new">New contact</Link>
    </Container>
  );
}

Header.propTypes = {
  hasError: PropTypes.bool.isRequired,
  qtyOfContacts: PropTypes.number.isRequired,
  qtyOfFilteredContacts: PropTypes.number.isRequired,
};
