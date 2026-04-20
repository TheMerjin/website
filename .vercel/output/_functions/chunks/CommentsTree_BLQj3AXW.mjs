import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { s as supabase } from './client-supabase_D77BrgKq.mjs';
/* empty css                          */

function PlusMenu({ onTagSelect }) {
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState(null);
  const [customTag, setCustomTag] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setShowCustomInput(false);
        setCustomTag("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleClick = (option2) => {
    if (option2 === "custom") {
      setShowCustomInput(true);
    } else {
      setOpen(false);
      setOption(option2);
      if (onTagSelect) onTagSelect(option2);
    }
  };
  const handleCustomTagSubmit = (e) => {
    e.preventDefault();
    if (customTag.trim()) {
      setOpen(false);
      setShowCustomInput(false);
      setOption(customTag);
      if (onTagSelect) onTagSelect(customTag.trim());
      setCustomTag("");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "plus-menu-container", style: { display: "flex" }, ref: menuRef, children: [
    /* @__PURE__ */ jsx("button", { className: "plus-button", onClick: () => setOpen(!open), children: "＋" }),
    open && !showCustomInput && /* @__PURE__ */ jsxs("div", { className: "side-menu", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => handleClick("agree"), children: "Agree" }),
      /* @__PURE__ */ jsx("button", { onClick: () => handleClick("disagree"), children: "Disagree" }),
      /* @__PURE__ */ jsx("button", { onClick: () => handleClick("tag"), children: "Tag" }),
      /* @__PURE__ */ jsx("button", { onClick: () => handleClick("custom"), children: "Custom" })
    ] }),
    showCustomInput && /* @__PURE__ */ jsxs("form", { onSubmit: handleCustomTagSubmit, className: "side-menu", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: inputRef,
          type: "text",
          value: customTag,
          onChange: (e) => setCustomTag(e.target.value),
          placeholder: "Custom tag...",
          maxLength: 20
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "submit", children: "Add" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setShowCustomInput(false);
            setCustomTag("");
          },
          children: "×"
        }
      )
    ] }),
    option && /* @__PURE__ */ jsx("div", { className: "selected-option1", children: /* @__PURE__ */ jsxs("h1", { className: "glow", children: [
      "#",
      option
    ] }) })
  ] });
}

function CommentEditor({ slug, parentId = null, onPosted }) {
  const textareaRef = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const handleInput = (e) => {
    const lines = e.target.value.split("\n").length;
    e.target.rows = Math.max(lines + 2, 6);
    setContent(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loginRes = await fetch("/api/auth/logged-in");
    if (!loginRes.ok) {
      alert("Please log in first.");
      setLoading(false);
      return;
    }
    const userRes = await fetch("/api/auth/user-data");
    if (!userRes.ok) {
      alert("Failed to fetch user data.");
      setLoading(false);
      return;
    }
    const { user } = await userRes.json();
    console.log(user.user_metadata.username);
    if (!content.trim()) {
      alert("Comment can't be empty.");
      setLoading(false);
      return;
    }
    const comment = {
      content,
      post_id: slug,
      author_id: user.id,
      parent_id: parentId,
      username: user.user_metadata?.username
    };
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const saveRes = await fetch("/api/auth/post_comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...token && { Authorization: `Bearer ${token}` }
      },
      body: JSON.stringify(comment)
    });
    const saveData = await saveRes.json();
    const comment_id = saveData.data?.id;
    if (comment_id && selectedTag) {
      await fetch("/api/auth/post_tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token && { Authorization: `Bearer ${token}` }
        },
        body: JSON.stringify({
          comment_id,
          tag: selectedTag
        })
      });
    }
    if (saveRes.ok) {
      setContent("");
      setSelectedTag(null);
      if (textareaRef.current) textareaRef.current.rows = 6;
      if (onPosted) onPosted();
    } else {
      const err = await saveRes.json();
      alert("Failed to post comment.");
      console.error(err);
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "comment-box-container", style: {
    maxWidth: 800,
    width: "100%",
    marginLeft: "0rem",
    padding: 0,
    marginBottom: 0,
    border: "1px solid #ffe0c0",
    backgroundColor: "#fcfcfc",
    borderRadius: "0.4em",
    boxShadow: "0 1px 2px #0001",
    marginTop: "0.5rem"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: "0.2rem" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, fontSize: "1rem", color: "#888", marginLeft: "0.5rem" }, children: "Reply" }),
      /* @__PURE__ */ jsx(PlusMenu, { onTagSelect: setSelectedTag })
    ] }),
    /* @__PURE__ */ jsxs("form", { id: "commentForm", className: slug, onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "commentBox",
          name: "content",
          rows: 6,
          placeholder: "Type your reply here...",
          ref: textareaRef,
          value: content,
          onChange: handleInput,
          style: { width: "100%", resize: "none", overflow: "hidden", padding: "0.75rem", fontSize: "0.9rem", boxSizing: "border-box", border: "1px solid #ffe0c0", borderRadius: "0.3em", backgroundColor: "#fcfcfc" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "button-wrapper", style: { display: "flex", justifyContent: "flex-end", marginTop: "-2.25rem", marginRight: "0.5rem", marginBottom: "0.5rem" }, children: /* @__PURE__ */ jsx("button", { id: "submit", type: "submit", className: "custom-button", disabled: loading, style: { fontSize: "0.9rem" }, children: loading ? "Posting..." : "Post" }) })
    ] })
  ] });
}

