import { useMutation, useQueryClient } from "react-query";
import React from "react";
import { StatusSelect } from "./StatusSelect";
export default function IssueStatus({ status, issueNumber }) {
  const queryClient = useQueryClient();

  const setStatus = useMutation(
    (status) => {
    return  fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      }).then((res) => res.json());
    },
    {
      onMutate: (status) => {
    // @ts-ignore
        const oldStatus = queryClient.getQueryData([
          "issues",
          issueNumber,
        ]).status;
        queryClient.setQueryData(["issues", issueNumber], (data) => ({
    // @ts-ignore

          ...data,
          status,
        }));

        return function rollback() {
          queryClient.setQueryData(["issues", issueNumber], (data) => ({
    // @ts-ignore

            ...data,
            status: oldStatus,
          }));
        };
      },
      onError: (error, variables, rollback) => {
    // @ts-ignore

        rollback();
      },
      onSettled: () => {
        queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
      },
    }
  );
  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          noEmptyOption
          value={status}
          onChange={(event) => setStatus.mutate(event.target.value)}
        />
      </div>
    </div>
  );
}