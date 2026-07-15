import Link from "next/link";
import Image from "next/image";
import "./press-notes-site.css";

const specimens = [
  { no: "01", title: "A school roster", count: "28 certificates", note: "One proud page for every student.", cls: "school" },
  { no: "02", title: "A guest list", count: "146 name badges", note: "Doors open. Everyone belongs.", cls: "event" },
  { no: "03", title: "A client ledger", count: "82 thank-you notes", note: "The follow-up that still feels human.", cls: "studio" },
  { no: "04", title: "A family archive", count: "64 keepsake labels", note: "Small stories, carefully named.", cls: "archive" },
];

const features = [
  { no: "01", tag: "CANVAS / LIVE FIELDS", title: "Build on the page", copy: "Move names, dates, and details where they actually belong. Every field stays visible, editable, and connected to real data.", visual: "canvas" },
  { no: "02", tag: "CSV / XLSX / CLEAN", title: "Let the list organize itself", copy: "Drop in a spreadsheet. Mail Buddy reads the headers, checks the rows, and turns clean columns into ready-to-place fields.", visual: "sheet" },
  { no: "03", tag: "DOCX / PRINT READY", title: "Take the whole run with you", copy: "Review a handful of records, then produce the complete batch as an editable Word document—already arranged and ready for print.", visual: "proof" },
];

export default function Home() {
  return <main className="pn-site">
    <section className="pn-audience" id="specimens">
      <div className="pn-audience-intro"><span className="pn-site-kicker">SPECIMEN INDEX / REAL PEOPLE, REAL PAPER</span><h1>Every list has<br />a story in it.</h1><p>Mail Buddy turns rows and columns into things people can hold onto. Pick a starting point—or make a category of your own.</p><div className="pn-hand-note">names deserve better than copy + paste</div></div>
      <div className="pn-specimen-wall">
        {specimens.map((item) => <article className={`pn-specimen ${item.cls}`} key={item.no}>
          <span className="pn-spec-no">SPEC / {item.no}</span><div className="pn-paper-stack"><i /><i /><div><span>MAIL BUDDY</span><strong>{item.no === "01" ? "MAYA BROOKS" : item.no === "02" ? "JON + PRIYA" : item.no === "03" ? "DEAR NORTH STUDIO" : "SUMMER 2026"}</strong><small>{item.count}</small></div></div><div className="pn-spec-copy"><h2>{item.title}</h2><b>{item.count}</b><p>{item.note}</p></div><span className="pn-pin">{item.no}</span>
        </article>)}
      </div>
      <aside className="pn-audience-note"><span>CURATOR’S NOTE</span><p>The document changes.<br />The feeling stays personal.</p><i /></aside>
    </section>

    <section className="pn-production" id="run">
      <div className="pn-production-head"><span className="pn-site-kicker">PRODUCTION RUN / FROM ONE TO MANY</span><h2>One good page.<br />A whole room of people.</h2><p>Start with the artifact. Connect the names. Let the runner take it from there.</p></div>
      <div className="pn-runner-stage"><div className="pn-runner-halo"><span>146</span><small>FINISHED PIECES</small></div><Image src="/press-notes/mascot-production-runner.png" alt="Production runner carrying personalized labels" width={390} height={540} /><span className="pn-speed-line one" /><span className="pn-speed-line two" /><p>“Looks like a lot.<br />Feels like one click.”</p></div>
      <div className="pn-production-path">
        <article><span>PASS / 01</span><div className="pn-step-icon compose"><i /><i /></div><h3>Compose</h3><p>Make one document worth repeating. Add the live fields where names and details should land.</p><b>ONE MASTER</b></article>
        <article><span>PASS / 02</span><div className="pn-step-icon connect"><i /><i /><i /></div><h3>Connect</h3><p>Bring a CSV or workbook. Preview actual records before anything leaves the studio.</p><b>146 RECORDS</b></article>
        <article><span>PASS / 03</span><div className="pn-step-icon press"><i /><i /><i /><i /></div><h3>Run the press</h3><p>Generate every personalized page and take the complete batch into Word.</p><b>12 PRINT SHEETS</b></article>
      </div>
      <div className="pn-path-line"><span /><span /><span /></div>
    </section>

    <section className="pn-details" id="details">
      <div className="pn-details-head"><span className="pn-site-kicker">OPEN FILE / WHAT MAKES IT WORK</span><h2>Built like a tiny<br />print studio.</h2><p>No mystery controls. No hidden automation. Just a clear page, a clean list, and a visible path from one to many.</p></div>
      <div className="pn-feature-ledger">
        {features.map((item) => <article className="pn-feature" key={item.no}>
          <span className="pn-feature-no">{item.no}</span><div className={`pn-feature-visual ${item.visual}`}>
            {item.visual === "canvas" && <><div className="mini-toolbar"><i>T</i><i>*</i><i>CSV</i></div><div className="mini-page"><span>HELLO, MY NAME IS</span><strong>MAYA</strong><b>LIVE FIELD</b></div><em>DRAG IT HERE -&gt;</em></>}
            {item.visual === "sheet" && <><div className="mini-sheet-head"><span>NAME</span><span>ROLE</span><span>TABLE</span></div>{["Maya Brooks","Jon Bell","Priya Shah"].map((name, i)=><div className="mini-sheet-row" key={name}><b>0{i+1}</b><span>{name}</span><span>{i===0?"Director":i===1?"Design":"Guest"}</span><i>OK</i></div>)}<em>HEADERS BECOME FIELDS</em></>}
            {item.visual === "proof" && <><div className="mini-proof back" /><div className="mini-proof middle" /><div className="mini-proof front"><span>01—12</span><strong>READY<br />FOR PRESS</strong><i>DOCX</i></div><em>ALL 146 / ACCOUNTED FOR</em></>}
          </div><div className="pn-feature-copy"><span>{item.tag}</span><h3>{item.title}</h3><p>{item.copy}</p><Link href="/create">SEE IT IN THE EDITOR <b>-&gt;</b></Link></div>
        </article>)}
      </div>
      <aside className="pn-detail-annotation"><span>NOTHING UP OUR SLEEVE</span><i /><p>Every step stays visible.<br />That’s the whole trick.</p></aside>
    </section>

    <section className="pn-final">
      <div className="pn-final-copy"><span className="pn-site-kicker">FINAL PROOF / YOUR TURN</span><h2>Bring the list.<br />We’ll make it personal.</h2><p>Start with a name tag, certificate, label, or any document that deserves more than a mail merge.</p><div><Link href="/create">CREATE A FIRST RUN <span>-&gt;</span></Link><a href="#specimens">REVIEW THE SPECIMENS</a></div></div>
      <div className="pn-final-art"><div className="pn-final-stamp"><span>PRESS NOTES</span><strong>READY</strong><small>FOR YOUR LIST</small></div><div className="pn-final-burst">*</div><Image src="/press-notes/mascot-production-runner.png" alt="" width={390} height={540} /><div className="pn-final-sheets"><i /><i /><i /></div></div>
    </section>
  </main>;
}
