import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import { Container } from './styles';

export default function ErrorStatus({ onTryAgain }) {
  return (
    <Container>
      <div className="details">
        <strong>An error has occured</strong>
        <Button type="button" onClick={onTryAgain}>
          Try again
        </Button>
      </div>
    </Container>
  );
}

ErrorStatus.propTypes = {
  onTryAgain: PropTypes.func.isRequired,
};
