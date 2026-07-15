"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, MoreVertical, Film, Send, X, Trash2, Share2, Flag, Copy } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface VideoReelProps {
  videoUrl?: string;
  title: string;
  demoId?: Id<"demos">;
  likesCount?: number;
  onNextSubject?: () => void;
  onPrevSubject?: () => void;
}

// Extract YouTube Video ID from any watch, short, embed, or share links
function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function VideoReel({ videoUrl, title, demoId, likesCount = 0, onNextSubject, onPrevSubject }: VideoReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  // UI States
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Convex queries & mutations
  const comments = useQuery(api.comments.getByDemo, demoId ? { demoId } : "skip");
  const addComment = useMutation(api.comments.add);
  const deleteComment = useMutation(api.comments.remove);
  const incrementLikes = useMutation(api.demos.incrementLikes);
  const decrementLikes = useMutation(api.demos.decrementLikes);

  const publishedComments = comments?.filter((c: any) => c.published) || [];

  // Swipe detection min distance
  const minSwipeDistance = 50;

  const youtubeId = videoUrl ? extractYoutubeId(videoUrl) : null;
  const isYoutube = youtubeId !== null;

  useEffect(() => {
    setHasError(false);
    if (!videoUrl) {
      setIsPlaying(false);
      return;
    }

    if (isYoutube) {
      setIsPlaying(true);
      return;
    }

    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.load();

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Autoplay was blocked or failed:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [videoUrl, isMuted, isYoutube]);

  const togglePlay = useCallback(() => {
    if (!videoUrl || hasError) return;

    if (isYoutube) {
      if (iframeRef.current?.contentWindow) {
        const command = isPlaying ? "pauseVideo" : "playVideo";
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: command, args: "" }),
          "*"
        );
        setIsPlaying(!isPlaying);
      }
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        }
      }
    }
  }, [videoUrl, hasError, isYoutube, isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYoutube) {
      if (iframeRef.current?.contentWindow) {
        const command = isMuted ? "unMute" : "mute";
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: command, args: "" }),
          "*"
        );
        setIsMuted(!isMuted);
      }
      return;
    }

    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!demoId) return;
    
    try {
      if (hasLiked) {
        await decrementLikes({ id: demoId });
        setHasLiked(false);
      } else {
        await incrementLikes({ id: demoId });
        setHasLiked(true);
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!demoId || !commentText.trim()) return;

    try {
      await addComment({
        demo_id: demoId,
        name: commentName.trim() || "Anonymous",
        text: commentText.trim(),
      });
      setCommentText("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleDeleteComment = async (id: Id<"comments">) => {
    try {
      await deleteComment({ id });
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // User cancelled share or clipboard failed
    }
    setShowMenu(false);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard failed
    }
    setShowMenu(false);
  };

  // Swipe handlers for next/prev subject videos
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && onNextSubject) {
      onNextSubject();
    } else if (isDownSwipe && onPrevSubject) {
      onPrevSubject();
    }
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsPlaying(false);
  };

  const showVideoPlayer = videoUrl && !hasError;
  const displayLikes = likesCount || 0;

  return (
    <div className="w-full flex justify-center">
      <div 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => { if (!showComments && !showMenu) togglePlay(); }}
        className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl select-none group cursor-pointer border border-slate-800"
      >
        {showVideoPlayer ? (
          isYoutube ? (
            <>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                className="absolute inset-0 w-full h-full pointer-events-none border-0"
                allow="autoplay; encrypted-media"
                title="YouTube Walkthrough"
                style={{ border: 0 }}
              />
              <div className="absolute inset-0 z-[5] bg-transparent" />
            </>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              playsInline
              onError={handleVideoError}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-550 border border-slate-900 rounded-3xl">
            <Film className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">No Preview Video Available</p>
            <p className="text-[9px] text-slate-500 mt-1 max-w-[200px]">Vertical video walk-through is not uploaded for this assignment.</p>
          </div>
        )}

        {/* Top Left Badge */}
        <div className="absolute top-4 left-4 z-10 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-widest border border-white/10">
          PREVIEW REEL
        </div>

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {showVideoPlayer && (
            <button 
              onClick={toggleMute} 
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-colors z-20 cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
          {/* Three Dot Menu */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); setShowComments(false); }}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 z-20 cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[10px] font-bold text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5 text-blue-400" />
                  Share
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[10px] font-bold text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-emerald-400" />
                  {copiedLink ? "Copied! ✓" : "Copy Link"}
                </button>
                <div className="h-px bg-white/5" />
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[10px] font-bold text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Flag className="h-3.5 w-3.5 text-amber-400" />
                  Report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Paused Overlay Play Icon */}
        {showVideoPlayer && !isPlaying && !showComments && !showMenu && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 z-10">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white scale-110 shadow-lg">
              <Play className="h-8 w-8 fill-white stroke-none translate-x-[2px]" />
            </div>
          </div>
        )}

        {/* Stats and description bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-12 flex items-end justify-between text-white z-10">
          <div className="space-y-1 max-w-[70%] text-left">
            <h4 className="font-heading font-extrabold text-sm text-white drop-shadow-md leading-snug">
              {title}
            </h4>
            <p className="text-[10px] text-white/80 font-medium drop-shadow-md">
              {isYoutube ? "YouTube Reel" : "Local reel"}
            </p>
          </div>

          {/* Social actions column */}
          <div className="flex flex-col gap-4 items-center pl-2">
            {/* Like Button */}
            <button 
              onClick={handleLike}
              className="flex flex-col items-center gap-1 group/btn cursor-pointer"
            >
              <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                hasLiked ? "bg-red-500 text-white" : "bg-black/45 text-white border border-white/15 hover:bg-black/65"
              }`}>
                <Heart className={`h-4.5 w-4.5 ${hasLiked ? "fill-white stroke-none" : "stroke-white"}`} />
              </div>
              <span className="text-[9px] font-bold text-white/90 drop-shadow-md">{displayLikes}</span>
            </button>

            {/* Comment Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); setShowMenu(false); }}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                showComments ? "bg-blue-500 text-white" : "bg-black/45 text-white border border-white/15 hover:bg-black/65"
              }`}>
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
              <span className="text-[9px] font-bold text-white/90 drop-shadow-md">{publishedComments.length}</span>
            </button>
          </div>
        </div>

        {/* Comments Panel (slides up from bottom) */}
        {showComments && (
          <div
            className="absolute bottom-0 left-0 right-0 z-30 bg-[#0f0f23]/95 backdrop-blur-xl rounded-t-2xl border-t border-white/10 max-h-[65%] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Comments Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 shrink-0">
              <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider">
                Comments ({publishedComments.length})
              </h4>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/60 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {publishedComments.length === 0 ? (
                <div className="text-center py-6">
                  <MessageCircle className="h-6 w-6 text-white/15 mx-auto mb-2" />
                  <p className="text-[10px] text-white/30 font-bold">No comments yet. Be the first!</p>
                </div>
              ) : (
                publishedComments.map((c: any) => (
                  <div key={c._id} className="flex gap-2.5 group/comment">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[9px] font-extrabold uppercase shrink-0">
                      {(c.name || "A")[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-white/80">{c.name}</span>
                        <span className="text-[8px] text-white/25">
                          {new Date(c._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/60 leading-relaxed mt-0.5 break-words">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="shrink-0 px-4 py-3 border-t border-white/5 flex gap-2">
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-20 px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 shrink-0"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 min-w-0 px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] placeholder:text-white/20 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Close menu on outside click */}
        {showMenu && (
          <div className="absolute inset-0 z-[15]" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
        )}
      </div>

      {/* Copied toast */}
      {copiedLink && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-lg">
          Link copied to clipboard! ✓
        </div>
      )}
    </div>
  );
}
