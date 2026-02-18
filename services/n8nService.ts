import { SEOFormData } from '../types';

export const generateBrief = async (data: SEOFormData): Promise<string> => {
  const { webhookUrl, useCorsProxy, ...payload } = data;

  if (!webhookUrl) {
    throw new Error("Webhook URL is missing. Please configure it in the settings.");
  }

  const isLocalhost = webhookUrl.match(/localhost|127\.0\.0\.1|0\.0\.0\.0|::1/i);

  // Prevent users from trying to use a public proxy to access localhost
  if (useCorsProxy && isLocalhost) {
    throw new Error(
      "Configuration Error: Public CORS Proxies cannot reach 'localhost'. Please disable 'Use CORS Proxy' or use a tunneling service (like ngrok) to make your local webhook public."
    );
  }

  // 1. Construct Query Parameters from the payload object
  const searchParams = new URLSearchParams();
  if (payload.primaryKeyword) searchParams.append('primaryKeyword', payload.primaryKeyword);
  if (payload.secondaryKeyword) searchParams.append('secondaryKeyword', payload.secondaryKeyword);
  if (payload.highAffinityKeywords) searchParams.append('highAffinityKeywords', payload.highAffinityKeywords);
  if (payload.country) searchParams.append('country', payload.country);
  if (payload.language) searchParams.append('language', payload.language);

  // 2. Append params to the Webhook URL
  const separator = webhookUrl.includes('?') ? '&' : '?';
  const urlWithParams = `${webhookUrl}${separator}${searchParams.toString()}`;

  // 3. Handle Proxy if enabled (Proxy needs the full target URL encoded)
  const urlToFetch = useCorsProxy 
    ? `https://corsproxy.io/?${encodeURIComponent(urlWithParams)}` 
    : urlWithParams;

  try {
    // GET requests are often treated as "Simple Requests" by browsers and avoid strict CORS preflight checks
    const response = await fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/markdown, text/plain, */*'
      },
    });

    // Read the response as text first to avoid "Unexpected end of JSON input" errors
    const responseText = await response.text();

    if (!response.ok) {
      // Try to parse the error response to give the user more context
      let errorDetails = "";
      
      // Check if the error body is JSON or HTML
      try {
        const jsonError = JSON.parse(responseText);
        const msg = jsonError.message || jsonError.error || JSON.stringify(jsonError);
        errorDetails = ` - ${msg}`;
      } catch {
        // If HTML (common for 500s from proxies or default server pages)
        if (responseText.trim().startsWith('<')) {
          // Try to extract title
          const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : "";
          
          if (title) {
            errorDetails = ` (${title})`;
          } else {
            errorDetails = " (Server returned an HTML error page)";
          }
        } else {
          // Plain text error
          errorDetails = ` - ${responseText.slice(0, 300)}${responseText.length > 300 ? '...' : ''}`;
        }
      }

      // Specific advice based on status codes
      if (response.status === 500) {
        throw new Error(`Server Error (500). The n8n workflow failed or the proxy could not reach the server.${errorDetails}`);
      }
      if (response.status === 404) {
        throw new Error(`Not Found (404). Ensure the n8n webhook URL is correct and the workflow is Active.${errorDetails}`);
      }
      if (response.status === 405) {
         throw new Error(`Method Not Allowed (405). Ensure your n8n Webhook node is set to allow 'GET' requests.${errorDetails}`);
      }

      throw new Error(`Failed to generate brief. Status: ${response.status} ${response.statusText}${errorDetails}`);
    }

    // Success: Try to parse as JSON, fallback to raw text
    try {
      const jsonResponse = JSON.parse(responseText);
      
      // Heuristic to find the markdown content in common JSON structures
      if (typeof jsonResponse === 'string') return jsonResponse;
      if (jsonResponse.brief) return jsonResponse.brief;
      if (jsonResponse.content) return jsonResponse.content;
      if (jsonResponse.markdown) return jsonResponse.markdown;
      if (jsonResponse.output) return jsonResponse.output;
      if (jsonResponse.text) return jsonResponse.text;
      if (jsonResponse.data) return typeof jsonResponse.data === 'string' ? jsonResponse.data : JSON.stringify(jsonResponse.data, null, 2);
      
      // If valid JSON but no known fields, return the stringified JSON
      return JSON.stringify(jsonResponse, null, 2);
    } catch (e) {
      // If parsing fails, it's likely raw text/markdown
      if (!responseText) {
        // If status was 200 but text is empty, return a generic success message or throw
        return "Brief generated successfully, but the response was empty.";
      }
      return responseText;
    }

  } catch (error: any) {
    console.error("Error calling n8n webhook:", error);
    
    // Improve error message for common CORS/Network issues
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      const suggestion = isLocalhost 
        ? "Ensure your local n8n instance is running."
        : "This is likely a CORS issue or the URL is unreachable. Try enabling 'Use CORS Proxy' in the settings.";
        
      throw new Error(`Network error: Could not reach n8n. ${suggestion}`);
    }
    
    throw error;
  }
};

export const cleanMarkdown = (rawMarkdown: string): string => {
  if (!rawMarkdown) return "";

  let cleaned = rawMarkdown;

  // Remove wrapping code fences if n8n returns raw markdown wrapped in ```markdown ... ```
  // Regex looks for ```markdown at start (optional) and ``` at end (optional)
  cleaned = cleaned.replace(/^```markdown\s*/i, '').replace(/```$/, '');
  
  // Also remove generic code fences if they wrap the *entire* content
  if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
     cleaned = cleaned.replace(/^```\w*\s*/, '').replace(/```$/, '');
  }

  return cleaned.trim();
};