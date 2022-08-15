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

export default function IssuesList({ labels, status }) {
  const issuesQuery = useQuery(["issues", { labels, status }], () => {
    const statusString = status ? `&status=${status}` : "";
    const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
    return fetch(`/api/issues?${labelsString}${statusString}`).then((res) =>
      res.json()
    );
  });
  const [searchValue, setSearchValue] = React.useState("");

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    () =>
      fetch(`/api/search/issues?q=${searchValue}`).then((res) => res.json()),
    {
      enabled: searchValue.length > 0,
    }
  );


  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSearchValue(event.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(event) => {
            if (event.target.value.length === 0) {
              setSearchValue("");
            }
          }}
        />
      </form>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : searchQuery.fetchStatus === "idle" &&
        searchQuery.isLoading === true ? (
        <ul className="issues-list">
          {React.Children.toArray(
            issuesQuery.data.map((issue) => (
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
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {React.Children.toArray(
                  searchQuery.data.items.map((issue) => (
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
            </>
          )}
        </>
      )}
    </div>
  );
}
