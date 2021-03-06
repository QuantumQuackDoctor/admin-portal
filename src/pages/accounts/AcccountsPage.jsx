import Header from "../../shared/header/Header";
import React from "react";
import { WidgetContainer } from "../../shared/widget/Widget";
import LoginForm from "./login-form/LoginForm";
import RegisterForm from "./register-form/RegisterForm";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/contex-provider/ServiceProvider";
import UserWidget from "./user-widget/UserWidget";
import ForgotPassword from "./forgot-password/ForgotPassword";

const AccountsPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const authService = useAuth();
  useEffect(() => {
    let unsubscribe = authService.subscribe((authStatus) => {
      setAuthenticated(authStatus);
    });
    return () => {
      unsubscribe();
    };
  }, [authService, authenticated, setAuthenticated]);

  return (
    <Header>
      <WidgetContainer>
        <LoginForm />
        <RegisterForm authenticated={authenticated} />
        <UserWidget authenticated={authenticated} />
        <ForgotPassword authenticated={authenticated} />
      </WidgetContainer>
    </Header>
  );
};

export default AccountsPage;
