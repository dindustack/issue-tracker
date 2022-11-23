import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const addIssue = useMutation((issueBody) =>
    fetch("/api/issues", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(issueBody),
    }).then(res => res.json()),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["issues"], { exact: true });
        queryClient.setQueryData(["issues", data.number.toString()], data);
        navigate(`/issues/${data.number}`)

      },
    }

  );
  return (
    <div className="add-issue">
      <h1>Add Issue</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (addIssue.isLoading) return;
          // @ts-ignore
          addIssue.mutate({
            comment: event.target.comment.value,
            title: event.target.title.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" placeholder="Title" />
        <label htmlFor="comment">Comment</label>
        <textarea placeholder="Comment" id="comment" name="comment" />
        <button type="submit" disabled={addIssue.isLoading}>
          {addIssue.isLoading ? "Adding Issue..." : "Add Issue"}
        </button>
      </form>
    </div>
  );
}
