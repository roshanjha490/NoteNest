import { NextResponse, NextRequest } from "next/server";
import { get_table_data_by_array, insert_data_in_table } from "@/lib/db";

export async function POST(request, response) {

    // const data = await request.json()

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(request, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

    console.log(fields)
    console.log(files)
}