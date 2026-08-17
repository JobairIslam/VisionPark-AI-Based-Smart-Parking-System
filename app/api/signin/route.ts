import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";




export async function POST(request: Request) {

    const data = await request.json();

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/signin', data);

        await cookies().set('auth_token', response.data?.token);

        console.log(response.data);
        return NextResponse.json(response.data);
    } catch (error) {
        const e = error as AxiosError;

        console.log(e);

        return NextResponse.json({ message: e.message });
    }
}