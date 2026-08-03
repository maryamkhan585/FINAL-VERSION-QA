/**
 * Antigravity Domain & Portal Analyzer
 * Dynamically synthesizes feature-specific, target-tailored test case definitions for any given URL.
 */

function analyzeTargetPortal(url) {
    let rawInput = (url || 'https://example.com').trim().replace(/^["']|["']$/g, '');
    const isApk = /\.apk/i.test(rawInput) || /trillioni/i.test(rawInput) || /^[a-zA-Z]:[\\/].*\.apk/i.test(rawInput);
    const isLocalFile = isApk || /^[a-zA-Z]:[\\/]/i.test(rawInput) || /^file:\/\//i.test(rawInput);

    if (isApk || isLocalFile) {
        const filename = rawInput.split(/[\\/]/).pop() || 'AppPackage.apk';
        const appName = filename.replace(/\.apk$/i, '');
        const cleanAppName = appName.charAt(0).toUpperCase() + appName.slice(1);

        return {
            category: `Android Native Application (.apk)`,
            domain: filename,
            badgeColor: "var(--accent-cyan)",
            description: `Functional QA checklist & security audit suite for ${cleanAppName} Android package`,
            isApk: true,
            apkPath: rawInput,
            playwrightCases: [
                { id: "FT-001", module: "App Installation", testScenario: `Verify ${cleanAppName} installs successfully`, precondition: "Valid .apk package file provided", testSteps: "Install package on Android device or emulator", expectedResult: "App installs cleanly without package collision or signature errors", priority: "Critical" },
                { id: "FT-002", module: "App Launch", testScenario: `Verify ${cleanAppName} cold boot launch`, precondition: "App is installed on device", testSteps: "Tap app icon to launch application", expectedResult: "Splash screen displays and main screen loads within 3 seconds", priority: "Critical" },
                { id: "FT-003", module: "User Registration", testScenario: "Verify new user registration flow", precondition: "User is not logged in", testSteps: "Enter valid email, mobile number, and password; tap Register", expectedResult: "Account is created and verification code requested", priority: "High" },
                { id: "FT-004", module: "Authentication", testScenario: "Verify login with valid credentials", precondition: "Registered active user account exists", testSteps: "Enter correct username and password; tap Sign In", expectedResult: "User authenticated and taken to main app dashboard", priority: "Critical" },
                { id: "FT-005", module: "Authentication Validation", testScenario: "Verify invalid login rejection", precondition: "User on login screen", testSteps: "Enter incorrect password and tap Sign In", expectedResult: "Access denied with clear error message; session not opened", priority: "High" },
                { id: "FT-006", module: "Permissions", testScenario: "Verify runtime permission prompts", precondition: "Freshly installed app session", testSteps: "Trigger feature requiring Camera or Storage permission", expectedResult: "System permission dialog opens cleanly asking for user approval", priority: "High" },
                { id: "FT-007", module: "Navigation", testScenario: "Verify bottom navigation tabs", precondition: "User on main screen", testSteps: "Tap through all bottom navigation items", expectedResult: "Corresponding screens load quickly without lag or crash", priority: "High" },
                { id: "FT-008", module: "Form Validation", testScenario: "Verify mandatory form fields", precondition: "User on data entry screen", testSteps: "Leave mandatory fields empty and tap Submit", expectedResult: "Submission blocked and missing required fields highlighted", priority: "High" },
                { id: "FT-009", module: "Profile Management", testScenario: "Verify profile details update", precondition: "User is logged in", testSteps: "Edit name or profile email and tap Save", expectedResult: "Profile updates saved successfully and reflected on dashboard", priority: "Medium" },
                { id: "FT-010", module: "Push Notifications", testScenario: "Verify push notification handling", precondition: "App is running in background", testSteps: "Send test notification payload to device", expectedResult: "Notification banner displays; tapping opens target app screen", priority: "Medium" },
                { id: "FT-011", module: "Data Persistence", testScenario: "Verify local session storage", precondition: "User logged in", testSteps: "Close and reopen app", expectedResult: "User session remains active without forcing re-login", priority: "High" },
                { id: "FT-012", module: "Offline Mode", testScenario: "Verify network connection failure handling", precondition: "Device Wi-Fi and mobile data disabled", testSteps: "Perform action requiring internet connection", expectedResult: "Offline message displayed with clear retry button", priority: "High" },
                { id: "FT-013", module: "Security", testScenario: "Verify root and debug protection", precondition: "App running on device", testSteps: "Attempt debug attachment or root access check", expectedResult: "Application restricts sensitive data extraction and debug flags", priority: "Critical" },
                { id: "FT-014", module: "Session Logout", testScenario: "Verify user logout", precondition: "User is logged in", testSteps: "Tap Logout in profile settings", expectedResult: "Session cleared and user returned to login screen", priority: "High" },
                { id: "FT-015", module: "Error Handling", testScenario: "Verify backend timeout resilience", precondition: "Simulate backend 500 error or timeout", testSteps: "Trigger network transaction in app", expectedResult: "Safe error banner shown; app does not freeze or crash", priority: "Critical" }
            ],
            appiumCases: [
                { id: "MTC-01", module: "Mobile Layout", testScenario: `Verify ${cleanAppName} mobile screen layout bounds`, precondition: "App running on mobile device", testSteps: "Audit screen layout containers across mobile resolutions", expectedResult: "UI elements fit within screen margins without text truncation", priority: "High" },
                { id: "MTC-02", module: "Touch Targets", testScenario: `Verify button tap target dimensions`, precondition: "App interactive screen active", testSteps: "Inspect tap target sizing for main action buttons", expectedResult: "Action buttons satisfy finger tap accuracy guidelines", priority: "High" }
            ],
            dastCases: [
                { id: "SEC-01", module: "Package Security", testScenario: `Verify Android manifest permissions safety`, precondition: "APK binary compiled", testSteps: "Inspect declared package permissions in AndroidManifest.xml", expectedResult: "No unneeded or dangerous permissions declared", priority: "Critical" },
                { id: "SEC-02", module: "Transport Security", testScenario: `Verify SSL pinning & network security config`, precondition: "App network layer configured", testSteps: "Inspect res/xml/network_security_config.xml and TLS certs", expectedResult: "Encrypted HTTPS communication enforced; unencrypted HTTP blocked", priority: "Critical" },
                { id: "SEC-03", module: "Vulnerability Check", testScenario: `Verify android:debuggable and allowBackup flags`, precondition: "APK manifest active", testSteps: "Check debuggable and allowBackup flags", expectedResult: "Flags set safely to prevent unauthorized data backup", priority: "Critical" },
                { id: "SEC-04", module: "Secret Inspection", testScenario: `Verify hardcoded secret token leakage`, precondition: "DEX bytecode compiled", testSteps: "Scan asset files and DEX classes for exposed API keys", expectedResult: "No private secret keys or passwords exposed in code", priority: "Critical" },
                { id: "SEC-05", module: "Code Protection", testScenario: `Verify ProGuard / R8 code obfuscation`, precondition: "Production APK built", testSteps: "Decompile DEX classes and inspect symbol names", expectedResult: "Code obfuscated cleanly to resist reverse-engineering", priority: "High" }
            ],
            apiCases: [
                { id: "API-01", module: "Backend Gateway", testScenario: `Verify backend REST API endpoint (/api)`, precondition: "Backend server online", testSteps: "Send probe request to mobile app backend gateway", expectedResult: "API endpoint responds with valid HTTP 200 status", priority: "Critical", path: '/api' },
                { id: "API-02", module: "Session Refresh", testScenario: `Verify auth session refresh endpoint (/auth)`, precondition: "Auth server online", testSteps: "Probe authentication refresh API route", expectedResult: "Auth route responds cleanly with status OK", priority: "Critical", path: '/auth' },
                { id: "API-03", module: "System Health", testScenario: `Verify app health check route (/status)`, precondition: "Server online", testSteps: "Probe system status and health check route", expectedResult: "Health route reports operational status", priority: "Medium", path: '/status' }
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
    let description = `Functional QA checklist covering core user workflows, account management, interactive features, security and error handling for ${siteName}.`;

    let playwrightCases = [];
    let appiumCases = [];
    let dastCases = [];
    let apiCases = [];

    if (isBanking) {
        category = "Financial Banking & Transaction Portal";
        badgeColor = "var(--accent-emerald)";
        description = `Functional QA checklist covering onboarding, wallet, payments, FX, ledger, security and failure handling for ${siteName}.`;

        playwrightCases = [
            { id: "FT-001", module: "User Registration", testScenario: `Verify a new user can register on ${siteName}`, precondition: "User is not already registered", testSteps: "Enter valid email/mobile, password, required profile fields; submit", expectedResult: "Account is created; unique user/customer ID is generated; status is set according to onboarding flow", priority: "High" },
            { id: "FT-002", module: "Registration Validation", testScenario: "Verify duplicate email/mobile is rejected", precondition: "Existing account uses same email/mobile", testSteps: "Attempt registration with duplicate identifier", expectedResult: "Registration is blocked with clear validation; no duplicate customer is created", priority: "High" },
            { id: "FT-003", module: "Authentication", testScenario: `Verify login with valid credentials on ${siteName}`, precondition: "Registered active user exists", testSteps: "Enter valid credentials and submit", expectedResult: "User is authenticated and dashboard/session is opened", priority: "Critical" },
            { id: "FT-004", module: "Authentication", testScenario: "Verify invalid login is rejected", precondition: "Registered user exists", testSteps: "Enter incorrect password", expectedResult: "Access is denied; generic error is shown; no authenticated session is created", priority: "High" },
            { id: "FT-005", module: "KYC", testScenario: "Verify Individual KYC submission", precondition: "Registered user is eligible for KYC", testSteps: "Complete required KYC fields/documents and submit", expectedResult: "KYC request is created and status becomes Submitted/Pending Review", priority: "Critical" },
            { id: "FT-006", module: "KYC Validation", testScenario: "Verify mandatory KYC fields", precondition: "User is on KYC form", testSteps: "Leave mandatory fields/documents blank and submit", expectedResult: "Submission is blocked and missing fields are identified", priority: "High" },
            { id: "FT-007", module: "KYB", testScenario: "Verify Company onboarding/KYB submission", precondition: "Company user is registered", testSteps: "Enter company, incorporation, registration, legal status, tax/residency and required representative data; submit", expectedResult: "KYB request is successfully created with company onboarding status", priority: "Critical" },
            { id: "FT-008", module: "Compliance", testScenario: "Verify rejected KYC/KYB handling", precondition: "Compliance/provider returns Rejected", testSteps: "Refresh/retrieve onboarding status", expectedResult: "System shows Rejected status and does not enable restricted financial functions", priority: "Critical" },
            { id: "FT-009", module: "Wallet", testScenario: "Verify wallet creation after approval", precondition: "User KYC/KYB is approved", testSteps: "Request/create supported currency wallet", expectedResult: "Wallet is created once with correct owner, currency and unique wallet/account identifier", priority: "Critical" },
            { id: "FT-010", module: "Wallet Restrictions", testScenario: "Verify supported currency restriction", precondition: "Approved user exists", testSteps: "Attempt wallet creation for unsupported currency", expectedResult: "Request is rejected with supported-currency validation; no wallet is created", priority: "High" },
            { id: "FT-011", module: "Wallet Balances", testScenario: "Verify wallet list and balances", precondition: "User has EUR/USD/GBP wallets", testSteps: "Open dashboard/wallet list", expectedResult: "All existing wallets appear with correct currency, available balance and status", priority: "Critical" },
            { id: "FT-012", module: "IBAN Account", testScenario: "Verify IBAN/account details retrieval", precondition: "Eligible wallet/account exists", testSteps: "Open bank details for supported wallet", expectedResult: "Correct beneficiary/account name, IBAN/account details, BIC/SWIFT where applicable are displayed", priority: "Critical" },
            { id: "FT-013", module: "Incoming Payment", testScenario: "Verify incoming bank payment is reflected", precondition: "Active receiving account/IBAN exists", testSteps: "Process/provider receives a valid inbound payment; system retrieves transaction/status", expectedResult: "Incoming transaction is recorded against correct user wallet and balance updates only when provider status permits", priority: "Critical" },
            { id: "FT-014", module: "Beneficiary", testScenario: "Verify beneficiary creation", precondition: "Approved user; beneficiary feature enabled", testSteps: "Enter valid beneficiary/account details and save", expectedResult: "Beneficiary is created and appears in beneficiary list", priority: "High" },
            { id: "FT-015", module: "Beneficiary Validation", testScenario: "Verify invalid beneficiary details", precondition: "Approved user exists", testSteps: "Submit invalid/missing beneficiary account details", expectedResult: "Beneficiary is not created; validation/provider error is shown appropriately", priority: "High" },
            { id: "FT-016", module: "Fund Transfer", testScenario: "Verify internal user transfer", precondition: "Sender has sufficient available balance", testSteps: "Select recipient, enter valid amount/currency, confirm transfer", expectedResult: "Transaction succeeds; sender/receiver balances and transaction histories update correctly", priority: "Critical" },
            { id: "FT-017", module: "Balance Validation", testScenario: "Verify insufficient balance handling", precondition: "Sender balance is lower than transfer + fees", testSteps: "Attempt transfer exceeding available funds", expectedResult: "Transfer is rejected; balance remains unchanged; failure is recorded/displayed appropriately", priority: "Critical" },
            { id: "FT-018", module: "External Payment", testScenario: "Verify outbound bank transfer", precondition: "Approved sender, valid beneficiary, sufficient funds", testSteps: "Select beneficiary, enter amount/reference, confirm payment", expectedResult: "Payment is created with provider transaction ID and correct initial/final status; ledger/balance updates correctly", priority: "Critical" },
            { id: "FT-019", module: "Payment Status", testScenario: "Verify pending payment status refresh", precondition: "Payment exists in Pending/Processing", testSteps: "Retrieve payment status through API-driven flow", expectedResult: "Latest provider status is shown without duplicate posting", priority: "High" },
            { id: "FT-020", module: "Currency FX", testScenario: "Verify active currencies list", precondition: "Authenticated eligible user", testSteps: "Open exchange/conversion screen", expectedResult: "Only active/supported currencies returned by provider/configuration are available", priority: "Medium" },
            { id: "FT-021", module: "FX Quote", testScenario: "Verify exchange-rate quote", precondition: "Supported input/output currencies exist", testSteps: "Select From currency, To currency and amount; request quote", expectedResult: "Correct rate/converted amount and applicable fee/expiry information are displayed", priority: "Critical" },
            { id: "FT-022", module: "FX Conversion", testScenario: "Verify currency conversion", precondition: "Sufficient balance and valid FX quote", testSteps: "Confirm conversion before quote expiry", expectedResult: "Source wallet is debited and destination wallet credited using accepted rate; transaction references are stored", priority: "Critical" },
            { id: "FT-023", module: "Transaction History", testScenario: "Verify transaction history", precondition: "User has multiple transaction types", testSteps: "Open transaction history and apply filters", expectedResult: "Correct user transactions, amounts, currencies, types, dates and statuses are displayed; filters work", priority: "High" },
            { id: "FT-024", module: "Account Statement", testScenario: "Verify account statement", precondition: "Wallet has transactions in selected period", testSteps: "Select wallet/date range and request statement", expectedResult: "Statement contains only relevant wallet transactions with correct opening/closing figures where supported", priority: "Medium" },
            { id: "FT-025", module: "Fee Calculation", testScenario: "Verify fees are applied correctly", precondition: "Fee configuration applies to transaction", testSteps: "Initiate a transaction with known fee rule", expectedResult: "Fee shown before confirmation matches charged fee and ledger entries", priority: "High" },
            { id: "FT-026", module: "Ledger Accounting", testScenario: "Verify double-entry ledger consistency", precondition: "Successful financial transaction exists", testSteps: "Inspect resulting wallet/ledger entries", expectedResult: "Financial posting is balanced; no duplicate or missing debit/credit entries", priority: "Critical" },
            { id: "FT-027", module: "Idempotency", testScenario: "Verify duplicate payment submission protection", precondition: "Same payment request/reference can be retried", testSteps: "Submit identical request twice/retry after timeout", expectedResult: "Only one financial transaction is executed; duplicate request returns existing result or is safely rejected", priority: "Critical" },
            { id: "FT-028", module: "Data Isolation", testScenario: "Verify user data isolation", precondition: "Two different users exist", testSteps: "User A attempts to access User B wallet/transaction using altered identifier", expectedResult: "Access is denied and no User B financial/PII data is exposed", priority: "Critical" },
            { id: "FT-029", module: "Session Security", testScenario: "Verify logout/session invalidation", precondition: "User is logged in", testSteps: "Logout and reuse protected screen/session token", expectedResult: "Session is invalidated and protected resources require authentication", priority: "High" },
            { id: "FT-030", module: "Error Handling", testScenario: "Verify provider/API failure handling", precondition: "Simulate provider timeout/5xx/unavailable response", testSteps: "Perform wallet/payment/FX action", expectedResult: "User sees safe retry/error state; system does not create inconsistent or duplicate financial records", priority: "Critical" }
        ];

        appiumCases = [
            { id: "MTC-01", module: "Mobile Banking", testScenario: `Verify ${siteName} mobile login and screen layout`, precondition: "App/mobile web active on device", testSteps: "Launch mobile view; verify login screen elements and tap targets", expectedResult: "Login screen renders cleanly and tap targets respond accurately", priority: "High" },
            { id: "MTC-02", module: "Mobile Transfers", testScenario: `Verify mobile fund transfer keypad input`, precondition: "User on mobile transfer screen", testSteps: "Tap PIN keypad; enter transfer amount; submit", expectedResult: "Keypad inputs respond accurately without screen distortion", priority: "High" }
        ];

        dastCases = [
            { id: "SEC-01", module: "API Security", testScenario: `Verify financial API security and encryption baseline`, precondition: "Target API endpoints reachable", testSteps: "Audit HTTP security headers, CORS origin rules, and SSL configuration", expectedResult: "HSTS, CORS, and strong TLS encryption controls enforced", priority: "Critical" },
            { id: "SEC-02", module: "Data Masking", testScenario: `Verify account credentials and IBAN data masking`, precondition: "User viewing account details", testSteps: "Inspect web page DOM and network payloads during login", expectedResult: "Account numbers and password inputs are masked safely without plain text exposure", priority: "Critical" },
            { id: "SEC-03", module: "Anti-Fraud", testScenario: `Verify transaction replay protection`, precondition: "Payment endpoint active", testSteps: "Replay past transaction request token or modify request signature", expectedResult: "Replayed or modified requests are blocked by security layer", priority: "Critical" },
            { id: "SEC-04", module: "Session Expiry", testScenario: `Verify access token expiration`, precondition: "User session active", testSteps: "Wait for session timeout or attempt access with expired token", expectedResult: "Expired token rejected and user forced to re-login", priority: "Critical" },
            { id: "SEC-05", module: "Transport Encryption", testScenario: `Verify SSL/TLS certificate validity`, precondition: "Domain resolved", testSteps: "Verify SSL certificate issuer and encryption protocols", expectedResult: "Valid SSL certificate active with TLS 1.2+ encryption enforced", priority: "Critical" }
        ];

        apiCases = [
            { id: "API-01", module: "API Services", testScenario: `Verify Money Transfer API (/api/v1/transfer)`, precondition: "API gateway online", testSteps: "Send probe request to fund transfer route", expectedResult: "Endpoint responds with valid status 200 and JSON format", priority: "Critical", path: '/api/v1/transfer' },
            { id: "API-02", module: "API Services", testScenario: `Verify Account Balance API (/api/v1/balance)`, precondition: "API gateway online", testSteps: "Send balance inquiry request", expectedResult: "Endpoint returns account balance and currency details", priority: "Critical", path: '/api/v1/balance' },
            { id: "API-03", module: "API Services", testScenario: `Verify Payment Gateway API (/api/v1/payment)`, precondition: "API gateway online", testSteps: "Send payment gateway status probe", expectedResult: "Payment gateway reports operational status", priority: "Critical", path: '/api/v1/payment' }
        ];

    } else if (isECommerce || isProductPage || isCartOrCheckout || isAmazon || isEbay) {
        category = `E-Commerce Storefront (${siteName})`;
        badgeColor = "var(--accent-cyan)";
        description = `Functional QA checklist covering user registration, product catalog, shopping cart, checkout, payment options, and order confirmation for ${siteName}.`;

        playwrightCases = [
            { id: "FT-001", module: "User Registration", testScenario: `Verify new customer registration on ${siteName}`, precondition: "Customer is not already registered", testSteps: "Enter full name, email address, password; submit registration form", expectedResult: "Customer account created successfully and confirmation email sent", priority: "High" },
            { id: "FT-002", module: "Authentication", testScenario: "Verify login with valid customer credentials", precondition: "Registered active customer account exists", testSteps: "Enter registered email and password; click Sign In", expectedResult: "User authenticated; shopping cart and account profile synced", priority: "Critical" },
            { id: "FT-003", module: "Authentication Validation", testScenario: "Verify invalid login rejection", precondition: "Customer on login page", testSteps: "Enter incorrect password and submit", expectedResult: "Login blocked; clear error message shown; session not created", priority: "High" },
            { id: "FT-004", module: "Product Search", testScenario: "Verify product search bar auto-complete", precondition: "Customer on storefront homepage", testSteps: "Type product keyword into main search input", expectedResult: "Matching product suggestions and thumbnail previews display instantly", priority: "High" },
            { id: "FT-005", module: "Category Filtering", testScenario: "Verify filtering products by category and price", precondition: "Product catalog page active", testSteps: "Select category filter checkbox and adjust price slider", expectedResult: "Product grid updates matching selected filter criteria without reload", priority: "High" },
            { id: "FT-006", module: "Product Details", testScenario: "Verify product detail page information", precondition: "Product grid visible", testSteps: "Click on a product card", expectedResult: "Product page opens displaying title, price, image gallery, specs, and availability", priority: "High" },
            { id: "FT-007", module: "Add to Cart", testScenario: "Verify adding product item to shopping cart", precondition: "Product page open", testSteps: "Select product variant/quantity and click Add to Cart", expectedResult: "Item added to cart; cart counter increments and cart drawer displays item", priority: "Critical" },
            { id: "FT-008", module: "Cart Quantity", testScenario: "Verify updating item quantity in cart", precondition: "Items present in cart", testSteps: "Increase/decrease item quantity or click Remove", expectedResult: "Item count and cart subtotal update instantly", priority: "High" },
            { id: "FT-009", module: "Promo Code", testScenario: "Verify coupon code discount application", precondition: "User viewing shopping cart", testSteps: "Enter valid promotional coupon code and click Apply", expectedResult: "Discount applied correctly and updated grand total displayed", priority: "Medium" },
            { id: "FT-010", module: "Checkout Address", testScenario: "Verify shipping address entry in checkout", precondition: "Cart contains items", testSteps: "Proceed to checkout; enter delivery address and select shipping method", expectedResult: "Shipping rate calculated and delivery details saved", priority: "High" },
            { id: "FT-011", module: "Payment Method", testScenario: "Verify payment option selection", precondition: "User on payment checkout step", testSteps: "Select Credit Card or PayPal payment method", expectedResult: "Payment form fields render cleanly over secure HTTPS connection", priority: "Critical" },
            { id: "FT-012", module: "Order Placement", testScenario: "Verify order confirmation and receipt", precondition: "Valid cart and payment details submitted", testSteps: "Click Place Order / Confirm Purchase", expectedResult: "Order processed successfully; unique Order ID and confirmation receipt generated", priority: "Critical" },
            { id: "FT-013", module: "Order History", testScenario: "Verify customer order history view", precondition: "Customer has past orders", testSteps: "Open Account -> My Orders page", expectedResult: "Past orders listed with order date, total amount, items, and status", priority: "High" },
            { id: "FT-014", module: "Wishlist", testScenario: "Verify adding product to saved wishlist", precondition: "User logged in", testSteps: "Click heart icon on product card", expectedResult: "Item saved to user wishlist for future purchase", priority: "Medium" },
            { id: "FT-015", module: "Customer Reviews", testScenario: "Verify submitting product review and star rating", precondition: "User on product detail page", testSteps: "Enter review comment, select star rating, submit", expectedResult: "Review submitted and displayed under product reviews section", priority: "Medium" },
            { id: "FT-016", module: "Session Security", testScenario: "Verify customer logout and cart preservation", precondition: "User logged in with items in cart", testSteps: "Click Logout button", expectedResult: "User session invalidated safely; saved cart preserved for next login", priority: "High" }
        ];

        appiumCases = [
            { id: "MTC-01", module: "Mobile Shopping", testScenario: `Verify ${siteName} mobile product cards and layout`, precondition: "Mobile browser or app view active", testSteps: "Scroll product list and inspect product item touch targets", expectedResult: "Product cards and Buy buttons fit screen cleanly with accessible tap targets", priority: "High" },
            { id: "MTC-02", module: "Mobile Cart", testScenario: `Verify mobile cart drawer navigation`, precondition: "Items added to cart", testSteps: "Tap cart icon in mobile header", expectedResult: "Cart drawer overlays viewport smoothly without distorting page layout", priority: "Medium" }
        ];

        dastCases = [
            { id: "SEC-01", module: "Payment Security", testScenario: `Verify checkout SSL protocol and PCI-DSS baseline`, precondition: "Checkout page active", testSteps: "Inspect SSL/TLS connection protocol on payment gateway", expectedResult: "Encrypted HTTPS with strong TLS 1.2+ protocol enforced", priority: "Critical" },
            { id: "SEC-02", module: "Cookie Security", testScenario: `Verify session cookie security flags`, precondition: "Customer session created", testSteps: "Audit Set-Cookie HTTP response headers", expectedResult: "Secure and HttpOnly flags present on session cookies", priority: "Critical" },
            { id: "SEC-03", module: "Form Security", testScenario: `Verify anti-CSRF protection on cart and order forms`, precondition: "Checkout form active", testSteps: "Attempt order submission without anti-CSRF security token", expectedResult: "Request blocked by server anti-CSRF protection", priority: "Critical" },
            { id: "SEC-04", module: "Data Privacy", testScenario: `Verify customer PII and address caching protection`, precondition: "Customer logged in", testSteps: "Inspect HTTP response cache headers for address pages", expectedResult: "Cache-Control: no-store prevents caching of personal address data", priority: "Critical" },
            { id: "SEC-05", module: "Script Integrity", testScenario: `Verify subresource integrity for payment scripts`, precondition: "Payment scripts loaded", testSteps: "Inspect external payment script tags for integrity attributes", expectedResult: "SRI hashes present to prevent malicious script tampering", priority: "High" }
        ];

        apiCases = [
            { id: "API-01", module: "API Services", testScenario: `Verify Product Catalog API (${primaryPath ? '/' + primaryPath : '/api'})`, precondition: "API gateway online", testSteps: "Send request to product catalog API route", expectedResult: "API returns HTTP 200 OK with product list JSON", priority: "High", path: primaryPath ? `/${primaryPath}` : '/api' },
            { id: "API-02", module: "API Services", testScenario: `Verify Shopping Cart API (/cart)`, precondition: "Cart API online", testSteps: "Send request to cart session API route", expectedResult: "Cart API responds cleanly with active session state", priority: "Critical", path: '/cart' },
            { id: "API-03", module: "SEO & Crawling", testScenario: `Verify robots.txt search crawler rules (/robots.txt)`, precondition: "Domain root reachable", testSteps: "Fetch /robots.txt file", expectedResult: "Robots file properly formatted with indexing policies", priority: "Low", path: '/robots.txt' }
        ];

    } else if (isSlack || isNotion || isTrello) {
        const platform = isSlack ? 'Slack' : (isTrello ? 'Trello' : 'Notion');
        category = `SaaS Workspace & Collaboration Platform (${platform})`;
        badgeColor = "var(--accent-emerald)";
        description = `Functional QA checklist covering user signup, workspace creation, team invitations, channels, posts, notifications, and security for ${platform}.`;

        playwrightCases = [
            { id: "FT-001", module: "User Registration", testScenario: `Verify new user workspace signup on ${platform}`, precondition: "User is not registered", testSteps: "Enter work email address; click Sign Up", expectedResult: "Verification code sent to email; account setup wizard opened", priority: "High" },
            { id: "FT-002", module: "Authentication", testScenario: "Verify login via password or SSO", precondition: "Registered active account exists", testSteps: "Enter email and password or click SSO login", expectedResult: "User authenticated and taken to active workspace dashboard", priority: "Critical" },
            { id: "FT-003", module: "Workspace Setup", testScenario: "Verify creating a new team workspace", precondition: "Authenticated user", testSteps: "Click Create Workspace; enter team name and URL slug", expectedResult: "New workspace created with user assigned as Workspace Admin", priority: "Critical" },
            { id: "FT-004", module: "Team Invitations", testScenario: "Verify inviting team members to workspace", precondition: "Admin in workspace", testSteps: "Enter team member email addresses; send invites", expectedResult: "Invitation emails sent; invited users listed in pending tab", priority: "High" },
            { id: "FT-005", module: "Channel / Board", testScenario: "Verify creating a new channel or board", precondition: "Active workspace open", testSteps: "Click + Create Channel/Board; enter title and privacy setting", expectedResult: "New channel/board created and displayed in navigation sidebar", priority: "High" },
            { id: "FT-006", module: "Messaging / Posts", testScenario: "Verify posting message or card in channel", precondition: "Channel or board view open", testSteps: "Type message text in editor and click Send / Post", expectedResult: "Message posted instantly to channel feed for all team members", priority: "Critical" },
            { id: "FT-007", module: "File Upload", testScenario: "Verify uploading file attachment in post", precondition: "Message editor active", testSteps: "Click attach icon; select image or PDF file; upload", expectedResult: "File attached successfully and preview rendered in feed", priority: "High" },
            { id: "FT-008", module: "Workspace Search", testScenario: "Verify global search across messages and files", precondition: "Active workspace open", testSteps: "Type keyword query into top search bar", expectedResult: "Matching messages, files, and team members listed cleanly", priority: "High" },
            { id: "FT-009", module: "Profile & Status", testScenario: "Verify updating profile picture and status", precondition: "User logged in", testSteps: "Edit display name and status message; click Save", expectedResult: "Updated profile details visible to all workspace members", priority: "Medium" },
            { id: "FT-010", module: "Notifications", testScenario: "Verify notification alerts for mentions", precondition: "User tagged in post", testSteps: "Send message with @user mention tag", expectedResult: "Notification badge increments and pop-up alert displays", priority: "High" },
            { id: "FT-011", module: "Role Controls", testScenario: "Verify admin permission restriction for regular users", precondition: "Regular member logged in", testSteps: "Attempt access to admin billing or security settings", expectedResult: "Access restricted; permission error message displayed", priority: "Critical" },
            { id: "FT-012", module: "Session Security", testScenario: "Verify user logout and session clearance", precondition: "User logged in", testSteps: "Click Logout in user menu", expectedResult: "Session tokens cleared; user safely returned to sign-in page", priority: "High" }
        ];

        appiumCases = [
            { id: "MTC-01", module: "Mobile Workspace", testScenario: `Verify ${platform} mobile workspace layout`, precondition: "Mobile app or browser open", testSteps: "Inspect mobile channel list and message feed touch targets", expectedResult: "Navigation items and messages fit mobile view with clear tap targets", priority: "High" },
            { id: "MTC-02", module: "Mobile Navigation", testScenario: `Verify mobile drawer menu toggle`, precondition: "Mobile view active", testSteps: "Tap hamburger menu icon", expectedResult: "Workspace menu drawer slides out smoothly without UI distortion", priority: "Medium" }
        ];

        dastCases = [
            { id: "SEC-01", module: "Session Security", testScenario: `Verify JWT and session cookie flags`, precondition: "User session active", testSteps: "Audit Set-Cookie headers for authentication tokens", expectedResult: "Secure, HttpOnly, and SameSite attributes enforced on cookies", priority: "Critical" },
            { id: "SEC-02", module: "Auth Vulnerability", testScenario: `Verify OAuth redirect parameter safety`, precondition: "OAuth login endpoint active", testSteps: "Pass external domain in redirect_uri parameter", expectedResult: "Arbitrary redirect parameter rejected by auth server", priority: "Critical" },
            { id: "SEC-03", module: "Tenant Isolation", testScenario: `Verify multi-tenant data isolation`, precondition: "User in Workspace A", testSteps: "Attempt accessing Workspace B resource URL directly", expectedResult: "Cross-tenant access blocked with HTTP 403 Forbidden", priority: "Critical" },
            { id: "SEC-04", module: "Script Security", testScenario: `Verify Content Security Policy for user posts`, precondition: "User content rendered in feed", testSteps: "Inspect CSP response headers", expectedResult: "Strict CSP prevents script injection in user-generated content", priority: "Critical" },
            { id: "SEC-05", module: "Rate Limiting", testScenario: `Verify rate limiting on authentication routes`, precondition: "Auth endpoint active", testSteps: "Send rapid login attempt sequence", expectedResult: "X-RateLimit headers active; excessive login attempts blocked", priority: "High" }
        ];

        apiCases = [
            { id: "API-01", module: "API Services", testScenario: `Verify Workspace API Gateway (/api)`, precondition: "API online", testSteps: "Send request to workspace API endpoint", expectedResult: "API responds with valid HTTP 200/401 JSON", priority: "High", path: '/api' },
            { id: "API-02", module: "API Services", testScenario: `Verify Auth Refresh API (/auth)`, precondition: "Auth route active", testSteps: "Probe session refresh endpoint", expectedResult: "Auth refresh route operational", priority: "Critical", path: '/auth' },
            { id: "API-03", module: "API Services", testScenario: `Verify System Status API (/status)`, precondition: "Status page online", testSteps: "Probe status endpoint", expectedResult: "System status reports operational health", priority: "Low", path: '/status' }
        ];

    } else if (isGithub || isGitlab || isDocsOrCode) {
        const platform = isGithub ? 'GitHub' : (isGitlab ? 'GitLab' : siteName);
        category = `Developer Platform & Code Repository (${platform})`;
        badgeColor = "var(--accent-purple)";
        description = `Functional QA checklist covering code repository search, directory browsing, code viewing, pull requests, file downloads, and security for ${platform}.`;

        playwrightCases = [
            { id: "FT-001", module: "Authentication", testScenario: `Verify developer account sign in on ${platform}`, precondition: "Developer account exists", testSteps: "Enter username/email and password; click Sign In", expectedResult: "User authenticated; developer dashboard and repositories loaded", priority: "Critical" },
            { id: "FT-002", module: "Repository Search", testScenario: "Verify searching code repositories", precondition: "On developer portal homepage", testSteps: "Type repository keyword in top search input", expectedResult: "Matching repositories and code search results displayed", priority: "High" },
            { id: "FT-003", module: "Code Directory", testScenario: "Verify repository directory tree navigation", precondition: "Repository view open", testSteps: "Click folder or file links in repository file tree", expectedResult: "File directory opens cleanly and breadcrumbs update correctly", priority: "High" },
            { id: "FT-004", module: "Code Viewer", testScenario: "Verify code file display with syntax highlighting", precondition: "Viewing code file", testSteps: "Inspect line numbers and code snippet rendering", expectedResult: "Code file lines render with syntax highlighting without lag", priority: "High" },
            { id: "FT-005", module: "Pull Requests", testScenario: "Verify creating a new pull request", precondition: "Branch contains code changes", testSteps: "Click New Pull Request; select target branch; submit", expectedResult: "Pull request created displaying diff comparison and commit list", priority: "Critical" },
            { id: "FT-006", module: "Code Review", testScenario: "Verify submitting inline code review comment", precondition: "In Pull Request diff view", testSteps: "Click line number; type review comment; click Add Comment", expectedResult: "Comment posted inline under specific code line", priority: "High" },
            { id: "FT-007", module: "Raw File Download", testScenario: "Verify downloading raw code file", precondition: "Viewing code file", testSteps: "Click Raw or Download button", expectedResult: "File downloaded to computer with correct raw content", priority: "Medium" },
            { id: "FT-008", module: "Session Security", testScenario: "Verify developer session logout", precondition: "User logged in", testSteps: "Click Sign Out in profile menu", expectedResult: "Session tokens cleared; user returned to public homepage", priority: "High" }
        ];

        appiumCases = [
            { id: "MTC-01", module: "Mobile Code View", testScenario: `Verify ${platform} mobile code block horizontal scrolling`, precondition: "Mobile view active", testSteps: "Scroll wide code snippet horizontally on mobile view", expectedResult: "Code container scrolls smoothly without breaking page layout", priority: "High" },
            { id: "MTC-02", module: "Mobile Navigation", testScenario: `Verify mobile issue and PR tap targets`, precondition: "Mobile pull request list open", testSteps: "Inspect touch target sizing of issue labels and links", expectedResult: "Tap targets meet finger accuracy guidelines", priority: "Medium" }
        ];

        dastCases = [
            { id: "SEC-01", module: "API Token Security", testScenario: `Verify Personal Access Token header security`, precondition: "API endpoint active", testSteps: "Audit authorization headers and token handling", expectedResult: "Access tokens transmitted securely over HTTPS; authorization enforced", priority: "Critical" },
            { id: "SEC-02", module: "Metadata Protection", testScenario: `Verify .git/config and production file exposure`, precondition: "Domain root reachable", testSteps: "Probe for exposed /.git/config and /.gitignore", expectedResult: "Public web root blocks direct exposure of .git metadata", priority: "Critical" },
            { id: "SEC-03", module: "Content Security", testScenario: `Verify CSP headers for markdown rendering`, precondition: "README markdown rendered", testSteps: "Inspect CSP response headers", expectedResult: "CSP headers block inline script execution within rendered markdown", priority: "Critical" },
            { id: "SEC-04", module: "CORS Security", testScenario: `Verify CORS origin whitelist enforcement`, precondition: "API endpoint active", testSteps: "Send cross-origin request from unapproved domain", expectedResult: "CORS headers restrict unauthorized cross-origin calls", priority: "High" },
            { id: "SEC-05", module: "Frame Protection", testScenario: `Verify clickjacking protection on auth pages`, precondition: "OAuth sign-in page open", testSteps: "Inspect X-Frame-Options response header", expectedResult: "Frame embedding blocked with SAMEORIGIN / DENY", priority: "Critical" }
        ];

        apiCases = [
            { id: "API-01", module: "API Services", testScenario: `Verify Developer REST API (/api)`, precondition: "API gateway online", testSteps: "Send request to developer REST API root", expectedResult: "API returns HTTP 200/401 JSON format", priority: "High", path: '/api' },
            { id: "API-02", module: "API Services", testScenario: `Verify Webhook / CI Status API (/status)`, precondition: "Status service online", testSteps: "Probe service status endpoint", expectedResult: "Status service reports operational health", priority: "Medium", path: '/status' },
            { id: "API-03", module: "SEO & Crawling", testScenario: `Verify search engine crawler rules (/robots.txt)`, precondition: "Domain root reachable", testSteps: "Fetch /robots.txt file", expectedResult: "Robots file configured with crawler rules", priority: "Low", path: '/robots.txt' }
        ];

    } else {
        // Fallback for custom or corporate URLs
        const featureFocus = primaryPath ? primaryPath.replace(/[-_]/g, ' ') : 'Core Service';
        const featureTitle = featureFocus.charAt(0).toUpperCase() + featureFocus.slice(1);

        category = `Enterprise Web Application (${siteName})`;
        badgeColor = "var(--accent-purple)";
        description = `Functional QA checklist covering user registration, authentication, main navigation, form input validation, search, data display, user profile, file upload, authorization, and error handling for ${siteName}.`;

        playwrightCases = [
            { id: "FT-001", module: "User Registration", testScenario: `Verify new user account creation on ${siteName}`, precondition: "User is not registered", testSteps: "Enter valid registration details into sign up form; click Submit", expectedResult: "User account created successfully; unique user ID generated", priority: "High" },
            { id: "FT-002", module: "Authentication", testScenario: `Verify login with valid user credentials`, precondition: "Registered active account exists", testSteps: "Enter registered username/email and password; click Sign In", expectedResult: "User authenticated successfully and redirected to main dashboard", priority: "Critical" },
            { id: "FT-003", module: "Authentication Validation", testScenario: "Verify invalid login rejection", precondition: "User on login form", testSteps: "Enter incorrect password and submit", expectedResult: "Login rejected with clear validation error message; session not opened", priority: "High" },
            { id: "FT-004", module: "Main Navigation", testScenario: `Verify website menu navigation links`, precondition: "On homepage of ${domain}", testSteps: "Click main navigation menu links and header options", expectedResult: "Target pages load cleanly without broken 404 links", priority: "High" },
            { id: "FT-005", module: "Search & Filtering", testScenario: `Verify site search functionality`, precondition: "Search input present", testSteps: "Type keyword into search bar and click Search", expectedResult: "Relevant search results page displayed matching keyword query", priority: "High" },
            { id: "FT-006", module: "Form Validation", testScenario: "Verify mandatory field validation on input forms", precondition: "On contact or data entry form", testSteps: "Leave required fields blank and click Submit", expectedResult: "Form submission blocked; missing mandatory fields highlighted", priority: "High" },
            { id: "FT-007", module: "Form Submission", testScenario: "Verify valid form data submission", precondition: "On input form", testSteps: "Fill required fields with valid test data; click Submit", expectedResult: "Data submitted successfully; clear confirmation message displayed", priority: "High" },
            { id: "FT-008", module: "User Profile", testScenario: "Verify editing user account details", precondition: "User is logged in", testSteps: "Update profile information and click Save", expectedResult: "Profile changes saved successfully and reflected on dashboard", priority: "Medium" },
            { id: "FT-009", module: "File Upload", testScenario: "Verify file attachment upload feature", precondition: "On file upload form", testSteps: "Select valid file from computer and click Upload", expectedResult: "File uploaded successfully and preview displayed", priority: "Medium" },
            { id: "FT-010", module: "Access Control", testScenario: "Verify protected page authorization restriction", precondition: "User not logged in", testSteps: "Attempt direct URL navigation to private account page", expectedResult: "Access denied; user redirected to login screen", priority: "Critical" },
            { id: "FT-011", module: "Mobile Navigation", testScenario: "Verify responsive mobile menu navigation", precondition: "Mobile screen resolution active", testSteps: "Tap mobile hamburger menu toggle icon", expectedResult: "Navigation menu opens smoothly without breaking page layout", priority: "High" },
            { id: "FT-012", module: "Session Security", testScenario: "Verify user logout session clearance", precondition: "User is logged in", testSteps: "Click Logout button", expectedResult: "User session invalidated; user safely returned to homepage", priority: "High" },
            { id: "FT-013", module: "Page Handling", testScenario: "Verify custom 404 page handling", precondition: "User visits non-existent path", testSteps: "Navigate to an invalid page URL", expectedResult: "Friendly 404 page displayed with link back to homepage", priority: "Medium" },
            { id: "FT-014", module: "Failure Resilience", testScenario: "Verify server error handling and recovery", precondition: "Simulate server connectivity issue", testSteps: "Perform data submission during temporary outage", expectedResult: "Safe error alert displayed; user input data preserved without app crash", priority: "Critical" }
        ];

        appiumCases = [
            { id: "MTC-01", module: "Mobile Layout", testScenario: `Verify ${siteName} mobile viewport bounds`, precondition: "Mobile device view active", testSteps: "Audit main container width and text wrap across mobile resolutions", expectedResult: "Content fits mobile screen width without horizontal scrollbars", priority: "High" },
            { id: "MTC-02", module: "Touch Sizing", testScenario: `Verify mobile button tap targets`, precondition: "Mobile navigation bar loaded", testSteps: "Inspect tap target dimensions of navigation toggles", expectedResult: "Touch buttons satisfy finger tap accuracy standards", priority: "Medium" }
        ];

        dastCases = [
            { id: "SEC-01", module: "Transport Security", testScenario: `Verify SSL/TLS certificate validity and protocol`, precondition: "Domain resolved", testSteps: "Audit SSL certificate chain and supported TLS encryption protocols", expectedResult: "Valid SSL certificate active with strong TLS 1.2+ protocol enforced", priority: "Critical" },
            { id: "SEC-02", module: "Security Headers", testScenario: `Verify HTTP security headers baseline`, precondition: "HTTP response received", testSteps: "Check for presence of HSTS, CSP, X-Frame-Options, X-Content-Type-Options", expectedResult: "Core security headers present in server responses", priority: "Critical" },
            { id: "SEC-03", module: "File Protection", testScenario: `Verify sensitive file and metadata exposure`, precondition: "Domain root reachable", testSteps: "Probe for exposed /.env, /.git/config, or server metadata", expectedResult: "Sensitive metadata paths return 404/403 access denied", priority: "Critical" },
            { id: "SEC-04", module: "Banner Protection", testScenario: `Verify server version information masking`, precondition: "HTTP response headers received", testSteps: "Inspect Server and X-Powered-By header fields", expectedResult: "Server version tokens masked or omitted to prevent disclosure", priority: "High" },
            { id: "SEC-05", module: "Frame Security", testScenario: `Verify clickjacking frame protection`, precondition: "Target web page active", testSteps: "Inspect X-Frame-Options and CSP frame-ancestors headers", expectedResult: "Frame embedding restricted with DENY / SAMEORIGIN", priority: "Critical" }
        ];

        apiCases = [
            { id: "API-01", module: "API Gateway", testScenario: `Verify Service Gateway API (${primaryPath ? '/' + primaryPath : '/api'})`, precondition: "API route reachable", testSteps: "Send probe request to main API gateway route", expectedResult: "Endpoint responds with valid HTTP 200 OK status code", priority: "High", path: primaryPath ? `/${primaryPath}` : '/api' },
            { id: "API-02", module: "Health Check", testScenario: `Verify Service Health Check API (/status)`, precondition: "Status route reachable", testSteps: "Send request to /status health check route", expectedResult: "Health check route reports operational status", priority: "Medium", path: '/status' },
            { id: "API-03", module: "SEO & Crawling", testScenario: `Verify robots.txt crawler indexing rules (/robots.txt)`, precondition: "Root domain accessible", testSteps: "Fetch /robots.txt file", expectedResult: "Robots file properly formatted with indexing policies", priority: "Low", path: '/robots.txt' }
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
