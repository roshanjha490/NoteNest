import { Inter } from "next/font/google";
import React from 'react'
import SessionWrapper from "../component/SessionWrapper";
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast';
import NavBar from "./components/NavBar";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Research Study",
    description: "",
};

const NotesLayout = async ({ children }) => {

    const session = await getServerSession()

    if (session && session.user) {
        return (
            <SessionWrapper>

                <NavBar>
                    {children}
                </NavBar>

                <Toaster position="top-center" />

            </SessionWrapper >
        )
    } else {
        redirect("/login")
    }
}

export default NotesLayout