function ParentCommentEditor({ slug, parentId = null, onPosted }) {
  const textareaRef = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const handleInput = (e) => {
    const lines = e.target.value.split("\n").length;
    e.target.rows = Math.max(lines + 2, 6);
    setContent(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loginRes = await fetch("/api/auth/logged-in");
    if (!loginRes.ok) {
      alert("Please log in first.");
      setLoading(false);
      return;
    }
    const userRes = await fetch("/api/auth/user-data");
    if (!userRes.ok) {
      alert("Failed to fetch user data.");
      setLoading(false);
      return;
    }
    const { user } = await userRes.json();
    console.log(user.user_metadata.username);
    if (!content.trim()) {
      alert("Comment can't be empty.");
      setLoading(false);
      return;
    }
    const comment = {
      content,
      post_id: slug,
      author_id: user.id,
      parent_id: parentId,
      username: user.user_metadata?.username
    };
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const saveRes = await fetch("/api/auth/post_comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...token && { Authorization: `Bearer ${token}` }
      },
      body: JSON.stringify(comment)
    });
    const saveData = await saveRes.json();
    console.log(saveData);
    const comment_id = saveData.data.id;
    console.log(comment_id);
    console.log(selectedTag);
    if (comment_id && selectedTag) {
      await fetch("/api/auth/post_tags", {
        method: "POST",
        // or 'PUT', etc.
        headers: {
          "Content-Type": "application/json",
          ...token && { Authorization: `Bearer ${token}` }
        },
        body: JSON.stringify({
          comment_id,
          tag: selectedTag
        })
      });
    }
    if (saveRes.ok) {
      setContent("");
      if (textareaRef.current) textareaRef.current.rows = 6;
      if (onPosted) onPosted();
    } else {
      const err = await saveRes.json();
      alert("Failed to post comment.");
      console.error(err);
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "comment-box-container", style: {
    maxWidth: 800,
    width: "100%",
    marginLeft: "0rem",
    marginTop: "12px",
    padding: 0,
    marginBottom: 0,
    border: "1px solid #ffe0c0",
    backgroundColor: "#fcfcfc"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1e3, width: "100%", display: "flex" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { marginLeft: "1rem" }, children: "Comments" }),
      /* @__PURE__ */ jsx(PlusMenu, { onTagSelect: setSelectedTag })
    ] }),
    /* @__PURE__ */ jsxs("form", { id: "commentForm", className: slug, onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "commentBox",
          name: "content",
          rows: 6,
          placeholder: "Type your comment here...",
          ref: textareaRef,
          value: content,
          onChange: handleInput
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "button-wrapper", style: { display: "flex", justifyContent: "flex-end", marginTop: "-2.25rem", marginRight: "0.5rem", marginBottom: "0.5rem" }, children: /* @__PURE__ */ jsx("button", { id: "submit", type: "submit", className: "custom-button", disabled: loading, children: loading ? "Posting..." : "Post" }) })
    ] })
  ] });
}

