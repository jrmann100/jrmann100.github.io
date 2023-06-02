<!--{{title}}-->
<span data-only-print>Jordan Mann</span>
<span data-only-screen>résumé</span>
<!--{{/title}}-->
<!--{{head}}-->
<title>Jordan Mann - Résumé</title>
<style>
  header nav li.resume {
    font-weight: 900;
  }

  h2 {
    background-color: var(--black);
    color: var(--white);
    font-size: 1em;
    width: fit-content;
    padding: 0 0.5em;
    margin-bottom: 0.5em;
  }

  h2 {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* color-adjust: exact; */
    forced-color-adjust: none;
  }

  @media print {
    footer {
      display: none;
    }
  }

  main {
    font-size: 1rem;
  }

  section:not(:last-of-type) {
    margin-bottom: 1rem;
  }

  .date,
  .download {
    float: right;
  }
</style>
<!--{{/head}}-->
<!--{{main}}-->
<section data-only-screen>
  <!-- checkme not better than a link but flashier -->
  <button
    class="buttonsize-small download"
    onclick="window.location.href = 'https://docs.google.com/document/d/1LMeAQejdKMmpCnJWJKiW07LByC2kkj8UoMS4PSEpl68/export?format=pdf'"
  >
    Download a PDF
  </button>
</section>
<section>
  <h2>education</h2>
  <p><b>Dartmouth College</b>, Hanover, NH <span class="date">06/2025</span></p>
  <p>
    <i>Intended Major, Computer Science; Intended Minors: Studio Art, Human Centered Design</i
    ><span class="date">GPA 3.78/4.0</span>
  </p>
  <br />
  <p><b>Redwood High School</b> 4.4 GPA <span class="date">2017 - 2021</span></p>
  <p>
    Relevant Courses: AP Computer Science A (5), AP Calculus BC (5)
    <span class="date">GPA 4.38/4.0</span>
  </p>
  <p>Activities: Art Honor Society Co-President</p>
</section>
<br />
<section>
  <h2>experience</h2>
  <p>
    <i>Software Developer,</i> <b>DALI Lab</b>, Hanover, NH
    <span class="date">01/2022-Present</span>
  </p>
  <ul>
    <li>Debugged front-end on Vitalize (React Native), a healthcare wellness platform</li>
    <li>Prototyped video calling (Agora); consulted on feasibility with team of five</li>
    <li>Restructured build system (Expo on Apple Silicon)</li>
  </ul>
  <br />
  <p>
    <i>Learning Fellow,</i> <b>Dartmouth Department of Computer Science</b>, Hanover, NH
    <span class="date">09/2022-11/2022</span>
  </p>
  <ul>
    <li>Facilitated in-class activities</li>
    <li>Wrote and presented lecture on Git workflow</li>
  </ul>
  <br />
  <p>
    <i>Software Developer</i>, <b>Jordan Mann Software Solutions</b>, Larkspur, CA
    <span class="date">09/2017-Present</span>
  </p>
  <ul>
    <li>
      <a target="_blank" href="https://apps.apple.com/sa/app/dartmouth-directory/id1609884875"
        >Dartmouth Directory</a
      >
      - campus contacts iOS app (SwiftUI)
    </li>
    <li>
      <a target="_blank" href="https://apps.apple.com/us/app/benuse/id1581388010">Benuse</a> -
      Hacker News reader iOS app (SwiftUI)
    </li>
    <li>Dartmouth Menu alternative frontend (Svelte/TypeScript)</li>
    <li>jnet - DevOps stack for web app deployment (Docker Compose, pfSense+HAProxy)</li>
    <li>
      <a target="_blank" href="https://github.com/jrmann100/notifwd">notifwd</a> - macOS
      notification forwarding utility (Python)
    </li>
    <li>
      <a target="blank" href="https://github.com/jrmann100/feed">Feed</a> - Redwood High School LMS
      aggregator (Svelte PWA)
    </li>
    <li>Upwork - Prototyped Passkey authentication system (NodeJS+Express, WebAuthn)</li>
  </ul>
  <br />
  <p>
    <i>Instructor,</i> <b>TinkerTech</b>, Kentfield, CA <span class="date">06/2022-07/2022</span>
  </p>
  <ul>
    <li>Designed/led STEM summer camps for ages 5-12</li>
  </ul>
  <br />
  <p>
    <i>Software Developer,</i> <b>Mann Consulting, LLC</b>, San Francisco, CA
    <span class="date">09/2018-Present</span>
  </p>
  <ul>
    <li>Automated on-off-boarding checklists (Google Sheets)</li>
    <li>VoIP transcription service (AWS, Google Cloud APIs, Digium Switchvox)</li>
    <li>LinkedIn profile screenscraper (JavaScript, AppleScript)</li>
  </ul>
  <br />
  <p>
    <i>Software Developer,</i> <b>ClickTime, Inc.</b>, San Francisco, CA
    <span class="date">06/2021-07/2021</span>
  </p>
  <ul>
    <li>Virtualized legacy macOS for QA compatibility testing (VirtualBox)</li>
  </ul>
</section>
<br />
<section>
  <h2>skills & interests</h2>
  <p>
    Computer: HTML, CSS, JavaScript, WebAuthn (Expert); Python (Flask), TypeScript, NodeJS, Svelte,
    SwiftUI, AWS EC2/Firebase (Intermediate); React, Figma, Docker Compose (Learning)
  </p>
  <p>Eagle Scout (Troop 59, Larkspur, CA)</p>
  <p>Languages: English, Spanish (intermediate)</p>
  <p>Additional Interests: Studio art, Ballet, Arduino/Embedded</p>
</section>
<!--{{/main}}-->
