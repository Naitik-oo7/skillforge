- express.json() → Parses incoming JSON requests.
- cors() → Enables CORS for cross-origin API calls.
- select("-password") → Excludes password from DB query result.
Why attach to req.user from the decoded token  in authentication ?
Because req is the object passed down to every middleware and route handler in Express for that request’s lifecycle.