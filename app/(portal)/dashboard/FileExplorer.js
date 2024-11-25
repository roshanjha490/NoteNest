"use client"
import React from 'react'
import FileItem from './FileItem'
import { useState } from 'react'

const FileExplorer = ({ pr, filesSystem, isexpanded, onUpdate, openFile }) => {

    const [expanded, setExpanded] = useState({ 0: isexpanded })

    const toggleExpand = (index) => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <>
            {
                filesSystem.map((fileSystem, index) => (
                    <FileItem pr={pr} key={index} fileSystem={fileSystem} index={index} toggleExpand={toggleExpand} expanded={expanded} onUpdate={onUpdate} openFile={openFile} />
                ))
            }
        </>
    )
}

export default FileExplorer