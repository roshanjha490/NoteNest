"use client"
import React from 'react'
import { FaTimes } from "react-icons/fa";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { create_new_folder } from '@/app/actions';

const CreateFolder = ({ FileItem, index, onClose, onUpdate }) => {

    const closeModal = () => {
        onClose();
    }

    let CreateFolderFormSchema = z.object({
        old_path_name: z.string({
            required_error: "Old Path name is required",
            invalid_type_error: "Old Path name must be a string",
        }),
        name: z.string({
            required_error: "New Path name is required",
            invalid_type_error: "New Path name must be a string",
        })
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(CreateFolderFormSchema),
    });

    async function onSubmit(formData) {
        toast.remove();

        const result = await create_new_folder(formData)

        if (result.success) {
            reset()
            onClose()
            onUpdate()
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }

    }


    return (
        <div id={'crud_modal_' + index} tabindex="-1" aria-hidden="true" className={"overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[999] flex justify-center items-center w-full h-full md:inset-0 min-h-full"} style={{ backgroundColor: '#0000008a' }}>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Create New Folder
                        </h3>
                        <button onClick={() => closeModal(index)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <FaTimes className='w-[10px] h-[10px] text-black' />
                        </button>
                    </div>


                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">

                        <input type="hidden" {...register("old_path_name")} value={FileItem.path} />

                        <div className="grid gap-4 mb-[30px] grid-cols-1">
                            <div className="col-span-2 sm:col-span-1">
                                <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="text" {...register("name")} id="name" className="m-[0px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder='Enter File Name eg: index.js' />
                                {errors.name && (
                                    <>
                                        <small className="text-red-500">{`${errors.name.message}`}</small>
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
        </div>
    )
}

export default CreateFolder