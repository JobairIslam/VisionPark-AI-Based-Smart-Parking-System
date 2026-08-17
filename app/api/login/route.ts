import axios from "axios";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";



export async function POST(resquest: Request) {

    const { email, password } = await resquest.json();

    if (!email || !password) {
        return NextResponse.json({ message: "Fill up the email and password" });
    }

    try {

        const response = await axios.post("http://127.0.0.1:8000/api/signin",
            {
                email,
                password
            }
        );

        await cookies().set('auth_token', response.data.token);

        console.log(response.data);

        return NextResponse.json({ user: response.data.user });

    } catch (error) {
        console.log(error);

        return NextResponse.json(error);
        // toast message
    }

}