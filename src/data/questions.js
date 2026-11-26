/**
 * InterviewAce Structured Local Question Bank
 * Contains vetted questions across Core Tech, Web, Languages, CS Fundamentals, and HR/Behavioral tracks.
 */

export const QUESTION_BANK = [
  // --- JAVASCRIPT ---
  {
    id: 'js_01',
    type: 'Technical',
    category: 'JavaScript',
    difficulty: 'Medium',
    question: 'How does the JavaScript event loop work, and what is the difference between the microtask queue and macrotask queue?',
    sampleAnswer: 'The event loop continuously monitors the call stack and task queues. When the call stack is empty, it drains all pending microtasks (like Promise resolutions and queueMicrotask) before picking the next macrotask (such as setTimeout or setInterval).',
    keywords: ['call stack', 'microtask', 'macrotask', 'promises', 'event loop', 'asynchronous'],
  },
  {
    id: 'js_02',
    type: 'Technical',
    category: 'JavaScript',
    difficulty: 'Easy',
    question: 'Explain the difference between let, const, and var in terms of scope, hoisting, and re-assignment.',
    sampleAnswer: 'var is function-scoped and hoisted with undefined initialization. let and const are block-scoped and live in a temporal dead zone until declared. const cannot be reassigned, while let can.',
    keywords: ['scope', 'hoisting', 'temporal dead zone', 'block scope', 'reassignment'],
  },
  {
    id: 'js_03',
    type: 'Technical',
    category: 'JavaScript',
    difficulty: 'Hard',
    question: 'What is a closure in JavaScript, and what are practical use cases and potential memory leak pitfalls?',
    sampleAnswer: 'A closure is a function that remembers its outer lexical environment even after that outer function has executed. Practical uses include data privacy and factory functions. Potential leaks occur when unused references are unintentionally retained in memory.',
    keywords: ['closure', 'lexical scope', 'data privacy', 'memory leak', 'garbage collection'],
  },

  // --- REACT ---
  {
    id: 'react_01',
    type: 'Technical',
    category: 'React',
    difficulty: 'Medium',
    question: 'What triggers a re-render in a React component, and how do React.memo, useMemo, and useCallback help optimize performance?',
    sampleAnswer: 'A component re-renders when its state, props, or subscribed context changes. React.memo prevents re-renders when props do not shallowly change, while useMemo caches expensive calculations and useCallback preserves stable function references.',
    keywords: ['re-render', 'state', 'props', 'useMemo', 'useCallback', 'React.memo', 'shallow comparison'],
  },
  {
    id: 'react_02',
    type: 'Technical',
    category: 'React',
    difficulty: 'Medium',
    question: 'Explain the purpose of the useEffect hook and how cleanup functions prevent memory leaks or stale listeners.',
    sampleAnswer: 'useEffect synchronizes a component with external systems like APIs or event listeners. The optional cleanup function runs before the component unmounts or before the effect re-runs, unbinding listeners and aborting pending fetches.',
    keywords: ['useEffect', 'side effects', 'cleanup', 'dependency array', 'unmount'],
  },
  {
    id: 'react_03',
    type: 'Technical',
    category: 'React',
    difficulty: 'Hard',
    question: 'How does React Virtual DOM and reconciliation (Fiber) work to update the real browser DOM efficiently?',
    sampleAnswer: 'React keeps a virtual representation of the UI in memory. When state updates, Fiber calculates a diff between virtual trees and commits only the minimal batch of DOM modifications to optimize paint and layout times.',
    keywords: ['virtual DOM', 'reconciliation', 'diffing algorithm', 'fiber', 'commit phase'],
  },

  // --- HTML & CSS ---
  {
    id: 'web_01',
    type: 'Technical',
    category: 'HTML and CSS',
    difficulty: 'Easy',
    question: 'What is semantic HTML and why is it important for accessibility (a11y) and search engine optimization (SEO)?',
    sampleAnswer: 'Semantic HTML uses meaningful tags like <header>, <nav>, <article>, and <button> instead of generic <div> tags. This allows screen readers and search spiders to understand the structure and roles of page elements.',
    keywords: ['semantic HTML', 'accessibility', 'a11y', 'SEO', 'screen reader'],
  },
  {
    id: 'web_02',
    type: 'Technical',
    category: 'HTML and CSS',
    difficulty: 'Medium',
    question: 'Compare CSS Flexbox and CSS Grid. When would you use one over the other in modern web layouts?',
    sampleAnswer: 'Flexbox is designed for one-dimensional layouts (either a single row or column), ideal for alignment and distribution. Grid is two-dimensional, managing both rows and columns simultaneously for full-page structures.',
    keywords: ['flexbox', 'grid', 'one-dimensional', 'two-dimensional', 'layout'],
  },

  // --- JAVA ---
  {
    id: 'java_01',
    type: 'Technical',
    category: 'Java',
    difficulty: 'Medium',
    question: 'Explain the difference between HashMap and ConcurrentHashMap in Java. How is thread safety achieved?',
    sampleAnswer: 'HashMap is not synchronized and is not thread-safe. ConcurrentHashMap achieves thread safety through segment locking or bucket-level synchronized locks with lock-free reads, enabling high concurrent read/write throughput.',
    keywords: ['HashMap', 'ConcurrentHashMap', 'thread safety', 'synchronization', 'locking'],
  },
  {
    id: 'java_02',
    type: 'Technical',
    category: 'Java',
    difficulty: 'Easy',
    question: 'What is the JVM, and how does Garbage Collection automatically manage memory in Java?',
    sampleAnswer: 'The Java Virtual Machine executes compiled bytecode. The Garbage Collector automatically reclaims heap memory by tracking unreachable objects through generational algorithms (Young and Old generations).',
    keywords: ['JVM', 'garbage collection', 'heap', 'bytecode', 'generational'],
  },

  // --- PYTHON ---
  {
    id: 'py_01',
    type: 'Technical',
    category: 'Python',
    difficulty: 'Medium',
    question: 'What is the Global Interpreter Lock (GIL) in CPython and how does it affect CPU-bound multithreading?',
    sampleAnswer: 'The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once. This simplifies memory management but limits pure CPU-bound multithreading; multiprocessing or asyncio is used to achieve parallelism.',
    keywords: ['GIL', 'multithreading', 'CPython', 'multiprocessing', 'concurrency'],
  },
  {
    id: 'py_02',
    type: 'Technical',
    category: 'Python',
    difficulty: 'Easy',
    question: 'Explain Python list comprehensions and generators. What are the memory advantages of generators?',
    sampleAnswer: 'List comprehensions create an entire list in memory at once. Generators yield items lazily one at a time using the yield keyword, consuming minimal memory for large data sequences.',
    keywords: ['generators', 'yield', 'list comprehension', 'lazy evaluation', 'memory efficiency'],
  },

  // --- SQL & DBMS ---
  {
    id: 'sql_01',
    type: 'Technical',
    category: 'SQL',
    difficulty: 'Medium',
    question: 'What is the difference between WHERE and HAVING clauses in SQL, and when do you use GROUP BY?',
    sampleAnswer: 'WHERE filters rows before grouping and aggregations are applied. GROUP BY groups rows sharing values, and HAVING filters the aggregated results produced by GROUP BY.',
    keywords: ['WHERE', 'HAVING', 'GROUP BY', 'aggregation', 'filtering'],
  },
  {
    id: 'dbms_01',
    type: 'Technical',
    category: 'DBMS',
    difficulty: 'Medium',
    question: 'Explain ACID properties in database transaction management and why each is crucial.',
    sampleAnswer: 'Atomicity ensures all-or-nothing completion. Consistency guarantees state invariants are preserved. Isolation prevents concurrent transactions from interfering. Durability ensures committed changes survive system crashes.',
    keywords: ['ACID', 'Atomicity', 'Consistency', 'Isolation', 'Durability', 'transactions'],
  },
  {
    id: 'dbms_02',
    type: 'Technical',
    category: 'DBMS',
    difficulty: 'Hard',
    question: 'How do database indexes (like B-Trees) improve query performance, and what is the trade-off for write operations?',
    sampleAnswer: 'B-Tree indexes sort column keys in a balanced tree so reads take O(log N) rather than full table scans O(N). The trade-off is that every INSERT, UPDATE, or DELETE must also rewrite the index structure, adding write latency.',
    keywords: ['B-Tree', 'indexing', 'query performance', 'table scan', 'write overhead'],
  },

  // --- OOP ---
  {
    id: 'oop_01',
    type: 'Technical',
    category: 'OOP',
    difficulty: 'Easy',
    question: 'Explain the four core principles of Object-Oriented Programming with brief examples.',
    sampleAnswer: 'Encapsulation bundles data and methods while hiding internal state. Abstraction exposes only necessary interfaces. Inheritance allows child classes to derive parent behavior. Polymorphism enables different classes to respond to the same method call.',
    keywords: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism', 'classes'],
  },

  // --- OPERATING SYSTEMS ---
  {
    id: 'os_01',
    type: 'Technical',
    category: 'Operating Systems',
    difficulty: 'Medium',
    question: 'What is the difference between a process and a thread? How do context switching and shared memory differ between them?',
    sampleAnswer: 'A process is an independent program execution with its own address space. A thread is a lightweight execution unit within a process sharing the same address space. Context switching between processes is heavier due to memory page translation.',
    keywords: ['process', 'thread', 'address space', 'context switch', 'shared memory'],
  },
  {
    id: 'os_02',
    type: 'Technical',
    category: 'Operating Systems',
    difficulty: 'Hard',
    question: 'What is a deadlock, and what are the four Coffman conditions necessary for deadlock to happen?',
    sampleAnswer: 'A deadlock occurs when processes wait indefinitely for resources held by each other. The four conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
    keywords: ['deadlock', 'Coffman conditions', 'mutual exclusion', 'circular wait', 'concurrency'],
  },

  // --- COMPUTER NETWORKS ---
  {
    id: 'net_01',
    type: 'Technical',
    category: 'Computer Networks',
    difficulty: 'Medium',
    question: 'Describe the three-way handshake in TCP connection establishment and contrast TCP with UDP.',
    sampleAnswer: 'The TCP handshake involves SYN from client, SYN-ACK from server, and ACK from client. TCP is connection-oriented, reliable, and ordered, whereas UDP is connectionless, fast, and permits packet loss.',
    keywords: ['TCP', 'UDP', 'three-way handshake', 'SYN', 'ACK', 'reliable transport'],
  },
  {
    id: 'net_02',
    type: 'Technical',
    category: 'Computer Networks',
    difficulty: 'Medium',
    question: 'What happens when you type a URL into a browser address bar and press Enter?',
    sampleAnswer: 'The browser resolves the domain via DNS, establishes a TCP/TLS connection with the server, sends an HTTP request, receives an HTML payload, and renders the DOM/CSSOM via the critical rendering path.',
    keywords: ['DNS lookup', 'TCP', 'TLS', 'HTTP request', 'rendering engine'],
  },

  // --- DATA STRUCTURES & ALGORITHMS ---
  {
    id: 'dsa_01',
    type: 'Technical',
    category: 'Data Structures',
    difficulty: 'Medium',
    question: 'Explain the difference between Array and LinkedList in terms of memory layout and search vs insertion time complexity.',
    sampleAnswer: 'Arrays use contiguous memory allowing O(1) random index access but O(N) middle insertions. Linked lists use nodes with pointers, allowing O(1) insertions at known nodes but requiring O(N) sequential search.',
    keywords: ['array', 'linked list', 'contiguous memory', 'time complexity', 'pointers'],
  },
  {
    id: 'dsa_02',
    type: 'Technical',
    category: 'Data Structures',
    difficulty: 'Hard',
    question: 'How do you detect a cycle in a singly linked list? Describe Floyd Cycle-Finding algorithm.',
    sampleAnswer: 'Floyd Cycle detection uses two pointers: slow moving 1 step and fast moving 2 steps. If a cycle exists, the fast pointer will eventually meet the slow pointer in O(N) time and O(1) space.',
    keywords: ['Floyd algorithm', 'cycle detection', 'two pointers', 'linked list', 'slow and fast'],
  },

  // --- HR & BEHAVIORAL ---
  {
    id: 'hr_01',
    type: 'HR',
    category: 'General HR',
    difficulty: 'Easy',
    question: 'Tell me about yourself, your educational background, and what motivated you to pursue software development.',
    sampleAnswer: 'I am a final-year computer science student passionate about building intuitive web applications. Through coursework and collaborative team projects, I developed a strong foundation in modern web architecture.',
    keywords: ['background', 'motivation', 'experience', 'projects', 'strengths'],
  },
  {
    id: 'hr_02',
    type: 'HR',
    category: 'General HR',
    difficulty: 'Easy',
    question: 'What are your greatest professional strengths, and what is an area you are actively working to improve?',
    sampleAnswer: 'My strengths include rapid problem decomposition and clear cross-functional communication. An area I am improving is estimating time on novel technical tasks by breaking work into smaller milestones.',
    keywords: ['strengths', 'weaknesses', 'growth mindset', 'self-awareness', 'improvement'],
  },
  {
    id: 'beh_01',
    type: 'Behavioral',
    category: 'Behavioral interviews',
    difficulty: 'Medium',
    question: 'Describe a situation where you had a disagreement with a teammate during a group project. How did you resolve it?',
    sampleAnswer: 'During a sprint, we differed on whether to use client-side or server-side filtering. I proposed benchmarking both with sample payloads and aligning on user latency, which reached consensus objectively.',
    keywords: ['conflict resolution', 'teamwork', 'communication', 'STAR method', 'compromise'],
  },
  {
    id: 'beh_02',
    type: 'Behavioral',
    category: 'Behavioral interviews',
    difficulty: 'Medium',
    question: 'Tell me about a time you missed a project deadline or made a critical mistake in code. What steps did you take?',
    sampleAnswer: 'I once introduced an uncaught null reference bug during a demo milestone. I took immediate accountability, rolled back the commit, added test coverage, and documented the root cause to prevent recurrence.',
    keywords: ['accountability', 'recovery', 'root cause', 'learning from failure', 'resilience'],
  },
  {
    id: 'beh_03',
    type: 'Behavioral',
    category: 'Behavioral interviews',
    difficulty: 'Medium',
    question: 'How do you prioritize competing deadlines and manage stress when working on multiple academic or project deliverables?',
    sampleAnswer: 'I use the Eisenhower matrix to distinguish urgent from important tasks. I maintain transparent status updates with team members and break work into daily focused sprints.',
    keywords: ['time management', 'prioritization', 'focus', 'stress management', 'deliverables'],
  },
];