function buildTree(comments) {
  const map = {};
  const roots = [];
  comments.forEach((comment) => {
    map[comment.id] = { ...comment, children: [] };
  });
  comments.forEach((comment) => {
    if (comment.parent_id) {
      map[comment.parent_id]?.children.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });
  return roots;
}
function darken(color, percent) {
  const percent_used = percent / 3;
  let amt = Math.round(255 * percent_used * 0.12);
  let c = 252 - amt;
  return `rgb(${c},${c},${c})`;
}
async function fetchTags(commentId) {
  const res = await fetch(`/api/auth/get_tags?comment_id=${commentId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.tags || [];
}
const starBtnStyle = {
  background: "none",
  border: "none",
  borderRadius: 0,
  color: "#bdbdbd",
  fontSize: "1.1rem",
  padding: "0.05rem 0.18rem",
  cursor: "pointer",
  transition: "color 0.15s, border-color 0.15s, background 0.15s",
  outline: "none",
  fontFamily: "Inter, Helvetica, Arial, sans-serif",
  margin: 0,
  lineHeight: 1.1
};
const plusBtnStyle = {
  background: "none",
  border: "none",
  borderRadius: 0,
  color: "#888",
  fontSize: "1.1rem",
  padding: "0.05rem 0.3rem 0.18rem 0rem",
  cursor: "pointer",
  transition: "color 0.15s, border-color 0.15s, background 0.15s",
  outline: "none",
  fontFamily: "Inter, Helvetica, Arial, sans-serif",
  margin: "1rem 1 1 1rem",
  lineHeight: 1.1,
  fontWeight: 600
};
function CommentsTree({ slug }) {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [collapsed, setCollapsed] = useState({});
  const [tagsMap, setTagsMap] = useState({});
  const [gratitudeMap, setGratitudeMap] = useState({});
  const [ratingsMap, setRatingsMap] = useState({});
  const [userRatingsMap, setUserRatingsMap] = useState({});
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [hoveredComment, setHoveredComment] = useState(null);
  useEffect(() => {
    fetch(`/api/auth/get_comments?post_id=${slug}`).then((res) => res.json()).then((data) => {
      setComments(data.comments || []);
      const gratitudeState = {};
      (data.comments || []).forEach((comment) => {
        gratitudeState[comment.id] = {
          hasGiven: comment.user_has_given_gratitude || false,
          count: comment.gratitude || 0
        };
      });
      setGratitudeMap(gratitudeState);
    });
  }, [slug, refresh]);
  useEffect(() => {
    async function loadTagsAndRatings() {
      const tagsMap2 = {};
      await Promise.all(
        comments.map(async (c) => {
          tagsMap2[c.id] = await fetchTags(c.id);
        })
      );
      setTagsMap(tagsMap2);
      if (comments.length > 0) {
        const commentIds = comments.map((c) => c.id).join(",");
        try {
          const res = await fetch(`/api/auth/get_comment_ratings?comment_ids=${commentIds}`);
          if (res.ok) {
            const data = await res.json();
            setRatingsMap(data.ratings || {});
            setUserRatingsMap(data.userRatings || {});
            setRatingDistribution(data.distribution || {});
          }
        } catch (error) {
          console.error("Error fetching ratings:", error);
        }
      }
    }
    if (comments.length > 0) loadTagsAndRatings();
  }, [comments]);
  const tree = buildTree(comments);
  const handleReply = (id) => setReplyTo(id);
  const handleCancel = () => setReplyTo(null);
  const handlePosted = () => {
    setReplyTo(null);
    setRefresh((r) => r + 1);
  };
  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((r) => r + 1);
    }, 5e3);
    return () => clearInterval(interval);
  }, []);
  const handleGratitudeIncrease = async (commentId) => {
    const currentState = gratitudeMap[commentId] || { count: comments.find((c) => c.id === commentId)?.gratitude || 0 };
    const newCount = 1;
    setGratitudeMap((prev) => ({
      ...prev,
      [commentId]: {
        count: newCount
      }
    }));
    try {
      const response = await fetch("/api/auth/update_comment_gratitude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          comment_id: commentId,
          gratitude_count: newCount
        })
      });
      if (!response.ok) {
        setGratitudeMap((prev) => ({
          ...prev,
          [commentId]: currentState
        }));
        console.error("Failed to update gratitude");
      } else {
        setRefresh((r) => r + 1);
      }
    } catch (error) {
      setGratitudeMap((prev) => ({
        ...prev,
        [commentId]: currentState
      }));
      console.error("Error updating gratitude:", error);
    }
  };
  const handleStarRating = async (commentId, rating) => {
    const currentUserRating = userRatingsMap[commentId] || 0;
    setUserRatingsMap((prev) => ({
      ...prev,
      [commentId]: rating
    }));
    try {
      const response = await fetch("/api/auth/update_comment_rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          comment_id: commentId,
          rating
        })
      });
      if (!response.ok) {
        setUserRatingsMap((prev) => ({
          ...prev,
          [commentId]: currentUserRating
        }));
        console.error("Failed to update rating");
      } else {
        const commentIds = comments.map((c) => c.id).join(",");
        try {
          const res = await fetch(`/api/auth/get_comment_ratings?comment_ids=${commentIds}`);
          if (res.ok) {
            const data = await res.json();
            setRatingsMap(data.ratings || {});
            setRatingDistribution(data.distribution || {});
            setUserRatingsMap((prev) => ({
              ...data.userRatings,
              [commentId]: rating
              // Keep the rating that was just set
            }));
          }
        } catch (error) {
          console.error("Error refreshing ratings:", error);
        }
      }
    } catch (error) {
      setUserRatingsMap((prev) => ({
        ...prev,
        [commentId]: currentUserRating
      }));
      console.error("Error updating rating:", error);
    }
  };
  function renderTree(nodes, level = 0) {
    return nodes.map((node) => /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          marginLeft: 1,
          width: "100%",
          maxWidth: 775 - 14 * level,
          background: darken("#fcfcfc", level),
          border: "1px solid #ffe0c0",
          borderRadius: 0,
          marginTop: 12,
          marginBottom: 12,
          padding: "0.75rem",
          boxShadow: "0 1px 2px #0001"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, fontSize: "0.9rem" }, children: /* @__PURE__ */ jsx("a", { href: `/${node.username}`, style: { color: "inherit", textDecoration: "none" }, children: node.username }) }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: "0.8rem", color: "#888", display: "flex", alignItems: "center", gap: 4 }, children: [
                new Date(node.created_at).toLocaleString().split(",")[0],
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "lw-comment-star-rating",
                    "aria-label": "Rate comment",
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      margin: "0 0 0 0.7rem",
                      gap: "0",
                      fontSize: "1.1rem",
                      verticalAlign: "middle",
                      position: "relative"
                    },
                    onMouseEnter: () => setHoveredComment(node.id),
                    onMouseLeave: () => setHoveredComment(null),
                    children: [
                      [1, 2, 3, 4, 5].map((star) => {
                        const userRating = userRatingsMap[node.id] || 0;
                        const isFilled = star <= userRating;
                        return /* @__PURE__ */ jsx(
                          "button",
                          {
                            className: "comment-star-btn",
                            "aria-label": `${star} star${star > 1 ? "s" : ""}`,
                            style: {
                              ...starBtnStyle,
                              color: isFilled ? "#ffd700" : "#bdbdbd",
                              transition: "color 0.2s ease"
                            },
                            onClick: () => handleStarRating(node.id, star),
                            onMouseEnter: (e) => {
                              e.target.style.color = "#ffd700";
                            },
                            onMouseLeave: (e) => {
                              const currentRating = userRatingsMap[node.id] || 0;
                              e.target.style.color = star <= currentRating ? "#ffd700" : "#bdbdbd";
                            },
                            children: isFilled ? "★" : "☆"
                          },
                          star
                        );
                      }),
                      hoveredComment === node.id && ratingDistribution[node.id] && ratingsMap[node.id]?.count > 0 && /* @__PURE__ */ jsxs("div", { style: {
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        background: "#fff",
                        border: "1px solid #ddd",
                        padding: "0.75rem",
                        fontSize: "0.8rem",
                        fontFamily: "Inter, Helvetica, Arial, sans-serif",
                        color: "#1a1a1a",
                        zIndex: 1e3,
                        minWidth: "220px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        marginTop: "0.5rem"
                      }, children: [
                        /* @__PURE__ */ jsx("div", { style: {
                          fontWeight: 600,
                          marginBottom: "0.75rem",
                          fontSize: "0.9rem",
                          borderBottom: "1px solid #eee",
                          paddingBottom: "0.5rem",
                          color: "#2b6cb0"
                        }, children: "Rating Distribution" }),
                        /* @__PURE__ */ jsx("div", { style: {
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.3rem",
                          marginBottom: "0.5rem"
                        }, children: [5, 4, 3, 2, 1].map((rating) => {
                          const count = ratingDistribution[node.id][rating] || 0;
                          ratingsMap[node.id].count;
                          const maxCount = Math.max(...Object.values(ratingDistribution[node.id] || {}));
                          const barWidth = maxCount > 0 ? count / maxCount * 160 : 0;
                          return /* @__PURE__ */ jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.75rem",
                            height: "1.2rem"
                          }, children: [
                            /* @__PURE__ */ jsx("div", { style: {
                              width: "1.2rem",
                              textAlign: "right",
                              color: "#444",
                              fontWeight: 500,
                              fontSize: "0.8rem",
                              paddingRight: "0.5rem"
                            }, children: rating }),
                            /* @__PURE__ */ jsx("div", { style: {
                              width: "160px",
                              height: "0.8rem",
                              background: `repeating-linear-gradient(
                                90deg,
                                transparent,
                                transparent 19px,
                                #f0f0f0 19px,
                                #f0f0f0 20px
                              )`,
                              border: "1px solid #ddd",
                              position: "relative",
                              borderRadius: "0"
                            }, children: count > 0 && /* @__PURE__ */ jsx("div", { style: {
                              width: `${barWidth}px`,
                              height: "100%",
                              background: "#2b6cb0",
                              transition: "width 0.3s ease"
                            } }) }),
                            /* @__PURE__ */ jsx("div", { style: {
                              minWidth: "1.5rem",
                              textAlign: "left",
                              color: "#666",
                              fontSize: "0.7rem",
                              fontWeight: 500,
                              paddingLeft: "0.5rem"
                            }, children: count })
                          ] }, rating);
                        }) }),
                        /* @__PURE__ */ jsxs("div", { style: {
                          marginTop: "0.75rem",
                          paddingTop: "0.5rem",
                          borderTop: "1px solid #eee",
                          fontSize: "0.75rem",
                          color: "#666",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }, children: [
                          /* @__PURE__ */ jsxs("span", { children: [
                            "Total: ",
                            ratingsMap[node.id].count,
                            " ratings"
                          ] }),
                          /* @__PURE__ */ jsxs("span", { style: { color: "#2b6cb0", fontWeight: 500 }, children: [
                            "Avg: ",
                            ratingsMap[node.id].average
                          ] })
                        ] })
                      ] })
                    ]
                  }
                ),
                ratingsMap[node.id] && ratingsMap[node.id].count > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.8rem", color: "#666", marginLeft: "0.3rem" }, children: [
                  "(",
                  ratingsMap[node.id].average.toFixed(1),
                  ")"
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.2rem", marginLeft: "0.3rem" }, children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "lw-comment-plus-btn",
                      "aria-label": "Toggle gratitude",
                      style: {
                        ...plusBtnStyle,
                        color: gratitudeMap[node.id]?.hasGiven ? "#2b6cb0" : "#888",
                        fontWeight: gratitudeMap[node.id]?.hasGiven ? 700 : 600
                      },
                      onClick: () => handleGratitudeIncrease(node.id),
                      children: "+"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { children: node.gratitude })
                ] })
              ] }),
              tagsMap[node.id] && tagsMap[node.id].length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 4 }, children: tagsMap[node.id].map((tag, i) => /* @__PURE__ */ jsxs("span", { style: { color: "#888", fontSize: "0.9rem", fontWeight: 500 }, children: [
                "#",
                tag
              ] }, i)) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                style: { fontSize: "1rem", background: "none", border: "none", color: "#888", cursor: "pointer" },
                onClick: () => toggleCollapse(node.id),
                "aria-label": collapsed[node.id] ? "Expand" : "Collapse",
                children: collapsed[node.id] ? "[+]" : "[-]"
              }
            )
          ] }),
          !collapsed[node.id] && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { style: { whiteSpace: "pre-wrap", fontSize: "13px", marginBottom: 8 }, children: node.content }),
            /* @__PURE__ */ jsx(
              "button",
              {
                style: { "--bg-color": darken("#fcfcfc", level), fontSize: "0.9rem", padding: "0.5rem 1rem", marginLeft: "0" },
                className: "Replyto",
                onClick: () => handleReply(node.id),
                children: "Reply"
              }
            ),
            replyTo === node.id && /* @__PURE__ */ jsxs("div", { style: { marginTop: 8 }, children: [
              /* @__PURE__ */ jsx(CommentEditor, { slug, parentId: node.id, onPosted: handlePosted }),
              /* @__PURE__ */ jsx("button", { onClick: handleCancel, style: { marginTop: 4, fontSize: "1rem", background: "none", border: "none", color: "#c00", cursor: "pointer" }, children: "Cancel" })
            ] }),
            node.children && node.children.length > 0 && /* @__PURE__ */ jsx("div", { style: { marginTop: 8 }, children: renderTree(node.children, level + 1) })
          ] })
        ]
      },
      node.id
    ));
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(ParentCommentEditor, { slug, parentId: null, onPosted: handlePosted }),
    /* @__PURE__ */ jsx("div", { children: renderTree(tree) })
  ] });
}

export { CommentsTree as C };
