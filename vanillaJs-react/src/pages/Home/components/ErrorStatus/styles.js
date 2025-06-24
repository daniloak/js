import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  .details {
    display: flex;
    flex-direction: column;
    align-items: center;

    strong {
      display: block;
      font-size: 22px;
      color: ${({ theme }) => theme.colors.danger.main};
    }

    button {
      margin-top: 16px;
    }
  }
`;
