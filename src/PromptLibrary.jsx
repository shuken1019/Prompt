import { useState, useMemo } from "react";

const CATEGORIES = ["전체", "생산성", "리서치", "콘텐츠", "AI 워크플로우", "자동화", "코딩", "범용", "마케팅", "세일즈", "고객관리", "제품", "엔지니어링", "글쓰기", "콘텐츠 전략", "SEO", "SaaS", "성장마케팅", "코드 작업", "생산성·시스템", "디버깅", "랜딩페이지", "수익화"];

const PROMPTS = [
  { id: "001", category: "생산성", title: "지식 관리 시스템", en: "Knowledge Management System", body: `Design a personal knowledge management system for [DESCRIBE PERSON AND WORK]. Cover how information is captured, organized, linked, retrieved, and how it is converted into output.` },
  { id: "002", category: "생산성", title: "교육·역량 개발 시스템", en: "Training and Development System", body: `Design a training and development system for [DESCRIBE TEAM]. Cover skills assessment, learning paths, delivery methods, progress tracking, and how learning connects to performance.` },
  { id: "003", category: "생산성", title: "고객 피드백 시스템", en: "Customer Feedback System", body: `Design a comprehensive customer feedback system for [DESCRIBE BUSINESS]. Cover all feedback touchpoints, how feedback is collected, analyzed, prioritized, actioned, and communicated back to customers.` },
  { id: "004", category: "생산성", title: "개인 자문단(Board of Directors)", en: "Personal Board of Directors", body: `Design a personal board of directors system for [DESCRIBE PERSON AND GOALS]. Cover who should be on it, how to recruit members, what the relationship looks like, and how to get maximum value from each advisor.` },
  { id: "005", category: "생산성", title: "인생 설계 시스템", en: "Life Design System", body: `Design a comprehensive life design system for [DESCRIBE PERSON]. Cover career, relationships, health, finances, learning, and personal fulfillment. Include how all areas are reviewed and balanced over time.` },
  { id: "006", category: "생산성", title: "벤더 선정 프레임워크", en: "Vendor Selection Framework", body: `Design a vendor selection framework for [DESCRIBE TYPE OF PURCHASE]. Cover requirements gathering, market scanning, RFP process, evaluation criteria, and decision documentation.` },
  { id: "007", category: "생산성", title: "제품 개발 시스템", en: "Product Development System", body: `Design a product development system for [DESCRIBE TEAM]. Cover discovery, prioritization, specification, design, development, testing, launch, and post-launch review.` },
  { id: "008", category: "생산성", title: "독서·노트 테이킹 시스템", en: "Reading and Note Taking System", body: `Design a system for reading and retaining insights from [DESCRIBE READING MATERIAL]. Cover selection criteria, active reading techniques, note taking format, review schedule, and how to apply insights.` },
  { id: "009", category: "생산성", title: "프로젝트 관리 템플릿", en: "Project Management Template", body: `Create a project management template for [DESCRIBE TYPE OF PROJECT]. Include project brief, stakeholder map, milestone plan, risk register, communication plan, and retrospective framework.` },
  { id: "010", category: "생산성", title: "성과 관리 시스템", en: "Performance Management System", body: `Design a performance management system for [DESCRIBE TEAM]. Cover goal setting, regular check-ins, performance reviews, recognition, and how to handle underperformance.` },
  { id: "011", category: "생산성", title: "집중·딥워크 시스템", en: "Focus and Deep Work System", body: `Design a system for protecting and maximizing deep work time for [DESCRIBE ROLE]. Cover environment design, scheduling, managing interruptions, and measuring output quality.` },
  { id: "012", category: "생산성", title: "조달(Procurement) 시스템", en: "Procurement System", body: `Design a procurement system for [DESCRIBE ORGANIZATION]. Cover how needs are identified, approved, sourced, contracted, and how supplier performance is managed.` },
  { id: "013", category: "생산성", title: "학습 시스템", en: "Learning System", body: `Design a system for learning [DESCRIBE SUBJECT OR SKILL] efficiently. Cover how to find the best resources, how to process and retain information, how to practice, and how to measure progress.` },
  { id: "014", category: "생산성", title: "커스터머 석세스 플레이북", en: "Customer Success Playbook", body: `Design a customer success playbook for [DESCRIBE PRODUCT]. Cover onboarding, health monitoring, QBRs, expansion plays, renewal process, and churn prevention.` },
  { id: "015", category: "생산성", title: "의사결정 프레임워크", en: "Decision Making Framework", body: `Create a decision making framework for [DESCRIBE TYPE OF DECISIONS]. Define what information is needed, who should be involved, how options should be evaluated, and how decisions should be documented.` },
  { id: "016", category: "생산성", title: "갈등 해결 프레임워크", en: "Conflict Resolution Framework", body: `Design a conflict resolution framework for [DESCRIBE CONTEXT]. Cover how conflicts are surfaced, the resolution process, who is involved, and how outcomes are documented.` },
  { id: "017", category: "생산성", title: "파트너십 관리 시스템", en: "Partnership Management System", body: `Design a system for managing strategic partnerships for [DESCRIBE COMPANY]. Cover partner onboarding, communication cadence, joint planning, performance tracking, and renewal process.` },
  { id: "018", category: "생산성", title: "세일즈 프로세스 시스템", en: "Sales Process System", body: `Design a sales process for [DESCRIBE PRODUCT AND MARKET]. Cover prospecting, qualification, discovery, proposal, negotiation, closing, and handoff to customer success.` },
  { id: "019", category: "생산성", title: "콘텐츠 제작 시스템", en: "Content Creation System", body: `Design a content creation system for producing [DESCRIBE CONTENT TYPE] consistently. Cover ideation, drafting, editing, production, distribution, and performance review.` },
  { id: "020", category: "생산성", title: "위기 관리 시스템", en: "Crisis Management System", body: `Design a crisis management system for [DESCRIBE ORGANIZATION]. Cover how crises are detected, classified, escalated, managed, communicated, and reviewed after resolution.` },
  { id: "021", category: "생산성", title: "위임 프레임워크", en: "Delegation Framework", body: `Design a delegation framework for [DESCRIBE MANAGER AND TEAM]. Cover what to delegate, how to brief tasks, what oversight is appropriate, and how to develop team members through delegation.` },
  { id: "022", category: "생산성", title: "OKR 시스템", en: "OKR System", body: `Design an OKR implementation for [DESCRIBE ORGANIZATION OR TEAM]. Cover how OKRs are set, cascaded, tracked, reviewed, and how they connect to compensation and recognition.` },
  { id: "023", category: "생산성", title: "아이디어 관리 시스템", en: "Idea Management System", body: `Design a system for capturing, developing, and acting on ideas for [DESCRIBE PERSON AND CONTEXT]. Cover how ideas are captured, evaluated, developed, prioritized, and either implemented or archived.` },
  { id: "024", category: "생산성", title: "습관 만들기 시스템", en: "Habit Building System", body: `Design a habit building system for adding [DESCRIBE HABITS] to a [DESCRIBE PERSON]'s routine. Cover habit design, tracking, accountability, recovery from missed days, and how to stack habits effectively.` },
  { id: "025", category: "생산성", title: "리스크 관리 시스템", en: "Risk Management System", body: `Design a risk management system for [DESCRIBE ORGANIZATION OR PROJECT]. Cover how risks are identified, assessed, prioritized, mitigated, monitored, and reported.` },
  { id: "026", category: "생산성", title: "문서화 시스템", en: "Documentation System", body: `Design a documentation system for [DESCRIBE TEAM OR PRODUCT]. Cover what needs to be documented, who is responsible, where it lives, how it stays current, and how people find what they need.` },
  { id: "027", category: "생산성", title: "위클리 리뷰 템플릿", en: "Weekly Review Template", body: `Create a weekly review template for [DESCRIBE PERSON AND GOALS]. Cover what got done, what did not, what was learned, priorities for next week, and any systems that need adjustment.` },
  { id: "028", category: "생산성", title: "클라이언트 관리 시스템", en: "Client Management System", body: `Design a client management system for [DESCRIBE FREELANCER OR AGENCY]. Cover onboarding, communication standards, project tracking, invoicing, and relationship maintenance.` },
  { id: "029", category: "생산성", title: "개인 재무 관리 시스템", en: "Personal Finance System", body: `Design a personal finance tracking and management system for [DESCRIBE FINANCIAL SITUATION AND GOALS]. Cover income tracking, expense categories, savings automation, investment review, and monthly reconciliation.` },
  { id: "030", category: "생산성", title: "모닝 루틴 설계", en: "Morning Routine Design", body: `Design an optimal morning routine for [DESCRIBE PERSON, GOALS, AND CONSTRAINTS]. Cover wake time, physical activity, mindset practices, planning, and how to make it sustainable long term.` },
  { id: "031", category: "생산성", title: "피드백 시스템", en: "Feedback System", body: `Design a system for giving and receiving feedback in [DESCRIBE CONTEXT]. Cover how feedback is solicited, delivered, received, processed, and acted upon.` },
  { id: "032", category: "생산성", title: "전략 기획 시스템", en: "Strategic Planning System", body: `Design a strategic planning system for [DESCRIBE ORGANIZATION]. Cover the annual planning cycle, how market intelligence informs strategy, how plans are communicated, and how execution is tracked.` },
  { id: "033", category: "생산성", title: "효과적인 미팅 시스템", en: "Meeting Effectiveness System", body: `Design a system for making meetings more effective for [DESCRIBE TEAM OR ORGANIZATION]. Cover when meetings should happen, how they are structured, how decisions are documented, and how follow-up is managed.` },
  { id: "034", category: "생산성", title: "네트워크 구축 시스템", en: "Network Building System", body: `Design a system for building and maintaining a professional network for [DESCRIBE PERSON AND GOALS]. Cover how to meet new people, how to stay in touch, how to provide value, and how to track relationships.` },
  { id: "035", category: "생산성", title: "채용 시스템", en: "Hiring System", body: `Design a hiring system for [DESCRIBE ROLE AND COMPANY]. Cover job scoping, sourcing, screening, interviews, assessment, offers, and onboarding. Minimize bias and time to hire.` },
  { id: "036", category: "생산성", title: "브랜드 관리 시스템", en: "Brand Management System", body: `Design a brand management system for [DESCRIBE BRAND]. Cover brand guidelines, approval processes, asset management, consistency monitoring, and how the brand evolves over time.` },
  { id: "037", category: "생산성", title: "회고(Retrospective) 시스템", en: "Retrospective System", body: `Design a retrospective system for [DESCRIBE TEAM]. Cover cadence, format, facilitation, how insights are captured, how action items are tracked, and how the team measures whether retrospectives are working.` },
  { id: "038", category: "생산성", title: "리서치·종합 시스템", en: "Research and Synthesis System", body: `Design a system for conducting research on [DESCRIBE TOPIC TYPE] and synthesizing it into actionable insights. Cover source selection, reading strategy, note-taking, synthesis, and output format.` },
  { id: "039", category: "생산성", title: "예산 관리 시스템", en: "Budget Management System", body: `Design a budget management system for [DESCRIBE CONTEXT]. Cover how budgets are set, tracked, reviewed, and how variances are identified and addressed.` },
  { id: "040", category: "생산성", title: "혁신 시스템", en: "Innovation System", body: `Design a system for generating and developing innovative ideas in [DESCRIBE ORGANIZATION]. Cover how ideas are submitted, evaluated, developed, resourced, and implemented.` },
  { id: "041", category: "생산성", title: "데이터 거버넌스 시스템", en: "Data Governance System", body: `Design a data governance system for [DESCRIBE ORGANIZATION]. Cover data ownership, quality standards, access controls, compliance requirements, and how data issues are reported and resolved.` },
  { id: "042", category: "생산성", title: "개인 생산성 진단", en: "Personal Productivity Audit", body: `Conduct a personal productivity audit framework for [DESCRIBE ROLE]. Cover how to identify time wasters, measure output versus activity, find leverage points, and redesign the workday.` },
  { id: "043", category: "생산성", title: "에너지 관리 시스템", en: "Energy Management System", body: `Design an energy management system for [DESCRIBE PERSON AND WORK]. Cover how to schedule tasks by energy level, recovery practices, nutrition and sleep optimization, and how to identify energy drains.` },
  { id: "044", category: "생산성", title: "콘텐츠 캘린더 시스템", en: "Content Calendar System", body: `Design a content calendar system for [DESCRIBE BRAND]. Cover how topics are generated, assigned, produced, reviewed, scheduled, and how performance informs future planning.` },
  { id: "045", category: "생산성", title: "목표 설정 프레임워크", en: "Goal Setting Framework", body: `Design a goal setting framework for [DESCRIBE CONTEXT]. Cover how goals are set, how they cascade to daily actions, how progress is tracked, and how to course correct when off track.` },
  { id: "046", category: "생산성", title: "팀 커뮤니케이션 시스템", en: "Team Communication System", body: `Design a team communication system for [DESCRIBE TEAM]. Cover which tools are used for what, response time expectations, meeting cadences, and how decisions and context are documented.` },
  { id: "047", category: "생산성", title: "오프보딩 시스템", en: "Offboarding System", body: `Design an employee offboarding system for [DESCRIBE ORGANIZATION]. Cover knowledge transfer, access revocation, exit interviews, equipment return, and maintaining the relationship for future reference.` },
  { id: "048", category: "생산성", title: "데일리 플래닝 시스템", en: "Daily Planning System", body: `Design a daily planning system for [DESCRIBE ROLE AND GOALS]. Include morning routine, time blocking, priority framework, end of day review, and how to handle interruptions and unexpected tasks.` },
  { id: "049", category: "생산성", title: "이메일 관리 시스템", en: "Email Management System", body: `Design a system for managing email for [DESCRIBE ROLE]. Cover inbox organization, response time standards, templates for common responses, and how to achieve and maintain inbox zero.` },
  { id: "050", category: "생산성", title: "분기 플래닝 시스템", en: "Quarterly Planning System", body: `Design a quarterly planning system for [DESCRIBE PERSON OR TEAM]. Cover how to review the previous quarter, set priorities for the next, allocate resources, and create accountability.` },
  { id: "051", category: "코딩", title: "레이트 리미터 구현", en: "Build a Rate Limiter", body: `Implement a rate limiter in [LANGUAGE] that allows [X] requests per [TIME PERIOD] per user. Handle edge cases and include a way to whitelist certain users.` },
  { id: "052", category: "코딩", title: "크론 잡 작성", en: "Build a Cron Job", body: `Write a cron job in [LANGUAGE] that [DESCRIBE TASK]. It should run [FREQUENCY], handle failures, and send an alert if something goes wrong.` },
  { id: "053", category: "코딩", title: "알림 시스템 구축", en: "Build a Notification System", body: `Design and implement a notification system that sends [EMAIL/SMS/PUSH] notifications when [DESCRIBE TRIGGERS]. Include templates, queuing, and delivery tracking.` },
  { id: "054", category: "코딩", title: "언어 간 코드 변환", en: "Translate Between Languages", body: `Translate this code from [LANGUAGE A] to [LANGUAGE B]. Maintain all functionality and use idiomatic patterns for the target language: [PASTE CODE]` },
  { id: "055", category: "코딩", title: "유닛 테스트 작성", en: "Write Unit Tests", body: `Write comprehensive unit tests for this function. Cover the happy path, edge cases, null inputs, and error conditions: [PASTE FUNCTION]` },
  { id: "056", category: "코딩", title: "문서화 작성", en: "Write Documentation", body: `Write clear developer documentation for this function including purpose, parameters, return values, example usage, and edge cases: [PASTE FUNCTION]` },
  { id: "057", category: "코딩", title: "API 엔드포인트 생성", en: "Generate API Endpoint", body: `Write a REST API endpoint in [LANGUAGE/FRAMEWORK] that [DESCRIBE WHAT IT SHOULD DO]. Include input validation, error handling, and proper HTTP status codes.` },
  { id: "058", category: "코딩", title: "웹 스크래퍼 만들기", en: "Build a Web Scraper", body: `Write a Python web scraper that extracts [DESCRIBE DATA] from [URL/TYPE OF SITE]. Handle pagination, rate limiting, and failed requests gracefully.` },
  { id: "059", category: "코딩", title: "보안 감사", en: "Security Audit", body: `Audit this code for security vulnerabilities. Check for SQL injection, XSS, authentication issues, exposed secrets, and any other risks: [PASTE CODE]` },
  { id: "060", category: "코딩", title: "데이터 스키마 설계", en: "Design a Data Schema", body: `Design a database schema for [DESCRIBE APPLICATION]. Include all tables, columns, data types, relationships, indexes, and explain your design decisions.` },
  { id: "061", category: "코딩", title: "성능 최적화", en: "Optimize Performance", body: `Analyze this code for performance bottlenecks. Identify the slowest parts and rewrite them to be more efficient: [PASTE CODE]` },
  { id: "062", category: "코딩", title: "파일 업로드 구현", en: "Implement File Upload", body: `Write a file upload handler in [FRAMEWORK] that accepts [FILE TYPES], validates size and type, stores files in [STORAGE], and returns a URL.` },
  { id: "063", category: "코딩", title: "에러 핸들링 추가", en: "Add Error Handling", body: `Add comprehensive error handling to this code. Catch all possible failures, log them appropriately, and fail gracefully: [PASTE CODE]` },
  { id: "064", category: "코딩", title: "가독성 높이는 리팩터링", en: "Refactor for Readability", body: `Refactor this code to be cleaner and more readable without changing its functionality. Add comments explaining complex logic: [PASTE CODE]` },
  { id: "065", category: "코딩", title: "에러 디버깅", en: "Debug This Error", body: `I am getting this error: [ERROR MESSAGE]. Here is the relevant code: [PASTE CODE]. Walk me through every possible cause and fix each one.` },
  { id: "066", category: "코딩", title: "상태 머신 작성", en: "Write a State Machine", body: `Implement a state machine for [DESCRIBE SYSTEM WITH STATES]. Define all states, transitions, guards, and actions.` },
  { id: "067", category: "코딩", title: "CI/CD 파이프라인 작성", en: "Write a CI/CD Pipeline", body: `Write a GitHub Actions workflow that runs tests, checks code quality, builds the application, and deploys to [PLATFORM] on every push to main.` },
  { id: "068", category: "코딩", title: "플러그인 시스템 설계", en: "Design a Plugin System", body: `Design a plugin architecture for [APPLICATION] that allows third party developers to extend functionality without modifying core code. Define the plugin interface and lifecycle hooks.` },
  { id: "069", category: "코딩", title: "타입스크립트로 변환", en: "Convert to TypeScript", body: `Convert this JavaScript code to TypeScript. Add proper type definitions for all variables, parameters, and return values: [PASTE CODE]` },
  { id: "070", category: "코딩", title: "비동기 함수로 변환", en: "Convert Function to Async", body: `Convert this synchronous function to async/await. Handle all promise rejections properly and maintain the same functionality: [PASTE FUNCTION]` },
  { id: "071", category: "코딩", title: "페이지네이션 구현", en: "Implement Pagination", body: `Add cursor-based pagination to this API endpoint. Include a page size limit, handle edge cases, and return proper metadata: [PASTE ENDPOINT CODE]` },
  { id: "072", category: "코딩", title: "설정 관리 시스템", en: "Build a Configuration System", body: `Design a configuration management system for [APPLICATION TYPE] that supports multiple environments, secret management, and runtime updates without restarts.` },
  { id: "073", category: "코딩", title: "CLI 도구 만들기", en: "Build a CLI Tool", body: `Write a command line tool in Python that [DESCRIBE FUNCTIONALITY]. Include argument parsing, error handling, help text, and a usage example.` },
  { id: "074", category: "코딩", title: "파서 작성", en: "Write a Parser", body: `Write a parser in [LANGUAGE] that reads [DESCRIBE FORMAT] and outputs [DESCRIBE OUTPUT]. Handle malformed input gracefully.` },
  { id: "075", category: "코딩", title: "헬스 체크 엔드포인트", en: "Write a Health Check Endpoint", body: `Write a health check endpoint for [FRAMEWORK] that checks database connectivity, external service availability, and system resources. Return appropriate HTTP status codes.` },
  { id: "076", category: "코딩", title: "웹훅 핸들러 작성", en: "Write a Webhook Handler", body: `Write a webhook handler in [FRAMEWORK] that receives events from [SERVICE]. Validate the signature, parse the payload, and handle [DESCRIBE EVENTS].` },
  { id: "077", category: "코딩", title: "미들웨어 작성", en: "Create a Middleware", body: `Write middleware for [FRAMEWORK] that [DESCRIBE WHAT IT SHOULD DO]. Make it reusable, well documented, and handle all edge cases.` },
  { id: "078", category: "코딩", title: "데이터 마이그레이션 스크립트", en: "Write a Data Migration Script", body: `Write a database migration script that [DESCRIBE WHAT IT NEEDS TO DO]. Make it idempotent, reversible, and safe to run on a production database.` },
  { id: "079", category: "코딩", title: "캐싱 전략 설계", en: "Design a Caching Strategy", body: `Design a caching strategy for [DESCRIBE SYSTEM]. What should be cached, for how long, when should it be invalidated, and what caching technology would you use?` },
  { id: "080", category: "코딩", title: "DB 쿼리 최적화", en: "Database Query Optimization", body: `This SQL query is running slowly: [PASTE QUERY]. Analyze it, explain why it is slow, and rewrite it to be faster. Suggest any indexes that would help.` },
  { id: "081", category: "코딩", title: "코드 아키텍처 리뷰", en: "Code Architecture Review", body: `Review this architecture and tell me what problems you foresee at scale. What would break first and how should I redesign it: [DESCRIBE OR PASTE ARCHITECTURE]` },
  { id: "082", category: "코딩", title: "통합 테스트 작성", en: "Write Integration Tests", body: `Write integration tests for this API endpoint that test the full request/response cycle including the database: [PASTE ENDPOINT CODE]` },
  { id: "083", category: "코딩", title: "로깅 시스템 구축", en: "Create a Logging System", body: `Implement structured logging for [APPLICATION TYPE] that includes request IDs, user context, performance timing, and integrates with [LOGGING SERVICE].` },
  { id: "084", category: "코딩", title: "리포트 생성기 만들기", en: "Build a Report Generator", body: `Write code that queries [DESCRIBE DATA SOURCE] and generates a [FORMAT] report showing [DESCRIBE METRICS]. Schedule it to run [FREQUENCY] and email it to [RECIPIENTS].` },
  { id: "085", category: "코딩", title: "이 코드 설명해줘", en: "Explain This Code", body: `Explain this code to me like I have never seen it before. What does it do, how does it work, and why is it written this way: [PASTE CODE]` },
  { id: "086", category: "코딩", title: "이벤트 시스템 설계", en: "Design an Event System", body: `Design an event-driven architecture for [DESCRIBE APPLICATION]. What events should exist, how should they be structured, and how should services communicate through them?` },
  { id: "087", category: "코딩", title: "마이크로서비스 설계", en: "Design a Microservice", body: `Design the architecture for a microservice that handles [DESCRIBE FUNCTIONALITY]. What endpoints does it need, how does it communicate with other services, and what does its data model look like?` },
  { id: "088", category: "코딩", title: "목(Mock) 데이터 생성", en: "Generate Mock Data", body: `Write a script that generates realistic mock data for [DESCRIBE DATA STRUCTURE]. Generate [NUMBER] records and output as JSON.` },
  { id: "089", category: "코딩", title: "피처 플래그 구현", en: "Implement Feature Flags", body: `Design and implement a feature flag system that allows enabling and disabling features per user, per percentage of traffic, or globally without deploying code.` },
  { id: "090", category: "코딩", title: "대시보드 백엔드 구축", en: "Build a Dashboard Backend", body: `Design and write the backend for a real-time dashboard that shows [DESCRIBE METRICS]. Include WebSocket support, data aggregation, and efficient querying.` },
  { id: "091", category: "코딩", title: "재시도 로직 구현", en: "Implement Retry Logic", body: `Add retry logic to this function that makes an external API call. Handle rate limits, transient errors, and use exponential backoff: [PASTE FUNCTION]` },
  { id: "092", category: "코딩", title: "정규식 작성", en: "Write a Regex", body: `Write a regex pattern that matches [DESCRIBE WHAT TO MATCH]. Explain each part of the pattern and show example matches and non-matches.` },
  { id: "093", category: "코딩", title: "부하 테스트 스크립트", en: "Write a Load Testing Script", body: `Write a load testing script using [TOOL] that simulates [NUMBER] concurrent users performing [DESCRIBE USER ACTIONS] and reports on response times and error rates.` },
  { id: "094", category: "코딩", title: "검색 기능 구현", en: "Implement Search Functionality", body: `Implement full-text search for [DESCRIBE DATA] using [TECHNOLOGY]. Include fuzzy matching, relevance scoring, and filtering by [FIELDS].` },
  { id: "095", category: "코딩", title: "SDK 만들기", en: "Create an SDK", body: `Design and write a basic SDK in [LANGUAGE] for the following API. Make it easy to use, well documented, and handle authentication automatically: [PASTE API SPEC]` },
  { id: "096", category: "코딩", title: "데이터 검증 구현", en: "Implement Data Validation", body: `Write a comprehensive data validation layer for this API. Validate all inputs, return clear error messages, and prevent any malformed data from reaching the database: [PASTE API SPEC]` },
  { id: "097", category: "코딩", title: "리액트 컴포넌트 최적화", en: "Optimize a React Component", body: `This React component is re-rendering too often and causing performance issues. Analyze it and fix the performance problems: [PASTE COMPONENT]` },
  { id: "098", category: "코딩", title: "큐 시스템 구축", en: "Build a Queue System", body: `Implement a job queue in [LANGUAGE] that processes [DESCRIBE JOBS]. Include priority levels, retry logic, dead letter handling, and a way to monitor queue depth.` },
  { id: "099", category: "코딩", title: "인증 시스템 구축", en: "Build an Authentication System", body: `Design and write a JWT authentication system in [FRAMEWORK]. Include signup, login, token refresh, logout, and protected route middleware.` },
  { id: "100", category: "코딩", title: "코드 리뷰", en: "Code Review", body: `Review this code as a senior engineer. Identify bugs, security vulnerabilities, performance issues, and style problems. Explain each issue and suggest a fix: [PASTE CODE]` },
  { id: "101", category: "AI 워크플로우", title: "프롬프트 체인 구성", en: "Build a Prompt Chain", body: `Design a multi-step prompt chain that takes [INPUT] and produces [OUTPUT]. Break it into discrete steps, define what each step does, and explain how outputs feed into the next step.` },
  { id: "102", category: "AI 워크플로우", title: "맞춤형 학습 시스템", en: "Create a Personalized Learning System", body: `Design an AI personalized learning system for [DESCRIBE SUBJECT]. How should knowledge gaps be identified, content difficulty be adjusted, and progress be measured?` },
  { id: "103", category: "AI 워크플로우", title: "프롬프트 템플릿 라이브러리", en: "Create a Prompt Template Library", body: `Create a library of 10 reusable prompt templates for [DESCRIBE USE CASE]. Each template should have placeholders, usage instructions, and example inputs and outputs.` },
  { id: "104", category: "AI 워크플로우", title: "분류 파이프라인 구축", en: "Build a Classification Pipeline", body: `Design an AI classification pipeline that categorizes [DESCRIBE INPUTS] into [DESCRIBE CATEGORIES]. Include data preprocessing, model selection, confidence thresholds, and handling of edge cases.` },
  { id: "105", category: "AI 워크플로우", title: "프롬프트 품질 평가", en: "Evaluate Prompt Quality", body: `Evaluate this prompt and tell me everything that is wrong with it. Then rewrite it to be more precise, consistent, and likely to produce the output I actually want: [PASTE PROMPT]` },
  { id: "106", category: "AI 워크플로우", title: "정보 추출 프롬프트", en: "Create an Extraction Prompt", body: `Write a prompt that extracts [DESCRIBE INFORMATION] from [DESCRIBE DOCUMENT TYPE]. Output as structured JSON. Handle missing fields gracefully and flag uncertain extractions.` },
  { id: "107", category: "AI 워크플로우", title: "콘텐츠 모더레이션 시스템", en: "Design a Content Moderation System", body: `Design an AI content moderation pipeline for [DESCRIBE PLATFORM]. What categories of content need to be detected, what confidence thresholds trigger action, and how is the human review queue managed?` },
  { id: "108", category: "AI 워크플로우", title: "문서 처리 파이프라인", en: "Create a Document Processing Pipeline", body: `Design a pipeline that ingests [DESCRIBE DOCUMENT TYPES], extracts structured data, validates it, and stores it in [DESCRIBE SYSTEM]. Handle OCR, various formats, and malformed inputs.` },
  { id: "109", category: "AI 워크플로우", title: "음성 AI 시스템 설계", en: "Design a Voice AI System", body: `Design a voice AI assistant for [DESCRIBE USE CASE]. How should speech be processed, what intents need to be recognized, and how should ambiguous requests be handled?` },
  { id: "110", category: "AI 워크플로우", title: "AI 글쓰기 어시스턴트", en: "Design an AI Writing Assistant", body: `Design an AI writing assistant for [DESCRIBE USE CASE]. What capabilities should it have, what constraints should it operate under, and how should it handle requests outside its scope?` },
  { id: "111", category: "AI 워크플로우", title: "이상 탐지 시스템", en: "Create an Anomaly Detection System", body: `Design an AI anomaly detection system for [DESCRIBE DATA]. What constitutes an anomaly, how should severity be classified, and what should happen when one is detected?` },
  { id: "112", category: "AI 워크플로우", title: "재고 관리 AI", en: "Create an Inventory Management AI", body: `Design an AI inventory management system for [DESCRIBE BUSINESS]. How should demand be forecasted, when should reorders be triggered, and how should seasonal patterns be handled?` },
  { id: "113", category: "AI 워크플로우", title: "질의응답 시스템 구축", en: "Build a Question Answering System", body: `Design a question answering system over [DESCRIBE KNOWLEDGE BASE]. How should documents be preprocessed, what retrieval strategy works best, and how should confidence be communicated to users?` },
  { id: "114", category: "AI 워크플로우", title: "지식 그래프 추출 파이프라인", en: "Build a Knowledge Graph Extraction Pipeline", body: `Design a pipeline that reads [DESCRIBE DOCUMENTS] and extracts entities, relationships, and facts into a knowledge graph. Define the schema and extraction prompts.` },
  { id: "115", category: "AI 워크플로우", title: "리서치 어시스턴트 구축", en: "Build a Research Assistant", body: `Design an AI research assistant that can [DESCRIBE RESEARCH TASKS]. How should it search, synthesize information, cite sources, and flag low confidence conclusions?` },
  { id: "116", category: "AI 워크플로우", title: "계약서 분석 파이프라인", en: "Build a Contract Analysis Pipeline", body: `Design an AI pipeline that analyzes contracts and flags [DESCRIBE RISK TYPES]. What clauses should trigger alerts, how should confidence be communicated, and when should a lawyer review?` },
  { id: "117", category: "AI 워크플로우", title: "요약 파이프라인 구축", en: "Create a Summarization Pipeline", body: `Design a pipeline that processes [DESCRIBE CONTENT TYPE] and produces [DESCRIBE SUMMARY FORMAT]. Handle varying lengths, extract key entities, and flag content that needs human review.` },
  { id: "118", category: "AI 워크플로우", title: "휴먼 인 더 루프 시스템", en: "Design a Human in the Loop System", body: `Design a system where AI handles [DESCRIBE TASKS] autonomously but routes edge cases to humans. Define the confidence thresholds, escalation paths, and how human feedback is incorporated.` },
  { id: "119", category: "AI 워크플로우", title: "피드백 루프 시스템", en: "Build a Feedback Loop System", body: `Design a system where AI outputs are evaluated, feedback is collected, and the system improves over time for [DESCRIBE USE CASE]. How is quality measured and what triggers retraining?` },
  { id: "120", category: "AI 워크플로우", title: "리드 스코어링 시스템", en: "Design a Lead Scoring System", body: `Design an AI lead scoring system for [DESCRIBE BUSINESS]. What signals predict conversion, how should scores be calculated, and how should the sales team use them?` },
  { id: "121", category: "AI 워크플로우", title: "AI 모니터링 시스템", en: "Build a Monitoring System for AI", body: `Design a monitoring system for an AI pipeline that tracks output quality, latency, cost, and failure rates. What alerts should exist and what dashboards should be built?` },
  { id: "122", category: "AI 워크플로우", title: "기술 지원 AI", en: "Create a Technical Support AI", body: `Design an AI technical support system for [DESCRIBE PRODUCT]. How should it diagnose problems, when should it escalate, and how should it learn from resolved tickets?` },
  { id: "123", category: "AI 워크플로우", title: "데이터 보강 워크플로우", en: "Create a Data Enrichment Workflow", body: `Design a workflow that takes [DESCRIBE INPUT DATA] and enriches it with [DESCRIBE ADDITIONAL INFORMATION] using AI. Define the steps, prompts, and how to handle failures.` },
  { id: "124", category: "AI 워크플로우", title: "감성 분석 시스템", en: "Create a Sentiment Analysis System", body: `Design a sentiment analysis system for [DESCRIBE DATA SOURCE]. What dimensions of sentiment matter, how should nuance be handled, and how should results be aggregated and reported?` },
  { id: "125", category: "AI 워크플로우", title: "AI 스케줄링 시스템", en: "Create an AI Scheduling System", body: `Design an AI scheduling system for [DESCRIBE USE CASE]. How should it handle conflicts, priorities, constraints, and last minute changes?` },
  { id: "126", category: "AI 워크플로우", title: "번역 워크플로우 설계", en: "Design a Translation Workflow", body: `Design an AI translation workflow for [DESCRIBE CONTENT TYPE] from [SOURCE LANGUAGE] to [TARGET LANGUAGES]. How should terminology consistency be maintained and how should quality be validated?` },
  { id: "127", category: "AI 워크플로우", title: "공급망 인텔리전스 시스템", en: "Design a Supply Chain Intelligence System", body: `Design an AI system that monitors [DESCRIBE SUPPLY CHAIN] and predicts disruptions, optimizes inventory, and recommends actions. What data sources are critical?` },
  { id: "128", category: "AI 워크플로우", title: "재무 분석 에이전트", en: "Design a Financial Analysis Agent", body: `Design an AI agent that analyzes [DESCRIBE FINANCIAL DATA] and produces [DESCRIBE OUTPUTS]. What data sources does it need, what calculations should it perform, and how should uncertainty be communicated?` },
  { id: "129", category: "AI 워크플로우", title: "코드 리뷰 AI 설계", en: "Design a Code Review AI", body: `Design an AI code review system that automatically reviews pull requests for [DESCRIBE STANDARDS]. What should it check, how should feedback be formatted, and what issues should block merges?` },
  { id: "130", category: "AI 워크플로우", title: "시스템 프롬프트 작성", en: "Create a System Prompt", body: `Write a system prompt for an AI assistant that works as a [DESCRIBE ROLE] for [DESCRIBE COMPANY/USE CASE]. Define its personality, capabilities, limitations, and how it should handle edge cases.` },
  { id: "131", category: "AI 워크플로우", title: "멀티 에이전트 시스템 설계", en: "Design a Multi-Agent System", body: `Design a multi-agent system where [NUMBER] AI agents collaborate to accomplish [DESCRIBE GOAL]. Define each agent's role, how they communicate, and how conflicts are resolved.` },
  { id: "132", category: "AI 워크플로우", title: "품질 관리 AI", en: "Design a Quality Control AI", body: `Design an AI quality control system for [DESCRIBE PRODUCT OR PROCESS]. What defects should be detected, what accuracy is acceptable, and how should borderline cases be handled?` },
  { id: "133", category: "AI 워크플로우", title: "소셜미디어 모니터링 시스템", en: "Build a Social Media Monitoring System", body: `Design an AI system that monitors social media for [DESCRIBE TOPICS OR BRANDS]. What signals matter, how should sentiment be tracked, and what triggers an urgent alert?` },
  { id: "134", category: "AI 워크플로우", title: "개인화 엔진 설계", en: "Design a Personalization Engine", body: `Design an AI personalization system for [DESCRIBE APPLICATION]. What signals should be used, how should recommendations be generated, and how should it handle new users with no history?` },
  { id: "135", category: "AI 워크플로우", title: "예측 정비 시스템", en: "Build a Predictive Maintenance System", body: `Design an AI predictive maintenance system for [DESCRIBE EQUIPMENT OR SYSTEM]. What signals predict failure, how far in advance can failures be predicted, and what actions should be triggered?` },
  { id: "136", category: "AI 워크플로우", title: "AI 평가 프레임워크", en: "Build an AI Evaluation Framework", body: `Design a framework for evaluating the quality of AI outputs for [DESCRIBE USE CASE]. What metrics matter, how should they be measured, and what does good versus bad look like?` },
  { id: "137", category: "AI 워크플로우", title: "뉴스 큐레이션 시스템", en: "Build a News Aggregation System", body: `Design an AI news aggregation and summarization system for [DESCRIBE TOPICS]. How should sources be ranked, bias be detected, and duplicate stories be deduplicated?` },
  { id: "138", category: "AI 워크플로우", title: "컴플라이언스 체크 시스템", en: "Create a Compliance Checking System", body: `Design an AI compliance checking system that validates [DESCRIBE CONTENT OR ACTIONS] against [DESCRIBE REGULATIONS]. How should violations be categorized and what remediation steps should be suggested?` },
  { id: "139", category: "AI 워크플로우", title: "리스크 평가 프레임워크", en: "Create a Risk Assessment Framework", body: `Design an AI risk assessment system for [DESCRIBE DOMAIN]. What risk factors should be analyzed, how should they be weighted, and what output format helps decision makers act?` },
  { id: "140", category: "AI 워크플로우", title: "경쟁 정보 수집 시스템", en: "Create a Competitive Intelligence System", body: `Design an AI system that monitors [DESCRIBE COMPETITORS] and produces weekly intelligence reports covering [DESCRIBE AREAS]. What data sources should it monitor and how should insights be prioritized?` },
  { id: "141", category: "AI 워크플로우", title: "트렌드 탐지 시스템", en: "Build a Trend Detection System", body: `Design an AI system that monitors [DESCRIBE DATA SOURCES] and identifies emerging trends in [DESCRIBE DOMAIN]. How should trends be validated and how should false positives be filtered?` },
  { id: "142", category: "AI 워크플로우", title: "가격 최적화 시스템", en: "Design a Price Optimization System", body: `Design an AI pricing system for [DESCRIBE BUSINESS]. What factors should influence pricing, how should competitor prices be monitored, and how should price changes be validated before going live?` },
  { id: "143", category: "AI 워크플로우", title: "미팅 인텔리전스 시스템", en: "Design a Meeting Intelligence System", body: `Design an AI system that processes meeting transcripts and produces [DESCRIBE OUTPUTS: action items, summaries, decisions]. How should it handle multiple speakers and ambiguous assignments?` },
  { id: "144", category: "AI 워크플로우", title: "RAG 시스템 설계", en: "Design a RAG System", body: `Design a Retrieval Augmented Generation system for [DESCRIBE USE CASE]. What data should be indexed, how should it be chunked, what embedding model should be used, and how should retrieval be structured?` },
  { id: "145", category: "AI 워크플로우", title: "AI 온보딩 시스템", en: "Design an AI Onboarding System", body: `Design an AI system that onboards new [EMPLOYEES/CUSTOMERS] by answering questions, guiding them through processes, and tracking their progress. How should gaps in knowledge be identified?` },
  { id: "146", category: "AI 워크플로우", title: "사기 탐지 시스템", en: "Build a Fraud Detection System", body: `Design an AI fraud detection system for [DESCRIBE TRANSACTION TYPE]. What signals indicate fraud, how should false positive rates be managed, and what happens when fraud is detected?` },
  { id: "147", category: "AI 워크플로우", title: "AI 에이전트 설계", en: "Design an AI Agent", body: `Design an AI agent that can [DESCRIBE GOAL]. What tools does it need, what decisions should it make autonomously, what should require human approval, and how should it handle failures?` },
  { id: "148", category: "AI 워크플로우", title: "제안서 자동 생성 시스템", en: "Build a Proposal Generation System", body: `Design an AI system that generates business proposals for [DESCRIBE BUSINESS]. What inputs does it need, what sections should proposals include, and how should customization work?` },
  { id: "149", category: "AI 워크플로우", title: "콘텐츠 추천 엔진", en: "Build a Content Recommendation Engine", body: `Design a content recommendation engine for [DESCRIBE PLATFORM]. What signals drive recommendations, how should diversity be maintained, and how should new content be handled?` },
  { id: "150", category: "AI 워크플로우", title: "AI 고객 서비스 에이전트", en: "Create an AI Customer Service Agent", body: `Design an AI customer service agent for [DESCRIBE BUSINESS]. What questions can it answer, when should it escalate to a human, and how should it handle frustrated customers?` },
  { id: "151", category: "콘텐츠", title: "이벤트 초대 카피", en: "Event Invitation Copy", body: `Write invitation copy for [DESCRIBE EVENT]. Create urgency, communicate the specific value of attending, address who should come, and make the registration CTA impossible to ignore.` },
  { id: "152", category: "콘텐츠", title: "이슈·논쟁 관점글", en: "Controversy Take", body: `Write a take on [TOPIC] that challenges the mainstream view in [INDUSTRY/COMMUNITY]. Make the argument boldly, back it with evidence, and anticipate the strongest objections.` },
  { id: "153", category: "콘텐츠", title: "오피니언 칼럼", en: "Opinion Piece", body: `Write a strong opinion piece arguing that [DESCRIBE POSITION] on the topic of [TOPIC]. Make the argument clearly, acknowledge counterarguments honestly, and end with a call to rethink conventional wisdom.` },
  { id: "154", category: "콘텐츠", title: "케이스 스터디", en: "Case Study", body: `Write a customer case study for [DESCRIBE CUSTOMER AND OUTCOME]. Structure it as: the challenge, the solution, the implementation, and the measurable results. Make it specific and credible.` },
  { id: "155", category: "콘텐츠", title: "영상 광고 스크립트", en: "Video Ad Script", body: `Write a 60-second video ad script for [DESCRIBE PRODUCT]. Hook in the first 5 seconds, present the problem, introduce the solution, show the benefit, and end with a clear CTA.` },
  { id: "156", category: "콘텐츠", title: "후기 요청 이메일", en: "Testimonial Request Email", body: `Write an email asking [DESCRIBE CUSTOMER] for a testimonial for [DESCRIBE PRODUCT]. Make it easy to respond, suggest the format, and explain how it will be used.` },
  { id: "157", category: "콘텐츠", title: "랜딩 페이지 카피", en: "Landing Page Copy", body: `Write landing page copy for [DESCRIBE PRODUCT OR SERVICE]. Include a headline, subheadline, hero section, features section, social proof, FAQ, and a strong CTA. Optimize for conversion.` },
  { id: "158", category: "콘텐츠", title: "투자자 업데이트 이메일", en: "Investor Update Email", body: `Write a monthly investor update email for [DESCRIBE COMPANY]. Cover progress against goals, key metrics, wins, challenges, what you need, and what you are focused on next month.` },
  { id: "159", category: "콘텐츠", title: "유튜브 스크립트", en: "YouTube Script", body: `Write a YouTube video script about [TOPIC]. Include a hook in the first 30 seconds, chapter markers, engaging transitions, a call to subscribe, and a strong ending that drives comments.` },
  { id: "160", category: "콘텐츠", title: "소트 리더십 아티클", en: "Thought Leadership Article", body: `Write a thought leadership article establishing [NAME] as an authority on [TOPIC]. Share a contrarian or original insight, back it with evidence or experience, and challenge the reader to think differently.` },
  { id: "161", category: "콘텐츠", title: "인터뷰 질문지", en: "Interview Questions", body: `Write 20 deep interview questions for [DESCRIBE GUEST] that will produce insightful, quotable answers. Avoid generic questions and get to the insights your audience actually wants.` },
  { id: "162", category: "콘텐츠", title: "에버그린 콘텐츠", en: "Evergreen Content Piece", body: `Write an evergreen content piece on [TOPIC] that will still be relevant in five years. Focus on principles over tactics, include timeless examples, and structure it for easy reference.` },
  { id: "163", category: "콘텐츠", title: "뉴스레터 한 호", en: "Newsletter Issue", body: `Write a newsletter issue on [TOPIC] for [DESCRIBE AUDIENCE]. Include an opening hook, the main insight, a practical takeaway, and a closing thought that leaves them thinking.` },
  { id: "164", category: "콘텐츠", title: "제품 소개 문구", en: "Product Description", body: `Write a compelling product description for [DESCRIBE PRODUCT]. Focus on benefits not features, address the main customer pain point, include social proof, and end with a clear CTA.` },
  { id: "165", category: "콘텐츠", title: "장문 아티클", en: "Long Form Article", body: `Write a 1500 word article about [TOPIC] for [DESCRIBE AUDIENCE]. Lead with a compelling hook, use subheadings, include specific examples, and end with a memorable conclusion.` },
  { id: "166", category: "콘텐츠", title: "책 요약", en: "Book Summary", body: `Write a comprehensive summary of [BOOK TITLE]. Cover the core thesis, the most important ideas, the best frameworks, key quotes, and what actions a reader should take after reading it.` },
  { id: "167", category: "콘텐츠", title: "SEO 아티클", en: "SEO Article", body: `Write a 2000 word SEO-optimized article targeting the keyword [KEYWORD]. Include the keyword naturally, use proper heading structure, answer the search intent, and include internal and external link opportunities.` },
  { id: "168", category: "콘텐츠", title: "어워드 지원서", en: "Awards Submission", body: `Write an awards submission for [DESCRIBE COMPANY OR PROJECT] for the [DESCRIBE AWARD]. Highlight the most relevant achievements, use specific metrics, and make the case for why this deserves to win.` },
  { id: "169", category: "콘텐츠", title: "소셜미디어 캘린더", en: "Social Media Calendar", body: `Create a 30-day social media content calendar for [DESCRIBE BRAND] on [PLATFORMS]. Include post topics, formats, optimal posting times, and hashtag strategies.` },
  { id: "170", category: "콘텐츠", title: "연말 결산 리뷰", en: "Year in Review", body: `Write a year in review post for [DESCRIBE PERSON OR COMPANY]. Cover the biggest wins, the hardest lessons, what changed your thinking, and what you are most excited about for next year. Be honest and specific.` },
  { id: "171", category: "콘텐츠", title: "워크숍 커리큘럼", en: "Workshop Curriculum", body: `Design a half-day workshop curriculum on [TOPIC] for [DESCRIBE AUDIENCE]. Include learning objectives, session breakdown, activities, materials needed, and how you will measure success.` },
  { id: "172", category: "콘텐츠", title: "FAQ 페이지", en: "FAQ Page", body: `Write a comprehensive FAQ page for [DESCRIBE PRODUCT OR SERVICE]. Anticipate the real questions customers have including objections and concerns, and answer each one clearly and honestly.` },
  { id: "173", category: "콘텐츠", title: "이메일 캠페인", en: "Email Campaign", body: `Write a 3-email campaign for [DESCRIBE GOAL]. Email 1 builds awareness. Email 2 builds desire. Email 3 drives action. Each should have a strong subject line and a clear CTA.` },
  { id: "174", category: "콘텐츠", title: "파트너십 제안서", en: "Partnership Proposal", body: `Write a partnership proposal to [DESCRIBE POTENTIAL PARTNER] from [DESCRIBE YOUR COMPANY]. Make the value to both parties clear, propose specific collaboration mechanics, and suggest concrete next steps.` },
  { id: "175", category: "콘텐츠", title: "자기소개·어바웃 페이지", en: "Bio and About Page", body: `Write a compelling bio for [DESCRIBE PERSON] for use on [DESCRIBE CONTEXT]. Make it authoritative but human, highlight the most relevant credentials, and end with what they are working on now.` },
  { id: "176", category: "콘텐츠", title: "비교 아티클", en: "Comparison Article", body: `Write a comparison article between [OPTION A] and [OPTION B] for [DESCRIBE USE CASE]. Be balanced, specific, and help the reader make the right choice for their situation.` },
  { id: "177", category: "콘텐츠", title: "연간 보고서 내러티브", en: "Annual Report Narrative", body: `Write the narrative sections of an annual report for [DESCRIBE COMPANY]. Cover the year in review, key achievements, challenges overcome, and vision for the year ahead. Tone should be honest and forward-looking.` },
  { id: "178", category: "콘텐츠", title: "제품 업데이트 공지", en: "Product Update Announcement", body: `Write an announcement for the product update [DESCRIBE UPDATE]. Lead with the user benefit, explain what changed and why, include any necessary instructions, and end with what is coming next.` },
  { id: "179", category: "콘텐츠", title: "채용 공고", en: "Job Description", body: `Write a job description for a [JOB TITLE] at [DESCRIBE COMPANY]. Make the role compelling to the right candidate, be honest about challenges, describe the impact they will have, and list only the requirements that actually matter.` },
  { id: "180", category: "콘텐츠", title: "세일즈 이메일 시퀀스", en: "Sales Email Sequence", body: `Write a 5-email cold outreach sequence for [DESCRIBE OFFER] targeting [DESCRIBE PROSPECT]. Each email should be short, personalized, and move the conversation forward without being pushy.` },
  { id: "181", category: "콘텐츠", title: "제품 로드맵 커뮤니케이션", en: "Product Roadmap Communication", body: `Write a communication to [DESCRIBE AUDIENCE] explaining the product roadmap for [DESCRIBE PRODUCT]. Explain the strategic direction, what is coming when, and what it means for them.` },
  { id: "182", category: "콘텐츠", title: "재참여(Re-engagement) 캠페인", en: "Re-Engagement Campaign", body: `Write a 3-email re-engagement campaign for [DESCRIBE INACTIVE SEGMENT]. Acknowledge the gap, offer genuine value to come back, and give them a clear reason to re-engage now.` },
  { id: "183", category: "콘텐츠", title: "보도자료", en: "Press Release", body: `Write a press release announcing [DESCRIBE NEWS]. Follow AP style, lead with the most newsworthy angle, include quotes from [NAME/TITLE], and end with a boilerplate and contact information.` },
  { id: "184", category: "콘텐츠", title: "웨비나 프레젠테이션", en: "Webinar Presentation", body: `Create a 45-minute webinar presentation outline on [TOPIC]. Include audience engagement questions, a value packed middle section, and a strong close that drives registrations for [NEXT STEP].` },
  { id: "185", category: "콘텐츠", title: "팟캐스트 에피소드 개요", en: "Podcast Episode Outline", body: `Create a detailed outline for a podcast episode on [TOPIC]. Include an intro hook, 5 main segments with talking points, guest questions if applicable, and a closing CTA.` },
  { id: "186", category: "콘텐츠", title: "온보딩 이메일 시리즈", en: "Onboarding Email Series", body: `Write a 7-email onboarding series for new [CUSTOMERS/USERS] of [DESCRIBE PRODUCT]. Each email should help them get one specific value as quickly as possible and build toward full adoption.` },
  { id: "187", category: "콘텐츠", title: "추천(리퍼럴) 프로그램 카피", en: "Referral Program Copy", body: `Write the copy for a customer referral program for [DESCRIBE PRODUCT]. Include the program explanation, the offer, how it works, the terms, and promotional messages for customers to share.` },
  { id: "188", category: "콘텐츠", title: "화이트페이퍼", en: "White Paper", body: `Write an executive summary and outline for a white paper on [TOPIC]. Target audience is [DESCRIBE]. The paper should establish authority, present original research or insight, and recommend action.` },
  { id: "189", category: "콘텐츠", title: "개념 설명 콘텐츠", en: "Explainer Content", body: `Write an explainer for [COMPLEX TOPIC] aimed at [DESCRIBE AUDIENCE]. Use analogies and examples to make it accessible, avoid jargon, and leave the reader feeling like they actually understand it.` },
  { id: "190", category: "콘텐츠", title: "위기 커뮤니케이션 성명", en: "Crisis Communication Statement", body: `Write a crisis communication statement for [DESCRIBE SITUATION]. Acknowledge the issue directly, take appropriate responsibility, explain what is being done, and communicate what stakeholders can expect next.` },
  { id: "191", category: "콘텐츠", title: "그랜트 제안서 내러티브", en: "Grant Proposal Narrative", body: `Write the narrative section of a grant proposal for [DESCRIBE PROJECT] seeking funding from [DESCRIBE FUNDER]. Make the case for impact, explain the approach, demonstrate capability, and align with funder priorities.` },
  { id: "192", category: "콘텐츠", title: "리서치 리포트 요약문", en: "Research Report Executive Summary", body: `Write a 500-word executive summary for a research report on [TOPIC]. Distill the key findings, highlight the most surprising insights, and state the recommended actions clearly.` },
  { id: "193", category: "콘텐츠", title: "커뮤니티 포스트", en: "Community Post", body: `Write an engaging community post for [DESCRIBE COMMUNITY] on [TOPIC]. Start a conversation, share something genuinely useful, and end with a question that invites responses.` },
  { id: "194", category: "콘텐츠", title: "피치덱 내러티브", en: "Pitch Deck Narrative", body: `Write the narrative for a pitch deck for [DESCRIBE COMPANY]. Cover the problem, solution, market, traction, team, and ask. Make each slide advance the story compellingly.` },
  { id: "195", category: "콘텐츠", title: "제품 출시 이메일", en: "Product Launch Email", body: `Write a product launch email for [DESCRIBE PRODUCT] to [DESCRIBE AUDIENCE]. Build anticipation, communicate the key benefit clearly, create urgency, and drive clicks to [DESCRIBE CTA].` },
  { id: "196", category: "콘텐츠", title: "링크드인 포스트", en: "LinkedIn Post", body: `Write a LinkedIn post about [TOPIC] that is professional but personal. Share a specific experience or insight, make it relevant to [DESCRIBE AUDIENCE], and end with a question that drives comments.` },
  { id: "197", category: "콘텐츠", title: "브랜드 스토리", en: "Brand Story", body: `Write the brand story for [COMPANY]. Cover the founding moment, the problem being solved, the mission, what makes the company different, and where it is going. Make it human and memorable.` },
  { id: "198", category: "콘텐츠", title: "바이럴 트위터 쓰레드", en: "Viral Twitter Thread", body: `Write a viral Twitter thread about [TOPIC]. Start with a scroll-stopping hook. Each tweet should deliver a standalone insight. End with a strong call to action. My audience is [DESCRIBE AUDIENCE].` },
  { id: "199", category: "콘텐츠", title: "하우투 가이드", en: "How To Guide", body: `Write a comprehensive how-to guide for [DESCRIBE TASK] aimed at [DESCRIBE AUDIENCE]. Break it into clear steps, include common mistakes to avoid, and add pro tips throughout.` },
  { id: "200", category: "콘텐츠", title: "커뮤니티 가이드라인", en: "Community Guidelines", body: `Write community guidelines for [DESCRIBE COMMUNITY]. Cover what behavior is expected, what is not allowed, how violations are handled, and the values that underpin the rules. Make them human not legalistic.` },
  { id: "201", category: "리서치", title: "가정 매핑", en: "Assumption Mapping", body: `Map all the assumptions underlying [DESCRIBE PLAN OR BELIEF]. Categorize them by how critical they are and how uncertain they are. Which assumptions most need to be tested?` },
  { id: "202", category: "리서치", title: "상대 주장 강화 분석", en: "Argument Steel-Manning", body: `Steel-man the argument that [CONTROVERSIAL POSITION]. Present the strongest possible version of this argument as its best advocate would make it. Then identify its weakest points.` },
  { id: "203", category: "리서치", title: "GTM(시장 진입) 분석", en: "Go to Market Analysis", body: `Analyze the go to market strategy for [DESCRIBE PRODUCT]. Who is the beachhead customer, what is the sales motion, how does word of mouth work, and what drives viral growth?` },
  { id: "204", category: "리서치", title: "트렌드 분석", en: "Trend Analysis", body: `Analyze the trend of [DESCRIBE TREND]. How long has it been building, what is driving it, how durable is it, and what are its second and third order effects?` },
  { id: "205", category: "리서치", title: "경쟁사 분석", en: "Competitive Analysis", body: `Analyze [COMPANY/PRODUCT] against its top 5 competitors. Compare on [DIMENSIONS]. Identify where it leads, where it lags, and where the biggest opportunities are.` },
  { id: "206", category: "리서치", title: "투자 논리 분석", en: "Investment Thesis Analysis", body: `Analyze the investment thesis for [COMPANY/ASSET]. What has to be true for this to be a good investment, what are the key risks, and what would change your view?` },
  { id: "207", category: "리서치", title: "채널 분석", en: "Channel Analysis", body: `Analyze the distribution channels for [DESCRIBE PRODUCT OR SERVICE]. Which channels reach the target customer most efficiently, what are the economics of each, and what is the optimal mix?` },
  { id: "208", category: "리서치", title: "오퍼레이션 분석", en: "Operations Analysis", body: `Analyze the operations of [DESCRIBE BUSINESS]. Where are the bottlenecks, what processes are most critical, where is waste occurring, and what would have the highest impact to improve?` },
  { id: "209", category: "리서치", title: "가설 도출", en: "Hypothesis Generation", body: `Generate 10 testable hypotheses about [DESCRIBE PHENOMENON OR PROBLEM]. For each, describe what evidence would confirm or refute it and how it could be tested.` },
  { id: "210", category: "리서치", title: "엑시트 전략 분석", en: "Exit Strategy Analysis", body: `Analyze potential exit strategies for [DESCRIBE COMPANY OR INVESTMENT]. What acquirers would be interested and why, what would drive valuation, and what is the realistic timeline?` },
  { id: "211", category: "리서치", title: "인재 분석", en: "Talent Analysis", body: `Analyze the talent landscape for [DESCRIBE ROLE OR SKILL]. Where is the talent, what do they want, how competitive is hiring, and what would make [COMPANY] attractive to them?` },
  { id: "212", category: "리서치", title: "갭 분석", en: "Gap Analysis", body: `Conduct a gap analysis between [CURRENT STATE] and [DESIRED STATE] for [DESCRIBE CONTEXT]. What are the gaps, what causes them, and what would close them most efficiently?` },
  { id: "213", category: "리서치", title: "역사적 패턴 분석", en: "Historical Pattern Analysis", body: `Analyze historical examples of [DESCRIBE SITUATION OR PATTERN]. What patterns emerge, what caused success or failure, and what lessons apply to [CURRENT SITUATION]?` },
  { id: "214", category: "리서치", title: "기술 로드맵 분석", en: "Technology Roadmap Analysis", body: `Analyze the technology roadmap for [DESCRIBE TECHNOLOGY AREA]. What are the key milestones, what breakthroughs are needed, and what is the realistic timeline for [DESCRIBE CAPABILITY]?` },
  { id: "215", category: "리서치", title: "규제 환경 분석", en: "Regulatory Landscape Analysis", body: `Analyze the regulatory landscape for [DESCRIBE INDUSTRY OR ACTIVITY] in [GEOGRAPHY]. What regulations apply, what is changing, and what are the compliance risks?` },
  { id: "216", category: "리서치", title: "프리모템 분석", en: "Pre-Mortem Analysis", body: `Conduct a pre-mortem for [DESCRIBE PLAN]. Imagine it is 12 months from now and this has failed. What went wrong, why did it fail, and what could have been done differently?` },
  { id: "217", category: "리서치", title: "계절성 분석", en: "Seasonality Analysis", body: `Analyze the seasonality patterns in [DESCRIBE BUSINESS OR MARKET]. How pronounced are they, what drives them, and how should strategy and operations adapt?` },
  { id: "218", category: "리서치", title: "제1원리 분석", en: "First Principles Analysis", body: `Break down [PROBLEM/INDUSTRY/ASSUMPTION] from first principles. What are the irreducible truths, what assumptions are people making that might be wrong, and what does this suggest?` },
  { id: "219", category: "리서치", title: "정책 분석", en: "Policy Analysis", body: `Analyze the policy [DESCRIBE POLICY] from multiple stakeholder perspectives. Who benefits, who is harmed, what are the intended and unintended consequences, and what alternatives exist?` },
  { id: "220", category: "리서치", title: "유추 추론", en: "Analogical Reasoning", body: `Find 5 historical or cross-industry analogies for [DESCRIBE SITUATION]. What can each analogy teach us and where does the analogy break down?` },
  { id: "221", category: "리서치", title: "고객 리서치 종합", en: "Customer Research Synthesis", body: `Synthesize these customer interviews and identify the most important patterns: [PASTE INTERVIEW NOTES OR TRANSCRIPTS]. What are the key pain points, desires, and surprising insights?` },
  { id: "222", category: "리서치", title: "가격 결정력 분석", en: "Pricing Power Analysis", body: `Analyze the pricing power of [COMPANY OR PRODUCT]. Can prices be raised without losing customers, what justifies premium pricing, and what limits pricing power?` },
  { id: "223", category: "리서치", title: "브랜드 분석", en: "Brand Analysis", body: `Analyze the brand of [COMPANY]. What does it stand for, how is it perceived, what is its equity, and what would strengthen or damage it?` },
  { id: "224", category: "리서치", title: "플랫폼 vs 프로덕트 분석", en: "Platform vs Product Analysis", body: `Analyze whether [DESCRIBE OFFERING] should be a product or a platform. What are the economics of each, what would make a platform successful, and what are the risks of each path?` },
  { id: "225", category: "리서치", title: "시장 규모 추정", en: "Market Size Estimation", body: `Estimate the market size for [DESCRIBE MARKET]. Use a bottom-up approach, show your assumptions clearly, and give a range rather than a single number.` },
  { id: "226", category: "리서치", title: "네트워크 효과 분석", en: "Network Effects Analysis", body: `Analyze the network effects dynamics in [DESCRIBE MARKET OR PRODUCT]. What type of network effects exist, how strong are they, and what does this mean for competitive dynamics?` },
  { id: "227", category: "리서치", title: "의사결정 프레임워크", en: "Decision Framework", body: `Build a decision framework for [DESCRIBE DECISION TYPE]. What factors matter, how should they be weighted, what information is needed, and what does a good decision process look like?` },
  { id: "228", category: "리서치", title: "근본 원인 분석", en: "Root Cause Analysis", body: `Conduct a root cause analysis of [DESCRIBE PROBLEM OR FAILURE]. Use the five whys method, identify contributing factors, and recommend actions that address root causes not symptoms.` },
  { id: "229", category: "리서치", title: "SWOT 분석", en: "SWOT Analysis", body: `Conduct a deep SWOT analysis for [COMPANY/PROJECT/IDEA]. Go beyond surface level observations and identify second-order implications of each factor.` },
  { id: "230", category: "리서치", title: "시나리오 플래닝", en: "Scenario Planning", body: `Develop three scenarios for [DESCRIBE SITUATION]: a base case, an optimistic case, and a pessimistic case. What would cause each to occur and how should we prepare for each?` },
  { id: "231", category: "리서치", title: "멘탈 모델 적용", en: "Mental Model Application", body: `Apply the mental model of [DESCRIBE MENTAL MODEL] to analyze [DESCRIBE SITUATION]. What does this lens reveal that a conventional analysis would miss?` },
  { id: "232", category: "리서치", title: "해자(Moat) 분석", en: "Moat Analysis", body: `Analyze the competitive moat of [COMPANY]. What sustainable advantages does it have, how durable are they, and what would erode them?` },
  { id: "233", category: "리서치", title: "데이터 해석", en: "Data Interpretation", body: `Interpret this data: [PASTE DATA OR DESCRIBE DATASET]. What are the key insights, what is surprising, what questions does it raise, and what decisions does it support?` },
  { id: "234", category: "리서치", title: "수요·공급 분석", en: "Supply and Demand Analysis", body: `Analyze the supply and demand dynamics for [DESCRIBE MARKET]. What drives demand, what constrains supply, how tight is the market, and what would shift the balance?` },
  { id: "235", category: "리서치", title: "문헌 조사", en: "Literature Review", body: `Summarize the current state of research on [TOPIC]. What is well established, what is contested, what are the major schools of thought, and what are the key open questions?` },
  { id: "236", category: "리서치", title: "심층 리서치 브리프", en: "Deep Research Brief", body: `Research [TOPIC] comprehensively. Cover the current state, key players, recent developments, open questions, and what experts disagree about. Structure as a research brief.` },
  { id: "237", category: "리서치", title: "파트너십 전략 분석", en: "Partnership Strategy Analysis", body: `Analyze potential partnership strategies for [DESCRIBE COMPANY]. What types of partners would create the most value, what would make a partnership successful, and what are the risks?` },
  { id: "238", category: "리서치", title: "벤치마크 분석", en: "Benchmark Analysis", body: `Benchmark [DESCRIBE SUBJECT] against industry best practices and top performers. Where does it rank, what specifically do the best performers do differently, and what is the improvement path?` },
  { id: "239", category: "리서치", title: "혁신 분석", en: "Innovation Analysis", body: `Analyze the innovation landscape in [DESCRIBE FIELD]. Where is innovation happening, who are the key innovators, what approaches are being tried, and where are the white spaces?` },
  { id: "240", category: "리서치", title: "전문가 관점 종합", en: "Expert Synthesis", body: `You are synthesizing the views of five leading experts on [TOPIC]. Present the areas of consensus, the key disagreements, and what the weight of expert opinion suggests.` },
  { id: "241", category: "리서치", title: "기술 평가", en: "Technology Assessment", body: `Assess the technology [DESCRIBE TECHNOLOGY] for use in [DESCRIBE CONTEXT]. Evaluate maturity, capabilities, limitations, costs, alternatives, and implementation risks.` },
  { id: "242", category: "리서치", title: "비즈니스 모델 분석", en: "Business Model Analysis", body: `Analyze the business model of [COMPANY]. How does it make money, what are its unit economics, what drives growth, what are its vulnerabilities, and how defensible is it?` },
  { id: "243", category: "리서치", title: "이해관계자 분석", en: "Stakeholder Analysis", body: `Map the stakeholders for [DESCRIBE PROJECT OR DECISION]. Who has power, who is affected, what does each party want, and how should each be engaged?` },
  { id: "244", category: "리서치", title: "인구통계 분석", en: "Demographic Analysis", body: `Analyze the demographic trends affecting [DESCRIBE MARKET OR INDUSTRY]. What shifts are occurring, how fast, and what are the implications for the next 10 years?` },
  { id: "245", category: "리서치", title: "JTBD(할 일 중심) 분석", en: "Jobs to Be Done Analysis", body: `Apply the Jobs to Be Done framework to understand why customers hire [DESCRIBE PRODUCT OR SERVICE]. What functional, emotional, and social jobs is it doing?` },
  { id: "246", category: "리서치", title: "이탈(Churn) 분석 프레임워크", en: "Churn Analysis Framework", body: `Design a framework for analyzing customer churn in [DESCRIBE BUSINESS]. What are the leading indicators, what segments churn most, and what interventions are most effective?` },
  { id: "247", category: "리서치", title: "2차 효과 분석", en: "Second Order Effects", body: `Analyze the second and third order effects of [DESCRIBE DECISION OR TREND]. Go beyond the obvious first order effects and identify what most people are missing.` },
  { id: "248", category: "리서치", title: "밸류체인 분석", en: "Value Chain Analysis", body: `Map the value chain for [DESCRIBE INDUSTRY]. Where is value created, where is it captured, where are the margins, and where is disruption most likely to occur?` },
  { id: "249", category: "리서치", title: "리스크 분석", en: "Risk Analysis", body: `Conduct a comprehensive risk analysis for [DESCRIBE PROJECT OR DECISION]. Identify all risks, assess likelihood and impact, prioritize them, and suggest mitigations for the top five.` },
  { id: "250", category: "리서치", title: "인과 관계 분석", en: "Causal Chain Analysis", body: `Map the causal chain from [ROOT CAUSE] to [OUTCOME]. What are all the links in the chain, where could intervention have the most impact, and what feedback loops exist?` },
  { id: "251", category: "자동화", title: "모니터링 알람 시스템", en: "Build a Monitoring Alert System", body: `Design an automated monitoring system for [DESCRIBE WHAT IS BEING MONITORED]. What metrics trigger alerts, how are alerts prioritized, and what information is included in each alert?` },
  { id: "252", category: "자동화", title: "데이터 파이프라인 구축", en: "Build a Data Pipeline", body: `Design a data pipeline that takes [DESCRIBE INPUT], transforms it by [DESCRIBE TRANSFORMATIONS], and loads it into [DESCRIBE DESTINATION]. Include error handling and monitoring.` },
  { id: "253", category: "자동화", title: "Zapier 워크플로우 설계", en: "Zapier Workflow Design", body: `Design a Zapier workflow that automates [DESCRIBE PROCESS]. Define the trigger, all the steps in sequence, what data is passed between steps, and how errors are handled.` },
  { id: "254", category: "자동화", title: "리드 퀄리파이 봇", en: "Build a Lead Qualification Bot", body: `Design an automated lead qualification system that [DESCRIBE HOW LEADS COME IN], asks qualifying questions, scores them against [DESCRIBE CRITERIA], and routes them to the right person.` },
  { id: "255", category: "자동화", title: "파트너 리포팅 자동화", en: "Automate Partner Reporting", body: `Design an automation that compiles performance data for [DESCRIBE PARTNER PROGRAM], generates partner-specific reports, and distributes them on a defined schedule.` },
  { id: "256", category: "자동화", title: "채용 공고·스크리닝 자동화", en: "Automate Job Posting and Screening", body: `Design an automation for the recruitment process that posts jobs, screens applications against [CRITERIA], schedules interviews for qualified candidates, and sends rejections.` },
  { id: "257", category: "자동화", title: "소셜 리스닝·응대 자동화", en: "Automate Social Listening and Response", body: `Design an automation that monitors social media for mentions of [BRAND/TOPICS], classifies them by sentiment and urgency, and routes to the right person for response.` },
  { id: "258", category: "자동화", title: "컴플라이언스 모니터링", en: "Build a Compliance Monitoring System", body: `Design an automation that monitors [DESCRIBE ACTIVITIES] for compliance with [REGULATIONS], flags potential violations, and generates audit-ready reports.` },
  { id: "259", category: "자동화", title: "CRM 자동화", en: "Build a CRM Automation", body: `Design automations for [CRM SYSTEM] that handle [DESCRIBE SCENARIOS]. What triggers each automation, what actions does it take, and how does it update records?` },
  { id: "260", category: "자동화", title: "웹훅 이벤트 처리 시스템", en: "Build a Webhook Event Processing System", body: `Design a system that receives webhook events from [DESCRIBE SERVICES], routes them to the right handlers, processes them reliably, and handles retries and failures.` },
  { id: "261", category: "자동화", title: "고객 온보딩 자동화", en: "Build a Customer Onboarding Automation", body: `Design an automated customer onboarding flow for [DESCRIBE PRODUCT]. What happens at each step, what triggers the next step, and how are stuck customers identified and helped?` },
  { id: "262", category: "자동화", title: "문서 결재 워크플로우", en: "Build a Document Approval Workflow", body: `Design an automated document approval workflow for [DESCRIBE DOCUMENT TYPE]. Who reviews at each stage, what triggers advancement, and how are rejections handled?` },
  { id: "263", category: "자동화", title: "학습 관리(LMS) 자동화", en: "Build a Learning Management Automation", body: `Design automations for [LMS PLATFORM] that assign courses based on [CRITERIA], send reminders, track completion, report to managers, and issue certificates.` },
  { id: "264", category: "자동화", title: "프로덕트 애널리틱스 리포팅", en: "Automate Product Analytics Reporting", body: `Design an automation that pulls product usage data from [DESCRIBE SOURCES], calculates key metrics, generates a weekly product health report, and distributes it to stakeholders.` },
  { id: "265", category: "자동화", title: "고객 윈백 자동화", en: "Automate Customer Win-Back", body: `Design an automated win-back campaign for churned customers. What triggers it, what is the sequence of messages, what offers are made, and when does it give up?` },
  { id: "266", category: "자동화", title: "성과 평가 자동화", en: "Automate Performance Reviews", body: `Design an automated performance review process that collects peer feedback, self assessments, and manager input, aggregates it, and generates review documents.` },
  { id: "267", category: "자동화", title: "재고 자동 발주 시스템", en: "Build an Inventory Reorder System", body: `Design an automation that monitors inventory levels for [DESCRIBE PRODUCTS], triggers reorder when stock falls below [THRESHOLD], generates purchase orders, and tracks delivery.` },
  { id: "268", category: "자동화", title: "이메일 자동 시퀀스", en: "Email Automation Sequence", body: `Design an automated email sequence for [DESCRIBE PURPOSE]. Write the copy for each email, define the triggers and timing, and explain the goal of each message.` },
  { id: "269", category: "자동화", title: "콘텐츠 퍼블리싱 파이프라인", en: "Build a Content Publishing Pipeline", body: `Design an automated content publishing pipeline that takes a draft, runs it through [DESCRIBE CHECKS], formats it for [PLATFORMS], schedules publication, and tracks distribution.` },
  { id: "270", category: "자동화", title: "콘텐츠 모더레이션 파이프라인", en: "Build a Content Moderation Pipeline", body: `Design an automated content moderation pipeline for [DESCRIBE PLATFORM]. What checks run automatically, what goes to human review, and how are appeals handled?` },
  { id: "271", category: "자동화", title: "고객 지원 티켓 자동 분류", en: "Automate Customer Support Triage", body: `Design an automation that receives support requests, categorizes them by type and priority, routes them to the right team, and sends acknowledgment to the customer.` },
  { id: "272", category: "자동화", title: "재무 정산 자동화", en: "Automate Financial Reconciliation", body: `Design an automation that reconciles [DESCRIBE ACCOUNTS] by matching transactions, flagging discrepancies, generating exception reports, and updating records after review.` },
  { id: "273", category: "자동화", title: "가격 모니터링 시스템", en: "Build a Price Monitoring System", body: `Design an automation that monitors competitor prices for [DESCRIBE PRODUCTS] across [CHANNELS], alerts when significant changes occur, and provides recommendations.` },
  { id: "274", category: "자동화", title: "데이터 품질 모니터링", en: "Build a Data Quality Monitoring System", body: `Design an automation that monitors [DESCRIBE DATA SOURCES] for quality issues, alerts when data is missing or anomalous, and generates data quality scorecards.` },
  { id: "275", category: "자동화", title: "그랜트·제안서 관리 자동화", en: "Automate Grant and Proposal Management", body: `Design an automation that tracks grant deadlines, compiles required documents, routes for review and approval, submits applications, and tracks outcomes.` },
  { id: "276", category: "자동화", title: "구독 관리 시스템", en: "Build a Subscription Management System", body: `Design automations for managing [DESCRIBE SUBSCRIPTION BUSINESS]. Handle signups, upgrades, downgrades, failed payments, renewals, and cancellations automatically.` },
  { id: "277", category: "자동화", title: "지식 베이스 업데이트 시스템", en: "Build a Knowledge Base Update System", body: `Design an automation that monitors [DESCRIBE SOURCES] for new information, suggests updates to [KNOWLEDGE BASE], routes them for approval, and publishes approved updates.` },
  { id: "278", category: "자동화", title: "인보이스 처리 자동화", en: "Automate Invoice Processing", body: `Design an automation that receives invoices by [METHOD], extracts key data, validates it against [DESCRIBE RULES], routes for approval, and updates [ACCOUNTING SYSTEM].` },
  { id: "279", category: "자동화", title: "벤더 관리 자동화", en: "Automate Vendor Management", body: `Design automations for vendor management including onboarding, contract renewals, performance reviews, invoice processing, and off-boarding.` },
  { id: "280", category: "자동화", title: "리포트 자동 생성", en: "Automate Report Generation", body: `Design an automation that pulls data from [DESCRIBE SOURCES], calculates [DESCRIBE METRICS], generates a [FORMAT] report, and sends it to [RECIPIENTS] every [FREQUENCY].` },
  { id: "281", category: "자동화", title: "계약서 자동 생성", en: "Automate Contract Generation", body: `Design an automation that takes [DESCRIBE INPUTS], selects the right contract template, populates it with the correct data, and routes it for signatures via [E-SIGNATURE TOOL].` },
  { id: "282", category: "자동화", title: "A/B 테스트 자동화", en: "Build an A/B Testing Automation", body: `Design a system that sets up A/B tests for [DESCRIBE WHAT IS BEING TESTED], monitors results, determines statistical significance, implements winners, and documents learnings.` },
  { id: "283", category: "자동화", title: "피드백 수집 시스템", en: "Build a Feedback Collection System", body: `Design an automated feedback collection system for [DESCRIBE TOUCHPOINTS]. When does it trigger, what questions does it ask, how is data aggregated, and how are action items generated?` },
  { id: "284", category: "자동화", title: "위기 커뮤니케이션 자동화", en: "Build a Crisis Communication Automation", body: `Design an automated crisis communication system that detects [DESCRIBE TRIGGER EVENTS], activates the response team, drafts communications, and manages the approval and distribution process.` },
  { id: "285", category: "자동화", title: "고객 커뮤니케이션 자동화", en: "Build a Customer Communication Automation", body: `Design an automation that triggers personalized communications to customers based on [DESCRIBE BEHAVIORS OR EVENTS]. What messages are sent, when, and through which channels?` },
  { id: "286", category: "자동화", title: "사용자 라이프사이클 자동화", en: "Build a User Lifecycle Automation", body: `Design automated workflows for each stage of the user lifecycle for [DESCRIBE PRODUCT]: activation, engagement, retention, re-engagement, and win-back.` },
  { id: "287", category: "자동화", title: "파트너 연동 자동화", en: "Build a Partner Integration Automation", body: `Design an automation that handles data exchange with [DESCRIBE PARTNER SYSTEM]. How does data flow, how are conflicts resolved, and how are errors handled?` },
  { id: "288", category: "자동화", title: "수작업 프로세스 매핑", en: "Map a Manual Process", body: `I do this task manually: [DESCRIBE TASK]. Map every step in detail, identify which steps could be automated, and design an automation that handles the full workflow.` },
  { id: "289", category: "자동화", title: "경쟁사 모니터링 자동화", en: "Automate Competitive Monitoring", body: `Design an automation that monitors [DESCRIBE COMPETITORS] for changes to [DESCRIBE WHAT TO MONITOR] and delivers a weekly digest with the most important changes.` },
  { id: "290", category: "자동화", title: "직원 온보딩 자동화", en: "Automate Employee Onboarding", body: `Design an automated employee onboarding workflow that handles account creation, equipment provisioning, training assignments, introduction emails, and 30/60/90 day check-ins.` },
  { id: "291", category: "자동화", title: "세일즈 예측 자동화", en: "Automate Sales Forecasting", body: `Design an automation that pulls data from [CRM AND OTHER SOURCES], applies [DESCRIBE FORECASTING MODEL], generates weekly forecast reports, and flags deals needing attention.` },
  { id: "292", category: "자동화", title: "경비 관리 자동화", en: "Automate Expense Management", body: `Design an automation that processes expense submissions, validates against [DESCRIBE POLICY], routes for approval, rejects non-compliant expenses, and exports to payroll.` },
  { id: "293", category: "자동화", title: "마켓 리서치 수집 자동화", en: "Automate Market Research Collection", body: `Design an automation that monitors [DESCRIBE SOURCES] for market intelligence on [TOPICS], filters for relevance, deduplicates, and delivers a curated daily briefing.` },
  { id: "294", category: "자동화", title: "고객 헬스 스코어 자동화", en: "Automate Customer Health Scoring", body: `Design an automation that monitors [DESCRIBE CUSTOMER SIGNALS], calculates health scores, segments customers by risk, and triggers appropriate outreach for at-risk accounts.` },
  { id: "295", category: "자동화", title: "릴리즈 관리 자동화", en: "Build a Release Management Automation", body: `Design an automated release management process for [DESCRIBE APPLICATION]. How are releases staged, tested, approved, deployed, and monitored?` },
  { id: "296", category: "자동화", title: "소셜미디어 자동 게시", en: "Automate Social Media Posting", body: `Design an automation that takes content from [DESCRIBE SOURCE], formats it for [PLATFORMS], schedules it for optimal times, and tracks performance. What tools would you use?` },
  { id: "297", category: "자동화", title: "미팅 팔로업 자동화", en: "Automate Meeting Follow-Ups", body: `Design an automation that processes meeting transcripts, extracts action items, assigns them to owners, creates tasks in [PROJECT MANAGEMENT TOOL], and sends follow-up emails.` },
  { id: "298", category: "자동화", title: "IT 티켓 자동 라우팅", en: "Automate IT Ticket Routing", body: `Design an automation that receives IT support tickets, categorizes them, assigns priority, routes to the right team, and tracks resolution time against SLAs.` },
  { id: "299", category: "자동화", title: "보안 스캔 파이프라인", en: "Build a Security Scanning Pipeline", body: `Design an automated security scanning pipeline for [DESCRIBE WHAT IS BEING SCANNED]. What tools run, what findings are critical versus informational, and how are remediations tracked?` },
  { id: "300", category: "자동화", title: "QA 테스트 자동화", en: "Automate Quality Assurance Testing", body: `Design an automated QA pipeline for [DESCRIBE APPLICATION]. What tests run on each commit, what runs nightly, and what blocks deployment if it fails?` },
  { id: "301", category: "범용", title: "전문적인 이메일 작성", en: "Professional Email Writing", body: `Write a professional email to [recipient]. The email is about [topic] and should be polite, clear, and concise. Provide a subject line and a short closing.` },
  { id: "302", category: "범용", title: "명확성을 위한 재작성", en: "Rewrite for Clarity", body: `Rewrite the following text so it is easier to understand. The text will be used in a professional setting. Ensure the tone is clear, respectful, and concise. Text: [paste text].` },
  { id: "303", category: "범용", title: "대상에 맞게 메시지 조정", en: "Tailor Message to Audience", body: `Reframe this message for [audience type: executives, peers, or customers]. The message was originally written for [context]. Adjust tone, word choice, and style to fit the intended audience. Text: [paste text].` },
  { id: "304", category: "범용", title: "회의 초대장 초안 작성", en: "Draft Meeting Invitation", body: `Draft a meeting invitation for a session about [topic]. The meeting will include [attendees/roles] and should outline agenda items, goals, and preparation required. Provide the text in calendar-invite format.` },
  { id: "305", category: "범용", title: "긴 이메일 요약", en: "Summarize Email Thread", body: `Summarize this email thread into a short recap. The thread includes several back-and-forth messages. Highlight key decisions, action items, and open questions. Email: [paste text].` },
  { id: "306", category: "범용", title: "회의 의제 생성", en: "Generate Meeting Agenda", body: `Create a structured agenda for a meeting about [topic]. The meeting will last [time] and include [attendees]. Break the agenda into sections with time estimates and goals for each section.` },
  { id: "307", category: "범용", title: "회의록 요약", en: "Summarize Meeting Notes", body: `Summarize these meeting notes into a structured recap. The notes are rough and informal. Organize them into categories: key decisions, next steps, and responsibilities. Notes: [paste text].` },
  { id: "308", category: "범용", title: "실행 항목 목록 생성", en: "Generate Action Item List", body: `Turn the following meeting notes into a clean task list. The tasks should be grouped by owner and include deadlines if mentioned. Notes: [paste text].` },
  { id: "309", category: "범용", title: "회의 질문 준비", en: "Prepare Meeting Questions", body: `Suggest thoughtful questions to ask in a meeting about [topic]. The purpose of the meeting is [purpose]. Provide a list of at least 5 questions that show preparation and insight.` },
  { id: "310", category: "범용", title: "후속 이메일 초안 작성", en: "Draft Follow-Up Email", body: `Write a professional follow-up email after a meeting about [topic]. Include a recap of key points, assigned responsibilities, and next steps with deadlines. Use a clear and polite tone.` },
  { id: "311", category: "범용", title: "근본 원인 식별", en: "Identify Root Cause", body: `Analyze the following workplace issue: [describe issue]. The context is that the problem has occurred multiple times. Identify possible root causes and suggest questions to confirm them.` },
  { id: "312", category: "범용", title: "옵션 비교", en: "Compare Options", body: `Compare the following two or more possible solutions: [list options]. The decision needs to be made in [timeframe]. Evaluate pros, cons, and potential risks for each option.` },
  { id: "313", category: "범용", title: "의사결정 기준 정의", en: "Define Decision Criteria", body: `Help define clear decision-making criteria for [describe decision]. The context is that multiple stakeholders are involved. Provide a short list of weighted criteria to guide the choice.` },
  { id: "314", category: "범용", title: "위험 평가", en: "Risk Assessment", body: `Assess the potential risks of the following plan: [describe plan]. The plan is set to start on [date]. List risks by likelihood and impact, and suggest mitigation strategies.` },
  { id: "315", category: "범용", title: "최적 옵션 추천", en: "Recommend Best Option", body: `Based on the following background: [describe situation and options], recommend the most suitable option. Explain your reasoning clearly and suggest first steps for implementation.` },
  { id: "316", category: "범용", title: "일일 우선순위 문서화", en: "Prioritize Daily Tasks", body: `Create a prioritized to-do list from the following tasks: [paste tasks]. The context is a typical workday with limited time. Suggest which tasks should be done first and why.` },
  { id: "317", category: "범용", title: "주간 계획 생성", en: "Build Weekly Work Plan", body: `Build a weekly work plan for [describe role or situation]. The week includes deadlines, meetings, and individual focus time. Provide a balanced schedule with recommended priorities.` },
  { id: "318", category: "범용", title: "긴 문서 요약", en: "Summarize Long Document", body: `Summarize the following document into 5 key points and 3 recommended actions. The document is [type: report, plan, or notes]. Keep the summary concise and professional. Text: [paste document].` },
  { id: "319", category: "범용", title: "해결책 브레인스토밍", en: "Brainstorm Solutions", body: `Brainstorm potential solutions to the following workplace challenge: [describe challenge]. Provide at least 5 varied ideas, noting pros and cons for each.` },
  { id: "320", category: "범용", title: "프로젝트 업데이트 작성", en: "Write Project Update", body: `Draft a short project update for stakeholders. The project is [describe project]. Include progress made, current blockers, and next steps. Write in a professional, concise style.` },
  { id: "321", category: "마케팅", title: "소셜 미디어 게시물 작성", en: "Draft Social Media Posts", body: `Draft 3 social media posts for [platform, e.g., LinkedIn, Instagram] to promote [product/event]. Use a [tone, e.g., exciting, informative] tone and include relevant hashtags.` },
  { id: "322", category: "마케팅", title: "타겟 고객 페르소나 생성", en: "Create Marketing Persona", body: `Create a marketing persona for [product/service]. Include demographics, pain points, motivations, and preferred communication channels.` },
  { id: "323", category: "마케팅", title: "블로그 아이디어 브레인스토밍", en: "Brainstorm Blog Post Ideas", body: `Brainstorm 5-7 blog post ideas about [topic related to product/industry]. Focus on attracting [target audience] and addressing their needs.` },
  { id: "324", category: "마케팅", title: "광고 문구 작성", en: "Write Ad Copy", body: `Write 3 compelling ad headlines and descriptions for a digital ad campaign promoting [product/service]. Highlight unique selling points.` },
  { id: "325", category: "마케팅", title: "이메일 뉴스레터 초안 작성", en: "Draft Email Newsletter", body: `Draft a short email newsletter for [subscriber segment] announcing [news/offer]. Include a clear call to action and a link to [landing page].` },
  { id: "326", category: "마케팅", title: "캠페인 타임라인 시각화", en: "Visualize Campaign Timeline", body: `Build a timeline for our upcoming multi-channel campaign. Key dates and milestones are: [insert info]. Output as a horizontal timeline with phases, owners, and deadlines.` },
  { id: "327", category: "마케팅", title: "캠페인 아이디어 브레인스토밍", en: "Brainstorm Campaign Ideas", body: `Brainstorm 5 creative campaign ideas for our upcoming [event/launch]. The audience is [insert target], and our goal is [insert goal]. Include a theme, tagline, and 1-2 core tactics per idea.` },
  { id: "328", category: "마케팅", title: "크리에이티브 브리프 초안 작성", en: "Draft Creative Brief", body: `Create a creative brief for our next paid media campaign. Here's the goal, audience, and offer: [insert info]. Include sections for objective, audience insights, tone, assets needed, and KPIs.` },
  { id: "329", category: "마케팅", title: "메시징 프레임워크 구축", en: "Build Messaging Framework", body: `Build a messaging framework for a new product. The product details are: [insert info]. Output a table with 3 pillars: key benefits, proof points, and emotional triggers.` },
  { id: "330", category: "마케팅", title: "고객 여정 지도 구축", en: "Build Customer Journey Map", body: `Create a customer journey map for our [product/service]. Our typical customer is [insert profile]. Break it into stages, goals, touchpoints, and potential pain points per stage. Output as a table.` },
  { id: "331", category: "마케팅", title: "경쟁사 콘텐츠 분석", en: "Competitive Content Analysis", body: `Research how top 5 competitors structure their blog content strategy. Include tone, topics, frequency, SEO focus, and CTAs. Provide URLs, takeaways, and a table summarizing common and standout tactics.` },
  { id: "332", category: "마케팅", title: "구매자 행동 동향 조사", en: "Research Buyer Behavior Trends", body: `Research 2024 trends in how [type] buyers research and evaluate [industry] products. Include behavior shifts, content preferences, and channel usage. Cite sources and format as a short briefing with bullet-point insights.` },
  { id: "333", category: "마케팅", title: "지역 캠페인 벤치마크 조사", en: "Research Regional Campaign Benchmarks", body: `Research typical CTRs, CPCs, and conversion rates for digital campaigns targeting [location] in 2024. Focus on [ad channels]. Include source links and a table comparing each metric by country.` },
  { id: "334", category: "마케팅", title: "경쟁사 행사 참여 조사", en: "Research Competitor Event Presence", body: `Compile a summary of how our competitors are participating in [insert upcoming event]. Include booth activations, speaking sessions, sponsorships, and media coverage. Output as a table with links and analysis.` },
  { id: "335", category: "마케팅", title: "마케터를 위한 AI 도구 조사", en: "Research AI Tools for Marketers", body: `Research the most recommended [tools] for marketers by function (e.g. copywriting, planning, analytics, design). Create a table with features, pricing, pros/cons, and primary use case. Include sources.` },
  { id: "336", category: "마케팅", title: "제품 출시 이메일 초안 작성", en: "Draft Product Launch Email", body: `Write a launch email for our new product. Use the following info about the product and target audience: [insert details]. Make it engaging and persuasive, formatted as a marketing email ready for review.` },
  { id: "337", category: "마케팅", title: "광고 문구 변형 생성", en: "Generate Ad Copy Variations", body: `Create 5 ad copy variations for a [channel] campaign. Here's the campaign theme and audience info: [insert context]. Each version should test a different hook or tone.` },
  { id: "338", category: "마케팅", title: "소셜 게시물 시리즈 생성", en: "Create Social Post Series", body: `Draft a 3-post social media series promoting [event, product, or milestone]. Use this background for context: [paste details]. Each post should include copy and a suggested visual description.` },
  { id: "339", category: "마케팅", title: "고객 스포트라이트 게시물 생성", en: "Create Customer Spotlight Post", body: `Write a customer spotlight post based on this success story: [paste key details]. Make it conversational, authentic, and aligned to our brand voice. Output as a LinkedIn post draft.` },
  { id: "340", category: "마케팅", title: "설명 비디오 스크립트 생성", en: "Create Explainer Video Script", body: `Draft a script for a 60-second explainer video about [product/topic]. Here's what it should cover: [insert info]. Make it punchy and clear, with suggested visuals or animations.` },
  { id: "341", category: "마케팅", title: "최고 성과 마케팅 채널 식별", en: "Identify Top Marketing Channels", body: `Analyze this marketing performance spreadsheet and identify which channels had the highest ROI. The file includes data from Q1-Q2 campaigns across email, social, paid search, and events. Summarize top 3 channels and create a chart showing ROI by channel.` },
  { id: "342", category: "마케팅", title: "고객 이탈 패턴 파악", en: "Uncover Customer Churn Patterns", body: `Review this customer churn dataset and identify common characteristics of churned customers. Use columns like tenure, product usage, and support tickets to group insights. Output a short summary with a chart or table showing top risk factors.` },
  { id: "343", category: "마케팅", title: "설문조사 결과 요약", en: "Summarize Survey Results", body: `Summarize insights from this post-campaign customer feedback survey. The file includes satisfaction ratings and open-ended responses. Provide a 3-bullet executive summary and a chart of top satisfaction drivers.` },
  { id: "344", category: "마케팅", title: "리드 볼륨 예측", en: "Forecast Lead Volume", body: `Use this historical lead volume data from the past 6 quarters to project expected lead volume for the next quarter. Highlight any trends, seasonal patterns, and output a simple forecast chart.` },
  { id: "345", category: "마케팅", title: "캠페인 예산 할당 최적화", en: "Optimize Campaign Budget", body: `Based on this spreadsheet of previous campaign spend and returns, recommend a revised budget allocation for next quarter. Focus on maximizing ROI while reducing spend on underperforming channels. Output as a table with new % allocations.` },
  { id: "346", category: "마케팅", title: "브랜드 스타일 가이드 개요 개발", en: "Develop Brand Style Guide Outline", body: `Create an outline for a brand style guide for [company/product]. Include sections for typography, color palette, logo usage, tone of voice, imagery style, and do's/don'ts.` },
  { id: "347", category: "마케팅", title: "시각적 스토리텔링 개념화", en: "Conceptualize Visual Storytelling", body: `Brainstorm 3 visual storytelling concepts for a brand campaign on [theme]. Include a concept name, visual style, and key narrative elements (e.g., story arc, mood, colors).` },
  { id: "348", category: "마케팅", title: "캠페인 무드보드 생성", en: "Create Campaign Moodboard", body: `Create a moodboard with 4 visuals for our [campaign or brand update]. Theme is [describe theme], and the tone should be [describe tone]. Use photoreal or illustrated style.` },
  { id: "349", category: "마케팅", title: "브랜드 일관성 평가", en: "Evaluate Brand Consistency", body: `Review the following marketing assets [insert links/files] and evaluate brand consistency in terms of tone, visuals, and messaging. Provide 3 strengths and 3 gaps with recommendations.` },
  { id: "350", category: "마케팅", title: "브랜드 아이덴티티 새로 고침", en: "Refresh Brand Identity", body: `Suggest 3 creative directions to refresh our brand identity. Include possible color palettes, typography styles, visual motifs, and tone updates that align with [audience/market shift].` },
  { id: "351", category: "세일즈", title: "개인화된 콜드 아웃리치 작성", en: "Draft Personalized Cold Outreach", body: `Draft a personalized cold outreach message to [prospect name] at [company name]. Mention [relevant insight about prospect or company] and propose [value proposition/solution]. The goal is to secure a discovery call.` },
  { id: "352", category: "세일즈", title: "영업 통화 요약", en: "Summarize Sales Call", body: `Summarize this sales call recording/notes into key takeaways, next steps, and potential pain points mentioned by the client. Call/notes: [paste text].` },
  { id: "353", category: "세일즈", title: "이의 제기 처리 스크립트 작성", en: "Write Objection Handling Script", body: `Create a script for handling the objection "[objection]" during a sales conversation. Provide 3-5 different ways to address it, focusing on [benefit/angle].` },
  { id: "354", category: "세일즈", title: "경쟁사 비교 분석", en: "Competitor Comparison Analysis", body: `Compare our product, [your product name], with [competitor product name]. Highlight key differentiators, advantages, and potential weaknesses of the competitor.` },
  { id: "355", category: "세일즈", title: "영업 후속 이메일 작성", en: "Draft Sales Follow-Up Email", body: `Draft a follow-up email after a sales demo with [client name] for [product/service]. Recap key features discussed and next steps for trial/purchase.` },
  { id: "356", category: "세일즈", title: "콜드 이메일 작성", en: "Write Cold Email", body: `Write a short, compelling cold email to a [job title] at [company name] introducing our product. Use the background below to customize it. Background: [insert value props or ICP info]. Format it in email-ready text.` },
  { id: "357", category: "세일즈", title: "데모 후속 이메일 재작업", en: "Rewrite Demo Follow-Up Email", body: `Rewrite this follow-up email after a demo to sound more consultative. Original email: [paste here]. Include recap, next steps, and call scheduling CTA. Output as email text.` },
  { id: "358", category: "세일즈", title: "갱신 제안 초안 작성", en: "Draft Renewal Pitch", body: `Draft a renewal pitch for [customer name] based on this renewal history and value data: [paste data]. Include key ROI proof points and renewal recommendation. Output as a short pitch and optional follow-up email.` },
  { id: "359", category: "세일즈", title: "담당자 활동 요약 생성", en: "Create Rep Activity Summary", body: `Write a daily update summarizing key rep activities. Inputs: [paste call summaries or CRM exports] Make it upbeat and concise. Output as 3-5 bullet message.` },
  { id: "360", category: "세일즈", title: "파이프라인 상태 임원 업데이트", en: "Draft Pipeline Exec Update", body: `Summarize our pipeline health this month for execs. Inputs: [paste data]. Include total pipeline, top risks, biggest wins, and forecast confidence. Write it like a short exec update.` },
  { id: "361", category: "세일즈", title: "전략적 계정 계획 생성", en: "Generate Strategic Account Plan", body: `Create an account plan for [customer name]. Use these inputs: company profile, known priorities, current product usage, stakeholders, and renewal date. Output a structured plan with goals, risks, opportunities, and next steps.` },
  { id: "362", category: "세일즈", title: "영업 지역 계획 프레임워크 설계", en: "Design Territory Planning Framework", body: `Create a territory planning guide for our next fiscal year. Inputs: team headcount, target industries, regions, and historical revenue. Recommend allocation method and sample coverage plan.` },
  { id: "363", category: "세일즈", title: "공개 도메인에서 고객 사례 찾기", en: "Find Customer Proof Points", body: `Research recent online reviews, social mentions, and testimonials about [our product OR competitor product]. Focus on what customers are praising or criticizing. Summarize top 5 quotes, what persona each came from, and where it was posted. Include links.` },
  { id: "364", category: "세일즈", title: "파이프라인 전환율 분석", en: "Analyze Pipeline Conversion Rates", body: `Analyze this sales pipeline export. Calculate conversion rates between each stage and identify the biggest drop-off point. Data: [Upload pipeline CSV]. Output a short summary and a table of conversion % by stage.` },
  { id: "365", category: "세일즈", title: "최고 성과 담당자 식별", en: "Identify Top-Performing Reps", body: `From this dataset of rep activities and closed deals, calculate the close rate for each rep and rank them. Data: [Upload rep performance CSV]` },
  { id: "366", category: "세일즈", title: "영업 프로세스 시각화", en: "Visualize Sales Process", body: `Create a funnel graphic showing our sales stages: [insert stages]. Make it clean and easy to read for onboarding docs. Output as simple image.` },
  { id: "367", category: "세일즈", title: "B2B 영업 깔때기 시각화", en: "Visualize B2B Sales Funnel", body: `Create an image of a standard B2B SaaS sales funnel with these stages: Prospecting, Discovery, Demo, Proposal, Closed Won/Lost. Use clean, modern icons and text labels. Output should be clear enough for use in a slide or enablement doc.` },
  { id: "368", category: "세일즈", title: "영업 페르소나 일러스트", en: "Illustrate Sales Personas", body: `Create professional illustrations for 3 personas: (1) CFO of a mid-market company, (2) VP of IT at a global enterprise, and (3) Operations Manager at a logistics firm. Style should be flat and modern, ideal for use in a one-pager or training slide.` },
  { id: "369", category: "세일즈", title: "영업 지역 커버리지 맵 생성", en: "Create Territory Coverage Map", body: `Create a simplified U.S. map showing sales territories split by region: West, Central, East.` },
  { id: "370", category: "고객관리", title: "온보딩 체크리스트 생성", en: "Create Onboarding Checklist", body: `Create an onboarding checklist for a new customer of [product/service]. Include steps for setup, training, and initial success milestones.` },
  { id: "371", category: "고객관리", title: "고객 문제 해결 가이드 작성", en: "Write Customer Troubleshooting Guide", body: `Write a step-by-step guide to resolve the customer issue: "[describe issue]". Assume the customer has [level of technical proficiency].` },
  { id: "372", category: "고객관리", title: "고객 피드백 요약", en: "Summarize Customer Feedback", body: `Summarize the following customer feedback from [source: survey, call, email] into common themes, urgent issues, and potential product improvements. Feedback: [paste text].` },
  { id: "373", category: "고객관리", title: "고객 이탈 방지 메시지 작성", en: "Write Churn Prevention Message", body: `Draft a message to a customer who is at risk of churning. Highlight [value proposition/recent success] and offer [solution/support].` },
  { id: "374", category: "고객관리", title: "성공 사례 연구 초안 작성", en: "Draft Customer Success Story", body: `Outline a customer success story for [customer name] using [product/service]. Focus on their challenge, how they used our solution, and the positive outcomes.` },
  { id: "375", category: "고객관리", title: "온보딩 계획 템플릿 생성", en: "Create Onboarding Plan Template", body: `Create a reusable onboarding plan template for [type of customer].` },
  { id: "376", category: "고객관리", title: "갱신 유지 아이디어 제안", en: "Suggest Retention Ideas", body: `Use trends in usage and renewal hesitations we've seen. Output 5 tested and 5 novel ideas with pros/cons.` },
  { id: "377", category: "고객관리", title: "CS 조직 구조 벤치마킹", en: "Benchmark CS Org Structure", body: `Benchmark the CS org structure for companies like ours in [industry, size]. Focus on roles per customer segment and ratio to revenue. Output as a comparison table with notes on headcount ratios.` },
  { id: "378", category: "고객관리", title: "산업별 성공 지표 벤치마킹", en: "Benchmark Industry Success Metrics", body: `Research top 3 success metrics used for customer health scoring in the [industry] sector. Include CSAT, NRR, usage frequency, or other emerging benchmarks. Output as a table comparing metric, source, and benchmark value with citations.` },
  { id: "379", category: "고객관리", title: "CS 툴링 스택 평가", en: "Evaluate CS Tooling Stack", body: `Research typical Customer Success tech stacks for companies in early-stage, growth-stage, and enterprise. Include categories (e.g., CRM, Success Platform, Analytics). Output a comparison chart with examples and usage notes.` },
  { id: "380", category: "고객관리", title: "경쟁사 활성화 요약", en: "Competitive Enablement Summary", body: `Research how competitors are supporting enterprise customers post-sale in [industry]. Include examples of success resources, team structure, and onboarding formats. Output as a table comparing 3 competitors with pros/cons per tactic.` },
  { id: "381", category: "고객관리", title: "경쟁사 CS 프로그램 비교", en: "Compare Competitor CS Programs", body: `Research what customer success programs look like at our top 3 competitors. Focus on onboarding, health tracking, and expansion strategies. Output a comparison matrix.` },
  { id: "382", category: "고객관리", title: "갱신 위험 요약 개요 작성", en: "Outline Renewal Risk Summary", body: `Draft a renewal risk summary for [Customer Name] ahead of our internal forecast call. Include their renewal date, usage trend, sentiment, and contract notes. Output should be a paragraph summary + 1-line recommendation.` },
  { id: "383", category: "고객관리", title: "임원 이메일 업데이트 초안 작성", en: "Draft Executive Email Update", body: `Write a weekly update email for [executive stakeholder at customer]. Use these internal notes from this week's call and usage metrics: [paste here]. Output should be a short, polished email with 3 bullets.` },
  { id: "384", category: "고객관리", title: "QBR 토론 포인트 초안 작성", en: "Draft QBR Talking Points", body: `Summarize the top wins, risks, and product usage highlights for [Customer Name] ahead of our QBR. Use their latest health score, usage trends, and support ticket history. Format as a bulleted prep doc for internal review.` },
  { id: "385", category: "고객관리", title: "갱신 통화 준비", en: "Prep for Renewal Call", body: `Create a renewal call prep checklist for [Customer Name]. Include contract terms, current usage, known risks, and upsell potential. Output as a bulleted checklist.` },
  { id: "386", category: "고객관리", title: "계정 계획 요약 생성", en: "Create Account Plan Summary", body: `Draft a 1-pager account plan for [Customer Name]. Use notes from our last 2 calls + contract info + goals: [paste here]. Output should be formatted as goals, blockers, actions, and renewals.` },
  { id: "387", category: "고객관리", title: "고객 건전성 점수 모형 디자인", en: "Design Health Score Mock-up", body: `Design a visual mock-up of a color-coded health score gauge for customers. Include Low, Medium, High ranges with suggested numerical ranges and icons. Style: dashboard-style, clean lines, professional.` },
  { id: "388", category: "고객관리", title: "고객 여정 지도 시각화", en: "Visualize Customer Journey Map", body: `Turn this outline of customer lifecycle stages into a visual journey map. Use the stages and pain points listed here: [paste text]. Output as a labeled diagram with 5 lifecycle stages.` },
  { id: "389", category: "고객관리", title: "에스컬레이션 프로세스 흐름도", en: "Illustrate Escalation Process Flow", body: `Create a diagram that illustrates the internal escalation process from CSM to Support to Engineering. Include 3 levels of severity and labeled handoff points. Style: flowchart format, minimal colors, ready for internal wiki.` },
  { id: "390", category: "고객관리", title: "세그먼트별 성공 지표 개요 작성", en: "Outline Success Metrics by Segment", body: `Outline a draft list of success metrics for [segment] customers. Include adoption goals, engagement targets, and renewal benchmarks. Format as a 2-column table: Metric | Definition.` },
  { id: "391", category: "고객관리", title: "CSAT 점수 분포 평가", en: "Evaluate CSAT Score Distribution", body: `Review this CSAT survey data from Q2. Calculate overall average, identify outlier scores, and summarize feedback themes if available. Output as a short summary with key stats and top positive/negative feedback examples.` },
  { id: "392", category: "제품", title: "제품 요구사항 문서 초안 작성", en: "Draft Product Requirements Document", body: `Draft a product requirements document (PRD) for a new feature: "[feature name]". Include user stories, functional requirements, and success metrics.` },
  { id: "393", category: "제품", title: "사용자 스토리 생성", en: "Generate User Stories", body: `Create 5 user stories for a feature that allows users to [describe functionality]. Focus on different user types and their motivations.` },
  { id: "394", category: "제품", title: "A/B 테스트 가설 제안", en: "Suggest A/B Test Hypotheses", body: `Suggest 3-5 A/B test hypotheses for improving [metric, e.g., conversion rate] on [page/feature]. Explain the rationale for each.` },
  { id: "395", category: "제품", title: "경쟁 제품 분석", en: "Analyze Competitor Product", body: `Analyze [competitor product name] in terms of its key features, target audience, and monetization strategy. Identify potential gaps or opportunities for our product.` },
  { id: "396", category: "제품", title: "제품 출시 메시지 작성", en: "Draft Product Launch Announcement", body: `Draft a product launch announcement for [new product/feature name]. Highlight key benefits for [target audience] and include a call to action.` },
  { id: "397", category: "제품", title: "경쟁사 온보딩 UX 비교", en: "Compare Competitor Onboarding UX", body: `Research how 3 key competitors structure their onboarding flow for new users. Include screenshots, key steps, and points of friction or delight. Synthesize a comparison table and recommendations for improvement. Target product: [Insert product]` },
  { id: "398", category: "제품", title: "경쟁사 가격 전략 벤치마크", en: "Benchmark Competitor Pricing", body: `I'm a product manager launching a new SaaS product. Research how top 5 competitors in this space structure their pricing tiers, freemium vs. paid, feature gating, and upsell triggers. Use public sources and include URLs. Output: A comparison table with insights and risks.` },
  { id: "399", category: "제품", title: "기술 스택 옵션 비교", en: "Compare Tech Stack Options", body: `Compare the pros and cons of integrating [technology/tool A] vs. [technology/tool B] into our product. Focus on scalability, cost, support, and developer experience. Include citations.` },
  { id: "400", category: "제품", title: "새 기능 규제 위험 식별", en: "Identify Regulatory Risks for Features", body: `I'm a PM scoping a [feature] for financial services. Research recent regulatory guidance in the US, UK, and EU around the use of [feature] in customer-facing products. Summarize by region with citations. Output: A table of legal considerations to flag for our legal team and product design implications.` },
  { id: "401", category: "제품", title: "제품 주도 성장 전략 조사", en: "Research Product-Led Growth Tactics", body: `Research the top 7 product-led growth strategies used by fast-scaling SaaS companies in the last 2 years. Prioritize those with measurable impact. Include 1-2 examples per tactic and source links. Output: Ranked list with strategy, example, and success metric.` },
  { id: "402", category: "제품", title: "제품 로드맵 우선순위 지정", en: "Prioritize Product Roadmap Items", body: `Review this list of upcoming product initiatives. Use the data provided (impact scores, effort estimates, and strategic alignment notes) to suggest priority order. Present the reordered list with justification for each recommendation. [Insert initiative list]` },
  { id: "403", category: "제품", title: "수익화 모델 탐색", en: "Explore Monetization Models", body: `We're considering pricing changes. Based on this product value and audience, suggest 3 monetization strategies. Include pros, cons, and examples of companies using each. [Insert product and audience details]` },
  { id: "404", category: "제품", title: "제품 비전 선언문 초안 작성", en: "Draft Product Vision Statement", body: `Based on this long-term goal and user need, write a concise product vision statement. Keep it inspiring and grounded in real outcomes. [Insert product goal]` },
  { id: "405", category: "제품", title: "고객 피드백에서 기능 아이디어 브레인스토밍", en: "Brainstorm Feature Ideas from Feedback", body: `Review this batch of customer feedback from the past quarter. Identify pain points and generate a list of 5 feature ideas to address recurring themes. [Insert feedback or summary]` },
  { id: "406", category: "제품", title: "A/B 테스트 실험 계획", en: "Plan A/B Testing Experiments", body: `Review this list of product UI changes and propose 2 A/B test setups. Include hypothesis, success metrics, and potential outcomes. [Insert UI changes or user goals]` },
  { id: "407", category: "제품", title: "새 기능 PRD 초안 작성", en: "Draft PRD for New Feature", body: `Based on this feature idea and customer need, write a first-draft PRD. Include user story, problem statement, solution overview, acceptance criteria, and success metrics. [Insert context or problem]` },
  { id: "408", category: "제품", title: "변경 로그 및 릴리스 노트 초안 작성", en: "Draft Changelog and Release Notes", body: `Using this release summary, draft user-facing changelog notes for our next version release. Use a friendly, clear tone and group by category (e.g., new, improved, fixed). [Insert release notes or ticket list]` },
  { id: "409", category: "제품", title: "시장 출시 FAQ 생성", en: "Create Go-to-Market FAQ", body: `Draft an internal FAQ for our sales and support teams about our upcoming feature launch. Use this background and anticipated questions. Write in a confident, informative tone. [Insert feature and launch details]` },
  { id: "410", category: "제품", title: "한 문장 가치 제안 생성", en: "Generate One-Sentence Value Proposition", body: `Based on this feature description, write 3 versions of a clear, compelling one-sentence value proposition. Tailor each one to a different target audience. [Insert feature description]` },
  { id: "411", category: "제품", title: "신제품 피치 덱 초안 작성", en: "Draft Pitch Deck for New Product", body: `Create a 5-slide outline for a pitch deck introducing our new product to internal stakeholders. Include problem, solution, market, product overview, and timeline. [Insert product idea]` },
  { id: "412", category: "제품", title: "사용자 여정 지도 시각화", en: "Visualize User Journey Map", body: `Create a user journey map for our [insert user persona] going through [insert experience]. Include emotional highs/lows, touchpoints, and moments of friction. Output as a visual flow.` },
  { id: "413", category: "제품", title: "온보딩 흐름 와이어프레임 디자인", en: "Design Onboarding Flow Wireframe", body: `Generate a wireframe-style image of a 3-step onboarding flow for a finance app. Steps include: linking an account, setting financial goals, and reviewing suggestions. Style: greyscale wireframe with labels.` },
  { id: "414", category: "제품", title: "제품 비교 시각 자료 일러스트", en: "Illustrate Product Comparison Visuals", body: `Create a side-by-side visual comparison of two app dashboards: one cluttered with too many metrics, and one simplified with actionable insights. Style: dashboard UI, minimalistic, neutral branding.` },
  { id: "415", category: "제품", title: "사용자 여정 인포그래픽 디자인", en: "Design User Journey Infographic", body: `Generate a user journey infographic showing the onboarding experience for a mobile health-tracking app. Include key milestones, emotions, and friction points. Style: infographic, vertical layout, soft colors.` },
  { id: "416", category: "제품", title: "제품 피드백 테마 분석", en: "Analyze Product Feedback Themes", body: `Analyze this set of user feedback and identify the 4 most frequent themes. Summarize each with example quotes and suggested product implications. [Insert feedback or data dump]` },
  { id: "417", category: "제품", title: "사용량 데이터에서 인사이트 종합", en: "Synthesize Insights from Usage Data", body: `Based on the following product usage data, summarize 3 key behavioral trends and what they suggest about user needs. Recommend 2 follow-up investigations. [Insert data or summary]` },
  { id: "418", category: "제품", title: "제품 채택 위험 식별", en: "Identify Product Adoption Risks", body: `Review our product rollout plan and highlight 5 risks to successful adoption. Include likelihood, impact, and mitigation recommendations. [Insert rollout plan or summary]` },
  { id: "419", category: "제품", title: "A/B 테스트 결과 분석", en: "Analyze A/B Test Results", body: `Review the results of our recent A/B test (test vs. control). Identify statistical significance, key metrics that changed, and recommend next steps. Present insights clearly with graphs if needed. [Upload test data]` },
  { id: "420", category: "제품", title: "고객 세그먼트별 기능 채택 비교", en: "Compare Feature Adoption by Segment", body: `Use this data to compare how small business vs. enterprise customers adopt our key features. Highlight major differences, usage frequencies, and retention impact. Format output as a table with insights. [Upload CSV or describe dataset]` },
  { id: "421", category: "엔지니어링", title: "코드 설명 작성", en: "Explain Code Snippet", body: `Explain the following Python code snippet in simple terms. Assume the audience is a junior developer. Code: [paste code].` },
  { id: "422", category: "엔지니어링", title: "기술 설계 문서 초안 작성", en: "Draft Technical Design Document", body: `Draft a technical design document for implementing [feature/system]. Include architecture, data flow, and potential challenges.` },
  { id: "423", category: "엔지니어링", title: "버그 보고서 작성", en: "Write Bug Report", body: `Write a detailed bug report for the issue: "[describe bug]". Include steps to reproduce, expected behavior, and actual behavior.` },
  { id: "424", category: "엔지니어링", title: "코드 리뷰 피드백 제공", en: "Provide Code Review Feedback", body: `Provide constructive feedback on the following code review comments for [code change]. Focus on clarity, completeness, and tone. Comments: [paste text].` },
  { id: "425", category: "엔지니어링", title: "기술적 과제 해결 아이디어", en: "Brainstorm Technical Solutions", body: `Brainstorm potential technical solutions to the problem of [describe technical challenge]. Consider [specific technologies/constraints].` },
  { id: "426", category: "엔지니어링", title: "클라우드 제공업체 평가", en: "Evaluate Cloud Providers", body: `I'm an infrastructure engineer evaluating cloud migration options. Context: We're moving from on-prem to the cloud for a fintech backend. Output: Compare AWS, GCP, and Azure for scalability, pricing, compliance, and developer tooling. Include citations.` },
  { id: "427", category: "엔지니어링", title: "실시간 앱 프레임워크 조사", en: "Research Real-Time App Frameworks", body: `I'm building a real-time collaboration tool. Context: We need low-latency and scalability. Output: Compare top frameworks (e.g., SignalR, Socket.io, WebRTC) with use cases, pros/cons, and current usage by other SaaS companies. Include sources.` },
  { id: "428", category: "엔지니어링", title: "관찰성 도구 벤치마킹", en: "Benchmark Observability Tools", body: `Benchmark the top observability tools. Context: We want to move from basic logging to full-stack monitoring. Output: Create a comparison table of features, pricing, integrations for Datadog, New Relic, Prometheus, and OpenTelemetry. Include sources.` },
  { id: "429", category: "엔지니어링", title: "물류 AI/ML 동향 분석", en: "Analyze AI/ML Trends in Logistics", body: `I'm researching AI/ML adoption in logistics systems. Context: Our company is considering integrating predictive routing. Output: A 5-paragraph summary on current trends, vendors, and implementation patterns. Include citations and links.` },
  { id: "430", category: "엔지니어링", title: "규정 준수 모범 사례 조사", en: "Investigate Compliance Best Practices", body: `Research best practices for GDPR/CCPA compliance so we can help kick off discussions with our legal team. Context: Our app stores sensitive user data in the EU and US. Output: A compliance checklist with citations, sorted by regulation. Include links to documentation and regulations.` },
  { id: "431", category: "엔지니어링", title: "시스템 설계 문서 검토", en: "Review System Design Doc", body: `I've drafted a technical design document for [insert project or feature]. Review it for clarity, architectural soundness, and completeness. Highlight any missing considerations or questions reviewers may raise.` },
  { id: "432", category: "엔지니어링", title: "내부 API 동작 문서화", en: "Document Internal API Behavior", body: `I need to document how this internal API works for other developers. Here's the relevant code, schema, and usage examples: [insert materials]. Create clear documentation including endpoints, input/output formats, and expected behavior.` },
  { id: "433", category: "엔지니어링", title: "온콜 런북 초안 작성", en: "Draft On-Call Runbook", body: `I need to create a runbook for on-call engineers supporting [insert system]. Draft one that includes sections for system overview, common alerts, diagnostic steps, and escalation procedures.` },
  { id: "434", category: "엔지니어링", title: "신규 채용자 온보딩 가이드 초안 작성", en: "Draft Engineer Onboarding Guide", body: `I need to write an onboarding guide for new engineers joining [insert team]. Create a draft with sections for required tools, access setup, codebase overview, and first tasks. Make it suitable for self-service onboarding.` },
  { id: "435", category: "엔지니어링", title: "JIRA 티켓 작성", en: "Write JIRA Ticket from Spec", body: `Based on this engineering spec for [insert task or feature], write a JIRA ticket that includes the problem statement, context, goals, acceptance criteria, and technical notes for implementation.` },
  { id: "436", category: "엔지니어링", title: "운영 중인 시스템 오류 디버깅", en: "Debug Failing Production System", body: `A system in production is intermittently failing, and we're struggling to isolate the root cause. Based on the following logs, metrics, and recent changes: [insert context], help identify the most likely causes and suggest next steps for mitigation.` },
  { id: "437", category: "엔지니어링", title: "성능 병목 현상 분석", en: "Analyze Performance Bottlenecks", body: `Our service is experiencing latency and degraded performance during peak usage. Here are metrics, logs, and relevant traces: [insert context]. Help identify the bottlenecks and recommend specific optimizations.` },
  { id: "438", category: "엔지니어링", title: "데이터 파이프라인 실패 분석", en: "Analyze Data Pipeline Failure", body: `A critical data pipeline failed in yesterday's run. Here are the logs, data volume trends, and error outputs: [insert context]. Analyze what likely went wrong and provide recommendations to prevent recurrence.` },
  { id: "439", category: "엔지니어링", title: "관찰성 개선 제안", en: "Suggest Observability Improvements", body: `We currently use [insert tools] for monitoring [insert service]. Review our observability setup and suggest improvements across metrics, logging, alerting, and dashboards to improve issue detection and debugging.` },
  { id: "440", category: "엔지니어링", title: "테스트 엣지 케이스 브레인스토밍", en: "Brainstorm Edge Cases for Testing", body: `We're preparing test cases for [insert feature/system]. Brainstorm potential edge cases and failure scenarios that may not be covered by standard testing, including unusual user inputs, system state changes, and concurrency issues.` },
  { id: "441", category: "엔지니어링", title: "제품 사용 로그 동향 식별", en: "Identify Trends in Usage Logs", body: `Analyze this CSV of product usage logs. Context: We want to identify usage trends over time and across user segments. Output: Summary stats + line or bar charts highlighting key trends.` },
  { id: "442", category: "엔지니어링", title: "시스템 오류율 시각화", en: "Visualize System Error Rates", body: `Plot error rates over time from this dataset. Context: It contains application logs from the last month. Output: A time-series chart with callouts for error spikes and a short interpretation.` },
  { id: "443", category: "엔지니어링", title: "성능 테스트 결과 분석", en: "Analyze Performance Test Results", body: `Analyze this set of performance test results. Context: It compares two versions of our backend service. Output: Side-by-side comparison charts + text summary of improvements or regressions.` },
  { id: "444", category: "엔지니어링", title: "영향 기반 버그 우선순위 지정", en: "Prioritize Bugs by Impact", body: `Analyze this bug report dataset. Context: Each row includes severity, frequency, and affected users. Output: A prioritized list of top bugs with charts showing frequency vs. severity.` },
  { id: "445", category: "엔지니어링", title: "사용자 설문조사 피드백 요약", en: "Summarize User Survey Feedback", body: `Summarize this user feedback CSV. Context: It includes ratings and open text responses from a recent survey. Output: Key themes, sentiment scores, and charts showing distribution of ratings.` },
  { id: "446", category: "엔지니어링", title: "구성 요소 다이어그램 생성", en: "Create Component Diagram", body: `I need to visualize the architecture of [insert system or service]. Generate a component diagram showing the main components, their responsibilities, and how they interact. Include labels and connection types.` },
  { id: "447", category: "글쓰기", title: "말투 분석 카드 만들기", en: "Writing Style Analysis Card", body: `내가 쓴 글 5개를 분석해서 내 말투와 문체를 정리해줘. 문장 구조, 자주 쓰는 단어, 문장의 리듬, 드러나는 성격까지 뽑아서 앞으로 계속 활용할 수 있는 말투 카드 형식으로 만들어줘: [글 샘플]
포함할 것:
* 이렇게 쓰면 좋은 표현 / 피해야 할 표현
* '내 말투 같은 문장'과 '내 말투 같지 않은 문장' 비교
* 내 스타일로 쓴 예문 3개` },
  { id: "448", category: "글쓰기", title: "AI 문장 자연스럽게 고치기", en: "Humanize AI Writing", body: `이 인공지능 느낌 나는 문장을 사람처럼 자연스럽게 고쳐줘: [문장]
수정할 때는
* 군더더기 표현은 빼고
* 문장 길이에 변화를 주고
* 말하듯 자연스러운 표현을 넣고
* 더 구체적으로 바꿔줘
그리고
* 어떤 부분을 어떻게 바꿨는지 표시해주고
* 왜 그렇게 바꿨는지도 설명해줘
* 아직도 기계적으로 느껴지는 문장이 있으면 따로 짚어줘` },
  { id: "449", category: "글쓰기", title: "스레드형 글 작성", en: "Write Thread-Style Post", body: `[주제]에 대해 내 말투로 스레드형 글을 써줘.
규칙:
* 어색한 상투 표현은 쓰지 말 것
* 문장 시작에 '그리고', '하지만', '그래서'를 자연스럽게 활용할 것
* 더 읽고 싶게 만드는 첫 문장
* 따로 떼어 써도 강한 한 줄 문장
* 마지막 행동유도 문구까지 포함할 것` },
  { id: "450", category: "글쓰기", title: "기능 설명을 장점 문장으로", en: "Convert Features to Benefits", body: `이 제품 기능 설명을 감정이 살아 있는 장점 중심 문장으로 바꿔줘: [기능 목록]
조건:
* 뻔한 마케팅 용어는 빼고
* 기능이 아니라 '그래서 고객에게 뭐가 좋은지' 중심으로 쓰고
* 각 장점마다 사용 전 / 사용 후가 떠오르는 장면을 넣고
* 제품이 없을 때와 있을 때 삶이 어떻게 달라지는지 보여줘` },
  { id: "451", category: "글쓰기", title: "링크드인 개인 스토리", en: "LinkedIn Personal Story", body: `[경험]을 바탕으로 링크드인용 개인 스토리를 써줘.
구성:
* 첫 문장 훅
* 긴장감
* 배운 점
* 바로 적용할 수 있는 정리
조건:
* 200단어 이하
* 첫 줄은 스크롤이 멈추게 만들 것
* 솔직하고 인간적인 약한 순간도 넣을 것
* 마지막은 질문으로 끝낼 것` },
  { id: "452", category: "글쓰기", title: "브랜드 말투 가이드", en: "Brand Voice Guide", body: `[브랜드명]의 브랜드 말투 가이드를 만들어줘.
정리할 것:
* 말투 분위기 / 브랜드 성격 / 자주 쓰는 표현 / 절대 쓰지 않을 표현 / 상황별 예문
아래 상황에 맞는 예시도 포함해줘:
* SNS 게시글 / 오류 안내 문구 / 처음 시작 안내 메일 / 가격 안내 페이지 / 고객 응대 문구` },
  { id: "453", category: "콘텐츠 전략", title: "30일 콘텐츠 운영표", en: "30-Day Content Calendar", body: `콘텐츠 전략가처럼 생각하고, [분야]에서 [타깃 고객]을 대상으로 한 30일 콘텐츠 운영표를 짜줘.
포함할 것:
* 각 콘텐츠의 첫 문장
* 콘텐츠 형식
* 올리기 좋은 시간
* 어떤 플랫폼에 올리면 좋은지
* 반복해서 돌려 쓸 핵심 주제 3~4개
* 주차별 성과 목표` },
  { id: "454", category: "콘텐츠 전략", title: "글 다형식 변환", en: "Multi-Format Content Repurposing", body: `이 글을 아래 형식으로 다시 만들어줘: [원문]
* 스레드형 글 5개 / 링크드인 게시글 3개 / 인스타 캡션 10개
조건:
* 플랫폼별 말투에 맞게 바꾸고
* 각 콘텐츠마다 첫 문장을 강하게 넣고
* 글자 수 제한도 고려하고
* 플랫폼별 해시태그 전략도 포함해줘` },
  { id: "455", category: "콘텐츠 전략", title: "스크롤 멈추는 문장 20개", en: "20 Scroll-Stopping Headlines", body: `[주제]에 대해 스크롤을 멈추게 하는 문장 20개를 만들어줘.
활용 방식:
* 궁금증 유발 / 과감한 주장 / 통계 활용 / 이야기 시작형 / 논쟁적인 관점
각 문장마다:
* 논란 가능성 점수 1~10
* 반응 유도 가능성 점수 1~10
* 한 줄 이유` },
  { id: "456", category: "콘텐츠 전략", title: "성과 게시물 패턴 분석", en: "Analyze Top Post Patterns", body: `성과가 가장 좋았던 게시물 10개를 분석해서 첫 문장, 길이, 형식, 주제의 공통 패턴을 찾아줘: [게시물 모음]
그리고
* 반복해서 쓸 수 있는 공식
* 성과가 안 좋았던 콘텐츠에서 피해야 할 점도 정리해줘` },
  { id: "457", category: "콘텐츠 전략", title: "유튜브 대본 구성안", en: "YouTube Script Outline", body: `[주제]에 대한 유튜브 대본 구성안을 짜줘. 목표는 시청 유지율 60% 이상이야.
포함할 것:
* 90초마다 들어갈 흐름 전환 장치
* 구간별 삽입 화면 아이디어
* 썸네일 방향 3개
* 제목 비교안 5개` },
  { id: "458", category: "콘텐츠 전략", title: "반박형 콘텐츠 아이디어", en: "Counter-Narrative Content Ideas", body: `[분야]에서 사람들이 흔히 믿는 생각을 깨는 반박형 콘텐츠 아이디어 10개를 만들어줘.
각 아이디어마다
* 사람들이 흔히 믿는 생각
* 그와 반대되는 내 관점
을 나란히 보여줘. 댓글 토론이 생기게 만들어줘.` },
  { id: "459", category: "SEO", title: "상위노출 콘텐츠 기획안", en: "SEO Content Brief", body: `[키워드]로 상위노출을 노릴 수 있는 상세 콘텐츠 기획안을 만들어줘.
포함할 것:
* 검색 의도 / 적정 글 길이 / 소제목 구조 / 경쟁 글의 빈틈
* 검색 결과 설명 문구 / 내부 연결 글 추천
* 상단 요약 영역 노출 전략 / 구조화 데이터 적용안` },
  { id: "460", category: "SEO", title: "경쟁 글 분석 & 빈틈 찾기", en: "Competitor Content Gap Analysis", body: `[키워드]로 상위에 뜨는 경쟁 글 5개를 분석해서 내가 이길 수 있는 콘텐츠 빈틈을 찾아줘: [경쟁 페이지 주소]
비교할 것:
* 글 길이 / 링크 확장 가능성 / 최신성 / 빠져 있는 차별화 포인트` },
  { id: "461", category: "SEO", title: "자동 확장형 SEO 전략", en: "Programmatic SEO Strategy", body: `[데이터 원천]을 바탕으로 100개 이상 페이지를 만드는 자동 확장형 검색 최적화 전략을 짜줘.
포함할 것:
* 주소 구조 / 페이지 틀 / 내부 연결 전략
* 검색엔진 수집 효율 관리 / 대표 페이지 설정 전략
* 얇은 글로 보이지 않기 위한 최소 기준` },
  { id: "462", category: "SEO", title: "SEO 소개 페이지 작성", en: "Write SEO Landing Page", body: `[키워드]로 검색 유입도 받고, 전환도 잘 나오는 소개 페이지를 써줘.
포함할 것:
* 첫 화면 문구 / 후기와 사례 섹션
* 자주 묻는 질문 구조화 적용 / 행동유도 버튼 배치 전략
* 신뢰 요소 / 모바일 중심 레이아웃 제안` },
  { id: "463", category: "SEO", title: "사이트 SEO 점검", en: "SEO Site Audit", body: `내 사이트 구조를 검색 최적화 관점에서 점검해줘: [사이트 주소]
확인할 것:
* 검색엔진이 잘 읽을 수 있는지 / 내부 연결 구조
* 연결되지 않은 페이지 / 서로 같은 키워드를 잡아먹는 문제 / 핵심 웹 성능 지표
그리고
* 우선순위별 수정 리스트
* 각 문제를 고쳤을 때 기대되는 유입 변화` },
  { id: "464", category: "SEO", title: "주제 권위 구조도", en: "Topic Authority Map", body: `[분야]에서 주제 권위 구조도를 만들어줘.
해야 할 것:
* 키워드 50개를 주제 묶음으로 나누고
* 핵심 글과 보조 글로 구분하고
* 검색량, 난이도, 우선순위를 표시하고
* 6개월 발행 일정까지 제안해줘` },
  { id: "465", category: "SaaS", title: "서비스 아이디어 검증", en: "Validate SaaS Idea", body: `이 서비스 아이디어를 본질부터 따져서 검증해줘: [아이디어]
분석할 것:
* 시장 크기 / 경쟁 상황 / 방어력 / 만들어야 하는지 말아야 하는지 결론
그리고
* 유입 전략
* 최소 기능 제품 범위와 예상 일정
* 가장 위험한 가정 3가지` },
  { id: "466", category: "SaaS", title: "3단계 가격 구조 설계", en: "Design Pricing Tiers", body: `[상품명]의 가격 구조를 3단계로 설계해줘.
포함할 것:
* 기능 구분 전략 / 기준 가격 심리 / 가장 추천할 요금제
* 월간 / 연간 가격 비교 / 후기와 사례 배치
* 가격 아래에 넣을 자주 묻는 질문` },
  { id: "467", category: "SaaS", title: "온보딩 이메일 시퀀스", en: "Onboarding Email Sequence", body: `[상품명]의 이탈률을 줄이고 사용 시작률을 높일 안내 메일을 Day 0, 1, 3, 7, 14 기준으로 써줘.
포함할 것:
* 제목 / 보내기 좋은 시간
* 3일 안에 설정을 안 마친 사용자에게 보낼 조건부 메시지
* 목표 지표: [목표]` },
  { id: "468", category: "SaaS", title: "결제 시스템 전체 설계", en: "Payment System Design", body: `[상품명]에 결제 시스템을 붙이기 위한 전체 설계안을 짜줘.
포함할 것:
* 결제 진행 흐름 / 웹훅 처리 방식 / 구독 생애주기
* 결제 실패 재청구 전략 / 재시도 일정 / 유예기간
* 요금제 변경 시 정산 방식` },
  { id: "469", category: "SaaS", title: "제품 출시 체크리스트 40개", en: "Product Launch Checklist", body: `제품 출시 체크리스트 40개를 만들어줘.
구성:
* 출시 전(관심 모으기) / 출시 당일(배포와 확산) / 출시 후(재방문과 유지)
그리고
* 각 단계별 활용 채널 / 보낼 메일 / 확인할 성과 지표` },
  { id: "470", category: "SaaS", title: "이탈률 개선안 5개", en: "Reduce Churn Rate", body: `내 이탈 데이터를 보고 월간 이탈률을 [X]%에서 [Y]%로 낮출 수 있는 개선안 5개를 제안해줘: [상황 설명]
포함할 것:
* 다시 돌아오게 만드는 메일
* 해지 화면 개선안
* 이탈 전에 감지할 수 있는 경고 신호` },
  { id: "471", category: "성장마케팅", title: "리드 마그넷 아이디어 10개", en: "Lead Magnet Ideas", body: `[분야]에서 [상품명] 구매로 자연스럽게 이어질 수 있는 무료 제공 자료 아이디어 10개를 만들어줘.
조건:
* 2시간 안에 만들 수 있어야 하고
* 전환 가능성 순으로 정렬하고
* 형식(PDF, 체크리스트, 퀴즈, 템플릿 등)을 넣고
* 한 줄 소개 문구도 함께 써줘` },
  { id: "472", category: "성장마케팅", title: "제안 이메일 시퀀스 3통", en: "Sales Email Sequence", body: `[타깃 고객]에게 [상품명]을 제안하는 첫 제안 메일 3통 흐름을 써줘.
조건:
* 문제-자극-해결 구조를 활용하고
* 열람률이 높을 제목을 제안하고
* 메일 간 발송 간격 / 개인화 변수
* 후속 음성메시지 대본도 포함해줘` },
  { id: "473", category: "성장마케팅", title: "구매 망설임 15개 처리", en: "Handle Purchase Objections", body: `[상품명]을 사기 전에 사람들이 자주 하는 망설임 15개를 정리해줘.
각 항목마다
* 한 줄 반박 문장
* 망설임 유형(가격, 신뢰, 타이밍, 경쟁 등)
* 소개 페이지 어디에 넣으면 좋은지` },
  { id: "474", category: "성장마케팅", title: "자연 확산 구조 설계", en: "Design Viral Loop", body: `[상품명]에 자연 확산 구조를 설계해줘.
목표: 고객 1명이 평균 1.5명의 신규 사용자를 데려오게 만들기
포함할 것:
* 추천이 발생하는 순간 / 보상 구조 / 추적 방식
* 현실적인 확산 수치 예상` },
  { id: "475", category: "성장마케팅", title: "소개 페이지 제목 5가지 방식", en: "5 Landing Page Headlines", body: `[상품명]용 소개 페이지 제목 5개를 써줘.
각각 다른 방식 활용:
* 관심 끌기→흥미→욕구→행동 / 문제→자극→해결
* 전 / 후 비교 / 사회적 증거 / 긴급성 강조
각 제목마다 부제목 + 버튼 문구 + 비교 테스트 우선순위 포함` },
  { id: "476", category: "성장마케팅", title: "추천인 프로그램 설계", en: "Design Referral Program", body: `[상품명] 추천인 프로그램을 설계해줘.
포함할 것:
* 보상 구조 / 추적 방식 / 추천인용 이메일 문구
* 단계별 보상 / 뱃지 아이디어
* SNS 공유 문구 / 추천 1건당 예상 수익성` },
  { id: "477", category: "코드 작업", title: "프로젝트 운영 문서 만들기", en: "Create Project Documentation", body: `시니어 설계자처럼 내 전체 코드 구조를 검토하고 앞으로 더 효율적으로 협업할 수 있도록 프로젝트 운영 문서를 만들어줘.
포함할 것:
* 코딩 기준 / 프로젝트 구조 / 이름 짓는 규칙 / 기술 스택 설명` },
  { id: "478", category: "코드 작업", title: "시니어 코드 검토", en: "Senior Code Review", body: `변경된 코드 비교본을 보고, 이 구현이 마음에 들지 않는 시니어 개발자처럼 냉정하게 코드 검토를 해줘.
어떤 점을
* 비판할지 / 고쳐야 할지 / 반려해야 할지 솔직하게 말해줘` },
  { id: "479", category: "코드 작업", title: "오류 로그 분석", en: "Analyze Error Log", body: `이 오류 추적 로그를 분석해줘: [오류 내용]
포함할 것:
* 근본 원인
* 왜 이런 문제가 생겼는지 쉬운 말로 설명
* 적절한 오류 처리 방식이 포함된 해결책
* 같은 문제가 다시 생기지 않게 막는 재발 방지 테스트` },
  { id: "480", category: "코드 작업", title: "함수 리팩토링", en: "Refactor Function", body: `이 함수를 더 읽기 쉽고, 빠르고, 테스트하기 좋게 고쳐줘: [코드]
조건:
* 구조를 깔끔하게 나누고
* 왜 그렇게 바꿨는지 하나씩 설명하고
* 수정 전 / 후 차이도 보여줘` },
  { id: "481", category: "코드 작업", title: "전체 테스트 코드 작성", en: "Write Full Test Suite", body: `[함수명]에 대한 전체 테스트 코드를 작성해줘.
포함할 것:
* 정상 동작 / 예외 상황 / 오류 처리 / 경계값
* 다른 기능과 연결된 테스트
그리고
* 테스트 이름이 한눈에 보이게 작성해줘` },
  { id: "482", category: "코드 작업", title: "보안 취약점 점검", en: "Security Vulnerability Audit", body: `이 기능 연결 경로에 보안 취약점이 있는지 점검해줘: [코드]
체크할 것:
* SQL 삽입 공격 / 스크립트 삽입 공격 / 위조 요청 공격
* 인증 우회 / 요청 횟수 제한 누락 / 입력값 검증 문제 / 데이터 노출 위험
그리고 심각도 순으로 수정 우선순위를 정리해줘` },
  { id: "483", category: "생산성·시스템", title: "멀티 역할 주간 체계 설계", en: "Multi-Role Weekly System", body: `[역할 1]과 [역할 2]를 동시에 해내야 하는 사람을 위한 주간 업무 운영 체계를 설계해줘.
포함할 것:
* 시간 구간 배치 / 몰아서 처리하는 날 / 에너지 관리
* 회의 없는 집중 작업 시간 / 업무 전환 여유 시간 / 금요일 점검 루틴` },
  { id: "484", category: "생산성·시스템", title: "할 일 목록을 7일 실행 계획으로", en: "Task List to 7-Day Action Plan", body: `이 복잡한 할 일 목록을 7일 실행 계획으로 바꿔줘: [할 일 목록]
포함할 것:
* 우선순위 / 선후관계 / 위임 가능한 일 / 자동화 가능한 일
* 전체를 풀어주는 핵심 1개 / 버퍼 시간` },
  { id: "485", category: "생산성·시스템", title: "AI 자동화 10개 추천", en: "AI Automation Recommendations", body: `이번 주에 바로 세팅할 수 있는 인공지능 자동화 10개를 추천해줘.
내가 쓰는 도구: [사용 중인 도구]
현재 문제점: [현재 문제점]
포함할 것:
* 정확한 도구 이름 / 세팅 시간 / 주간 절약 시간 / 전체 효율` },
  { id: "486", category: "생산성·시스템", title: "의사결정 표 만들기", en: "Decision Matrix", body: `[선택지] 중 무엇을 선택할지 판단할 수 있는 의사결정 표를 만들어줘.
평가 항목:
* 기대 효과 / 위험도 / 시간 비용 / 되돌릴 수 있는 정도 / 목표와의 정렬도
그리고
* 가중치 점수 방식 / 최종 추천
* 결론을 바꿀 수 있는 핵심 질문 1개` },
  { id: "487", category: "생산성·시스템", title: "하루에 30일치 콘텐츠 만들기", en: "Content Batch System", body: `하루 8시간 만에 30일치 콘텐츠를 만드는 콘텐츠 몰아찍기 시스템을 설계해줘.
분야: [분야] / 형식: [콘텐츠 형식]
포함할 것:
* 분 단위 일정표 / 미리 준비할 파일과 템플릿 / 작업 후 점검 방식` },
  { id: "488", category: "생산성·시스템", title: "개인 운영 시스템 설계", en: "Personal Operating System", body: `[목표] 달성을 위한 개인 운영 시스템을 설계해줘.
포함할 것:
* 아침 루틴 / 하루 점검표 / 주간 계획 루틴 / 월간 회고 구조
* 노션 / 옵시디언 템플릿 구조 / 습관 추적 지표 / 분기별 목표 설정 방식` },
  { id: "489", category: "디버깅", title: "코드 구조 리팩토링", en: "Refactor Code Structure", body: `이 코드는 돌아가긴 하지만 유지보수가 너무 힘들어. 구조를 깔끔하게 다시 정리해줘: [코드]
포함할 것:
* 재사용 가능한 도구 분리 / 빠진 타입 추가
* 수정 전 / 후 구조도 / 모든 변경 이유 설명` },
  { id: "490", category: "디버깅", title: "운영 환경 버그 추적", en: "Debug Production Issue", body: `운영 환경에서 [오류 내용]이 발생하는데 로컬에서는 재현이 안 돼.
체계적인 문제 추적 절차 10단계를 만들어줘.
포함할 것:
* 환경 차이 체크리스트 / 추가해야 할 로그 전략
* 다음에 같은 문제가 생겼을 때 잡을 수 있는 모니터링 방식` },
  { id: "491", category: "디버깅", title: "두 접근법 비교", en: "Compare Two Implementation Approaches", body: `[기능]을 구현하는 두 가지 접근법을 비교해줘. [방식 A] vs [방식 B]
포함할 것:
* 장단점 / 성능 영향
* [팀 규모] 규모 팀이라면 어떤 방식을 고를지
* 의사결정 표 / 예상 개발 기간 / 12개월 유지보수 부담` },
  { id: "492", category: "디버깅", title: "기술 전환 계획", en: "Technology Migration Plan", body: `[기존 기술]에서 [새 기술]로 중단 없이 바꾸는 전환 계획을 짜줘.
포함할 것:
* 되돌리기 전략 / 위험 평가 / 단계별 일정
* 점진 적용 장치 / 전환 당일 실행용 안내서` },
  { id: "493", category: "디버깅", title: "데이터 구조 점검", en: "Database Schema Review", body: `[앱 유형] 앱의 데이터 구조를 검토해줘: [스키마]
확인할 것:
* 빠진 인덱스 / 반복 조회 문제 / 정규화 문제 / 확장 시 병목
그리고
* 구체적인 인덱스 생성 문장 / 캐시 구조 추천
* 현재 대비 10배 / 100배 규모에서의 성능 예상` },
  { id: "494", category: "디버깅", title: "오류 처리 전략 문서", en: "Error Handling Strategy", body: `[앱 유형]용 오류 처리 전략 문서를 작성해줘.
포함할 것:
* 사용자에게 보여줄 오류 / 로그 기록 방식 / 재시도 로직
* 장애 상황 우회 처리 / 알림 체계 / 오류 코드 체계
* 오류 추적 도구 연동 예시 / 심각도별 알림 기준` },
  { id: "495", category: "랜딩페이지", title: "첫 화면 문구 3가지 버전", en: "Hero Section Copy", body: `[상품명]의 가치를 3초 안에 이해시키는 첫 화면 문구를 써줘.
포함할 것:
* 제목 / 부제목 / 버튼 문구 / 신뢰를 높이는 한 줄
3가지 버전:
* 장점 중심형 / 궁금증 유발형 / 사회적 증거 중심형
추가로 대표 이미지 방향도 제안해줘` },
  { id: "496", category: "랜딩페이지", title: "후기 요청 메일 10개", en: "Request Customer Reviews", body: `고객에게 보낼 후기 요청 메일 10개를 써줘.
조건:
* 구체적이고 믿을 만한 후기가 나오도록 유도할 것
* 고객이 쉽게 수정해서 쓸 수 있는 후기 예시 포함
* 답변을 끌어내는 질문 포함
* 후속 연락 주기까지 포함` },
  { id: "497", category: "랜딩페이지", title: "가격 안내 페이지 & FAQ", en: "Pricing Page and FAQ", body: `[상품명]용 가격 안내 페이지와 자주 묻는 질문 구성을 짜줘.
포함할 것:
* 가장 많이 나오는 구매 망설임 5개에 대한 답변
* 경쟁사 비교표 / 환불 보장 표시 위치
* 버튼 근처 신뢰 요소` },
  { id: "498", category: "랜딩페이지", title: "사례 소개 페이지 틀", en: "Case Study Template", body: `[상품명]용 사례 소개 페이지 틀을 만들어줘.
구성:
* 문제 상황 / 해결 방법 / 구체적인 숫자가 들어간 결과 / 한 줄 인용문
그리고
* 고객 인터뷰 질문 / 시각 구성 초안 / 검색 최적화에 맞는 제목 형식` },
  { id: "499", category: "랜딩페이지", title: "홈페이지 구조 초안", en: "Website Structure Draft", body: `텍스트로 홈페이지 구조 초안을 설계해줘. 대상 제품은 [상품명]
각 섹션마다
* 역할 / 적정 글자 수 / 유도해야 할 감정
추가로
* 섹션별 도달 목표 / 모바일 / 데스크톱 차이
* 전환이 잘 나오는 버튼 배치 로직` },
  { id: "500", category: "랜딩페이지", title: "짧은 안내 문구 작성", en: "UX Microcopy Writing", body: `[상품명]에 들어갈 짧은 안내 문구를 작성해줘.
대상:
* 비어 있는 화면 / 오류 안내 문구 / 성공 안내 문구 / 도움말 문구 / 시작 안내 문구
각 메시지마다 친근한 / 전문적인 / 가벼운 3가지 버전 + 어떤 상황에 어떤 톤이 어울리는지 설명. 톤 기준: [원하는 말투]` },
  { id: "501", category: "수익화", title: "디지털 상품 아이디어 10개", en: "Digital Product Ideas", body: `내 전문성 [전문성]을 바탕으로 만들 수 있는 디지털 상품 아이디어 10개를 제안해줘.
포함할 것:
* 가격 / 형식 / 예상 제작 시간 / 수익성 대비 노력 순위
* 출시 순서 / 서로 묶어서 팔기 좋은 조합` },
  { id: "502", category: "수익화", title: "디지털 상품 출시 전략", en: "Digital Product Launch Strategy", body: `가격이 [가격]인 디지털 상품의 출시 전략을 짜줘.
포함할 것:
* 사전 대기자 모집 / 출시 주간 흐름 / 자동 판매 흐름
* 14일 메일 예열 순서
* 과하지 않으면서 자연스러운 희소성 장치 / 출시 후 점검표` },
  { id: "503", category: "수익화", title: "멤버십 & 커뮤니티 설계", en: "Design Membership Community", body: `[주제]를 중심으로 멤버십 / 커뮤니티 상품을 설계해줘.
포함할 것:
* 단계별 요금제 / 혜택 / 가격 / 콘텐츠 제공 주기 / 유지 장치
그리고
* 신규 회원 시작 흐름 / 커뮤니티 참여 루틴(주간 모임, 챌린지 등)
* 이탈 방지 장치` },
  { id: "504", category: "수익화", title: "객단가 올리기 3가지 방법", en: "Increase Average Order Value", body: `내 현재 매출 구조를 분석해서 새 상품 추가 없이 객단가를 올릴 수 있는 방법 3가지를 제안해줘: [현재 판매 중인 상품]
포함할 것:
* 상향 제안 / 추가 제안 배치 위치 / 묶음 판매 가격 심리
* 충성 고객 프로그램 구조 / 고객 생애가치 예상` },
  { id: "505", category: "수익화", title: "웨비나 구성안", en: "High-Converting Webinar Structure", body: `[상품명]을 판매하는 웨비나 구성안을 짜줘. 목표 전환율은 10% 이상이야.
포함할 것:
* 첫 훅 / 교육 파트 / 판매 제안으로 넘어가는 흐름
* 망설임 처리 / 장표별 구성 / 구간별 시간
* 다시보기 안내 메일 흐름 / 망설이는 사람을 전환시키는 실시간 질의응답 전략` },
  { id: "506", category: "수익화", title: "협업 제안 메시지 틀", en: "Collaboration Pitch Template", body: `[협업 대상 유형]과 협업하기 위한 제안 메시지 틀을 만들어줘.
포함할 것:
* 제안 가치 / 협업 구조 / 후속 연락 흐름
* 서로에게 돌아가는 이익 정리 / 수익 배분 방식
* 공동 홍보 아이디어 / 90일 성과 점검표` }
];

