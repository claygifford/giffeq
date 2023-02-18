import { Auth } from 'aws-amplify';
import router from 'next/router';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from '../hooks/use-effect-once';

type Action = {
  isBusy: boolean;
  errorMessage?: string;
  successMessage?: string;
};

type AuthValue = {
  user: any;
  createAccount: (account) => void;
  signIn: ({ username, password, rememberMe }) => void;
  signInAction: Action;
  forgotPassword: ({ email }) => void;
  forgotPasswordAction: Action;
  forgotPasswordSubmit: ({ email, code, newPassword }) => void;
  signUp: ({ username, password, rememberMe }) => void;
};

const AuthContext = createContext({} as AuthValue);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [signInAction, setSignInAction] = useState<Action>({ isBusy: false });
  const [forgotPasswordAction, setForgotPasswordAction] = useState<Action>({
    isBusy: false,
  });

  const signIn = useCallback(async ({ username, password, rememberMe }) => {
    try {
      setSignInAction({
        isBusy: true,
        errorMessage: undefined,
      });
      const user = await Auth.signIn(username, password);
      setUser(user);
      setSignInAction({
        isBusy: false,
        errorMessage: undefined,
      });
    } catch (error) {
      console.log('error signing in', error);
      setSignInAction({
        isBusy: false,
        errorMessage: error.message,
      });
    }
  }, []);

  const signUp = useCallback(
    async ({ username, password, email, rememberMe }) => {
      try {
        const { user } = await Auth.signUp({
          username,
          password,
          attributes: {
            email, // optional
          },
          autoSignIn: {
            // optional - enables auto sign in after user is confirmed
            enabled: true,
          },
        });
        console.log(user);
      } catch (error) {
        console.log('error signing up:', error);
      }
    },
    []
  );

  const createAccount = async (account) => {
    setUser('new name');

    try {
      const { username, password, email } = account;
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email, // optional
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true,
        },
      });
      setUser(user);
      console.log(user);
    } catch (error) {
      console.log('error signing up:', error);
    }
  };

  const forgotPassword = async (account) => {
    try {
      setForgotPasswordAction({
        isBusy: true,
        errorMessage: undefined,
        successMessage: undefined,
      });
      const { email } = account;
      await Auth.forgotPassword(email);
      setForgotPasswordAction({
        isBusy: false,
        errorMessage: undefined,
        successMessage: 'cool it worked',
      });
    } catch (error) {
      console.log('error forgot password', error);
      setForgotPasswordAction({
        isBusy: false,
        errorMessage: error.message,
      });
    }
  };

  const forgotPasswordSubmit = async (account) => {
    try {
      // setForgotPasswordAction({
      //   isBusy: true,
      //   errorMessage: undefined,
      //   successMessage: undefined,
      // });
      const { email, code, newPassword } = account;
      const stuff = await Auth.forgotPasswordSubmit(email, code, newPassword);
      //setUser(stuff);
      // setForgotPasswordAction({
      //   isBusy: false,
      //   errorMessage: undefined,
      //   successMessage: 'cool it worked',
      // });
    } catch (error) {
      console.log('error forgot password', error);
      setForgotPasswordAction({
        isBusy: false,
        errorMessage: error.message,
      });
    }
  };

  const initializeUser = async () => {
    try {
      const user = await Auth.currentUserInfo();
      setUser(user);
    } catch (error) {      
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    }
  };
  
  useEffectOnce(initializeUser);

  const value = {
    user,
    createAccount,
    signIn,
    signInAction,
    signUp,
    forgotPassword,
    forgotPasswordAction,
    forgotPasswordSubmit,
  } as AuthValue;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
