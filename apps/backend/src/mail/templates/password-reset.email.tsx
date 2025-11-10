import { Button, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './_layout.email';
import { btnContainer, button, link, paragraph } from './styles';

export interface PasswordResetEmailProps {
  resetLink: string;
  preview: string;
  greeting: string;
  line1: string;
  button: string;
  line2: string;
  line3: string;
  salutation: string;
}

export const PasswordResetEmail = ({
  resetLink,
  preview,
  greeting,
  line1,
  button: buttonText,
  line2,
  line3,
  salutation,
}: PasswordResetEmailProps) => (
  <EmailLayout previewText={preview}>
    <Text style={paragraph}>{greeting}</Text>
    <Text style={paragraph}>{line1}</Text>
    <Section style={btnContainer}>
      <Button style={button} href={resetLink}>
        {buttonText}
      </Button>
    </Section>
    <Text style={paragraph}>
      {line2}
      <br />
      <a href={resetLink} style={link}>
        {resetLink}
      </a>
    </Text>
    <Text style={paragraph}>{line3}</Text>
    <Text style={paragraph} dangerouslySetInnerHTML={{ __html: salutation }} />
  </EmailLayout>
);
