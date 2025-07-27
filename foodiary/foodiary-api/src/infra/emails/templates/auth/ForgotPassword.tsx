import { Column } from "@react-email/column";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import React from 'react';

import { TailwindConfig } from "@infra/emails/components/TailwindConfig";

interface IForgotPasswordProps {
  confirmationCode: string;
}

export default function ForgotPassword({confirmationCode}: IForgotPasswordProps) {
  return (
    <Html>
      <TailwindConfig>
        <Section>
          <Row >
            <Column className="font-sans text-center pt-10">
              <Heading as="h1" className="text-2xl leading-[0]">Recupere a sua conta</Heading>
              <Heading as="h2" className="font-normal text-base text-gray-600">
                Resete a sua senha para continuar usando o Foodiary
              </Heading>
            </Column>
          </Row>

          <Row>
            <Column className="text-center pt-4">
              <span className="bg-gray-200 inline-block px-8 py-4 text-3xl font-sans rounded-m font-bold tracking-[16px]">
                {confirmationCode}
              </span>
            </Column>
          </Row>

          <Row>
            <Column className="font-sans text-center pt-10">
              <Text className="text-sm text-gray-600">
                Se você não solicitou essa ação, ignore este e-mail.
              </Text>
            </Column>
          </Row>
        </Section>
      </TailwindConfig>
    </Html>
  );
}


ForgotPassword.PreviewProps = {
  confirmationCode: '123456',
}
