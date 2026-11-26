const pillarData = {
  confidentiality: {
    title: "Confidentiality",
    tag: "Pillar 01 • Privacy & Secrecy",
    color: "#38bdf8",
    definition:
      "Confidentiality ensures that sensitive information is accessed only by authorized entities and protected against eavesdropping, unauthorized disclosure, or improper exposure.",
    threats: [
      "Packet sniffing & Man-in-the-Middle (MitM) interception",
      "Credential stuffing, phishing, and privilege escalation",
      "Misconfigured cloud storage buckets & SQL injection data dumps"
    ],
    controls: [
      "Encryption at rest (AES-256) and in transit (TLS 1.3)",
      "Multi-Factor Authentication (MFA) & Role-Based Access Control (RBAC)",
      "Principle of Least Privilege (PoLP) & data masking"
    ],
    breach:
      "Equifax (2017): An unpatched Apache Struts vulnerability allowed attackers to exfiltrate sensitive PII (SSNs, birth dates) of 147 million people.",
    code: `// Encrypting sensitive payload with AES-256-GCM (Node.js)
const crypto = require('crypto');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update('SSN: 123-45-6789', 'utf8'), cipher.final()]);`
  },
  integrity: {
    title: "Integrity",
    tag: "Pillar 02 • Accuracy & Trust",
    color: "#34d399",
    definition:
      "Integrity guarantees that data and software remain complete, accurate, and unaltered by unauthorized parties across storage, processing, and network transmission.",
    threats: [
      "Supply-chain tampering & malicious binary injection",
      "Unauthorized database modification or financial record manipulation",
      "Bit-rot, silent disk corruption, and replay attacks"
    ],
    controls: [
      "Cryptographic hashing (SHA-256) & checksum verification",
      "Digital signatures & code signing certificates",
      "Version control, input validation, and append-only audit logs"
    ],
    breach:
      "SolarWinds Orion (2020): Attackers compromised the build pipeline and injected malicious code into signed software updates distributed to 18,000+ organizations.",
    code: `// Verifying file integrity with SHA-256 digest
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
if (hash !== expectedVendorSha256) {
  throw new Error('Integrity check failed: File tampered!');
}`
  },
  availability: {
    title: "Availability",
    tag: "Pillar 03 • Uptime & Resilience",
    color: "#fbbf24",
    definition:
      "Availability ensures that critical systems, applications, and data are consistently operational and reachable by legitimate users within required Service Level Agreements (SLAs).",
    threats: [
      "Distributed Denial-of-Service (DDoS) volumetric & application floods",
      "Ransomware encrypting production servers and backups",
      "Hardware failures, power outages, and BGP routing leaks"
    ],
    controls: [
      "High-Availability (HA) clusters, load balancers, and auto-scaling",
      "Geographic redundancy & immutable 3-2-1 offline backups",
      "CDN caching, WAF rate-limiting, and tested Disaster Recovery (DR) plans"
    ],
    breach:
      "Dyn DNS Attack (2016): The Mirai IoT botnet flooded Dyn's DNS infrastructure with 1.2 Tbps of traffic, taking GitHub, Twitter, Netflix, and Reddit offline across North America and Europe.",
    code: `# NGINX Rate Limiting to protect service availability
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
server {
  location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
  }
}`
  }
};

const tradeoffs = {
  ca: {
    edge: "edge-ca",
    text: "C ↔ A Tension: Adding strict authentication steps (MFA, hardware tokens, VPNs, aggressive firewalls) boosts Confidentiality, but too much friction—or a broken auth server—can block legitimate users and hurt Availability."
  },
  ci: {
    edge: "edge-ci",
    text: "C ↔ I Synergy: Authenticated encryption (like AES-GCM) simultaneously protects Confidentiality (hiding plaintext) and Integrity (detecting if ciphertext was modified in transit)."
  },
  ia: {
    edge: "edge-ia",
    text: "I ↔ A Tension: Running deep antivirus scans, strict input validation, and synchronous multi-node database replication preserves Integrity, but introduces latency that can slow down high-throughput Availability."
  }
};

