"use client"
import React from 'react'

import dynamic from 'next/dynamic';

// import { Controlled as CodeMirror } from 'react-codemirror2';

// Dynamically import CodeMirror on the client side
const CodeMirror = dynamic(() => import('react-codemirror2').then(mod => mod.Controlled), { ssr: false });

// import 'codemirror/lib/codemirror.css';
// // import 'codemirror/theme/material.css';
// import 'codemirror/theme/base16-light.css';
// import 'codemirror/mode/gfm/gfm.js'
// import 'codemirror/addon/selection/active-line'
// import 'codemirror/addon/scroll/scrollpastend'


import { createFile, get_filecontent } from '@/app/actions';
import { toast } from 'react-hot-toast';

import { useState, useRef, useEffect } from 'react'


const NoteEditor = () => {

    const [value, setValue] = useState('<h1>I ♥ react-codemirror2</h1>');
    const editor = useRef()
    const wrapper = useRef()

    const editorWillUnmount = () => {
        editor.current.display.wrapper.remove()
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


    // useEffect(() => {

    //     const fetchNotes = async () => {

    //         const result = await get_filecontent()

    //         if (result.success) {
    //             setValue(result.response)
    //         } else {
    //             toast.error('Failed')
    //         }

    //     }

    //     fetchNotes()

    // }, [])



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

        </>
    )


}

export default NoteEditor