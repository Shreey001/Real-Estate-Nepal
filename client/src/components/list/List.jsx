import "./list.scss";
import Card from "../card/Card";
import { useState, useCallback } from "react";

function List({ posts, loading = false }) {
  const [savedStates, setSavedStates] = useState({});

  const handleSaveChange = useCallback((postId, isSaved) => {
    setSavedStates((prev) => ({
      ...prev,
      [postId]: isSaved,
    }));
  }, []);

  if (loading) {
    return (
      <div className="list list-loading">
        {[1, 2, 3, 4, 5, 6].map((placeholder) => (
          <div key={placeholder} className="card-placeholder">
            <div className="image-placeholder"></div>
            <div className="content-placeholder">
              <div className="title-placeholder"></div>
              <div className="details-placeholder"></div>
              <div className="price-placeholder"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="list"></div>;
  }

  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item.id}
          item={{
            ...item,
            isSaved:
              savedStates[item.id] !== undefined
                ? savedStates[item.id]
                : item.isSaved,
          }}
          onSaveChange={handleSaveChange}
        />
      ))}
    </div>
  );
}

export default List;
