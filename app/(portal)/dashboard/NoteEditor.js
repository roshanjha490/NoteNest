"use client"
import React from 'react'

import dynamic from 'next/dynamic';

import { Controlled as CodeMirror } from 'react-codemirror2';

// Dynamically import CodeMirror on the client side
// const CodeMirror = dynamic(() => import('react-codemirror2').then(mod => mod.Controlled), { ssr: false });

// import 'codemirror/lib/codemirror.css';
// // import 'codemirror/theme/material.css';
// import 'codemirror/theme/base16-light.css';
// import 'codemirror/mode/gfm/gfm.js'
// import 'codemirror/addon/selection/active-line'
// import 'codemirror/addon/scroll/scrollpastend'


import { get_filecontent, saveFileContent } from '@/app/actions';

import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast';


import hotkeys from 'hotkeys-js';

const NoteEditor = ({ fileItem }) => {

    const [value, setvalue] = useState()
    const editor = useRef()
    const wrapper = useRef()

    const editorWillUnmount = () => {
        editor.current.display.wrapper.remove()
        // if (editor.current.setValue) {
        //     editor.current.setValue(value)
        // }
        // wrapper.current.hydrated = false
    }

    useEffect(() => {
        // Import CodeMirror CSS only on the client side
        if (typeof window !== 'undefined') {
            require('codemirror/lib/codemirror.css');
            require('codemirror/theme/base16-light.css');
            require('codemirror/mode/gfm/gfm.js');
            require('codemirror/addon/selection/active-line');
            require('codemirror/addon/scroll/scrollpastend');
        }

    }, []);

    // const onNewLine = (e) => {
    //     console.log(e);
    //     console.log(editor);
    //     // editor.replaceSelection("\n", "end");
    // }


    const fetchNotes = async () => {

        const result = await get_filecontent(fileItem)

        if (result.success) {
            setvalue(result.response)
        } else {
            toast.error('Failed')
        }

    }

    useEffect(() => {
        fetchNotes()
    }, [])

    const saveContentFromEditor = async (value) => {

        const result = await saveFileContent(value, fileItem.filepath)

        if (result.success) {
            console.log(result.message)
        } else {
            toast.error(result.message)
        }
    }

    return (
        <>
            <div className='w-full h-full overflow-y-scroll'>
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
                            "Enter": "newlineAndIndentContinueMarkdownList",
                            "Ctrl-S": (cm) =>{
                                console.log("lklkl")
                            }
                        }
                    }}
                    onBeforeChange={(editor, data, value) => {
                        setvalue(value);
                        saveContentFromEditor(value)
                    }}
                    onChange={(editor, data, value) => {
                        // saveContentFromEditor(data, value)
                    }}
                    editorDidMount={(e) => editor.current = e}
                    editorWillUnmount={editorWillUnmount}
                />

            </div>

        </>
    )


}

export default NoteEditor