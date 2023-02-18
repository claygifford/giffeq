import React from 'react';

import SignUpComponent from '../../components/auth/sign-up-component';
import PageComponent from '../../components/page-component';

export default function SignUp() {
  return (
    <PageComponent>
      <SignUpComponent></SignUpComponent>
    </PageComponent>
  );
}