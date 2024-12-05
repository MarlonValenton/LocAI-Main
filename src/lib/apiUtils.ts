export async function callGroqApi(messages: { role: string; content: string }[], model: string): Promise<any> {
    const endpoint = "https://api.groq.com/openai/v1/chat/completions"; // Replace with the actual Groq API endpoint
    const payload = {
        model,
        messages
    };

    console.log("Payload being sent to Groq API:", payload); // Log payload for debugging

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer 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`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get detailed error message from the API
            console.error("Groq API error response:", errorText);
            throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        console.log("Groq Response: ", reply)
        return data;
    } catch (error) {
        console.error("Error calling Groq API:", error);
        throw error;
    }
}

export interface GroqModelResponse {
  object: string,
  data: { id: string; object: string }[] // Adjust based on API response shape
}

export async function fetchGroqModels(groqModels: any): Promise<{ id: string; object: string }[] | null> {
    const endpoint = "https://api.groq.com/openai/v1/models";

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.status} - ${response.statusText}`);
        }

        const data: GroqModelResponse = await response.json();
        console.log("Groq Models:", data.data); // Log the models
        
        return data.data; // Return only the `data` array
    } catch (error) {
        console.error("Error fetching Groq models:", error);
        return null; // Return null or throw error based on your needs
    }
}