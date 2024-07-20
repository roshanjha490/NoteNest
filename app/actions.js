"use server"
import { get_table_data_by_array, run_raw_sql, update_data_in_table, insert_data_in_table } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { createHash } from "crypto";
import { promises as fs } from 'fs';
import path from 'path';


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

export async function createFile(value) {

    const directoryPath = path.join(process.cwd(), 'notes');

    const filePath = path.join(directoryPath, `${'research-page'}.md`);

    // Ensure the directory exists
    await fs.mkdir(directoryPath, { recursive: true });

    // Write the file
    await fs.writeFile(filePath, value);

    return { success: true, message: 'File Created' }

}

export async function get_filecontent() {
    const filename = 'research-page'

    const folder = 'notes'

    const filePath = path.join(process.cwd(), folder, `${filename}.md`);

    const content = await fs.readFile(filePath, 'utf8');

    return {
        success: true,
        message: 'File Content receieved',
        response: content
    }

}



async function getDirectoryContent(directoryPath) {
    const items = await fs.readdir(directoryPath, { withFileTypes: true });

    const filesAndFolders = await Promise.all(items.map(async item => {
        const itemPath = path.join(directoryPath, item.name);
        const isDirectory = item.isDirectory();
        return {
            name: item.name,
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

        return {
            success: true,
            message: 'Directory Content received',
            response: filesAndFolders
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


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function sha256Hash(data) {
    createHash
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}
