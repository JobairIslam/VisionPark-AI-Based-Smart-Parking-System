import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token?.value) {
        return NextResponse.json({ message: "Token cookie not found" }, { status: 404 });
    }

    try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
            'headers': {
                'Authorization': "Bearer " + token.value
            }
        });

        console.log(response.data);


        return NextResponse.json(response.data);

    } catch (e) {

        const error = e as AxiosError;

        console.log(error);
        return NextResponse.json(error, { status: error.status });
    }

}
