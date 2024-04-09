
export const getAIMessage = async (userQuery) => {
  const response = await fetch("http://127.0.0.1:5001/ask", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
    },
    body: JSON.stringify({ query: userQuery }), // Send userQuery in the request body
  });

  const data = await response.json();
  const message = {
    role: "assistant",
    content: data.message,
  };
  return message;
};