import React from 'react'
import { signOut } from 'next-auth/react'
import NoteEditor from './NoteEditor';
import { createFile } from '@/app/actions';
import { toast } from 'react-hot-toast';


export const metadata = {
    title: "Dashboard | Research Study",
    description: "",
};

const page = () => {

    return (
        <>
        </>
    );

}

export default page