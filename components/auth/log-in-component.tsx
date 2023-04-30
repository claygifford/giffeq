import React, { useState } from 'react';
import Link from 'next/link';
import NoteIcon from '../../lib/ui/icons/note-icon';
import InputComponent from '../../lib/ui/input/input-component';
import ButtonComponent from '../../lib/ui/button/button-component';
import CheckboxInputComponent from '../../lib/ui/input/checkbox-input-component';
import { useAuth } from '../../lib/context/auth-context';
import ErrorMessageComponent from '../../lib/ui/messages/error-message-component';

export default function LogInComponent() {
  const { signIn, signInAction } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  function handleSubmit(event) {
    signIn({username, password, rememberMe});
    event.preventDefault();
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <NoteIcon className="fill-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <ErrorMessageComponent message={signInAction.errorMessage} />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <InputComponent
            id={'email-address'}
            name={'email'}
            type={'email'}
            label={'Email Address'}
            autoComplete={'email'}
            placeHolder={'Email Address'}
            required={true}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <InputComponent
            id={'password'}
            name={'password'}
            type={'password'}
            label={'Password'}
            autoComplete={'password'}
            placeHolder={'Password'}
            required={true}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="flex items-center justify-between">
            <CheckboxInputComponent
              id={'remember-me'}
              name={'remember-me'}
              label={'Remember me'}
              value={rememberMe}
              onChange={(event) => setRememberMe(event.target.value)}
            />
            <div className="text-sm">
              <Link href="/about/recovery">
                <a className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </Link>
            </div>
          </div>
          <div>
            <ButtonComponent type={'submit'}>Sign In</ButtonComponent>
          </div>
          <p className="mt-2 text-center text-lg text-gray-600">
            Don&apos;t have account?
            <Link href="/about/signup">
              <a className="font-medium text-blue-600 hover:text-blue-500 pl-4">
                Sign up for free
              </a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
