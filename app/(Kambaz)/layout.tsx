"use client";
import Session from "./Account/Session";
import { ReactNode, useEffect } from "react";
import "./styles.css"
import KambazNavigation from "./Navigation";
import store from "./store";
import { Provider, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div className="d-flex" id="wd-kambaz">
          <KambazNavigation />
          <div className="wd-main-content-offset p-3 flex-fill ">
            {children}
          </div>
        </div>
      </Session>
    </Provider>

  );

}
