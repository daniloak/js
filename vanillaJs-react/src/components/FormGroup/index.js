import React from 'react';
import { Container } from './styles';
import Spinner from '../Spinner';

export default function FormGroup({
  children,
  error = null,
  isLoading = false,
}) {
  return (
    <Container>
      <div className="form-item">
        {children}
        {isLoading && (
          <div className="loader">
            <Spinner size={16} />
          </div>
        )}
      </div>
      {error && <small>{error}</small>}
    </Container>
  );
}
