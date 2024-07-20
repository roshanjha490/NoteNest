"use client"

import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut } from 'next-auth/react'

import { FaChevronRight } from "react-icons/fa";
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";

import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { FaUser } from "react-icons/fa";

import { get_all_files_n_directories } from '@/app/actions';

const NavBar = ({ children }) => {

    const [navwidth, setnavwidth] = useState('240')
    const [isDragging, setIsDragging] = useState(false);
    const resizerRef = useRef(null);

    const [filesSystems, setfilesSystems] = useState([])

    const handleMouseDown = (e) => {
        setIsDragging(true);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const newWidth = e.clientX;
        if (newWidth > 150 && newWidth < 500) { // Set min and max constraints
            setnavwidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {

        const fetchFilesDirectories = async () => {
            const response = await get_all_files_n_directories()

            if (response.success) {
                setfilesSystems(response.response)
            } else {
                toast.error(result.message)
            }

            console.log(response.response)
        }

        fetchFilesDirectories()

    }, [])


    return (
        <>
            <div className="w-full h-screen flex">
                <div style={{ width: navwidth + 'px', backgroundColor: '#2d2d2d', position: 'relative' }} className="h-full flex overflow-hidden">

                    <div className="w-[100%] h-full flex flex-col">

                        <div className="w-full h-[10%] flex justify-center items-center border-b-2 border-blue-500">
                            <div className="grid grid-cols-6">
                                <div className="col-span-1 flex justify-center items-center">
                                    <Image src='/img/logo.png' width={30} height={30} alt="Picture of the author"></Image>
                                </div>
                                <div className="col-span-5 flex justify-start items-center mx-[5px]">
                                    <h1 className='text-white font-bold font-mono'>Research Study</h1>
                                </div>
                            </div>
                        </div>


                        <div className="w-full flex-grow px-[5px] py-[10px]">
                            <div className="w-full h-full">


                                <div className="main-folder w-full h-[25px] flex my-[2px] px-[0px] hover:bg-sky-500 relative">
                                    <ContextMenu>
                                        <div className="min-w-[25px] h-full flex justify-center items-center">
                                            <FaChevronRight className='text-white font-bold' />
                                        </div>

                                        <div className="flex-grow h-full truncate">
                                            <ContextMenuTrigger>
                                                <h4 className='text-white font-bold font-mono text-base truncate cursor-pointer'>
                                                    Research Study
                                                </h4>
                                            </ContextMenuTrigger>
                                        </div>

                                        <div className="min-w-[80px] h-full">

                                            <div className="p-[5px] h-full flex justify-center items-center float-right hover:bg-sky-700">
                                                <FaCloudUploadAlt className='text-white' />
                                            </div>

                                            <div className="p-[5px] h-full flex justify-center items-center float-right hover:bg-sky-700">
                                                <FaFolderPlus className='text-white' />
                                            </div>

                                            <div className="p-[5px] h-full flex justify-center items-center float-right hover:bg-sky-700">
                                                <FaFileCirclePlus className='text-white' />
                                            </div>

                                        </div>

                                        <ContextMenuContent>
                                            <ContextMenuItem>Profile</ContextMenuItem>
                                            <ContextMenuItem>Billing</ContextMenuItem>
                                            <ContextMenuItem>Team</ContextMenuItem>
                                            <ContextMenuItem>Subscription</ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>

                                </div>


                                {/* <div className="main-folder w-full h-[25px] flex my-[2px] px-[10px] hover:bg-sky-500">

                                    <div className="w-[25px] h-full flex justify-center items-center">
                                        <FaChevronRight className='text-white font-bold' />
                                    </div>

                                    <div className="flex-grow h-full truncate">
                                        <h4 className='text-white font-bold font-mono text-base truncate'>
                                            Research Study
                                        </h4>
                                    </div>

                                </div>


                                <div className="main-folder w-full h-[25px] flex my-[2px] px-[20px] hover:bg-sky-500">

                                    <div className="w-[25px] h-full flex justify-center items-center">
                                        <FaChevronRight className='text-white font-bold' />
                                    </div>

                                    <div className="flex-grow h-full truncate">
                                        <h4 className='text-white font-bold font-mono text-base truncate'>
                                            Research Study
                                        </h4>
                                    </div>

                                </div>


                                <div className="main-folder w-full h-[25px] flex my-[2px] px-[0px] hover:bg-sky-500">

                                    <div className="w-[25px] h-full flex justify-center items-center">
                                        <FaChevronRight className='text-white font-bold' />
                                    </div>

                                    <div className="flex-grow h-full truncate">
                                        <h4 className='text-white font-bold font-mono text-base truncate'>
                                            Research Study
                                        </h4>
                                    </div>

                                </div> */}

                            </div>
                        </div>

                    </div>

                    <div
                        ref={resizerRef}
                        onMouseDown={handleMouseDown}
                        style={{
                            width: '5px',
                            cursor: 'col-resize',
                            backgroundColor: isDragging ? '#5183f5' : '#000',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            right: 0
                        }}
                    />
                </div>
                <div className="flex-grow h-full">
                    <div className="w-full h-full flex flex-col">
                        <div style={{ backgroundColor: '#e5e5e5' }} className="w-full h-[10%] flex">

                            <div style={{ cursor: 'pointer' }} onClick={() => setnavwidth(prevWidth => (prevWidth > '0' ? '0' : '240'))} className="w-[80px] h-full flex justify-center items-center">
                                <GiHamburgerMenu size={25} />
                            </div>

                            <div className="flex-grow h-full">

                                <div className="w-auto h-full px-[60px] float-right flex justify-center items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                <FaUser className="mr-2 h-4 w-4" /> My Profile
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => signOut()}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                            </div>

                        </div>
                        <div style={{ backgroundColor: '#f5f5f5' }} className="w-full flex-grow">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar