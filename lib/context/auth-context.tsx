import { Auth } from "aws-amplify";
import router from "next/router";
import React, {
  useMemo,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useEffectOnce } from "../hooks/use-effect-once";
import LoadingComponent from "../ui/loading/loading-component";
import { PageMode, useLayout } from "./layout-context";
import { createNextClient } from "../clients/next";
import { getCookie } from "../cookies/cookies";
import { User } from "../types/user";
import { Action } from "../types/action";
import { useMusic } from "./music-context";

type AuthValue = {
  user: User;
  signIn: ({ username, password, rememberMe }) => void;
  signInAction: Action;
  clearSignInAction: () => void;
  forgotPassword: ({ email }) => void;
  forgotPasswordAction: Action;
  forgotPasswordSubmit: ({ email, code, newPassword }) => void;
  signUp: ({ username, password, rememberMe, email }) => void;
  signUpAction: Action;
  signOut: () => void;
};

const AuthContext = createContext({} as AuthValue);

const AuthProvider = (props) => {
  const { setConnector } = useMusic();

  const { initializeLayout, changePageMode } = useLayout();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>(null);
  const [signInAction, setSignInAction] = useState<Action>({ isBusy: false });
  const [signUpAction, setSignUpAction] = useState<Action>({ isBusy: false });
  const [forgotPasswordAction, setForgotPasswordAction] = useState<Action>({
    isBusy: false,
  });
  const client = createNextClient();

  const signIn = useCallback(
    async ({ username, password }) => {
      try {
        setSignInAction({
          isBusy: true,
          errorMessage: undefined,
        });
        const user = await client.post<User>("signin", { username, password });
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        changePageMode(PageMode.Playlist);
        setSignInAction({
          isBusy: false,
          errorMessage: undefined,
        });
      } catch (error) {
        const item = await error.json();
        setSignInAction({
          isBusy: false,
          errorMessage: item.message,
        });
      }
    },
    [changePageMode, client],
  );

  const clearSignInAction = useCallback(() => {
    setSignInAction({
      isBusy: false,
      errorMessage: undefined,
    });
  }, []);

  const signUp = useCallback(
    async ({ username, password, email }) => {
      try {
        setSignUpAction({
          isBusy: true,
          errorMessage: undefined,
        });

        const user = await client.post<User>("signup", {
          username,
          password,
          email,
        });
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        changePageMode(PageMode.Playlist);
        setSignUpAction({
          isBusy: false,
          errorMessage: undefined,
        });
      } catch (error) {
        const item = await error.json();
        setSignUpAction({
          isBusy: false,
          errorMessage: item.message,
        });
      }
    },
    [changePageMode, client],
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
        successMessage: "cool it worked",
      });
    } catch (error) {
      const item = await error.json();
      setForgotPasswordAction({
        isBusy: false,
        errorMessage: item.message,
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
      const item = await error.json();
      setForgotPasswordAction({
        isBusy: false,
        errorMessage: item.message,
      });
    }
  };

  const signOut = useCallback(async () => {
    try {
      await client.get<any>("signout");
      localStorage.removeItem("user");
      setUser(undefined);
      router.push("/about");
    } catch (error) {
      console.log("error sign out", error);
    }
  }, [client]);

  const getUser = useCallback(async () => {
    try {
      return await client.get<User>("user");
    } catch (error) {
      console.log("error get user", error);
    }
  }, [client]);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      const cookie = getCookie("token");
      if (!cookie) return;
      const user = await getUser();
      if (user.connectors) {
        const { spotify } = user.connectors;
        setConnector(spotify);
      }
      setUser(user);
      await initializeLayout();
    } catch (exception) {
      console.log(`error ${exception}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffectOnce(initializeApp);

  useEffect(() => {
    if (isLoading) return;
    if (user) return;
    if (props.protected) {
      router.push("/about");
    }
  }, [user, isLoading, props]);

  const value = useMemo(
    () => ({
      user,
      signIn,
      signInAction,
      clearSignInAction,
      signUp,
      signUpAction,
      signOut,
      forgotPassword,
      forgotPasswordAction,
      forgotPasswordSubmit,
    }),
    [
      forgotPasswordAction,
      signIn,
      signInAction,
      clearSignInAction,
      signOut,
      signUp,
      signUpAction,
      user,
    ],
  );

  if (isLoading || (props.protected && !user))
    return <LoadingComponent></LoadingComponent>;

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
