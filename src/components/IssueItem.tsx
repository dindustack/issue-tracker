import React from "react";
import { Link } from "react-router-dom";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { relativeDate } from "../helpers/relativeDate";
import { IIssueItemProps } from "./IssuesList";
import { useUserData } from "../helpers/useUserData";

export const IssueItem: React.FC<IIssueItemProps> = ({
  title, number, assignee, commentCount, createdBy, createdDate, labels, status,
}) => {
  const assigneeUser = useUserData(assignee)
  const createdByUser = useUserData(createdBy)

  return (
    <li>
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed color="red" />
        ) : (
          <GoIssueOpened color="green" />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issues/${number}`}>{title}</Link>
          {React.Children.toArray(
            labels.map((label) => <span className={`label red`}>{label}</span>)
          )}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)} {createdByUser.isSuccess ? `by ${createdByUser.data.name}` : ""}
        </small>
      </div>
      {assignee ? (
        <img 
          src={assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ""} 
          class="assigned-to"  
          alt={`Assigned to ${assigneeUser.isSuccess ? assigneeUser.data.name : "avatar"}`} 
          />) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
};
