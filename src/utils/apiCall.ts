import { ApiResponse } from "../models/models";

const API_BASE_URL = "https://48be9zrsj9.execute-api.us-east-2.amazonaws.com";
  
// Generic API call
export async function apiCall<T>(method: string, endpoint: string, body?: object): Promise<ApiResponse<T>> {
    console.log("Called apiCall:"+method+" "+endpoint);

    const accessToken = localStorage.getItem("accessToken");

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'authorization': "Bearer "+accessToken,
      'origin': window.location.origin
    };

    try {
        const response = await fetch(API_BASE_URL+endpoint, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if(response.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("idToken");
            const url = window.location.origin;
            window.location.href = "https://dev-kz2fpaq4oiht7zgs.us.auth0.com/v2/logout?client_id=yUnBLFVRvSWGNFe8Kt1BxlRBBKf6GFNB&returnTo=" + url;
        }
        
        const result = await response.json();
        
        if (!response.ok) {
            return {
                data: result,
                success: false
            };
        }

        return {
            data: result,
            success: true
        };
    } catch (error: unknown) {
        console.log(error);
        if(error instanceof Error) {
            return {
                data: {
                    "detail": error.message,
                },
                success: false
            }
        }
        return {
            data: {
                "detail":"Check the logs for error"
            },
            success: false
        }
    }
}
  