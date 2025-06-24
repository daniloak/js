import React from 'react';
import { Container } from './styles';

export default function EmptyList() {
  return (
    <Container>
      <p>
        You don't have any contact. Click in <strong>"New contact"</strong>
      </p>
    </Container>
  );
}
