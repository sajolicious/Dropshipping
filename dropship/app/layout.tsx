"use client"
import React from "react";

import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux"; // Import Provider from react-redux
import store from "@/store/store"; // Import your Redux store


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
    
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
