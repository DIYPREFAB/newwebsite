// Blog & News content for the threaded feed.
// Frontend-only for now: when the backend is ready, replace getPosts()/getPost() with API calls that return the same shape.
//
// Inline markup supported in text fields:  **bold**   [link text](/internal-or-https-url)   [1] -> superscript source marker

const SITE = "https://diyprefab.com";

const STEEL_ROOFING = "/product-services/wall-roofing-solutions/steel-metal-roofing";

export const KINDS = {
  guide: { key: "guide", label: "Guide", plural: "Guides" },
  briefing: { key: "briefing", label: "Industry briefing", plural: "Briefings" },
};

const posts = [
  /* ------------------------------------------------------------------ 27 Oct: NHAI design checks ------------ */
  {
    "id": "nhai-design-checks",
    "slug": "nhai-independent-design-checking-december-2026",
    "kind": "briefing",
    "title": "NHAI sets December start for independent design checks",
    "seoTitle": "NHAI Design Checks Start December 2026",
    "seoDescription": "NHAI announces independent design checks for critical National Highway structures from 1 December 2026. Read the scope and consultant takeaway.",
    "dek": "The ministry’s 15 October release gives 1 December 2026 as the effective date for independent checking of designs for major bridges and critical National Highway structures. What it covers, and a process lesson for consultants.",
    "publishedAt": "2026-10-27T09:30:00+05:30",
    "sourceLine": "Ministry of Road Transport & Highways / PIB, 15 October 2026",
    "tags": [
      "NHAI",
      "Design review",
      "National Highways",
      "PIB"
    ],
    "cover": "/images/blog/nhai-independent-design-checking.svg",
    "coverAlt": "Editorial diagram showing design submission, independent review, designer response and revised submission.",
    "blocks": [
      {
        "t": "p",
        "text": "NHAI has announced a system for independent checking of designs for major bridges and other critical structures on its National Highway projects. The Ministry of Road Transport and Highways’ release is dated 15 October 2026 and gives 1 December 2026 as the effective date. This is an October briefing on a forthcoming change, not a report that the system is already operating. [Read the ministry’s announcement](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2323906&lang=1&reg=3)."
      },
      {
        "t": "h2",
        "id": "what-it-covers",
        "text": "What the announcement covers"
      },
      {
        "t": "p",
        "text": "The release says checks will be conducted by empanelled IITs, government technical institutions or experienced technical firms. The work includes design calculations, analysis and drawings, plus hydrological and hydraulic studies where applicable."
      },
      {
        "t": "p",
        "text": "For the identified structures, the policy applies to new EPC, HAM and BOT National Highway projects and projects where design verification or proof checking has not begun. Completed checks are generally outside the policy, although additional verification may be undertaken for major bridges and complex or critical special structures."
      },
      {
        "t": "h2",
        "id": "process-lesson",
        "text": "A process lesson for consultants"
      },
      {
        "t": "p",
        "text": "For industrial-building consultants, the editorial takeaway is to make an appointed review’s scope and response process explicit. Identify the documents being reviewed, assign each observation to a responsible designer and preserve the response with the revised submission. A review appointment should state what it covers and which decisions remain with other parties."
      },
      {
        "t": "p",
        "text": "The announcement concerns identified National Highway structures. It does not establish a new blanket requirement for PEB projects, and it supplies no measured evidence of faster approvals or fewer defects. Project teams should check the operative instructions and their contractual requirements before acting."
      },
      {
        "t": "p",
        "text": "Related reading: [Before a PEB retrofit, reconcile the building records](/blog/existing-peb-retrofit-records-observations-evidence)."
      }
    ],
    "sources": [
      {
        "n": 1,
        "title": "Ministry of Road Transport and Highways / PIB: NHAI Introduces Independent Checking of Designs of Major Bridges and Critical National Highway Structures",
        "meta": "15 October 2026, 5:02 PM. Stated policy effective date: 1 December 2026. Accessed 27 October 2026."
      }
    ],
    "sourceNote": "Source announcement 15 October 2026; editorial briefing prepared 27 October 2026. The takeaway above is our own editorial view, not a government statement or a new obligation. Specific thresholds are deliberately omitted; check the release for applicability.",
    "cta": {
      "label": "Discuss your project",
      "to": "/contact-us"
    },
    "next": "existing-peb-retrofit-records-observations-evidence"
  },

  /* ------------------------------------------------------------------ 27 Oct: existing PEB records ------------ */
  {
    "id": "existing-peb-retrofit-records",
    "slug": "existing-peb-retrofit-records-observations-evidence",
    "kind": "guide",
    "title": "Before a PEB retrofit, reconcile the building records",
    "seoTitle": "Existing PEB Retrofit Evidence Checklist",
    "seoDescription": "Prepare an existing PEB for retrofit assessment with a clear register of building records, site observations, proposed changes and unresolved questions.",
    "dek": "A new production line in an existing PEB raises a practical question: does the available information describe the building that stands today? A three-column evidence register helps keep records, observations and open questions apart.",
    "publishedAt": "2026-10-27T09:00:00+05:30",
    "sourceLine": "MBMA retrofit guide (April 2020); IStructE overview (13 November 2025)",
    "tags": [
      "Existing buildings",
      "Retrofit",
      "PEB",
      "Evidence register"
    ],
    "cover": "/images/blog/existing-peb-retrofit-records.svg",
    "coverAlt": "Example retrofit evidence register separating archived drawings, current observations and an unresolved equipment support question.",
    "blocks": [
      {
        "t": "p",
        "text": "A new production line in an existing pre-engineered building (PEB) raises a practical question: does the available information describe the building that stands today? Before equipment layouts become installation commitments, a consultant can help the owner assemble a record of the existing building, past alterations and proposed changes. The useful starting point is a clear account of what is documented, what has been observed and what still needs investigation. If you are planning an [industrial building](/applications/industrial) change, start there."
      },
      {
        "t": "h2",
        "id": "records-vs-observations",
        "text": "Separate records from observations"
      },
      {
        "t": "p",
        "text": "Create a simple evidence register with three columns: record information, current observations and unresolved questions. Give every entry a location and source. An original drawing belongs in the first column; a dated site observation belongs in the second. Neither should silently replace the other."
      },
      {
        "t": "p",
        "text": "Start with available drawings, specifications, calculations and previous alteration records. MBMA’s April 2020 retrofit guide identifies original manufacturer and contractor records as possible sources of building information and stresses professional review of structural modifications. Its metal-building guidance is useful background, not a project-specific assessment or an Indian approval requirement. [Read MBMA’s retrofit guidance](https://www.cfsei.org/assets/docs/faq-monthly/MBMA_2020_Retrofitting.pdf)."
      },
      {
        "t": "h2",
        "id": "describe-the-change",
        "text": "Describe the proposed change precisely"
      },
      {
        "t": "p",
        "text": "Keep the proposal separate from the building history. For each new machine, service or operational change, identify its location, the supplier document and revision, and the information still awaited. Ask the responsible designers which equipment and support information they need. Do not infer an available capacity from unused floor area or from an adjacent building."
      },
      {
        "t": "p",
        "text": "Use clear status labels such as proposed, confirmed by the responsible party, and awaiting assessment. A supplier layout can describe an intended arrangement without establishing that the existing building can accommodate it. The register should make that distinction easy to see."
      },
      {
        "t": "h2",
        "id": "work-through-a-discrepancy",
        "text": "Work through a discrepancy before it reaches site"
      },
      {
        "t": "p",
        "text": "Consider this hypothetical example. An archived drawing lists no suspended services in a particular bay. A dated site note records existing service supports there. A new supplier layout proposes another installation in that bay, but the file contains no assessment connecting the existing alterations with the new proposal."
      },
      {
        "t": "figure",
        "id": "retrofit-register"
      },
      {
        "t": "p",
        "text": "Enter the drawing and observation references, mark the support question as unresolved and route the question to the appointed structural engineer and services designer. Record the information they request and the decision that follows. Do not translate an unanswered query into an installation detail. This example illustrates how to organise a discrepancy; it does not establish whether either arrangement is suitable."
      },
      {
        "t": "h2",
        "id": "agree-the-assessment",
        "text": "Agree what the assessment will deliver"
      },
      {
        "t": "p",
        "text": "Ask the appointed engineer to define the assessment scope, the information needed and the limitations of each output. A records review, site inspection and structural assessment are different activities. The Institution of Structural Engineers’ November 2025 publication overview describes a process spanning desk study, inspection, investigation, assessment and reporting. It supports a staged discussion rather than an assumption that one visual visit answers every question. [See the existing-building verification overview](https://www.istructe.org/resources/guidance/verification-of-existing-building-structures/)."
      },
      {
        "t": "p",
        "text": "For an Indian project, the responsible professionals must establish the applicable requirements and necessary approvals. This article does not prescribe a code, testing method or structural acceptance criterion."
      },
      {
        "t": "h2",
        "id": "close-the-loop",
        "text": "Close the loop for the next alteration"
      },
      {
        "t": "p",
        "text": "Give the evidence register an owner. Keep the final assessed proposal, any conditions, the relevant design documents and the completed-work records connected by reference. If the equipment arrangement changes again, identify which decisions need to return to the designers."
      },
      {
        "t": "p",
        "text": "A useful handover question is: could a future consultant distinguish the original building from each later alteration without reconstructing the history from emails? Preserve the unresolved items as well as the completed decisions, with the responsible person and next action visible."
      },
      {
        "t": "p",
        "text": "Use this workflow to prepare for a competent, project-specific assessment. It is not permission to modify a PEB, a statement of spare capacity or a substitute for engineering advice."
      }
    ],
    "sources": [
      {
        "n": 1,
        "title": "MBMA: Retrofitting/Reinforcing Metal Building Systems",
        "meta": "April 2020; author publication hosted by the Cold-Formed Steel Engineers Institute. Accessed 27 October 2026."
      },
      {
        "n": 2,
        "title": "Institution of Structural Engineers: Verification of existing building structures",
        "meta": "Public publisher overview dated 13 November 2025. The full book was not accessed. Accessed 27 October 2026."
      }
    ],
    "sourceNote": "Overseas guidance is used as general background only, not as Indian law or a project acceptance criterion. The evidence-register workflow and the hypothetical example are our own editorial material, not reported project experience or an engineering verdict. Sources are paraphrased.",
    "cta": {
      "label": "Discuss your project",
      "to": "/contact-us"
    },
    "next": "nhai-independent-design-checking-december-2026"
  },

  /* ------------------------------------------------------------------ 26 Oct: roof drainage ------------ */
  {
    id: "peb-roof-drainage",
    slug: "peb-roof-drainage-coordination-checklist",
    kind: "guide",
    title: "PEB Roof Drainage: Close the Handoff from Gutter to Outfall",
    seoTitle: "PEB Roof Drainage: A Consultant Coordination Checklist",
    seoDescription:
      "Coordinate PEB roof drainage from catchment to outfall. A consultant checklist for downpipe connections, overflow routes, drawing interfaces and handover.",
    dek: "A PEB roof can look finished on the roofing drawing while the route beyond its downpipes is still open. A coordination checklist that follows the water across package boundaries.",
    publishedAt: "2026-10-26T09:00:00+05:30",
    sourceLine: "Lysaght, Australian manufacturer guidance (updated 6 May 2026)",
    tags: ["Roof drainage", "Coordination", "PEB", "Handover"],
    cover: "/images/blog/peb-roof-drainage.svg",
    coverAlt:
      "Side view of a steel-framed building showing a drainage path from the roof zone through a gutter, downpipe and site-drain connection to an outfall, with an overflow route marked.",
    blocks: [
      {
        t: "p",
        text: "A pre-engineered building (PEB) roof may appear complete on the roofing drawing while the route beyond its downpipes remains unresolved. A useful coordination review follows the water across package boundaries: who designs each part, where the connection occurs and which drawing confirms the receiving system?",
      },
      {
        t: "note",
        title: "Scope of this checklist",
        text: "This is a proposed coordination checklist, not a drainage design or construction instruction. The responsible project engineers must determine design rainfall, capacities, structural checks and applicable local requirements. Do not select gutter sizes, pipe sizes or roof slopes from this article. It extends the drainage interfaces already described on our [steel and metal roofing](" + STEEL_ROOFING + ") page.",
      },
      { t: "h2", id: "map-the-path", text: "Map the complete normal drainage path" },
      {
        t: "p",
        text: "Lysaght’s Australian technical guidance identifies rainfall intensity, catchment area, gutter capacity and fall, outlets, downpipes and overflow provisions as connected design considerations. Its Australian compliance references should not be treated as Indian requirements. [1]",
      },
      { t: "figure", id: "drainage-map" },
      {
        t: "p",
        text: "For the project review, label each roof drainage zone and follow its intended route through the gutter and outlet to the downpipe, receiving site drain and eventual outfall. Ask the civil designer to confirm the downstream route rather than stopping the review at the building line. Keep the drawing references together so reviewers can follow the path.",
      },
      { t: "h2", id: "downpipe-connection", text: "Make the downpipe-to-site-drain connection explicit" },
      {
        t: "p",
        text: "Use one interface entry for each connection or clearly defined group. Our suggested fields are:",
      },
      {
        t: "ul",
        items: [
          "Roof zone and downpipe reference, linked to the current roof plan.",
          "Proposed connection location and level, with the common survey datum identified by the designers.",
          "Receiving drainage element and the civil drawing that shows it.",
          "Designers responsible on both sides, plus the party installing the connection.",
          "Open question, agreed resolution and the drawing revisions that record it.",
        ],
      },
      {
        t: "p",
        text: "Ask both the roof-drainage designer and the receiving-system designer to record their coordination confirmation against the same revisions. “Sent to the civil team” is an open handoff, not confirmation. The project’s authorised reviewer decides when the item can close; this record does not certify hydraulic capacity.",
      },
      { t: "h2", id: "overflow-routes", text: "Review overflow routes as a separate question" },
      {
        t: "p",
        text: "Show the intended overflow arrangements on the review material and ask the designers to explain where excess water would be directed. Identify nearby doors, loading areas, electrical equipment and pedestrian routes for their assessment. The purpose is to make the question visible, not to declare a route safe without review.",
      },
      {
        t: "p",
        text: "Where the arrangement could retain water on the roof, ask the structural and drainage designers to resolve the relevant checks together. Keep design limitations with the details; a drawn arrow does not establish hydraulic or structural acceptance.",
      },
      { t: "h2", id: "changed-location", text: "Test the handoff with one changed location" },
      {
        t: "example",
        title: "Illustrative register entry, not a DIYPREFAB project or design detail",
        rows: [
          ["Interface", "Roof zone R1 / downpipe D1 → proposed civil connection SW-01."],
          ["Current evidence", "Roof plan revision C moves D1 clear of a loading door; civil plan revision B retains the old connection."],
          ["Status", "Open. Roof and receiving-system designers must reconcile the location, level and drawing references."],
          ["Closure evidence", "Both designers’ recorded coordination confirmations and the superseding drawing revisions, reviewed under the project’s approval process."],
        ],
      },
      {
        t: "p",
        text: "Do not fill the missing connection with an assumption. Keep the affected interface visible until the responsible reviewers resolve it.",
      },
      { t: "h2", id: "handover", text: "Carry the drainage information into handover" },
      {
        t: "p",
        text: "Ask the designers and suppliers to identify inspection points, cleaning requirements and the arrangements needed for safe maintenance access. At handover, retain the coordinated drainage drawings, relevant product information and the agreed maintenance responsibility. Do not advise occupants to access a roof without suitable professional arrangements.",
      },
      {
        t: "p",
        text: "The aim is a drainage route the team can explain across each interface. This checklist does not certify performance or replace professional design.",
      },
    ],
    sources: [
      {
        n: 1,
        title: "Lysaght: How Should Roof Drainage Be Designed in Australia?",
        meta: "Last updated 6 May 2026. Accessed 26 October 2026.",
      },
    ],
    sourceNote:
      "Australian manufacturer guidance. Context only, not an Indian code, mandatory Indian requirements or a project acceptance criterion.",
    cta: { label: "Discuss the project’s coordination scope", to: "/contact-us" },
    next: "imc-gaya-october-2026-consultant-checks",
  },

  /* ------------------------------------------------------------------ 26 Oct: IMC Gaya --------------- */
  {
    id: "imc-gaya-update",
    slug: "imc-gaya-october-2026-consultant-checks",
    kind: "briefing",
    title: "IMC Gaya’s October 24 Update: What Consultants Should Verify Next",
    seoTitle: "IMC Gaya Update: Consultant Checks After the October Launch",
    seoDescription:
      "PIB’s 24 October 2026 IMC Gaya update reports new MoUs and ongoing infrastructure work. Separate the announcement from plot-level construction readiness.",
    dek: "The official release reports a formal launch, 12 MoUs and trunk infrastructure under construction. A short verification list turns that into something a project team can use.",
    publishedAt: "2026-10-26T09:30:00+05:30",
    sourceLine: "Ministry of Commerce & Industry / PIB, 24 October 2026",
    tags: ["Industrial", "IMC Gaya", "Planning", "PIB"],
    cover: "/images/blog/imc-gaya-update.svg",
    coverAlt:
      "Plan of an industrial cluster with a trunk road, water and power lines, serviced blocks of plots and some plots hatched to show readiness still has to be verified.",
    blocks: [
      { t: "h2", id: "what-it-says", text: "What the official announcement says" },
      {
        t: "p",
        text: "A Ministry of Commerce & Industry release published by PIB on 24 October 2026 reports the formal launch of Bihar Integrated Manufacturing City Gaya Limited (BIMCGL), the implementing agency for the Integrated Manufacturing Cluster at Gaya. The release also reports 12 MoUs covering approximately 300 acres and proposed investment of around ₹4,200 crore. These are announced proposals, not completed investment. [1]",
      },
      {
        t: "p",
        text: "The same release says trunk-infrastructure construction has begun and describes roads, water, wastewater and power infrastructure under development. It does not establish that every individual plot has operational connections or is ready for a particular building project. [1]",
      },
      { t: "figure", id: "status-panel" },
      { t: "h2", id: "consultant-takeaway", text: "Our editorial takeaway for consultants" },
      {
        t: "p",
        text: "For a prospective industrial building, turn the announcement into a short verification list before relying on it in a programme:",
      },
      {
        t: "ul",
        items: [
          "Obtain the specific plot documents and confirm the permissions and project scope with the relevant authority and advisers.",
          "Ask for the applicable access, utility-connection and commissioning information for that plot, including who is responsible for each connection.",
          "Establish what site information the building and civil designers need before developing project-specific solutions.",
          "Keep proposed investment, infrastructure progress and an individual construction appointment as separate facts.",
        ],
      },
      {
        t: "p",
        text: "For PEB teams, this is a useful planning signal, not evidence of an awarded steel-building package, a procurement invitation or a DIYPREFAB project. No plot availability, construction completion date or commercial opportunity is inferred here. If you are planning an [industrial building](/applications/industrial), start from the plot documents and the operating needs.",
      },
    ],
    sources: [
      {
        n: 1,
        title:
          "Ministry of Commerce & Industry / PIB: NICDC Advances Industrial Development in Bihar with Launch of Bihar Integrated Manufacturing City Gaya Limited",
        meta: "24 October 2026, 8:07 PM; release ID 2328067. Accessed 26 October 2026.",
      },
    ],
    sourceNote:
      "Direct official release. It reports announced proposals and infrastructure progress, not completed investments or confirmed plot readiness.",
    cta: { label: "Discuss your project", to: "/contact-us" },
    next: "peb-roof-drainage-coordination-checklist",
  },

  /* ------------------------------------------------------------------ 25 Oct: certificates ------------ */
  {
    id: "steel-material-certificates",
    slug: "steel-material-certificates-receiving-checklist",
    kind: "guide",
    title: "Steel Material Certificates: Keep the Link to the Delivered Steel",
    seoTitle: "Steel Material Certificates: A Practical Receiving Checklist",
    seoDescription:
      "A practical steel receiving checklist for consultants: match material identity, record certificate gaps and preserve the evidence link before fabrication.",
    dek: "A delivery can arrive with a folder of certificates and still leave one question open: which document belongs to the steel in front of the receiving team?",
    publishedAt: "2026-10-25T09:00:00+05:30",
    sourceLine: "Australian Steel Institute, TN017 v1 (March 2024)",
    tags: ["Material certificates", "Receiving", "Traceability", "QA"],
    cover: "/images/blog/steel-material-certificates.svg",
    coverAlt:
      "Two bundles of steel plate. One has a readable tag linked by a dashed line to a row on a certificate; the other has an unreadable tag and no confirmed link.",
    blocks: [
      {
        t: "p",
        text: "A delivery can arrive with a folder of certificates and still leave an important question unanswered: which document belongs to the steel in front of the receiving team? For a PEB project, a useful receiving record should help a reviewer make that connection without relying on someone’s memory.",
      },
      {
        t: "note",
        title: "Scope of this guide",
        text: "This is an original documentation workflow for project teams, not a substitute for engineering acceptance, testing or the project specification. Agree the required identification and traceability level with the responsible engineer before ordering material. The international reference below provides context, not mandatory Indian requirements.",
      },
      { t: "h2", id: "evidence-level", text: "Define the evidence level before delivery" },
      {
        t: "p",
        text: "The Australian Steel Institute’s March 2024 technical note discusses lot, piece-mark and individual-piece traceability in its Australian standards context. Those are different evidence commitments. For an Indian project, the responsible professionals should establish the applicable requirements rather than importing an overseas category by default. [1]",
      },
      {
        t: "p",
        text: "Write the project’s agreed requirement in the purchase and inspection documents. Name who checks records, who can release material, and who resolves a mismatch. A shared folder alone does not answer those questions.",
      },
      { t: "h2", id: "receiving-record", text: "Make one receiving record people can follow" },
      {
        t: "p",
        text: "The following fields are our proposed working template, to adapt to the contract and inspection plan:",
      },
      {
        t: "ul",
        items: [
          "Delivery reference and date, supplier, purchase-order line and receiving location.",
          "Product description, declared grade, section or plate dimensions, and quantity received.",
          "Physical identification observed, with heat or batch reference where applicable.",
          "Certificate filename, issuer, document reference and the specific material entry being checked.",
          "Reviewer, review date, status and any unresolved discrepancy.",
        ],
      },
      { t: "figure", id: "evidence-flow" },
      {
        t: "p",
        text: "Keep observations separate from conclusions. ‘Mark photographed’ is different from ‘document matched’, and neither should automatically mean ‘accepted for fabrication’. Use statuses that the receiving, QA and fabrication teams understand in the same way.",
      },
      { t: "h2", id: "missing-links", text: "Handle missing links visibly" },
      {
        t: "p",
        text: "Consider an illustrative delivery of two plate bundles. One certificate is supplied, but the second bundle’s identification is unreadable. Record exactly that gap; do not assign the first bundle’s identity to the second because their dimensions look similar.",
      },
      {
        t: "p",
        text: "Keep the affected material identifiable under the project’s hold procedure and ask the authorised reviewer for disposition. Preserve the supplier’s clarification and any required follow-up evidence beside the original record. Do not overwrite the first observation with a later corrected answer: the reviewer should be able to see how the issue was resolved.",
      },
      { t: "h2", id: "after-cutting", text: "Plan what happens after cutting" },
      {
        t: "p",
        text: "The same ASI note explains the need to maintain links as steel moves between suppliers, processors and fabricators. The practical question for the team is what happens when a stock item is divided, marked, moved or assembled. [1]",
      },
      {
        t: "p",
        text: "Before the first cut, agree how the required parent-material reference reaches the relevant fabrication record. At handover, try a simple retrieval exercise: can someone outside the receiving team locate the agreed evidence for a selected item and see any unresolved qualification?",
      },
      {
        t: "p",
        text: "A clear, retrievable evidence trail supports review. It does not by itself certify material quality or structural fitness; those decisions remain with the designated professionals and applicable project requirements.",
      },
    ],
    sources: [
      {
        n: 1,
        title: "Australian Steel Institute TN017 v1, Implementing Traceability to AS/NZS 5131",
        meta: "March 2024. Accessed 25 October 2026.",
      },
    ],
    sourceNote:
      "Sources provide international context, not mandatory Indian project requirements. The proposed record fields and the bundle scenario are original editorial guidance.",
    cta: { label: "Discuss your project", to: "/contact-us" },
    next: "october-2026-steel-demand-outlook-peb-context",
  },

  /* ------------------------------------------------------------------ 25 Oct: worldsteel -------------- */
  {
    id: "steel-demand-outlook",
    slug: "october-2026-steel-demand-outlook-peb-context",
    kind: "briefing",
    title: "worldsteel’s October Outlook: Demand Context, Not a PEB Price Forecast",
    seoTitle: "October 2026 Steel Demand Outlook: Context for PEB Projects",
    seoDescription:
      "worldsteel’s October 2026 outlook forecasts growth in Indian steel demand. Here is what that market context can and cannot tell a PEB project team.",
    dek: "worldsteel forecasts Indian steel demand growth of 7.9% in 2026 and 8.0% in 2027. What a dated national forecast can and cannot tell a PEB project team.",
    publishedAt: "2026-10-25T09:30:00+05:30",
    sourceLine: "World Steel Association, Short Range Outlook (12 October 2026)",
    tags: ["Steel market", "Forecast", "Estimating", "worldsteel"],
    cover: "/images/blog/steel-demand-outlook.svg",
    coverAlt:
      "A large steel coil beside a label reading worldsteel Short Range Outlook, released 12 October 2026, forecasts.",
    blocks: [
      { t: "h2", id: "forecast", text: "What the association forecasts" },
      {
        t: "p",
        text: "On 12 October 2026, the World Steel Association released its latest Short Range Outlook. It forecasts Indian steel demand growth of 7.9% in 2026 and 8.0% in 2027. Globally, it expects demand to remain broadly unchanged in 2026 before growing 1.7% in 2027. These are forecasts, not confirmed outcomes. The release says its outlook reflects data available in early September 2026. [1]",
      },
      { t: "figure", id: "forecast-table" },
      { t: "h2", id: "project-team", text: "What a project team should do with it" },
      {
        t: "p",
        text: "For consultants preparing a PEB brief, this is broad market context. It does not establish a project’s steel tonnage, a supplier’s available stock, a fabrication slot or the price of a particular grade and section.",
      },
      {
        t: "p",
        text: "Our editorial takeaway is to keep the market outlook beside, rather than inside, project-specific assumptions. Record when quotations were received and when their validity ends. Verify material availability and delivery commitments directly with the relevant supplier. A national demand-growth forecast should not become an automatic escalation percentage in a client estimate.",
      },
      {
        t: "p",
        text: "Related reading: [Check the material evidence at receiving](/blog/steel-material-certificates-receiving-checklist).",
      },
    ],
    sources: [
      {
        n: 1,
        title: "World Steel Association Short Range Outlook",
        meta: "12 October 2026. Accessed 25 October 2026.",
      },
    ],
    sourceNote:
      "All figures are association forecasts, not outcomes or project prices. Sources are paraphrased.",
    cta: { label: "Discuss your project", to: "/contact-us" },
    next: "steel-material-certificates-receiving-checklist",
  },
];

// Newest first
const sorted = [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const wordCount = (post) =>
  post.blocks.reduce((n, b) => {
    const txt = [b.text, b.title, ...(b.items || []), ...((b.rows || []).flat())].filter(Boolean).join(" ");
    return n + txt.split(/\s+/).length;
  }, post.dek.split(/\s+/).length);

export const getPosts = () => sorted.map((p) => ({ ...p, readMin: Math.max(2, Math.round(wordCount(p) / 200)) }));
export const getPost = (slug) => getPosts().find((p) => p.slug === slug) || null;
export const getPostBySlugOrNull = getPost;
export const absoluteUrl = (path) => `${SITE}${path}`;
