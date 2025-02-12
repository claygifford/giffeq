import React, { useState } from "react";
import Link from "next/link";
import InputComponent from "../../lib/ui/input/input-component";
import ButtonComponent from "../../lib/ui/button/button-component";
import CheckboxInputComponent from "../../lib/ui/input/checkbox-input-component";
import { useAuth } from "../../lib/context/auth-context";
import ErrorMessageComponent from "../../lib/ui/messages/error-message-component";
import BusyIcon from "../../lib/ui/icons/busy-icon";
import NotesComponent from "../notes/notes-component";
import LazyDogComponent from "../dogs/lazy-dog-component";
import styles from './login-in.module.css';

export default function LogInComponent() {
  const { signIn, signInAction } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  function handleSubmit(event) {
    signIn({ username, password, rememberMe });
    event.preventDefault();
  }

  return (
    <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={styles.LoginIn}>
        <div className={styles.SignInContainer}>
          <NotesComponent></NotesComponent>
          <LazyDogComponent></LazyDogComponent>
          <h2 className="pt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <ErrorMessageComponent message={signInAction.errorMessage} />
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              <Link legacyBehavior href="/about/recovery">
                <a className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </Link>
            </div>
          </div>
          <div>
            <ButtonComponent
              labelText="Sign In"
              type={'submit'}
              disabled={signInAction.isBusy}
            >
              {signInAction.isBusy && <BusyIcon />}{' '}
              {signInAction.isBusy ? 'Signing In...' : 'Sign In'}
            </ButtonComponent>
          </div>
          <p className="mt-2 text-center text-lg text-gray-600">
            Don&apos;t have account?
            <Link legacyBehavior href="/about/signup">
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