function CopyIcon({ copied }) {
  if (copied) {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function AIButton({ label, url, bg, color, hoverBg, icon, onOpen }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => { e.stopPropagation(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "4px",
        fontSize: "11px", fontWeight: 600,
        padding: "4px 9px", borderRadius: "8px",
        background: hov ? hoverBg : bg,
        color: color,
        textDecoration: "none",
        transition: "background 0.12s",
        userSelect: "none",
      }}
    >
      {icon}
      {label}
    </a>
  );
}

function PromptCard({ prompt }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const openAI = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const encoded = encodeURIComponent(prompt.body);

  const catStyle = {
    "생산성":     { badge: "#FEF3C7", badgeText: "#92400E", accent: "#F59E0B" },
    "리서치":     { badge: "#DBEAFE", badgeText: "#1E40AF", accent: "#3B82F6" },
    "콘텐츠":     { badge: "#FCE7F3", badgeText: "#9D174D", accent: "#EC4899" },
    "AI 워크플로우": { badge: "#D1FAE5", badgeText: "#065F46", accent: "#10B981" },
    "자동화":     { badge: "#EDE9FE", badgeText: "#5B21B6", accent: "#8B5CF6" },
    "코딩":       { badge: "#FFEDD5", badgeText: "#9A3412", accent: "#F97316" },
    "범용":       { badge: "#F0FDF4", badgeText: "#166534", accent: "#22C55E" },
    "마케팅":     { badge: "#FFF1F2", badgeText: "#9F1239", accent: "#F43F5E" },
    "세일즈":     { badge: "#ECFEFF", badgeText: "#164E63", accent: "#06B6D4" },
    "고객관리":   { badge: "#FFF7ED", badgeText: "#7C2D12", accent: "#EA580C" },
    "제품":       { badge: "#F5F3FF", badgeText: "#4C1D95", accent: "#7C3AED" },
    "엔지니어링": { badge: "#F0F9FF", badgeText: "#0C4A6E", accent: "#0EA5E9" },
    "글쓰기":     { badge: "#FDF4FF", badgeText: "#701A75", accent: "#D946EF" },
    "콘텐츠 전략": { badge: "#FFF8F0", badgeText: "#7C3D12", accent: "#F97316" },
    "SEO":        { badge: "#F0FDF4", badgeText: "#14532D", accent: "#16A34A" },
    "SaaS":       { badge: "#EFF6FF", badgeText: "#1E3A5F", accent: "#2563EB" },
    "성장마케팅":  { badge: "#FFF0F6", badgeText: "#831843", accent: "#EC4899" },
    "코드 작업":  { badge: "#F8F5FF", badgeText: "#3B0764", accent: "#7C3AED" },
    "생산성·시스템": { badge: "#FEFCE8", badgeText: "#713F12", accent: "#CA8A04" },
    "디버깅":     { badge: "#FFF1F2", badgeText: "#881337", accent: "#E11D48" },
    "랜딩페이지": { badge: "#F0FDFA", badgeText: "#134E4A", accent: "#0D9488" },
    "수익화":     { badge: "#FFFBEB", badgeText: "#78350F", accent: "#D97706" },
  }[prompt.category] || { badge: "#F3F4F6", badgeText: "#374151", accent: "#9CA3AF" };

  return (
    <div
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--color-background-primary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem 1.3rem",
        cursor: "pointer",
        transition: "box-shadow 0.15s, transform 0.1s",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxShadow: hovered ? `0 6px 24px rgba(0,0,0,0.1)` : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {/* 상단: 배지 + 카피 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{
            fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "20px",
            background: catStyle.badge, color: catStyle.badgeText, whiteSpace: "nowrap",
            letterSpacing: "0.01em",
          }}>
            {prompt.category}
          </span>
          <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums" }}>
            #{prompt.id}
          </span>
        </div>
        <span style={{
          fontSize: "12px", display: "flex", alignItems: "center", gap: "4px",
          color: copied ? "#16A34A" : "var(--color-text-tertiary)",
          whiteSpace: "nowrap", flexShrink: 0,
          fontWeight: copied ? 600 : 400,
          transition: "color 0.15s",
        }}>
          <CopyIcon copied={copied} />
          {copied ? "복사됨" : "복사"}
        </span>
      </div>

      {/* 제목 */}
      <div>
        <p style={{
          fontWeight: 700, fontSize: "17px", margin: "0 0 3px",
          color: "var(--color-text-primary)", lineHeight: 1.3, letterSpacing: "-0.01em",
        }}>
          {prompt.title}
        </p>
        <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", margin: 0, letterSpacing: "0.01em" }}>
          {prompt.en}
        </p>
      </div>

      {/* 본문 미리보기 */}
      <p style={{
        fontSize: "13px", color: "var(--color-text-secondary)", margin: 0,
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical", lineHeight: 1.65,
        paddingTop: "4px",
      }}>
        {prompt.body}
      </p>

      {/* AI 연동 버튼 */}
      <div
        style={{ display: "flex", gap: "6px", paddingTop: "2px" }}
        onClick={e => e.stopPropagation()}
      >
        {[
          {
            label: "Claude",
            url: `https://claude.ai/new?q=${encoded}`,
            bg: "rgba(124,58,237,0.08)",
            color: "var(--color-accent)",
            hoverBg: "rgba(124,58,237,0.16)",
            icon: (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            ),
          },
          {
            label: "ChatGPT",
            url: `https://chatgpt.com/?q=${encoded}`,
            bg: "rgba(16,163,127,0.08)",
            color: "#10A37F",
            hoverBg: "rgba(16,163,127,0.16)",
            icon: (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            ),
          },
          {
            label: "Gemini",
            url: `https://gemini.google.com/app?q=${encoded}`,
            bg: "rgba(66,133,244,0.08)",
            color: "#4285F4",
            hoverBg: "rgba(66,133,244,0.16)",
            icon: (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ),
          },
        ].map(({ label, url, bg, color, hoverBg, icon }) => (
          <AIButton
            key={label}
            label={label}
            url={url}
            bg={bg}
            color={color}
            hoverBg={hoverBg}
            icon={icon}
            onOpen={openAI}
          />
        ))}
      </div>
    </div>
  );
}

export default function PromptLibrary() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = useMemo(() => {
    return PROMPTS.filter(p => {
      const matchCat = activeCategory === "전체" || p.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q) || p.en.toLowerCase().includes(q) || p.id.includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  const counts = useMemo(() => {
    const map = { "전체": PROMPTS.length };
    PROMPTS.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, []);

  return (
    <div style={{ padding: "1.75rem 0 3rem", fontFamily: "var(--font-sans)" }}>
      <h2 style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>프롬프트 라이브러리</h2>

      {/* 검색바 */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative" }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{
            position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
            color: "var(--color-text-tertiary)", pointerEvents: "none",
          }}>
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="프롬프트 검색 — 키워드, 카테고리, ID"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              paddingLeft: "46px", paddingRight: "16px",
              height: "48px", width: "100%", boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {CATEGORIES.map(cat => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "7px 16px", borderRadius: "20px", fontSize: "13px",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                border: "none",
                background: active ? "var(--color-text-primary)" : "var(--color-border-tertiary)",
                color: active ? "var(--color-background-primary)" : "var(--color-text-secondary)",
                transition: "all 0.15s",
                lineHeight: 1,
              }}
            >
              {cat}
              <span style={{
                marginLeft: "5px",
                fontSize: "11px",
                opacity: active ? 0.7 : 0.5,
                fontWeight: 400,
              }}>
                {counts[cat] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* 결과 수 */}
      <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)", marginBottom: "1.25rem" }}>
        <strong style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>{filtered.length}</strong>개 표시 중 · 전체 {PROMPTS.length}개
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-secondary)", fontSize: "15px" }}>
          검색 결과가 없어요. 다른 키워드로 시도해 보세요.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "14px",
        }}>
          {filtered.map(p => <PromptCard key={p.id} prompt={p} />)}
        </div>
      )}
    </div>
  );
}
