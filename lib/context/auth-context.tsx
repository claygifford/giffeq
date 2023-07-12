import { Auth } from 'aws-amplify';
import router from 'next/router';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from '../hooks/use-effect-once';
import LoadingComponent from '../ui/loading/loading-component';
import { PageMode, useLayout } from './layout-context';
import { createNextClient } from '../clients/next';

type Action = {
  isBusy: boolean;
  errorMessage?: string;
  successMessage?: string;
};

type User = {
  username: string;
}
type AuthValue = {
  user: User;
  signIn: ({ username, password, rememberMe }) => void;
  signInAction: Action;
  forgotPassword: ({ email }) => void;
  forgotPasswordAction: Action;
  forgotPasswordSubmit: ({ email, code, newPassword }) => void;
  signUp: ({ username, password, rememberMe, email }) => void;
  signUpAction: Action;
  signOut: () => void;
};

const AuthContext = createContext({} as AuthValue);

const AuthProvider = (props) => {
  const { changePageMode } = useLayout();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>(null);
  const [signInAction, setSignInAction] = useState<Action>({ isBusy: false });
  const [signUpAction, setSignUpAction] = useState<Action>({ isBusy: false });
  const [forgotPasswordAction, setForgotPasswordAction] = useState<Action>({
    isBusy: false,
  });
  const client = createNextClient();

  const signIn = useCallback(async ({ username, password, rememberMe }) => {
    try {
      setSignInAction({
        isBusy: true,
        errorMessage: undefined,
      });      
      const user = await client.post<User>('signin', {username, password});
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      await router.push('/');
      setSignInAction({
        isBusy: false,
        errorMessage: undefined,
      });
    } catch (error) {
      setSignInAction({
        isBusy: false,
        errorMessage: error.message,
      });
    }
  }, [client]);

  const signUp = useCallback(
    async ({ username, password, email, rememberMe }) => {
      try {
        setSignUpAction({
          isBusy: true,
          errorMessage: undefined,
        });

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
              // const user = await client.post<User>('signin', {
              //   username,
              //   password,
              // });
        localStorage.setItem('user', JSON.stringify(user));
        setUser({username: user.getUsername()});
        await router.push('/');
        setSignUpAction({
          isBusy: false,
          errorMessage: undefined,
        });
      } catch (error) {
        setSignUpAction({
          isBusy: false,
          errorMessage: error.message,
        });
      }
    },
    []
  );

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
      setForgotPasswordAction({
        isBusy: true,
        errorMessage: undefined,
        successMessage: undefined,
      });
      const { email, code, newPassword } = account;
      const success = await Auth.forgotPasswordSubmit(email, code, newPassword);
      setForgotPasswordAction({
        isBusy: false,
        errorMessage: undefined,
        successMessage: `${success} cool it worked`,
      });
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
      await client.get<any>('signout');
      localStorage.removeItem('user');
      setUser(undefined);
      router.push('/about');
    } catch (error) {
      console.log('error sign out', error);
    }
  };

  const initializeUser = async () => {
    setIsLoading(true);
    try {
      const item = localStorage.getItem('user');
      if (!item) return;
      const user = JSON.parse(item);
      setUser(user);

      changePageMode(PageMode.Playlist);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }

    try {
      const token = await client.get<{refresh: boolean}>('refresh');
      if (!token.refresh)
        router.push('/about/login');
    } catch (error) {
      console.log('error sign out', error);
    }
  };

  useEffectOnce(initializeUser);

  useEffect(() => {
    if (isLoading) return;
    if (user) return;
    if (props.protected) {
      router.push('/about');
    } else {
    }
  }, [user, isLoading, props]);

  const value = {
    user,
    signIn,
    signInAction,
    signUp,
    signUpAction,
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
