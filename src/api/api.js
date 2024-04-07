
export const getAIMessage = async (userQuery) => {
  const response = await fetch("http://127.0.0.1:5000/ask", {
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

// const sendQueryToGPT4 = async (userQuery) => {
//   const response = await fetch("https://api.openai.com/v1/engines/davinci/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       prompt: userQuery,
//       max_tokens: 150,
//     }),
//   });

//   const data = await response.json();
//   return data.choices[0].text;
// }