const API_BASE_URL = 'http://localhost:8080';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJpYUBzb2Z0a2l0LmxvY2FsIiwicm9sZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJpYXQiOjE3Njg2NjY1MzYsImV4cCI6MTc2ODY3MDEzNn0.Zao5UL64SI0ss0re2vonuHtgIEHIEJLrmo2R48QBmqg'

const fetchOccurrencesFromApi = async (endpoint: string, method: string, body = null) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`,
                },
                body: body ? JSON.stringify({body}) : null,
            });
        return await response.json();
    } catch (error) {
        console.error("Erro ao realizar o fetch", error);
        throw error;
    }
}

const createOccurrence = async (endpoint: string, method: string, body = null) => {
    console.log('Creating occurrence: ', body);
    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`,
                },
                body: body ? JSON.stringify(body) : null,
            });
        const result = await response.json();
        if (!result.success) {
            throw new Error("Erro ao criar ocorrência");
        }
        console.log("Ocorrência criada com sucesso");
        return result;
    } catch (error) {
        console.error("Erro ao realizar o fetch", error);
        throw error;
    }
}


export { fetchOccurrencesFromApi, createOccurrence }