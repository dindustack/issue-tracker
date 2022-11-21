import React from "react";
import { Link } from "react-router-dom";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import { StatusSelect } from "../components/StatusSelect";

export default function Issues() {
  const [labels, setLabels] = React.useState([]);
  const [status, setStatus] = React.useState("");

  const toggle = (label) => {
    setLabels((currentLabels) =>
      currentLabels.includes(label)
        ? currentLabels.filter((currentLabel) => currentLabel !== label)
        : currentLabels.concat(label)
    );
  };

  const selectStatus = (event: { target: { value: string } }) => {
    setStatus(event.target.value);
  };

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList status={status} labels={labels} />
        </section>
        <aside>
          <LabelList selected={labels} toggle={toggle} />
          <h3>Status</h3>
          <StatusSelect value={status} onChange={(event) => setStatus(selectStatus)} />

          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
}


