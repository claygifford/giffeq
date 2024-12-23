import React, { useState } from "react";
import InputComponent from "../../lib/ui/input/input-component";
import ButtonComponent from "../../lib/ui/button/button-component";
import NoteIcon from "../../lib/ui/icons/note-icon";
import { useAuth } from "../../lib/context/auth-context";
import Link from "next/link";

const Forgot = (props: { handleSubmit; email; setEmail }) => {
  const { handleSubmit, email, setEmail } = props;
  return (
    <>
      <div>
        <div className="flex justify-center">
          <NoteIcon className="fill-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Password Reset
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <InputComponent
          id={"email-address"}
          name={"email"}
          type={"email"}
          label={"Email Address"}
          autoComplete={"email"}
          placeHolder={"Email Address"}
          required={true}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div>
          <ButtonComponent labelText="Send" type={"submit"}>
            Send
          </ButtonComponent>
        </div>
      </form>
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
    </>
  );
};

const Recover = (props: {
  handleSubmit;
  email;
  code;
  setCode;
  newPassword;
  setNewPassword;
}) => {
  const { handleSubmit, code, setCode, newPassword, setNewPassword } = props;
  return (
    <>
      <div>
        <div className="flex justify-center">
          <NoteIcon className="fill-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Password Reset
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <InputComponent
          id={"code"}
          name={"code"}
          type={"text"}
          label={"Verification Code"}
          autoComplete={"code"}
          placeHolder={"Verification Code"}
          required={true}
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <InputComponent
          id={"new-password"}
          name={"password"}
          type={"password"}
          label={"New Password"}
          autoComplete={"new-password"}
          placeHolder={"New Password"}
          required={true}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <div>
          <ButtonComponent labelText="Set new password" type={"submit"}>
            Set new password
          </ButtonComponent>
        </div>
      </form>
    </>
  );
};

const ForgotPasswordComponent = () => {
  const { forgotPassword, forgotPasswordSubmit } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mode, setMode] = useState("forgot");

  function forgotSubmit(event) {
    forgotPassword({ email });
    setMode("recover");
    event.preventDefault();
  }

  function recoverSubmit(event) {
    forgotPasswordSubmit({ email, code, newPassword });
    //go to login?
    event.preventDefault();
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-[400px] max-w-md space-y-8">
          {mode === "forgot" ? (
            <Forgot
              handleSubmit={forgotSubmit}
              email={email}
              setEmail={setEmail}
            />
          ) : (
            <Recover
              handleSubmit={recoverSubmit}
              email={email}
              code={code}
              setCode={setCode}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
