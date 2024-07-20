import { Inter } from "next/font/google";
import Link from "next/link";
import React from "react";
import SessionWrapper from "../component/SessionWrapper";
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Algo App",
    description: "",
};

const AdminLayout = async ({ children }) => {

    const session = await getServerSession()

    if (session && session.user) {
        redirect("/dashboard")
    } else {
        return (
            <>
                <SessionWrapper>
                    <div className="relative w-full h-full min-h-screen">
                        <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-5 navbar-expand-lg">
                            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                                <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                                    <Link href='/'>
                                        <p className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase">
                                            Research Study
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </nav>
                        <div className="z-[0] absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
                            style={{
                                backgroundImage: "url('/img/register_bg_2.png')"
                            }}
                        ></div>
                        <main className="h-auto">
                            <section>
                                {children}
                            </section>
                        </main>
                        <footer className="z-[99] w-full h-[50px] flex justify-center items-center">
                            <div>
                                <p className="text-white">Created with ❣️ by Roshan Jha</p>
                            </div>
                        </footer>
                    </div>
                    <Toaster position="top-center"/>
                </SessionWrapper>
            </>
        )

    }
}

export default AdminLayout