"use client"

import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut } from 'next-auth/react'
import { FaTimes } from "react-icons/fa";

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

import { FaSync } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

import { get_all_files_n_directories } from '@/app/actions';
import FileExplorer from './FileExplorer';
import { check_git_changes } from '@/app/actions';
import { performSyncChanges } from '@/app/actions';

import Rename from './Rename';
import NoteEditor from './NoteEditor';
import { IoMdCheckmark } from "react-icons/io";


import hotkeys from 'hotkeys-js';

const page = ({ children }) => {

    const [navwidth, setnavwidth] = useState('240')
    const [isDragging, setIsDragging] = useState(false);
    const resizerRef = useRef(null);

    const [checkChange, setcheckChange] = useState(true)

    const [filesSystem, setfilesSystem] = useState([])

    const [openFiles, setopenFiles] = useState([])

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


    const fetchFilesDirectories = async () => {
        const response = await get_all_files_n_directories();

        if (response.success) {
            const newFilesSystem = response.response;

            if (openFiles.length > 0) {

                // Extract all file paths from filesSystem
                const extractFilePaths = (nodes) => {
                    let paths = [];
                    nodes.forEach(node => {
                        if (node.isDirectory) {
                            paths = paths.concat(extractFilePaths(node.children || []));
                        } else {
                            paths.push(node.path);
                        }
                    });
                    return paths;
                };

                // Call extractFilePaths with the root directory objects
                const filePathsInFilesSystem = extractFilePaths(newFilesSystem);

                // // Filter openFiles to remove entries that no longer exist in filesSystem
                const updatedOpenFiles = openFiles.filter(file => filePathsInFilesSystem.includes(file.filepath));

                // Ensure at least one file has isopen set to true
                const openFileExists = updatedOpenFiles.some(file => file.isopen);

                if (!openFileExists && updatedOpenFiles.length > 0) {
                    updatedOpenFiles[0].isopen = true; // Set the first file to open if none are open
                }

                setopenFiles(updatedOpenFiles);
            }

            setfilesSystem(newFilesSystem);
        } else {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        fetchFilesDirectories();
    }, []);


    const openFileInEditor = async (item) => {
        setopenFiles((prevOpenFiles) => {
            // Create a new array with the previous items
            let updatedOpenFiles = prevOpenFiles.map(file => ({
                ...file,
                isopen: false  // Set isopen to false for all previous items
            }));

            // Check if the item already exists in the array
            const itemExists = updatedOpenFiles.some(file => file.id === item.id);

            if (!itemExists) {
                // If the item does not exist, add the new item
                updatedOpenFiles.push(item);
            } else {
                // If the item already exists, set it to open
                updatedOpenFiles = updatedOpenFiles.map(file =>
                    file.id === item.id ? { ...file, isopen: true } : file
                );
            }

            // Return the updated array
            return updatedOpenFiles;
        });
    }

    const selectFile = (selectedFile) => {
        setopenFiles(openFiles.map(file => ({
            ...file,
            isopen: file === selectedFile
        })));
    };

    const removeFile = (fileToRemove) => {

        const updatedFiles = openFiles.filter(file => file !== fileToRemove);

        // If the removed file was open, set the first file to be open
        if (fileToRemove.isopen && updatedFiles.length > 0) {
            updatedFiles[0].isopen = true;
        }

        // Set all other files' isopen to false
        const finalFiles = updatedFiles.map(file => ({
            ...file,
            isopen: file.isopen || updatedFiles[0].isopen === file
        }));

        setopenFiles(finalFiles);
    };

    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const formattedHours = hours % 12 || 12; // Convert to 12-hour format
            const amPm = hours >= 12 ? "PM" : "AM";
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Pad minutes with leading zero
            const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
            setCurrentTime(`${formattedHours}:${formattedMinutes} ${amPm} on ${formattedDate}`);
        };

        updateDateTime(); // Update initially
        const intervalId = setInterval(updateDateTime, 60000); // Update every minute

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);


    const [sync, setsync] = useState(null)

    const fetchStatus = async () => {
        const response = await check_git_changes()

        setsync(response)

        console.log(response)
    }

    useEffect(() => {
        const check_interval = setInterval(fetchStatus, 5000)

        return () => clearInterval(check_interval)
    }, [])


    const syncChanges = async () => {
        setsync(null)

        const response = await performSyncChanges()

        if (response) {
            setsync(false)
        }
    }


    hotkeys('ctrl+s', function (event, handler) {
        // Prevent the default refresh event under WINDOWS system
        event.preventDefault()
    });


    return (
        <>
            <div className="w-screen h-screen flex">
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


                        <div className="w-full flex-grow px-[5px] py-[10px] overflow-y-scroll file_list">
                            <div className="w-full min-h-full">

                                {filesSystem.length > 0 && (<>
                                    <FileExplorer pr={0} isexpanded={true} filesSystem={filesSystem} onUpdate={fetchFilesDirectories} openFile={(item) => openFileInEditor(item)} />
                                </>)}

                                {filesSystem.length < 1 && (<>
                                    <p>loading....</p>
                                </>)}

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

                <div style={{ width: `calc(100% - ${navwidth}px)` }} className="h-full">
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

                        {
                            openFiles.length > 0 && (<>
                                <div style={{ backgroundColor: '#e5e5e5c7' }} className="w-full h-[5%]">
                                    <div className="w-full h-full">

                                        {
                                            openFiles.map((openFile, index) => (
                                                <>

                                                    {
                                                        openFile.isopen ? (
                                                            <div key={index} style={{ backgroundColor: '#f5f5f5' }} className="min-w-[200px] h-full float-left border-r-2 border-white">
                                                                <div className="w-full h-full grid grid-cols-12">
                                                                    <div onClick={() => selectFile(openFile)} className="h-full col-span-10 px-[20px] flex justify-start items-center cursor-pointer">
                                                                        <small className='font-semibold'>
                                                                            {openFile.filename}
                                                                        </small>
                                                                    </div>
                                                                    <div onClick={() => removeFile(openFile)} className="hover:bg-[#e5e5e5c7] h-full col-span-2 flex justify-center items-center cursor-pointer">
                                                                        <small><FaTimes className='font-thin text-black' /></small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className="min-w-[200px] h-full float-left border-r-2 border-white">
                                                                <div className="w-full h-full grid grid-cols-12">
                                                                    <div onClick={() => selectFile(openFile)} className="h-full col-span-10 px-[20px] flex justify-start items-center cursor-pointer">
                                                                        <small className='font-semibold'>
                                                                            {openFile.filename}
                                                                        </small>
                                                                    </div>
                                                                    <div onClick={() => removeFile(openFile)} className="hover:bg-[#e5e5e5c7] h-full col-span-2 flex justify-center items-center cursor-pointer">
                                                                        <small><FaTimes className='font-thin text-black' /></small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                </>
                                            ))
                                        }

                                    </div>
                                </div>


                                <div style={{ backgroundColor: '#f5f5f5' }} className="w-full h-[80%]">

                                    {
                                        openFiles.map((openedFile, index) => (<>
                                            {openedFile.isopen && (<>
                                                <NoteEditor fileItem={openedFile}></NoteEditor>
                                            </>)}
                                        </>))
                                    }

                                </div>


                                <div style={{ backgroundColor: '#e5e5e5' }} className="w-full h-[5%]">
                                    <div className="w-full h-full flex justify-end items-center">
                                        <div className="w-auto h-full">

                                            <div className="w-auto h-full flex justify-center items-center float-left px-[10px]">
                                                <small>{currentTime}</small>
                                            </div>

                                            {
                                                sync != null ? (<>
                                                    {
                                                        sync ? (<>
                                                            <div onClick={() => syncChanges()} className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                                <FaSync />
                                                            </div>
                                                        </>) : (<>
                                                            <div className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                                <IoMdCheckmark />
                                                            </div>
                                                        </>)
                                                    }
                                                </>) : (<>
                                                    <div className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                        <small className=''> Loading ... </small>
                                                    </div>
                                                </>)
                                            }

                                            <div className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                <IoMdSettings className='text-xl' />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </>)
                        }


                        {
                            openFiles.length < 1 && (<>
                                <div style={{ backgroundColor: '#f5f5f5' }} className="w-full h-[85%]">
                                </div>

                                <div style={{ backgroundColor: '#e5e5e5' }} className="w-full h-[5%]">
                                    <div className="w-full h-full flex justify-end items-center">
                                        <div className="w-auto h-full">

                                            <div className="w-auto h-full flex justify-center items-center float-left px-[10px]">
                                                <small>{currentTime}</small>
                                            </div>

                                            {
                                                sync != null ? (<>
                                                    {
                                                        sync ? (<>
                                                            <div onClick={() => syncChanges()} className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                                <FaSync />
                                                            </div>
                                                        </>) : (<>
                                                            <div className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                                <IoMdCheckmark />
                                                            </div>
                                                        </>)
                                                    }
                                                </>) : (<>
                                                    <div className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                        <small className=''> Loading ... </small>
                                                    </div>
                                                </>)
                                            }

                                            <div className="w-auto h-full flex justify-center items-center float-left px-[10px] hover:bg-[#00000021] cursor-pointer">
                                                <IoMdSettings className='text-xl' />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </>)
                        }


                    </div>
                </div>
            </div >


        </>
    )
}

export default page