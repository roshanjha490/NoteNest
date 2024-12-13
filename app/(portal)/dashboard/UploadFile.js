"use client"
import React from 'react'
import { FaTimes } from "react-icons/fa";

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';


const UploadFile = ({ FileItem, index, onClose, onUpdate }) => {

    const closeModal = () => {
        onClose();
    }


    const checkFileType = (file) => {
        return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // MIME type for .xlsx
    };


    let UploadFileSchema = z.object({
        old_path_name: z.string({
            required_error: "Old Path name is required",
            invalid_type_error: "Old Path name must be a string",
        }),
        file_upload: z
            .custom()
            .superRefine((val, ctx) => {

                if (val.length < 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.too_big,
                        maximum: 3,
                        type: "array",
                        inclusive: true,
                        message: "Kindly Select any File 😡",
                    });
                }

                for (let i = 0; i < val.length; i++) {
                    const file = val[i];

                    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

                    const maxSizeInBytes = 5 * 1048576;

                    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.too_big,
                            maximum: 3,
                            type: "array",
                            inclusive: true,
                            message: "File Type not supported😡",
                        });
                    }

                    if (file.size > maxSizeInBytes) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.too_big,
                            maximum: 3,
                            type: "array",
                            inclusive: true,
                            message: "File size too high",
                        });
                    }
                }

            })
    });


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(UploadFileSchema),
    });


    async function onSubmit(formData) {
        console.log(formData)
        console.log('came here')
        return
    }

    return (
        <div tabindex="-1" aria-hidden="true" className={"overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[999] flex justify-center items-center w-full h-full md:inset-0 min-h-full"}>

            <div className="relative w-full h-full flex justify-center items-center ">
                <div className="relative p-4 w-full max-w-md max-h-full z-[990]">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Upload File
                            </h3>
                            <button onClick={() => closeModal(index)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                <FaTimes className='w-[10px] h-[10px] text-black' />
                            </button>
                        </div>


                        <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">

                            <input type="hidden" {...register("old_path_name")} value={FileItem.path} />

                            <div className="grid gap-4 mb-[30px] grid-cols-1">
                                <div className="col-span-2 sm:col-span-1">
                                    <Label htmlFor="picture">Upload File/Folder</Label>
                                    <Input {...register("file_upload")} id="picture" type="file" multiple={true} />
                                    {errors.file_upload && (
                                        <>
                                            <small className="text-red-500">{`${errors.file_upload.message}`}</small>
                                            <br />
                                        </>
                                    )}
                                </div>
                            </div>

                            <hr className='mb-[10px]' />

                            <Button className="mr-[10px]" type="submit">Submit</Button>
                            <Button className="mr-[10px]" onClick={() => closeModal(index)} variant="outline">Cancel</Button>

                        </form>

                    </div>
                </div>
                <div onClick={() => closeModal(index)} id={'crud_modal_' + index} className='w-full h-full fixed top-[0%] left-[0%] translate-[-50%] z-[920]' style={{ backgroundColor: '#0000008a' }}></div>
            </div>

        </div>
    )
}

export default UploadFile