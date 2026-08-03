/**
 * Antigravity Domain & Portal Analyzer
 * Dynamically synthesizes feature-specific, target-tailored test case definitions for any given URL.
 */

function analyzeTargetPortal(url) {
    let rawInput = (url || 'https://example.com').trim().replace(/^["']|["']$/g, '');
    const isApk = /\.apk$/i.test(rawInput) || /^[a-zA-Z]:\\.*\.apk$/i.test(rawInput);
    const isLocalFile = isApk || /^[a-zA-Z]:\\/i.test(rawInput) || /^file:\/\//i.test(rawInput);

    if (isApk || isLocalFile) {
        const filename = rawInput.split(/[\\/]/).pop() || 'AppPackage.apk';
        const appName = filename.replace(/\.apk$/i, '');
        const cleanAppName = appName.charAt(0).toUpperCase() + appName.slice(1);

        return {
            category: `Android Native Application (.apk)`,
            domain: filename,
            badgeColor: "var(--accent-cyan)",
            description: `Android Native APK package audit suite for ${cleanAppName} (${rawInput})`,
            isApk: true,
            apkPath: rawInput,
            playwrightCases: [
                { id: "TC-01", name: `[${filename}] Android Native APK Package Structure Check`, desc: `Validates local APK package binary structure, manifest header, and file integrity.` },
                { id: "TC-02", name: `[${filename}] AndroidManifest.xml Main Activity & Package Hydration`, desc: `Audits launch activity declaration, exported intent filters, and package name initialization.` },
                { id: "TC-03", name: `[${filename}] Target SDK Level & Permission Scope Audit`, desc: `Verifies targetSdkVersion compliance and dangerous permission declarations (Camera, Storage, Location).` },
                { id: "TC-04", name: `[${filename}] Mobile Viewport & Native UI Container Sizing`, desc: `Audits native Android activity view containers and responsive layout bounds.` },
                { id: "TC-05", name: `[${filename}] Accessibility Content Description & Screen Reader Check`, desc: `Inspects native UI element contentDescription tags for TalkBack screen reader accessibility.` }
            ],
            appiumCases: [
                { id: "MTC-01", name: `[${filename}] Appium Native App Installation & Cold Boot Launch`, desc: `Deploys ${filename} via UiAutomator2 driver and audits main activity launch latency.` },
                { id: "MTC-02", name: `[${filename}] Mobile Touch Target & Viewport Sizing Audit`, desc: `Audits native Android button dimensions and touch tap targets against 44x44px guidelines.` }
            ],
            dastCases: [
                { id: "SEC-01", name: `[${filename}] Android Security & Manifest Permission Audit`, desc: `Audits declared permissions, dangerous intent filters, and exported components.` },
                { id: "SEC-02", name: `[${filename}] Network Security Config & SSL Pinning Enforcement`, desc: `Verifies Network Security Configuration (res/xml/network_security_config.xml) and SSL pinning.` },
                { id: "SEC-03", name: `[${filename}] Application Debuggable & Backup Flag Vulnerability Check`, desc: `Checks android:debuggable and android:allowBackup flags to prevent data extraction.` },
                { id: "SEC-04", name: `[${filename}] Hardcoded API Token & Secret Leakage Inspection`, desc: `Scans compiled DEX classes and assets for exposed API keys, tokens, or private secrets.` },
                { id: "SEC-05", name: `[${filename}] Obfuscation & ProGuard / R8 Binary Integrity Check`, desc: `Inspects DEX bytecode obfuscation, ProGuard mapping rules, and reverse-engineering resistance.` }
            ],
            apiCases: [
                { id: "API-01", name: `[${filename}] Native App API Gateway Endpoint Probe (/api)`, desc: `Probes backend REST/GraphQL service endpoints consumed by the native Android app.`, path: '/api' },
                { id: "API-02", name: `[${filename}] Mobile Auth & Session Refresh Route Probe (/auth)`, desc: `Checks OAuth2 / JWT authentication refresh and session status endpoints.`, path: '/auth' },
                { id: "API-03", name: `[${filename}] System Health & Remote Config Service Probe (/status)`, desc: `Pings remote configuration, feature flag, and health check service routes.`, path: '/status' }
            ]
        };
    }

    let cleanUrl = rawInput;
    if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'https://' + cleanUrl;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(cleanUrl);
    } catch (e) {
        parsedUrl = { hostname: 'example.com', pathname: '/', protocol: 'https:', search: '', port: '' };
    }

    const hostname = parsedUrl.hostname ? parsedUrl.hostname.toLowerCase() : 'example.com';
    const portStr = parsedUrl.port ? `:${parsedUrl.port}` : '';
    const domain = hostname + portStr;
    const path = parsedUrl.pathname ? parsedUrl.pathname.toLowerCase() : '/';
    const scheme = parsedUrl.protocol ? parsedUrl.protocol.replace(':', '').toLowerCase() : 'https';

    // Extract site/brand name
    const parts = hostname.split('.').filter(p => !['www', 'com', 'org', 'net', 'io', 'co', 'uk', 'dev', 'app', 'store', 'local'].includes(p));
    const mainBrand = parts.length > 0 ? parts[parts.length - 1] : hostname;
    const siteName = mainBrand.charAt(0).toUpperCase() + mainBrand.slice(1);

    const pathSegments = path.split('/').filter(Boolean);
    const primaryPath = pathSegments.length > 0 ? pathSegments[0] : '';

    // Specialized Domain Rules (Recognizing specific platforms for hyper-targeted feature tests)
    const isAmazon = /amazon/i.test(domain);
    const isEbay = /ebay/i.test(domain);
    const isGithub = /github/i.test(domain);
    const isGitlab = /gitlab/i.test(domain);
    const isSlack = /slack/i.test(domain);
    const isTrello = /trello/i.test(domain);
    const isNotion = /notion/i.test(domain);
    const isPinterest = /pinterest/i.test(domain);

    // General feature detectors based on domain & path keywords
    const isECommerce = /shop|store|cart|buy|checkout|order|product|item|mall|goods|catalog|marketplace|price/i.test(path + hostname + rawInput);
    const isCartOrCheckout = /cart|checkout|buy|pay|basket|order/i.test(path + hostname);
    const isProductPage = /product|item|pd|dp|shop|store|goods|catalog/i.test(path + hostname);
    const isDocsOrCode = /doc|api|code|repo|git|developer|spec|wiki/i.test(path + hostname);
    const isMediaBlog = /blog|article|post|news|press|media|story|pin|board|photo|video|gallery|feed/i.test(path + hostname);
    const isBanking = /bank|pay|iban|finance|transaction|transfer|wallet|credit|money|loan|sepa|account/i.test(path + hostname + rawInput);

    let category = `${siteName} Web Application`;
    let badgeColor = "var(--accent-purple)";
    let description = `Targeted functionality and security audit suite customized for ${siteName} (${domain}${path})`;

    let playwrightCases = [];
    let appiumCases = [];
    let dastCases = [];
    let apiCases = [];

    if (isPinterest) {
        category = "Visual Discovery & Social Bookmark Platform (Pinterest)";
        badgeColor = "var(--accent-rose)";
        description = `Visual pin grid, board curation, image CDN hydration, and search discovery audit for Pinterest (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `Pinterest Visual Pin Grid Hydration & Masonry Layout Audit`, desc: `Audits Pinterest infinite scroll masonry grid, pin image paint speed, and DOM performance.` },
            { id: "TC-02", name: `Visual Search & Pin Detail Modal Viewport Check`, desc: `Verifies high-res image modal zoom, pin creation button, and related board card rendering.` },
            { id: "TC-03", name: `Board Creation & Save Pin Interactive State Retention`, desc: `Tests Save-Pin drawer flyout, board selector dropdowns, and user collection updates.` },
            { id: "TC-04", name: `Visual Image Alt Attributes & TalkBack ARIA Accessibility`, desc: `Audits image alt descriptors, visual search icons, and ARIA accessibility tags.` },
            { id: "TC-05", name: `CDN Image Delivery & SSL Transport Security Compliance`, desc: `Verifies image CDN domain TLS encryption, CORS headers, and anti-CSRF protections.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `Pinterest Mobile Pin Card & Save Button Touch Target Audit`, desc: `Verifies pin cards and Save buttons meet minimum 44x44px mobile touch standards.` },
            { id: "MTC-02", name: `Pinterest Mobile Board Navigation & Feed Drawer Accessibility`, desc: `Audits mobile bottom navigation bar and board creation drawer accessibility.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `Pinterest Image CDN SSL & Transport Security Compliance`, desc: `Validates TLS 1.3 encryption and CORS policies on image asset servers.` },
            { id: "SEC-02", name: `OAuth2 Social Session Cookie Security Flags (Secure/HttpOnly)`, desc: `Inspects authentication session cookies for security flags.` },
            { id: "SEC-03", name: `Pin Creation & Board Save Anti-CSRF Token Verification`, desc: `Verifies anti-CSRF token defense on board updates and pin saves.` },
            { id: "SEC-04", name: `User Profile PII & Private Board Exposure Prevention`, desc: `Checks headers preventing caching or exposure of private board content.` },
            { id: "SEC-05", name: `Content Security Policy (CSP) for Media & Ad Scripts`, desc: `Validates CSP headers restricting unauthorized third-party script injection.` }
        ];

        apiCases = [
            { id: "API-01", name: `Pinterest Pin Feed & Search API Probe (/v3/search)`, desc: `Probes pin search and visual discovery API endpoints.`, path: '/v3/search' },
            { id: "API-02", name: `User Board & Saved Pin Collection Probe (/v3/boards)`, desc: `Checks user board and collection retrieval API routes.`, path: '/v3/boards' },
            { id: "API-03", name: `Robots.txt & Sitemap Indexing Controls (/robots.txt)`, desc: `Inspects search engine indexing rules for visual pin boards.`, path: '/robots.txt' }
        ];
    } else if (isBanking) {
        category = "Financial Banking & Transaction Portal";
        badgeColor = "var(--accent-emerald)";
        description = `Financial transaction, IBAN transfer, and payment gateway security audit for ${siteName}`;

        playwrightCases = [
            { id: "TC-01", name: `[${siteName}] User Authentication & Multi-Factor Login Verification`, desc: `Audits secure login form hydration, credential validation, and session token generation.` },
            { id: "TC-02", name: `[${siteName}] IBAN Account Number Validation & SEPA Transfer Assertion`, desc: `Verifies IBAN account input formatting, checksum validation, and electronic fund transfer (EFT) assertion.` },
            { id: "TC-03", name: `[${siteName}] Payment Gateway Settlement & Real-Time Balance Inquiry`, desc: `Tests transaction ledger reconciliation, balance update speed, and settlement confirmation.` },
            { id: "TC-04", name: `[${siteName}] 2FA / OTP Transaction Authorization Security Flow`, desc: `Audits multi-factor authorization prompts, SMS/Email OTP input fields, and session timeout.` },
            { id: "TC-05", name: `[${siteName}] Electronic Transfer Receipt & Audit Log Compliance`, desc: `Validates transaction receipt generation, downloadable PDF statements, and audit trail integrity.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `[${siteName}] Mobile Banking Touch Target & Biometric Prompt Audit`, desc: `Audits mobile banking tap targets, biometric fingerprint/FaceID prompts, and WCAG 44x44px compliance.` },
            { id: "MTC-02", name: `[${siteName}] Mobile Fund Transfer Viewport & Keypad Tap Accessibility`, desc: `Verifies numeric PIN keypad layout, mobile transfer form fields, and screen reader labels.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `[${siteName}] Financial API PCI-DSS & Open Banking Security Baseline`, desc: `Audits HTTP security headers, CORS origin restrictions, and Open Banking API compliance.` },
            { id: "SEC-02", name: `[${siteName}] Sensitive Financial Data (IBAN / Credentials) Masking Audit`, desc: `Inspects client-side DOM and network requests for proper IBAN/PAN account masking.` },
            { id: "SEC-03", name: `[${siteName}] Transaction Replay & Anti-Tampering Protection Audit`, desc: `Validates anti-replay nonce headers, request signature tokens, and payload integrity.` },
            { id: "SEC-04", name: `[${siteName}] OAuth2 Financial Access Token & Session Expiration Audit`, desc: `Checks access token encryption, refresh token rotation, and strict session timeouts.` },
            { id: "SEC-05", name: `[${siteName}] TLS v1.3 Strong Cipher & SSL Certificate Verification`, desc: `Validates SSL/TLS v1.3 encryption, certificate chain validity, and HSTS enforcement.` }
        ];

        apiCases = [
            { id: "API-01", name: `[${siteName}] Money Transfer Service Endpoint Probe (/api/v1/transfer)`, desc: `Probes electronic fund transfer REST endpoint latency and payload validation.`, path: '/api/v1/transfer' },
            { id: "API-02", name: `[${siteName}] Account Balance Inquiry Endpoint Probe (/api/v1/balance)`, desc: `Pings real-time account balance and ledger reconciliation API route.`, path: '/api/v1/balance' },
            { id: "API-03", name: `[${siteName}] Payment Gateway Authorization Probe (/api/v1/payment)`, desc: `Checks payment authorization gateway availability and status code response.`, path: '/api/v1/payment' }
        ];
    } else if (isAmazon) {
        category = "E-Commerce & Retail Marketplace (Amazon)";
        badgeColor = "var(--accent-cyan)";
        description = `Retail marketplace, product catalog, and 1-click order workflow audit for Amazon (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `Amazon Product Search Bar & Auto-Suggest Hydration`, desc: `Audits Amazon main search input responsiveness, dropdown suggestion paint speed, and DOM performance.` },
            { id: "TC-02", name: `Product Detail Grid & Image Carousel Viewport Check`, desc: `Verifies image zoom modal, thumbnail gallery carousel, and price block rendering on ${domain}${path}.` },
            { id: "TC-03", name: `Add-to-Cart & Buy Now Interactive State Integrity`, desc: `Tests persistent Shopping Cart counter updates, side drawer flyout, and session state retention.` },
            { id: "TC-04", name: `Customer Reviews & Star Rating DOM Accessibility`, desc: `Audits customer review filter tabs, star rating SVGs, and verified buyer badge accessibility.` },
            { id: "TC-05", name: `Checkout Gateway SSL & PCI-DSS Security Compliance`, desc: `Verifies HTTPS strict transport security, payment iframe isolation, and anti-CSRF token defense.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `Amazon Mobile App Touch Target Audit for Buy Buttons`, desc: `Verifies 1-Click Buy and Add-to-Cart buttons exceed 44x44px touch constraints on mobile.` },
            { id: "MTC-02", name: `Mobile Hamburger Navigation & Department Menu Sizing`, desc: `Audits slide-out category drawer and mobile user account controls alignment.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `Amazon PCI-DSS Payment Gateway SSL/TLS Transport`, desc: `Validates TLS 1.3 encryption on checkout endpoints and payment card transport security.` },
            { id: "SEC-02", name: `Session Cookie Security Flags (Secure & HttpOnly)`, desc: `Inspects Set-Cookie session tokens for secure flags preventing session hijacking.` },
            { id: "SEC-03", name: `Cart Anti-CSRF Token & State Modification Protection`, desc: `Verifies anti-CSRF tokens on cart modifications and order placement requests.` },
            { id: "SEC-04", name: "Customer PII & Saved Address Exposure Prevention", desc: "Audits response headers and caching policies to prevent leakage of user addresses or PII." },
            { id: "SEC-05", name: "Subresource Integrity (SRI) for Third-Party Tracking Scripts", desc: "Validates SRI hashes on external analytics and ad attribution scripts." }
        ];

        apiCases = [
            { id: "API-01", name: `Amazon Product Search API Probe (${primaryPath ? '/' + primaryPath : '/s'})`, desc: `Pings Amazon product query and autocomplete API routes.`, path: primaryPath ? `/${primaryPath}` : '/s' },
            { id: "API-02", name: `Cart & Fulfillment Gateway API Probe (/gp/cart)`, desc: `Checks shopping cart item modification and fulfillment session endpoints.`, path: '/gp/cart' },
            { id: "API-03", name: `Robots.txt & Sitemap Indexing Controls (/robots.txt)`, desc: `Inspects search engine crawler rules for product catalog pages.`, path: '/robots.txt' }
        ];

    } else if (isEbay) {
        category = "Auction & C2C E-Commerce Portal (eBay)";
        badgeColor = "var(--accent-cyan)";
        description = `Live auction bidding, seller reputation, and item search audit for eBay (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `eBay Auction Bidding Timer & Live Price Hydration`, desc: `Measures real-time countdown timer hydration, bid update WebSocket latency, and DOM paint speed.` },
            { id: "TC-02", name: `Seller Feedback Score & Seller Reputation Card Check`, desc: `Verifies seller star percentage badges, return policy panel, and feedback item table rendering.` },
            { id: "TC-03", name: `Filter by Item Condition (New/Used) & Price Slider Audit`, desc: `Audits faceted search filters, checkbox state persistence, and responsive reflow on ${domain}${path}.` },
            { id: "TC-04", name: `Watchlist & Saved Search Interactive Toggle State`, desc: `Tests "Add to Watchlist" bookmarking state, heart icon toggle feedback, and localStorage sync.` },
            { id: "TC-05", name: `Buy-It-Now & PayPal Gateway Security Verification`, desc: `Verifies HTTPS transport encryption, PayPal checkout redirect, and frame options protection.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `eBay Mobile Place Bid Touch Target Accessibility`, desc: `Ensures "Place Bid" and "Buy It Now" mobile tap targets exceed 44x44px touch standards.` },
            { id: "MTC-02", name: `Mobile Filter Sheet & Category Drawer Alignment`, desc: `Audits bottom sheet filter drawers and mobile sorting controls on mobile viewports.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `eBay Auction Bidding CSRF & Fraud Control Audit`, desc: `Verifies anti-CSRF token enforcement on live bid submissions and price overrides.` },
            { id: "SEC-02", name: `Seller Communication & User Message Input XSS Defense`, desc: `Validates Content-Security-Policy headers against XSS script injection in seller messaging.` },
            { id: "SEC-03", name: "SSL Certificate & Cipher Suite Audit for Checkout", desc: "Validates TLS 1.2+ certificate validity and cipher suites for payment endpoints." },
            { id: "SEC-04", name: "OAuth Token Expiration & Watchlist Session Check", desc: "Inspects OAuth token refresh and expiration handling for user sessions." },
            { id: "SEC-05", name: "Sensitive Path & Configuration Leakage Audit", desc: "Probes for exposed server configurations and debug endpoints." }
        ];

        apiCases = [
            { id: "API-01", name: `eBay Item Listing & Search API Probe (${primaryPath ? '/' + primaryPath : '/sch'})`, desc: `Probes item search API endpoints and category query routes.`, path: primaryPath ? `/${primaryPath}` : '/sch' },
            { id: "API-02", name: `Bidding & Watchlist API Health Check (/sch/api)`, desc: `Pings bidding status and user watchlist management API routes.`, path: '/sch/api' },
            { id: "API-03", name: `Service Discovery & robots.txt Probe (/robots.txt)`, desc: `Checks eBay crawler access policies and sitemap indexes.`, path: '/robots.txt' }
        ];

    } else if (isGithub || isGitlab) {
        const platform = isGithub ? 'GitHub' : 'GitLab';
        category = `Developer Platform & Code Repository (${platform})`;
        badgeColor = "var(--accent-purple)";
        description = `Code repository, pull requests, CI/CD pipeline, and developer portal audit for ${platform} (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `${platform} Code Viewer & Syntax Highlighting Paint Speed`, desc: `Measures code line rendering speed, virtualized list scrolling performance, and syntax highlighting.` },
            { id: "TC-02", name: `File Tree Directory Navigation & Breadcrumb Hierarchy`, desc: `Verifies repository file browser, branch switcher dropdown, and directory path breadcrumbs on ${domain}${path}.` },
            { id: "TC-03", name: `Pull Request Diff Viewer & Line Comment Interactive Audit`, desc: `Tests inline code review comments, diff chunk expanders, and pull request tab switching.` },
            { id: "TC-04", name: `Repository Star, Fork & Watch Counter Hydration`, desc: `Verifies asynchronous counter state hydration, action button toggles, and ARIA labels.` },
            { id: "TC-05", name: `Raw File Download & Git Transport Security Audit`, desc: `Validates HTTPS transport security, Content-Security-Policy headers, and raw blob download MIME types.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `${platform} Mobile Code Viewport Horizontal Scroll Check`, desc: `Ensures code blocks support smooth horizontal scrolling without breaking page layout.` },
            { id: "MTC-02", name: `Mobile Issue & Pull Request Navigation Target Audit`, desc: `Audits touch target bounds for issue labels, branch selection, and action buttons.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `${platform} Personal Access Token & OAuth Header Security`, desc: `Verifies OAuth token headers, API authorization checks, and token leakage defenses.` },
            { id: "SEC-02", name: `.git/config & Production Repository Exposure Audit`, desc: `Probes for exposed .git/config, .gitignore, and deployment metadata leaks.` },
            { id: "SEC-03", name: "Content Security Policy for Markdown Script Injection", desc: "Validates CSP headers to prevent inline script execution within rendered README markdown." },
            { id: "SEC-04", name: "CORS Whitelist & API Origin Enforcement", desc: "Verifies CORS headers restrict unauthorized cross-origin API calls." },
            { id: "SEC-05", name: "Clickjacking Protection on OAuth Authorize Pages", desc: "Validates X-Frame-Options DENY/SAMEORIGIN on authentication pages." }
        ];

        apiCases = [
            { id: "API-01", name: `${platform} REST v3 / GraphQL API Endpoint Probe (/api/v3)`, desc: `Probes code repository REST and GraphQL API routes.`, path: '/api/v3' },
            { id: "API-02", name: `${platform} Webhook & CI/CD Pipeline Status Probe (/status)`, desc: `Checks webhook delivery endpoints and platform status services.`, path: '/status' },
            { id: "API-03", name: `Service Discovery & Crawling Metadata Probe (/robots.txt)`, desc: `Inspects crawler indexing permissions for public code repositories.`, path: '/robots.txt' }
        ];

    } else if (isSlack || isTrello || isNotion) {
        const platform = isSlack ? 'Slack' : (isTrello ? 'Trello' : 'Notion');
        category = `SaaS Workspace & Collaboration Platform (${platform})`;
        badgeColor = "var(--accent-emerald)";
        description = `Cloud workspace, user session, and real-time collaboration audit for ${platform} (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `${platform} Single-Page App (SPA) Workspace Load Speed`, desc: `Measures workspace hydration latency, sidebar channel loading speed, and main view FCP.` },
            { id: "TC-02", name: `User Session Token & Authentication Redirection Audit`, desc: `Verifies SSO auth selectors, magic-link token persistence, and session expiry redirects.` },
            { id: "TC-03", name: `Rich Text Message Editor & Formatting Controls Check`, desc: `Tests interactive text editor controls, attachment dropzone bounds, and emoji picker state.` },
            { id: "TC-04", name: `Collapsible Sidebar Drawer & Workspace Viewport Sizing`, desc: `Audits responsive sidebar collapsing, modal dialog focus traps, and drawer bounds.` },
            { id: "TC-05", name: `WebSocket Real-Time Transport & Security Header Audit`, desc: `Validates WSS / HTTPS transport encryption, anti-CSRF headers, and frame options.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `${platform} Mobile Channel & Board Navigation Tap Targets`, desc: `Ensures touch targets for channel items, board cards, and action menus exceed 44x44px.` },
            { id: "MTC-02", name: `${platform} Mobile Workspace Menu & User Profile Drawer Alignment`, desc: `Audits slide-out workspace navigation drawers and user presence toggles.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `${platform} Session Token & JWT Security Flags Audit`, desc: `Validates JWT token expiration, Secure/HttpOnly flags, and session rotation policies.` },
            { id: "SEC-02", name: `${platform} OAuth Redirect URI & Open Redirect Vulnerability Check`, desc: `Inspects OAuth redirect parameters for open redirect protection.` },
            { id: "SEC-03", name: "Cross-Tenant Data Isolation & Access Control", desc: "Checks tenant isolation headers to prevent cross-workspace data leakage." },
            { id: "SEC-04", name: "Content Security Policy & XSS Prevention Headers", desc: "Validates CSP directives preventing malicious script injection in user content." },
            { id: "SEC-05", name: "Rate Limiting & Brute-Force Defense Headers", desc: "Inspects X-RateLimit response headers on authentication routes." }
        ];

        apiCases = [
            { id: "API-01", name: `${platform} Workspace API Gateway Probe (/api)`, desc: `Probes workspace REST and GraphQL API endpoints.`, path: '/api' },
            { id: "API-02", name: `${platform} User Session & Auth Refresh Route Probe (/auth)`, desc: `Checks authentication refresh and session status endpoints.`, path: '/auth' },
            { id: "API-03", name: `System Status & Robots Metadata Probe (/status)`, desc: `Pings platform health and crawler metadata endpoints.`, path: '/status' }
        ];

    } else if (isECommerce || isProductPage || isCartOrCheckout) {
        category = `E-Commerce Storefront (${siteName})`;
        badgeColor = "var(--accent-cyan)";
        description = `Product catalog, shopping cart, and checkout flow audit for ${siteName} (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `${siteName} Product Catalog Hydration & LCP Performance`, desc: `Measures Largest Contentful Paint (LCP) and product grid rendering speed for ${domain}${path}.` },
            { id: "TC-02", name: `Interactive Shopping Cart & Storage State Persistence`, desc: `Tests add-to-cart interactivity, persistent storage counters, and cart drawer rendering.` },
            { id: "TC-03", name: `Checkout Payment Form & SSL Transport Security`, desc: `Verifies HTTPS strict transport, TLS payment encryption, and secure checkout headers.` },
            { id: "TC-04", name: `Mobile Product Cards & Buy Button Touch Target Audit`, desc: `Audits product cards and Buy buttons against minimum 44x44px mobile touch standards.` },
            { id: "TC-05", name: `Product Thumbnail Alt Attributes & ARIA Accessibility`, desc: `Inspects product image alt tags, screen reader labels, and color swatches.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `${siteName} Mobile Product Card Touch Target Audit`, desc: `Verifies interactive product cards exceed 44x44px touch targets.` },
            { id: "MTC-02", name: `${siteName} Mobile Shopping Cart Badge & Navigation Accessibility`, desc: `Audits mobile cart badge updates and slide-out navigation.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `${siteName} Payment SSL & PCI-DSS Transport Compliance`, desc: `Validates TLS 1.2+ encryption on payment endpoints.` },
            { id: "SEC-02", name: `Cart Session Cookie Security Flags (Secure/HttpOnly)`, desc: `Inspects session cookies for security flags preventing token theft.` },
            { id: "SEC-03", name: `Checkout Anti-CSRF Token Enforcement`, desc: `Verifies anti-CSRF tokens on form submissions and order placement.` },
            { id: "SEC-04", name: "Customer PII & Address Exposure Prevention", desc: "Checks response headers preventing caching of user PII." },
            { id: "SEC-05", name: "Subresource Integrity (SRI) for Payment Scripts", desc: "Validates SRI hashes on third-party payment scripts." }
        ];

        apiCases = [
            { id: "API-01", name: `${siteName} Catalog & Product API Probe (${primaryPath ? '/' + primaryPath : '/api'})`, desc: `Probes catalog listing and product query API routes.`, path: primaryPath ? `/${primaryPath}` : '/api' },
            { id: "API-02", name: `${siteName} Shopping Cart API Endpoint Probe (/cart)`, desc: `Checks cart modification and checkout session endpoints.`, path: '/cart' },
            { id: "API-03", name: `Service Discovery & Robots Metadata (/robots.txt)`, desc: `Inspects crawler access rules and sitemap indexes.`, path: '/robots.txt' }
        ];

    } else if (isDocsOrCode) {
        category = `Documentation & Developer API Portal (${siteName})`;
        badgeColor = "var(--accent-purple)";
        description = `API reference, code samples, and technical documentation audit for ${siteName} (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `${siteName} API Documentation Navigation & Code Block Render`, desc: `Audits code block paint speed, sidebar section navigation, and DOM hydration on ${domain}${path}.` },
            { id: "TC-02", name: `Search Index & Quick Filter Auto-Suggest Audit`, desc: `Verifies API search bar auto-complete, keyboard navigation, and result highlighting.` },
            { id: "TC-03", name: `Interactive API Sandbox & Try-It-Out Controller`, desc: `Tests interactive endpoint request forms, payload previewers, and response containers.` },
            { id: "TC-04", name: `Responsive Code Container Horizontal Overflow Check`, desc: `Ensures code blocks support smooth horizontal scrolling on mobile viewports.` },
            { id: "TC-05", name: `HSTS, CSP & Security Header Baseline Verification`, desc: `Inspects HTTPS transport security, Content-Security-Policy, and X-Frame-Options.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `${siteName} Mobile API Code Block Horizontal Scroll Audit`, desc: `Verifies code snippets scale properly on mobile screens.` },
            { id: "MTC-02", name: `${siteName} Mobile Documentation Sidebar Drawer & Search Alignment`, desc: `Audits mobile navigation drawer and search input tap targets.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `${siteName} Developer API Key Exposure & Header Audit`, desc: `Checks for accidental API key or secret token exposure in headers.` },
            { id: "SEC-02", name: `${siteName} Documentation Path & File Exposure Audit`, desc: `Probes for exposed .env, .git/config, or raw source maps.` },
            { id: "SEC-03", name: "Content Security Policy for Code Rendering", desc: "Validates CSP headers preventing script execution in code previews." },
            { id: "SEC-04", name: "CORS Access Control & Origin Whitelist Check", desc: "Verifies CORS headers restrict unauthorized API requests." },
            { id: "SEC-05", name: "Clickjacking Protection on Interactive Sandbox", desc: "Validates X-Frame-Options directives on API sandbox embeds." }
        ];

        apiCases = [
            { id: "API-01", name: `${siteName} API Reference Discovery Probe (${primaryPath ? '/' + primaryPath : '/api'})`, desc: `Pings API reference and documentation routes.`, path: primaryPath ? `/${primaryPath}` : '/api' },
            { id: "API-02", name: `${siteName} OpenAPI / Swagger Spec Endpoint Probe (/swagger.json)`, desc: `Checks OpenAPI specification and service status.`, path: '/swagger.json' },
            { id: "API-03", name: `Crawler Rules & Sitemap Discovery Probe (/robots.txt)`, desc: `Inspects robots.txt and sitemap discovery routes.`, path: '/robots.txt' }
        ];

    } else if (isMediaBlog) {
        category = `Content & Media Publishing Portal (${siteName})`;
        badgeColor = "var(--accent-amber)";
        description = `Article feed, SEO metadata, and publishing platform audit for ${siteName} (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `${siteName} Article Feed Hydration & FCP Performance`, desc: `Audits initial article feed loading speed and First Contentful Paint (FCP) on ${domain}${path}.` },
            { id: "TC-02", name: `Open Graph, Meta Descriptions & SEO Structure Check`, desc: `Verifies og:image, twitter:card, meta viewport, and H1 heading structures.` },
            { id: "TC-03", name: `${siteName} Article Inline Media Alt Tags & Screen Reader Audit`, desc: `Inspects article images, inline figures, and video alt descriptors for accessibility.` },
            { id: "TC-04", name: `Mobile Typography Readability & Viewport Bounds Check`, desc: `Audits paragraph font sizing, line height readability, and mobile viewport margins.` },
            { id: "TC-05", name: `Secure Transport & Third-Party Script Security Audit`, desc: `Inspects HTTPS encryption and third-party ad/analytics script headers.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `${siteName} Mobile Article Reading Touch Target Audit`, desc: `Verifies inline article links and share buttons satisfy touch target sizing.` },
            { id: "MTC-02", name: `${siteName} Mobile Article Share Drawer & Navigation Alignment`, desc: `Audits mobile social share overlays and header menu toggles.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `${siteName} Third-Party Ad Script & Tracker Security Audit`, desc: `Inspects ad network scripts for CSP violations and malicious payloads.` },
            { id: "SEC-02", name: `${siteName} Content Paywall & Cookie Security Flags Check`, desc: `Validates paywall session cookies for Secure and HttpOnly flags.` },
            { id: "SEC-03", name: "CDN Cache Poisoning & Content Integrity Headers", desc: "Checks Cache-Control, ETag, and SRI headers on media assets." },
            { id: "SEC-04", name: "User Comment Input & Form XSS Injection Audit", desc: "Validates anti-XSS protections on article comment fields." },
            { id: "SEC-05", name: "Referrer Policy & Hotlink Protection Verification", desc: "Verifies Referrer-Policy headers on media assets." }
        ];

        apiCases = [
            { id: "API-01", name: `${siteName} Article Content Feed Probe (${primaryPath ? '/' + primaryPath : '/feed'})`, desc: `Probes article feed and RSS/Atom XML routes.`, path: primaryPath ? `/${primaryPath}` : '/feed' },
            { id: "API-02", name: `${siteName} Search & Tag Discovery Endpoint Probe (/search)`, desc: `Checks content search and tag filtering API routes.`, path: '/search' },
            { id: "API-03", name: `Robots.txt & Sitemap Indexing Controls (/robots.txt)`, desc: `Inspects search engine indexing rules for media articles.`, path: '/robots.txt' }
        ];

    } else {
        // Fallback for custom or corporate URLs: build target-specific feature tests using path & brand
        const featureFocus = primaryPath ? primaryPath.replace(/[-_]/g, ' ') : 'Core Service';
        const featureTitle = featureFocus.charAt(0).toUpperCase() + featureFocus.slice(1);

        category = `Enterprise Web Application (${siteName})`;
        badgeColor = "var(--accent-purple)";
        description = `Corporate web application, enterprise service, and user interface audit for ${siteName} (${domain}${path})`;

        playwrightCases = [
            { id: "TC-01", name: `${siteName} ${featureTitle} Viewport Hydration & Performance Audit`, desc: `Measures navigation timing performance and DOM paint speed for ${domain}${path}.` },
            { id: "TC-02", name: `${siteName} SEO Metadata & Viewport Structure Verification`, desc: `Verifies viewport scaling, charset encoding, and H1 heading hierarchy on ${domain}${path}.` },
            { id: "TC-03", name: `${siteName} Transport Encryption & Security Policy Enforcement`, desc: `Inspects HTTPS connection protocol, HSTS, CSP, and X-Frame-Options for ${domain}.` },
            { id: "TC-04", name: `${siteName} Multi-Device Responsive Layout & Container Sizing`, desc: `Audits responsive container scaling across desktop and mobile viewports for ${domain}.` },
            { id: "TC-05", name: `${siteName} ARIA Accessibility Landmarks & Media Alt Audit`, desc: `Inspects main landmark elements and image alt descriptors across ${siteName} components.` }
        ];

        appiumCases = [
            { id: "MTC-01", name: `${siteName} Mobile Responsive Viewport Bounds Audit`, desc: `Verifies layout containers fit mobile screen width without horizontal overflow.` },
            { id: "MTC-02", name: `${siteName} Mobile Tap Targets & Navigation Bar Alignment`, desc: `Audits interactive navigation buttons and menu toggles for mobile touch standards.` }
        ];

        dastCases = [
            { id: "SEC-01", name: `${siteName} SSL Certificate & Protocol Compliance Audit`, desc: `Validates SSL/TLS certificate chain, cipher suites, and transport protocol for ${domain}.` },
            { id: "SEC-02", name: `${siteName} HTTP Security Headers Baseline Verification`, desc: `Checks presence of HSTS, CSP, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.` },
            { id: "SEC-03", name: `${siteName} Sensitive File & System Metadata Leakage Check`, desc: `Probes for exposed .env, .git/config, web.config, and server metadata on ${domain}${primaryPath ? '/' + primaryPath : ''}.` },
            { id: "SEC-04", name: `${siteName} Server Information Disclosure & Banner Leakage`, desc: `Inspects Server and X-Powered-By response headers for stack disclosure.` },
            { id: "SEC-05", name: `${siteName} Clickjacking & Frame Embedding Protection Audit`, desc: `Validates X-Frame-Options and CSP directives to prevent frame embedding on ${domain}.` }
        ];

        apiCases = [
            { id: "API-01", name: `${siteName} Gateway Endpoint Probe (${primaryPath ? '/' + primaryPath : '/api'})`, desc: `Probes service endpoint routes at ${domain}${primaryPath ? '/' + primaryPath : '/api'}.`, path: primaryPath ? `/${primaryPath}` : '/api' },
            { id: "API-02", name: `${siteName} Service Health & Status Check (/status)`, desc: `Checks health check and system status endpoints.`, path: '/status' },
            { id: "API-03", name: `Service Discovery & Robots Compliance Probe (/robots.txt)`, desc: `Inspects robots.txt and service discovery routes for ${domain}.`, path: '/robots.txt' }
        ];
    }

    // Enrich all test case objects to ensure full 7-column compliance
    function normalizeCase(tc, defaultModule, defaultPriority) {
        const id = tc.id || "FT-001";
        const name = tc.name || tc.testScenario || "Test Scenario";
        const desc = tc.desc || tc.expectedResult || "Expected behavior verified";
        return {
            id: id,
            name: name,
            desc: desc,
            module: tc.module || defaultModule || "Core Functionality",
            testScenario: tc.testScenario || name.replace(/^\[.*?\]\s*/, ''),
            precondition: tc.precondition || "Target environment is accessible and configured",
            testSteps: tc.testSteps || `Initiate automated verification for ${name}`,
            expectedResult: tc.expectedResult || desc,
            priority: tc.priority || defaultPriority || "High",
            path: tc.path || ""
        };
    }

    const normPlaywright = playwrightCases.map(c => normalizeCase(c, "Functional Testing", "High"));
    const normAppium = appiumCases.map(c => normalizeCase(c, "Mobile UX", "High"));
    const normDast = dastCases.map(c => normalizeCase(c, "Security Audit", "Critical"));
    const normApi = apiCases.map(c => normalizeCase(c, "API Gateway", "High"));

    return {
        category: category,
        domain: domain,
        badgeColor: badgeColor,
        description: description,
        playwrightCases: normPlaywright,
        appiumCases: normAppium,
        dastCases: normDast,
        apiCases: normApi
    };
}

// Export for Node environment or attach to window for browser use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeTargetPortal };
} else {
    window.analyzeTargetPortal = analyzeTargetPortal;
}
