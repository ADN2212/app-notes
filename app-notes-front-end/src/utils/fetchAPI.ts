type IMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface IOptions {
    method: IMethod;
    headers: HeadersInit | undefined;
    body?: string;
}

async function fetchAPI<T>(
    endpointStr: string, 
    method: IMethod = 'GET', 
    data = {}, 
    accessToken?: string
): Promise<T> {

    const options: IOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`http://localhost:3001/${endpointStr}`, options);
    const result: T = await response.json();
    return result;
}

export default fetchAPI;
