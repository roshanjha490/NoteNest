"use client"
import React from 'react'
import { FaTimes } from "react-icons/fa";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { delete_item } from '@/app/actions';

const Delete = ({ FileItem, index, onClose, onUpdate }) => {

    const closeModal = () => {
        onClose();
    }

    let RenameFormSchema = z.object({
        old_path_name: z.string({
            required_error: "Old Path name is required",
            invalid_type_error: "Old Path name must be a string",
        })
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(RenameFormSchema),
    });

    async function onSubmit(formData) {
        toast.remove();

        const result = await delete_item(formData)

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

                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5">

                        <input type="hidden" {...register("old_path_name")} value={FileItem.path} />

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Are you absolutely sure?
                        </h3>

                        <br />
                        <p>This action cannot be undone. This will permanently delete your Folder and Subfolders.</p>
                        <br />

                        <div className='w-full h-auto'>
                            <Button className="mr-[10px]" type="submit">Continue</Button>
                            <Button className="mr-[10px]" onClick={() => closeModal(index)} variant="outline">Cancel</Button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default Delete