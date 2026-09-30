// Demo interview ka script. Asli AI interviewer aane tak ye rule-based hai:
// follow-up jawab ke keywords se chuna jaata hai, aur scoring key points match karke hoti hai.

export interface KeyPoint {
  label: string;
  keywords: string[];
}

export interface DemoTurn {
  question: string;
  keyPoints: KeyPoint[];
  ideal: string;
}

export interface DemoFollowUp extends DemoTurn {
  // Jawab me inme se koi word ho to ye follow-up. `when` na ho to default follow-up.
  when?: string[];
}

export interface DemoQuestion extends DemoTurn {
  id: string;
  topic: string;
  followUps: DemoFollowUp[];
}

export type DemoRoleId = "frontend" | "backend" | "hr";

export interface DemoRole {
  id: DemoRoleId;
  title: string;
  subtitle: string;
  topics: string;
  questions: DemoQuestion[];
}

export const DEMO_ROLES: DemoRole[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    subtitle: "JavaScript, React and how the web works",
    topics: "Closures · React performance · Browser basics",
    questions: [
      {
        id: "fe-closure",
        topic: "JavaScript",
        question:
          "Let's start with JavaScript. Can you explain what a closure is, and tell me where you have actually used one?",
        keyPoints: [
          { label: "A function remembers its outer (lexical) scope", keywords: ["scope", "lexical", "outer", "parent function"] },
          { label: "Variables stay available after the outer function returns", keywords: ["after", "returned", "remember", "still access", "even when"] },
          { label: "A real use case (privacy, counters, debounce, handlers)", keywords: ["private", "privacy", "counter", "debounce", "throttle", "handler", "callback", "module", "memoiz"] },
        ],
        ideal:
          "A closure is a function bundled with the variables from the scope where it was created. Because of it, an inner function can still read and update outer variables even after the outer function has returned. Common uses: private state (a counter only changeable through its methods), debounce/throttle helpers, and event handlers that remember some data.",
        followUps: [
          {
            when: ["debounce", "throttle"],
            question: "You mentioned debounce. Walk me through how a debounce function uses a closure.",
            keyPoints: [
              { label: "Keeps a timer id in the closure", keywords: ["timer", "timeout", "settimeout", "id"] },
              { label: "Clears the previous timer on each call", keywords: ["clear", "cleartimeout", "reset", "cancel"] },
              { label: "Runs the function only after the wait period", keywords: ["wait", "delay", "after", "last call", "ms"] },
            ],
            ideal:
              "debounce returns a new function. The timer id lives in the closure, so every call can clearTimeout the previous timer and start a new setTimeout. The original function only runs once calls stop for the wait period.",
          },
          {
            when: ["private", "privacy", "counter", "encapsul"],
            question:
              "Good. Say I want a counter that nobody outside can modify directly, only through increment and getValue. How would you build it?",
            keyPoints: [
              { label: "Variable declared inside an outer function", keywords: ["inside", "let count", "variable", "outer function", "factory"] },
              { label: "Return methods that use that variable", keywords: ["return", "object", "method", "increment", "getvalue"] },
              { label: "Nothing outside can reach the variable directly", keywords: ["cannot", "can't", "not accessible", "private", "hidden"] },
            ],
            ideal:
              "Write a createCounter function with `let count = 0` inside it, and return an object with increment() and getValue() that read and update count. Code outside only gets the methods, so count can't be changed directly.",
          },
          {
            question: "Closures can sometimes cause memory leaks. In what kind of situation could that happen?",
            keyPoints: [
              { label: "Closure holds a reference to large data", keywords: ["reference", "large", "big", "hold", "retain"] },
              { label: "Long-lived listeners or timers keep it alive", keywords: ["listener", "event", "interval", "timer", "global"] },
              { label: "Fix: remove listeners / clear timers / drop refs", keywords: ["remove", "clear", "cleanup", "null", "unsubscribe"] },
            ],
            ideal:
              "If a closure references a large object and the closure itself lives a long time (an event listener or setInterval that's never removed), the garbage collector can't free that object. The fix is to remove listeners, clear intervals and avoid capturing more data than needed.",
          },
        ],
      },
      {
        id: "fe-react-perf",
        topic: "React",
        question:
          "Next, a practical one. You have a React list of 5,000 items, and typing in the search box above it feels laggy. How would you debug and fix it?",
        keyPoints: [
          { label: "Measure first (React Profiler / DevTools)", keywords: ["profil", "devtools", "measure", "performance tab"] },
          { label: "Reduce unnecessary re-renders (memo, useMemo, useCallback)", keywords: ["memo", "usememo", "usecallback", "re-render", "rerender"] },
          { label: "Virtualize the list (react-window)", keywords: ["virtual", "window", "react-window", "only render visible"] },
          { label: "Debounce or defer the input", keywords: ["debounce", "usedeferredvalue", "transition", "usetransition", "defer"] },
        ],
        ideal:
          "First measure with the React Profiler to see what re-renders and how long it takes. Then: virtualize the list so only visible rows render (react-window), memoize row components and the filtered list, keep callbacks stable, and debounce the search or use useDeferredValue / startTransition so typing stays responsive.",
        followUps: [
          {
            when: ["usememo", "memo", "usecallback"],
            question: "You mentioned memoization. When could useMemo actually make things slower?",
            keyPoints: [
              { label: "Memoization has its own cost (comparing deps, storing)", keywords: ["cost", "overhead", "compare", "dependency", "memory"] },
              { label: "Cheap calculations don't benefit", keywords: ["cheap", "simple", "small", "trivial"] },
              { label: "Deps change every render, so the cache never hits", keywords: ["every render", "changes", "new object", "new array", "reference"] },
            ],
            ideal:
              "useMemo isn't free: React stores the value and compares dependencies every render. For cheap calculations that overhead can cost more than recomputing. And if a dependency is a new object or array each render, the cache never hits, so you pay the cost for nothing.",
          },
          {
            when: ["virtual", "window"],
            question: "How does list virtualization work under the hood?",
            keyPoints: [
              { label: "Render only the rows in (or near) the viewport", keywords: ["visible", "viewport", "only render", "on screen"] },
              { label: "Uses scroll position to decide which rows", keywords: ["scroll", "offset", "position"] },
              { label: "Spacer or total height keeps the scrollbar correct", keywords: ["height", "spacer", "padding", "scrollbar", "absolute"] },
            ],
            ideal:
              "It listens to the scroll position, calculates which row indexes fall in the viewport (plus a small overscan), and renders only those, positioned absolutely. A container with the full list height keeps the scrollbar accurate.",
          },
          {
            question: "What would you look for first in the React DevTools Profiler?",
            keyPoints: [
              { label: "Which components re-render and how often", keywords: ["re-render", "rerender", "which component", "how often", "commit"] },
              { label: "Slow components (render time, flamegraph)", keywords: ["time", "slow", "flame", "ranked", "ms"] },
              { label: "Why it rendered (props/state changes)", keywords: ["why", "props", "state", "changed"] },
            ],
            ideal:
              "Record while typing, then check the flamegraph or ranked view for components with the longest render time, see which components re-render on each keystroke, and enable 'why did this render' to find the prop or state change causing it.",
          },
        ],
      },
      {
        id: "fe-url",
        topic: "Web fundamentals",
        question: "Last question. What happens, step by step, when a user types a URL into the browser and presses Enter?",
        keyPoints: [
          { label: "DNS lookup to find the IP", keywords: ["dns", "ip address", "domain"] },
          { label: "TCP connection and TLS handshake", keywords: ["tcp", "tls", "ssl", "handshake", "https"] },
          { label: "HTTP request and server response", keywords: ["http", "request", "response", "server", "get"] },
          { label: "Browser parses HTML/CSS, builds DOM and renders", keywords: ["dom", "parse", "render", "paint", "cssom", "layout"] },
        ],
        ideal:
          "The browser checks its cache, then resolves the domain to an IP via DNS. It opens a TCP connection plus a TLS handshake for HTTPS, and sends an HTTP GET. The server responds with HTML. The browser parses it into the DOM, fetches CSS/JS, builds the CSSOM, runs layout and paints pixels on screen.",
        followUps: [
          {
            when: ["cache", "cdn"],
            question: "You mentioned caching. Where along that path can caching happen?",
            keyPoints: [
              { label: "Browser cache (HTTP cache headers)", keywords: ["browser", "cache-control", "header", "etag", "local"] },
              { label: "DNS caching", keywords: ["dns"] },
              { label: "CDN / proxy / server-side cache", keywords: ["cdn", "proxy", "edge", "redis", "server"] },
            ],
            ideal:
              "At every layer: the OS and browser cache DNS results, the browser HTTP cache (controlled by Cache-Control/ETag), service workers, CDNs and proxies at the edge, and application caches like Redis on the server.",
          },
          {
            question: "Okay. How would you make that first page load faster?",
            keyPoints: [
              { label: "Serve assets from a CDN with caching", keywords: ["cdn", "cache"] },
              { label: "Send less: compression, minify, code splitting", keywords: ["compress", "gzip", "brotli", "minif", "split", "bundle", "tree shak"] },
              { label: "Lazy-load and optimise images/fonts", keywords: ["lazy", "image", "webp", "font", "defer", "async"] },
            ],
            ideal:
              "Serve static assets from a CDN with long cache headers, compress with Brotli/gzip, minify and code-split the JS so only what's needed loads first, defer non-critical scripts, and lazy-load and resize images using modern formats.",
          },
        ],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    subtitle: "Node.js, APIs, databases and security",
    topics: "Password security · API design · Performance",
    questions: [
      {
        id: "be-passwords",
        topic: "Security",
        question: "Let's begin with security. How would you store user passwords securely in your database?",
        keyPoints: [
          { label: "Never store plain text; hash the password", keywords: ["hash", "plain text", "plaintext"] },
          { label: "Use a slow algorithm (bcrypt, argon2, scrypt)", keywords: ["bcrypt", "argon", "scrypt", "pbkdf"] },
          { label: "Unique salt per password", keywords: ["salt"] },
        ],
        ideal:
          "Never store plain text or reversible encryption. Hash each password with a slow, adaptive algorithm such as bcrypt or Argon2, which adds a unique salt automatically and has a tunable cost factor. On login, hash the input and compare it with the stored hash.",
        followUps: [
          {
            when: ["bcrypt", "argon", "scrypt"],
            question: "Why bcrypt and not something fast like SHA-256?",
            keyPoints: [
              { label: "Fast hashes make brute force cheap", keywords: ["fast", "brute", "guess", "gpu", "billions"] },
              { label: "bcrypt is intentionally slow with a cost factor", keywords: ["slow", "cost", "work factor", "rounds"] },
              { label: "Cost can be increased as hardware improves", keywords: ["increase", "adjust", "tunable", "future", "hardware"] },
            ],
            ideal:
              "SHA-256 is designed to be fast, so an attacker with GPUs can try billions of guesses per second. bcrypt is deliberately slow and has a cost factor you can raise as hardware gets faster, which makes brute-forcing leaked hashes far more expensive.",
          },
          {
            question: "What is a salt, and what attack does it protect against?",
            keyPoints: [
              { label: "Random value added to each password before hashing", keywords: ["random", "unique", "added", "append"] },
              { label: "Defeats rainbow / precomputed tables", keywords: ["rainbow", "precomputed", "lookup table"] },
              { label: "Same passwords produce different hashes", keywords: ["same password", "different hash", "identical"] },
            ],
            ideal:
              "A salt is a random, per-user value mixed into the password before hashing. Two users with the same password get different hashes, and precomputed rainbow tables become useless because the attacker would need a separate table for every salt.",
          },
        ],
      },
      {
        id: "be-rest",
        topic: "API design",
        question: "Now some API design. Design a REST API for a to-do app. What endpoints would you create?",
        keyPoints: [
          { label: "Resource-based routes (GET/POST /todos)", keywords: ["get /todos", "post", "/todos", "get"] },
          { label: "Update and delete by id (PUT/PATCH, DELETE /todos/:id)", keywords: ["put", "patch", "delete", ":id"] },
          { label: "Proper status codes (201, 400, 404)", keywords: ["201", "200", "400", "404", "status code"] },
          { label: "Authentication / per-user data", keywords: ["auth", "jwt", "token", "user"] },
        ],
        ideal:
          "GET /todos (list, with pagination), POST /todos (create, returns 201), GET /todos/:id, PATCH /todos/:id (update fields like completed), DELETE /todos/:id (204). Validate input (400), return 404 for missing items, and require auth so each user only sees their own to-dos.",
        followUps: [
          {
            when: ["pagination", "paginate", "limit", "offset", "page"],
            question: "You mentioned pagination. Offset or cursor-based, and when would you choose each?",
            keyPoints: [
              { label: "Offset: simple, supports jumping to a page", keywords: ["offset", "simple", "page number", "jump"] },
              { label: "Offset gets slow and inconsistent on large/changing data", keywords: ["slow", "large", "skip", "duplicate", "inconsistent"] },
              { label: "Cursor: stable and fast for feeds / infinite scroll", keywords: ["cursor", "infinite", "feed", "stable", "last id"] },
            ],
            ideal:
              "Offset pagination (LIMIT/OFFSET) is simple and lets users jump to page N, but it slows down on large tables and can skip or duplicate rows when data changes. Cursor pagination (WHERE id > lastId) is fast and stable, which suits feeds and infinite scroll.",
          },
          {
            question: "How would you make sure one user cannot read or edit another user's to-dos?",
            keyPoints: [
              { label: "Authenticate each request (JWT/session)", keywords: ["jwt", "token", "session", "auth", "middleware"] },
              { label: "Filter every query by the logged-in user's id", keywords: ["user_id", "userid", "where", "owner", "filter"] },
              { label: "Return 403/404 when it doesn't belong to them", keywords: ["403", "404", "forbidden", "not found"] },
            ],
            ideal:
              "An auth middleware verifies the JWT and attaches req.user. Every query includes the owner, e.g. WHERE id = $1 AND user_id = $2, so another user's to-do simply isn't found. Return 404 (or 403) instead of leaking that it exists.",
          },
        ],
      },
      {
        id: "be-slow",
        topic: "Performance",
        question: "Final one. An API endpoint becomes slow under load. How do you find and fix the bottleneck?",
        keyPoints: [
          { label: "Measure: logs, metrics, APM, profiling", keywords: ["log", "metric", "monitor", "apm", "profil", "measure"] },
          { label: "Check database queries and indexes (N+1)", keywords: ["query", "index", "n+1", "database", "explain"] },
          { label: "Add caching (Redis, HTTP cache)", keywords: ["cache", "redis"] },
          { label: "Scale or offload (load balancer, queue)", keywords: ["scale", "horizontal", "load balanc", "queue", "worker", "async"] },
        ],
        ideal:
          "Measure first: check latency metrics and traces to see where the time goes. Usually it's the database, so look at slow queries with EXPLAIN, add missing indexes and fix N+1 queries. Cache hot reads in Redis, move heavy work to a background queue, and scale horizontally behind a load balancer if CPU-bound.",
        followUps: [
          {
            when: ["index"],
            question: "You said you'd add an index. When can adding an index make things worse?",
            keyPoints: [
              { label: "Slows down writes (insert/update/delete)", keywords: ["write", "insert", "update", "delete", "slower"] },
              { label: "Uses extra storage/memory", keywords: ["storage", "space", "memory", "disk"] },
              { label: "Low-selectivity columns don't benefit", keywords: ["cardinality", "selectiv", "boolean", "few values"] },
            ],
            ideal:
              "Every index must be updated on insert/update/delete, so write-heavy tables get slower. Indexes also take storage and memory, and on low-cardinality columns (like a boolean) the planner may ignore them anyway.",
          },
          {
            when: ["cache", "redis"],
            question: "If you add a cache, how do you keep it consistent with the database?",
            keyPoints: [
              { label: "Invalidate or update the cache on writes", keywords: ["invalidat", "delete key", "update cache", "evict"] },
              { label: "Use a TTL so stale data expires", keywords: ["ttl", "expire", "expiry"] },
              { label: "Know the strategy (cache-aside, write-through) and accept some staleness", keywords: ["cache-aside", "write-through", "stale", "eventual"] },
            ],
            ideal:
              "Commonly cache-aside: read from the cache, fall back to the DB, then populate. On writes, update the DB and delete the cache key. Add a TTL as a safety net, and decide how much staleness the feature can tolerate.",
          },
          {
            question: "What does running EXPLAIN on a query tell you?",
            keyPoints: [
              { label: "The query plan the database will use", keywords: ["plan", "execution"] },
              { label: "Whether it uses an index or a full scan", keywords: ["index", "scan", "seq scan", "full table"] },
              { label: "Estimated cost / rows (ANALYZE for real timings)", keywords: ["cost", "rows", "analyze", "time"] },
            ],
            ideal:
              "EXPLAIN shows the execution plan: which indexes are used or whether it does a sequential scan, the join strategy, and estimated rows and cost. EXPLAIN ANALYZE actually runs it and shows real timings, which helps spot the slow step.",
          },
        ],
      },
    ],
  },
  {
    id: "hr",
    title: "HR / Behavioral",
    subtitle: "Communication, ownership and motivation",
    topics: "Introduction · Problem solving story · Motivation",
    questions: [
      {
        id: "hr-intro",
        topic: "Introduction",
        question: "To start, tell me a little about yourself.",
        keyPoints: [
          { label: "Current role or education", keywords: ["student", "working", "developer", "engineer", "graduat", "degree", "currently"] },
          { label: "Key skills or tech stack", keywords: ["skill", "react", "node", "javascript", "python", "java", "stack", "experience"] },
          { label: "A project or achievement", keywords: ["project", "built", "developed", "created", "achiev"] },
          { label: "What you're looking for next", keywords: ["looking", "goal", "want", "role", "opportunity", "interest"] },
        ],
        ideal:
          "Keep it to 60–90 seconds: who you are now (role or studies), the skills you're strongest in, one project or achievement with a result, and why you're interested in this kind of role. Present, past, future works well.",
        followUps: [
          {
            question: "What's the project you're most proud of, and what exactly was your part in it?",
            keyPoints: [
              { label: "Names a specific project", keywords: ["project", "app", "website", "system", "platform"] },
              { label: "Clear personal contribution (\"I built…\")", keywords: ["i built", "i designed", "i implemented", "i wrote", "i led", "my part", "i was responsible"] },
              { label: "A challenge you solved", keywords: ["challenge", "problem", "difficult", "issue", "bug"] },
              { label: "Result or impact", keywords: ["result", "users", "improved", "reduced", "%", "faster", "impact"] },
            ],
            ideal:
              "Pick one project, explain the goal in a sentence, then focus on what *you* did (\"I designed the auth flow…\"), the hardest problem you solved, and a concrete result such as users, speed or grade.",
          },
        ],
      },
      {
        id: "hr-problem",
        topic: "Problem solving",
        question: "Tell me about a time you faced a difficult bug or problem. How did you handle it?",
        keyPoints: [
          { label: "Situation: sets the context", keywords: ["when", "project", "working on", "situation", "once"] },
          { label: "Action: the steps you took", keywords: ["i ", "debug", "tried", "checked", "investigat", "found"] },
          { label: "Result: how it ended", keywords: ["fixed", "solved", "resolved", "result", "worked", "reduced", "improved"] },
          { label: "Learning", keywords: ["learn", "lesson", "now i", "since then", "taught"] },
        ],
        ideal:
          "Use STAR: Situation (what project, what broke), Task (your responsibility), Action (the specific debugging steps you took), Result (what got fixed and the impact) and one lesson you still apply today.",
        followUps: [
          {
            question: "Looking back, what would you do differently if it happened again?",
            keyPoints: [
              { label: "Honest reflection", keywords: ["would", "differently", "should have", "earlier", "sooner"] },
              { label: "Process improvement (tests, logs, reviews)", keywords: ["test", "log", "monitor", "review", "document"] },
              { label: "Communication with the team", keywords: ["team", "ask", "communicat", "help", "senior"] },
            ],
            ideal:
              "Show self-awareness: name one real thing, like adding tests or logging earlier, or asking for help sooner, and what you've changed in how you work since.",
          },
        ],
      },
      {
        id: "hr-motivation",
        topic: "Motivation",
        question: "Why do you want to work with us?",
        keyPoints: [
          { label: "Knows the company or product", keywords: ["product", "company", "your", "mission", "users", "customers"] },
          { label: "Connects the role to your skills", keywords: ["skill", "experience", "fit", "match", "role"] },
          { label: "Growth and learning", keywords: ["learn", "grow", "growth", "challenge"] },
          { label: "What you'll contribute", keywords: ["contribute", "add value", "help", "bring"] },
        ],
        ideal:
          "Show you've researched them: mention something specific about the product or mission, connect it to your skills and past work, and explain both what you'll contribute and how the role helps you grow.",
        followUps: [
          {
            question: "Where do you see yourself in the next two to three years?",
            keyPoints: [
              { label: "Growth in skills or depth", keywords: ["skill", "expert", "deeper", "master", "learn", "grow"] },
              { label: "More responsibility or ownership", keywords: ["responsib", "own", "lead", "senior", "mentor"] },
              { label: "Tied to this company or role", keywords: ["here", "this role", "team", "company"] },
            ],
            ideal:
              "Be realistic and tie it to the role: growing into a stronger engineer in the team's stack, owning bigger features, and eventually mentoring others, ideally while growing with this team.",
          },
        ],
      },
    ],
  },
];
