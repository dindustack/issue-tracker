import React from "react";
import { useQuery, useQueryClient } from "react-query";
import fetchWithError from "../helpers/fetchWithError";
import { IssueItem } from "./IssueItem";
import Loader from "./Loader";

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
  const queryClient = useQueryClient()
  const issuesQuery = useQuery(
    ["issues", { labels, status }],
    async ({signal}) => {
      const statusString = status ? `&status=${status}` : "";
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
      const results = await fetchWithError(`/api/issues?${labelsString}${statusString}`, {
        signal
      });

       results.forEach((issue) => {
        queryClient.setQueryData(["issues", issue.number.toString()], issue);
      });

      return results;
    }
  );
  const [searchValue, setSearchValue] = React.useState("");

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    ({signal}) =>
      fetch(`/api/search/issues?q=${searchValue}`, {signal}).then((res) => res.json()),
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
      <h2>Issues List {issuesQuery.fetchStatus === "fetching"? <Loader /> : null}</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : issuesQuery.isError ? (
        <p>{issuesQuery.error}</p>
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
