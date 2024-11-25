"use client"
import React from 'react'
import FileExplorer from './FileExplorer'

import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { MdOutlineNoteAlt } from "react-icons/md";

import { useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Rename from './Rename';
import Delete from './Delete';
import CreateFile from './CreateFile';
import CreateFolder from './CreateFolder';

const FileItem = ({ pr, fileSystem, index, toggleExpand, expanded, onUpdate, openFile }) => {

    const [renameModalIndex, setrenameModalIndex] = useState(null);
    const [isRenameModalOpen, setisRenameModalOpen] = useState(false);

    const openRenameModal = (id) => {
        setisRenameModalOpen(true);
        setrenameModalIndex(id);
        document.body.style.overflow = 'hidden';
    };

    const [deleteModalIndex, setdeleteModalIndex] = useState(null);
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false)

    const openDeleteModal = (id) => {
        setisDeleteModalOpen(true)
        setdeleteModalIndex(id)
        document.body.style.overflow = 'hidden';
    }

    const [createFileModalIndex, setcreateFileModalIndex] = useState(null);
    const [iscreateModalOpen, setiscreateModalOpen] = useState(false)

    const openCreateModal = (id) => {
        setiscreateModalOpen(true)
        setcreateFileModalIndex(id)
        document.body.style.overflow = 'hidden';
    }


    const [createFolderModalIndex, setcreateFolderModalIndex] = useState(null)
    const [iscreateFolderModalOpen, setiscreateFolderModalOpen] = useState(false)

    const openCreateFolderModal = (id) => {
        setiscreateFolderModalOpen(true)
        setcreateFolderModalIndex(id)
        document.body.style.overflow = 'hidden';
    }

    return (
        <>
            <div key={index} className="main-folder w-full h-auto my-[5px]">
                {(fileSystem.isDirectory) ? (<>

                    <div className="w-full h-[30px] flex text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-[#fff] cursor-pointer" style={{ paddingLeft: pr + 'px' }}>
                        <div className="min-w-[25px] h-full flex justify-center items-center">
                            {expanded[index] ? <FaChevronDown className='font-semibold' /> : <FaChevronRight className='font-semibold' />}
                        </div>

                        <div className="flex-grow h-full truncate flex items-center" onClick={() => toggleExpand(index)}>
                            <h4 className='font-semibold font-sans text-[.95rem] truncate'>
                                {fileSystem.name}
                            </h4>
                        </div>

                        <DropdownMenu className="min-w-[30] h-full">
                            <DropdownMenuTrigger>
                                <div className="w-full h-full">

                                    <div className="p-[5px] h-full flex justify-center items-center float-right hover:bg-sky-700 cursor-pointer">
                                        <SlOptions className='text-white' />
                                    </div>

                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => openCreateModal(index + pr)}>Create New File</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openCreateFolderModal(index + pr)}>Create New Folder</DropdownMenuItem>
                                <DropdownMenuItem>Upload File</DropdownMenuItem>

                                {(fileSystem.name === 'Research Study') ? (<></>) : (<>
                                    <DropdownMenuItem onClick={() => openRenameModal(index + pr)}>Rename</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openDeleteModal(index + pr)}>Delete</DropdownMenuItem>
                                </>)}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {expanded[index] && fileSystem.children && (
                        <FileExplorer pr={pr + 15} filesSystem={fileSystem.children} isexpanded={false} onUpdate={onUpdate} openFile={openFile}></FileExplorer>
                    )}

                    {isRenameModalOpen && renameModalIndex === index + pr && (
                        <Rename
                            FileItem={fileSystem}
                            index={index + pr}
                            onClose={() => {
                                setisRenameModalOpen(false);
                                setrenameModalIndex(null);
                                document.body.style.overflow = '';
                            }}
                            onUpdate={onUpdate}></Rename>
                    )}


                    {isDeleteModalOpen && deleteModalIndex === index + pr && (
                        <Delete
                            FileItem={fileSystem}
                            index={index + pr}
                            onClose={() => {
                                setisDeleteModalOpen(false);
                                setdeleteModalIndex(null);
                                document.body.style.overflow = '';
                            }}
                            onUpdate={onUpdate}></Delete>
                    )}


                    {iscreateModalOpen && createFileModalIndex === index + pr && (
                        <CreateFile
                            FileItem={fileSystem}
                            index={index + pr}
                            onClose={() => {
                                setiscreateModalOpen(false);
                                setcreateFileModalIndex(null);
                                document.body.style.overflow = '';
                            }}
                            onUpdate={onUpdate}></CreateFile>
                    )}


                    {iscreateFolderModalOpen && createFolderModalIndex === index + pr && (
                        <CreateFolder
                            FileItem={fileSystem}
                            index={index + pr}
                            onClose={() => {
                                setiscreateFolderModalOpen(false);
                                setcreateFolderModalIndex(null);
                                document.body.style.overflow = '';
                            }}
                            onUpdate={onUpdate}></CreateFolder>
                    )}


                </>) : (<>
                    <div className="w-full h-[30px] flex text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-[#fff] cursor-pointer" style={{ paddingLeft: pr + 'px' }}>
                        <div className="min-w-[25px] h-full flex justify-center items-center">
                            <MdOutlineNoteAlt className='font-semibold text-[20px]' />
                        </div>

                        <div onClick={() => openFile({ id: index + pr, filepath: fileSystem.path, filename: fileSystem.name, isopen: true })} className="flex-grow h-full truncate flex items-center">
                            <h4 className='font-semibold font-sans text-[.95rem] truncate'>
                                {fileSystem.name}
                            </h4>
                        </div>

                        <DropdownMenu className="min-w-[30] h-full">
                            <DropdownMenuTrigger>
                                <div className="w-full h-full">

                                    <div className="p-[5px] h-full flex justify-center items-center float-right hover:bg-sky-700 cursor-pointer">
                                        <SlOptions className='text-white' />
                                    </div>

                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => openRenameModal(index + pr)}>Rename</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openDeleteModal(index + pr)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {isRenameModalOpen && renameModalIndex === index + pr && (
                        <Rename
                            FileItem={fileSystem}
                            index={index + pr}
                            onClose={() => {
                                setisRenameModalOpen(false);
                                setrenameModalIndex(null);
                                document.body.style.overflow = '';
                            }}
                            onUpdate={onUpdate}></Rename>
                    )}


                    {isDeleteModalOpen && deleteModalIndex === index + pr && (
                        <Delete
                            FileItem={fileSystem}
                            index={index + pr}
                            onClose={() => {
                                setisDeleteModalOpen(false);
                                setdeleteModalIndex(null);
                                document.body.style.overflow = '';
                            }}
                            onUpdate={onUpdate}></Delete>
                    )}


                </>)}

            </div>

        </>
    )
}

export default FileItem