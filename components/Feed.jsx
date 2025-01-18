"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Loading from "./loading";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => {
        return (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        );
      })}
    </div>
  );
};

const Feed = () => {
  const [searchText, setsearchText] = useState("");
  const [searchTimeOut, setSearchTimeOut] = useState(null);
  const [searchedResult, setSearchedResult] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setLoading(false)
    };
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive matching
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);
    setsearchText(e.target.value);

    // debounce method
    setSearchTimeOut(
      setTimeout(() => {
        setLoading(true);
        const searchResult = filterPrompts(e.target.value);
        setSearchedResult(searchResult);
        setLoading(false);
      }, 500)
    );
  };

  const handleTagClick = (tagname) => {
    setsearchText(tagname);
    const searchResult = filterPrompts(tagname);
    setSearchedResult(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {loading ? (
        <Loading/>
      ) : (
        <>
          {searchText ? (
            <PromptCardList data={searchedResult} handleTagClick={handleTagClick} />
          ) : (
            <PromptCardList data={posts} handleTagClick={handleTagClick} />
          )}
        </>
      )}
    </section>
  );
};

export default Feed;
