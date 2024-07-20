"use client"
import React from 'react'


import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/scroll/scrollpastend'


import { createFile, get_filecontent } from '@/app/actions';
import { toast } from 'react-hot-toast';

import { useState, useRef, useEffect } from 'react'


const NoteEditor = () => {

    const [value, setValue] = useState('<h1>I ♥ react-codemirror2</h1>');
    const editor = useRef()
    const wrapper = useRef()

    const editorWillUnmount = () => {
        editor.current.display.wrapper.remove()
        wrapper.current.hydrated = false
    }

    // const onNewLine = (e) => {
    //     console.log(e);
    //     console.log(editor);
    //     // editor.replaceSelection("\n", "end");
    // }


    useEffect(() => {

        const fetchNotes = async () => {

            const result = await get_filecontent()

            if (result.success) {
                setValue(result.response)
            } else {
                toast.error('Failed')
            }

        }

        fetchNotes()

    }, [])



    const createFileBtn = async () => {
        const result = await createFile(value)

        console.log(result)

        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
    }

    return (
        <>
            <div className='w-[700px] h-500px bg-red-400'>
                <CodeMirror
                    data-testid="codemirror-editor"
                    className="editor mousetrap"
                    value={value}
                    ref={wrapper}
                    options={{
                        direction: 'ltr',
                        dragDrop: false,
                        keyMap: 'default',
                        lineNumbers: true,
                        lineWrapping: true,
                        mode: 'gfm',
                        scrollPastEnd: false,
                        styleActiveLine: {
                            nonEmpty: true
                        },
                        theme: 'base16-light',
                        viewportMargin: null,
                        indentWithTabs: true,
                        indentUnit: 10,
                        extraKeys: {
                            "Tab": (cm) => {
                                if (cm.somethingSelected()) {
                                    cm.indentSelection("add");
                                } else {
                                    cm.execCommand("insertSoftTab");
                                }
                            },
                            "Enter": "newlineAndIndentContinueMarkdownList"
                        }
                    }}
                    onBeforeChange={(editor, data, value) => {
                        setValue(value);
                    }}
                    onChange={(editor, data, value) => {
                    }}
                    editorDidMount={(e) => editor.current = e}
                    editorWillUnmount={editorWillUnmount}
                />

            </div>

            <button onClick={() => createFileBtn()} type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Create New File</button>
        </>
    )


}

export default NoteEditor