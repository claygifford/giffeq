import React, { useState } from 'react';
import Link from 'next/link';
import NoteIcon from '../../lib/ui/icons/note-icon';
import ButtonComponent from '../../lib/ui/button/button-component';
import InputComponent from '../../lib/ui/input/input-component';
import { useAuth } from '../../lib/context/auth-context';
import ErrorMessageComponent from '../../lib/ui/messages/error-message-component';
import BusyIcon from '../../lib/ui/icons/busy-icon';

export default function SignUpComponent() {
  const { signUp, signUpAction } = useAuth();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(event) {
    signUp({ username: email, password, rememberMe, email });
    event.preventDefault();
  }

  return (
    <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] space-y-8">
        <div>
          <div className="flex justify-center">
            <NoteIcon className="fill-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign up with your email address
          </h2>
        </div>
        <ErrorMessageComponent message={signUpAction.errorMessage} />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <InputComponent
            id={'email-address'}
            name={'email'}
            type={'email'}
            label={"What's your email?"}
            autoComplete={'email'}
            placeHolder={'Enter your email.'}
            required={true}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <InputComponent
            id={'confirm-email-address'}
            name={'confirm-email'}
            type={'email'}
            label={'Confirm your email'}
            autoComplete={'password'}
            placeHolder={'Enter your email again.'}
            required={true}
            value={confirmEmail}
            onChange={(event) => setConfirmEmail(event.target.value)}
          />
          <InputComponent
            id={'password'}
            name={'password'}
            type={'password'}
            label={'Create a password'}
            autoComplete={'password'}
            placeHolder={'Create a password.'}
            required={true}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div>
            <ButtonComponent type={'submit'} disabled={signUpAction.isBusy}>
              {signUpAction.isBusy && <BusyIcon />}{' '}
              {signUpAction.isBusy ? 'Signing Up...' : 'Sign up'}
            </ButtonComponent>
          </div>
          <p className="mt-2 text-center text-lg text-gray-600">
            Already have an account?
            <Link
              legacyBehavior
              href="/about/login"
              className="font-medium text-blue-600 hover:text-blue-500 pl-4"
            >
              <a className="font-medium text-blue-600 hover:text-blue-500 pl-4">
                Log in
              </a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