const scenarios = [
  {
    q: "A botnet floods an e-commerce checkout API with 800,000 fake requests per second, causing legitimate customers to receive 503 Service Unavailable errors.",
    answer: "Availability",
    explanation: "This is a classic DDoS attack targeting system uptime and preventing authorized customers from accessing the service."
  },
  {
    q: "An insider alters decimal values in a payroll database so their monthly direct deposit increases by $4,000 without triggering an alert.",
    answer: "Integrity",
    explanation: "Unauthorized modification of financial records directly violates data accuracy and trustworthiness (Integrity)."
  },
  {
    q: "An unencrypted S3 bucket containing 2 million patient medical histories is discovered indexed on a public search engine.",
    answer: "Confidentiality",
    explanation: "Sensitive personal health information was exposed to unauthorized parties, violating Confidentiality."
  },
  {
    q: "Ransomware encrypts a hospital's electronic health record servers, locking doctors out of patient charts during emergency surgeries.",
    answer: "Availability",
    explanation: "Although encryption is used as a weapon, the primary impact on the hospital is denial of access to critical systems (Availability)."
  },
  {
    q: "An attacker intercepts an unencrypted HTTP software download on public Wi-Fi and injects a keylogger into the installer.",
    answer: "Integrity",
    explanation: "Because the binary was modified in transit before reaching the user, its authenticity and Integrity were compromised."
  }
];

// Render Pillar Details
const detailsPanel = document.getElementById("pillar-details");
const nodes = document.querySelectorAll(".tri-node");

function renderPillar(key) {
  const data = pillarData[key];
  detailsPanel.innerHTML = `
    <div class="pillar-header">
      <h3 style="color: ${data.color}; font-size: 1.45rem;">${data.title}</h3>
      <span class="pillar-tag" style="background: ${data.color}22; color: ${data.color}; border: 1px solid ${data.color}55;">
        ${data.tag}
      </span>
    </div>
    <p>${data.definition}</p>

    <div class="detail-block">
      <h4>Common Attack Vectors</h4>
      <ul class="detail-list">
        ${data.threats.map(t => `<li>${t}</li>`).join("")}
      </ul>
    </div>

    <div class="detail-block">
      <h4>Defensive Engineering Controls</h4>
      <ul class="detail-list">
        ${data.controls.map(c => `<li>${c}</li>`).join("")}
      </ul>
    </div>

    <div class="detail-block">
      <h4>Real-World Case Study</h4>
      <div class="breach-box">${data.breach}</div>
    </div>

    <div class="detail-block">
      <h4>Implementation Example</h4>
      <pre class="code-snippet">${data.code}</pre>
    </div>
  `;
}

nodes.forEach(node => {
  const activate = () => {
    nodes.forEach(n => n.classList.remove("active"));
    node.classList.add("active");
    renderPillar(node.dataset.pillar);
  };
  node.addEventListener("click", activate);
  node.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  });
});

// Tradeoff buttons
const tradeBtns = document.querySelectorAll(".trade-btn");
const tradeOutput = document.getElementById("tradeoff-output");
const edges = document.querySelectorAll(".tri-edge");

tradeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tradeBtns.forEach(b => b.classList.remove("active"));
    edges.forEach(e => e.classList.remove("highlight"));

    btn.classList.add("active");
    const item = tradeoffs[btn.dataset.trade];
    document.getElementById(item.edge).classList.add("highlight");
    tradeOutput.textContent = item.text;
  });
});

// Quiz logic
let currentIdx = 0;
let score = 0;

const progressEl = document.getElementById("quiz-progress");
const scoreEl = document.getElementById("quiz-score");
const questionEl = document.getElementById("quiz-question");
const optionBtns = document.querySelectorAll(".option-btn");
const feedbackEl = document.getElementById("quiz-feedback");
const nextBtn = document.getElementById("next-btn");

function loadScenario() {
  const item = scenarios[currentIdx];
  progressEl.textContent = `Scenario ${currentIdx + 1} of ${scenarios.length}`;
  scoreEl.textContent = `Score: ${score}`;
  questionEl.textContent = item.q;
  feedbackEl.classList.add("hidden");
  nextBtn.classList.add("hidden");

  optionBtns.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
  });
}

optionBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const selected = btn.dataset.answer;
    const correct = scenarios[currentIdx].answer;

    optionBtns.forEach(b => {
      b.disabled = true;
      if (b.dataset.answer === correct) b.classList.add("correct");
    });

    if (selected === correct) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      feedbackEl.innerHTML = `<strong>✅ Correct!</strong> ${scenarios[currentIdx].explanation}`;
    } else {
      btn.classList.add("wrong");
      feedbackEl.innerHTML = `<strong>❌ Not quite (Answer: ${correct}).</strong> ${scenarios[currentIdx].explanation}`;
    }

    feedbackEl.classList.remove("hidden");
    nextBtn.textContent = currentIdx < scenarios.length - 1 ? "Next Scenario →" : "Restart Quiz";
    nextBtn.classList.remove("hidden");
  });
});

nextBtn.addEventListener("click", () => {
  currentIdx = (currentIdx + 1) % scenarios.length;
  if (currentIdx === 0) score = 0;
  loadScenario();
});

// Initialize
renderPillar("confidentiality");
loadScenario();