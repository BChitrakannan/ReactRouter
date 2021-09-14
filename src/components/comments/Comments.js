import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import useHttp from "../../hooks/use-http";
import { getAllComments } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import CommentsList from "../comments/CommentsList";

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();
  const { quoteID } = params;
  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };
  const { sendRequest, status, data: loadedComment } = useHttp(getAllComments);

  useEffect(() => {
    sendRequest(quoteID);
  }, [quoteID, sendRequest]);

  const addedCommentHandler = useCallback(() => {
    sendRequest(quoteID);
  }, [sendRequest, quoteID]);

  let comments;
  if (status === "pending") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && loadedComment && loadedComment.length > 0) {
    comments = <CommentsList comments={loadedComment}></CommentsList>;
  }

  if (
    status === "completed" &&
    (!loadedComment || loadedComment.length === 0)
  ) {
    comments = <p className="centered"> No comments have been added</p>;
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm
          quoteID={quoteID}
          onAddedComment={addedCommentHandler}
        />
      )}
      {comments}
    </section>
  );
};

export default Comments;
