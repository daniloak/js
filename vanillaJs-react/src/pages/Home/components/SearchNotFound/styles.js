import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[200]};
`;
