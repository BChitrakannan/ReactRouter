import { useEffect } from "react";
import { useParams, Route, Link, useRouteMatch } from "react-router-dom";
import Comments from "../components/comments/Comments";
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { getSingleQuote } from "../lib/api";

const QuoteDetail = () => {
  const params = useParams();
  const { quoteID } = params;
  const match = useRouteMatch();
  const {
    sendRequest,
    status,
    data: loadedData,
    error,
  } = useHttp(getSingleQuote, true);

  useEffect(() => {
    console.log("Quote Id is " + quoteID);
    sendRequest(quoteID);
  }, [sendRequest, quoteID]);
  //console.log(match);
  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "error") {
    return <p className="centered">{error}</p>;
  }
  if (!loadedData.text) {
    return <p> No Quote Found</p>;
  }
  return (
    <section>
      <HighlightedQuote text={loadedData.text} author={loadedData.author} />
      <Route path={match.path} exact>
        <div className="centered">
          <Link className="btn--flat" to={`${match.url}/comments`}>
            Load Comments
          </Link>
        </div>
      </Route>
      <Route path={`${match.path}/comments`}>
        <Comments></Comments>
      </Route>
    </section>
  );
};

export default QuoteDetail;
