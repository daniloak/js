import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from '../../components/PageHeader';
import ContactForm from '../../components/ContactForm';

import Loader from '../../components/Loader';

export default function Presentation({
  isLoading,
  contactName,
  contactFormRef,
  onSubmit,
}) {
  return (
    <>
      <Loader isLoading={isLoading} />
      <PageHeader title="Edit contact" />
      <ContactForm
        ref={contactFormRef}
        buttonLabel="Save"
        onSubmit={onSubmit}
      />
    </>
  );
}

Presentation.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  contactName: PropTypes.string,
  contactFormRef: PropTypes.shape().isRequired,
  onSubmit: PropTypes.func.isRequired,
};
