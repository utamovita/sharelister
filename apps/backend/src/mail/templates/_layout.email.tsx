import { Body, Container, Head, Html, Preview } from '@react-email/components';
import * as React from 'react';
import { main, container } from './styles';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>{children}</Container>
      </Body>
    </Html>
  );
};
