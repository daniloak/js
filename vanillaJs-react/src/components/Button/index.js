import React from 'react';

import PropTypes from 'prop-types';
import { StyledButton } from './styled';
import Spinner from '../Spinner';

export default function Button({
  type = 'button',
  disabled = false,
  isLoading = false,
  danger = false,
  onClick,
  children,
}) {
  return (
    <StyledButton
      type={type}
      disabled={disabled || isLoading}
      $danger={danger}
      onClick={onClick}
    >
      {!isLoading && children}
      {isLoading && <Spinner size={16} />}
    </StyledButton>
  );
}
