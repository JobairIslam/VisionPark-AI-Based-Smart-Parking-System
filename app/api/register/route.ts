import axios from "axios";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";



export async function POST(request: Request) {

    const { name, email, password, password_confirmation } = await request.json();

    if (!name || !email || !password || !password_confirmation) {
        return NextResponse.json({ message: "Fill up all the fields" });
    }

    try {

        await axios.post("http://127.0.0.1:8000/api/signup",
            {
                name,
                email,
                password,
                password_confirmation
            }
        );

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
