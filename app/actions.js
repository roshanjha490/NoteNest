"use server"
import { get_table_data_by_array, run_raw_sql, update_data_in_table, insert_data_in_table } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { createHash } from "crypto";
import { promises as fs } from 'fs';
import path from 'path';

import simpleGit from 'simple-git';

export async function checkLogin(formData) {

    let loginFormSchema = z.object({
        email: z.string().email({
            message: 'Invalid Email',
        }),
        password: z.string().min(6, { message: "Password Length should be more than 6 Charecters" })
    })

    let validateFields = await loginFormSchema.safeParse({
        email: formData.email,
        password: formData.password
    })

    if (!validateFields.success) {
        return {
            success: false,
            error: validateFields.error.flatten().fieldErrors,
        }
    } else {

        let sql = {
            table_name: 'users',
            where_array: {
                email: formData.email,
                password: formData.password
            },
            order_by: 'id'
        }

        let db_response = await get_table_data_by_array(sql)

        if (db_response[0].length === 0) {
            return {
                success: false,
                error: 'User Not Found'
            }
        }

        if (db_response[0].length === 1) {
            return {
                success: true,
                error: 'User Found'
            }
        }

        if (db_response[0].length > 1) {
            return {
                success: true,
                error: 'Unexpected Error Occured'
            }
        }

    }

}

export async function get_userdata() {
    const session = await getServerSession()

    let sql = 'SELECT users.*, kite_credentials.api_key, kite_credentials.api_secret, kite_credentials.access_token, kite_credentials.request_token, kite_credentials.is_expired, kite_credentials.created_at AS rkj_time FROM `users` LEFT JOIN kite_credentials ON users.id = kite_credentials.user_id WHERE `email` = "' + session.user.email + '"';

    let response = await run_raw_sql(sql)

    return response[0][0]

}


export async function get_filecontent(fileItem) {
    try {
        // Extract the file path from the fileItem object
        const filePath = fileItem.filepath;

        // Check if the file path is provided
        if (!filePath) {
            throw new Error('File path is missing');
        }

        // Read the file content
        const content = await fs.readFile(filePath, 'utf8');

        // Return the file content
        return {
            success: true,
            message: 'File content received',
            response: content
        };
    } catch (error) {
        // Handle errors and return a meaningful message
        console.error('Error reading file content:', error);
        return {
            success: false,
            message: error.message,
            response: null
        };
    }

}

export async function saveFileContent(content, path) {
    try {
        // Write the content to the file
        await fs.writeFile(path, content, 'utf8');

        // Return a success message
        return {
            success: true,
            message: 'File content saved successfully',
        };
    } catch (error) {
        // Handle errors and return a meaningful message
        console.error('Error saving file content:', error);
        return {
            success: false,
            message: error.message,
        };
    }
}

async function getDirectoryContent(directoryPath) {
    const items = await fs.readdir(directoryPath, { withFileTypes: true });

    items.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) {
            return -1;
        }
        if (!a.isDirectory() && b.isDirectory()) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    });

    const filesAndFolders = await Promise.all(items.map(async item => {
        const itemPath = path.join(directoryPath, item.name);
        const isDirectory = item.isDirectory();
        return {
            name: item.name,
            path: itemPath,
            isDirectory,
            children: isDirectory ? await getDirectoryContent(itemPath) : []
        };
    }));

    return filesAndFolders;
}

export async function get_all_files_n_directories() {

    const directoryPath = path.join(process.cwd(), 'Research Study');

    try {
        const filesAndFolders = await getDirectoryContent(directoryPath);

        const res = {
            name: 'Research Study',
            path: directoryPath,
            isDirectory: true,
            children: filesAndFolders
        };

        return {
            success: true,
            message: 'Directory Content received',
            response: [res]
        };

    } catch (err) {
        console.error('Error reading directory:', err);
        return {
            success: false,
            message: 'Error reading directory',
            error: err
        };
    }
}

export async function rename_item(formData) {

    const { old_path_name, name } = formData;

    // Get the directory of the old path
    const directory = path.dirname(old_path_name);

    // Construct the new path name
    const new_path_name = path.join(directory, name);

    try {
        // Rename the item
        await fs.rename(old_path_name, new_path_name);

        return {
            success: true,
            message: 'Directory or file renamed successfully'
        };

    } catch (err) {
        console.error('Error renaming directory or file:', err);

        return {
            success: false,
            message: 'Error renaming directory or file',
            error: err
        };

    }

}

export async function delete_item(formData) {

    const { old_path_name } = formData;

    try {
        const stats = await fs.stat(old_path_name);

        if (stats.isDirectory()) {
            // Recursively delete the directory and its contents
            await fs.rmdir(old_path_name, { recursive: true });
        } else {
            // Delete the file
            await fs.unlink(old_path_name);
        }

        return {
            success: true,
            message: 'Item deleted successfully'
        };
    } catch (err) {
        console.error('Error deleting item:', err);
        return {
            success: false,
            message: 'Error deleting item',
            error: err
        };
    }
}


export async function create_new_file(formData) {
    const { old_path_name, name } = formData;
    const newFilePath = path.join(old_path_name, name);

    try {
        // Create a new file with empty content
        await fs.writeFile(newFilePath, '');

        return {
            success: true,
            message: 'File created successfully',
            filePath: newFilePath
        };
    } catch (err) {
        console.error('Error creating file:', err);
        return {
            success: false,
            message: 'Error creating file',
            error: err
        };
    }
}

export async function create_new_folder(formData) {
    const { old_path_name, name } = formData;
    const newFolderPath = path.join(old_path_name, name);

    try {
        // Create a new folder
        await fs.mkdir(newFolderPath, { recursive: true });

        return {
            success: true,
            message: 'Folder created successfully',
            folderPath: newFolderPath
        };
    } catch (err) {
        console.error('Error creating folder:', err);
        return {
            success: false,
            message: 'Error creating folder',
            error: err
        };
    }

}

export async function check_git_changes() {

    const repopath = path.join(process.cwd(), 'Research Study')

    const git = simpleGit(repopath)

    const status = await git.status()

    const hasChanges = status.not_added.length > 0 ||
        status.modified.length > 0 ||
        status.deleted.length > 0 ||
        status.conflicted.length > 0 ||
        status.created.length > 0;

    return hasChanges
}

export async function performSyncChanges() {
    const repoPath = path.join(process.cwd(), 'Research Study')

    const git = simpleGit(repoPath);

    // Add and commit changes
    await git.add('./*'); // Stage all changes
    await git.commit('Updated notes'); // Commit with a message
    await git.push(); // Push to remote repository

    return true
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function sha256Hash(data) {
    createHash
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}


export async function action(formData) {
    const file = formData.get("file")

    console.log(file)

    // const data = await file.arrayBuffer()

    // await fs.writeFile(`${process.cmd()}/tmp/${file.name}`, Buffer.from(data))
}