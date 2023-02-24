import { Auth } from 'aws-amplify';
import router from 'next/router';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from '../hooks/use-effect-once';
import LoadingComponent from '../ui/loading/loading-component';

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
  signOut: () => void;
};

const AuthContext = createContext({} as AuthValue);

const AuthProvider = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      router.push('/');
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
        setUser(user);
        router.push('/');
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

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(undefined);
      router.push('/about');
    } catch (error) {
      console.log('error sign out', error);
    }
  };

  const initializeUser = async () => {
    setIsLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch (error) {
       
    } finally {
      setIsLoading(false);
    }
  };

  useEffectOnce(initializeUser);

  useEffect(() => {
    if (isLoading) return;
    if (user) return;
    if (props.protected) {
      console.log('yes protected');
      router.push('/about');
    } else {
      console.log('not protected');
    }    
  }, [user, isLoading, props]);

  const value = {
    user,
    createAccount,
    signIn,
    signInAction,
    signUp,
    signOut,
    forgotPassword,
    forgotPasswordAction,
    forgotPasswordSubmit,
  } as AuthValue;

  if (isLoading || (props.protected && !user))
    return <LoadingComponent></LoadingComponent>;

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
