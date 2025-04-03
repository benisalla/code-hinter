
import { useAuth } from "./context/authStore";
import React, { PropsWithChildren } from "react";

export enum ROLES {
   prof = "prof",
   student = "student",
}

interface Props extends PropsWithChildren {
  to: ROLES;
  fallback?: JSX.Element | string;
}

export const Restricted: React.FunctionComponent<Props> = ({
  to,
  fallback,
  children,
}) => {
  const { user } = useAuth();

  if (
    to === user?.role 
  ) {
    return <>{children}</>;
  } else if (!fallback) {
    return <></>;
  }

  return <>{fallback}</>;
};