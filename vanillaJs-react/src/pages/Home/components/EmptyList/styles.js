import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;

  p {
    color: ${({ theme }) => theme.colors.gray[200]};

    strong {
      color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;
