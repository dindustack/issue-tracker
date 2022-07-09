import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import {GoIssueOpened, GoIssueClosed} from "react-icons/go";

type IIssueItemProps = {
  title: string;
  number: number;
  assignee: string;
  commentCount: string;
  createdBy: string;
  createdDate: string;
  labels: string[];
  status: string;
};

const IssueItem: React.FC<IIssueItemProps> = ({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status}) => {
  return (
    <li>
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed color="red" />
        ) : (
          <GoIssueOpened color="green"/>
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issues/${number}`}>{title}</Link>
          {React.Children.toArray(
            labels.map((label) => (
              <span className={`label red`}></span>
            ))
          )}
        </span>
      </div>
    </li>
  );
}

export default function IssuesList() {
  const issuesQuery = useQuery(
    ["issues"],
    () => fetch("/api/issues").then((res) => res.json())


  );

  const data = issuesQuery.data;
  console.log("data", data);
  return (
    <div>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <ul>
          {/* {data.map((issue) => (
          <IssueItem key={issue.id} title={issue.title} number={issue.number} />
        ))} */}

          {React.Children.toArray(
            data.map((issue: IIssueItemProps) => (
              <IssueItem
                title={issue.title}
                number={issue.number}
                assignee={issue.assignee}
                commentCount={issue.commentCount}
                createdBy={issue.createdBy}
                createdDate={issue.createdDate}
                labels={issue.labels}
                status={issue.status}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
}
