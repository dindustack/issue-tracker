import React from "react";
import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";

export type IIssueItemProps = {
  title: string;
  number: number;
  assignee: string;
  commentCount: string[];
  createdBy: string;
  createdDate: string;
  labels: string[];
  status: string;
};

export default function IssuesList() {
  const issuesQuery = useQuery(["issues"], () =>
    fetch("/api/issues").then((res) => res.json())
  );

  const data = issuesQuery.data;
  return (
    <div>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <ul className="issues-list">
        

          {React.Children.toArray(
            data.map((issue) => (
              <IssueItem
                title={issue.title}
                number={issue.number}
                assignee={issue.assignee}
                commentCount={issue.comments.length}
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