/**
 * Filter and retrieve questions tailored to a specific interview configuration.
 * @param {Object} config
 * @param {string} [config.interviewType='Technical'] - 'Technical' | 'HR' | 'Behavioral' | 'Mixed'
 * @param {string} [config.role='Software Engineer']
 * @param {string} [config.difficulty='Medium']
 * @param {number} [config.totalQuestions=5]
 * @param {Array<string>} [config.techStack=[]]
 * @returns {Array<Object>}
 */
export function getQuestionsForConfig(config = {}) {
  const {
    interviewType = 'Technical',
    role = 'Software Engineer',
    difficulty = 'Medium',
    totalQuestions = 5,
    techStack = [],
  } = config;

  let candidates = [...QUESTION_BANK];

  // 1. Filter by Interview Type
  if (interviewType === 'HR') {
    candidates = candidates.filter((q) => q.type === 'HR');
  } else if (interviewType === 'Behavioral') {
    candidates = candidates.filter((q) => q.type === 'Behavioral');
  } else if (interviewType === 'Technical') {
    candidates = candidates.filter((q) => q.type === 'Technical');
  }
  // If 'Mixed', keep both Technical, HR, and Behavioral

  // 2. Prioritize tech stack / role if available
  const normalizedRole = role.toLowerCase();
  const prioritized = [];
  const secondary = [];

  candidates.forEach((q) => {
    const qCat = q.category.toLowerCase();
    const matchesRole =
      (normalizedRole.includes('front') && (qCat.includes('react') || qCat.includes('html') || qCat.includes('javascript'))) ||
      (normalizedRole.includes('back') && (qCat.includes('sql') || qCat.includes('dbms') || qCat.includes('java') || qCat.includes('python'))) ||
      (normalizedRole.includes('data') && (qCat.includes('sql') || qCat.includes('python'))) ||
      (normalizedRole.includes('java') && qCat.includes('java')) ||
      (normalizedRole.includes('python') && qCat.includes('python'));

    const matchesTech = techStack.some((tech) => qCat.includes(tech.toLowerCase()));

    if (matchesRole || matchesTech) {
      prioritized.push(q);
    } else {
      secondary.push(q);
    }
  });

  // Combine prioritized then secondary
  const sorted = [...prioritized, ...secondary];

  // If filtered set is too small, fallback to all questions
  const finalPool = sorted.length >= totalQuestions ? sorted : QUESTION_BANK;

  // Pick totalQuestions
  const targetCount = Math.min(totalQuestions, finalPool.length);
  return finalPool.slice(0, targetCount).map((q, idx) => ({
    ...q,
    number: idx + 1,
    total: targetCount,
  }));
}
